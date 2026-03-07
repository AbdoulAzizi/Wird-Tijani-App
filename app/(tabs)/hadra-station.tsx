/**
 * ████████████████████████████████████████████████████████████████████████████
 *
 *   AL-HADRA — The Station of Presence
 *   Meditation Experience for the 99 Names of Allah
 *
 *   Fixes applied:
 *   - MeditativeShareModal extracted to its own file and imported
 *   - Share button is separate from next/prev navigation (no overlap)
 *   - Swipe left/right + vertical scroll both navigate names in presence mode
 *   - All UI text in English
 *
 * ████████████████████████████████████████████████████████████████████████████
 */

import React, {
  useState, useCallback, useRef, useEffect, useContext,
  useMemo, memo,
} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Dimensions, Platform, PanResponder, StatusBar,
  ScrollView, FlatList, Pressable, Modal, Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  X, ChevronLeft, ChevronRight, Filter,
  BookOpen, Sparkles, ArrowLeft, Eye, Share2,
} from 'lucide-react-native';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import {
  asmaAllah, AsmAllah, NameDimension,
  DIMENSION_LABELS, DIMENSION_COLORS, DIMENSION_GLOW,
  ALL_DIMENSIONS, OPENING_INVOCATION, THRONE_VERSE, THRONE_VERSE_TRANS,
} from '../../data/asmaAllah';

// ── Standalone share modal (separate file) ────────────────────────────────────
import MeditativeShareModal from '@/components/MeditativeShareModal';

const { width: W, height: H } = Dimensions.get('window');
const IS_IOS = Platform.OS === 'ios';

// ─── Safe area top ────────────────────────────────────────────────────────────
const SAFE_TOP = IS_IOS ? 52 : (StatusBar.currentHeight ?? 24);
const NAVBAR_H = 56;

// ─── Haptics ──────────────────────────────────────────────────────────────────
const haptic = (t: 'light' | 'medium' | 'success' = 'light') => {
  if (!IS_IOS) return;
  if (t === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (t === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

// ─── Particle System ──────────────────────────────────────────────────────────
type Particle = {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  size: number;
};

function useParticles(color: string, count = 18): Particle[] {
  const particles = useRef<Particle[]>(
    Array.from({ length: count }, () => ({
      x: new Animated.Value(Math.random() * W - W / 2),
      y: new Animated.Value(Math.random() * H * 0.6 - H * 0.3),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.5 + Math.random() * 0.5),
      size: 2 + Math.random() * 4,
    }))
  ).current;

  const animations = useRef<Animated.CompositeAnimation[]>([]);

  const startParticle = useCallback((p: Particle) => {
    const startX   = (Math.random() - 0.5) * W * 0.85;
    const startY   = (Math.random() - 0.5) * H * 0.55;
    const endX     = startX + (Math.random() - 0.5) * 120;
    const endY     = startY - 60 - Math.random() * 80;
    const duration = 5000 + Math.random() * 6000;
    p.x.setValue(startX); p.y.setValue(startY);
    p.opacity.setValue(0); p.scale.setValue(0.3 + Math.random() * 0.7);
    return Animated.parallel([
      Animated.sequence([
        Animated.timing(p.opacity, { toValue: 0.6 + Math.random() * 0.4, duration: duration * 0.3, useNativeDriver: true }),
        Animated.timing(p.opacity, { toValue: 0, duration: duration * 0.7, useNativeDriver: true }),
      ]),
      Animated.timing(p.x, { toValue: endX, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(p.y, { toValue: endY, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]);
  }, []);

  useEffect(() => {
    animations.current.forEach(a => a.stop());
    animations.current = [];
    particles.forEach((p, i) => {
      const loop = () => {
        const anim = startParticle(p);
        animations.current.push(anim);
        anim.start(({ finished }) => { if (finished) loop(); });
      };
      setTimeout(loop, i * 280);
    });
    return () => { animations.current.forEach(a => a.stop()); };
  }, [color]);

  return particles;
}

// ─── Concentric Rings ─────────────────────────────────────────────────────────
const ConcentricRings = memo(({ color, active }: { color: string; active: boolean }) => {
  const rings = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const loops = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    loops.current.forEach(l => l.stop()); loops.current = [];
    if (!active) return;
    rings.forEach((ring, i) => {
      ring.setValue(0);
      const loop = Animated.loop(Animated.sequence([
        Animated.delay(i * 900),
        Animated.timing(ring, { toValue: 1, duration: 3600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(ring, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]));
      loops.current.push(loop); loop.start();
    });
    return () => loops.current.forEach(l => l.stop());
  }, [active, color]);

  const BASE = W * 0.38;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {rings.map((ring, i) => {
        const scale   = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 2.8 + i * 0.4] });
        const opacity = ring.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.22 - i * 0.04, 0] });
        return <Animated.View key={i} style={[cr.ring, { width: BASE, height: BASE, borderRadius: BASE / 2, borderColor: color, opacity, transform: [{ scale }] }]} />;
      })}
    </View>
  );
});

const cr = StyleSheet.create({
  ring: { position: 'absolute', alignSelf: 'center', top: H * 0.5 - (W * 0.38) / 2, borderWidth: 1.5 },
});

// ─── Sacred Name Display ──────────────────────────────────────────────────────
// Navigation: swipe left/right OR scroll up/down to move between names
const SacredNameDisplay = memo(({
  name, onNext, onPrev, hasPrev, hasNext, onEnterDeepMode, particles,
}: {
  name: AsmAllah; onNext: () => void; onPrev: () => void;
  hasPrev: boolean; hasNext: boolean; onEnterDeepMode: () => void; particles: Particle[];
}) => {
  const floatY    = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const loopRef   = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    entryAnim.setValue(0); scaleAnim.setValue(0.88);
    Animated.parallel([
      Animated.timing(entryAnim, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 55, friction: 9, useNativeDriver: true }),
    ]).start();
  }, [name.id]);

  useEffect(() => {
    loopRef.current?.stop();
    loopRef.current = Animated.loop(Animated.sequence([
      Animated.parallel([
        Animated.timing(floatY,    { toValue: 1, duration: 4200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 1, duration: 4200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(floatY,    { toValue: 0, duration: 4200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0, duration: 4200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ]));
    loopRef.current.start();
    return () => loopRef.current?.stop();
  }, []);

  const translateY = floatY.interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
  const glowScale  = glowPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] });
  const glowOp     = glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.32] });
  const textGlowOp = glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  // Combined horizontal swipe + vertical scroll gesture
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  (_, g) => Math.abs(g.dx) > 8 || Math.abs(g.dy) > 8,
    onPanResponderRelease: (_, g) => {
      const { dx, dy } = g;
      const absDx = Math.abs(dx), absDy = Math.abs(dy);
      if (absDx >= absDy) {
        // Horizontal — swipe left = next, swipe right = prev
        if (absDx > 55) {
          if (dx < 0 && hasNext) { haptic(); onNext(); }
          if (dx > 0 && hasPrev) { haptic(); onPrev(); }
        }
      } else {
        // Vertical — scroll up = next, scroll down = prev
        if (absDy > 55) {
          if (dy < 0 && hasNext) { haptic(); onNext(); }
          if (dy > 0 && hasPrev) { haptic(); onPrev(); }
        }
      }
    },
  }), [onNext, onPrev, hasNext, hasPrev]);

  return (
    <View style={snd.container} {...panResponder.panHandlers}>
      {particles.map((p, i) => (
        <Animated.View key={i} pointerEvents="none" style={[snd.particle, {
          width: p.size, height: p.size, borderRadius: p.size / 2,
          backgroundColor: i % 3 === 0 ? name.glow : i % 3 === 1 ? '#F59E0B' : name.color,
          opacity: p.opacity,
          transform: [{ translateX: p.x }, { translateY: p.y }, { scale: p.scale }],
        }]} />
      ))}

      <ConcentricRings color={name.color} active />
      <Animated.View pointerEvents="none" style={[snd.coreGlow, { backgroundColor: name.color, opacity: glowOp, transform: [{ scale: glowScale }] }]} />
      <View style={snd.horizonWrap} pointerEvents="none">
        <LinearGradient colors={['transparent', '#C8922A', '#FDE68A', '#C8922A', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={snd.horizon} />
      </View>

      <Animated.View style={[snd.nameCenter, { opacity: entryAnim, transform: [{ translateY }, { scale: scaleAnim }] }]}>
        <View style={[snd.numSigil, { borderColor: name.color + '50' }]}>
          <Text style={[snd.numSigilText, { color: name.color }]}>{String(name.id).padStart(2, '0')}</Text>
          <View style={[snd.numSigilDot, { backgroundColor: name.color }]} />
          <Text style={[snd.numSigilText, { color: name.color + '70' }]}>99</Text>
        </View>
        <TouchableWithoutFeedback onPress={onEnterDeepMode}>
          <Animated.Text style={[snd.arabicName, { color: '#FFFFFF', opacity: textGlowOp, textShadowColor: name.glow, textShadowRadius: 40, textShadowOffset: { width: 0, height: 0 } }]}>
            {name.arabic}
          </Animated.Text>
        </TouchableWithoutFeedback>
        <LinearGradient colors={['transparent', '#F59E0B80', '#FDE68A', '#F59E0B80', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={snd.goldSep} />
        <Text style={[snd.translit, { color: name.color }]}>{name.transliteration}</Text>
        <Text style={snd.english}>{name.english}</Text>
        <View style={[snd.dimChip, { borderColor: name.color + '40', backgroundColor: name.color + '12' }]}>
          <View style={[snd.dimDot, { backgroundColor: name.color }]} />
          <Text style={[snd.dimText, { color: name.color }]}>{DIMENSION_LABELS[name.dimension].toUpperCase()}</Text>
        </View>
        <Text style={snd.root}>
          {'\u202B'}{name.root}{'\u202C'}{'  '}
          <Text style={snd.rootLabel}>arabic root</Text>
        </Text>
      </Animated.View>

      {/* "Enter Presence" — floats above the nav row */}
      <TouchableOpacity style={snd.enterDeep} onPress={onEnterDeepMode} activeOpacity={0.7}>
        <Eye color={name.glow} size={14} strokeWidth={1.5} />
        <Text style={[snd.enterDeepText, { color: name.glow }]}>Enter Presence</Text>
      </TouchableOpacity>

      {/* Navigation row — prev / counter / next only (no share here) */}
      <View style={snd.navRow} pointerEvents="box-none">
        <TouchableOpacity style={[snd.navArrow, !hasPrev && snd.navArrowDis]} onPress={() => { haptic(); onPrev(); }} disabled={!hasPrev} activeOpacity={0.65}>
          <ChevronLeft color={hasPrev ? name.glow : '#1E293B'} size={20} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={snd.navCount}>{name.id} of 99</Text>
        <TouchableOpacity style={[snd.navArrow, !hasNext && snd.navArrowDis]} onPress={() => { haptic(); onNext(); }} disabled={!hasNext} activeOpacity={0.65}>
          <ChevronRight color={hasNext ? name.glow : '#1E293B'} size={20} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const SND_CENTER_Y = H * 0.42;
const snd = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  particle:     { position: 'absolute', alignSelf: 'center', top: H / 2, left: W / 2 },
  coreGlow:     { position: 'absolute', width: W * 1.1, height: W * 1.1, borderRadius: W * 0.55, alignSelf: 'center', top: SND_CENTER_Y - W * 0.55 },
  horizonWrap:  { position: 'absolute', width: W, top: SND_CENTER_Y + 40 },
  horizon:      { height: 1, width: '100%', opacity: 0.4 },
  nameCenter:   { alignItems: 'center', paddingHorizontal: 24, marginTop: -60 },
  numSigil:     { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 28 },
  numSigilText: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  numSigilDot:  { width: 4, height: 4, borderRadius: 2 },
  arabicName:   { fontSize: 72, fontWeight: '300', textAlign: 'center', lineHeight: 100, letterSpacing: 4, marginBottom: 8 },
  goldSep:      { height: 1, width: W * 0.5, opacity: 0.7, marginBottom: 14 },
  translit:     { fontSize: 17, fontWeight: '600', fontStyle: 'italic', letterSpacing: 1, marginBottom: 8, textAlign: 'center' },
  english:      { fontSize: 22, fontWeight: '300', color: 'rgba(255,255,255,0.85)', textAlign: 'center', letterSpacing: 0.5, marginBottom: 18, lineHeight: 30 },
  dimChip:      { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 12 },
  dimDot:       { width: 6, height: 6, borderRadius: 3 },
  dimText:      { fontSize: 9, fontWeight: '800', letterSpacing: 2 },
  root:         { fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textAlign: 'center' },
  rootLabel:    { fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: 2, textTransform: 'uppercase' },
  enterDeep:    { position: 'absolute', bottom: 130, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)' },
  enterDeepText:{ fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  navRow:       { position: 'absolute', bottom: 54, flexDirection: 'row', alignItems: 'center', width: W - 60, justifyContent: 'space-between' },
  navArrow:     { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.04)', justifyContent: 'center', alignItems: 'center' },
  navArrowDis:  { borderColor: 'rgba(255,255,255,0.03)', backgroundColor: 'transparent' },
  navCount:     { fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' },
});

// ─── Deep Presence Modal ──────────────────────────────────────────────────────
const DeepPresenceModal = memo(({
  visible, name, onClose, onNext, onPrev, hasPrev, hasNext, onShare,
}: {
  visible: boolean; name: AsmAllah; onClose: () => void;
  onNext: () => void; onPrev: () => void; hasPrev: boolean; hasNext: boolean;
  onShare: () => void;
}) => {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const contentScale    = useRef(new Animated.Value(0.94)).current;
  const arabicFloat     = useRef(new Animated.Value(0)).current;
  const breathGlow      = useRef(new Animated.Value(0)).current;
  const lineReveal      = useRef(new Animated.Value(0)).current;
  const textReveal      = useRef(new Animated.Value(0)).current;
  const loops           = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    if (visible) {
      backdropOpacity.setValue(0); contentScale.setValue(0.94);
      lineReveal.setValue(0); textReveal.setValue(0);
      Animated.sequence([
        Animated.parallel([
          Animated.timing(backdropOpacity, { toValue: 1, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.spring(contentScale, { toValue: 1, tension: 50, friction: 10, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(lineReveal, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
          Animated.timing(textReveal, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
      ]).start(() => {
        loops.current.forEach(l => l.stop()); loops.current = [];
        const breathLoop = Animated.loop(Animated.sequence([
          Animated.timing(breathGlow, { toValue: 1, duration: 4500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(breathGlow, { toValue: 0, duration: 4500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]));
        const floatLoop = Animated.loop(Animated.sequence([
          Animated.timing(arabicFloat, { toValue: 1, duration: 5000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(arabicFloat, { toValue: 0, duration: 5000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]));
        loops.current = [breathLoop, floatLoop];
        breathLoop.start(); floatLoop.start();
      });
    } else {
      loops.current.forEach(l => l.stop()); loops.current = [];
      Animated.timing(backdropOpacity, { toValue: 0, duration: 350, useNativeDriver: true }).start();
    }
    return () => { loops.current.forEach(l => l.stop()); };
  }, [visible, name.id]);

  const glowScale    = breathGlow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
  const glowOp       = breathGlow.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.28] });
  const floatY       = arabicFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
  const arabicGlowOp = breathGlow.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });
  const lineW        = lineReveal.interpolate({ inputRange: [0, 1], outputRange: ['0%', '70%'] });

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[dpm.backdrop, { opacity: backdropOpacity }]}>
        <LinearGradient colors={['#000000', '#000000', name.color + '08', '#000000']} locations={[0, 0.4, 0.7, 1]} style={StyleSheet.absoluteFill} />
        <Animated.View style={[dpm.glowCore, { backgroundColor: name.color, opacity: glowOp, transform: [{ scale: glowScale }] }]} pointerEvents="none" />
        <ConcentricRings color={name.color} active={visible} />

        <Animated.View style={[dpm.content, { transform: [{ scale: contentScale }] }]}>

          {/* Top row: X on far left, Share on far right — never overlap */}
          <View style={dpm.topRow}>
            <TouchableOpacity style={dpm.closeBtn} onPress={onClose} activeOpacity={0.6}>
              <X color="rgba(255,255,255,0.35)" size={18} strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity style={[dpm.shareBtn, { borderColor: name.color + '40' }]} onPress={() => { haptic('medium'); onShare(); }} activeOpacity={0.7}>
              <Share2 color={name.color} size={15} strokeWidth={1.8} />
              <Text style={[dpm.shareBtnText, { color: name.color }]}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Nav row: prev / counter pill / next */}
          <View style={dpm.navTop}>
            <TouchableOpacity onPress={() => { haptic(); onPrev(); }} disabled={!hasPrev} style={dpm.navTopBtn} activeOpacity={0.6}>
              <ChevronLeft color={hasPrev ? name.glow + 'BB' : 'rgba(255,255,255,0.08)'} size={18} strokeWidth={1.5} />
            </TouchableOpacity>
            <View style={[dpm.numPill, { borderColor: name.color + '30' }]}>
              <Text style={[dpm.numPillText, { color: name.color + 'CC' }]}>{String(name.id).padStart(2, '0')} / 99</Text>
            </View>
            <TouchableOpacity onPress={() => { haptic(); onNext(); }} disabled={!hasNext} style={dpm.navTopBtn} activeOpacity={0.6}>
              <ChevronRight color={hasNext ? name.glow + 'BB' : 'rgba(255,255,255,0.08)'} size={18} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          <Animated.Text style={[dpm.arabicName, { opacity: arabicGlowOp, transform: [{ translateY: floatY }], textShadowColor: name.glow, textShadowRadius: 50, textShadowOffset: { width: 0, height: 0 } }]}>
            {name.arabic}
          </Animated.Text>

          <View style={dpm.goldLineContainer}>
            <Animated.View style={{ width: lineW, overflow: 'hidden' }}>
              <LinearGradient colors={['transparent', '#C8922A', '#FDE68A', '#C8922A', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={dpm.goldLine} />
            </Animated.View>
          </View>

          <Animated.View style={[dpm.nameInfo, { opacity: textReveal }]}>
            <Text style={[dpm.translit, { color: name.color }]}>{name.transliteration}</Text>
            <Text style={dpm.english}>{name.english}</Text>
          </Animated.View>

          <Animated.View style={[dpm.dimBadge, { opacity: textReveal, borderColor: name.color + '30', backgroundColor: name.color + '0E' }]}>
            <View style={[dpm.dimDot, { backgroundColor: name.color }]} />
            <Text style={[dpm.dimText, { color: name.color + 'DD' }]}>{DIMENSION_LABELS[name.dimension]}</Text>
          </Animated.View>

          <ScrollView style={dpm.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={dpm.scrollContent}>
            <Animated.View style={{ opacity: textReveal }}>
              <View style={[dpm.sectionHeader, { borderColor: name.color + '25' }]}>
                <Text style={[dpm.sectionSymbol, { color: name.color }]}>✦</Text>
                <Text style={[dpm.sectionTitle, { color: name.color + 'CC' }]}>CONTEMPLATION</Text>
                <Text style={[dpm.sectionSymbol, { color: name.color }]}>✦</Text>
              </View>
              <Text style={dpm.reflectionText}>{name.reflection}</Text>
            </Animated.View>

            <Animated.View style={[dpm.invocationCard, { opacity: textReveal, borderColor: name.color + '30', backgroundColor: name.color + '08' }]}>
              <Text style={[dpm.invocLabel, { color: name.color + '80' }]}>✧  PRACTICE  ✧</Text>
              <Text style={dpm.invocText}>{name.invocation}</Text>
            </Animated.View>

            <Animated.View style={[dpm.rootWrap, { opacity: textReveal }]}>
              <Text style={dpm.rootArabic}>{name.root}</Text>
              <Text style={dpm.rootLabel}>Arabic Root</Text>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
});

const dpm = StyleSheet.create({
  backdrop:         { flex: 1, backgroundColor: '#000000' },
  glowCore:         { position: 'absolute', width: W * 1.3, height: W * 1.3, borderRadius: W * 0.65, alignSelf: 'center', top: H * 0.18 },
  content:          { flex: 1, alignItems: 'center', paddingTop: IS_IOS ? 56 : 40, paddingHorizontal: 24, paddingBottom: 30 },
  // Top row: X left, Share right — explicit justifyContent: space-between
  topRow:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 16 },
  closeBtn:         { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)', justifyContent: 'center', alignItems: 'center' },
  shareBtn:         { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.03)' },
  shareBtnText:     { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  navTop:           { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  navTopBtn:        { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', justifyContent: 'center', alignItems: 'center' },
  numPill:          { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  numPillText:      { fontSize: 11, fontWeight: '800', letterSpacing: 3 },
  arabicName:       { fontSize: 80, fontWeight: '200', color: '#FFFFFF', textAlign: 'center', lineHeight: 110, letterSpacing: 6, marginBottom: 12 },
  goldLineContainer:{ width: W - 48, alignItems: 'center', height: 1.5, marginBottom: 20 },
  goldLine:         { height: 1.5, width: W - 48 },
  nameInfo:         { alignItems: 'center', gap: 6, marginBottom: 14 },
  translit:         { fontSize: 16, fontWeight: '600', fontStyle: 'italic', letterSpacing: 1.5 },
  english:          { fontSize: 24, fontWeight: '200', color: 'rgba(255,255,255,0.80)', letterSpacing: 0.5, textAlign: 'center', lineHeight: 32 },
  dimBadge:         { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 24 },
  dimDot:           { width: 6, height: 6, borderRadius: 3 },
  dimText:          { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  scroll:           { flex: 1, width: '100%' },
  scrollContent:    { paddingBottom: 40, gap: 20 },
  sectionHeader:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 10, marginBottom: 16 },
  sectionSymbol:    { fontSize: 10 },
  sectionTitle:     { fontSize: 9, fontWeight: '800', letterSpacing: 3 },
  reflectionText:   { fontSize: 15, lineHeight: 28, color: 'rgba(255,255,255,0.68)', fontWeight: '300', letterSpacing: 0.3 },
  invocationCard:   { borderWidth: 1, borderRadius: 20, padding: 20, gap: 12, alignItems: 'center' },
  invocLabel:       { fontSize: 9, fontWeight: '800', letterSpacing: 3 },
  invocText:        { fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 24, fontStyle: 'italic', textAlign: 'center', fontWeight: '300' },
  rootWrap:         { alignItems: 'center', gap: 4, paddingVertical: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  rootArabic:       { fontSize: 22, color: 'rgba(255,255,255,0.35)', letterSpacing: 8, fontWeight: '300' },
  rootLabel:        { fontSize: 9, color: 'rgba(255,255,255,0.18)', letterSpacing: 3, textTransform: 'uppercase', fontWeight: '600' },
});

// ─── Opening Sanctuary ────────────────────────────────────────────────────────
const OpeningSanctuary = memo(({ onEnter }: { onEnter: () => void }) => {
  const fade       = useRef(new Animated.Value(0)).current;
  const scale      = useRef(new Animated.Value(1.06)).current;
  const goldReveal = useRef(new Animated.Value(0)).current;
  const textFade   = useRef(new Animated.Value(0)).current;
  const btnFade    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade,  { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 1800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.timing(goldReveal, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(textFade,   { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.delay(300),
      Animated.timing(btnFade,    { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const goldW = goldReveal.interpolate({ inputRange: [0, 1], outputRange: ['0%', '55%'] });

  return (
    <Animated.View style={[os.container, { opacity: fade }]}>
      <LinearGradient colors={['#000000', '#050505', '#0A0005', '#000000']} style={StyleSheet.absoluteFill} />
      {[...Array(6)].map((_, i) => (
        <View key={i} style={[os.geometricRing, {
          width: 80 + i * 90, height: 80 + i * 90, borderRadius: (80 + i * 90) / 2,
          borderColor: `rgba(200,146,42,${0.06 - i * 0.008})`,
          top: H / 2 - (80 + i * 90) / 2, left: W / 2 - (80 + i * 90) / 2,
        }]} />
      ))}
      <Animated.View style={[os.content, { transform: [{ scale }] }]}>
        <Text style={os.basmalah}>{OPENING_INVOCATION}</Text>
        <View style={os.goldLineWrap}>
          <Animated.View style={{ width: goldW, overflow: 'hidden' }}>
            <LinearGradient colors={['transparent', '#C8922A', '#FDE68A', '#C8922A', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={os.goldLine} />
          </Animated.View>
        </View>
        <Animated.View style={{ opacity: textFade, alignItems: 'center', gap: 10 }}>
          <Text style={os.titleArabic}>الأَسْمَاءُ الحُسْنَى</Text>
          <Text style={os.titleLatin}>AL-ASMA AL-HUSNA</Text>
          <Text style={os.subtitle}>The 99 Beautiful Names of Allah</Text>
          <View style={os.throneWrap}>
            <Text style={os.throneArabic}>{THRONE_VERSE}</Text>
            <Text style={os.throneTrans}>{THRONE_VERSE_TRANS}</Text>
            <Text style={os.throneRef}>Quran 2:255 — Ayat al-Kursi</Text>
          </View>
          <Text style={os.desc}>{"Each Name is a door.\nEach door opens onto a dimension of Reality.\nEnter with presence."}</Text>
          <View style={os.stats}>
            {[{ n: '99', l: 'Names' }, { n: '5', l: 'Dimensions' }, { n: '∞', l: 'Depth' }].map(s => (
              <View key={s.l} style={os.stat}>
                <Text style={os.statNum}>{s.n}</Text>
                <Text style={os.statLabel}>{s.l}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
        <Animated.View style={{ opacity: btnFade, marginTop: 8 }}>
          <TouchableOpacity style={os.enterBtn} onPress={onEnter} activeOpacity={0.8}>
            <LinearGradient colors={['#1A0E00', '#2D1A00', '#1A0E00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={os.enterBtnGrad}>
              <Text style={os.enterBtnText}>Enter Al-Hadra</Text>
              <Text style={os.enterBtnSub}>The Station of Presence</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
});

const os = StyleSheet.create({
  container:    { ...StyleSheet.absoluteFillObject, zIndex: 1000, justifyContent: 'center', alignItems: 'center' },
  geometricRing:{ position: 'absolute', borderWidth: 1 },
  content:      { alignItems: 'center', paddingHorizontal: 30, gap: 16 },
  basmalah:     { fontSize: 15, color: 'rgba(200,146,42,0.7)', letterSpacing: 1, textAlign: 'center', lineHeight: 28 },
  goldLineWrap: { width: '70%', alignItems: 'center', height: 1.5 },
  goldLine:     { height: 1.5, width: '100%' },
  titleArabic:  { fontSize: 36, color: '#FFFFFF', fontWeight: '300', textAlign: 'center', lineHeight: 52, letterSpacing: 2 },
  titleLatin:   { fontSize: 11, color: 'rgba(200,146,42,0.8)', fontWeight: '800', letterSpacing: 5, textAlign: 'center' },
  subtitle:     { fontSize: 14, color: 'rgba(255,255,255,0.45)', textAlign: 'center', fontWeight: '300', letterSpacing: 0.5 },
  throneWrap:   { borderWidth: 1, borderColor: 'rgba(200,146,42,0.2)', borderRadius: 16, padding: 16, alignItems: 'center', gap: 8, backgroundColor: 'rgba(200,146,42,0.04)', width: '100%' },
  throneArabic: { fontSize: 14, color: 'rgba(253,230,138,0.8)', textAlign: 'center', lineHeight: 26, fontWeight: '400' },
  throneTrans:  { fontSize: 11, color: 'rgba(255,255,255,0.45)', textAlign: 'center', fontStyle: 'italic', lineHeight: 18 },
  throneRef:    { fontSize: 9, color: 'rgba(200,146,42,0.45)', letterSpacing: 2, fontWeight: '600', textTransform: 'uppercase' },
  desc:         { fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 22, fontStyle: 'italic', fontWeight: '300' },
  stats:        { flexDirection: 'row', gap: 32 },
  stat:         { alignItems: 'center', gap: 2 },
  statNum:      { fontSize: 28, fontWeight: '200', color: '#C8922A', letterSpacing: 1 },
  statLabel:    { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase' },
  enterBtn:     { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(200,146,42,0.4)' },
  enterBtnGrad: { paddingHorizontal: 36, paddingVertical: 16, alignItems: 'center', gap: 4 },
  enterBtnText: { fontSize: 15, fontWeight: '700', color: '#C8922A', letterSpacing: 1.5, textTransform: 'uppercase' },
  enterBtnSub:  { fontSize: 9, color: 'rgba(200,146,42,0.5)', letterSpacing: 3, fontWeight: '600', textTransform: 'uppercase' },
});

// ─── List Item ────────────────────────────────────────────────────────────────
const NameListItem = memo(({ name, onPress }: { name: AsmAllah; onPress: () => void }) => {
  const color = DIMENSION_COLORS[name.dimension];
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={ll.row}>
      <View style={[ll.bar, { backgroundColor: color }]} />
      <View style={[ll.numBox, { backgroundColor: color + '18' }]}>
        <Text style={[ll.num, { color }]}>{String(name.id).padStart(2, '0')}</Text>
      </View>
      <View style={ll.body}>
        <Text style={ll.arabic}>{name.arabic}</Text>
        <Text style={[ll.translit, { color }]}>{name.transliteration}</Text>
        <Text style={ll.englishSub} numberOfLines={1}>{name.english}</Text>
      </View>
      <View style={[ll.dimDot, { backgroundColor: color }]} />
    </TouchableOpacity>
  );
});

const ll = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0A0A0F', marginHorizontal: 14, marginBottom: 8, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  bar:       { width: 3, alignSelf: 'stretch' },
  numBox:    { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', margin: 10 },
  num:       { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  body:      { flex: 1, paddingVertical: 12, gap: 2 },
  arabic:    { fontSize: 20, color: '#FFFFFF', fontWeight: '400', lineHeight: 30 },
  translit:  { fontSize: 11, fontWeight: '600', fontStyle: 'italic', letterSpacing: 0.5 },
  englishSub:{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '400', letterSpacing: 0.2 },
  dimDot:    { width: 8, height: 8, borderRadius: 4, marginRight: 16 },
});

// ─── Filter Drawer ────────────────────────────────────────────────────────────
type FilterMode = NameDimension | 'all';

const FilterDrawer = memo(({ visible, current, onSelect, onClose }: {
  visible: boolean; current: FilterMode;
  onSelect: (f: FilterMode) => void; onClose: () => void;
}) => {
  const slide   = useRef(new Animated.Value(H)).current;
  const overlay = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slide,   { toValue: visible ? 0 : H, useNativeDriver: true, damping: 24, stiffness: 200 }),
      Animated.timing(overlay, { toValue: visible ? 1 : 0, duration: visible ? 200 : 150, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  if (!visible) return null;

  const filters: Array<{ key: FilterMode; label: string; sub: string; color: string; count: number }> = [
    { key: 'all', label: 'All Names', sub: 'The Complete Garden', color: '#C8922A', count: asmaAllah.length },
    ...ALL_DIMENSIONS.map(d => ({
      key: d as FilterMode,
      label: DIMENSION_LABELS[d].split(' -- ')[0],
      sub:   DIMENSION_LABELS[d].split(' -- ')[1] ?? '',
      color: DIMENSION_COLORS[d],
      count: asmaAllah.filter(n => n.dimension === d).length,
    })),
  ];

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[fd.overlay, { opacity: overlay }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[fd.sheet, { transform: [{ translateY: slide }] }]}>
        <LinearGradient colors={['#0A0A0F', '#050508']} style={fd.sheetGrad}>
          <View style={fd.handle} />
          <View style={fd.header}>
            <Text style={fd.title}>Navigate the Names</Text>
            <TouchableOpacity onPress={onClose} style={fd.closeBtn}>
              <X color="rgba(255,255,255,0.4)" size={16} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
          <View style={fd.goldDiv}>
            <LinearGradient colors={['transparent', '#C8922A40', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 1, flex: 1 }} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={fd.scroll}>
            {filters.map(f => (
              <TouchableOpacity key={f.key} style={[fd.item, current === f.key && { backgroundColor: f.color + '12', borderColor: f.color + '40' }]} onPress={() => { haptic(); onSelect(f.key); onClose(); }} activeOpacity={0.7}>
                <View style={[fd.itemDot, { backgroundColor: f.color }]} />
                <View style={fd.itemBody}>
                  <Text style={[fd.itemLabel, current === f.key && { color: f.color }]}>{f.label}</Text>
                  <Text style={fd.itemSub}>{f.sub}</Text>
                </View>
                <View style={[fd.itemCount, { backgroundColor: f.color + '18' }]}>
                  <Text style={[fd.itemCountText, { color: f.color }]}>{f.count}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
});

const fd = StyleSheet.create({
  overlay:      { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  sheet:        { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden', maxHeight: H * 0.75, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(200,146,42,0.15)' },
  sheetGrad:    { paddingBottom: IS_IOS ? 36 : 20 },
  handle:       { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.12)', alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  title:        { fontSize: 15, fontWeight: '700', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 },
  closeBtn:     { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  goldDiv:      { paddingHorizontal: 20, marginBottom: 8 },
  scroll:       { paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
  item:         { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' },
  itemDot:      { width: 10, height: 10, borderRadius: 5 },
  itemBody:     { flex: 1, gap: 2 },
  itemLabel:    { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.75)', letterSpacing: 0.3 },
  itemSub:      { fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: '400', fontStyle: 'italic' },
  itemCount:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  itemCountText:{ fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
});

// ─── Top Bar ──────────────────────────────────────────────────────────────────
const TopBar = memo(({ onBack, onFilter, onToggleList, isListMode, filter }: {
  onBack: () => void; onFilter: () => void; onToggleList: () => void;
  isListMode: boolean; filter: FilterMode;
}) => {
  const filterColor = filter === 'all' ? '#C8922A' : DIMENSION_COLORS[filter as NameDimension];
  return (
    <View style={tb.wrapper}>
      <View style={tb.statusBarArea} />
      <View style={tb.bar}>
        <TouchableOpacity onPress={onBack} style={tb.btn} activeOpacity={0.65} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft color="#FFFFFF" size={20} strokeWidth={2} />
        </TouchableOpacity>
        <View style={tb.center}>
          <Text style={tb.title} numberOfLines={1}>الأَسْمَاءُ الحُسْنَى</Text>
          <Text style={tb.subtitle}>Al-Asma Al-Husna</Text>
        </View>
        <View style={tb.rightBtns}>
          <TouchableOpacity onPress={onToggleList} style={[tb.btn, isListMode && tb.btnActive]} activeOpacity={0.65} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            {isListMode ? <Sparkles color="#FFFFFF" size={18} strokeWidth={1.8} /> : <BookOpen color="#FFFFFF" size={18} strokeWidth={1.8} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={onFilter} style={tb.btn} activeOpacity={0.65} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Filter color={filterColor} size={18} strokeWidth={1.8} />
            {filter !== 'all' && <View style={[tb.filterDot, { backgroundColor: filterColor }]} />}
          </TouchableOpacity>
        </View>
      </View>
      <LinearGradient colors={['transparent', '#C8922A', '#FDE68A', '#C8922A', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={tb.goldLine} />
    </View>
  );
});

const tb = StyleSheet.create({
  wrapper:      { backgroundColor: '#000000', zIndex: 10, elevation: 4, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.6, shadowRadius: 8 },
  statusBarArea:{ height: SAFE_TOP, backgroundColor: '#000000' },
  bar:          { height: NAVBAR_H, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 },
  goldLine:     { height: 1.5, opacity: 0.75 },
  btn:          { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.20)', backgroundColor: 'rgba(255,255,255,0.09)' },
  btnActive:    { borderColor: 'rgba(200,146,42,0.55)', backgroundColor: 'rgba(200,146,42,0.16)' },
  center:       { flex: 1, alignItems: 'center', gap: 2 },
  title:        { fontSize: 18, color: '#FFFFFF', fontWeight: '600', letterSpacing: 0.8, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  subtitle:     { fontSize: 9, color: '#C8922A', fontWeight: '800', letterSpacing: 3, textTransform: 'uppercase' },
  rightBtns:    { flexDirection: 'row', gap: 6 },
  filterDot:    { position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: 3.5, borderWidth: 1.5, borderColor: '#000000' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
type Mode = 'presence' | 'list';

export default function AsmaAllahScreen() {
  const { handleBack } = useContext(LayoutActionsContext);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode,         setMode]         = useState<Mode>('presence');
  const [filter,       setFilter]       = useState<FilterMode>('all');
  const [showOpening,  setShowOpening]  = useState(true);
  const [showFilter,   setShowFilter]   = useState(false);
  const [showDeep,     setShowDeep]     = useState(false);
  const [showShare,    setShowShare]    = useState(false);

  const filtered = useMemo(() => {
    if (filter === 'all') return asmaAllah;
    return asmaAllah.filter(n => n.dimension === filter);
  }, [filter]);

  const currentName = filtered[Math.min(currentIndex, filtered.length - 1)];
  const particles   = useParticles(currentName?.color ?? '#C8922A');

  const goNext = useCallback(() => {
    if (currentIndex < filtered.length - 1) { haptic(); setCurrentIndex(i => i + 1); }
  }, [currentIndex, filtered.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) { haptic(); setCurrentIndex(i => i - 1); }
  }, [currentIndex]);

  const handleFilterSelect = useCallback((f: FilterMode) => {
    setFilter(f); setCurrentIndex(0);
  }, []);

  const handleListItemPress = useCallback((index: number) => {
    setCurrentIndex(index); setMode('presence');
    setTimeout(() => setShowDeep(true), 150);
  }, []);

  // Close DeepPresence, open Share after transition
  const handleOpenShare = useCallback(() => {
    setShowDeep(false);
    setTimeout(() => setShowShare(true), 300);
  }, []);

  if (!currentName) return null;

  return (
    <View style={ms.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={false} />

      <TopBar
        onBack={handleBack}
        onFilter={() => setShowFilter(true)}
        onToggleList={() => setMode(m => m === 'presence' ? 'list' : 'presence')}
        isListMode={mode === 'list'}
        filter={filter}
      />

      {mode === 'presence' ? (
        <SacredNameDisplay
          name={currentName}
          onNext={goNext}
          onPrev={goPrev}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < filtered.length - 1}
          onEnterDeepMode={() => setShowDeep(true)}
          particles={particles}
        />
      ) : (
        <View style={ms.listBg}>
          <LinearGradient colors={['#000000', '#050508']} style={StyleSheet.absoluteFill} />
          <FlatList
            data={filtered}
            keyExtractor={n => String(n.id)}
            renderItem={({ item, index }) => (
              <NameListItem name={item} onPress={() => handleListItemPress(index)} />
            )}
            ListHeaderComponent={
              <View style={ms.listHeader}>
                <Text style={ms.listHeaderTitle}>
                  {filter === 'all' ? 'The 99 Names' : DIMENSION_LABELS[filter as NameDimension]}
                </Text>
                <Text style={ms.listHeaderSub}>{filtered.length} names</Text>
                <LinearGradient colors={['transparent', '#C8922A30', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={ms.listHeaderLine} />
              </View>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50, paddingTop: 8 }}
          />
        </View>
      )}

      <DeepPresenceModal
        visible={showDeep}
        name={currentName}
        onClose={() => setShowDeep(false)}
        onNext={goNext}
        onPrev={goPrev}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < filtered.length - 1}
        onShare={handleOpenShare}
      />

      {/* MeditativeShareModal — imported from ./MeditativeShareModal.tsx */}
      <MeditativeShareModal
        visible={showShare}
        name={currentName}
        onClose={() => setShowShare(false)}
      />

      <FilterDrawer
        visible={showFilter}
        current={filter}
        onSelect={handleFilterSelect}
        onClose={() => setShowFilter(false)}
      />

      {showOpening && (
        <OpeningSanctuary onEnter={() => { haptic('success'); setShowOpening(false); }} />
      )}
    </View>
  );
}

const ms = StyleSheet.create({
  root:            { flex: 1, backgroundColor: '#000000' },
  listBg:          { flex: 1 },
  listHeader:      { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 20, gap: 6 },
  listHeaderTitle: { fontSize: 20, fontWeight: '300', color: 'rgba(255,255,255,0.80)', letterSpacing: 1 },
  listHeaderSub:   { fontSize: 10, color: 'rgba(200,146,42,0.55)', fontWeight: '700', letterSpacing: 3, textTransform: 'uppercase' },
  listHeaderLine:  { height: 1, width: '60%', marginTop: 10 },
});