import * as Notifications from 'expo-notifications';
import { NotificationType } from './Notificationcontext';

// ============================================================================
// CONFIGURATION DES RAPPELS
// ============================================================================

export interface ReminderConfig {
  morning: string;   // "05:30"
  evening: string;   // "18:45"
  friday: string;    // "15:30"
}

// ============================================================================
// SERVICE DE RAPPELS
// ============================================================================

export class ReminderService {
  private static instance: ReminderService;

  private constructor() {}

  static getInstance(): ReminderService {
    if (!ReminderService.instance) {
      ReminderService.instance = new ReminderService();
    }
    return ReminderService.instance;
  }

  // ============================================================================
  // SCHEDULING
  // ============================================================================

  async scheduleAllReminders(config: ReminderConfig) {
    await this.cancelAllReminders();
    
    await this.scheduleWirdReminders(config.morning, config.evening);
    await this.scheduleWazifaReminder();
    await this.scheduleHadraReminder(config.friday);
  }

  // ============================================================================
  // WIRD REMINDERS
  // ============================================================================

  async scheduleWirdReminders(morningTime: string, eveningTime: string) {
    const [morningHour, morningMin] = morningTime.split(':').map(Number);
    const [eveningHour, eveningMin] = eveningTime.split(':').map(Number);

    // Morning Wird (after Fajr)
    await this.scheduleDailyNotification({
      hour: morningHour,
      minute: morningMin,
      title: 'Morning Wird Reminder 🌅',
      body: 'Time for your morning wird after Fajr prayer.',
      type: 'wird_reminder',
    });

    // Evening Wird (before Maghrib)
    await this.scheduleDailyNotification({
      hour: eveningHour,
      minute: eveningMin,
      title: 'Evening Wird Reminder 🌆',
      body: 'Don\'t forget your evening wird before Maghrib.',
      type: 'wird_reminder',
    });
  }

  // ============================================================================
  // WAZIFA REMINDERS
  // ============================================================================

  async scheduleWazifaReminder() {
    // Wazifa after Asr (assuming 15:30)
    await this.scheduleDailyNotification({
      hour: 15,
      minute: 30,
      title: 'Wazīfa Reminder ⭐',
      body: 'Time for your daily wazīfa after Asr prayer.',
      type: 'wazifa_reminder',
    });
  }

  // ============================================================================
  // HADRA REMINDERS
  // ============================================================================

  async scheduleHadraReminder(fridayTime: string) {
    const [hour, minute] = fridayTime.split(':').map(Number);

    // Hadra on Friday after Maghrib
    await this.scheduleWeeklyNotification({
      weekday: 5, // Friday
      hour,
      minute,
      title: 'Hadra Joumou\'a Reminder 🌙',
      body: 'Join the Friday Hadra gathering after Maghrib.',
      type: 'hadra_reminder',
    });
  }

  // ============================================================================
  // ENCOURAGEMENT NOTIFICATIONS
  // ============================================================================

  async scheduleEncouragementNotifications() {
    const encouragements = [
      {
        title: 'Keep Going! 💪',
        body: 'Your spiritual journey is beautiful. May Allah strengthen you.',
      },
      {
        title: 'Remember Allah 🤲',
        body: 'Dhikr brings peace to the heart. Take a moment to remember Allah.',
      },
      {
        title: 'Consistency Matters 📿',
        body: 'Small consistent actions are beloved to Allah.',
      },
    ];

    // Schedule random encouragement (e.g., weekly on Wednesday)
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    
    await this.scheduleWeeklyNotification({
      weekday: 3, // Wednesday
      hour: 14,
      minute: 0,
      title: randomEncouragement.title,
      body: randomEncouragement.body,
      type: 'encouragement',
    });
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private async scheduleDailyNotification(params: {
    hour: number;
    minute: number;
    title: string;
    body: string;
    type: NotificationType;
  }) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: params.title,
          body: params.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { type: params.type },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: params.hour,
          minute: params.minute,
          repeats: true,
        } as Notifications.DailyTriggerInput,
      });
    } catch (error) {
      console.error('Error scheduling daily notification:', error);
    }
  }

  private async scheduleWeeklyNotification(params: {
    weekday: number; // 1 = Monday, 5 = Friday, 7 = Sunday
    hour: number;
    minute: number;
    title: string;
    body: string;
    type: NotificationType;
  }) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: params.title,
          body: params.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { type: params.type },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: params.weekday,
          hour: params.hour,
          minute: params.minute,
          repeats: true,
        } as Notifications.WeeklyTriggerInput,
      });
    } catch (error) {
      console.error('Error scheduling weekly notification:', error);
    }
  }

  async cancelAllReminders() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling reminders:', error);
    }
  }

  // ============================================================================
  // UTILITY
  // ============================================================================

  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default ReminderService.getInstance();