// components/azkar/ui.tsx — Reusable primitives for the Azkar screen

import React, { useEffect, useRef, memo } from 'react';
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet, Dimensions, Platform,
} from 'react-native';
import { Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { W, PERIODS, GREEN, SPACE, RADIUS, TYPE } from '@/theme/azkar';

const { width: SW } = Dimensions.get('window');

// ─── Types ─────────────────────────────────────────────────────────────────────
export type PeriodKey = 'morning' | 'evening';

// ─── PulsingRings ──────────────────────────────────────────────────────────────
// Concentric animated rings used as atmospheric background
interface PulsingRingsProps {
  color:  string;
  count?: number;    // number of rings (default 3)
  size?:  number;    // base ring diameter (default SW * 1.1)
  gap?:   number;    // diameter increment per ring (default SW * 0.38)
}

export const PulsingRings = memo(({ color, count = 3, size = SW * 1.1, gap = SW * 0.38 }: PulsingRingsProps) => {
  const anims = useRef(Array.from({ length: count }, () => new Animated.Value(0.12))).current;

  useEffect(() => {
    anims.forEach((a, i) => {
      Animated.loop(Animated.sequence([
        Animated.timing(a, { toValue: 0.50, duration: 2800, delay: i * 900, useNativeDriver: true }),
        Animated.timing(a, { toValue: 0.12, duration: 2800, useNativeDriver: true }),
      ])).start();
    });
  }, []);

  return (
    <>
      {anims.map((a, i) => {
        const d = size + i * gap;
        return (
          <Animated.View key={i} pointerEvents="none" style={{
            position: 'absolute',
            width: d, height: d, borderRadius: d / 2,
            borderWidth: 1, borderColor: color,
            opacity: a,
            alignSelf: 'center',
            top: '50%', left: (SW - d) / 2, marginTop: -(d / 2),
          }} />
        );
      })}
    </>
  );
});

// ─── OrnamentalDivider ─────────────────────────────────────────────────────────
// A decorative horizontal rule with a central glyph
interface OrnamentalDividerProps {
  color?:      string;
  glyph?:      string;
  marginH?:    number;
  marginV?:    number;
  opacity?:    number;
}

export const OrnamentalDivider = memo(({
  color   = W[18],
  glyph   = '✦',
  marginH = SPACE.lg,
  marginV = SPACE.md,
  opacity = 1,
}: OrnamentalDividerProps) => (
  <View style={[d.row, { marginHorizontal: marginH, marginVertical: marginV, opacity }]}>
    <View style={[d.line, { backgroundColor: color }]} />
    <Text style={[d.glyph, { color }]}>{glyph}</Text>
    <View style={[d.line, { backgroundColor: color }]} />
  </View>
));

const d = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: SPACE.sm },
  line:  { flex: 1, height: 1 },
  glyph: { fontSize: 10 },
});

// ─── PeriodBadge ───────────────────────────────────────────────────────────────
// Small pill showing current period, tappable to switch
interface PeriodBadgeProps {
  period:    PeriodKey;
  onPress?:  () => void;
  size?:     'sm' | 'md';
}

export const PeriodBadge = memo(({ period, onPress, size = 'md' }: PeriodBadgeProps) => {
  const t = PERIODS[period];
  const Icon = period === 'morning' ? Sun : Moon;
  const isSmall = size === 'sm';

  const inner = (
    <View style={[
      pb.wrap,
      { borderColor: t.accentBorder, backgroundColor: t.accentSoft },
      isSmall && pb.wrapSmall,
    ]}>
      <Icon size={isSmall ? 10 : 12} color={t.accent} strokeWidth={2} />
      <Text style={[pb.label, { color: t.accent }, isSmall && pb.labelSmall]}>
        {period === 'morning' ? 'Morning' : 'Evening'}
      </Text>
      {onPress && <Text style={pb.change}>change ›</Text>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {inner}
      </TouchableOpacity>
    );
  }
  return inner;
});

const pb = StyleSheet.create({
  wrap:       { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: RADIUS.pill, paddingHorizontal: 12, paddingVertical: 7 },
  wrapSmall:  { paddingHorizontal: 9, paddingVertical: 5 },
  label:      { ...TYPE.caption, fontWeight: '700', letterSpacing: 0.4 },
  labelSmall: { fontSize: 10 },
  change:     { ...TYPE.caption, color: W[18], fontSize: 10, marginLeft: 2 },
});

// ─── EyebrowRow ───────────────────────────────────────────────────────────────
// "──── LABEL ────" decorative header element
interface EyebrowRowProps {
  label: string;
  color?: string;
}

export const EyebrowRow = memo(({ label, color = W[18] }: EyebrowRowProps) => (
  <View style={eb.row}>
    <View style={[eb.line, { backgroundColor: color }]} />
    <Text style={[eb.text, { color }]}>{label}</Text>
    <View style={[eb.line, { backgroundColor: color }]} />
  </View>
));

const eb = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', gap: SPACE.sm },
  line: { flex: 1, height: 1 },
  text: { ...TYPE.labelCaps, fontSize: 8, letterSpacing: 4 },
});

// ─── GhostButton ──────────────────────────────────────────────────────────────
// Borderless semi-transparent icon button
interface GhostButtonProps {
  onPress:  () => void;
  children: React.ReactNode;
  size?:    number;
  style?:   object;
}

export const GhostButton = memo(({ onPress, children, size = 38, style }: GhostButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: W['06'], borderWidth: 1, borderColor: W[10] }, style]}
  >
    {children}
  </TouchableOpacity>
));

// ─── BackButton ───────────────────────────────────────────────────────────────
interface BackButtonProps {
  onPress: () => void;
  top?:    number;
}

export const BackButton = memo(({ onPress, top }: BackButtonProps) => (
  <GhostButton
    onPress={onPress}
    size={40}
    style={{
      position: 'absolute',
      top:  top ?? (Platform.OS === 'ios' ? 58 : 38),
      left: SPACE.lg,
      zIndex: 10,
    }}
  >
    <ChevronLeft size={20} color={W[35]} />
  </GhostButton>
));

// ─── ProgressBar ──────────────────────────────────────────────────────────────
interface ProgressBarProps {
  current: number;
  total:   number;
  color:   string;
}

export const ProgressBar = memo(({ current, total, color }: ProgressBarProps) => {
  const progress = useRef(new Animated.Value(0)).current;
  const pct = total > 0 ? Math.min(current / total, 1) : 0;

  useEffect(() => {
    Animated.spring(progress, { toValue: pct, friction: 10, useNativeDriver: false }).start();
  }, [pct]);

  return (
    <View style={prg.track}>
      <Animated.View style={[prg.fill, {
        backgroundColor: color,
        width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
      }]} />
    </View>
  );
});

const prg = StyleSheet.create({
  track: { height: 2, backgroundColor: W['06'], marginHorizontal: SPACE.lg },
  fill:  { height: 2, borderRadius: 1 },
});

// ─── NavDots ──────────────────────────────────────────────────────────────────
interface NavDotsProps {
  total:   number;
  current: number;
  accent:  string;
  onPress?: (i: number) => void;
}

export const NavDots = memo(({ total, current, accent, onPress }: NavDotsProps) => {
  if (total > 20) {
    return (
      <Text style={[nd.counter, { color: `${accent}CC` }]}>
        {current + 1}<Text style={{ color: W[18] }}> / {total}</Text>
      </Text>
    );
  }

  return (
    <View style={nd.row}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const isPast   = i < current;
        const dot = (
          <View key={i} style={[
            nd.dot,
            isActive ? { width: 22, backgroundColor: accent } :
            isPast   ? { backgroundColor: `${accent}45` } :
                       { backgroundColor: W[10] },
          ]} />
        );
        return onPress ? (
          <TouchableOpacity key={i} onPress={() => onPress(i)} hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
            {dot}
          </TouchableOpacity>
        ) : dot;
      })}
    </View>
  );
});

const nd = StyleSheet.create({
  row:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, flexWrap: 'wrap' },
  dot:     { height: 6, width: 6, borderRadius: 3 },
  counter: { ...TYPE.displayM, fontWeight: '700', fontSize: 16 },
});

// ─── SessionCard ──────────────────────────────────────────────────────────────
// Reusable card for Morning / Evening session selection
interface SessionCardProps {
  period:    PeriodKey;
  count:     number;
  onPress:   () => void;
}

export const SessionCard = memo(({ period, count, onPress }: SessionCardProps) => {
  const t    = PERIODS[period];
  const Icon = period === 'morning' ? Sun : Moon;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.80} style={sc.root}>
      <View style={[sc.inner, { borderColor: `${t.accent}35`, backgroundColor: `${t.accent}08` }]}>
        <View style={[sc.iconBg, { backgroundColor: `${t.accent}20` }]}>
          <Icon size={24} color={t.accent} strokeWidth={1.6} />
        </View>
        <View style={sc.text}>
          <Text style={[sc.period, { color: t.accent }]}>{t.period}</Text>
          <Text style={sc.title}>{t.labelFull}</Text>
          <Text style={[sc.arabic, { color: `${t.accent}70` }]}>{t.labelAr}</Text>
          <View style={sc.countRow}>
            <View style={[sc.countDot, { backgroundColor: t.accent }]} />
            <Text style={sc.countText}>{count} adhkar</Text>
          </View>
        </View>
        <View style={[sc.arrow, { borderColor: `${t.accent}25`, backgroundColor: `${t.accent}10` }]}>
          <ChevronRight size={16} color={`${t.accent}90`} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const sc = StyleSheet.create({
  root:     { width: '100%' },
  inner:    { borderRadius: RADIUS.lg, padding: SPACE.md, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: SPACE.md },
  iconBg:   { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  text:     { flex: 1, gap: 3 },
  period:   { ...TYPE.labelCaps },
  title:    { color: W[95], fontSize: 17, fontWeight: '300', letterSpacing: 0.3 },
  arabic:   { fontSize: 13, fontWeight: '300', fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'serif' },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  countDot: { width: 4, height: 4, borderRadius: 2, opacity: 0.6 },
  countText:{ color: W[35], fontSize: 11 },
  arrow:    { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});

// ─── SectionHeader ────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  label: string;
  color?: string;
}

export const SectionHeader = memo(({ label, color = W[18] }: SectionHeaderProps) => (
  <View style={sh.row}>
    <View style={[sh.line, { backgroundColor: `${color}60` }]} />
    <Text style={[sh.label, { color }]}>{label}</Text>
    <View style={[sh.line, { backgroundColor: `${color}60` }]} />
  </View>
));

const sh = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: SPACE.sm, marginBottom: SPACE.sm },
  line:  { flex: 1, height: 1 },
  label: { ...TYPE.labelCaps, fontSize: 8 },
});

// ─── VirtueCard ───────────────────────────────────────────────────────────────
interface VirtueCardProps {
  text:   string;
  accent: string;
}

export const VirtueCard = memo(({ text, accent }: VirtueCardProps) => (
  <View style={[vc.root, { borderColor: `${accent}18`, backgroundColor: `${accent}06` }]}>
    <View style={[vc.topLine, { backgroundColor: accent }]} />
    <Text style={[vc.label, { color: `${accent}BB` }]}>✧  VIRTUE  ✧</Text>
    <Text style={vc.text}>{text}</Text>
  </View>
));

const vc = StyleSheet.create({
  root:    { borderWidth: 1, borderRadius: RADIUS.md, padding: SPACE.md, paddingTop: SPACE.lg, overflow: 'hidden' },
  topLine: { position: 'absolute', top: 0, left: 24, right: 24, height: 1.5 },
  label:   { ...TYPE.labelCaps, marginBottom: SPACE.sm, textAlign: 'center' },
  text:    { color: W[35], fontSize: 12.5, lineHeight: 21, textAlign: 'justify' },
});