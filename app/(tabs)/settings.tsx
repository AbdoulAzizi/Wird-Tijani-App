import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Alert,
  Share,
  Modal,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Settings as SettingsIcon, Volume2, Bell, Info, Share2, Heart, Moon, Globe, Type, Download, Upload, RotateCcw, Clock, ChevronRight, X, Save, CircleHelp as HelpCircle, Shield, Zap } from 'lucide-react-native';
import GradientHeader from '../../components/GradientHeader';
import { useApp } from '../../contexts/AppContext';
import { useNotifications } from '../../contexts/NotificationContext';
import ScreenBackground from '../../components/ScreenBackground';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface TimePickerState {
  show: boolean;
  type: 'morning' | 'evening' | 'friday' | null;
  time: Date;
}

export default function SettingsScreen() {
  const { state, dispatch } = useApp();
  const { unreadCount } = useNotifications();
  const router = useRouter();
  const [timePicker, setTimePicker] = useState<TimePickerState>({
    show: false,
    type: null,
    time: new Date()
  });
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // États pour les temps de rappel
  const [reminderTimes, setReminderTimes] = useState({
    morning: new Date(2024, 0, 1, 5, 30),
    evening: new Date(2024, 0, 1, 18, 45),
    friday: new Date(2024, 0, 1, 15, 30)
  });

  const toggleAudio = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: { audioEnabled: !state.settings.audioEnabled }
    });
  };

  const toggleNotifications = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: { notificationsEnabled: !state.settings.notificationsEnabled }
    });
  };

  const toggleDarkMode = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: { darkMode: !state.settings.darkMode }
    });
  };

  const showTimePicker = (type: 'morning' | 'evening' | 'friday') => {
    setTimePicker({
      show: true,
      type,
      time: reminderTimes[type]
    });
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime && timePicker.type) {
      setReminderTimes(prev => ({
        ...prev,
        [timePicker.type!]: selectedTime
      }));
    }
    setTimePicker(prev => ({ ...prev, show: false }));
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message: 'Join me in this spiritual journey with Wird & Wazīfa Tijāniyya app! 🕌✨',
        title: 'Wird & Wazīfa Tijāniyya'
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  const exportData = async () => {
    try {
      const dataToExport = JSON.stringify(state, null, 2);
      await Share.share({
        message: `Backup data from Wird & Wazīfa Tijāniyya:\n\n${dataToExport}`,
        title: 'App Backup'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const resetAllData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all your progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'RESET_ALL_WIRD' });
            dispatch({ type: 'RESET_ALL_WAZIFA' });
            dispatch({ type: 'RESET_ALL_HADRA' });
            Alert.alert('Success', 'All data has been reset');
          }
        }
      ]
    );
  };

  const ModalContainer = ({ visible, onClose, title, children }: {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer,
          state.settings.darkMode && styles.modalContainerDark
        ]}>
          <View style={styles.modalHeader}>
            <Text style={[
              styles.modalTitle,
              state.settings.darkMode && styles.modalTitleDark
            ]}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <X color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={24} />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[
      styles.container,
      state.settings.darkMode && styles.containerDark
    ]}>
      <ScreenBackground>
        {/* <GradientHeader
          arabicTitle="الإعدادات"
          englishTitle="Settings"
          subtitle="Customize Your Experience"
          icon={<SettingsIcon color="#FFFFFF" size={32} />}
        /> */}

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Notifications Section - NOUVEAU */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell color="#059669" size={24} />
              <Text style={styles.sectionTitle}>Notifications</Text>
            </View>

            {/* Quick Toggle */}
            <View style={[styles.settingItem, state.settings.darkMode && styles.settingItemDark]}>
              <View style={styles.settingInfo}>
                <Bell color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
                <View style={styles.settingTextContainer}>
                  <View style={styles.settingTitleRow}>
                    <Text style={[styles.settingTitle, state.settings.darkMode && styles.settingTitleDark]}>
                      Enable Notifications
                    </Text>
                    {unreadCount > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.settingDescription, state.settings.darkMode && styles.settingDescriptionDark]}>
                    {state.settings.notificationsEnabled ? 'Enabled' : 'Disabled'} • Receive reminders and alerts
                  </Text>
                </View>
              </View>
              <Switch
                value={state.settings.notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#E5E7EB', true: '#059669' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Notification Settings */}
            <TouchableOpacity 
              style={[styles.settingItem, state.settings.darkMode && styles.settingItemDark]}
              onPress={() => router.push('/notification-settings' as any)}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <SettingsIcon color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, state.settings.darkMode && styles.settingTitleDark]}>
                    Notification Settings
                  </Text>
                  <Text style={[styles.settingDescription, state.settings.darkMode && styles.settingDescriptionDark]}>
                    Configure reminders, times and preferences
                  </Text>
                </View>
              </View>
              <ChevronRight color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
            </TouchableOpacity>

            {/* Dev Only: Test Notifications */}
            {/* {__DEV__ && (
              <TouchableOpacity 
                style={[styles.settingItem, styles.settingItemDev, state.settings.darkMode && styles.settingItemDark]}
                onPress={() => router.push('/notification-test' as any)}
                activeOpacity={0.7}
              >
                <View style={styles.settingInfo}>
                  <Zap color="#F59E0B" size={20} />
                  <View style={styles.settingTextContainer}>
                    <Text style={[styles.settingTitle, state.settings.darkMode && styles.settingTitleDark]}>
                      🧪 Test Notifications
                    </Text>
                    <Text style={[styles.settingDescription, state.settings.darkMode && styles.settingDescriptionDark]}>
                      Development mode only
                    </Text>
                  </View>
                </View>
                <ChevronRight color="#F59E0B" size={20} />
              </TouchableOpacity>
            )} */}
          </View>

          {/* Appearance Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Moon color="#059669" size={24} />
              <Text style={styles.sectionTitle}>Appearance</Text>
            </View>
            
            <View style={[styles.settingItem, state.settings.darkMode && styles.settingItemDark]}>
              <View style={styles.settingInfo}>
                <Moon color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, state.settings.darkMode && styles.settingTitleDark]}>
                    Dark Mode
                  </Text>
                  <Text style={[styles.settingDescription, state.settings.darkMode && styles.settingDescriptionDark]}>
                    Switch between light and dark themes
                  </Text>
                </View>
              </View>
              <Switch
                value={state.settings.darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#E5E7EB', true: '#059669' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity 
              style={[styles.settingItem, state.settings.darkMode && styles.settingItemDark]}
              onPress={() => setShowLanguageModal(true)}
            >
              <View style={styles.settingInfo}>
                <Globe color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, state.settings.darkMode && styles.settingTitleDark]}>
                    Language
                  </Text>
                  <Text style={[styles.settingDescription, state.settings.darkMode && styles.settingDescriptionDark]}>
                    Choose your preferred language
                  </Text>
                </View>
              </View>
              <ChevronRight color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingItem, state.settings.darkMode && styles.settingItemDark]}
              onPress={() => setShowFontSizeModal(true)}
            >
              <View style={styles.settingInfo}>
                <Type color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, state.settings.darkMode && styles.settingTitleDark]}>
                    Font Size
                  </Text>
                  <Text style={[styles.settingDescription, state.settings.darkMode && styles.settingDescriptionDark]}>
                    Adjust text size for better readability
                  </Text>
                </View>
              </View>
              <ChevronRight color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
            </TouchableOpacity>
          </View>

          {/* Audio Settings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Volume2 color="#059669" size={24} />
              <Text style={styles.sectionTitle}>Audio & Sound</Text>
            </View>
            
            <View style={[styles.settingItem, state.settings.darkMode && styles.settingItemDark]}>
              <View style={styles.settingInfo}>
                <Volume2 color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, state.settings.darkMode && styles.settingTitleDark]}>
                    Sound Effects
                  </Text>
                  <Text style={[styles.settingDescription, state.settings.darkMode && styles.settingDescriptionDark]}>
                    Enable audio for dhikr recitations
                  </Text>
                </View>
              </View>
              <Switch
                value={state.settings.audioEnabled}
                onValueChange={toggleAudio}
                trackColor={{ false: '#E5E7EB', true: '#059669' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Data Management */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield color="#059669" size={24} />
              <Text style={styles.sectionTitle}>Data Management</Text>
            </View>

            <TouchableOpacity 
              style={[styles.settingItem, state.settings.darkMode && styles.settingItemDark]}
              onPress={exportData}
            >
              <View style={styles.settingInfo}>
                <Upload color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, state.settings.darkMode && styles.settingTitleDark]}>
                    Export Data
                  </Text>
                  <Text style={[styles.settingDescription, state.settings.darkMode && styles.settingDescriptionDark]}>
                    Backup your progress and settings
                  </Text>
                </View>
              </View>
              <ChevronRight color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingItem, state.settings.darkMode && styles.settingItemDark]}
              onPress={() => setShowResetModal(true)}
            >
              <View style={styles.settingInfo}>
                <RotateCcw color="#EF4444" size={20} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: '#EF4444' }]}>
                    Reset All Data
                  </Text>
                  <Text style={[styles.settingDescription, state.settings.darkMode && styles.settingDescriptionDark]}>
                    Clear all progress and start fresh
                  </Text>
                </View>
              </View>
              <ChevronRight color="#EF4444" size={20} />
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info color="#059669" size={24} />
              <Text style={styles.sectionTitle}>App Info</Text>
            </View>

            <TouchableOpacity 
              style={[styles.settingItem, state.settings.darkMode && styles.settingItemDark]}
              onPress={() => setShowAboutModal(true)}
            >
              <View style={styles.settingInfo}>
                <HelpCircle color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, state.settings.darkMode && styles.settingTitleDark]}>
                    About & Help
                  </Text>
                  <Text style={[styles.settingDescription, state.settings.darkMode && styles.settingDescriptionDark]}>
                    Learn more about the app and get help
                  </Text>
                </View>
              </View>
              <ChevronRight color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingItem, state.settings.darkMode && styles.settingItemDark]}
              onPress={shareApp}
            >
              <View style={styles.settingInfo}>
                <Share2 color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, state.settings.darkMode && styles.settingTitleDark]}>
                    Share App
                  </Text>
                  <Text style={[styles.settingDescription, state.settings.darkMode && styles.settingDescriptionDark]}>
                    Invite others to join the spiritual journey
                  </Text>
                </View>
              </View>
              <Share2 color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={16} />
            </TouchableOpacity>

            <View style={[styles.settingItem, state.settings.darkMode && styles.settingItemDark]}>
              <View style={styles.settingInfo}>
                <Info color={state.settings.darkMode ? '#FFFFFF' : '#6B7280'} size={20} />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, state.settings.darkMode && styles.settingTitleDark]}>
                    Version
                  </Text>
                  <Text style={[styles.settingDescription, state.settings.darkMode && styles.settingDescriptionDark]}>
                    Wird & Wazīfa Tijāniyya v1.0
                  </Text>
                </View>
              </View>
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>v1.0</Text>
              </View>
            </View>
          </View>

          {/* Made with Love */}
          <View style={[styles.loveContainer, state.settings.darkMode && styles.loveContainerDark]}>
            <Heart color="#EF4444" size={16} fill="#EF4444" />
            <Text style={[styles.loveText, state.settings.darkMode && styles.loveTextDark]}>
              Made with love for the Tijāni community
            </Text>
          </View>

          <View style={styles.arabicContainer}>
            <Text style={[styles.arabicText, state.settings.darkMode && styles.arabicTextDark]}>
              بِإِذْنِ مِنَ اللّٰهِ الْعَلِيّ
            </Text>
            <Text style={[styles.arabicTranslation, state.settings.darkMode && styles.arabicTranslationDark]}>
              By the permission of Allah, the Most High
            </Text>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </ScreenBackground>

      {/* Time Picker */}
      {timePicker.show && (
        <DateTimePicker
          value={timePicker.time}
          mode="time"
          is24Hour={true}
          onChange={onTimeChange}
        />
      )}

      {/* About Modal */}
      <ModalContainer
        visible={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        title="About & Help"
      >
        <ScrollView style={styles.modalContent}>
          <Text style={[styles.aboutTitle, state.settings.darkMode && styles.aboutTitleDark]}>
            Wird & Wazīfa Tijāniyya
          </Text>
          <Text style={[styles.aboutDescription, state.settings.darkMode && styles.aboutDescriptionDark]}>
            This app is designed to help you maintain your daily spiritual practices according to the Tijani tradition.
          </Text>
          
          <Text style={[styles.aboutSectionTitle, state.settings.darkMode && styles.aboutSectionTitleDark]}>
            Features:
          </Text>
          <Text style={[styles.aboutText, state.settings.darkMode && styles.aboutTextDark]}>
            • Daily Wird tracking with step-by-step guidance{'\n'}
            • Weekly Wazīfa with structured recitations{'\n'}
            • Hadra sessions with customizable targets{'\n'}
            • Progress tracking and statistics{'\n'}
            • Reminder notifications{'\n'}
            • Dark mode support{'\n'}
            • Data backup and restore
          </Text>

          <Text style={[styles.aboutSectionTitle, state.settings.darkMode && styles.aboutSectionTitleDark]}>
            How to Use:
          </Text>
          <Text style={[styles.aboutText, state.settings.darkMode && styles.aboutTextDark]}>
            1. Start with the Daily Wird tab{'\n'}
            2. Complete each dhikr in order{'\n'}
            3. Track your weekly Wazīfa on Fridays{'\n'}
            4. Join Hadra sessions when available{'\n'}
            5. View your progress in Statistics
          </Text>

          <Text style={[styles.aboutFooter, state.settings.darkMode && styles.aboutFooterDark]}>
            May Allah accept our efforts and grant us spiritual advancement.
          </Text>
        </ScrollView>
      </ModalContainer>

      {/* Language Modal */}
      <ModalContainer
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        title="Language Settings"
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={[styles.languageOption, state.settings.darkMode && styles.languageOptionDark]}>
            <Text style={[styles.languageText, state.settings.darkMode && styles.languageTextDark]}>
              العربية (Arabic)
            </Text>
            <View style={styles.languageRadio}>
              <View style={styles.languageRadioSelected} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.languageOption, state.settings.darkMode && styles.languageOptionDark]}>
            <Text style={[styles.languageText, state.settings.darkMode && styles.languageTextDark]}>
              English
            </Text>
            <View style={styles.languageRadio} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.languageOption, state.settings.darkMode && styles.languageOptionDark]}>
            <Text style={[styles.languageText, state.settings.darkMode && styles.languageTextDark]}>
              Français
            </Text>
            <View style={styles.languageRadio} />
          </TouchableOpacity>
        </View>
      </ModalContainer>

      {/* Font Size Modal */}
      <ModalContainer
        visible={showFontSizeModal}
        onClose={() => setShowFontSizeModal(false)}
        title="Font Size"
      >
        <View style={styles.modalContent}>
          {['Small', 'Medium', 'Large', 'Extra Large'].map((size, index) => (
            <TouchableOpacity 
              key={size}
              style={[styles.fontSizeOption, state.settings.darkMode && styles.fontSizeOptionDark]}
            >
              <Text style={[
                styles.fontSizeText, 
                state.settings.darkMode && styles.fontSizeTextDark,
                { fontSize: 14 + (index * 2) }
              ]}>
                {size} - Sample Text العربية
              </Text>
              {index === 1 && <View style={styles.fontSizeSelected} />}
            </TouchableOpacity>
          ))}
        </View>
      </ModalContainer>

      {/* Reset Confirmation Modal */}
      <ModalContainer
        visible={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset All Data"
      >
        <View style={styles.modalContent}>
          <Text style={[styles.resetWarning, state.settings.darkMode && styles.resetWarningDark]}>
            ⚠️ Warning
          </Text>
          <Text style={[styles.resetDescription, state.settings.darkMode && styles.resetDescriptionDark]}>
            This action will permanently delete all your progress, including:
          </Text>
          <Text style={[styles.resetList, state.settings.darkMode && styles.resetListDark]}>
            • All Wird progress{'\n'}
            • All Wazīfa completions{'\n'}
            • All Hadra sessions{'\n'}
            • Statistics and streaks{'\n'}
            • Completed sessions history
          </Text>
          <Text style={[styles.resetNote, state.settings.darkMode && styles.resetNoteDark]}>
            This action cannot be undone. Make sure to export your data first if you want to keep a backup.
          </Text>
          
          <View style={styles.resetButtons}>
            <TouchableOpacity 
              style={styles.resetCancelButton}
              onPress={() => setShowResetModal(false)}
            >
              <Text style={styles.resetCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.resetConfirmButton}
              onPress={() => {
                setShowResetModal(false);
                resetAllData();
              }}
            >
              <Text style={styles.resetConfirmText}>Reset All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalContainer>
    </View>
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
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItemDark: {
    backgroundColor: '#1F2937',
  },
  settingItemDev: {
    borderWidth: 2,
    borderColor: '#FEF3C7',
    backgroundColor: '#FFFBEB',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingTitleDark: {
    color: '#FFFFFF',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingDescriptionDark: {
    color: '#D1D5DB',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  versionBadge: {
    backgroundColor: '#EAB308',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderItemDark: {
    backgroundColor: '#1F2937',
  },
  reminderLabel: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  reminderLabelDark: {
    color: '#FFFFFF',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reminderTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  loveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  loveContainerDark: {
    backgroundColor: '#1F2937',
  },
  loveText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  loveTextDark: {
    color: '#D1D5DB',
  },
  arabicContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 12,
  },
  arabicText: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  arabicTextDark: {
    color: '#FFFFFF',
  },
  arabicTranslation: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  arabicTranslationDark: {
    color: '#D1D5DB',
  },
  bottomSpacing: {
    height: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: width - 40,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalContainerDark: {
    backgroundColor: '#1F2937',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  // About modal styles
  aboutTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  aboutTitleDark: {
    color: '#FFFFFF',
  },
  aboutDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  aboutDescriptionDark: {
    color: '#D1D5DB',
  },
  aboutSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
    marginTop: 16,
  },
  aboutSectionTitleDark: {
    color: '#10B981',
  },
  aboutText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  aboutTextDark: {
    color: '#D1D5DB',
  },
  aboutFooter: {
    fontSize: 16,
    color: '#059669',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  aboutFooterDark: {
    color: '#10B981',
  },
  // Language modal styles
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  languageOptionDark: {
    borderBottomColor: '#374151',
  },
  languageText: {
    fontSize: 16,
    color: '#1F2937',
  },
  languageTextDark: {
    color: '#FFFFFF',
  },
  languageRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#059669',
  },
  // Font size modal styles
  fontSizeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  fontSizeOptionDark: {
    borderBottomColor: '#374151',
  },
  fontSizeText: {
    color: '#1F2937',
    flex: 1,
  },
  fontSizeTextDark: {
    color: '#FFFFFF',
  },
  fontSizeSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#059669',
  },
  // Reset modal styles
  resetWarning: {
    fontSize: 20,
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  resetWarningDark: {
    color: '#F87171',
  },
  resetDescription: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  resetDescriptionDark: {
    color: '#FFFFFF',
  },
  resetList: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  resetListDark: {
    color: '#D1D5DB',
  },
  resetNote: {
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  resetNoteDark: {
    color: '#F87171',
  },
  resetButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  resetCancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  resetConfirmButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});