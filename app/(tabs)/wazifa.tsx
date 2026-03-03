import React, { useState, useCallback, useMemo, useContext, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Animated, Modal, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Star, RotateCcw, Info, X, Settings, CheckCircle, Award, Flame, Target,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import DhikrCard from '../../components/DhikrCard';
import { useApp, WAZIFA_TARGETS } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import WazifaInfoModal from '../../components/WazifaInfoModal';
import StatsBar from '../../components/StatsBar';
import { useAutoScroll } from '@/components/hooks/useAutoScroll';
import { usePracticeTimer } from '@/components/hooks/usePracticeTimer';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';
import MinimalHeader from '../../components/MinimalHeader';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import OpeningBanner,    { DhikrRow }        from '../../components/OpeningBanner';
import CompletionBanner                       from '../../components/CompletionBanner';

// ─── Constants ────────────────────────────────────────────────────────────────

const WAZIFA_DHIKR = {
  istighfar: {
    title: 'Istighfār',
    arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ الَّذِي لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    transliteration: 'Astaghfiru Llāha l-ʿaẓīma lladhī lā ilāha illā huwa l-ḥayyu l-qayyūmu',
    translation: 'I seek forgiveness from Allah the Magnificent, there is no god but He, the Living, the Sustainer',
  },
  salatFatih: {
    title: 'Ṣalāt al-Fātiḥ',
    arabic: 'اَللَّهُمَّ صَلِّ عَلى سَيِّدِنَا مُحَمَّدٍ اَلْفَاتِحِ لِمَا أُغْلِقَ وَ اَلْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بَالْحَقَّ وَ الْهَادِي إلى صِرَاطِكَ الْمُسْتَقِيمِ وَ عَلَى آلِهِ حَقَّ قَدْرِهِ و مِقْدَارِهِ الْعَظِيمِ',
    transliteration: 'Allāhumma ṣalli ʿalā sayyidinā Muḥammadin l-fātiḥi limā ughliqa wa l-khātimi limā sabaqa nāṣiri l-ḥaqqi bi-l-ḥaqqa wa l-hādī ilā ṣirāṭika l-mustaqīm wa ʿalā ālihi ḥaqqa qadrihi wa miqdārihi l-ʿaẓīm',
    translation: 'O Allah, send blessings upon our master Muhammad, the Opener of what was closed...',
  },
  tahlil: {
    title: 'Tahlīl',
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
    transliteration: 'Lā ilāha illa Llāh',
    translation: 'There is no god but Allah',
  },
  jawhara: {
    title: 'Jawharat al-Kamāl',
    arabic: 'اَللَّهُـمَّ صَـلِّ وَسَلِّـمْ عَـلَى عَيْـنِ الـرَّحْـمَـةِ الرَّبَّــانِـيَـةِ وَاليَاقُـوتَـةِ المُتَـحَقِّـقَـةِ الحَـائِطَةِ بِمَـرْكَزِ الفُـهُومِ والمَعَـانِي، وَنُـورِ الأَكْـوَانِ المُتَـكَوِّنَـةِ الآدَمِـي صَـاحِبِ الحَـقِّ الـرَّبَّانِي، البَرْقِ الأَسْطَعِ بِمُزُونِ الأَرْبَاحِ المَالِئَةِ لِكُلِّ مُتَعَرِّضٍ مِنَ البُحُورِ وَالأَوَانِي، وَنُـورِكَ اللاَّمِعِ الـذِي مَـلأْتَ بِهِ كَوْنَكَ الحَـائِطِ بِأَمْكِنَةِ المَـكَانِي، اَللَّهُـمَّ صَلِّ وَسَلِّمْ عَلَى عَيْنِ الحَقِّ التِي تَتَجَلَّى مِنْهَا عُرُوشُ الحَقَـائِقِ عَيْــنِ المَـعَارِفِ الأَقْـوَمِ صِـرَاطِـكَ التَّـــامِّ الأَسْـقَــمِ، اللَّهُـمَّ صَـلِّ وَسَلِّـمْ عَلَى طَلْعَةِ الحَـقِّ بَالحَـقِّ الكَـنْزِ الأَعْـظَمِ إِفَـاضَتِـكَ مِنْـكَ إِلَيْــكَ إِحَـاطَـةِ النُّـورِ المُطَــلْسَــمِ صَلَّـى اللهُ عَلَيْـهِ وَعَـلَى آلِـهِ، صَـلاَةً تُعَرِّفُنَـا بِـهَا إِيَّـــاهُ',
    transliteration: 'Allāhumma ṣalli wa sallim ʿalā ʿayni r-raḥmati r-rabbāniyyati wa l-yāqūtati l-mutaḥaqqiqati l-ḥāʾiṭati bi-markazi l-fuhūmi wa l-maʿānī, wa nūri l-akwāni l-mutakawwinati l-ādamī ṣāḥibi l-ḥaqqi r-rabbānī, al-barqi l-asṭaʿi bi-muzūni l-arbāḥi l-māliʾati li-kulli mutaʿarriḍin mina l-buḥūri wa l-awānī, wa nūrika l-lāmiʿi lladhī malaʾta bihi kawnaka l-ḥāʾiṭi bi-amkinati l-makānī. Allāhumma ṣalli wa sallim ʿalā ʿayni l-ḥaqqi llatī tatajallā minhā ʿurūshu l-ḥaqāʾiqi ʿayni l-maʿārifi l-aqwami ṣirāṭika t-tāmmi l-asqami. Allāhumma ṣalli wa sallim ʿalā ṭalʿati l-ḥaqqi bi-l-ḥaqqi l-kanzi l-aʿẓami ifāḍatika minka ilayka iḥāṭati n-nūri l-muṭalsami. Ṣallā Llāhu ʿalayhi wa ʿalā ālihi ṣalātan tuʿarrifunā bihā iyyāh',
    translation: 'O Allah, bestow blessings and peace upon the Essence of Divine Mercy, the Realized Ruby encompassing the center of understanding and meanings; the Light of all created universes, the Adamic one, possessor of the Lordly Truth; the Brightest Lightning of the clouds of profits filling every receptive vessel from the seas and containers; and Your radiant Light with which You filled Your universe encompassing all dimensions of space. O Allah, bestow blessings and peace upon the Essence of Truth from which the thrones of realities are manifested — the Essence of the most upright knowledge, Your most perfect and complete path. O Allah, bestow blessings and peace upon the Manifestation of Truth through Truth — the Greatest Treasure, Your effusion from You to You, encompassing the sealed Light. May Allah bless him and his family with a blessing through which You make us know him.',
  },
} as const;

const DHIKR_KEYS = ['istighfar', 'salatFatih1', 'tahlil', 'jawhara'] as const;

const AUTOSCROLL_DELAYS: number[] = [700, 4000, 3000, 700];

// ─── Instructions ─────────────────────────────────────────────────────────────

function Instructions({ dark }: { dark: boolean }) {
  return (
    <View style={[instr.wrap, dark && instr.wrapDark]}>
      <View style={instr.header}>
        <Text style={instr.emoji}>⭐</Text>
        <Text style={[instr.title, dark && instr.titleDark]}>Wazīfa Recitation Guide</Text>
      </View>
      {[
        { icon: '🕌', text: 'Once daily after Asr, or twice after Fajr and Asr' },
        { icon: '👥', text: 'Best practiced in congregation' },
        { icon: '🔢', text: 'Complete each dhikr sequentially' },
        { icon: '⚙️', text: 'Customize final dhikr in settings (Jawhara 11x/12x or Ṣalāt al-Fātiḥ 20x)' },
      ].map((item, i) => (
        <View key={i} style={instr.row}>
          <Text style={instr.rowIcon}>{item.icon}</Text>
          <Text style={[instr.rowText, dark && instr.rowTextDark]}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}

const instr = StyleSheet.create({
  wrap:        { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginHorizontal: 16, marginTop: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  wrapDark:    { backgroundColor: '#1E293B', borderColor: '#334155' },
  header:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  emoji:       { fontSize: 20 },
  title:       { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  titleDark:   { color: '#F8FAFC' },
  row:         { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  rowIcon:     { fontSize: 16 },
  rowText:     { fontSize: 14, color: '#64748B', flex: 1, lineHeight: 20 },
  rowTextDark: { color: '#94A3B8' },
});

// ─── Settings Modal ───────────────────────────────────────────────────────────

interface SettingsModalProps {
  visible: boolean; onClose: () => void; dark: boolean;
  tempUseJawhara: boolean; setTempUseJawhara: (v: boolean) => void;
  tempJawharaCount: number; setTempJawharaCount: (v: number) => void;
  onSave: () => void;
}

function WazifaSettingsModal({
  visible, onClose, dark,
  tempUseJawhara, setTempUseJawhara,
  tempJawharaCount, setTempJawharaCount, onSave,
}: SettingsModalProps) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[sModal.container, dark && sModal.containerDark]}>
        <View style={[sModal.header, dark && sModal.headerDark]}>
          <Text style={[sModal.title, dark && sModal.titleDark]}>Wazīfa Settings</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={sModal.closeBtn}>
            <X color={dark ? '#FFFFFF' : '#1F2937'} size={24} />
          </TouchableOpacity>
        </View>
        <ScrollView style={sModal.scroll} contentContainerStyle={sModal.scrollContent}>
          <View style={sModal.section}>
            <Text style={[sModal.sectionTitle, dark && sModal.sectionTitleDark]}>Final Dhikr Choice</Text>
            <Text style={[sModal.sectionDesc, dark && sModal.sectionDescDark]}>
              Choose between Jawharat al-Kamāl or Ṣalāt al-Fātiḥ for the final dhikr
            </Text>
          </View>
          <TouchableOpacity
            style={[sModal.option, dark && sModal.optionDark, tempUseJawhara && sModal.optionSelected]}
            onPress={() => setTempUseJawhara(true)} activeOpacity={0.7}
          >
            <View style={sModal.optionContent}>
              <Text style={[sModal.optionTitle, dark && sModal.optionTitleDark]}>Jawharat al-Kamāl</Text>
              <Text style={[sModal.optionSub, dark && sModal.optionSubDark]}>Default traditional choice</Text>
            </View>
            <View style={[sModal.radio, tempUseJawhara && sModal.radioSelected]}>
              {tempUseJawhara && <View style={sModal.radioInner} />}
            </View>
          </TouchableOpacity>
          {tempUseJawhara && (
            <View style={[sModal.subOption, dark && sModal.subOptionDark]}>
              <Text style={[sModal.subOptionTitle, dark && sModal.subOptionTitleDark]}>Number of recitations:</Text>
              <View style={sModal.countRow}>
                {[11, 12].map((count) => (
                  <TouchableOpacity
                    key={count}
                    style={[sModal.countBtn, dark && sModal.countBtnDark, tempJawharaCount === count && sModal.countBtnSelected]}
                    onPress={() => setTempJawharaCount(count)} activeOpacity={0.7}
                  >
                    <Text style={[sModal.countBtnText, dark && sModal.countBtnTextDark, tempJawharaCount === count && sModal.countBtnTextSelected]}>
                      {count}x
                    </Text>
                    {count === 12 && <Text style={[sModal.defaultBadge, dark && sModal.defaultBadgeDark]}>Default</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          <TouchableOpacity
            style={[sModal.option, dark && sModal.optionDark, !tempUseJawhara && sModal.optionSelected]}
            onPress={() => setTempUseJawhara(false)} activeOpacity={0.7}
          >
            <View style={sModal.optionContent}>
              <Text style={[sModal.optionTitle, dark && sModal.optionTitleDark]}>Ṣalāt al-Fātiḥ (20x)</Text>
              <Text style={[sModal.optionSub, dark && sModal.optionSubDark]}>Alternative blessed prayer</Text>
            </View>
            <View style={[sModal.radio, !tempUseJawhara && sModal.radioSelected]}>
              {!tempUseJawhara && <View style={sModal.radioInner} />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSave} style={sModal.saveBtn} activeOpacity={0.8}>
            <Text style={sModal.saveBtnText}>Save Settings</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const sModal = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' }, containerDark: { backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }, headerDark: { borderBottomColor: '#334155' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 }, titleDark: { color: '#F8FAFC' },
  scroll: { flex: 1 }, scrollContent: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 6 }, sectionTitleDark: { color: '#F8FAFC' },
  sectionDesc: { fontSize: 14, color: '#64748B', lineHeight: 20 }, sectionDescDark: { color: '#94A3B8' },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 12, borderWidth: 2, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  optionDark: { backgroundColor: '#1E293B', borderColor: '#334155' }, optionSelected: { borderColor: '#7C3AED', backgroundColor: '#F5F3FF' },
  optionContent: { flex: 1, marginRight: 12 },
  optionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 3 }, optionTitleDark: { color: '#F8FAFC' },
  optionSub: { fontSize: 13, color: '#64748B' }, optionSubDark: { color: '#94A3B8' },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: '#7C3AED' }, radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#7C3AED' },
  subOption: { backgroundColor: '#F1F5F9', borderRadius: 14, padding: 16, marginBottom: 16, marginTop: -4 }, subOptionDark: { backgroundColor: '#1E293B' },
  subOptionTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 12 }, subOptionTitleDark: { color: '#F8FAFC' },
  countRow: { flexDirection: 'row', gap: 12 },
  countBtn: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 2, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  countBtnDark: { backgroundColor: '#0F172A', borderColor: '#475569' }, countBtnSelected: { borderColor: '#7C3AED', backgroundColor: '#F5F3FF' },
  countBtnText: { fontSize: 16, fontWeight: '700', color: '#64748B' }, countBtnTextDark: { color: '#94A3B8' }, countBtnTextSelected: { color: '#7C3AED' },
  defaultBadge: { fontSize: 10, fontWeight: '700', color: '#7C3AED', marginTop: 3, textTransform: 'uppercase' }, defaultBadgeDark: { color: '#A78BFA' },
  saveBtn: { backgroundColor: '#7C3AED', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 16, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function WazifaScreen() {
  const {
    state, dispatch, isWazifaComplete, getWazifaProgress,
    getWazifaJawharaTarget, wazifaCompletionsToday, isWazifaFullyDoneToday,
  } = useApp();

  const [showInfoModal,       setShowInfoModal]       = useState(false);
  const [showSettings,        setShowSettings]        = useState(false);
  const [showOpeningBanner,   setShowOpeningBanner]   = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [timerSaved,          setTimerSaved]          = useState(false);
  const [tempUseJawhara,      setTempUseJawhara]      = useState(state.wazifaSettings.useJawhara);
  const [tempJawharaCount,    setTempJawharaCount]    = useState<number>(state.wazifaSettings.jawharaCount || 12);

  const { handleBack } = useContext(LayoutActionsContext);
  const dark          = state.settings.darkMode;
  const jawharaTarget = getWazifaJawharaTarget();

  // ── Timer ──────────────────────────────────────────────────────────────────
  const timer = usePracticeTimer();

  const targets = useMemo(() => [
    WAZIFA_TARGETS.istighfar,
    WAZIFA_TARGETS.salatFatih1,
    WAZIFA_TARGETS.tahlil,
    jawharaTarget,
  ], [jawharaTarget]);

  const completedCount = useMemo(
    () => DHIKR_KEYS.filter((key, i) => state.wazifa[key] >= targets[i]).length,
    [state.wazifa, targets],
  );
  const progress    = useMemo(() => getWazifaProgress(), [state.wazifa]);
  const progressPct = Math.round(progress);

  const completions = useMemo(() => [
    state.wazifa.istighfar   >= WAZIFA_TARGETS.istighfar,
    state.wazifa.salatFatih1 >= WAZIFA_TARGETS.salatFatih1,
    state.wazifa.tahlil      >= WAZIFA_TARGETS.tahlil,
    state.wazifa.jawhara     >= jawharaTarget,
  ], [state.wazifa, jawharaTarget]);

  const { scrollRef, registerCard } = useAutoScroll(completions, AUTOSCROLL_DELAYS);

  // ── Auto-show completion modal ─────────────────────────────────────────────
  const prevIsComplete = useRef(false);
  useEffect(() => {
    if (isWazifaComplete && !prevIsComplete.current) {
      const t = setTimeout(() => setShowCompletionModal(true), 650);
      prevIsComplete.current = true;
      return () => clearTimeout(t);
    }
    // Session reset (new round) — unlock timer so it can be used again
    if (!isWazifaComplete && prevIsComplete.current) {
      timer.reset();
      setTimerSaved(false);
    }
    if (!isWazifaComplete) prevIsComplete.current = false;
  }, [isWazifaComplete]);

  // ── OpeningBanner rows ─────────────────────────────────────────────────────
  const finalLabel = state.wazifaSettings.useJawhara
    ? `Jawharat al-Kamāl — ${jawharaTarget}×`
    : `Ṣalāt al-Fātiḥ — ${jawharaTarget}×`;

  const openingRows: DhikrRow[] = useMemo(() => [
    { arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ', label: `Istighfār — ${WAZIFA_TARGETS.istighfar}×`,   icon: '🌿' },
    { arabic: 'اَللَّهُمَّ صَلِّ عَلى سَيِّدِنَا مُحَمَّدٍ', label: `Ṣalāt al-Fātiḥ — ${WAZIFA_TARGETS.salatFatih1}×`, icon: '✨' },
    { arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',       label: `Tahlīl — ${WAZIFA_TARGETS.tahlil}×`,         icon: '💎' },
    { arabic: 'اَللَّهُـمَّ صَـلِّ وَسَلِّـمْ',   label: finalLabel,                                    icon: '🌟' },
  ], [jawharaTarget, state.wazifaSettings.useJawhara]);

  // ── Step & handlers ────────────────────────────────────────────────────────
  const getStepStatus = useCallback((i: number) => {
    if (state.wazifa[DHIKR_KEYS[i]] >= targets[i]) return 'completed';
    if (i === 0 || state.wazifa[DHIKR_KEYS[i - 1]] >= targets[i - 1]) return 'active';
    return 'disabled';
  }, [state.wazifa, targets]);

  const finalDhikrContent = useMemo(() => {
    if (state.wazifaSettings.useJawhara) {
      const count = state.wazifaSettings.jawharaCount || 12;
      return { ...WAZIFA_DHIKR.jawhara, title: `${WAZIFA_DHIKR.jawhara.title} (${count}x)`, audioType: 'jawhara' };
    }
    return { ...WAZIFA_DHIKR.salatFatih, title: `${WAZIFA_DHIKR.salatFatih.title} (20x)`, audioType: 'salatFatih' };
  }, [state.wazifaSettings.useJawhara, state.wazifaSettings.jawharaCount]);

  const haptic = (type: 'light' | 'medium' | 'success' = 'light') => {
    if (Platform.OS !== 'ios') return;
    if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (type === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleResetAll = useCallback(() => {
    Alert.alert('Reset All', 'Are you sure you want to reset all wazīfa counts?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset', style: 'destructive', onPress: () => {
          dispatch({ type: 'RESET_ALL_WAZIFA' });
          timer.reset();
          setTimerSaved(false);
        },
      },
    ]);
  }, [dispatch, timer]);

  const handleCompleteWazifa = useCallback(() => {
    if (!isWazifaComplete) return;
    haptic('success');
    // Stop timer and save duration alongside the completion
    const duration = timer.stop();
    dispatch({ type: 'COMPLETE_WAZIFA', duration });
    setTimerSaved(true);
    setShowCompletionModal(false);
    Alert.alert('Wazīfa Recorded 🎉', 'May Allah accept your devotion.', [{ text: 'Alhamdulillah' }]);
  }, [isWazifaComplete, dispatch, timer]);

  const handleIncrement = useCallback(
    (k: keyof typeof state.wazifa) => dispatch({ type: 'INCREMENT_WAZIFA', dhikr: k }),
    [dispatch],
  );
  const handleDecrement = useCallback(
    (k: keyof typeof state.wazifa) => dispatch({ type: 'DECREMENT_WAZIFA', dhikr: k }),
    [dispatch],
  );
  const handleReset = useCallback((k: keyof typeof state.wazifa, title: string) => {
    Alert.alert('Reset Dhikr', `Are you sure you want to reset ${title}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'RESET_WAZIFA', dhikr: k }) },
    ]);
  }, [dispatch]);

  const handleSaveSettings = useCallback(() => {
    dispatch({ type: 'UPDATE_WAZIFA_SETTINGS', settings: { useJawhara: tempUseJawhara, jawharaCount: tempJawharaCount as 11 | 12 } });
    setShowSettings(false);
    Alert.alert('Settings Saved', 'Your wazīfa preferences have been updated.', [{ text: 'OK' }]);
  }, [tempUseJawhara, tempJawharaCount, dispatch]);

  const openSettings = useCallback(() => {
    setTempUseJawhara(state.wazifaSettings.useJawhara);
    setTempJawharaCount(state.wazifaSettings.jawharaCount || 12);
    setShowSettings(true);
  }, [state.wazifaSettings]);

  const playAudio = useCallback((type: string) => {
    if (state.settings.audioEnabled) console.log(`Playing audio for ${type}`);
  }, [state.settings.audioEnabled]);

  const menuActions = [
    { key: 'info',     label: 'Wazīfa Information', icon: <Info     color="#7C3AED" size={16} strokeWidth={2} />,   onPress: () => setShowInfoModal(true) },
    { key: 'settings', label: 'Wazīfa Settings',    icon: <Settings color="#7C3AED" size={16} strokeWidth={2} />,   onPress: openSettings, dividerAfter: true },
    { key: 'reset',    label: 'Reset All Dhikr',    icon: <RotateCcw color="#EF4444" size={16} strokeWidth={2.5} />, onPress: handleResetAll, destructive: true },
  ];
  useRegisterHeaderActions('/wazifa', menuActions);

  return (
    <View style={[styles.root, dark && styles.rootDark]}>
      <MinimalHeader
        title="Wazīfa Tijāniyya" subtitle="Daily spiritual practice"
        onBackPress={handleBack} showMore menuActions={menuActions} theme="default"
      />

      <ScreenBackground>
        <StatsBar
          dark={dark}
          stats={[
            { icon: <Target color="#7C3AED" size={13} strokeWidth={2.5} />, value: `${completedCount}/4`, label: 'Completed', color: '#7C3AED' },
            { icon: <Flame  color="#D97706" size={13} strokeWidth={2.5} />, value: `${progressPct}%`,    label: 'Progress',  color: '#D97706' },
          ]}
          timer={{
            formatted:  timer.formatted,
            isRunning:  timer.isRunning,
            isComplete: timerSaved,
            onToggle:   timer.toggle,
            color:      '#7C3AED',
          }}
        />

        {/* <View style={styles.progressWrap}>
          <View style={[styles.progressTrack, dark && styles.progressTrackDark]}>
            <Animated.View style={[styles.progressFill, { width: `${progress}%` }, progress >= 100 && styles.progressComplete]} />
          </View>
          <Text style={[styles.progressLabel, dark && styles.progressLabelDark]}>Overall Wazīfa progress</Text>
        </View> */}

        {isWazifaComplete && !showCompletionModal && (
          <TouchableOpacity style={[styles.pill, dark && styles.pillDark]} onPress={() => setShowCompletionModal(true)} activeOpacity={0.85}>
            <Award color="#F59E0B" size={16} strokeWidth={2} />
            <Text style={styles.pillText}>Wazīfa Complete — tap to record</Text>
            <CheckCircle color="#7C3AED" size={16} strokeWidth={2.5} />
          </TouchableOpacity>
        )}

        <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View onLayout={registerCard(0)}>
            <DhikrCard
              title={`${WAZIFA_DHIKR.istighfar.title} (30x)`} arabic={WAZIFA_DHIKR.istighfar.arabic}
              transliteration={WAZIFA_DHIKR.istighfar.transliteration} translation={WAZIFA_DHIKR.istighfar.translation}
              count={state.wazifa.istighfar} target={WAZIFA_TARGETS.istighfar}
              onIncrement={() => handleIncrement('istighfar')} onDecrement={() => handleDecrement('istighfar')}
              onReset={() => handleReset('istighfar', 'Istighfār (30x)')} onPlayAudio={() => playAudio('istighfar')}
              status={getStepStatus(0)} blessing=""
            />
          </View>
          <View onLayout={registerCard(1)}>
            <DhikrCard
              title={`${WAZIFA_DHIKR.salatFatih.title} (50x)`} arabic={WAZIFA_DHIKR.salatFatih.arabic}
              transliteration={WAZIFA_DHIKR.salatFatih.transliteration} translation={WAZIFA_DHIKR.salatFatih.translation}
              count={state.wazifa.salatFatih1} target={WAZIFA_TARGETS.salatFatih1}
              onIncrement={() => handleIncrement('salatFatih1')} onDecrement={() => handleDecrement('salatFatih1')}
              onReset={() => handleReset('salatFatih1', 'Ṣalāt al-Fātiḥ (50x)')} onPlayAudio={() => playAudio('salatFatih')}
              status={getStepStatus(1)} blessing="سبحان ربك رب العزة عما يصفون . وسلام على المرسلين . والحمد لله رب العالمين"
            />
          </View>
          <View onLayout={registerCard(2)}>
            <DhikrCard
              title={`${WAZIFA_DHIKR.tahlil.title} (100x)`} arabic={WAZIFA_DHIKR.tahlil.arabic}
              transliteration={WAZIFA_DHIKR.tahlil.transliteration} translation={WAZIFA_DHIKR.tahlil.translation}
              count={state.wazifa.tahlil} target={WAZIFA_TARGETS.tahlil}
              onIncrement={() => handleIncrement('tahlil')} onDecrement={() => handleDecrement('tahlil')}
              onReset={() => handleReset('tahlil', 'Tahlīl (100x)')} onPlayAudio={() => playAudio('tahlil')}
              status={getStepStatus(2)} blessing="سيدنا محمد رسول الله عليه السلام"
            />
          </View>
          <View onLayout={registerCard(3)}>
            <DhikrCard
              title={finalDhikrContent.title} arabic={finalDhikrContent.arabic}
              transliteration={finalDhikrContent.transliteration} translation={finalDhikrContent.translation}
              count={state.wazifa.jawhara} target={jawharaTarget}
              onIncrement={() => handleIncrement('jawhara')} onDecrement={() => handleDecrement('jawhara')}
              onReset={() => handleReset('jawhara', finalDhikrContent.title)} onPlayAudio={() => playAudio(finalDhikrContent.audioType)}
              status={getStepStatus(3)} blessing=""
            />
          </View>
          <Instructions dark={dark} />
          <View style={styles.bottomSpace} />
        </ScrollView>
      </ScreenBackground>

      <WazifaSettingsModal
        visible={showSettings} onClose={() => setShowSettings(false)} dark={dark}
        tempUseJawhara={tempUseJawhara} setTempUseJawhara={setTempUseJawhara}
        tempJawharaCount={tempJawharaCount} setTempJawharaCount={setTempJawharaCount}
        onSave={handleSaveSettings}
      />
      <WazifaInfoModal visible={showInfoModal} onClose={() => setShowInfoModal(false)} darkMode={dark} />

      {showOpeningBanner && (
        <OpeningBanner
          theme="wazifa"
          titleArabic="الوَظِيفَةُ التِّيجَانِيَّة"
          titleLatin="Wazīfa Tijāniyya"
          subtitle="Daily Spiritual Practice"
          instruction={`Once daily after Asr, or twice after Fajr and Asr.\nBest practiced in congregation.`}
          beginLabel="Begin Wazīfa"
          dhikrRows={openingRows}
          streak={state.streak ?? 0}
          completionsToday={wazifaCompletionsToday}
          targetPerDay={state.frequencySettings.wazifaPerDay}
          isFullyDoneToday={isWazifaFullyDoneToday}
          onClose={() => setShowOpeningBanner(false)}
        />
      )}

      {showCompletionModal && (
        <CompletionBanner
          theme="wazifa"
          titleArabic="الحمد لله"
          titleLatin="Alḥamdulillāh"
          practiceName="Wazīfa"
          completionsToday={wazifaCompletionsToday}
          targetPerDay={state.frequencySettings.wazifaPerDay}
          streak={state.streak ?? 0}
          // hadith="Whoever is faithful to the Wazifa, Allah sends upon him lights that illuminate his heart and his path."
          confirmLabel="Record Completion"
          onComplete={handleCompleteWazifa}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:               { flex: 1, backgroundColor: '#F8FAFC' },
  rootDark:           { backgroundColor: '#0F172A' },
  progressWrap:       { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  progressTrack:      { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressTrackDark:  { backgroundColor: '#334155' },
  progressFill:       { height: '100%', backgroundColor: '#7C3AED', borderRadius: 4 },
  progressComplete:   { backgroundColor: '#F59E0B' },
  progressLabel:      { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  progressLabelDark:  { color: '#64748B' },
  pill:               { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginBottom: 8, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 14, backgroundColor: '#F5F3FF', borderWidth: 1.5, borderColor: '#DDD6FE' },
  pillDark:           { backgroundColor: '#1E1135', borderColor: '#4C1D95' },
  pillText:           { flex: 1, fontSize: 13, fontWeight: '700', color: '#7C3AED' },
  scroll:             { flex: 1 },
  scrollContent:      { paddingTop: 8 },
  bottomSpace:        { height: 32 },
});