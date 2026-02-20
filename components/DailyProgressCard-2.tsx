import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { CheckCircle2, Circle, Flame, TrendingUp } from 'lucide-react-native';
import { useApp, getTodayDate, countForDate } from '../contexts/AppContext';

const { width } = Dimensions.get('window');

interface DailyProgressCardProps {
  onPress: () => void;
  darkMode?: boolean;
}

const isFriday = (): boolean => new Date().getDay() === 5;

interface PracticeStatus {
  id: 'wird' | 'wazifa' | 'hadra';
  title: string;
  arabicTitle: string;
  isFullyDone: boolean;
  isActive: boolean;
  completions: number;
  target: number;
  color: string;
  bgColor: string;
}

const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
  onPress,
  darkMode = false,
}) => {
  const {
    state,
    isWirdFullyDoneToday,
    isWazifaFullyDoneToday,
    isHadraFullyDoneToday,
    wirdCompletionsToday,
    wazifaCompletionsToday,
    hadraCompletionsToday,
  } = useApp();

  const { frequencySettings } = state;
  const friday = isFriday();

  const practiceStatuses: PracticeStatus[] = useMemo(() => [
    {
      id: 'wird',
      title: 'Wird',
      arabicTitle: 'الوِرد',
      isFullyDone: isWirdFullyDoneToday,
      isActive: true,
      completions: wirdCompletionsToday,
      target: frequencySettings.wirdPerDay,
      color: '#DC2626',
      bgColor: '#FEE2E2',
    },
    {
      id: 'wazifa',
      title: 'Wazifa',
      arabicTitle: 'الوَظِيفَة',
      isFullyDone: isWazifaFullyDoneToday,
      isActive: true,
      completions: wazifaCompletionsToday,
      target: frequencySettings.wazifaPerDay,
      color: '#D97706',
      bgColor: '#FEF3C7',
    },
    {
      id: 'hadra',
      title: 'Hadra',
      arabicTitle: 'حضرة',
      isFullyDone: isHadraFullyDoneToday,
      isActive: friday,
      completions: hadraCompletionsToday,
      target: frequencySettings.hadraPerDay,
      color: '#7C3AED',
      bgColor: '#EDE9FE',
    },
  ], [
    isWirdFullyDoneToday, isWazifaFullyDoneToday, isHadraFullyDoneToday,
    wirdCompletionsToday, wazifaCompletionsToday, hadraCompletionsToday,
    frequencySettings, friday,
  ]);

  const stats = useMemo(() => {
    const active    = practiceStatuses.filter(p => p.isActive);
    const completed = active.filter(p => p.isFullyDone).length;
    const total     = active.length;
    const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, pct, allDone: completed === total && total > 0 };
  }, [practiceStatuses]);

  const streak = state.streak || 0;

  // ── Arc progress ring (pure RN — no SVG dep) ──
  // Simulated with a rotated border trick
  const ringBorderColor = stats.allDone ? '#10B981' : '#059669';

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={styles.wrapper}
    >
      <View style={[styles.card, darkMode && styles.cardDark]}>

        {/* ── TOP: greeting row ── */}
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.dayLabel, darkMode && styles.dayLabelDark]}>
              {friday ? "🕌 Jumu'a Mubarak" : 'Daily Practices'}
            </Text>
            <Text style={[styles.dateLabel, darkMode && styles.dateLabelDark]}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>

          {/* Streak pill */}
          <View style={[styles.streakPill, darkMode && styles.streakPillDark]}>
            <Flame color="#F97316" size={13} strokeWidth={2.5} />
            <Text style={styles.streakNum}>{streak}</Text>
            <Text style={[styles.streakText, darkMode && styles.streakTextDark]}>day</Text>
          </View>
        </View>

        {/* ── DIVIDER ── */}
        <View style={[styles.divider, darkMode && styles.dividerDark]} />

        {/* ── MIDDLE: ring + practice items ── */}
        <View style={styles.middleRow}>

          {/* Progress ring */}
          <View style={styles.ringWrap}>
            <View style={[
              styles.ringOuter,
              {
                borderColor: stats.pct === 100
                  ? '#10B981'
                  : darkMode ? '#334155' : '#E2E8F0',
              },
            ]}>
              {/* Filled arc simulation: background ring + foreground arc using overflow clip */}
              <View style={[styles.ringInner, darkMode && styles.ringInnerDark]}>
                <Text style={[
                  styles.ringPct,
                  { color: stats.pct === 100 ? '#10B981' : (darkMode ? '#10B981' : '#059669') },
                ]}>
                  {stats.pct}
                </Text>
                <Text style={[styles.ringSymbol, darkMode && styles.ringSymbolDark]}>%</Text>
              </View>
            </View>
            <Text style={[styles.ringLabel, darkMode && styles.ringLabelDark]}>
              {stats.completed}/{stats.total} done
            </Text>
          </View>

          {/* Practice pill list */}
          <View style={styles.pillsCol}>
            {practiceStatuses.map(p => {
              if (!p.isActive) return null;
              const showCount = p.target > 1;
              return (
                <View
                  key={p.id}
                  style={[
                    styles.practicePill,
                    darkMode && styles.practicePillDark,
                    p.isFullyDone && {
                      backgroundColor: darkMode ? p.color + '22' : p.bgColor,
                      borderColor: p.color + '40',
                    },
                  ]}
                >
                  {/* Icon */}
                  <View style={[
                    styles.pillIcon,
                    { backgroundColor: p.isFullyDone ? p.color : (darkMode ? '#334155' : '#F1F5F9') },
                  ]}>
                    {p.isFullyDone
                      ? <CheckCircle2 color="#FFFFFF" size={12} strokeWidth={3} />
                      : <Circle color={darkMode ? '#64748B' : '#CBD5E1'} size={12} strokeWidth={2} />
                    }
                  </View>

                  {/* Labels */}
                  <View style={styles.pillText}>
                    <Text style={[
                      styles.pillTitle,
                      darkMode && styles.pillTitleDark,
                      p.isFullyDone && { color: p.color },
                    ]}>
                      {p.title}
                    </Text>
                    <Text style={[styles.pillArabic, darkMode && styles.pillArabicDark]}>
                      {p.arabicTitle}
                    </Text>
                  </View>

                  {/* Right: frequency dots or check */}
                  <View style={styles.pillRight}>
                    {showCount ? (
                      <View style={styles.dotsRow}>
                        {Array.from({ length: p.target }).map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.dot,
                              {
                                backgroundColor: i < p.completions
                                  ? p.color
                                  : (darkMode ? '#334155' : '#E2E8F0'),
                              },
                            ]}
                          />
                        ))}
                      </View>
                    ) : p.isFullyDone ? (
                      <View style={[styles.doneBadge, { backgroundColor: p.color + '18' }]}>
                        <Text style={[styles.doneBadgeText, { color: p.color }]}>✓</Text>
                      </View>
                    ) : (
                      <View style={[styles.pendingBadge, darkMode && styles.pendingBadgeDark]}>
                        <Text style={[styles.pendingText, darkMode && styles.pendingTextDark]}>–</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── BOTTOM: progress bar + CTA ── */}
        <View style={styles.bottomRow}>
          <View style={styles.barWrap}>
            <View style={[styles.barTrack, darkMode && styles.barTrackDark]}>
              <View style={[
                styles.barFill,
                {
                  width: `${stats.pct}%`,
                  backgroundColor: stats.allDone ? '#10B981' : '#059669',
                },
              ]} />
            </View>
          </View>

          <View style={[
            styles.ctaChip,
            stats.allDone && styles.ctaChipDone,
            darkMode && !stats.allDone && styles.ctaChipDark,
          ]}>
            <TrendingUp
              color={stats.allDone ? '#FFFFFF' : (darkMode ? '#94A3B8' : '#64748B')}
              size={11}
              strokeWidth={2.5}
            />
            <Text style={[
              styles.ctaText,
              stats.allDone && styles.ctaTextDone,
              darkMode && !stats.allDone && styles.ctaTextDark,
            ]}>
              {stats.allDone ? 'All complete!' : 'View details'}
            </Text>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 16, marginTop: 12 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.08)',
    gap: 14,
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: 'rgba(16,185,129,0.15)',
    shadowOpacity: 0.25,
  },

  // ── Top row ──
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dayLabel:     { fontSize: 15, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  dayLabelDark: { color: '#F8FAFC' },
  dateLabel:    { fontSize: 11, color: '#94A3B8', marginTop: 2, fontWeight: '500' },
  dateLabelDark:{ color: '#64748B' },

  streakPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFF7ED', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: '#FED7AA',
  },
  streakPillDark: { backgroundColor: '#431407', borderColor: '#7C2D12' },
  streakNum:  { fontSize: 14, fontWeight: '800', color: '#F97316' },
  streakText: { fontSize: 10, fontWeight: '600', color: '#FB923C' },
  streakTextDark: { color: '#C2410C' },

  // ── Divider ──
  divider:     { height: 1, backgroundColor: '#F1F5F9' },
  dividerDark: { backgroundColor: '#273549' },

  // ── Middle row ──
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  // Ring
  ringWrap:      { alignItems: 'center', gap: 6 },
  ringOuter: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 5,
    justifyContent: 'center', alignItems: 'center',
  },
  ringInner: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  ringInnerDark: {},
  ringPct: { fontSize: 22, fontWeight: '900', lineHeight: 24 },
  ringSymbol:     { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginTop: -2 },
  ringSymbolDark: { color: '#64748B' },
  ringLabel:      { fontSize: 10, fontWeight: '600', color: '#94A3B8' },
  ringLabelDark:  { color: '#64748B' },

  // Practice pills
  pillsCol: { flex: 1, gap: 8 },
  practicePill: {
    flexDirection: 'row', alignItems: 'center', gap: 9,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8, paddingHorizontal: 10,
    borderWidth: 1, borderColor: 'transparent',
  },
  practicePillDark: { backgroundColor: '#0F172A', borderColor: '#1E293B' },

  pillIcon: {
    width: 22, height: 22, borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  pillText: { flex: 1, gap: 1 },
  pillTitle:     { fontSize: 12, fontWeight: '700', color: '#1E293B' },
  pillTitleDark: { color: '#F1F5F9' },
  pillArabic:    { fontSize: 10, color: '#94A3B8', fontWeight: '500' },
  pillArabicDark:{ color: '#475569' },

  pillRight: { flexShrink: 0, alignItems: 'flex-end' },
  dotsRow:   { flexDirection: 'row', gap: 4, alignItems: 'center' },
  dot:       { width: 8, height: 8, borderRadius: 4 },

  doneBadge:     { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  doneBadgeText: { fontSize: 11, fontWeight: '800' },

  pendingBadge:     { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, backgroundColor: '#F1F5F9' },
  pendingBadgeDark: { backgroundColor: '#334155' },
  pendingText:      { fontSize: 11, fontWeight: '700', color: '#CBD5E1' },
  pendingTextDark:  { color: '#475569' },

  // ── Bottom row ──
  bottomRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  barWrap: { flex: 1 },
  barTrack: {
    height: 6, backgroundColor: '#F1F5F9',
    borderRadius: 3, overflow: 'hidden',
  },
  barTrackDark: { backgroundColor: '#273549' },
  barFill:      { height: '100%', borderRadius: 3 },

  ctaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1, borderColor: '#E2E8F0',
    flexShrink: 0,
  },
  ctaChipDark: { backgroundColor: '#273549', borderColor: '#334155' },
  ctaChipDone: { backgroundColor: '#059669', borderColor: '#047857' },
  ctaText:     { fontSize: 11, fontWeight: '700', color: '#64748B' },
  ctaTextDark: { color: '#94A3B8' },
  ctaTextDone: { color: '#FFFFFF' },
});

export default DailyProgressCard;