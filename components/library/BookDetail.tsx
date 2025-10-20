// components/library/BookDetail.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User, BookOpen, Star, Lightbulb } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

interface BookDetailProps {
  item: any;
}

export const BookDetail: React.FC<BookDetailProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      {/* Arabic Title if exists */}
      {item.arabicTitle && (
        <View style={styles.arabicTitleBox}>
          <Text style={styles.arabicTitle}>{item.arabicTitle}</Text>
        </View>
      )}

      {/* Author */}
      <View style={styles.authorBox}>
        <User color={COLORS.primary} size={18} />
        <Text style={styles.authorText}>{item.author}</Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <BookOpen color={COLORS.primary} size={20} />
          <Text style={styles.sectionTitle}>À Propos du Livre</Text>
        </View>
        <Text style={styles.descriptionText}>{item.fullDescription}</Text>
      </View>

      {/* Key Topics */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Lightbulb color={COLORS.primary} size={20} />
          <Text style={styles.sectionTitle}>Sujets Principaux</Text>
        </View>
        <View style={styles.topicsGrid}>
          {item.keyTopics?.map((topic: string, index: number) => (
            <View key={index} style={styles.topicCard}>
              <View style={styles.topicDot} />
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Significance */}
      <View style={styles.significanceBox}>
        <View style={styles.significanceHeader}>
          <Star color={COLORS.white} size={20} />
          <Text style={styles.significanceTitle}>Importance Spirituelle</Text>
        </View>
        <Text style={styles.significanceText}>{item.significance}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  arabicTitleBox: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryPale,
  },
  arabicTitle: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: '700',
  },
  authorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
  },
  authorText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
  },
  section: {
    gap: 16,
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
  descriptionText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  topicsGrid: {
    gap: 10,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryPale,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  topicDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  topicText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  significanceBox: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  significanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  significanceTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
  },
  significanceText: {
    fontSize: 15,
    color: COLORS.white,
    lineHeight: 24,
    opacity: 0.95,
  },
});