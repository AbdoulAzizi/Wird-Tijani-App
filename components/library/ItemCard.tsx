// components/library/ItemCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight, MapPin } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

interface ItemCardProps {
  item: any;
  onPress: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Badge en haut à droite */}
      {item.badge && (
        <View style={[styles.badge, { backgroundColor: item.badgeColor || COLORS.primary }]}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}

      <View style={styles.content}>
        {/* Titre et sous-titre */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{item.title || item.name}</Text>
          {item.arabicTitle && (
            <Text style={styles.arabicText}>{item.arabicTitle}</Text>
          )}
        </View>

        {/* Métadonnées */}
        <View style={styles.metaSection}>
          {item.speaker && (
            <Text style={styles.metaText}>— {item.speaker}</Text>
          )}
          {item.author && (
            <Text style={styles.metaText}>par {item.author}</Text>
          )}
          {item.location && (
            <View style={styles.metaRow}>
              <MapPin color={COLORS.primary} size={14} />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
          )}
          {item.years && (
            <Text style={styles.metaText}>{item.years}</Text>
          )}
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>

        {/* Footer avec action */}
        <View style={styles.footer}>
          <Text style={styles.actionText}>En savoir plus</Text>
          <ChevronRight color={COLORS.primary} size={16} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryPale,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  content: {
    paddingRight: 60, // Espace pour le badge
  },
  headerSection: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  arabicText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  metaSection: {
    marginBottom: 8,
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryPale,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
});