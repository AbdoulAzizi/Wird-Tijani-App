// components/library/MasterDetail.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, MapPin, Award, BookOpen, Sparkles } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

interface MasterDetailProps {
  item: any;
}

export const MasterDetail: React.FC<MasterDetailProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      {/* Info Header */}
      <View style={styles.infoBox}>
        <Text style={styles.titleBadge}>{item.title}</Text>
        
        <View style={styles.infoRow}>
          <Calendar color={COLORS.primary} size={18} />
          <Text style={styles.infoText}>{item.years}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MapPin color={COLORS.primary} size={18} />
          <Text style={styles.infoText}>{item.location}</Text>
        </View>
      </View>

      {/* Biography */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <BookOpen color={COLORS.primary} size={20} />
          <Text style={styles.sectionTitle}>Biographie</Text>
        </View>
        <Text style={styles.biographyText}>{item.fullBiography}</Text>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Award color={COLORS.primary} size={20} />
          <Text style={styles.sectionTitle}>Réalisations Majeures</Text>
        </View>
        <View style={styles.listContainer}>
          {item.achievements?.map((achievement: string, index: number) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <Text style={styles.listText}>{achievement}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Teachings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Sparkles color={COLORS.primary} size={20} />
          <Text style={styles.sectionTitle}>Enseignements Clés</Text>
        </View>
        <View style={styles.teachingsContainer}>
          {item.teachings?.map((teaching: string, index: number) => (
            <View key={index} style={styles.teachingCard}>
              <View style={styles.bulletPoint} />
              <Text style={styles.teachingText}>{teaching}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Legacy */}
      <View style={styles.legacyBox}>
        <Text style={styles.legacyTitle}>Héritage Spirituel</Text>
        <Text style={styles.legacyText}>{item.legacy}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  infoBox: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 2,
    borderColor: COLORS.primaryPale,
  },
  titleBadge: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    flex: 1,
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
  biographyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  teachingsContainer: {
    gap: 12,
  },
  teachingCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  teachingText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  legacyBox: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  legacyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
  },
  legacyText: {
    fontSize: 15,
    color: COLORS.white,
    lineHeight: 24,
    opacity: 0.95,
  },
});