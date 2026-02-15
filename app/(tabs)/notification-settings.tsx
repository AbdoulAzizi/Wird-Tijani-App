import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Clock, Volume2, Vibrate, Moon, Sun, Star, Calendar, Save, RotateCcw } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { useNotifications } from '@/contexts/NotificationContext';
import ReminderService from '@/contexts/ReminderService';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimePickerState {
  show: boolean;
  mode: 'time';
  value: Date;
  key: 'morning' | 'evening' | 'friday';
}

export default function NotificationSettingsScreen() {
  const { state, dispatch } = useApp();
  const { requestPermissions } = useNotifications();
  const { darkMode } = state.settings;

  // États locaux pour les modifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(state.settings.notificationsEnabled);
  const [soundEnabled, setSoundEnabled] = useState(state.settings.audioEnabled);
  
  // Rappels individuels
  const [wirdMorningEnabled, setWirdMorningEnabled] = useState(true);
  const [wirdEveningEnabled, setWirdEveningEnabled] = useState(true);
  const [wazifaEnabled, setWazifaEnabled] = useState(true);
  const [hadraEnabled, setHadraEnabled] = useState(true);
  const [encouragementEnabled, setEncouragementEnabled] = useState(true);
  
  // Horaires
  const [morningTime, setMorningTime] = useState(state.settings.reminderTimes.morning);
  const [eveningTime, setEveningTime] = useState(state.settings.reminderTimes.evening);
  const [fridayTime, setFridayTime] = useState(state.settings.reminderTimes.friday);
  
  // Time picker
  const [timePicker, setTimePicker] = useState<TimePickerState>({
    show: false,
    mode: 'time',
    value: new Date(),
    key: 'morning'
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ============================================================================
  // LOAD SAVED SETTINGS
  // ============================================================================

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // Les settings sont déjà dans state.settings
    // On peut charger d'autres paramètres depuis AsyncStorage si nécessaire
  };

  // ============================================================================
  // DETECT CHANGES
  // ============================================================================

  useEffect(() => {
    const changed = 
      notificationsEnabled !== state.settings.notificationsEnabled ||
      soundEnabled !== state.settings.audioEnabled ||
      morningTime !== state.settings.reminderTimes.morning ||
      eveningTime !== state.settings.reminderTimes.evening ||
      fridayTime !== state.settings.reminderTimes.friday;
    
    setHasChanges(changed);
  }, [notificationsEnabled, soundEnabled, morningTime, eveningTime, fridayTime]);

  // ============================================================================
  // TIME PICKER HANDLERS
  // ============================================================================

  const showTimePicker = (key: 'morning' | 'evening' | 'friday') => {
    const timeMap = {
      morning: morningTime,
      evening: eveningTime,
      friday: fridayTime
    };
    
    const [hours, minutes] = timeMap[key].split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    
    setTimePicker({
      show: true,
      mode: 'time',
      value: date,
      key
    });
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setTimePicker(prev => ({ ...prev, show: false }));
    }
    
    if (selectedDate && event.type !== 'dismissed') {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      switch (timePicker.key) {
        case 'morning':
          setMorningTime(timeString);
          break;
        case 'evening':
          setEveningTime(timeString);
          break;
        case 'friday':
          setFridayTime(timeString);
          break;
      }
    }
  };

  const dismissTimePicker = () => {
    setTimePicker(prev => ({ ...prev, show: false }));
  };

  // ============================================================================
  // SAVE SETTINGS
  // ============================================================================

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Sauvegarder dans AppContext
      dispatch({
        type: 'UPDATE_SETTINGS',
        settings: {
          notificationsEnabled,
          audioEnabled: soundEnabled,
        }
      });
      
      dispatch({
        type: 'UPDATE_REMINDER_TIME',
        reminderType: 'morning',
        time: morningTime
      });
      
      dispatch({
        type: 'UPDATE_REMINDER_TIME',
        reminderType: 'evening',
        time: eveningTime
      });
      
      dispatch({
        type: 'UPDATE_REMINDER_TIME',
        reminderType: 'friday',
        time: fridayTime
      });

      // Si notifications activées, programmer les rappels
      if (notificationsEnabled) {
        // Annuler tous les rappels existants
        await ReminderService.cancelAllReminders();
        
        // Reprogrammer selon les préférences
        if (wirdMorningEnabled || wirdEveningEnabled) {
          await ReminderService.scheduleWirdReminders(
            wirdMorningEnabled ? morningTime : '00:00',
            wirdEveningEnabled ? eveningTime : '00:00'
          );
        }
        
        if (wazifaEnabled) {
          await ReminderService.scheduleWazifaReminder();
        }
        
        if (hadraEnabled) {
          await ReminderService.scheduleHadraReminder(fridayTime);
        }
        
        if (encouragementEnabled) {
          await ReminderService.scheduleEncouragementNotifications();
        }
        
        Alert.alert(
          'Settings Saved! ✅',
          'Your notification preferences have been updated and reminders scheduled.',
          [{ text: 'OK' }]
        );
      } else {
        // Si désactivées, annuler tous les rappels
        await ReminderService.cancelAllReminders();
        
        Alert.alert(
          'Settings Saved! ✅',
          'Notifications have been disabled. All scheduled reminders cancelled.',
          [{ text: 'OK' }]
        );
      }
      
      setHasChanges(false);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to save settings. Please try again.',
        [{ text: 'OK' }]
      );
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // RESET TO DEFAULTS
  // ============================================================================

  const handleReset = () => {
    Alert.alert(
      'Reset to Defaults?',
      'This will reset all notification settings to their default values.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setNotificationsEnabled(true);
            setSoundEnabled(true);
            setWirdMorningEnabled(true);
            setWirdEveningEnabled(true);
            setWazifaEnabled(true);
            setHadraEnabled(true);
            setEncouragementEnabled(true);
            setMorningTime('05:30');
            setEveningTime('18:45');
            setFridayTime('19:30');
          }
        }
      ]
    );
  };

  // ============================================================================
  // REQUEST PERMISSIONS
  // ============================================================================

  const handleRequestPermissions = async () => {
    const granted = await requestPermissions();
    
    if (granted) {
      Alert.alert(
        'Permissions Granted! ✅',
        'You can now receive notifications.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Permissions Required',
        'Please enable notifications in your device settings to receive reminders.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => {
            // TODO: Ouvrir les paramètres système
          }}
        ]
      );
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      {/* Header */}
      <View style={[styles.header, darkMode && styles.headerDark]}>
        <Text style={[styles.title, darkMode && styles.titleDark]}>
          Notification Settings
        </Text>
        <Text style={[styles.subtitle, darkMode && styles.subtitleDark]}>
          Customize your reminders and alerts
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Master Toggle */}
        <View style={[styles.section, styles.masterSection, darkMode && styles.sectionDark]}>
          <View style={styles.masterContent}>
            <View style={styles.masterIcon}>
              <Bell color={notificationsEnabled ? '#059669' : '#9CA3AF'} size={28} />
            </View>
            <View style={styles.masterTextContainer}>
              <Text style={[styles.masterTitle, darkMode && styles.masterTitleDark]}>
                Enable Notifications
              </Text>
              <Text style={[styles.masterDescription, darkMode && styles.masterDescriptionDark]}>
                {notificationsEnabled ? 'Notifications are enabled' : 'Notifications are disabled'}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
              thumbColor={notificationsEnabled ? '#059669' : '#F3F4F6'}
              ios_backgroundColor="#E5E7EB"
            />
          </View>
        </View>

        {/* Permissions */}
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
            🔐 Permissions
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={handleRequestPermissions}
            activeOpacity={0.7}
          >
            <Bell color="#059669" size={20} />
            <Text style={styles.buttonOutlineText}>Request Permissions</Text>
          </TouchableOpacity>
          <Text style={[styles.helperText, darkMode && styles.helperTextDark]}>
            Required to send notifications and reminders
          </Text>
        </View>

        {/* General Settings */}
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
            ⚙️ General Settings
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Volume2 color={darkMode ? '#D1D5DB' : '#6B7280'} size={22} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, darkMode && styles.settingLabelDark]}>
                Sound
              </Text>
              <Text style={[styles.settingDescription, darkMode && styles.settingDescriptionDark]}>
                Play sound with notifications
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
              thumbColor={soundEnabled ? '#059669' : '#F3F4F6'}
              disabled={!notificationsEnabled}
            />
          </View>
        </View>

        {/* Wird Reminders */}
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Sun color="#F59E0B" size={22} />
            </View>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
              Wird Reminders
            </Text>
          </View>
          <Text style={[styles.sectionDescription, darkMode && styles.sectionDescriptionDark]}>
            Daily reminders for your wird practice
          </Text>

          {/* Morning Wird */}
          <View style={styles.reminderItem}>
            <View style={styles.reminderHeader}>
              <View style={styles.reminderInfo}>
                <Text style={[styles.reminderLabel, darkMode && styles.reminderLabelDark]}>
                  Morning Wird
                </Text>
                <Text style={[styles.reminderDescription, darkMode && styles.reminderDescriptionDark]}>
                  After Fajr prayer
                </Text>
              </View>
              <Switch
                value={wirdMorningEnabled}
                onValueChange={setWirdMorningEnabled}
                trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
                thumbColor={wirdMorningEnabled ? '#059669' : '#F3F4F6'}
                disabled={!notificationsEnabled}
              />
            </View>
            
            {wirdMorningEnabled && (
              <TouchableOpacity
                style={[styles.timeSelector, darkMode && styles.timeSelectorDark]}
                onPress={() => showTimePicker('morning')}
                disabled={!notificationsEnabled}
                activeOpacity={0.7}
              >
                <Clock color={darkMode ? '#D1D5DB' : '#6B7280'} size={18} />
                <Text style={[styles.timeText, darkMode && styles.timeTextDark]}>
                  {morningTime}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Evening Wird */}
          <View style={styles.reminderItem}>
            <View style={styles.reminderHeader}>
              <View style={styles.reminderInfo}>
                <Text style={[styles.reminderLabel, darkMode && styles.reminderLabelDark]}>
                  Evening Wird
                </Text>
                <Text style={[styles.reminderDescription, darkMode && styles.reminderDescriptionDark]}>
                  Before Maghrib prayer
                </Text>
              </View>
              <Switch
                value={wirdEveningEnabled}
                onValueChange={setWirdEveningEnabled}
                trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
                thumbColor={wirdEveningEnabled ? '#059669' : '#F3F4F6'}
                disabled={!notificationsEnabled}
              />
            </View>
            
            {wirdEveningEnabled && (
              <TouchableOpacity
                style={[styles.timeSelector, darkMode && styles.timeSelectorDark]}
                onPress={() => showTimePicker('evening')}
                disabled={!notificationsEnabled}
                activeOpacity={0.7}
              >
                <Clock color={darkMode ? '#D1D5DB' : '#6B7280'} size={18} />
                <Text style={[styles.timeText, darkMode && styles.timeTextDark]}>
                  {eveningTime}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Wazifa Reminder */}
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Star color="#EAB308" size={22} />
            </View>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
              Wazīfa Reminder
            </Text>
          </View>
          <Text style={[styles.sectionDescription, darkMode && styles.sectionDescriptionDark]}>
            Daily reminder for your wazīfa practice
          </Text>

          <View style={styles.reminderItem}>
            <View style={styles.reminderHeader}>
              <View style={styles.reminderInfo}>
                <Text style={[styles.reminderLabel, darkMode && styles.reminderLabelDark]}>
                  Daily Wazīfa
                </Text>
                <Text style={[styles.reminderDescription, darkMode && styles.reminderDescriptionDark]}>
                  After Asr prayer (3:30 PM)
                </Text>
              </View>
              <Switch
                value={wazifaEnabled}
                onValueChange={setWazifaEnabled}
                trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
                thumbColor={wazifaEnabled ? '#059669' : '#F3F4F6'}
                disabled={!notificationsEnabled}
              />
            </View>
          </View>
        </View>

        {/* Hadra Reminder */}
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Moon color="#8B5CF6" size={22} />
            </View>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
              Hadra Reminder
            </Text>
          </View>
          <Text style={[styles.sectionDescription, darkMode && styles.sectionDescriptionDark]}>
            Weekly reminder for Friday hadra
          </Text>

          <View style={styles.reminderItem}>
            <View style={styles.reminderHeader}>
              <View style={styles.reminderInfo}>
                <Text style={[styles.reminderLabel, darkMode && styles.reminderLabelDark]}>
                  Friday Hadra
                </Text>
                <Text style={[styles.reminderDescription, darkMode && styles.reminderDescriptionDark]}>
                  After Maghrib prayer
                </Text>
              </View>
              <Switch
                value={hadraEnabled}
                onValueChange={setHadraEnabled}
                trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
                thumbColor={hadraEnabled ? '#059669' : '#F3F4F6'}
                disabled={!notificationsEnabled}
              />
            </View>
            
            {hadraEnabled && (
              <TouchableOpacity
                style={[styles.timeSelector, darkMode && styles.timeSelectorDark]}
                onPress={() => showTimePicker('friday')}
                disabled={!notificationsEnabled}
                activeOpacity={0.7}
              >
                <Clock color={darkMode ? '#D1D5DB' : '#6B7280'} size={18} />
                <Text style={[styles.timeText, darkMode && styles.timeTextDark]}>
                  {fridayTime}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Encouragement */}
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Calendar color="#3B82F6" size={22} />
            </View>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
              Encouragement Messages
            </Text>
          </View>
          <Text style={[styles.sectionDescription, darkMode && styles.sectionDescriptionDark]}>
            Receive motivational messages
          </Text>

          <View style={styles.reminderItem}>
            <View style={styles.reminderHeader}>
              <View style={styles.reminderInfo}>
                <Text style={[styles.reminderLabel, darkMode && styles.reminderLabelDark]}>
                  Weekly Encouragement
                </Text>
                <Text style={[styles.reminderDescription, darkMode && styles.reminderDescriptionDark]}>
                  Every Wednesday at 2:00 PM
                </Text>
              </View>
              <Switch
                value={encouragementEnabled}
                onValueChange={setEncouragementEnabled}
                trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
                thumbColor={encouragementEnabled ? '#059669' : '#F3F4F6'}
                disabled={!notificationsEnabled}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
              (!hasChanges || isLoading) && styles.buttonDisabled
            ]}
            onPress={handleSave}
            disabled={!hasChanges || isLoading}
            activeOpacity={0.7}
          >
            <Save color="#FFFFFF" size={20} />
            <Text style={styles.buttonText}>
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleReset}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <RotateCcw color="#6B7280" size={20} />
            <Text style={styles.buttonSecondaryText}>Reset to Defaults</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Time Picker */}
      {timePicker.show && (
        <>
          {Platform.OS === 'ios' && (
            <View style={styles.iosPickerOverlay}>
              <View style={[styles.iosPickerContainer, darkMode && styles.iosPickerContainerDark]}>
                <View style={styles.iosPickerHeader}>
                  <TouchableOpacity onPress={dismissTimePicker}>
                    <Text style={styles.iosPickerCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={[styles.iosPickerTitle, darkMode && styles.iosPickerTitleDark]}>
                    Select Time
                  </Text>
                  <TouchableOpacity onPress={dismissTimePicker}>
                    <Text style={styles.iosPickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={timePicker.value}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onTimeChange}
                  textColor={darkMode ? '#FFFFFF' : '#000000'}
                />
              </View>
            </View>
          )}
          
          {Platform.OS === 'android' && (
            <DateTimePicker
              value={timePicker.value}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onTimeChange}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  subtitleDark: {
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionDark: {
    backgroundColor: '#1F2937',
  },
  masterSection: {
    borderWidth: 2,
    borderColor: '#059669',
  },
  masterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  masterIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  masterTextContainer: {
    flex: 1,
  },
  masterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  masterTitleDark: {
    color: '#FFFFFF',
  },
  masterDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  masterDescriptionDark: {
    color: '#9CA3AF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  sectionDescriptionDark: {
    color: '#9CA3AF',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingLabelDark: {
    color: '#FFFFFF',
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  settingDescriptionDark: {
    color: '#9CA3AF',
  },
  reminderItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderInfo: {
    flex: 1,
  },
  reminderLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  reminderLabelDark: {
    color: '#FFFFFF',
  },
  reminderDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  reminderDescriptionDark: {
    color: '#9CA3AF',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  timeSelectorDark: {
    backgroundColor: '#374151',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  timeTextDark: {
    color: '#10B981',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: '#059669',
  },
  buttonSecondary: {
    backgroundColor: '#F3F4F6',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#059669',
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB',
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  buttonOutlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  helperTextDark: {
    color: '#9CA3AF',
  },
  actionContainer: {
    marginTop: 8,
  },
  bottomSpacing: {
    height: 24,
  },
  iosPickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  iosPickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  iosPickerContainerDark: {
    backgroundColor: '#1F2937',
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iosPickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  iosPickerTitleDark: {
    color: '#FFFFFF',
  },
  iosPickerCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  iosPickerDone: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
});