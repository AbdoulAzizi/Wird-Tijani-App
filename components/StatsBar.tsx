import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface StatItem {
  icon: React.ReactElement;
  value: string;
  label: string;
  color: string;
}

interface StatsBarProps {
  stats: StatItem[];
  dark?: boolean;
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

// ─── StatsBar ─────────────────────────────────────────────────────────────────
export default function StatsBar({ stats, dark = false }: StatsBarProps) {
  return (
    <View style={styles.row}>
      {stats.map((stat, i) => (
        <StatPill key={i} {...stat} dark={dark} />
      ))}
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
  pillDark: { backgroundColor: '#1E293B' },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: { flexDirection: 'column' },
  value:     { fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  label:     { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 1 },
  labelDark: { color: '#64748B' },
});