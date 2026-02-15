import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Zap, Flame, Star, Info, Clock, Calendar, Trash2, RefreshCw } from 'lucide-react-native';
import { useNotifications, NotificationType } from '@/contexts/NotificationContext';
import ReminderService from '@/contexts/ReminderService';
import * as Notifications from 'expo-notifications';

export default function NotificationTestScreen() {
  const { 
    notifications, 
    unreadCount, 
    addNotification, 
    markAllAsRead, 
    clearAll,
    requestPermissions 
  } = useNotifications();

  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);

  // ============================================================================
  // PERMISSIONS
  // ============================================================================

  const handleRequestPermissions = async () => {
    const granted = await requestPermissions();
    setPermissionsGranted(granted);
    
    if (granted) {
      Alert.alert(
        'Permissions Granted! ✅',
        'You can now test notifications.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Permissions Denied ❌',
        'Please enable notifications in settings.',
        [{ text: 'OK' }]
      );
    }
  };

  // ============================================================================
  // TEST NOTIFICATIONS INSTANTANÉES
  // ============================================================================

  const testCompletion = () => {
    addNotification({
      type: 'completion',
      title: 'Test: Wird Completed! 🎉',
      message: 'This is a test completion notification.',
      metadata: { practice: 'wird' }
    });
  };

  const testStreak = () => {
    addNotification({
      type: 'streak',
      title: 'Test: 7 Day Streak! 🔥',
      message: 'This is a test streak notification.',
      metadata: { count: 7 }
    });
  };

  const testReminder = () => {
    addNotification({
      type: 'wird_reminder',
      title: 'Test: Morning Wird Reminder 🌅',
      message: 'This is a test reminder notification.',
    });
  };

  const testEncouragement = () => {
    addNotification({
      type: 'encouragement',
      title: 'Test: Keep Going! 💪',
      message: 'This is a test encouragement notification.',
    });
  };

  const testInfo = () => {
    addNotification({
      type: 'info',
      title: 'Test: Information ℹ️',
      message: 'This is a test info notification.',
    });
  };

  // ============================================================================
  // TEST NOTIFICATIONS NATIVES
  // ============================================================================

  const testNativeNotification = async () => {
    if (!permissionsGranted) {
      Alert.alert('Error', 'Please grant permissions first!');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Native Test Notification 📱',
          body: 'This is sent directly via Expo Notifications',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Immediately
      });
      
      Alert.alert('Success', 'Native notification sent!');
    } catch (error) {
      Alert.alert('Error', `Failed to send: ${error}`);
    }
  };

  const testDelayedNotification = async () => {
    if (!permissionsGranted) {
      Alert.alert('Error', 'Please grant permissions first!');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Delayed Test ⏰',
          body: 'This notification was delayed by 10 seconds',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 10,
          repeats: false,
        } as Notifications.TimeIntervalTriggerInput,
      });
      
      Alert.alert(
        'Scheduled! ⏰',
        'Notification will appear in 10 seconds',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', `Failed to schedule: ${error}`);
    }
  };

  // ============================================================================
  // TEST RAPPELS PROGRAMMÉS
  // ============================================================================

  const testScheduleWirdReminders = async () => {
    if (!permissionsGranted) {
      Alert.alert('Error', 'Please grant permissions first!');
      return;
    }

    try {
      await ReminderService.scheduleWirdReminders('06:00', '18:00');
      await updateScheduledCount();
      Alert.alert(
        'Success! ✅',
        'Wird reminders scheduled for 6:00 AM and 6:00 PM daily',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', `Failed: ${error}`);
    }
  };

  const testScheduleWazifaReminder = async () => {
    if (!permissionsGranted) {
      Alert.alert('Error', 'Please grant permissions first!');
      return;
    }

    try {
      await ReminderService.scheduleWazifaReminder();
      await updateScheduledCount();
      Alert.alert(
        'Success! ✅',
        'Wazifa reminder scheduled for 3:30 PM daily',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', `Failed: ${error}`);
    }
  };

  const testScheduleHadraReminder = async () => {
    if (!permissionsGranted) {
      Alert.alert('Error', 'Please grant permissions first!');
      return;
    }

    try {
      await ReminderService.scheduleHadraReminder('19:30');
      await updateScheduledCount();
      Alert.alert(
        'Success! ✅',
        'Hadra reminder scheduled for Fridays at 7:30 PM',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', `Failed: ${error}`);
    }
  };

  const testScheduleAllReminders = async () => {
    if (!permissionsGranted) {
      Alert.alert('Error', 'Please grant permissions first!');
      return;
    }

    try {
      await ReminderService.scheduleAllReminders({
        morning: '06:00',
        evening: '18:00',
        friday: '19:30'
      });
      await ReminderService.scheduleEncouragementNotifications();
      await updateScheduledCount();
      Alert.alert(
        'Success! ✅',
        'All reminders scheduled (Wird, Wazifa, Hadra, Encouragement)',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', `Failed: ${error}`);
    }
  };

  // ============================================================================
  // GESTION DES RAPPELS
  // ============================================================================

  const updateScheduledCount = async () => {
    try {
      const scheduled = await ReminderService.getScheduledNotifications();
      setScheduledCount(scheduled.length);
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
    }
  };

  const viewScheduledNotifications = async () => {
    try {
      const scheduled = await ReminderService.getScheduledNotifications();
      
      if (scheduled.length === 0) {
        Alert.alert('No Scheduled Notifications', 'There are no scheduled notifications.');
        return;
      }

      const list = scheduled.map((notif, index) => {
        const trigger = notif.trigger as any;
        let time = 'Unknown time';
        
        if (trigger.type === 'daily') {
          time = `Daily at ${trigger.hour}:${String(trigger.minute).padStart(2, '0')}`;
        } else if (trigger.type === 'weekly') {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          time = `${days[trigger.weekday]} at ${trigger.hour}:${String(trigger.minute).padStart(2, '0')}`;
        } else if (trigger.type === 'date') {
          time = new Date(trigger.date).toLocaleString();
        }
        
        return `${index + 1}. ${notif.content.title}\n   ${time}`;
      }).join('\n\n');

      Alert.alert(
        `Scheduled Notifications (${scheduled.length})`,
        list,
        [{ text: 'OK' }],
        { cancelable: true }
      );
    } catch (error) {
      Alert.alert('Error', `Failed to get scheduled: ${error}`);
    }
  };

  const cancelAllScheduled = async () => {
    Alert.alert(
      'Cancel All Scheduled?',
      'This will cancel all pending reminder notifications.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: async () => {
            try {
              await ReminderService.cancelAllReminders();
              await updateScheduledCount();
              Alert.alert('Success', 'All scheduled notifications cancelled.');
            } catch (error) {
              Alert.alert('Error', `Failed: ${error}`);
            }
          }
        }
      ]
    );
  };

  // ============================================================================
  // TESTS EN MASSE
  // ============================================================================

  const testMultipleNotifications = () => {
    const types: NotificationType[] = ['completion', 'streak', 'wird_reminder', 'encouragement', 'info'];
    
    types.forEach((type, index) => {
      setTimeout(() => {
        addNotification({
          type,
          title: `Test ${index + 1}: ${type}`,
          message: `This is test notification #${index + 1}`,
          metadata: { count: index + 1 }
        });
      }, index * 500); // 500ms entre chaque
    });

    Alert.alert('Sending...', '5 notifications will appear over 2.5 seconds');
  };

  const testStressTest = () => {
    Alert.alert(
      'Stress Test',
      'Send 20 notifications rapidly?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            for (let i = 0; i < 20; i++) {
              setTimeout(() => {
                addNotification({
                  type: i % 2 === 0 ? 'completion' : 'info',
                  title: `Stress Test #${i + 1}`,
                  message: `Notification ${i + 1} of 20`,
                  metadata: { count: i + 1 }
                });
              }, i * 100);
            }
          }
        }
      ]
    );
  };

  // ============================================================================
  // CLEANUP
  // ============================================================================

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications?',
      'This will delete all notifications from the list.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearAll
        }
      ]
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  React.useEffect(() => {
    updateScheduledCount();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Notification Test Lab</Text>
        <Text style={styles.subtitle}>Test all notification features</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Cards */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusCard, styles.statusCardGreen]}>
            <Bell color="#059669" size={24} />
            <Text style={styles.statusNumber}>{notifications.length}</Text>
            <Text style={styles.statusLabel}>Total</Text>
          </View>

          <View style={[styles.statusCard, styles.statusCardOrange]}>
            <Zap color="#F59E0B" size={24} />
            <Text style={styles.statusNumber}>{unreadCount}</Text>
            <Text style={styles.statusLabel}>Unread</Text>
          </View>

          <View style={[styles.statusCard, styles.statusCardBlue]}>
            <Clock color="#3B82F6" size={24} />
            <Text style={styles.statusNumber}>{scheduledCount}</Text>
            <Text style={styles.statusLabel}>Scheduled</Text>
          </View>
        </View>

        {/* Permissions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Permissions</Text>
          <TouchableOpacity 
            style={[styles.testButton, styles.testButtonPrimary]}
            onPress={handleRequestPermissions}
            activeOpacity={0.7}
          >
            <Text style={styles.testButtonText}>Request Permissions</Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>
            Status: {permissionsGranted ? '✅ Granted' : '❌ Not Granted'}
          </Text>
        </View>

        {/* Instant Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Instant Notifications</Text>
          <Text style={styles.sectionDescription}>
            These add to the notification list immediately
          </Text>

          <TouchableOpacity style={styles.testButton} onPress={testCompletion}>
            <View style={[styles.testButtonIcon, { backgroundColor: '#F0FDF4' }]}>
              <Text style={styles.iconEmoji}>🎉</Text>
            </View>
            <Text style={styles.testButtonLabel}>Test Completion</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testButton} onPress={testStreak}>
            <View style={[styles.testButtonIcon, { backgroundColor: '#FFFBEB' }]}>
              <Text style={styles.iconEmoji}>🔥</Text>
            </View>
            <Text style={styles.testButtonLabel}>Test Streak</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testButton} onPress={testReminder}>
            <View style={[styles.testButtonIcon, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.iconEmoji}>🌅</Text>
            </View>
            <Text style={styles.testButtonLabel}>Test Reminder</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testButton} onPress={testEncouragement}>
            <View style={[styles.testButtonIcon, { backgroundColor: '#F5F3FF' }]}>
              <Text style={styles.iconEmoji}>💪</Text>
            </View>
            <Text style={styles.testButtonLabel}>Test Encouragement</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testButton} onPress={testInfo}>
            <View style={[styles.testButtonIcon, { backgroundColor: '#F3F4F6' }]}>
              <Text style={styles.iconEmoji}>ℹ️</Text>
            </View>
            <Text style={styles.testButtonLabel}>Test Info</Text>
          </TouchableOpacity>
        </View>

        {/* Native Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Native Notifications</Text>
          <Text style={styles.sectionDescription}>
            These show as system notifications
          </Text>

          <TouchableOpacity 
            style={styles.testButton} 
            onPress={testNativeNotification}
            disabled={!permissionsGranted}
          >
            <Bell color={permissionsGranted ? '#059669' : '#9CA3AF'} size={20} />
            <Text style={[
              styles.testButtonLabel,
              !permissionsGranted && styles.testButtonLabelDisabled
            ]}>
              Test Native (Immediate)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.testButton} 
            onPress={testDelayedNotification}
            disabled={!permissionsGranted}
          >
            <Clock color={permissionsGranted ? '#3B82F6' : '#9CA3AF'} size={20} />
            <Text style={[
              styles.testButtonLabel,
              !permissionsGranted && styles.testButtonLabelDisabled
            ]}>
              Test Native (Delayed 10s)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scheduled Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Scheduled Reminders</Text>
          <Text style={styles.sectionDescription}>
            These schedule recurring notifications
          </Text>

          <TouchableOpacity 
            style={styles.testButton} 
            onPress={testScheduleWirdReminders}
            disabled={!permissionsGranted}
          >
            <Calendar color={permissionsGranted ? '#059669' : '#9CA3AF'} size={20} />
            <Text style={[
              styles.testButtonLabel,
              !permissionsGranted && styles.testButtonLabelDisabled
            ]}>
              Schedule Wird (Daily 6AM & 6PM)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.testButton} 
            onPress={testScheduleWazifaReminder}
            disabled={!permissionsGranted}
          >
            <Calendar color={permissionsGranted ? '#EAB308' : '#9CA3AF'} size={20} />
            <Text style={[
              styles.testButtonLabel,
              !permissionsGranted && styles.testButtonLabelDisabled
            ]}>
              Schedule Wazifa (Daily 3:30PM)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.testButton} 
            onPress={testScheduleHadraReminder}
            disabled={!permissionsGranted}
          >
            <Calendar color={permissionsGranted ? '#8B5CF6' : '#9CA3AF'} size={20} />
            <Text style={[
              styles.testButtonLabel,
              !permissionsGranted && styles.testButtonLabelDisabled
            ]}>
              Schedule Hadra (Friday 7:30PM)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.testButton, styles.testButtonPrimary]} 
            onPress={testScheduleAllReminders}
            disabled={!permissionsGranted}
          >
            <Text style={styles.testButtonText}>Schedule All Reminders</Text>
          </TouchableOpacity>
        </View>

        {/* Scheduled Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Scheduled Management</Text>

          <TouchableOpacity 
            style={styles.testButton} 
            onPress={viewScheduledNotifications}
          >
            <RefreshCw color="#3B82F6" size={20} />
            <Text style={styles.testButtonLabel}>View Scheduled ({scheduledCount})</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.testButton, styles.testButtonDanger]} 
            onPress={cancelAllScheduled}
          >
            <Trash2 color="#FFFFFF" size={20} />
            <Text style={styles.testButtonText}>Cancel All Scheduled</Text>
          </TouchableOpacity>
        </View>

        {/* Bulk Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Bulk Tests</Text>
          <Text style={styles.sectionDescription}>
            Test with multiple notifications
          </Text>

          <TouchableOpacity 
            style={styles.testButton} 
            onPress={testMultipleNotifications}
          >
            <Zap color="#F59E0B" size={20} />
            <Text style={styles.testButtonLabel}>Send 5 Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.testButton} 
            onPress={testStressTest}
          >
            <Flame color="#EF4444" size={20} />
            <Text style={styles.testButtonLabel}>Stress Test (20 notifications)</Text>
          </TouchableOpacity>
        </View>

        {/* Cleanup */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧹 Cleanup</Text>

          <TouchableOpacity 
            style={styles.testButton} 
            onPress={markAllAsRead}
          >
            <Bell color="#10B981" size={20} />
            <Text style={styles.testButtonLabel}>Mark All as Read</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.testButton, styles.testButtonDanger]} 
            onPress={handleClearAll}
          >
            <Trash2 color="#FFFFFF" size={20} />
            <Text style={styles.testButtonText}>Clear All Notifications</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statusCardGreen: {
    borderTopWidth: 3,
    borderTopColor: '#059669',
  },
  statusCardOrange: {
    borderTopWidth: 3,
    borderTopColor: '#F59E0B',
  },
  statusCardBlue: {
    borderTopWidth: 3,
    borderTopColor: '#3B82F6',
  },
  statusNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  testButtonPrimary: {
    backgroundColor: '#059669',
    justifyContent: 'center',
    borderColor: '#059669',
  },
  testButtonDanger: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    borderColor: '#EF4444',
  },
  testButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 20,
  },
  testButtonLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  testButtonLabelDisabled: {
    color: '#9CA3AF',
  },
  testButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  helperText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: 24,
  },
});