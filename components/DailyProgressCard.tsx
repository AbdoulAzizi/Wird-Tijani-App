import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Circle, Flame, ChevronRight } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';

interface DailyProgressCardProps {
  onPress: () => void;
  darkMode?: boolean;
}

const isFriday = () => new Date().getDay() === 5;

const DailyProgressCard: React.FC<DailyProgressCardProps> = ({ onPress, darkMode = false }) => {
  const {
    state,
    isWirdFullyDoneToday, isWazifaFullyDoneToday, isHadraFullyDoneToday,
    wirdCompletionsToday, wazifaCompletionsToday, hadraCompletionsToday,
  } = useApp();

  const { frequencySettings } = state;
  const friday = isFriday();
  const streak = state.streak || 0;

  const practices = useMemo(() => [
    {
      id: 'wird', label: 'Wird', arabic: 'الوِرد',
      done: isWirdFullyDoneToday, completions: wirdCompletionsToday,
      target: frequencySettings.wirdPerDay, color: '#DC2626', active: true,
    },
    {
      id: 'wazifa', label: 'Wazifa', arabic: 'الوَظِيفَة',
      done: isWazifaFullyDoneToday, completions: wazifaCompletionsToday,
      target: frequencySettings.wazifaPerDay, color: '#D97706', active: true,
    },
    {
      id: 'hadra', label: 'Hadra', arabic: 'حضرة',
      done: isHadraFullyDoneToday, completions: hadraCompletionsToday,
      target: frequencySettings.hadraPerDay, color: '#7C3AED', active: friday,
    },
  ], [isWirdFullyDoneToday, isWazifaFullyDoneToday, isHadraFullyDoneToday,
      wirdCompletionsToday, wazifaCompletionsToday, hadraCompletionsToday,
      frequencySettings, friday]);

  const active    = practices.filter(p => p.active);
  const completed = active.filter(p => p.done).length;
  const total     = active.length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;
  const allDone   = completed === total && total > 0;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.wrapper}>
      <View style={[styles.card, darkMode && styles.cardDark]}>

        {/* ── Left: circular % ── */}
        <View style={[
          styles.ring,
          { borderColor: allDone ? '#10B981' : (darkMode ? '#334155' : '#D1FAE5') },
        ]}>
          <Text style={[styles.ringPct, { color: allDone ? '#10B981' : '#059669' }]}>
            {pct}
          </Text>
          <Text style={styles.ringMark}>%</Text>
        </View>

        {/* ── Center: practice rows ── */}
        <View style={styles.center}>
          {/* Title */}
          <View style={styles.titleRow}>
            <Text style={[styles.title, darkMode && styles.titleDark]}>
              {allDone ? 'All done today 🌿' : friday ? "🕌 Jumu'a Mubārak" : 'Daily Practices'}
            </Text>
            {streak > 0 && (
              <View style={styles.streakBadge}>
                <Flame color="#F97316" size={10} strokeWidth={2.5} />
                <Text style={styles.streakNum}>{streak}</Text>
              </View>
            )}
          </View>

          {/* Practice items — horizontal compact row */}
          <View style={styles.pillsRow}>
            {practices.map(p => {
              if (!p.active) return null;
              const multi = p.target > 1;
              return (
                <View key={p.id} style={[
                  styles.pill,
                  darkMode && styles.pillDark,
                  p.done && { backgroundColor: p.color + '18', borderColor: p.color + '35' },
                ]}>
                  {p.done
                    ? <CheckCircle2 color={p.color} size={11} strokeWidth={3} />
                    : <Circle color={darkMode ? '#475569' : '#CBD5E1'} size={11} strokeWidth={2} />
                  }
                  <Text style={[
                    styles.pillLabel,
                    darkMode && styles.pillLabelDark,
                    p.done && { color: p.color },
                  ]}>
                    {p.label}
                  </Text>
                  {multi && (
                    <Text style={[styles.pillCount, { color: p.done ? p.color : (darkMode ? '#475569' : '#CBD5E1') }]}>
                      {Math.min(p.completions, p.target)}/{p.target}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* Progress bar */}
          <View style={[styles.track, darkMode && styles.trackDark]}>
            <View style={[
              styles.fill,
              { width: `${pct}%`, backgroundColor: allDone ? '#10B981' : '#059669' },
            ]} />
          </View>
        </View>

        {/* ── Right: chevron ── */}
        <ChevronRight
          color={darkMode ? '#334155' : '#CBD5E1'}
          size={16}
          strokeWidth={2.5}
        />

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 16, marginTop: 10 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.1)',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: 'rgba(16,185,129,0.12)',
  },

  // ── Ring ──
  ring: {
    width: 54, height: 54, borderRadius: 27,
    borderWidth: 3,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  ringPct:  { fontSize: 17, fontWeight: '900', lineHeight: 18 },
  ringMark: { fontSize: 8,  fontWeight: '700', color: '#94A3B8', marginTop: -2 },

  // ── Center ──
  center: { flex: 1, gap: 6 },

  titleRow:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title:     { fontSize: 13, fontWeight: '800', color: '#0F172A', letterSpacing: -0.2, flex: 1 },
  titleDark: { color: '#F1F5F9' },

  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#FFF7ED', borderRadius: 20,
    paddingHorizontal: 6, paddingVertical: 2,
    borderWidth: 1, borderColor: '#FED7AA',
  },
  streakNum: { fontSize: 10, fontWeight: '800', color: '#F97316' },

  // ── Pills row ──
  pillsRow: { flexDirection: 'row', gap: 6 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 7, paddingVertical: 4,
    borderWidth: 1, borderColor: 'transparent',
  },
  pillDark:  { backgroundColor: '#0F172A' },
  pillLabel: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  pillLabelDark: { color: '#94A3B8' },
  pillCount: { fontSize: 9, fontWeight: '700' },

  // ── Bar ──
  track: {
    height: 3, backgroundColor: '#F1F5F9',
    borderRadius: 2, overflow: 'hidden',
  },
  trackDark: { backgroundColor: '#273549' },
  fill: { height: '100%', borderRadius: 2 },
});

export default DailyProgressCard;