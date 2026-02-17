import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Clock, Heart, AlertCircle, BookOpen, Sparkles, Star, ChevronDown, ChevronUp, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WirdInfoModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

const STEPS = [
  { step: '1', icon: '🤲', color: '#8B5CF6', title: 'Intention (Niyya)', description: 'Set a sincere intention to recite the Wird for Allah alone', details: 'Pure intention is the cornerstone of every act of worship. Direct your heart entirely toward seeking divine pleasure and drawing closer to Allah before you begin.' },
  { step: '2', icon: '🛡️', color: '#06B6D4', title: "Seeking Refuge (Ta'awwudh)", arabic: 'أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', transliteration: "A'ūdhu bi-Llāhi mina sh-shayṭāni r-rajīm", translation: 'I seek refuge in Allah from the accursed Satan', description: 'Once (1×) — Seeking divine protection', details: 'This invocation shields the heart from distractions and spiritual interference, creating a protected space for the recitation ahead.' },
  { step: '3', icon: '📖', color: '#10B981', title: 'Sūrat al-Fātiḥa', description: 'Recite al-Fātiḥa once (1×)', details: "Al-Fātiḥa is 'the Mother of the Qur'an.' It opens the door of direct communication with Allah and contains the entire essence of the divine message in seven verses." },
  { step: '4', icon: '💧', color: '#F59E0B', title: 'Istighfār — Seeking Forgiveness', arabic: 'أَسْتَغْفِرُ اللّٰهَ', transliteration: 'Astaghfiru Llāh', translation: 'I seek forgiveness from Allah', description: 'One hundred times (100×) — Purification of the heart', details: 'This simple yet profound phrase purifies the soul from minor transgressions and prepares the heart to receive divine light. The Prophet ﷺ himself recited it over seventy times a day.' },
  { step: '5', icon: '✨', color: '#EC4899', title: 'Ṣalawāt — Blessings on the Prophet', arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَسَلِّمْ', transliteration: "Allāhumma ṣalli 'alā sayyidinā Muḥammadin wa sallim", translation: 'O Allah, bestow blessings and peace upon our master Muhammad', description: 'One hundred times (100×) — Prophetic blessings', details: 'Every single invocation of blessings upon the Prophet ﷺ draws ten blessings from Allah in return. It is the most direct path to prophetic intercession and spiritual elevation.' },
  { step: '6', icon: '🌙', color: '#6366F1', title: 'Glorification (Tasbīḥ)', arabic: 'سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ ۝ وَسَلَامٌ عَلَى الْمُرْسَلِينَ ۝ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ', transliteration: "Subḥāna rabbika rabbi l-'izzati 'ammā yaṣifūn, wa salāmun 'alā l-mursalīn, wa l-ḥamdu li-Llāhi rabbi l-'ālamīn", translation: 'Glory be to your Lord, Lord of Might, above what they attribute. Peace be upon the messengers. And praise be to Allah, Lord of all the worlds.', description: "Once (1×) — Qur'anic verses of glorification (37:180–182)", details: 'These sacred closing verses purify the tongue and seal the session with praise. They extend peace to all prophets and affirm the absolute transcendence of Allah.' },
  { step: '7', icon: '☝️', color: '#14B8A6', title: 'Tahlīl — Declaration of Divine Unity', arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ', transliteration: 'Lā ilāha illa Llāh', translation: 'There is no deity worthy of worship but Allah', description: 'One hundred times (100×) — Affirmation of divine oneness', details: 'The Tahlīl is the greatest of all words — the key to Paradise and the very essence of the message of every prophet. One hundred repetitions fill the scales of good deeds and raise the reciter in divine rank.' },
];

const VIRTUES = [
  { icon: '🌟', title: 'Daily Spiritual Protection', desc: 'A shield against trials, hardships, and spiritual harm' },
  { icon: '💎', title: 'Elevation of Rank', desc: 'Gradual ascent in closeness to Allah and spiritual station' },
  { icon: '🌙', title: 'Heart Purification', desc: 'Cleansing of spiritual ailments — arrogance, envy, heedlessness' },
  { icon: '✨', title: 'Perpetual Blessing', desc: 'Barakah flowing into every domain: health, livelihood, relationships' },
];

const CONDITIONS = [
  { icon: '💧', title: 'Ritual Purity (Wuḍū)', desc: 'Valid ablution is required throughout the entire recitation', required: true },
  { icon: '🧘', title: 'Proper Posture', desc: 'Sit upright as in the prayer position, with dignity and stillness', required: true },
  { icon: '🕋', title: 'Facing the Qibla', desc: 'Orient yourself toward the sacred direction of Mecca', required: true },
  { icon: '❤️', title: 'Presence of Heart', desc: 'Full concentration and inner humility — the spirit of all worship', required: true },
];

function StepCard({ item, dark }: { item: any; dark: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity style={[sc.wrap, dark && sc.wrapDark, expanded && sc.wrapExpanded, { borderLeftColor: item.color }]} onPress={() => setExpanded(e => !e)} activeOpacity={0.75}>
      <View style={sc.header}>
        <View style={[sc.badge, { backgroundColor: item.color }]}><Text style={sc.badgeText}>{item.step}</Text></View>
        <View style={sc.meta}>
          <View style={sc.titleRow}>
            <Text style={sc.stepEmoji}>{item.icon}</Text>
            <Text style={[sc.title, dark && sc.titleDark]} numberOfLines={1}>{item.title}</Text>
          </View>
          <Text style={[sc.desc, dark && sc.descDark]}>{item.description}</Text>
        </View>
        <View style={[sc.chevronWrap, { backgroundColor: item.color + '18' }]}>
          {expanded ? <ChevronUp color={item.color} size={14} strokeWidth={2.5} /> : <ChevronDown color={item.color} size={14} strokeWidth={2.5} />}
        </View>
      </View>
      {expanded && (
        <View style={sc.body}>
          {item.arabic && (
            <View style={[sc.arabicBox, dark && sc.arabicBoxDark]}>
              <Text style={[sc.arabic, dark && sc.arabicDark]}>{item.arabic}</Text>
              {item.transliteration && <Text style={[sc.translit, dark && sc.translitDark]}>{item.transliteration}</Text>}
              {item.translation && <View style={[sc.translationRow, { borderLeftColor: item.color }]}><Text style={[sc.translation, dark && sc.translationDark]}>{item.translation}</Text></View>}
            </View>
          )}
          <Text style={[sc.details, dark && sc.detailsDark]}>{item.details}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const sc = StyleSheet.create({
  wrap: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10, borderLeftWidth: 4, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  wrapDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  wrapExpanded: { shadowOpacity: 0.1, elevation: 5 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { width: 30, height: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  badgeText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  meta: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 3 },
  stepEmoji: { fontSize: 15 },
  title: { fontSize: 15, fontWeight: '700', color: '#1E293B', flex: 1 },
  titleDark: { color: '#F8FAFC' },
  desc: { fontSize: 12, color: '#64748B', lineHeight: 17 },
  descDark: { color: '#94A3B8' },
  chevronWrap: { width: 26, height: 26, borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  body: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  arabicBox: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14, marginBottom: 12 },
  arabicBoxDark: { backgroundColor: '#0F172A' },
  arabic: { fontSize: 18, color: '#1E293B', textAlign: 'right', lineHeight: 32, fontWeight: '500', marginBottom: 8 },
  arabicDark: { color: '#E2E8F0' },
  translit: { fontSize: 13, color: '#64748B', fontStyle: 'italic', textAlign: 'right', marginBottom: 8 },
  translitDark: { color: '#94A3B8' },
  translationRow: { borderLeftWidth: 3, paddingLeft: 10, marginTop: 2 },
  translation: { fontSize: 13, color: '#475569', lineHeight: 20 },
  translationDark: { color: '#CBD5E1' },
  details: { fontSize: 13, color: '#475569', lineHeight: 21 },
  detailsDark: { color: '#94A3B8' },
});

export default function WirdInfoModal({ visible, onClose, darkMode = false }: WirdInfoModalProps) {
  const dark = darkMode;
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.root, dark && styles.rootDark]}>
        <LinearGradient colors={['#059669', '#047857']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
          <View style={styles.headerInner}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}><BookOpen color="#FFFFFF" size={22} strokeWidth={2} /></View>
              <View>
                <Text style={styles.headerTitle}>Wird al-Tijānī</Text>
                <Text style={styles.headerSub}>Daily Obligatory Practice</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}><X color="#FFFFFF" size={20} strokeWidth={2.5} /></TouchableOpacity>
          </View>
          <LinearGradient colors={['#FCD34D', '#F59E0B', '#FCD34D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.goldLine} />
        </LinearGradient>

        <ScrollView style={[styles.scroll, dark && styles.scrollDark]} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.introCard, dark && styles.introCardDark]}>
            <View style={styles.introTopRow}><Sparkles color="#059669" size={18} strokeWidth={2} /><Text style={[styles.introTitle, dark && styles.introTitleDark]}>The Essence of the Wird</Text></View>
            <Text style={[styles.introBody, dark && styles.introBodyDark]}>The Wird (literally "the regular") is the foundational spiritual practice of the Tarīqa Tijāniyya. Recited twice daily, it forms the indispensable daily bond with Allah and the path to purification of the soul. It is obligatory upon every initiated member of the order.</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHead}><Clock color="#059669" size={18} strokeWidth={2} /><Text style={[styles.sectionTitle, dark && styles.sectionTitleDark]}>Prescribed Times</Text></View>
            <View style={[styles.card, dark && styles.cardDark]}>
              <View style={styles.freqBadge}><Star color="#F59E0B" size={14} strokeWidth={2.5} /><Text style={styles.freqText}>Twice daily — obligatory</Text></View>
              <View style={styles.timingRow}>
                <View style={[styles.timeBadge, styles.timeMorning]}><Text style={styles.timeBadgeText}>Morning</Text></View>
                <View style={styles.timingDetail}><Text style={[styles.timingTitle, dark && styles.timingTitleDark]}>After Fajr Prayer</Text><Text style={[styles.timingDesc, dark && styles.timingDescDark]}>Up to 3 hours after sunrise</Text></View>
              </View>
              <View style={styles.divider} />
              <View style={styles.timingRow}>
                <View style={[styles.timeBadge, styles.timeAfternoon]}><Text style={styles.timeBadgeText}>Afternoon</Text></View>
                <View style={styles.timingDetail}><Text style={[styles.timingTitle, dark && styles.timingTitleDark]}>After ʿAṣr Prayer</Text><Text style={[styles.timingDesc, dark && styles.timingDescDark]}>Until 4 hours after sunset</Text></View>
              </View>
              <View style={[styles.alertRow, dark && styles.alertRowDark]}><AlertCircle color="#EF4444" size={15} strokeWidth={2} /><Text style={[styles.alertText, dark && styles.alertTextDark]}>Immediate make-up is obligatory if missed or delayed</Text></View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHead}><Shield color="#059669" size={18} strokeWidth={2} /><Text style={[styles.sectionTitle, dark && styles.sectionTitleDark]}>Conditions of Validity</Text></View>
            <View style={[styles.card, dark && styles.cardDark]}>
              {CONDITIONS.map((item, i) => (
                <View key={i} style={[styles.condRow, i < CONDITIONS.length - 1 && styles.condRowBorder, dark && styles.condRowBorderDark]}>
                  <Text style={styles.condIcon}>{item.icon}</Text>
                  <View style={styles.condMeta}>
                    <View style={styles.condTitleRow}><Text style={[styles.condTitle, dark && styles.condTitleDark]}>{item.title}</Text>{item.required && <View style={styles.reqBadge}><Text style={styles.reqText}>Required</Text></View>}</View>
                    <Text style={[styles.condDesc, dark && styles.condDescDark]}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHead}><BookOpen color="#059669" size={18} strokeWidth={2} /><Text style={[styles.sectionTitle, dark && styles.sectionTitleDark]}>The Seven Steps of the Wird</Text></View>
            <Text style={[styles.sectionHint, dark && styles.sectionHintDark]}>Tap any step to expand details</Text>
            {STEPS.map((item, index) => <StepCard key={index} item={item} dark={dark} />)}
          </View>

          <View style={styles.section}>
            <View style={[styles.rulesCard, dark && styles.rulesCardDark]}>
              <View style={styles.rulesHeader}><AlertCircle color="#EF4444" size={18} strokeWidth={2} /><Text style={styles.rulesTitle}>Strict Rules to Observe</Text></View>
              {['Maintain the exact sequence of all seven steps', 'Never interrupt the recitation once it has begun', 'Immediately make up any missed or delayed session', 'Sustain the twice-daily regularity without exception', 'Preserve ritual purity (wuḍū) throughout the entire recitation'].map((rule, i) => (
                <View key={i} style={styles.ruleRow}><View style={styles.ruleDot} /><Text style={[styles.ruleText, dark && styles.ruleTextDark]}>{rule}</Text></View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={[styles.virtuesCard, dark && styles.virtuesCardDark]}>
              <View style={styles.virtuesHeader}><Heart color="#3B82F6" size={18} strokeWidth={2} /><Text style={styles.virtuesTitle}>Spiritual Virtues of the Wird</Text></View>
              <View style={styles.virtuesGrid}>
                {VIRTUES.map((v, i) => (
                  <View key={i} style={[styles.virtueItem, dark && styles.virtueItemDark]}>
                    <Text style={styles.virtueEmoji}>{v.icon}</Text>
                    <Text style={[styles.virtueTitle, dark && styles.virtueTitleDark]}>{v.title}</Text>
                    <Text style={[styles.virtueDesc, dark && styles.virtueDescDark]}>{v.desc}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  rootDark: { backgroundColor: '#0F172A' },
  header: { paddingBottom: 0 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },
  headerSub: { fontSize: 12, color: '#D1FAE5', fontWeight: '500', marginTop: 2 },
  closeBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  goldLine: { height: 3 },
  scroll: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollDark: { backgroundColor: '#0F172A' },
  scrollContent: { padding: 16, paddingTop: 20 },
  introCard: { backgroundColor: '#F0FDF4', borderRadius: 20, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: '#A7F3D0' },
  introCardDark: { backgroundColor: '#052E16', borderColor: '#065F46' },
  introTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  introTitle: { fontSize: 15, fontWeight: '700', color: '#059669' },
  introTitleDark: { color: '#34D399' },
  introBody: { fontSize: 14, color: '#065F46', lineHeight: 22 },
  introBodyDark: { color: '#A7F3D0' },
  section: { marginBottom: 24 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B', letterSpacing: -0.2 },
  sectionTitleDark: { color: '#F8FAFC' },
  sectionHint: { fontSize: 12, color: '#94A3B8', marginBottom: 10, marginLeft: 2 },
  sectionHintDark: { color: '#475569' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  cardDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  freqBadge: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, marginBottom: 16, alignSelf: 'flex-start' },
  freqText: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  timingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timeBadge: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 10 },
  timeMorning: { backgroundColor: '#DBEAFE' },
  timeAfternoon: { backgroundColor: '#FED7AA' },
  timeBadgeText: { fontSize: 12, fontWeight: '700', color: '#1E3A8A' },
  timingDetail: { flex: 1 },
  timingTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  timingTitleDark: { color: '#F8FAFC' },
  timingDesc: { fontSize: 13, color: '#64748B' },
  timingDescDark: { color: '#94A3B8' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF2F2', padding: 12, borderRadius: 12, marginTop: 14, borderWidth: 1, borderColor: '#FECACA' },
  alertRowDark: { backgroundColor: '#450A0A', borderColor: '#7F1D1D' },
  alertText: { fontSize: 13, color: '#DC2626', flex: 1, fontWeight: '500', lineHeight: 18 },
  alertTextDark: { color: '#FCA5A5' },
  condRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 14 },
  condRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  condRowBorderDark: { borderBottomColor: '#334155' },
  condIcon: { fontSize: 22, marginTop: 2 },
  condMeta: { flex: 1 },
  condTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  condTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', flex: 1 },
  condTitleDark: { color: '#F8FAFC' },
  reqBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  reqText: { fontSize: 10, fontWeight: '800', color: '#1E40AF', textTransform: 'uppercase', letterSpacing: 0.5 },
  condDesc: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  condDescDark: { color: '#94A3B8' },
  rulesCard: { backgroundColor: '#FEF2F2', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#FECACA' },
  rulesCardDark: { backgroundColor: '#450A0A', borderColor: '#7F1D1D' },
  rulesHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  rulesTitle: { fontSize: 15, fontWeight: '800', color: '#DC2626' },
  ruleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  ruleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#DC2626', marginTop: 8, flexShrink: 0 },
  ruleText: { fontSize: 13, color: '#991B1B', flex: 1, lineHeight: 20 },
  ruleTextDark: { color: '#FCA5A5' },
  virtuesCard: { backgroundColor: '#EFF6FF', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#BFDBFE' },
  virtuesCardDark: { backgroundColor: '#0C1A40', borderColor: '#1E3A8A' },
  virtuesHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  virtuesTitle: { fontSize: 15, fontWeight: '800', color: '#2563EB' },
  virtuesGrid: { gap: 10 },
  virtueItem: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  virtueItemDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  virtueEmoji: { fontSize: 22, marginBottom: 6 },
  virtueTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  virtueTitleDark: { color: '#F8FAFC' },
  virtueDesc: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  virtueDescDark: { color: '#94A3B8' },
});