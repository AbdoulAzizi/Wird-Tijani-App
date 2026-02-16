import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Clock, LucideIcon } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 16px padding on each side + 16px gap

interface PracticeCardData {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  icon?: LucideIcon;
  image?: any;
  color: string;
  lightColor: string;
  route: string;
  time: string;
  priority: string;
}

interface PracticeCardProps {
  card: PracticeCardData;
  progress?: number;
  onPress: (route: string) => void;
  darkMode: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function PracticeCard({ card, progress = 0, onPress, darkMode }: PracticeCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const renderIcon = () => {
   if (card.image) {
  return (
    <View style={[
      styles.imageWrapper,
      darkMode 
        ? { backgroundColor: card.color }
        : { backgroundColor: card.lightColor }
    ]}>
      <Image
        source={card.image}
        style={styles.cardImage}
        resizeMode="contain"
      />
    </View>
  );
} else if (card.icon) {
      const CardIcon = card.icon;
      return (
        <View style={[
          styles.iconContainer,
          darkMode 
            ? { backgroundColor: card.color }
            : { backgroundColor: card.lightColor }
        ]}>
          <CardIcon 
            color={darkMode ? "#FFFFFF" : card.color} 
            size={28}
            strokeWidth={2}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <AnimatedTouchable
      style={[
        styles.card,
        darkMode && styles.cardDark,
        animatedStyle,
        { width: CARD_WIDTH }
      ]}
      onPress={() => onPress(card.route)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      {/* Priority Badge */}
      {card.priority === 'high' && (
        <View style={styles.priorityBadge}>
          <View style={styles.priorityDot} />
          <Text style={styles.priorityText}>Priority</Text>
        </View>
      )}

      {/* Icon/Image */}
      <View style={styles.iconSection}>
        {renderIcon()}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Arabic Title */}
        <Text 
          style={[
            styles.arabicTitle,
            darkMode && styles.arabicTitleDark
          ]}
          numberOfLines={1}
        >
          {card.arabicTitle}
        </Text>

        {/* English Title */}
        <Text 
          style={[
            styles.title,
            darkMode && styles.titleDark
          ]}
          numberOfLines={2}
        >
          {card.title}
        </Text>

        {/* Description */}
        <Text 
          style={[
            styles.description,
            darkMode && styles.descriptionDark
          ]}
          numberOfLines={2}
        >
          {card.description}
        </Text>

        {/* Progress Bar (if applicable) */}
        {progress > 0 && (
          <View style={styles.progressSection}>
            <View style={[
              styles.progressBar,
              darkMode && styles.progressBarDark
            ]}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${progress}%`,
                    backgroundColor: card.color 
                  }
                ]} 
              />
            </View>
            <Text style={[
              styles.progressText,
              darkMode && styles.progressTextDark
            ]}>
              {Math.round(progress)}%
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={[
          styles.footer,
          darkMode && styles.footerDark
        ]}>
          <Clock color={darkMode ? "#94A3B8" : "#9CA3AF"} size={14} strokeWidth={2} />
          <Text style={[
            styles.timeText,
            darkMode && styles.timeTextDark
          ]}>
            {card.time}
          </Text>
        </View>
      </View>

      {/* Subtle shine effect on press */}
      {!darkMode && (
        <View style={styles.shineOverlay} pointerEvents="none" />
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#1E293B',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },

  // Priority Badge
  priorityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    zIndex: 1,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  priorityText: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Icon Section
  iconSection: {
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },

  // Content
  content: {
    flex: 1,
  },
  arabicTitle: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Amiri_400Regular',
    marginBottom: 6,
    lineHeight: 22,
  },
  arabicTitleDark: {
    color: '#94A3B8',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    lineHeight: 22,
  },
  titleDark: {
    color: '#F8FAFC',
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 18,
    minHeight: 36, // Ensure consistent height
  },
  descriptionDark: {
    color: '#94A3B8',
  },

  // Progress Section
  progressSection: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarDark: {
    backgroundColor: '#334155',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  progressTextDark: {
    color: '#94A3B8',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  footerDark: {
    borderTopColor: '#334155',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  timeTextDark: {
    color: '#94A3B8',
  },

  // Shine overlay
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderRadius: 24,
  },
});