import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Moon } from 'lucide-react-native';

interface HadraInfoModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export default function HadraInfoModal({ visible, onClose, darkMode = false }: HadraInfoModalProps) {
  const steps = [
    { step: '1', title: 'Intention (Niyya)', icon: '💭', description: 'Form the intention to perform the Friday dhikr' },
    { step: '2', title: 'Seeking Refuge (Ta\'awwudh)', icon: '🛡️', arabic: 'أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', count: '1×', description: 'Refuge from Satan the accursed' },
    { step: '3', title: 'Al-Fātiḥa', icon: '📖', count: '1×', description: 'Recite the Opening Chapter of the Qur\'an' },
    { step: '4', title: 'Special Seeking of Forgiveness (Istighfār)', icon: '🤲', arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ الَّذِي لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', count: '3×', description: 'Complete formula of absolution' },
    { step: '5', title: 'Ṣalāt al-Fātiḥ', icon: '🌟', arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ...', count: '3×', description: 'Special invocation of blessings upon the Prophet ﷺ' },
    { step: '6', title: 'Glorification (Tasbīḥ)', icon: '✨', arabic: 'سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ...', count: '1×', description: 'Divine glorification' },
    {
      step: '7', title: 'Tahlīl — Oneness of God', icon: '☝️', arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
      count: '800–1000×', description: 'In congregation',
      alternateCount: '1200–1600×', alternateDescription: 'When performed alone',
      note: 'Recited in unison, with a harmonious collective rhythm', highlight: true,
    },
    { step: '8', title: 'Ism Allāh — The Supreme Name', icon: '🌙', arabic: 'اللّٰهُ', count: '400×', description: 'Invocation of the Highest Name of God' },
    { step: '9', title: 'Closing Recitation', icon: '📿', arabic: 'إِنَّ اللّٰهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ...', count: '1×', description: 'Quranic verse and final glorification' },
  ];

  const preparation = [
    { icon: '💧', text: 'Ritual purity (wuḍū\') is required' },
    { icon: '🤲', text: 'Sit in the prayer position, with full presence of heart' },
    { icon: '⭕', text: 'Form a circle around a white cloth (if in a group)' },
    { icon: '🧭', text: 'Face the direction of Mecca (Qibla) together' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[s.container, darkMode && s.containerDark]} edges={['top']}>

        <View style={[s.header, darkMode && s.headerDark]}>
          <View style={s.headerContent}>
            <View style={s.iconContainer}>
              <Moon color="#FFFFFF" size={24} fill="#FFFFFF" />
            </View>
            <View style={s.titleContainer}>
              <Text style={[s.title, darkMode && s.titleDark]}>Friday Hadra Guide</Text>
              <Text style={[s.subtitle, darkMode && s.subtitleDark]}>Weekly collective spiritual session</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={[s.closeBtn, darkMode && s.closeBtnDark]} activeOpacity={0.7}>
            <X color={darkMode ? '#FFFFFF' : '#6B7280'} size={22} />
          </TouchableOpacity>
          <View style={s.headerAccent} />
        </View>

        <ScrollView style={[s.scroll, darkMode && s.scrollDark]} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>

          {/* Timing */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <View style={[s.sectionIconWrap, darkMode && s.sectionIconWrapDark]}>
                <Text style={s.sectionIcon}>🕐</Text>
              </View>
              <Text style={[s.sectionTitle, darkMode && s.sectionTitleDark]}>When to Perform It</Text>
            </View>
            <View style={[s.card, darkMode && s.cardDark]}>
              <View style={s.timingHeader}>
                <Text style={[s.cardTitle, darkMode && s.cardTitleDark]}>Required Time</Text>
                <View style={s.badge}><Text style={s.badgeText}>ESSENTIAL</Text></View>
              </View>
              <View style={[s.timeSlot, darkMode && s.timeSlotDark]}>
                <View style={s.timeIconWrap}><Text>🕌</Text></View>
                <View>
                  <Text style={[s.timeDay, darkMode && s.timeDayDark]}>Every Friday</Text>
                  <Text style={[s.timeText, darkMode && s.timeTextDark]}>Between Asr prayer and sunset</Text>
                </View>
              </View>
              <View style={[s.noteBox, darkMode && s.noteBoxDark]}>
                <Text style={s.noteIcon}>💡</Text>
                <Text style={[s.note, darkMode && s.noteDark]}>Performed in a group whenever possible; individually if circumstances prevent gathering</Text>
              </View>
            </View>
          </View>

          {/* Preparation */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <View style={[s.sectionIconWrap, darkMode && s.sectionIconWrapDark]}>
                <Text style={s.sectionIcon}>🧘‍♂️</Text>
              </View>
              <Text style={[s.sectionTitle, darkMode && s.sectionTitleDark]}>Spiritual Preparation</Text>
            </View>
            <View style={[s.card, darkMode && s.cardDark]}>
              {preparation.map((item, i) => (
                <View key={i} style={[s.prepItem, darkMode && s.prepItemDark]}>
                  <View style={s.prepIconWrap}><Text style={s.prepIcon}>{item.icon}</Text></View>
                  <Text style={[s.prepText, darkMode && s.prepTextDark]}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Steps */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <View style={[s.sectionIconWrap, darkMode && s.sectionIconWrapDark]}>
                <Text style={s.sectionIcon}>📋</Text>
              </View>
              <Text style={[s.sectionTitle, darkMode && s.sectionTitleDark]}>Steps — In Order</Text>
            </View>

            {steps.map((item, i) => (
              <View key={i} style={[
                s.stepCard, darkMode && s.stepCardDark,
                item.highlight && s.stepHighlight,
                item.highlight && darkMode && s.stepHighlightDark,
              ]}>
                <View style={s.stepHeader}>
                  <View style={[s.stepNum, item.highlight && s.stepNumHighlight]}>
                    <Text style={s.stepNumText}>{item.step}</Text>
                  </View>
                  <Text style={s.stepEmoji}>{item.icon}</Text>
                  <Text style={[s.stepTitle, darkMode && s.stepTitleDark]}>{item.title}</Text>
                </View>
                {item.arabic && (
                  <View style={[s.arabicBox, darkMode && s.arabicBoxDark]}>
                    <Text style={[s.arabicText, darkMode && s.arabicTextDark]}>{item.arabic}</Text>
                  </View>
                )}
                <View style={s.stepMeta}>
                  {item.count && (
                    <View style={[s.countBadge, item.highlight && s.countBadgeHL]}>
                      <Text style={[s.countText, item.highlight && s.countTextHL]}>{item.count}</Text>
                    </View>
                  )}
                  <Text style={[s.stepDesc, darkMode && s.stepDescDark]}>{item.description}</Text>
                </View>
                {item.alternateCount && (
                  <View style={s.stepMeta}>
                    <View style={s.countBadgeSec}>
                      <Text style={s.countTextSec}>{item.alternateCount}</Text>
                    </View>
                    <Text style={[s.stepDesc, darkMode && s.stepDescDark]}>{item.alternateDescription}</Text>
                  </View>
                )}
                {item.note && (
                  <View style={[s.stepNote, darkMode && s.stepNoteDark]}>
                    <Text style={s.stepNoteIcon}>💫</Text>
                    <Text style={[s.stepNoteText, darkMode && s.stepNoteTextDark]}>{item.note}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Collective dimension */}
          <View style={s.section}>
            <View style={[s.collectiveCard, darkMode && s.collectiveCardDark]}>
              <View style={s.collectiveHeader}>
                <View style={s.collectiveIconWrap}><Text style={{ fontSize: 20 }}>👥</Text></View>
                <Text style={[s.collectiveTitle, darkMode && s.collectiveTitleDark]}>The Collective Dimension</Text>
              </View>
              <Text style={[s.collectiveText, darkMode && s.collectiveTextDark]}>
                The Friday Hadra is above all a communal practice. Performing it together reinforces spiritual brotherhood and amplifies the barakah of the gathering. Reciting in unison, with a shared rhythm, enables participants to reach elevated spiritual states.
              </Text>
            </View>
          </View>

          {/* Note on numbers */}
          <View style={s.section}>
            <View style={[s.infoCard, darkMode && s.infoCardDark]}>
              <View style={s.infoIconWrap}><Text style={{ fontSize: 20 }}>📌</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={[s.infoTitle, darkMode && s.infoTitleDark]}>A Note on Counts</Text>
                <Text style={[s.infoText, darkMode && s.infoTextDark]}>
                  The repetition counts may be adapted to circumstances and available time. What matters most is the quality of one's spiritual presence and sincerity of heart — not strict numerical adherence.
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: 50 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  containerDark: { backgroundColor: '#0F1419' },
  header: { position: 'relative', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerDark: { backgroundColor: '#1A1F26' },
  headerContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 52, height: 52, borderRadius: 15, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginRight: 14, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  titleContainer: { flex: 1 },
  title: { fontSize: 19, fontWeight: '800', color: '#0F172A', letterSpacing: -0.4, marginBottom: 3 },
  titleDark: { color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  subtitleDark: { color: '#94A3B8' },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  closeBtnDark: { backgroundColor: '#374151' },
  headerAccent: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: '#10B981' },
  scroll: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollDark: { backgroundColor: '#0F1419' },
  scrollContent: { paddingTop: 20 },
  section: { paddingHorizontal: 20, marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  sectionIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' },
  sectionIconWrapDark: { backgroundColor: '#064E3B' },
  sectionIcon: { fontSize: 18 },
  sectionTitle: { fontSize: 19, fontWeight: '700', color: '#0F172A', letterSpacing: -0.3 },
  sectionTitleDark: { color: '#FFFFFF' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardDark: { backgroundColor: '#1A1F26' },
  timingHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#10B981' },
  cardTitleDark: { color: '#34D399' },
  badge: { backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#059669', letterSpacing: 0.5 },
  timeSlot: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14, marginBottom: 12, gap: 12 },
  timeSlotDark: { backgroundColor: '#111827' },
  timeIconWrap: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  timeDay: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  timeDayDark: { color: '#FFFFFF' },
  timeText: { fontSize: 14, color: '#64748B' },
  timeTextDark: { color: '#94A3B8' },
  noteBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#ECFDF5', borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: '#10B981', gap: 10 },
  noteBoxDark: { backgroundColor: '#064E3B', borderLeftColor: '#34D399' },
  noteIcon: { fontSize: 15, marginTop: 1 },
  note: { fontSize: 13, color: '#059669', fontWeight: '500', flex: 1, lineHeight: 18 },
  noteDark: { color: '#6EE7B7' },
  prepItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 12, backgroundColor: '#F8FAFC', borderRadius: 10, marginBottom: 8, gap: 12 },
  prepItemDark: { backgroundColor: '#111827' },
  prepIconWrap: { width: 34, height: 34, borderRadius: 9, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  prepIcon: { fontSize: 17 },
  prepText: { fontSize: 14, color: '#374151', fontWeight: '500', flex: 1, lineHeight: 20 },
  prepTextDark: { color: '#D1D5DB' },
  stepCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#10B981', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  stepCardDark: { backgroundColor: '#1A1F26' },
  stepHighlight: { borderLeftColor: '#F59E0B', backgroundColor: '#FFFBEB' },
  stepHighlightDark: { backgroundColor: '#1F2937', borderLeftColor: '#FBBF24' },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  stepNum: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  stepNumHighlight: { backgroundColor: '#F59E0B' },
  stepNumText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  stepEmoji: { fontSize: 18 },
  stepTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', flex: 1 },
  stepTitleDark: { color: '#FFFFFF' },
  arabicBox: { backgroundColor: '#F0FDF4', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#BBF7D0' },
  arabicBoxDark: { backgroundColor: '#064E3B', borderColor: '#065F46' },
  arabicText: { fontSize: 17, color: '#059669', fontWeight: '600', textAlign: 'right', lineHeight: 28 },
  arabicTextDark: { color: '#6EE7B7' },
  stepMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  countBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 7 },
  countBadgeHL: { backgroundColor: '#FEF3C7' },
  countText: { fontSize: 12, fontWeight: '800', color: '#059669' },
  countTextHL: { color: '#D97706' },
  countBadgeSec: { backgroundColor: '#F1F5F9', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 7 },
  countTextSec: { fontSize: 12, fontWeight: '800', color: '#64748B' },
  stepDesc: { fontSize: 13, color: '#64748B', flex: 1, lineHeight: 18 },
  stepDescDark: { color: '#94A3B8' },
  stepNote: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', borderRadius: 8, padding: 10, marginTop: 8, gap: 8 },
  stepNoteDark: { backgroundColor: '#1F2937' },
  stepNoteIcon: { fontSize: 13 },
  stepNoteText: { fontSize: 12, color: '#D97706', fontWeight: '600', flex: 1, lineHeight: 16 },
  stepNoteTextDark: { color: '#FCD34D' },
  collectiveCard: { backgroundColor: '#ECFDF5', borderRadius: 16, padding: 18, borderWidth: 1.5, borderColor: '#A7F3D0' },
  collectiveCardDark: { backgroundColor: '#064E3B', borderColor: '#059669' },
  collectiveHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  collectiveIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  collectiveTitle: { fontSize: 16, fontWeight: '700', color: '#047857' },
  collectiveTitleDark: { color: '#6EE7B7' },
  collectiveText: { fontSize: 14, color: '#065F46', lineHeight: 22, fontWeight: '500' },
  collectiveTextDark: { color: '#A7F3D0' },
  infoCard: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 18, flexDirection: 'row', borderWidth: 1, borderColor: '#E2E8F0', gap: 14 },
  infoCardDark: { backgroundColor: '#1A1F26', borderColor: '#374151' },
  infoIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  infoTitle: { fontSize: 15, fontWeight: '700', color: '#374151', marginBottom: 6 },
  infoTitleDark: { color: '#D1D5DB' },
  infoText: { fontSize: 13, color: '#64748B', lineHeight: 20 },
  infoTextDark: { color: '#94A3B8' },
});