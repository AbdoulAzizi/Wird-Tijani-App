import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  id:        string;
  type:      NotificationType;
  title:     string;
  message:   string;
  timestamp: number;
  read:      boolean;
  metadata?: {
    practice?: 'wird' | 'wazifa' | 'hadra';
    count?:    number;
    target?:   number;
  };
}

interface NotificationContextValue {
  notifications:        NotificationData[];
  unreadCount:          number;
  addNotification:      (n: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead:           (id: string) => void;
  markAllAsRead:        () => void;
  deleteNotification:   (id: string) => void;
  clearAll:             () => void;
  requestPermissions:   () => Promise<boolean>;
  scheduleReminder:     (type: NotificationType, title: string, body: string, time: Date) => Promise<void>;
  cancelAllScheduled:   () => Promise<void>;
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

// ============================================================================
// PROVIDER
// ============================================================================

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications,      setNotifications]      = useState<NotificationData[]>([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Keep a ref so the received-listener callback always has the latest value
  // without needing to be re-registered every render
  const permRef = useRef(permissionsGranted);
  useEffect(() => { permRef.current = permissionsGranted; }, [permissionsGranted]);

  // ── Load / Save ─────────────────────────────────────────────────────────────

  useEffect(() => {
    loadNotifications();
    requestPermissions();
  }, []);

  useEffect(() => {
    saveNotifications();
  }, [notifications]);

  const loadNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem('notifications');
      if (saved) setNotifications(JSON.parse(saved));
    } catch (e) {
      console.error('Error loading notifications:', e);
    }
  };

  const saveNotifications = async () => {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('Error saving notifications:', e);
    }
  };

  // ── Permissions ──────────────────────────────────────────────────────────────

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status: existing } = await Notifications.getPermissionsAsync();
      let final = existing;

      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        final = status;
      }

      if (final !== 'granted') {
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
    } catch (e) {
      console.error('Error requesting permissions:', e);
      return false;
    }
  };

  // ── In-app notification management ──────────────────────────────────────────

  const addNotification = useCallback((
    notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotif: NotificationData = {
      ...notification,
      id:        Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read:      false,
    };

    setNotifications(prev => [newNotif, ...prev]);

    // Also fire a system notification if permissions allow
    if (permRef.current) {
      Notifications.scheduleNotificationAsync({
        content: {
          title:    notification.title,
          body:     notification.message,
          sound:    true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // immediate
      });
    }
  }, []);

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

  // ── KEY FIX: listen for received system notifications ────────────────────────
  // When expo-notifications delivers a notification (scheduled or push),
  // add it to the in-app list automatically so the bell badge and
  // NotificationsScreen both update.
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body, data } = notification.request.content;

      // Derive the NotificationType from the data payload if present,
      // otherwise fall back to 'info'
      const type: NotificationType =
        (data?.type as NotificationType) ?? 'info';

      const newNotif: NotificationData = {
        id:        notification.request.identifier,
        type,
        title:     title   ?? 'Notification',
        message:   body    ?? '',
        timestamp: Date.now(),
        read:      false,
        metadata:  data?.metadata as NotificationData['metadata'],
      };

      setNotifications(prev => {
        // Avoid duplicates (addNotification already pushed one for immediate triggers)
        if (prev.some(n => n.id === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });
    });

    return () => subscription.remove();
  }, []);

  // ── Also handle tapping a notification (marks it read & navigates) ───────────
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const id = response.notification.request.identifier;
      // Mark the tapped notification as read
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    });

    return () => subscription.remove();
  }, []);

  // ── Scheduled notifications ──────────────────────────────────────────────────

  const scheduleReminder = async (
    type: NotificationType,
    title: string,
    body: string,
    time: Date
  ) => {
    if (!permissionsGranted) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound:    true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data:     { type }, // ← passed back to the received listener above
        },
        trigger: {
          type:    Notifications.SchedulableTriggerInputTypes.DATE,
          date:    time,
          repeats: false,
        } as Notifications.DateTriggerInput,
      });
    } catch (e) {
      console.error('Error scheduling notification:', e);
    }
  };

  const cancelAllScheduled = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {
      console.error('Error canceling notifications:', e);
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────────────

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      requestPermissions,
      scheduleReminder,
      cancelAllScheduled,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const getNotificationIcon = (type: NotificationType): string => {
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

  if (days > 0)    return days    === 1 ? '1 day ago'    : `${days} days ago`;
  if (hours > 0)   return hours   === 1 ? '1 hour ago'   : `${hours} hours ago`;
  if (minutes > 0) return minutes === 1 ? '1 min ago'    : `${minutes} mins ago`;
  return 'Just now';
};