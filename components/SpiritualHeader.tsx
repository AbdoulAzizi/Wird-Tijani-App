import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu, Bell, Search, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SpiritualHeaderProps {
  onMenuPress: () => void;
  currentPage?: string;
}

export default function SpiritualHeader({ onMenuPress, currentPage = 'Home' }: SpiritualHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <LinearGradient
      colors={['#059669', '#047857', '#065f46']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Decorative background with Islamic pattern */}
      <View style={styles.decorativePattern}>
        <Sparkles color="rgba(255, 255, 255, 0.1)" size={80} style={styles.sparkle1} />
        <Sparkles color="rgba(255, 255, 255, 0.08)" size={120} style={styles.sparkle2} />
      </View>

      {/* First row: Menu, Title, Actions */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconButton}>
            <Menu color="#FFFFFF" size={24} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>

        <View style={styles.centerContent}>
          <Text style={styles.muhammadName}> ﷺ</Text>
          <View style={styles.logoContainer}>
            <View style={styles.crescent}>
              <View style={styles.crescentInner} />
            </View>
            <Sparkles color="#FCD34D" size={16} style={styles.star} />
          </View>
       
          <Text style={styles.allahName}>ﷲ</Text>
        </View>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Search color="#FFFFFF" size={22} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <View>
              <Bell color="#FFFFFF" size={22} strokeWidth={2.5} />
              <View style={styles.notificationBadge} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Second row: Greeting and current page */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.pageName}>{currentPage}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'short' 
            })}
          </Text>
        </View>
      </View>

      {/* Decorative line at bottom */}
      <View style={styles.bottomBorder}>
        <View style={styles.borderPattern} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativePattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkle1: {
    position: 'absolute',
    top: -20,
    right: -10,
    transform: [{ rotate: '15deg' }],
  },
  sparkle2: {
    position: 'absolute',
    bottom: -30,
    left: -20,
    transform: [{ rotate: '-20deg' }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 1,
  },
  menuButton: {
    width: 44,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  centerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logoContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crescent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FCD34D',
    overflow: 'hidden',
  },
  crescentInner: {
    position: 'absolute',
    top: -2,
    left: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
  },
  star: {
    position: 'absolute',
    top: 2,
    right: 8,
  },
  allahName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FCD34D',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  muhammadName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
    width: 96,
    justifyContent: 'flex-end',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 1,
    paddingHorizontal: 4,
  },
  greeting: {
    fontSize: 14,
    color: '#D1FAE5',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  pageName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  dateContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  borderPattern: {
    height: '100%',
    backgroundColor: '#FCD34D',
    width: '30%',
    borderTopRightRadius: 2,
  },
});