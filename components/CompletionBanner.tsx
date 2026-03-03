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
 *       practiceName="Wazīfa"
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
import { CheckCircle, X } from 'lucide-react-native';

// ─── Theme presets ────────────────────────────────────────────────────────────

export type CompletionTheme = 'wird' | 'wazifa' | 'hadra';

const THEMES: Record<CompletionTheme, {
  gradient:    [string, string];
  glow:        string;
  accent:      string;
  title:       string;
  badge:       { bg: string; border: string; text: string };
}> = {
  wird: {
    gradient: ['#047857', '#10B981'],
    glow:     '#059669',
    accent:   '#059669',
    title:    '#064E3B',
    badge:    { bg: '#D1FAE5', border: '#6EE7B7', text: '#065F46' },
  },
  wazifa: {
    gradient: ['#4C1D95', '#7C3AED'],
    glow:     '#7C3AED',
    accent:   '#7C3AED',
    title:    '#2E1065',
    badge:    { bg: '#EDE9FE', border: '#C4B5FD', text: '#4C1D95' },
  },
  hadra: {
    gradient: ['#1E0A3C', '#6D28D9'],
    glow:     '#4C1D95',
    accent:   '#6D28D9',
    title:    '#1E0A3C',
    badge:    { bg: '#EDE9FE', border: '#C4B5FD', text: '#2E0F5A' },
  },
};

// ─── Islamic crescent + star symbol ──────────────────────────────────────────

function CrescentStar({ color, size = 52 }: { color: string; size?: number }) {
  // Pure SVG-like approach using View shapes
  const s = size;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      {/* Crescent: outer circle minus inner offset circle, achieved via emoji for crisp rendering */}
      <Text style={{ fontSize: s * 0.78, lineHeight: s, color, textAlign: 'center' }}>
        ☽
      </Text>
      {/* Star */}
      <Text style={{
        position: 'absolute',
        top: s * 0.08,
        right: s * 0.04,
        fontSize: s * 0.28,
        color,
        lineHeight: s * 0.32,
      }}>
        ✦
      </Text>
    </View>
  );
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface CompletionBannerProps {
  theme?:             CompletionTheme;
  titleArabic?:       string;
  titleLatin?:        string;
  practiceName?:      string;
  completionsToday?:  number;
  targetPerDay?:      number;
  streak?:            number;
  hadith?:            string;
  confirmLabel?:      string;
  onComplete?:        () => void;
  onClose?:           () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const CompletionBanner = memo(({
  theme            = 'wird',
  titleArabic      = 'الحمد لله',
  titleLatin       = 'Alḥamdulillāh',
  practiceName     = 'Dhikr',
  completionsToday = 0,
  targetPerDay     = 1,
  streak           = 0,
  hadith,
  confirmLabel     = 'Record Completion',
  onComplete,
  onClose,
}: CompletionBannerProps) => {
  const t = THEMES[theme];

  const fade       = useRef(new Animated.Value(0)).current;
  const slideY     = useRef(new Animated.Value(40)).current;
  const iconScale  = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  // 6 light particles
  const particles = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      xy:      new Animated.ValueXY({ x: 0, y: 0 }),
      opacity: new Animated.Value(0),
      angle:   (i / 6) * 2 * Math.PI,
    }))
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade,  { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slideY, { toValue: 0, friction: 8, tension: 65, useNativeDriver: true }),
      ]),
      Animated.spring(iconScale, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
      Animated.timing(contentFade, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();

    particles.forEach((p, i) => {
      const dist = 45 + Math.random() * 30;
      Animated.sequence([
        Animated.delay(400 + i * 60),
        Animated.parallel([
          Animated.timing(p.opacity, { toValue: 0.9, duration: 160, useNativeDriver: true }),
          Animated.timing(p.xy, {
            toValue: { x: dist * Math.cos(p.angle), y: dist * Math.sin(p.angle) },
            duration: 560, useNativeDriver: true,
          }),
        ]),
        Animated.timing(p.opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  const nextCount  = completionsToday + 1;
  const willFinish = nextCount >= targetPerDay;

  const sessionLabel = targetPerDay === 1
    ? `${practiceName} complete`
    : nextCount === 1
    ? `1st session of ${targetPerDay}`
    : `${nextCount}/${targetPerDay} — all sessions complete!`;

  const streakLabel = willFinish && streak > 0
    ? `🔥 ${streak + 1}-day streak`
    : streak > 0
    ? `🔥 ${streak}-day streak`
    : null;

  return (
    <Animated.View style={[s.overlay, { opacity: fade }]}>
      <Pressable style={s.backdrop} onPress={() => onClose?.()} />

      <Animated.View style={[
        s.card,
        { shadowColor: t.glow, transform: [{ translateY: slideY }] },
      ]}>
        {/* Top gradient bar */}
        <LinearGradient
          colors={t.gradient as any}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={s.topBar}
        />

        {/* Close */}
        <TouchableOpacity style={s.closeBtn} onPress={() => onClose?.()} activeOpacity={0.7}>
          <X color="rgba(100,116,139,0.6)" size={15} strokeWidth={2.5} />
        </TouchableOpacity>

        {/* ── Crescent icon + particles ── */}
        <View style={s.iconWrap}>
          {particles.map((p, i) => (
            <Animated.View key={i} style={[s.particle, {
              backgroundColor: i % 2 === 0 ? '#F59E0B' : t.gradient[1],
              opacity: p.opacity,
              transform: [{ translateX: p.xy.x }, { translateY: p.xy.y }],
            }]} />
          ))}
          <Animated.View style={[s.iconCircle, { transform: [{ scale: iconScale }] }]}>
            <LinearGradient colors={t.gradient as any} style={s.iconGrad}>
              <CrescentStar color="#FFFFFF" size={46} />
            </LinearGradient>
          </Animated.View>
        </View>

        {/* ── Content ── */}
        <Animated.View style={[s.body, { opacity: contentFade }]}>
          {/* Supertitle */}
          <Text style={[s.supertitle, { color: t.accent }]}>
            ✦  {practiceName} Complete  ✦
          </Text>

          {/* Arabic + Latin */}
          <Text style={[s.arabic, { color: t.title }]}>{titleArabic}</Text>
          <Text style={[s.latin,  { color: t.accent }]}>{titleLatin}</Text>

          {/* Badges */}
          <View style={s.badges}>
            <View style={[s.badge, { backgroundColor: t.badge.bg, borderColor: t.badge.border }]}>
              <Text style={[s.badgeText, { color: t.badge.text }]}>{sessionLabel}</Text>
            </View>
            {streakLabel && (
              <View style={[s.badge, s.badgeAmber]}>
                <Text style={[s.badgeText, s.badgeAmberText]}>{streakLabel}</Text>
              </View>
            )}
          </View>

          {/* Separator */}
          {hadith && (
            <>
              <LinearGradient
                colors={['transparent', 'rgba(245,158,11,0.4)', 'transparent']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.divider}
              />
              <Text style={s.hadith}>"{hadith}"</Text>
            </>
          )}
        </Animated.View>

        {/* ── Action ── */}
        <Animated.View style={[s.actions, { opacity: contentFade }]}>
          <TouchableOpacity
            style={[s.btn, { backgroundColor: t.gradient[0] }]}
            onPress={() => onComplete?.()}
            activeOpacity={0.85}
          >
            <CheckCircle color="#FFFFFF" size={16} strokeWidth={2.5} style={{ marginRight: 8 }} />
            <Text style={s.btnText}>{confirmLabel}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  backdrop: { ...StyleSheet.absoluteFillObject },

  card: {
    width: '100%', borderRadius: 28,
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22, shadowRadius: 28, elevation: 18,
    overflow: 'hidden',
  },
  topBar:   { height: 4 },
  closeBtn: {
    position: 'absolute', top: 12, right: 12, zIndex: 10,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Icon
  iconWrap:   { alignItems: 'center', justifyContent: 'center', marginTop: 28, height: 96 },
  particle:   { position: 'absolute', width: 8, height: 8, borderRadius: 4 },
  iconCircle: {
    width: 82, height: 82, borderRadius: 41, overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 8,
  },
  iconGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Body
  body:         { alignItems: 'center', paddingHorizontal: 24, gap: 8, paddingTop: 4 },
  supertitle:   { fontSize: 10, fontWeight: '800', letterSpacing: 3.5, textTransform: 'uppercase' },
  arabic:       { fontSize: 36, fontWeight: '900', lineHeight: 48 },
  latin:        { fontSize: 15, fontWeight: '700', letterSpacing: 0.4 },

  badges:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 2 },
  badge:        { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  badgeText:    { fontSize: 12, fontWeight: '700' },
  badgeAmber:   { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  badgeAmberText: { color: '#92400E' },

  divider: { height: 1, width: '65%', marginVertical: 6 },
  hadith:  {
    fontSize: 12, color: '#64748B', textAlign: 'center',
    lineHeight: 20, fontStyle: 'italic', paddingHorizontal: 12, marginBottom: 4,
  },

  // Button
  actions: { padding: 20, paddingTop: 12 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 16,
  },
  btnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
});