import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ============================================================================
// TYPES
// ============================================================================

interface MinimalHeaderProps {
  title: string;
  onBackPress: () => void;
  onMorePress?: () => void;
  showMore?: boolean;
  theme?: 'default' | 'dark' | 'light';
  subtitle?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const COLORS = {
  gradient: {
    default: ['#059669', '#047857'] as const,
    dark: ['#1F2937', '#111827'] as const,
    light: ['#10B981', '#059669'] as const,
  },
  white: '#FFFFFF',
  lightGreen: '#D1FAE5',
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
}

const IconButton = memo(({ icon, onPress, accessibilityLabel }: IconButtonProps) => (
  <TouchableOpacity
    style={styles.iconButton}
    activeOpacity={0.7}
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    {icon}
  </TouchableOpacity>
));

IconButton.displayName = 'IconButton';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const MinimalHeader = ({
  title,
  onBackPress,
  onMorePress,
  showMore = false,
  theme = 'default',
  subtitle,
}: MinimalHeaderProps) => {
  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleBackPress = useCallback(() => {
    onBackPress();
  }, [onBackPress]);

  const handleMorePress = useCallback(() => {
    onMorePress?.();
  }, [onMorePress]);

  // ============================================================================
  // RENDER
  // ============================================================================

  const gradientColors = COLORS.gradient[theme];

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
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Back Button */}
          <View style={styles.leftSection}>
            <IconButton
              icon={<ArrowLeft color={COLORS.white} size={24} strokeWidth={2.5} />}
              onPress={handleBackPress}
              accessibilityLabel="Go back"
            />
          </View>

          {/* Title Section */}
          <View style={styles.centerSection}>
            <Text
              style={styles.title}
              numberOfLines={1}
              accessibilityLabel={`Page: ${title}`}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={styles.subtitle}
                numberOfLines={1}
                accessibilityLabel={subtitle}
              >
                {subtitle}
              </Text>
            )}
          </View>

          {/* More Button or Spacer */}
          <View style={styles.rightSection}>
            {showMore && onMorePress ? (
              <IconButton
                icon={<MoreVertical color={COLORS.white} size={24} strokeWidth={2.5} />}
                onPress={handleMorePress}
                accessibilityLabel="More options"
              />
            ) : (
              <View style={styles.spacer} />
            )}
          </View>
        </View>

        {/* Bottom Accent Line */}
        <View style={styles.bottomAccent} />
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
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  leftSection: {
    width: 44,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  rightSection: {
    width: 44,
    alignItems: 'flex-end',
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
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  spacer: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.3,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.lightGreen,
    letterSpacing: 0.2,
    textAlign: 'center',
    marginTop: 2,
  },
  bottomAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});

export default memo(MinimalHeader);