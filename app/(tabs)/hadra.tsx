import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Animated
} from 'react-native';
import {
  RotateCcw, Settings, Info, CheckCircle, Award, Flame, Moon, Target
} from 'lucide-react-native';
import DhikrCard from '../../components/DhikrCard';
import { useApp } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import HadraInfoModal from '../../components/HadraInfoModal';
import HadraSettingsModal from '../../components/HadraSettingsModal';
import StatsBar from '../../components/StatsBar';
import { useAutoScroll } from '@/components/hooks/useAutoScroll';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';

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

function CompletionBanner({ dark, onComplete }: { dark: boolean; onComplete: () => void }) {
  return (
    <TouchableOpacity
      style={[cBanner.wrap, dark && cBanner.wrapDark]}
      onPress={onComplete} activeOpacity={0.85}
    >
      <View style={cBanner.left}>
        <View style={cBanner.iconWrap}>
          <Award color="#F59E0B" size={26} strokeWidth={2} />
        </View>
        <View>
          <Text style={cBanner.title}>Hadra Complete! 🎉</Text>
          <Text style={cBanner.subtitle}>Tap to record your completion</Text>
        </View>
      </View>
      <CheckCircle color="#059669" size={24} strokeWidth={2.5} />
    </TouchableOpacity>
  );
}

const cBanner = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F5F3FF', borderRadius: 20, padding: 18,
    marginHorizontal: 16, marginTop: 8, borderWidth: 2, borderColor: '#DDD6FE',
    shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 5,
  },
  wrapDark: { backgroundColor: '#1E1135', borderColor: '#4C1D95' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  iconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center',
  },
  title:    { fontSize: 17, fontWeight: '800', color: '#4C1D95', marginBottom: 3 },
  subtitle: { fontSize: 13, color: '#7C3AED', fontWeight: '500' },
});

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
  wrap: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20,
    marginHorizontal: 16, marginTop: 16, borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  wrapDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  emoji: { fontSize: 20 },
  title: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  titleDark: { color: '#F8FAFC' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  rowIcon: { fontSize: 16 },
  rowText: { fontSize: 14, color: '#64748B', flex: 1, lineHeight: 20 },
  rowTextDark: { color: '#94A3B8' },
});

export default function HadraScreen() {
  const { state, dispatch, isHadraComplete, getHadraProgress } = useApp();
  const [showSettings,  setShowSettings]  = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const { darkMode, audioEnabled } = state.settings;
  const dark = darkMode;

  const targets = useMemo(() => [
    state.hadraTargets.tahlil,
    state.hadraTargets.ismuLlah,
  ], [state.hadraTargets]);

  const completedCount = useMemo(
    () => DHIKR_KEYS.filter((key, index) => state.hadra[key] >= targets[index]).length,
    [state.hadra, targets],
  );

  const progress    = useMemo(() => getHadraProgress(), [state.hadra, state.hadraTargets]);
  const progressPct = Math.round(progress);

  const completions = useMemo(() => [
    state.hadra.tahlil   >= state.hadraTargets.tahlil,
    state.hadra.ismuLlah >= state.hadraTargets.ismuLlah,
  ], [state.hadra, state.hadraTargets]);

  const { scrollRef, registerCard } = useAutoScroll(completions);

  const getStepStatus = useCallback((stepIndex: number) => {
    if (state.hadra[DHIKR_KEYS[stepIndex]] >= targets[stepIndex]) return 'completed';
    if (stepIndex === 0 || state.hadra[DHIKR_KEYS[stepIndex - 1]] >= targets[stepIndex - 1]) return 'active';
    return 'disabled';
  }, [state.hadra, targets]);

  const handleResetAll = useCallback(() => {
    Alert.alert('Reset All', 'Are you sure you want to reset all hadra counts?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'RESET_ALL_HADRA' }) },
    ]);
  }, [dispatch]);

  const handleCompleteHadra = useCallback(() => {
    if (!isHadraComplete) return;
    dispatch({ type: 'COMPLETE_HADRA' });
    Alert.alert('Hadra Complete! 🎉', 'May Allah accept your dhikr.', [{ text: 'Alhamdulillah' }]);
  }, [isHadraComplete, dispatch]);

  const handleIncrement = useCallback(
    (dhikr: keyof typeof state.hadra) => dispatch({ type: 'INCREMENT_HADRA', dhikr }),
    [dispatch],
  );
  const handleDecrement = useCallback(
    (dhikr: keyof typeof state.hadra) => dispatch({ type: 'DECREMENT_HADRA', dhikr }),
    [dispatch],
  );
  const handleReset = useCallback((dhikr: keyof typeof state.hadra, dhikrTitle: string) => {
    Alert.alert('Reset Dhikr', `Are you sure you want to reset ${dhikrTitle}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'RESET_HADRA', dhikr }) },
    ]);
  }, [dispatch]);

  const handleSaveSettings = useCallback((newTargets: { tahlil: number; ismuLlah: number }) => {
    dispatch({ type: 'UPDATE_HADRA_TARGETS', targets: newTargets });
    Alert.alert('Settings Saved', 'Your hadra targets have been updated.', [{ text: 'OK' }]);
  }, [dispatch]);

  const playAudio = useCallback((dhikrType: string) => {
    if (audioEnabled) console.log(`Playing audio for ${dhikrType}`);
  }, [audioEnabled]);

  useRegisterHeaderActions('/hadra', [
    {
      key: 'info', label: 'Hadra Information',
      icon: <Info color="#7C3AED" size={16} strokeWidth={2} />,
      onPress: () => setShowInfoModal(true),
    },
    {
      key: 'settings', label: 'Hadra Settings',
      icon: <Settings color="#7C3AED" size={16} strokeWidth={2} />,
      onPress: () => setShowSettings(true), dividerAfter: true,
    },
    {
      key: 'reset', label: 'Reset All Dhikr',
      icon: <RotateCcw color="#EF4444" size={16} strokeWidth={2.5} />,
      onPress: handleResetAll, destructive: true,
    },
  ]);

  return (
    <View style={[styles.root, dark && styles.rootDark]}>
      <ScreenBackground>
        <StatsBar dark={dark} stats={[
          { icon: <Target color="#7C3AED" size={13} strokeWidth={2.5} />, value: `${completedCount}/2`, label: 'Completed', color: '#7C3AED' },
          { icon: <Flame  color="#F59E0B" size={13} strokeWidth={2.5} />, value: `${progressPct}%`,    label: 'Progress',  color: '#F59E0B' },
          { icon: <Moon   color="#0891B2" size={13} strokeWidth={2.5} />, value: String(state.streak ?? 0), label: 'Day streak', color: '#0891B2' },
        ]} />

        <View style={styles.progressWrap}>
          <View style={[styles.progressTrack, dark && styles.progressTrackDark]}>
            <Animated.View style={[styles.progressFill, { width: `${progress}%` }, progress >= 100 && styles.progressComplete]} />
          </View>
          <Text style={[styles.progressLabel, dark && styles.progressLabelDark]}>Overall Hadra progress</Text>
        </View>

        <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <View onLayout={registerCard(0)}>
            <DhikrCard
              title={`${HADRA_DHIKR.tahlil.title} (${state.hadraTargets.tahlil}x)`}
              arabic={HADRA_DHIKR.tahlil.arabic}
              transliteration={HADRA_DHIKR.tahlil.transliteration}
              translation={HADRA_DHIKR.tahlil.translation}
              count={state.hadra.tahlil} target={state.hadraTargets.tahlil}
              onIncrement={() => handleIncrement('tahlil')}
              onDecrement={() => handleDecrement('tahlil')}
              onReset={() => handleReset('tahlil', `Tahlīl (${state.hadraTargets.tahlil}x)`)}
              onPlayAudio={() => playAudio('tahlil')}
              status={getStepStatus(0)} blessing="بارك الله فيك"
            />
          </View>

          <View onLayout={registerCard(1)}>
            <DhikrCard
              title={`${HADRA_DHIKR.ismuLlah.title} (${state.hadraTargets.ismuLlah}x)`}
              arabic={HADRA_DHIKR.ismuLlah.arabic}
              transliteration={HADRA_DHIKR.ismuLlah.transliteration}
              translation={HADRA_DHIKR.ismuLlah.translation}
              count={state.hadra.ismuLlah} target={state.hadraTargets.ismuLlah}
              onIncrement={() => handleIncrement('ismuLlah')}
              onDecrement={() => handleDecrement('ismuLlah')}
              onReset={() => handleReset('ismuLlah', `Ism Allāh (${state.hadraTargets.ismuLlah}x)`)}
              onPlayAudio={() => playAudio('ismuLlah')}
              status={getStepStatus(1)} blessing="بارك الله فيك"
            />
          </View>

          <Instructions dark={dark} />
          {isHadraComplete && <CompletionBanner dark={dark} onComplete={handleCompleteHadra} />}
          <View style={styles.bottomSpace} />
        </ScrollView>
      </ScreenBackground>

      <HadraSettingsModal
        visible={showSettings} onClose={() => setShowSettings(false)}
        currentTargets={state.hadraTargets} onSave={handleSaveSettings} darkMode={dark}
      />
      <HadraInfoModal visible={showInfoModal} onClose={() => setShowInfoModal(false)} darkMode={dark} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  rootDark: { backgroundColor: '#0F172A' },
  progressWrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  progressTrack: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressTrackDark: { backgroundColor: '#334155' },
  progressFill: { height: '100%', backgroundColor: '#7C3AED', borderRadius: 4 },
  progressComplete: { backgroundColor: '#F59E0B' },
  progressLabel: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  progressLabelDark: { color: '#64748B' },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 8 },
  bottomSpace: { height: 32 },
});