import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause } from 'lucide-react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StatItem {
  icon:  React.ReactElement;
  value: string;
  label: string;
  color: string;
}

export interface TimerConfig {
  /** Formatted string: "03:42" or "01:12:05" */
  formatted:  string;
  isRunning:  boolean;
  /** True once the session has been saved — locks the button */
  isComplete: boolean;
  onToggle:   () => void;
  /** Accent color matching the screen theme */
  color:      string;
}

interface StatsBarProps {
  dark?:  boolean;
  /** Pass 2 static stats — the timer always occupies the third pill */
  stats:  [StatItem, StatItem];
  timer:  TimerConfig;
}

// ─── StatPill ─────────────────────────────────────────────────────────────────

function StatPill({ icon, value, label, color, dark }: StatItem & { dark: boolean }) {
  return (
    <View style={[styles.pill, dark && styles.pillDark]}>
      <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
        {icon}
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={[styles.label, dark && styles.labelDark]}>{label}</Text>
      </View>
    </View>
  );
}

// ─── TimerPill ────────────────────────────────────────────────────────────────

function TimerPill({ timer, dark }: { timer: TimerConfig; dark: boolean }) {
  const { formatted, isRunning, isComplete, onToggle, color } = timer;
  const sublabel  = isComplete ? 'Saved' : isRunning ? 'Running' : 'Timer';
  const iconBg    = isComplete ? '#10B98122' : color + (isRunning ? '33' : '22');
  const valueColor = isComplete ? '#10B981' : color;

  return (
    <View style={[styles.pill, dark && styles.pillDark]}>
      <TouchableOpacity
        onPress={isComplete ? undefined : onToggle}
        activeOpacity={isComplete ? 1 : 0.7}
        style={[styles.iconWrap, { backgroundColor: iconBg }]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {isComplete ? (
          <Text style={[styles.checkmark, { color: '#10B981' }]}>✓</Text>
        ) : isRunning ? (
          <Pause color={color} size={12} strokeWidth={2.5} />
        ) : (
          <Play  color={color} size={12} strokeWidth={2.5} />
        )}
      </TouchableOpacity>

      <View style={styles.textWrap}>
        <Text style={[styles.value, styles.timerValue, { color: valueColor }]}>
          {formatted}
        </Text>
        <Text style={[styles.label, dark && styles.labelDark]}>{sublabel}</Text>
      </View>
    </View>
  );
}

// ─── StatsBar ─────────────────────────────────────────────────────────────────

export default function StatsBar({ stats, timer, dark = false }: StatsBarProps) {
  return (
    <View style={styles.row}>
      {stats.map((stat, i) => (
        <StatPill key={i} {...stat} dark={dark} />
      ))}
      <TimerPill timer={timer} dark={dark} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 2,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pillDark:   { backgroundColor: '#1E293B' },
  iconWrap:   { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  textWrap:   { flexDirection: 'column' },
  value:      { fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  timerValue: { fontVariant: ['tabular-nums'], letterSpacing: -0.5 },
  label:      { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 1 },
  labelDark:  { color: '#64748B' },
  checkmark:  { fontSize: 14, fontWeight: '800' },
});