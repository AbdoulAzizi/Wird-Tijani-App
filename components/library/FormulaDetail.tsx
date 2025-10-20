// components/library/FormulaDetail.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, Star, Users } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

interface FormulaDetailProps {
  item: any;
}

export const FormulaDetail: React.FC<FormulaDetailProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      {/* Badge */}
      {item.badge && (
        <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}

      {/* Description complète */}
      <Text style={styles.description}>{item.fullDescription}</Text>

      {/* Texte Arabe */}
      <View style={styles.arabicBox}>
        <Text style={styles.arabicText}>{item.arabicText}</Text>
      </View>

      {/* Translittération */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Translittération</Text>
        <View style={styles.transliterationBox}>
          <Text style={styles.transliteration}>{item.transliteration}</Text>
        </View>
      </View>

      {/* Traduction */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Traduction</Text>
        <Text style={styles.translation}>{item.translation}</Text>
      </View>

      {/* Bienfaits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bienfaits Spirituels</Text>
        <View style={styles.benefitsContainer}>
          {item.benefits?.map((benefit: string, index: number) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Guide de Récitation */}
      <View style={styles.recitationBox}>
        <Text style={styles.sectionTitle}>Guide de Récitation</Text>
        
        <View style={styles.recitationItem}>
          <View style={styles.recitationIcon}>
            <Clock color={COLORS.primary} size={20} />
          </View>
          <View style={styles.recitationContent}>
            <Text style={styles.recitationLabel}>Fréquence</Text>
            <Text style={styles.recitationValue}>
              {item.recitation?.frequency}
            </Text>
          </View>
        </View>

        <View style={styles.recitationItem}>
          <View style={styles.recitationIcon}>
            <Star color={COLORS.primary} size={20} />
          </View>
          <View style={styles.recitationContent}>
            <Text style={styles.recitationLabel}>Moment</Text>
            <Text style={styles.recitationValue}>
              {item.recitation?.timing}
            </Text>
          </View>
        </View>

        <View style={styles.recitationItem}>
          <View style={styles.recitationIcon}>
            <Users color={COLORS.primary} size={20} />
          </View>
          <View style={styles.recitationContent}>
            <Text style={styles.recitationLabel}>Conditions</Text>
            <Text style={styles.recitationValue}>
              {item.recitation?.requirements}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  description: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  arabicBox: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.primaryPale,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  arabicText: {
    fontSize: 22,
    textAlign: 'center',
    color: COLORS.primary,
    lineHeight: 38,
    fontWeight: '600',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  transliterationBox: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  transliteration: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  translation: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  benefitsContainer: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 8,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  recitationBox: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.primaryPale,
    gap: 16,
  },
  recitationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recitationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recitationContent: {
    flex: 1,
    gap: 4,
  },
  recitationLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  recitationValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
});