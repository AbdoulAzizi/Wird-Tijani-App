import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, RotateCcw, Info, X, Settings } from 'lucide-react-native';
import GradientHeader from '../../components/GradientHeader';
import DhikrCard from '../../components/DhikrCard';
import { useApp, WAZIFA_TARGETS } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import WazifaInfoModal from '../../components/WazifaInfoModal';

const wazifaDhikr = {
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
};

export default function WazifaScreen() {
  const { state, dispatch, isWazifaComplete, getWazifaProgress, getWazifaJawharaTarget } = useApp();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempUseJawhara, setTempUseJawhara] = useState(state.wazifaSettings.useJawhara);

  // Logique corrigée pour la progression séquentielle
  const getStepStatus = (stepIndex: number) => {
    const dhikrKeys = ['istighfar', 'salatFatih1', 'tahlil', 'jawhara'] as const;
    const targets = [
      WAZIFA_TARGETS.istighfar,
      WAZIFA_TARGETS.salatFatih1,
      WAZIFA_TARGETS.tahlil,
      getWazifaJawharaTarget()
    ];
    
    // Étape actuelle complétée
    if (state.wazifa[dhikrKeys[stepIndex]] >= targets[stepIndex]) {
      return 'completed';
    }
    
    // Première étape ou étape précédente complétée
    if (stepIndex === 0 || state.wazifa[dhikrKeys[stepIndex - 1]] >= targets[stepIndex - 1]) {
      return 'active';
    }
    
    // Étape désactivée (étape précédente non complétée)
    return 'disabled';
  };

  const completedCount = [
    state.wazifa.istighfar >= WAZIFA_TARGETS.istighfar,
    state.wazifa.salatFatih1 >= WAZIFA_TARGETS.salatFatih1,
    state.wazifa.tahlil >= WAZIFA_TARGETS.tahlil,
    state.wazifa.jawhara >= getWazifaJawharaTarget()
  ].filter(Boolean).length;

  const handleResetAll = () => {
    dispatch({ type: 'RESET_ALL_WAZIFA' });
  };

  const handleCompleteWazifa = () => {
    if (isWazifaComplete) {
      dispatch({ type: 'COMPLETE_WAZIFA' });
      // Optionnel: réinitialiser pour une nouvelle session
      // dispatch({ type: 'RESET_ALL_WAZIFA' });
    }
  };

  const handleIncrement = (dhikr: keyof typeof state.wazifa) => {
    dispatch({ type: 'INCREMENT_WAZIFA', dhikr });
  };

  const handleSaveSettings = () => {
    dispatch({ 
      type: 'UPDATE_WAZIFA_SETTINGS', 
      settings: { useJawhara: tempUseJawhara } 
    });
    setShowSettings(false);
  };

  const playAudio = (dhikrType: string) => {
    if (state.settings.audioEnabled) {
      console.log(`Playing audio for ${dhikrType}`);
    }
  };

  // Obtenir le titre et le nombre pour la dernière étape
  const getFinalDhikrTitle = () => {
    if (state.wazifaSettings.useJawhara) {
      return `${wazifaDhikr.jawhara.title} (12x)`;
    } else {
      return `${wazifaDhikr.salatFatih.title} (20x)`;
    }
  };

  const getFinalDhikrContent = () => {
    if (state.wazifaSettings.useJawhara) {
      return wazifaDhikr.jawhara;
    } else {
      return wazifaDhikr.salatFatih;
    }
  };

  return (
    <SafeAreaView style={[
      styles.container,
      state.settings.darkMode && styles.containerDark
    ]}>
      <ScreenBackground>
      {/* <GradientHeader
        arabicTitle="الوَظِيفَة التِّجَانِيَّة"
        englishTitle="Wazīfa Tijāniyya"
        subtitle="The Daily Devotional Recitation"
        icon={<Star color="#FFFFFF" size={32} fill="#FFFFFF" />}
      /> */}

      <View style={[
        styles.progressContainer,
        state.settings.darkMode && styles.progressContainerDark
      ]}>
        <Text style={[
          styles.progressText,
          state.settings.darkMode && styles.progressTextDark
        ]}>
          {completedCount} of 4 completed
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => setShowInfoModal(true)} 
            style={styles.infoButton}
          >
            <Info color="#6B7280" size={16} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setShowSettings(true)} 
            style={styles.settingsButton}
          >
            <Settings color="#6B7280" size={16} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleResetAll} style={styles.resetAllButton}>
            <RotateCcw color="#6B7280" size={16} />
            <Text style={[
              styles.resetAllText,
              state.settings.darkMode && styles.resetAllTextDark
            ]}>
              Reset All
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Overall Progress Bar */}
      <View style={styles.overallProgressContainer}>
        <View style={[
          styles.overallProgressBar,
          state.settings.darkMode && styles.overallProgressBarDark
        ]}>
          <View 
            style={[
              styles.overallProgressFill,
              { width: `${getWazifaProgress()}%` }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <DhikrCard
          title={`${wazifaDhikr.istighfar.title} (30x)`}
          arabic={wazifaDhikr.istighfar.arabic}
          transliteration={wazifaDhikr.istighfar.transliteration}
          translation={wazifaDhikr.istighfar.translation}
          count={state.wazifa.istighfar}
          target={WAZIFA_TARGETS.istighfar}
          onIncrement={() => handleIncrement('istighfar')}
          onDecrement={() => dispatch({ type: 'DECREMENT_WAZIFA', dhikr: 'istighfar' })}
          onReset={() => dispatch({ type: 'RESET_WAZIFA', dhikr: 'istighfar' })}
          onPlayAudio={() => playAudio('istighfar')}
          status={getStepStatus(0)}
          blessing=""
        />

        <DhikrCard
          title={`${wazifaDhikr.salatFatih.title} (50x)`}
          arabic={wazifaDhikr.salatFatih.arabic}
          transliteration={wazifaDhikr.salatFatih.transliteration}
          translation={wazifaDhikr.salatFatih.translation}
          count={state.wazifa.salatFatih1}
          target={WAZIFA_TARGETS.salatFatih1}
          onIncrement={() => handleIncrement('salatFatih1')}
          onDecrement={() => dispatch({ type: 'DECREMENT_WAZIFA', dhikr: 'salatFatih1' })}
          onReset={() => dispatch({ type: 'RESET_WAZIFA', dhikr: 'salatFatih1' })}
          onPlayAudio={() => playAudio('salatFatih')}
          status={getStepStatus(1)}
          blessing="سبحان ربك رب العزة عما يصفون . وسلام على المرسلين . والحمد لله رب العالمين"
        />

        <DhikrCard
          title={`${wazifaDhikr.tahlil.title} (100x)`}
          arabic={wazifaDhikr.tahlil.arabic}
          transliteration={wazifaDhikr.tahlil.transliteration}
          translation={wazifaDhikr.tahlil.translation}
          count={state.wazifa.tahlil}
          target={WAZIFA_TARGETS.tahlil}
          onIncrement={() => handleIncrement('tahlil')}
          onDecrement={() => dispatch({ type: 'DECREMENT_WAZIFA', dhikr: 'tahlil' })}
          onReset={() => dispatch({ type: 'RESET_WAZIFA', dhikr: 'tahlil' })}
          onPlayAudio={() => playAudio('tahlil')}
          status={getStepStatus(2)}
          blessing="سيدنا محمد رسول الله عليه السلام"
        />

        <DhikrCard
          title={getFinalDhikrTitle()}
          arabic={getFinalDhikrContent().arabic}
          transliteration={getFinalDhikrContent().transliteration}
          translation={getFinalDhikrContent().translation}
          count={state.wazifa.jawhara}
          target={getWazifaJawharaTarget()}
          onIncrement={() => handleIncrement('jawhara')}
          onDecrement={() => dispatch({ type: 'DECREMENT_WAZIFA', dhikr: 'jawhara' })}
          onReset={() => dispatch({ type: 'RESET_WAZIFA', dhikr: 'jawhara' })}
          onPlayAudio={() => playAudio(state.wazifaSettings.useJawhara ? 'jawhara' : 'salatFatih')}
          status={getStepStatus(3)}
          blessing="بارك الله فيك"
        />

        <View style={[
          styles.instructionsContainer,
          state.settings.darkMode && styles.instructionsContainerDark
        ]}>
          <Text style={[
            styles.instructionsTitle,
            state.settings.darkMode && styles.instructionsTitleDark
          ]}>
            The Wazīfa should be recited:
          </Text>
          <Text style={[
            styles.instruction,
            state.settings.darkMode && styles.instructionDark
          ]}>
            • At least once a day after Asr prayer / or twice per day after Fajr and Asr prayers
          </Text>
          <Text style={[
            styles.instruction,
            state.settings.darkMode && styles.instructionDark
          ]}>
            • In congregation when possible
          </Text>
          <Text style={[
            styles.instruction,
            state.settings.darkMode && styles.instructionDark
          ]}>
            • Complete each dhikr in order before moving to the next
          </Text>
          <Text style={[
            styles.instruction,
            state.settings.darkMode && styles.instructionDark
          ]}>
            • You can customize the final dhikr in settings (Jawhara 12x or Salatul Fatih 20x)
          </Text>
        </View>

        {isWazifaComplete && (
          <TouchableOpacity onPress={handleCompleteWazifa} style={styles.completeButton}>
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
      >
        <SafeAreaView style={[
          styles.modalContainer,
          state.settings.darkMode && styles.modalContainerDark
        ]}>
          <View style={styles.modalHeader}>
            <Text style={[
              styles.modalTitle,
              state.settings.darkMode && styles.modalTitleDark
            ]}>
              Wazīfa Settings
            </Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <X color={state.settings.darkMode ? '#FFFFFF' : '#1F2937'} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingsContent}>
            <View style={styles.settingItem}>
              <View>
                <Text style={[
                  styles.settingLabel,
                  state.settings.darkMode && styles.settingLabelDark
                ]}>
                  Final Dhikr Choice
                </Text>
                <Text style={[
                  styles.settingDescription,
                  state.settings.darkMode && styles.settingDescriptionDark
                ]}>
                  Choose between Jawharat al-Kamāl (12x) or Ṣalāt al-Fātiḥ (20x) for the final dhikr
                </Text>
              </View>
            </View>

            <View style={styles.optionItem}>
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  state.settings.darkMode && styles.optionTitleDark
                ]}>
                  Jawharat al-Kamāl (12x)
                </Text>
                <Text style={[
                  styles.optionSubtitle,
                  state.settings.darkMode && styles.optionSubtitleDark
                ]}>
                  Default traditional choice
                </Text>
              </View>
              <Switch
                value={tempUseJawhara}
                onValueChange={setTempUseJawhara}
                trackColor={{ false: '#767577', true: '#059669' }}
                thumbColor={tempUseJawhara ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>

            <View style={styles.optionItem}>
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionTitle,
                  state.settings.darkMode && styles.optionTitleDark
                ]}>
                  Ṣalāt al-Fātiḥ (20x)
                </Text>
                <Text style={[
                  styles.optionSubtitle,
                  state.settings.darkMode && styles.optionSubtitleDark
                ]}>
                  Alternative blessed prayer
                </Text>
              </View>
              <Switch
                value={!tempUseJawhara}
                onValueChange={(value) => setTempUseJawhara(!value)}
                trackColor={{ false: '#767577', true: '#059669' }}
                thumbColor={!tempUseJawhara ? '#FFFFFF' : '#f4f3f4'}
              />
            </View>

            <TouchableOpacity onPress={handleSaveSettings} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Info Modal */}
      <WazifaInfoModal 
        visible={showInfoModal} 
        onClose={() => setShowInfoModal(false)} 
        darkMode={state.settings.darkMode}
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
    paddingVertical: 12,
    backgroundColor: '#059669',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressContainerDark: {
    backgroundColor: '#1F2937',
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
  infoButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  resetAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  resetAllText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  resetAllTextDark: {
    color: '#D1D5DB',
  },
  overallProgressContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  overallProgressBarDark: {
    backgroundColor: '#374151',
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: '#EAB308',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
    marginTop: 8,
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
    marginBottom: 8,
  },
  instructionsTitleDark: {
    color: '#FFFFFF',
  },
  instruction: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  instructionDark: {
    color: '#D1D5DB',
  },
  completeButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalTitleDark: {
    color: '#FFFFFF',
  },
  settingsContent: {
    padding: 16,
  },
  settingItem: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingLabelDark: {
    color: '#FFFFFF',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingDescriptionDark: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionItemDark: {
    backgroundColor: '#374151',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
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
  saveButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});