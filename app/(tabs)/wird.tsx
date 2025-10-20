import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, RotateCcw, Info, X, Settings, CheckCircle } from 'lucide-react-native';
import GradientHeader from '../../components/GradientHeader';
import DhikrCard from '../../components/DhikrCard';
import { useApp, WIRD_TARGETS } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import WirdInfoModal from '../../components/WirdInfoModal';
import WirdSettingsModal from '../../components/WirdSettingsModal';

const DHIKR_DATA = {
  istighfar: {
    title: 'Istighfār',
    arabic: 'أَسْتَغْفِرُ اللّٰهَ',
    transliteration: 'Astaghfiru Llāh',
    translation: 'I seek forgiveness from Allah',
  },
  tahlil: {
    title: 'Tahlīl',
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
    transliteration: 'Lā ilāha illa Llāh',
    translation: 'There is no god but Allah',
  },
} as const;

const DHIKR_KEYS = ['istighfar', 'salatFatih', 'tahlil'] as const;
const TARGETS = [WIRD_TARGETS.istighfar, WIRD_TARGETS.salatFatih, WIRD_TARGETS.tahlil];

export default function WirdScreen() {
  const { state, dispatch, isWirdComplete, getWirdProgress, getCurrentSalawatFormula } = useApp();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const currentSalawatFormula = getCurrentSalawatFormula();
  const { darkMode, audioEnabled } = state.settings;

  // Memoized calculations
  const completedCount = useMemo(() => {
    return DHIKR_KEYS.filter((key, index) => state.wird[key] >= TARGETS[index]).length;
  }, [state.wird]);

  const progress = useMemo(() => getWirdProgress(), [state.wird]);

  // Optimized step status calculation
  const getStepStatus = useCallback((stepIndex: number) => {
    const currentCount = state.wird[DHIKR_KEYS[stepIndex]];
    const currentTarget = TARGETS[stepIndex];
    
    if (currentCount >= currentTarget) {
      return 'completed';
    }
    
    if (stepIndex === 0 || state.wird[DHIKR_KEYS[stepIndex - 1]] >= TARGETS[stepIndex - 1]) {
      return 'active';
    }
    
    return 'disabled';
  }, [state.wird]);

  // Handlers with useCallback for performance
  const handleResetAll = useCallback(() => {
    Alert.alert(
      'Reset All',
      'Are you sure you want to reset all dhikr counts?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => dispatch({ type: 'RESET_ALL_WIRD' })
        },
      ]
    );
  }, [dispatch]);

  const handleCompleteWird = useCallback(() => {
    if (isWirdComplete) {
      dispatch({ type: 'COMPLETE_WIRD' });
      Alert.alert(
        'Wird Complete! 🎉',
        'May Allah accept your dhikr.',
        [{ text: 'Alhamdulillah' }]
      );
    }
  }, [isWirdComplete, dispatch]);

  const handleIncrement = useCallback((dhikr: keyof typeof state.wird) => {
    dispatch({ type: 'INCREMENT_WIRD', dhikr });
  }, [dispatch]);

  const handleDecrement = useCallback((dhikr: keyof typeof state.wird) => {
    dispatch({ type: 'DECREMENT_WIRD', dhikr });
  }, [dispatch]);

  const handleReset = useCallback((dhikr: keyof typeof state.wird, dhikrTitle: string) => {
    Alert.alert(
      'Reset Dhikr',
      `Are you sure you want to reset ${dhikrTitle}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => dispatch({ type: 'RESET_WIRD', dhikr })
        },
      ]
    );
  }, [dispatch]);

  const playAudio = useCallback((dhikrType: string) => {
    if (audioEnabled) {
      console.log(`Playing audio for ${dhikrType}`);
      // Implementation d'audio ici
    }
  }, [audioEnabled]);

  const toggleInfoModal = useCallback(() => setShowInfoModal(prev => !prev), []);
  const toggleSettingsModal = useCallback(() => setShowSettingsModal(prev => !prev), []);

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      <ScreenBackground>
        {/* Progress Header */}
        <View style={[styles.progressContainer, darkMode && styles.progressContainerDark]}>
          <View style={styles.progressInfo}>
            <CheckCircle 
              color={completedCount === 3 ? '#10B981' : '#FFFFFF'} 
              size={20} 
              fill={completedCount === 3 ? '#10B981' : 'transparent'}
            />
            <Text style={[styles.progressText, darkMode && styles.progressTextDark]}>
              {completedCount} of 3 completed
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
              onPress={toggleSettingsModal} 
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
            <View 
              style={[styles.overallProgressFill, { width: `${progress}%` }]} 
            />
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
          {/* Istighfar */}
          <DhikrCard
            title={DHIKR_DATA.istighfar.title}
            arabic={DHIKR_DATA.istighfar.arabic}
            transliteration={DHIKR_DATA.istighfar.transliteration}
            translation={DHIKR_DATA.istighfar.translation}
            count={state.wird.istighfar}
            target={WIRD_TARGETS.istighfar}
            onIncrement={() => handleIncrement('istighfar')}
            onDecrement={() => handleDecrement('istighfar')}
            onReset={() => handleReset('istighfar', DHIKR_DATA.istighfar.title)}
            onPlayAudio={() => playAudio('istighfar')}
            status={getStepStatus(0)}
            blessing=""
          />

          {/* Salat al-Fatih */}
          <DhikrCard
            title={currentSalawatFormula.title}
            arabic={currentSalawatFormula.arabic}
            transliteration={currentSalawatFormula.transliteration}
            translation={currentSalawatFormula.translation}
            count={state.wird.salatFatih}
            target={WIRD_TARGETS.salatFatih}
            onIncrement={() => handleIncrement('salatFatih')}
            onDecrement={() => handleDecrement('salatFatih')}
            onReset={() => handleReset('salatFatih', currentSalawatFormula.title)}
            onPlayAudio={() => playAudio('salatFatih')}
            status={getStepStatus(1)}
            blessing="سبحان ربك رب العزة عما يصفون . وسلام على المرسلين . والحمد لله رب العالمين"
          />

          {/* Tahlil */}
          <DhikrCard
            title={DHIKR_DATA.tahlil.title}
            arabic={DHIKR_DATA.tahlil.arabic}
            transliteration={DHIKR_DATA.tahlil.transliteration}
            translation={DHIKR_DATA.tahlil.translation}
            count={state.wird.tahlil}
            target={WIRD_TARGETS.tahlil}
            onIncrement={() => handleIncrement('tahlil')}
            onDecrement={() => handleDecrement('tahlil')}
            onReset={() => handleReset('tahlil', DHIKR_DATA.tahlil.title)}
            onPlayAudio={() => playAudio('tahlil')}
            status={getStepStatus(2)}
            blessing="سيدنا محمد رسول الله عليه السلام"
          />

          {/* Instructions */}
          <View style={[styles.instructionsContainer, darkMode && styles.instructionsContainerDark]}>
            <Text style={[styles.instructionsTitle, darkMode && styles.instructionsTitleDark]}>
              📿 Wird Recitation Times
            </Text>
            <View style={styles.instructionsList}>
              <Text style={[styles.instruction, darkMode && styles.instructionDark]}>
                • Once after Fajr prayer
              </Text>
              <Text style={[styles.instruction, darkMode && styles.instructionDark]}>
                • Once before Maghrib prayer
              </Text>
              <Text style={[styles.instruction, darkMode && styles.instructionDark]}>
                • Complete each dhikr sequentially
              </Text>
            </View>
          </View>

          {/* Complete Button */}
          {isWirdComplete && (
            <TouchableOpacity 
              onPress={handleCompleteWird} 
              style={[styles.completeButton, darkMode && styles.completeButtonDark]}
              activeOpacity={0.8}
            >
              <CheckCircle color="#FFFFFF" size={20} />
              <Text style={styles.completeButtonText}>Complete Wird</Text>
            </TouchableOpacity>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Modals */}
        <WirdInfoModal 
          visible={showInfoModal} 
          onClose={toggleInfoModal} 
          darkMode={darkMode}
        />

        <WirdSettingsModal 
          visible={showSettingsModal} 
          onClose={toggleSettingsModal} 
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
});