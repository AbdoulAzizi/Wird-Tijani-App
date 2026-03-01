/**
 * CompletionBanner — Generic full-screen completion modal
 *
 * Shown when a practice session (Wird, Wazifa, Hadra…) is fully complete.
 * Fully driven by props — zero screen-specific logic inside.
 *
 * ─── Usage ────────────────────────────────────────────────────────────────────
 *
 *   import CompletionBanner from '../../components/CompletionBanner';
 *
 *   {showModal && (
 *     <CompletionBanner
 *       theme="wazifa"
 *       titleArabic="الحمد لله"
 *       titleLatin="Alḥamdulillāh"
 *       practiceName="Wazīfa"          // used in session label & confirm alert
 *       completionsToday={wazifaCompletionsToday}
 *       targetPerDay={state.frequencySettings.wazifaPerDay}
 *       streak={state.streak}
 *       hadith="Whoever perseveres in the Wazifa, Allah opens the doors of nearness."
 *       confirmLabel="Record Completion"
 *       onComplete={handleCompleteWazifa}
 *       onClose={() => setShowModal(false)}
 *     />
 *   )}
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, memo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Award, X } from 'lucide-react-native';

// ─── Theme presets ────────────────────────────────────────────────────────────

export type CompletionTheme = 'wird' | 'wazifa' | 'hadra';

const THEMES: Record<CompletionTheme, {
  gradientTop:    [string, string];  // top bar gradient
  topBarGlow:     string;            // shadow color of card
  checkGradient:  [string, string];  // award icon gradient
  supertitleColor:string;
  titleColor:     string;
  latinColor:     string;
  badgeGreen:     { bg: string; border: string; text: string };
}> = {
  wird: {
    gradientTop:     ['#059669', '#34D399'],
    topBarGlow:      '#059669',
    checkGradient:   ['#059669', '#34D399'],
    supertitleColor: '#059669',
    titleColor:      '#065F46',
    latinColor:      '#059669',
    badgeGreen:      { bg: '#D1FAE5', border: '#A7F3D0', text: '#065F46' },
  },
  wazifa: {
    gradientTop:     ['#4C1D95', '#7C3AED'],
    topBarGlow:      '#7C3AED',
    checkGradient:   ['#4C1D95', '#7C3AED'],
    supertitleColor: '#7C3AED',
    titleColor:      '#2E1065',
    latinColor:      '#7C3AED',
    badgeGreen:      { bg: '#EDE9FE', border: '#DDD6FE', text: '#4C1D95' },
  },
  hadra: {
    gradientTop:     ['#2E0F5A', '#7C3AED'],
    topBarGlow:      '#4C1D95',
    checkGradient:   ['#2E0F5A', '#7C3AED'],
    supertitleColor: '#7C3AED',
    titleColor:      '#1E0A3C',
    latinColor:      '#7C3AED',
    badgeGreen:      { bg: '#EDE9FE', border: '#C4B5FD', text: '#2E0F5A' },
  },
};

// ─── Public types ─────────────────────────────────────────────────────────────

export interface CompletionBannerProps {
  theme:              CompletionTheme;
  titleArabic:        string;   // e.g. "الحمد لله"
  titleLatin:         string;   // e.g. "Alḥamdulillāh"
  practiceName:       string;   // e.g. "Wird", "Wazīfa", "Hadra"
  completionsToday:   number;   // how many sessions recorded today so far
  targetPerDay:       number;   // how many sessions required per day
  streak:             number;   // current streak (0 = hide badge)
  hadith:             string;   // inspirational text shown at bottom
  confirmLabel?:      string;   // default "Record Completion"
  onComplete:         () => void;
  onClose:            () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CompletionBanner = memo(({
  theme, titleArabic, titleLatin, practiceName,
  completionsToday, targetPerDay, streak, hadith,
  confirmLabel = 'Record Completion',
  onComplete, onClose,
}: CompletionBannerProps) => {
  const t = THEMES[theme];

  // ── Animations ──────────────────────────────────────────────────────────
  const fade        = useRef(new Animated.Value(0)).current;
  const scale       = useRef(new Animated.Value(0.88)).current;
  const checkScale  = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  // 8 burst particles — alternating gold / theme accent
  const particles = useRef(
    Array.from({ length: 8 }, (_, i) => ({
      xy:      new Animated.ValueXY({ x: 0, y: 0 }),
      opacity: new Animated.Value(0),
      angle:   (i / 8) * 2 * Math.PI,
      color:   i % 2 === 0 ? '#F59E0B' : t.checkGradient[1],
    }))
  ).current;

  useEffect(() => {
    // Entry sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade,  { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }),
      ]),
      Animated.spring(checkScale,  { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(contentFade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Particle burst after check lands
    particles.forEach((p, i) => {
      const dist = 55 + Math.random() * 35;
      Animated.sequence([
        Animated.delay(430 + i * 55),
        Animated.parallel([
          Animated.timing(p.opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
          Animated.timing(p.xy, {
            toValue: { x: dist * Math.cos(p.angle), y: dist * Math.sin(p.angle) },
            duration: 620, useNativeDriver: true,
          }),
        ]),
        Animated.timing(p.opacity, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  // ── Session label ────────────────────────────────────────────────────────
  // "completionsToday" is BEFORE this one is recorded, so next = +1
  const nextCount   = completionsToday + 1;
  const willFinish  = nextCount >= targetPerDay;

  const sessionLabel = targetPerDay === 1
    ? `${practiceName} complete`
    : nextCount === 1
    ? `1st session of ${targetPerDay}`
    : `${nextCount}/${targetPerDay} — all sessions complete!`;

  const streakLabel = willFinish && streak > 0
    ? `🔥 ${streak + 1}-day streak continues!`
    : streak > 0
    ? `🔥 ${streak}-day streak`
    : null;

  return (
    <Animated.View style={[s.overlay, { opacity: fade }]}>
      {/* Backdrop dismiss */}
      <Pressable style={s.backdrop} onPress={onClose} />

      <Animated.View style={[
        s.card,
        { shadowColor: t.topBarGlow },
        { transform: [{ scale }] },
      ]}>
        {/* Coloured top bar */}
        <LinearGradient
          colors={[...t.gradientTop, t.gradientTop[0]] as any}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={s.topBar}
        />

        {/* Close */}
        <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.75}>
          <X color="rgba(100,116,139,0.7)" size={16} strokeWidth={2.5} />
        </TouchableOpacity>

        {/* ── Award icon + burst ── */}
        <View style={s.iconWrap}>
          {particles.map((p, i) => (
            <Animated.View
              key={i}
              style={[s.particle, {
                backgroundColor: p.color,
                opacity: p.opacity,
                transform: [{ translateX: p.xy.x }, { translateY: p.xy.y }],
              }]}
            />
          ))}
          <Animated.View style={[s.checkCircle, { transform: [{ scale: checkScale }] }]}>
            <LinearGradient colors={t.checkGradient as any} style={s.checkGrad}>
              <Award color="#FFFFFF" size={36} strokeWidth={2} />
            </LinearGradient>
          </Animated.View>
        </View>

        {/* ── Text ── */}
        <Animated.View style={[s.textBlock, { opacity: contentFade }]}>
          <Text style={[s.supertitle, { color: t.supertitleColor }]}>
            ✦  {practiceName} Complete  ✦
          </Text>
          <Text style={[s.titleArabic, { color: t.titleColor }]}>{titleArabic}</Text>
          <Text style={[s.titleLatin,  { color: t.latinColor  }]}>{titleLatin}</Text>

          {/* Live session / streak badges */}
          <View style={s.badgeRow}>
            <View style={[s.badge, {
              backgroundColor: t.badgeGreen.bg,
              borderColor:     t.badgeGreen.border,
            }]}>
              <Text style={[s.badgeText, { color: t.badgeGreen.text }]}>{sessionLabel}</Text>
            </View>
            {streakLabel && (
              <View style={[s.badge, s.badgeAmber]}>
                <Text style={[s.badgeText, s.badgeAmberText]}>{streakLabel}</Text>
              </View>
            )}
          </View>

          <Text style={s.message}>
            May Allah accept your {practiceName.toLowerCase()} and elevate your station.{'\n'}
            The angels witnessed your remembrance.
          </Text>

          {/* Divider */}
          <LinearGradient
            colors={['transparent', '#F59E0B', 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.divider}
          />

          <Text style={s.hadith}>"{hadith}"</Text>
        </Animated.View>

        {/* ── Actions ── */}
        <Animated.View style={[s.actions, { opacity: contentFade }]}>
          {/* <TouchableOpacity style={s.btnSecondary} onPress={onClose} activeOpacity={0.8}>
            <Text style={s.btnSecondaryText}>Later</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[s.btnPrimary, { backgroundColor: t.checkGradient[0] }]}
            onPress={onComplete}
            activeOpacity={0.85}
          >
            <CheckCircle color="#FFFFFF" size={16} strokeWidth={2.5} style={{ marginRight: 7 }} />
            <Text style={s.btnPrimaryText}>{confirmLabel}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
});

export default CompletionBanner;

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 998, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  backdrop: { ...StyleSheet.absoluteFillObject },

  card: {
    width: '100%', borderRadius: 28,
    backgroundColor: '#FFFFFF', overflow: 'hidden',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25, shadowRadius: 32, elevation: 20,
  },
  topBar:    { height: 4 },
  closeBtn:  {
    position: 'absolute', top: 14, right: 14,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },

  // Icon burst
  iconWrap:    { alignItems: 'center', justifyContent: 'center', marginTop: 32, marginBottom: 8, height: 100 },
  particle:    { position: 'absolute', width: 9, height: 9, borderRadius: 4.5 },
  checkCircle: {
    width: 84, height: 84, borderRadius: 42, overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3,
    shadowRadius: 16, elevation: 10,
  },
  checkGrad:   { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Text block
  textBlock:       { alignItems: 'center', paddingHorizontal: 24, gap: 8 },
  supertitle:      { fontSize: 11, fontWeight: '800', letterSpacing: 3, textTransform: 'uppercase' },
  titleArabic:     { fontSize: 38, fontWeight: '900', lineHeight: 50 },
  titleLatin:      { fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

  badgeRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 4 },
  badge:           { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  badgeText:       { fontSize: 12, fontWeight: '700' },
  badgeAmber:      { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  badgeAmberText:  { color: '#92400E' },

  message:  { fontSize: 13, color: '#475569', textAlign: 'center', lineHeight: 22, marginTop: 4 },
  divider:  { height: 1, width: '70%', opacity: 0.5, marginVertical: 6 },
  hadith:   { fontSize: 12, color: '#64748B', textAlign: 'center', lineHeight: 20, fontStyle: 'italic', paddingHorizontal: 8, marginBottom: 4 },

  // Buttons
  actions:          { flexDirection: 'row', gap: 10, padding: 20, paddingTop: 12 },
  btnSecondary:     { flex: 1, paddingVertical: 13, borderRadius: 16, borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  btnSecondaryText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  btnPrimary:       { flex: 2, flexDirection: 'row', paddingVertical: 13, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryText:   { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});