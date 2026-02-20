import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Clock, CheckCircle2, LucideIcon } from 'lucide-react-native';
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
  isNew?: boolean;
}

interface PracticeCardProps {
  card: PracticeCardData;
  progress?: number;
  onPress: (route: string) => void;
  darkMode: boolean;
  isCompletedToday?: boolean;
  // NEW: frequency props
  completionsToday?: number;  // how many times done today
  targetPerDay?: number;      // required completions per day
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function PracticeCard({
  card,
  progress = 0,
  onPress,
  darkMode,
  isCompletedToday = false,
  completionsToday = 0,
  targetPerDay = 1,
}: PracticeCardProps) {
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
          isCompletedToday && styles.iconContainerCompleted,
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
          isCompletedToday && styles.iconContainerCompleted,
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
  const showFrequency = targetPerDay > 1;
  const safeCompletions = Math.min(completionsToday, targetPerDay);

  // Badge label: "2/2 Done" if fully done with target > 1, else "Done"
  const badgeLabel = showFrequency && isCompletedToday
    ? `${safeCompletions}/${targetPerDay}`
    : 'Done';

  return (
    <AnimatedTouchable
      style={[
        styles.card,
        darkMode && styles.cardDark,
        animatedStyle,
        { width: CARD_WIDTH },
        isCompletedToday && styles.cardCompleted,
      ]}
      onPress={() => onPress(card.route)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      {/* Coloured top accent strip */}
      <View style={[
        styles.accentStrip,
        { backgroundColor: isCompletedToday ? '#10B981' : card.color },
      ]} />

      {/* Completion Badge Overlay */}
      {isCompletedToday && (
        <View style={styles.completedBadgeOverlay}>
          <View style={styles.completedBadge}>
            <CheckCircle2 color="#FFFFFF" size={14} strokeWidth={3} />
            <Text style={styles.completedBadgeText}>{badgeLabel}</Text>
          </View>
        </View>
      )}

      {/* Header row: icon + badges */}
      <View style={styles.header}>
        {renderIcon()}
        <View style={styles.badgesRow}>
          {card.priority === 'high' && !isCompletedToday && (
            <View style={styles.priorityBadge}>
              <View style={[styles.priorityDot, { backgroundColor: card.color }]} />
            </View>
          )}
          {card.isNew && !isCompletedToday && (
            <View style={[styles.newBadge, { backgroundColor: card.color }]}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
      </View>

      {/* Arabic title */}
      <Text
        style={[
          styles.arabicTitle,
          darkMode && styles.arabicTitleDark,
          isCompletedToday && styles.textCompleted,
        ]}
        numberOfLines={1}
      >
        {card.arabicTitle}
      </Text>

      {/* English title */}
      <Text
        style={[
          styles.title,
          darkMode && styles.titleDark,
          isCompletedToday && styles.textCompleted,
        ]}
        numberOfLines={2}
      >
        {card.title}
      </Text>

      {/* Frequency dots — shown when target > 1 and not fully done yet */}
      {showFrequency && !isCompletedToday && (
        <View style={styles.freqWrap}>
          {Array.from({ length: targetPerDay }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.freqDot,
                { backgroundColor: i < completionsToday ? card.color : (darkMode ? '#334155' : '#E2E8F0') },
              ]}
            />
          ))}
          <Text style={[styles.freqLabel, { color: darkMode ? '#64748B' : '#94A3B8' }]}>
            {safeCompletions}/{targetPerDay}×
          </Text>
        </View>
      )}

      {/* In-progress frequency bar — shown when partially done */}
      {showFrequency && !isCompletedToday && completionsToday > 0 && (
        <View style={styles.partialBanner}>
          <Text style={[styles.partialText, { color: card.color }]}>
            {completionsToday}/{targetPerDay} done · keep going
          </Text>
        </View>
      )}

      {/* Progress bar — current session */}
      {progress > 0 && !isCompletedToday && (
        <View style={styles.progressWrap}>
          <View style={[styles.progressTrack, darkMode && styles.progressTrackDark]}>
            <View style={[
              styles.progressFill,
              { width: `${Math.min(progress, 100)}%`, backgroundColor: card.color },
            ]} />
          </View>
          <Text style={[
            styles.progressPct,
            { color: isComplete ? card.color : (darkMode ? '#94A3B8' : '#64748B') },
          ]}>
            {isComplete ? '✓' : `${Math.round(progress)}%`}
          </Text>
        </View>
      )}

      {/* Completed Today Message */}
      {isCompletedToday && (
        <View style={styles.completedMessage}>
          <Text style={styles.completedMessageText}>
            {showFrequency ? `✓ ${safeCompletions}/${targetPerDay} completed` : '✓ Completed today'}
          </Text>
        </View>
      )}

      {/* Footer: time */}
      <View style={[styles.footer, darkMode && styles.footerDark]}>
        <Clock color={darkMode ? '#64748B' : '#CBD5E1'} size={11} strokeWidth={2} />
        <Text style={[styles.timeText, darkMode && styles.timeTextDark]} numberOfLines={1}>
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
    position: 'relative',
  },
  cardDark:      { backgroundColor: '#1E293B', shadowOpacity: 0.25 },
  cardCompleted: { borderWidth: 2, borderColor: '#10B981', shadowColor: '#10B981', shadowOpacity: 0.15 },

  completedBadgeOverlay: { position: 'absolute', top: 10, right: 10, zIndex: 10 },
  completedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#10B981', borderRadius: 20, paddingHorizontal: 7, paddingVertical: 4,
    shadowColor: '#10B981', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
  },
  completedBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },

  accentStrip: { height: 3, width: '100%', borderTopLeftRadius: 20, borderTopRightRadius: 20 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: 14, paddingBottom: 10,
  },
  iconContainer: {
    width: 48, height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  iconContainerCompleted: { opacity: 0.7 },
  cardImage: { width: '100%', height: '100%' },

  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  priorityBadge: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center',
  },
  priorityDot:  { width: 7, height: 7, borderRadius: 4 },
  newBadge: {
    borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  newBadgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800', letterSpacing: 0.6 },

  arabicTitle: { fontSize: 12, color: '#94A3B8', paddingHorizontal: 14, marginBottom: 3, lineHeight: 18 },
  arabicTitleDark: { color: '#64748B' },
  textCompleted:   { opacity: 0.7 },
  title: { fontSize: 14, fontWeight: '700', color: '#1E293B', paddingHorizontal: 14, marginBottom: 8, lineHeight: 20 },
  titleDark: { color: '#F8FAFC' },

  // Frequency dots
  freqWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, marginBottom: 6,
  },
  freqDot:   { width: 9, height: 9, borderRadius: 5 },
  freqLabel: { fontSize: 10, fontWeight: '700', marginLeft: 3 },

  // Partial completion banner
  partialBanner: {
    marginHorizontal: 14, marginBottom: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 6,
  },
  partialText: { fontSize: 10, fontWeight: '700' },

  progressWrap: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, marginBottom: 10, gap: 7,
  },
  progressTrack: { flex: 1, height: 5, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  progressTrackDark: { backgroundColor: '#334155' },
  progressFill:  { height: '100%', borderRadius: 3 },
  progressPct:   { fontSize: 10, fontWeight: '700', width: 24, textAlign: 'right' },

  completedMessage: {
    paddingHorizontal: 14, paddingVertical: 6,
    marginHorizontal: 14, marginBottom: 8,
    backgroundColor: '#D1FAE5', borderRadius: 8, alignItems: 'center',
  },
  completedMessageText: { fontSize: 11, fontWeight: '700', color: '#059669', letterSpacing: 0.3 },

  footer: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  footerDark: { borderTopColor: '#273549' },
  timeText:     { fontSize: 10, color: '#CBD5E1', fontWeight: '600', flex: 1 },
  timeTextDark: { color: '#475569' },
});