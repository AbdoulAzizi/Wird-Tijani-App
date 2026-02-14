import React, { useMemo, useCallback, useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated, StatusBar } from 'react-native';
import { Menu, Bell, Search, Sparkles, Sun, Moon, Sunrise } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ============================================================================
// TYPES
// ============================================================================

interface SpiritualHeaderProps {
  onMenuPress: () => void;
  currentPage?: string;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
  showSearch?: boolean;
  showNotification?: boolean;
  showHijriDate?: boolean;
  theme?: 'default' | 'dark' | 'light';
}

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// ============================================================================
// CONSTANTS
// ============================================================================

const COLORS = {
  gradient: {
    default: ['#059669', '#047857', '#065f46'] as const,
    dark: ['#1F2937', '#111827', '#030712'] as const,
    light: ['#10B981', '#059669', '#047857'] as const,
  },
  accent: '#FCD34D',
  accentDark: '#F59E0B',
  white: '#FFFFFF',
  lightGreen: '#D1FAE5',
  red: '#EF4444',
};

const ANIMATION_CONFIG = {
  notificationPulse: {
    duration: 800,
    scaleMax: 1.2,
  },
  updateInterval: 60000, // 1 minute
};

const ISLAMIC_PATTERN_COUNT = 4;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getTimeOfDay = (hour: number): TimeOfDay => {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const getGreetingMessage = (timeOfDay: TimeOfDay): string => {
  const greetings = {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    night: 'Good night',
  };
  return greetings[timeOfDay];
};

const getTimeIcon = (timeOfDay: TimeOfDay) => {
  const icons = {
    morning: Sunrise,
    afternoon: Sun,
    evening: Sun,
    night: Moon,
  };
  return icons[timeOfDay];
};

const formatGregorianDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatHijriDate = (date: Date): string => {
  try {
    return date.toLocaleDateString('ar-SA-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    console.warn('Hijri date formatting error:', error);
    return '';
  }
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  badge?: number;
  pulseAnim?: Animated.Value;
}

const IconButton = memo(({ 
  icon, 
  onPress, 
  accessibilityLabel, 
  badge, 
  pulseAnim 
}: IconButtonProps) => (
  <TouchableOpacity
    style={styles.iconButton}
    activeOpacity={0.7}
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <View>
      {icon}
      {badge !== undefined && badge > 0 && pulseAnim && (
        <Animated.View
          style={[
            styles.notificationBadge,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Text style={styles.badgeText}>
            {badge <= 99 ? badge : '99+'}
          </Text>
        </Animated.View>
      )}
    </View>
  </TouchableOpacity>
));

IconButton.displayName = 'IconButton';

// ============================================================================
// DECORATIVE ELEMENTS
// ============================================================================

const DecorativeBackground = memo(() => (
  <View style={styles.decorativePattern} pointerEvents="none">
    {/* Sparkles */}
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
    
    {/* Islamic geometric pattern */}
    <View style={styles.islamicPattern}>
      {[...Array(ISLAMIC_PATTERN_COUNT)].map((_, i) => (
        <React.Fragment key={i}>
          <View
            style={[
              styles.patternCircle,
              {
                right: 20 + i * 35,
                top: 10 + i * 18,
                opacity: 0.06 - i * 0.012,
                width: 50 - i * 5,
                height: 50 - i * 5,
                borderRadius: (50 - i * 5) / 2,
              },
            ]}
          />
          <View
            style={[
              styles.patternStar,
              {
                left: 30 + i * 40,
                bottom: 20 + i * 15,
                opacity: 0.05 - i * 0.01,
              },
            ]}
          />
        </React.Fragment>
      ))}
    </View>
  </View>
));

DecorativeBackground.displayName = 'DecorativeBackground';

// ============================================================================
// LOGO COMPONENT
// ============================================================================

const IslamicLogo = memo(() => (
  <View style={styles.logoContainer} accessibilityLabel="Islamic symbol">
    <View style={styles.crescent}>
      <View style={styles.crescentInner} />
    </View>
    <Sparkles color={COLORS.accent} size={14} style={styles.star} />
  </View>
));

IslamicLogo.displayName = 'IslamicLogo';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SpiritualHeader = ({
  onMenuPress,
  currentPage = 'Home',
  onSearchPress,
  onNotificationPress,
  notificationCount = 0,
  showSearch = false,
  showNotification = true,
  showHijriDate = false,
  theme = 'default',
}: SpiritualHeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, ANIMATION_CONFIG.updateInterval);

    return () => clearInterval(timer);
  }, []);

  // Notification badge animation
  useEffect(() => {
    if (notificationCount > 0) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: ANIMATION_CONFIG.notificationPulse.scaleMax,
            duration: ANIMATION_CONFIG.notificationPulse.duration,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: ANIMATION_CONFIG.notificationPulse.duration,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();

      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [notificationCount, pulseAnim]);

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================

  const timeOfDay = useMemo(() => {
    return getTimeOfDay(currentTime.getHours());
  }, [currentTime]);

  const greeting = useMemo(() => {
    return getGreetingMessage(timeOfDay);
  }, [timeOfDay]);

  const TimeIcon = useMemo(() => {
    return getTimeIcon(timeOfDay);
  }, [timeOfDay]);

  const formattedDate = useMemo(() => {
    return formatGregorianDate(currentTime);
  }, [currentTime]);

  const hijriDate = useMemo(() => {
    if (!showHijriDate) return null;
    return formatHijriDate(currentTime);
  }, [currentTime, showHijriDate]);

  const gradientColors = useMemo(() => {
    return COLORS.gradient[theme];
  }, [theme]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSearchPress = useCallback(() => {
    onSearchPress?.();
  }, [onSearchPress]);

  const handleNotificationPress = useCallback(() => {
    onNotificationPress?.();
  }, [onNotificationPress]);

  const handleMenuPress = useCallback(() => {
    onMenuPress();
  }, [onMenuPress]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={gradientColors[0]}
        translucent
      />
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <DecorativeBackground />

        {/* Top Row: Menu, Title, Actions */}
        <View style={styles.topRow}>
          <View style={styles.menuButtonContainer}>
            <IconButton
              icon={<Menu color={COLORS.white} size={24} strokeWidth={2.5} />}
              onPress={handleMenuPress}
              accessibilityLabel="Open menu"
            />
          </View>

          <View style={styles.centerContent}>
            <Text
              style={styles.muhammadName}
              accessibilityLabel="Muhammad, peace be upon him"
            >
              مُحَمَّد ﷺ
            </Text>
            <IslamicLogo />
            <Text style={styles.allahName} accessibilityLabel="Allah">
              ﷲ
            </Text>
          </View>

          <View style={styles.rightActions}>
            {showSearch && onSearchPress && (
              <IconButton
                icon={<Search color={COLORS.white} size={22} strokeWidth={2.5} />}
                onPress={handleSearchPress}
                accessibilityLabel="Search"
              />
            )}

            {/* {showNotification && onNotificationPress && ( */}
            {showNotification  && (
              <IconButton
                icon={<Bell color={COLORS.white} size={22} strokeWidth={2.5} />}
                onPress={handleNotificationPress}
                accessibilityLabel={`Notifications${
                  notificationCount > 0 ? `, ${notificationCount} unread` : ''
                }`}
                badge={notificationCount}
                pulseAnim={pulseAnim}
              />
            )}
          </View>
        </View>

        {/* Bottom Row: Greeting and Date */}
        <View style={styles.bottomRow}>
          <View style={styles.greetingContainer}>
            <View style={styles.greetingRow}>
              <TimeIcon color={COLORS.lightGreen} size={16} strokeWidth={2.5} />
              <Text style={styles.greeting}>{greeting}</Text>
            </View>
            <Text
              style={styles.pageName}
              numberOfLines={1}
              accessibilityLabel={`Current page: ${currentPage}`}
            >
              {currentPage}
            </Text>
          </View>

          <View style={styles.dateSection}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText} accessibilityLabel={`Date: ${formattedDate}`}>
                {formattedDate}
              </Text>
            </View>
            {hijriDate && (
              <Text
                style={styles.hijriText}
                accessibilityLabel={`Hijri date: ${hijriDate}`}
              >
                {hijriDate}
              </Text>
            )}
          </View>
        </View>

        {/* Decorative Bottom Border */}
        <View style={styles.bottomBorder} pointerEvents="none">
          <LinearGradient
            colors={[COLORS.accent, COLORS.accentDark, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.borderPattern}
          />
        </View>
      </LinearGradient>
    </>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativePattern: {
    ...StyleSheet.absoluteFillObject,
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
    ...StyleSheet.absoluteFillObject,
  },
  patternCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  patternStar: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: COLORS.white,
    transform: [{ rotate: '45deg' }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    zIndex: 1,
  },
  menuButtonContainer: {
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
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crescent: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.accentDark,
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
    left: 5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#059669',
  },
  star: {
    position: 'absolute',
    top: 2,
    right: 7,
  },
  allahName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.accent,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  muhammadName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8,
    minWidth: 44,
    justifyContent: 'flex-end',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.red,
    borderWidth: 2,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
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
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.lightGreen,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  pageName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  hijriText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.lightGreen,
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

export default memo(SpiritualHeader);