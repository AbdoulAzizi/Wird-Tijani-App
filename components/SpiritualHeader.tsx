import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { Menu, Bell, Search, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SpiritualHeaderProps {
  onMenuPress: () => void;
  currentPage?: string;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
}

export default function SpiritualHeader({ 
  onMenuPress, 
  currentPage = 'Home',
  onSearchPress,
  onNotificationPress,
  notificationCount = 0
}: SpiritualHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // Mettre à jour l'heure toutes les minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Animation du badge de notification
  useEffect(() => {
    if (notificationCount > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [notificationCount, pulseAnim]);

  // Mémoiser le message de salutation
  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, [currentTime]);

  // Mémoiser la date formatée
  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  }, [currentTime]);

  // Mémoiser la date hijri (optionnel)
  const hijriDate = useMemo(() => {
    // Exemple simple - vous pouvez intégrer une vraie conversion hijri
    return currentTime.toLocaleDateString('ar-SA-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [currentTime]);

  // Handlers optimisés
  const handleSearchPress = useCallback(() => {
    onSearchPress?.();
  }, [onSearchPress]);

  const handleNotificationPress = useCallback(() => {
    onNotificationPress?.();
  }, [onNotificationPress]);

  return (
    <LinearGradient
      colors={['#059669', '#047857', '#065f46']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Decorative background with Islamic pattern */}
      <View style={styles.decorativePattern}>
        <Sparkles 
          color="rgba(255, 255, 255, 0.1)" 
          size={80} 
          style={styles.sparkle1} 
        />
        <Sparkles 
          color="rgba(255, 255, 255, 0.08)" 
          size={120} 
          style={styles.sparkle2} 
        />
        <View style={styles.islamicPattern}>
          {[...Array(3)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.patternCircle, 
                { 
                  right: 20 + i * 40, 
                  top: 10 + i * 20,
                  opacity: 0.05 - i * 0.01 
                }
              ]} 
            />
          ))}
        </View>
      </View>

      {/* First row: Menu, Title, Actions */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
          accessibilityLabel="Open menu"
          accessibilityRole="button"
        >
          <View style={styles.iconButton}>
            <Menu color="#FFFFFF" size={24} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>

        <View style={styles.centerContent}>
          <Text style={styles.muhammadName} accessibilityLabel="Peace be upon him">
           مُحَمَّد ﷺ
          </Text>
          <View style={styles.logoContainer}>
            <View style={styles.crescent}>
              <View style={styles.crescentInner} />
            </View>
            <Sparkles color="#FCD34D" size={16} style={styles.star} />
          </View>
          <Text style={styles.allahName} accessibilityLabel="Allah">
            ﷲ
          </Text>
        </View>

        <View style={styles.rightActions}>
          {/* <TouchableOpacity 
            style={styles.iconButton} 
            activeOpacity={0.7}
            onPress={handleSearchPress}
            accessibilityLabel="Search"
            accessibilityRole="button"
          >
            <Search color="#FFFFFF" size={22} strokeWidth={2.5} />
          </TouchableOpacity> */}
          
          <TouchableOpacity 
            style={styles.iconButton} 
            activeOpacity={0.7}
            onPress={handleNotificationPress}
            accessibilityLabel={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
            accessibilityRole="button"
          >
            <View>
              <Bell color="#FFFFFF" size={22} strokeWidth={2.5} />
              {notificationCount > 0 && (
                <Animated.View 
                  style={[
                    styles.notificationBadge,
                    { transform: [{ scale: pulseAnim }] }
                  ]}
                >
                  {notificationCount <= 9 && (
                    <Text style={styles.badgeText}>{notificationCount}</Text>
                  )}
                </Animated.View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Second row: Greeting and current page */}
      <View style={styles.bottomRow}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.pageName} numberOfLines={1}>
            {currentPage}
          </Text>
        </View>
        
        <View style={styles.dateSection}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
          {/* Optionnel: Date hijri */}
          {/* <Text style={styles.hijriText}>{hijriDate}</Text> */}
        </View>
      </View>

      {/* Decorative line at bottom */}
      <View style={styles.bottomBorder}>
        <LinearGradient
          colors={['#FCD34D', '#F59E0B', '#FCD34D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.borderPattern}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
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
  islamicPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  patternCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
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
    ...Platform.select({
      ios: {
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
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
    width: 40,
    justifyContent: 'flex-end',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 1,
    paddingHorizontal: 4,
  },
  greetingContainer: {
    flex: 1,
    marginRight: 12,
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
  dateSection: {
    alignItems: 'flex-end',
  },
  dateContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  hijriText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D1FAE5',
    marginTop: 4,
    textAlign: 'right',
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
    width: '30%',
    borderTopRightRadius: 2,
  },
});