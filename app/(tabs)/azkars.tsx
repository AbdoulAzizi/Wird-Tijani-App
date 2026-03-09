// app/(tabs)/wird/index.tsx — Azkar screen, fully refactored
// Design: refined dark spiritual aesthetic — clear hierarchy, elegant restraint

import React, {
  useState, useEffect, useRef, useCallback, useMemo, memo,
} from 'react';
import {
  View, Text, TouchableOpacity, Animated, ScrollView,
  TextInput, Modal, StatusBar, PanResponder,
  Dimensions, Platform, KeyboardAvoidingView, Alert, StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  X, ChevronLeft, ChevronRight, Settings, CheckSquare, Square,
  Plus, Trash2, Sun, Moon, RotateCcw, Check, Sparkles,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AZKARS, MORNING_OPENING, EVENING_OPENING,
  type Azkar, type AzkarPeriod, type CustomAzkar,
  getCategoryLabel, CATEGORY_COLORS,
} from '../../data/azkarData';

import {
  PERIODS, W, GREEN, GREEN_BG, TYPE, SPACE, RADIUS, ARABIC_FONT,
} from '@/theme/azkar';

import {
  PulsingRings, OrnamentalDivider, PeriodBadge, EyebrowRow,
  GhostButton, BackButton, ProgressBar, NavDots, SessionCard,
  SectionHeader, VirtueCard, type PeriodKey,
} from '@/components/azkar/ui';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── Utils ─────────────────────────────────────────────────────────────────────
const haptic = (type: 'light' | 'success' | 'warning') => {
  if (Platform.OS !== 'ios') return;
  if (type === 'light')   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  if (type === 'warning') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

interface UserPrefs {
  enabledIds:    Set<string>;
  customCounts:  Record<string, number>;
  customAzkars:  CustomAzkar[];
}

// ─── SESSION SELECTOR ──────────────────────────────────────────────────────────

const SessionSelector = memo(({ onSelect, onBack }: {
  onSelect: (p: AzkarPeriod) => void;
  onBack?:  () => void;
}) => {
  const fade  = useRef(new Animated.Value(0)).current;
  const slideM = useRef(new Animated.Value(32)).current;
  const slideE = useRef(new Animated.Value(32)).current;

  const morningCount = AZKARS.filter(a => a.period.includes('morning')).length;
  const eveningCount = AZKARS.filter(a => a.period.includes('evening')).length;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,   { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideM, { toValue: 0, friction: 10, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      Animated.spring(slideE, { toValue: 0, friction: 10, useNativeDriver: true }).start();
    }, 90);
  }, []);

  return (
    <LinearGradient colors={['#070401', '#050302', '#070401']} style={ss.root}>
      <StatusBar barStyle="light-content" />
      <PulsingRings color={PERIODS.morning.accent} count={2} size={SW * 0.8} gap={SW * 0.55} />
      {onBack && <BackButton onPress={() => { haptic('light'); onBack(); }} />}

      <Animated.View style={[ss.content, { opacity: fade }]}>
        <EyebrowRow label="Daily Remembrance" color={W[18]} />
        <View style={ss.titleBlock}>
          <Text style={ss.titleLatin}>Al-Azkaar</Text>
          <Text style={[ss.titleArabic, { color: PERIODS.morning.accent, fontFamily: ARABIC_FONT }]}>
            الأذكار اليومية
          </Text>
          <Text style={ss.subtitle}>Choose your session</Text>
        </View>

        <Animated.View style={{ width: '100%', transform: [{ translateY: slideM }], marginBottom: SPACE.sm }}>
          <SessionCard period="morning" count={morningCount} onPress={() => { haptic('success'); onSelect('morning'); }} />
        </Animated.View>
        <Animated.View style={{ width: '100%', transform: [{ translateY: slideE }] }}>
          <SessionCard period="evening" count={eveningCount} onPress={() => { haptic('success'); onSelect('evening'); }} />
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
});

const ss = StyleSheet.create({
  root:       { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACE.xl },
  content:    { alignItems: 'center', width: '100%', gap: SPACE.sm },
  titleBlock: { alignItems: 'center', marginVertical: SPACE.xl, gap: 6 },
  titleLatin: { ...TYPE.displayXL, color: W[95] },
  titleArabic:{ fontSize: 19, fontWeight: '300' },
  subtitle:   { color: W[18], fontSize: 12, letterSpacing: 0.5, marginTop: 4 },
});

// ─── OPENING CEREMONY ──────────────────────────────────────────────────────────

const OpeningCeremony = memo(({ period, onEnter, onChangePeriod, onBack }: {
  period:          AzkarPeriod;
  onEnter:         () => void;
  onChangePeriod:  () => void;
  onBack:          () => void;
}) => {
  const fade    = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0.88)).current;
  const lineW   = useRef(new Animated.Value(0)).current;
  const btnFade = useRef(new Animated.Value(0)).current;

  const t    = PERIODS[period];
  const data = period === 'morning' ? MORNING_OPENING : EVENING_OPENING;
  const Icon = period === 'morning' ? Sun : Moon;

  useEffect(() => {
    [fade, scale, lineW, btnFade].forEach(v => v.stopAnimation());
    fade.setValue(0); scale.setValue(0.88); lineW.setValue(0); btnFade.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade,  { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 9,   useNativeDriver: true }),
      ]),
      Animated.timing(lineW,   { toValue: 1, duration: 560, useNativeDriver: false }),
      Animated.timing(btnFade, { toValue: 1, duration: 340, useNativeDriver: true }),
    ]).start();
  }, [period]);

  return (
    <LinearGradient colors={[...t.bg]} style={oc.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <PulsingRings color={t.accent} count={3} size={SW * 1.0} gap={SW * 0.40} />
      <BackButton onPress={() => { haptic('light'); onBack(); }} />

      <Animated.View style={[oc.content, { opacity: fade }]}>
        <PeriodBadge period={period} onPress={() => { haptic('light'); onChangePeriod(); }} />

        <Animated.View style={[oc.iconWrap, { transform: [{ scale }], borderColor: t.accent, backgroundColor: `${t.accent}14` }]}>
          <Icon size={32} color={t.accent} strokeWidth={1.6} />
        </Animated.View>

        <Text style={[oc.period, { color: t.accent }]}>{t.period}</Text>
        <Text style={oc.titleLatin}>{t.labelFull}</Text>
        <Text style={[oc.titleArabic, { color: t.accent, fontFamily: ARABIC_FONT }]}>{t.labelAr}</Text>

        <Animated.View style={[oc.line, {
          backgroundColor: t.accent,
          width: lineW.interpolate({ inputRange: [0, 1], outputRange: ['0%', '48%'] }),
        }]} />

        <View style={[oc.duaCard, { borderColor: `${t.accent}18`, backgroundColor: `${t.accent}06` }]}>
          <View style={[oc.duaTopLine, { backgroundColor: t.accent }]} />
          <Text style={[oc.duaArabic, { fontFamily: ARABIC_FONT }]}>{data.arabic}</Text>
          <OrnamentalDivider color={`${t.accent}40`} glyph="◆" marginH={32} marginV={SPACE.sm} />
          <Text style={[oc.duaTranslit, { color: `${t.accent}BB` }]}>{data.transliteration}</Text>
          <Text style={oc.duaTrans}>{data.translation}</Text>
        </View>

        <Animated.View style={{ opacity: btnFade, width: '100%' }}>
          <TouchableOpacity onPress={() => { haptic('success'); onEnter(); }} activeOpacity={0.78} style={oc.cta}>
            <LinearGradient
              colors={[t.accentDeep, t.accent, t.accentDeep]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={oc.ctaGradient}
            >
              <Icon size={15} color="#fff" style={{ marginRight: 10 }} />
              <Text style={oc.ctaText}>
                {period === 'morning' ? 'Begin Morning Adhkar' : 'Begin Evening Adhkar'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
});

const oc = StyleSheet.create({
  root:       { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content:    { alignItems: 'center', paddingHorizontal: SPACE.xl, width: '100%', gap: SPACE.sm },
  iconWrap:   { width: 68, height: 68, borderRadius: 34, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginTop: SPACE.lg },
  period:     { ...TYPE.labelCaps, marginTop: SPACE.sm },
  titleLatin: { ...TYPE.displayL, color: W[95], textAlign: 'center' },
  titleArabic:{ fontSize: 19, fontWeight: '300', textAlign: 'center' },
  line:       { height: 1, opacity: 0.5, alignSelf: 'center', marginVertical: SPACE.md },
  duaCard:    { width: '100%', borderWidth: 1, borderRadius: RADIUS.lg, padding: SPACE.md, paddingTop: SPACE.lg, overflow: 'hidden' },
  duaTopLine: { position: 'absolute', top: 0, left: 28, right: 28, height: 1.5 },
  duaArabic:  { color: W[95], fontSize: 15.5, lineHeight: 30, textAlign: 'center', fontWeight: '300', marginBottom: SPACE.xs },
  duaTranslit:{ ...TYPE.transliteration, textAlign: 'center' },
  duaTrans:   { color: W[35], fontSize: 12, lineHeight: 19, textAlign: 'center' },
  cta:        { width: '100%', borderRadius: RADIUS.pill, overflow: 'hidden', marginTop: SPACE.xs },
  ctaGradient:{ paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  ctaText:    { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 1.8 },
});

// ─── AZKAR CARD ────────────────────────────────────────────────────────────────

const AzkarCard = memo(({
  azkar, userCount, completedCount, onCount, onNext, onPrev,
  index, total, period, allAzkars,
}: {
  azkar:          Azkar | CustomAzkar;
  userCount:      number;
  completedCount: number;
  onCount:        () => void;
  onNext:         () => void;
  onPrev:         () => void;
  index:          number;
  total:          number;
  period:         AzkarPeriod;
  allAzkars:      (Azkar | CustomAzkar)[];
}) => {
  const cardFade  = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(18)).current;
  const tapScale  = useRef(new Animated.Value(1)).current;
  const tapGlow   = useRef(new Animated.Value(0)).current;
  const doneScale = useRef(new Animated.Value(1)).current;
  const [presenceIdx, setPresenceIdx] = useState<number | null>(null);

  const isCustom  = 'isCustom' in azkar;
  const color     = isCustom ? PERIODS.evening.accent : (azkar as Azkar).color;
  const glow      = isCustom ? PERIODS.evening.glow   : (azkar as Azkar).glow;
  const t         = PERIODS[period];
  const isDone    = completedCount >= userCount;
  const remaining = Math.max(0, userCount - completedCount);

  useEffect(() => {
    cardFade.setValue(0); cardSlide.setValue(16);
    Animated.parallel([
      Animated.timing(cardFade,  { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(cardSlide, { toValue: 0, friction: 11,  useNativeDriver: true }),
    ]).start();
  }, [azkar.id]);

  useEffect(() => {
    if (isDone) {
      haptic('success');
      Animated.sequence([
        Animated.spring(doneScale, { toValue: 1.04, friction: 5, useNativeDriver: true }),
        Animated.spring(doneScale, { toValue: 1,    friction: 5, useNativeDriver: true }),
      ]).start();
    }
  }, [isDone]);

  const handleCount = useCallback(() => {
    if (isDone) return;
    haptic('light');
    Animated.sequence([
      Animated.parallel([
        Animated.timing(tapScale, { toValue: 0.96, duration: 55, useNativeDriver: true }),
        Animated.timing(tapGlow,  { toValue: 1,    duration: 70, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(tapScale, { toValue: 1,    friction: 6,   useNativeDriver: true }),
        Animated.timing(tapGlow,  { toValue: 0,    duration: 360, useNativeDriver: true }),
      ]),
    ]).start();
    onCount();
  }, [isDone, onCount]);

  const pan = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 35 && Math.abs(g.dy) < 35,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50) { haptic('light'); onNext(); }
      if (g.dx > 50)  { haptic('light'); onPrev(); }
    },
  }), [onNext, onPrev]);

  return (
    <>
      {presenceIdx !== null && (
        <PresenceModal
          azkars={allAzkars}
          startIndex={presenceIdx}
          period={period}
          onClose={(fi) => {
            setPresenceIdx(null);
            const diff = fi - index;
            if (diff > 0)      for (let i = 0; i < diff;  i++) onNext();
            else if (diff < 0) for (let i = 0; i < -diff; i++) onPrev();
          }}
        />
      )}

      <Animated.View
        style={[az.root, { opacity: cardFade, transform: [{ translateY: cardSlide }] }]}
        {...pan.panHandlers}
      >
        {/* ── Text zone ── */}
        <ScrollView
          style={az.textZone}
          contentContainerStyle={az.textContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Meta row */}
          <View style={az.metaRow}>
            {!isCustom && (
              <View style={[az.categoryPill, {
                backgroundColor: `${CATEGORY_COLORS[(azkar as Azkar).category]}14`,
                borderColor:     `${CATEGORY_COLORS[(azkar as Azkar).category]}28`,
              }]}>
                <View style={[az.categoryDot, { backgroundColor: CATEGORY_COLORS[(azkar as Azkar).category] }]} />
                <Text style={[az.categoryLabel, { color: CATEGORY_COLORS[(azkar as Azkar).category] }]}>
                  {getCategoryLabel((azkar as Azkar).category).toUpperCase()}
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => { haptic('light'); setPresenceIdx(index); }}
              style={[az.presenceBtn, { borderColor: `${color}45`, backgroundColor: `${color}14` }]}
            >
              <Sparkles size={11} color={color} />
              <Text style={[az.presenceBtnText, { color }]}>PRESENCE</Text>
            </TouchableOpacity>
          </View>

          {/* Arabic */}
          <Text style={[az.arabic, { textShadowColor: glow, fontFamily: ARABIC_FONT }]}>
            {azkar.arabic}
          </Text>

          {/* Ornamental separator */}
          <OrnamentalDivider color={`${t.accent}28`} glyph="◆" marginH={SPACE.sm} marginV={SPACE.sm} />

          {/* Transliteration */}
          {!!azkar.transliteration && (
            <Text style={[az.translit, { color: `${t.accent}EE` }]}>
              {azkar.transliteration}
            </Text>
          )}

          {/* Translation */}
          <Text style={az.translation}>{azkar.translation}</Text>

          {/* Source */}
          {!isCustom && (azkar as Azkar).source && (
            <View style={az.sourceRow}>
              <View style={[az.sourceLine, { backgroundColor: `${t.accent}28` }]} />
              <Text style={az.source}>{(azkar as Azkar).source}</Text>
              <View style={[az.sourceLine, { backgroundColor: `${t.accent}28` }]} />
            </View>
          )}

          {/* Virtue */}
          {!isCustom && (azkar as Azkar).virtue && (
            <VirtueCard text={(azkar as Azkar).virtue!} accent={t.accent} />
          )}
        </ScrollView>

        {/* ── Zone separator pill ── */}
        <View style={az.zoneSep}>
          <View style={[az.zoneSepLine, { backgroundColor: `${t.accent}22` }]} />
          <View style={[az.zoneSepPill, { borderColor: `${t.accent}38`, backgroundColor: `${t.accent}10` }]}>
            <Text style={[az.zoneSepText, { color: `${t.accent}CC` }]}>
              {isDone ? '✓' : `${remaining}×`}
            </Text>
          </View>
        </View>

        {/* ── Counter zone ── */}
        <TouchableOpacity
          onPress={isDone ? onNext : handleCount}
          activeOpacity={0.88}
          style={az.counterZone}
        >
          <View style={[az.counterBg, { backgroundColor: isDone ? '#05120B' : '#080808' }]} />
          <View style={[az.counterTint, { backgroundColor: isDone ? GREEN : color }]} />
          <View style={[az.counterBorder, { borderColor: isDone ? `${GREEN}55` : `${color}55` }]} />
          <Animated.View style={[az.counterGlow, { backgroundColor: isDone ? GREEN : color, opacity: tapGlow }]} />

          {isDone ? (
            <Animated.View style={[az.doneState, { transform: [{ scale: doneScale }] }]}>
              <View style={az.doneCircle}>
                <Check size={32} color={GREEN} strokeWidth={2.5} />
              </View>
              <View style={az.doneTextGroup}>
                <Text style={az.doneLabel}>Completed</Text>
                <Text style={az.doneNext}>tap to continue  →</Text>
              </View>
            </Animated.View>
          ) : (
            <Animated.View style={[az.countState, { transform: [{ scale: tapScale }] }]}>
              <View style={[az.countCircle, { borderColor: `${color}70` }]}>
                <Text style={az.countNum}>{completedCount}</Text>
                <View style={[az.countSep, { backgroundColor: `${color}AA` }]} />
                <Text style={[az.countTarget, { color }]}>{userCount}</Text>
              </View>
              <View style={az.countInfo}>
                <Text style={[az.remainingBig, { color: W[95] }]}>{remaining}</Text>
                <Text style={[az.remainingLabel, { color: W[35] }]}>
                  {remaining === userCount ? 'tap to begin' : 'remaining'}
                </Text>
              </View>
            </Animated.View>
          )}
        </TouchableOpacity>

        {/* ── Nav bar ── */}
        <View style={az.navBar}>
          <GhostButton
            onPress={() => { haptic('light'); onPrev(); }}
            size={44}
            style={{ opacity: index === 0 ? 0.15 : 0.65 }}
          >
            <ChevronLeft size={21} color={W[95]} />
          </GhostButton>

          <NavDots total={allAzkars.length} current={index} accent={t.accent} />

          <GhostButton
            onPress={() => { haptic('light'); onNext(); }}
            size={44}
            style={{ borderColor: `${t.accent}35`, backgroundColor: `${t.accent}14` }}
          >
            <ChevronRight size={21} color={t.accent} />
          </GhostButton>
        </View>
      </Animated.View>
    </>
  );
});

const az = StyleSheet.create({
  root:            { flex: 1 },
  textZone:        { flex: 1 },
  textContent:     { paddingHorizontal: SPACE.lg, paddingTop: SPACE.sm, paddingBottom: SPACE.sm },

  metaRow:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACE.lg },
  categoryPill:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.sm, gap: 5, borderWidth: 1 },
  categoryDot:     { width: 5, height: 5, borderRadius: 2.5 },
  categoryLabel:   { ...TYPE.labelCaps, fontSize: 8, letterSpacing: 1 },
  presenceBtn:     { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 6, borderRadius: RADIUS.sm, borderWidth: 1.5 },
  presenceBtnText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },

  arabic:          { color: W[95], ...TYPE.arabicDisplay, textShadowRadius: 22, textShadowOffset: { width: 0, height: 0 }, textAlign: 'center', marginBottom: SPACE.xs },
  translit:        { ...TYPE.transliteration, textAlign: 'center', marginBottom: SPACE.sm, paddingHorizontal: SPACE.sm },
  translation:     { color: W[60], fontSize: 14, lineHeight: 25, textAlign: 'justify', marginBottom: SPACE.sm, paddingHorizontal: 2 },

  sourceRow:       { flexDirection: 'row', alignItems: 'center', gap: SPACE.sm, marginBottom: SPACE.md },
  sourceLine:      { flex: 1, height: 1 },
  source:          { color: W[18], fontSize: 10, textAlign: 'center', letterSpacing: 0.5 },

  // Zone separator
  zoneSep:         { marginHorizontal: SPACE.lg, marginBottom: SPACE.sm, alignItems: 'center' },
  zoneSepLine:     { width: '100%', height: 1 },
  zoneSepPill:     { position: 'absolute', top: -12, paddingHorizontal: 13, paddingVertical: 4, borderRadius: RADIUS.pill, borderWidth: 1, minWidth: 50, alignItems: 'center' },
  zoneSepText:     { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },

  // Counter zone
  counterZone:     { marginHorizontal: SPACE.lg, marginTop: SPACE.md, marginBottom: SPACE.sm, borderRadius: RADIUS.lg, minHeight: 130, paddingVertical: SPACE.lg, paddingHorizontal: SPACE.lg, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  counterBg:       { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: RADIUS.lg },
  counterTint:     { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: RADIUS.lg, opacity: 0.08 },
  counterBorder:   { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: RADIUS.lg, borderWidth: 1.5 },
  counterGlow:     { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: RADIUS.lg, opacity: 0 },

  doneState:       { flexDirection: 'row', alignItems: 'center', gap: SPACE.lg },
  doneCircle:      { width: 72, height: 72, borderRadius: 36, backgroundColor: GREEN_BG, borderWidth: 1.5, borderColor: GREEN, alignItems: 'center', justifyContent: 'center' },
  doneTextGroup:   { gap: 4 },
  doneLabel:       { fontSize: 16, fontWeight: '700', color: W[95], letterSpacing: 0.3 },
  doneNext:        { fontSize: 12, color: W[35] },

  countState:      { flexDirection: 'row', alignItems: 'center', gap: SPACE.xl },
  countCircle:     { width: 96, height: 96, borderRadius: 48, borderWidth: 1.5, backgroundColor: 'rgba(0,0,0,0.30)', alignItems: 'center', justifyContent: 'center' },
  countNum:        { fontSize: 38, fontWeight: '200', lineHeight: 42, color: W[95] },
  countSep:        { width: 30, height: 1, marginVertical: 3 },
  countTarget:     { fontSize: 14, fontWeight: '700' },
  countInfo:       { alignItems: 'flex-start', gap: 2 },
  remainingBig:    { fontSize: 42, fontWeight: '200', lineHeight: 46 },
  remainingLabel:  { fontSize: 11, fontWeight: '500', letterSpacing: 0.5 },

  navBar:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACE.lg, paddingBottom: Platform.OS === 'ios' ? 28 : SPACE.md, paddingTop: SPACE.sm },
});

// ─── PRESENCE CONTENT ──────────────────────────────────────────────────────────

const PresenceContent = memo(({ azkar, period, lineWidth }: {
  azkar:     Azkar | CustomAzkar;
  period:    AzkarPeriod;
  lineWidth: Animated.Value;
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const isCustom = 'isCustom' in azkar;
  const glow     = isCustom ? PERIODS.evening.glow : (azkar as Azkar).glow;
  const t        = PERIODS[period];

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: -10, duration: 4200, useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0,   duration: 4200, useNativeDriver: true }),
    ])).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={pc.content} showsVerticalScrollIndicator={false} bounces>
      <Animated.Text style={[pc.arabic, {
        textShadowColor: glow,
        transform: [{ translateY: floatAnim }],
        fontFamily: ARABIC_FONT,
      }]}>
        {azkar.arabic}
      </Animated.Text>

      <Animated.View style={[pc.line, {
        backgroundColor: t.accent,
        width: lineWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '48%'] }),
      }]} />

      {!!azkar.transliteration && (
        <Text style={[pc.translit, { color: `${t.accent}EE` }]}>{azkar.transliteration}</Text>
      )}

      <Text style={pc.translation}>{azkar.translation}</Text>

      {!isCustom && (azkar as Azkar).virtue && (
        <VirtueCard text={(azkar as Azkar).virtue!} accent={t.accent} />
      )}
    </ScrollView>
  );
});

const pc = StyleSheet.create({
  content:    { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACE.xl, paddingTop: 110, paddingBottom: 160 },
  arabic:     { color: W[95], fontSize: 30, fontWeight: '300', lineHeight: 56, textAlign: 'center', textShadowRadius: 28, textShadowOffset: { width: 0, height: 0 }, marginBottom: SPACE.xl },
  line:       { height: 1, opacity: 0.5, alignSelf: 'center', marginBottom: SPACE.xl },
  translit:   { ...TYPE.transliteration, fontSize: 15, textAlign: 'center', marginBottom: SPACE.sm },
  translation:{ color: W[60], fontSize: 15, lineHeight: 26, textAlign: 'center', marginBottom: SPACE.lg },
});

// ─── PRESENCE MODAL ────────────────────────────────────────────────────────────

const PresenceModal = memo(({ azkars, startIndex, period, onClose }: {
  azkars:      (Azkar | CustomAzkar)[];
  startIndex:  number;
  period:      AzkarPeriod;
  onClose:     (finalIndex: number) => void;
}) => {
  const [currentIdx, setCurrentIdx] = useState(startIndex);
  const azkar   = azkars[currentIdx];
  const insets  = useSafeAreaInsets();
  const t       = PERIODS[period];
  const isCustom = 'isCustom' in azkar;
  const color    = isCustom ? PERIODS.evening.accent : (azkar as Azkar).color;
  const isFirst  = currentIdx === 0;
  const isLast   = currentIdx === azkars.length - 1;

  const backdropFade  = useRef(new Animated.Value(0)).current;
  const uiFade        = useRef(new Animated.Value(0)).current;
  const lineWidth     = useRef(new Animated.Value(0)).current;
  const contentFade   = useRef(new Animated.Value(1)).current;
  const contentSlide  = useRef(new Animated.Value(0)).current;
  const glowBreath    = useRef(new Animated.Value(0.04)).current;

  const rings = useRef(
    Array.from({ length: 3 }, () => ({
      scale:   new Animated.Value(1),
      opacity: new Animated.Value(0),
    }))
  ).current;

  const particles = useRef(
    Array.from({ length: 8 }, () => ({
      x:       new Animated.Value(Math.random() * SW * 0.8 - SW * 0.4),
      y:       new Animated.Value(Math.random() * SH * 0.4 - SH * 0.2),
      opacity: new Animated.Value(0),
      size:    2 + Math.random() * 2.5,
    }))
  ).current;

  const startRingLoop = (ring: typeof rings[0], delay: number) => {
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(ring.opacity, { toValue: 0.10, duration: 260, useNativeDriver: true }),
        Animated.timing(ring.scale,   { toValue: 1,    duration: 0,   useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(ring.scale,   { toValue: 3.0,  duration: 3800, useNativeDriver: true }),
        Animated.timing(ring.opacity, { toValue: 0,    duration: 3800, useNativeDriver: true }),
      ]),
    ])).start();
  };

  const startParticle = (p: typeof particles[0], delay: number) => {
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(p.opacity, { toValue: 0.22 + Math.random() * 0.22, duration: 4000, useNativeDriver: true }),
        Animated.timing(p.x,       { toValue: (Math.random() - 0.5) * 160, duration: 6000, useNativeDriver: true }),
        Animated.timing(p.y,       { toValue: -50 - Math.random() * 70,    duration: 6000, useNativeDriver: true }),
      ]),
      Animated.timing(p.opacity,   { toValue: 0, duration: 1200, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(p.x, { toValue: Math.random() * SW * 0.8 - SW * 0.4, duration: 0, useNativeDriver: true }),
        Animated.timing(p.y, { toValue: Math.random() * SH * 0.4 - SH * 0.2, duration: 0, useNativeDriver: true }),
      ]),
    ])).start();
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(backdropFade, { toValue: 1, duration: 360, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(uiFade,    { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(lineWidth, { toValue: 1, duration: 460, useNativeDriver: false }),
      ]),
    ]).start();
    Animated.loop(Animated.sequence([
      Animated.timing(glowBreath, { toValue: 0.12, duration: 4800, useNativeDriver: true }),
      Animated.timing(glowBreath, { toValue: 0.04, duration: 4800, useNativeDriver: true }),
    ])).start();
    rings.forEach((r, i) => startRingLoop(r, i * 1260));
    particles.forEach((p, i) => startParticle(p, i * 280));
  }, []);

  const navigateTo = useCallback((newIdx: number, dir: 'next' | 'prev') => {
    if (newIdx < 0 || newIdx >= azkars.length) return;
    haptic('light');
    Animated.parallel([
      Animated.timing(contentFade,  { toValue: 0, duration: 130, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: dir === 'next' ? -20 : 20, duration: 130, useNativeDriver: true }),
    ]).start(() => {
      contentSlide.setValue(dir === 'next' ? 20 : -20);
      lineWidth.setValue(0);
      setCurrentIdx(newIdx);
      Animated.parallel([
        Animated.timing(contentFade,  { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(contentSlide, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(lineWidth,    { toValue: 1, duration: 420, useNativeDriver: false }),
      ]).start();
    });
  }, [azkars.length]);

  const pan = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 40 && Math.abs(g.dy) < 40,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50) navigateTo(currentIdx + 1, 'next');
      if (g.dx > 50)  navigateTo(currentIdx - 1, 'prev');
    },
  }), [currentIdx, navigateTo]);

  return (
    <Modal visible animationType="none" transparent statusBarTranslucent>
      <Animated.View style={{ flex: 1, opacity: backdropFade }} {...pan.panHandlers}>
        <View style={pm.backdrop} />
        <View pointerEvents="none" style={[pm.backdropTint, { backgroundColor: color }]} />

        {particles.map((p, i) => (
          <Animated.View key={i} pointerEvents="none" style={[pm.particle, {
            width: p.size, height: p.size, borderRadius: p.size / 2,
            backgroundColor: color, opacity: p.opacity,
            transform: [{ translateX: p.x }, { translateY: p.y }],
          }]} />
        ))}

        {rings.map((r, i) => (
          <Animated.View key={i} pointerEvents="none" style={[pm.ring, {
            borderColor: color, opacity: r.opacity, transform: [{ scale: r.scale }],
          }]} />
        ))}

        <Animated.View pointerEvents="none" style={[pm.glowCore, { backgroundColor: color, opacity: glowBreath }]} />

        {/* Header */}
        <Animated.View style={[pm.header, { opacity: uiFade, paddingTop: insets.top + SPACE.md }]}>
          <View style={pm.headerLeft}>
            <Text style={[pm.headerLabel, { color: t.accent }]}>✦  Presence Station  ✦</Text>
          </View>
          <View style={[pm.headerCounter, { borderColor: W[10], backgroundColor: W['06'] }]}>
            <Text style={[pm.headerIdx, { color: t.accent }]}>{currentIdx + 1}</Text>
            <Text style={pm.headerSep}> / </Text>
            <Text style={pm.headerTotal}>{azkars.length}</Text>
          </View>
          <View style={pm.headerRight}>
            <GhostButton onPress={() => { haptic('light'); onClose(currentIdx); }} size={34}>
              <X size={16} color={W[60]} />
            </GhostButton>
          </View>
        </Animated.View>

        {/* Content */}
        <Animated.View style={[pm.contentWrap, { opacity: contentFade, transform: [{ translateX: contentSlide }] }]}>
          <PresenceContent azkar={azkar} period={period} lineWidth={lineWidth} />
        </Animated.View>

        {/* Bottom nav */}
        <Animated.View style={[pm.navBar, { opacity: uiFade, paddingBottom: Math.max(insets.bottom, SPACE.md) }]}>
          <GhostButton
            onPress={() => navigateTo(currentIdx - 1, 'prev')}
            size={46}
            style={{ opacity: isFirst ? 0.18 : 0.72 }}
          >
            <ChevronLeft size={21} color={W[95]} />
          </GhostButton>

          <NavDots
            total={azkars.length}
            current={currentIdx}
            accent={t.accent}
            onPress={(i) => navigateTo(i, i > currentIdx ? 'next' : 'prev')}
          />

          {isLast ? (
            <TouchableOpacity
              onPress={() => { haptic('success'); onClose(currentIdx); }}
              style={[pm.doneBtn, { borderColor: `${GREEN}40`, backgroundColor: `${GREEN}14` }]}
            >
              <Check size={14} color={GREEN} />
              <Text style={[pm.doneBtnText, { color: GREEN }]}>Done</Text>
            </TouchableOpacity>
          ) : (
            <GhostButton
              onPress={() => navigateTo(currentIdx + 1, 'next')}
              size={46}
              style={{ borderColor: `${t.accent}35`, backgroundColor: `${t.accent}14` }}
            >
              <ChevronRight size={21} color={t.accent} />
            </GhostButton>
          )}
        </Animated.View>

        <Animated.View pointerEvents="none" style={[pm.breathe, { opacity: glowBreath }]}>
          <Text style={pm.breatheText}>breathe</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
});

const pm = StyleSheet.create({
  backdrop:      { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000' },
  backdropTint:  { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04 },
  particle:      { position: 'absolute', top: SH * 0.5, left: SW * 0.5 },
  ring:          { position: 'absolute', top: SH * 0.5 - SW * 0.5, left: 0, width: SW, height: SW, borderRadius: SW / 2, borderWidth: 1.5 },
  glowCore:      { position: 'absolute', top: SH * 0.5 - SW * 0.6, left: -SW * 0.1, width: SW * 1.2, height: SW * 1.2, borderRadius: SW * 0.6 },
  header:        { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACE.lg, paddingBottom: SPACE.sm, zIndex: 10 },
  headerLeft:    { flex: 1 },
  headerLabel:   { ...TYPE.labelCaps, fontSize: 8, letterSpacing: 3 },
  headerCounter: { flexDirection: 'row', alignItems: 'center', borderRadius: RADIUS.sm, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1 },
  headerRight:   { flex: 1, alignItems: 'flex-end' },
  headerIdx:     { fontSize: 13, fontWeight: '800' },
  headerSep:     { color: W[18], fontSize: 12 },
  headerTotal:   { color: W[35], fontSize: 12 },
  contentWrap:   { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  navBar:        { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingTop: SPACE.sm, paddingHorizontal: SPACE.lg, backgroundColor: 'rgba(0,0,0,0.80)', borderTopWidth: 1, borderTopColor: W['06'], gap: SPACE.sm, zIndex: 10, minHeight: 80 },
  doneBtn:       { paddingHorizontal: 18, height: 46, borderRadius: 23, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1 },
  doneBtnText:   { fontSize: 13, fontWeight: '700' },
  breathe:       { position: 'absolute', bottom: 96, left: 0, right: 0, alignItems: 'center' },
  breatheText:   { color: W[18], fontSize: 10, letterSpacing: 4 },
});

// ─── CUSTOMIZATION PAGE ────────────────────────────────────────────────────────

const CustomizationPage = memo(({ prefs, onUpdate, onClose, period }: {
  prefs:    UserPrefs;
  onUpdate: (p: UserPrefs) => void;
  onClose:  () => void;
  period:   AzkarPeriod;
}) => {
  const [localPrefs, setLocalPrefs] = useState<UserPrefs>({
    enabledIds:   new Set(prefs.enabledIds),
    customCounts: { ...prefs.customCounts },
    customAzkars: [...prefs.customAzkars],
  });
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [showAdd, setShowAdd]           = useState(false);
  const [newAzkar, setNewAzkar]         = useState({ arabic: '', transliteration: '', translation: '', count: '3' });

  const t        = PERIODS[period];
  const filtered = AZKARS.filter(a => a.period.includes(period));

  const toggle = (id: string) => {
    const s = new Set(localPrefs.enabledIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setLocalPrefs({ ...localPrefs, enabledIds: s });
    haptic('light');
  };

  const commitEdit = (id: string) => {
    const n = parseInt(editingValue, 10);
    if (!isNaN(n) && n >= 1)
      setLocalPrefs(p => ({ ...p, customCounts: { ...p.customCounts, [id]: n } }));
    setEditingId(null);
  };

  const addCustom = () => {
    if (!newAzkar.arabic.trim() || !newAzkar.translation.trim()) {
      Alert.alert('Required fields', 'Arabic text and translation are required.');
      return;
    }
    const id = `custom_${Date.now()}`;
    const c: CustomAzkar = {
      id, arabic: newAzkar.arabic.trim(), transliteration: newAzkar.transliteration.trim(),
      translation: newAzkar.translation.trim(), count: parseInt(newAzkar.count, 10) || 3,
      period: [period], isCustom: true,
    };
    setLocalPrefs(p => ({ ...p, customAzkars: [...p.customAzkars, c], enabledIds: new Set([...p.enabledIds, id]) }));
    setNewAzkar({ arabic: '', transliteration: '', translation: '', count: '3' });
    setShowAdd(false);
    haptic('success');
  };

  const deleteCustom = (id: string) => {
    const s = new Set(localPrefs.enabledIds); s.delete(id);
    setLocalPrefs(p => ({ ...p, customAzkars: p.customAzkars.filter(c => c.id !== id), enabledIds: s }));
    haptic('warning');
  };

  const save = () => { onUpdate(localPrefs); haptic('success'); onClose(); };
  const customsForPeriod = localPrefs.customAzkars.filter(c => c.period.includes(period));

  type FieldKey = 'arabic' | 'transliteration' | 'translation';
  const fields: { label: string; key: FieldKey; placeholder: string; multiline: boolean; rtl?: boolean; italic?: boolean }[] = [
    { label: 'Arabic text *',   key: 'arabic',          placeholder: 'Enter Arabic text...',  multiline: true,  rtl: true  },
    { label: 'Transliteration', key: 'transliteration', placeholder: 'Transliteration...',     multiline: false, italic: true },
    { label: 'Translation *',   key: 'translation',     placeholder: 'Meaning in English...', multiline: true              },
  ];

  return (
    <View style={cp.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0C0C16', '#060608']} style={cp.header}>
        <GhostButton onPress={onClose} size={34}><X size={18} color={W[35]} /></GhostButton>
        <View style={cp.headerCenter}>
          <Text style={cp.headerTitle}>Customize</Text>
          <Text style={[cp.headerSub, { color: t.accent }]}>
            {period === 'morning' ? 'Morning Adhkar' : 'Evening Adhkar'}
          </Text>
        </View>
        <TouchableOpacity onPress={save} style={[cp.saveBtn, { borderColor: t.accentBorder, backgroundColor: t.accentSoft }]}>
          <Text style={[cp.saveBtnText, { color: t.accent }]}>Save</Text>
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={cp.scroll} showsVerticalScrollIndicator={false}>

          <View style={cp.bulkRow}>
            <TouchableOpacity
              onPress={() => setLocalPrefs(p => ({ ...p, enabledIds: new Set([...filtered.map(a => a.id), ...customsForPeriod.map(c => c.id)]) }))}
              style={[cp.bulkBtn, { borderColor: t.accentBorder, backgroundColor: t.accentSoft }]}
            >
              <Text style={[cp.bulkBtnText, { color: t.accent }]}>Select all</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLocalPrefs(p => ({ ...p, enabledIds: new Set() }))}
              style={[cp.bulkBtn, { borderColor: W[10] }]}
            >
              <Text style={[cp.bulkBtnText, { color: W[35] }]}>Deselect all</Text>
            </TouchableOpacity>
          </View>

          <SectionHeader label={`Standard Adhkar  (${filtered.length})`} color={t.accent} />

          {filtered.map(azkar => {
            const enabled = localPrefs.enabledIds.has(azkar.id);
            const count   = localPrefs.customCounts[azkar.id] ?? azkar.defaultCount;
            const editing = editingId === azkar.id;
            return (
              <View key={azkar.id} style={[cp.row, {
                borderColor:     enabled ? `${azkar.color}28` : W['06'],
                backgroundColor: enabled ? `${azkar.color}06` : W['03'],
              }]}>
                <View style={[cp.rowAccent, { backgroundColor: enabled ? azkar.color : 'transparent' }]} />
                <TouchableOpacity onPress={() => toggle(azkar.id)} style={cp.rowCheck}>
                  {enabled
                    ? <CheckSquare size={18} color={azkar.color} strokeWidth={2} />
                    : <Square      size={18} color={W[18]}       strokeWidth={1.5} />}
                </TouchableOpacity>
                <View style={cp.rowText}>
                  <Text style={[cp.rowArabic, { fontFamily: ARABIC_FONT }]} numberOfLines={2}>{azkar.arabic}</Text>
                  <Text style={cp.rowTranslit} numberOfLines={1}>{azkar.transliteration}</Text>
                  <View style={cp.rowMeta}>
                    <View style={[cp.rowDot, { backgroundColor: CATEGORY_COLORS[azkar.category] }]} />
                    <Text style={[cp.rowCategory, { color: CATEGORY_COLORS[azkar.category] }]}>
                      {getCategoryLabel(azkar.category)}
                    </Text>
                  </View>
                </View>
                {editing ? (
                  <TextInput
                    value={editingValue}
                    onChangeText={setEditingValue}
                    keyboardType="number-pad"
                    style={[cp.countInput, { borderColor: `${azkar.color}55`, color: W[95] }]}
                    autoFocus
                    onBlur={() => commitEdit(azkar.id)}
                    onSubmitEditing={() => commitEdit(azkar.id)}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => { setEditingId(azkar.id); setEditingValue(String(count)); }}
                    style={[cp.countBtn, { borderColor: `${azkar.color}38`, backgroundColor: `${azkar.color}10` }]}
                  >
                    <Text style={[cp.countBtnNum, { color: azkar.color }]}>{count}</Text>
                    <Text style={cp.countBtnX}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          {customsForPeriod.length > 0 && (
            <View style={{ marginTop: SPACE.xl }}>
              <SectionHeader label={`Custom Dhikr  (${customsForPeriod.length})`} color={PERIODS.evening.accent} />
              {customsForPeriod.map(c => {
                const enabled = localPrefs.enabledIds.has(c.id);
                const ea      = PERIODS.evening.accent;
                return (
                  <View key={c.id} style={[cp.row, {
                    borderColor:     enabled ? `${ea}35` : W['06'],
                    backgroundColor: enabled ? `${ea}08` : W['03'],
                  }]}>
                    <View style={[cp.rowAccent, { backgroundColor: enabled ? ea : 'transparent' }]} />
                    <TouchableOpacity onPress={() => toggle(c.id)} style={cp.rowCheck}>
                      {enabled
                        ? <CheckSquare size={18} color={ea} strokeWidth={2} />
                        : <Square      size={18} color={W[18]} strokeWidth={1.5} />}
                    </TouchableOpacity>
                    <View style={cp.rowText}>
                      <Text style={[cp.rowArabic, { fontFamily: ARABIC_FONT }]} numberOfLines={2}>{c.arabic}</Text>
                      <Text style={cp.rowTranslit} numberOfLines={1}>{c.translation}</Text>
                    </View>
                    <Text style={[cp.countBtnNum, { color: ea, marginRight: SPACE.sm }]}>{c.count}×</Text>
                    <TouchableOpacity onPress={() => deleteCustom(c.id)} style={cp.deleteBtn}>
                      <Trash2 size={14} color="#C45A5A" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          <View style={{ marginTop: SPACE.xl }}>
            {!showAdd ? (
              <TouchableOpacity onPress={() => setShowAdd(true)} style={[cp.addBtn, { borderColor: `${t.accent}28` }]}>
                <Plus size={15} color={t.accent} />
                <Text style={[cp.addBtnText, { color: t.accent }]}>Add a custom dhikr</Text>
              </TouchableOpacity>
            ) : (
              <View style={[cp.addForm, { borderColor: `${t.accent}20`, backgroundColor: `${t.accent}05` }]}>
                <Text style={cp.addFormTitle}>New dhikr</Text>
                {fields.map(f => (
                  <View key={f.key}>
                    <Text style={cp.fieldLabel}>{f.label}</Text>
                    <TextInput
                      value={newAzkar[f.key]}
                      onChangeText={v => setNewAzkar(p => ({ ...p, [f.key]: v }))}
                      multiline={f.multiline}
                      placeholder={f.placeholder}
                      placeholderTextColor={W[18]}
                      style={[
                        cp.fieldInput,
                        f.rtl    && { textAlign: 'right', fontSize: 18, fontFamily: ARABIC_FONT },
                        f.italic && { fontStyle: 'italic' },
                      ]}
                    />
                  </View>
                ))}
                <Text style={cp.fieldLabel}>Repetitions</Text>
                <TextInput
                  value={newAzkar.count}
                  onChangeText={v => setNewAzkar(p => ({ ...p, count: v }))}
                  keyboardType="number-pad"
                  style={[cp.fieldInput, { width: 80, textAlign: 'center', fontSize: 20, fontWeight: '700', marginBottom: SPACE.lg }]}
                />
                <View style={cp.addFormBtns}>
                  <TouchableOpacity onPress={() => setShowAdd(false)} style={cp.cancelBtn}>
                    <Text style={cp.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={addCustom} style={[cp.confirmBtn, { backgroundColor: `${t.accent}18`, borderColor: `${t.accent}38` }]}>
                    <Text style={[cp.confirmBtnText, { color: t.accent }]}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
});

const cp = StyleSheet.create({
  root:         { flex: 1, backgroundColor: '#060608' },
  header:       { paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingBottom: SPACE.md, paddingHorizontal: SPACE.lg, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: W['06'] },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle:  { color: W[95], fontSize: 15, fontWeight: '700' },
  headerSub:    { fontSize: 11, marginTop: 2, fontWeight: '600' },
  saveBtn:      { paddingHorizontal: 13, paddingVertical: 7, borderRadius: RADIUS.pill, borderWidth: 1 },
  saveBtnText:  { fontSize: 13, fontWeight: '700' },
  scroll:       { padding: SPACE.lg, paddingBottom: 60 },
  bulkRow:      { flexDirection: 'row', gap: SPACE.sm, marginBottom: SPACE.lg },
  bulkBtn:      { flex: 1, paddingVertical: 10, borderRadius: RADIUS.pill, borderWidth: 1, alignItems: 'center' },
  bulkBtnText:  { fontSize: 12, fontWeight: '700' },

  row:          { flexDirection: 'row', alignItems: 'center', marginBottom: SPACE.sm, borderRadius: RADIUS.md, overflow: 'hidden', borderWidth: 1 },
  rowAccent:    { width: 3, alignSelf: 'stretch' },
  rowCheck:     { paddingHorizontal: SPACE.sm, paddingVertical: SPACE.md },
  rowText:      { flex: 1, paddingVertical: SPACE.sm, paddingRight: SPACE.sm, gap: 3 },
  rowArabic:    { color: W[95], fontSize: 15, fontWeight: '300', lineHeight: 24 },
  rowTranslit:  { color: W[18], fontSize: 11 },
  rowMeta:      { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  rowDot:       { width: 5, height: 5, borderRadius: 2.5 },
  rowCategory:  { fontSize: 9, fontWeight: '700', letterSpacing: 0.4 },
  countBtn:     { alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, marginRight: SPACE.sm },
  countBtnNum:  { fontSize: 17, fontWeight: '700' },
  countBtnX:    { color: W[18], fontSize: 9 },
  countInput:   { fontSize: 17, fontWeight: '700', backgroundColor: W['06'], borderRadius: RADIUS.sm, padding: SPACE.sm, width: 54, textAlign: 'center', borderWidth: 1.5, marginRight: SPACE.sm },
  deleteBtn:    { padding: SPACE.sm },

  addBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACE.sm, paddingVertical: SPACE.md, borderRadius: RADIUS.md, borderWidth: 1.5, borderStyle: 'dashed', backgroundColor: W['03'] },
  addBtnText:   { fontSize: 14, fontWeight: '700' },
  addForm:      { borderRadius: RADIUS.lg, borderWidth: 1, padding: SPACE.md },
  addFormTitle: { color: W[95], fontSize: 15, fontWeight: '700', marginBottom: SPACE.md },
  fieldLabel:   { color: W[35], fontSize: 11, marginBottom: 5 },
  fieldInput:   { color: W[95], fontSize: 14, lineHeight: 22, borderWidth: 1, borderColor: W[10], borderRadius: RADIUS.sm, padding: 11, marginBottom: SPACE.sm, backgroundColor: W['06'] },
  addFormBtns:  { flexDirection: 'row', gap: SPACE.sm, marginTop: 4 },
  cancelBtn:    { flex: 1, paddingVertical: 13, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: W[10], alignItems: 'center' },
  cancelBtnText:{ color: W[35], fontSize: 13 },
  confirmBtn:   { flex: 2, paddingVertical: 13, borderRadius: RADIUS.pill, borderWidth: 1, alignItems: 'center' },
  confirmBtnText:{ fontSize: 13, fontWeight: '700' },
});

// ─── COMPLETION SCREEN ─────────────────────────────────────────────────────────

const CompletionScreen = memo(({ period, count, total, onRestart, onChangeSession, onBack }: {
  period:          AzkarPeriod;
  count:           number;
  total:           number;
  onRestart:       () => void;
  onChangeSession: () => void;
  onBack:          () => void;
}) => {
  const ring1   = useRef(new Animated.Value(0)).current;
  const ring2   = useRef(new Animated.Value(0)).current;
  const fade    = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0.78)).current;
  const btnFade = useRef(new Animated.Value(0)).current;

  const t        = PERIODS[period];
  const opposite = period === 'morning' ? 'evening' : 'morning';
  const pct      = total > 0 ? Math.round((count / total) * 100) : 0;
  const OppIcon  = period === 'morning' ? Moon : Sun;

  useEffect(() => {
    haptic('success');
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 7, useNativeDriver: true }),
        Animated.timing(fade,  { toValue: 1, duration: 460, useNativeDriver: true }),
      ]),
      Animated.timing(btnFade, { toValue: 1, duration: 360, useNativeDriver: true }),
    ]).start();
    const pulse = (a: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.timing(a, { toValue: 0.35, duration: 2800, delay, useNativeDriver: true }),
        Animated.timing(a, { toValue: 0.08, duration: 2800, useNativeDriver: true }),
      ])).start();
    pulse(ring1, 0); pulse(ring2, 1400);
  }, []);

  return (
    <LinearGradient colors={[...t.bg]} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <PulsingRings color={GREEN} count={2} size={SW * 0.75} gap={SW * 0.55} />

      <View style={cs.root}>
        <Animated.View style={[cs.inner, { opacity: fade, transform: [{ scale }] }]}>
          <View style={[cs.checkCircle, { borderColor: GREEN, backgroundColor: GREEN_BG }]}>
            <Check size={38} color={GREEN} strokeWidth={2} />
          </View>

          <Text style={[cs.alhamdulillah, { color: t.accent, fontFamily: ARABIC_FONT }]}>الحمد لله</Text>
          <Text style={cs.title}>
            {period === 'morning' ? 'Morning Adhkar\ncompleted' : 'Evening Adhkar\ncompleted'}
          </Text>
          <Text style={cs.subtitle}>May Allah accept your dhikr.</Text>

          <View style={cs.statsRow}>
            {([
              { n: String(count), l: 'completed' },
              { n: `${pct}%`,     l: 'success'   },
              { n: String(total), l: 'total'      },
            ] as const).map((s, idx) => (
              <View key={s.l} style={[cs.statCell, idx < 2 && cs.statCellBorder]}>
                <Text style={[cs.statNum, { color: t.accent }]}>{s.n}</Text>
                <Text style={cs.statLabel}>{s.l.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={[cs.buttons, { opacity: btnFade }]}>
          <TouchableOpacity onPress={onRestart} style={[cs.btn, cs.btnPrimary, { borderColor: t.accentBorder, backgroundColor: t.accentSoft }]}>
            <RotateCcw size={14} color={t.accent} />
            <Text style={[cs.btnText, { color: t.accent }]}>Restart</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onChangeSession} style={[cs.btn, { borderColor: W[10], backgroundColor: W['06'] }]}>
            <OppIcon size={14} color={PERIODS[opposite].accent} />
            <Text style={[cs.btnText, { color: W[35] }]}>
              {period === 'morning' ? 'Evening Adhkar' : 'Morning Adhkar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onBack} style={cs.backLink}>
            <Text style={cs.backLinkText}>Back to home</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
});

const cs = StyleSheet.create({
  root:         { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACE.xl },
  inner:        { alignItems: 'center', width: '100%' },
  checkCircle:  { width: 88, height: 88, borderRadius: 44, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: SPACE.lg },
  alhamdulillah:{ fontSize: 10, fontWeight: '800', letterSpacing: 6, marginBottom: SPACE.sm },
  title:        { color: W[95], fontSize: 24, fontWeight: '200', textAlign: 'center', marginBottom: SPACE.sm, lineHeight: 36 },
  subtitle:     { color: W[35], fontSize: 13, textAlign: 'center', lineHeight: 22, marginBottom: SPACE.xl },
  statsRow:     { flexDirection: 'row', borderWidth: 1, borderColor: W['06'], borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACE.xxl },
  statCell:     { alignItems: 'center', gap: 4, paddingVertical: SPACE.md, paddingHorizontal: SPACE.lg, backgroundColor: W['03'] },
  statCellBorder:{ borderRightWidth: 1, borderRightColor: W['06'] },
  statNum:      { fontSize: 22, fontWeight: '700' },
  statLabel:    { color: W[18], fontSize: 9, letterSpacing: 1.5 },
  buttons:      { width: '100%', gap: SPACE.sm },
  btn:          { paddingVertical: 15, borderRadius: RADIUS.pill, borderWidth: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: SPACE.sm },
  btnPrimary:   {},
  btnText:      { fontSize: 14, fontWeight: '600' },
  backLink:     { paddingVertical: SPACE.sm, alignItems: 'center' },
  backLinkText: { color: W[18], fontSize: 13 },
});

// ─── MAIN SCREEN ───────────────────────────────────────────────────────────────

export default function AzkarsScreen() {
  const router = useRouter();
  const { period: periodParam } = useLocalSearchParams<{ period?: AzkarPeriod }>();
  const routePeriod: AzkarPeriod | undefined =
    periodParam === 'morning' || periodParam === 'evening' ? periodParam : undefined;

  const [selectedPeriod, setSelectedPeriod] = useState<AzkarPeriod>(routePeriod ?? 'morning');
  const t         = PERIODS[selectedPeriod];
  const isMorning = selectedPeriod === 'morning';

  const [phase, setPhase] = useState<'selector' | 'opening' | 'session' | 'complete'>(
    () => (periodParam === 'morning' || periodParam === 'evening' ? 'opening' : 'selector')
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const isMounted = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (!isMounted.current) { isMounted.current = true; return; }
      if (periodParam === 'morning' || periodParam === 'evening') {
        setSelectedPeriod(periodParam);
        setPhase('opening');
        setCurrentIndex(0);
      }
    }, [periodParam])
  );

  const allStandardIds = useMemo(
    () => new Set(AZKARS.filter(a => a.period.includes(selectedPeriod)).map(a => a.id)),
    [selectedPeriod]
  );

  const [prefs, setPrefs] = useState<UserPrefs>({
    enabledIds: new Set(allStandardIds),
    customCounts: {},
    customAzkars: [],
  });
  const [counts, setCounts]               = useState<Record<string, number>>({});
  const [showCustomize, setShowCustomize] = useState(false);

  const activeAzkars = useMemo(() => {
    const standard = AZKARS.filter(a => a.period.includes(selectedPeriod) && prefs.enabledIds.has(a.id));
    const custom   = prefs.customAzkars.filter(c => c.period.includes(selectedPeriod) && prefs.enabledIds.has(c.id));
    return [...standard, ...custom];
  }, [selectedPeriod, prefs]);

  const resetCounts = useCallback(() => {
    const init: Record<string, number> = {};
    activeAzkars.forEach(a => { init[a.id] = 0; });
    setCounts(init);
  }, [activeAzkars]);

  useEffect(() => { resetCounts(); }, [activeAzkars]);

  const currentAzkar   = activeAzkars[currentIndex] ?? null;
  const userCount      = currentAzkar
    ? (prefs.customCounts[currentAzkar.id] ?? ('isCustom' in currentAzkar
        ? (currentAzkar as CustomAzkar).count
        : (currentAzkar as Azkar).defaultCount))
    : 1;
  const completedCount = currentAzkar ? (counts[currentAzkar.id] ?? 0) : 0;

  const handleCount = useCallback(() => {
    if (!currentAzkar) return;
    setCounts(p => ({ ...p, [currentAzkar.id]: (p[currentAzkar.id] ?? 0) + 1 }));
  }, [currentAzkar]);

  const handleNext = useCallback(() => {
    if (currentIndex < activeAzkars.length - 1) setCurrentIndex(i => i + 1);
    else setPhase('complete');
  }, [currentIndex, activeAzkars.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    resetCounts(); setCurrentIndex(0); setPhase('opening');
  }, [resetCounts]);

  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset session',
      'Reset all counters and return to the first dhikr?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => { haptic('warning'); resetCounts(); setCurrentIndex(0); } },
      ]
    );
  }, [resetCounts]);

  const completedInSession = useMemo(() =>
    activeAzkars.filter(a => {
      const target = prefs.customCounts[a.id] ?? ('isCustom' in a
        ? (a as CustomAzkar).count
        : (a as Azkar).defaultCount);
      return (counts[a.id] ?? 0) >= target;
    }).length,
  [activeAzkars, counts, prefs.customCounts]);

  // ── Phases ──
  if (phase === 'selector') {
    return <SessionSelector onSelect={(p) => { setSelectedPeriod(p); setPhase('opening'); }} onBack={() => router.back()} />;
  }

  if (showCustomize) {
    return (
      <Modal visible animationType="slide" presentationStyle="fullScreen">
        <CustomizationPage
          prefs={prefs}
          period={selectedPeriod}
          onUpdate={(p) => { setPrefs(p); resetCounts(); setCurrentIndex(0); }}
          onClose={() => setShowCustomize(false)}
        />
      </Modal>
    );
  }

  if (phase === 'opening') {
    return (
      <OpeningCeremony
        period={selectedPeriod}
        onEnter={() => setPhase('session')}
        onChangePeriod={() => setPhase('selector')}
        onBack={() => setPhase('selector')}
      />
    );
  }

  if (phase === 'complete') {
    return (
      <CompletionScreen
        period={selectedPeriod}
        count={completedInSession}
        total={activeAzkars.length}
        onRestart={handleRestart}
        onChangeSession={() => setPhase('selector')}
        onBack={() => router.back()}
      />
    );
  }

  // ── Session ──
  return (
    <LinearGradient colors={[...t.bg]} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={ms.header}>
        <GhostButton onPress={() => setPhase('opening')} size={38}>
          <ChevronLeft size={20} color={W[35]} />
        </GhostButton>

        <TouchableOpacity
          onPress={() => { haptic('light'); setPhase('selector'); }}
          style={[ms.headerCenter, { borderColor: t.accentBorder, backgroundColor: t.accentSoft }]}
        >
          {isMorning
            ? <Sun  size={12} color={t.accent} strokeWidth={1.8} />
            : <Moon size={12} color={t.accent} strokeWidth={1.8} />}
          <Text style={[ms.headerSession, { color: t.accent }]}>
            {isMorning ? 'Al-Sabah' : 'Al-Masa'}
          </Text>
          <View style={[ms.headerSep, { backgroundColor: t.accentBorder }]} />
          <Text style={[ms.headerProgress, { color: W[35] }]}>
            {currentIndex + 1}<Text style={{ color: W[18] }}> / {activeAzkars.length}</Text>
          </Text>
        </TouchableOpacity>

        <View style={ms.headerRight}>
          <GhostButton onPress={handleReset} size={38}>
            <RotateCcw size={15} color={W[18]} />
          </GhostButton>
          <GhostButton onPress={() => setShowCustomize(true)} size={38}>
            <Settings size={17} color={W[35]} />
          </GhostButton>
        </View>
      </View>

      {/* Progress — detached with top margin */}
      <View style={ms.progressWrap}>
        <ProgressBar current={completedInSession} total={activeAzkars.length} color={t.accent} />
      </View>

      {/* Card */}
      {currentAzkar && (
        <AzkarCard
          key={currentAzkar.id}
          azkar={currentAzkar}
          userCount={userCount}
          completedCount={completedCount}
          onCount={handleCount}
          onNext={handleNext}
          onPrev={handlePrev}
          index={currentIndex}
          total={activeAzkars.length}
          period={selectedPeriod}
          allAzkars={activeAzkars}
        />
      )}
    </LinearGradient>
  );
}

const ms = StyleSheet.create({
  header:        {
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: SPACE.sm,
    paddingBottom: SPACE.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter:  {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: SPACE.md, paddingVertical: 8,
    borderRadius: RADIUS.pill, borderWidth: 1,
  },
  headerSession: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  headerSep:     { width: 1, height: 12, opacity: 0.5 },
  headerProgress:{ fontSize: 12, fontWeight: '600' },
  headerRight:   { flexDirection: 'row', gap: 2 },
  progressWrap:  { paddingHorizontal: SPACE.lg, paddingBottom: SPACE.md },
});