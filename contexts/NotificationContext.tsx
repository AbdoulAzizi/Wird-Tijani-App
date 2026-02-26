import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

// ============================================================================
// PROVIDER
// ============================================================================

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // ============================================================================
  // LOAD/SAVE
  // ============================================================================

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
      if (saved) {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveNotifications = async () => {
    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
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
        console.log('Notification permissions not granted');
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
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  // ============================================================================
  // NOTIFICATION MANAGEMENT
  // ============================================================================

  const addNotification = useCallback((
    notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotification: NotificationData = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Afficher une notification locale
    if (permissionsGranted) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.message,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null,
      });
    }
  }, [permissionsGranted]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
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
    if (!permissionsGranted) {
      console.log('Permissions not granted, cannot schedule');
      return;
    }

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
      console.error('Error scheduling notification:', error);
    }
  };

  const cancelAllScheduled = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  };

  // ============================================================================
  // COMPUTED VALUES
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
    case 'completion':
      return 'checkmark-circle';
    case 'streak':
      return 'flame';
    case 'wird_reminder':
    case 'wazifa_reminder':
    case 'hadra_reminder':
      return 'notifications';
    case 'encouragement':
      return 'star';
    default:
      return 'information-circle';
  }
};

export const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'completion':
      return '#10B981';
    case 'streak':
      return '#F59E0B';
    case 'wird_reminder':
    case 'wazifa_reminder':
    case 'hadra_reminder':
      return '#3B82F6';
    case 'encouragement':
      return '#8B5CF6';
    default:
      return '#6B7280';
  }
};

export const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  if (minutes > 0) {
    return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
  }
  return 'Just now';
};