import React, { useMemo, useCallback, useState, useEffect, memo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, Animated, StatusBar
} from 'react-native';
import { Bell, Sparkles, Sun, Moon, Sunrise, CloudSun } from 'lucide-react-native';
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

// ─── Constants ────────────────────────────────────────────────────────────────
const GRADIENTS: Record<string, readonly [string, string, string]> = {
  default: ['#059669', '#047857', '#065f46'],
  dark:    ['#0F172A', '#1E293B', '#0F172A'],
  light:   ['#10B981', '#059669', '#047857'],
};

const TIME_CONFIG: Record<TimeOfDay, { greeting: string; Icon: any; iconColor: string }> = {
  fajr:      { greeting: 'Fajr time',      Icon: Sunrise,  iconColor: '#FCD34D' },
  morning:   { greeting: 'Good morning',   Icon: CloudSun, iconColor: '#FDE68A' },
  afternoon: { greeting: 'Good afternoon', Icon: Sun,      iconColor: '#FCD34D' },
  evening:   { greeting: 'Good evening',   Icon: Sparkles, iconColor: '#A5F3FC' },
  night:     { greeting: 'Good night',     Icon: Moon,     iconColor: '#C4B5FD' },
};

function getTimeOfDay(h: number): TimeOfDay {
  if (h >= 4  && h < 6)  return 'fajr';
  if (h >= 6  && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}
function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
}
function formatHijri(d: Date) {
  try { return d.toLocaleDateString('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return ''; }
}

// ─── Tiny icon button ─────────────────────────────────────────────────────────
const IconBtn = memo(({ onPress, label, badge, pulse, children }: {
  onPress: () => void; label: string;
  badge?: number; pulse?: Animated.Value;
  children: React.ReactNode;
}) => (
  <TouchableOpacity style={ss.iconBtn} onPress={onPress} activeOpacity={0.7}
    accessibilityLabel={label} accessibilityRole="button"
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
    {children}
    {!!badge && badge > 0 && pulse && (
      <Animated.View style={[ss.badge, { transform: [{ scale: pulse }] }]}>
        <Text style={ss.badgeTxt}>{badge > 99 ? '99+' : badge}</Text>
      </Animated.View>
    )}
  </TouchableOpacity>
));
IconBtn.displayName = 'IconBtn';

// ─── Component ────────────────────────────────────────────────────────────────
const SpiritualHeader = memo(({
  onMenuPress,
  currentPage = 'Home',
  onNotificationPress,
  notificationCount = 0,
  showNotification = true,
  showHijriDate = false,
  theme = 'default',
}: SpiritualHeaderProps) => {
  const [now, setNow] = useState(new Date());
  const pulse   = React.useRef(new Animated.Value(1)).current;
  const shimmer = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (notificationCount > 0) {
      const loop = Animated.loop(Animated.sequence([
        Animated.timing(pulse, { toValue: 1.3, duration: 650, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 650, useNativeDriver: true }),
      ]));
      loop.start();
      return () => loop.stop();
    }
    pulse.setValue(1);
  }, [notificationCount]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, { toValue: 1, duration: 3000, useNativeDriver: false })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const tod      = useMemo(() => getTimeOfDay(now.getHours()), [now]);
  const cfg      = TIME_CONFIG[tod];
  const TimeIcon = cfg.Icon;
  const gradient = (GRADIENTS[theme] ?? GRADIENTS.default) as [string, string, string];
  const dateStr  = useMemo(() => formatDate(now), [now]);
  const hijriStr = useMemo(() => showHijriDate ? formatHijri(now) : null, [now, showHijriDate]);

  const shimmerLeft = shimmer.interpolate({ inputRange: [0, 1], outputRange: ['-30%', '130%'] });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={gradient[0]} translucent />
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={ss.container}>

        {/* Decorative background circles */}
        <View style={ss.deco} pointerEvents="none">
          <View style={ss.circle1} /><View style={ss.circle2} /><View style={ss.circle3} />
        </View>

        {/* ── Row 1: Menu | Center | Bell ── */}
        <View style={ss.topRow}>

          {/* Hamburger */}
          <TouchableOpacity style={ss.iconBtn} onPress={onMenuPress} activeOpacity={0.7}
            accessibilityLabel="Open menu" accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <View style={ss.hamburger}>
              <View style={ss.hLine} />
              <View style={[ss.hLine, ss.hLineShort]} />
              <View style={ss.hLine} />
            </View>
          </TouchableOpacity>

          {/* Center: names with crescent in between */}
          <View style={ss.center}>
            <View style={ss.names}>
              <Text style={ss.prophetTxt}>مُحَمَّد ﷺ</Text>
              <View style={ss.crescentWrap}>
                <View style={ss.crescent}><View style={ss.hole} /></View>
                <Sparkles color="#FCD34D" size={10} style={ss.star} />
              </View>
              <Text style={ss.allahTxt}>ﷲ ﷻ</Text>
            </View>
          </View>

          {/* Bell */}
          <View style={ss.right}>
            {showNotification && (
              <IconBtn
                onPress={onNotificationPress ?? (() => {})}
                badge={notificationCount}
                pulse={pulse}
                label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
              >
                <Bell color="#FFFFFF" size={22} strokeWidth={2} />
              </IconBtn>
            )}
          </View>
        </View>

        {/* ── Row 2: Left info | Date pill ── */}
        <View style={ss.bottomRow}>
          <View style={ss.leftInfo}>
            <View style={ss.greetRow}>
              <TimeIcon color={cfg.iconColor} size={13} strokeWidth={2} />
              <Text style={ss.greetTxt}>{cfg.greeting}</Text>
            </View>
            <Text style={ss.pageTxt} numberOfLines={1}>{currentPage}</Text>
          </View>
          <View style={ss.datePill}>
            <Text style={ss.dateTxt}>{dateStr}</Text>
            {hijriStr ? <Text style={ss.hijriTxt}>{hijriStr}</Text> : null}
          </View>
        </View>

        {/* ── Shimmer golden line ── */}
        <View style={ss.goldTrack}>
          <LinearGradient
            colors={['#FCD34D', '#F59E0B', '#FCD34D']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View pointerEvents="none"
            style={[ss.shimmerBar, { left: shimmerLeft }]} />
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
    paddingTop: Platform.OS === 'ios' ? 48 : (StatusBar.currentHeight ?? 0) + 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  deco: { ...StyleSheet.absoluteFillObject },
  circle1: {
    position: 'absolute', top: -50, right: -50,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  circle2: {
    position: 'absolute', top: 20, right: 55,
    width: 55, height: 55, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  circle3: {
    position: 'absolute', bottom: -20, left: -20,
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  // Row 1
  topRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14, zIndex: 1,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  hamburger: { gap: 5, paddingHorizontal: 2 },
  hLine: { height: 2, width: 20, backgroundColor: '#FFFFFF', borderRadius: 1 },
  hLineShort: { width: 14 },
  badge: {
    position: 'absolute', top: -5, right: -5,
    minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: '#FFFFFF',
  },
  badgeTxt: { fontSize: 10, fontWeight: '800', color: '#FFFFFF' },

  // Center logo — now purely vertical, crescent sandwiched between the two texts
  center: { flexDirection: 'row', alignItems: 'center' },
  crescentWrap: {
    width: 34, height: 34,
    justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center',
  },
  crescent: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#FCD34D', overflow: 'hidden',
  },
  hole: {
    position: 'absolute', top: -1, left: 4,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#059669',
  },
  star: { position: 'absolute', top: 1, right: 2 },
  names: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  allahTxt: {
    fontSize: 24, fontWeight: '700', color: '#FCD34D',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
    lineHeight: 28,
  },
  prophetTxt: {
     fontSize: 24, fontWeight: '700',  color: 'rgba(255,255,255,0.85)',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
    lineHeight: 28,
  },
  right: { width: 40, alignItems: 'flex-end' },

  // Row 2
  bottomRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', zIndex: 1, marginBottom: 12,
  },
  leftInfo: { flex: 1, marginRight: 12 },
  greetRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  greetTxt: { fontSize: 13, color: '#D1FAE5', fontWeight: '600', letterSpacing: 0.2 },
  pageTxt: {
    fontSize: 24, fontWeight: '800', color: '#FFFFFF',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },
  datePill: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'flex-end',
  },
  dateTxt: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
  hijriTxt: { fontSize: 10, fontWeight: '600', color: '#D1FAE5', marginTop: 3 },

  // Golden line
  goldTrack: { height: 3, borderRadius: 2, overflow: 'hidden' },
  shimmerBar: {
    position: 'absolute', top: 0, bottom: 0, width: '30%',
    backgroundColor: 'rgba(255,255,255,0.45)', borderRadius: 2,
  },
});