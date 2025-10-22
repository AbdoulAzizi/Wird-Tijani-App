// components/library/LibraryHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BookOpen, ArrowLeft } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface LibraryHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <View style={styles.gradientBackground}>
        <View style={[styles.gradient, { backgroundColor: COLORS.primary }]} />
      </View>

      <View style={styles.content}>
        {/* Icon ou Back Button */}
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.8}
            >
              <ArrowLeft color={COLORS.white} size={24} />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconContainer}>
              <BookOpen color={COLORS.white} size={28} />
            </View>
          )}
        </View>

        {/* Texte */}
        <View style={styles.textSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      {/* Décorations */}
      <View style={styles.decorationTop} />
      <View style={styles.decorationBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    // paddingTop: 50,
    paddingTop: 5,
    // // paddingBottom: 24,
    paddingBottom: 5,
    paddingHorizontal: 20,
    // borderBottomLeftRadius: 28,
    // borderBottomRightRadius: 28,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.15,
    // shadowRadius: 12,
    // elevation: 8,
    // position: 'relative',
    // overflow: 'hidden',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
    opacity: 0.9,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    zIndex: 1,
  },
  leftSection: {
    width: 48,
    height: 48,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    // backgroundColor: 'rgba(255,255,255,0.2)',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    // backgroundColor: 'rgba(255,255,255,0.2)',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '600',
  },
  decorationTop: {
    position: 'absolute',
    top: 20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decorationBottom: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});