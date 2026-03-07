/**
 * ████████████████████████████████████████████████████████████████████████████
 *
 *   MeditativeShareModal
 *   Standalone share component for Al-Hadra — Al-Asma Al-Husna
 *
 *   Features:
 *   - Content selector: toggle which fields appear in the shared output
 *     (arabic name, transliteration, english, dimension, contemplation, practice)
 *   - Selection applies to both the image card (ViewShot) and text/clipboard
 *   - Card style selector: Night / Dawn / Dusk
 *   - 4 share actions: Image, Message, Copy, Stories
 *
 *   Usage:
 *     import MeditativeShareModal from './MeditativeShareModal';
 *     <MeditativeShareModal visible={showShare} name={currentName} onClose={() => setShowShare(false)} />
 *
 * ████████████████████████████████████████████████████████████████████████████
 */

import React, {
  useState, useCallback, useRef, useEffect, memo, useMemo,
} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Dimensions, Platform, Pressable, Modal, Easing,
  ScrollView, Share, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import {
  X, Share2, Copy, Download, Instagram, MessageCircle,
  CheckCircle, Check,
} from 'lucide-react-native';
import {
  AsmAllah, DIMENSION_LABELS, DIMENSION_COLORS,
} from "@/data/asmaAllah";
import { useAppVersion } from '@/hooks/useAppVersion';

const { width: W, height: H } = Dimensions.get('window');
const IS_IOS = Platform.OS === 'ios';
const CARD_W  = W - 40;

const haptic = (t: 'light' | 'medium' | 'success' = 'light') => {
  if (!IS_IOS) return;
  if (t === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (t === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

// ─── Content fields ────────────────────────────────────────────────────────────
// These are the toggleable items the user can include or exclude.
export type ContentField =
  | 'arabic'
  | 'transliteration'
  | 'english'
  | 'dimension'
  | 'contemplation'
  | 'practice';

export type ContentSelection = Record<ContentField, boolean>;

const DEFAULT_SELECTION: ContentSelection = {
  arabic:          true,
  transliteration: true,
  english:         true,
  dimension:       true,
  contemplation:   true,
  practice:        true,
};

const FIELD_META: Array<{
  key: ContentField;
  label: string;
  sub: string;
  icon: string;
}> = [
  { key: 'arabic',          label: 'Arabic Name',      sub: 'الاسم العربي',             icon: 'ع' },
  { key: 'transliteration', label: 'Transliteration',  sub: 'Romanized pronunciation',   icon: 'Aa' },
  { key: 'english',         label: 'English Meaning',  sub: 'The translated name',        icon: 'En' },
  { key: 'dimension',       label: 'Dimension',        sub: 'Spiritual category',         icon: '◈' },
  { key: 'contemplation',   label: 'Contemplation',    sub: 'Reflection text',            icon: '✦' },
  { key: 'practice',        label: 'Practice',         sub: 'Invocation & dhikr',         icon: '✧' },
];

// ─── Content Toggle Row ────────────────────────────────────────────────────────
const ContentToggle = memo(({
  field, selected, onToggle, accentColor,
}: {
  field: typeof FIELD_META[number];
  selected: boolean;
  onToggle: () => void;
  accentColor: string;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: selected ? 1 : 0,
      tension: 120, friction: 10, useNativeDriver: true,
    }).start();
  }, [selected]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 60, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }),
    ]).start();
    haptic();
    onToggle();
  };

  const checkScale = checkAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1.15, 1] });
  const checkOp    = checkAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const boxOp      = checkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.08, 1] });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <Animated.View style={[
        ct.row,
        { transform: [{ scale: scaleAnim }] },
        selected && { borderColor: accentColor + '30', backgroundColor: accentColor + '08' },
      ]}>
        {/* Icon badge */}
        <View style={[ct.iconBadge, { backgroundColor: accentColor + (selected ? '20' : '0A'), borderColor: accentColor + (selected ? '40' : '15') }]}>
          <Text style={[ct.iconText, { color: selected ? accentColor : accentColor + '55' }]}>
            {field.icon}
          </Text>
        </View>

        {/* Label */}
        <View style={ct.labelBlock}>
          <Text style={[ct.label, selected && { color: 'rgba(255,255,255,0.88)' }]}>{field.label}</Text>
          <Text style={ct.sub}>{field.sub}</Text>
        </View>

        {/* Checkbox */}
        <Animated.View style={[ct.checkbox, { borderColor: accentColor + (selected ? 'CC' : '30'), backgroundColor: accentColor, opacity: boxOp }]}>
          <Animated.View style={{ transform: [{ scale: checkScale }], opacity: checkOp }}>
            <Check color="#000000" size={11} strokeWidth={3} />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
});

const ct = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.025)', marginBottom: 6 },
  iconBadge: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  iconText:  { fontSize: 13, fontWeight: '700' },
  labelBlock:{ flex: 1, gap: 1 },
  label:     { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.45)', letterSpacing: 0.2 },
  sub:       { fontSize: 10, color: 'rgba(255,255,255,0.22)', fontWeight: '400', fontStyle: 'italic' },
  checkbox:  { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
});

// ─── Share Card ────────────────────────────────────────────────────────────────
// Rendered by ViewShot — respects content selection
const ShareCard = memo(({
  name, appName, selection, cardStyle,
}: {
  name: AsmAllah;
  appName: string;
  selection: ContentSelection;
  cardStyle: CardStyleKey;
}) => {
  const breathAnim = useRef(new Animated.Value(0)).current;
  const floatAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const b = Animated.loop(Animated.sequence([
      Animated.timing(breathAnim, { toValue: 1, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(breathAnim, { toValue: 0, duration: 3500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const f = Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    b.start(); f.start();
    return () => { b.stop(); f.stop(); };
  }, []);

  const PALETTES: Record<CardStyleKey, { bg: [string, string, string, string, string]; accent: string }> = {
    night: { bg: ['#060608', '#0B0B10', name.color + '14', '#0B0B10', '#060608'], accent: name.color },
    dawn:  { bg: ['#0D0A06', '#1A1005', '#E8A84A14', '#1A1005', '#0D0A06'],       accent: '#E8A84A' },
    dusk:  { bg: ['#06060D', '#0C0518', name.color + '18', '#0C0518', '#06060D'], accent: name.color },
  };

  const palette = PALETTES[cardStyle];
  const glowOp  = breathAnim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.38] });
  const glowSc  = breathAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.15] });
  const floatY  = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  const showIdentityBlock = selection.arabic || selection.transliteration || selection.english;
  const showTextBlock     = selection.contemplation || selection.practice;

  return (
    <View style={scard.card}>
      <LinearGradient colors={palette.bg} locations={[0, 0.25, 0.5, 0.75, 1]} style={StyleSheet.absoluteFill} />

      {/* Geometric rings */}
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={[scard.geoRing, {
          width: 90 + i * 70, height: 90 + i * 70,
          borderRadius: (90 + i * 70) / 2,
          borderColor: palette.accent + Math.max(5, 14 - i * 3).toString(16).padStart(2, '0'),
          top:  240 - (90 + i * 70) / 2,
          left: (CARD_W / 2) - (90 + i * 70) / 2,
        }]} />
      ))}

      <Animated.View style={[scard.glow, { backgroundColor: palette.accent, opacity: glowOp, transform: [{ scale: glowSc }] }]} pointerEvents="none" />

      {/* Top: counter */}
      <View style={scard.topArea}>
        <LinearGradient colors={['transparent', '#C8922A60', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={scard.goldLine} />
        <View style={scard.idRow}>
          <Text style={[scard.idNum, { color: palette.accent }]}>{String(name.id).padStart(2, '0')}</Text>
          <View style={[scard.idDot, { backgroundColor: palette.accent + '60' }]} />
          <Text style={[scard.idTotal, { color: palette.accent + '50' }]}>99</Text>
        </View>
      </View>

      {/* Identity block */}
      {showIdentityBlock && (
        <Animated.View style={[scard.centerBlock, { transform: [{ translateY: floatY }] }]}>
          {selection.arabic && (
            <Text style={[scard.arabicMain, { textShadowColor: name.glow, textShadowRadius: 30, textShadowOffset: { width: 0, height: 0 } }]}>
              {name.arabic}
            </Text>
          )}
          <LinearGradient colors={['transparent', '#C8922A', '#FDE68A', '#C8922A', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={scard.goldSep} />
          {selection.transliteration && (
            <Text style={[scard.translit, { color: palette.accent }]}>{name.transliteration}</Text>
          )}
          {selection.english && (
            <Text style={scard.english}>{name.english}</Text>
          )}
        </Animated.View>
      )}

      {/* Dimension chip */}
      {selection.dimension && (
        <View style={[scard.dimChip, { borderColor: palette.accent + '35', backgroundColor: palette.accent + '10' }]}>
          <View style={[scard.dimDot, { backgroundColor: palette.accent }]} />
          <Text style={[scard.dimText, { color: palette.accent + 'CC' }]}>
            {DIMENSION_LABELS[name.dimension].split(' -- ')[0].toUpperCase()}
          </Text>
        </View>
      )}

      {/* Text block: contemplation + practice */}
      {showTextBlock && (
        <View style={scard.textBlock}>
          {selection.contemplation && (
            <>
              <View style={scard.sectionRow}>
                <Text style={[scard.sectionSymbol, { color: palette.accent + '80' }]}>✦</Text>
                <Text style={[scard.sectionLabel, { color: palette.accent + '80' }]}>CONTEMPLATION</Text>
                <Text style={[scard.sectionSymbol, { color: palette.accent + '80' }]}>✦</Text>
              </View>
              <Text style={scard.bodyText}>{name.reflection}</Text>
            </>
          )}
          {selection.contemplation && selection.practice && (
            <View style={[scard.textDivider, { backgroundColor: palette.accent + '20' }]} />
          )}
          {selection.practice && (
            <>
              <Text style={[scard.sectionLabel, { color: 'rgba(253,230,138,0.45)', textAlign: 'center' }]}>✧  PRACTICE  ✧</Text>
              <Text style={scard.bodyText}>{name.invocation}</Text>
            </>
          )}
        </View>
      )}

      {/* Footer */}
      <View style={scard.footer}>
        <LinearGradient colors={['transparent', '#C8922A30', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={scard.footerLine} />
        <View style={scard.footerRow}>
          <Text style={scard.footerApp}>{appName.toUpperCase()}</Text>
          <View style={[scard.footerDot, { backgroundColor: palette.accent + '60' }]} />
          <Text style={[scard.footerSection, { color: palette.accent + '70' }]}>AL-HADRA</Text>
          <View style={[scard.footerDot, { backgroundColor: palette.accent + '40' }]} />
          <Text style={scard.footerSub}>الأَسْمَاءُ الحُسْنَى</Text>
        </View>
      </View>
    </View>
  );
});

const scard = StyleSheet.create({
  card:         { width: CARD_W, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(200,146,42,0.18)', alignItems: 'center', paddingVertical: 28, gap: 16 },
  geoRing:      { position: 'absolute', borderWidth: 1 },
  glow:         { position: 'absolute', width: CARD_W * 0.85, height: CARD_W * 0.85, borderRadius: CARD_W * 0.425, alignSelf: 'center', top: 50 },
  topArea:      { alignItems: 'center', gap: 10, width: '100%', paddingHorizontal: 28 },
  goldLine:     { height: 1, width: '70%' },
  idRow:        { flexDirection: 'row', alignItems: 'center', gap: 6 },
  idNum:        { fontSize: 11, fontWeight: '900', letterSpacing: 3 },
  idDot:        { width: 4, height: 4, borderRadius: 2 },
  idTotal:      { fontSize: 11, fontWeight: '600', letterSpacing: 2 },
  centerBlock:  { alignItems: 'center', gap: 8, paddingHorizontal: 20 },
  arabicMain:   { fontSize: 68, fontWeight: '200', color: '#FFFFFF', textAlign: 'center', lineHeight: 90, letterSpacing: 5 },
  goldSep:      { height: 1, width: CARD_W * 0.6, opacity: 0.8, marginVertical: 2 },
  translit:     { fontSize: 14, fontWeight: '700', fontStyle: 'italic', letterSpacing: 1.5, textAlign: 'center' },
  english:      { fontSize: 20, fontWeight: '200', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5, textAlign: 'center', lineHeight: 28 },
  dimChip:      { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  dimDot:       { width: 6, height: 6, borderRadius: 3 },
  dimText:      { fontSize: 8, fontWeight: '900', letterSpacing: 2 },
  textBlock:    { paddingHorizontal: 24, alignItems: 'center', gap: 8, width: '100%' },
  sectionRow:   { flexDirection: 'row', alignItems: 'center', gap: 7 },
  sectionSymbol:{ fontSize: 9 },
  sectionLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 3 },
  bodyText:     { fontSize: 10.5, color: 'rgba(255,255,255,0.42)', textAlign: 'center', lineHeight: 17, fontStyle: 'italic', fontWeight: '300', letterSpacing: 0.2 },
  textDivider:  { height: 1, width: '35%', marginVertical: 2 },
  footer:       { alignItems: 'center', gap: 8, width: '100%', paddingHorizontal: 28 },
  footerLine:   { height: 1, width: '60%' },
  footerRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  footerApp:    { fontSize: 9, color: '#C8922A', fontWeight: '900', letterSpacing: 4 },
  footerSection:{ fontSize: 8, fontWeight: '700', letterSpacing: 3 },
  footerDot:    { width: 3, height: 3, borderRadius: 1.5 },
  footerSub:    { fontSize: 9, color: 'rgba(255,255,255,0.25)', fontWeight: '300', letterSpacing: 1 },
});

// ─── Share Action Button ───────────────────────────────────────────────────────
type ShareActionProps = {
  icon: React.ReactNode;
  label: string;
  sub: string;
  color: string;
  onPress: () => void;
  isLoading?: boolean;
  isDone?: boolean;
};

const ShareAction = memo(({ icon, label, sub, color, onPress, isLoading, isDone }: ShareActionProps) => {
  const pressScale = useRef(new Animated.Value(1)).current;
  const doneAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isDone) {
      Animated.sequence([
        Animated.spring(doneAnim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
        Animated.delay(1200),
        Animated.timing(doneAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  }, [isDone]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(pressScale, { toValue: 0.93, duration: 80, useNativeDriver: true }),
      Animated.spring(pressScale, { toValue: 1, tension: 200, friction: 10, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const doneScale = doneAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1.2, 1] });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1} style={{ flex: 1 }}>
      <Animated.View style={[sa.btn, { borderColor: color + '25', transform: [{ scale: pressScale }] }]}>
        <LinearGradient colors={[color + '12', color + '08']} style={sa.btnGrad}>
          {isDone ? (
            <Animated.View style={{ transform: [{ scale: doneScale }] }}>
              <CheckCircle color="#4ADE80" size={22} strokeWidth={1.8} />
            </Animated.View>
          ) : isLoading ? (
            <View style={[sa.spinner, { borderTopColor: color }]} />
          ) : icon}
          <View style={sa.btnText}>
            <Text style={[sa.btnLabel, { color: isDone ? '#4ADE80' : color }]}>
              {isDone ? 'Copied!' : label}
            </Text>
            <Text style={sa.btnSub}>{sub}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
});

const sa = StyleSheet.create({
  btn:     { borderRadius: 18, overflow: 'hidden', borderWidth: 1 },
  btnGrad: { paddingVertical: 16, paddingHorizontal: 14, alignItems: 'center', gap: 10 },
  btnText: { alignItems: 'center', gap: 3 },
  btnLabel:{ fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  btnSub:  { fontSize: 9, color: 'rgba(255,255,255,0.30)', fontWeight: '400', letterSpacing: 0.5, textAlign: 'center' },
  spinner: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
});

// ─── Card style ────────────────────────────────────────────────────────────────
type CardStyleKey = 'night' | 'dawn' | 'dusk';

const CARD_STYLE_META: Array<{ key: CardStyleKey; label: string; dot: string }> = [
  { key: 'night', label: 'Night', dot: '#4A6FA5' },
  { key: 'dawn',  label: 'Dawn',  dot: '#E8A84A' },
  { key: 'dusk',  label: 'Dusk',  dot: '#7B4FA5' },
];

// ─── Section header (collapsible sections) ────────────────────────────────────
const SectionHeader = memo(({
  title, subtitle, expanded, onToggle, accentColor,
}: {
  title: string; subtitle?: string; expanded: boolean; onToggle: () => void; accentColor: string;
}) => (
  <TouchableOpacity onPress={onToggle} activeOpacity={0.75} style={sh.row}>
    <View style={sh.left}>
      <Text style={sh.title}>{title}</Text>
      {subtitle && <Text style={sh.sub}>{subtitle}</Text>}
    </View>
    <View style={[sh.badge, { backgroundColor: accentColor + '15', borderColor: accentColor + '30' }]}>
      <Text style={[sh.badgeText, { color: accentColor }]}>{expanded ? 'Hide' : 'Show'}</Text>
    </View>
  </TouchableOpacity>
));

const sh = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  left:      { gap: 1 },
  title:     { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.55)', letterSpacing: 2, textTransform: 'uppercase' },
  sub:       { fontSize: 10, color: 'rgba(255,255,255,0.22)', fontWeight: '400', fontStyle: 'italic' },
  badge:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
});

// ─── Main component ────────────────────────────────────────────────────────────
type Props = {
  visible: boolean;
  name: AsmAllah;
  onClose: () => void;
};

const SHEET_MAX = H * 0.94;

const MeditativeShareModal = memo(({ visible, name, onClose }: Props) => {
  const { appName } = useAppVersion();

  // ── State ─────────────────────────────────────────────────────────────────
  const [isCapturing,   setIsCapturing]   = useState(false);
  const [copiedText,    setCopiedText]    = useState(false);
  const [cardStyle,     setCardStyle]     = useState<CardStyleKey>('night');
  const [selection,     setSelection]     = useState<ContentSelection>(DEFAULT_SELECTION);
  const [showSelector,  setShowSelector]  = useState(false);

  // ── Animation refs ────────────────────────────────────────────────────────
  const backdropAnim    = useRef(new Animated.Value(0)).current;
  const sheetAnim       = useRef(new Animated.Value(H)).current;
  const cardReveal      = useRef(new Animated.Value(0)).current;
  const actionsReveal   = useRef(new Animated.Value(0)).current;
  const selectorHeight  = useRef(new Animated.Value(0)).current;
  const viewShotRef     = useRef<ViewShot>(null);

  // ── Open / close animation ────────────────────────────────────────────────
  useEffect(() => {
    if (visible) {
      backdropAnim.setValue(0); sheetAnim.setValue(H);
      cardReveal.setValue(0); actionsReveal.setValue(0);
      Animated.sequence([
        Animated.parallel([
          Animated.timing(backdropAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.spring(sheetAnim, { toValue: 0, tension: 55, friction: 14, useNativeDriver: true }),
        ]),
        Animated.timing(cardReveal,    { toValue: 1, duration: 480, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(actionsReveal, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    } else {
      setShowSelector(false);
      Animated.parallel([
        Animated.timing(backdropAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
        Animated.timing(sheetAnim,    { toValue: H, duration: 320, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  // ── Selector panel expand/collapse ────────────────────────────────────────
  useEffect(() => {
    Animated.spring(selectorHeight, {
      toValue: showSelector ? 1 : 0,
      tension: 60, friction: 14, useNativeDriver: false,
    }).start();
  }, [showSelector]);

  // ── Toggle a single field ─────────────────────────────────────────────────
  const toggleField = useCallback((key: ContentField) => {
    setSelection(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // ── Select all / none ─────────────────────────────────────────────────────
  const allSelected  = useMemo(() => Object.values(selection).every(Boolean), [selection]);
  const noneSelected = useMemo(() => Object.values(selection).every(v => !v), [selection]);

  const handleSelectAll  = useCallback(() => {
    haptic();
    setSelection(Object.fromEntries(FIELD_META.map(f => [f.key, true])) as ContentSelection);
  }, []);
  const handleSelectNone = useCallback(() => {
    haptic();
    setSelection(Object.fromEntries(FIELD_META.map(f => [f.key, false])) as ContentSelection);
  }, []);

  // ── Active field count (for selector badge) ───────────────────────────────
  const activeCount = useMemo(() => Object.values(selection).filter(Boolean).length, [selection]);

  // ── Build share text from current selection ───────────────────────────────
  const buildShareText = useCallback(() => {
    const lines: string[] = [];

    if (selection.arabic)          lines.push(name.arabic);
    if (selection.transliteration) lines.push(`${name.transliteration}${selection.english ? ` — ${name.english}` : ''}`);
    else if (selection.english)    lines.push(name.english);

    if (selection.arabic || selection.transliteration || selection.english) {
      lines.push(`Name ${name.id} of 99`);
    }

    if (selection.dimension) {
      lines.push('');
      lines.push(`${DIMENSION_LABELS[name.dimension].split(' -- ')[0]}`);
    }

    if (selection.contemplation) {
      lines.push('');
      lines.push('✦  CONTEMPLATION  ✦');
      lines.push('');
      lines.push(name.reflection);
    }

    if (selection.practice) {
      lines.push('');
      lines.push('✧  PRACTICE  ✧');
      lines.push('');
      lines.push(name.invocation);
    }

    lines.push('');
    lines.push(`— ${appName} · Al-Hadra · The 99 Beautiful Names of Allah`);

    return lines.join('\n');
  }, [selection, name, appName]);

  // ── Share handlers ─────────────────────────────────────────────────────────
  const handleShareImage = useCallback(async () => {
    try {
      setIsCapturing(true);
      haptic('medium');
      const uri = await (viewShotRef.current as any).capture();
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `${name.arabic} — ${name.english}`,
        });
      } else {
        Alert.alert('Sharing unavailable', 'Sharing is not available on this device.');
      }
    } catch (e) {
      console.warn('Share capture error:', e);
    } finally {
      setIsCapturing(false);
    }
  }, [name]);

  const handleShareText = useCallback(async () => {
    haptic();
    await Share.share({
      message: buildShareText(),
      title: `${name.transliteration} — ${name.english}`,
    });
  }, [buildShareText, name]);

  const handleCopyText = useCallback(async () => {
    haptic();
    await Clipboard.setStringAsync(buildShareText());
    haptic('success');
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  }, [buildShareText]);

  if (!visible) return null;

  const cardScale = cardReveal.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] });

  // Animated max-height for selector panel
  const selectorMaxH = selectorHeight.interpolate({
    inputRange: [0, 1], outputRange: [0, 460],
  });
  const selectorOp = selectorHeight.interpolate({
    inputRange: [0, 0.3, 1], outputRange: [0, 0, 1],
  });

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View style={[msm.backdrop, { opacity: backdropAnim }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[msm.sheet, { transform: [{ translateY: sheetAnim }] }]}>
        <LinearGradient colors={['#0C0C12', '#080810']} style={StyleSheet.absoluteFill} />

        {/* Gold top accent */}
        <LinearGradient
          colors={['transparent', name.color + '55', '#FDE68A', name.color + '55', 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={msm.topAccent}
        />
        <View style={msm.handle} />

        {/* Header */}
        <View style={msm.header}>
          <View style={msm.headerLeft}>
            <View style={[msm.headerIcon, { backgroundColor: name.color + '18', borderColor: name.color + '30' }]}>
              <Share2 color={name.color} size={16} strokeWidth={1.8} />
            </View>
            <View>
              <Text style={msm.headerTitle}>Share this Name</Text>
              <Text style={[msm.headerSub, { color: name.color + '80' }]}>Spread the presence</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={msm.closeBtn} activeOpacity={0.65}>
            <X color="rgba(255,255,255,0.35)" size={17} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={msm.scroll}>

          {/* ── Card style selector ── */}
          <Animated.View style={[msm.row, { opacity: cardReveal, marginBottom: 14 }]}>
            {CARD_STYLE_META.map(s => (
              <TouchableOpacity
                key={s.key}
                onPress={() => { haptic(); setCardStyle(s.key); }}
                activeOpacity={0.75}
                style={[msm.stylePill, cardStyle === s.key && { borderColor: name.color + '70', backgroundColor: name.color + '14' }]}
              >
                <View style={[msm.styleDot, { backgroundColor: s.dot }]} />
                <Text style={[msm.stylePillText, cardStyle === s.key && { color: name.color }]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* ── Card preview ── */}
          <Animated.View style={[msm.cardWrap, { opacity: cardReveal, transform: [{ scale: cardScale }] }]}>
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
              <ShareCard name={name} appName={appName} selection={selection} cardStyle={cardStyle} />
            </ViewShot>
          </Animated.View>

          {/* ── Content selector panel ── */}
          <Animated.View style={[msm.selectorWrap, { opacity: actionsReveal }]}>

            {/* Selector header row */}
            <TouchableOpacity
              onPress={() => { haptic(); setShowSelector(v => !v); }}
              activeOpacity={0.75}
              style={[msm.selectorHeader, showSelector && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomColor: 'transparent' }]}
            >
              <View style={msm.selectorHeaderLeft}>
                <View style={[msm.selectorIconWrap, { backgroundColor: name.color + '15', borderColor: name.color + '30' }]}>
                  <Text style={[msm.selectorIcon, { color: name.color }]}>☰</Text>
                </View>
                <View>
                  <Text style={msm.selectorTitle}>Content</Text>
                  <Text style={msm.selectorSub}>Choose what to include</Text>
                </View>
              </View>
              <View style={msm.selectorHeaderRight}>
                <View style={[msm.countBadge, { backgroundColor: name.color + '18', borderColor: name.color + '35' }]}>
                  <Text style={[msm.countBadgeText, { color: name.color }]}>{activeCount}/{FIELD_META.length}</Text>
                </View>
                <View style={[msm.chevron, showSelector && msm.chevronUp]}>
                  <Text style={msm.chevronText}>›</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Expandable panel */}
            <Animated.View style={[msm.selectorPanel, { maxHeight: selectorMaxH, opacity: selectorOp }]}>
              {/* Select all / none quick actions */}
              <View style={msm.quickRow}>
                <TouchableOpacity
                  onPress={handleSelectAll}
                  style={[msm.quickBtn, allSelected && { borderColor: '#4ADE80' + '60', backgroundColor: '#4ADE80' + '10' }]}
                  activeOpacity={0.75}
                >
                  <Text style={[msm.quickBtnText, allSelected && { color: '#4ADE80' }]}>Select all</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSelectNone}
                  style={[msm.quickBtn, noneSelected && { borderColor: '#F87171' + '60', backgroundColor: '#F87171' + '10' }]}
                  activeOpacity={0.75}
                >
                  <Text style={[msm.quickBtnText, noneSelected && { color: '#F87171' }]}>Clear all</Text>
                </TouchableOpacity>
              </View>

              {/* Toggle rows */}
              <View style={msm.fieldList}>
                {FIELD_META.map(field => (
                  <ContentToggle
                    key={field.key}
                    field={field}
                    selected={selection[field.key]}
                    onToggle={() => toggleField(field.key)}
                    accentColor={name.color}
                  />
                ))}
              </View>
            </Animated.View>
          </Animated.View>

          {/* ── Divider ── */}
          <Animated.View style={[msm.divRow, { opacity: actionsReveal }]}>
            <LinearGradient colors={['transparent', 'rgba(255,255,255,0.07)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={msm.divLine} />
            <Text style={msm.divText}>share as</Text>
            <LinearGradient colors={['transparent', 'rgba(255,255,255,0.07)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={msm.divLine} />
          </Animated.View>

          {/* ── Action grid 2×2 ── */}
          <Animated.View style={[msm.actionsGrid, { opacity: actionsReveal }]}>
            <View style={msm.actionsRow}>
              <ShareAction
                icon={<Download color={name.color} size={22} strokeWidth={1.6} />}
                label="Image"
                sub="High-res PNG card"
                color={name.color}
                onPress={handleShareImage}
                isLoading={isCapturing}
              />
              <ShareAction
                icon={<MessageCircle color="#7DD3FC" size={22} strokeWidth={1.6} />}
                label="Message"
                sub="Text + selected fields"
                color="#7DD3FC"
                onPress={handleShareText}
              />
            </View>
            <View style={msm.actionsRow}>
              <ShareAction
                icon={<Copy color="#A5B4FC" size={22} strokeWidth={1.6} />}
                label="Copy"
                sub="Copy to clipboard"
                color="#A5B4FC"
                onPress={handleCopyText}
                isDone={copiedText}
              />
              <ShareAction
                icon={<Instagram color="#F9A8D4" size={22} strokeWidth={1.6} />}
                label="Stories"
                sub="Vertical 9:16 format"
                color="#F9A8D4"
                onPress={handleShareImage}
              />
            </View>
          </Animated.View>

        </ScrollView>

        {IS_IOS && <View style={{ height: 28 }} />}
      </Animated.View>
    </Modal>
  );
});

const msm = StyleSheet.create({
  backdrop:           { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.72)' },
  sheet:              { position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: SHEET_MAX, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(200,146,42,0.14)' },
  topAccent:          { height: 1.5, width: '100%' },
  handle:             { width: 38, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.14)', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerLeft:         { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon:         { width: 40, height: 40, borderRadius: 13, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle:        { fontSize: 16, fontWeight: '700', color: 'rgba(255,255,255,0.88)', letterSpacing: 0.3 },
  headerSub:          { fontSize: 10, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 1 },
  closeBtn:           { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)', justifyContent: 'center', alignItems: 'center' },
  scroll:             { paddingHorizontal: 18, paddingBottom: 24 },

  row:                { flexDirection: 'row', gap: 8 },
  stylePill:          { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' },
  styleDot:           { width: 7, height: 7, borderRadius: 3.5 },
  stylePillText:      { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 0.5 },

  cardWrap:           { alignItems: 'center', marginBottom: 16 },

  // ── Content selector ──
  selectorWrap:       { marginBottom: 16 },
  selectorHeader:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' },
  selectorHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  selectorIconWrap:   { width: 32, height: 32, borderRadius: 9, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  selectorIcon:       { fontSize: 14, fontWeight: '700' },
  selectorTitle:      { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.75)', letterSpacing: 0.2 },
  selectorSub:        { fontSize: 10, color: 'rgba(255,255,255,0.28)', fontWeight: '400', fontStyle: 'italic' },
  selectorHeaderRight:{ flexDirection: 'row', alignItems: 'center', gap: 8 },
  countBadge:         { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  countBadgeText:     { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  chevron:            { width: 20, height: 20, justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '90deg' }] },
  chevronUp:          { transform: [{ rotate: '-90deg' }] },
  chevronText:        { fontSize: 18, color: 'rgba(255,255,255,0.3)', fontWeight: '300', lineHeight: 22 },
  selectorPanel:      { overflow: 'hidden', borderWidth: 1, borderTopWidth: 0, borderColor: 'rgba(255,255,255,0.08)', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, backgroundColor: 'rgba(255,255,255,0.02)', paddingHorizontal: 12, paddingTop: 10, paddingBottom: 4 },
  quickRow:           { flexDirection: 'row', gap: 8, marginBottom: 10 },
  quickBtn:           { flex: 1, paddingVertical: 6, borderRadius: 9, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
  quickBtnText:       { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5 },
  fieldList:          { gap: 0 },

  // ── Divider / actions ──
  divRow:             { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  divLine:            { flex: 1, height: 1 },
  divText:            { fontSize: 9, color: 'rgba(255,255,255,0.20)', fontWeight: '700', letterSpacing: 2.5, textTransform: 'uppercase' },
  actionsGrid:        { gap: 10 },
  actionsRow:         { flexDirection: 'row', gap: 10 },
});

export default MeditativeShareModal;