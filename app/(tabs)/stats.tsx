import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Flame, Trophy, Star, Award, BookOpen, Moon, Zap, TrendingUp, CheckCircle2, Lock } from 'lucide-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';
import { useApp, WIRD_TARGETS, WAZIFA_TARGETS, HADRA_TARGETS } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import SectionLabel from '../../components/SectionLabel';

const { width } = Dimensions.get('window');

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Calcule la streak réelle à partir d'un tableau de dates ISO (yyyy-mm-dd) */
function computeStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const unique = [...new Set(dates)].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // La streak doit commencer aujourd'hui ou hier
  if (unique[0] !== today && unique[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1]);
    const curr = new Date(unique[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

/** Nombre de completions dans les 7 derniers jours */
function countThisWeek(dates: string[]): number {
  const cutoff = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  return dates.filter(d => d >= cutoff).length;
}

// ─── Achievements ───────────────────────────────────────────────────────────

type LucideIcon = React.ComponentType<{ color: string; size: number }>;

interface Achievement {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  unlocked: boolean;
  progress: number;   // 0-100
  progressLabel: string;
  category: 'wird' | 'wazifa' | 'hadra' | 'streak';
}

function buildAchievements(
  totalWirds: number,
  totalWazifas: number,
  totalHadras: number,
  currentStreak: number,
  totalIstighfar: number,
  totalSalawat: number,
  totalTahlil: number,
): Achievement[] {
  const pct = (val: number, max: number) => Math.round(Math.min(val / max, 1) * 100);

  return [
    // ── Wird ──
    {
      id: 'first-wird',
      title: 'First Steps',
      description: 'Complete your first Wird',
      Icon: Star,
      unlocked: totalWirds >= 1,
      progress: pct(totalWirds, 1),
      progressLabel: `${Math.min(totalWirds, 1)}/1`,
      category: 'wird',
    },
    {
      id: 'wird-10',
      title: 'Dedicated Disciple',
      description: 'Complete 10 Wirds',
      Icon: BookOpen,
      unlocked: totalWirds >= 10,
      progress: pct(totalWirds, 10),
      progressLabel: `${Math.min(totalWirds, 10)}/10`,
      category: 'wird',
    },
    {
      id: 'wird-30',
      title: 'Spiritual Warrior',
      description: 'Complete 30 Wirds',
      Icon: Award,
      unlocked: totalWirds >= 30,
      progress: pct(totalWirds, 30),
      progressLabel: `${Math.min(totalWirds, 30)}/30`,
      category: 'wird',
    },
    {
      id: 'wird-100',
      title: 'A Hundred Days of Light',
      description: 'Complete 100 Wirds',
      Icon: Zap,
      unlocked: totalWirds >= 100,
      progress: pct(totalWirds, 100),
      progressLabel: `${Math.min(totalWirds, 100)}/100`,
      category: 'wird',
    },

    // ── Wazifa ──
    {
      id: 'first-wazifa',
      title: 'Community Member',
      description: 'Complete your first Friday Wazīfa',
      Icon: Star,
      unlocked: totalWazifas >= 1,
      progress: pct(totalWazifas, 1),
      progressLabel: `${Math.min(totalWazifas, 1)}/1`,
      category: 'wazifa',
    },
    {
      id: 'wazifa-5',
      title: 'Friday Faithful',
      description: 'Complete 5 Wazīfas',
      Icon: Trophy,
      unlocked: totalWazifas >= 5,
      progress: pct(totalWazifas, 5),
      progressLabel: `${Math.min(totalWazifas, 5)}/5`,
      category: 'wazifa',
    },
    {
      id: 'wazifa-20',
      title: 'Guardian of Rites',
      description: 'Complete 20 Wazīfas',
      Icon: Award,
      unlocked: totalWazifas >= 20,
      progress: pct(totalWazifas, 20),
      progressLabel: `${Math.min(totalWazifas, 20)}/20`,
      category: 'wazifa',
    },

    // ── Hadra ──
    {
      id: 'first-hadra',
      title: 'First Ḥaḍra',
      description: 'Complete your first Ḥaḍra',
      Icon: Moon,
      unlocked: totalHadras >= 1,
      progress: pct(totalHadras, 1),
      progressLabel: `${Math.min(totalHadras, 1)}/1`,
      category: 'hadra',
    },
    {
      id: 'hadra-10',
      title: 'Heart in Presence',
      description: 'Complete 10 Ḥaḍras',
      Icon: Moon,
      unlocked: totalHadras >= 10,
      progress: pct(totalHadras, 10),
      progressLabel: `${Math.min(totalHadras, 10)}/10`,
      category: 'hadra',
    },

    // ── Streak ──
    {
      id: 'streak-7',
      title: 'One Week Unbroken',
      description: 'Maintain a 7-day streak',
      Icon: Flame,
      unlocked: currentStreak >= 7,
      progress: pct(currentStreak, 7),
      progressLabel: `${Math.min(currentStreak, 7)}/7`,
      category: 'streak',
    },
    {
      id: 'streak-30',
      title: 'Steadfast Soul',
      description: 'Maintain a 30-day streak',
      Icon: Flame,
      unlocked: currentStreak >= 30,
      progress: pct(currentStreak, 30),
      progressLabel: `${Math.min(currentStreak, 30)}/30`,
      category: 'streak',
    },
    {
      id: 'streak-90',
      title: 'Three Months of Devotion',
      description: 'Maintain a 90-day streak',
      Icon: Flame,
      unlocked: currentStreak >= 90,
      progress: pct(currentStreak, 90),
      progressLabel: `${Math.min(currentStreak, 90)}/90`,
      category: 'streak',
    },

    // ── Dhikr cumulatif ──
    {
      id: 'istighfar-1000',
      title: '1,000 Istighfār',
      description: 'Recite Astaghfirullāh 1,000 times',
      Icon: TrendingUp,
      unlocked: totalIstighfar >= 1000,
      progress: pct(totalIstighfar, 1000),
      progressLabel: `${Math.min(totalIstighfar, 1000)}/1000`,
      category: 'wird',
    },
    {
      id: 'salawat-1000',
      title: '1,000 Ṣalawāt',
      description: 'Recite 1,000 prayers upon the Prophet ﷺ',
      Icon: Star,
      unlocked: totalSalawat >= 1000,
      progress: pct(totalSalawat, 1000),
      progressLabel: `${Math.min(totalSalawat, 1000)}/1000`,
      category: 'wird',
    },
  ];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProgressBar({ value, color = '#059669' }: { value: number; color?: string }) {
  return (
    <View style={styles.progressBarBg}>
      <View style={[styles.progressBarFill, { width: `${value}%` as any, backgroundColor: color }]} />
    </View>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  wird: '#059669',
  wazifa: '#EAB308',
  hadra: '#6366F1',
  streak: '#EF4444',
};

const CATEGORY_LABELS: Record<string, string> = {
  wird: 'Wird',
  wazifa: 'Wazīfa',
  hadra: 'Ḥaḍra',
  streak: 'Streak',
};

function AchievementCard({ a, isNew }: { a: Achievement; isNew: boolean }) {
  const color = CATEGORY_COLORS[a.category];
  const locked = !a.unlocked;
  const IconComponent = a.Icon;

  return (
    // Outer shadow wrapper — no overflow:hidden so shadow renders on Android
    <View style={[styles.achShadowWrap, locked && styles.achShadowWrapLocked]}>
      {/* Inner clip wrapper for border-radius clipping */}
      <View style={[styles.achievementCard, locked && styles.achievementCardLocked]}>

        {/* Left accent bar */}
        <View style={[styles.achievementBar, { backgroundColor: locked ? '#D1D5DB' : color }]} />

        {/* Main body */}
        <View style={styles.achievementInner}>

          {/* Icon square — solid fill */}
          <View style={[styles.achievementIconWrap, { backgroundColor: locked ? '#E5E7EB' : color }]}>
            {locked
              ? <Lock color="#9CA3AF" size={18} />
              : <IconComponent color="#FFFFFF" size={20} />
            }
          </View>

          {/* Text */}
          <View style={styles.achievementContent}>

            {/* Title + badges */}
            <View style={styles.achievementTitleRow}>
              <Text
                style={[styles.achievementTitle, locked && styles.achievementTitleLocked]}
                numberOfLines={1}
              >
                {a.title}
              </Text>
              <View style={styles.achievementBadgeRow}>
                {isNew && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
                {!locked && <CheckCircle2 color={color} size={15} />}
              </View>
            </View>

            {/* Description */}
            <Text
              style={[styles.achievementDescription, locked && styles.achievementDescLocked]}
              numberOfLines={2}
            >
              {a.description}
            </Text>

            {/* Progress bar */}
            <View style={styles.achProgressRow}>
              <View style={styles.achProgressTrack}>
                <View style={[
                  styles.achProgressFill,
                  { width: `${a.progress}%` as any, backgroundColor: locked ? '#C4C9D4' : color },
                ]} />
              </View>
              <Text style={[styles.achProgressLabel, { color: locked ? '#9CA3AF' : color }]}>
                {a.progressLabel}
              </Text>
            </View>

            {/* Category chip — inline, below progress */}
            <View style={styles.achievementFooter}>
              <View style={[styles.categoryChip, { backgroundColor: locked ? '#F3F4F6' : color + '18' }]}>
                <Text style={[styles.categoryChipText, { color: locked ? '#9CA3AF' : color }]}>
                  {CATEGORY_LABELS[a.category]}
                </Text>
              </View>
            </View>

          </View>
        </View>

      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function StatsScreen() {
  const { state, getWirdProgress, getWazifaProgress, getHadraProgress, getWazifaJawharaTarget } = useApp();

  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [confettiTarget, setConfettiTarget] = useState<string | null>(null);
  const [storedUnlocked, setStoredUnlocked] = useState<string[]>([]);

  // ── Computed stats ──────────────────────────────────────────────────────────
  const totalWirds   = state.completedWirds.length;
  const totalWazifas = state.completedWazifas.length;
  const totalHadras  = state.completedHadras.length;

  const currentStreak = useMemo(
    () => computeStreak(state.completedWirds),
    [state.completedWirds]
  );

  const wirdsThisWeek   = useMemo(() => countThisWeek(state.completedWirds),   [state.completedWirds]);
  const wazifasThisWeek = useMemo(() => countThisWeek(state.completedWazifas), [state.completedWazifas]);
  const hadrasThisWeek  = useMemo(() => countThisWeek(state.completedHadras),  [state.completedHadras]);

  // Cumulative dhikr totals
  const totalIstighfar   = totalWirds  * WIRD_TARGETS.istighfar    + totalWazifas * WAZIFA_TARGETS.istighfar;
  const totalSalawat     = totalWirds  * WIRD_TARGETS.salatFatih   + totalWazifas * WAZIFA_TARGETS.salatFatih1;
  const totalTahlil      = totalWirds  * WIRD_TARGETS.tahlil       + totalWazifas * WAZIFA_TARGETS.tahlil + totalHadras * state.hadraTargets.tahlil;
  const totalIsmuLlah    = totalHadras * state.hadraTargets.ismuLlah;
  const totalJawhara     = totalWazifas * getWazifaJawharaTarget();

  // In-progress dhikr (current session)
  const inProgressIstighfar  = state.wird.istighfar  + state.wazifa.istighfar;
  const inProgressSalawat    = state.wird.salatFatih + state.wazifa.salatFatih1;
  const inProgressTahlil     = state.wird.tahlil     + state.wazifa.tahlil + state.hadra.tahlil;

  const achievements = useMemo(
    () => buildAchievements(totalWirds, totalWazifas, totalHadras, currentStreak, totalIstighfar, totalSalawat, totalTahlil),
    [totalWirds, totalWazifas, totalHadras, currentStreak, totalIstighfar, totalSalawat, totalTahlil]
  );

  // ── Load persisted unlocks ──────────────────────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem('unlockedAchievements').then(raw => {
      if (raw) setStoredUnlocked(JSON.parse(raw));
    });
  }, []);

  // ── Detect new unlocks ──────────────────────────────────────────────────────
  useEffect(() => {
    const freshlyNew: string[] = [];
    achievements.forEach(a => {
      if (a.unlocked && !storedUnlocked.includes(a.id)) {
        freshlyNew.push(a.id);
      }
    });

    if (freshlyNew.length === 0) return;

    // Fire confetti for the first one, toast for all
    setConfettiTarget(freshlyNew[0]);
    freshlyNew.forEach(id => {
      const found = achievements.find(a => a.id === id);
      if (found) {
        Toast.show(`🎉 ${found.title} unlocked!`, {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
        });
      }
    });

    const updated = [...storedUnlocked, ...freshlyNew];
    setStoredUnlocked(updated);
    setNewlyUnlocked(prev => [...prev, ...freshlyNew]);
    AsyncStorage.setItem('unlockedAchievements', JSON.stringify(updated));
  }, [achievements, storedUnlocked]);

  // ── Streak ring ─────────────────────────────────────────────────────────────
  const streakMilestone = [7, 14, 30, 60, 90, 180, 365].find(m => currentStreak < m) ?? 365;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <ScreenBackground>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* ── Hero streak card ─── */}
          <View style={styles.heroCard}>
            <View style={styles.streakCircle}>
              <Flame color="#F97316" size={28} />
              <Text style={styles.streakNumber}>{currentStreak}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Day Streak</Text>
              <Text style={styles.heroSub}>Next milestone: {streakMilestone} days</Text>
              <ProgressBar
                value={Math.round((currentStreak / streakMilestone) * 100)}
                color="#F97316"
              />
            </View>
          </View>

          {/* ── Cette semaine ─── */}
          <SectionLabel accentColor="#6366F1">This Week</SectionLabel>
          <View style={styles.weekRow}>
            {[
              { label: 'Wirds',   count: wirdsThisWeek,   color: '#059669', icon: <BookOpen color="#059669" size={18} /> },
              { label: 'Wazīfas', count: wazifasThisWeek, color: '#EAB308', icon: <Star color="#EAB308" size={18} /> },
              { label: 'Ḥaḍras',  count: hadrasThisWeek,  color: '#6366F1', icon: <Moon color="#6366F1" size={18} /> },
            ].map(({ label, count, color, icon }) => (
              <View key={label} style={styles.weekCard}>
                {icon}
                <Text style={[styles.weekCount, { color }]}>{count}</Text>
                <Text style={styles.weekLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {/* ── Progression en cours ─── */}
          <SectionLabel accentColor="#059669">Current Session</SectionLabel>
          <View style={styles.card}>
            {[
              { label: 'Wird',   progress: getWirdProgress(),   color: '#059669' },
              { label: 'Wazīfa', progress: getWazifaProgress(), color: '#EAB308' },
              { label: 'Ḥaḍra',  progress: getHadraProgress(),  color: '#6366F1' },
            ].map(({ label, progress, color }) => (
              <View key={label} style={styles.sessionRow}>
                <View style={styles.sessionLabelRow}>
                  <Text style={styles.sessionLabel}>{label}</Text>
                  <Text style={[styles.sessionPct, { color }]}>{Math.round(progress)}%</Text>
                </View>
                <ProgressBar value={progress} color={color} />
              </View>
            ))}
          </View>

          {/* ── Totaux cumulés ─── */}
          <SectionLabel accentColor="#EAB308">Cumulative Totals</SectionLabel>
          <View style={styles.card}>
            {[
              { label: 'Wirds completed',        value: totalWirds },
              { label: 'Wazīfas completed',      value: totalWazifas },
              { label: 'Ḥaḍras completed',       value: totalHadras },
              { label: 'Istighfār recited',       value: totalIstighfar + inProgressIstighfar },
              { label: 'Ṣalawāt recited',         value: totalSalawat + inProgressSalawat },
              { label: 'Tahlīl recited',          value: totalTahlil + inProgressTahlil },
              { label: 'Ismullāh recited',        value: totalIsmuLlah + state.hadra.ismuLlah },
              { label: state.wazifaSettings.useJawhara ? 'Jawharas recited' : 'Ṣalāt al-Fātiḥ (Wazīfa)', value: totalJawhara + state.wazifa.jawhara },
            ].map(({ label, value }) => (
              <View key={label} style={styles.statRow}>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={styles.statValue}>{value.toLocaleString('en-US')}</Text>
              </View>
            ))}
          </View>

          {/* ── Achievements ─── */}
          <SectionLabel accentColor="#F97316">Achievements</SectionLabel>

          {/* Summary */}
          <View style={styles.achieveSummaryRow}>
            {(['wird', 'wazifa', 'hadra', 'streak'] as const).map(cat => {
              const catAch = achievements.filter(a => a.category === cat);
              const earned = catAch.filter(a => a.unlocked).length;
              const color  = CATEGORY_COLORS[cat];
              return (
                <View key={cat} style={[styles.achieveSummaryCard, { borderTopColor: color }]}>
                  <Text style={[styles.achieveSummaryCount, { color }]}>{earned}/{catAch.length}</Text>
                  <Text style={styles.achieveSummaryLabel}>{CATEGORY_LABELS[cat]}</Text>
                </View>
              );
            })}
          </View>

          {/* Cards */}
          {achievements.map(a => (
            <View key={a.id}>
              <AchievementCard a={a} isNew={newlyUnlocked.includes(a.id)} />
              {confettiTarget === a.id && a.unlocked && (
                <ConfettiCannon count={60} origin={{ x: width / 2, y: 0 }} fadeOut />
              )}
            </View>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenBackground>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // Hero streak
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 20,
  },
  streakCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  streakNumber: { fontSize: 20, fontWeight: '800', color: '#F97316' },
  heroTitle: { fontSize: 16, fontWeight: '700', color: '#F9FAFB', marginBottom: 2 },
  heroSub: { fontSize: 12, color: '#9CA3AF', marginBottom: 8 },

  // Section label — now handled by SectionLabel component

  // Week cards
  weekRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16 },
  weekCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  weekCount: { fontSize: 22, fontWeight: '800' },
  weekLabel: { fontSize: 11, color: '#6B7280', fontWeight: '600' },

  // Generic card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  // Session progress
  sessionRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  sessionLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  sessionLabel: { fontSize: 14, fontWeight: '600', color: '#374151' },
  sessionPct: { fontSize: 13, fontWeight: '700' },

  // Stat rows
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statLabel: { fontSize: 14, color: '#6B7280', flex: 1 },
  statValue: { fontSize: 15, fontWeight: '700', color: '#1F2937' },

  // Progress bar (shared)
  progressBarBg: { flex: 1, height: 5, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  progressBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  progressBarLabel: { fontSize: 10, fontWeight: '700', minWidth: 38, textAlign: 'right' as const },

  // Achieve summary
  achieveSummaryRow: { flexDirection: 'row', gap: 8, marginHorizontal: 16, marginBottom: 12 },
  achieveSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  achieveSummaryCount: { fontSize: 16, fontWeight: '800' },
  achieveSummaryLabel: { fontSize: 10, color: '#6B7280', fontWeight: '600', marginTop: 2 },

  // Achievement cards
  // Shadow wrapper: no overflow:hidden so elevation works on Android
  achShadowWrap: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 3,
  },
  achShadowWrapLocked: {
    backgroundColor: '#F9FAFB',
    shadowOpacity: 0.03,
    elevation: 1,
  },
  // Inner card clips content to border radius
  achievementCard: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
  },
  achievementCardLocked: {
    // tint handled by shadow wrapper bg
  },
  achievementCardUnlocked: {},
  achievementBar: {
    width: 4,
    alignSelf: 'stretch',
    flexShrink: 0,
  },
  achievementTopBar: {},
  achievementInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },
  achievementIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  achievementContent: { flex: 1, minWidth: 0 },
  achievementTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  achievementTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  achievementTitleLocked: { color: '#6B7280' },
  achievementBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
    marginBottom: 7,
  },
  achievementDescLocked: { color: '#9CA3AF' },
  achievementFooter: {
    marginTop: 6,
  },
  achProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 0,
  },
  achProgressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  achProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achProgressLabel: {
    fontSize: 11,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'right' as const,
  },
  categoryChip: {
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  categoryChipText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.7,
  },
  newBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  // Kept for compat / future use
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryChipRow: {},
  lockedHint: {},
  achievementStripe: {},
  achievementHeaderRow: {},
  achievementMeta: {},
});