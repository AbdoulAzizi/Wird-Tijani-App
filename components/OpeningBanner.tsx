/**
 * OpeningBanner — Generic full-screen entry overlay
 *
 * Displayed when the user first opens a dhikr screen.
 * Fully driven by props — no screen-specific logic inside.
 * Works for Wird, Wazifa, Hadra, and any future practice screen.
 *
 * ─── Usage ────────────────────────────────────────────────────────────────────
 *
 *   import OpeningBanner, { DhikrRow, BannerTheme } from '../../components/OpeningBanner';
 *
 *   const rows: DhikrRow[] = [
 *     { arabic: 'أَسْتَغْفِرُ اللّٰهَ', label: 'Istighfār — 100×', icon: '🌿' },
 *     { arabic: '...', label: 'Ṣalāt al-Fātiḥ — 100×', icon: '✨' },
 *     { arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ', label: 'Tahlīl — 100×', icon: '💎' },
 *   ];
 *
 *   {showBanner && (
 *     <OpeningBanner
 *       theme="wird"                          // 'wird' | 'wazifa' | 'hadra'
 *       titleArabic="الوِرْدُ التِّيجَانِي"
 *       titleLatin="Wird Tijānī"
 *       subtitle="Daily Litany of the Tijāniyya"
 *       instruction="Recite after Fajr and Asr."
 *       beginLabel="Begin Wird"
 *       dhikrRows={rows}
 *       streak={state.streak}
 *       completionsToday={wirdCompletionsToday}
 *       targetPerDay={state.frequencySettings.wirdPerDay}
 *       isFullyDoneToday={isWirdFullyDoneToday}
 *       onClose={() => setShowBanner(false)}
 *     />
 *   )}
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, memo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, X } from 'lucide-react-native';

// ─── Theme presets ────────────────────────────────────────────────────────────

export type BannerTheme = 'wird' | 'wazifa' | 'hadra';

const THEMES: Record<BannerTheme, {
  gradientColors: string[];
  accentColor: string;     // ring / line color
  subtitleColor: string;
  labelColor: string;      // dhikr label text color
  instructionColor: string;
}> = {
  wird: {
    gradientColors:  ['#064E3B', '#065F46', '#047857', '#065F46'],
    accentColor:     '#F59E0B',
    subtitleColor:   'rgba(209,250,229,0.8)',
    labelColor:      'rgba(209,250,229,0.7)',
    instructionColor:'rgba(209,250,229,0.65)',
  },
  wazifa: {
    gradientColors:  ['#1C1245', '#2D1B69', '#3730A3', '#2D1B69'],
    accentColor:     '#F59E0B',
    subtitleColor:   'rgba(221,214,254,0.85)',
    labelColor:      'rgba(221,214,254,0.7)',
    instructionColor:'rgba(221,214,254,0.65)',
  },
  hadra: {
    gradientColors:  ['#1E0A3C', '#2E0F5A', '#4C1D95', '#2E0F5A'],
    accentColor:     '#F59E0B',
    subtitleColor:   'rgba(237,233,254,0.85)',
    labelColor:      'rgba(237,233,254,0.7)',
    instructionColor:'rgba(237,233,254,0.65)',
  },
};

// ─── Public types ─────────────────────────────────────────────────────────────

export interface DhikrRow {
  arabic:  string;
  label:   string;   // e.g. "Istighfār — 100×"
  icon:    string;   // emoji
}

export interface OpeningBannerProps {
  // Identity
  theme:        BannerTheme;
  titleArabic:  string;         // e.g. "الوِرْدُ التِّيجَانِي"
  titleLatin:   string;         // e.g. "Wird Tijānī"
  subtitle:     string;         // e.g. "Daily Litany of the Tijāniyya"
  instruction:  string;         // bottom italic note
  beginLabel:   string;         // e.g. "Begin Wird"

  // Content
  dhikrRows:    DhikrRow[];

  // Live stats (from AppContext — compute in the calling screen)
  streak:              number;
  completionsToday:    number;
  targetPerDay:        number;
  isFullyDoneToday:    boolean;

  // Callback
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const OpeningBanner = memo(({
  theme, titleArabic, titleLatin, subtitle,
  instruction, beginLabel, dhikrRows,
  streak, completionsToday, targetPerDay, isFullyDoneToday,
  onClose,
}: OpeningBannerProps) => {
  const t = THEMES[theme];

  // ── Animations ──────────────────────────────────────────────────────────
  const fade         = useRef(new Animated.Value(0)).current;
  const scale        = useRef(new Animated.Value(0.90)).current;
  const goldWidth    = useRef(new Animated.Value(0)).current;
  const contentFade  = useRef(new Animated.Value(0)).current;
  const ring1Opacity = useRef(new Animated.Value(0.15)).current;
  const ring2Opacity = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 0.5,  duration: 2600, delay,        useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.15, duration: 2600, useNativeDriver: true }),
        ])
      ).start();

    pulse(ring1Opacity, 0);
    pulse(ring2Opacity, 1100);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade,  { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 8, tension: 55, useNativeDriver: true }),
      ]),
      Animated.timing(goldWidth,   { toValue: 1, duration: 650, useNativeDriver: false }),
      Animated.timing(contentFade, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Status badge ────────────────────────────────────────────────────────
  const statusColor = isFullyDoneToday ? '#34D399' : t.accentColor;
  const statusLabel = isFullyDoneToday
    ? `✓ Completed today (${completionsToday}/${targetPerDay})`
    : completionsToday > 0
    ? `${completionsToday}/${targetPerDay} done today`
    : `${targetPerDay}× daily`;

  return (
    <Animated.View style={[s.overlay, { opacity: fade }]}>
      <Animated.View style={[s.card, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={t.gradientColors as any}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.gradient}
        >
          {/* Deco circles */}
          <View style={s.deco1} />
          <View style={s.deco2} />
          <View style={s.deco3} />

          {/* Pulsing rings */}
          <Animated.View style={[s.ring, {
            width: 260, height: 260, borderRadius: 130,
            top: -80, right: -80, borderColor: `${t.accentColor}50`,
            opacity: ring1Opacity,
          }]} />
          <Animated.View style={[s.ring, {
            width: 160, height: 160, borderRadius: 80,
            bottom: -30, left: -40, borderColor: `${t.accentColor}50`,
            opacity: ring2Opacity,
          }]} />

          {/* Close */}
          <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.75}>
            <X color="rgba(255,255,255,0.6)" size={16} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Bismillah */}
          <Text style={s.bismillah}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</Text>

          {/* Gold line reveal */}
          <View style={s.goldLineWrap}>
            <Animated.View style={{
              height: 1.5,
              backgroundColor: t.accentColor,
              opacity: 0.7,
              width: goldWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            }} />
          </View>

          {/* Titles */}
          <Text style={s.titleArabic}>{titleArabic}</Text>
          <Text style={s.titleLatin}>{titleLatin}</Text>
          <Text style={[s.subtitle, { color: t.subtitleColor }]}>{subtitle}</Text>

          {/* Badges */}
          <Animated.View style={[s.badgeRow, { opacity: contentFade }]}>
            <View style={[s.badge, {
              backgroundColor: statusColor + '25',
              borderColor:     statusColor + '55',
            }]}>
              <Text style={[s.badgeText, { color: statusColor }]}>{statusLabel}</Text>
            </View>
            {streak > 0 && (
              <View style={[s.badge, {
                backgroundColor: '#F59E0B25',
                borderColor:     '#F59E0B55',
              }]}>
                <Text style={[s.badgeText, { color: '#F59E0B' }]}>🔥 {streak} day streak</Text>
              </View>
            )}
          </Animated.View>

          {/* Content block */}
          <Animated.View style={[s.contentBlock, { opacity: contentFade }]}>
            <LinearGradient
              colors={['transparent', t.accentColor, '#FDE68A', t.accentColor, 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.goldGrad}
            />

            <View style={s.dhikrList}>
              {dhikrRows.map((d, i) => (
                <View key={i} style={s.dhikrRow}>
                  <Text style={s.dhikrIcon}>{d.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.dhikrArabic} numberOfLines={1}>{d.arabic}</Text>
                    <Text style={[s.dhikrLabel, { color: t.labelColor }]}>{d.label}</Text>
                  </View>
                </View>
              ))}
            </View>

            <LinearGradient
              colors={['transparent', t.accentColor, '#FDE68A', t.accentColor, 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.goldGrad}
            />

            <Text style={[s.instruction, { color: t.instructionColor }]}>{instruction}</Text>
          </Animated.View>

          {/* Begin button */}
          <Animated.View style={[{ width: '100%' }, { opacity: contentFade }]}>
            <TouchableOpacity style={s.beginBtn} onPress={onClose} activeOpacity={0.85}>
              <Sparkles color="#1C1000" size={16} strokeWidth={2.5} style={{ marginRight: 8 }} />
              <Text style={s.beginBtnText}>{beginLabel}  ✦</Text>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
});

export default OpeningBanner;

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.88)',
    zIndex: 999, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 20,
  },
  card:     { width: '100%', borderRadius: 28, overflow: 'hidden' },
  gradient: { padding: 28, alignItems: 'center', gap: 12, overflow: 'hidden' },

  deco1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.04)', top: -60, right: -50 },
  deco2: { position: 'absolute', width: 120, height: 120, borderRadius: 60,  backgroundColor: 'rgba(255,255,255,0.04)', bottom: -30, left: -20 },
  deco3: { position: 'absolute', width: 60,  height: 60,  borderRadius: 30,  backgroundColor: 'rgba(255,255,255,0.05)', top: 30, left: 20 },
  ring:  { position: 'absolute', borderWidth: 1 },

  closeBtn: {
    position: 'absolute', top: 14, right: 14,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.10)',
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },

  bismillah:    { fontSize: 17, color: 'rgba(253,230,138,0.9)', textAlign: 'center', fontWeight: '600' },
  goldLineWrap: { width: '100%', alignItems: 'center' },
  goldGrad:     { height: 1.5, width: '100%', opacity: 0.6 },

  titleArabic: { fontSize: 30, color: '#FFFFFF', textAlign: 'center', fontWeight: '900', lineHeight: 44 },
  titleLatin:  { fontSize: 18, color: 'rgba(253,230,138,0.9)', textAlign: 'center', fontWeight: '700', letterSpacing: 0.5 },
  subtitle:    { fontSize: 13, textAlign: 'center', fontWeight: '500', letterSpacing: 0.3 },

  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  badge:    { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  badgeText:{ fontSize: 12, fontWeight: '700' },

  contentBlock: { width: '100%', gap: 10 },
  dhikrList:    { gap: 8, paddingVertical: 4 },
  dhikrRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
  },
  dhikrIcon:   { fontSize: 18 },
  dhikrArabic: { fontSize: 15, color: '#FFFFFF', fontWeight: '700', lineHeight: 24 },
  dhikrLabel:  { fontSize: 11, fontWeight: '500', marginTop: 2 },
  instruction: { fontSize: 12, textAlign: 'center', lineHeight: 20, fontStyle: 'italic' },

  beginBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(245,158,11,0.92)',
    paddingHorizontal: 32, paddingVertical: 14,
    borderRadius: 18, marginTop: 4, width: '100%',
  },
  beginBtnText: { fontSize: 16, fontWeight: '800', color: '#1C1000', letterSpacing: 0.4 },
});