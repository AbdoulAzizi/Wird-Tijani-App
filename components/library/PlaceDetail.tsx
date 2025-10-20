// components/library/PlaceDetail.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Star, Clock, Heart } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

interface PlaceDetailProps {
  item: any;
}

export const PlaceDetail: React.FC<PlaceDetailProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      {/* Arabic Name */}
      {item.arabicName && (
        <View style={styles.arabicNameBox}>
          <Text style={styles.arabicName}>{item.arabicName}</Text>
        </View>
      )}

      {/* Location */}
      <View style={styles.locationBox}>
        <MapPin color={COLORS.primary} size={20} />
        <Text style={styles.locationText}>{item.location}</Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.descriptionText}>{item.fullDescription}</Text>
      </View>

      {/* Significance */}
      <View style={styles.significanceCard}>
        <View style={styles.cardHeader}>
          <Star color={COLORS.primary} size={20} />
          <Text style={styles.cardTitle}>Signification Spirituelle</Text>
        </View>
        <Text style={styles.cardText}>{item.significance}</Text>
      </View>

      {/* History */}
      <View style={styles.historyCard}>
        <View style={styles.cardHeader}>
          <Clock color={COLORS.primary} size={20} />
          <Text style={styles.cardTitle}>Histoire</Text>
        </View>
        <Text style={styles.cardText}>{item.history}</Text>
      </View>

      {/* Practices */}
      <View style={styles.practicesBox}>
        <View style={styles.practicesHeader}>
          <Heart color={COLORS.white} size={20} />
          <Text style={styles.practicesTitle}>Pratiques Spirituelles</Text>
        </View>
        <View style={styles.practicesList}>
          {item.practices?.map((practice: string, index: number) => (
            <View key={index} style={styles.practiceItem}>
              <View style={styles.practiceNumber}>
                <Text style={styles.practiceNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.practiceText}>{practice}</Text>
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
  arabicNameBox: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryPale,
  },
  arabicName: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: '700',
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.background,
    padding: 14,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  section: {
    gap: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  significanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  historyCard: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 18,
    gap: 12,
    borderWidth: 2,
    borderColor: COLORS.primaryPale,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  practicesBox: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  practicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  practicesTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
  },
  practicesList: {
    gap: 12,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  practiceNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  practiceText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 22,
    opacity: 0.95,
  },
});