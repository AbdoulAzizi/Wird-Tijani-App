import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  TextInput,
  Modal,
  StatusBar,
  PanResponder,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  X, ChevronLeft, ChevronRight, Settings, CheckSquare, Square,
  Plus, Trash2, Sun, Moon, RotateCcw, Check, ChevronDown, ChevronUp, Eye,
  BookOpen, Sparkles,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AZKARS, MORNING_OPENING, EVENING_OPENING,
  type Azkar, type AzkarPeriod, type CustomAzkar,
  getCategoryLabel, CATEGORY_COLORS,
} from '../../data/azkarData';

const { width: W, height: H } = Dimensions.get('window');

// ─── Types ─────────────────────────────────────────────────────────────────────

interface UserPrefs {
  enabledIds: Set<string>;
  customCounts: Record<string, number>;
  customAzkars: CustomAzkar[];
}

// ─── Utils ─────────────────────────────────────────────────────────────────────

const haptic = (type: 'light' | 'success' | 'warning') => {
  if (Platform.OS !== 'ios') return;
  if (type === 'light')   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  if (type === 'warning') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const MORNING_ACCENT   = '#D4913A';
const MORNING_DEEP     = '#8B5A1C';
const MORNING_GLOW     = '#E8B96044';
const MORNING_BG1      = '#070401';
const MORNING_BG2      = '#0D0802';

const EVENING_ACCENT   = '#6B8FC4';
const EVENING_DEEP     = '#2E4A78';
const EVENING_GLOW     = '#4A6EA844';
const EVENING_BG1      = '#010209';
const EVENING_BG2      = '#02050F';

const GREEN            = '#4CAF7A';
const GREEN_BG         = '#1A3D2A';
const GREEN_GLOW       = '#4CAF7A18';

const WHITE_90         = 'rgba(255,255,255,0.90)';
const WHITE_65         = 'rgba(255,255,255,0.65)';
const WHITE_40         = 'rgba(255,255,255,0.40)';
const WHITE_22         = 'rgba(255,255,255,0.22)';
const WHITE_10         = 'rgba(255,255,255,0.10)';
const WHITE_06         = 'rgba(255,255,255,0.06)';
const WHITE_03         = 'rgba(255,255,255,0.03)';

// ─── SESSION SELECTOR ──────────────────────────────────────────────────────────

const SessionSelector = memo(({ onSelect, onBack }: {
  onSelect: (p: AzkarPeriod) => void;
  onBack?: () => void;
}) => {
  const fade    = useRef(new Animated.Value(0)).current;
  const slideM  = useRef(new Animated.Value(40)).current;
  const slideE  = useRef(new Animated.Value(40)).current;
  const ring1   = useRef(new Animated.Value(0.08)).current;
  const ring2   = useRef(new Animated.Value(0.08)).current;

  useEffect(() => {
    const pulse = (a: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.timing(a, { toValue: 0.35, duration: 3200, delay, useNativeDriver: true }),
        Animated.timing(a, { toValue: 0.08, duration: 3200, useNativeDriver: true }),
      ])).start();
    pulse(ring1, 0);
    pulse(ring2, 1600);

    Animated.parallel([
      Animated.timing(fade,   { toValue: 1, duration: 550, useNativeDriver: true }),
      Animated.spring(slideM, { toValue: 0, friction: 10, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      Animated.spring(slideE, { toValue: 0, friction: 10, useNativeDriver: true }).start();
    }, 100);
  }, []);

  const morningCount = AZKARS.filter(a => a.period.includes('morning')).length;
  const eveningCount = AZKARS.filter(a => a.period.includes('evening')).length;

  return (
    <LinearGradient colors={[MORNING_BG1, '#050302', MORNING_BG1]} style={ss.root}>
      <StatusBar barStyle="light-content" />

      {[ring1, ring2].map((a, i) => (
        <Animated.View key={i} pointerEvents="none" style={[ss.ring, {
          width: W * (0.85 + i * 0.5), height: W * (0.85 + i * 0.5),
          borderRadius: W * (0.425 + i * 0.25), opacity: a,
          borderColor: MORNING_ACCENT,
        }]} />
      ))}

      {onBack && (
        <TouchableOpacity onPress={() => { haptic('light'); onBack(); }} style={ss.backBtn}>
          <ChevronLeft size={20} color={WHITE_40} />
        </TouchableOpacity>
      )}

      <Animated.View style={[ss.content, { opacity: fade }]}>
        <View style={ss.eyebrowRow}>
          <View style={ss.eyebrowLine} />
          <Text style={ss.eyebrow}>Daily Remembrance</Text>
          <View style={ss.eyebrowLine} />
        </View>

        <Text style={ss.titleLatin}>Al-Azkaar</Text>
        <Text style={[ss.titleArabic, { color: MORNING_ACCENT }]}>الأذكار اليومية</Text>
        <Text style={ss.subtitle}>Choose your session</Text>

        {/* Morning card */}
        <Animated.View style={{ width: '100%', transform: [{ translateY: slideM }], marginBottom: 14 }}>
          <TouchableOpacity onPress={() => { haptic('success'); onSelect('morning'); }} activeOpacity={0.80}>
            <LinearGradient
              colors={['#180D02', '#221205', '#180D02']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[ss.card, { borderColor: `${MORNING_ACCENT}40` }]}
            >
              <LinearGradient
                colors={[`${MORNING_ACCENT}28`, `${MORNING_ACCENT}10`]}
                style={ss.cardIconBg}
              >
                <Sun size={24} color={MORNING_ACCENT} strokeWidth={1.6} />
              </LinearGradient>
              <View style={ss.cardText}>
                <Text style={[ss.cardPeriod, { color: MORNING_ACCENT }]}>MORNING</Text>
                <Text style={ss.cardTitle}>Adhkar Al-Sabah</Text>
                <Text style={[ss.cardArabic, { color: `${MORNING_ACCENT}80` }]}>أذكار الصباح</Text>
                <View style={ss.cardCountRow}>
                  <View style={[ss.cardCountDot, { backgroundColor: MORNING_ACCENT }]} />
                  <Text style={ss.cardCount}>{morningCount} adhkar</Text>
                </View>
              </View>
              <View style={[ss.cardArrow, { borderColor: `${MORNING_ACCENT}30`, backgroundColor: `${MORNING_ACCENT}12` }]}>
                <ChevronRight size={16} color={`${MORNING_ACCENT}90`} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Evening card */}
        <Animated.View style={{ width: '100%', transform: [{ translateY: slideE }] }}>
          <TouchableOpacity onPress={() => { haptic('success'); onSelect('evening'); }} activeOpacity={0.80}>
            <LinearGradient
              colors={['#020410', '#030615', '#020410']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[ss.card, { borderColor: `${EVENING_ACCENT}40` }]}
            >
              <LinearGradient
                colors={[`${EVENING_ACCENT}28`, `${EVENING_ACCENT}10`]}
                style={ss.cardIconBg}
              >
                <Moon size={22} color={EVENING_ACCENT} strokeWidth={1.6} />
              </LinearGradient>
              <View style={ss.cardText}>
                <Text style={[ss.cardPeriod, { color: EVENING_ACCENT }]}>EVENING</Text>
                <Text style={ss.cardTitle}>Adhkar Al-Masa</Text>
                <Text style={[ss.cardArabic, { color: `${EVENING_ACCENT}80` }]}>أذكار المساء</Text>
                <View style={ss.cardCountRow}>
                  <View style={[ss.cardCountDot, { backgroundColor: EVENING_ACCENT }]} />
                  <Text style={ss.cardCount}>{eveningCount} adhkar</Text>
                </View>
              </View>
              <View style={[ss.cardArrow, { borderColor: `${EVENING_ACCENT}30`, backgroundColor: `${EVENING_ACCENT}12` }]}>
                <ChevronRight size={16} color={`${EVENING_ACCENT}90`} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
});

const ss = StyleSheet.create({
  root:         { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 26 },
  ring:         { position: 'absolute', borderWidth: 1 },
  backBtn:      { position: 'absolute', top: Platform.OS === 'ios' ? 58 : 38, left: 20, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: WHITE_06, borderWidth: 1, borderColor: WHITE_10, zIndex: 10 },
  content:      { alignItems: 'center', width: '100%' },
  eyebrowRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  eyebrowLine:  { flex: 1, height: 1, backgroundColor: WHITE_10 },
  eyebrow:      { color: WHITE_22, fontSize: 9, letterSpacing: 4, fontWeight: '700', textTransform: 'uppercase' },
  titleLatin:   { color: WHITE_90, fontSize: 36, fontWeight: '200', letterSpacing: 1, marginBottom: 5 },
  titleArabic:  { fontSize: 19, fontWeight: '300', marginBottom: 5 },
  subtitle:     { color: WHITE_22, fontSize: 12, marginBottom: 40, letterSpacing: 0.5 },
  card:         { borderRadius: 22, padding: 18, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 16, overflow: 'hidden' },
  cardIconBg:   { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  cardText:     { flex: 1, gap: 3 },
  cardPeriod:   { fontSize: 9, fontWeight: '800', letterSpacing: 3 },
  cardTitle:    { color: WHITE_90, fontSize: 17, fontWeight: '300', letterSpacing: 0.3 },
  cardArabic:   { fontSize: 13, fontWeight: '300' },
  cardCountRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  cardCountDot: { width: 4, height: 4, borderRadius: 2, opacity: 0.6 },
  cardCount:    { color: WHITE_40, fontSize: 11 },
  cardArrow:    { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});

// ─── OPENING CEREMONY ──────────────────────────────────────────────────────────

const OpeningCeremony = memo(({ period, onEnter, onChangePeriod, onBack }: {
  period: AzkarPeriod; onEnter: () => void; onChangePeriod: () => void; onBack: () => void;
}) => {
  const fade      = useRef(new Animated.Value(0)).current;
  const scale     = useRef(new Animated.Value(0.88)).current;
  const lineW     = useRef(new Animated.Value(0)).current;
  const btnFade   = useRef(new Animated.Value(0)).current;
  const ring1     = useRef(new Animated.Value(0.18)).current;
  const ring2     = useRef(new Animated.Value(0.18)).current;
  const ring3     = useRef(new Animated.Value(0.18)).current;

  const isMorning = period === 'morning';
  const accent    = isMorning ? MORNING_ACCENT : EVENING_ACCENT;
  const accentDeep= isMorning ? MORNING_DEEP   : EVENING_DEEP;
  const bg1       = isMorning ? MORNING_BG1    : EVENING_BG1;
  const bg2       = isMorning ? MORNING_BG2    : EVENING_BG2;
  const data      = isMorning ? MORNING_OPENING : EVENING_OPENING;

  useEffect(() => {
    [fade, scale, lineW, btnFade].forEach(v => v.stopAnimation());
    fade.setValue(0); scale.setValue(0.88); lineW.setValue(0); btnFade.setValue(0);

    const pulse = (a: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.timing(a, { toValue: 0.55, duration: 2600, delay, useNativeDriver: true }),
        Animated.timing(a, { toValue: 0.18, duration: 2600, useNativeDriver: true }),
      ])).start();
    pulse(ring1, 0); pulse(ring2, 870); pulse(ring3, 1740);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade,  { toValue: 1, duration: 480, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 9, useNativeDriver: true }),
      ]),
      Animated.timing(lineW,   { toValue: 1, duration: 580, useNativeDriver: false }),
      Animated.timing(btnFade, { toValue: 1, duration: 380, useNativeDriver: true }),
    ]).start();
  }, [period]);

  return (
    <LinearGradient colors={[bg1, bg2, bg1]} style={oc.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {[ring1, ring2, ring3].map((a, i) => (
        <Animated.View key={i} pointerEvents="none" style={[oc.ring, {
          width: W * (1.05 + i * 0.38), height: W * (1.05 + i * 0.38),
          borderRadius: W * (0.525 + i * 0.19), borderColor: accent, opacity: a,
        }]} />
      ))}

      <TouchableOpacity onPress={() => { haptic('light'); onBack(); }} style={oc.backBtn}>
        <ChevronLeft size={20} color={WHITE_40} />
      </TouchableOpacity>

      <Animated.View style={[oc.content, { opacity: fade }]}>
        <TouchableOpacity onPress={() => { haptic('light'); onChangePeriod(); }} style={[oc.toggle, { borderColor: `${accent}28`, backgroundColor: `${accent}0C` }]}>
          {isMorning
            ? <Sun  size={11} color={`${accent}99`} />
            : <Moon size={11} color={`${accent}99`} />}
          <Text style={[oc.toggleText, { color: `${accent}CC` }]}>{isMorning ? 'Morning' : 'Evening'}</Text>
          <Text style={oc.toggleChange}>change ›</Text>
        </TouchableOpacity>

        <Animated.View style={[oc.iconWrap, { transform: [{ scale }], borderColor: accent, backgroundColor: `${accent}14` }]}>
          {isMorning
            ? <Sun  size={32} color={accent} strokeWidth={1.6} />
            : <Moon size={32} color={accent} strokeWidth={1.6} />}
        </Animated.View>

        <Text style={[oc.period, { color: accent }]}>{isMorning ? 'MORNING' : 'EVENING'}</Text>
        <Text style={oc.titleLatin}>{isMorning ? 'Azkaar Al-Sabah' : 'Azkaar Al-Masa'}</Text>
        <Text style={[oc.titleArabic, { color: accent }]}>{isMorning ? 'أذكار الصباح' : 'أذكار المساء'}</Text>

        <Animated.View style={[oc.line, {
          width: lineW.interpolate({ inputRange: [0, 1], outputRange: ['0%', '48%'] }),
          backgroundColor: accent,
        }]} />

        <View style={[oc.duaCard, { borderColor: `${accent}20`, backgroundColor: `${accent}07` }]}>
          <View style={[oc.duaCardAccent, { backgroundColor: accent }]} />
          <Text style={oc.duaArabic}>{data.arabic}</Text>
          <View style={[oc.duaDivider, { backgroundColor: `${accent}30` }]} />
          <Text style={[oc.duaTranslit, { color: `${accent}BB` }]}>{data.transliteration}</Text>
          <Text style={oc.duaTrans}>{data.translation}</Text>
        </View>

        <Animated.View style={{ opacity: btnFade, width: '100%' }}>
          <TouchableOpacity onPress={() => { haptic('success'); onEnter(); }} activeOpacity={0.78} style={oc.cta}>
            <LinearGradient
              colors={isMorning
                ? [accentDeep, MORNING_ACCENT, accentDeep]
                : [accentDeep, EVENING_ACCENT, accentDeep]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={oc.ctaGradient}
            >
              {isMorning
                ? <Sun  size={15} color="#fff" style={{ marginRight: 10 }} />
                : <Moon size={15} color="#fff" style={{ marginRight: 10 }} />}
              <Text style={oc.ctaText}>{isMorning ? 'Begin Morning Adhkar' : 'Begin Evening Adhkar'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
});

const oc = StyleSheet.create({
  root:         { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring:         { position: 'absolute', borderWidth: 1 },
  backBtn:      { position: 'absolute', top: Platform.OS === 'ios' ? 58 : 38, left: 20, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: WHITE_06, borderWidth: 1, borderColor: WHITE_10, zIndex: 10 },
  content:      { alignItems: 'center', paddingHorizontal: 26, width: '100%' },
  toggle:       { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 16, paddingHorizontal: 13, paddingVertical: 7, marginBottom: 30 },
  toggleText:   { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  toggleChange: { color: WHITE_22, fontSize: 10 },
  iconWrap:     { width: 66, height: 66, borderRadius: 33, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  period:       { fontSize: 9, fontWeight: '800', letterSpacing: 5, textTransform: 'uppercase', marginBottom: 6 },
  titleLatin:   { color: WHITE_90, fontSize: 28, fontWeight: '200', letterSpacing: 0.5, marginBottom: 4, textAlign: 'center' },
  titleArabic:  { fontSize: 19, fontWeight: '300', textAlign: 'center', marginBottom: 22 },
  line:         { height: 1, opacity: 0.5, marginBottom: 24, alignSelf: 'center' },
  duaCard:      { width: '100%', borderWidth: 1, borderRadius: 18, padding: 18, paddingTop: 22, marginBottom: 28, overflow: 'hidden' },
  duaCardAccent:{ position: 'absolute', top: 0, left: 28, right: 28, height: 1.5 },
  duaArabic:    { color: WHITE_90, fontSize: 15.5, lineHeight: 28, textAlign: 'center', fontWeight: '300', marginBottom: 14 },
  duaDivider:   { height: 1, marginHorizontal: 40, marginBottom: 10 },
  duaTranslit:  { fontSize: 11, lineHeight: 18, textAlign: 'center', fontStyle: 'italic', marginBottom: 7 },
  duaTrans:     { color: WHITE_40, fontSize: 12, lineHeight: 19, textAlign: 'center' },
  cta:          { width: '100%', borderRadius: 50, overflow: 'hidden' },
  ctaGradient:  { paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  ctaText:      { color: '#ffffff', fontSize: 14, fontWeight: '700', letterSpacing: 1.8 },
});

// ─── PROGRESS BAR ──────────────────────────────────────────────────────────────

const ProgressBar = memo(({ current, total, color }: { current: number; total: number; color: string }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const pct = total > 0 ? Math.min(current / total, 1) : 0;
  useEffect(() => {
    Animated.spring(progress, { toValue: pct, friction: 10, useNativeDriver: false }).start();
  }, [pct]);
  return (
    <View style={pb.track}>
      <Animated.View style={[pb.fill, {
        backgroundColor: color,
        width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
      }]} />
    </View>
  );
});

const pb = StyleSheet.create({
  track: { height: 2, backgroundColor: WHITE_06, borderRadius: 1, marginHorizontal: 20 },
  fill:  { height: 2, borderRadius: 1 },
});

// ─── AZKAR CARD ────────────────────────────────────────────────────────────────

const AzkarCard = memo(({
  azkar, userCount, completedCount, onCount, onNext, onPrev, index, total, period, allAzkars,
}: {
  azkar: Azkar | CustomAzkar; userCount: number; completedCount: number;
  onCount: () => void; onNext: () => void; onPrev: () => void;
  index: number; total: number; period: AzkarPeriod;
  allAzkars: (Azkar | CustomAzkar)[];
}) => {
  const cardFade   = useRef(new Animated.Value(0)).current;
  const cardSlide  = useRef(new Animated.Value(20)).current;
  const tapScale   = useRef(new Animated.Value(1)).current;
  const tapGlow    = useRef(new Animated.Value(0)).current;
  const doneScale  = useRef(new Animated.Value(1)).current;
  const [presenceIdx, setPresenceIdx] = useState<number | null>(null);

  const isCustom   = 'isCustom' in azkar;
  const color      = isCustom ? EVENING_ACCENT : (azkar as Azkar).color;
  const glow       = isCustom ? EVENING_GLOW   : (azkar as Azkar).glow;
  const accent     = period === 'morning' ? MORNING_ACCENT : EVENING_ACCENT;
  const isDone     = completedCount >= userCount;
  const remaining  = Math.max(0, userCount - completedCount);

  useEffect(() => {
    cardFade.setValue(0); cardSlide.setValue(16);
    Animated.parallel([
      Animated.timing(cardFade,  { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.spring(cardSlide, { toValue: 0, friction: 11,  useNativeDriver: true }),
    ]).start();
  }, [azkar.id]);

  useEffect(() => {
    if (isDone) {
      haptic('success');
      Animated.sequence([
        Animated.spring(doneScale, { toValue: 1.05, friction: 5, useNativeDriver: true }),
        Animated.spring(doneScale, { toValue: 1,    friction: 5, useNativeDriver: true }),
      ]).start();
    }
  }, [isDone]);

  const handleCount = useCallback(() => {
    if (isDone) return;
    haptic('light');
    Animated.sequence([
      Animated.parallel([
        Animated.timing(tapScale, { toValue: 0.96, duration: 55,  useNativeDriver: true }),
        Animated.timing(tapGlow,  { toValue: 1,    duration: 70,  useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(tapScale, { toValue: 1,    friction: 6,   useNativeDriver: true }),
        Animated.timing(tapGlow,  { toValue: 0,    duration: 380, useNativeDriver: true }),
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
            if (diff > 0) for (let i = 0; i < diff;  i++) onNext();
            else if (diff < 0) for (let i = 0; i < -diff; i++) onPrev();
          }}
        />
      )}

      <Animated.View
        style={[ac.root, { opacity: cardFade, transform: [{ translateY: cardSlide }] }]}
        {...pan.panHandlers}
      >
        {/* ════════════════════════════════════════════════════
             ZONE TEXTE
            ════════════════════════════════════════════════════ */}
        <ScrollView
          style={ac.textZone}
          contentContainerStyle={ac.textContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ── Meta row ── */}
          <View style={ac.metaRow}>
            {!isCustom && (
              <View style={[ac.categoryPill, {
                backgroundColor: `${CATEGORY_COLORS[(azkar as Azkar).category]}18`,
                borderWidth: 1,
                borderColor: `${CATEGORY_COLORS[(azkar as Azkar).category]}28`,
              }]}>
                <View style={[ac.categoryDot, { backgroundColor: CATEGORY_COLORS[(azkar as Azkar).category] }]} />
                <Text style={[ac.categoryLabel, { color: CATEGORY_COLORS[(azkar as Azkar).category] }]}>
                  {getCategoryLabel((azkar as Azkar).category).toUpperCase()}
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => { haptic('light'); setPresenceIdx(index); }}
              style={[ac.presenceBtn, { borderColor: `${color}50`, backgroundColor: `${color}18` }]}
            >
              <Sparkles size={12} color={color} />
              <Text style={[ac.presenceBtnText, { color }]}>PRESENCE</Text>
            </TouchableOpacity>
          </View>

          {/* ── Texte arabe — centré, grand, lumineux ── */}
          <Text style={[ac.arabic, { textShadowColor: glow }]}>
            {azkar.arabic}
          </Text>

          {/* ── Séparateur ornemental arabe → translittération ── */}
          <View style={ac.ornamentRow}>
            <View style={[ac.ornamentLine, { backgroundColor: `${accent}20` }]} />
            <View style={[ac.ornamentDiamond, { borderColor: `${accent}55` }]} />
            <View style={[ac.ornamentLine, { backgroundColor: `${accent}20` }]} />
          </View>

          {/* ── Translittération — centré, italique ── */}
          {!!azkar.transliteration && (
            <Text style={[ac.translit, { color: `${accent}EE` }]}>
              {azkar.transliteration}
            </Text>
          )}

          {/* ── Traduction — justifiée ── */}
          <Text style={ac.translation}>
            {azkar.translation}
          </Text>

          {/* ── Source — encadrée par deux traits fins ── */}
          {!isCustom && (azkar as Azkar).source && (
            <View style={ac.sourceRow}>
              <View style={[ac.sourceDash, { backgroundColor: `${accent}30` }]} />
              <Text style={ac.source}>{(azkar as Azkar).source}</Text>
              <View style={[ac.sourceDash, { backgroundColor: `${accent}30` }]} />
            </View>
          )}

          {/* ── Vertu ── */}
          {!isCustom && (azkar as Azkar).virtue && (
            <View style={[ac.virtueCard, { borderColor: `${accent}1A`, backgroundColor: `${accent}07` }]}>
              <View style={[ac.virtueAccentLine, { backgroundColor: accent }]} />
              <Text style={[ac.virtueLabel, { color: `${accent}CC` }]}>✧  VIRTUE  ✧</Text>
              <Text style={ac.virtueText}>{(azkar as Azkar).virtue}</Text>
            </View>
          )}
        </ScrollView>

        {/* ════════════════════════════════════════════════════
             SÉPARATEUR  texte → compteur
             Ligne colorée + pillule centrale flottante
            ════════════════════════════════════════════════════ */}
        <View style={ac.zoneSeparator}>
          <View style={[ac.separatorLine, { backgroundColor: `${accent}28` }]} />
          <View style={[ac.separatorPill, { borderColor: `${accent}40`, backgroundColor: `${accent}12` }]}>
            <Text style={[ac.separatorPillText, { color: `${accent}CC` }]}>
              {isDone ? '✓' : `${remaining}×`}
            </Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════════
             ZONE COMPTEUR
            ════════════════════════════════════════════════════ */}
        <TouchableOpacity
          onPress={isDone ? onNext : handleCount}
          activeOpacity={0.88}
          style={ac.counterZone}
        >
          {/* Couches de fond */}
          <View style={[ac.counterBg, { backgroundColor: isDone ? '#07160F' : '#0A0A0A' }]} />
          <View style={[ac.counterTint, { backgroundColor: isDone ? GREEN : color }]} />
          <View style={[ac.counterBorder, { borderColor: isDone ? `${GREEN}60` : `${color}60` }]} />
          <Animated.View style={[ac.tapGlow, { backgroundColor: isDone ? GREEN : color, opacity: tapGlow }]} />

          {/* ── État TERMINÉ ── */}
          {isDone && (
            <Animated.View style={[ac.doneState, { transform: [{ scale: doneScale }] }]}>
              <View style={ac.doneCircle}>
                <Check size={32} color={GREEN} strokeWidth={2.5} />
              </View>
              <View style={ac.doneTextGroup}>
                <Text style={ac.doneLabel}>Completed</Text>
                <Text style={ac.doneNext}>tap to continue  →</Text>
              </View>
            </Animated.View>
          )}

          {/* ── État COMPTAGE ── */}
          {!isDone && (
            <Animated.View style={[ac.countState, { transform: [{ scale: tapScale }] }]}>
              <View style={[ac.countCircle, { borderColor: `${color}80` }]}>
                <Text style={ac.countNum}>{completedCount}</Text>
                <View style={[ac.countSep, { backgroundColor: `${color}BB` }]} />
                <Text style={[ac.countTarget, { color }]}>{userCount}</Text>
              </View>
              <View style={ac.countInfo}>
                <Text style={[ac.remainingBig, { color: isDone ? GREEN : WHITE_90 }]}>
                  {remaining}
                </Text>
                <Text style={[ac.remainingLabel, { color: WHITE_40 }]}>
                  {remaining === userCount ? 'tap to begin' : 'remaining'}
                </Text>
              </View>
            </Animated.View>
          )}
        </TouchableOpacity>

        {/* ── Bottom Nav ── */}
        <View style={ac.navBar}>
          <TouchableOpacity
            onPress={() => { haptic('light'); onPrev(); }}
            disabled={index === 0}
            style={[ac.navBtn, { opacity: index === 0 ? 0.15 : 0.65 }]}
          >
            <ChevronLeft size={21} color={WHITE_90} />
          </TouchableOpacity>

          <View style={ac.dots}>
            {allAzkars.length <= 20 ? (
              allAzkars.map((_, i) => (
                <View key={i} style={[
                  ac.dot,
                  i === index
                    ? { width: 22, backgroundColor: accent }
                    : i < index
                      ? { backgroundColor: `${accent}45` }
                      : { backgroundColor: WHITE_10 },
                ]} />
              ))
            ) : (
              <Text style={[ac.dotsCount, { color: `${accent}CC` }]}>
                {index + 1}<Text style={{ color: WHITE_22 }}> / {allAzkars.length}</Text>
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => { haptic('light'); onNext(); }}
            style={[ac.navBtn, ac.navBtnAccent, { borderColor: `${accent}38`, backgroundColor: `${accent}16` }]}
          >
            <ChevronRight size={21} color={accent} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
});

const ac = StyleSheet.create({
  root:             { flex: 1 },

  // ── Zone texte ────────────────────────────────────────────────────────────
  textZone:         { flex: 1 },
  textContent:      {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 8,
  },

  metaRow:          {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryPill:     {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 12, gap: 6,
  },
  categoryDot:      { width: 5, height: 5, borderRadius: 2.5 },
  categoryLabel:    { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  presenceBtn:      {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 14, borderWidth: 1.5,
  },
  presenceBtnText:  { fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },

  // Arabe : centré, grand, lumineux
  arabic:           {
    color: WHITE_90,
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 52,
    textAlign: 'center',
    textShadowRadius: 22,
    textShadowOffset: { width: 0, height: 0 },
    marginBottom: 20,
    letterSpacing: 0.5,
  },

  // Séparateur ornemental arabe → translittération
  ornamentRow:      {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
    gap: 10,
  },
  ornamentLine:     { flex: 1, height: 1 },
  ornamentDiamond:  {
    width: 7, height: 7,
    borderWidth: 1,
    transform: [{ rotate: '45deg' }],
  },

  // Translittération : centré, italique
 translit: {
  fontSize: 13,
  lineHeight: 22,
  textAlign: 'center',
  fontStyle: 'italic',
  marginBottom: 12,
  paddingHorizontal: 8,
  letterSpacing: 0.3,
  color: 'rgba(255,255,255,0.72)',   // ← valeur par défaut fallback
},

  // Traduction : JUSTIFIÉE
  translation:      {
    color: WHITE_65,
    fontSize: 14,
    lineHeight: 25,
    textAlign: 'justify',
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  // Source encadrée
  sourceRow:        {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sourceDash:       { flex: 1, height: 1 },
  source:           {
    color: WHITE_22,
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Vertu
  virtueCard:       {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    paddingTop: 18,
    marginTop: 4,
    overflow: 'hidden',
  },
  virtueAccentLine: { position: 'absolute', top: 0, left: 20, right: 20, height: 1 },
  virtueLabel:      {
    fontSize: 9, fontWeight: '800', letterSpacing: 3,
    marginBottom: 8, textAlign: 'center',
  },
  virtueText:       {
    color: WHITE_40,
    fontSize: 12.5,
    lineHeight: 21,
    textAlign: 'justify',
  },

  // ── Séparateur zone texte / compteur ──────────────────────────────────────
  zoneSeparator:    {
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
    position: 'relative',
  },
  separatorLine:    {
    width: '100%',
    height: 1,
  },
  separatorPill:    {
    position: 'absolute',
    top: -13,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 52,
    alignItems: 'center',
  },
  separatorPillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ── Zone compteur ──────────────────────────────────────────────────────────
  counterZone:      {
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 10,
    borderRadius: 22,
    minHeight: 130,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  counterBg:        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 22 },
  counterTint:      { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 22, opacity: 0.10 },
  counterBorder:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 22, borderWidth: 1.5 },
  tapGlow:          { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 22, opacity: 0 },

  // État terminé — layout horizontal
  doneState:        {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  doneCircle:       {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneTextGroup:    { gap: 4 },
  doneLabel:        { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
  doneNext:         { fontSize: 12, fontWeight: '400', color: 'rgba(255,255,255,0.50)' },

  // État comptage — layout horizontal : cercle à gauche, texte à droite
  countState:       {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  countCircle:      {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countNum:         { fontSize: 38, fontWeight: '200', lineHeight: 42, color: '#FFFFFF' },
  countSep:         { width: 30, height: 1, marginVertical: 3 },
  countTarget:      { fontSize: 14, fontWeight: '700' },

  // Partie droite du comptage
  countInfo:        { alignItems: 'flex-start', gap: 2 },
  remainingBig:     { fontSize: 42, fontWeight: '200', lineHeight: 46 },
  remainingLabel:   { fontSize: 11, fontWeight: '500', letterSpacing: 0.5 },

  // Nav
  navBar:           {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    paddingTop: 6,
    gap: 12,
  },
  navBtn:           {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: WHITE_10, backgroundColor: WHITE_06,
  },
  navBtnAccent:     {},
  dots:             {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 5, flexWrap: 'wrap',
  },
  dot:              { height: 6, width: 6, borderRadius: 3 },
  dotsCount:        { fontSize: 16, fontWeight: '700' },
});

// ─── PRESENCE CONTENT ──────────────────────────────────────────────────────────

const PresenceContent = memo(({ azkar, period, lineWidth }: {
  azkar: Azkar | CustomAzkar; period: AzkarPeriod; lineWidth: Animated.Value;
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const isCustom = 'isCustom' in azkar;
  const color  = isCustom ? EVENING_ACCENT : (azkar as Azkar).color;
  const glow   = isCustom ? EVENING_GLOW   : (azkar as Azkar).glow;
  const accent = period === 'morning' ? MORNING_ACCENT : EVENING_ACCENT;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: -9, duration: 4200, useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0,  duration: 4200, useNativeDriver: true }),
    ])).start();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={pc.content}
      showsVerticalScrollIndicator={false}
      bounces
    >
      <Animated.Text style={[pc.arabic, {
        textShadowColor: glow,
        transform: [{ translateY: floatAnim }],
      }]}>
        {azkar.arabic}
      </Animated.Text>

      <Animated.View style={[pc.line, {
        backgroundColor: accent,
        width: lineWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '48%'] }),
      }]} />

      {!!azkar.transliteration && (
        <Text style={[pc.translit, { color: `${accent}EE` }]}>{azkar.transliteration}</Text>
      )}

      <Text style={pc.translation}>{azkar.translation}</Text>

      {!isCustom && (azkar as Azkar).virtue && (
        <View style={[pc.virtue, { borderColor: `${accent}22`, backgroundColor: `${accent}0C` }]}>
          <Text style={[pc.virtueLabel, { color: accent }]}>✧ VIRTUE ✧</Text>
          <Text style={pc.virtueText}>{(azkar as Azkar).virtue}</Text>
        </View>
      )}
    </ScrollView>
  );
});

const pc = StyleSheet.create({
  content:    { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingTop: 110, paddingBottom: 160 },
  arabic:     { color: WHITE_90, fontSize: 30, fontWeight: '300', lineHeight: 54, textAlign: 'center', textShadowRadius: 28, textShadowOffset: { width: 0, height: 0 }, marginBottom: 26 },
  line:       { height: 1, opacity: 0.5, alignSelf: 'center', marginBottom: 26 },
  translit:   { fontSize: 15, lineHeight: 24, textAlign: 'center', fontStyle: 'italic', marginBottom: 12 },
  translation:{ color: WHITE_65, fontSize: 15, lineHeight: 26, textAlign: 'center', marginBottom: 30 },
  virtue:     { width: '100%', borderWidth: 1, borderRadius: 16, padding: 16 },
  virtueLabel:{ fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 8, textAlign: 'center' },
  virtueText: { color: 'rgba(255,255,255,0.58)', fontSize: 13, lineHeight: 21, textAlign: 'center' },
});

// ─── PRESENCE MODAL ────────────────────────────────────────────────────────────

const PresenceModal = memo(({ azkars, startIndex, period, onClose }: {
  azkars: (Azkar | CustomAzkar)[];
  startIndex: number;
  period: AzkarPeriod;
  onClose: (finalIndex: number) => void;
}) => {
  const [currentIdx, setCurrentIdx] = useState(startIndex);
  const azkar = azkars[currentIdx];
  const insets = useSafeAreaInsets();

  const backdropFade  = useRef(new Animated.Value(0)).current;
  const uiFade        = useRef(new Animated.Value(0)).current;
  const lineWidth     = useRef(new Animated.Value(0)).current;
  const contentFade   = useRef(new Animated.Value(1)).current;
  const contentSlide  = useRef(new Animated.Value(0)).current;
  const glowBreath    = useRef(new Animated.Value(0.04)).current;
  const ring1Scale    = useRef(new Animated.Value(1)).current;
  const ring1Opacity  = useRef(new Animated.Value(0)).current;
  const ring2Scale    = useRef(new Animated.Value(1)).current;
  const ring2Opacity  = useRef(new Animated.Value(0)).current;
  const ring3Scale    = useRef(new Animated.Value(1)).current;
  const ring3Opacity  = useRef(new Animated.Value(0)).current;

  const particles = useRef(
    Array.from({ length: 10 }, () => ({
      x: new Animated.Value(Math.random() * W * 0.8 - W * 0.4),
      y: new Animated.Value(Math.random() * H * 0.5 - H * 0.25),
      opacity: new Animated.Value(0),
      size: 2 + Math.random() * 2.5,
    }))
  ).current;

  const isCustom = 'isCustom' in azkar;
  const color    = isCustom ? EVENING_ACCENT : (azkar as Azkar).color;
  const glow     = isCustom ? EVENING_GLOW   : (azkar as Azkar).glow;
  const accent   = period === 'morning' ? MORNING_ACCENT : EVENING_ACCENT;
  const isFirst  = currentIdx === 0;
  const isLast   = currentIdx === azkars.length - 1;

  const startRingLoop = (sA: Animated.Value, oA: Animated.Value, delay: number) => {
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(oA, { toValue: 0.11, duration: 280, useNativeDriver: true }),
        Animated.timing(sA, { toValue: 1,    duration: 0,   useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(sA, { toValue: 3.2,  duration: 3800, useNativeDriver: true }),
        Animated.timing(oA, { toValue: 0,    duration: 3800, useNativeDriver: true }),
      ]),
    ])).start();
  };

  const startParticle = (p: typeof particles[0], delay: number) => {
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(p.opacity, { toValue: 0.20 + Math.random() * 0.25, duration: 4000, useNativeDriver: true }),
        Animated.timing(p.x,       { toValue: (Math.random() - 0.5) * 160, duration: 6000, useNativeDriver: true }),
        Animated.timing(p.y,       { toValue: -45 - Math.random() * 70,    duration: 6000, useNativeDriver: true }),
      ]),
      Animated.timing(p.opacity,   { toValue: 0, duration: 1400, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(p.x, { toValue: Math.random() * W * 0.8 - W * 0.4, duration: 0, useNativeDriver: true }),
        Animated.timing(p.y, { toValue: Math.random() * H * 0.5 - H * 0.25, duration: 0, useNativeDriver: true }),
      ]),
    ])).start();
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(backdropFade, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(uiFade,    { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(lineWidth, { toValue: 1, duration: 480, useNativeDriver: false }),
      ]),
    ]).start();
    Animated.loop(Animated.sequence([
      Animated.timing(glowBreath, { toValue: 0.14, duration: 4800, useNativeDriver: true }),
      Animated.timing(glowBreath, { toValue: 0.04, duration: 4800, useNativeDriver: true }),
    ])).start();
    startRingLoop(ring1Scale, ring1Opacity, 0);
    startRingLoop(ring2Scale, ring2Opacity, 1260);
    startRingLoop(ring3Scale, ring3Opacity, 2520);
    particles.forEach((p, i) => startParticle(p, i * 280));
  }, []);

  const navigateTo = useCallback((newIdx: number, dir: 'next' | 'prev') => {
    if (newIdx < 0 || newIdx >= azkars.length) return;
    haptic('light');
    Animated.parallel([
      Animated.timing(contentFade,  { toValue: 0, duration: 140, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: dir === 'next' ? -22 : 22, duration: 140, useNativeDriver: true }),
    ]).start(() => {
      contentSlide.setValue(dir === 'next' ? 22 : -22);
      lineWidth.setValue(0);
      setCurrentIdx(newIdx);
      Animated.parallel([
        Animated.timing(contentFade,  { toValue: 1, duration: 190, useNativeDriver: true }),
        Animated.timing(contentSlide, { toValue: 0, duration: 190, useNativeDriver: true }),
        Animated.timing(lineWidth,    { toValue: 1, duration: 430, useNativeDriver: false }),
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
            backgroundColor: glow, opacity: p.opacity,
            transform: [{ translateX: p.x }, { translateY: p.y }],
          }]} />
        ))}

        {[{ s: ring1Scale, o: ring1Opacity }, { s: ring2Scale, o: ring2Opacity }, { s: ring3Scale, o: ring3Opacity }].map((r, i) => (
          <Animated.View key={i} pointerEvents="none" style={[pm.ring, {
            borderColor: color, opacity: r.o, transform: [{ scale: r.s }],
          }]} />
        ))}

        <Animated.View pointerEvents="none" style={[pm.glowCore, { backgroundColor: glow, opacity: glowBreath }]} />

        {/* Header */}
        <Animated.View style={[pm.header, { opacity: uiFade }]}>
          <View style={pm.headerLeft}>
            <Text style={[pm.headerLabel, { color: accent }]}>✦  Presence Station  ✦</Text>
          </View>
          <View style={pm.headerCenter}>
            <Text style={[pm.headerIdx, { color: accent }]}>{currentIdx + 1}</Text>
            <Text style={pm.headerSep}> / </Text>
            <Text style={pm.headerTotal}>{azkars.length}</Text>
          </View>
          <View style={pm.headerRight}>
            <TouchableOpacity onPress={() => { haptic('light'); onClose(currentIdx); }} style={pm.closeBtn}>
              <X size={17} color={WHITE_65} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Content */}
        <Animated.View style={[pm.contentWrap, { opacity: contentFade, transform: [{ translateX: contentSlide }] }]}>
          <PresenceContent azkar={azkar} period={period} lineWidth={lineWidth} />
        </Animated.View>

        {/* Bottom nav */}
        <Animated.View style={[pm.navBar, { opacity: uiFade, paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity
            onPress={() => navigateTo(currentIdx - 1, 'prev')}
            disabled={isFirst}
            style={[pm.navBtn, { opacity: isFirst ? 0.18 : 0.72 }]}
          >
            <ChevronLeft size={21} color={WHITE_90} />
          </TouchableOpacity>

          <View style={pm.dots}>
            {azkars.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => navigateTo(i, i > currentIdx ? 'next' : 'prev')} hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
                <View style={[pm.dot, {
                  width: i === currentIdx ? 22 : 6,
                  backgroundColor: i === currentIdx ? accent : i < currentIdx ? `${accent}50` : WHITE_10,
                }]} />
              </TouchableOpacity>
            ))}
          </View>

          {isLast ? (
            <TouchableOpacity
              onPress={() => { haptic('success'); onClose(currentIdx); }}
              style={[pm.navBtnDone, { borderColor: `${GREEN}45`, backgroundColor: `${GREEN}16` }]}
            >
              <Check size={15} color={GREEN} />
              <Text style={[pm.navBtnDoneText, { color: GREEN }]}>Done</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigateTo(currentIdx + 1, 'next')}
              style={[pm.navBtn, pm.navBtnNext, { borderColor: `${accent}38`, backgroundColor: `${accent}16` }]}
            >
              <ChevronRight size={21} color={accent} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Breathe hint */}
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
  particle:      { position: 'absolute', top: H * 0.5, left: W * 0.5 },
  ring:          { position: 'absolute', top: H * 0.5 - W * 0.5, left: 0, width: W, height: W, borderRadius: W / 2, borderWidth: 1.5 },
  glowCore:      { position: 'absolute', top: H * 0.5 - W * 0.6, left: -W * 0.1, width: W * 1.2, height: W * 1.2, borderRadius: W * 0.6 },
  header:        { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingHorizontal: 20, paddingBottom: 12, zIndex: 10 },
  headerLeft:    { flex: 1 },
  headerLabel:   { fontSize: 9, fontWeight: '800', letterSpacing: 3 },
  headerCenter:  { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE_06, borderRadius: 14, paddingHorizontal: 13, paddingVertical: 5, borderWidth: 1, borderColor: WHITE_10 },
  headerRight:   { flex: 1, alignItems: 'flex-end' },
  headerIdx:     { fontSize: 13, fontWeight: '800' },
  headerSep:     { color: WHITE_22, fontSize: 12 },
  headerTotal:   { color: WHITE_40, fontSize: 12 },
  closeBtn:      { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: WHITE_06, borderWidth: 1, borderColor: WHITE_10 },
  contentWrap:   { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  navBar:        { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingBottom: 16, paddingTop: 14, paddingHorizontal: 20, backgroundColor: 'rgba(0,0,0,0.80)', borderTopWidth: 1, borderTopColor: WHITE_06, gap: 12, zIndex: 10, minHeight: 80 },
  navBtn:        { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: WHITE_10, backgroundColor: WHITE_06 },
  navBtnNext:    {},
  navBtnDone:    { paddingHorizontal: 18, height: 46, borderRadius: 23, flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1 },
  navBtnDoneText:{ fontSize: 13, fontWeight: '700' },
  dots:          { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, flexWrap: 'wrap' },
  dot:           { height: 6, borderRadius: 3 },
  breathe:       { position: 'absolute', bottom: 96, left: 0, right: 0, alignItems: 'center' },
  breatheText:   { color: WHITE_22, fontSize: 10, letterSpacing: 4 },
});

// ─── CUSTOMIZATION PAGE ────────────────────────────────────────────────────────

const CustomizationPage = memo(({ prefs, onUpdate, onClose, period }: {
  prefs: UserPrefs; onUpdate: (p: UserPrefs) => void; onClose: () => void; period: AzkarPeriod;
}) => {
  const [localPrefs, setLocalPrefs] = useState<UserPrefs>({
    enabledIds: new Set(prefs.enabledIds),
    customCounts: { ...prefs.customCounts },
    customAzkars: [...prefs.customAzkars],
  });
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [showAdd, setShowAdd]           = useState(false);
  const [newAzkar, setNewAzkar]         = useState({ arabic: '', transliteration: '', translation: '', count: '3' });

  const isMorning = period === 'morning';
  const accent    = isMorning ? MORNING_ACCENT : EVENING_ACCENT;
  const filtered  = AZKARS.filter(a => a.period.includes(period));

  const toggle = (id: string) => {
    const s = new Set(localPrefs.enabledIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setLocalPrefs({ ...localPrefs, enabledIds: s });
    haptic('light');
  };

  const commitEdit = (id: string) => {
    const n = parseInt(editingValue, 10);
    if (!isNaN(n) && n >= 1) setLocalPrefs(p => ({ ...p, customCounts: { ...p.customCounts, [id]: n } }));
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

  type FieldDef = {
    label: string;
    key: 'arabic' | 'transliteration' | 'translation';
    placeholder: string;
    multiline: boolean;
    rtl?: boolean;
    italic?: boolean;
  };

  const fieldDefs: FieldDef[] = [
    { label: 'Arabic text *',   key: 'arabic',          placeholder: 'Enter Arabic text...',   multiline: true,  rtl: true  },
    { label: 'Transliteration', key: 'transliteration', placeholder: 'Transliteration...',      multiline: false, italic: true },
    { label: 'Translation *',   key: 'translation',     placeholder: 'Meaning in English...',  multiline: true              },
  ];

  return (
    <View style={cp.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0C0C16', '#060608']} style={cp.header}>
        <TouchableOpacity onPress={onClose} style={cp.headerBack}>
          <X size={20} color={WHITE_40} />
        </TouchableOpacity>
        <View style={cp.headerCenter}>
          <Text style={cp.headerTitle}>Customize</Text>
          <Text style={[cp.headerSub, { color: accent }]}>{isMorning ? 'Morning Adhkar' : 'Evening Adhkar'}</Text>
        </View>
        <TouchableOpacity onPress={save} style={[cp.saveBtn, { borderColor: `${accent}38`, backgroundColor: `${accent}16` }]}>
          <Text style={[cp.saveBtnText, { color: accent }]}>Save</Text>
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={cp.scroll} showsVerticalScrollIndicator={false}>

          <View style={cp.bulkRow}>
            <TouchableOpacity
              onPress={() => setLocalPrefs(p => ({ ...p, enabledIds: new Set([...filtered.map(a => a.id), ...customsForPeriod.map(c => c.id)]) }))}
              style={[cp.bulkBtn, { borderColor: `${accent}35`, backgroundColor: `${accent}0C` }]}
            >
              <Text style={[cp.bulkBtnText, { color: accent }]}>Select all</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLocalPrefs(p => ({ ...p, enabledIds: new Set() }))}
              style={[cp.bulkBtn, { borderColor: WHITE_10 }]}
            >
              <Text style={[cp.bulkBtnText, { color: WHITE_40 }]}>Deselect all</Text>
            </TouchableOpacity>
          </View>

          <View style={cp.sectionRow}>
            <View style={[cp.sectionLine, { backgroundColor: `${accent}25` }]} />
            <Text style={cp.sectionTitle}>STANDARD ADHKAR  ({filtered.length})</Text>
            <View style={[cp.sectionLine, { backgroundColor: `${accent}25` }]} />
          </View>

          {filtered.map(azkar => {
            const enabled = localPrefs.enabledIds.has(azkar.id);
            const count   = localPrefs.customCounts[azkar.id] ?? azkar.defaultCount;
            const editing = editingId === azkar.id;
            return (
              <View key={azkar.id} style={[cp.row, {
                borderColor: enabled ? `${azkar.color}28` : WHITE_06,
                backgroundColor: enabled ? `${azkar.color}06` : WHITE_03,
              }]}>
                <View style={[cp.rowAccent, { backgroundColor: enabled ? azkar.color : 'transparent' }]} />
                <TouchableOpacity onPress={() => toggle(azkar.id)} style={cp.rowCheck}>
                  {enabled
                    ? <CheckSquare size={19} color={azkar.color} strokeWidth={2} />
                    : <Square      size={19} color={WHITE_22}    strokeWidth={1.5} />}
                </TouchableOpacity>
                <View style={cp.rowText}>
                  <Text style={cp.rowArabic} numberOfLines={2}>{azkar.arabic}</Text>
                  <Text style={cp.rowTranslit} numberOfLines={1}>{azkar.transliteration}</Text>
                  <View style={cp.rowMeta}>
                    <View style={[cp.rowDot, { backgroundColor: CATEGORY_COLORS[azkar.category] }]} />
                    <Text style={[cp.rowCategory, { color: CATEGORY_COLORS[azkar.category] }]}>{getCategoryLabel(azkar.category)}</Text>
                  </View>
                </View>
                {editing ? (
                  <TextInput
                    value={editingValue}
                    onChangeText={setEditingValue}
                    keyboardType="number-pad"
                    style={[cp.countInput, { borderColor: `${azkar.color}55`, color: WHITE_90 }]}
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
                    <Text style={cp.countBtnLabel}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          {customsForPeriod.length > 0 && (
            <>
              <View style={[cp.sectionRow, { marginTop: 24 }]}>
                <View style={[cp.sectionLine, { backgroundColor: `${EVENING_ACCENT}25` }]} />
                <Text style={cp.sectionTitle}>MY CUSTOM DHIKR  ({customsForPeriod.length})</Text>
                <View style={[cp.sectionLine, { backgroundColor: `${EVENING_ACCENT}25` }]} />
              </View>
              {customsForPeriod.map(c => {
                const enabled = localPrefs.enabledIds.has(c.id);
                return (
                  <View key={c.id} style={[cp.row, {
                    borderColor: enabled ? `${EVENING_ACCENT}35` : WHITE_06,
                    backgroundColor: enabled ? `${EVENING_ACCENT}08` : WHITE_03,
                  }]}>
                    <View style={[cp.rowAccent, { backgroundColor: enabled ? EVENING_ACCENT : 'transparent' }]} />
                    <TouchableOpacity onPress={() => toggle(c.id)} style={cp.rowCheck}>
                      {enabled
                        ? <CheckSquare size={19} color={EVENING_ACCENT} strokeWidth={2} />
                        : <Square      size={19} color={WHITE_22}       strokeWidth={1.5} />}
                    </TouchableOpacity>
                    <View style={cp.rowText}>
                      <Text style={cp.rowArabic} numberOfLines={2}>{c.arabic}</Text>
                      <Text style={cp.rowTranslit} numberOfLines={1}>{c.translation}</Text>
                    </View>
                    <Text style={[cp.countBtnNum, { color: EVENING_ACCENT, marginRight: 8 }]}>{c.count}×</Text>
                    <TouchableOpacity onPress={() => deleteCustom(c.id)} style={cp.deleteBtn}>
                      <Trash2 size={15} color="#C45A5A" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </>
          )}

          <View style={{ marginTop: 24 }}>
            {!showAdd ? (
              <TouchableOpacity onPress={() => setShowAdd(true)} style={[cp.addBtn, { borderColor: `${accent}30` }]}>
                <Plus size={16} color={accent} />
                <Text style={[cp.addBtnText, { color: accent }]}>Add a custom dhikr</Text>
              </TouchableOpacity>
            ) : (
              <View style={[cp.addForm, { borderColor: `${accent}22`, backgroundColor: `${accent}05` }]}>
                <Text style={cp.addFormTitle}>New dhikr</Text>
                {fieldDefs.map(f => (
                  <View key={f.key}>
                    <Text style={cp.fieldLabel}>{f.label}</Text>
                    <TextInput
                      value={newAzkar[f.key]}
                      onChangeText={v => setNewAzkar(p => ({ ...p, [f.key]: v }))}
                      multiline={f.multiline}
                      placeholder={f.placeholder}
                      placeholderTextColor={WHITE_22}
                      style={[
                        cp.fieldInput,
                        f.rtl    && { textAlign: 'right', fontSize: 18 },
                        f.italic && { fontStyle: 'italic' },
                      ]}
                    />
                  </View>
                ))}
                <Text style={cp.fieldLabel}>Number of repetitions</Text>
                <TextInput
                  value={newAzkar.count}
                  onChangeText={v => setNewAzkar(p => ({ ...p, count: v }))}
                  keyboardType="number-pad"
                  style={[cp.fieldInput, { width: 90, textAlign: 'center', fontSize: 20, fontWeight: '700', marginBottom: 20 }]}
                />
                <View style={cp.addFormBtns}>
                  <TouchableOpacity onPress={() => setShowAdd(false)} style={cp.cancelBtn}>
                    <Text style={cp.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={addCustom} style={[cp.confirmBtn, { backgroundColor: `${accent}20`, borderColor: `${accent}40` }]}>
                    <Text style={[cp.confirmBtnText, { color: accent }]}>Add</Text>
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
  root:          { flex: 1, backgroundColor: '#060608' },
  header:        { paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingBottom: 14, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: WHITE_06 },
  headerBack:    { padding: 4, width: 36 },
  headerCenter:  { flex: 1, alignItems: 'center' },
  headerTitle:   { color: WHITE_90, fontSize: 15, fontWeight: '700' },
  headerSub:     { fontSize: 11, marginTop: 2, fontWeight: '600' },
  saveBtn:       { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1 },
  saveBtnText:   { fontSize: 13, fontWeight: '700' },
  scroll:        { padding: 20, paddingBottom: 60 },
  bulkRow:       { flexDirection: 'row', gap: 10, marginBottom: 20 },
  bulkBtn:       { flex: 1, paddingVertical: 10, borderRadius: 18, borderWidth: 1, alignItems: 'center' },
  bulkBtnText:   { fontSize: 12, fontWeight: '700' },
  sectionRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionLine:   { flex: 1, height: 1 },
  sectionTitle:  { color: WHITE_22, fontSize: 9, fontWeight: '800', letterSpacing: 2.5 },
  row:           { flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderRadius: 14, overflow: 'hidden', borderWidth: 1 },
  rowAccent:     { width: 3, alignSelf: 'stretch' },
  rowCheck:      { paddingHorizontal: 12, paddingVertical: 14 },
  rowText:       { flex: 1, paddingVertical: 12, paddingRight: 8, gap: 3 },
  rowArabic:     { color: WHITE_90, fontSize: 15, fontWeight: '300', lineHeight: 24 },
  rowTranslit:   { color: WHITE_22, fontSize: 11 },
  rowMeta:       { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  rowDot:        { width: 5, height: 5, borderRadius: 2.5 },
  rowCategory:   { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  countBtn:      { alignItems: 'center', justifyContent: 'center', width: 50, height: 50, borderRadius: 25, borderWidth: 1.5, marginRight: 12 },
  countBtnNum:   { fontSize: 17, fontWeight: '700' },
  countBtnLabel: { color: WHITE_22, fontSize: 9 },
  countInput:    { fontSize: 18, fontWeight: '700', backgroundColor: WHITE_06, borderRadius: 10, padding: 8, width: 56, textAlign: 'center', borderWidth: 1.5, marginRight: 12 },
  deleteBtn:     { padding: 12 },
  addBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: 18, borderWidth: 1.5, borderStyle: 'dashed', backgroundColor: WHITE_03 },
  addBtnText:    { fontSize: 14, fontWeight: '700' },
  addForm:       { borderRadius: 18, borderWidth: 1, padding: 18 },
  addFormTitle:  { color: WHITE_90, fontSize: 15, fontWeight: '700', marginBottom: 16 },
  fieldLabel:    { color: WHITE_40, fontSize: 11, marginBottom: 6 },
  fieldInput:    { color: WHITE_90, fontSize: 14, lineHeight: 22, borderWidth: 1, borderColor: WHITE_10, borderRadius: 10, padding: 11, marginBottom: 12, backgroundColor: WHITE_06 },
  addFormBtns:   { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn:     { flex: 1, paddingVertical: 13, borderRadius: 18, borderWidth: 1, borderColor: WHITE_10, alignItems: 'center' },
  cancelBtnText: { color: WHITE_40, fontSize: 13 },
  confirmBtn:    { flex: 2, paddingVertical: 13, borderRadius: 18, borderWidth: 1, alignItems: 'center' },
  confirmBtnText:{ fontSize: 13, fontWeight: '700' },
});

// ─── COMPLETION SCREEN ─────────────────────────────────────────────────────────

const CompletionScreen = memo(({ period, count, total, onRestart, onChangeSession, onBack }: {
  period: AzkarPeriod; count: number; total: number;
  onRestart: () => void; onChangeSession: () => void; onBack: () => void;
}) => {
  const ring1   = useRef(new Animated.Value(0)).current;
  const ring2   = useRef(new Animated.Value(0)).current;
  const fade    = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0.75)).current;
  const btnFade = useRef(new Animated.Value(0)).current;

  const isMorning = period === 'morning';
  const accent    = isMorning ? MORNING_ACCENT : EVENING_ACCENT;
  const pct       = total > 0 ? Math.round((count / total) * 100) : 0;

  useEffect(() => {
    haptic('success');
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 7,  useNativeDriver: true }),
        Animated.timing(fade,  { toValue: 1, duration: 480, useNativeDriver: true }),
      ]),
      Animated.timing(btnFade, { toValue: 1, duration: 380, useNativeDriver: true }),
    ]).start();
    Animated.loop(Animated.sequence([
      Animated.timing(ring1, { toValue: 0.38, duration: 2800, useNativeDriver: true }),
      Animated.timing(ring1, { toValue: 0.08, duration: 2800, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(ring2, { toValue: 0.22, duration: 2800, delay: 1400, useNativeDriver: true }),
      Animated.timing(ring2, { toValue: 0.06, duration: 2800, useNativeDriver: true }),
    ])).start();
  }, []);

  return (
    <LinearGradient
      colors={isMorning ? [MORNING_BG1, MORNING_BG2, MORNING_BG1] : [EVENING_BG1, EVENING_BG2, EVENING_BG1]}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" />

      {[ring1, ring2].map((a, i) => (
        <Animated.View key={i} pointerEvents="none" style={{
          position: 'absolute',
          width: W * (0.75 + i * 0.55), height: W * (0.75 + i * 0.55),
          borderRadius: W * (0.375 + i * 0.275),
          borderWidth: 1, borderColor: GREEN,
          top: H * 0.5 - W * (0.375 + i * 0.275),
          left: W * 0.5 - W * (0.375 + i * 0.275),
          opacity: a,
        }} />
      ))}

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Animated.View style={{ alignItems: 'center', opacity: fade, transform: [{ scale }] }}>
          <View style={{
            width: 88, height: 88, borderRadius: 44,
            backgroundColor: GREEN_BG,
            borderWidth: 1.5, borderColor: GREEN,
            alignItems: 'center', justifyContent: 'center', marginBottom: 24,
          }}>
            <Check size={38} color={GREEN} strokeWidth={2} />
          </View>

          <Text style={{ color: accent, fontSize: 10, fontWeight: '800', letterSpacing: 6, textTransform: 'uppercase', marginBottom: 8 }}>
            الحمد لله
          </Text>
          <Text style={{ color: WHITE_90, fontSize: 25, fontWeight: '200', textAlign: 'center', marginBottom: 6, lineHeight: 36 }}>
            {isMorning ? 'Morning Adhkar\ncompleted' : 'Evening Adhkar\ncompleted'}
          </Text>
          <Text style={{ color: WHITE_40, fontSize: 13, textAlign: 'center', lineHeight: 22, marginBottom: 34 }}>
            May Allah accept your dhikr.
          </Text>

          <View style={{ flexDirection: 'row', gap: 0, marginBottom: 42, borderWidth: 1, borderColor: WHITE_06, borderRadius: 20, overflow: 'hidden' }}>
            {[
              { n: String(count),  l: 'completed' },
              { n: `${pct}%`,      l: 'success'   },
              { n: String(total),  l: 'total'      },
            ].map((s, idx) => (
              <View key={s.l} style={{
                alignItems: 'center', gap: 4,
                paddingVertical: 16, paddingHorizontal: 22,
                borderRightWidth: idx < 2 ? 1 : 0, borderRightColor: WHITE_06,
                backgroundColor: WHITE_03,
              }}>
                <Text style={{ color: accent, fontSize: 22, fontWeight: '700' }}>{s.n}</Text>
                <Text style={{ color: WHITE_22, fontSize: 9, letterSpacing: 1.5 }}>{s.l.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: btnFade, width: '100%', gap: 10 }}>
          <TouchableOpacity onPress={onRestart} style={{
            paddingVertical: 15, borderRadius: 50, borderWidth: 1,
            borderColor: `${accent}38`, backgroundColor: `${accent}12`,
            alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
          }}>
            <RotateCcw size={14} color={accent} />
            <Text style={{ color: accent, fontSize: 14, fontWeight: '700' }}>Restart</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onChangeSession} style={{
            paddingVertical: 15, borderRadius: 50, borderWidth: 1,
            borderColor: WHITE_10, backgroundColor: WHITE_06,
            alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
          }}>
            {isMorning
              ? <Moon size={14} color={EVENING_ACCENT} />
              : <Sun  size={14} color={MORNING_ACCENT} />}
            <Text style={{ color: WHITE_40, fontSize: 14, fontWeight: '600' }}>
              {isMorning ? 'Evening Adhkar' : 'Morning Adhkar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onBack} style={{ paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ color: WHITE_22, fontSize: 13 }}>Back to home</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
});

// ─── MAIN SCREEN ───────────────────────────────────────────────────────────────

export default function AzkarsScreen() {
  const router = useRouter();
  const { period: periodParam } = useLocalSearchParams<{ period?: AzkarPeriod }>();
  const routePeriod: AzkarPeriod | undefined =
    periodParam === 'morning' || periodParam === 'evening' ? periodParam : undefined;

  const [selectedPeriod, setSelectedPeriod] = useState<AzkarPeriod>(routePeriod ?? 'morning');
  const period    = selectedPeriod;
  const isMorning = period === 'morning';
  const accent    = isMorning ? MORNING_ACCENT : EVENING_ACCENT;

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
    () => new Set(AZKARS.filter(a => a.period.includes(period)).map(a => a.id)),
    [period]
  );

  const [prefs, setPrefs] = useState<UserPrefs>({
    enabledIds: new Set(allStandardIds),
    customCounts: {},
    customAzkars: [],
  });
  const [counts, setCounts]               = useState<Record<string, number>>({});
  const [showCustomize, setShowCustomize] = useState(false);

  const activeAzkars = useMemo(() => {
    const standard = AZKARS.filter(a => a.period.includes(period) && prefs.enabledIds.has(a.id));
    const custom   = prefs.customAzkars.filter(c => c.period.includes(period) && prefs.enabledIds.has(c.id));
    return [...standard, ...custom];
  }, [period, prefs]);

  const resetCounts = useCallback(() => {
    const init: Record<string, number> = {};
    activeAzkars.forEach(a => { init[a.id] = 0; });
    setCounts(init);
  }, [activeAzkars]);

  useEffect(() => { resetCounts(); }, [activeAzkars]);

  const currentAzkar   = activeAzkars[currentIndex] ?? null;
  const userCount      = currentAzkar
    ? (prefs.customCounts[currentAzkar.id] ?? ('isCustom' in currentAzkar ? (currentAzkar as CustomAzkar).count : (currentAzkar as Azkar).defaultCount))
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

  const completedInSession = useMemo(() => activeAzkars.filter(a => {
    const target = prefs.customCounts[a.id] ?? ('isCustom' in a ? (a as CustomAzkar).count : (a as Azkar).defaultCount);
    return (counts[a.id] ?? 0) >= target;
  }).length, [activeAzkars, counts, prefs.customCounts]);

  // ── Phases ──
  if (phase === 'selector') {
    return <SessionSelector onSelect={(p) => { setSelectedPeriod(p); setPhase('opening'); }} onBack={() => router.back()} />;
  }

  if (showCustomize) {
    return (
      <Modal visible animationType="slide" presentationStyle="fullScreen">
        <CustomizationPage
          prefs={prefs} period={period}
          onUpdate={(p) => { setPrefs(p); resetCounts(); setCurrentIndex(0); }}
          onClose={() => setShowCustomize(false)}
        />
      </Modal>
    );
  }

  if (phase === 'opening') {
    return (
      <OpeningCeremony
        period={period}
        onEnter={() => setPhase('session')}
        onChangePeriod={() => setPhase('selector')}
        onBack={() => setPhase('selector')}
      />
    );
  }

  if (phase === 'complete') {
    return (
      <CompletionScreen
        period={period}
        count={completedInSession}
        total={activeAzkars.length}
        onRestart={handleRestart}
        onChangeSession={() => { setPhase('selector'); }}
        onBack={() => router.back()}
      />
    );
  }

  // ── Session ──
  return (
    <LinearGradient
      colors={isMorning ? [MORNING_BG1, MORNING_BG2, MORNING_BG1] : [EVENING_BG1, EVENING_BG2, EVENING_BG1]}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <View style={ms.header}>
        <TouchableOpacity onPress={() => setPhase('opening')} style={ms.headerBtn}>
          <ChevronLeft size={21} color={WHITE_40} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => { haptic('light'); setPhase('selector'); }}
          style={[ms.headerCenter, { borderColor: `${accent}28`, backgroundColor: `${accent}0C` }]}
        >
          {isMorning ? <Sun size={11} color={accent} /> : <Moon size={11} color={accent} />}
          <Text style={[ms.headerSession, { color: accent }]}>{isMorning ? 'Al-Sabah' : 'Al-Masa'}</Text>
          <Text style={ms.headerProgress}>{currentIndex + 1} / {activeAzkars.length}</Text>
        </TouchableOpacity>

        <View style={ms.headerRight}>
          <TouchableOpacity onPress={handleReset} style={ms.headerBtn}>
            <RotateCcw size={16} color={WHITE_22} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowCustomize(true)} style={ms.headerBtn}>
            <Settings size={18} color={WHITE_40} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Progress bar ── */}
      <ProgressBar
        current={completedInSession}
        total={activeAzkars.length}
        color={accent}
      />

      {/* ── Azkar Card ── */}
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
          period={period}
          allAzkars={activeAzkars}
        />
      )}
    </LinearGradient>
  );
}

const ms = StyleSheet.create({
  header:        { paddingTop: Platform.OS === 'ios' ? 56 : 36, paddingHorizontal: 12, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: WHITE_06 },
  headerBtn:     { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 19 },
  headerCenter:  { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, borderWidth: 1 },
  headerSession: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  headerProgress:{ color: WHITE_22, fontSize: 11, marginLeft: 4 },
  headerRight:   { flexDirection: 'row', gap: 0 },
});