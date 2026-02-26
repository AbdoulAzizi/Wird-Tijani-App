import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Easing, Alert, Platform, Vibration,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus, Play, Pause, Square, RotateCcw, Clock,
  Trash2, Award, CheckCircle,
} from 'lucide-react-native';
import { useDhikrCounter } from '@/hooks/Usedhikrcounter';
import DhikrPickerModal from '@/components/Dhikrpickermodal';
import { useApp } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS } from '../../data/dhikrCounterData';
import { useContext } from 'react';
import MinimalHeader from '../../components/MinimalHeader';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const haptic = (type: 'light' | 'medium' | 'success' = 'light') => {
  if (Platform.OS !== 'ios') { Vibration.vibrate(30); return; }
  if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (type === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const fmtTime = (secs: number) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

// ─── Glass Card ───────────────────────────────────────────────────────────────
function GlassCard({ children, style, dark }: { children: React.ReactNode; style?: any; dark: boolean }) {
  return (
    <View style={[glass.card, dark ? glass.cardDark : glass.cardLight, style]}>
      {children}
    </View>
  );
}

const glass = StyleSheet.create({
  card: {
    borderRadius: 20, padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
  },
  cardLight: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderColor:  'rgba(255,255,255,0.90)',
    shadowOpacity: 0.14,
  },
  cardDark: {
    backgroundColor: 'rgba(15,23,42,0.78)',
    borderColor: 'rgba(255,255,255,0.07)',
    shadowOpacity: 0.35,
  },
});

// ─── Idle / Empty State ───────────────────────────────────────────────────────
function IdleView({ dark, onOpen }: { dark: boolean; onOpen: () => void }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={idle.wrap}>
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <GlassCard dark={dark} style={idle.orb}>
          <Text style={idle.emoji}>📿</Text>
        </GlassCard>
      </Animated.View>

      <GlassCard dark={dark} style={idle.textCard}>
        <Text style={[idle.title, dark && idle.titleDark]}>Dhikr Counter</Text>
        <Text style={[idle.sub, dark && idle.subDark]}>
          Choose an azkar from the library or create your own to begin your dhikr session
        </Text>
      </GlassCard>

      <TouchableOpacity style={idle.btn} onPress={onOpen} activeOpacity={0.85}>
        <Plus color="#fff" size={20} strokeWidth={2.5} />
        <Text style={idle.btnText}>Choose a Dhikr</Text>
      </TouchableOpacity>
    </View>
  );
}

const idle = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, gap: 18, paddingBottom: 60 },
  orb: { width: 110, height: 110, borderRadius: 55, justifyContent: 'center', alignItems: 'center', padding: 0 },
  emoji: { fontSize: 52 },
  textCard: { width: '100%', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#1E293B', letterSpacing: -0.4, textAlign: 'center', marginBottom: 8 },
  titleDark: { color: '#F8FAFC' },
  sub: { fontSize: 14, color: '#475569', textAlign: 'center', lineHeight: 21 },
  subDark: { color: '#94A3B8' },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#059669', paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: 18,
    shadowColor: '#059669', shadowOpacity: 0.45, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  btnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
});

// ─── Active Counter ───────────────────────────────────────────────────────────
function ActiveCounter({
  dark, active, isRunning, elapsed,
  onIncrement, onDecrement, onReset, onTogglePause, onComplete, onDiscard,
}: {
  dark: boolean;
  active: NonNullable<ReturnType<typeof useDhikrCounter>['active']>;
  isRunning: boolean;
  elapsed: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  onTogglePause: () => void;
  onComplete: () => void;
  onDiscard: () => void;
}) {
  const { count, target, azkar } = active;
  const progress    = Math.min((count / target) * 100, 100);
  const isDone      = count >= target;
  const remaining   = Math.max(target - count, 0);
  const accentColor = isDone ? '#F59E0B' : azkar.color;

  // Scroll indicators
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);

  const countScale     = useRef(new Animated.Value(1)).current;
  const progressAnim   = useRef(new Animated.Value(0)).current;
  const completionFade = useRef(new Animated.Value(0)).current;
  const tapRipple      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    if (count > 0) {
      tapRipple.setValue(0);
      Animated.timing(tapRipple, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      Animated.sequence([
        Animated.spring(countScale, { toValue: 1.22, useNativeDriver: true, damping: 5, stiffness: 600 }),
        Animated.spring(countScale, { toValue: 1,    useNativeDriver: true, damping: 14, stiffness: 220 }),
      ]).start();
    }
  }, [count]);

  useEffect(() => {
    if (isDone) {
      haptic('success');
      Animated.timing(completionFade, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    } else {
      completionFade.setValue(0);
    }
  }, [isDone]);

  const handleScroll = useCallback((event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const scrollHeight = contentSize.height;
    const viewHeight = layoutMeasurement.height;

    setShowTopGradient(scrollY > 10);
    setShowBottomGradient(scrollY + viewHeight < scrollHeight - 10);
  }, []);

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  const rippleScale   = tapRipple.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.18] });
  const rippleOpacity = tapRipple.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.35, 0.12, 0] });

  const topGradientColors: readonly [string, string, string] = dark
    ? ['rgba(15, 23, 42, 0)', 'rgba(15, 23, 42, 0.9)', 'rgba(15, 23, 42, 1)']
    : ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 1)'];

  const bottomGradientColors: readonly [string, string, string] = dark
    ? ['rgba(15, 23, 42, 1)', 'rgba(15, 23, 42, 0.9)', 'rgba(15, 23, 42, 0)']
    : ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0)'];

  return (
    // ✅ FIX 1: nestedScrollEnabled on outer ScrollView
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={ac.scroll}
      nestedScrollEnabled={true}
    >

      {/* ── Azkar info card WITH SCROLL ── */}
      <View style={ac.headerCardWrapper}>
        <GlassCard dark={dark} style={ac.headerCard}>
          <View style={[ac.categoryBadge, { backgroundColor: CATEGORY_COLORS[azkar.category] + '25' }]}>
            <Text style={[ac.categoryText, { color: CATEGORY_COLORS[azkar.category] }]}>
              {CATEGORY_ICONS[azkar.category]}  {CATEGORY_LABELS[azkar.category]}
            </Text>
          </View>
          <Text style={[ac.azkarTitle, dark && ac.azkarTitleDark]}>{azkar.title}</Text>

          {/* ✅ Scrollable text block with gradients */}
          <View style={ac.textWrapper}>
            {showTopGradient && (
              <LinearGradient
                colors={topGradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={ac.topGradient}
                pointerEvents="none"
              />
            )}

            {/* ✅ FIX 2: nestedScrollEnabled on inner ScrollView */}
            <ScrollView
              style={ac.textScroll}
              contentContainerStyle={ac.textContent}
              showsVerticalScrollIndicator={false}
              bounces={true}
              scrollEventThrottle={16}
              nestedScrollEnabled={true}
              onScroll={handleScroll}
              onContentSizeChange={(_width, height) => {
                setShowBottomGradient(height > 220);
              }}
            >
              <Text style={[ac.arabic, dark && ac.arabicDark]}>{azkar.arabic}</Text>
              {azkar.transliteration ? (
                <Text style={[ac.translit, { color: accentColor }]}>{azkar.transliteration}</Text>
              ) : null}
              {azkar.translation ? (
                <Text style={[ac.translation, dark && ac.translationDark]}>{azkar.translation}</Text>
              ) : null}
            </ScrollView>

            {showBottomGradient && (
              <LinearGradient
                colors={bottomGradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={ac.bottomGradient}
                pointerEvents="none"
              />
            )}
          </View>
        </GlassCard>
      </View>

      {/* ── Tap zone card ── */}
      <GlassCard dark={dark} style={ac.tapCard}>
        {/* Big circular button */}
        <View style={ac.tapCenter}>
          {/* Animated ripple ring */}
          <Animated.View style={[
            ac.ripple,
            { borderColor: accentColor, transform: [{ scale: rippleScale }], opacity: rippleOpacity }
          ]} />

          <TouchableOpacity
            onPress={() => { haptic('light'); onIncrement(); }}
            disabled={isDone || !isRunning}
            activeOpacity={0.88}
            style={[
              ac.tapBtn,
              { borderColor: accentColor + '55', shadowColor: accentColor },
              isDone && { backgroundColor: accentColor },
              !isRunning && ac.tapBtnPaused,
            ]}
          >
            {isDone ? (
              <View style={ac.doneInner}>
                <CheckCircle color="#FFFFFF" size={44} strokeWidth={2} />
                <Text style={ac.doneText}>Complete!</Text>
              </View>
            ) : (
              <>
                <Animated.Text style={[
                  ac.countNum,
                  { color: isRunning ? accentColor : (dark ? '#334155' : '#CBD5E1'), transform: [{ scale: countScale }] }
                ]}>
                  {count}
                </Animated.Text>
                <Text style={[ac.tapHint, dark && ac.tapHintDark, !isRunning && ac.tapHintPaused]}>
                  {isRunning ? '↑ tap to count' : '⏸ paused'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={[ac.progressTrack, dark && ac.progressTrackDark]}>
          <Animated.View style={[ac.progressFill, { width: progressWidth, backgroundColor: accentColor }]} />
        </View>

        {/* 4-column stats */}
        <View style={ac.statsRow}>
          {[
            { label: 'remaining', value: String(remaining),          color: accentColor },
            { label: 'target',    value: String(target),             color: dark ? '#94A3B8' : '#64748B' },
            { label: 'elapsed',   value: fmtTime(elapsed),           color: dark ? '#94A3B8' : '#64748B' },
            { label: 'progress',  value: `${Math.round(progress)}%`, color: accentColor },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <View style={ac.statItem}>
                <Text style={[ac.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={[ac.statLabel, dark && ac.statLabelDark]}>{s.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={[ac.statDiv, dark && ac.statDivDark]} />}
            </React.Fragment>
          ))}
        </View>
      </GlassCard>

      {/* ── Controls row ── */}
      <View style={ac.controlsRow}>
        <TouchableOpacity
          onPress={() => { haptic('light'); onDecrement(); }}
          style={[ac.sideBtn, dark ? ac.sideBtnDark : ac.sideBtnLight]}
          activeOpacity={0.75}
        >
          <Text style={[ac.sideBtnSymbol, dark && ac.sideBtnSymbolDark]}>−</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => { haptic('medium'); onTogglePause(); }}
          style={[ac.pauseBtn, dark ? ac.pauseBtnDark : ac.pauseBtnLight]}
          activeOpacity={0.82}
        >
          {isRunning
            ? <Pause color={dark ? '#F1F5F9' : '#1E293B'} size={26} strokeWidth={2} />
            : <Play  color={dark ? '#F1F5F9' : '#1E293B'} size={26} strokeWidth={2} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => { haptic('medium'); onReset(); }}
          style={[ac.sideBtn, dark ? ac.sideBtnDark : ac.sideBtnLight]}
          activeOpacity={0.75}
        >
          <RotateCcw color={dark ? '#94A3B8' : '#64748B'} size={18} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* ── Stop / Finish ── */}
      <View style={ac.actionRow}>
        <TouchableOpacity
          onPress={() => Alert.alert('Stop session', 'Save progress before leaving?', [
            { text: 'Discard', style: 'destructive', onPress: onDiscard },
            { text: 'Save',    onPress: onComplete },
            { text: 'Cancel',  style: 'cancel' },
          ])}
          style={[ac.stopBtn, dark ? ac.stopBtnDark : ac.stopBtnLight]}
          activeOpacity={0.8}
        >
          <Square color="#EF4444" size={16} strokeWidth={2} />
          <Text style={ac.stopBtnText}>Stop</Text>
        </TouchableOpacity>

        {isDone && (
          <TouchableOpacity
            onPress={() => { haptic('success'); onComplete(); }}
            style={[ac.doneBtn, { backgroundColor: accentColor, shadowColor: accentColor }]}
            activeOpacity={0.85}
          >
            <Award color="#fff" size={16} strokeWidth={2} />
            <Text style={ac.doneBtnText}>Save & Finish</Text>
          </TouchableOpacity>
        )}
      </View>

    </ScrollView>
  );
}

const ac = StyleSheet.create({
  scroll: { padding: 14, paddingBottom: 40, gap: 12 },

  headerCardWrapper: { marginBottom: 0 },
  headerCard: { gap: 8, alignItems: 'center', paddingVertical: 18, paddingBottom: 14 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  categoryText: { fontSize: 12, fontWeight: '700' },
  azkarTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3, textAlign: 'center' },
  azkarTitleDark: { color: '#F8FAFC' },

  // Scrollable text wrapper
  textWrapper: {
    width: '100%',
    height: 220,
    position: 'relative',
    borderRadius: 12,
  },
  textScroll: {
    height: 220,
  },
  textContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 8,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 30,
    zIndex: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    zIndex: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  arabic: { fontSize: 28, textAlign: 'center', color: '#1E293B', fontFamily: 'Amiri_400Regular', lineHeight: 46 },
  arabicDark: { color: '#F1F5F9' },
  translit: { fontSize: 13, fontStyle: 'italic', fontWeight: '600', textAlign: 'center' },
  translation: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 19 },
  translationDark: { color: '#94A3B8' },

  tapCard: { paddingVertical: 20, gap: 14 },
  tapCenter: { alignItems: 'center', justifyContent: 'center', height: 200 },

  ripple: {
    position: 'absolute',
    width: 194, height: 194, borderRadius: 97,
    borderWidth: 2,
  },
  tapBtn: {
    width: 178, height: 178, borderRadius: 89,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 2.5,
    justifyContent: 'center', alignItems: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28, shadowRadius: 20, elevation: 12,
  },
  tapBtnPaused: { opacity: 0.5 },
  countNum: { fontSize: 68, fontWeight: '900', letterSpacing: -4, lineHeight: 76 },
  tapHint: { fontSize: 12, fontWeight: '700', color: '#94A3B8', marginTop: 2, letterSpacing: 0.2 },
  tapHintDark: { color: '#64748B' },
  tapHintPaused: { color: '#CBD5E1' },
  doneInner: { alignItems: 'center', gap: 6 },
  doneText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },

  progressTrack: { height: 7, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden' },
  progressTrackDark: { backgroundColor: 'rgba(255,255,255,0.08)' },
  progressFill: { height: '100%', borderRadius: 4 },

  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  statLabelDark: { color: '#475569' },
  statDiv: { width: 1, height: 28, backgroundColor: 'rgba(0,0,0,0.1)' },
  statDivDark: { backgroundColor: 'rgba(255,255,255,0.08)' },

  controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  sideBtn: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1.5,
  },
  sideBtnLight: { backgroundColor: 'rgba(255,255,255,0.80)', borderColor: 'rgba(255,255,255,0.90)' },
  sideBtnDark:  { backgroundColor: 'rgba(15,23,42,0.70)',  borderColor: 'rgba(255,255,255,0.07)' },
  sideBtnSymbol: { fontSize: 28, fontWeight: '600', color: '#64748B', lineHeight: 34 },
  sideBtnSymbolDark: { color: '#94A3B8' },
  pauseBtn: {
    width: 70, height: 70, borderRadius: 35,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  pauseBtnLight: { backgroundColor: 'rgba(255,255,255,0.90)', borderColor: 'rgba(255,255,255,0.95)' },
  pauseBtnDark:  { backgroundColor: 'rgba(30,41,59,0.85)',   borderColor: 'rgba(255,255,255,0.10)' },

  actionRow: { flexDirection: 'row', gap: 10 },
  stopBtn: {
    flex: 1, height: 48, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5,
  },
  stopBtnLight: { backgroundColor: 'rgba(255,255,255,0.70)', borderColor: 'rgba(239,68,68,0.30)' },
  stopBtnDark:  { backgroundColor: 'rgba(127,29,29,0.25)',  borderColor: 'rgba(239,68,68,0.30)' },
  stopBtnText: { fontSize: 14, fontWeight: '700', color: '#EF4444' },
  doneBtn: {
    flex: 2, height: 48, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  doneBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});

// ─── History ──────────────────────────────────────────────────────────────────
function HistoryView({
  dark, sessions, onDelete, onClear,
  totalCounts, todayCounts, totalSessions,
}: {
  dark: boolean;
  sessions: ReturnType<typeof useDhikrCounter>['sessions'];
  onDelete: (id: string) => void;
  onClear: () => void;
  totalCounts: number;
  todayCounts: number;
  totalSessions: number;
}) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={hist.scroll}>
      {/* Stats cards */}
      <View style={hist.statsRow}>
        {[
          { icon: '📿', label: "Today",    value: todayCounts.toLocaleString() },
          { icon: '∑',  label: 'Total',    value: totalCounts.toLocaleString() },
          { icon: '🗓', label: 'Sessions', value: totalSessions.toLocaleString() },
        ].map(s => (
          <GlassCard key={s.label} dark={dark} style={hist.statCard}>
            <Text style={hist.statIcon}>{s.icon}</Text>
            <Text style={[hist.statValue, dark && hist.statValueDark]}>{s.value}</Text>
            <Text style={[hist.statLabel, dark && hist.statLabelDark]}>{s.label}</Text>
          </GlassCard>
        ))}
      </View>

      {sessions.length === 0 ? (
        <GlassCard dark={dark} style={hist.emptyCard}>
          <Text style={hist.emptyIcon}>📊</Text>
          <Text style={[hist.emptyTitle, dark && hist.emptyTitleDark]}>No sessions yet</Text>
          <Text style={[hist.emptySub, dark && hist.emptySubDark]}>Start a dhikr session to track your progress</Text>
        </GlassCard>
      ) : (
        <>
          <View style={hist.listHeader}>
            <Text style={[hist.listTitle, dark && hist.listTitleDark]}>History</Text>
            <TouchableOpacity onPress={() => Alert.alert('Clear history', 'Delete all records?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear all', style: 'destructive', onPress: onClear },
            ])} activeOpacity={0.7}>
              <Text style={hist.clearBtn}>Clear all</Text>
            </TouchableOpacity>
          </View>
          {sessions.map(s => (
            <GlassCard key={s.id} dark={dark} style={hist.sessionCard}>
              <View style={hist.sessionTop}>
                <View style={[hist.dot, s.isComplete && hist.dotDone]} />
                <Text style={[hist.sessionTitle, dark && hist.sessionTitleDark]} numberOfLines={1}>{s.azkarTitle}</Text>
                <View style={hist.sessionRight}>
                  <Text style={[hist.sessionCount, s.isComplete && hist.sessionCountDone]}>{s.count}/{s.target}</Text>
                  <Text style={[hist.sessionPct, s.isComplete && hist.sessionPctDone]}>
                    {s.isComplete ? '✓' : `${Math.round((s.count / s.target) * 100)}%`}
                  </Text>
                </View>
              </View>
              <Text style={[hist.sessionArabic, dark && hist.sessionArabicDark]} numberOfLines={1}>{s.azkarArabic}</Text>
              <View style={hist.sessionMeta}>
                <Clock color={dark ? '#334155' : '#CBD5E1'} size={11} strokeWidth={2} />
                <Text style={[hist.metaText, dark && hist.metaTextDark]}>{fmtDate(s.completedAt)}</Text>
                <Text style={[hist.metaText, dark && hist.metaTextDark]}>· {fmtTime(s.durationSeconds)}</Text>
                <TouchableOpacity onPress={() => onDelete(s.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ marginLeft: 'auto' }}>
                  <Trash2 color={dark ? '#334155' : '#CBD5E1'} size={14} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))}
        </>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const hist = StyleSheet.create({
  scroll: { padding: 14, gap: 10 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, gap: 4 },
  statIcon: { fontSize: 22 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5 },
  statValueDark: { color: '#F8FAFC' },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  statLabelDark: { color: '#475569' },
  emptyCard: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyIcon: { fontSize: 44 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  emptyTitleDark: { color: '#F8FAFC' },
  emptySub: { fontSize: 13, color: '#94A3B8', textAlign: 'center' },
  emptySubDark: { color: '#475569' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 2 },
  listTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  listTitleDark: { color: '#F8FAFC' },
  clearBtn: { fontSize: 13, fontWeight: '600', color: '#EF4444' },
  sessionCard: { gap: 6, padding: 14 },
  sessionTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E2E8F0', flexShrink: 0 },
  dotDone: { backgroundColor: '#059669' },
  sessionTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', flex: 1 },
  sessionTitleDark: { color: '#F1F5F9' },
  sessionRight: { alignItems: 'flex-end' },
  sessionCount: { fontSize: 13, fontWeight: '800', color: '#64748B' },
  sessionCountDone: { color: '#059669' },
  sessionPct: { fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  sessionPctDone: { color: '#F59E0B' },
  sessionArabic: { fontSize: 16, color: '#94A3B8', fontFamily: 'Amiri_400Regular', paddingLeft: 16 },
  sessionArabicDark: { color: '#334155' },
  sessionMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 11, color: '#94A3B8' },
  metaTextDark: { color: '#475569' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
type ScreenTab = 'counter' | 'history';

export default function DhikrCounterScreen() {
  const { state } = useApp();
  const dark = state.settings.darkMode;
  const { handleBack } = useContext(LayoutActionsContext);

  const [showPicker, setShowPicker] = useState(false);
  const [screenTab,  setScreenTab]  = useState<ScreenTab>('counter');

  const {
    active, isRunning, elapsed,
    customAzkars, sessions,
    totalCounts, todayCounts, totalSessions,
    startDhikr, increment, decrement, resetCount,
    togglePause, completeSession, discardSession,
    addCustomAzkar, deleteCustomAzkar,
    deleteSession, clearHistory,
  } = useDhikrCounter();

  const handleSelect = useCallback((azkar: any, target: number) => {
    startDhikr(azkar, target);
    setScreenTab('counter');
    setShowPicker(false);
  }, [startDhikr]);

  const handleReset = useCallback(() => {
    Alert.alert('Reset counter', 'Reset count to zero?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', onPress: resetCount },
    ]);
  }, [resetCount]);

  const menuActions = useMemo(() => [
    {
      key: 'new', label: 'New Dhikr Session',
      icon: <Plus color="#059669" size={16} strokeWidth={2} />,
      onPress: () => setShowPicker(true),
    },
    ...(active ? [{
      key: 'reset', label: 'Reset Counter',
      icon: <RotateCcw color="#EF4444" size={16} strokeWidth={2.5} />,
      onPress: handleReset, destructive: true,
    }] : []),
  ], [active, handleReset]);

  useRegisterHeaderActions('/dhikr-counter', menuActions);

  return (
    <View style={styles.root}>
     <MinimalHeader
        title="Dhikr Counter"
        subtitle="Track your recitations"
        onBackPress={handleBack}
        showMore={true}
        menuActions={menuActions}
        theme="default"
      />

      <ScreenBackground overlayOpacity={dark ? 0.45 : 0.18}>
        {/* ── Tab bar ── */}
        <View style={[styles.topBar, dark ? styles.topBarDark : styles.topBarLight]}>
          <View style={styles.tabRow}>
            {([
              ['counter', '📿', 'Counter'],
              ['history', '📊', 'History'],
            ] as const).map(([t, icon, label]) => (
              <TouchableOpacity
                key={t}
                onPress={() => setScreenTab(t)}
                style={[styles.tab, screenTab === t && styles.tabActive]}
                activeOpacity={0.8}
              >
                <Text style={styles.tabIcon}>{icon}</Text>
                <Text style={[
                  styles.tabText,
                  dark && styles.tabTextDark,
                  screenTab === t && styles.tabTextActive,
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {screenTab === 'counter' && (
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.newBtn} activeOpacity={0.85}>
              <Plus color="#fff" size={18} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Content ── */}
        {screenTab === 'counter' ? (
          active ? (
            <ActiveCounter
              dark={dark}
              active={active}
              isRunning={isRunning}
              elapsed={elapsed}
              onIncrement={increment}
              onDecrement={decrement}
              onReset={handleReset}
              onTogglePause={togglePause}
              onComplete={completeSession}
              onDiscard={discardSession}
            />
          ) : (
            <IdleView dark={dark} onOpen={() => setShowPicker(true)} />
          )
        ) : (
          <HistoryView
            dark={dark}
            sessions={sessions}
            onDelete={deleteSession}
            onClear={clearHistory}
            totalCounts={totalCounts}
            todayCounts={todayCounts}
            totalSessions={totalSessions}
          />
        )}
      </ScreenBackground>

      <DhikrPickerModal
        visible={showPicker}
        dark={dark}
        customAzkars={customAzkars}
        onSelect={handleSelect}
        onAddCustom={addCustomAzkar}
        onDeleteCustom={deleteCustomAzkar}
        onClose={() => setShowPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, gap: 8,
  },
  topBarLight: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderBottomColor: 'rgba(255,255,255,0.60)',
  },
  topBarDark: {
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },

  tabRow: { flexDirection: 'row', gap: 4, flex: 1 },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
  },
  tabActive: { backgroundColor: '#059669' },
  tabIcon: { fontSize: 14 },
  tabText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  tabTextDark: { color: '#94A3B8' },
  tabTextActive: { color: '#FFFFFF' },

  newBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#059669',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#059669', shadowOpacity: 0.45, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 5,
  },
});