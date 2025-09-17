import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GradientHeaderProps {
  arabicTitle: string;
  englishTitle: string;
  subtitle?: string;
  icon?: React.ReactNode;
  showSubtitle?: boolean;
  showIcon?: boolean;
  height?: 'compact' | 'normal' | 'large';
}

const { width } = Dimensions.get('window');

export default function GradientHeader({ 
  arabicTitle, 
  englishTitle, 
  subtitle,
  icon,
  showSubtitle = false,
  showIcon = false,
  height = 'normal'
}: GradientHeaderProps) {
  const insets = useSafeAreaInsets();
  
  const getHeaderHeight = () => {
    switch (height) {
      case 'compact': return 80;
      case 'large': return 140;
      default: return 100;
    }
  };

  return (
    <LinearGradient
      colors={['rgba(5, 150, 105, 0.8)', 'rgba(217, 119, 6, 0.8)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.header, 
        { 
          paddingTop: insets.top + 20,
          minHeight: getHeaderHeight() + insets.top
        }
      ]}
    >
      {/* Effet de superposition subtil */}
      <View style={styles.overlay} />
      
      <View style={[
        styles.headerContent,
        height === 'compact' && styles.compactContent,
        height === 'large' && styles.largeContent
      ]}>
        
        {/* Conteneur principal avec icône optionnelle */}
        <View style={styles.mainContent}>
          {showIcon && icon && (
            <View style={styles.iconContainer}>
              {icon}
            </View>
          )}
          
          {/* Conteneur des titres */}
          <View style={styles.titlesContainer}>
            <Text style={[
              styles.arabicTitle,
              height === 'compact' && styles.arabicTitleCompact,
              height === 'large' && styles.arabicTitleLarge
            ]}>
              {arabicTitle}
            </Text>
            
            <Text style={[
              styles.englishTitle,
              height === 'compact' && styles.englishTitleCompact,
              height === 'large' && styles.englishTitleLarge
            ]}>
              {englishTitle}
            </Text>
            
            {showSubtitle && subtitle && (
              <Text style={[
                styles.subtitle,
                height === 'compact' && styles.subtitleCompact
              ]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        
        {/* Ligne décorative */}
        <View style={styles.decorativeLine} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    position: 'relative',
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  
  compactContent: {
    justifyContent: 'flex-end',
  },
  
  largeContent: {
    justifyContent: 'center',
  },
  
  mainContent: {
    alignItems: 'center',
    width: '100%',
    maxWidth: width * 0.9,
  },
  
  iconContainer: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  titlesContainer: {
    alignItems: 'center',
    width: '100%',
  },
  
  arabicTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Amiri_400Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    lineHeight: 38,
  },
  
  arabicTitleCompact: {
    fontSize: 26,
    marginBottom: 4,
    lineHeight: 32,
  },
  
  arabicTitleLarge: {
    fontSize: 36,
    marginBottom: 12,
    lineHeight: 44,
  },
  
  englishTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    letterSpacing: 0.5,
    lineHeight: 22,
  },
  
  englishTitleCompact: {
    fontSize: 16,
    marginBottom: 2,
    lineHeight: 20,
  },
  
  englishTitleLarge: {
    fontSize: 20,
    marginBottom: 8,
    lineHeight: 26,
  },
  
  subtitle: {
    fontSize: 14,
    color: '#F3F4F6',
    textAlign: 'center',
    opacity: 0.95,
    marginTop: 4,
    paddingHorizontal: 20,
    lineHeight: 18,
    maxWidth: width * 0.8,
  },
  
  subtitleCompact: {
    fontSize: 12,
    lineHeight: 16,
  },
  
  decorativeLine: {
    width: 60,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
    marginTop: 16,
    marginBottom: 12,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
});