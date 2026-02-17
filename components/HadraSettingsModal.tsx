import React, { useState, useCallback, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Info, RotateCcw, Target, Check } from 'lucide-react-native';

interface HadraSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  currentTargets: { tahlil: number; ismuLlah: number };
  onSave: (targets: { tahlil: number; ismuLlah: number }) => void;
  darkMode?: boolean;
}

const DEFAULT_TARGETS = { tahlil: 800, ismuLlah: 400 };

export default function HadraSettingsModal({ visible, onClose, currentTargets, onSave, darkMode = false }: HadraSettingsModalProps) {
  const [tempTargets, setTempTargets] = useState(currentTargets);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => { if (visible) setTempTargets(currentTargets); }, [visible, currentTargets]);

  const handleTargetChange = useCallback((key: 'tahlil' | 'ismuLlah', text: string) => {
    const num = parseInt(text) || 0;
    setTempTargets(prev => ({ ...prev, [key]: Math.max(0, num) }));
  }, []);

  const handleResetToDefault = useCallback(() => {
    Alert.alert(
      'Restore Defaults',
      'This will reset to the traditional counts:\n\n• Tahlīl → 800 repetitions\n• Ism Allāh → 400 repetitions',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore', style: 'destructive', onPress: () => setTempTargets(DEFAULT_TARGETS) },
      ]
    );
  }, []);

  const handleSave = useCallback(() => {
    if (tempTargets.tahlil < 1 || tempTargets.ismuLlah < 1) {
      Alert.alert('Invalid Values', 'Both repetition counts must be at least 1.', [{ text: 'Understood' }]);
      return;
    }
    onSave(tempTargets);
    onClose();
  }, [tempTargets, onSave, onClose]);

  const dhikrItems = [
    {
      key: 'tahlil' as const, emoji: '☝️', label: 'Tahlīl',
      arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ', meaning: 'Declaration of Divine Oneness',
      placeholder: '800', accent: '#10B981', accentDark: '#34D399', bg: '#ECFDF5', bgDark: '#052E16',
    },
    {
      key: 'ismuLlah' as const, emoji: '🌙', label: 'Ism Allāh',
      arabic: 'اللّٰهُ', meaning: 'The Supreme Name of God',
      placeholder: '400', accent: '#8B5CF6', accentDark: '#A78BFA', bg: '#F5F3FF', bgDark: '#1E1B4B',
    },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[s.container, darkMode && s.containerDark]}>

        <View style={[s.header, darkMode && s.headerDark]}>
          <View style={s.headerLeft}>
            <View style={[s.headerIcon, darkMode && s.headerIconDark]}>
              <Target color="#10B981" size={22} />
            </View>
            <View>
              <Text style={[s.title, darkMode && s.titleDark]}>Repetition Targets</Text>
              <Text style={[s.subtitle, darkMode && s.subtitleDark]}>Customize your dhikr counts</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={[s.closeBtn, darkMode && s.closeBtnDark]}>
            <X color={darkMode ? '#9CA3AF' : '#6B7280'} size={20} />
          </TouchableOpacity>
        </View>
        <View style={s.accentBar} />

        <ScrollView style={[s.scroll, darkMode && s.scrollDark]} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={s.section}>
            <Text style={[s.eyebrow, darkMode && s.eyebrowDark]}>CONFIGURATION</Text>
            <Text style={[s.sectionTitle, darkMode && s.sectionTitleDark]}>Set Your Repetition Counts</Text>
            <Text style={[s.sectionDesc, darkMode && s.sectionDescDark]}>
              Adjust the number of repetitions for each dhikr to match your personal practice or the tradition of your community.
            </Text>
          </View>

          <View style={s.section}>
            {dhikrItems.map((item) => {
              const focused = focusedField === item.key;
              return (
                <View key={item.key} style={[s.card, darkMode && s.cardDark, focused && { borderColor: item.accent, borderWidth: 2 }]}>
                  <View style={s.cardTop}>
                    <View style={[s.emojiBox, { backgroundColor: darkMode ? item.bgDark : item.bg }]}>
                      <Text style={s.emoji}>{item.emoji}</Text>
                    </View>
                    <View style={s.cardInfo}>
                      <Text style={[s.cardLabel, darkMode && s.cardLabelDark]}>{item.label}</Text>
                      <Text style={[s.arabic, { color: darkMode ? item.accentDark : item.accent }]}>{item.arabic}</Text>
                      <Text style={[s.meaning, darkMode && s.meaningDark]}>{item.meaning}</Text>
                    </View>
                  </View>
                  <View style={[s.inputRow, darkMode && s.inputRowDark, focused && { borderColor: item.accent }]}>
                    <TextInput
                      style={[s.input, darkMode && s.inputDark]}
                      value={tempTargets[item.key].toString()}
                      onChangeText={(t) => handleTargetChange(item.key, t)}
                      onFocus={() => setFocusedField(item.key)}
                      onBlur={() => setFocusedField(null)}
                      keyboardType="numeric" placeholder={item.placeholder}
                      placeholderTextColor={darkMode ? '#4B5563' : '#CBD5E1'} maxLength={5}
                    />
                    <View style={[s.suffix, { backgroundColor: darkMode ? item.bgDark : item.bg }]}>
                      <Text style={[s.suffixText, { color: darkMode ? item.accentDark : item.accent }]}>times</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={s.section}>
            <View style={[s.infoBox, darkMode && s.infoBoxDark]}>
              <View style={s.infoIconCircle}>
                <Info color={darkMode ? '#60A5FA' : '#3B82F6'} size={15} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.infoHeading, darkMode && s.infoHeadingDark]}>Traditional Counts</Text>
                <Text style={[s.infoText, darkMode && s.infoTextDark]}>
                  The defaults — <Text style={s.bold}>800</Text> for Tahlīl and <Text style={s.bold}>400</Text> for Ism Allāh — reflect the established practice of the Hadra Joumou'a. These may vary by community.
                </Text>
              </View>
            </View>
          </View>

          <View style={s.section}>
            <TouchableOpacity onPress={handleResetToDefault} style={[s.resetBtn, darkMode && s.resetBtnDark]}>
              <RotateCcw color={darkMode ? '#9CA3AF' : '#64748B'} size={16} />
              <Text style={[s.resetText, darkMode && s.resetTextDark]}>Restore Default Values</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[s.saveBtn, darkMode && s.saveBtnDark]}>
              <Check color="#FFFFFF" size={20} />
              <Text style={s.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0D1117' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 16, backgroundColor: '#FFFFFF' },
  headerDark: { backgroundColor: '#161B22' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  headerIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' },
  headerIconDark: { backgroundColor: '#064E3B' },
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A', letterSpacing: -0.3 },
  titleDark: { color: '#F1F5F9' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  subtitleDark: { color: '#94A3B8' },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  closeBtnDark: { backgroundColor: '#21262D' },
  accentBar: { height: 3, backgroundColor: '#10B981' },
  scroll: { flex: 1 },
  scrollDark: { backgroundColor: '#0D1117' },
  scrollContent: { paddingTop: 24 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, color: '#10B981', marginBottom: 6 },
  eyebrowDark: { color: '#34D399' },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 8 },
  sectionTitleDark: { color: '#F1F5F9' },
  sectionDesc: { fontSize: 14, color: '#64748B', lineHeight: 22 },
  sectionDescDark: { color: '#94A3B8' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, marginBottom: 14, borderWidth: 1.5, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardDark: { backgroundColor: '#161B22', borderColor: '#21262D' },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 16 },
  emojiBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 26 },
  cardInfo: { flex: 1, paddingTop: 2 },
  cardLabel: { fontSize: 17, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  cardLabelDark: { color: '#F1F5F9' },
  arabic: { fontSize: 16, fontWeight: '600', marginBottom: 3 },
  meaning: { fontSize: 12, color: '#94A3B8', fontStyle: 'italic' },
  meaningDark: { color: '#64748B' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', overflow: 'hidden' },
  inputRowDark: { backgroundColor: '#0D1117', borderColor: '#30363D' },
  input: { flex: 1, paddingHorizontal: 18, paddingVertical: 14, fontSize: 20, fontWeight: '700', color: '#0F172A' },
  inputDark: { color: '#F1F5F9' },
  suffix: { paddingHorizontal: 16, paddingVertical: 14 },
  suffixText: { fontSize: 13, fontWeight: '600' },
  infoBox: { flexDirection: 'row', backgroundColor: '#EFF6FF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#BFDBFE', gap: 12 },
  infoBoxDark: { backgroundColor: '#0C1E3D', borderColor: '#1E3A5F' },
  infoIconCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  infoHeading: { fontSize: 13, fontWeight: '700', color: '#1E40AF', marginBottom: 4 },
  infoHeadingDark: { color: '#93C5FD' },
  infoText: { fontSize: 13, color: '#3B82F6', lineHeight: 19 },
  infoTextDark: { color: '#60A5FA' },
  bold: { fontWeight: '700' },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#F8FAFC', borderRadius: 12, paddingVertical: 14, marginBottom: 10, borderWidth: 1.5, borderColor: '#E2E8F0' },
  resetBtnDark: { backgroundColor: '#161B22', borderColor: '#21262D' },
  resetText: { fontSize: 14, color: '#64748B', fontWeight: '600' },
  resetTextDark: { color: '#94A3B8' },
  saveBtn: { backgroundColor: '#10B981', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#10B981', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
  saveBtnDark: { backgroundColor: '#059669' },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
});