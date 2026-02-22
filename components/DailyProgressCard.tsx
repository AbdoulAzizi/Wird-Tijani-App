import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, ChevronRight } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';

interface DailyProgressCardProps {
  onPress: () => void;
  darkMode?: boolean;
}

const isFriday = () => new Date().getDay() === 5;

// ─── Palette ──────────────────────────────────────────────────────────────────
const GREEN      = '#059669';
const GREEN_DONE = '#10B981';

// ─── Mini practice row ────────────────────────────────────────────────────────
interface PracticeRowProps {
  label: string;
  arabic: string;
  done: boolean;
  completions: number;
  target: number;
  color: string;
  darkMode: boolean;
}

function PracticeRow({ label, arabic, done, completions, target, color, darkMode }: PracticeRowProps) {
  const segments = target > 1 ? target : 1;
  const filled   = Math.min(completions, segments);

  return (
    <View style={pr.row}>
      {/* Labels */}
      <View style={pr.labels}>
        <Text style={[pr.label, darkMode && pr.labelDark, done && { color }]}>
          {label}
        </Text>
        <Text style={[pr.arabic, darkMode && pr.arabicDark, done && { color: color + 'CC' }]}>
          {arabic}
        </Text>
      </View>

      {/* Segmented bar */}
      <View style={pr.barWrap}>
        {Array.from({ length: segments }).map((_, i) => (
          <View
            key={i}
            style={[
              pr.seg,
              { backgroundColor: i < filled ? color : (darkMode ? '#1E293B' : '#E2E8F0') },
              i === 0 && pr.segFirst,
              i === segments - 1 && pr.segLast,
            ]}
          />
        ))}
      </View>

      {/* Check */}
      {done
        ? <CheckCircle2 color={color} size={14} strokeWidth={2.5} />
        : <View style={[pr.emptyCheck, { borderColor: darkMode ? '#334155' : '#CBD5E1' }]} />
      }
    </View>
  );
}

const pr = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  labels:   { width: 52, gap: 1 },
  label:    { fontSize: 11.5, fontWeight: '800', color: '#475569', letterSpacing: -0.2 },
  labelDark:{ color: '#94A3B8' },
  arabic:   { fontSize: 9, color: '#94A3B8', fontWeight: '500' },
  arabicDark:{ color: '#475569' },

  barWrap:  { flex: 1, flexDirection: 'row', gap: 3, height: 6 },
  seg:      { flex: 1, height: 6, borderRadius: 0 },
  segFirst: { borderTopLeftRadius: 3, borderBottomLeftRadius: 3 },
  segLast:  { borderTopRightRadius: 3, borderBottomRightRadius: 3 },

  emptyCheck: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 2,
  },
});

// ─── Main component ───────────────────────────────────────────────────────────
const DailyProgressCard: React.FC<DailyProgressCardProps> = ({ onPress, darkMode = false }) => {
  const {
    state,
    isWirdFullyDoneToday, isWazifaFullyDoneToday, isHadraFullyDoneToday,
    wirdCompletionsToday, wazifaCompletionsToday, hadraCompletionsToday,
  } = useApp();

  const { frequencySettings } = state;
  const friday = isFriday();

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
  ], [
    isWirdFullyDoneToday, isWazifaFullyDoneToday, isHadraFullyDoneToday,
    wirdCompletionsToday, wazifaCompletionsToday, hadraCompletionsToday,
    frequencySettings, friday,
  ]);

  const active    = practices.filter(p => p.active);
  const completed = active.filter(p => p.done).length;
  const total     = active.length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;
  const allDone   = completed === total && total > 0;
  const ringColor = allDone ? GREEN_DONE : GREEN;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={s.wrapper}>
      <View style={[s.card, darkMode && s.cardDark]}>

        {/* Top accent line */}
        <View style={[s.accent, { backgroundColor: ringColor }]} />

        <View style={s.inner}>

          {/* ── Left: circular ring ── */}
          <View style={[s.ringWrap, { borderColor: ringColor + '30' }]}>
            <View style={[s.ringInner, { backgroundColor: ringColor + '12' }]}>
              <Text style={[s.ringPct, { color: ringColor }]}>{pct}</Text>
              <Text style={[s.ringUnit, { color: ringColor + '99' }]}>%</Text>
            </View>
          </View>

          {/* ── Center ── */}
          <View style={s.center}>

            {/* Header */}
            <View style={s.header}>
              <Text style={[s.title, darkMode && s.titleDark]}>
                {allDone ? 'Completed today 🌿' : friday ? "Jumu'a Mubārak 🕌" : 'Daily Practices'}
              </Text>
              <Text style={[s.sub, darkMode && s.subDark]}>
                {completed}/{total} done
              </Text>
            </View>

            {/* Divider */}
            <View style={[s.divider, darkMode && s.dividerDark]} />

            {/* Practice rows */}
            <View style={s.practices}>
              {active.map(p => (
                <PracticeRow
                  key={p.id}
                  label={p.label}
                  arabic={p.arabic}
                  done={p.done}
                  completions={p.completions}
                  target={p.target}
                  color={p.color}
                  darkMode={darkMode}
                />
              ))}
            </View>

          </View>

          {/* ── Right: chevron ── */}
          <ChevronRight
            color={darkMode ? '#334155' : '#CBD5E1'}
            size={15}
            strokeWidth={2.5}
            style={s.chevron}
          />

        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  wrapper: { paddingHorizontal: 16, marginTop: 10 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(5,150,105,0.1)',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 5,
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: 'rgba(16,185,129,0.15)',
  },

  // Thin top accent
  accent: {
    height: 3,
    width: '100%',
  },

  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  // ── Ring ──
  ringWrap: {
    width: 58, height: 58, borderRadius: 29,
    borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  ringInner: {
    width: 46, height: 46, borderRadius: 23,
    justifyContent: 'center', alignItems: 'center',
  },
  ringPct:  { fontSize: 16, fontWeight: '900', lineHeight: 18 },
  ringUnit: { fontSize: 8,  fontWeight: '700', marginTop: -1 },

  // ── Center ──
  center: { flex: 1, gap: 8 },

  header:    { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  title:     { fontSize: 13, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  titleDark: { color: '#F1F5F9' },
  sub:       { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  subDark:   { color: '#475569' },

  divider:     { height: 1, backgroundColor: '#F1F5F9' },
  dividerDark: { backgroundColor: '#273549' },

  practices: { gap: 7 },

  // ── Chevron ──
  chevron: { flexShrink: 0 },
});

export default DailyProgressCard;