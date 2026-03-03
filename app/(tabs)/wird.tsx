import React, { useState, useCallback, useMemo, useContext, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Animated, Platform,
} from 'react-native';
import {
  RotateCcw, Settings, Info, CheckCircle, Award, Flame, Target,
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
import OpeningBanner,    { DhikrRow }        from '../../components/OpeningBanner';
import CompletionBanner                       from '../../components/CompletionBanner';

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

const DHIKR_KEYS = ['istighfar', 'salatFatih', 'tahlil'] as const;
const TARGETS    = [WIRD_TARGETS.istighfar, WIRD_TARGETS.salatFatih, WIRD_TARGETS.tahlil];
const BLESSINGS  = [
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
  wrap:        { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginHorizontal: 16, marginTop: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
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
    // Session reset (new round) — unlock timer so it can be used again
    if (!isWirdComplete && prevIsComplete.current) {
      timer.reset();
      setTimerSaved(false);
    }
    if (!isWirdComplete) prevIsComplete.current = false;
  }, [isWirdComplete]);

  // ── OpeningBanner rows ─────────────────────────────────────────────────────
  const openingRows: DhikrRow[] = useMemo(() => [
    { arabic: 'أَسْتَغْفِرُ اللّٰهَ',      label: `Istighfār — ${WIRD_TARGETS.istighfar}×`,    icon: '🌿' },
    { arabic: salawat.arabic.slice(0, 38) + '…', label: `${salawat.title} — ${WIRD_TARGETS.salatFatih}×`, icon: '✨' },
    { arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ', label: `Tahlīl — ${WIRD_TARGETS.tahlil}×`,          icon: '💎' },
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
    if (state.wird[DHIKR_KEYS[i]] >= TARGETS[i]) return 'completed';
    if (i === 0 || state.wird[DHIKR_KEYS[i - 1]] >= TARGETS[i - 1]) return 'active';
    return 'disabled';
  }, [state.wird]);

  const playAudio = useCallback((type: string) => {
    if (state.settings.audioEnabled) console.log(`Playing audio for ${type}`);
  }, [state.settings.audioEnabled]);

  const menuActions = [
    { key: 'info',     label: 'Wird Information', icon: <Info     color="#059669" size={16} strokeWidth={2} />,   onPress: () => setShowInfoModal(true) },
    { key: 'settings', label: 'Wird Settings',    icon: <Settings color="#059669" size={16} strokeWidth={2} />,   onPress: () => setShowSettingsModal(true), dividerAfter: true },
    { key: 'reset',    label: 'Reset All Dhikr',  icon: <RotateCcw color="#EF4444" size={16} strokeWidth={2.5} />, onPress: handleResetAll, destructive: true },
  ];
  useRegisterHeaderActions('/wird', menuActions);

  return (
    <View style={[styles.root, dark && styles.rootDark]}>
      <MinimalHeader
        title="Wird Tijāni" subtitle="Daily litany"
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

        {/* <View style={styles.progressWrap}>
          <View style={[styles.progressTrack, dark && styles.progressTrackDark]}>
            <Animated.View style={[styles.progressFill, { width: `${progress}%` }, progress >= 100 && styles.progressComplete]} />
          </View>
          <Text style={[styles.progressLabel, dark && styles.progressLabelDark]}>Overall Wird progress</Text>
        </View> */}

        {isWirdComplete && !showCompletionModal && (
          <TouchableOpacity style={[styles.pill, dark && styles.pillDark]} onPress={() => setShowCompletionModal(true)} activeOpacity={0.85}>
            <Award color="#F59E0B" size={16} strokeWidth={2} />
            <Text style={styles.pillText}>Wird Complete — tap to record</Text>
            <CheckCircle color="#059669" size={16} strokeWidth={2.5} />
          </TouchableOpacity>
        )}

        <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View onLayout={registerCard(0)}>
            <DhikrCard
              title={DHIKR_DATA.istighfar.title} arabic={DHIKR_DATA.istighfar.arabic}
              transliteration={DHIKR_DATA.istighfar.transliteration} translation={DHIKR_DATA.istighfar.translation}
              count={state.wird.istighfar} target={WIRD_TARGETS.istighfar}
              onIncrement={() => handleIncrement('istighfar')} onDecrement={() => handleDecrement('istighfar')}
              onReset={() => handleReset('istighfar', DHIKR_DATA.istighfar.title)} onPlayAudio={() => playAudio('istighfar')}
              status={getStepStatus(0)} blessing={BLESSINGS[0]}
            />
          </View>
          <View onLayout={registerCard(1)}>
            <DhikrCard
              title={salawat.title} arabic={salawat.arabic}
              transliteration={salawat.transliteration} translation={salawat.translation}
              count={state.wird.salatFatih} target={WIRD_TARGETS.salatFatih}
              onIncrement={() => handleIncrement('salatFatih')} onDecrement={() => handleDecrement('salatFatih')}
              onReset={() => handleReset('salatFatih', salawat.title)} onPlayAudio={() => playAudio('salatFatih')}
              status={getStepStatus(1)} blessing={BLESSINGS[1]}
            />
          </View>
          <View onLayout={registerCard(2)}>
            <DhikrCard
              title={DHIKR_DATA.tahlil.title} arabic={DHIKR_DATA.tahlil.arabic}
              transliteration={DHIKR_DATA.tahlil.transliteration} translation={DHIKR_DATA.tahlil.translation}
              count={state.wird.tahlil} target={WIRD_TARGETS.tahlil}
              onIncrement={() => handleIncrement('tahlil')} onDecrement={() => handleDecrement('tahlil')}
              onReset={() => handleReset('tahlil', DHIKR_DATA.tahlil.title)} onPlayAudio={() => playAudio('tahlil')}
              status={getStepStatus(2)} blessing={BLESSINGS[2]}
            />
          </View>
          <Instructions dark={dark} />
          <View style={styles.bottomSpace} />
        </ScrollView>
      </ScreenBackground>

      <WirdInfoModal     visible={showInfoModal}     onClose={() => setShowInfoModal(false)}     darkMode={dark} />
      <WirdSettingsModal visible={showSettingsModal} onClose={() => setShowSettingsModal(false)} darkMode={dark} />

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
          // hadith="Whoever perseveres in the Wird, Allah provides from where he does not expect, and opens the doors of nearness."
          confirmLabel="Record Completion"
          onComplete={handleCompleteWird}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:               { flex: 1, backgroundColor: '#F8FAFC' },
  rootDark:           { backgroundColor: '#0F172A' },
  progressWrap:       { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  progressTrack:      { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressTrackDark:  { backgroundColor: '#334155' },
  progressFill:       { height: '100%', backgroundColor: '#059669', borderRadius: 4 },
  progressComplete:   { backgroundColor: '#F59E0B' },
  progressLabel:      { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  progressLabelDark:  { color: '#64748B' },
  pill:               { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginBottom: 8, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 14, backgroundColor: '#F0FDF4', borderWidth: 1.5, borderColor: '#A7F3D0' },
  pillDark:           { backgroundColor: '#052E16', borderColor: '#065F46' },
  pillText:           { flex: 1, fontSize: 13, fontWeight: '700', color: '#059669' },
  scroll:             { flex: 1 },
  scrollContent:      { paddingTop: 8 },
  bottomSpace:        { height: 32 },
});