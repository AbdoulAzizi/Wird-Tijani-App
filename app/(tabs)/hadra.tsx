import React, { useState, useCallback, useMemo, useContext, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Modal, Platform,
} from 'react-native';
import {
  RotateCcw, Settings, Info, CheckCircle, Award, Flame, Target, Palette,
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
import OpeningBanner, { DhikrRow } from '../../components/OpeningBanner';
import CompletionBanner            from '../../components/CompletionBanner';
import CardStylePicker             from '../../components/CardStylePicker';

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
    transliteration: 'Allāh',
    translation: 'Allah — the Divine Name',
  },
} as const;

const DHIKR_KEYS = ['tahlil', 'ismuLlah'] as const;
const AUTOSCROLL_DELAYS: number[] = [2000, 700];

// ─── Card Style Modal ─────────────────────────────────────────────────────────

interface CardStyleModalProps {
  visible: boolean;
  onClose: () => void;
  dark: boolean;
}

function CardStyleModal({ visible, onClose, dark }: CardStyleModalProps) {
  const bg      = dark ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.45)';
  const sheetBg = dark ? '#060D12' : '#F0F9FF';
  const divider = dark ? '#164E63' : '#BAE6FD';
  const textCol = dark ? '#BAE6FD' : '#0C4A6E';

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
        <TouchableOpacity
          activeOpacity={1}
          style={[csm.sheet, { backgroundColor: sheetBg }]}
          onPress={e => e.stopPropagation()}
        >
          <View style={[csm.handle, { backgroundColor: divider }]} />
          <Text style={[csm.sheetTitle, { color: textCol }]}>Card Style</Text>
          <Text style={[csm.sheetSub, { color: dark ? '#0369A1' : '#38BDF8' }]}>
            Choose how your Dhikr cards look
          </Text>
          <CardStylePicker onSelect={onClose} />
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
});

// ─── Instructions ─────────────────────────────────────────────────────────────

function Instructions({ dark }: { dark: boolean }) {
  const items = [
    { icon: '🌙', text: 'Typically performed on Fridays between Asr and Maghrib' },
    { icon: '👥', text: 'Best practiced in congregation' },
    { icon: '🔢', text: 'Complete each dhikr sequentially' },
    { icon: '⚙️', text: 'Customize target numbers in settings' },
  ];
  return (
    <View style={[ins.wrap, dark && ins.wrapDark]}>
      <View style={ins.header}>
        <Text style={ins.emoji}>🌙</Text>
        <Text style={[ins.title, dark && ins.titleDark]}>Hadra Joumouʿa Guidelines</Text>
      </View>
      {items.map((item, i) => (
        <View key={i} style={ins.row}>
          <Text style={ins.icon}>{item.icon}</Text>
          <Text style={[ins.text, dark && ins.textDark]}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}

const ins = StyleSheet.create({
  wrap:     { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginHorizontal: 16, marginTop: 8, borderWidth: 1, borderColor: '#E0F2FE', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  wrapDark: { backgroundColor: '#0C1A24', borderColor: '#164E63' },
  header:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  emoji:    { fontSize: 20 },
  title:    { fontSize: 15, fontWeight: '700', color: '#0C4A6E' },
  titleDark:{ color: '#BAE6FD' },
  row:      { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  icon:     { fontSize: 15, lineHeight: 22 },
  text:     { fontSize: 13, color: '#0369A1', flex: 1, lineHeight: 20 },
  textDark: { color: '#7DD3FC' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function HadraScreen() {
  const {
    state, dispatch, isHadraComplete, getHadraProgress,
    hadraCompletionsToday, isHadraFullyDoneToday,
  } = useApp();

  const [showSettings,        setShowSettings]        = useState(false);
  const [showInfoModal,       setShowInfoModal]       = useState(false);
  const [showCardStyleModal,  setShowCardStyleModal]  = useState(false);  // ← NEW
  const [showOpeningBanner,   setShowOpeningBanner]   = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [timerSaved,          setTimerSaved]          = useState(false);

  const { handleBack } = useContext(LayoutActionsContext);
  const dark  = state.settings.darkMode;
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
    if (!isHadraComplete && prevIsComplete.current) { timer.reset(); setTimerSaved(false); }
    if (!isHadraComplete) prevIsComplete.current = false;
  }, [isHadraComplete]);

  const openingRows: DhikrRow[] = useMemo(() => [
    { arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ', label: `Tahlīl — ${state.hadraTargets.tahlil}×`,    icon: '💎' },
    { arabic: 'اللّٰهُ',                    label: `Ism Allāh — ${state.hadraTargets.ismuLlah}×`, icon: '🌟' },
  ], [state.hadraTargets]);

  // ── Step helpers ──────────────────────────────────────────────────────────
  const getStepStatus = useCallback((i: number) => {
    if (state.hadra[DHIKR_KEYS[i]] >= targets[i])                                     return 'completed';
    if (i === 0 || state.hadra[DHIKR_KEYS[i - 1]] >= targets[i - 1])                  return 'active';
    return 'disabled';
  }, [state.hadra, targets]);

  const prevTitle = useCallback((i: number): string | undefined => {
    if (i === 0) return undefined;
    if (i === 1) return `${HADRA_DHIKR.tahlil.title} (${state.hadraTargets.tahlil}×)`;
    return undefined;
  }, [state.hadraTargets.tahlil]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const haptic = (type: 'light' | 'medium' | 'success' = 'light') => {
    if (Platform.OS !== 'ios') return;
    if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (type === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleResetAll = useCallback(() => {
    Alert.alert('Reset All', 'Reset all hadra counts?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => { dispatch({ type: 'RESET_ALL_HADRA' }); timer.reset(); setTimerSaved(false); } },
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

  const handleIncrement = useCallback((k: keyof typeof state.hadra) => dispatch({ type: 'INCREMENT_HADRA', dhikr: k }), [dispatch]);
  const handleDecrement = useCallback((k: keyof typeof state.hadra) => dispatch({ type: 'DECREMENT_HADRA', dhikr: k }), [dispatch]);
  const handleReset     = useCallback((k: keyof typeof state.hadra, title: string) => {
    Alert.alert('Reset Dhikr', `Reset ${title}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'RESET_HADRA', dhikr: k }) },
    ]);
  }, [dispatch]);

  const handleSaveSettings = useCallback((newTargets: { tahlil: number; ismuLlah: number }) => {
    dispatch({ type: 'UPDATE_HADRA_TARGETS', targets: newTargets });
  }, [dispatch]);

  const playAudio = useCallback((type: string) => {
    if (state.settings.audioEnabled) console.log(`Playing audio for ${type}`);
  }, [state.settings.audioEnabled]);

  // ── Menu actions — added Card Style entry identical to WirdScreen ──────────
  const menuActions = [
    { key: 'info',      label: 'Hadra Information', icon: <Info      color="#0891B2" size={16} strokeWidth={2} />,   onPress: () => setShowInfoModal(true) },
    { key: 'settings',  label: 'Hadra Settings',    icon: <Settings  color="#0891B2" size={16} strokeWidth={2} />,   onPress: () => setShowSettings(true) },
    { key: 'cardStyle', label: 'Card Style',         icon: <Palette   color="#0891B2" size={16} strokeWidth={2} />,   onPress: () => setShowCardStyleModal(true), dividerAfter: true },
    { key: 'reset',     label: 'Reset All Dhikr',   icon: <RotateCcw color="#EF4444" size={16} strokeWidth={2.5} />, onPress: handleResetAll, destructive: true },
  ];
  useRegisterHeaderActions('/hadra', menuActions);

  return (
    <View style={[sc.root, dark && sc.rootDark]}>
      <MinimalHeader
        title="Ḥaḍra Joumouʿa" subtitle="Friday gathering"
        onBackPress={handleBack} showMore menuActions={menuActions} theme="default"
      />

      <ScreenBackground>
        <StatsBar
          dark={dark}
          stats={[
            { icon: <Target color="#0891B2" size={13} strokeWidth={2.5} />, value: `${completedCount}/2`, label: 'Completed', color: '#0891B2' },
            { icon: <Flame  color="#F59E0B" size={13} strokeWidth={2.5} />, value: `${progressPct}%`,    label: 'Progress',  color: '#F59E0B' },
          ]}
          timer={{
            formatted: timer.formatted, isRunning: timer.isRunning,
            isComplete: timerSaved, onToggle: timer.toggle, color: '#0891B2',
          }}
        />

        {isHadraComplete && !showCompletionModal && (
          <TouchableOpacity
            style={[sc.pill, dark && sc.pillDark]}
            onPress={() => setShowCompletionModal(true)}
            activeOpacity={0.85}
          >
            <Award color="#F59E0B" size={16} strokeWidth={2} />
            <Text style={sc.pillText}>Hadra Complete — tap to record</Text>
            <CheckCircle color="#0891B2" size={16} strokeWidth={2.5} />
          </TouchableOpacity>
        )}

        <ScrollView
          ref={scrollRef}
          style={sc.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={sc.scrollContent}
        >

          {/* ── Step 1: Tahlīl ── */}
          <View onLayout={registerCard(0)}>
            <DhikrCard
              title={`${HADRA_DHIKR.tahlil.title} (${state.hadraTargets.tahlil}×)`}
              arabic={HADRA_DHIKR.tahlil.arabic}
              transliteration={HADRA_DHIKR.tahlil.transliteration}
              translation={HADRA_DHIKR.tahlil.translation}
              count={state.hadra.tahlil}
              target={state.hadraTargets.tahlil}
              stepNumber={1} totalSteps={2}
              prevStepTitle={prevTitle(0)}
              onIncrement={() => handleIncrement('tahlil')}
              onDecrement={() => handleDecrement('tahlil')}
              onReset={() => handleReset('tahlil', `Tahlīl (${state.hadraTargets.tahlil}×)`)}
              onPlayAudio={() => playAudio('tahlil')}
              status={getStepStatus(0)}
              blessing="سيدنا محمد رسول الله عليه السلام"
            />
          </View>

          {/* ── Step 2: Ism Allāh ── */}
          <View onLayout={registerCard(1)}>
            <DhikrCard
              title={`${HADRA_DHIKR.ismuLlah.title} (${state.hadraTargets.ismuLlah}×)`}
              arabic={HADRA_DHIKR.ismuLlah.arabic}
              transliteration={HADRA_DHIKR.ismuLlah.transliteration}
              translation={HADRA_DHIKR.ismuLlah.translation}
              count={state.hadra.ismuLlah}
              target={state.hadraTargets.ismuLlah}
              stepNumber={2} totalSteps={2}
              prevStepTitle={prevTitle(1)}
              onIncrement={() => handleIncrement('ismuLlah')}
              onDecrement={() => handleDecrement('ismuLlah')}
              onReset={() => handleReset('ismuLlah', `Ism Allāh (${state.hadraTargets.ismuLlah}×)`)}
              onPlayAudio={() => playAudio('ismuLlah')}
              status={getStepStatus(1)}
              blessing="سيدنا محمد رسول الله عليه السلام"
            />
          </View>

          <Instructions dark={dark} />
          <View style={sc.bottomSpace} />
        </ScrollView>
      </ScreenBackground>

      {/* ── Modals ── */}
      <HadraSettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        currentTargets={state.hadraTargets}
        onSave={handleSaveSettings}
        darkMode={dark}
      />
      <HadraInfoModal visible={showInfoModal} onClose={() => setShowInfoModal(false)} darkMode={dark} />

      {/* ── Card Style modal (NEW) ── */}
      <CardStyleModal
        visible={showCardStyleModal}
        onClose={() => setShowCardStyleModal(false)}
        dark={dark}
      />

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
          confirmLabel="Record Completion"
          onComplete={handleCompleteHadra}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </View>
  );
}

const sc = StyleSheet.create({
  root:          { flex: 1, backgroundColor: '#F0F9FF' },
  rootDark:      { backgroundColor: '#060D12' },
  pill:          { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginBottom: 6, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 14, backgroundColor: '#E0F2FE', borderWidth: 1.5, borderColor: '#BAE6FD' },
  pillDark:      { backgroundColor: '#0C2233', borderColor: '#164E63' },
  pillText:      { flex: 1, fontSize: 13, fontWeight: '700', color: '#0891B2' },
  scroll:        { flex: 1 },
  scrollContent: { paddingTop: 6 },
  bottomSpace:   { height: 32 },
});