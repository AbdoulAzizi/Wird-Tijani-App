import React, { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Easing, Platform, ScrollView,
} from 'react-native';
import { Minus, RotateCcw, Volume2, Check, Lock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../contexts/AppContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DhikrCardProps {
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
}

// ─── Haptic helper ────────────────────────────────────────────────────────────

const haptic = (type: 'light' | 'medium' | 'success') => {
  if (Platform.OS !== 'ios') return;
  if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (type === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

// ─── Design tokens ────────────────────────────────────────────────────────────
//
// LIGHT — Warm ivory base, deep forest green, antique gold
// Philosophy: every shade is either +1 or −1 step from its neighbour on
// a single lightness ramp. No random spot colours.
//
const L = {
  // ── Surfaces (warm ivory ramp) ──────────────────────────────────────────
  bg:         '#F9F7F2',   // card background       — ivory‑0
  bgArabic:   '#F3F0E8',   // Arabic block          — ivory‑1
  bgCounter:  '#EDE9DF',   // counter zone          — ivory‑2

  // ── Borders (same ramp, semi‑transparent for crisp lines) ───────────────
  border:     '#DDD8CC',   // default border        — ivory‑3
  borderSoft: '#E8E3D9',   // subtle inner borders  — ivory‑2.5

  // ── Text (cool‑warm near‑black to muted) ────────────────────────────────
  text:       '#1A2520',   // primary text          — forest‑black
  textMid:    '#445C52',   // secondary text        — forest‑mid
  textMuted:  '#8FA499',   // placeholder / hint    — forest‑muted
  textLocked: '#ABBAB3',   // locked state labels   — forest‑faint

  // ── Emerald (active / progress) — one saturated hue, three values ────────
  emerald:      '#1B6B4A',   // primary accent        — forest‑green
  emeraldMid:   '#2A9468',   // ring fill / bright    — mid‑green
  emeraldLight: '#DCF0E7',   // tag / chip background — pale green
  emeraldTrack: '#C8E6D8',   // ring track            — tint green

  // ── Gold (complete) — warm amber, one saturated hue, three values ────────
  gold:         '#9A6C00',   // primary gold          — deep amber
  goldMid:      '#C49020',   // ring fill / bright    — mid amber
  goldLight:    '#F5ECCE',   // chip / tag background — pale gold
  goldTrack:    '#EAD9A0',   // ring track            — tint gold

  // ── Locked state surfaces ────────────────────────────────────────────────
  lockedBg:     '#F0EDE6',   // locked zone fill
  lockedBorder: '#D5D0C5',   // locked zone border
};

//
// DARK — Deep forest night, bioluminescent green, warm candlelight gold
// Philosophy: pure blacks avoided. Every surface has a green undertone.
//
const D = {
  // ── Surfaces (deep green‑black ramp) ────────────────────────────────────
  bg:         '#0C1510',   // card background       — void‑0
  bgArabic:   '#091208',   // Arabic block          — void‑1
  bgCounter:  '#101A14',   // counter zone          — void‑0.5

  // ── Borders (very dark, barely visible) ─────────────────────────────────
  border:     '#1C2E22',   // default border
  borderSoft: '#162419',   // subtle inner border

  // ── Text (cool near‑white ramp) ─────────────────────────────────────────
  text:       '#DFF0E8',   // primary text
  textMid:    '#7AA890',   // secondary text
  textMuted:  '#3D6050',   // hint / placeholder
  textLocked: '#2A4838',   // locked labels

  // ── Emerald (active / progress) ─────────────────────────────────────────
  emerald:      '#3DD68C',   // bioluminescent green  — vivid, not neon
  emeraldMid:   '#2DBB78',   // ring fill
  emeraldLight: '#0A2418',   // chip background
  emeraldTrack: '#0C2010',   // ring track

  // ── Gold (complete) — warm amber candlelight ─────────────────────────────
  gold:         '#E8C060',   // primary gold          — candlelight
  goldMid:      '#D4A840',   // ring fill
  goldLight:    '#1E1600',   // chip background
  goldTrack:    '#221800',   // ring track

  // ── Locked state surfaces ────────────────────────────────────────────────
  lockedBg:     '#0A1410',
  lockedBorder: '#162018',
};

const ARABIC_MAX_H = 200;
const RING_SIZE    = 96;
const RING_STROKE  = 7;

// ─── Step Stepper  ●──●──○ ────────────────────────────────────────────────────

const StepStepper = ({
  step, total, isComplete, isDisabled, T,
}: {
  step: number; total: number; isComplete: boolean; isDisabled: boolean;
  T: typeof L;
}) => {
  const dots = Array.from({ length: total }, (_, i) => {
    const pos = i + 1;
    if (pos < step || isComplete)    return 'done'   as const;
    if (pos === step && !isDisabled) return 'active' as const;
    return 'future' as const;
  });

  return (
    <View style={st.row}>
      {dots.map((dot, i) => (
        <React.Fragment key={i}>
          <View style={[
            st.dot,
            dot === 'done'   && { backgroundColor: T.gold,    borderColor: T.gold    },
            dot === 'active' && { backgroundColor: T.emerald, borderColor: T.emerald },
            dot === 'future' && { backgroundColor: 'transparent', borderColor: T.textLocked },
          ]}>
            {dot === 'done' && <Check size={7} color="#fff" strokeWidth={3} />}
          </View>
          {i < total - 1 && (
            <View style={[
              st.line,
              dot === 'done' ? { backgroundColor: T.gold } : { backgroundColor: T.border },
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const st = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center' },
  dot:  { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  line: { width: 14, height: 1.5, marginHorizontal: 2 },
});

// ─── Progress Ring ────────────────────────────────────────────────────────────

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

  const rightRot = progressAnim.interpolate({
    inputRange:  [0,         50,    100   ],
    outputRange: ['-180deg', '0deg', '0deg'],
    extrapolate: 'clamp',
  });

  const leftRot = progressAnim.interpolate({
    inputRange:  [0,       50,      100  ],
    outputRange: ['180deg', '180deg', '0deg'],
    extrapolate: 'clamp',
  });

  const leftOpacity = progressAnim.interpolate({
    inputRange: [49, 51], outputRange: [0, 1], extrapolate: 'clamp',
  });

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

// ─── Animated color interpolation helper ─────────────────────────────────────

const animateColor = (
  anim: Animated.Value,
  fromColor: string,
  toColor: string,
): Animated.AnimatedInterpolation<string> =>
  anim.interpolate({ inputRange: [0, 1], outputRange: [fromColor, toColor] });

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DhikrCard({
  title, arabic, transliteration, translation,
  count, target,
  stepNumber, totalSteps = 3, prevStepTitle,
  onIncrement, onDecrement, onReset,
  onPlayAudio, status = 'active', blessing,
}: DhikrCardProps) {
  const { state } = useApp();
  const dark       = state.settings.darkMode;
  const T          = dark ? D : L;

  const isComplete = count >= target;
  const isDisabled = status === 'disabled';
  const progress   = Math.min((count / target) * 100, 100);
  const remaining  = Math.max(target - count, 0);

  // ── Stable refs (never recreated, safe to read inside callbacks) ───────────
  // prevIsComplete tracks the *last rendered* completion state so we can
  // detect the exact frame where the edge occurs, even under React batching.
  const prevIsComplete = useRef(isComplete);
  const glowLoopRef    = useRef<Animated.CompositeAnimation | null>(null);
  const pulseLoopRef   = useRef<Animated.CompositeAnimation | null>(null);

  // ── Animated values — initialised once, driven imperatively ─────────────
  const progressAnim  = useRef(new Animated.Value(progress)).current;
  const colorPhase    = useRef(new Animated.Value(isComplete ? 1 : 0)).current;
  const countScale    = useRef(new Animated.Value(1)).current;
  const tapScale      = useRef(new Animated.Value(1)).current;
  const completeFade  = useRef(new Animated.Value(isComplete ? 1 : 0)).current;
  const completeScale = useRef(new Animated.Value(isComplete ? 1 : 0.84)).current;
  const blessingSlide = useRef(new Animated.Value(isComplete ? 0 : 16)).current;
  const blessingFade  = useRef(new Animated.Value(isComplete ? 1 : 0)).current;
  const accentAnim    = useRef(new Animated.Value(0)).current;
  const glowAnim      = useRef(new Animated.Value(0)).current;
  const pulseAnim     = useRef(new Animated.Value(1)).current;
  const topFade       = useRef(new Animated.Value(0)).current;
  const bottomFade    = useRef(new Animated.Value(1)).current;

  // ── Imperative transition helpers ────────────────────────────────────────
  const enterComplete = useCallback(() => {
    haptic('success');

    // Stop any in-progress exit animation
    glowLoopRef.current?.stop();

    Animated.spring(colorPhase,    { toValue: 1, useNativeDriver: false, damping: 16, stiffness: 180 }).start();
    Animated.spring(completeFade,  { toValue: 1, useNativeDriver: true,  damping: 14, stiffness: 160 }).start();
    Animated.spring(completeScale, { toValue: 1, useNativeDriver: true,  damping: 11, stiffness: 155 }).start();
    Animated.timing(blessingFade,  { toValue: 1, duration: 420, delay: 320, useNativeDriver: true }).start();
    Animated.spring(blessingSlide, { toValue: 0, damping: 14,   delay: 320, useNativeDriver: true } as any).start();

    glowLoopRef.current = Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(glowAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    glowLoopRef.current.start();
  }, []);

  const exitComplete = useCallback(() => {
    haptic('light');

    glowLoopRef.current?.stop();
    glowLoopRef.current = null;

    // All exit animations fire in parallel, immediately — no staggering
    Animated.parallel([
      Animated.spring(colorPhase,    { toValue: 0,    useNativeDriver: false, damping: 20, stiffness: 200 }),
      Animated.timing(completeFade,  { toValue: 0,    duration: 180,          useNativeDriver: true }),
      Animated.spring(completeScale, { toValue: 0.84, useNativeDriver: true,  damping: 16, stiffness: 200 }),
      Animated.timing(blessingFade,  { toValue: 0,    duration: 140,          useNativeDriver: true }),
      Animated.spring(blessingSlide, { toValue: 16,   useNativeDriver: true,  damping: 18, stiffness: 200 } as any),
      Animated.spring(glowAnim,      { toValue: 0,    useNativeDriver: true,  damping: 18, stiffness: 200 }),
    ]).start();
  }, []);

  // ── useLayoutEffect: runs synchronously after every render, before paint.
  //    This guarantees we catch the isComplete edge on the exact frame it
  //    flips — even when React batches state updates (e.g. decrement from
  //    count===target to count===target-1 in the same flush).
  useLayoutEffect(() => {
    const prev = prevIsComplete.current;
    if (isComplete === prev) return;
    prevIsComplete.current = isComplete;

    if (isComplete) enterComplete();
    else            exitComplete();
  });   // ← intentionally no dep array: runs every render, cheap guard inside

  // ── Accent line reveal (once) ────────────────────────────────────────────
  useEffect(() => {
    Animated.timing(accentAnim, {
      toValue: 1, duration: 900, delay: 80,
      easing: Easing.out(Easing.cubic), useNativeDriver: false,
    }).start();
  }, []);

  // ── Ring progress — spring for tactile response ──────────────────────────
  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress, damping: 26, stiffness: 320, useNativeDriver: false,
    }).start();
  }, [progress]);

  // ── Idle pulse when count === 0 ──────────────────────────────────────────
  useEffect(() => {
    if (count === 0 && !isDisabled && !isComplete) {
      pulseLoopRef.current = Animated.loop(Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.00, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]));
      pulseLoopRef.current.start();
    } else {
      pulseLoopRef.current?.stop();
      Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true, damping: 14 }).start();
    }
    return () => pulseLoopRef.current?.stop();
  }, [count === 0, isDisabled, isComplete]);

  // ── Count number pop on every change ────────────────────────────────────
  useEffect(() => {
    if (count > 0) {
      Animated.sequence([
        Animated.spring(countScale, { toValue: 1.18, useNativeDriver: true, damping: 5,  stiffness: 600 }),
        Animated.spring(countScale, { toValue: 1,    useNativeDriver: true, damping: 18, stiffness: 220 }),
      ]).start();
    }
  }, [count]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => () => {
    glowLoopRef.current?.stop();
    pulseLoopRef.current?.stop();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleIncrement = useCallback(() => {
    if (isDisabled || isComplete) return;
    haptic('light');
    Animated.sequence([
      Animated.spring(tapScale, { toValue: 0.93, useNativeDriver: true, damping: 5,  stiffness: 650 }),
      Animated.spring(tapScale, { toValue: 1,    useNativeDriver: true, damping: 12, stiffness: 260 }),
    ]).start();
    onIncrement();
  }, [isDisabled, isComplete, onIncrement]);

  // Decrement fires exitComplete immediately when crossing below target,
  // without waiting for React to re-render — feels instant.
  const handleDecrement = useCallback(() => {
    if (isDisabled || count <= 0) return;
    haptic('light');
    // If we are exactly at target, the next render will flip isComplete→false.
    // Fire the exit animation NOW (before that render) for zero-latency feel.
    if (count === target) exitComplete();
    onDecrement();
  }, [isDisabled, count, target, exitComplete, onDecrement]);

  const handleReset = useCallback(() => {
    if (isDisabled) return;
    haptic('medium');
    // If currently complete, fire exit immediately
    if (isComplete) exitComplete();
    onReset();
  }, [isDisabled, isComplete, exitComplete, onReset]);

  const handleScroll = useCallback((e: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const y    = contentOffset.y;
    const maxY = contentSize.height - layoutMeasurement.height;
    Animated.parallel([
      Animated.timing(topFade,    { toValue: y < 8        ? 0 : 1, duration: 120, useNativeDriver: true }),
      Animated.timing(bottomFade, { toValue: y >= maxY - 8 ? 0 : 1, duration: 120, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Color interpolations ──────────────────────────────────────────────────
  const ringColor = isComplete ? T.goldMid    : T.emeraldMid;
  const ringTrack = isComplete ? T.goldTrack  : T.emeraldTrack;

  const accentColor    = animateColor(colorPhase, isDisabled ? T.border : T.emerald, T.gold);
  const countColor     = animateColor(colorPhase, T.emeraldMid, T.goldMid);
  const stripColor     = animateColor(colorPhase, T.emeraldMid, T.goldMid);
  const countTagBg     = animateColor(colorPhase, T.emeraldLight, T.goldLight);
  const countTagBorder = animateColor(colorPhase, `${T.emerald}30`, `${T.gold}30`);
  const countTagText   = animateColor(colorPhase, T.emerald, T.gold);
  const titleColor     = isDisabled
    ? T.textMuted
    : animateColor(colorPhase, T.emerald, T.gold) as any;

  const accentWidth = accentAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.10] });
  const stripWidth  = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  const cardBorderColor = isComplete
    ? (dark ? '#2C2210' : '#DDC97A')
    : isDisabled ? T.lockedBorder
    : T.border;

  return (
    <View style={[s.card, { backgroundColor: T.bg, borderColor: cardBorderColor }]}>

      {/* ── Completion glow overlay ── */}
      <Animated.View
        pointerEvents="none"
        style={[s.glowOverlay, { backgroundColor: T.gold, opacity: glowOpacity }]}
      />

      {/* ── Top accent line ── */}
      <View style={[s.accentTrack, { backgroundColor: T.border }]}>
        <Animated.View style={[s.accentFill, { width: accentWidth, backgroundColor: accentColor as any }]} />
      </View>

      {/* ════ HEADER ════ */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          {stepNumber != null && (
            <StepStepper
              step={stepNumber} total={totalSteps}
              isComplete={isComplete} isDisabled={isDisabled} T={T}
            />
          )}
          <Animated.Text style={[s.title, { color: titleColor }]}>
            {title}
          </Animated.Text>
        </View>

        <View style={s.headerRight}>
          {isDisabled ? (
            <View style={[s.countTag, { backgroundColor: T.lockedBg, borderColor: T.border }]}>
              <Text style={[s.countTagText, { color: T.textLocked }]}>{count}/{target}</Text>
            </View>
          ) : (
            <Animated.View style={[s.countTag, { backgroundColor: countTagBg as any, borderColor: countTagBorder as any }]}>
              <Animated.Text style={[s.countTagText, { color: countTagText as any }]}>
                {count}/{target}
              </Animated.Text>
            </Animated.View>
          )}

          {onPlayAudio && !isDisabled && (
            <TouchableOpacity
              onPress={onPlayAudio}
              style={[s.audioBtn, { borderColor: T.border, backgroundColor: T.bgArabic }]}
              activeOpacity={0.7}
            >
              <Volume2 color={T.emerald} size={15} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ════ ARABIC TEXT ZONE ════ */}
      <View style={[
        s.arabicBlock,
        {
          backgroundColor: T.bgArabic,
          borderColor: isComplete ? `${T.gold}30` : isDisabled ? T.border : T.borderSoft,
          opacity: isDisabled ? 0.55 : 1,
        },
      ]}>
        <ScrollView
          style={s.arabicScroll}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onContentSizeChange={(_, h) => bottomFade.setValue(h <= ARABIC_MAX_H ? 0 : 1)}
          bounces alwaysBounceVertical={false}
          contentContainerStyle={s.arabicScrollContent}
          nestedScrollEnabled
        >
          <Text style={[s.arabic, { color: isDisabled ? T.textMuted : T.text }]}>
            {arabic}
          </Text>

          <View style={s.ornament}>
            <View style={[s.ornamentLine,    { backgroundColor: isDisabled ? T.border : `${T.emerald}28` }]} />
            <View style={[s.ornamentDiamond, { borderColor:     isDisabled ? T.border : `${T.emerald}60` }]} />
            <View style={[s.ornamentLine,    { backgroundColor: isDisabled ? T.border : `${T.emerald}28` }]} />
          </View>

          <Text style={[
            s.translit,
            { color: isDisabled ? T.textMuted : isComplete ? T.goldMid : T.emerald },
          ]}>
            {transliteration}
          </Text>

          <Text style={[s.translation, { color: isDisabled ? T.textLocked : T.textMid }]}>
            {translation}
          </Text>
        </ScrollView>

        <Animated.View pointerEvents="none" style={[s.fadeTop, { opacity: topFade,    backgroundColor: T.bgArabic }]} />
        <Animated.View pointerEvents="none" style={[s.fadeBot, { opacity: bottomFade, backgroundColor: T.bgArabic }]} />
      </View>

      {/* ════ PROGRESS STRIP ════ */}
      <View style={s.stripRow}>
        <View style={[s.stripTrack, { backgroundColor: isDisabled ? T.border : T.borderSoft }]}>
          {!isDisabled && (
            <Animated.View style={[s.stripFill, { width: stripWidth, backgroundColor: stripColor as any }]} />
          )}
        </View>
        <Text style={[s.stripPct, { color: isDisabled ? T.textLocked : (isComplete ? T.gold : T.emerald) }]}>
          {isDisabled ? '—' : `${Math.round(progress)}%`}
        </Text>
      </View>

      {/* ════ COUNTER ZONE ════ */}
      <TouchableOpacity
        onPress={handleIncrement}
        disabled={isComplete || isDisabled}
        activeOpacity={0.92}
        style={[
          s.counterZone,
          {
            backgroundColor: isDisabled ? T.lockedBg : T.bgCounter,
            borderColor:      isDisabled ? T.lockedBorder : T.border,
          },
        ]}
      >

        {/* LOCKED */}
        {isDisabled && (
          <View style={s.lockedContent}>
            <View style={[s.lockCircle, { borderColor: T.border, backgroundColor: T.bg }]}>
              <Lock size={20} color={T.textMuted} strokeWidth={1.8} />
            </View>
            <View style={s.lockText}>
              <Text style={[s.lockTitle, { color: T.textMid }]}>Step {stepNumber} — Locked</Text>
              {prevStepTitle
                ? <Text style={[s.lockHint, { color: T.textMuted }]}>Complete {prevStepTitle} first</Text>
                : stepNumber != null && stepNumber > 1
                  ? <Text style={[s.lockHint, { color: T.textMuted }]}>Complete the previous step</Text>
                  : null}
            </View>
          </View>
        )}

        {/* ACTIVE COUNTER */}
        {!isDisabled && (
          <Animated.View style={[s.activeContent, { transform: [{ scale: tapScale }] }]}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <ProgressRing
                progressAnim={progressAnim}
                size={RING_SIZE} stroke={RING_STROKE}
                color={ringColor}
                trackColor={ringTrack}
                innerBg={T.bgCounter}
              >
                <Animated.View style={{ transform: [{ scale: countScale }] }}>
                  <Animated.Text style={[s.countNum, { color: countColor as any }]}>
                    {count}
                  </Animated.Text>
                </Animated.View>
              </ProgressRing>
            </Animated.View>

            <View style={s.activeRight}>
              <Text style={[s.remainingNum, { color: T.text }]}>{remaining}</Text>
              <Text style={[s.remainingLabel, { color: T.textMuted }]}>
                {count === 0 ? 'to recite' : remaining === 0 ? 'done' : 'remaining'}
              </Text>
              {count === 0 && (
                <View style={[s.tapPill, { backgroundColor: T.emeraldLight, borderColor: `${T.emerald}28` }]}>
                  <Text style={[s.tapPillText, { color: T.emerald }]}>tap to begin</Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* COMPLETE OVERLAY */}
        {!isDisabled && (
          <Animated.View
            pointerEvents="none"
            style={[s.completeOverlay, { backgroundColor: T.bgCounter, opacity: completeFade }]}
          >
            <Animated.View style={[
              s.completeCircle,
              {
                borderColor: T.gold,
                backgroundColor: dark ? T.goldLight : '#FFF8E6',
                transform: [{ scale: completeScale }],
              },
            ]}>
              <Check size={30} color={T.gold} strokeWidth={2.2} />
            </Animated.View>
            <Animated.View style={[s.completeText, { transform: [{ scale: completeScale }] }]}>
              <Text style={[s.completeLbl,   { color: T.gold }]}>Completed</Text>
              <Text style={[s.completeCount, { color: T.textMuted }]}>{target}/{target}</Text>
            </Animated.View>
          </Animated.View>
        )}

        {/* SIDE BUTTONS */}
        {!isDisabled && (
          <View style={s.sideBtns} pointerEvents="box-none">
            <TouchableOpacity
              onPress={handleDecrement}
              disabled={count <= 0}
              style={[
                s.sideBtn,
                { borderColor: T.border, backgroundColor: T.bg },
                count <= 0 && s.sideBtnOff,
              ]}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
            >
              <Minus size={17} strokeWidth={2.5} color={count <= 0 ? T.textMuted : T.textMid} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleReset}
              disabled={count === 0}
              style={[
                s.sideBtn,
                { borderColor: T.border, backgroundColor: T.bg },
                count === 0 && s.sideBtnOff,
              ]}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
            >
              <RotateCcw size={15} strokeWidth={2.5} color={count === 0 ? T.textMuted : T.textMid} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {/* ════ BLESSING BANNER ════ */}
      {isComplete && blessing ? (
        <Animated.View style={[
          s.blessing,
          {
            borderTopColor: `${T.gold}22`,
            opacity: blessingFade,
            transform: [{ translateY: blessingSlide }],
            backgroundColor: dark ? T.goldLight : '#FDFAF0',
          },
        ]}>
          <View style={[s.blessingBar, { backgroundColor: `${T.gold}40` }]} />
          <Text style={[s.blessingText, { color: T.gold }]}>{blessing}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({

  card: {
    borderRadius: 26,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  glowOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0,
  },

  accentTrack: { height: 3 },
  accentFill:  { height: 3 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 18, paddingTop: 15, paddingBottom: 12, gap: 10,
  },
  headerLeft:  { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, flexWrap: 'wrap' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  title:       { fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  countTag:    { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 9, borderWidth: 1 },
  countTagText:{ fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  audioBtn:    { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5 },

  arabicBlock:         { marginHorizontal: 16, borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  arabicScroll:        { maxHeight: ARABIC_MAX_H },
  arabicScrollContent: { paddingVertical: 22, paddingHorizontal: 20, alignItems: 'center' },
  arabic:              { fontSize: 28, textAlign: 'center', lineHeight: 48, fontFamily: 'Amiri_400Regular', marginBottom: 14, width: '100%' },
  ornament:            { flexDirection: 'row', alignItems: 'center', width: '65%', marginBottom: 13, gap: 8 },
  ornamentLine:        { flex: 1, height: 1 },
  ornamentDiamond:     { width: 6, height: 6, borderWidth: 1, transform: [{ rotate: '45deg' }] },
  translit:            { fontSize: 14, textAlign: 'center', fontStyle: 'italic', fontWeight: '600', letterSpacing: 0.2, lineHeight: 22, marginBottom: 8, width: '100%' },
  translation:         { fontSize: 13, textAlign: 'justify', lineHeight: 21, paddingHorizontal: 4, width: '100%' },
  fadeTop:             { position: 'absolute', top: 0, left: 0, right: 0, height: 24 },
  fadeBot:             { position: 'absolute', bottom: 0, left: 0, right: 0, height: 24 },

  stripRow:   { flexDirection: 'row', alignItems: 'center', marginHorizontal: 18, marginTop: 14, marginBottom: 10, gap: 8 },
  stripTrack: { flex: 1, height: 3, borderRadius: 2, overflow: 'hidden' },
  stripFill:  { height: 3, borderRadius: 2 },
  stripPct:   { fontSize: 10, fontWeight: '800', letterSpacing: 0.4, width: 30, textAlign: 'right' },

  counterZone: {
    marginHorizontal: 16, marginBottom: 16,
    borderRadius: 20, borderWidth: 1,
    minHeight: 130, paddingVertical: 22, paddingHorizontal: 20,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },

  lockedContent: { flexDirection: 'row', alignItems: 'center', gap: 16, justifyContent: 'center' },
  lockCircle:    { width: 52, height: 52, borderRadius: 26, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  lockText:      { gap: 4 },
  lockTitle:     { fontSize: 14, fontWeight: '700', letterSpacing: 0.2 },
  lockHint:      { fontSize: 12, fontWeight: '500' },

  activeContent:  { flexDirection: 'row', alignItems: 'center', gap: 24 },
  activeRight:    { alignItems: 'flex-start', gap: 4 },
  remainingNum:   { fontSize: 44, fontWeight: '200', lineHeight: 46, letterSpacing: -1 },
  remainingLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  tapPill:        { marginTop: 6, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  tapPillText:    { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  countNum:       { fontSize: 30, fontWeight: '200', letterSpacing: -1, lineHeight: 34 },

  completeOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 18,
  },
  completeCircle: { width: 68, height: 68, borderRadius: 34, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  completeText:   { alignItems: 'flex-start', gap: 3 },
  completeLbl:    { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  completeCount:  { fontSize: 11, fontWeight: '600', letterSpacing: 0.4 },

  sideBtns: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 14,
  },
  sideBtn:    { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5 },
  sideBtnOff: { opacity: 0.22 },

  blessing:    { paddingTop: 0, paddingBottom: 18, paddingHorizontal: 22, alignItems: 'center', borderTopWidth: 1, gap: 14 },
  blessingBar: { width: '40%', height: 2, borderRadius: 1, marginTop: 14 },
  blessingText:{ fontSize: 16.5, fontFamily: 'Amiri_400Regular', lineHeight: 30, textAlign: 'center', letterSpacing: 0.3 },
});