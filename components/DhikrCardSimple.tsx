import React, { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Easing, Platform, ScrollView,
} from 'react-native';
import { Minus, RotateCcw, Volume2, Check, Lock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DhikrCardProps {
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  target: number;
  stepNumber?: number;
  totalSteps?: number;
  prevStepTitle?: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  onPlayAudio?: () => void;
  status?: 'completed' | 'active' | 'disabled';
  blessing?: string;
  dark?: boolean;
}

// ─── Haptic helper ────────────────────────────────────────────────────────────

const haptic = (type: 'light' | 'medium' | 'success') => {
  if (Platform.OS !== 'ios') return;
  if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (type === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

// ─── Spring presets ───────────────────────────────────────────────────────────

const SP = {
  snap:    { damping: 6,  stiffness: 700, useNativeDriver: true  } as const,
  snapOut: { damping: 14, stiffness: 300, useNativeDriver: true  } as const,
  smooth:  { damping: 18, stiffness: 180, useNativeDriver: true  } as const,
  gentle:  { damping: 22, stiffness: 140, useNativeDriver: true  } as const,
  color:   { damping: 20, stiffness: 160, useNativeDriver: false } as const,
};

const FADE_OUT = { duration: 140, easing: Easing.out(Easing.ease), useNativeDriver: true } as const;
const FADE_IN  = { duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true } as const;

// ─── Design tokens ────────────────────────────────────────────────────────────

const L = {
  bg:           '#FFFFFF',
  bgArabic:     '#F8F8F8',
  bgCounter:    '#F2F2F2',
  border:       '#E4E4E4',
  borderSoft:   '#EFEFEF',
  text:         '#111827',
  textMid:      '#374151',
  textMuted:    '#9CA3AF',
  textLocked:   '#D1D5DB',
  emerald:      '#047857',
  emeraldMid:   '#059669',
  emeraldLight: '#D1FAE5',
  emeraldTrack: '#A7F3D0',
  gold:         '#374151',
  goldMid:      '#6B7280',
  goldLight:    '#F3F4F6',
  goldTrack:    '#E5E7EB',
  lockedBg:     '#F9FAFB',
  lockedBorder: '#E5E7EB',
};

const D = {
  bg:           '#111827',
  bgArabic:     '#0D1117',
  bgCounter:    '#1A2130',
  border:       '#1F2937',
  borderSoft:   '#1A2236',
  text:         '#F9FAFB',
  textMid:      '#D1D5DB',
  textMuted:    '#6B7280',
  textLocked:   '#374151',
  emerald:      '#34D399',
  emeraldMid:   '#10B981',
  emeraldLight: '#064E3B',
  emeraldTrack: '#065F46',
  gold:         '#F9FAFB',
  goldMid:      '#9CA3AF',
  goldLight:    '#1F2937',
  goldTrack:    '#111827',
  lockedBg:     '#0F172A',
  lockedBorder: '#1E293B',
};

type Tokens = typeof L;

const ARABIC_MAX_H = 180;
const RING_SIZE    = 108;
const RING_STROKE  = 6;

// ─── Animated step dot ────────────────────────────────────────────────────────

const StepDot = ({ active, done, T }: { active: boolean; done: boolean; T: Tokens }) => {
  const scale = useRef(new Animated.Value(active ? 1.25 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: active ? 1.25 : 1,
      damping: 18, stiffness: 180,
      useNativeDriver: true,
    }).start();
  }, [active, done]);

  // Color is derived directly from props — no Animated.Value needed for background color
  const bgColor = done || active ? T.emerald : T.border;

  return (
    <Animated.View style={[sd.dot, { backgroundColor: bgColor, transform: [{ scale }] }]} />
  );
};

const StepDots = ({
  step, total, isComplete, isDisabled, T,
}: {
  step: number; total: number; isComplete: boolean; isDisabled: boolean; T: Tokens;
}) => (
  <View style={sd.row}>
    {Array.from({ length: total }, (_, i) => {
      const pos    = i + 1;
      const done   = pos < step || isComplete;
      const active = pos === step && !isDisabled;
      return <StepDot key={i} active={active} done={done} T={T} />;
    })}
  </View>
);

const sd = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});

// ─── Progress ring ────────────────────────────────────────────────────────────

const ProgressRing = ({
  progressAnim, size, stroke, color, trackColor, innerBg, children,
}: {
  progressAnim: Animated.Value;
  size: number; stroke: number;
  color: string; trackColor: string; innerBg: string;
  children: React.ReactNode;
}) => {
  const half  = size / 2;
  const inner = size - stroke * 2;
  const rightRot    = progressAnim.interpolate({ inputRange: [0, 50, 100], outputRange: ['-180deg', '0deg',   '0deg'],  extrapolate: 'clamp' });
  const leftRot     = progressAnim.interpolate({ inputRange: [0, 50, 100], outputRange: ['180deg',  '180deg', '0deg'],  extrapolate: 'clamp' });
  const leftOpacity = progressAnim.interpolate({ inputRange: [49, 51],     outputRange: [0, 1],                         extrapolate: 'clamp' });

  return (
    <View style={{ width: size, height: size }}>
      <View style={[StyleSheet.absoluteFillObject, { borderRadius: half, backgroundColor: trackColor }]} />
      <View style={{ position: 'absolute', left: half, width: half, height: size, overflow: 'hidden' }}>
        <Animated.View style={{ position: 'absolute', left: -half, width: size, height: size, transform: [{ rotate: rightRot }] }}>
          <View style={{ position: 'absolute', right: 0, width: half, height: size, borderTopRightRadius: half, borderBottomRightRadius: half, backgroundColor: color }} />
        </Animated.View>
      </View>
      <View style={{ position: 'absolute', left: 0, width: half, height: size, overflow: 'hidden' }}>
        <Animated.View style={{ position: 'absolute', left: 0, width: size, height: size, opacity: leftOpacity, transform: [{ rotate: leftRot }] }}>
          <View style={{ position: 'absolute', left: 0, width: half, height: size, borderTopLeftRadius: half, borderBottomLeftRadius: half, backgroundColor: color }} />
        </Animated.View>
      </View>
      <View style={{ position: 'absolute', top: stroke, left: stroke, width: inner, height: inner, borderRadius: inner / 2, backgroundColor: innerBg }} />
      <View style={[StyleSheet.absoluteFillObject, { alignItems: 'center', justifyContent: 'center' }]}>
        {children}
      </View>
    </View>
  );
};

const animateColor = (
  anim: Animated.Value, from: string, to: string,
): Animated.AnimatedInterpolation<string> =>
  anim.interpolate({ inputRange: [0, 1], outputRange: [from, to] });

// ─── Component ────────────────────────────────────────────────────────────────

export default function DhikrCardSimple({
  title, arabic, transliteration, translation,
  count, target,
  stepNumber, totalSteps = 3, prevStepTitle,
  onIncrement, onDecrement, onReset,
  onPlayAudio, status = 'active', blessing,
  dark = false,
}: DhikrCardProps) {
  const T = dark ? D : L;

  const isComplete = count >= target;
  const isDisabled = status === 'disabled';
  const progress   = Math.min((count / target) * 100, 100);
  const remaining  = Math.max(target - count, 0);

  const prevIsComplete = useRef(isComplete);
  const pulseLoopRef   = useRef<Animated.CompositeAnimation | null>(null);

  // ── Animated values ──────────────────────────────────────────────────────────
  const progressAnim     = useRef(new Animated.Value(progress)).current;
  const colorPhase       = useRef(new Animated.Value(isComplete ? 1 : 0)).current;

  // Whole counter zone tap feedback
  const tapScale         = useRef(new Animated.Value(1)).current;

  // Count number: scale pop + micro slide-up per tap
  const countScale       = useRef(new Animated.Value(1)).current;
  const countTransY      = useRef(new Animated.Value(0)).current;

  // Idle ring pulse (count === 0)
  const pulseAnim        = useRef(new Animated.Value(1)).current;

  // Complete state
  const completeFade     = useRef(new Animated.Value(isComplete ? 1 : 0)).current;
  const completeScale    = useRef(new Animated.Value(isComplete ? 1 : 0.75)).current;
  const checkRotate      = useRef(new Animated.Value(isComplete ? 0 : -30)).current;


  // Right col label stack: tapHint / pct / Done
  const tapHintOpacity   = useRef(new Animated.Value(count === 0 ? 1 : 0)).current;
  const pctOpacity       = useRef(new Animated.Value(isComplete ? 0 : count > 0 ? 1 : 0)).current;
  const doneOpacity      = useRef(new Animated.Value(isComplete ? 1 : 0)).current;
  const doneScale        = useRef(new Animated.Value(isComplete ? 1 : 0.8)).current;

  // Card border glow
  const borderGlow       = useRef(new Animated.Value(isComplete ? 1 : 0)).current;

  // Shimmer flash
  const shimmerAnim      = useRef(new Animated.Value(0)).current;

  // Blessing
  // Scroll fades
  const topFade          = useRef(new Animated.Value(0)).current;
  const bottomFade       = useRef(new Animated.Value(1)).current;

  // ── enterComplete ─────────────────────────────────────────────────────────
  const enterComplete = useCallback(() => {
    haptic('success');

    // Color phase transitions
    Animated.spring(colorPhase,  { toValue: 1, ...SP.color }).start();
    Animated.spring(borderGlow,  { toValue: 1, ...SP.color }).start();

    // % fades out
    Animated.timing(pctOpacity, { toValue: 0, ...FADE_OUT }).start();

    // Check icon swings in with overshoot
    Animated.parallel([
      Animated.spring(completeFade,  { toValue: 1, ...SP.smooth }),
      Animated.spring(completeScale, { toValue: 1, damping: 10, stiffness: 200, useNativeDriver: true }),
      Animated.spring(checkRotate,   { toValue: 0, damping: 10, stiffness: 200, useNativeDriver: true }),
    ]).start();

    // "Done" pops in with slight delay
    Animated.sequence([
      Animated.delay(80),
      Animated.parallel([
        Animated.timing(doneOpacity, { toValue: 1, ...FADE_IN }),
        Animated.spring(doneScale,   { toValue: 1, damping: 12, stiffness: 260, useNativeDriver: true }),
      ]),
    ]).start();

    // Shimmer flash
    Animated.sequence([
      Animated.timing(shimmerAnim, { toValue: 1, duration: 350, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(shimmerAnim, { toValue: 0, duration: 700, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
    ]).start();

  }, []);

  // ── exitComplete ──────────────────────────────────────────────────────────
  const exitComplete = useCallback(() => {
    haptic('light');

    // Colors back
    Animated.spring(colorPhase, { toValue: 0, ...SP.color }).start();
    Animated.spring(borderGlow, { toValue: 0, ...SP.color }).start();

    // Check fades + collapses
    Animated.parallel([
      Animated.timing(completeFade,  { toValue: 0, ...FADE_OUT }),
      Animated.spring(completeScale, { toValue: 0.75, ...SP.snapOut }),
      Animated.spring(checkRotate,   { toValue: -30,  ...SP.snapOut }),
    ]).start();

    // "Done" out
    Animated.parallel([
      Animated.timing(doneOpacity, { toValue: 0, ...FADE_OUT }),
      Animated.spring(doneScale,   { toValue: 0.8, ...SP.snapOut }),
    ]).start();

    // % fades back
    Animated.sequence([
      Animated.delay(60),
      Animated.timing(pctOpacity, { toValue: 1, ...FADE_IN }),
    ]).start();

  }, []);

  // ── Detect complete toggle ────────────────────────────────────────────────
  useLayoutEffect(() => {
    const prev = prevIsComplete.current;
    if (isComplete === prev) return;
    prevIsComplete.current = isComplete;
    if (isComplete) enterComplete();
    else            exitComplete();
  });

  // ── Progress ring ─────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress, damping: 28, stiffness: 300, useNativeDriver: false,
    }).start();
  }, [progress]);

  // ── Idle pulse ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (count === 0 && !isDisabled && !isComplete) {
      pulseLoopRef.current = Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.00, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]));
      pulseLoopRef.current.start();
    } else {
      pulseLoopRef.current?.stop();
      Animated.spring(pulseAnim, { toValue: 1, ...SP.smooth }).start();
    }
    return () => pulseLoopRef.current?.stop();
  }, [count === 0, isDisabled, isComplete]);

  // ── Count pop + slide-up per tap ─────────────────────────────────────────
  useEffect(() => {
    if (count > 0) {
      countTransY.setValue(8);
      Animated.parallel([
        Animated.sequence([
          Animated.spring(countScale, { toValue: 1.18, damping: 4, stiffness: 700, useNativeDriver: true }),
          Animated.spring(countScale, { toValue: 1,    ...SP.snapOut }),
        ]),
        Animated.spring(countTransY, { toValue: 0, damping: 10, stiffness: 400, useNativeDriver: true }),
      ]).start();
    }
  }, [count]);

  // ── Tap hint lifecycle ────────────────────────────────────────────────────
  useEffect(() => {
    if (count === 1) {
      Animated.timing(tapHintOpacity, { toValue: 0, duration: 180, useNativeDriver: true }).start();
      Animated.sequence([
        Animated.delay(120),
        Animated.timing(pctOpacity, { toValue: 1, ...FADE_IN }),
      ]).start();
    }
    if (count === 0 && !isComplete) {
      Animated.timing(pctOpacity, { toValue: 0, duration: 120, useNativeDriver: true }).start();
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(tapHintOpacity, { toValue: 1, ...FADE_IN }),
      ]).start();
    }
  }, [count === 0, count === 1]);

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => () => { pulseLoopRef.current?.stop(); }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleIncrement = useCallback(() => {
    if (isDisabled || isComplete) return;
    haptic('light');
    Animated.sequence([
      Animated.spring(tapScale, { toValue: 0.965, damping: 4, stiffness: 700, useNativeDriver: true }),
      Animated.spring(tapScale, { toValue: 1,     ...SP.snapOut }),
    ]).start();
    onIncrement();
  }, [isDisabled, isComplete, onIncrement]);

  const handleDecrement = useCallback(() => {
    if (isDisabled || count <= 0) return;
    haptic('light');
    if (count === target) exitComplete();
    Animated.sequence([
      Animated.spring(tapScale, { toValue: 1.015, damping: 6, stiffness: 500, useNativeDriver: true }),
      Animated.spring(tapScale, { toValue: 1,     ...SP.smooth }),
    ]).start();
    onDecrement();
  }, [isDisabled, count, target, exitComplete, onDecrement]);

  const handleReset = useCallback(() => {
    if (isDisabled) return;
    haptic('medium');
    if (isComplete) exitComplete();
    Animated.sequence([
      Animated.spring(tapScale, { toValue: 0.96,  damping: 5, stiffness: 600, useNativeDriver: true }),
      Animated.spring(tapScale, { toValue: 1.02,  damping: 8, stiffness: 400, useNativeDriver: true }),
      Animated.spring(tapScale, { toValue: 1,     ...SP.smooth }),
    ]).start();
    onReset();
  }, [isDisabled, isComplete, exitComplete, onReset]);

  const handleScroll = useCallback((e: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const y    = contentOffset.y;
    const maxY = contentSize.height - layoutMeasurement.height;
    Animated.parallel([
      Animated.timing(topFade,    { toValue: y < 8         ? 0 : 1, duration: 100, useNativeDriver: true }),
      Animated.timing(bottomFade, { toValue: y >= maxY - 8 ? 0 : 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Derived interpolations ────────────────────────────────────────────────
  const ringColor   = isComplete ? T.goldMid   : T.emeraldMid;
  const ringTrack   = isComplete ? T.goldTrack : T.emeraldTrack;
  const countColor  = animateColor(colorPhase, T.emeraldMid, T.goldMid);
  const titleColor  = isDisabled ? T.textMuted : T.text;

  const shimmerOpacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.07] });
  const checkRotateDeg = checkRotate.interpolate({ inputRange: [-30, 0], outputRange: ['-30deg', '0deg'] });
  const cardBorderColor = borderGlow.interpolate({
    inputRange:  [0, 1],
    outputRange: [isDisabled ? T.lockedBorder : T.border, T.emeraldTrack],
  });

  return (
    <Animated.View style={[s.card, {
      backgroundColor: T.bg,
      borderColor: cardBorderColor as any,
      shadowColor: isComplete ? T.emeraldMid : '#000',
      shadowOpacity: isComplete ? 0.14 : 0.05,
    }]}>

      {/* Shimmer flash */}
      <Animated.View
        pointerEvents="none"
        style={[s.shimmerOverlay, { backgroundColor: T.emerald, opacity: shimmerOpacity }]}
      />

      {/* ── HEADER ── */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          {stepNumber != null && (
            <StepDots
              step={stepNumber} total={totalSteps}
              isComplete={isComplete} isDisabled={isDisabled} T={T}
            />
          )}
          <Text style={[s.title, { color: titleColor }]} numberOfLines={1}>{title}</Text>
        </View>
        <View style={s.headerRight}>
          <View style={[
            s.countPill,
            isDisabled                 && { backgroundColor: T.lockedBg,     borderColor: T.lockedBorder },
            !isDisabled && !isComplete && { backgroundColor: T.emeraldLight, borderColor: `${T.emerald}40` },
            isComplete                 && { backgroundColor: T.goldLight,    borderColor: `${T.goldMid}40` },
          ]}>
            <Text style={[
              s.countPillText,
              isDisabled                 && { color: T.textLocked },
              !isDisabled && !isComplete && { color: T.emerald },
              isComplete                 && { color: T.goldMid },
            ]}>{count}/{target}</Text>
          </View>
          {onPlayAudio && !isDisabled && (
            <TouchableOpacity
              onPress={onPlayAudio}
              style={[s.audioBtn, { borderColor: T.border }]}
              activeOpacity={0.7}
            >
              <Volume2 color={T.textMuted} size={14} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── ARABIC BLOCK ── */}
      <View style={[s.arabicBlock, {
        opacity: isDisabled ? 0.45 : 1,
        borderTopColor: T.borderSoft,
        borderBottomColor: T.borderSoft,
      }]}>
        <ScrollView
          style={s.arabicScroll}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onContentSizeChange={(_, h) => bottomFade.setValue(h <= ARABIC_MAX_H ? 0 : 1)}
          bounces
          alwaysBounceVertical={false}
          contentContainerStyle={s.arabicScrollContent}
          nestedScrollEnabled
        >
          <Text style={[s.arabic,      { color: isDisabled ? T.textMuted : T.text }]}>{arabic}</Text>
          <Text style={[s.translit,    { color: isDisabled ? T.textMuted : isComplete ? T.goldMid : T.emerald }]}>
            {transliteration}
          </Text>
          <Text style={[s.translation, { color: T.textMuted }]}>{translation}</Text>
        </ScrollView>
        <Animated.View pointerEvents="none" style={[s.fadeTop, { opacity: topFade,    backgroundColor: T.bgArabic }]} />
        <Animated.View pointerEvents="none" style={[s.fadeBot, { opacity: bottomFade, backgroundColor: T.bgArabic }]} />
      </View>

      {/* ── COUNTER ZONE ── */}
      <TouchableOpacity
        onPress={handleIncrement}
        disabled={isComplete || isDisabled}
        activeOpacity={1}
        style={[s.counterZone, { backgroundColor: isDisabled ? T.lockedBg : T.bgCounter }]}
      >

        {/* LOCKED */}
        {isDisabled && (
          <View style={s.lockedContent}>
            <View style={[s.lockCircle, { borderColor: T.border }]}>
              <Lock size={18} color={T.textMuted} strokeWidth={1.8} />
            </View>
            <View style={s.lockText}>
              <Text style={[s.lockTitle, { color: T.textMid }]}>Locked</Text>
              {prevStepTitle
                ? <Text style={[s.lockHint, { color: T.textMuted }]}>Complete {prevStepTitle} first</Text>
                : stepNumber != null && stepNumber > 1
                  ? <Text style={[s.lockHint, { color: T.textMuted }]}>Complete the previous step</Text>
                  : null}
            </View>
          </View>
        )}

        {/* ACTIVE — 3 columns */}
        {!isDisabled && (
          <Animated.View style={[s.activeContent, { transform: [{ scale: tapScale }] }]}>

            {/* ── LEFT — [ Btn- ] [ remaining ] [ label ] ── */}
            <View style={s.leftCol}>
              <TouchableOpacity
                onPress={handleDecrement}
                disabled={count <= 0}
                style={[s.sideBtn, { borderColor: T.border }, count <= 0 && s.sideBtnOff]}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
              >
                <Minus size={16} strokeWidth={2} color={count <= 0 ? T.textLocked : T.textMuted} />
              </TouchableOpacity>

              <Text style={[s.remainingNum, {
                color: isComplete ? T.goldMid : T.text,
              }]}>
                {remaining}
              </Text>
              <Text style={[s.remainingLabel, { color: T.textMuted }]}>
                {remaining === 0 ? 'done' : count === 0 ? 'to recite' : 'remaining'}
              </Text>
            </View>

            {/* ── CENTER — Ring ── */}
            <Animated.View style={[s.ringWrapper, { transform: [{ scale: pulseAnim }] }]}>
              <ProgressRing
                progressAnim={progressAnim}
                size={RING_SIZE}
                stroke={RING_STROKE}
                color={ringColor}
                trackColor={ringTrack}
                innerBg={T.bgCounter}
              >
                {/* Count — slides up per tap, fades on complete */}
                <Animated.View style={[
                  StyleSheet.absoluteFillObject,
                  { alignItems: 'center', justifyContent: 'center' },
                  {
                    opacity: completeFade.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                    transform: [{ scale: countScale }, { translateY: countTransY }],
                  },
                ]}>
                  <Animated.Text style={[s.countNum, { color: countColor as any }]}>
                    {count}
                  </Animated.Text>
                </Animated.View>

                {/* Check — swings in on complete */}
                <Animated.View style={[
                  StyleSheet.absoluteFillObject,
                  { alignItems: 'center', justifyContent: 'center' },
                  {
                    opacity: completeFade,
                    transform: [{ scale: completeScale }, { rotate: checkRotateDeg }],
                  },
                ]}>
                  <Check size={28} color={T.emeraldMid} strokeWidth={2.5} />
                </Animated.View>
              </ProgressRing>
            </Animated.View>

            {/* ── RIGHT — [ label stack ] [ BtnReset ] ── */}
            <View style={s.rightCol}>
              <View style={s.rightLabel}>
                {/* "tap" — visible only at count === 0 */}
                <Animated.Text style={[s.tapHint, {
                  color: T.emerald,
                  opacity: tapHintOpacity,
                  position: 'absolute',
                }]}>
                  tap
                </Animated.Text>
                {/* % — visible while counting */}
                <Animated.Text style={[s.pctText, {
                  color: T.emerald,
                  opacity: pctOpacity,
                  position: 'absolute',
                }]}>
                  {Math.round(progress)}%
                </Animated.Text>
                {/* "Done" — visible on complete */}
                <Animated.Text style={[s.doneLbl, {
                  color: T.goldMid,
                  opacity: doneOpacity,
                  transform: [{ scale: doneScale }],
                }]}>
                  Done
                </Animated.Text>
              </View>

              <TouchableOpacity
                onPress={handleReset}
                disabled={count === 0}
                style={[s.sideBtn, { borderColor: T.border }, count === 0 && s.sideBtnOff]}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
              >
                <RotateCcw size={14} strokeWidth={2} color={count === 0 ? T.textLocked : T.textMuted} />
              </TouchableOpacity>
            </View>

          </Animated.View>
        )}
      </TouchableOpacity>

      {/* ── BLESSING — only when complete AND non-empty ── */}
      {isComplete && blessing && blessing.trim() !== '' ? (
        <View style={[s.blessing, { borderTopColor: T.borderSoft }]}>
          <Text style={[s.blessingText, { color: T.textMid }]}>{blessing}</Text>
        </View>
      ) : null}

    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 14,
    elevation: 3,
  },
  shimmerOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 10,
  },
  headerLeft:    { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  headerRight:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title:         { fontSize: 14, fontWeight: '700', letterSpacing: 0.3, flex: 1 },
  countPill:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  countPillText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
  audioBtn: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
  },

  // ── Arabic block ──
  arabicBlock: { borderTopWidth: 1, borderBottomWidth: 1 },
  arabicScroll:        { maxHeight: ARABIC_MAX_H },
  arabicScrollContent: { paddingVertical: 20, paddingHorizontal: 20, alignItems: 'center' },
  arabic: {
    fontSize: 26, textAlign: 'center', lineHeight: 46,
    fontFamily: 'Amiri_400Regular', marginBottom: 10, width: '100%',
  },
  translit: {
    fontSize: 13, textAlign: 'center', fontStyle: 'italic',
    fontWeight: '500', lineHeight: 20, marginBottom: 6, width: '100%',
  },
  translation: { fontSize: 12, textAlign: 'center', lineHeight: 19, width: '100%' },
  fadeTop: { position: 'absolute', top: 0,    left: 0, right: 0, height: 20 },
  fadeBot: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 20 },

  // ── Counter zone ──
  counterZone: {
    minHeight: 148,
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  // Locked
  lockedContent: { flexDirection: 'row', alignItems: 'center', gap: 14, justifyContent: 'center' },
  lockCircle: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  lockText:  { gap: 3 },
  lockTitle: { fontSize: 13, fontWeight: '700' },
  lockHint:  { fontSize: 11, fontWeight: '500' },

  // Active — 3-column
  activeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },

  // Left column
  leftCol: {
    alignItems: 'center',
    minWidth: 64,
    gap: 6,
  },
  remainingNum: {
    fontSize: 40,
    fontWeight: '200',
    lineHeight: 40,
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'] as any,
    textAlign: 'center',
  },
  remainingLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    textAlign: 'center',
  },

  // Center column
  ringWrapper: { alignItems: 'center', justifyContent: 'center' },
  countNum: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: -0.5,
    lineHeight: 32,
    fontVariant: ['tabular-nums'] as any,
  },

  // Right column
  rightCol: {
    alignItems: 'center',
    minWidth: 64,
    gap: 6,
  },
  rightLabel: {
    height: 28,                     // fixed height — prevents layout shift between labels
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapHint: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' as const },
  pctText: { fontSize: 20, fontWeight: '300', letterSpacing: -0.5 },
  doneLbl: { fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },

  // Side buttons
  sideBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
  },
  sideBtnOff: { opacity: 0.18 },

  // Blessing
  blessing: { paddingVertical: 14, paddingHorizontal: 20, borderTopWidth: 1 },
  blessingText: {
    fontSize: 15, fontFamily: 'Amiri_400Regular',
    lineHeight: 28, textAlign: 'center', letterSpacing: 0.2,
  },
});