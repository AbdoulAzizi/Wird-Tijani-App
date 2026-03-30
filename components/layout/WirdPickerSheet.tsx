// components/layout/WirdPickerSheet.tsx — Wird Tijani
//
// Unchanged from original — this picker is intrinsically Tariqa-specific
// (Wird · Wazifa · Haḍra) and belongs only in Wird Tijani.
// Rawdat Dhikr does NOT use this component.

import { Heart, Star, Moon, X, ChevronRight } from 'lucide-react-native';
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet, Pressable, Dimensions, Platform,
} from 'react-native';
import { useRef, useEffect } from 'react';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';

// ─── Theme — only identity tokens ────────────────────────────────────────────
import { practices, type PracticeKey } from '@/theme';

// ─── Icons map ────────────────────────────────────────────────────────────────
const ICONS: Record<PracticeKey, any> = {
  wird:   Heart,
  wazifa: Star,
  hadra:  Moon,
};

const PRACTICE_LIST = (['wird', 'wazifa', 'hadra'] as PracticeKey[]).map(key => ({
  ...practices[key],
  key,
  icon: ICONS[key],
}));

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
  visible:    boolean;
  onClose:    () => void;
  onNavigate: (route: string) => void;
  pathname:   string;
}

const { height: SH } = Dimensions.get('window');
const SHEET_H = Math.min(SH * 0.72, 560);

// ─── Glow orb ─────────────────────────────────────────────────────────────────
function GlowOrb({ color }: { color: string }) {
  return (
    <Svg width={80} height={80} style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%"   stopColor={color} stopOpacity="0.18" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Ellipse cx={40} cy={40} rx={40} ry={40} fill="url(#glow)" />
    </Svg>
  );
}

// ─── Practice card ────────────────────────────────────────────────────────────
function PracticeCard({
  item, onPress, index,
}: {
  item:    typeof PRACTICE_LIST[number];
  onPress: () => void;
  index:   number;
}) {
  const Icon      = item.icon;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1, delay: index * 70,
        damping: 16, stiffness: 220, useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 260, delay: index * 70, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[s.card, { backgroundColor: item.bg, borderColor: item.accentBorder }]}
        onPress={onPress}
        activeOpacity={0.72}
      >
        <View style={s.cardGlow} pointerEvents="none">
          <GlowOrb color={item.accent} />
        </View>

        <View style={[s.iconWrap, { backgroundColor: item.accentLight, borderColor: item.accentBorder }]}>
          <Icon color={item.accent} size={24} strokeWidth={1.8} />
        </View>

        <View style={s.cardBody}>
          <View style={s.cardTitleRow}>
            <Text style={[s.cardLabel, { color: '#1A1A2E' }]}>{item.label}</Text>
            <Text style={[s.cardArabic, { color: item.accent }]}>{item.arabicTitle}</Text>
          </View>
          <Text style={s.cardDesc}>{item.description}</Text>
        </View>

        <View style={[s.arrow, { backgroundColor: item.accentLight }]}>
          <ChevronRight color={item.accent} size={16} strokeWidth={2.5} />
        </View>

        <Text style={[s.arabicBig, { color: item.accent }]} numberOfLines={1}>
          {item.arabicLarge}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Ornamental divider ───────────────────────────────────────────────────────
function OrnamentalDivider() {
  return (
    <View style={s.divider}>
      <View style={s.dividerLine} />
      <Text style={s.dividerGlyph}>✦</Text>
      <View style={s.dividerLine} />
    </View>
  );
}

// ─── Sheet ────────────────────────────────────────────────────────────────────
export function WirdPickerSheet({ visible, onClose, onNavigate, pathname }: Props) {
  const slideAnim = useRef(new Animated.Value(SHEET_H)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue:   visible ? 0 : SHEET_H,
        useNativeDriver: true,
        damping:   visible ? 20 : 28,
        stiffness: visible ? 150 : 200,
      }),
      Animated.timing(fadeAnim, {
        toValue:  visible ? 1 : 0,
        duration: visible ? 240 : 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={s.overlay} pointerEvents="box-none">
      <Animated.View style={[s.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>

        <View style={s.handleWrap}>
          <View style={s.handle} />
        </View>

        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.headerTitle}>Daily Practices</Text>
            <Text style={s.headerSub}>Choose your spiritual practice</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
            <X color="#64748B" size={18} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <OrnamentalDivider />

        <View style={s.cards}>
          {PRACTICE_LIST.map((item, index) => (
            <PracticeCard
              key={item.key}
              item={item}
              index={index}
              onPress={() => onNavigate(item.route)}
            />
          ))}
        </View>

        <Text style={s.footer}>بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيم</Text>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  overlay:  { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2100, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(4,14,10,0.55)' },

  sheet: {
    backgroundColor:      '#FAFAF8',
    borderTopLeftRadius:  36,
    borderTopRightRadius: 36,
    height:               SHEET_H,
    shadowColor:          '#000',
    shadowOffset:         { width: 0, height: -8 },
    shadowOpacity:        0.18,
    shadowRadius:         24,
    elevation:            40,
    borderTopWidth:       1.5,
    borderLeftWidth:      0,
    borderRightWidth:     0,
    borderColor:          'rgba(245,158,11,0.25)',
  },

  handleWrap: { alignItems: 'center', paddingTop: 14, paddingBottom: 4 },
  handle:     { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D4B896' },

  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14 },
  headerLeft:  { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F1923', letterSpacing: -0.4 },
  headerSub:   { fontSize: 12, color: '#94A3B8', marginTop: 3, fontWeight: '500' },
  closeBtn:    { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  divider:      { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginBottom: 16 },
  dividerLine:  { flex: 1, height: 1, backgroundColor: '#E8DDD0' },
  dividerGlyph: { fontSize: 10, color: '#C8A97A', marginHorizontal: 10 },

  cards: { paddingHorizontal: 18, gap: 10 },

  card:         { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 20, borderWidth: 1.5, overflow: 'hidden', position: 'relative' },
  cardGlow:     { position: 'absolute', left: -10, top: -10, width: 80, height: 80 },
  iconWrap:     { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  cardBody:     { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 3 },
  cardLabel:    { fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  cardArabic:   { fontSize: 13, fontWeight: '600', fontFamily: Platform.OS === 'ios' ? 'Arial' : 'serif' },
  cardDesc:     { fontSize: 11.5, color: '#64748B', fontWeight: '500', lineHeight: 16 },
  arrow:        { width: 30, height: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

  arabicBig: {
    position: 'absolute', right: 52, top: '50%',
    fontSize: 44, opacity: 0.06, fontWeight: '900',
    transform: [{ translateY: -26 }],
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'serif',
  },

  footer: {
    textAlign: 'center', fontSize: 13, color: '#C8A97A',
    marginTop: 'auto', paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 8 : 16,
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'serif',
    opacity: 0.7,
  },
});