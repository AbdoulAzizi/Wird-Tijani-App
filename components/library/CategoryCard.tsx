// components/library/CategoryCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { Category } from '@/types/library.types';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: category.color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Effet de gradient visuel avec overlay */}
      <View style={[styles.gradientOverlay, { backgroundColor: `${category.color}08` }]} />
      
      <View style={styles.content}>
        {/* Icône avec cercle coloré */}
        <View style={[styles.iconCircle, { backgroundColor: `${category.color}15` }]}>
            <category.icon size={28} color={category.color} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{category.title}</Text>
          <Text style={styles.arabicTitle}>{category.arabicTitle}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {category.description}
          </Text>
          
          <View style={styles.footer}>
            <View style={[styles.countBadge, { backgroundColor: category.color }]}>
              <Text style={styles.countText}>{category.count} éléments</Text>
            </View>
            <ChevronRight color={COLORS.primary} size={20} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    flexDirection: 'row',
    gap: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  arabicTitle: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 8,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
});