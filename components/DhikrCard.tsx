import React, { useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Easing, Platform
} from 'react-native';
import { Minus, Plus, RotateCcw, Volume2, CheckCircle } from 'lucide-react-native';
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
  if (type === 'success') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } else if (type === 'medium') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } else {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DhikrCard({
  title,
  arabic,
  transliteration,
  translation,
  count,
  target,
  onIncrement,
  onDecrement,
  onReset,
  onPlayAudio,
  status = 'active',
  blessing,
}: DhikrCardProps) {
  const { state }  = useApp();
  const dark       = state.settings.darkMode;
  const isComplete = count >= target;
  const isDisabled = status === 'disabled';
  const progress   = Math.min((count / target) * 100, 100);
  const remaining  = Math.max(target - count, 0);

  // ── Animated values ──
  const progressAnim  = useRef(new Animated.Value(0)).current;
  const countScale    = useRef(new Animated.Value(1)).current;
  const btnScale      = useRef(new Animated.Value(1)).current;
  const completionBg  = useRef(new Animated.Value(0)).current;
  const blessingSlide = useRef(new Animated.Value(20)).current;
  const blessingFade  = useRef(new Animated.Value(0)).current;

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Animate counter pop on each increment
  useEffect(() => {
    if (count > 0) {
      Animated.sequence([
        Animated.spring(countScale, { toValue: 1.25, useNativeDriver: true, damping: 8, stiffness: 400 }),
        Animated.spring(countScale, { toValue: 1,    useNativeDriver: true, damping: 12, stiffness: 200 }),
      ]).start();
    }
  }, [count]);

  // Completion celebration
  useEffect(() => {
    if (isComplete) {
      haptic('success');
      Animated.parallel([
        Animated.spring(completionBg, { toValue: 1, useNativeDriver: false, damping: 14 }),
        Animated.timing(blessingFade, { toValue: 1, duration: 500, delay: 300, useNativeDriver: true }),
        Animated.spring(blessingSlide, { toValue: 0, useNativeDriver: true, damping: 14, delay: 300 }),
      ]).start();
    } else {
      completionBg.setValue(0);
      blessingFade.setValue(0);
      blessingSlide.setValue(20);
    }
  }, [isComplete]);

  // Press animation for + button
  const handleIncrement = useCallback(() => {
    if (isDisabled || isComplete) return;
    haptic('light');
    Animated.sequence([
      Animated.spring(btnScale, { toValue: 0.87, useNativeDriver: true, damping: 8,  stiffness: 500 }),
      Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true, damping: 12, stiffness: 250 }),
    ]).start();
    onIncrement();
  }, [isDisabled, isComplete, onIncrement]);

  const handleDecrement = useCallback(() => {
    if (isDisabled || count <= 0) return;
    haptic('light');
    onDecrement();
  }, [isDisabled, count, onDecrement]);

  const handleReset = useCallback(() => {
    if (isDisabled) return;
    haptic('medium');
    onReset();
  }, [isDisabled, onReset]);

  // ── Dynamic colors ──
  const cardBg = dark
    ? (isComplete ? '#052E16' : '#1E293B')
    : (isComplete ? '#FAFFFE' : '#FFFFFF');

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const accentBorderColor = isComplete ? '#059669' : (dark ? '#334155' : '#E2E8F0');

  return (
    <View style={[
      styles.card,
      { backgroundColor: cardBg },
      { borderColor: accentBorderColor },
      isDisabled && styles.cardDisabled,
    ]}>

      {/* ── Top progress strip ── */}
      <View style={[styles.strip, dark ? styles.stripDark : null]}>
        <Animated.View style={[
          styles.stripFill,
          {
            width: progressWidth,
            backgroundColor: isComplete ? '#F59E0B' : '#059669',
          }
        ]} />
      </View>

      {/* ── Header: title + audio ── */}
      <View style={styles.header}>
        <View style={[
          styles.titlePill,
          { backgroundColor: isComplete
              ? (dark ? '#14532D' : '#D1FAE5')
              : (dark ? '#1E3A2F' : '#F0FDF4') }
        ]}>
          <Text style={[styles.title, dark && styles.titleDark]}>
            {title}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={[styles.remainingText, dark && styles.remainingTextDark, isComplete && styles.remainingComplete]}>
            {isComplete ? '✓ Done' : `${remaining} left`}
          </Text>
          {onPlayAudio && (
            <TouchableOpacity
              onPress={onPlayAudio}
              disabled={isDisabled}
              style={[styles.audioBtn, dark && styles.audioBtnDark]}
              activeOpacity={0.7}
            >
              <Volume2 color={isDisabled ? '#9CA3AF' : '#059669'} size={18} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Arabic text block ── */}
      <View style={[
        styles.arabicBlock,
        dark ? styles.arabicBlockDark : null,
        isComplete && (dark ? styles.arabicBlockCompleteDark : styles.arabicBlockCompleteLight),
      ]}>
        <Text style={[styles.arabic, dark && styles.arabicDark, isDisabled && styles.muted]} numberOfLines={24}>
          {arabic}
        </Text>
        <View style={styles.dividerLine} />
        <Text style={[styles.transliteration, dark && styles.transliterationDark, isDisabled && styles.muted]}>
          {transliteration}
        </Text>
        <Text style={[styles.translation, dark && styles.translationDark, isDisabled && styles.muted]}>
          {translation}
        </Text>
      </View>

      {/* ── Counter + Controls ── */}
      <View style={styles.counterRow}>

        {/* Circular counter display */}
        <View style={styles.ringSection}>
          <View style={[
            styles.ringOuter,
            { borderColor: isComplete ? '#F59E0B' : (dark ? '#334155' : '#E2E8F0') }
          ]}>
            <View style={[
              styles.ringInner,
              { backgroundColor: isComplete ? '#059669' : (dark ? '#0F172A' : '#F8FAFC') }
            ]}>
              {isComplete ? (
                <CheckCircle color="#FFFFFF" size={30} strokeWidth={2.5} />
              ) : (
                <Animated.Text
                  style={[
                    styles.countText,
                    dark && styles.countTextDark,
                    { transform: [{ scale: countScale }] }
                  ]}
                >
                  {count}
                </Animated.Text>
              )}
            </View>
          </View>
          <Text style={[styles.ofTarget, dark && styles.ofTargetDark]}>of {target}</Text>
        </View>

        {/* Right side: bar + buttons */}
        <View style={styles.rightSection}>
          {/* Progress percentage row */}
          <View style={styles.progressRow}>
            <View style={[styles.progressTrack, dark && styles.progressTrackDark]}>
              <Animated.View style={[
                styles.progressFill,
                {
                  width: progressWidth,
                  backgroundColor: isComplete ? '#F59E0B' : '#059669',
                }
              ]} />
            </View>
            <Text style={[styles.pct, dark && styles.pctDark, isComplete && styles.pctComplete]}>
              {Math.round(progress)}%
            </Text>
          </View>

          {/* − / + / ↺ */}
          <View style={styles.buttons}>
            {/* Decrement */}
            <TouchableOpacity
              onPress={handleDecrement}
              disabled={count <= 0 || isDisabled}
              style={[
                styles.sideBtn,
                dark && styles.sideBtnDark,
                (count <= 0 || isDisabled) && styles.btnDisabled,
              ]}
              activeOpacity={0.7}
            >
              <Minus
                color={(count <= 0 || isDisabled) ? (dark ? '#475569' : '#D1D5DB') : (dark ? '#CBD5E1' : '#475569')}
                size={20} strokeWidth={2.5}
              />
            </TouchableOpacity>

            {/* Main + button */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                onPress={handleIncrement}
                disabled={isComplete || isDisabled}
                style={[
                  styles.mainBtn,
                  isComplete && styles.mainBtnComplete,
                  isDisabled && styles.mainBtnDisabled,
                ]}
                activeOpacity={0.85}
              >
                {isComplete
                  ? <CheckCircle color="#FFFFFF" size={28} strokeWidth={2.5} />
                  : <Plus        color="#FFFFFF"      size={28} strokeWidth={2.5} />
                }
              </TouchableOpacity>
            </Animated.View>

            {/* Reset */}
            <TouchableOpacity
              onPress={handleReset}
              disabled={isDisabled}
              style={[
                styles.sideBtn,
                dark && styles.sideBtnDark,
                isDisabled && styles.btnDisabled,
              ]}
              activeOpacity={0.7}
            >
              <RotateCcw
                color={isDisabled ? (dark ? '#475569' : '#D1D5DB') : (dark ? '#CBD5E1' : '#475569')}
                size={18} strokeWidth={2.5}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Blessing banner (completion only) ── */}
      {blessing && isComplete && (
        <Animated.View style={[
          styles.blessing,
          {
            opacity: blessingFade,
            transform: [{ translateY: blessingSlide }],
          }
        ]}>
          <View style={[styles.blessingDivider, dark && styles.blessingDividerDark]} />
          <Text style={[styles.blessingArabic, dark && styles.blessingArabicDark]}>
            {blessing}
          </Text>
          <Text style={[styles.blessingTrans, dark && styles.blessingTransDark]}>
            May Allah accept and bless you 🤲
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 6,
    overflow: 'hidden',
  },
  cardDisabled: { opacity: 0.5 },

  // Progress strip
  strip: {
    height: 5,
    backgroundColor: '#E2E8F0',
  },
  stripDark: { backgroundColor: '#334155' },
  stripFill: { height: '100%' },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
  },
  titlePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
    letterSpacing: 0.2,
  },
  titleDark: { color: '#10B981' },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  remainingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  remainingTextDark: { color: '#64748B' },
  remainingComplete: { color: '#059669' },
  audioBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
  },
  audioBtnDark: { backgroundColor: '#1E3A2F', borderColor: '#065F46' },

  // Arabic block
  arabicBlock: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
  },
  arabicBlockDark: { backgroundColor: '#0F172A', borderColor: '#1E293B' },
  arabicBlockCompleteLight: { borderColor: '#A7F3D0', backgroundColor: '#F0FDF4' },
  arabicBlockCompleteDark:  { borderColor: '#065F46', backgroundColor: '#042F20' },
  arabic: {
    fontSize: 28,
    textAlign: 'center',
    color: '#1E293B',
    lineHeight: 46,
    fontFamily: 'Amiri_400Regular',
    marginBottom: 14,
  },
  arabicDark: { color: '#F1F5F9' },
  dividerLine: {
    width: 40,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
  },
  transliteration: {
    fontSize: 14,
    textAlign: 'center',
    color: '#059669',
    fontStyle: 'italic',
    fontWeight: '600',
    marginBottom: 8,
  },
  transliterationDark: { color: '#34D399' },
  translation: {
    fontSize: 13,
    textAlign: 'center',
    color: '#64748B',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  translationDark: { color: '#94A3B8' },
  muted: { color: '#9CA3AF' },

  // Counter row
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 20,
    gap: 16,
  },

  // Ring / circle counter
  ringSection: { alignItems: 'center', gap: 6 },
  ringOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 7,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringInner: {
    flex: 1,
    width: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: -1,
  },
  countTextDark: { color: '#10B981' },
  ofTarget: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  ofTargetDark: { color: '#64748B' },

  // Right controls
  rightSection: { flex: 1, gap: 14 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressTrackDark: { backgroundColor: '#334155' },
  progressFill: { height: '100%', borderRadius: 4 },
  pct: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    width: 36,
    textAlign: 'right',
  },
  pctDark: { color: '#10B981' },
  pctComplete: { color: '#F59E0B' },

  // Buttons
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  sideBtnDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  btnDisabled: { opacity: 0.35 },
  mainBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  mainBtnComplete: {
    backgroundColor: '#F59E0B',
    shadowColor: '#F59E0B',
  },
  mainBtnDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },

  // Blessing
  blessing: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    alignItems: 'center',
  },
  blessingDivider: {
    width: 56,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#D1FAE5',
    marginBottom: 16,
  },
  blessingDividerDark: { backgroundColor: '#065F46' },
  blessingArabic: {
    fontSize: 18,
    color: '#059669',
    fontFamily: 'Amiri_400Regular',
    marginBottom: 6,
    textAlign: 'center',
  },
  blessingArabicDark: { color: '#34D399' },
  blessingTrans: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  blessingTransDark: { color: '#94A3B8' },
});