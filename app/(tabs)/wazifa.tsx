import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, RotateCcw, Info, X, Settings, CheckCircle } from 'lucide-react-native';
import GradientHeader from '../../components/GradientHeader';
import DhikrCard from '../../components/DhikrCard';
import { useApp, WAZIFA_TARGETS } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import WazifaInfoModal from '../../components/WazifaInfoModal';

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

export default function WazifaScreen() {
  const { state, dispatch, isWazifaComplete, getWazifaProgress, getWazifaJawharaTarget } = useApp();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempUseJawhara, setTempUseJawhara] = useState(state.wazifaSettings.useJawhara);

  const { darkMode, audioEnabled } = state.settings;
  const jawharaTarget = getWazifaJawharaTarget();

  // Memoized calculations
  const targets = useMemo(() => [
    WAZIFA_TARGETS.istighfar,
    WAZIFA_TARGETS.salatFatih1,
    WAZIFA_TARGETS.tahlil,
    jawharaTarget
  ], [jawharaTarget]);

  const completedCount = useMemo(() => {
    return DHIKR_KEYS.filter((key, index) => state.wazifa[key] >= targets[index]).length;
  }, [state.wazifa, targets]);

  const progress = useMemo(() => getWazifaProgress(), [state.wazifa]);

  // Optimized step status calculation
  const getStepStatus = useCallback((stepIndex: number) => {
    const currentCount = state.wazifa[DHIKR_KEYS[stepIndex]];
    const currentTarget = targets[stepIndex];
    
    if (currentCount >= currentTarget) {
      return 'completed';
    }
    
    if (stepIndex === 0 || state.wazifa[DHIKR_KEYS[stepIndex - 1]] >= targets[stepIndex - 1]) {
      return 'active';
    }
    
    return 'disabled';
  }, [state.wazifa, targets]);

  // Get final dhikr content
  const finalDhikrContent = useMemo(() => {
    if (state.wazifaSettings.useJawhara) {
      return {
        ...WAZIFA_DHIKR.jawhara,
        title: `${WAZIFA_DHIKR.jawhara.title} (12x)`,
        audioType: 'jawhara'
      };
    }
    return {
      ...WAZIFA_DHIKR.salatFatih,
      title: `${WAZIFA_DHIKR.salatFatih.title} (20x)`,
      audioType: 'salatFatih'
    };
  }, [state.wazifaSettings.useJawhara]);

  // Handlers with useCallback
  const handleResetAll = useCallback(() => {
    Alert.alert(
      'Reset All',
      'Are you sure you want to reset all wazīfa counts?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => dispatch({ type: 'RESET_ALL_WAZIFA' })
        },
      ]
    );
  }, [dispatch]);

  const handleCompleteWazifa = useCallback(() => {
    if (isWazifaComplete) {
      dispatch({ type: 'COMPLETE_WAZIFA' });
      Alert.alert(
        'Wazīfa Complete! 🎉',
        'May Allah accept your devotion.',
        [{ text: 'Alhamdulillah' }]
      );
    }
  }, [isWazifaComplete, dispatch]);

  const handleIncrement = useCallback((dhikr: keyof typeof state.wazifa) => {
    dispatch({ type: 'INCREMENT_WAZIFA', dhikr });
  }, [dispatch]);

  const handleDecrement = useCallback((dhikr: keyof typeof state.wazifa) => {
    dispatch({ type: 'DECREMENT_WAZIFA', dhikr });
  }, [dispatch]);

  const handleReset = useCallback((dhikr: keyof typeof state.wazifa, dhikrTitle: string) => {
    Alert.alert(
      'Reset Dhikr',
      `Are you sure you want to reset ${dhikrTitle}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => dispatch({ type: 'RESET_WAZIFA', dhikr })
        },
      ]
    );
  }, [dispatch]);

  const handleSaveSettings = useCallback(() => {
    dispatch({ 
      type: 'UPDATE_WAZIFA_SETTINGS', 
      settings: { useJawhara: tempUseJawhara } 
    });
    setShowSettings(false);
    Alert.alert(
      'Settings Saved',
      'Your wazīfa preferences have been updated.',
      [{ text: 'OK' }]
    );
  }, [tempUseJawhara, dispatch]);

  const playAudio = useCallback((dhikrType: string) => {
    if (audioEnabled) {
      console.log(`Playing audio for ${dhikrType}`);
    }
  }, [audioEnabled]);

  const toggleInfoModal = useCallback(() => setShowInfoModal(prev => !prev), []);
  const toggleSettings = useCallback(() => {
    setTempUseJawhara(state.wazifaSettings.useJawhara);
    setShowSettings(prev => !prev);
  }, [state.wazifaSettings.useJawhara]);

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      <ScreenBackground>
        {/* Progress Header */}
        <View style={[styles.progressContainer, darkMode && styles.progressContainerDark]}>
          <View style={styles.progressInfo}>
            <CheckCircle 
              color={completedCount === 4 ? '#10B981' : '#FFFFFF'} 
              size={20} 
              fill={completedCount === 4 ? '#10B981' : 'transparent'}
            />
            <Text style={[styles.progressText, darkMode && styles.progressTextDark]}>
              {completedCount} of 4 completed
            </Text>
          </View>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              onPress={toggleInfoModal} 
              style={styles.iconButton}
              activeOpacity={0.7}
              accessibilityLabel="Information"
              accessibilityRole="button"
            >
              <Info color={darkMode ? '#D1D5DB' : '#FFFFFF'} size={18} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={toggleSettings} 
              style={styles.iconButton}
              activeOpacity={0.7}
              accessibilityLabel="Settings"
              accessibilityRole="button"
            >
              <Settings color={darkMode ? '#D1D5DB' : '#FFFFFF'} size={18} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleResetAll} 
              style={styles.resetAllButton}
              activeOpacity={0.7}
              accessibilityLabel="Reset All"
              accessibilityRole="button"
            >
              <RotateCcw color={darkMode ? '#D1D5DB' : '#FFFFFF'} size={16} />
              <Text style={[styles.resetAllText, darkMode && styles.resetAllTextDark]}>
                Reset
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Overall Progress Bar */}
        <View style={styles.overallProgressContainer}>
          <View style={[styles.overallProgressBar, darkMode && styles.overallProgressBarDark]}>
            <View style={[styles.overallProgressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={[styles.progressPercentage, darkMode && styles.progressPercentageDark]}>
            {Math.round(progress)}%
          </Text>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Istighfar (30x) */}
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

          {/* Salat al-Fatih (50x) */}
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

          {/* Tahlil (100x) */}
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

          {/* Final Dhikr (Jawhara 12x or Salat al-Fatih 20x) */}
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

          {/* Instructions */}
          <View style={[styles.instructionsContainer, darkMode && styles.instructionsContainerDark]}>
            <Text style={[styles.instructionsTitle, darkMode && styles.instructionsTitleDark]}>
              ⭐ Wazīfa Recitation Guide
            </Text>
            <View style={styles.instructionsList}>
              <Text style={[styles.instruction, darkMode && styles.instructionDark]}>
                • Once daily after Asr prayer, or twice after Fajr and Asr
              </Text>
              <Text style={[styles.instruction, darkMode && styles.instructionDark]}>
                • In congregation when possible
              </Text>
              <Text style={[styles.instruction, darkMode && styles.instructionDark]}>
                • Complete each dhikr sequentially
              </Text>
              <Text style={[styles.instruction, darkMode && styles.instructionDark]}>
                • Customize final dhikr in settings (Jawhara 12x or Ṣalāt al-Fātiḥ 20x)
              </Text>
            </View>
          </View>

          {/* Complete Button */}
          {isWazifaComplete && (
            <TouchableOpacity 
              onPress={handleCompleteWazifa} 
              style={[styles.completeButton, darkMode && styles.completeButtonDark]}
              activeOpacity={0.8}
            >
              <CheckCircle color="#FFFFFF" size={20} />
              <Text style={styles.completeButtonText}>Complete Wazīfa</Text>
            </TouchableOpacity>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Settings Modal */}
        <Modal
          visible={showSettings}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={toggleSettings}
        >
          <SafeAreaView style={[styles.modalContainer, darkMode && styles.modalContainerDark]}>
            <View style={[styles.modalHeader, darkMode && styles.modalHeaderDark]}>
              <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>
                Wazīfa Settings
              </Text>
              <TouchableOpacity 
                onPress={toggleSettings}
                activeOpacity={0.7}
                accessibilityLabel="Close"
              >
                <X color={darkMode ? '#FFFFFF' : '#1F2937'} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.settingsContent}>
              <View style={styles.settingSection}>
                <Text style={[styles.settingSectionTitle, darkMode && styles.settingSectionTitleDark]}>
                  Final Dhikr Choice
                </Text>
                <Text style={[styles.settingSectionDescription, darkMode && styles.settingSectionDescriptionDark]}>
                  Choose between Jawharat al-Kamāl (12x) or Ṣalāt al-Fātiḥ (20x) for the final dhikr
                </Text>
              </View>

              <TouchableOpacity 
                style={[
                  styles.optionItem, 
                  darkMode && styles.optionItemDark,
                  tempUseJawhara && styles.optionItemSelected
                ]}
                onPress={() => setTempUseJawhara(true)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, darkMode && styles.optionTitleDark]}>
                    Jawharat al-Kamāl (12x)
                  </Text>
                  <Text style={[styles.optionSubtitle, darkMode && styles.optionSubtitleDark]}>
                    Default traditional choice
                  </Text>
                </View>
                <View style={[
                  styles.radioButton,
                  tempUseJawhara && styles.radioButtonSelected
                ]}>
                  {tempUseJawhara && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.optionItem, 
                  darkMode && styles.optionItemDark,
                  !tempUseJawhara && styles.optionItemSelected
                ]}
                onPress={() => setTempUseJawhara(false)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, darkMode && styles.optionTitleDark]}>
                    Ṣalāt al-Fātiḥ (20x)
                  </Text>
                  <Text style={[styles.optionSubtitle, darkMode && styles.optionSubtitleDark]}>
                    Alternative blessed prayer
                  </Text>
                </View>
                <View style={[
                  styles.radioButton,
                  !tempUseJawhara && styles.radioButtonSelected
                ]}>
                  {!tempUseJawhara && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleSaveSettings} 
                style={[styles.saveButton, darkMode && styles.saveButtonDark]}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Save Settings</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Info Modal */}
        <WazifaInfoModal 
          visible={showInfoModal} 
          onClose={toggleInfoModal} 
          darkMode={darkMode}
        />
      </ScreenBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#059669',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressContainerDark: {
    backgroundColor: '#1F2937',
    shadowOpacity: 0.3,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressTextDark: {
    color: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  resetAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  resetAllText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  resetAllTextDark: {
    color: '#FFFFFF',
  },
  overallProgressContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 12,
  },
  overallProgressBar: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
  },
  overallProgressBarDark: {
    backgroundColor: '#374151',
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: '#EAB308',
    borderRadius: 5,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
    fontWeight: '600',
  },
  progressPercentageDark: {
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionsContainerDark: {
    backgroundColor: '#1F2937',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  instructionsTitleDark: {
    color: '#FFFFFF',
  },
  instructionsList: {
    gap: 6,
  },
  instruction: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  instructionDark: {
    color: '#D1D5DB',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  completeButtonDark: {
    backgroundColor: '#10B981',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalContainerDark: {
    backgroundColor: '#111827',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeaderDark: {
    borderBottomColor: '#374151',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  settingsContent: {
    flex: 1,
    padding: 16,
  },
  settingSection: {
    marginBottom: 24,
  },
  settingSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  settingSectionTitleDark: {
    color: '#FFFFFF',
  },
  settingSectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  settingSectionDescriptionDark: {
    color: '#D1D5DB',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionItemDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  optionItemSelected: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  optionContent: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionTitleDark: {
    color: '#FFFFFF',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  optionSubtitleDark: {
    color: '#D1D5DB',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#059669',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#059669',
  },
  saveButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDark: {
    backgroundColor: '#10B981',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});