import React, { useState, useCallback, useMemo, useContext, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Animated, Modal, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  RotateCcw, Info, X, Settings, CheckCircle, Award, Flame, Target, Palette,
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
import OpeningBanner, { DhikrRow } from '../../components/OpeningBanner';
import CompletionBanner            from '../../components/CompletionBanner';
import CardStylePicker             from '../../components/CardStylePicker';

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
    translation: 'O Allah, send blessings upon our master Muhammad, the Opener of what was closed, the Seal of what preceded, the Helper of Truth through Truth, and the Guide to Your Straight Path. And upon his family, according to his value and his great magnitude.',
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
    transliteration: 'Allāhumma ṣalli wa sallim ʿalā ʿayni r-raḥmati r-rabbāniyyati…',
    translation: 'O Allah, bestow blessings and peace upon the Essence of Divine Mercy, the Realized Ruby encompassing the center of understanding and meanings; the Light of all created universes, the Adamic one, possessor of the Lordly Truth; the Brightest Lightning of the clouds of profits filling every receptive vessel from the seas and containers…',
  },
} as const;

const DHIKR_KEYS      = ['istighfar', 'salatFatih1', 'tahlil', 'jawhara'] as const;
const AUTOSCROLL_DELAYS: number[] = [700, 4000, 3000, 700];

// ─── Card Style Modal ─────────────────────────────────────────────────────────

interface CardStyleModalProps {
  visible: boolean;
  onClose: () => void;
  dark: boolean;
}

function CardStyleModal({ visible, onClose, dark }: CardStyleModalProps) {
  const bg      = dark ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.45)';
  const sheetBg = dark ? '#0D0D14' : '#F8F7FF';
  const divider = dark ? '#22203A' : '#EDE9FE';
  const textCol = dark ? '#EDE9FE' : '#1A1040';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={[csm.overlay, { backgroundColor: bg }]}
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[csm.sheet, { backgroundColor: sheetBg }]}
          onPress={e => e.stopPropagation()}
        >
          <View style={[csm.handle, { backgroundColor: divider }]} />
          <Text style={[csm.sheetTitle, { color: textCol }]}>Card Style</Text>
          <Text style={[csm.sheetSub, { color: dark ? '#6B5FA8' : '#9B7DD4' }]}>
            Choose how your Dhikr cards look
          </Text>
          <CardStylePicker onSelect={onClose} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const csm = StyleSheet.create({
  overlay:    { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingTop: 12, paddingBottom: 40, paddingHorizontal: 20,
  },
  handle:     { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  sheetTitle: { fontSize: 18, fontWeight: '800', letterSpacing: 0.2, marginBottom: 4 },
  sheetSub:   { fontSize: 13, fontWeight: '500', marginBottom: 18 },
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
  const P = dark ? sM.darkP : sM.lightP;
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[sM.root, { backgroundColor: dark ? '#0D0D14' : '#F8F7FF' }]}>

        {/* Header */}
        <View style={[sM.header, { borderBottomColor: dark ? '#22203A' : '#EDE9FE' }]}>
          <View>
            <Text style={[sM.headerTitle, { color: dark ? '#EDE9FE' : '#1A1040' }]}>Wazīfa Settings</Text>
            <Text style={[sM.headerSub, { color: dark ? '#6B5FA8' : '#9B7DD4' }]}>Final dhikr preference</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={[sM.closeBtn, { backgroundColor: dark ? '#1E1A34' : '#EDE9FE', borderColor: dark ? '#2D2852' : '#DDD6FE' }]}
            activeOpacity={0.7}
          >
            <X color={dark ? '#9B7DD4' : '#7C3AED'} size={18} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={sM.scroll}>

          <Text style={[sM.sectionLabel, { color: dark ? '#6B5FA8' : '#9B7DD4' }]}>CHOOSE FINAL DHIKR</Text>

          {/* Jawhara option */}
          <TouchableOpacity
            onPress={() => setTempUseJawhara(true)}
            style={[
              sM.option,
              { backgroundColor: dark ? '#13102A' : '#FFFFFF', borderColor: tempUseJawhara ? '#7C3AED' : (dark ? '#22203A' : '#EDE9FE') },
              tempUseJawhara && { backgroundColor: dark ? '#1A1540' : '#F5F3FF' },
            ]}
            activeOpacity={0.8}
          >
            <View style={[sM.radioRing, { borderColor: tempUseJawhara ? '#7C3AED' : (dark ? '#3D3870' : '#C4B5FD') }]}>
              {tempUseJawhara && <View style={sM.radioDot} />}
            </View>
            <View style={sM.optionText}>
              <Text style={[sM.optionTitle, { color: dark ? '#EDE9FE' : '#1A1040' }]}>Jawharat al-Kamāl</Text>
              <Text style={[sM.optionSub, { color: dark ? '#6B5FA8' : '#9B7DD4' }]}>Default traditional choice</Text>
            </View>
          </TouchableOpacity>

          {/* Count sub-option */}
          {tempUseJawhara && (
            <View style={[sM.countWrap, { backgroundColor: dark ? '#0E0B1E' : '#F5F3FF', borderColor: dark ? '#22203A' : '#DDD6FE' }]}>
              <Text style={[sM.countLabel, { color: dark ? '#9B7DD4' : '#6D28D9' }]}>Repetitions</Text>
              <View style={sM.countRow}>
                {([11, 12] as const).map(n => (
                  <TouchableOpacity
                    key={n}
                    onPress={() => setTempJawharaCount(n)}
                    style={[
                      sM.countBtn,
                      {
                        borderColor: tempJawharaCount === n ? '#7C3AED' : (dark ? '#2D2852' : '#DDD6FE'),
                        backgroundColor: tempJawharaCount === n ? '#7C3AED' : (dark ? '#13102A' : '#FFFFFF'),
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={[sM.countBtnN, { color: tempJawharaCount === n ? '#FFFFFF' : (dark ? '#9B7DD4' : '#7C3AED') }]}>
                      {n}×
                    </Text>
                    {n === 12 && (
                      <Text style={[sM.countDefault, { color: tempJawharaCount === n ? 'rgba(255,255,255,0.65)' : (dark ? '#4A3F80' : '#C4B5FD') }]}>
                        default
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Salat Fatih option */}
          <TouchableOpacity
            onPress={() => setTempUseJawhara(false)}
            style={[
              sM.option,
              { backgroundColor: dark ? '#13102A' : '#FFFFFF', borderColor: !tempUseJawhara ? '#7C3AED' : (dark ? '#22203A' : '#EDE9FE') },
              !tempUseJawhara && { backgroundColor: dark ? '#1A1540' : '#F5F3FF' },
            ]}
            activeOpacity={0.8}
          >
            <View style={[sM.radioRing, { borderColor: !tempUseJawhara ? '#7C3AED' : (dark ? '#3D3870' : '#C4B5FD') }]}>
              {!tempUseJawhara && <View style={sM.radioDot} />}
            </View>
            <View style={sM.optionText}>
              <Text style={[sM.optionTitle, { color: dark ? '#EDE9FE' : '#1A1040' }]}>Ṣalāt al-Fātiḥ (20×)</Text>
              <Text style={[sM.optionSub, { color: dark ? '#6B5FA8' : '#9B7DD4' }]}>Alternative blessed prayer</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSave}
            style={sM.saveBtn}
            activeOpacity={0.85}
          >
            <Text style={sM.saveBtnText}>Save Settings</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const sM = StyleSheet.create({
  root:        { flex: 1 },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 18, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
  headerSub:   { fontSize: 12, fontWeight: '600', marginTop: 2 },
  closeBtn:    { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  scroll:      { padding: 22, paddingBottom: 50 },
  sectionLabel:{ fontSize: 10, fontWeight: '800', letterSpacing: 2.5, marginBottom: 14 },
  option:      { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 18, borderWidth: 1.5, marginBottom: 10 },
  radioRing:   { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot:    { width: 11, height: 11, borderRadius: 5.5, backgroundColor: '#7C3AED' },
  optionText:  { flex: 1, gap: 3 },
  optionTitle: { fontSize: 15, fontWeight: '700' },
  optionSub:   { fontSize: 12, fontWeight: '500' },
  countWrap:   { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 10, marginTop: -4 },
  countLabel:  { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  countRow:    { flexDirection: 'row', gap: 10 },
  countBtn:    { flex: 1, paddingVertical: 13, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', gap: 2 },
  countBtnN:   { fontSize: 18, fontWeight: '700' },
  countDefault:{ fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  saveBtn:     { marginTop: 20, backgroundColor: '#7C3AED', borderRadius: 18, paddingVertical: 16, alignItems: 'center', shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.38, shadowRadius: 12, elevation: 6 },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  // Unused — kept to avoid TS errors from reference
  lightP:      {},
  darkP:       {},
});

// ─── Instructions ─────────────────────────────────────────────────────────────

function Instructions({ dark }: { dark: boolean }) {
  const items = [
    { icon: '🕌', text: 'Once daily after Asr, or twice after Fajr and Asr' },
    { icon: '👥', text: 'Best practiced in congregation' },
    { icon: '🔢', text: 'Complete each dhikr sequentially' },
    { icon: '⚙️', text: 'Customize final dhikr in settings (Jawhara 11×/12× or Ṣalāt al-Fātiḥ 20×)' },
  ];
  return (
    <View style={[ins.wrap, dark && ins.wrapDark]}>
      <View style={ins.header}>
        <Text style={ins.emoji}>⭐</Text>
        <Text style={[ins.title, dark && ins.titleDark]}>Wazīfa Recitation Guide</Text>
      </View>
      {items.map((item, i) => (
        <View key={i} style={ins.row}>
          <Text style={ins.icon}>{item.icon}</Text>
          <Text style={[ins.text, dark && ins.textDark]}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}

const ins = StyleSheet.create({
  wrap:     { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginHorizontal: 16, marginTop: 8, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  wrapDark: { backgroundColor: '#1E1B30', borderColor: '#2D2852' },
  header:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  emoji:    { fontSize: 20 },
  title:    { fontSize: 15, fontWeight: '700', color: '#1A1040' },
  titleDark:{ color: '#EDE9FE' },
  row:      { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  icon:     { fontSize: 15, lineHeight: 22 },
  text:     { fontSize: 13, color: '#6D5EA0', flex: 1, lineHeight: 20 },
  textDark: { color: '#9B7DD4' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function WazifaScreen() {
  const {
    state, dispatch, isWazifaComplete, getWazifaProgress,
    getWazifaJawharaTarget, wazifaCompletionsToday, isWazifaFullyDoneToday,
  } = useApp();

  const [showInfoModal,       setShowInfoModal]       = useState(false);
  const [showSettings,        setShowSettings]        = useState(false);
  const [showCardStyleModal,  setShowCardStyleModal]  = useState(false);  // ← NEW
  const [showOpeningBanner,   setShowOpeningBanner]   = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [timerSaved,          setTimerSaved]          = useState(false);
  const [tempUseJawhara,      setTempUseJawhara]      = useState(state.wazifaSettings.useJawhara);
  const [tempJawharaCount,    setTempJawharaCount]    = useState<number>(state.wazifaSettings.jawharaCount || 12);

  const { handleBack } = useContext(LayoutActionsContext);
  const dark          = state.settings.darkMode;
  const jawharaTarget = getWazifaJawharaTarget();
  const timer         = usePracticeTimer();

  const targets = useMemo(() => [
    WAZIFA_TARGETS.istighfar,
    WAZIFA_TARGETS.salatFatih1,
    WAZIFA_TARGETS.tahlil,
    jawharaTarget,
  ], [jawharaTarget]);

  const completedCount = useMemo(
    () => DHIKR_KEYS.filter((k, i) => state.wazifa[k] >= targets[i]).length,
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

  const prevIsComplete = useRef(false);
  useEffect(() => {
    if (isWazifaComplete && !prevIsComplete.current) {
      const t = setTimeout(() => setShowCompletionModal(true), 650);
      prevIsComplete.current = true;
      return () => clearTimeout(t);
    }
    if (!isWazifaComplete && prevIsComplete.current) { timer.reset(); setTimerSaved(false); }
    if (!isWazifaComplete) prevIsComplete.current = false;
  }, [isWazifaComplete]);

  const finalLabel = state.wazifaSettings.useJawhara
    ? `Jawharat al-Kamāl — ${jawharaTarget}×`
    : `Ṣalāt al-Fātiḥ — ${jawharaTarget}×`;

  const openingRows: DhikrRow[] = useMemo(() => [
    { arabic: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ',      label: `Istighfār — ${WAZIFA_TARGETS.istighfar}×`,    icon: '🌿' },
    { arabic: 'اَللَّهُمَّ صَلِّ عَلى سَيِّدِنَا مُحَمَّدٍ', label: `Ṣalāt al-Fātiḥ — ${WAZIFA_TARGETS.salatFatih1}×`, icon: '✨' },
    { arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',            label: `Tahlīl — ${WAZIFA_TARGETS.tahlil}×`,          icon: '💎' },
    { arabic: 'اَللَّهُـمَّ صَـلِّ وَسَلِّـمْ',       label: finalLabel,                                     icon: '🌟' },
  ], [jawharaTarget, state.wazifaSettings.useJawhara]);

  // ── Step helpers ──────────────────────────────────────────────────────────
  const getStepStatus = useCallback((i: number) => {
    if (state.wazifa[DHIKR_KEYS[i]] >= targets[i])                                       return 'completed';
    if (i === 0 || state.wazifa[DHIKR_KEYS[i - 1]] >= targets[i - 1])                    return 'active';
    return 'disabled';
  }, [state.wazifa, targets]);

  const prevTitle = useCallback((i: number): string | undefined => {
    if (i === 0) return undefined;
    if (i === 1) return `${WAZIFA_DHIKR.istighfar.title} (${WAZIFA_TARGETS.istighfar}×)`;
    if (i === 2) return `${WAZIFA_DHIKR.salatFatih.title} (${WAZIFA_TARGETS.salatFatih1}×)`;
    if (i === 3) return `${WAZIFA_DHIKR.tahlil.title} (${WAZIFA_TARGETS.tahlil}×)`;
    return undefined;
  }, []);

  const finalDhikrContent = useMemo(() => {
    if (state.wazifaSettings.useJawhara) {
      const n = state.wazifaSettings.jawharaCount || 12;
      return { ...WAZIFA_DHIKR.jawhara, title: `${WAZIFA_DHIKR.jawhara.title} (${n}×)`, audioType: 'jawhara' };
    }
    return { ...WAZIFA_DHIKR.salatFatih, title: `${WAZIFA_DHIKR.salatFatih.title} (20×)`, audioType: 'salatFatih' };
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
      { text: 'Reset', style: 'destructive', onPress: () => { dispatch({ type: 'RESET_ALL_WAZIFA' }); timer.reset(); setTimerSaved(false); } },
    ]);
  }, [dispatch, timer]);

  const handleCompleteWazifa = useCallback(() => {
    if (!isWazifaComplete) return;
    haptic('success');
    const duration = timer.stop();
    dispatch({ type: 'COMPLETE_WAZIFA', duration });
    setTimerSaved(true);
    setShowCompletionModal(false);
    Alert.alert('Wazīfa Recorded 🎉', 'May Allah accept your devotion.', [{ text: 'Alhamdulillah' }]);
  }, [isWazifaComplete, dispatch, timer]);

  const handleIncrement = useCallback((k: keyof typeof state.wazifa) => dispatch({ type: 'INCREMENT_WAZIFA', dhikr: k }), [dispatch]);
  const handleDecrement = useCallback((k: keyof typeof state.wazifa) => dispatch({ type: 'DECREMENT_WAZIFA', dhikr: k }), [dispatch]);
  const handleReset     = useCallback((k: keyof typeof state.wazifa, title: string) => {
    Alert.alert('Reset Dhikr', `Reset ${title}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'RESET_WAZIFA', dhikr: k }) },
    ]);
  }, [dispatch]);

  const handleSaveSettings = useCallback(() => {
    dispatch({ type: 'UPDATE_WAZIFA_SETTINGS', settings: { useJawhara: tempUseJawhara, jawharaCount: tempJawharaCount as 11 | 12 } });
    setShowSettings(false);
  }, [tempUseJawhara, tempJawharaCount, dispatch]);

  const openSettings = useCallback(() => {
    setTempUseJawhara(state.wazifaSettings.useJawhara);
    setTempJawharaCount(state.wazifaSettings.jawharaCount || 12);
    setShowSettings(true);
  }, [state.wazifaSettings]);

  const playAudio = useCallback((type: string) => {
    if (state.settings.audioEnabled) console.log(`Playing audio for ${type}`);
  }, [state.settings.audioEnabled]);

  // ── Menu actions — added Card Style entry identical to WirdScreen ──────────
  const menuActions = [
    { key: 'info',      label: 'Wazīfa Information', icon: <Info      color="#7C3AED" size={16} strokeWidth={2} />,   onPress: () => setShowInfoModal(true) },
    { key: 'settings',  label: 'Wazīfa Settings',    icon: <Settings  color="#7C3AED" size={16} strokeWidth={2} />,   onPress: openSettings },
    { key: 'cardStyle', label: 'Card Style',          icon: <Palette   color="#7C3AED" size={16} strokeWidth={2} />,   onPress: () => setShowCardStyleModal(true), dividerAfter: true },
    { key: 'reset',     label: 'Reset All Dhikr',    icon: <RotateCcw color="#EF4444" size={16} strokeWidth={2.5} />, onPress: handleResetAll, destructive: true },
  ];
  useRegisterHeaderActions('/wazifa', menuActions);

  return (
    <View style={[sc.root, dark && sc.rootDark]}>
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
            formatted: timer.formatted, isRunning: timer.isRunning,
            isComplete: timerSaved, onToggle: timer.toggle, color: '#7C3AED',
          }}
        />

        {isWazifaComplete && !showCompletionModal && (
          <TouchableOpacity
            style={[sc.pill, dark && sc.pillDark]}
            onPress={() => setShowCompletionModal(true)}
            activeOpacity={0.85}
          >
            <Award color="#F59E0B" size={16} strokeWidth={2} />
            <Text style={sc.pillText}>Wazīfa Complete — tap to record</Text>
            <CheckCircle color="#7C3AED" size={16} strokeWidth={2.5} />
          </TouchableOpacity>
        )}

        <ScrollView
          ref={scrollRef}
          style={sc.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={sc.scrollContent}
        >

          {/* ── Step 1: Istighfār (30×) ── */}
          <View onLayout={registerCard(0)}>
            <DhikrCard
              title={`${WAZIFA_DHIKR.istighfar.title} (30×)`}
              arabic={WAZIFA_DHIKR.istighfar.arabic}
              transliteration={WAZIFA_DHIKR.istighfar.transliteration}
              translation={WAZIFA_DHIKR.istighfar.translation}
              count={state.wazifa.istighfar}
              target={WAZIFA_TARGETS.istighfar}
              stepNumber={1} totalSteps={4}
              prevStepTitle={prevTitle(0)}
              onIncrement={() => handleIncrement('istighfar')}
              onDecrement={() => handleDecrement('istighfar')}
              onReset={() => handleReset('istighfar', `Istighfār (30×)`)}
              onPlayAudio={() => playAudio('istighfar')}
              status={getStepStatus(0)}
              blessing=""
            />
          </View>

          {/* ── Step 2: Ṣalāt al-Fātiḥ (50×) ── */}
          <View onLayout={registerCard(1)}>
            <DhikrCard
              title={`${WAZIFA_DHIKR.salatFatih.title} (50×)`}
              arabic={WAZIFA_DHIKR.salatFatih.arabic}
              transliteration={WAZIFA_DHIKR.salatFatih.transliteration}
              translation={WAZIFA_DHIKR.salatFatih.translation}
              count={state.wazifa.salatFatih1}
              target={WAZIFA_TARGETS.salatFatih1}
              stepNumber={2} totalSteps={4}
              prevStepTitle={prevTitle(1)}
              onIncrement={() => handleIncrement('salatFatih1')}
              onDecrement={() => handleDecrement('salatFatih1')}
              onReset={() => handleReset('salatFatih1', `Ṣalāt al-Fātiḥ (50×)`)}
              onPlayAudio={() => playAudio('salatFatih')}
              status={getStepStatus(1)}
              blessing="سبحان ربك رب العزة عما يصفون . وسلام على المرسلين . والحمد لله رب العالمين"
            />
          </View>

          {/* ── Step 3: Tahlīl (100×) ── */}
          <View onLayout={registerCard(2)}>
            <DhikrCard
              title={`${WAZIFA_DHIKR.tahlil.title} (100×)`}
              arabic={WAZIFA_DHIKR.tahlil.arabic}
              transliteration={WAZIFA_DHIKR.tahlil.transliteration}
              translation={WAZIFA_DHIKR.tahlil.translation}
              count={state.wazifa.tahlil}
              target={WAZIFA_TARGETS.tahlil}
              stepNumber={3} totalSteps={4}
              prevStepTitle={prevTitle(2)}
              onIncrement={() => handleIncrement('tahlil')}
              onDecrement={() => handleDecrement('tahlil')}
              onReset={() => handleReset('tahlil', `Tahlīl (100×)`)}
              onPlayAudio={() => playAudio('tahlil')}
              status={getStepStatus(2)}
              blessing="سيدنا محمد رسول الله عليه السلام"
            />
          </View>

          {/* ── Step 4: Jawhara / Ṣalāt al-Fātiḥ (configurable) ── */}
          <View onLayout={registerCard(3)}>
            <DhikrCard
              title={finalDhikrContent.title}
              arabic={finalDhikrContent.arabic}
              transliteration={finalDhikrContent.transliteration}
              translation={finalDhikrContent.translation}
              count={state.wazifa.jawhara}
              target={jawharaTarget}
              stepNumber={4} totalSteps={4}
              prevStepTitle={prevTitle(3)}
              onIncrement={() => handleIncrement('jawhara')}
              onDecrement={() => handleDecrement('jawhara')}
              onReset={() => handleReset('jawhara', finalDhikrContent.title)}
              onPlayAudio={() => playAudio(finalDhikrContent.audioType)}
              status={getStepStatus(3)}
              blessing=""
            />
          </View>

          <Instructions dark={dark} />
          <View style={sc.bottomSpace} />
        </ScrollView>
      </ScreenBackground>

      {/* ── Modals ── */}
      <WazifaSettingsModal
        visible={showSettings} onClose={() => setShowSettings(false)} dark={dark}
        tempUseJawhara={tempUseJawhara} setTempUseJawhara={setTempUseJawhara}
        tempJawharaCount={tempJawharaCount} setTempJawharaCount={setTempJawharaCount}
        onSave={handleSaveSettings}
      />
      <WazifaInfoModal visible={showInfoModal} onClose={() => setShowInfoModal(false)} darkMode={dark} />

      {/* ── Card Style modal (NEW) ── */}
      <CardStyleModal
        visible={showCardStyleModal}
        onClose={() => setShowCardStyleModal(false)}
        dark={dark}
      />

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
          confirmLabel="Record Completion"
          onComplete={handleCompleteWazifa}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </View>
  );
}

const sc = StyleSheet.create({
  root:        { flex: 1, backgroundColor: '#F8F7FF' },
  rootDark:    { backgroundColor: '#0D0D14' },
  pill:        { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginBottom: 6, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 14, backgroundColor: '#F5F3FF', borderWidth: 1.5, borderColor: '#DDD6FE' },
  pillDark:    { backgroundColor: '#1E1135', borderColor: '#4C1D95' },
  pillText:    { flex: 1, fontSize: 13, fontWeight: '700', color: '#7C3AED' },
  scroll:      { flex: 1 },
  scrollContent: { paddingTop: 6 },
  bottomSpace: { height: 32 },
});