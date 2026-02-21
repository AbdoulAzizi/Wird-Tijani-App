// components/library/WordDetail.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Quote, User, BookOpen, Lightbulb } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

interface WordDetailProps {
  item: any;
}

export const WordDetail: React.FC<WordDetailProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      {/* Speaker */}
      <View style={styles.speakerBox}>
        <User color={COLORS.primary} size={18} />
        <Text style={styles.speakerText}>{item.speaker}</Text>
      </View>

      {/* Arabic Text if exists */}
      {item.arabicText && (
        <View style={styles.arabicBox}>
          <Text style={styles.arabicText}>{item.arabicText}</Text>
        </View>
      )}

      {/* Main Quote */}
      <View style={styles.quoteBox}>
        <Quote color={COLORS.primary} size={32} style={styles.quoteIcon} />
        <Text style={styles.quoteText}>{item.fullText}</Text>
        <Quote 
          color={COLORS.primary} 
          size={32} 
          style={[styles.quoteIcon, styles.quoteIconBottom]} 
        />
      </View>

      {/* Context */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <BookOpen color={COLORS.primary} size={20} />
          <Text style={styles.sectionTitle}>Contexte</Text>
        </View>
        <Text style={styles.contextText}>{item.context}</Text>
      </View>

      {/* Lessons */}
      <View style={styles.lessonsBox}>
        <View style={styles.lessonsHeader}>
          <Lightbulb color={COLORS.white} size={20} />
          <Text style={styles.lessonsTitle}>Enseignements</Text>
        </View>
        <View style={styles.lessonsList}>
          {item.lessons?.map((lesson: string, index: number) => (
            <View key={index} style={styles.lessonItem}>
              <View style={styles.lessonDot} />
              <Text style={styles.lessonText}>{lesson}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  speakerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  speakerText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
  arabicBox: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.primaryPale,
  },
  arabicText: {
    fontSize: 20,
    textAlign: 'center',
    color: COLORS.primary,
    lineHeight: 36,
    fontWeight: '600',
  },
  quoteBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    position: 'relative',
    borderWidth: 2,
    borderColor: COLORS.primaryPale,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  quoteIcon: {
    opacity: 0.2,
    marginBottom: 8,
  },
  quoteIconBottom: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 0,
    transform: [{ rotate: '180deg' }],
  },
  quoteText: {
    fontSize: 17,
    color: COLORS.textPrimary,
    lineHeight: 28,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  contextText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
  },
  lessonsBox: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  lessonsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lessonsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
  },
  lessonsList: {
    gap: 14,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  lessonDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginTop: 6,
  },
  lessonText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 22,
    opacity: 0.95,
  },
});