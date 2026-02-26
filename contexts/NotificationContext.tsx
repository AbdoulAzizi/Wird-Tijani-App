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
  notifications: NotificationData[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  requestPermissions: () => Promise<boolean>;
  scheduleReminder: (type: NotificationType, title: string, body: string, time: Date) => Promise<void>;
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
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const STORAGE_KEY = 'app_notifications_v2';

// ============================================================================
// PROVIDER
// ============================================================================

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // ── Guard: don't save until initial load is done ──────────────────────────
  const isLoaded = useRef(false);

  // ============================================================================
  // LOAD — runs once on mount
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
    // Skip the first render / before load completes to avoid overwriting
    // persisted data with an empty array.
    if (!isLoaded.current) return;
    saveNotifications(notifications);
  }, [notifications]);

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
      // Mark as loaded whether we found data or not — safe to save from now on
      isLoaded.current = true;
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
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#059669',
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

  // Use a ref for permissionsGranted so addNotification never has a stale closure
  const permissionsRef = useRef(permissionsGranted);
  useEffect(() => { permissionsRef.current = permissionsGranted; }, [permissionsGranted]);

  const addNotification = useCallback((
    notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotification: NotificationData = {
      ...notification,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Fire a local push notification if permissions are granted
    if (permissionsRef.current) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.message,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // immediate
      }).catch(err =>
        console.error('[NotificationContext] scheduleNotificationAsync error:', err)
      );
    }
  }, []); // stable — reads permissions via ref

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
    type: NotificationType,
    title: string,
    body: string,
    time: Date
  ) => {
    if (!permissionsRef.current) return;
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { type },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: time,
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
  // RENDER
  // ============================================================================

  return (
    <NotificationContext.Provider
      value={{
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
    case 'completion':                                    return 'checkmark-circle';
    case 'streak':                                        return 'flame';
    case 'wird_reminder':
    case 'wazifa_reminder':
    case 'hadra_reminder':                                return 'notifications';
    case 'encouragement':                                 return 'star';
    default:                                              return 'information-circle';
  }
};

export const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'completion':                                    return '#10B981';
    case 'streak':                                        return '#F59E0B';
    case 'wird_reminder':
    case 'wazifa_reminder':
    case 'hadra_reminder':                                return '#3B82F6';
    case 'encouragement':                                 return '#8B5CF6';
    default:                                              return '#6B7280';
  }
};

export const formatTimestamp = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);

  if (days > 0)    return days    === 1 ? '1 day ago'    : `${days} days ago`;
  if (hours > 0)   return hours   === 1 ? '1 hour ago'   : `${hours} hours ago`;
  if (minutes > 0) return minutes === 1 ? '1 min ago'    : `${minutes} mins ago`;
  return 'Just now';
};