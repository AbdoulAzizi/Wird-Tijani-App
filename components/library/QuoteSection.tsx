// components/library/QuoteSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

export const QuoteSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <BookOpen color={COLORS.primary} size={24} />
      </View>
      
      <Text style={styles.arabicText}>
        وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ
      </Text>
      
      <Text style={styles.translationText}>
        "Et invoquez Allah abondamment afin que vous réussissiez"
      </Text>
      
      <View style={styles.referenceBadge}>
        <Text style={styles.referenceText}>Coran 62:10</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    margin: 20,
    marginTop: 32,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryPale,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  arabicText: {
    fontSize: 22,
    textAlign: 'center',
    color: COLORS.primary,
    marginBottom: 16,
    fontWeight: '700',
    lineHeight: 36,
  },
  translationText: {
    fontSize: 15,
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 22,
  },
  referenceBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  referenceText: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: '700',
  },
});