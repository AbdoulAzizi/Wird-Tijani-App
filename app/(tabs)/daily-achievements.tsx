import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import {
  CheckCircle2, Circle, Flame, Star, Heart, Users,
  ChevronLeft, ChevronRight, Sparkles, Moon, Sun, BarChart2,
} from 'lucide-react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { useApp, getTodayDate, countForDate } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import SectionLabel from '../../components/SectionLabel';

const { width } = Dimensions.get('window');

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

const isFriday = (): boolean => new Date().getDay() === 5;
const getDayName = (): string =>
  ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
const getFormattedDate = (): string =>
  new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
const getGreetingArabic = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'صَبَاحُ الخَيْر';
  if (h < 18) return 'نَهَارُكَ مُبَارَك';
  return 'مَسَاءُ الخَيْر';
};

type LucideIcon = React.ComponentType<{ color: string; size: number; strokeWidth?: number }>;

interface Practice {
  id: string;
  label: string;
  arabicLabel: string;
  Icon: LucideIcon;
  color: string;
  bgColor: string;
  isFullyDone: boolean;    // fully done today (all required completions)
  isActive: boolean;
  completions: number;     // how many times done today
  target: number;          // required times per day
}

// ── Progress Ring ──────────────────────────────────────────────────────────────
function ProgressRing({ pct }: { pct: number }) {
  const SIZE = 104, STROKE = 8;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const cx = SIZE / 2, cy = SIZE / 2;
  return (
    <View style={{ width: SIZE, height: SIZE, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
        <SvgCircle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={STROKE} />
        <SvgCircle cx={cx} cy={cy} r={R} fill="none" stroke="#FFFFFF" strokeWidth={STROKE}
          strokeDasharray={`${CIRC}`} strokeDashoffset={CIRC - (pct / 100) * CIRC}
          strokeLinecap="round" transform={`rotate(-90, ${cx}, ${cy})`} />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text style={ringStyles.num}>{pct}</Text>
        <Text style={ringStyles.label}>%</Text>
      </View>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  num:   { fontSize: 24, fontWeight: '900', color: '#FFFFFF', lineHeight: 26 },
  label: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.75)', letterSpacing: 1, textTransform: 'uppercase' },
});

// ── Practice Card ──────────────────────────────────────────────────────────────
const PracticeCard = ({ p, index }: { p: Practice; index: number }) => {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 380, delay: 200 + index * 90, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 380, delay: 200 + index * 90, useNativeDriver: true }),
    ]).start();
  }, []);

  const { isFullyDone, isActive, color } = p;
  const IconComp = p.Icon;
  const showProgress = p.target > 1;

  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
      <View style={[styles.cardShadow, !isActive && { opacity: 0.45 }, isFullyDone && { shadowColor: color, shadowOpacity: 0.13 }]}>
        <View style={[styles.practiceCard, isFullyDone && { borderColor: color + '28' }]}>

          <View style={[styles.cardBar, { backgroundColor: isFullyDone ? color : '#D1D5DB' }]} />

          <View style={[styles.cardIconWrap, { backgroundColor: isFullyDone ? color : '#E5E7EB' }]}>
            {isActive
              ? <IconComp color={isFullyDone ? '#FFFFFF' : '#9CA3AF'} size={20} strokeWidth={2} />
              : <Moon color="#9CA3AF" size={18} strokeWidth={2} />
            }
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.cardArabic}>{p.arabicLabel}</Text>
            <Text style={[styles.cardLabel, isFullyDone && { color }]}>{p.label}</Text>

            {/* Frequency progress */}
            {isActive && showProgress && (
              <View style={styles.freqRow}>
                {Array.from({ length: p.target }).map((_, i) => (
                  <View key={i} style={[
                    styles.freqDot,
                    { backgroundColor: i < p.completions ? color : '#E5E7EB' },
                  ]} />
                ))}
                <Text style={[styles.freqText, { color: isFullyDone ? color : '#9CA3AF' }]}>
                  {Math.min(p.completions, p.target)}/{p.target}×
                </Text>
              </View>
            )}

            {isActive && !showProgress && isFullyDone && (
              <Text style={[styles.cardNote, { color }]}>Done for today ✓</Text>
            )}

            {!isActive && (
              <Text style={styles.cardNote}>
                {p.id === 'hadra' ? 'Fridays only' : 'Not active today'}
              </Text>
            )}
          </View>

          <View style={styles.cardChip}>
            {isFullyDone ? (
              <View style={[styles.chipDone, { backgroundColor: color + '15', borderColor: color + '30' }]}>
                <CheckCircle2 color={color} size={13} strokeWidth={2.5} />
                <Text style={[styles.chipDoneText, { color }]}>Done</Text>
              </View>
            ) : isActive ? (
              <View style={styles.chipPending}>
                <Circle color="#D1D5DB" size={13} strokeWidth={2} />
                <Text style={styles.chipPendingText}>
                  {showProgress ? `${p.completions}/${p.target}` : 'Pending'}
                </Text>
              </View>
            ) : (
              <View style={styles.chipInactive}>
                <Moon color="#9CA3AF" size={13} strokeWidth={2} />
              </View>
            )}
          </View>

        </View>
      </View>
    </Animated.View>
  );
};

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function DailyAchievementsScreen() {
  const {
    state,
    isWirdFullyDoneToday, isWazifaFullyDoneToday, isHadraFullyDoneToday,
    wirdCompletionsToday, wazifaCompletionsToday, hadraCompletionsToday,
  } = useApp();

  const today  = getTodayDate();
  const friday = isFriday();
  const { frequencySettings } = state;

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

  const practices: Practice[] = [
    {
      id: 'wird',
      label: 'Wird Tijāni',
      arabicLabel: 'الوِرد التجاني',
      Icon: Heart,
      color: '#DC2626',
      bgColor: '#FEE2E2',
      isFullyDone: isWirdFullyDoneToday,
      isActive: true,
      completions: wirdCompletionsToday,
      target: frequencySettings.wirdPerDay,
    },
    {
      id: 'wazifa',
      label: 'Wazīfa Tijāniyya',
      arabicLabel: 'الوَظِيفَة',
      Icon: Star,
      color: '#D97706',
      bgColor: '#FEF3C7',
      isFullyDone: isWazifaFullyDoneToday,
      isActive: true,
      completions: wazifaCompletionsToday,
      target: frequencySettings.wazifaPerDay,
    },
    {
      id: 'hadra',
      label: 'Ḥaḍratu-l-Jumūʿa',
      arabicLabel: 'حضرة الجمعة',
      Icon: Users,
      color: '#7C3AED',
      bgColor: '#EDE9FE',
      isFullyDone: isHadraFullyDoneToday,
      isActive: friday,
      completions: hadraCompletionsToday,
      target: frequencySettings.hadraPerDay,
    },
  ];

  const active         = practices.filter(p => p.isActive);
  const completedCount = active.filter(p => p.isFullyDone).length;
  const totalCount     = active.length;
  const pct            = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allDone        = completedCount === totalCount;
  const streak         = computeStreak(state.completedWirds);
  const streakMilestone = [7, 14, 30, 60, 90, 180, 365].find(m => streak < m) ?? 365;

  return (
    <View style={styles.root}>
      <ScreenBackground>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Hero */}
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
                <Text style={styles.heroSub}>
                  {allDone ? 'All practices done today' : `${totalCount - completedCount} remaining — keep going`}
                </Text>
                {friday && (
                  <View style={styles.fridayPill}>
                    <Text style={styles.fridayPillText}>🤲 Jumu'a Mubārak</Text>
                  </View>
                )}
                <View style={styles.heroStreakRow}>
                  <Flame color="rgba(255,255,255,0.85)" size={13} strokeWidth={2} />
                  <Text style={styles.heroStreakText}>{streak} day streak</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Practices */}
          <SectionLabel accentColor="#059669">Today's Practices</SectionLabel>
          {practices.map((p, i) => <PracticeCard key={p.id} p={p} index={i} />)}

          {/* Summary */}
          <SectionLabel accentColor="#EAB308">Summary</SectionLabel>
          <View style={styles.card}>
            {[
              { label: 'Practices completed',  value: `${completedCount}/${totalCount}`,                  color: '#059669' },
              { label: 'Wird today',            value: `${wirdCompletionsToday}/${frequencySettings.wirdPerDay}×`,   color: '#DC2626' },
              { label: 'Wazīfa today',          value: `${wazifaCompletionsToday}/${frequencySettings.wazifaPerDay}×`, color: '#D97706' },
              { label: 'Ḥaḍra today',
                value: !friday ? 'Not Friday' : `${hadraCompletionsToday}/${frequencySettings.hadraPerDay}×`,
                color: '#7C3AED' },
              { label: 'Current streak',        value: `${streak} day${streak !== 1 ? 's' : ''}`,         color: '#F97316' },
              { label: 'Next milestone',        value: `${streakMilestone} days`,                          color: '#6366F1' },
            ].map(({ label, value, color }) => (
              <View key={label} style={styles.statRow}>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={[styles.statValue, { color }]}>{value}</Text>
              </View>
            ))}
          </View>

          {/* Streak */}
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

          {/* Quote */}
          <SectionLabel accentColor="#7C3AED">Reflection</SectionLabel>
          <View style={styles.quoteCard}>
            <Sparkles color="#7C3AED" size={16} strokeWidth={2} />
            <Text style={styles.quoteArabic}>وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا</Text>
            <Text style={styles.quoteTranslation}>"And whoever fears Allah — He will make for him a way out"</Text>
            <Text style={styles.quoteRef}>— Quran 65:2</Text>
          </View>

          {/* Actions */}
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

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

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
  heroDivider:      { width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 16 },
  heroRight:        { flex: 1, gap: 4 },
  heroTitle:        { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  heroSub:          { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  heroProgressBg:   { height: 6, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden', marginBottom: 5 },
  heroProgressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 3 },
  heroMilestoneRow: { flexDirection: 'row', justifyContent: 'space-between' },
  heroMilestoneStart: { fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: '600' },
  heroMilestoneEnd:   { fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: '700' },
  greetingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20, alignSelf: 'flex-start', marginBottom: 4,
  },
  greetingText:   { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  fridayPill:     { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  fridayPillText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  heroStreakRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  heroStreakText:  { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 4, marginHorizontal: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  statRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  statLabel: { fontSize: 14, color: '#6B7280', flex: 1 },
  statValue: { fontSize: 15, fontWeight: '700' },

  cardShadow: {
    marginHorizontal: 16, marginBottom: 10, borderRadius: 14, backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.09, shadowRadius: 8, elevation: 3,
  },
  practiceCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: '#F3F4F6', backgroundColor: '#FFFFFF',
  },
  cardBar:      { width: 4, alignSelf: 'stretch', minHeight: 70 },
  cardIconWrap: {
    width: 44, height: 44, borderRadius: 11, justifyContent: 'center', alignItems: 'center',
    marginLeft: 12, flexShrink: 0, marginTop: 2,
  },
  cardBody:  { flex: 1, paddingHorizontal: 12, paddingVertical: 14 },
  cardArabic:{ fontSize: 10, color: '#9CA3AF', marginBottom: 2, fontWeight: '500' },
  cardLabel: { fontSize: 15, fontWeight: '700', color: '#111827', lineHeight: 20 },
  cardNote:  { fontSize: 10, color: '#9CA3AF', fontWeight: '500', marginTop: 2 },
  cardChip:  { paddingRight: 14 },

  // Frequency dots
  freqRow:   { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  freqDot:   { width: 8, height: 8, borderRadius: 4 },
  freqText:  { fontSize: 10, fontWeight: '700', marginLeft: 2 },

  chipDone: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5, borderWidth: 1,
  },
  chipDoneText:    { fontSize: 11, fontWeight: '800' },
  chipPending: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5,
  },
  chipPendingText: { fontSize: 11, fontWeight: '600', color: '#9CA3AF' },
  chipInactive: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center',
  },

  quoteCard: {
    marginHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20,
    alignItems: 'center', gap: 6, borderLeftWidth: 4, borderLeftColor: '#7C3AED',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  quoteArabic:      { fontSize: 16, textAlign: 'center', color: '#1F2937', lineHeight: 30, marginTop: 4 },
  quoteTranslation: { fontSize: 12, textAlign: 'center', color: '#6B7280', fontStyle: 'italic', lineHeight: 19 },
  quoteRef:         { fontSize: 10, color: '#7C3AED', fontWeight: '700', opacity: 0.6 },

  actionsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 20 },
  actionBtn:  { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 16, paddingVertical: 13 },
  actionBtnSecondary: { backgroundColor: 'rgba(0,0,0,0.35)' },
  actionBtnPrimary:   { backgroundColor: '#059669' },
  actionBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});