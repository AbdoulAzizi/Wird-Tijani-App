/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 *   AL-WIRD  ·  v4  ·  Sanctuaire Vivant — Edition Raffinée
 *
 *   Améliorations v4 :
 *   ─────────────────
 *   • Header entièrement visible via useSafeAreaInsets
 *   • Typographie plus élégante, hiérarchie visuelle renforcée
 *   • Cards avec micro-ombres et profondeur
 *   • Boutons d'action redesignés
 *   • DotStrip plus lisible
 *   • Animations d'entrée plus fluides
 *   • Spacing cohérent sur tout l'écran
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import React, {
  useState, useCallback, useRef, useEffect,
  useContext, useMemo, memo,
} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Dimensions, Platform, StatusBar, ScrollView,
  Modal, Pressable, Easing, TextInput,
  KeyboardAvoidingView, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft, RotateCcw, ChevronUp, ChevronDown,
  Edit3, Info, Check, X, Sunrise, Moon, Settings,
} from 'lucide-react-native';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import {
  Dhikr, ADHKAR_SABAH, ADHKAR_MASA,
  SABAH_THEME, MASA_THEME, WirdTheme, TYPE_LABELS,
} from '../../data/azkars';

// ─── Constants ────────────────────────────────────────────────────────────────
const { width: W, height: H } = Dimensions.get('window');
const IS_IOS = Platform.OS === 'ios';
const RING_SIZE = Math.min(W * 0.74, 308);
const STROKE = 5;
type Session = 'sabah' | 'masa';
type AppView = 'session' | 'customize';

// ─── Haptics ──────────────────────────────────────────────────────────────────
const haptic = (t: 'soft' | 'medium' | 'done' | 'toggle' = 'soft') => {
  if (!IS_IOS) return;
  switch (t) {
    case 'soft':   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
    case 'medium': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); break;
    case 'done':   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
    case 'toggle': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid); break;
  }
};

// ─── Progress Ring ────────────────────────────────────────────────────────────
const ProgressRing = memo(({ p, color, track, size, stroke }: {
  p: number; color: string; track: string; size: number; stroke: number;
}) => {
  const pct = Math.min(1, Math.max(0, p));
  const deg = pct * 360;
  const r   = size / 2;
  const rDeg = Math.min(deg, 180) - 180;
  const lDeg = deg > 180 ? deg - 360 : 0;

  return (
    <View style={{ width: size, height: size, borderRadius: r }} pointerEvents="none">
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: r, borderWidth: stroke, borderColor: track }} />
      <View style={{ position: 'absolute', width: r, height: size, left: r, overflow: 'hidden', top: 0 }}>
        <View style={{ position: 'absolute', width: size, height: size, borderRadius: r, borderWidth: stroke, borderColor: deg > 0 ? color : 'transparent', left: -r, transform: [{ rotate: `${rDeg}deg` }] }} />
      </View>
      {deg > 180 && (
        <View style={{ position: 'absolute', width: r, height: size, left: 0, overflow: 'hidden', top: 0 }}>
          <View style={{ position: 'absolute', width: size, height: size, borderRadius: r, borderWidth: stroke, borderColor: color, left: 0, transform: [{ rotate: `${lDeg}deg` }] }} />
        </View>
      )}
    </View>
  );
});

// ─── Breathing glow ───────────────────────────────────────────────────────────
const BreathGlow = memo(({ color, active }: { color: string; active: boolean }) => {
  const v = useRef(new Animated.Value(0)).current;
  const loop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    loop.current?.stop();
    if (!active) { v.setValue(0); return; }
    v.setValue(0);
    loop.current = Animated.loop(Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: 4200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 4200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.current.start();
    return () => loop.current?.stop();
  }, [active, color]);

  const opacity = v.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.15] });
  const scale   = v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });
  const S = RING_SIZE + 80;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute', alignSelf: 'center',
        width: S, height: S, borderRadius: S / 2,
        backgroundColor: color, opacity, transform: [{ scale }],
      }}
    />
  );
});

// ─── Tap ripple ───────────────────────────────────────────────────────────────
const TapRipple = memo(({ trigger, color }: { trigger: number; color: string }) => {
  const s = useRef(new Animated.Value(0.75)).current;
  const o = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!trigger) return;
    s.setValue(0.75); o.setValue(0.35);
    Animated.parallel([
      Animated.timing(s, { toValue: 1.55, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(o, { toValue: 0, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [trigger]);

  const S = RING_SIZE + 20;
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute', alignSelf: 'center',
        width: S, height: S, borderRadius: S / 2,
        borderWidth: 1.5, borderColor: color,
        opacity: o, transform: [{ scale: s }],
      }}
    />
  );
});

// ─── Completion bloom ─────────────────────────────────────────────────────────
const CompletionBloom = memo(({ trigger, color }: { trigger: number; color: string }) => {
  const s = useRef(new Animated.Value(0.8)).current;
  const o = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!trigger) return;
    s.setValue(0.8); o.setValue(0.2);
    Animated.sequence([
      Animated.parallel([
        Animated.spring(s, { toValue: 1.12, tension: 70, friction: 8, useNativeDriver: true }),
        Animated.timing(o, { toValue: 0.2, duration: 100, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(s, { toValue: 1, tension: 80, friction: 10, useNativeDriver: true }),
        Animated.timing(o, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, [trigger]);

  const S = RING_SIZE + 10;
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute', alignSelf: 'center',
        width: S, height: S, borderRadius: S / 2,
        backgroundColor: color, opacity: o, transform: [{ scale: s }],
      }}
    />
  );
});

// ─── Count Editor ─────────────────────────────────────────────────────────────
const CountEditor = memo(({ visible, dhikr, value, theme, onSave, onClose }: {
  visible: boolean; dhikr: Dhikr | null; value: number;
  theme: WirdTheme; onSave: (n: number) => void; onClose: () => void;
}) => {
  const [raw, setRaw] = useState('');
  const slide = useRef(new Animated.Value(H)).current;
  const dim   = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => { if (visible) setRaw(String(value)); }, [visible, value]);
  useEffect(() => {
    Animated.parallel([
      Animated.spring(slide, { toValue: visible ? 0 : H, damping: 24, stiffness: 200, useNativeDriver: true }),
      Animated.timing(dim, { toValue: visible ? 1 : 0, duration: 260, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  const num = Math.max(1, Math.min(9999, parseInt(raw) || 1));
  const PRESETS = [1, 3, 7, 10, 11, 33, 99, 100];
  if (!dhikr) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : undefined} style={{ flex: 1 }}>
        <Animated.View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)', opacity: dim }}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>
        <Animated.View style={[ce.sheet, { transform: [{ translateY: slide }] }]}>
          <LinearGradient colors={theme.id === 'sabah' ? ['#1E1608', '#120F04'] : ['#0D1120', '#07091A']} style={ce.inner}>
            {/* Handle */}
            <View style={ce.handle} />

            {/* Header row */}
            <View style={ce.headerRow}>
              <View style={[ce.badge, { backgroundColor: theme.accentFaint, borderWidth: 1, borderColor: theme.accentSoft + '30' }]}>
                <Text style={[ce.badgeText, { color: theme.accentSoft }]}>Répétitions</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={[ce.closeBtn, { borderColor: theme.border }]} activeOpacity={0.7}>
                <X color={theme.textDim} size={14} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Preview */}
            <View style={[ce.preview, { borderColor: theme.border, backgroundColor: theme.bgCard }]}>
              <Text style={[ce.previewAr, { color: theme.text }]} numberOfLines={2}>{dhikr.arabic}</Text>
              <View style={[ce.previewDivider, { backgroundColor: theme.border }]} />
              <Text style={[ce.previewSub, { color: theme.accentSoft }]}>
                {TYPE_LABELS[dhikr.type ?? 'dua']}  ·  Défaut : {dhikr.count}×
              </Text>
            </View>

            {/* Stepper */}
            <View style={ce.stepRow}>
              <TouchableOpacity
                style={[ce.stepBtn, { borderColor: theme.border, backgroundColor: theme.accentFaint }]}
                onPress={() => { haptic('soft'); setRaw(String(Math.max(1, num - 1))); }}
                activeOpacity={0.7}
              >
                <ChevronDown color={theme.accent} size={22} strokeWidth={2.5} />
              </TouchableOpacity>
              <View style={[ce.inputBox, { borderColor: theme.accentSoft + '50', backgroundColor: theme.accentFaint }]}>
                <TextInput
                  style={[ce.inputText, { color: theme.accentLight }]}
                  value={raw}
                  onChangeText={v => setRaw(v.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad" maxLength={4} selectTextOnFocus
                />
                <Text style={[ce.inputUnit, { color: theme.textDim }]}>fois</Text>
              </View>
              <TouchableOpacity
                style={[ce.stepBtn, { borderColor: theme.border, backgroundColor: theme.accentFaint }]}
                onPress={() => { haptic('soft'); setRaw(String(Math.min(9999, num + 1))); }}
                activeOpacity={0.7}
              >
                <ChevronUp color={theme.accent} size={22} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Presets */}
            <Text style={[ce.presetsLabel, { color: theme.textDim }]}>Valeurs courantes</Text>
            <View style={ce.presets}>
              {PRESETS.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[ce.chip, {
                    borderColor: num === p ? theme.accentSoft + '80' : theme.border,
                    backgroundColor: num === p ? theme.accentFaint : 'transparent',
                  }]}
                  onPress={() => { haptic('soft'); setRaw(String(p)); }}
                  activeOpacity={0.75}
                >
                  <Text style={[ce.chipNum, { color: num === p ? theme.accentLight : theme.textBody }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Confirm */}
            <TouchableOpacity
              style={[ce.confirmBtn, { borderColor: theme.accentSoft + '50' }]}
              onPress={() => { haptic('done'); onSave(num); onClose(); }}
              activeOpacity={0.82}
            >
              <LinearGradient
                colors={[theme.accent, theme.accentSoft]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={ce.confirmGrad}
              >
                <Check color="#000" size={16} strokeWidth={3} />
                <Text style={ce.confirmText}>Confirmer</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={{ height: insets.bottom + 8 }} />
          </LinearGradient>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

const ce = StyleSheet.create({
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  inner: { paddingHorizontal: 24 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.14)', alignSelf: 'center', marginTop: 12, marginBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  badge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  closeBtn: { marginLeft: 'auto', width: 32, height: 32, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)' },
  preview: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 10, marginBottom: 22 },
  previewAr: { fontSize: 17, lineHeight: 32, fontWeight: '400', textAlign: 'right' },
  previewDivider: { height: 1, opacity: 0.5 },
  previewSub: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 22 },
  stepBtn: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  inputBox: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 22, paddingVertical: 10, borderRadius: 18, borderWidth: 1.5 },
  inputText: { fontSize: 42, fontWeight: '200', letterSpacing: 2, textAlign: 'center', minWidth: 76 },
  inputUnit: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  presetsLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 3.5, textTransform: 'uppercase', marginBottom: 12 },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 },
  chip: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 9 },
  chipNum: { fontSize: 14, fontWeight: '600', letterSpacing: 0.3 },
  confirmBtn: { borderRadius: 18, overflow: 'hidden', borderWidth: 1 },
  confirmGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  confirmText: { fontSize: 15, fontWeight: '700', color: '#000', letterSpacing: 0.5 },
});

// ─── Info Sheet ────────────────────────────────────────────────────────────────
const InfoSheet = memo(({ visible, dhikr, theme, onClose }: {
  visible: boolean; dhikr: Dhikr | null; theme: WirdTheme; onClose: () => void;
}) => {
  const slide = useRef(new Animated.Value(H)).current;
  const dim   = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slide, { toValue: visible ? 0 : H, damping: 24, stiffness: 200, useNativeDriver: true }),
      Animated.timing(dim, { toValue: visible ? 1 : 0, duration: 260, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  if (!dhikr) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)', opacity: dim }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[iS.sheet, { transform: [{ translateY: slide }] }]}>
        <LinearGradient colors={theme.id === 'sabah' ? ['#1E1608', '#120F04'] : ['#0D1120', '#07091A']} style={iS.inner}>
          <View style={iS.handle} />
          <View style={iS.header}>
            <View style={[iS.typePill, { backgroundColor: theme.accentFaint, borderWidth: 1, borderColor: theme.accentSoft + '30' }]}>
              <Text style={[iS.typeText, { color: theme.accentSoft }]}>{TYPE_LABELS[dhikr.type ?? 'dua']}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[iS.closeBtn, { borderColor: theme.border }]} activeOpacity={0.7}>
              <X color={theme.textDim} size={14} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[iS.scroll, { paddingBottom: insets.bottom + 16 }]}>
            <View style={[iS.arabicCard, { borderColor: theme.border, backgroundColor: theme.bgCard }]}>
              <Text style={[iS.arabic, { color: theme.text }]}>{dhikr.arabic}</Text>
            </View>
            <View style={[iS.translitCard, { backgroundColor: theme.accentFaint, borderColor: theme.border }]}>
              <Text style={[iS.translit, { color: theme.accentSoft }]}>{dhikr.transliteration}</Text>
            </View>
            <View style={[iS.section, { borderTopColor: theme.border }]}>
              <Text style={[iS.sectionTag, { color: theme.textDim }]}>TRADUCTION</Text>
              <Text style={[iS.sectionText, { color: theme.textBody }]}>{dhikr.translationFr}</Text>
            </View>
            {dhikr.benefitFr && (
              <View style={[iS.benefitCard, { borderColor: theme.accentSoft + '30', backgroundColor: theme.accentFaint }]}>
                <Text style={[iS.benefitTag, { color: theme.accent }]}>✦ BIENFAIT</Text>
                <Text style={[iS.benefitText, { color: theme.textBody }]}>{dhikr.benefitFr}</Text>
              </View>
            )}
            {dhikr.source && (
              <View style={[iS.sourceRow, { borderColor: theme.border, backgroundColor: theme.bgCard }]}>
                <Text style={[iS.sourceTag, { color: theme.textDim }]}>SOURCE</Text>
                <Text style={[iS.sourceVal, { color: theme.accentLight }]}>{dhikr.source}</Text>
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
});

const iS = StyleSheet.create({
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: H * 0.88, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  inner: { paddingHorizontal: 24, flex: 1 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.14)', alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  typePill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  typeText: { fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  closeBtn: { marginLeft: 'auto', width: 32, height: 32, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)' },
  scroll: { gap: 14 },
  arabicCard: { borderWidth: 1, borderRadius: 18, padding: 20 },
  arabic: { fontSize: 19, lineHeight: 38, fontWeight: '400', textAlign: 'right' },
  translitCard: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 },
  translit: { fontSize: 12, fontStyle: 'italic', fontWeight: '500', letterSpacing: 0.4, lineHeight: 20 },
  section: { borderTopWidth: 1, paddingTop: 14, gap: 8 },
  sectionTag: { fontSize: 9, fontWeight: '800', letterSpacing: 3.5, textTransform: 'uppercase' },
  sectionText: { fontSize: 14, lineHeight: 24, fontWeight: '300' },
  benefitCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 8 },
  benefitTag: { fontSize: 9, fontWeight: '800', letterSpacing: 2.5, textTransform: 'uppercase' },
  benefitText: { fontSize: 13, lineHeight: 22, fontWeight: '300' },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 },
  sourceTag: { fontSize: 9, fontWeight: '800', letterSpacing: 2.5, textTransform: 'uppercase' },
  sourceVal: { fontSize: 13, fontWeight: '700', letterSpacing: 0.4 },
});

// ─── Dot navigation strip ─────────────────────────────────────────────────────
const DotStrip = memo(({ list, idx, done, theme }: {
  list: Dhikr[]; idx: number; done: Set<string>; theme: WirdTheme;
}) => {
  const ref = useRef<ScrollView>(null);
  useEffect(() => {
    ref.current?.scrollTo({ x: Math.max(0, idx - 3) * 22, animated: true });
  }, [idx]);

  return (
    <ScrollView
      ref={ref}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingHorizontal: 6 }}
      style={{ marginHorizontal: 24, marginBottom: 4, maxHeight: 20 }}
    >
      {list.map((d, i) => {
        const active = i === idx;
        const finished = done.has(d.id);
        return (
          <View key={d.id} style={{
            width: active ? 24 : 7,
            height: 7,
            borderRadius: 4,
            backgroundColor: active
              ? theme.accent
              : finished
                ? theme.accent + '60'
                : theme.borderSoft,
          }} />
        );
      })}
    </ScrollView>
  );
});

// ─── Progress bar ──────────────────────────────────────────────────────────────
const ProgressBar = memo(({ done, total, theme }: { done: number; total: number; theme: WirdTheme }) => {
  const pct = total > 0 ? done / total : 0;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [pct]);

  const w = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingVertical: 8 }}>
      <View style={{ flex: 1, height: 2.5, borderRadius: 2, backgroundColor: theme.border, overflow: 'hidden' }}>
        <Animated.View style={{ width: w, height: '100%', borderRadius: 2, overflow: 'hidden' }}>
          <LinearGradient
            colors={[theme.accent, theme.accentLight]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>
      <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1, color: theme.textDim, minWidth: 40, textAlign: 'right' }}>
        {done}
        <Text style={{ opacity: 0.4, fontWeight: '400' }}>/{total}</Text>
      </Text>
    </View>
  );
});

// ─── Main Dhikr Stage ─────────────────────────────────────────────────────────
const DhikrStage = memo(({ dhikr, count, theme, first, onComplete, onEdit, onInfo }: {
  dhikr: Dhikr; count: number; theme: WirdTheme; first: boolean;
  onComplete: () => void; onEdit: () => void; onInfo: () => void;
}) => {
  const [tapped, setTapped]       = useState(0);
  const [ripple, setRipple]       = useState(0);
  const [bloom, setBloom]         = useState(0);
  const [finishing, setFinishing] = useState(false);

  const prevId = useRef('');
  useEffect(() => {
    if (dhikr.id === prevId.current) return;
    prevId.current = dhikr.id;
    setTapped(0); setRipple(0); setBloom(0); setFinishing(false);
  }, [dhikr.id]);

  const entryO = useRef(new Animated.Value(first ? 1 : 0)).current;
  const entryS = useRef(new Animated.Value(first ? 1 : 0.94)).current;
  useEffect(() => {
    if (first) return;
    entryO.setValue(0); entryS.setValue(0.94);
    Animated.parallel([
      Animated.timing(entryO, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(entryS, { toValue: 1, tension: 65, friction: 12, useNativeDriver: true }),
    ]).start();
  }, [dhikr.id]);

  const floatV = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(floatV, { toValue: 1, duration: 4800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(floatV, { toValue: 0, duration: 4800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);
  const floatY = floatV.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  const isDone    = tapped >= count;
  const progress  = count > 0 ? Math.min(1, tapped / count) : 0;
  const remaining = Math.max(0, count - tapped);

  const handleTap = useCallback(() => {
    if (finishing || isDone) return;
    const next = tapped + 1;
    haptic(next >= count ? 'done' : 'soft');
    setTapped(next);
    setRipple(r => r + 1);
    if (next >= count) {
      setBloom(b => b + 1);
      setFinishing(true);
      setTimeout(() => onComplete(), 750);
    }
  }, [tapped, count, finishing, isDone, onComplete]);

  return (
    <Animated.View style={[stg.wrap, { opacity: entryO, transform: [{ scale: entryS }] }]}>
      <BreathGlow color={theme.accent} active />
      <TapRipple trigger={ripple} color={theme.accent} />
      <CompletionBloom trigger={bloom} color={theme.accent} />

      {/* Ring */}
      <Pressable onPress={handleTap} style={stg.ringArea}>
        <View style={[stg.ringWrap, { width: RING_SIZE, height: RING_SIZE }]}>
          <ProgressRing
            p={progress}
            color={isDone ? theme.accentLight : theme.accent}
            track={theme.ringTrack}
            size={RING_SIZE}
            stroke={STROKE}
          />

          <Animated.View style={[stg.center, { transform: [{ translateY: floatY }] }]}>
            {/* Count block */}
            <View style={stg.countBlock}>
              {isDone ? (
                <Text style={[stg.doneCheck, { color: theme.accentLight }]}>✓</Text>
              ) : (
                <>
                  <Text style={[stg.countNum, { color: theme.accent }]}>{remaining}</Text>
                  <Text style={[stg.countOf, { color: theme.textDim }]}>/ {count}</Text>
                </>
              )}
            </View>

            {/* Divider shimmer */}
            <LinearGradient
              colors={['transparent', theme.accentSoft + '70', theme.accentLight + 'BB', theme.accentSoft + '70', 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={stg.divider}
            />

            {/* Arabic */}
            <Text style={[stg.arabic, { color: theme.text }]} adjustsFontSizeToFit numberOfLines={5}>
              {dhikr.arabic}
            </Text>

            {!isDone && !finishing && (
              <Text style={[stg.hint, { color: theme.accent + '50' }]}>
                {tapped === 0 ? 'Appuyer pour commencer' : 'Continuer…'}
              </Text>
            )}
          </Animated.View>
        </View>
      </Pressable>

      {/* Meta bar */}
      <View style={stg.meta}>
        <Text style={[stg.translit, { color: theme.accentSoft + 'AA' }]} numberOfLines={1}>
          {dhikr.transliteration.split(' ').slice(0, 5).join(' ')}…
        </Text>
        <View style={stg.actions}>
          <TouchableOpacity
            style={[stg.actionBtn, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
            onPress={() => { haptic('medium'); onInfo(); }}
            activeOpacity={0.75}
          >
            <Info color={theme.accentSoft} size={13} strokeWidth={1.8} />
            <Text style={[stg.actionLabel, { color: theme.accentSoft }]}>Infos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[stg.actionBtn, { borderColor: theme.border, backgroundColor: theme.bgCard }]}
            onPress={() => { haptic('medium'); onEdit(); }}
            activeOpacity={0.75}
          >
            <Edit3 color={theme.accentSoft} size={12} strokeWidth={1.8} />
            <Text style={[stg.actionLabel, { color: theme.accentSoft }]}>{count}×</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Translation */}
      <Text style={[stg.translation, { color: theme.textDim }]} numberOfLines={3}>
        {dhikr.translationFr}
      </Text>
    </Animated.View>
  );
});

const stg = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', paddingHorizontal: 20, paddingTop: 2, paddingBottom: 12 },
  ringArea: { alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center', paddingHorizontal: 44, gap: 10, width: '100%' },
  countBlock: { alignItems: 'center', gap: 1 },
  countNum: { fontSize: 60, fontWeight: '100', lineHeight: 72, letterSpacing: -1 },
  countOf: { fontSize: 12, fontWeight: '600', letterSpacing: 2.5 },
  doneCheck: { fontSize: 56, fontWeight: '100', lineHeight: 72 },
  divider: { height: 1, width: W * 0.34, opacity: 0.8 },
  arabic: { fontSize: 17, lineHeight: 33, textAlign: 'center', fontWeight: '400', letterSpacing: 0.3 },
  hint: { fontSize: 8, fontWeight: '800', letterSpacing: 3.5, textTransform: 'uppercase', marginTop: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', width: '100%', gap: 10, paddingHorizontal: 4, marginBottom: 12 },
  translit: { flex: 1, fontSize: 10.5, fontStyle: 'italic', fontWeight: '500', letterSpacing: 0.3 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  actionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  translation: { fontSize: 12, lineHeight: 20, textAlign: 'center', fontWeight: '300', fontStyle: 'italic', paddingHorizontal: 14, opacity: 0.85 },
});

// ─── Session Complete ─────────────────────────────────────────────────────────
const SessionComplete = memo(({ theme, count, onReset }: {
  theme: WirdTheme; count: number; onReset: () => void;
}) => {
  const O  = useRef(new Animated.Value(0)).current;
  const S  = useRef(new Animated.Value(0.9)).current;
  const lv = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    haptic('done');
    Animated.sequence([
      Animated.parallel([
        Animated.timing(O, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.spring(S, { toValue: 1, tension: 55, friction: 10, useNativeDriver: true }),
      ]),
      Animated.timing(lv, { toValue: 1, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, []);

  const lw = lv.interpolate({ inputRange: [0, 1], outputRange: ['0%', '60%'] });

  return (
    <Animated.View style={[sc.wrap, { opacity: O, transform: [{ scale: S }] }]}>
      {[...Array(4)].map((_, i) => (
        <View key={i} style={[sc.ring, {
          width: 60 + i * 80, height: 60 + i * 80,
          borderRadius: (60 + i * 80) / 2,
          borderColor: theme.accent + (Math.round((0.12 - i * 0.025) * 255).toString(16).padStart(2, '0')),
        }]} />
      ))}
      <View style={sc.content}>
        <Text style={[sc.check, { color: theme.accentLight }]}>✓</Text>
        <View style={sc.lw}>
          <Animated.View style={{ width: lw, overflow: 'hidden' }}>
            <LinearGradient
              colors={['transparent', theme.accent, theme.accentLight, theme.accent, 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{ height: 1.5, width: W * 0.6 }}
            />
          </Animated.View>
        </View>
        <Text style={[sc.titleAr, { color: theme.text }]}>تَمَّ بِحَمْدِ اللَّه</Text>
        <Text style={[sc.titleLatin, { color: theme.accent }]}>SESSION TERMINÉE</Text>
        <Text style={[sc.sub, { color: theme.textDim }]}>
          {count} adhkar accomplis{'\n'}Qu'Allah les accepte
        </Text>
        <TouchableOpacity
          style={[sc.btn, { borderColor: theme.accentSoft + '50' }]}
          onPress={() => { haptic('medium'); onReset(); }}
          activeOpacity={0.82}
        >
          <LinearGradient
            colors={[theme.accent, theme.accentSoft]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={sc.btnGrad}
          >
            <RotateCcw color="#000" size={14} strokeWidth={2.5} />
            <Text style={sc.btnText}>Recommencer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

const sc = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', borderWidth: 1 },
  content: { alignItems: 'center', gap: 14, paddingHorizontal: 40, zIndex: 10 },
  check: { fontSize: 60, fontWeight: '100', lineHeight: 74 },
  lw: { alignItems: 'center', height: 1.5 },
  titleAr: { fontSize: 26, fontWeight: '300', letterSpacing: 2, textAlign: 'center', lineHeight: 42 },
  titleLatin: { fontSize: 9, fontWeight: '800', letterSpacing: 4.5 },
  sub: { fontSize: 14, lineHeight: 24, textAlign: 'center', fontWeight: '300' },
  btn: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, marginTop: 6 },
  btnGrad: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 32, paddingVertical: 15 },
  btnText: { fontSize: 14, fontWeight: '700', color: '#000', letterSpacing: 0.5 },
});

// ─── Session Tabs ─────────────────────────────────────────────────────────────
const SessionTabs = memo(({ session, onSwitch }: {
  session: Session; onSwitch: (s: Session) => void;
}) => {
  const ix = useRef(new Animated.Value(session === 'sabah' ? 0 : 1)).current;
  useEffect(() => {
    Animated.spring(ix, { toValue: session === 'sabah' ? 0 : 1, damping: 22, stiffness: 170, useNativeDriver: false }).start();
  }, [session]);

  const PW = (W - 48) / 2;
  const left = ix.interpolate({ inputRange: [0, 1], outputRange: [0, PW] });

  return (
    <View style={tt.container}>
      {/* Sliding pill */}
      <Animated.View style={[tt.pill, { width: PW, left }]}>
        <LinearGradient
          colors={session === 'sabah'
            ? ['rgba(212,151,59,0.16)', 'rgba(212,151,59,0.05)']
            : ['rgba(91,142,230,0.16)', 'rgba(91,142,230,0.05)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={[tt.pillBorder, { backgroundColor: session === 'sabah' ? SABAH_THEME.accent : MASA_THEME.accent }]} />
      </Animated.View>

      <TouchableOpacity style={[tt.tab, { width: PW }]} onPress={() => { haptic('soft'); onSwitch('sabah'); }} activeOpacity={0.85}>
        <Sunrise color={session === 'sabah' ? SABAH_THEME.accent : 'rgba(255,255,255,0.22)'} size={15} strokeWidth={1.8} />
        <Text style={[tt.arabic, { color: session === 'sabah' ? SABAH_THEME.text : 'rgba(255,255,255,0.28)' }]}>الصَّبَاح</Text>
        <Text style={[tt.latin, { color: session === 'sabah' ? SABAH_THEME.accent + 'AA' : 'rgba(255,255,255,0.16)' }]}>MATIN</Text>
      </TouchableOpacity>

      <View style={tt.sep} />

      <TouchableOpacity style={[tt.tab, { width: PW }]} onPress={() => { haptic('soft'); onSwitch('masa'); }} activeOpacity={0.85}>
        <Moon color={session === 'masa' ? MASA_THEME.accent : 'rgba(255,255,255,0.22)'} size={13} strokeWidth={1.8} />
        <Text style={[tt.arabic, { color: session === 'masa' ? MASA_THEME.text : 'rgba(255,255,255,0.28)' }]}>الْمَسَاء</Text>
        <Text style={[tt.latin, { color: session === 'masa' ? MASA_THEME.accent + 'AA' : 'rgba(255,255,255,0.16)' }]}>SOIR</Text>
      </TouchableOpacity>
    </View>
  );
});

const tt = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'stretch',
    marginHorizontal: 24, borderRadius: 18, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    height: 64, position: 'relative',
  },
  pill: { position: 'absolute', top: 0, bottom: 0, borderRadius: 16, overflow: 'hidden' },
  pillBorder: { position: 'absolute', bottom: 0, left: 20, right: 20, height: 2, borderRadius: 1, opacity: 0.8 },
  tab: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 8 },
  arabic: { fontSize: 18, fontWeight: '300', letterSpacing: 0.5 },
  latin: { position: 'absolute', bottom: 9, fontSize: 7, fontWeight: '800', letterSpacing: 3.5 },
  sep: { width: 1, backgroundColor: 'rgba(255,255,255,0.06)', alignSelf: 'stretch', marginVertical: 16 },
});

// ─── Customize Page ───────────────────────────────────────────────────────────
const CustomizePage = memo(({
  enabled, onToggle, onBack, session, onSwitch,
}: {
  enabled: Record<string, boolean>;
  onToggle: (id: string) => void;
  onBack: () => void;
  session: Session;
  onSwitch: (s: Session) => void;
}) => {
  const insets = useSafeAreaInsets();
  const theme = session === 'sabah' ? SABAH_THEME : MASA_THEME;
  const list  = session === 'sabah' ? ADHKAR_SABAH : ADHKAR_MASA;
  const enabledCount = list.filter(d => enabled[d.id] !== false).length;

  const entryO = useRef(new Animated.Value(0)).current;
  const entryX = useRef(new Animated.Value(28)).current;
  useEffect(() => {
    entryO.setValue(0); entryX.setValue(28);
    Animated.parallel([
      Animated.timing(entryO, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(entryX, { toValue: 0, tension: 65, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSelectAll = () => {
    haptic('medium');
    const allEnabled = list.every(d => enabled[d.id] !== false);
    list.forEach(d => {
      if (allEnabled) { if (d.id !== list[0].id) onToggle(d.id); }
      else { if (enabled[d.id] === false) onToggle(d.id); }
    });
  };

  return (
    <Animated.View style={[cp.wrap, { opacity: entryO, transform: [{ translateX: entryX }] }]}>
      <LinearGradient colors={theme.bgGrad as any} style={StyleSheet.absoluteFill} />

      {/* Top glow */}
      <View style={[cp.topGlow, { backgroundColor: theme.accent }]} pointerEvents="none" />

      {/* ── Header — uses safe area top inset ── */}
      <View style={[cp.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={onBack} style={[cp.backBtn, { borderColor: theme.border }]} activeOpacity={0.7}>
          <ArrowLeft color={theme.textDim} size={17} strokeWidth={1.8} />
        </TouchableOpacity>
        <View style={cp.headerCenter}>
          <Text style={[cp.headerTitle, { color: theme.text }]}>Personnalisation</Text>
          <Text style={[cp.headerSub, { color: theme.accent + '80' }]}>Choisissez vos adhkar</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Mini tabs */}
      <View style={cp.miniTabs}>
        {(['sabah', 'masa'] as Session[]).map(s => {
          const t = s === 'sabah' ? SABAH_THEME : MASA_THEME;
          const active = session === s;
          return (
            <TouchableOpacity
              key={s}
              style={[cp.miniTab, {
                borderColor: active ? t.accentSoft + '50' : 'rgba(255,255,255,0.07)',
                backgroundColor: active ? t.accentFaint : 'rgba(255,255,255,0.03)',
              }]}
              onPress={() => { haptic('soft'); onSwitch(s); }}
              activeOpacity={0.8}
            >
              {s === 'sabah'
                ? <Sunrise color={active ? t.accent : 'rgba(255,255,255,0.3)'} size={13} strokeWidth={1.8} />
                : <Moon    color={active ? t.accent : 'rgba(255,255,255,0.3)'} size={12} strokeWidth={1.8} />
              }
              <Text style={[cp.miniTabText, { color: active ? t.accentLight : 'rgba(255,255,255,0.3)' }]}>
                {s === 'sabah' ? 'Matin' : 'Soir'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Stats */}
      <View style={[cp.statsRow, { borderColor: theme.border }]}>
        <View style={[cp.statPill, { backgroundColor: theme.accentFaint, borderColor: theme.border }]}>
          <Text style={[cp.statNum, { color: theme.accentLight }]}>{enabledCount}</Text>
          <Text style={[cp.statLabel, { color: theme.accentSoft }]}>sélectionnés</Text>
        </View>
        <Text style={[cp.statSlash, { color: theme.textDim }]}>sur {list.length}</Text>
        <TouchableOpacity
          style={[cp.selectAllBtn, { borderColor: theme.border }]}
          onPress={handleSelectAll}
          activeOpacity={0.75}
        >
          <Text style={[cp.selectAllText, { color: theme.accentSoft }]}>
            {list.every(d => enabled[d.id] !== false) ? 'Tout désélectionner' : 'Tout sélectionner'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={list}
        keyExtractor={d => d.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 40, gap: 10, paddingTop: 6 }}
        renderItem={({ item: d, index: i }) => {
          const isOn = enabled[d.id] !== false;
          return (
            <TouchableOpacity
              onPress={() => { haptic('toggle'); onToggle(d.id); }}
              activeOpacity={0.82}
              style={[cp.card, {
                borderColor: isOn ? theme.accentSoft + '30' : theme.borderSoft,
                backgroundColor: isOn ? theme.accentFaint : theme.bgCard,
                opacity: isOn ? 1 : 0.5,
              }]}
            >
              <View style={[cp.cardBar, { backgroundColor: isOn ? theme.accent : theme.border }]} />
              <View style={[cp.cardNum, { backgroundColor: isOn ? theme.accentFaint : 'rgba(255,255,255,0.03)' }]}>
                <Text style={[cp.cardNumText, { color: isOn ? theme.accentSoft : theme.textDim }]}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
              </View>
              <View style={cp.cardBody}>
                <Text style={[cp.cardArabic, { color: isOn ? theme.text : theme.textDim }]} numberOfLines={2}>
                  {d.arabic}
                </Text>
                <View style={cp.cardMeta}>
                  <View style={[cp.typeBadge, { backgroundColor: theme.accentFaint, borderColor: theme.border }]}>
                    <Text style={[cp.typeBadgeText, { color: theme.accentSoft }]}>{TYPE_LABELS[d.type ?? 'dua']}</Text>
                  </View>
                  <Text style={[cp.cardCount, { color: theme.textDim }]}>{d.count}×</Text>
                  {d.source && <Text style={[cp.cardSource, { color: theme.textDim }]}>{d.source}</Text>}
                </View>
              </View>
              <View style={cp.cardToggle}>
                <View style={[cp.toggleTrack, {
                  backgroundColor: isOn ? theme.accent + '28' : 'rgba(255,255,255,0.05)',
                  borderColor: isOn ? theme.accent + '55' : 'rgba(255,255,255,0.09)',
                }]}>
                  <View style={[cp.toggleThumb, {
                    backgroundColor: isOn ? theme.accent : 'rgba(255,255,255,0.28)',
                    transform: [{ translateX: isOn ? 18 : 2 }],
                  }]} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </Animated.View>
  );
});

const cp = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#000' },
  topGlow: { position: 'absolute', top: -W * 0.6, alignSelf: 'center', width: W * 2, height: W * 2, borderRadius: W, opacity: 0.07 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 13, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.03)', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center', gap: 3 },
  headerTitle: { fontSize: 16, fontWeight: '500', letterSpacing: 0.3 },
  headerSub: { fontSize: 9, fontWeight: '800', letterSpacing: 2.5, textTransform: 'uppercase' },
  miniTabs: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  miniTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, borderWidth: 1 },
  miniTabText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 10 },
  statPill: { flexDirection: 'row', alignItems: 'baseline', gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  statNum: { fontSize: 20, fontWeight: '200' },
  statLabel: { fontSize: 11, fontWeight: '600' },
  statSlash: { fontSize: 12 },
  selectAllBtn: { marginLeft: 'auto', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  selectAllText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, overflow: 'hidden', paddingRight: 14, paddingVertical: 11 },
  cardBar: { width: 3, alignSelf: 'stretch' },
  cardNum: { width: 36, height: 36, borderRadius: 9, margin: 10, justifyContent: 'center', alignItems: 'center' },
  cardNumText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  cardBody: { flex: 1, gap: 6 },
  cardArabic: { fontSize: 15.5, lineHeight: 28, fontWeight: '400', textAlign: 'right' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7, borderWidth: 1 },
  typeBadgeText: { fontSize: 8.5, fontWeight: '800', letterSpacing: 1.2 },
  cardCount: { fontSize: 10.5, fontWeight: '600' },
  cardSource: { fontSize: 9.5, fontWeight: '400', fontStyle: 'italic' },
  cardToggle: { marginLeft: 10 },
  toggleTrack: { width: 40, height: 22, borderRadius: 11, borderWidth: 1, justifyContent: 'center' },
  toggleThumb: { width: 16, height: 16, borderRadius: 8 },
});

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function AzkarsScreen() {
  const { handleBack } = useContext(LayoutActionsContext);
  const insets = useSafeAreaInsets();

  const [session, setSession]   = useState<Session>('sabah');
  const [view, setView]         = useState<AppView>('session');
  const [idx, setIdx]           = useState(0);
  const [doneIds, setDoneIds]   = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);
  const [enabled, setEnabled]   = useState<Record<string, boolean>>({});
  const [customCounts, setCustomCounts] = useState<Record<string, number>>({});
  const [showEditor, setShowEditor] = useState(false);
  const [showInfo, setShowInfo]     = useState(false);

  const theme   = session === 'sabah' ? SABAH_THEME : MASA_THEME;
  const allList = session === 'sabah' ? ADHKAR_SABAH : ADHKAR_MASA;

  const activeList = useMemo(
    () => allList.filter(d => enabled[d.id] !== false),
    [allList, enabled]
  );

  const safeIdx = Math.min(idx, Math.max(0, activeList.length - 1));
  const current = activeList[safeIdx];

  const getCount = useCallback(
    (id: string, def: number) => customCounts[id] ?? def,
    [customCounts]
  );

  const handleToggle = useCallback((id: string) => {
    setEnabled(prev => {
      const isOn = prev[id] !== false;
      const activeCount = allList.filter(d => prev[d.id] !== false).length;
      if (isOn && activeCount <= 1) return prev;
      return { ...prev, [id]: !isOn };
    });
  }, [allList]);

  const handleSwitchSession = useCallback((s: Session) => {
    if (s === session) return;
    setSession(s); setIdx(0); setDoneIds(new Set()); setFinished(false);
  }, [session]);

  const handleComplete = useCallback(() => {
    if (!current) return;
    setDoneIds(prev => new Set([...prev, current.id]));
    if (safeIdx < activeList.length - 1) {
      setTimeout(() => setIdx(i => i + 1), 320);
    } else {
      setTimeout(() => setFinished(true), 650);
    }
  }, [current, safeIdx, activeList.length]);

  const handleReset = useCallback(() => {
    setIdx(0); setDoneIds(new Set()); setFinished(false);
  }, []);

  if (view === 'customize') {
    return (
      <CustomizePage
        enabled={enabled}
        onToggle={handleToggle}
        onBack={() => { haptic('soft'); setView('session'); }}
        session={session}
        onSwitch={handleSwitchSession}
      />
    );
  }

  if (!current) {
    return (
      <View style={ms.root}>
        <LinearGradient colors={theme.bgGrad as any} style={StyleSheet.absoluteFill} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <Text style={{ color: theme.textDim, fontSize: 15, fontWeight: '300' }}>Aucun adhkar sélectionné</Text>
          <TouchableOpacity
            style={[ms.resetBtn, { borderColor: theme.border }]}
            onPress={() => setView('customize')}
            activeOpacity={0.8}
          >
            <Text style={{ color: theme.accentSoft, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>Personnaliser</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Compute top bar height (safe area + bar content) ──
  const topBarPaddingTop = insets.top + 10;

  return (
    <View style={ms.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background */}
      <LinearGradient colors={theme.bgGrad as any} style={StyleSheet.absoluteFill} />

      {/* Ambient glow */}
      <View style={[ms.topGlow, { backgroundColor: theme.accent }]} pointerEvents="none" />

      {/* ── Top bar — safe area inset ── */}
      <View style={[ms.topBar, { paddingTop: topBarPaddingTop }]}>
        <TouchableOpacity onPress={handleBack} style={[ms.iconBtn, { borderColor: theme.border }]} activeOpacity={0.7}>
          <ArrowLeft color={theme.textDim} size={16} strokeWidth={1.8} />
        </TouchableOpacity>

        <View style={ms.topCenter}>
          <Text style={[ms.topTitle, { color: theme.accentLight }]}>{theme.label}</Text>
          <Text style={[ms.topSub, { color: theme.accent + '70' }]}>{theme.labelEn}</Text>
        </View>

        <View style={ms.topRight}>
          <TouchableOpacity
            style={[ms.iconBtn, { borderColor: theme.border }]}
            onPress={() => { haptic('soft'); setView('customize'); }}
            activeOpacity={0.7}
          >
            <Settings color={theme.textDim} size={15} strokeWidth={1.8} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[ms.iconBtn, { borderColor: theme.border }]}
            onPress={() => { haptic('medium'); handleReset(); }}
            activeOpacity={0.7}
          >
            <RotateCcw color={theme.textDim} size={13} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ marginBottom: 10 }}>
        <SessionTabs session={session} onSwitch={handleSwitchSession} />
      </View>

      {/* Progress */}
      <ProgressBar done={doneIds.size} total={activeList.length} theme={theme} />

      {/* Dots */}
      <DotStrip list={activeList} idx={safeIdx} done={doneIds} theme={theme} />

      {/* Content */}
      {finished ? (
        <SessionComplete theme={theme} count={doneIds.size} onReset={handleReset} />
      ) : (
        <DhikrStage
          key={current.id}
          dhikr={current}
          count={getCount(current.id, current.count)}
          theme={theme}
          first={idx === 0 && doneIds.size === 0}
          onComplete={handleComplete}
          onEdit={() => setShowEditor(true)}
          onInfo={() => setShowInfo(true)}
        />
      )}

      {/* Modals */}
      <CountEditor
        visible={showEditor}
        dhikr={current}
        value={getCount(current.id, current.count)}
        theme={theme}
        onSave={n => setCustomCounts(c => ({ ...c, [current.id]: n }))}
        onClose={() => setShowEditor(false)}
      />
      <InfoSheet
        visible={showInfo}
        dhikr={current}
        theme={theme}
        onClose={() => setShowInfo(false)}
      />
    </View>
  );
}

const ms = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  topGlow: {
    position: 'absolute',
    top: -W * 0.6, alignSelf: 'center',
    width: W * 2.2, height: W * 2.2, borderRadius: W * 1.1,
    opacity: 0.08,
  },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 11,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center', alignItems: 'center',
  },
  topCenter: { flex: 1, alignItems: 'center', gap: 3 },
  topTitle: { fontSize: 19, fontWeight: '300', letterSpacing: 1.5 },
  topSub: { fontSize: 8, fontWeight: '800', letterSpacing: 4, textTransform: 'uppercase' },
  topRight: { flexDirection: 'row', gap: 7 },
  resetBtn: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10 },
});