import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Alert, Platform, Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Bell, Clock, Volume2, Moon, Sun, Star,
  Calendar, Save, RotateCcw, ChevronRight,
  Sparkles, Shield,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { useNotifications } from '@/contexts/NotificationContext';
import ReminderService, {
  DEFAULT_REMINDER_CONFIG, DEFAULT_PREFERENCES,
  type ReminderConfig, type ReminderPreferences,
} from '@/contexts/ReminderService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useContext } from 'react';
import MinimalHeader from '../../components/MinimalHeader';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';

const PREFS_KEY = 'reminder_preferences_v1';
type TimePickerKey = 'morning' | 'evening' | 'wazifa' | 'friday';
interface TimePickerState { show: boolean; mode: 'time'; value: Date; key: TimePickerKey; }

const T = {
  emerald: '#059669', emeraldLight: '#D1FAE5', emeraldMid: '#6EE7B7',
  amber: '#D97706', violet: '#7C3AED', blue: '#2563EB',
  slate100: '#F1F5F9', slate200: '#E2E8F0', slate400: '#94A3B8',
  slate500: '#64748B', slate900: '#0F172A', white: '#FFFFFF',
  dark900: '#0D1117', dark800: '#161B22', dark700: '#21262D',
  dark600: '#30363D', darkText: '#E6EDF3', darkMuted: '#8B949E',
};

const Divider = ({ dark }: { dark?: boolean }) => (
  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: dark ? T.dark600 : T.slate200, marginVertical: 8 }} />
);

const IconBadge = ({ icon, bg }: { icon: React.ReactNode; bg: string }) => (
  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }}>
    {icon}
  </View>
);

const TimePill = ({ time, onPress, disabled, dark }: { time: string; onPress: () => void; disabled: boolean; dark: boolean }) => (
  <TouchableOpacity
    onPress={onPress} disabled={disabled} activeOpacity={0.7}
    style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, alignSelf: 'flex-start', opacity: disabled ? 0.4 : 1, backgroundColor: dark ? '#0D2D1E' : T.emeraldLight }}>
    <Clock size={13} color={T.emerald} strokeWidth={2.5} />
    <Text style={{ fontSize: 13, fontWeight: '700', color: T.emerald }}>{time}</Text>
    <ChevronRight size={12} color={T.emerald} strokeWidth={2.5} />
  </TouchableOpacity>
);

const ReminderRow = ({ label, sublabel, enabled, onToggle, time, showTime, onTimePress, masterEnabled, dark }: {
  label: string; sublabel: string; enabled: boolean; onToggle: (v: boolean) => void;
  time?: string; showTime?: boolean; onTimePress?: () => void; masterEnabled: boolean; dark: boolean;
}) => (
  <View style={{ paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: dark ? T.dark600 : T.slate100 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: dark ? T.darkText : T.slate900, marginBottom: 2 }}>{label}</Text>
        <Text style={{ fontSize: 12, color: dark ? T.darkMuted : T.slate400 }}>{sublabel}</Text>
      </View>
      <Switch value={enabled} onValueChange={onToggle}
        trackColor={{ false: dark ? T.dark600 : T.slate200, true: T.emeraldMid }}
        thumbColor={enabled ? T.emerald : dark ? T.darkMuted : T.white}
        disabled={!masterEnabled} ios_backgroundColor={dark ? T.dark600 : T.slate200} />
    </View>
    {showTime && time && onTimePress && (
      <View style={{ marginTop: 10 }}>
        <TimePill time={time} onPress={onTimePress} disabled={!masterEnabled} dark={dark} />
      </View>
    )}
  </View>
);

export default function NotificationSettingsScreen() {
  const { state, dispatch } = useApp();
  const { requestPermissions } = useNotifications();
  const { darkMode } = state.settings;
  const { handleBack } = useContext(LayoutActionsContext);
  const d = darkMode;

  const [notificationsEnabled, setNotificationsEnabled] = useState(state.settings.notificationsEnabled);
  const [soundEnabled, setSoundEnabled] = useState(state.settings.audioEnabled);
  const [wirdMorningEnabled, setWirdMorningEnabled] = useState(DEFAULT_PREFERENCES.wirdMorning);
  const [wirdEveningEnabled, setWirdEveningEnabled] = useState(DEFAULT_PREFERENCES.wirdEvening);
  const [wazifaEnabled, setWazifaEnabled] = useState(DEFAULT_PREFERENCES.wazifa);
  const [hadraEnabled, setHadraEnabled] = useState(DEFAULT_PREFERENCES.hadra);
  const [encouragementEnabled, setEncouragementEnabled] = useState(DEFAULT_PREFERENCES.encouragement);
  const [morningTime, setMorningTime] = useState(state.settings.reminderTimes?.morning ?? DEFAULT_REMINDER_CONFIG.morning);
  const [eveningTime, setEveningTime] = useState(state.settings.reminderTimes?.evening ?? DEFAULT_REMINDER_CONFIG.evening);
  const [wazifaTime, setWazifaTime] = useState(state.settings.reminderTimes?.wazifa ?? DEFAULT_REMINDER_CONFIG.wazifa);
  const [fridayTime, setFridayTime] = useState(state.settings.reminderTimes?.friday ?? DEFAULT_REMINDER_CONFIG.friday);
  const [timePicker, setTimePicker] = useState<TimePickerState>({ show: false, mode: 'time', value: new Date(), key: 'morning' });
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // FIX: Track the saved/baseline values so hasChanges compares against what
  // was actually persisted, not against DEFAULT_PREFERENCES (which would make
  // hasChanges true immediately on mount and trigger phantom saves).
  const savedPrefs = useRef<ReminderPreferences>({
    wirdMorning:   DEFAULT_PREFERENCES.wirdMorning,
    wirdEvening:   DEFAULT_PREFERENCES.wirdEvening,
    wazifa:        DEFAULT_PREFERENCES.wazifa,
    hadra:         DEFAULT_PREFERENCES.hadra,
    encouragement: DEFAULT_PREFERENCES.encouragement,
  });

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const raw = await AsyncStorage.getItem(PREFS_KEY);
      if (!raw) return;
      const saved: Partial<ReminderPreferences> = JSON.parse(raw);

      // Apply to state
      if (saved.wirdMorning   !== undefined) setWirdMorningEnabled(saved.wirdMorning);
      if (saved.wirdEvening   !== undefined) setWirdEveningEnabled(saved.wirdEvening);
      if (saved.wazifa        !== undefined) setWazifaEnabled(saved.wazifa);
      if (saved.hadra         !== undefined) setHadraEnabled(saved.hadra);
      if (saved.encouragement !== undefined) setEncouragementEnabled(saved.encouragement);

      // FIX: Mirror loaded values into the baseline ref so hasChanges starts false
      savedPrefs.current = {
        wirdMorning:   saved.wirdMorning   ?? DEFAULT_PREFERENCES.wirdMorning,
        wirdEvening:   saved.wirdEvening   ?? DEFAULT_PREFERENCES.wirdEvening,
        wazifa:        saved.wazifa        ?? DEFAULT_PREFERENCES.wazifa,
        hadra:         saved.hadra         ?? DEFAULT_PREFERENCES.hadra,
        encouragement: saved.encouragement ?? DEFAULT_PREFERENCES.encouragement,
      };
    } catch (e) { console.error(e); }
  };

  // FIX: Compare against savedPrefs.current (the actual persisted state)
  // instead of DEFAULT_PREFERENCES, so we only show "Save" when the user
  // has genuinely changed something since the last save.
  useEffect(() => {
    const sp = savedPrefs.current;
    const changed =
      notificationsEnabled !== state.settings.notificationsEnabled ||
      soundEnabled         !== state.settings.audioEnabled         ||
      morningTime          !== (state.settings.reminderTimes?.morning ?? DEFAULT_REMINDER_CONFIG.morning) ||
      eveningTime          !== (state.settings.reminderTimes?.evening ?? DEFAULT_REMINDER_CONFIG.evening) ||
      wazifaTime           !== (state.settings.reminderTimes?.wazifa  ?? DEFAULT_REMINDER_CONFIG.wazifa)  ||
      fridayTime           !== (state.settings.reminderTimes?.friday  ?? DEFAULT_REMINDER_CONFIG.friday)  ||
      wirdMorningEnabled   !== sp.wirdMorning   ||
      wirdEveningEnabled   !== sp.wirdEvening   ||
      wazifaEnabled        !== sp.wazifa        ||
      hadraEnabled         !== sp.hadra         ||
      encouragementEnabled !== sp.encouragement;
    setHasChanges(changed);
  }, [notificationsEnabled, soundEnabled, morningTime, eveningTime, wazifaTime, fridayTime, wirdMorningEnabled, wirdEveningEnabled, wazifaEnabled, hadraEnabled, encouragementEnabled]);

  const showTimePicker = useCallback((key: TimePickerKey) => {
    const map: Record<TimePickerKey, string> = { morning: morningTime, evening: eveningTime, wazifa: wazifaTime, friday: fridayTime };
    const [h, m] = map[key].split(':').map(Number);
    const dt = new Date(); dt.setHours(h, m, 0, 0);
    setTimePicker({ show: true, mode: 'time', value: dt, key });
  }, [morningTime, eveningTime, wazifaTime, fridayTime]);

  const onTimeChange = useCallback((event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setTimePicker(prev => ({ ...prev, show: false }));
    if (!selectedDate || event.type === 'dismissed') return;
    const hh = selectedDate.getHours().toString().padStart(2, '0');
    const mm = selectedDate.getMinutes().toString().padStart(2, '0');
    const value = hh + ':' + mm;
    setTimePicker(prev => {
      switch (prev.key) {
        case 'morning': setMorningTime(value); break;
        case 'evening': setEveningTime(value); break;
        case 'wazifa':  setWazifaTime(value);  break;
        case 'friday':  setFridayTime(value);  break;
      }
      return { ...prev, value: selectedDate };
    });
  }, []);

  const dismissTimePicker = useCallback(() => setTimePicker(prev => ({ ...prev, show: false })), []);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
      dispatch({ type: 'UPDATE_SETTINGS', settings: { notificationsEnabled, audioEnabled: soundEnabled } });
      dispatch({ type: 'UPDATE_REMINDER_TIME', reminderType: 'morning', time: morningTime });
      dispatch({ type: 'UPDATE_REMINDER_TIME', reminderType: 'evening', time: eveningTime });
      dispatch({ type: 'UPDATE_REMINDER_TIME', reminderType: 'wazifa', time: wazifaTime });
      dispatch({ type: 'UPDATE_REMINDER_TIME', reminderType: 'friday', time: fridayTime });

      const prefs: ReminderPreferences = {
        wirdMorning: wirdMorningEnabled, wirdEvening: wirdEveningEnabled,
        wazifa: wazifaEnabled, hadra: hadraEnabled, encouragement: encouragementEnabled,
      };
      await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));

      if (notificationsEnabled) {
        const config: ReminderConfig = {
          morning: morningTime, evening: eveningTime,
          wazifa: wazifaTime, friday: fridayTime,
          encouragement: DEFAULT_REMINDER_CONFIG.encouragement,
        };
        // scheduleAllReminders now cancels ALL OS notifs before re-scheduling,
        // so duplicates are impossible even if IDs were previously lost.
        await ReminderService.scheduleAllReminders(config, prefs);
        Alert.alert('Saved', 'Your reminders have been updated.', [{ text: 'OK' }]);
      } else {
        await ReminderService.cancelAllReminders();
        Alert.alert('Saved', 'Notifications disabled.', [{ text: 'OK' }]);
      }

      // FIX: Update the baseline so hasChanges goes back to false after saving
      savedPrefs.current = { ...prefs };
      setHasChanges(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to save settings.');
    } finally { setIsLoading(false); }
  }, [notificationsEnabled, soundEnabled, morningTime, eveningTime, wazifaTime, fridayTime, wirdMorningEnabled, wirdEveningEnabled, wazifaEnabled, hadraEnabled, encouragementEnabled, dispatch]);

  const handleReset = useCallback(() => {
    Alert.alert('Reset to Defaults?', 'All notification settings will be restored.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => {
        setNotificationsEnabled(true); setSoundEnabled(true);
        setWirdMorningEnabled(DEFAULT_PREFERENCES.wirdMorning);
        setWirdEveningEnabled(DEFAULT_PREFERENCES.wirdEvening);
        setWazifaEnabled(DEFAULT_PREFERENCES.wazifa);
        setHadraEnabled(DEFAULT_PREFERENCES.hadra);
        setEncouragementEnabled(DEFAULT_PREFERENCES.encouragement);
        setMorningTime(DEFAULT_REMINDER_CONFIG.morning);
        setEveningTime(DEFAULT_REMINDER_CONFIG.evening);
        setWazifaTime(DEFAULT_REMINDER_CONFIG.wazifa);
        setFridayTime(DEFAULT_REMINDER_CONFIG.friday);
      }},
    ]);
  }, []);

  const handleRequestPermissions = useCallback(async () => {
    const granted = await requestPermissions();
    if (granted) {
      Alert.alert('Permissions Granted', 'You can now receive notifications.', [{ text: 'OK' }]);
    } else {
      Alert.alert('Permissions Required', 'Enable notifications in your device settings.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]);
    }
  }, [requestPermissions]);

  const menuActions = useMemo(() => [
    { key: 'save', label: 'Save Settings', icon: <Save color={T.emerald} size={16} strokeWidth={2} />, onPress: handleSave },
    { key: 'reset', label: 'Reset to Defaults', icon: <RotateCcw color="#EF4444" size={16} strokeWidth={2.5} />, onPress: handleReset, destructive: true },
  ], [handleSave, handleReset]);

  useRegisterHeaderActions('/notification-settings', menuActions);

  const SectionHead = ({ icon, bg, title, description }: { icon: React.ReactNode; bg: string; title: string; description?: string }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <IconBadge icon={icon} bg={bg} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: d ? T.darkText : T.slate900, marginBottom: 1 }}>{title}</Text>
        {description && <Text style={{ fontSize: 12, color: d ? T.darkMuted : T.slate400 }}>{description}</Text>}
      </View>
    </View>
  );

  const card: any[] = [s.card, d && s.cardDark];

  return (
    <View style={[s.root, d && s.rootDark]}>
      <MinimalHeader title="Notifications" subtitle="Reminders & alerts" onBackPress={handleBack} showMore menuActions={menuActions} theme="default" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Master */}
        <View style={[s.masterCard, d && s.masterCardDark, notificationsEnabled && s.masterCardActive]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={[s.masterIcon, { backgroundColor: notificationsEnabled ? T.emeraldLight : d ? T.dark700 : T.slate100 }]}>
              <Bell size={26} color={notificationsEnabled ? T.emerald : T.slate400} strokeWidth={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: d ? T.darkText : T.slate900, marginBottom: 2 }}>
                {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
              </Text>
              <Text style={{ fontSize: 12, color: d ? T.darkMuted : T.slate400, lineHeight: 16 }}>
                {notificationsEnabled ? 'Receiving reminders for your practices' : 'No reminders will be sent'}
              </Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled}
              trackColor={{ false: d ? T.dark600 : T.slate200, true: T.emeraldMid }}
              thumbColor={notificationsEnabled ? T.emerald : d ? T.darkMuted : T.white}
              ios_backgroundColor={d ? T.dark600 : T.slate200} />
          </View>
        </View>

        {/* System */}
        <View style={card}>
          <SectionHead icon={<Shield size={18} color={T.white} strokeWidth={2} />} bg={T.blue} title="System" description="Permissions and audio" />
          <Divider dark={d} />
          <View style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: d ? T.dark600 : T.slate100 }}>
            <Volume2 size={18} color={d ? T.darkMuted : T.slate400} strokeWidth={2} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: d ? T.darkText : T.slate900, marginBottom: 2 }}>Sound</Text>
              <Text style={{ fontSize: 12, color: d ? T.darkMuted : T.slate400 }}>Play a sound with each alert</Text>
            </View>
            <Switch value={soundEnabled} onValueChange={setSoundEnabled}
              trackColor={{ false: d ? T.dark600 : T.slate200, true: T.emeraldMid }}
              thumbColor={soundEnabled ? T.emerald : d ? T.darkMuted : T.white}
              disabled={!notificationsEnabled} ios_backgroundColor={d ? T.dark600 : T.slate200} />
          </View>
          <TouchableOpacity style={[s.permBtn, { backgroundColor: d ? T.dark700 : T.slate100 }]} onPress={handleRequestPermissions} activeOpacity={0.7}>
            <Bell size={16} color={T.emerald} strokeWidth={2.2} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: T.emerald, flex: 1 }}>Check Permissions</Text>
            <ChevronRight size={14} color={T.emerald} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Wird */}
        <View style={card}>
          <SectionHead icon={<Sun size={18} color={T.white} strokeWidth={2} />} bg={T.amber} title="Wird" description="Daily morning & evening recitation" />
          <Divider dark={d} />
          <ReminderRow label="Morning Wird" sublabel="After Fajr prayer" enabled={wirdMorningEnabled} onToggle={setWirdMorningEnabled} time={morningTime} showTime={wirdMorningEnabled} onTimePress={() => showTimePicker('morning')} masterEnabled={notificationsEnabled} dark={d} />
          <ReminderRow label="Evening Wird" sublabel="Before Maghrib prayer" enabled={wirdEveningEnabled} onToggle={setWirdEveningEnabled} time={eveningTime} showTime={wirdEveningEnabled} onTimePress={() => showTimePicker('evening')} masterEnabled={notificationsEnabled} dark={d} />
        </View>

        {/* Wazifa */}
        <View style={card}>
          <SectionHead icon={<Star size={18} color={T.white} strokeWidth={2} />} bg="#B45309" title="Wazīfa" description="Daily spiritual practice" />
          <Divider dark={d} />
          <ReminderRow label="Daily Wazīfa" sublabel={"After Asr prayer · " + wazifaTime} enabled={wazifaEnabled} onToggle={setWazifaEnabled} time={wazifaTime} showTime={wazifaEnabled} onTimePress={() => showTimePicker('wazifa')} masterEnabled={notificationsEnabled} dark={d} />
        </View>

        {/* Hadra */}
        <View style={card}>
          <SectionHead icon={<Moon size={18} color={T.white} strokeWidth={2} />} bg={T.violet} title="Hadra" description="Weekly Friday gathering" />
          <Divider dark={d} />
          <ReminderRow label="Friday Hadra" sublabel="Before Maghrib prayer" enabled={hadraEnabled} onToggle={setHadraEnabled} time={fridayTime} showTime={hadraEnabled} onTimePress={() => showTimePicker('friday')} masterEnabled={notificationsEnabled} dark={d} />
        </View>

        {/* Encouragement */}
        <View style={card}>
          <SectionHead icon={<Sparkles size={18} color={T.white} strokeWidth={2} />} bg={T.blue} title="Encouragement" description="3 rotating messages · Wed, Thu & Fri" />
          <Divider dark={d} />
          <ReminderRow label="Weekly Messages" sublabel="Motivational reminders at 2:00 PM" enabled={encouragementEnabled} onToggle={setEncouragementEnabled} masterEnabled={notificationsEnabled} dark={d} />
        </View>

        {/* Actions */}
        <View style={{ marginTop: 4 }}>
          <TouchableOpacity style={[s.saveBtn, (!hasChanges || isLoading) && s.saveBtnDisabled]} onPress={handleSave} disabled={!hasChanges || isLoading} activeOpacity={0.8}>
            <Save size={17} color={T.white} strokeWidth={2.5} />
            <Text style={s.saveBtnText}>{isLoading ? 'Saving…' : 'Save changes'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.resetBtn, d && { backgroundColor: T.dark700 }]} onPress={handleReset} disabled={isLoading} activeOpacity={0.7}>
            <RotateCcw size={15} color={d ? T.darkMuted : T.slate400} strokeWidth={2.5} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: d ? T.darkMuted : T.slate400 }}>Reset to defaults</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {timePicker.show && (
        <>
          {Platform.OS === 'ios' && (
            <View style={pk.overlay}>
              <View style={[pk.sheet, d && { backgroundColor: T.dark800 }]}>
                <View style={[pk.handle, { backgroundColor: d ? T.dark600 : '#E2E8F0' }]} />
                <View style={pk.header}>
                  <TouchableOpacity onPress={dismissTimePicker}>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: d ? T.darkMuted : T.slate500 }}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: d ? T.darkText : T.slate900 }}>Set Time</Text>
                  <TouchableOpacity onPress={dismissTimePicker}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: T.emerald }}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker value={timePicker.value} mode="time" is24Hour display="spinner" onChange={onTimeChange} textColor={d ? T.darkText : T.slate900} />
              </View>
            </View>
          )}
          {Platform.OS === 'android' && (
            <DateTimePicker value={timePicker.value} mode="time" is24Hour display="default" onChange={onTimeChange} />
          )}
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F1F5F9' },
  rootDark: { backgroundColor: '#0D1117' },
  scroll: { paddingHorizontal: 16, paddingTop: 16 },
  masterCard: { borderRadius: 20, padding: 16, marginBottom: 14, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E2E8F0', ...Platform.select({ ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12 }, android: { elevation: 2 } }) },
  masterCardDark: { backgroundColor: '#161B22', borderColor: '#30363D' },
  masterCardActive: { borderColor: '#059669' },
  masterIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  card: { borderRadius: 20, padding: 16, marginBottom: 14, backgroundColor: '#FFFFFF', ...Platform.select({ ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 12 }, android: { elevation: 2 } }) },
  cardDark: { backgroundColor: '#161B22' },
  permBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, marginTop: 10 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: 16, backgroundColor: '#059669', marginBottom: 10, ...Platform.select({ ios: { shadowColor: '#059669', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 4 } }) },
  saveBtnDisabled: { backgroundColor: '#E2E8F0', shadowOpacity: 0, elevation: 0 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.1 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 13, borderRadius: 16, backgroundColor: '#F1F5F9' },
});

const pk = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: Platform.OS === 'ios' ? 36 : 24 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
});