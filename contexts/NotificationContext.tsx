import React, {
  createContext, useContext, useState,
  useEffect, useCallback, useRef
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ============================================================================
// TYPES
// ============================================================================

export type NotificationType =
  | 'wird_reminder'
  | 'wazifa_reminder'
  | 'hadra_reminder'
  | 'completion'
  | 'streak'
  | 'encouragement'
  | 'info';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  metadata?: {
    practice?: 'wird' | 'wazifa' | 'hadra';
    count?: number;
    target?: number;
  };
}

interface NotificationContextValue {
  notifications:      NotificationData[];
  unreadCount:        number;
  timezone:           string;
  addNotification:    (notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead:         (id: string) => void;
  markAllAsRead:      () => void;
  deleteNotification: (id: string) => void;
  clearAll:           () => void;
  requestPermissions: () => Promise<boolean>;
  scheduleReminder:   (type: NotificationType, title: string, body: string, time: Date) => Promise<void>;
  cancelAllScheduled: () => Promise<void>;
}

// ============================================================================
// CONTEXT
// ============================================================================

const NotificationContext = createContext<NotificationContextValue | null>(null);

// ============================================================================
// CONFIGURATION
// ============================================================================

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert:  true,
    shouldPlaySound:  true,
    shouldSetBadge:   true,
    shouldShowBanner: true,
    shouldShowList:   true,
  }),
});

const STORAGE_KEY = 'app_notifications_v2';

// ============================================================================
// TIMEZONE UTILITY
// ============================================================================

/**
 * Returns the device's IANA timezone string (e.g. "Europe/Paris", "America/New_York").
 * Falls back to UTC if the API is unavailable.
 */
export function getDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Format a timestamp in the device's local timezone, e.g. "14:30 · Mon 2 Jun"
 */
export function formatLocalTime(timestamp: number): string {
  try {
    const tz = getDeviceTimezone();
    return new Intl.DateTimeFormat(undefined, {
      timeZone:   tz,
      hour:       '2-digit',
      minute:     '2-digit',
      weekday:    'short',
      day:        'numeric',
      month:      'short',
    }).format(new Date(timestamp));
  } catch {
    return new Date(timestamp).toLocaleString();
  }
}

// ============================================================================
// DEDUP HELPER
// ============================================================================

/** Rolling window (ms) within which two notifications with the same title+type are considered duplicates */
const DEDUP_WINDOW_MS = 3_000;

// ============================================================================
// PROVIDER
// ============================================================================

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const timezone = getDeviceTimezone();

  // ── Guard: don't save until initial load is done ──────────────────────────
  const isLoaded = useRef(false);

  // ── Promise that resolves once persisted data is loaded ───────────────────
  const loadedResolveRef = useRef<() => void>(() => {});
  const loadedPromise = useRef<Promise<void>>(
    new Promise<void>(resolve => {
      loadedResolveRef.current = resolve;
    })
  );

  // ── Recent-notification dedup registry ────────────────────────────────────
  // Maps `type:title` → timestamp of the last time it was added.
  const recentlyAddedRef = useRef<Map<string, number>>(new Map());

  // ============================================================================
  // INIT
  // ============================================================================

  useEffect(() => {
    const init = async () => {
      await loadNotifications();
      await requestPermissions();
    };
    init();
  }, []);

  // ============================================================================
  // SAVE — only after the initial load has completed
  // ============================================================================

  useEffect(() => {
    if (!isLoaded.current) return;
    saveNotifications(notifications);
  }, [notifications]);

  // ============================================================================
  // LOAD
  // ============================================================================

  const loadNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: NotificationData[] = JSON.parse(saved);
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('[NotificationContext] Error loading notifications:', error);
    } finally {
      isLoaded.current = true;
      loadedResolveRef.current();
    }
  };

  const saveNotifications = async (data: NotificationData[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('[NotificationContext] Error saving notifications:', error);
    }
  };

  // ============================================================================
  // PERMISSIONS
  // ============================================================================

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        setPermissionsGranted(false);
        return false;
      }

      setPermissionsGranted(true);

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name:             'default',
          importance:       Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor:       '#059669',
        });
      }

      return true;
    } catch (error) {
      console.error('[NotificationContext] Error requesting permissions:', error);
      return false;
    }
  };

  // ============================================================================
  // NOTIFICATION MANAGEMENT
  // ============================================================================

  const permissionsRef = useRef(permissionsGranted);
  useEffect(() => { permissionsRef.current = permissionsGranted; }, [permissionsGranted]);

  // ── Internal: in-app list ONLY, zero OS push ──────────────────────────────
  //
  // Called by the OS listener when a scheduled reminder fires.
  // The OS already showed the notification in the tray — we just need to
  // mirror it into the in-app list.  Calling scheduleNotificationAsync here
  // would fire a SECOND OS notification → duplicate in the tray.
  //
  const _syncToList = useCallback((
    notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>
  ) => {
    const dedupKey = `${notification.type}:${notification.title}`;
    const lastAdded = recentlyAddedRef.current.get(dedupKey) ?? 0;
    if (Date.now() - lastAdded < DEDUP_WINDOW_MS) return;
    recentlyAddedRef.current.set(dedupKey, Date.now());

    const entry: NotificationData = {
      ...notification,
      id:        `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read:      false,
    };
    loadedPromise.current.then(() => {
      setNotifications(prev => [entry, ...prev]);
    });
  }, []);

  // ── Public: in-app list + immediate OS push ────────────────────────────────
  //
  // For events triggered inside the app (completion, streak, etc.).
  // Marks the OS push with data.inApp = true so the listener skips it
  // and does NOT call _syncToList again (avoiding a second OS push).
  //
  const addNotification = useCallback((
    notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>
  ) => {
    _syncToList(notification);

    if (permissionsRef.current) {
      Notifications.scheduleNotificationAsync({
        content: {
          title:    notification.title,
          body:     notification.message,
          sound:    true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data:     { type: notification.type, inApp: true },
        },
        trigger: null,
      }).catch(err =>
        console.error('[NotificationContext] scheduleNotificationAsync error:', err)
      );
    }
  }, [_syncToList]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // ============================================================================
  // SCHEDULED NOTIFICATIONS
  // ============================================================================

  const scheduleReminder = async (
    type:  NotificationType,
    title: string,
    body:  string,
    time:  Date,
  ) => {
    if (!permissionsRef.current) return;
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound:    true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data:     { type },
          // Note: expo-notifications fires DAILY/WEEKLY triggers in device-local
          // time automatically. For DATE triggers the JS Date is UTC-based so
          // no extra conversion is needed.
        },
        trigger: {
          type:    Notifications.SchedulableTriggerInputTypes.DATE,
          date:    time,
          repeats: false,
        } as Notifications.DateTriggerInput,
      });
    } catch (error) {
      console.error('[NotificationContext] Error scheduling notification:', error);
    }
  };

  const cancelAllScheduled = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('[NotificationContext] Error canceling notifications:', error);
    }
  };

  // ============================================================================
  // COMPUTED
  // ============================================================================

  const unreadCount = notifications.filter(n => !n.read).length;

  // ============================================================================
  // INCOMING PUSH — sync OS-originated notifications into the in-app list
  // ============================================================================

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body, data } = notification.request.content;

      // Notifications fired by addNotification() itself carry inApp: true.
      // The OS echo must be ignored entirely — the list was already updated
      // synchronously and firing addNotification() again would produce a
      // second OS push (= duplicate in the device tray).
      if (data?.inApp) return;

      // Scheduled reminders from ReminderService arrive here.
      // Use _syncToList — NOT addNotification — so we only mirror the item
      // into the in-app list without triggering any new OS notification.
      if (data?.type) {
        _syncToList({
          type:     (data.type as NotificationType) ?? 'info',
          title:    title ?? 'Notification',
          message:  body ?? '',
          metadata: data?.metadata as NotificationData['metadata'],
        });
      }
    });

    return () => subscription.remove();
  }, [_syncToList]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        timezone,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        requestPermissions,
        scheduleReminder,
        cancelAllScheduled,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'completion':      return 'checkmark-circle';
    case 'streak':          return 'flame';
    case 'wird_reminder':
    case 'wazifa_reminder':
    case 'hadra_reminder':  return 'notifications';
    case 'encouragement':   return 'star';
    default:                return 'information-circle';
  }
};

export const getNotificationColor = (type: NotificationType): string => {
  switch (type) {
    case 'completion':      return '#10B981';
    case 'streak':          return '#F59E0B';
    case 'wird_reminder':
    case 'wazifa_reminder':
    case 'hadra_reminder':  return '#3B82F6';
    case 'encouragement':   return '#8B5CF6';
    default:                return '#6B7280';
  }
};

export const formatTimestamp = (timestamp: number): string => {
  const diff    = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);

  if (days > 0)    return days    === 1 ? '1 day ago'  : `${days} days ago`;
  if (hours > 0)   return hours   === 1 ? '1 hr ago'   : `${hours} hrs ago`;
  if (minutes > 0) return minutes === 1 ? '1 min ago'  : `${minutes} min ago`;
  return 'Just now';
};