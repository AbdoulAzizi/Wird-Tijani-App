import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NotificationsType from 'expo-notifications';

import { NotificationType, getDeviceTimezone } from './NotificationContext';
import { loadNotificationsModule } from '@/utils/notifications.loader';

// ============================================================================
// TYPES
// ============================================================================

export interface ReminderConfig {
  morning:       string;  // "05:30" — Wird morning
  evening:       string;  // "18:45" — Wird evening
  wazifa:        string;  // "15:30" — Wazifa
  friday:        string;  // "15:30" — Hadra
  encouragement: string;  // "14:00" — Weekly encouragement base time
}

export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  morning:       '05:30',
  evening:       '18:45',
  wazifa:        '15:30',
  friday:        '15:30',
  encouragement: '14:00',
};

export interface ReminderPreferences {
  wirdMorning:   boolean;
  wirdEvening:   boolean;
  wazifa:        boolean;
  hadra:         boolean;
  encouragement: boolean;
}

export const DEFAULT_PREFERENCES: ReminderPreferences = {
  wirdMorning:   true,
  wirdEvening:   true,
  wazifa:        true,
  hadra:         true,
  encouragement: true,
};

// Internal key for each schedulable slot
type ReminderKey =
  | 'wird_morning'
  | 'wird_evening'
  | 'wazifa'
  | 'hadra_friday'
  | 'encouragement_0'
  | 'encouragement_1'
  | 'encouragement_2';

// Persisted map: ReminderKey → expo notification identifier string
type ScheduledIdMap = Partial<Record<ReminderKey, string>>;

// ============================================================================
// WEEKDAY CONSTANTS
// expo-notifications convention (iOS & Android):
//   1 = Sunday  2 = Monday  3 = Tuesday  4 = Wednesday
//   5 = Thursday  6 = Friday  7 = Saturday
// ============================================================================

const WEEKDAY = {
  SUNDAY:    1,
  MONDAY:    2,
  TUESDAY:   3,
  WEDNESDAY: 4,
  THURSDAY:  5,
  FRIDAY:    6,
  SATURDAY:  7,
} as const;

// ============================================================================
// ENCOURAGEMENT MESSAGES
// ============================================================================

const ENCOURAGEMENTS: Array<{ title: string; body: string }> = [
  {
    title: 'Keep Going! 💪',
    body:  'Your spiritual journey is beautiful. May Allah strengthen you.',
  },
  {
    title: 'Remember Allah 🤲',
    body:  'Dhikr brings peace to the heart. Take a moment to remember Allah.',
  },
  {
    title: 'Consistency Matters 📿',
    body:  'Small consistent actions are beloved to Allah.',
  },
];

// ============================================================================
// STORAGE KEY
// ============================================================================

const STORAGE_KEY = 'reminder_scheduled_ids_v2';

// ============================================================================
// SERVICE
// ============================================================================

export class ReminderService {
  private static instance: ReminderService;

  // Module chargé dynamiquement — null si env. non supporté
  private Notifications: typeof NotificationsType | null = null;
  private moduleLoaded = false;

  private scheduledIds: ScheduledIdMap = {};
  private loaded    = false;
  private scheduling = false;

  private constructor() {}

  /**
   * Réinitialise le cache interne du module expo-notifications.
   * À appeler après setForceNotificationsEnabled() pour que le service
   * recharge le module avec le nouveau flag.
   */
  resetModuleCache(): void {
    this.Notifications = null;
    this.moduleLoaded  = false;
  }

  static getInstance(): ReminderService {
    if (!ReminderService.instance) {
      ReminderService.instance = new ReminderService();
    }
    return ReminderService.instance;
  }

  // ============================================================================
  // MODULE — chargement unique du module expo-notifications
  // Le warning "non disponible" est émis UNE SEULE FOIS dans loadNotificationsModule
  // ============================================================================

  private async getModule(): Promise<typeof NotificationsType | null> {
    if (!this.moduleLoaded) {
      this.Notifications = await loadNotificationsModule();
      this.moduleLoaded  = true;
    }
    return this.Notifications;
  }

  // ============================================================================
  // TIMEZONE
  // ============================================================================

  getTimezone(): string {
    return getDeviceTimezone();
  }

  // ============================================================================
  // PERMISSIONS
  // ============================================================================

  async isPermissionGranted(): Promise<boolean> {
    const N = await this.getModule();
    if (!N) return false;
    try {
      const { status } = await N.getPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  }

  async ensurePermissions(): Promise<boolean> {
    const N = await this.getModule();
    if (!N) return false;
    try {
      const { status: existing } = await N.getPermissionsAsync();
      if (existing === 'granted') return true;
      const { status } = await N.requestPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  }

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  private async loadIds(): Promise<void> {
    if (this.loaded) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) this.scheduledIds = JSON.parse(raw);
    } catch {
      this.scheduledIds = {};
    } finally {
      this.loaded = true;
    }
  }

  private async saveIds(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.scheduledIds));
    } catch (e) {
      console.error('[ReminderService] Failed to persist scheduled IDs:', e);
    }
  }

  // ============================================================================
  // SCHEDULE ALL
  // ============================================================================

  async scheduleAllReminders(
    config:      ReminderConfig      = DEFAULT_REMINDER_CONFIG,
    preferences: ReminderPreferences = DEFAULT_PREFERENCES,
  ): Promise<void> {
    if (this.scheduling) {
      console.warn('[ReminderService] scheduleAllReminders already in progress — skipping.');
      return;
    }
    this.scheduling = true;

    try {
      const granted = await this.ensurePermissions();
      if (!granted) {
        console.warn('[ReminderService] Permissions not granted — skipping schedule.');
        return;
      }

      console.log(`[ReminderService] Scheduling in timezone: ${this.getTimezone()}`);

      await this.loadIds();
      await this._cancelAllOsNotifications();
      this.scheduledIds = {};

      const tasks: Promise<void>[] = [];

      if (preferences.wirdMorning)   tasks.push(this._scheduleWirdMorning(config.morning));
      if (preferences.wirdEvening)   tasks.push(this._scheduleWirdEvening(config.evening));
      if (preferences.wazifa)        tasks.push(this._scheduleWazifa(config.wazifa));
      if (preferences.hadra)         tasks.push(this._scheduleHadra(config.friday));
      if (preferences.encouragement) tasks.push(this._scheduleEncouragements(config.encouragement));

      await Promise.allSettled(tasks);
      await this.saveIds();
    } finally {
      this.scheduling = false;
    }
  }

  // ============================================================================
  // RESCHEDULE A SINGLE REMINDER
  // ============================================================================

  async rescheduleWirdMorning(newTime: string): Promise<void> {
    await this.loadIds();
    await this._cancelKey('wird_morning');
    await this._scheduleWirdMorning(newTime);
    await this.saveIds();
  }

  async rescheduleWirdEvening(newTime: string): Promise<void> {
    await this.loadIds();
    await this._cancelKey('wird_evening');
    await this._scheduleWirdEvening(newTime);
    await this.saveIds();
  }

  async rescheduleWazifa(newTime: string): Promise<void> {
    await this.loadIds();
    await this._cancelKey('wazifa');
    await this._scheduleWazifa(newTime);
    await this.saveIds();
  }

  async rescheduleHadra(newFridayTime: string): Promise<void> {
    await this.loadIds();
    await this._cancelKey('hadra_friday');
    await this._scheduleHadra(newFridayTime);
    await this.saveIds();
  }

  // ============================================================================
  // ENABLE / DISABLE INDIVIDUAL REMINDERS
  // ============================================================================

  async setReminderEnabled(
    key:     'wird_morning' | 'wird_evening' | 'wazifa' | 'hadra' | 'encouragement',
    enabled: boolean,
    config:  ReminderConfig = DEFAULT_REMINDER_CONFIG,
  ): Promise<void> {
    const granted = await this.isPermissionGranted();
    if (enabled && !granted) {
      console.warn('[ReminderService] Cannot enable reminder — permissions not granted.');
      return;
    }

    await this.loadIds();

    if (enabled) {
      switch (key) {
        case 'wird_morning':  await this._scheduleWirdMorning(config.morning);          break;
        case 'wird_evening':  await this._scheduleWirdEvening(config.evening);          break;
        case 'wazifa':        await this._scheduleWazifa(config.wazifa);                break;
        case 'hadra':         await this._scheduleHadra(config.friday);                 break;
        case 'encouragement': await this._scheduleEncouragements(config.encouragement); break;
      }
    } else {
      switch (key) {
        case 'wird_morning':  await this._cancelKey('wird_morning'); break;
        case 'wird_evening':  await this._cancelKey('wird_evening'); break;
        case 'wazifa':        await this._cancelKey('wazifa');       break;
        case 'hadra':         await this._cancelKey('hadra_friday'); break;
        case 'encouragement':
          await Promise.allSettled([
            this._cancelKey('encouragement_0'),
            this._cancelKey('encouragement_1'),
            this._cancelKey('encouragement_2'),
          ]);
          break;
      }
    }

    await this.saveIds();
  }

  // ============================================================================
  // CANCEL
  // ============================================================================

  async cancelAllReminders(): Promise<void> {
    await this.loadIds();
    await this._cancelAllOsNotifications();
    this.scheduledIds = {};
    await this.saveIds();
  }

  // ============================================================================
  // DEBUG / UTILITY
  // ============================================================================

  async scheduleTestNotification(): Promise<void> {
    const N = await this.getModule();
    if (!N) return;

    const granted = await this.isPermissionGranted();
    if (!granted) {
      console.warn('[ReminderService] Cannot send test — permissions not granted.');
      return;
    }

    await N.scheduleNotificationAsync({
      content: {
        title: '✅ Reminders working!',
        body:  `Notifications set up correctly (${this.getTimezone()}).`,
        sound: true,
        data:  { type: 'info' satisfies NotificationType },
      },
      trigger: null,
    });
  }

  async getStatus(): Promise<{
    permissionsGranted: boolean;
    scheduledCount:     number;
    trackedKeys:        string[];
    activeIds:          ScheduledIdMap;
    timezone:           string;
  }> {
    const N = await this.getModule();
    await this.loadIds();

    if (!N) {
      return {
        permissionsGranted: false,
        scheduledCount:     0,
        trackedKeys:        [],
        activeIds:          {},
        timezone:           this.getTimezone(),
      };
    }

    const [permissionsGranted, all] = await Promise.all([
      this.isPermissionGranted(),
      N.getAllScheduledNotificationsAsync(),
    ]);

    return {
      permissionsGranted,
      scheduledCount: all.length,
      trackedKeys:    Object.keys(this.scheduledIds),
      activeIds:      { ...this.scheduledIds },
      timezone:       this.getTimezone(),
    };
  }

  async getScheduledNotifications(): Promise<NotificationsType.NotificationRequest[]> {
    const N = await this.getModule();
    if (!N) return [];
    try {
      return await N.getAllScheduledNotificationsAsync();
    } catch (e) {
      console.error('[ReminderService] getScheduledNotifications error:', e);
      return [];
    }
  }

  async getScheduledCount(): Promise<number> {
    return (await this.getScheduledNotifications()).length;
  }

  // ============================================================================
  // PRIVATE — individual schedulers
  // ============================================================================

  private async _scheduleWirdMorning(time: string): Promise<void> {
    const [hour, minute] = parseTime(time);
    const id = await this._scheduleDaily({
      hour, minute,
      title: 'Morning Wird Reminder 🌅',
      body:  'Time for your morning wird after Fajr prayer.',
      type:  'wird_reminder',
    });
    if (id) this.scheduledIds['wird_morning'] = id;
  }

  private async _scheduleWirdEvening(time: string): Promise<void> {
    const [hour, minute] = parseTime(time);
    const id = await this._scheduleDaily({
      hour, minute,
      title: 'Evening Wird Reminder 🌆',
      body:  "Don't forget your evening wird.",
      type:  'wird_reminder',
    });
    if (id) this.scheduledIds['wird_evening'] = id;
  }

  private async _scheduleWazifa(time: string): Promise<void> {
    const [hour, minute] = parseTime(time);
    const id = await this._scheduleDaily({
      hour, minute,
      title: 'Wazīfa Reminder ⭐',
      body:  'Time for your daily wazīfa.',
      type:  'wazifa_reminder',
    });
    if (id) this.scheduledIds['wazifa'] = id;
  }

  private async _scheduleHadra(fridayTime: string): Promise<void> {
    const [hour, minute] = parseTime(fridayTime);
    const id = await this._scheduleWeekly({
      weekday: WEEKDAY.FRIDAY,
      hour, minute,
      title: "Hadra Joumou'a Reminder 🌙",
      body:  'Join the Friday Hadra gathering before Maghrib.',
      type:  'hadra_reminder',
    });
    if (id) this.scheduledIds['hadra_friday'] = id;
  }

  private async _scheduleEncouragements(baseTime: string): Promise<void> {
    const [hour, minute] = parseTime(baseTime);
    const weekdays = [WEEKDAY.WEDNESDAY, WEEKDAY.THURSDAY, WEEKDAY.FRIDAY];

    await Promise.allSettled(
      ENCOURAGEMENTS.map(async (msg, i) => {
        const key = `encouragement_${i}` as ReminderKey;
        const id  = await this._scheduleWeekly({
          weekday: weekdays[i],
          hour, minute,
          title: msg.title,
          body:  msg.body,
          type:  'encouragement',
        });
        if (id) this.scheduledIds[key] = id;
      })
    );
  }

  // ── Cancel ALL notifications at the OS level ───────────────────────────────

  private async _cancelAllOsNotifications(): Promise<void> {
    const N = await this.getModule();
    if (!N) return;
    try {
      await N.cancelAllScheduledNotificationsAsync();
    } catch (e) {
      console.error('[ReminderService] _cancelAllOsNotifications error:', e);
    }
  }

  // ── Cancel a single tracked key ────────────────────────────────────────────

  private async _cancelKey(key: ReminderKey): Promise<void> {
    const N  = await this.getModule();
    const id = this.scheduledIds[key];
    if (N && id) {
      try {
        await N.cancelScheduledNotificationAsync(id);
      } catch {
        // Already cancelled or ID expired — safe to ignore
      }
      delete this.scheduledIds[key];
    }
  }

  // ── Core scheduling primitives ─────────────────────────────────────────────

  private async _scheduleDaily(params: {
    hour:   number;
    minute: number;
    title:  string;
    body:   string;
    type:   NotificationType;
  }): Promise<string | null> {
    const N = await this.getModule();
    if (!N) return null;
    try {
      return await N.scheduleNotificationAsync({
        content: {
          title:    params.title,
          body:     params.body,
          sound:    true,
          priority: N.AndroidNotificationPriority.HIGH,
          data:     { type: params.type },
        },
        trigger: {
          type:    N.SchedulableTriggerInputTypes.DAILY,
          hour:    params.hour,
          minute:  params.minute,
          repeats: true,
        } as NotificationsType.DailyTriggerInput,
      });
    } catch (error) {
      console.error('[ReminderService] _scheduleDaily error:', error);
      return null;
    }
  }

  private async _scheduleWeekly(params: {
    weekday: number;
    hour:    number;
    minute:  number;
    title:   string;
    body:    string;
    type:    NotificationType;
  }): Promise<string | null> {
    const N = await this.getModule();
    if (!N) return null;
    try {
      return await N.scheduleNotificationAsync({
        content: {
          title:    params.title,
          body:     params.body,
          sound:    true,
          priority: N.AndroidNotificationPriority.HIGH,
          data:     { type: params.type },
        },
        trigger: {
          type:    N.SchedulableTriggerInputTypes.WEEKLY,
          weekday: params.weekday,
          hour:    params.hour,
          minute:  params.minute,
          repeats: true,
        } as NotificationsType.WeeklyTriggerInput,
      });
    } catch (error) {
      console.error('[ReminderService] _scheduleWeekly error:', error);
      return null;
    }
  }
}

// ============================================================================
// HELPERS
// ============================================================================

function parseTime(time: string): [number, number] {
  const parts = time.split(':').map(Number);
  if (
    parts.length !== 2 ||
    parts.some(isNaN) ||
    parts[0] < 0 || parts[0] > 23 ||
    parts[1] < 0 || parts[1] > 59
  ) {
    throw new Error(
      `[ReminderService] Invalid time format: "${time}". Expected "HH:MM" (00:00 – 23:59).`
    );
  }
  return [parts[0], parts[1]];
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export default ReminderService.getInstance();