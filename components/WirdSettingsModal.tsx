import React, { useState } from 'react';
import {
  View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  X, Check, AlertTriangle, Info, BookOpen, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp, SALAWAT_FORMULAS } from '../contexts/AppContext';

interface WirdSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
}

const FORMULA_META: Record<string, { icon: string; color: string }> = {
  salatulFatih:        { icon: '⭐', color: '#059669' },
  salatulIbrahimiyya: { icon: '📿', color: '#3B82F6' },
  salawatSimple:      { icon: '🌙', color: '#8B5CF6' },
  salatulKamila:      { icon: '💎', color: '#F59E0B' },
};

// ─── Formula Card ─────────────────────────────────────────────────────────────
function FormulaCard({
  formulaKey,
  formula,
  isSelected,
  dark,
  onSelect,
}: {
  formulaKey: string;
  formula: { title: string; description: string; arabic: string; transliteration: string; translation: string };
  isSelected: boolean;
  dark: boolean;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = FORMULA_META[formulaKey] ?? { icon: '✨', color: '#6B7280' };

  return (
    <View style={[fc.wrap, dark && fc.wrapDark, isSelected && { borderColor: meta.color }]}>
      {/* Title row — always visible */}
      <TouchableOpacity
        style={fc.header}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.75}
      >
        <View style={[fc.iconBox, { backgroundColor: isSelected ? meta.color : meta.color + '18' }]}>
          <Text style={fc.icon}>{meta.icon}</Text>
        </View>
        <View style={fc.titleBlock}>
          <View style={fc.titleRow}>
            <Text style={[fc.title, dark && fc.titleDark, isSelected && { color: meta.color }]}>
              {formula.title}
            </Text>
            {isSelected && (
              <View style={[fc.activeBadge, { backgroundColor: meta.color }]}>
                <Check color="#FFFFFF" size={10} strokeWidth={3} />
                <Text style={fc.activeBadgeText}>Active</Text>
              </View>
            )}
          </View>
          <Text style={[fc.desc, dark && fc.descDark]}>{formula.description}</Text>
        </View>
        <View style={[fc.chevron, { backgroundColor: meta.color + '15' }]}>
          {expanded
            ? <ChevronUp color={meta.color} size={15} strokeWidth={2.5} />
            : <ChevronDown color={meta.color} size={15} strokeWidth={2.5} />
          }
        </View>
      </TouchableOpacity>

      {/* Expanded content */}
      {expanded && (
        <View style={fc.body}>
          <View style={[fc.arabicBox, dark && fc.arabicBoxDark]}>
            <Text style={[fc.arabic, dark && fc.arabicDark]}>{formula.arabic}</Text>
          </View>

          <View style={[fc.infoBox, { backgroundColor: meta.color + '10', borderColor: meta.color + '30' }]}>
            <Text style={[fc.infoLabel, { color: meta.color }]}>Transliteration</Text>
            <Text style={[fc.infoText, dark && fc.infoTextDark]}>{formula.transliteration}</Text>
          </View>

          <View style={[fc.transBox, dark && fc.transBoxDark]}>
            <Text style={[fc.transLabel, dark && fc.transLabelDark]}>Translation</Text>
            <Text style={[fc.transText, dark && fc.transTextDark]}>{formula.translation}</Text>
          </View>

          {!isSelected && (
            <TouchableOpacity
              onPress={onSelect}
              style={[fc.selectBtn, { backgroundColor: meta.color }]}
              activeOpacity={0.8}
            >
              <Check color="#FFFFFF" size={16} strokeWidth={2.5} />
              <Text style={fc.selectBtnText}>Use this formula</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const fc = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF', borderRadius: 18, marginBottom: 12,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  wrapDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  iconBox: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  icon: { fontSize: 22 },
  titleBlock: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 },
  title: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  titleDark: { color: '#F8FAFC' },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8,
  },
  activeBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  desc: { fontSize: 13, color: '#64748B', lineHeight: 18, fontStyle: 'italic' },
  descDark: { color: '#94A3B8' },
  chevron: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  body: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 14 },
  arabicBox: {
    backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14, marginBottom: 12,
  },
  arabicBoxDark: { backgroundColor: '#0F172A' },
  arabic: { fontSize: 18, color: '#1E293B', textAlign: 'right', lineHeight: 34, fontWeight: '500' },
  arabicDark: { color: '#E2E8F0' },
  infoBox: { borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1 },
  infoLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 },
  infoText: { fontSize: 13, color: '#475569', lineHeight: 20, fontStyle: 'italic' },
  infoTextDark: { color: '#CBD5E1' },
  transBox: { backgroundColor: '#F1F5F9', borderRadius: 10, padding: 12, marginBottom: 14 },
  transBoxDark: { backgroundColor: '#334155' },
  transLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 },
  transLabelDark: { color: '#94A3B8' },
  transText: { fontSize: 13, color: '#475569', lineHeight: 20 },
  transTextDark: { color: '#CBD5E1' },
  selectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 13, borderRadius: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, shadowRadius: 6, elevation: 4,
  },
  selectBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function WirdSettingsModal({ visible, onClose, darkMode }: WirdSettingsModalProps) {
  const { state, dispatch } = useApp();
  const dark = darkMode;

  const handleFormulaChange = (formula: keyof typeof SALAWAT_FORMULAS) => {
    if (state.wirdSettings.salawatFormula === formula) return;

    Alert.alert(
      'Change Formula?',
      'Your current Ṣalawāt counter will be reset. Are you sure you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'UPDATE_WIRD_SETTINGS', settings: { salawatFormula: formula } });
            Alert.alert(
              'Formula Updated',
              'Your new Ṣalawāt formula has been saved.',
              [{ text: 'OK' }],
            );
          },
        },
      ],
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.root, dark && styles.rootDark]}>

        {/* ── Header ── */}
        <LinearGradient colors={['#059669', '#047857']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <BookOpen color="#FFFFFF" size={22} strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Wird Settings</Text>
              <Text style={styles.headerSub}>Customise your Ṣalawāt formula</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <X color="#FFFFFF" size={22} strokeWidth={2.5} />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView
          style={[styles.scroll, dark && styles.scrollDark]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Intro ── */}
          <View style={[styles.introCard, dark && styles.introCardDark]}>
            <View style={styles.introRow}>
              <Sparkles color="#059669" size={18} strokeWidth={2} />
              <Text style={[styles.introTitle, dark && styles.introTitleDark]}>Choose Your Formula</Text>
            </View>
            <Text style={[styles.introText, dark && styles.introTextDark]}>
              The Wird includes 100 prayers upon the Prophet ﷺ (Ṣalawāt). You may choose from four authentic formulas drawn from the Islamic tradition. All are valid — your choice should reflect your personal spiritual connection.
            </Text>
          </View>

          {/* ── Formulas ── */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <Text style={[styles.sectionTitle, dark && styles.sectionTitleDark]}>Available Formulas</Text>
              <View style={[styles.countBadge, dark && styles.countBadgeDark]}>
                <Text style={[styles.countText, dark && styles.countTextDark]}>
                  {Object.keys(SALAWAT_FORMULAS).length} options
                </Text>
              </View>
            </View>

            {Object.entries(SALAWAT_FORMULAS).map(([key, formula]) => (
              <FormulaCard
                key={key}
                formulaKey={key}
                formula={formula}
                isSelected={state.wirdSettings.salawatFormula === key}
                dark={dark}
                onSelect={() => handleFormulaChange(key as keyof typeof SALAWAT_FORMULAS)}
              />
            ))}
          </View>

          {/* ── Warning ── */}
          <View style={[styles.warnCard, dark && styles.warnCardDark]}>
            <View style={styles.warnHead}>
              <AlertTriangle color="#D97706" size={18} strokeWidth={2} />
              <Text style={[styles.warnTitle, dark && styles.warnTitleDark]}>Important Note</Text>
            </View>
            <Text style={[styles.warnText, dark && styles.warnTextDark]}>
              Switching formulas will reset your current Ṣalawāt counter. It is recommended to stay with the same formula throughout a single Wird session.
            </Text>
          </View>

          {/* ── Info ── */}
          <View style={[styles.infoCard, dark && styles.infoCardDark]}>
            <View style={styles.infoHead}>
              <Info color="#2563EB" size={18} strokeWidth={2} />
              <Text style={[styles.infoTitle, dark && styles.infoTitleDark]}>All Formulas Are Authentic</Text>
            </View>
            <Text style={[styles.infoText, dark && styles.infoTextDark]}>
              Each of these formulas comes from verified sources within the Islamic tradition. Your choice depends on personal preference and the spiritual resonance you feel with each one.
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  rootDark: { backgroundColor: '#0F172A' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 18,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  headerIcon: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.2 },
  headerSub: { fontSize: 12, color: '#D1FAE5', fontWeight: '500', marginTop: 2 },
  closeBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },

  scroll: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollDark: { backgroundColor: '#0F172A' },
  scrollContent: { padding: 16, paddingTop: 20 },

  introCard: {
    backgroundColor: '#ECFDF5', borderRadius: 18, padding: 18, marginBottom: 24,
    borderWidth: 1.5, borderColor: '#A7F3D0',
  },
  introCardDark: { backgroundColor: '#022C22', borderColor: '#065F46' },
  introRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  introTitle: { fontSize: 15, fontWeight: '700', color: '#059669' },
  introTitleDark: { color: '#34D399' },
  introText: { fontSize: 14, color: '#065F46', lineHeight: 22 },
  introTextDark: { color: '#A7F3D0' },

  section: { marginBottom: 24 },
  sectionHead: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B', letterSpacing: -0.2 },
  sectionTitleDark: { color: '#F8FAFC' },
  countBadge: {
    backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  countBadgeDark: { backgroundColor: '#334155' },
  countText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  countTextDark: { color: '#94A3B8' },

  warnCard: {
    backgroundColor: '#FFFBEB', borderRadius: 18, padding: 18, marginBottom: 12,
    borderWidth: 1.5, borderColor: '#FDE68A',
  },
  warnCardDark: { backgroundColor: '#1C1000', borderColor: '#78350F' },
  warnHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  warnTitle: { fontSize: 15, fontWeight: '700', color: '#B45309' },
  warnTitleDark: { color: '#FCD34D' },
  warnText: { fontSize: 14, color: '#92400E', lineHeight: 21 },
  warnTextDark: { color: '#FDE68A' },

  infoCard: {
    backgroundColor: '#EFF6FF', borderRadius: 18, padding: 18, marginBottom: 12,
    borderWidth: 1.5, borderColor: '#BFDBFE',
  },
  infoCardDark: { backgroundColor: '#0D1F4A', borderColor: '#1E40AF' },
  infoHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  infoTitle: { fontSize: 15, fontWeight: '700', color: '#1D4ED8' },
  infoTitleDark: { color: '#93C5FD' },
  infoText: { fontSize: 14, color: '#1E40AF', lineHeight: 21 },
  infoTextDark: { color: '#BFDBFE' },
});