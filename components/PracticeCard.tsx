import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Clock, LucideIcon } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

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
  isNew?: boolean;           // ← badge "New"
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

  const handlePressIn  = () => { scale.value = withSpring(0.96, { damping: 15 }); };
  const handlePressOut = () => { scale.value = withSpring(1,    { damping: 15 }); };

  const renderIcon = () => {
    if (card.image) {
      return (
        <View style={[
          styles.iconContainer,
          { backgroundColor: darkMode ? card.color : card.lightColor },
        ]}>
          <Image source={card.image} style={styles.cardImage} resizeMode="contain" />
        </View>
      );
    }
    if (card.icon) {
      const CardIcon = card.icon;
      return (
        <View style={[
          styles.iconContainer,
          { backgroundColor: darkMode ? card.color : card.lightColor },
        ]}>
          <CardIcon
            color={darkMode ? '#FFFFFF' : card.color}
            size={26}
            strokeWidth={2}
          />
        </View>
      );
    }
    return null;
  };

  const isComplete = progress >= 100;

  return (
    <AnimatedTouchable
      style={[styles.card, darkMode && styles.cardDark, animatedStyle, { width: CARD_WIDTH }]}
      onPress={() => onPress(card.route)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      {/* Coloured top accent strip */}
      <View style={[styles.accentStrip, { backgroundColor: card.color }]} />

      {/* Header row: icon + badges */}
      <View style={styles.header}>
        {renderIcon()}

        <View style={styles.badgesRow}>
          {/* Priority dot */}
          {card.priority === 'high' && (
            <View style={styles.priorityBadge}>
              <View style={[styles.priorityDot, { backgroundColor: card.color }]} />
            </View>
          )}

          {/* "New" badge */}
          {card.isNew && (
            <View style={[styles.newBadge, { backgroundColor: card.color }]}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
      </View>

      {/* Arabic title */}
      <Text
        style={[styles.arabicTitle, darkMode && styles.arabicTitleDark]}
        numberOfLines={1}
      >
        {card.arabicTitle}
      </Text>

      {/* English title */}
      <Text
        style={[styles.title, darkMode && styles.titleDark]}
        numberOfLines={2}
      >
        {card.title}
      </Text>

      {/* Progress bar */}
      {progress > 0 && (
        <View style={styles.progressWrap}>
          <View style={[styles.progressTrack, darkMode && styles.progressTrackDark]}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progress, 100)}%`, backgroundColor: card.color },
              ]}
            />
          </View>
          <Text style={[
            styles.progressPct,
            { color: isComplete ? card.color : (darkMode ? '#94A3B8' : '#64748B') },
          ]}>
            {isComplete ? '✓' : `${Math.round(progress)}%`}
          </Text>
        </View>
      )}

      {/* Footer: time */}
      <View style={[styles.footer, darkMode && styles.footerDark]}>
        <Clock color={darkMode ? '#64748B' : '#CBD5E1'} size={11} strokeWidth={2} />
        <Text
          style={[styles.timeText, darkMode && styles.timeTextDark]}
          numberOfLines={1}
        >
          {card.time}
        </Text>
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  cardDark: {
    backgroundColor: '#1E293B',
    shadowOpacity: 0.25,
  },

  // Coloured top strip
  accentStrip: {
    height: 3,
    width: '100%',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 14,
    paddingBottom: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },

  // Badges row (top-right)
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priorityBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  // "New" badge — card corner
  newBadge: {
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  // Text
  arabicTitle: {
    fontSize: 12,
    color: '#94A3B8',
    paddingHorizontal: 14,
    marginBottom: 3,
    lineHeight: 18,
  },
  arabicTitleDark: { color: '#64748B' },

  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    paddingHorizontal: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  titleDark: { color: '#F8FAFC' },

  // Progress
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
    gap: 7,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressTrackDark: { backgroundColor: '#334155' },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPct: {
    fontSize: 10,
    fontWeight: '700',
    width: 24,
    textAlign: 'right',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerDark: { borderTopColor: '#273549' },
  timeText: {
    fontSize: 10,
    color: '#CBD5E1',
    fontWeight: '600',
    flex: 1,
  },
  timeTextDark: { color: '#475569' },
});