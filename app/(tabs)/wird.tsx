import React, { useState, useCallback, useMemo, useContext, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Animated, Platform,
} from 'react-native';
import {
  RotateCcw, Settings, Info, CheckCircle, Award, Flame, Target, Palette,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import DhikrCard from '../../components/DhikrCard';
import { useApp, WIRD_TARGETS } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import WirdInfoModal from '../../components/WirdInfoModal';
import WirdSettingsModal from '../../components/WirdSettingsModal';
import StatsBar from '../../components/StatsBar';
import { useAutoScroll } from '@/components/hooks/useAutoScroll';
import { usePracticeTimer } from '@/components/hooks/usePracticeTimer';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';
import MinimalHeader from '../../components/MinimalHeader';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import OpeningBanner, { DhikrRow } from '../../components/OpeningBanner';
import CompletionBanner from '../../components/CompletionBanner';
import CardStylePicker from '../../components/CardStylePicker';

// ─── Constants ────────────────────────────────────────────────────────────────

const DHIKR_DATA = {
  istighfar: {
    title: 'Istighfār',
    arabic: 'أَسْتَغْفِرُ اللّٰهَ',
    transliteration: 'Astaghfiru Llāh',
    translation: 'I seek forgiveness from Allah',
  },
  tahlil: {
    title: 'Tahlīl',
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
    transliteration: 'Lā ilāha illa Llāh',
    translation: 'There is no god but Allah',
  },
} as const;

const DHIKR_KEYS  = ['istighfar', 'salatFatih', 'tahlil'] as const;
const TARGETS     = [WIRD_TARGETS.istighfar, WIRD_TARGETS.salatFatih, WIRD_TARGETS.tahlil];
const BLESSINGS   = [
  '',
  'سبحان ربك رب العزة عما يصفون . وسلام على المرسلين . والحمد لله رب العالمين',
  'سيدنا محمد رسول الله عليه السلام',
];

const AUTOSCROLL_DELAYS: number[] = [700, 4000, 700];

// ─── Instructions ─────────────────────────────────────────────────────────────

function Instructions({ dark }: { dark: boolean }) {
  return (
    <View style={[instr.wrap, dark && instr.wrapDark]}>
      <View style={instr.header}>
        <Text style={instr.emoji}>📿</Text>
        <Text style={[instr.title, dark && instr.titleDark]}>Wird Recitation Times</Text>
      </View>
      {[
        { icon: '🌅', text: 'After Fajr prayer (morning)' },
        { icon: '🌆', text: 'After Asr prayer (evening)' },
        { icon: '🔢', text: 'Complete each dhikr in sequence' },
      ].map((item, i) => (
        <View key={i} style={instr.row}>
          <Text style={instr.rowIcon}>{item.icon}</Text>
          <Text style={[instr.rowText, dark && instr.rowTextDark]}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}

const instr = StyleSheet.create({
  wrap:        { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginHorizontal: 16, marginTop: 8, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  wrapDark:    { backgroundColor: '#1E293B', borderColor: '#334155' },
  header:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  emoji:       { fontSize: 20 },
  title:       { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  titleDark:   { color: '#F8FAFC' },
  row:         { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  rowIcon:     { fontSize: 16 },
  rowText:     { fontSize: 14, color: '#64748B', flex: 1, lineHeight: 20 },
  rowTextDark: { color: '#94A3B8' },
});

// ─── Card Style Modal ─────────────────────────────────────────────────────────
// A lightweight bottom-sheet-style modal wrapping the CardStylePicker.
// Uses a plain Modal so it works without any sheet library.

import { Modal } from 'react-native';

interface CardStyleModalProps {
  visible: boolean;
  onClose: () => void;
  dark: boolean;
}

function CardStyleModal({ visible, onClose, dark }: CardStyleModalProps) {
  const bg      = dark ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.45)';
  const sheetBg = dark ? '#0C1510' : '#F9F7F2';
  const divider = dark ? '#1C2E22' : '#DDD8CC';
  const textCol = dark ? '#DFF0E8' : '#1A2520';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={[csm.overlay, { backgroundColor: bg }]}
        onPress={onClose}
        activeOpacity={1}
      >
        {/* Tapping the sheet itself should not close the modal */}
        <TouchableOpacity
          activeOpacity={1}
          style={[csm.sheet, { backgroundColor: sheetBg }]}
          onPress={e => e.stopPropagation()}
        >
          {/* Handle */}
          <View style={[csm.handle, { backgroundColor: divider }]} />

          <Text style={[csm.sheetTitle, { color: textCol }]}>Card Style</Text>
          <Text style={[csm.sheetSub, { color: dark ? '#3D6050' : '#8FA499' }]}>
            Choose how your Dhikr cards look
          </Text>

          <View style={csm.pickerWrap}>
            <CardStylePicker onSelect={onClose} />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const csm = StyleSheet.create({
  overlay:    { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingTop: 12, paddingBottom: 40, paddingHorizontal: 20,
  },
  handle:     { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  sheetTitle: { fontSize: 18, fontWeight: '800', letterSpacing: 0.2, marginBottom: 4 },
  sheetSub:   { fontSize: 13, fontWeight: '500', marginBottom: 18 },
  pickerWrap: {},
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function WirdScreen() {
  const {
    state, dispatch, isWirdComplete, getWirdProgress,
    getCurrentSalawatFormula, wirdCompletionsToday, isWirdFullyDoneToday,
  } = useApp();

  const [showInfoModal,       setShowInfoModal]       = useState(false);
  const [showSettingsModal,   setShowSettingsModal]   = useState(false);
  const [showOpeningBanner,   setShowOpeningBanner]   = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showCardStyleModal,  setShowCardStyleModal]  = useState(false);
  const [timerSaved,          setTimerSaved]          = useState(false);

  const { handleBack } = useContext(LayoutActionsContext);
  const dark    = state.settings.darkMode;
  const salawat = getCurrentSalawatFormula();

  // ── Timer ──────────────────────────────────────────────────────────────────
  const timer = usePracticeTimer();

  // ── Derived stats ──────────────────────────────────────────────────────────
  const completedCount = useMemo(
    () => DHIKR_KEYS.filter((k, i) => state.wird[k] >= TARGETS[i]).length,
    [state.wird],
  );
  const progress    = useMemo(() => getWirdProgress(), [state.wird]);
  const progressPct = Math.round(progress);

  const completions = useMemo(() => [
    state.wird.istighfar  >= WIRD_TARGETS.istighfar,
    state.wird.salatFatih >= WIRD_TARGETS.salatFatih,
    state.wird.tahlil     >= WIRD_TARGETS.tahlil,
  ], [state.wird]);

  const { scrollRef, registerCard } = useAutoScroll(completions, AUTOSCROLL_DELAYS);

  // ── Auto-show completion modal ─────────────────────────────────────────────
  const prevIsComplete = useRef(false);
  useEffect(() => {
    if (isWirdComplete && !prevIsComplete.current) {
      const t = setTimeout(() => setShowCompletionModal(true), 650);
      prevIsComplete.current = true;
      return () => clearTimeout(t);
    }
    if (!isWirdComplete && prevIsComplete.current) {
      timer.reset();
      setTimerSaved(false);
    }
    if (!isWirdComplete) prevIsComplete.current = false;
  }, [isWirdComplete]);

  // ── OpeningBanner rows ─────────────────────────────────────────────────────
  const openingRows: DhikrRow[] = useMemo(() => [
    { arabic: 'أَسْتَغْفِرُ اللّٰهَ',       label: `Istighfār — ${WIRD_TARGETS.istighfar}×`,     icon: '🌿' },
    { arabic: salawat.arabic.slice(0, 38) + '…', label: `${salawat.title} — ${WIRD_TARGETS.salatFatih}×`, icon: '✨' },
    { arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ', label: `Tahlīl — ${WIRD_TARGETS.tahlil}×`,            icon: '💎' },
  ], [salawat]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const haptic = (type: 'light' | 'medium' | 'success' = 'light') => {
    if (Platform.OS !== 'ios') return;
    if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (type === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleResetAll = useCallback(() => {
    haptic('medium');
    Alert.alert('Reset All', 'Are you sure you want to reset all dhikr counts?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset', style: 'destructive', onPress: () => {
          dispatch({ type: 'RESET_ALL_WIRD' });
          timer.reset();
          setTimerSaved(false);
        },
      },
    ]);
  }, [dispatch, timer]);

  const handleCompleteWird = useCallback(() => {
    if (!isWirdComplete) return;
    haptic('success');
    const duration = timer.stop();
    dispatch({ type: 'COMPLETE_WIRD', duration });
    setTimerSaved(true);
    setShowCompletionModal(false);
    Alert.alert('Wird Recorded 🎉', 'May Allah accept your dhikr.', [{ text: 'Alhamdulillah' }]);
  }, [isWirdComplete, dispatch, timer]);

  const handleIncrement = useCallback(
    (k: keyof typeof state.wird) => dispatch({ type: 'INCREMENT_WIRD', dhikr: k }),
    [dispatch],
  );
  const handleDecrement = useCallback(
    (k: keyof typeof state.wird) => dispatch({ type: 'DECREMENT_WIRD', dhikr: k }),
    [dispatch],
  );
  const handleReset = useCallback((k: keyof typeof state.wird, title: string) => {
    haptic('medium');
    Alert.alert('Reset Dhikr', `Are you sure you want to reset ${title}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'RESET_WIRD', dhikr: k }) },
    ]);
  }, [dispatch]);

  const getStepStatus = useCallback((i: number) => {
    if (state.wird[DHIKR_KEYS[i]] >= TARGETS[i])                                     return 'completed';
    if (i === 0 || state.wird[DHIKR_KEYS[i - 1]] >= TARGETS[i - 1])                 return 'active';
    return 'disabled';
  }, [state.wird]);

  const getPrevStepTitle = useCallback((i: number): string | undefined => {
    if (i === 0) return undefined;
    if (i === 1) return DHIKR_DATA.istighfar.title;
    if (i === 2) return salawat.title;
    return undefined;
  }, [salawat]);

  const playAudio = useCallback((type: string) => {
    if (state.settings.audioEnabled) console.log(`Playing audio for ${type}`);
  }, [state.settings.audioEnabled]);

  // ── Menu actions ───────────────────────────────────────────────────────────
  // The "Card Style" item opens a modal sheet with the inline CardStylePicker.
  const menuActions = [
    {
      key:    'info',
      label:  'Wird Information',
      icon:   <Info     color="#059669" size={16} strokeWidth={2} />,
      onPress: () => setShowInfoModal(true),
    },
    {
      key:    'settings',
      label:  'Wird Settings',
      icon:   <Settings color="#059669" size={16} strokeWidth={2} />,
      onPress: () => setShowSettingsModal(true),
    },
    {
      key:         'cardStyle',
      label:       'Card Style',
      icon:        <Palette color="#059669" size={16} strokeWidth={2} />,
      onPress:     () => setShowCardStyleModal(true),
      dividerAfter: true,   // separator before destructive action
    },
    {
      key:         'reset',
      label:       'Reset All Dhikr',
      icon:        <RotateCcw color="#EF4444" size={16} strokeWidth={2.5} />,
      onPress:     handleResetAll,
      destructive: true,
    },
  ];
  useRegisterHeaderActions('/wird', menuActions);

  return (
    <View style={[styles.root, dark && styles.rootDark]}>
      <MinimalHeader
        title="Lāzim Tijāni" subtitle="Daily litany"
        onBackPress={handleBack} showMore menuActions={menuActions} theme="default"
      />

      <ScreenBackground>
        <StatsBar
          dark={dark}
          stats={[
            { icon: <Target color="#059669" size={13} strokeWidth={2.5} />, value: `${completedCount}/3`, label: 'Completed', color: '#059669' },
            { icon: <Flame  color="#F59E0B" size={13} strokeWidth={2.5} />, value: `${progressPct}%`,    label: 'Progress',  color: '#F59E0B' },
          ]}
          timer={{
            formatted:  timer.formatted,
            isRunning:  timer.isRunning,
            isComplete: timerSaved,
            onToggle:   timer.toggle,
            color:      '#059669',
          }}
        />

        {/* "Record completion" pill — appears after all 3 done */}
        {isWirdComplete && !showCompletionModal && (
          <TouchableOpacity
            style={[styles.pill, dark && styles.pillDark]}
            onPress={() => setShowCompletionModal(true)}
            activeOpacity={0.85}
          >
            <Award color="#F59E0B" size={16} strokeWidth={2} />
            <Text style={styles.pillText}>Wird Complete — tap to record</Text>
            <CheckCircle color="#059669" size={16} strokeWidth={2.5} />
          </TouchableOpacity>
        )}

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Step 1: Istighfār ── */}
          <View onLayout={registerCard(0)}>
            <DhikrCard
              title={DHIKR_DATA.istighfar.title}
              arabic={DHIKR_DATA.istighfar.arabic}
              transliteration={DHIKR_DATA.istighfar.transliteration}
              translation={DHIKR_DATA.istighfar.translation}
              count={state.wird.istighfar}
              target={WIRD_TARGETS.istighfar}
              stepNumber={1}
              totalSteps={3}
              prevStepTitle={getPrevStepTitle(0)}
              onIncrement={() => handleIncrement('istighfar')}
              onDecrement={() => handleDecrement('istighfar')}
              onReset={() => handleReset('istighfar', DHIKR_DATA.istighfar.title)}
              onPlayAudio={() => playAudio('istighfar')}
              status={getStepStatus(0)}
              blessing={BLESSINGS[0]}
            />
          </View>

          {/* ── Step 2: Ṣalāt al-Fātiḥ ── */}
          <View onLayout={registerCard(1)}>
            <DhikrCard
              title={salawat.title}
              arabic={salawat.arabic}
              transliteration={salawat.transliteration}
              translation={salawat.translation}
              count={state.wird.salatFatih}
              target={WIRD_TARGETS.salatFatih}
              stepNumber={2}
              totalSteps={3}
              prevStepTitle={getPrevStepTitle(1)}
              onIncrement={() => handleIncrement('salatFatih')}
              onDecrement={() => handleDecrement('salatFatih')}
              onReset={() => handleReset('salatFatih', salawat.title)}
              onPlayAudio={() => playAudio('salatFatih')}
              status={getStepStatus(1)}
              blessing={BLESSINGS[1]}
            />
          </View>

          {/* ── Step 3: Tahlīl ── */}
          <View onLayout={registerCard(2)}>
            <DhikrCard
              title={DHIKR_DATA.tahlil.title}
              arabic={DHIKR_DATA.tahlil.arabic}
              transliteration={DHIKR_DATA.tahlil.transliteration}
              translation={DHIKR_DATA.tahlil.translation}
              count={state.wird.tahlil}
              target={WIRD_TARGETS.tahlil}
              stepNumber={3}
              totalSteps={3}
              prevStepTitle={getPrevStepTitle(2)}
              onIncrement={() => handleIncrement('tahlil')}
              onDecrement={() => handleDecrement('tahlil')}
              onReset={() => handleReset('tahlil', DHIKR_DATA.tahlil.title)}
              onPlayAudio={() => playAudio('tahlil')}
              status={getStepStatus(2)}
              blessing={BLESSINGS[2]}
            />
          </View>

          <Instructions dark={dark} />
          <View style={styles.bottomSpace} />
        </ScrollView>
      </ScreenBackground>

      {/* ── Modals ── */}
      <WirdInfoModal     visible={showInfoModal}     onClose={() => setShowInfoModal(false)}     darkMode={dark} />
      <WirdSettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} darkMode={dark} />

      {/* Card Style picker modal */}
      <CardStyleModal
        visible={showCardStyleModal}
        onClose={() => setShowCardStyleModal(false)}
        dark={dark}
      />

      {showOpeningBanner && (
        <OpeningBanner
          theme="wird"
          titleArabic="الوِرْدُ التِّيجَانِي"
          titleLatin="Wird Tijānī"
          subtitle="Daily Litany of the Tijāniyya"
          instruction={`Recite after Fajr and Asr.\nComplete each dhikr fully before moving to the next.`}
          beginLabel="Begin Wird"
          dhikrRows={openingRows}
          streak={state.streak ?? 0}
          completionsToday={wirdCompletionsToday}
          targetPerDay={state.frequencySettings.wirdPerDay}
          isFullyDoneToday={isWirdFullyDoneToday}
          onClose={() => setShowOpeningBanner(false)}
        />
      )}

      {showCompletionModal && (
        <CompletionBanner
          theme="wird"
          titleArabic="الحمد لله"
          titleLatin="Alḥamdulillāh"
          practiceName="Wird"
          completionsToday={wirdCompletionsToday}
          targetPerDay={state.frequencySettings.wirdPerDay}
          streak={state.streak ?? 0}
          confirmLabel="Record Completion"
          onComplete={handleCompleteWird}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1, backgroundColor: '#F8FAFC' },
  rootDark:     { backgroundColor: '#0F172A' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginBottom: 6,
    paddingHorizontal: 16, paddingVertical: 11,
    borderRadius: 14, backgroundColor: '#F0FDF4',
    borderWidth: 1.5, borderColor: '#A7F3D0',
  },
  pillDark:     { backgroundColor: '#052E16', borderColor: '#065F46' },
  pillText:     { flex: 1, fontSize: 13, fontWeight: '700', color: '#059669' },
  scroll:       { flex: 1 },
  scrollContent:{ paddingTop: 6 },
  bottomSpace:  { height: 32 },
});