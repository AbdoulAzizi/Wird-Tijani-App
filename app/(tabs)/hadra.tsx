import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sun, RotateCcw, Settings, X, Info } from 'lucide-react-native';
import GradientHeader from '../../components/GradientHeader';
import DhikrCard from '../../components/DhikrCard';
import { useApp, HADRA_TARGETS } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import HadraInfoModal from  '../../components/HadraInfoModal';
const hadraDhikr = {
  tahlil: {
    title: 'Tahlīl',
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
    transliteration: 'Lā ilāha illa Llāh',
    translation: 'There is no god but Allah',
  },
  ismuLlah: {
    title: 'Ism Allāh',
    arabic: 'اللّٰهُ',
    transliteration: 'Allah',
    translation: 'Allah',
  },
};

export default function HadraScreen() {
  const { state, dispatch, isHadraComplete, getHadraProgress } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [tempTargets, setTempTargets] = useState({
    tahlil: HADRA_TARGETS.tahlil,
    ismuLlah: HADRA_TARGETS.ismuLlah,
  });

  // Logique pour la progression séquentielle
  const getStepStatus = (stepIndex: number) => {
    const dhikrKeys = ['tahlil', 'ismuLlah'] as const;
    const targets = [state.hadraTargets.tahlil, state.hadraTargets.ismuLlah];
    
    // Étape actuelle complétée
    if (state.hadra[dhikrKeys[stepIndex]] >= targets[stepIndex]) {
      return 'completed';
    }
    
    // Première étape ou étape précédente complétée
    if (stepIndex === 0 || state.hadra[dhikrKeys[stepIndex - 1]] >= targets[stepIndex - 1]) {
      return 'active';
    }
    
    // Étape désactivée (étape précédente non complétée)
    return 'disabled';
  };

  const completedCount = Object.entries(state.hadra).filter(([key, count]) => {
    return count >= state.hadraTargets[key as keyof typeof state.hadraTargets];
  }).length;

  const handleResetAll = () => {
    dispatch({ type: 'RESET_ALL_HADRA' });
  };

  const handleCompleteHadra = () => {
    if (isHadraComplete) {
      dispatch({ type: 'COMPLETE_HADRA' });
    }
  };

  const handleIncrement = (dhikr: keyof typeof state.hadra) => {
    dispatch({ type: 'INCREMENT_HADRA', dhikr });
  };

  const handleSaveSettings = () => {
    dispatch({ type: 'UPDATE_HADRA_TARGETS', targets: tempTargets });
    setShowSettings(false);
  };

  const handleResetToDefault = () => {
    setTempTargets({
      tahlil: 800,
      ismuLlah: 400,
    });
  };

  const playAudio = (dhikrType: string) => {
    if (state.settings.audioEnabled) {
      console.log(`Playing audio for ${dhikrType}`);
    }
  };

  return (
    <SafeAreaView style={[
      styles.container,
      state.settings.darkMode && styles.containerDark
    ]}>
      <ScreenBackground>
      <GradientHeader
        arabicTitle="حضرة الجمعة"
        englishTitle="Hadra Joumou'a"
        subtitle="Friday Spiritual Gathering"
        icon={<Sun color="#FFFFFF" size={32} fill="#FFFFFF" />}
      />

      <View style={[
        styles.progressContainer,
        state.settings.darkMode && styles.progressContainerDark
      ]}>
        <Text style={[
          styles.progressText,
          state.settings.darkMode && styles.progressTextDark
        ]}>
          {completedCount} of 2 completed
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
              { width: `${getHadraProgress()}%` }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <DhikrCard
          title={`${hadraDhikr.tahlil.title} (${state.hadraTargets.tahlil}x)`}
          arabic={hadraDhikr.tahlil.arabic}
          transliteration={hadraDhikr.tahlil.transliteration}
          translation={hadraDhikr.tahlil.translation}
          count={state.hadra.tahlil}
          target={state.hadraTargets.tahlil}
          onIncrement={() => handleIncrement('tahlil')}
          onDecrement={() => dispatch({ type: 'DECREMENT_HADRA', dhikr: 'tahlil' })}
          onReset={() => dispatch({ type: 'RESET_HADRA', dhikr: 'tahlil' })}
          onPlayAudio={() => playAudio('tahlil')}
          status={getStepStatus(0)}
          blessing="بارك الله فيك"
        />

        <DhikrCard
          title={`${hadraDhikr.ismuLlah.title} (${state.hadraTargets.ismuLlah}x)`}
          arabic={hadraDhikr.ismuLlah.arabic}
          transliteration={hadraDhikr.ismuLlah.transliteration}
          translation={hadraDhikr.ismuLlah.translation}
          count={state.hadra.ismuLlah}
          target={state.hadraTargets.ismuLlah}
          onIncrement={() => handleIncrement('ismuLlah')}
          onDecrement={() => dispatch({ type: 'DECREMENT_HADRA', dhikr: 'ismuLlah' })}
          onReset={() => dispatch({ type: 'RESET_HADRA', dhikr: 'ismuLlah' })}
          onPlayAudio={() => playAudio('ismuLlah')}
          status={getStepStatus(1)}
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
            Hadra Joumou'a guidelines:
          </Text>
          <Text style={[
            styles.instruction,
            state.settings.darkMode && styles.instructionDark
          ]}>
            • Typically performed on Fridays after Maghrib
          </Text>
          <Text style={[
            styles.instruction,
            state.settings.darkMode && styles.instructionDark
          ]}>
            • Best practiced in congregation
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
            • You can customize the target numbers in settings
          </Text>
        </View>

        {isHadraComplete && (
          <TouchableOpacity onPress={handleCompleteHadra} style={styles.completeButton}>
            <Text style={styles.completeButtonText}>Complete Hadra</Text>
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
              Customize Targets
            </Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <X color={state.settings.darkMode ? '#FFFFFF' : '#1F2937'} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingsContent}>
            <View style={styles.settingItem}>
              <Text style={[
                styles.settingLabel,
                state.settings.darkMode && styles.settingLabelDark
              ]}>
                Tahlīl (لَا إِلٰهَ إِلَّا اللّٰهُ)
              </Text>
              <TextInput
                style={[
                  styles.settingInput,
                  state.settings.darkMode && styles.settingInputDark
                ]}
                value={tempTargets.tahlil.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  setTempTargets(prev => ({ ...prev, tahlil: Math.max(1, num) }));
                }}
                keyboardType="numeric"
                placeholder="800"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={[
                styles.settingLabel,
                state.settings.darkMode && styles.settingLabelDark
              ]}>
                Ism Allāh (اللّٰهُ)
              </Text>
              <TextInput
                style={[
                  styles.settingInput,
                  state.settings.darkMode && styles.settingInputDark
                ]}
                value={tempTargets.ismuLlah.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  setTempTargets(prev => ({ ...prev, ismuLlah: Math.max(1, num) }));
                }}
                keyboardType="numeric"
                placeholder="400"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity 
              onPress={handleResetToDefault} 
              style={styles.defaultButton}
            >
              <Text style={styles.defaultButtonText}>Reset to Default (800/400)</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSaveSettings} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Info Modal */}
      <HadraInfoModal 
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
  modalContent: {
    flex: 1,
    padding: 16,
  },
  settingsContent: {
    padding: 16,
  },
  settingItem: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  settingLabelDark: {
    color: '#FFFFFF',
  },
  settingInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  settingInputDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    color: '#FFFFFF',
  },
  defaultButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  defaultButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});