import React, { useMemo, useEffect, useState, memo, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, Animated, StatusBar
} from 'react-native';
import { Bell, Moon, Sun, Sunrise, CloudSun, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SpiritualHeaderProps {
  onMenuPress: () => void;
  currentPage?: string;
  onNotificationPress?: () => void;
  notificationCount?: number;
  showNotification?: boolean;
  showHijriDate?: boolean;
  theme?: 'default' | 'dark' | 'light';
}
type TimeOfDay = 'fajr' | 'morning' | 'afternoon' | 'evening' | 'night';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const GRADIENTS: Record<string, readonly [string, string, string]> = {
  default: ['#064E3B', '#065F46', '#047857'],
  dark:    ['#0A0F1E', '#111827', '#0F172A'],
  light:   ['#047857', '#059669', '#10B981'],
};

const TIME_CONFIG: Record<TimeOfDay, {
  greeting: string; sub: string; Icon: any; iconColor: string;
}> = {
  fajr:      { greeting: 'Fajr',         sub: 'The blessed hour of dawn',  Icon: Sunrise,  iconColor: '#FDE68A' },
  morning:   { greeting: 'Ṣabāḥ al-Khayr', sub: 'Good morning',           Icon: CloudSun, iconColor: '#FDE68A' },
  afternoon: { greeting: 'Ẓuhr',         sub: 'Afternoon blessings',       Icon: Sun,      iconColor: '#FCD34D' },
  evening:   { greeting: 'Masā\' al-Khayr', sub: 'Good evening',           Icon: Sparkles, iconColor: '#A5F3FC' },
  night:     { greeting: 'Laylatun Ṭayyiba', sub: 'Peaceful night',        Icon: Moon,     iconColor: '#C4B5FD' },
};

function getTimeOfDay(h: number): TimeOfDay {
  if (h >= 4  && h < 6)  return 'fajr';
  if (h >= 6  && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
}

function formatHijri(d: Date): string {
  try {
    return d.toLocaleDateString('ar-SA-u-ca-islamic', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return ''; }
}

// ─── Decorative Arabic ornament ───────────────────────────────────────────────
const Ornament = memo(() => (
  <Text style={ss.ornament}>❧</Text>
));
Ornament.displayName = 'Ornament';

// ─── Component ────────────────────────────────────────────────────────────────
const SpiritualHeader = memo(({
  onMenuPress,
  currentPage = 'Home',
  onNotificationPress,
  notificationCount = 0,
  showNotification = true,
  showHijriDate = true,
  theme = 'default',
}: SpiritualHeaderProps) => {

  const [now, setNow] = useState(new Date());
  const pulse        = useRef(new Animated.Value(1)).current;
  const fadeIn       = useRef(new Animated.Value(0)).current;
  const shimmer      = useRef(new Animated.Value(0)).current;
  const bellWiggle   = useRef(new Animated.Value(0)).current;

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Fade-in on mount
  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1, duration: 700, useNativeDriver: true,
    }).start();
  }, []);

  // Badge pulse
  useEffect(() => {
    if (notificationCount > 0) {
      const loop = Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1.35, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ]));
      loop.start();
      return () => loop.stop();
    }
    pulse.setValue(1);
  }, [notificationCount]);

  // Bell wiggle on new notification
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

  // Gold shimmer
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, { toValue: 1, duration: 3200, useNativeDriver: false })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const tod      = useMemo(() => getTimeOfDay(now.getHours()), [now]);
  const cfg      = TIME_CONFIG[tod];
  const TimeIcon = cfg.Icon;
  const gradient = (GRADIENTS[theme] ?? GRADIENTS.default) as [string, string, string];
  const dateStr  = useMemo(() => formatDate(now), [now]);
  const hijriStr = useMemo(() => formatHijri(now), [now]);
  const shimmerX = shimmer.interpolate({ inputRange: [0, 1], outputRange: ['-40%', '140%'] });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={gradient[0]} translucent />

      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={ss.container}
      >
        {/* ── Background texture circles ── */}
        <View style={ss.deco} pointerEvents="none">
          <View style={ss.circle1} />
          <View style={ss.circle2} />
          <View style={ss.circle3} />
          {/* Subtle dot grid pattern */}
          <View style={ss.dotGrid} />
        </View>

        <Animated.View style={[ss.inner, { opacity: fadeIn }]}>

          {/* ── TOP BAR: burger | logo | bell ── */}
          <View style={ss.topBar}>

            {/* Burger */}
            <TouchableOpacity
              style={ss.burgerBtn}
              onPress={onMenuPress}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Open menu"
              accessibilityRole="button"
            >
              <View style={ss.burgerLines}>
                <View style={ss.line} />
                <View style={[ss.line, { width: 13 }]} />
                <View style={ss.line} />
              </View>
            </TouchableOpacity>

            {/* Center logo */}
            <View style={ss.logoBlock}>
              {/* Crescent + star */}
              <View style={ss.crescentRow}>
                <View style={ss.crescent}>
                  <View style={ss.hole} />
                </View>
                <View style={ss.starDot} />
              </View>
              {/* Arabic names */}
              <View style={ss.namesRow}>
                <Text style={ss.nameTxt}>ﷲ ﷻ</Text>
                <View style={ss.nameDivider} />
                <Text style={ss.nameTxt}>مُحَمَّد ﷺ</Text>
              </View>
            </View>

            {/* Bell */}
            <View style={ss.bellSlot}>
              {showNotification && (
                <TouchableOpacity
                  onPress={onNotificationPress ?? (() => {})}
                  activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  accessibilityLabel={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
                >
                  <Animated.View style={[
                    ss.burgerBtn,
                    { transform: [{ rotate: bellWiggle.interpolate({
                        inputRange: [-10, 10], outputRange: ['-10deg', '10deg'],
                      }) }]
                    },
                  ]}>
                    <Bell color="#FFFFFF" size={20} strokeWidth={2} />
                    {notificationCount > 0 && (
                      <Animated.View style={[ss.badge, { transform: [{ scale: pulse }] }]}>
                        <Text style={ss.badgeTxt}>
                          {notificationCount > 99 ? '99+' : notificationCount}
                        </Text>
                      </Animated.View>
                    )}
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── DIVIDER: thin gold line ── */}
          <View style={ss.goldDivider}>
            <LinearGradient
              colors={['transparent', '#F59E0B', '#FCD34D', '#F59E0B', 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </View>

          {/* ── BOTTOM: greeting left | date right ── */}
          <View style={ss.bottomBar}>

            {/* Left: greeting + page title */}
            <View style={ss.greetBlock}>
              <View style={ss.greetRow}>
                <TimeIcon color={cfg.iconColor} size={12} strokeWidth={2.2} />
                <Text style={ss.greetSub}>{cfg.greeting}</Text>
                <Text style={ss.greetDot}>·</Text>
                <Text style={ss.greetSub}>{cfg.sub}</Text>
              </View>
              <Text style={ss.pageTitle} numberOfLines={1}>{currentPage}</Text>
            </View>

            {/* Right: Gregorian + Hijri */}
            <View style={ss.datePill}>
              <Text style={ss.dateGreg}>{dateStr}</Text>
              {hijriStr ? (
                <Text style={ss.dateHijri}>{hijriStr}</Text>
              ) : null}
            </View>
          </View>

        </Animated.View>

        {/* ── BOTTOM EDGE: animated gold shimmer bar ── */}
        <View style={ss.goldTrack}>
          <LinearGradient
            colors={['#92400E', '#F59E0B', '#FDE68A', '#F59E0B', '#92400E']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View
            pointerEvents="none"
            style={[ss.shimmerBar, { left: shimmerX }]}
          />
        </View>

      </LinearGradient>
    </>
  );
});

SpiritualHeader.displayName = 'SpiritualHeader';
export default SpiritualHeader;

// ─── Styles ───────────────────────────────────────────────────────────────────
const ss = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 52 : (StatusBar.currentHeight ?? 0) + 12,
    overflow: 'hidden',
  },
  inner: {
    paddingHorizontal: 16,
    paddingBottom: 0,
  },

  // ── Background deco ──
  deco: { ...StyleSheet.absoluteFillObject, pointerEvents: 'none' },
  circle1: {
    position: 'absolute', top: -60, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  circle2: {
    position: 'absolute', top: 30, right: 60,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  circle3: {
    position: 'absolute', bottom: -30, left: -30,
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  dotGrid: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    // Simulated via opacity layer — no actual dots to keep it native
    opacity: 0,
  },

  // ── Top bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  burgerBtn: {
    width: 38, height: 38, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },
  burgerLines: { gap: 5 },
  line: { height: 1.8, width: 18, backgroundColor: '#FFFFFF', borderRadius: 1 },

  badge: {
    position: 'absolute', top: -5, right: -5,
    minWidth: 17, height: 17, borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: '#064E3B',
  },
  badgeTxt: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },

  bellSlot: { width: 38, alignItems: 'flex-end' },

  // ── Logo ──
  logoBlock: { alignItems: 'center', gap: 6 },
  crescentRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  crescent: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#FCD34D', overflow: 'hidden',
  },
  hole: {
    position: 'absolute', top: -2, left: 3,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#065F46',
  },
  starDot: {
    width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: '#FCD34D',
    marginTop: -8,
  },
  namesRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  nameDivider: {
    width: 1, height: 16,
    backgroundColor: 'rgba(252,211,77,0.4)',
  },
  nameTxt: {
    fontSize: 20, fontWeight: '700',
    color: '#FCD34D',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: 26,
  },

  ornament: {
    fontSize: 14, color: 'rgba(252,211,77,0.5)',
    marginHorizontal: 4,
  },

  // ── Gold divider ──
  goldDivider: {
    height: 1,
    marginBottom: 12,
    opacity: 0.6,
  },

  // ── Bottom bar ──
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
    gap: 12,
  },

  greetBlock: { flex: 1, minWidth: 0 },
  greetRow:   { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3, flexWrap: 'nowrap' },
  greetSub: {
    fontSize: 11, fontWeight: '600',
    color: 'rgba(209,250,229,0.85)',
    letterSpacing: 0.1,
  },
  greetDot: { fontSize: 11, color: 'rgba(209,250,229,0.4)' },
  pageTitle: {
    fontSize: 22, fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Date pill — refined glass card
  datePill: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 10,
    paddingHorizontal: 11, paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(252,211,77,0.22)',
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  dateGreg: {
    fontSize: 11, fontWeight: '700',
    color: '#FFFFFF', letterSpacing: 0.2,
  },
  dateHijri: {
    fontSize: 10, fontWeight: '500',
    color: 'rgba(252,211,77,0.85)',
    marginTop: 3,
    textAlign: 'right',
  },

  // ── Gold shimmer bottom bar ──
  goldTrack: { height: 3, overflow: 'hidden' },
  shimmerBar: {
    position: 'absolute', top: 0, bottom: 0,
    width: '35%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 2,
  },
});