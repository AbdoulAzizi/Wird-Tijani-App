import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NotificationsType from 'expo-notifications';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';

import { loadNotificationsModule } from '@/utils/notifications.loader';

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
// CONSTANTS
// ============================================================================

const STORAGE_KEY    = 'app_notifications_v2';
const DEDUP_WINDOW_MS = 3_000;

// ============================================================================
// TIMEZONE UTILITIES
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
      timeZone: tz,
      hour:     '2-digit',
      minute:   '2-digit',
      weekday:  'short',
      day:      'numeric',
      month:    'short',
    }).format(new Date(timestamp));
  } catch {
    return new Date(timestamp).toLocaleString();
  }
}

// ============================================================================
// PROVIDER
// ============================================================================

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  // ── Module chargé dynamiquement (null = env. non supporté) ────────────────
  const [Notifications, setNotifications] = useState<typeof NotificationsType | null>(null);

  const [notifications,      setNotifications_]    = useState<NotificationData[]>([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const timezone = getDeviceTimezone();

  // ── Guard : ne pas sauvegarder avant le chargement initial ───────────────
  const isLoaded = useRef(false);

  // ── Promise résolue une fois les données persistées chargées ─────────────
  const loadedResolveRef = useRef<() => void>(() => {});
  const loadedPromise    = useRef<Promise<void>>(
    new Promise<void>(resolve => { loadedResolveRef.current = resolve; })
  );

  // ── Registre de déduplication des notifications récentes ─────────────────
  // Maps `type:title` → timestamp du dernier ajout.
  const recentlyAddedRef = useRef<Map<string, number>>(new Map());

  // ── Ref pour accéder à permissionsGranted dans les callbacks ─────────────
  const permissionsRef = useRef(permissionsGranted);
  useEffect(() => { permissionsRef.current = permissionsGranted; }, [permissionsGranted]);

  // ============================================================================
  // INIT — charger le module, puis les données et les permissions
  // ============================================================================

  useEffect(() => {
    const init = async () => {
      // 1. Import dynamique : warning émis UNE SEULE FOIS ici si env. non supporté
      const module = await loadNotificationsModule();
      setNotifications(module);

      // 2. Initialiser le handler seulement si le module est disponible
      if (module) {
        module.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert:  true,
            shouldPlaySound:  true,
            shouldSetBadge:   true,
            shouldShowBanner: true,
            shouldShowList:   true,
          }),
        });
      }

      // 3. Charger les données persistées et demander les permissions
      await loadNotifications();
      await requestPermissions();
    };

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================================================
  // SAVE — uniquement après le chargement initial
  // ============================================================================

  useEffect(() => {
    if (!isLoaded.current) return;
    saveNotifications(notifications);
  }, [notifications]);

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  const loadNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: NotificationData[] = JSON.parse(saved);
        setNotifications_(parsed);
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
    // Guard unique : si le module n'est pas disponible, on sort proprement
    if (!Notifications) return false;

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

  /**
   * Mise à jour de la liste in-app UNIQUEMENT, sans push OS.
   * Appelée par le listener OS quand une notification planifiée arrive :
   * l'OS l'a déjà affichée dans le tiroir, on la miroir juste dans la liste.
   */
  const _syncToList = useCallback((
    notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>
  ) => {
    const dedupKey  = `${notification.type}:${notification.title}`;
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
      setNotifications_(prev => [entry, ...prev]);
    });
  }, []);

  /**
   * Liste in-app + push OS immédiat.
   * Pour les événements déclenchés depuis l'app (complétion, streak, etc.).
   * Marque la notification avec data.inApp = true pour éviter le doublon
   * dans le listener OS.
   */
  const addNotification = useCallback((
    notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>
  ) => {
    _syncToList(notification);

    // Guard unique : si le module n'est pas disponible, on ne tente pas le push OS
    if (Notifications && permissionsRef.current) {
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
  }, [_syncToList, Notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications_(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications_(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications_(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications_([]);
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
    // Guard unique : si le module n'est pas disponible ou pas de permission, on sort
    if (!Notifications || !permissionsRef.current) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound:    true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data:     { type },
          // Note: expo-notifications fire DAILY/WEEKLY triggers en heure locale
          // automatiquement. Pour DATE, le JS Date est UTC-based, pas de conversion.
        },
        trigger: {
          type:    Notifications.SchedulableTriggerInputTypes.DATE,
          date:    time,
          repeats: false,
        } as NotificationsType.DateTriggerInput,
      });
    } catch (error) {
      console.error('[NotificationContext] Error scheduling notification:', error);
    }
  };

  const cancelAllScheduled = async () => {
    // Guard unique
    if (!Notifications) return;

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('[NotificationContext] Error canceling notifications:', error);
    }
  };

  // ============================================================================
  // LISTENER OS — sync les notifications distantes dans la liste in-app
  // ============================================================================

  useEffect(() => {
    // Guard unique : ne pas attacher le listener si le module n'est pas disponible
    if (!Notifications) return;

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body, data } = notification.request.content;

      // Notifications déclenchées par addNotification() : data.inApp = true.
      // On ignore l'écho OS — la liste a déjà été mise à jour de façon synchrone.
      if (data?.inApp) return;

      // Reminders planifiés via scheduleReminder : on les miroir dans la liste
      // avec _syncToList (et non addNotification) pour éviter un second push OS.
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
  }, [Notifications, _syncToList]);

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