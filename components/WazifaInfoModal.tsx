import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Clock, Heart, AlertTriangle, BookOpen, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react-native';

interface WazifaInfoModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export default function WazifaInfoModal({ visible, onClose, darkMode = false }: WazifaInfoModalProps) {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const toggle = (i: number) => setExpandedSection(expandedSection === i ? null : i);

  const steps = [
    { step: '1', title: 'Intention (Niyya)', icon: '🤲', color: '#8B5CF6', description: 'Form a sincere intention to recite the Wazīfa for the sake of God', details: 'Intention is the foundation of all acts of worship. It must be pure and directed solely toward God.' },
    { step: '2', title: 'Seeking Refuge (Ta\'awwudh)', icon: '🛡️', color: '#06B6D4', arabic: 'أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', transliteration: 'A\'ūdhu bi-Llāhi mina sh-shayṭāni r-rajīm', description: '1× — Seeking refuge from Satan the accursed', details: 'This invocation protects the reciter from distractions and temptations during the session.' },
    { step: '3', title: 'Sūrat Al-Fātiḥa', icon: '📖', color: '#10B981', description: 'Recite the Opening Chapter of the Qur\'an — 1×', details: 'Al-Fātiḥa is the opening of the Qur\'an and contains the essence of the entire divine revelation.' },
    { step: '4', title: 'Special Seeking of Forgiveness (Istighfār)', icon: '🌟', color: '#F59E0B', arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ الَّذِي لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', transliteration: 'Astaghfiru Llāha l-\'aẓīma lladhī lā ilāha illā huwa l-ḥayyu l-qayyūm', description: '30× — Seeking forgiveness through the Names Al-Ḥayy and Al-Qayyūm', details: 'This complete formula of forgiveness purifies the heart and prepares the soul to receive divine blessings.' },
    { step: '5', title: 'Ṣalāt al-Fātiḥ', icon: '✨', color: '#EC4899', arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ...', transliteration: 'Allāhumma ṣalli \'alā sayyidinā Muḥammadin l-fātiḥi limā ughliqa...', description: '50× — Revealed to Sīdī Ahmad al-Tijānī', details: 'This blessed prayer is said to hold the value of 600,000 ordinary blessings upon the Prophet ﷺ, according to Tijaniyya tradition.' },
    { step: '6', title: 'Glorification (Tasbīḥ)', icon: '🌙', color: '#6366F1', arabic: 'سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ ۝ وَسَلَامٌ عَلَى الْمُرْسَلِينَ ۝ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ', transliteration: 'Subḥāna rabbika rabbi l-\'izzati \'ammā yaṣifūn...', description: '1× — Divine glorification and salutation upon the prophets', details: 'These Quranic verses sanctify God and invoke peace upon all His messengers.' },
    { step: '7', title: 'Tahlīl — Oneness of God', icon: '☝️', color: '#14B8A6', arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ', transliteration: 'Lā ilāha illā Llāh', description: '100× — Proclamation of absolute Divine Oneness', details: 'The Tahlīl is the key to Paradise and the most powerful affirmation of Islamic faith.' },
    { step: '8', title: 'Jawharat al-Kamāl', icon: '💎', color: '#F59E0B', arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى عَيْنِ الرَّحْمَةِ الرَّبَّانِيَّةِ...', transliteration: 'Allāhumma ṣalli wa sallim \'alā \'ayni r-raḥmati r-rabbāniyya...', description: '12× — "The Jewel of Perfection"', details: 'Strictly reserved for initiated members of the Tijaniyya path. This exalted prayer contains deep spiritual secrets and must not be recited without proper authorization.', warning: true },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[s.container, darkMode && s.containerDark]}>

        <View style={[s.header, darkMode && s.headerDark]}>
          <View style={s.headerContent}>
            <View style={[s.headerIcon, darkMode && s.headerIconDark]}>
              <BookOpen color="#FFFFFF" size={22} />
            </View>
            <View style={s.titleBlock}>
              <Text style={[s.title, darkMode && s.titleDark]}>Wazīfa Guide</Text>
              <Text style={[s.subtitle, darkMode && s.subtitleDark]}>The essential daily recitation</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={[s.closeBtn, darkMode && s.closeBtnDark]} activeOpacity={0.7}>
            <X color={darkMode ? '#D1D5DB' : '#6B7280'} size={22} />
          </TouchableOpacity>
        </View>
        <View style={s.accentBar} />

        <ScrollView style={[s.scroll, darkMode && s.scrollDark]} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>

          {/* Introduction */}
          <View style={s.section}>
            <View style={[s.introCard, darkMode && s.introCardDark]}>
              <View style={s.introHeader}>
                <Sparkles color="#10B981" size={18} />
                <Text style={[s.introTitle, darkMode && s.introTitleDark]}>Spiritual Essence</Text>
              </View>
              <Text style={[s.introText, darkMode && s.introTextDark]}>
                The Wazīfa is the beating heart of the Tijaniyya Path. It is the daily connection to the barakah of our master Sīdī Aḥmad al-Tijānī, opening the doors of spiritual realization and drawing the servant ever closer to God.
              </Text>
            </View>
          </View>

          {/* Timing */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Clock color={darkMode ? '#10B981' : '#059669'} size={18} />
              <Text style={[s.sectionTitle, darkMode && s.sectionTitleDark]}>Recitation Times</Text>
            </View>
            <View style={[s.card, darkMode && s.cardDark]}>
              <View style={s.timingRow}>
                <View style={[s.timingBadge, s.badgeMorning]}><Text style={s.badgeText}>Morning</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.timingTitle, darkMode && s.timingTitleDark]}>After Fajr</Text>
                  <Text style={[s.timingDetail, darkMode && s.timingDetailDark]}>Until 3 hours after sunrise</Text>
                </View>
              </View>
              <View style={s.sep} />
              <View style={s.timingRow}>
                <View style={[s.timingBadge, s.badgeEvening]}><Text style={s.badgeText}>Evening</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.timingTitle, darkMode && s.timingTitleDark]}>After Asr</Text>
                  <Text style={[s.timingDetail, darkMode && s.timingDetailDark]}>Until 4 hours after sunset</Text>
                </View>
              </View>
              <View style={[s.noteRow, darkMode && s.noteRowDark]}>
                <Heart color="#10B981" size={15} />
                <Text style={[s.noteText, darkMode && s.noteTextDark]}>
                  May be recited both morning and evening to multiply the blessings
                </Text>
              </View>
            </View>
          </View>

          {/* Preparation */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <CheckCircle2 color={darkMode ? '#10B981' : '#059669'} size={18} />
              <Text style={[s.sectionTitle, darkMode && s.sectionTitleDark]}>Spiritual Preparation</Text>
            </View>
            <View style={[s.card, darkMode && s.cardDark]}>
              {[
                { icon: '💧', title: 'Ritual Purity', desc: 'State of wuḍū\' (ablution) is required' },
                { icon: '🧘', title: 'Posture', desc: 'Sit as in prayer, with full concentration and humility' },
                { icon: '🕋', title: 'Direction', desc: 'Face the Qibla (direction of Mecca)' },
                { icon: '❤️', title: 'Presence of Heart', desc: 'Maintain focus and inner stillness throughout' },
              ].map((item, i) => (
                <View key={i} style={s.prepItem}>
                  <Text style={s.prepEmoji}>{item.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.prepTitle, darkMode && s.prepTitleDark]}>{item.title}</Text>
                    <Text style={[s.prepDesc, darkMode && s.prepDescDark]}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Steps */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <BookOpen color={darkMode ? '#10B981' : '#059669'} size={18} />
              <Text style={[s.sectionTitle, darkMode && s.sectionTitleDark]}>Steps — In Strict Order</Text>
            </View>

            {steps.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  s.stepCard, darkMode && s.stepCardDark,
                  item.warning && s.warningStep, item.warning && darkMode && s.warningStepDark,
                  expandedSection === i && { borderColor: item.color },
                ]}
                onPress={() => toggle(i)}
                activeOpacity={0.7}
              >
                <View style={s.stepHeader}>
                  <View style={[s.stepNum, { backgroundColor: item.color }]}>
                    <Text style={s.stepNumText}>{item.step}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={s.stepTitleRow}>
                      <Text style={s.stepEmoji}>{item.icon}</Text>
                      <Text style={[s.stepTitle, darkMode && s.stepTitleDark]}>{item.title}</Text>
                    </View>
                    <Text style={[s.stepDesc, darkMode && s.stepDescDark]}>{item.description}</Text>
                  </View>
                  {expandedSection === i
                    ? <ChevronUp color={darkMode ? '#6B7280' : '#9CA3AF'} size={18} />
                    : <ChevronDown color={darkMode ? '#6B7280' : '#9CA3AF'} size={18} />
                  }
                </View>

                {expandedSection === i && (
                  <View style={[s.expanded, darkMode && s.expandedDark]}>
                    {item.arabic && (
                      <View style={[s.arabicBox, darkMode && s.arabicBoxDark]}>
                        <Text style={[s.arabicText, darkMode && s.arabicTextDark]}>{item.arabic}</Text>
                        {item.transliteration && (
                          <Text style={[s.translit, darkMode && s.translitDark]}>{item.transliteration}</Text>
                        )}
                      </View>
                    )}
                    <Text style={[s.detailText, darkMode && s.detailTextDark]}>{item.details}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Alerts */}
          <View style={s.section}>
            <View style={[s.alertCard, s.warningCard, darkMode && s.warningCardDark]}>
              <View style={s.alertHeader}>
                <AlertTriangle color="#F59E0B" size={18} />
                <Text style={[s.alertTitle, { color: '#EA580C' }]}>Important Warning</Text>
              </View>
              <Text style={s.warningText}>
                <Text style={s.bold}>Jawharat al-Kamāl</Text> is strictly reserved for initiated members of the Tijaniyya Path. It must never be recited without formal initiation from an authorized guide (muqaddam).
              </Text>
            </View>

            <View style={[s.alertCard, s.successCard, darkMode && s.successCardDark]}>
              <View style={s.alertHeader}>
                <Sparkles color="#10B981" size={18} />
                <Text style={[s.alertTitle, { color: '#059669' }]}>Spiritual Benefits</Text>
              </View>
              <Text style={s.successText}>
                {'• Purification of the heart and spiritual elevation\n• Divine protection through life\'s trials\n• Closeness to God and to the Prophet ﷺ\n• Perpetual barakah in this life and the next'}
              </Text>
            </View>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF' },
  headerDark: { backgroundColor: '#161B22' },
  headerContent: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  headerIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  headerIconDark: { backgroundColor: '#059669' },
  titleBlock: { flex: 1 },
  title: { fontSize: 18, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  titleDark: { color: '#F1F5F9' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  subtitleDark: { color: '#94A3B8' },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  closeBtnDark: { backgroundColor: '#21262D' },
  accentBar: { height: 3, backgroundColor: '#10B981' },
  scroll: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollDark: { backgroundColor: '#0D1117' },
  scrollContent: { paddingTop: 20 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  sectionTitleDark: { color: '#F1F5F9' },
  introCard: { backgroundColor: '#ECFDF5', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#A7F3D0' },
  introCardDark: { backgroundColor: '#064E3B', borderColor: '#065F46' },
  introHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  introTitle: { fontSize: 15, fontWeight: '700', color: '#059669' },
  introTitleDark: { color: '#34D399' },
  introText: { fontSize: 14, color: '#047857', lineHeight: 22 },
  introTextDark: { color: '#A7F3D0' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardDark: { backgroundColor: '#161B22' },
  timingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timingBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeMorning: { backgroundColor: '#DBEAFE' },
  badgeEvening: { backgroundColor: '#FEF3C7' },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#1F2937' },
  timingTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
  timingTitleDark: { color: '#F1F5F9' },
  timingDetail: { fontSize: 13, color: '#64748B' },
  timingDetailDark: { color: '#94A3B8' },
  sep: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F0FDF4', padding: 12, borderRadius: 8, marginTop: 12 },
  noteRowDark: { backgroundColor: '#064E3B' },
  noteText: { fontSize: 13, color: '#059669', flex: 1, fontStyle: 'italic' },
  noteTextDark: { color: '#6EE7B7' },
  prepItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 12 },
  prepEmoji: { fontSize: 22, marginTop: 2 },
  prepTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 3 },
  prepTitleDark: { color: '#F1F5F9' },
  prepDesc: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  prepDescDark: { color: '#94A3B8' },
  stepCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 2, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  stepCardDark: { backgroundColor: '#161B22', borderColor: '#21262D' },
  warningStep: { backgroundColor: '#FFFBEB', borderColor: '#FED7AA' },
  warningStepDark: { backgroundColor: '#1C0A00', borderColor: '#78350F' },
  stepHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepNum: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  stepNumText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  stepTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  stepEmoji: { fontSize: 17 },
  stepTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  stepTitleDark: { color: '#F1F5F9' },
  stepDesc: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  stepDescDark: { color: '#94A3B8' },
  expanded: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  expandedDark: { borderTopColor: '#21262D' },
  arabicBox: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 10, marginBottom: 12 },
  arabicBoxDark: { backgroundColor: '#0D1117' },
  arabicText: { fontSize: 16, color: '#10B981', fontWeight: '500', textAlign: 'right', lineHeight: 28, marginBottom: 6 },
  arabicTextDark: { color: '#34D399' },
  translit: { fontSize: 13, color: '#64748B', fontStyle: 'italic', textAlign: 'right' },
  translitDark: { color: '#94A3B8' },
  detailText: { fontSize: 14, color: '#374151', lineHeight: 21 },
  detailTextDark: { color: '#D1D5DB' },
  alertCard: { borderRadius: 16, padding: 16, marginBottom: 12 },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  alertTitle: { fontSize: 15, fontWeight: '700' },
  warningCard: { backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A' },
  warningCardDark: { backgroundColor: '#1C0A00', borderColor: '#78350F' },
  warningText: { fontSize: 14, color: '#92400E', lineHeight: 21 },
  successCard: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' },
  successCardDark: { backgroundColor: '#064E3B', borderColor: '#065F46' },
  successText: { fontSize: 14, color: '#047857', lineHeight: 22 },
  bold: { fontWeight: '700' },
});