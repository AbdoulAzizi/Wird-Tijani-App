import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, RotateCcw, Info, X, Settings } from 'lucide-react-native';
import GradientHeader from '../../components/GradientHeader';
import DhikrCard from '../../components/DhikrCard';
import { useApp, WIRD_TARGETS } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';
import WirdInfoModal from '../../components/WirdInfoModal';
import WirdSettingsModal from '../../components/WirdSettingsModal';

const dhikrData = {
  istighfar: {
    title: 'Istighfār',
    arabic: 'أَسْتَغْفِرُ اللّٰهَ ',
    transliteration: 'Astaghfiru Llāh',
    translation: 'I seek forgiveness from Allah',
  },
  tahlil: {
    title: 'Tahlīl',
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
    transliteration: 'Lā ilāha illa Llāh',
    translation: 'There is no god but Allah',
  },
};

export default function WirdScreen() {
  const { state, dispatch, isWirdComplete, getWirdProgress, getCurrentSalawatFormula } = useApp();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Récupérer la formule de Salawat actuelle
  const currentSalawatFormula = getCurrentSalawatFormula();

  // Logique corrigée pour la progression séquentielle
  const getStepStatus = (stepIndex: number) => {
    const dhikrKeys = ['istighfar', 'salatFatih', 'tahlil'] as const;
    const targets = [WIRD_TARGETS.istighfar, WIRD_TARGETS.salatFatih, WIRD_TARGETS.tahlil];
    
    // Étape actuelle complétée
    if (state.wird[dhikrKeys[stepIndex]] >= targets[stepIndex]) {
      return 'completed';
    }
    
    // Première étape ou étape précédente complétée
    if (stepIndex === 0 || state.wird[dhikrKeys[stepIndex - 1]] >= targets[stepIndex - 1]) {
      return 'active';
    }
    
    // Étape désactivée (étape précédente non complétée)
    return 'disabled';
  };

  const completedCount = Object.values(state.wird).filter((count, index) => {
    const targets = Object.values(WIRD_TARGETS);
    return count >= targets[index];
  }).length;

  const handleResetAll = () => {
    dispatch({ type: 'RESET_ALL_WIRD' });
  };

  const handleCompleteWird = () => {
    if (isWirdComplete) {
      dispatch({ type: 'COMPLETE_WIRD' });
      // Optionnel: réinitialiser pour une nouvelle session
      // dispatch({ type: 'RESET_ALL_WIRD' });
    }
  };

  const handleIncrement = (dhikr: keyof typeof state.wird) => {
    dispatch({ type: 'INCREMENT_WIRD', dhikr });
  };

  const playAudio = (dhikrType: string) => {
    if (state.settings.audioEnabled) {
      // Audio implementation would go here
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
        arabicTitle="الوِرد التجاني"
        englishTitle="Wird Tijāni"
        subtitle="Daily Spiritual Practice"
        icon={<Heart color="#FFFFFF" size={32} fill="#FFFFFF" />}
      />

      <View style={[
        styles.progressContainer,
        state.settings.darkMode && styles.progressContainerDark
      ]}>
        <Text style={[
          styles.progressText,
          state.settings.darkMode && styles.progressTextDark
        ]}>
          {completedCount} of 3 completed
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => setShowInfoModal(true)} 
            style={styles.infoButton}
          >
            <Info color="#6B7280" size={16} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setShowSettingsModal(true)} 
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
              { width: `${getWirdProgress()}%` }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <DhikrCard
          title={dhikrData.istighfar.title}
          arabic={dhikrData.istighfar.arabic}
          transliteration={dhikrData.istighfar.transliteration}
          translation={dhikrData.istighfar.translation}
          count={state.wird.istighfar}
          target={WIRD_TARGETS.istighfar}
          onIncrement={() => handleIncrement('istighfar')}
          onDecrement={() => dispatch({ type: 'DECREMENT_WIRD', dhikr: 'istighfar' })}
          onReset={() => dispatch({ type: 'RESET_WIRD', dhikr: 'istighfar' })}
          onPlayAudio={() => playAudio('istighfar')}
          status={getStepStatus(0)}
          blessing=""
        />

        <DhikrCard
          title={currentSalawatFormula.title}
          arabic={currentSalawatFormula.arabic}
          transliteration={currentSalawatFormula.transliteration}
          translation={currentSalawatFormula.translation}
          count={state.wird.salatFatih}
          target={WIRD_TARGETS.salatFatih}
          onIncrement={() => handleIncrement('salatFatih')}
          onDecrement={() => dispatch({ type: 'DECREMENT_WIRD', dhikr: 'salatFatih' })}
          onReset={() => dispatch({ type: 'RESET_WIRD', dhikr: 'salatFatih' })}
          onPlayAudio={() => playAudio('salatFatih')}
          status={getStepStatus(1)}
          blessing="سبحان ربك رب العزة عما يصفون . وسلام على المرسلين . والحمد لله رب العالمين"
        />

        <DhikrCard
          title={dhikrData.tahlil.title}
          arabic={dhikrData.tahlil.arabic}
          transliteration={dhikrData.tahlil.transliteration}
          translation={dhikrData.tahlil.translation}
          count={state.wird.tahlil}
          target={WIRD_TARGETS.tahlil}
          onIncrement={() => handleIncrement('tahlil')}
          onDecrement={() => dispatch({ type: 'DECREMENT_WIRD', dhikr: 'tahlil' })}
          onReset={() => dispatch({ type: 'RESET_WIRD', dhikr: 'tahlil' })}
          onPlayAudio={() => playAudio('tahlil')}
          status={getStepStatus(2)}
          blessing="سيدنا محمد رسول الله عليه السلام"
        />

        <View style={[
          styles.instructionsContainer,
          state.settings.darkMode && styles.instructionsContainerDark
        ]}>
          <Text style={[
            styles.instructionsTitle,
            state.settings.darkMode && styles.instructionsTitleDark
          ]}>
            The Wird should be recited:
          </Text>
          <Text style={[
            styles.instruction,
            state.settings.darkMode && styles.instructionDark
          ]}>
            • Once after Fajr prayer
          </Text>
          <Text style={[
            styles.instruction,
            state.settings.darkMode && styles.instructionDark
          ]}>
            • Once before Maghrib prayer
          </Text>
          <Text style={[
            styles.instruction,
            state.settings.darkMode && styles.instructionDark
          ]}>
            • Complete each dhikr in order before moving to the next
          </Text>
        </View>

        {isWirdComplete && (
          <TouchableOpacity onPress={handleCompleteWird} style={styles.completeButton}>
            <Text style={styles.completeButtonText}>Complete Wird</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Info Modal */}
      <WirdInfoModal 
        visible={showInfoModal} 
        onClose={() => setShowInfoModal(false)} 
        darkMode={state.settings.darkMode}
      />

      {/* Settings Modal */}
      <WirdSettingsModal 
        visible={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
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
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  infoButton: {
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
});