// components/layout/SpiritualHeader.tsx — Wird Tijani
//
// Green brand: gradient from theme.ts (default variant → #064E3B / #065F46 / #047857)
// Logo: Islamic crescent + ﷲ · مُحَمَّد — unchanged.
// This file is functionally identical to the original; duplicated here
// so Rawdat Dhikr can diverge without touching this one.

import React, { useMemo, useEffect, useState, memo, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, Animated, StatusBar,
} from 'react-native';
import { Bell, Moon, Sun, Sunrise, CloudSun, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { color, gradient, text, shadow, themes, type ThemeVariant } from '@/theme';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SpiritualHeaderProps {
  onMenuPress:          () => void;
  currentPage?:         string;
  onNotificationPress?: () => void;
  notificationCount?:   number;
  showNotification?:    boolean;
  showHijriDate?:       boolean;
  theme?:               ThemeVariant;
}

type TimeOfDay = 'fajr' | 'morning' | 'afternoon' | 'evening' | 'night';

const TIME_CONFIG: Record<TimeOfDay, { greeting: string; subtitle: string; Icon: any; iconColor: string }> = {
  fajr:      { greeting: 'Fajr',             subtitle: 'The blessed hour of dawn', Icon: Sunrise,  iconColor: color.icon.prayerTime.fajr      },
  morning:   { greeting: 'Ṣabāḥ al-Khayr',   subtitle: 'Good morning',             Icon: CloudSun, iconColor: color.icon.prayerTime.morning   },
  afternoon: { greeting: 'Ẓuhr',             subtitle: 'Afternoon blessings',       Icon: Sun,      iconColor: color.icon.prayerTime.afternoon },
  evening:   { greeting: 'Masā\' al-Khayr',  subtitle: 'Good evening',              Icon: Sparkles, iconColor: color.icon.prayerTime.evening   },
  night:     { greeting: 'Laylatun Ṭayyiba', subtitle: 'Peaceful night',            Icon: Moon,     iconColor: color.icon.prayerTime.night     },
};

function getTimeOfDay(h: number): TimeOfDay {
  if (h >= 4  && h < 6)  return 'fajr';
  if (h >= 6  && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

function formatGregorian(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
}
function formatHijri(d: Date): string {
  try { return d.toLocaleDateString('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return ''; }
}

// ─── Component ────────────────────────────────────────────────────────────────
const SpiritualHeader = memo(({
  onMenuPress,
  currentPage       = 'Home',
  onNotificationPress,
  notificationCount = 0,
  showNotification  = true,
  showHijriDate     = true,
  theme             = 'default',
}: SpiritualHeaderProps) => {

  const [now, setNow] = useState(new Date());
  const fadeIn     = useRef(new Animated.Value(0)).current;
  const pulse      = useRef(new Animated.Value(1)).current;
  const bellWiggle = useRef(new Animated.Value(0)).current;
  const shimmer    = useRef(new Animated.Value(0)).current;

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 60_000); return () => clearInterval(id); }, []);
  useEffect(() => { Animated.timing(fadeIn, { toValue: 1, duration: 700, useNativeDriver: true }).start(); }, []);

  useEffect(() => {
    if (notificationCount > 0) {
      const loop = Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1.35, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ]));
      loop.start(); return () => loop.stop();
    }
    pulse.setValue(1);
  }, [notificationCount]);

  useEffect(() => {
    if (notificationCount > 0) {
      Animated.sequence([
        Animated.timing(bellWiggle, { toValue:  8, duration: 80, useNativeDriver: true }),
        Animated.timing(bellWiggle, { toValue: -8, duration: 80, useNativeDriver: true }),
        Animated.timing(bellWiggle, { toValue:  5, duration: 70, useNativeDriver: true }),
        Animated.timing(bellWiggle, { toValue: -5, duration: 70, useNativeDriver: true }),
        Animated.timing(bellWiggle, { toValue:  0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [notificationCount]);

  useEffect(() => {
    const loop = Animated.loop(Animated.timing(shimmer, { toValue: 1, duration: 3200, useNativeDriver: false }));
    loop.start(); return () => loop.stop();
  }, []);

  const tod          = useMemo(() => getTimeOfDay(now.getHours()), [now]);
  const cfg          = TIME_CONFIG[tod];
  const headerColors = themes[theme];
  const gregorianStr = useMemo(() => formatGregorian(now), [now]);
  const hijriStr     = useMemo(() => formatHijri(now),     [now]);

  const shimmerX   = shimmer.interpolate({ inputRange: [0, 1], outputRange: ['-40%', '140%'] });
  const bellRotate = bellWiggle.interpolate({ inputRange: [-10, 10], outputRange: ['-10deg', '10deg'] });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={headerColors[0]} translucent />

      <LinearGradient colors={headerColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ss.container}>

        <View style={ss.decoLayer} pointerEvents="none">
          <View style={ss.decoCircle1} />
          <View style={ss.decoCircle2} />
          <View style={ss.decoCircle3} />
        </View>

        <Animated.View style={[ss.inner, { opacity: fadeIn }]}>

          {/* Top bar */}
          <View style={ss.topBar}>
            <TouchableOpacity style={ss.iconBtn} onPress={onMenuPress} activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <View style={ss.burgerLines}>
                <View style={ss.burgerLine} />
                <View style={[ss.burgerLine, { width: 13 }]} />
                <View style={ss.burgerLine} />
              </View>
            </TouchableOpacity>

            {/* Logo — crescent + divine names */}
            <View style={ss.logoBlock}>
              <View style={ss.crescentRow}>
                <View style={ss.crescent}><View style={ss.crescentHole} /></View>
                <View style={ss.starDot} />
              </View>
              <View style={ss.nameRow}>
                <Text style={ss.nameText}>ﷲ ﷻ</Text>
                <View style={ss.nameDivider} />
                <Text style={ss.nameText}>مُحَمَّد ﷺ</Text>
              </View>
            </View>

            <View style={ss.bellSlot}>
              {showNotification && (
                <TouchableOpacity onPress={onNotificationPress ?? (() => {})} activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                  <Animated.View style={[ss.iconBtn, { transform: [{ rotate: bellRotate }] }]}>
                    <Bell color={color.icon.onDark} size={20} strokeWidth={2} />
                    {notificationCount > 0 && (
                      <Animated.View style={[ss.badge, { transform: [{ scale: pulse }] }]}>
                        <Text style={ss.badgeText}>{notificationCount > 99 ? '99+' : notificationCount}</Text>
                      </Animated.View>
                    )}
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Gold divider */}
          <View style={ss.goldDivider}>
            <LinearGradient
              colors={[...gradient.goldDivider] as [string, string, string, string, string]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </View>

          {/* Bottom bar */}
          <View style={ss.bottomBar}>
            <View style={ss.greetingBlock}>
              <View style={ss.greetingRow}>
                <cfg.Icon color={cfg.iconColor} size={12} strokeWidth={2.2} />
                <Text style={ss.greetingLabel}>{cfg.greeting}</Text>
                <Text style={ss.greetingDot}>·</Text>
                <Text style={ss.greetingLabel}>{cfg.subtitle}</Text>
              </View>
              <Text style={ss.pageTitle} numberOfLines={1}>{currentPage}</Text>
            </View>

            <View style={ss.datePill}>
              <Text style={ss.gregorianDate}>{gregorianStr}</Text>
              {showHijriDate && hijriStr ? <Text style={ss.hijriDate}>{hijriStr}</Text> : null}
            </View>
          </View>

        </Animated.View>

        {/* Shimmer bar */}
        <View style={ss.shimmerTrack}>
          <LinearGradient
            colors={[...gradient.goldShimmer] as [string, string, string, string, string]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View pointerEvents="none" style={[ss.shimmerHighlight, { left: shimmerX }]} />
        </View>

      </LinearGradient>
    </>
  );
});

SpiritualHeader.displayName = 'SpiritualHeader';
export default SpiritualHeader;

// ─── Styles ───────────────────────────────────────────────────────────────────
const ss = StyleSheet.create({
  container:   { paddingTop: Platform.OS === 'ios' ? 52 : (StatusBar.currentHeight ?? 0) + 12, overflow: 'hidden' },
  inner:       { paddingHorizontal: 16 },
  decoLayer:   { ...StyleSheet.absoluteFillObject },
  decoCircle1: { position: 'absolute', top: -60,   right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: color.bg.deco.layer1 },
  decoCircle2: { position: 'absolute', top: 30,    right: 60,  width: 60,  height: 60,  borderRadius: 30, backgroundColor: color.bg.deco.layer2 },
  decoCircle3: { position: 'absolute', bottom: -30, left: -30, width: 110, height: 110, borderRadius: 55, backgroundColor: color.bg.deco.layer3 },
  topBar:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  iconBtn:     { width: 38, height: 38, borderRadius: 11, backgroundColor: color.bg.interactive, borderWidth: 1, borderColor: color.border.glass, justifyContent: 'center', alignItems: 'center' },
  burgerLines: { gap: 5 },
  burgerLine:  { height: 1.8, width: 18, backgroundColor: color.icon.onDark, borderRadius: 2 },
  bellSlot:    { width: 38, alignItems: 'flex-end' },
  badge:       { position: 'absolute', top: -5, right: -5, minWidth: 17, height: 17, borderRadius: 9, backgroundColor: color.status.danger, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3, borderWidth: 1.5, borderColor: color.border.cutout },
  badgeText:   { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
  logoBlock:   { alignItems: 'center', gap: 6 },
  crescentRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  crescent:    { width: 20, height: 20, borderRadius: 10, backgroundColor: color.icon.gold, overflow: 'hidden' },
  crescentHole:{ position: 'absolute', top: -2, left: 3, width: 18, height: 18, borderRadius: 9, backgroundColor: color.bg.secondary },
  starDot:     { width: 5, height: 5, borderRadius: 3, backgroundColor: color.icon.gold, marginTop: -8 },
  nameRow:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nameDivider: { width: 1, height: 16, backgroundColor: color.border.divider },
  nameText:    { fontSize: 20, fontWeight: '700', lineHeight: 26, color: color.text.gold, ...shadow.textStrong },
  goldDivider: { height: 1, marginBottom: 12, opacity: 0.6 },
  bottomBar:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14, gap: 12 },
  greetingBlock:{ flex: 1, minWidth: 0 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3, flexWrap: 'nowrap' },
  greetingLabel:{ fontSize: text.size.sm, fontWeight: text.weight.semibold, color: color.text.secondary, letterSpacing: text.tracking.wide },
  greetingDot: { fontSize: text.size.sm, color: color.text.muted },
  pageTitle:   { fontSize: text.size['2xl'], fontWeight: text.weight.extrabold, color: color.text.primary, letterSpacing: text.tracking.tight, ...shadow.textSoft },
  datePill:    { backgroundColor: color.bg.glass, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 7, borderWidth: 1, borderColor: color.border.gold, alignItems: 'flex-end', flexShrink: 0 },
  gregorianDate:{ fontSize: text.size.sm, fontWeight: text.weight.bold, color: color.text.primary, letterSpacing: text.tracking.wider },
  hijriDate:   { fontSize: text.size.xs, fontWeight: text.weight.medium, color: color.text.goldSoft, marginTop: 3, textAlign: 'right' },
  shimmerTrack:    { height: 3, overflow: 'hidden' },
  shimmerHighlight:{ position: 'absolute', top: 0, bottom: 0, width: '35%', backgroundColor: color.status.shimmer, borderRadius: 2 },
});