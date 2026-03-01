import React, { useState, useCallback, useMemo, useContext, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Animated, Platform,
} from 'react-native';
import {
  RotateCcw, Settings, Info, CheckCircle, Award, Flame, Moon, Target,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import DhikrCard from '../../components/DhikrCard';
import { useApp } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import HadraInfoModal from '../../components/HadraInfoModal';
import HadraSettingsModal from '../../components/HadraSettingsModal';
import StatsBar from '../../components/StatsBar';
import { useAutoScroll } from '@/components/hooks/useAutoScroll';
import { usePracticeTimer } from '@/components/hooks/usePracticeTimer';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';
import MinimalHeader from '../../components/MinimalHeader';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import OpeningBanner,    { DhikrRow }        from '../../components/OpeningBanner';
import CompletionBanner                       from '../../components/CompletionBanner';

// ─── Constants ────────────────────────────────────────────────────────────────

const HADRA_DHIKR = {
  tahlil: {
    title: 'Tahlīl',
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
    transliteration: 'Lā ilāha illa Llāh',
    translation: 'There is no god but Allah',
  },
  ismuLlah: {
    title: 'Ism Allāh',
    arabic: 'اللّٰهُ',
    transliteration: 'Allah',
    translation: 'Allah',
  },
} as const;

const DHIKR_KEYS = ['tahlil', 'ismuLlah'] as const;

const AUTOSCROLL_DELAYS: number[] = [2000, 700];

// ─── Instructions ─────────────────────────────────────────────────────────────

function Instructions({ dark }: { dark: boolean }) {
  return (
    <View style={[instr.wrap, dark && instr.wrapDark]}>
      <View style={instr.header}>
        <Text style={instr.emoji}>🌙</Text>
        <Text style={[instr.title, dark && instr.titleDark]}>Hadra Joumou'a Guidelines</Text>
      </View>
      {[
        { icon: '🕌', text: 'Typically performed on Fridays after Maghrib' },
        { icon: '👥', text: 'Best practiced in congregation' },
        { icon: '🔢', text: 'Complete each dhikr sequentially' },
        { icon: '⚙️', text: 'Customize target numbers in settings' },
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

export default function HadraScreen() {
  const {
    state, dispatch, isHadraComplete, getHadraProgress,
    hadraCompletionsToday, isHadraFullyDoneToday,
  } = useApp();

  const [showSettings,        setShowSettings]        = useState(false);
  const [showInfoModal,       setShowInfoModal]       = useState(false);
  const [showOpeningBanner,   setShowOpeningBanner]   = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [timerSaved,          setTimerSaved]          = useState(false);

  const { handleBack } = useContext(LayoutActionsContext);
  const dark = state.settings.darkMode;

  // ── Timer ──────────────────────────────────────────────────────────────────
  const timer = usePracticeTimer();

  const targets = useMemo(() => [
    state.hadraTargets.tahlil,
    state.hadraTargets.ismuLlah,
  ], [state.hadraTargets]);

  const completedCount = useMemo(
    () => DHIKR_KEYS.filter((k, i) => state.hadra[k] >= targets[i]).length,
    [state.hadra, targets],
  );
  const progress    = useMemo(() => getHadraProgress(), [state.hadra, state.hadraTargets]);
  const progressPct = Math.round(progress);

  const completions = useMemo(() => [
    state.hadra.tahlil   >= state.hadraTargets.tahlil,
    state.hadra.ismuLlah >= state.hadraTargets.ismuLlah,
  ], [state.hadra, state.hadraTargets]);

  const { scrollRef, registerCard } = useAutoScroll(completions, AUTOSCROLL_DELAYS);

  // ── Auto-show completion modal ─────────────────────────────────────────────
  const prevIsComplete = useRef(false);
  useEffect(() => {
    if (isHadraComplete && !prevIsComplete.current) {
      const t = setTimeout(() => setShowCompletionModal(true), 650);
      prevIsComplete.current = true;
      return () => clearTimeout(t);
    }
    // Session reset (new round) — unlock timer so it can be used again
    if (!isHadraComplete && prevIsComplete.current) {
      timer.reset();
      setTimerSaved(false);
    }
    if (!isHadraComplete) prevIsComplete.current = false;
  }, [isHadraComplete]);

  // ── OpeningBanner rows ─────────────────────────────────────────────────────
  const openingRows: DhikrRow[] = useMemo(() => [
    { arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ', label: `Tahlīl — ${state.hadraTargets.tahlil}×`,    icon: '💎' },
    { arabic: 'اللّٰهُ',                     label: `Ism Allāh — ${state.hadraTargets.ismuLlah}×`, icon: '🌟' },
  ], [state.hadraTargets]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const getStepStatus = useCallback((i: number) => {
    if (state.hadra[DHIKR_KEYS[i]] >= targets[i]) return 'completed';
    if (i === 0 || state.hadra[DHIKR_KEYS[i - 1]] >= targets[i - 1]) return 'active';
    return 'disabled';
  }, [state.hadra, targets]);

  const haptic = (type: 'light' | 'medium' | 'success' = 'light') => {
    if (Platform.OS !== 'ios') return;
    if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (type === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleResetAll = useCallback(() => {
    Alert.alert('Reset All', 'Are you sure you want to reset all hadra counts?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset', style: 'destructive', onPress: () => {
          dispatch({ type: 'RESET_ALL_HADRA' });
          timer.reset();
          setTimerSaved(false);
        },
      },
    ]);
  }, [dispatch, timer]);

  const handleCompleteHadra = useCallback(() => {
    if (!isHadraComplete) return;
    haptic('success');
    const duration = timer.stop();
    dispatch({ type: 'COMPLETE_HADRA', duration });
    setTimerSaved(true);
    setShowCompletionModal(false);
    Alert.alert('Hadra Recorded 🎉', 'May Allah accept your dhikr.', [{ text: 'Alhamdulillah' }]);
  }, [isHadraComplete, dispatch, timer]);

  const handleIncrement = useCallback(
    (k: keyof typeof state.hadra) => dispatch({ type: 'INCREMENT_HADRA', dhikr: k }),
    [dispatch],
  );
  const handleDecrement = useCallback(
    (k: keyof typeof state.hadra) => dispatch({ type: 'DECREMENT_HADRA', dhikr: k }),
    [dispatch],
  );
  const handleReset = useCallback((k: keyof typeof state.hadra, title: string) => {
    Alert.alert('Reset Dhikr', `Are you sure you want to reset ${title}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'RESET_HADRA', dhikr: k }) },
    ]);
  }, [dispatch]);

  const handleSaveSettings = useCallback((newTargets: { tahlil: number; ismuLlah: number }) => {
    dispatch({ type: 'UPDATE_HADRA_TARGETS', targets: newTargets });
    Alert.alert('Settings Saved', 'Your hadra targets have been updated.', [{ text: 'OK' }]);
  }, [dispatch]);

  const playAudio = useCallback((type: string) => {
    if (state.settings.audioEnabled) console.log(`Playing audio for ${type}`);
  }, [state.settings.audioEnabled]);

  const menuActions = [
    { key: 'info',     label: 'Hadra Information', icon: <Info     color="#7C3AED" size={16} strokeWidth={2} />,   onPress: () => setShowInfoModal(true) },
    { key: 'settings', label: 'Hadra Settings',    icon: <Settings color="#7C3AED" size={16} strokeWidth={2} />,   onPress: () => setShowSettings(true), dividerAfter: true },
    { key: 'reset',    label: 'Reset All Dhikr',   icon: <RotateCcw color="#EF4444" size={16} strokeWidth={2.5} />, onPress: handleResetAll, destructive: true },
  ];
  useRegisterHeaderActions('/hadra', menuActions);

  return (
    <View style={[styles.root, dark && styles.rootDark]}>
      <MinimalHeader
        title="Ḥaḍra Joumouʿa" subtitle="Friday gathering"
        onBackPress={handleBack} showMore menuActions={menuActions} theme="default"
      />

      <ScreenBackground>
        <StatsBar
          dark={dark}
          stats={[
            { icon: <Target color="#7C3AED" size={13} strokeWidth={2.5} />, value: `${completedCount}/2`, label: 'Completed', color: '#7C3AED' },
            { icon: <Flame  color="#F59E0B" size={13} strokeWidth={2.5} />, value: `${progressPct}%`,    label: 'Progress',  color: '#F59E0B' },
          ]}
          timer={{
            formatted:  timer.formatted,
            isRunning:  timer.isRunning,
            isComplete: timerSaved,
            onToggle:   timer.toggle,
            color:      '#0891B2',
          }}
        />

        <View style={styles.progressWrap}>
          <View style={[styles.progressTrack, dark && styles.progressTrackDark]}>
            <Animated.View style={[styles.progressFill, { width: `${progress}%` }, progress >= 100 && styles.progressComplete]} />
          </View>
          <Text style={[styles.progressLabel, dark && styles.progressLabelDark]}>Overall Hadra progress</Text>
        </View>

        {isHadraComplete && !showCompletionModal && (
          <TouchableOpacity style={[styles.pill, dark && styles.pillDark]} onPress={() => setShowCompletionModal(true)} activeOpacity={0.85}>
            <Award color="#F59E0B" size={16} strokeWidth={2} />
            <Text style={styles.pillText}>Hadra Complete — tap to record</Text>
            <CheckCircle color="#7C3AED" size={16} strokeWidth={2.5} />
          </TouchableOpacity>
        )}

        <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View onLayout={registerCard(0)}>
            <DhikrCard
              title={`${HADRA_DHIKR.tahlil.title} (${state.hadraTargets.tahlil}x)`}
              arabic={HADRA_DHIKR.tahlil.arabic}
              transliteration={HADRA_DHIKR.tahlil.transliteration} translation={HADRA_DHIKR.tahlil.translation}
              count={state.hadra.tahlil} target={state.hadraTargets.tahlil}
              onIncrement={() => handleIncrement('tahlil')} onDecrement={() => handleDecrement('tahlil')}
              onReset={() => handleReset('tahlil', `Tahlīl (${state.hadraTargets.tahlil}x)`)} onPlayAudio={() => playAudio('tahlil')}
              status={getStepStatus(0)} blessing="سيدنا محمد رسول الله عليه السلام"
            />
          </View>
          <View onLayout={registerCard(1)}>
            <DhikrCard
              title={`${HADRA_DHIKR.ismuLlah.title} (${state.hadraTargets.ismuLlah}x)`}
              arabic={HADRA_DHIKR.ismuLlah.arabic}
              transliteration={HADRA_DHIKR.ismuLlah.transliteration} translation={HADRA_DHIKR.ismuLlah.translation}
              count={state.hadra.ismuLlah} target={state.hadraTargets.ismuLlah}
              onIncrement={() => handleIncrement('ismuLlah')} onDecrement={() => handleDecrement('ismuLlah')}
              onReset={() => handleReset('ismuLlah', `Ism Allāh (${state.hadraTargets.ismuLlah}x)`)} onPlayAudio={() => playAudio('ismuLlah')}
              status={getStepStatus(1)} blessing="سيدنا محمد رسول الله عليه السلام"
            />
          </View>
          <Instructions dark={dark} />
          <View style={styles.bottomSpace} />
        </ScrollView>
      </ScreenBackground>

      <HadraSettingsModal
        visible={showSettings} onClose={() => setShowSettings(false)}
        currentTargets={state.hadraTargets} onSave={handleSaveSettings} darkMode={dark}
      />
      <HadraInfoModal visible={showInfoModal} onClose={() => setShowInfoModal(false)} darkMode={dark} />

      {showOpeningBanner && (
        <OpeningBanner
          theme="hadra"
          titleArabic="الحَضْرَةُ الجُمُعِيَّة"
          titleLatin="Ḥaḍra Joumouʿa"
          subtitle="Friday Gathering of Remembrance"
          instruction={`Performed on Fridays after Maghrib.\nBest in congregation — let the rhythm carry the heart.`}
          beginLabel="Begin Hadra"
          dhikrRows={openingRows}
          streak={state.streak ?? 0}
          completionsToday={hadraCompletionsToday}
          targetPerDay={state.frequencySettings.hadraPerDay}
          isFullyDoneToday={isHadraFullyDoneToday}
          onClose={() => setShowOpeningBanner(false)}
        />
      )}

      {showCompletionModal && (
        <CompletionBanner
          theme="hadra"
          titleArabic="الحمد لله"
          titleLatin="Alḥamdulillāh"
          practiceName="Hadra"
          completionsToday={hadraCompletionsToday}
          targetPerDay={state.frequencySettings.hadraPerDay}
          streak={state.streak ?? 0}
          hadith="The gathering of dhikr is a garden of Paradise. Whoever enters it is immersed in the mercy of Allah."
          confirmLabel="Record Completion"
          onComplete={handleCompleteHadra}
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
  progressFill:       { height: '100%', backgroundColor: '#7C3AED', borderRadius: 4 },
  progressComplete:   { backgroundColor: '#F59E0B' },
  progressLabel:      { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  progressLabelDark:  { color: '#64748B' },
  pill:               { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginBottom: 8, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 14, backgroundColor: '#F5F3FF', borderWidth: 1.5, borderColor: '#C4B5FD' },
  pillDark:           { backgroundColor: '#1E0A3C', borderColor: '#4C1D95' },
  pillText:           { flex: 1, fontSize: 13, fontWeight: '700', color: '#7C3AED' },
  scroll:             { flex: 1 },
  scrollContent:      { paddingTop: 8 },
  bottomSpace:        { height: 32 },
});