import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Animated, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Star, RotateCcw, Info, X, Settings, CheckCircle, Award, Flame, Target
} from 'lucide-react-native';
import DhikrCard from '../../components/DhikrCard';
import { useApp, WAZIFA_TARGETS } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import WazifaInfoModal from '../../components/WazifaInfoModal';
import StatsBar from '../../components/StatsBar';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';

// ─── Data ─────────────────────────────────────────────────────────────────────
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
    translation: 'O Allah, send blessings upon our master Muhammad, the Opener of what was closed, the Seal of what has passed, the Helper of the Truth with the Truth, the Guide to Your Straight Path, and upon his family according to his great worth and measure',
  },
  tahlil: {
    title: 'Tahlīl',
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
    transliteration: 'Lā ilāha illa Llāh',
    translation: 'There is no god but Allah',
  },
  jawhara: {
    title: 'Jawharat al-Kamāl',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى عَيْنِ الرَّحْمَةِ الرَّبَّانِيَّةِ',
    transliteration: 'Allāhumma ṣalli wa sallim ʿalā ʿayni r-raḥmati r-rabbāniyya',
    translation: 'O Allah, bless and grant peace upon the source of Divine mercy',
  },
} as const;

const DHIKR_KEYS = ['istighfar', 'salatFatih1', 'tahlil', 'jawhara'] as const;

// ─── Completion Banner ────────────────────────────────────────────────────────
function CompletionBanner({ dark, onComplete }: { dark: boolean; onComplete: () => void }) {
  return (
    <TouchableOpacity
      style={[cBanner.wrap, dark && cBanner.wrapDark]}
      onPress={onComplete}
      activeOpacity={0.85}
    >
      <View style={cBanner.left}>
        <View style={cBanner.iconWrap}>
          <Award color="#F59E0B" size={26} strokeWidth={2} />
        </View>
        <View>
          <Text style={cBanner.title}>Wazīfa Complete! 🎉</Text>
          <Text style={cBanner.subtitle}>Tap to record your completion</Text>
        </View>
      </View>
      <CheckCircle color="#059669" size={24} strokeWidth={2.5} />
    </TouchableOpacity>
  );
}

const cBanner = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F0FDF4', borderRadius: 20, padding: 18,
    marginHorizontal: 16, marginTop: 8,
    borderWidth: 2, borderColor: '#A7F3D0',
    shadowColor: '#059669', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 5,
  },
  wrapDark: { backgroundColor: '#052E16', borderColor: '#065F46' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  iconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center',
  },
  title: { fontSize: 17, fontWeight: '800', color: '#065F46', marginBottom: 3 },
  subtitle: { fontSize: 13, color: '#059669', fontWeight: '500' },
});

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
  wrap: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20,
    marginHorizontal: 16, marginTop: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  wrapDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  emoji: { fontSize: 20 },
  title: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  titleDark: { color: '#F8FAFC' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  rowIcon: { fontSize: 16 },
  rowText: { fontSize: 14, color: '#64748B', flex: 1, lineHeight: 20 },
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
  tempJawharaCount, setTempJawharaCount,
  onSave,
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
            <Text style={[sModal.sectionDesc,  dark && sModal.sectionDescDark]}>
              Choose between Jawharat al-Kamāl or Ṣalāt al-Fātiḥ for the final dhikr
            </Text>
          </View>

          <TouchableOpacity
            style={[sModal.option, dark && sModal.optionDark, tempUseJawhara && sModal.optionSelected]}
            onPress={() => setTempUseJawhara(true)} activeOpacity={0.7}
          >
            <View style={sModal.optionContent}>
              <Text style={[sModal.optionTitle, dark && sModal.optionTitleDark]}>Jawharat al-Kamāl</Text>
              <Text style={[sModal.optionSub,   dark && sModal.optionSubDark]}>Default traditional choice</Text>
            </View>
            <View style={[sModal.radio, tempUseJawhara && sModal.radioSelected]}>
              {tempUseJawhara && <View style={sModal.radioInner} />}
            </View>
          </TouchableOpacity>

          {tempUseJawhara && (
            <View style={[sModal.subOption, dark && sModal.subOptionDark]}>
              <Text style={[sModal.subOptionTitle, dark && sModal.subOptionTitleDark]}>
                Number of recitations:
              </Text>
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
                    {count === 12 && (
                      <Text style={[sModal.defaultBadge, dark && sModal.defaultBadgeDark]}>Default</Text>
                    )}
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
              <Text style={[sModal.optionSub,   dark && sModal.optionSubDark]}>Alternative blessed prayer</Text>
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 18,
    borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  headerDark: { borderBottomColor: '#334155' },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  titleDark: { color: '#F8FAFC' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 6 },
  sectionTitleDark: { color: '#F8FAFC' },
  sectionDesc: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  sectionDescDark: { color: '#94A3B8' },
  option: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, paddingHorizontal: 16,
    backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 12,
    borderWidth: 2, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  optionDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  optionSelected: { borderColor: '#059669', backgroundColor: '#F0FDF4' },
  optionContent: { flex: 1, marginRight: 12 },
  optionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 3 },
  optionTitleDark: { color: '#F8FAFC' },
  optionSub: { fontSize: 13, color: '#64748B' },
  optionSubDark: { color: '#94A3B8' },
  radio: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: '#CBD5E1',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: '#059669' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#059669' },
  subOption: {
    backgroundColor: '#F1F5F9', borderRadius: 14, padding: 16,
    marginBottom: 16, marginTop: -4,
  },
  subOptionDark: { backgroundColor: '#1E293B' },
  subOptionTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 12 },
  subOptionTitleDark: { color: '#F8FAFC' },
  countRow: { flexDirection: 'row', gap: 12 },
  countBtn: {
    flex: 1, paddingVertical: 12, paddingHorizontal: 16,
    backgroundColor: '#FFFFFF', borderRadius: 12,
    borderWidth: 2, borderColor: '#E2E8F0',
    alignItems: 'center', justifyContent: 'center',
  },
  countBtnDark: { backgroundColor: '#0F172A', borderColor: '#475569' },
  countBtnSelected: { borderColor: '#059669', backgroundColor: '#F0FDF4' },
  countBtnText: { fontSize: 16, fontWeight: '700', color: '#64748B' },
  countBtnTextDark: { color: '#94A3B8' },
  countBtnTextSelected: { color: '#059669' },
  defaultBadge: { fontSize: 10, fontWeight: '700', color: '#059669', marginTop: 3, textTransform: 'uppercase' },
  defaultBadgeDark: { color: '#10B981' },
  saveBtn: {
    backgroundColor: '#059669', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', marginTop: 16,
    shadowColor: '#059669', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function WazifaScreen() {
  const { state, dispatch, isWazifaComplete, getWazifaProgress, getWazifaJawharaTarget } = useApp();
  const [showInfoModal,     setShowInfoModal]     = useState(false);
  const [showSettings,      setShowSettings]      = useState(false);
  const [tempUseJawhara,    setTempUseJawhara]    = useState(state.wazifaSettings.useJawhara);
  const [tempJawharaCount,  setTempJawharaCount]  = useState<number>(state.wazifaSettings.jawharaCount || 12);

  const { darkMode, audioEnabled } = state.settings;
  const dark = darkMode;
  const jawharaTarget = getWazifaJawharaTarget();

  const targets = useMemo(() => [
    WAZIFA_TARGETS.istighfar,
    WAZIFA_TARGETS.salatFatih1,
    WAZIFA_TARGETS.tahlil,
    jawharaTarget,
  ], [jawharaTarget]);

  const completedCount = useMemo(
    () => DHIKR_KEYS.filter((key, index) => state.wazifa[key] >= targets[index]).length,
    [state.wazifa, targets],
  );

  const progress    = useMemo(() => getWazifaProgress(), [state.wazifa]);
  const progressPct = Math.round(progress);

  const getStepStatus = useCallback((stepIndex: number) => {
    if (state.wazifa[DHIKR_KEYS[stepIndex]] >= targets[stepIndex]) return 'completed';
    if (stepIndex === 0 || state.wazifa[DHIKR_KEYS[stepIndex - 1]] >= targets[stepIndex - 1]) return 'active';
    return 'disabled';
  }, [state.wazifa, targets]);

  const finalDhikrContent = useMemo(() => {
    if (state.wazifaSettings.useJawhara) {
      const count = state.wazifaSettings.jawharaCount || 12;
      return { ...WAZIFA_DHIKR.jawhara, title: `${WAZIFA_DHIKR.jawhara.title} (${count}x)`, audioType: 'jawhara' };
    }
    return { ...WAZIFA_DHIKR.salatFatih, title: `${WAZIFA_DHIKR.salatFatih.title} (20x)`, audioType: 'salatFatih' };
  }, [state.wazifaSettings.useJawhara, state.wazifaSettings.jawharaCount]);

  const handleResetAll = useCallback(() => {
    Alert.alert('Reset All', 'Are you sure you want to reset all wazīfa counts?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'RESET_ALL_WAZIFA' }) },
    ]);
  }, [dispatch]);

  const handleCompleteWazifa = useCallback(() => {
    if (!isWazifaComplete) return;
    dispatch({ type: 'COMPLETE_WAZIFA' });
    Alert.alert('Wazīfa Complete! 🎉', 'May Allah accept your devotion.', [{ text: 'Alhamdulillah' }]);
  }, [isWazifaComplete, dispatch]);

  const handleIncrement = useCallback(
    (dhikr: keyof typeof state.wazifa) => dispatch({ type: 'INCREMENT_WAZIFA', dhikr }),
    [dispatch],
  );
  const handleDecrement = useCallback(
    (dhikr: keyof typeof state.wazifa) => dispatch({ type: 'DECREMENT_WAZIFA', dhikr }),
    [dispatch],
  );
  const handleReset = useCallback((dhikr: keyof typeof state.wazifa, dhikrTitle: string) => {
    Alert.alert('Reset Dhikr', `Are you sure you want to reset ${dhikrTitle}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => dispatch({ type: 'RESET_WAZIFA', dhikr }) },
    ]);
  }, [dispatch]);

  const handleSaveSettings = useCallback(() => {
    dispatch({ type: 'UPDATE_WAZIFA_SETTINGS', settings: { useJawhara: tempUseJawhara, jawharaCount: tempJawharaCount as 11 | 12 } });
    setShowSettings(false);
    Alert.alert('Settings Saved', 'Your wazīfa preferences have been updated.', [{ text: 'OK' }]);
  }, [tempUseJawhara, tempJawharaCount, dispatch]);

  const playAudio = useCallback((dhikrType: string) => {
    if (audioEnabled) console.log(`Playing audio for ${dhikrType}`);
  }, [audioEnabled]);

  const openSettings = useCallback(() => {
    setTempUseJawhara(state.wazifaSettings.useJawhara);
    setTempJawharaCount(state.wazifaSettings.jawharaCount || 12);
    setShowSettings(true);
  }, [state.wazifaSettings.useJawhara, state.wazifaSettings.jawharaCount]);

  useRegisterHeaderActions('/wazifa', [
    {
      key: 'info',
      label: 'Wazīfa Information',
      icon: <Info color="#059669" size={16} strokeWidth={2} />,
      onPress: () => setShowInfoModal(true),
    },
    {
      key: 'settings',
      label: 'Wazīfa Settings',
      icon: <Settings color="#059669" size={16} strokeWidth={2} />,
      onPress: openSettings,
      dividerAfter: true,
    },
    {
      key: 'reset',
      label: 'Reset All Dhikr',
      icon: <RotateCcw color="#EF4444" size={16} strokeWidth={2.5} />,
      onPress: handleResetAll,
      destructive: true,
    },
  ]);

  return (
    <View style={[styles.root, dark && styles.rootDark]}>
      <ScreenBackground>

        {/* ── Stats Bar ── */}
        <StatsBar
          dark={dark}
          stats={[
            {
              icon: <Target color="#059669" size={13} strokeWidth={2.5} />,
              value: `${completedCount}/4`,
              label: 'Completed',
              color: '#059669',
            },
            {
              icon: <Flame color="#D97706" size={13} strokeWidth={2.5} />,
              value: `${progressPct}%`,
              label: 'Progress',
              color: '#D97706',
            },
            {
              icon: <Star color="#7C3AED" size={13} strokeWidth={2.5} />,
              value: String(state.streak ?? 0),
              label: 'Day streak',
              color: '#7C3AED',
            },
          ]}
        />

        {/* ── Overall progress bar ── */}
        <View style={styles.progressWrap}>
          <View style={[styles.progressTrack, dark && styles.progressTrackDark]}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
                progress >= 100 && styles.progressComplete,
              ]}
            />
          </View>
          <View style={styles.progressMeta}>
            <Text style={[styles.progressLabel, dark && styles.progressLabelDark]}>
              Overall Wazīfa progress
            </Text>
          </View>
        </View>

        {/* ── Cards ── */}
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <DhikrCard
            title={`${WAZIFA_DHIKR.istighfar.title} (30x)`}
            arabic={WAZIFA_DHIKR.istighfar.arabic}
            transliteration={WAZIFA_DHIKR.istighfar.transliteration}
            translation={WAZIFA_DHIKR.istighfar.translation}
            count={state.wazifa.istighfar}
            target={WAZIFA_TARGETS.istighfar}
            onIncrement={() => handleIncrement('istighfar')}
            onDecrement={() => handleDecrement('istighfar')}
            onReset={() => handleReset('istighfar', 'Istighfār (30x)')}
            onPlayAudio={() => playAudio('istighfar')}
            status={getStepStatus(0)}
            blessing=""
          />
          <DhikrCard
            title={`${WAZIFA_DHIKR.salatFatih.title} (50x)`}
            arabic={WAZIFA_DHIKR.salatFatih.arabic}
            transliteration={WAZIFA_DHIKR.salatFatih.transliteration}
            translation={WAZIFA_DHIKR.salatFatih.translation}
            count={state.wazifa.salatFatih1}
            target={WAZIFA_TARGETS.salatFatih1}
            onIncrement={() => handleIncrement('salatFatih1')}
            onDecrement={() => handleDecrement('salatFatih1')}
            onReset={() => handleReset('salatFatih1', 'Ṣalāt al-Fātiḥ (50x)')}
            onPlayAudio={() => playAudio('salatFatih')}
            status={getStepStatus(1)}
            blessing="سبحان ربك رب العزة عما يصفون . وسلام على المرسلين . والحمد لله رب العالمين"
          />
          <DhikrCard
            title={`${WAZIFA_DHIKR.tahlil.title} (100x)`}
            arabic={WAZIFA_DHIKR.tahlil.arabic}
            transliteration={WAZIFA_DHIKR.tahlil.transliteration}
            translation={WAZIFA_DHIKR.tahlil.translation}
            count={state.wazifa.tahlil}
            target={WAZIFA_TARGETS.tahlil}
            onIncrement={() => handleIncrement('tahlil')}
            onDecrement={() => handleDecrement('tahlil')}
            onReset={() => handleReset('tahlil', 'Tahlīl (100x)')}
            onPlayAudio={() => playAudio('tahlil')}
            status={getStepStatus(2)}
            blessing="سيدنا محمد رسول الله عليه السلام"
          />
          <DhikrCard
            title={finalDhikrContent.title}
            arabic={finalDhikrContent.arabic}
            transliteration={finalDhikrContent.transliteration}
            translation={finalDhikrContent.translation}
            count={state.wazifa.jawhara}
            target={jawharaTarget}
            onIncrement={() => handleIncrement('jawhara')}
            onDecrement={() => handleDecrement('jawhara')}
            onReset={() => handleReset('jawhara', finalDhikrContent.title)}
            onPlayAudio={() => playAudio(finalDhikrContent.audioType)}
            status={getStepStatus(3)}
            blessing="بارك الله فيك"
          />

          <Instructions dark={dark} />

          {isWazifaComplete && (
            <CompletionBanner dark={dark} onComplete={handleCompleteWazifa} />
          )}

          <View style={styles.bottomSpace} />
        </ScrollView>

      </ScreenBackground>

      <WazifaSettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        dark={dark}
        tempUseJawhara={tempUseJawhara}
        setTempUseJawhara={setTempUseJawhara}
        tempJawharaCount={tempJawharaCount}
        setTempJawharaCount={setTempJawharaCount}
        onSave={handleSaveSettings}
      />
      <WazifaInfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        darkMode={dark}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  rootDark: { backgroundColor: '#0F172A' },

  progressWrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  progressTrack: {
    height: 8, backgroundColor: '#E2E8F0',
    borderRadius: 4, overflow: 'hidden', marginBottom: 10,
  },
  progressTrackDark: { backgroundColor: '#334155' },
  progressFill: { height: '100%', backgroundColor: '#D97706', borderRadius: 4 },
  progressComplete: { backgroundColor: '#F59E0B' },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  progressLabelDark: { color: '#64748B' },

  scroll: { flex: 1 },
  scrollContent: { paddingTop: 8 },
  bottomSpace: { height: 32 },
});