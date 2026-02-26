import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationType } from './NotificationContext';

// ============================================================================
// CONFIGURATION DES RAPPELS
// ============================================================================

export interface ReminderConfig {
  morning: string;   // "05:30"
  evening: string;   // "18:45"
  friday: string;    // "15:30"
}

export interface ReminderPreferences {
  wirdMorning: boolean;
  wirdEvening: boolean;
  wazifa: boolean;
  hadra: boolean;
  encouragement: boolean;
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
  // SCHEDULING WITH PREFERENCES
  // ============================================================================

  async scheduleAllReminders(config: ReminderConfig, preferences?: ReminderPreferences) {
    await this.cancelAllReminders();
    
    const prefs = preferences || {
      wirdMorning: true,
      wirdEvening: true,
      wazifa: true,
      hadra: true,
      encouragement: true,
    };
    
    if (prefs.wirdMorning || prefs.wirdEvening) {
      await this.scheduleWirdReminders(
        prefs.wirdMorning ? config.morning : null,
        prefs.wirdEvening ? config.evening : null
      );
    }
    
    if (prefs.wazifa) {
      await this.scheduleWazifaReminder();
    }
    
    if (prefs.hadra) {
      await this.scheduleHadraReminder(config.friday);
    }
    
    if (prefs.encouragement) {
      await this.scheduleEncouragementNotifications();
    }
  }

  // ============================================================================
  // WIRD REMINDERS
  // ============================================================================

  async scheduleWirdReminders(morningTime: string | null, eveningTime: string | null) {
    if (morningTime) {
      const [morningHour, morningMin] = morningTime.split(':').map(Number);
      
      // Morning Wird (after Fajr)
      await this.scheduleDailyNotification({
        hour: morningHour,
        minute: morningMin,
        title: 'Morning Wird Reminder 🌅',
        body: 'Time for your morning wird after Fajr prayer.',
        type: 'wird_reminder',
      });
    }
    
    if (eveningTime) {
      const [eveningHour, eveningMin] = eveningTime.split(':').map(Number);
      
      // Evening Wird (before Maghrib)
      await this.scheduleDailyNotification({
        hour: eveningHour,
        minute: eveningMin,
        title: 'Evening Wird Reminder 🌆',
        body: 'Don\'t forget your evening wird.',
        type: 'wird_reminder',
      });
    }
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
      weekday: 6, // Friday (in iOS: 1=Sun, 6=Fri)
      hour,
      minute,
      title: 'Hadra Joumou\'a Reminder 🌙',
      body: 'Join the Friday Hadra gathering Before Maghrib.',
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
      weekday: 4, // Wednesday (in iOS: 1=Sun, 4=Wed)
      hour: 14,
      minute: 0,
      title: randomEncouragement.title,
      body: randomEncouragement.body,
      type: 'encouragement',
    });
  }

  // ============================================================================
  // INDIVIDUAL REMINDER MANAGEMENT
  // ============================================================================

  async scheduleWirdMorningOnly(time: string) {
    const [hour, minute] = time.split(':').map(Number);
    await this.scheduleDailyNotification({
      hour,
      minute,
      title: 'Morning Wird Reminder 🌅',
      body: 'Time for your morning wird after Fajr prayer.',
      type: 'wird_reminder',
    });
  }

  async scheduleWirdEveningOnly(time: string) {
    const [hour, minute] = time.split(':').map(Number);
    await this.scheduleDailyNotification({
      hour,
      minute,
      title: 'Evening Wird Reminder 🌆',
      body: 'Don\'t forget your evening wird.',
      type: 'wird_reminder',
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
    weekday: number; // iOS: 1=Sun, 2=Mon, 6=Fri | Android: 1=Mon, 5=Fri
    hour: number;
    minute: number;
    title: string;
    body: string;
    type: NotificationType;
  }) {
    try {
      // Adjust weekday for platform differences
      const weekday = Platform.OS === 'ios' ? params.weekday : (params.weekday === 6 ? 5 : params.weekday - 1);
      
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
          weekday,
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

  async getScheduledCount(): Promise<number> {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      return scheduled.length;
    } catch (error) {
      console.error('Error getting scheduled count:', error);
      return 0;
    }
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default ReminderService.getInstance();