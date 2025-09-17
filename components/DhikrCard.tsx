import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Minus, Plus, RotateCcw, Volume2 } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';

interface DhikrCardProps {
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  target: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  onPlayAudio?: () => void;
  status?: 'completed' | 'active' | 'disabled';
  blessing?: string;
}

export default function DhikrCard({
  title,
  arabic,
  transliteration,
  translation,
  count,
  target,
  onIncrement,
  onDecrement,
  onReset,
  onPlayAudio,
  status = 'active',
  blessing,
}: DhikrCardProps) {
  const { state } = useApp();
  const isComplete = count >= target;
  const isDisabled = status === 'disabled';
  const progressPercentage = (count / target) * 100;

  const getCardStyle = () => {
    if (state.settings.darkMode) {
      if (status === 'completed') return [styles.card, styles.cardDark, styles.cardCompleted];
      if (status === 'disabled') return [styles.card, styles.cardDark, styles.cardDisabled];
      return [styles.card, styles.cardDark];
    } else {
      if (status === 'completed') return [styles.card, styles.cardCompletedLight];
      if (status === 'disabled') return [styles.card, styles.cardDisabled];
      return styles.card;
    }
  };

  return (
    <View style={getCardStyle()}>
      <View style={styles.cardHeader}>
        <Text style={[
          styles.title, 
          state.settings.darkMode && styles.titleDark,
          isDisabled && styles.titleDisabled
        ]}>
          {title}
        </Text>
        {onPlayAudio && (
          <TouchableOpacity 
            onPress={onPlayAudio} 
            style={[
              styles.audioButton,
              state.settings.darkMode && styles.audioButtonDark,
              isDisabled && styles.audioButtonDisabled
            ]}
            disabled={isDisabled}
          >
            <Volume2 color={isDisabled ? '#9CA3AF' : '#059669'} size={20} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[
        styles.arabic, 
        state.settings.darkMode && styles.arabicDark,
        isDisabled && styles.textDisabled
      ]}>
        {arabic}
      </Text>
      <Text style={[
        styles.transliteration,
        state.settings.darkMode && styles.transliterationDark,
        isDisabled && styles.textDisabled
      ]}>
        {transliteration}
      </Text>
      <Text style={[
        styles.translation,
        state.settings.darkMode && styles.translationDark,
        isDisabled && styles.textDisabled
      ]}>
        {translation}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[
          styles.progressBar,
          state.settings.darkMode && styles.progressBarDark
        ]}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%` },
              isComplete && styles.progressComplete
            ]} 
          />
        </View>
      </View>

      <View style={styles.counterContainer}>
        <View style={[styles.countDisplay, isComplete && styles.countComplete]}>
          <Text style={[
            styles.countText, 
            isComplete && styles.countTextComplete,
            state.settings.darkMode && !isComplete && styles.countTextDark
          ]}>
            {count}
          </Text>
        </View>
        <Text style={[
          styles.targetText,
          state.settings.darkMode && styles.targetTextDark,
          isDisabled && styles.textDisabled
        ]}>
          of {target}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onDecrement}
          style={[
            styles.button, 
            styles.decrementButton,
            state.settings.darkMode && styles.decrementButtonDark
          ]}
          disabled={count <= 0 || isDisabled}
        >
          <Minus color={count <= 0 || isDisabled ? '#D1D5DB' : '#6B7280'} size={24} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onIncrement}
          style={[styles.button, styles.incrementButton]}
          disabled={count >= target || isDisabled}
        >
          <Plus color={count >= target || isDisabled ? '#9CA3AF' : '#FFFFFF'} size={24} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={onReset} 
          style={[
            styles.button, 
            styles.resetButton,
            state.settings.darkMode && styles.resetButtonDark
          ]}
          disabled={isDisabled}
        >
          <RotateCcw color={isDisabled ? '#9CA3AF' : '#6B7280'} size={20} />
        </TouchableOpacity>
      </View>

      {blessing && isComplete && (
        <View style={styles.blessingContainer}>
          <Text style={[
            styles.blessingArabic,
            state.settings.darkMode && styles.blessingArabicDark
          ]}>
            {blessing}
          </Text>
          <Text style={[
            styles.blessingTranslation,
            state.settings.darkMode && styles.blessingTranslationDark
          ]}>
            May Allah bless you
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardDark: {
    backgroundColor: '#1F2937',
  },
  cardCompletedLight: {
    backgroundColor: '#059669',
  },
  cardCompleted: {
    backgroundColor: '#059669',
  },
  cardDisabled: {
    // opacity: 0.5, //default opacity
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  titleDisabled: {
    color: '#9CA3AF',
  },
  audioButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  audioButtonDark: {
    backgroundColor: '#374151',
  },
  audioButtonDisabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.5,
  },
  arabic: {
    fontSize: 24,
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 36,
    fontFamily: 'Amiri_400Regular',
  },
  arabicDark: {
    color: '#FFFFFF',
  },
  transliteration: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  transliterationDark: {
    color: '#D1D5DB',
  },
  translation: {
    fontSize: 14,
    textAlign: 'center',
    color: '#4B5563',
    marginBottom: 24,
    lineHeight: 20,
  },
  translationDark: {
    color: '#D1D5DB',
  },
  textDisabled: {
    color: '#9CA3AF',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarDark: {
    backgroundColor: '#374151',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 3,
  },
  progressComplete: {
    backgroundColor: '#EAB308',
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  countDisplay: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#059669',
  },
  countComplete: {
    backgroundColor: '#059669',
  },
  countText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#059669',
  },
  countTextDark: {
    color: '#FFFFFF',
  },
  countTextComplete: {
    color: '#FFFFFF',
  },
  targetText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  targetTextDark: {
    color: '#D1D5DB',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decrementButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  decrementButtonDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  incrementButton: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // elevation: 6,
  },
  resetButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  resetButtonDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  blessingContainer: {
    marginTop: 16,
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  blessingArabic: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Amiri_400Regular',
    marginBottom: 4,
  },
  blessingArabicDark: {
    color: '#FFFFFF',
  },
  blessingTranslation: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
  blessingTranslationDark: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});