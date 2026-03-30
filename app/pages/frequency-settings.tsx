import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RefreshCw, Heart, Star, Users, Info } from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import type { FrequencySettings } from '../../contexts/AppContext';

interface Props { darkMode?: boolean }

const PRACTICES = [
  {
    key: 'wird' as const,
    icon: Heart, color: '#DC2626',
    label: 'Lāzim Tijāni', arabic: 'الوِرد',
    hint: 'Morning & evening',
    options: [1, 2] as const,
    fixed: false,
  },
  {
    key: 'wazifa' as const,
    icon: Star, color: '#D97706',
    label: 'Wazīfa', arabic: 'الوَظِيفَة',
    hint: 'Once or twice daily',
    options: [1, 2] as const,
    fixed: false,
  },
  {
    key: 'hadra' as const,
    icon: Users, color: '#7C3AED',
    label: 'Ḥaḍra', arabic: 'حضرة الجمعة',
    hint: 'Fridays only',
    options: [1] as const,
    fixed: true,
  },
];

export default function FrequencySettingsSection({ darkMode = false }: Props) {
  const { state, dispatch } = useApp();
  const { frequencySettings } = state;
  const dk = darkMode;

  const update = (partial: Partial<FrequencySettings>) =>
    dispatch({ type: 'UPDATE_FREQUENCY_SETTINGS', settings: partial });

  const getValue = (key: 'wird' | 'wazifa' | 'hadra') => {
    if (key === 'wird')   return frequencySettings.wirdPerDay;
    if (key === 'wazifa') return frequencySettings.wazifaPerDay;
    return frequencySettings.hadraPerDay;
  };

  const handleChange = (key: 'wird' | 'wazifa' | 'hadra', v: number) => {
    if (key === 'wird')   update({ wirdPerDay:   v as 1 | 2 });
    if (key === 'wazifa') update({ wazifaPerDay: v as 1 | 2 });
  };

  return (
    <View style={styles.wrapper}>

      {/* ── Section header ── */}
      <View style={styles.header}>
        <View style={[styles.headerIcon, dk && styles.headerIconDark]}>
          <RefreshCw color="#059669" size={15} strokeWidth={2.5} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, dk && styles.headerTitleDark]}>
            Daily Frequency
          </Text>
          <Text style={[styles.headerSub, dk && styles.headerSubDark]}>
            Required completions per day
          </Text>
        </View>
      </View>

      {/* ── Cards ── */}
      <View style={[styles.card, dk && styles.cardDark]}>
        {PRACTICES.map((p, idx) => {
          const Icon    = p.icon;
          const current = getValue(p.key);
          const isLast  = idx === PRACTICES.length - 1;

          return (
            <View key={p.key}>
              <View style={styles.row}>

                {/* Left: icon + labels */}
                <View style={[styles.iconWrap, { backgroundColor: p.color + '14' }]}>
                  <Icon color={p.color} size={17} strokeWidth={2.2} />
                </View>

                <View style={styles.labelCol}>
                  <Text style={[styles.label, dk && styles.labelDark]}>{p.label}</Text>
                  <View style={styles.metaRow}>
                    <Text style={[styles.arabic, dk && styles.arabicDark]}>{p.arabic}</Text>
                    <Text style={styles.dot}>·</Text>
                    <Text style={[styles.hint, dk && styles.hintDark]}>{p.hint}</Text>
                  </View>
                </View>

                {/* Right: toggle buttons */}
                <View style={styles.toggleRow}>
                  {p.options.map(opt => {
                    const active = current === opt;
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => !p.fixed && handleChange(p.key, opt)}
                        activeOpacity={p.fixed ? 1 : 0.7}
                        style={[
                          styles.btn,
                          active
                            ? { backgroundColor: p.color, borderColor: p.color }
                            : dk ? styles.btnInactiveDark : styles.btnInactive,
                          p.fixed && styles.btnFixed,
                        ]}
                      >
                        <Text style={[
                          styles.btnText,
                          active ? styles.btnTextActive : (dk ? styles.btnTextInactiveDark : styles.btnTextInactive),
                        ]}>
                          {opt}×
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  {/* Lock indicator for fixed options */}
                  {p.fixed && (
                    <View style={[styles.lockChip, dk && styles.lockChipDark]}>
                      <Text style={[styles.lockText, dk && styles.lockTextDark]}>Fixed</Text>
                    </View>
                  )}
                </View>
              </View>

              {!isLast && (
                <View style={[styles.divider, dk && styles.dividerDark]} />
              )}
            </View>
          );
        })}
      </View>

      {/* ── Info note ── */}
      <View style={[styles.infoRow, dk && styles.infoRowDark]}>
        <Info color={dk ? '#475569' : '#94A3B8'} size={12} strokeWidth={2} />
        <Text style={[styles.infoText, dk && styles.infoTextDark]}>
          Wird is traditionally recited morning &amp; evening. Ḥaḍra is exclusive to Fridays.
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 16, marginTop: 4 },

  // Header
  header:         { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  headerIcon:     { width: 30, height: 30, borderRadius: 9, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' },
  headerIconDark: { backgroundColor: '#134E2A' },
  headerTitle:    { fontSize: 14, fontWeight: '800', color: '#1E293B', letterSpacing: -0.2 },
  headerTitleDark:{ color: '#F1F5F9' },
  headerSub:      { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  headerSubDark:  { color: '#64748B' },

  // Card
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    overflow: 'hidden',
  },
  cardDark: { backgroundColor: '#1E293B', borderColor: 'rgba(255,255,255,0.06)' },

  // Row
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, gap: 11 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },

  labelCol: { flex: 1 },
  label:     { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  labelDark: { color: '#F1F5F9' },
  metaRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  arabic:    { fontSize: 10, color: '#94A3B8', fontWeight: '500' },
  arabicDark:{ color: '#64748B' },
  dot:       { fontSize: 10, color: '#CBD5E1' },
  hint:      { fontSize: 10, color: '#94A3B8' },
  hintDark:  { color: '#64748B' },

  // Toggle buttons
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 0 },
  btn: {
    width: 36, height: 30, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5,
  },
  btnInactive:     { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  btnInactiveDark: { backgroundColor: '#273549', borderColor: '#334155' },
  btnFixed:        { opacity: 0.7 },
  btnText:         { fontSize: 12, fontWeight: '800' },
  btnTextActive:        { color: '#FFFFFF' },
  btnTextInactive:      { color: '#94A3B8' },
  btnTextInactiveDark:  { color: '#64748B' },

  // Lock chip
  lockChip:     { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, backgroundColor: '#F1F5F9' },
  lockChipDark: { backgroundColor: '#273549' },
  lockText:     { fontSize: 9, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 },
  lockTextDark: { color: '#475569' },

  divider:     { height: 1, backgroundColor: '#F8FAFC', marginHorizontal: 14 },
  dividerDark: { backgroundColor: '#273549' },

  // Info row
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 8, paddingHorizontal: 2 },
  infoRowDark: {},
  infoText:     { flex: 1, fontSize: 10.5, color: '#94A3B8', lineHeight: 15, fontStyle: 'italic' },
  infoTextDark: { color: '#475569' },
});