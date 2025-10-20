import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sun, RotateCcw, Settings, X, Info, CheckCircle } from 'lucide-react-native';
import GradientHeader from '../../components/GradientHeader';
import DhikrCard from '../../components/DhikrCard';
import { useApp, HADRA_TARGETS } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import HadraInfoModal from '../../components/HadraInfoModal';

const HADRA_DHIKR = {
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
} as const;

const DHIKR_KEYS = ['tahlil', 'ismuLlah'] as const;
const DEFAULT_TARGETS = {
  tahlil: 800,
  ismuLlah: 400,
};

export default function HadraScreen() {
  const { state, dispatch, isHadraComplete, getHadraProgress } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [tempTargets, setTempTargets] = useState({
    tahlil: state.hadraTargets.tahlil,
    ismuLlah: state.hadraTargets.ismuLlah,
  });

  const { darkMode, audioEnabled } = state.settings;

  // Memoized calculations
  const targets = useMemo(() => [
    state.hadraTargets.tahlil,
    state.hadraTargets.ismuLlah
  ], [state.hadraTargets]);

  const completedCount = useMemo(() => {
    return DHIKR_KEYS.filter((key, index) => state.hadra[key] >= targets[index]).length;
  }, [state.hadra, targets]);

  const progress = useMemo(() => getHadraProgress(), [state.hadra, state.hadraTargets]);

  // Optimized step status calculation
  const getStepStatus = useCallback((stepIndex: number) => {
    const currentCount = state.hadra[DHIKR_KEYS[stepIndex]];
    const currentTarget = targets[stepIndex];
    
    if (currentCount >= currentTarget) {
      return 'completed';
    }
    
    if (stepIndex === 0 || state.hadra[DHIKR_KEYS[stepIndex - 1]] >= targets[stepIndex - 1]) {
      return 'active';
    }
    
    return 'disabled';
  }, [state.hadra, targets]);

  // Handlers with useCallback
  const handleResetAll = useCallback(() => {
    Alert.alert(
      'Reset All',
      'Are you sure you want to reset all hadra counts?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => dispatch({ type: 'RESET_ALL_HADRA' })
        },
      ]
    );
  }, [dispatch]);

  const handleCompleteHadra = useCallback(() => {
    if (isHadraComplete) {
      dispatch({ type: 'COMPLETE_HADRA' });
      Alert.alert(
        'Hadra Complete! 🎉',
        'May Allah accept your dhikr.',
        [{ text: 'Alhamdulillah' }]
      );
    }
  }, [isHadraComplete, dispatch]);

  const handleIncrement = useCallback((dhikr: keyof typeof state.hadra) => {
    dispatch({ type: 'INCREMENT_HADRA', dhikr });
  }, [dispatch]);

  const handleDecrement = useCallback((dhikr: keyof typeof state.hadra) => {
    dispatch({ type: 'DECREMENT_HADRA', dhikr });
  }, [dispatch]);

  const handleReset = useCallback((dhikr: keyof typeof state.hadra, dhikrTitle: string) => {
    Alert.alert(
      'Reset Dhikr',
      `Are you sure you want to reset ${dhikrTitle}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => dispatch({ type: 'RESET_HADRA', dhikr })
        },
      ]
    );
  }, [dispatch]);

  const handleSaveSettings = useCallback(() => {
    // Validation des valeurs
    if (tempTargets.tahlil < 1 || tempTargets.ismuLlah < 1) {
      Alert.alert(
        'Invalid Values',
        'Target numbers must be at least 1.',
        [{ text: 'OK' }]
      );
      return;
    }

    dispatch({ type: 'UPDATE_HADRA_TARGETS', targets: tempTargets });
    setShowSettings(false);
    Alert.alert(
      'Settings Saved',
      'Your hadra targets have been updated.',
      [{ text: 'OK' }]
    );
  }, [tempTargets, dispatch]);

  const handleResetToDefault = useCallback(() => {
    Alert.alert(
      'Reset to Default',
      'Reset targets to 800 (Tahlīl) and 400 (Ism Allāh)?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: () => setTempTargets(DEFAULT_TARGETS)
        },
      ]
    );
  }, []);

  const playAudio = useCallback((dhikrType: string) => {
    if (audioEnabled) {
      console.log(`Playing audio for ${dhikrType}`);
    }
  }, [audioEnabled]);

  const toggleInfoModal = useCallback(() => setShowInfoModal(prev => !prev), []);
  
  const toggleSettings = useCallback(() => {
    setTempTargets({
      tahlil: state.hadraTargets.tahlil,
      ismuLlah: state.hadraTargets.ismuLlah,
    });
    setShowSettings(prev => !prev);
  }, [state.hadraTargets]);

  const handleTargetChange = useCallback((key: 'tahlil' | 'ismuLlah', text: string) => {
    const num = parseInt(text) || 0;
    setTempTargets(prev => ({ ...prev, [key]: Math.max(0, num) }));
  }, []);

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      <ScreenBackground>
        {/* Progress Header */}
        <View style={[styles.progressContainer, darkMode && styles.progressContainerDark]}>
          <View style={styles.progressInfo}>
            <CheckCircle 
              color={completedCount === 2 ? '#10B981' : '#FFFFFF'} 
              size={20} 
              fill={completedCount === 2 ? '#10B981' : 'transparent'}
            />
            <Text style={[styles.progressText, darkMode && styles.progressTextDark]}>
              {completedCount} of 2 completed
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
          {/* Tahlil */}
          <DhikrCard
            title={`${HADRA_DHIKR.tahlil.title} (${state.hadraTargets.tahlil}x)`}
            arabic={HADRA_DHIKR.tahlil.arabic}
            transliteration={HADRA_DHIKR.tahlil.transliteration}
            translation={HADRA_DHIKR.tahlil.translation}
            count={state.hadra.tahlil}
            target={state.hadraTargets.tahlil}
            onIncrement={() => handleIncrement('tahlil')}
            onDecrement={() => handleDecrement('tahlil')}
            onReset={() => handleReset('tahlil', `Tahlīl (${state.hadraTargets.tahlil}x)`)}
            onPlayAudio={() => playAudio('tahlil')}
            status={getStepStatus(0)}
            blessing="بارك الله فيك"
          />

          {/* Ism Allah */}
          <DhikrCard
            title={`${HADRA_DHIKR.ismuLlah.title} (${state.hadraTargets.ismuLlah}x)`}
            arabic={HADRA_DHIKR.ismuLlah.arabic}
            transliteration={HADRA_DHIKR.ismuLlah.transliteration}
            translation={HADRA_DHIKR.ismuLlah.translation}
            count={state.hadra.ismuLlah}
            target={state.hadraTargets.ismuLlah}
            onIncrement={() => handleIncrement('ismuLlah')}
            onDecrement={() => handleDecrement('ismuLlah')}
            onReset={() => handleReset('ismuLlah', `Ism Allāh (${state.hadraTargets.ismuLlah}x)`)}
            onPlayAudio={() => playAudio('ismuLlah')}
            status={getStepStatus(1)}
            blessing="بارك الله فيك"
          />

          {/* Instructions */}
          <View style={[styles.instructionsContainer, darkMode && styles.instructionsContainerDark]}>
            <Text style={[styles.instructionsTitle, darkMode && styles.instructionsTitleDark]}>
              🌙 Hadra Joumou'a Guidelines
            </Text>
            <View style={styles.instructionsList}>
              <Text style={[styles.instruction, darkMode && styles.instructionDark]}>
                • Typically performed on Fridays after Maghrib
              </Text>
              <Text style={[styles.instruction, darkMode && styles.instructionDark]}>
                • Best practiced in congregation
              </Text>
              <Text style={[styles.instruction, darkMode && styles.instructionDark]}>
                • Complete each dhikr sequentially
              </Text>
              <Text style={[styles.instruction, darkMode && styles.instructionDark]}>
                • Customize target numbers in settings
              </Text>
            </View>
          </View>

          {/* Complete Button */}
          {isHadraComplete && (
            <TouchableOpacity 
              onPress={handleCompleteHadra} 
              style={[styles.completeButton, darkMode && styles.completeButtonDark]}
              activeOpacity={0.8}
            >
              <CheckCircle color="#FFFFFF" size={20} />
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
          onRequestClose={toggleSettings}
        >
          <SafeAreaView style={[styles.modalContainer, darkMode && styles.modalContainerDark]}>
            <View style={[styles.modalHeader, darkMode && styles.modalHeaderDark]}>
              <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>
                Customize Targets
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
                  Set Custom Repetitions
                </Text>
                <Text style={[styles.settingSectionDescription, darkMode && styles.settingSectionDescriptionDark]}>
                  Adjust the number of repetitions for each dhikr according to your preference or tradition.
                </Text>
              </View>

              {/* Tahlil Input */}
              <View style={styles.settingItem}>
                <Text style={[styles.settingLabel, darkMode && styles.settingLabelDark]}>
                  Tahlīl (لَا إِلٰهَ إِلَّا اللّٰهُ)
                </Text>
                <View style={[styles.inputContainer, darkMode && styles.inputContainerDark]}>
                  <TextInput
                    style={[styles.settingInput, darkMode && styles.settingInputDark]}
                    value={tempTargets.tahlil.toString()}
                    onChangeText={(text) => handleTargetChange('tahlil', text)}
                    keyboardType="numeric"
                    placeholder="800"
                    placeholderTextColor="#9CA3AF"
                    maxLength={5}
                  />
                  <Text style={[styles.inputSuffix, darkMode && styles.inputSuffixDark]}>
                    times
                  </Text>
                </View>
              </View>

              {/* Ism Allah Input */}
              <View style={styles.settingItem}>
                <Text style={[styles.settingLabel, darkMode && styles.settingLabelDark]}>
                  Ism Allāh (اللّٰهُ)
                </Text>
                <View style={[styles.inputContainer, darkMode && styles.inputContainerDark]}>
                  <TextInput
                    style={[styles.settingInput, darkMode && styles.settingInputDark]}
                    value={tempTargets.ismuLlah.toString()}
                    onChangeText={(text) => handleTargetChange('ismuLlah', text)}
                    keyboardType="numeric"
                    placeholder="400"
                    placeholderTextColor="#9CA3AF"
                    maxLength={5}
                  />
                  <Text style={[styles.inputSuffix, darkMode && styles.inputSuffixDark]}>
                    times
                  </Text>
                </View>
              </View>

              {/* Info Box */}
              <View style={[styles.infoBox, darkMode && styles.infoBoxDark]}>
                <Info color={darkMode ? '#60A5FA' : '#3B82F6'} size={16} />
                <Text style={[styles.infoText, darkMode && styles.infoTextDark]}>
                  Default values: 800 (Tahlīl) and 400 (Ism Allāh)
                </Text>
              </View>

              <TouchableOpacity 
                onPress={handleResetToDefault} 
                style={[styles.defaultButton, darkMode && styles.defaultButtonDark]}
                activeOpacity={0.7}
              >
                <RotateCcw color={darkMode ? '#9CA3AF' : '#6B7280'} size={16} />
                <Text style={[styles.defaultButtonText, darkMode && styles.defaultButtonTextDark]}>
                  Reset to Default
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleSaveSettings} 
                style={[styles.saveButton, darkMode && styles.saveButtonDark]}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Info Modal */}
        <HadraInfoModal 
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
  settingItem: {
    marginBottom: 20,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputContainerDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  settingInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  settingInputDark: {
    color: '#FFFFFF',
  },
  inputSuffix: {
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  inputSuffixDark: {
    color: '#9CA3AF',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoBoxDark: {
    backgroundColor: '#1E3A5F',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#3B82F6',
    lineHeight: 18,
  },
  infoTextDark: {
    color: '#93C5FD',
  },
  defaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  defaultButtonDark: {
    backgroundColor: '#374151',
  },
  defaultButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  defaultButtonTextDark: {
    color: '#D1D5DB',
  },
  saveButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
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