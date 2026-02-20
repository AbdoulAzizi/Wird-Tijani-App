import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Circle, Flame, Calendar } from 'lucide-react-native';
import { useApp } from '../contexts/AppContext';

interface DailyProgressCardProps {
  onPress: () => void;
  darkMode?: boolean;
}

interface PracticeStatus {
  id: 'wird' | 'wazifa' | 'hadra';
  title: string;
  isCompleted: boolean;
  isActive: boolean;
  color: string;
  lightColor: string;
}

const isFriday = (): boolean => new Date().getDay() === 5;
const getTodayDate = (): string => new Date().toISOString().split('T')[0];
const isCompletedToday = (completedDates: string[]): boolean =>
  completedDates.includes(getTodayDate());

const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
  onPress,
  darkMode = false,
}) => {
  const { state } = useApp();

  const practiceStatuses: PracticeStatus[] = useMemo(() => {
    const friday = isFriday();
    return [
      {
        id: 'wird',
        title: 'Wird',
        isCompleted: isCompletedToday(state.completedWirds),
        isActive: true,
        color: '#DC2626',
        lightColor: '#FEE2E2',
      },
      {
        id: 'wazifa',
        title: 'Wazifa',
        isCompleted: isCompletedToday(state.completedWazifas),
        isActive: true,
        color: '#D97706',
        lightColor: '#FEF3C7',
      },
      {
        id: 'hadra',
        title: 'Hadra',
        isCompleted: isCompletedToday(state.completedHadras),
        isActive: friday,
        color: '#7C3AED',
        lightColor: '#EDE9FE',
      },
    ];
  }, [state.completedWirds, state.completedWazifas, state.completedHadras]);

  const stats = useMemo(() => {
    const activePractices = practiceStatuses.filter(p => p.isActive);
    const completedCount = activePractices.filter(p => p.isCompleted).length;
    const totalCount = activePractices.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const allCompleted = completedCount === totalCount && totalCount > 0;
    return { completedCount, totalCount, percentage, allCompleted };
  }, [practiceStatuses]);

  const streak = state.streak || 0;

  const renderPracticeStatus = (practice: PracticeStatus) => {
    if (!practice.isActive) return null;
    return (
      <View key={practice.id} style={styles.practiceRow}>
        {practice.isCompleted ? (
          <CheckCircle2 color={practice.color} size={18} strokeWidth={2.5} />
        ) : (
          <Circle color={darkMode ? '#475569' : '#CBD5E1'} size={18} strokeWidth={2} />
        )}
        <Text
          style={[
            styles.practiceLabel,
            practice.isCompleted && styles.practiceLabelCompleted,
            practice.isCompleted && { color: practice.color },
            darkMode && !practice.isCompleted && styles.practiceLabelDark,
          ]}
        >
          {practice.title}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.wrapper}>
      <View style={[styles.card, darkMode && styles.cardDark]}>

        {/* Left Section */}
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: stats.allCompleted
                  ? '#D1FAE5'
                  : darkMode
                  ? '#1E3A2F'
                  : '#F0FDF4',
              },
            ]}
          >
            {stats.allCompleted ? (
              <CheckCircle2 color="#059669" size={24} strokeWidth={2.5} />
            ) : (
              <Calendar color="#059669" size={24} strokeWidth={2.5} />
            )}
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusTitle, darkMode && styles.statusTitleDark]}>
              {stats.allCompleted ? 'Completed!' : 'Daily Practices'}
            </Text>
            <Text style={[styles.statusSubtitle, darkMode && styles.statusSubtitleDark]}>
              {stats.allCompleted
                ? 'All practices done'
                : `${stats.completedCount} of ${stats.totalCount} completed`}
            </Text>
            {isFriday() && (
              <Text style={[styles.fridayTag, darkMode && styles.fridayTagDark]}>
                Friday · Hadra day
              </Text>
            )}
          </View>
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          {practiceStatuses.map(renderPracticeStatus)}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          <View style={styles.percentageCircle}>
            <Text style={[styles.percentageText, darkMode && styles.percentageTextDark]}>
              {stats.percentage}
            </Text>
            <Text style={[styles.percentageSymbol, darkMode && styles.percentageSymbolDark]}>
              %
            </Text>
          </View>
          <View style={styles.streakContainer}>
            <View style={styles.streakPill}>
              <Flame color="#D97706" size={12} strokeWidth={2} />
              <Text style={styles.streakNumber}>{streak}</Text>
            </View>
            <Text style={[styles.streakLabel, darkMode && styles.streakLabelDark]}>
              streak
            </Text>
          </View>
        </View>

      </View>

      {/* Friday Banner */}
      {isFriday() && (
        <View style={[styles.fridayBanner, darkMode && styles.fridayBannerDark]}>
          <Text style={styles.fridayEmoji}>🕌</Text>
          <Text style={[styles.fridayGreeting, darkMode && styles.fridayGreetingDark]}>
            Jumu'a Mubarak
          </Text>
          <Text style={[styles.fridayDot, darkMode && styles.fridayDotDark]}>·</Text>
          <Text style={[styles.fridaySubtitle, darkMode && styles.fridaySubtitleDark]}>
            May Allah accept your deeds 🤲
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.1)',
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: 'rgba(5, 150, 105, 0.2)',
  },

  // Left Section
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  statusTitleDark: { color: '#F8FAFC' },
  statusSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  statusSubtitleDark: { color: '#94A3B8' },
  fridayTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7C3AED',
    letterSpacing: 0.3,
    marginTop: 3,
  },
  fridayTagDark: { color: '#A78BFA' },

  // Center Section
  centerSection: {
    gap: 8,
    paddingVertical: 4,
  },
  practiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  practiceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  practiceLabelCompleted: { fontWeight: '700' },
  practiceLabelDark: { color: '#94A3B8' },

  // Right Section
  rightSection: {
    alignItems: 'center',
    gap: 10,
  },
  percentageCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#059669',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#059669',
    lineHeight: 20,
    marginTop: -2,
  },
  percentageTextDark: { color: '#10B981' },
  percentageSymbol: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginTop: -2,
  },
  percentageSymbolDark: { color: '#10B981' },
  streakContainer: {
    alignItems: 'center',
    gap: 2,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  streakNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
  },
  streakLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  streakLabelDark: { color: '#64748B' },

  // Friday Banner
  fridayBanner: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F5F3FF',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.12)',
  },
  fridayBannerDark: {
    backgroundColor: 'rgba(109, 40, 217, 0.15)',
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  fridayEmoji: {
    fontSize: 13,
  },
  fridayGreeting: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5B21B6',
    letterSpacing: 0.3,
  },
  fridayGreetingDark: { color: '#A78BFA' },
  fridayDot: {
    fontSize: 12,
    color: '#A78BFA',
  },
  fridayDotDark: { color: '#6D28D9' },
  fridaySubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#7C3AED',
    opacity: 0.75,
    fontStyle: 'italic',
  },
  fridaySubtitleDark: {
    color: '#C4B5FD',
    opacity: 0.85,
  },
});

export default DailyProgressCard;