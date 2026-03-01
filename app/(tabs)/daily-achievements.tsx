import React, { useEffect, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import {
  CheckCircle2, Circle, Flame, Star, Heart, Users,
  ChevronLeft, ChevronRight, Sparkles, Moon, Sun,
  BarChart2, Clock,
} from 'lucide-react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { useApp, getTodayDate, countForDate } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import SectionLabel from '../../components/SectionLabel';
import { useContext } from 'react';
import MinimalHeader from '../../components/MinimalHeader';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';
import { formatElapsed } from '@/components/hooks/usePracticeTimer';

const { width } = Dimensions.get('window');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const unique = [...new Set(dates)].sort().reverse();
  const today     = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (unique[0] !== today && unique[0] !== yesterday) return 0;
  let s = 1;
  for (let i = 1; i < unique.length; i++) {
    const diff = (new Date(unique[i - 1]).getTime() - new Date(unique[i]).getTime()) / 86400000;
    if (diff === 1) s++; else break;
  }
  return s;
}

/** Sum durations for entries matching today's date */
function totalDurationForDate(durations: number[], dates: string[], date: string): number {
  return dates.reduce((acc, d, i) => d === date ? acc + (durations[i] ?? 0) : acc, 0);
}

const isFriday = (): boolean => new Date().getDay() === 5;

const getGreetingArabic = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'صَبَاحُ الخَيْر';
  if (h < 18) return 'نَهَارُكَ مُبَارَك';
  return 'مَسَاءُ الخَيْر';
};

const getFormattedDate = (): string =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

type LucideIcon = React.ComponentType<{ color: string; size: number; strokeWidth?: number }>;

interface Practice {
  id:           string;
  label:        string;
  arabicLabel:  string;
  Icon:         LucideIcon;
  color:        string;
  isFullyDone:  boolean;
  isActive:     boolean;
  completions:  number;
  target:       number;
  /** Total session time today in seconds (0 if none recorded) */
  durationSecs: number;
}

// ─── Progress Ring ─────────────────────────────────────────────────────────────

function ProgressRing({ pct }: { pct: number }) {
  const SIZE = 104, STROKE = 8;
  const R    = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const cx   = SIZE / 2, cy = SIZE / 2;
  return (
    <View style={{ width: SIZE, height: SIZE, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
        <SvgCircle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={STROKE} />
        <SvgCircle cx={cx} cy={cy} r={R} fill="none" stroke="#FFFFFF" strokeWidth={STROKE}
          strokeDasharray={`${CIRC}`}
          strokeDashoffset={CIRC - (pct / 100) * CIRC}
          strokeLinecap="round"
          transform={`rotate(-90, ${cx}, ${cy})`}
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text style={ring.num}>{pct}</Text>
        <Text style={ring.label}>%</Text>
      </View>
    </View>
  );
}

const ring = StyleSheet.create({
  num:   { fontSize: 24, fontWeight: '900', color: '#FFFFFF', lineHeight: 26 },
  label: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.75)', letterSpacing: 1, textTransform: 'uppercase' },
});

// ─── Practice Card ─────────────────────────────────────────────────────────────

const PracticeCard = React.memo(({ p, index, dark }: { p: Practice; index: number; dark: boolean }) => {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 380, delay: 200 + index * 90, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 380, delay: 200 + index * 90, useNativeDriver: true }),
    ]).start();
  }, []);

  const { isFullyDone, isActive, color, durationSecs } = p;
  const IconComp   = p.Icon;
  const showFreq   = p.target > 1;
  const hasDuration = durationSecs > 0;

  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
      <View style={[
        styles.cardShadow,
        dark && styles.cardShadowDark,
        !isActive && { opacity: 0.45 },
        isFullyDone && { shadowColor: color, shadowOpacity: 0.15 },
      ]}>
        <View style={[
          styles.practiceCard,
          dark && styles.practiceCardDark,
          isFullyDone && { borderColor: color + '30' },
        ]}>
          {/* Left accent bar */}
          <View style={[styles.cardBar, { backgroundColor: isFullyDone ? color : (dark ? '#334155' : '#D1D5DB') }]} />

          {/* Icon */}
          <View style={[
            styles.cardIconWrap,
            { backgroundColor: isFullyDone ? color : (dark ? '#334155' : '#E5E7EB') },
          ]}>
            {isActive
              ? <IconComp color={isFullyDone ? '#FFFFFF' : (dark ? '#94A3B8' : '#9CA3AF')} size={20} strokeWidth={2} />
              : <Moon     color={dark ? '#475569' : '#9CA3AF'} size={18} strokeWidth={2} />
            }
          </View>

          {/* Body */}
          <View style={styles.cardBody}>
            <Text style={[styles.cardArabic, dark && styles.cardArabicDark]}>{p.arabicLabel}</Text>
            <Text style={[styles.cardLabel, dark && styles.cardLabelDark, isFullyDone && { color }]}>
              {p.label}
            </Text>

            {/* Frequency dots */}
            {isActive && showFreq && (
              <View style={styles.freqRow}>
                {Array.from({ length: p.target }).map((_, i) => (
                  <View key={i} style={[
                    styles.freqDot,
                    { backgroundColor: i < p.completions ? color : (dark ? '#334155' : '#E5E7EB') },
                  ]} />
                ))}
                <Text style={[styles.freqText, { color: isFullyDone ? color : (dark ? '#64748B' : '#9CA3AF') }]}>
                  {Math.min(p.completions, p.target)}/{p.target}×
                </Text>
              </View>
            )}

            {/* Duration badge */}
            {isActive && hasDuration && (
              <View style={styles.durationRow}>
                <Clock color={isFullyDone ? color : (dark ? '#64748B' : '#9CA3AF')} size={10} strokeWidth={2.5} />
                <Text style={[styles.durationText, { color: isFullyDone ? color : (dark ? '#64748B' : '#9CA3AF') }]}>
                  {formatElapsed(durationSecs)}
                </Text>
              </View>
            )}

            {isActive && !showFreq && isFullyDone && !hasDuration && (
              <Text style={[styles.cardNote, { color }]}>Done for today ✓</Text>
            )}

            {!isActive && (
              <Text style={[styles.cardNote, dark && styles.cardNoteDark]}>
                {p.id === 'hadra' ? 'Fridays only' : 'Not active today'}
              </Text>
            )}
          </View>

          {/* Status chip */}
          <View style={styles.cardChip}>
            {isFullyDone ? (
              <View style={[styles.chipDone, { backgroundColor: color + '15', borderColor: color + '30' }]}>
                <CheckCircle2 color={color} size={13} strokeWidth={2.5} />
                <Text style={[styles.chipDoneText, { color }]}>Done</Text>
              </View>
            ) : isActive ? (
              <View style={[styles.chipPending, dark && styles.chipPendingDark]}>
                <Circle color={dark ? '#475569' : '#D1D5DB'} size={13} strokeWidth={2} />
                <Text style={[styles.chipPendingText, dark && styles.chipPendingTextDark]}>
                  {showFreq ? `${p.completions}/${p.target}` : 'Pending'}
                </Text>
              </View>
            ) : (
              <View style={[styles.chipInactive, dark && styles.chipInactiveDark]}>
                <Moon color={dark ? '#475569' : '#9CA3AF'} size={13} strokeWidth={2} />
              </View>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

// ─── Summary Row ───────────────────────────────────────────────────────────────

function SummaryRow({ label, value, color, dark }: { label: string; value: string; color: string; dark: boolean }) {
  return (
    <View style={[styles.statRow, dark && styles.statRowDark]}>
      <Text style={[styles.statLabel, dark && styles.statLabelDark]}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function DailyAchievementsScreen() {
  const {
    state,
    isWirdFullyDoneToday, isWazifaFullyDoneToday, isHadraFullyDoneToday,
    wirdCompletionsToday, wazifaCompletionsToday, hadraCompletionsToday,
  } = useApp();

  const today  = getTodayDate();
  const friday = isFriday();
  const dark   = state.settings.darkMode;
  const { frequencySettings } = state;
  const { handleBack } = useContext(LayoutActionsContext);

  useRegisterHeaderActions('/daily-achievements', []);

  // ── Durations ────────────────────────────────────────────────────────────────
  const wirdDurationToday  = useMemo(() =>
    totalDurationForDate(state.wirdDurations ?? [],  state.completedWirds,  today), [state.wirdDurations,  state.completedWirds]);
  const wazifaDurationToday = useMemo(() =>
    totalDurationForDate(state.wazifaDurations ?? [], state.completedWazifas, today), [state.wazifaDurations, state.completedWazifas]);
  const hadraDurationToday  = useMemo(() =>
    totalDurationForDate(state.hadraDurations ?? [],  state.completedHadras,  today), [state.hadraDurations,  state.completedHadras]);

  const totalDurationToday = wirdDurationToday + wazifaDurationToday + hadraDurationToday;

  // ── Animations ───────────────────────────────────────────────────────────────
  const heroFade  = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(-14)).current;
  const ringScale = useRef(new Animated.Value(0.82)).current;
  const ringFade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade,  { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(heroSlide, { toValue: 0, duration: 480, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.delay(160),
      Animated.parallel([
        Animated.spring(ringScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(ringFade,  { toValue: 1, duration: 360, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  // ── Practices ────────────────────────────────────────────────────────────────
  const practices: Practice[] = [
    {
      id: 'wird', label: 'Wird Tijāni', arabicLabel: 'الوِرد التجاني',
      Icon: Heart, color: '#DC2626',
      isFullyDone: isWirdFullyDoneToday, isActive: true,
      completions: wirdCompletionsToday, target: frequencySettings.wirdPerDay,
      durationSecs: wirdDurationToday,
    },
    {
      id: 'wazifa', label: 'Wazīfa Tijāniyya', arabicLabel: 'الوَظِيفَة',
      Icon: Star, color: '#D97706',
      isFullyDone: isWazifaFullyDoneToday, isActive: true,
      completions: wazifaCompletionsToday, target: frequencySettings.wazifaPerDay,
      durationSecs: wazifaDurationToday,
    },
    {
      id: 'hadra', label: 'Ḥaḍratu-l-Jumūʿa', arabicLabel: 'حضرة الجمعة',
      Icon: Users, color: '#7C3AED',
      isFullyDone: isHadraFullyDoneToday, isActive: friday,
      completions: hadraCompletionsToday, target: frequencySettings.hadraPerDay,
      durationSecs: hadraDurationToday,
    },
  ];

  const active          = practices.filter(p => p.isActive);
  const completedCount  = active.filter(p => p.isFullyDone).length;
  const totalCount      = active.length;
  const pct             = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allDone         = completedCount === totalCount;
  const streak          = computeStreak(state.completedWirds);
  const streakMilestone = [7, 14, 30, 60, 90, 180, 365].find(m => streak < m) ?? 365;

  return (
    <View style={[styles.root, dark && styles.rootDark]}>
      <MinimalHeader
        title="Today's Practices"
        subtitle={allDone ? 'All done — Mā shā Allāh 🌿' : `${completedCount}/${totalCount} completed`}
        onBackPress={handleBack}
        showMore={false}
        theme="default"
      />
      <ScreenBackground>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* ── Hero ── */}
          <Animated.View style={{ opacity: heroFade, transform: [{ translateY: heroSlide }] }}>
            <View style={styles.heroCard}>
              <View style={styles.heroDecorCircle1} />
              <View style={styles.heroDecorCircle2} />

              <Animated.View style={{ opacity: ringFade, transform: [{ scale: ringScale }] }}>
                <ProgressRing pct={pct} />
              </Animated.View>

              <View style={styles.heroDivider} />

              <View style={styles.heroRight}>
                <View style={styles.greetingPill}>
                  <Sun color="rgba(255,255,255,0.9)" size={12} strokeWidth={2.5} />
                  <Text style={styles.greetingText}>{getGreetingArabic()}</Text>
                </View>
                <Text style={styles.heroTitle}>
                  {allDone ? 'Mā shā Allāh 🌿' : `${completedCount}/${totalCount} completed`}
                </Text>
                <Text style={styles.heroSub}>{getFormattedDate()}</Text>
                {friday && (
                  <View style={styles.fridayPill}>
                    <Text style={styles.fridayPillText}>🤲 Jumu'a Mubārak</Text>
                  </View>
                )}
                {/* Total time today */}
                {totalDurationToday > 0 && (
                  <View style={styles.heroTimeRow}>
                    <Clock color="rgba(255,255,255,0.8)" size={11} strokeWidth={2.5} />
                    <Text style={styles.heroTimeText}>{formatElapsed(totalDurationToday)} today</Text>
                  </View>
                )}
                <View style={styles.heroStreakRow}>
                  <Flame color="rgba(255,255,255,0.85)" size={13} strokeWidth={2} />
                  <Text style={styles.heroStreakText}>{streak} day streak</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* ── Practices ── */}
          <SectionLabel accentColor="#059669">Today's Practices</SectionLabel>
          {practices.map((p, i) => <PracticeCard key={p.id} p={p} index={i} dark={dark} />)}

          {/* ── Summary ── */}
          <SectionLabel accentColor="#EAB308">Summary</SectionLabel>
          <View style={[styles.card, dark && styles.cardDark]}>
            <SummaryRow dark={dark} label="Practices completed" value={`${completedCount}/${totalCount}`}       color="#059669" />
            <SummaryRow dark={dark} label="Wird today"          value={`${wirdCompletionsToday}/${frequencySettings.wirdPerDay}×`}    color="#DC2626" />
            {wirdDurationToday > 0 && (
              <SummaryRow dark={dark} label="Wird duration"     value={formatElapsed(wirdDurationToday)}        color="#DC2626" />
            )}
            <SummaryRow dark={dark} label="Wazīfa today"        value={`${wazifaCompletionsToday}/${frequencySettings.wazifaPerDay}×`} color="#D97706" />
            {wazifaDurationToday > 0 && (
              <SummaryRow dark={dark} label="Wazīfa duration"   value={formatElapsed(wazifaDurationToday)}      color="#D97706" />
            )}
            <SummaryRow dark={dark} label="Ḥaḍra today"
              value={!friday ? 'Not Friday' : `${hadraCompletionsToday}/${frequencySettings.hadraPerDay}×`}     color="#7C3AED" />
            {hadraDurationToday > 0 && (
              <SummaryRow dark={dark} label="Ḥaḍra duration"   value={formatElapsed(hadraDurationToday)}       color="#7C3AED" />
            )}
            {totalDurationToday > 0 && (
              <SummaryRow dark={dark} label="Total time today"  value={formatElapsed(totalDurationToday)}       color="#059669" />
            )}
            <SummaryRow dark={dark} label="Current streak"      value={`${streak} day${streak !== 1 ? 's' : ''}`} color="#F97316" />
            <SummaryRow dark={dark} label="Next milestone"      value={`${streakMilestone} days`}               color="#6366F1" />
          </View>

          {/* ── Streak ── */}
          <SectionLabel accentColor="#F97316">Streak Progress</SectionLabel>
          <View style={styles.heroCard}>
            <View style={[styles.heroDecorCircle1, { backgroundColor: 'rgba(255,255,255,0.06)' }]} />
            <View style={styles.heroLeft}>
              <View style={styles.heroIconRing}><Flame color="#FFFFFF" size={22} /></View>
              <Text style={styles.heroStreakNumber}>{streak}</Text>
              <Text style={styles.heroStreakLabel}>day{streak !== 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroRight}>
              <Text style={styles.heroTitle}>Current Streak</Text>
              <Text style={styles.heroSub}>
                {streak === 0 ? 'Start your streak today!' : `${streakMilestone - streak} days to next milestone`}
              </Text>
              <View style={styles.heroProgressBg}>
                <View style={[styles.heroProgressFill, { width: `${Math.round((streak / streakMilestone) * 100)}%` as any }]} />
              </View>
              <View style={styles.heroMilestoneRow}>
                <Text style={styles.heroMilestoneStart}>0</Text>
                <Text style={styles.heroMilestoneEnd}>🏆 {streakMilestone} days</Text>
              </View>
            </View>
          </View>

          {/* ── Quote ── */}
          <SectionLabel accentColor="#7C3AED">Reflection</SectionLabel>
          <View style={[styles.quoteCard, dark && styles.quoteCardDark]}>
            <Sparkles color="#7C3AED" size={16} strokeWidth={2} />
            <Text style={[styles.quoteArabic, dark && styles.quoteArabicDark]}>
              وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
            </Text>
            <Text style={[styles.quoteTranslation, dark && styles.quoteTranslationDark]}>
              "And whoever fears Allah — He will make for him a way out"
            </Text>
            <Text style={styles.quoteRef}>— Quran 65:2</Text>
          </View>

          {/* ── Actions ── */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]} onPress={() => router.back()} activeOpacity={0.8}>
              <View style={{ transform: [{ rotate: '180deg' }] }}>
                <ChevronLeft color="#FFFFFF" size={16} strokeWidth={2.5} />
              </View>
              <Text style={styles.actionBtnText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={() => router.push('/stats')} activeOpacity={0.8}>
              <BarChart2 color="#FFFFFF" size={16} strokeWidth={2.5} />
              <Text style={styles.actionBtnText}>Global Stats</Text>
              <ChevronRight color="#FFFFFF" size={16} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 48 }} />
        </ScrollView>
      </ScreenBackground>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:     { flex: 1 },
  rootDark: { backgroundColor: '#0F172A' },
  scroll:   { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // ── Hero ────────────────────────────────────────────────────────────────────
  heroCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#059669',
    borderRadius: 20, marginHorizontal: 16, marginTop: 12, padding: 20, overflow: 'hidden',
    shadowColor: '#059669', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  heroDecorCircle1: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -40, right: -20,
  },
  heroDecorCircle2: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.07)', bottom: -30, right: 60,
  },
  heroLeft: { alignItems: 'center', gap: 2, minWidth: 72 },
  heroIconRing: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  heroStreakNumber: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', lineHeight: 40 },
  heroStreakLabel:  { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: 1 },
  heroDivider:     { width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 16 },
  heroRight:       { flex: 1, gap: 4 },
  heroTitle:       { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  heroSub:         { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  heroProgressBg:  { height: 6, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden', marginBottom: 5 },
  heroProgressFill:{ height: '100%', backgroundColor: '#FFFFFF', borderRadius: 3 },
  heroMilestoneRow:  { flexDirection: 'row', justifyContent: 'space-between' },
  heroMilestoneStart:{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: '600' },
  heroMilestoneEnd:  { fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: '700' },
  greetingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20, alignSelf: 'flex-start', marginBottom: 4,
  },
  greetingText:    { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  fridayPill:      { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  fridayPillText:  { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  heroTimeRow:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroTimeText:    { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '700', fontVariant: ['tabular-nums'] },
  heroStreakRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  heroStreakText:  { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  // ── Practice cards ───────────────────────────────────────────────────────────
  cardShadow: {
    marginHorizontal: 16, marginBottom: 10, borderRadius: 14, backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.09, shadowRadius: 8, elevation: 3,
  },
  cardShadowDark: { backgroundColor: '#1E293B', shadowColor: '#000', shadowOpacity: 0.3 },
  practiceCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: '#F3F4F6', backgroundColor: '#FFFFFF',
  },
  practiceCardDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  cardBar:     { width: 4, alignSelf: 'stretch', minHeight: 70 },
  cardIconWrap:{
    width: 44, height: 44, borderRadius: 11, justifyContent: 'center', alignItems: 'center',
    marginLeft: 12, flexShrink: 0, marginTop: 2,
  },
  cardBody:    { flex: 1, paddingHorizontal: 12, paddingVertical: 14 },
  cardArabic:  { fontSize: 10, color: '#9CA3AF', marginBottom: 2, fontWeight: '500' },
  cardArabicDark: { color: '#475569' },
  cardLabel:   { fontSize: 15, fontWeight: '700', color: '#111827', lineHeight: 20 },
  cardLabelDark: { color: '#F1F5F9' },
  cardNote:    { fontSize: 10, color: '#9CA3AF', fontWeight: '500', marginTop: 2 },
  cardNoteDark:{ color: '#475569' },
  cardChip:    { paddingRight: 14 },
  freqRow:     { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  freqDot:     { width: 8, height: 8, borderRadius: 4 },
  freqText:    { fontSize: 10, fontWeight: '700', marginLeft: 2 },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  durationText:{ fontSize: 10, fontWeight: '700', fontVariant: ['tabular-nums'] },

  chipDone:        { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5, borderWidth: 1 },
  chipDoneText:    { fontSize: 11, fontWeight: '800' },
  chipPending:     { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5 },
  chipPendingDark: { backgroundColor: '#334155' },
  chipPendingText: { fontSize: 11, fontWeight: '600', color: '#9CA3AF' },
  chipPendingTextDark: { color: '#64748B' },
  chipInactive:    { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  chipInactiveDark:{ backgroundColor: '#334155' },

  // ── Summary card ─────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 4,
    marginHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardDark: { backgroundColor: '#1E293B' },
  statRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  statRowDark:  { borderBottomColor: '#334155' },
  statLabel:    { fontSize: 14, color: '#6B7280', flex: 1 },
  statLabelDark:{ color: '#94A3B8' },
  statValue:    { fontSize: 15, fontWeight: '700' },

  // ── Quote ────────────────────────────────────────────────────────────────────
  quoteCard: {
    marginHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20,
    alignItems: 'center', gap: 6, borderLeftWidth: 4, borderLeftColor: '#7C3AED',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  quoteCardDark:        { backgroundColor: '#1E293B' },
  quoteArabic:          { fontSize: 16, textAlign: 'center', color: '#1F2937', lineHeight: 30, marginTop: 4 },
  quoteArabicDark:      { color: '#F1F5F9' },
  quoteTranslation:     { fontSize: 12, textAlign: 'center', color: '#6B7280', fontStyle: 'italic', lineHeight: 19 },
  quoteTranslationDark: { color: '#94A3B8' },
  quoteRef:             { fontSize: 10, color: '#7C3AED', fontWeight: '700', opacity: 0.6 },

  // ── Actions ──────────────────────────────────────────────────────────────────
  actionsRow:          { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 20 },
  actionBtn:           { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 16, paddingVertical: 13 },
  actionBtnSecondary:  { backgroundColor: 'rgba(0,0,0,0.35)' },
  actionBtnPrimary:    { backgroundColor: '#059669' },
  actionBtnText:       { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});