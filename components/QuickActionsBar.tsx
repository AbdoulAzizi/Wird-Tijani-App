import React, { useRef } from 'react';
import {
  View, ScrollView, TouchableOpacity, Text,
  StyleSheet, Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, LucideIcon } from 'lucide-react-native';

// ─── Palette partagée ─────────────────────────────────────────────────────────
const GREEN_MID  = '#065F46';
const GOLD       = '#F59E0B';
const GOLD_LIGHT = '#FDE68A';

interface QuickAction {
  title: string; description: string;
  icon: LucideIcon; color: string; action: string;
}
interface QuickActionsBarProps {
  quickActions: QuickAction[];
  handleQuickAction: (action: string) => void;
  darkMode?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = 128;
const ITEM_GAP   = 10;

export default function QuickActionsBar({
  quickActions, handleQuickAction, darkMode = false,
}: QuickActionsBarProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const totalScrollWidth = quickActions.length * (ITEM_WIDTH + ITEM_GAP) - SCREEN_WIDTH;
  const thumbWidth = Math.max(32, SCREEN_WIDTH / (quickActions.length * 0.9));

  return (
    <View>
      {/* ── Section header ── */}
      <View style={s.headerRow}>
        <View style={s.labelRow}>
          <View style={s.labelBar} />
          <Text style={[s.sectionTitle, darkMode && s.sectionTitleDark]}>
            Quick Actions
          </Text>
        </View>
        <View style={[s.countPill, darkMode && s.countPillDark]}>
          <Text style={[s.countTxt, darkMode && s.countTxtDark]}>
            {quickActions.length}
          </Text>
        </View>
      </View>

      {/* ── Cards ── */}
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH + ITEM_GAP}
        snapToAlignment="start"
      >
        {quickActions.map((action, index) => {
          const ActionIcon = action.icon;
          return (
            <TouchableOpacity
              key={index}
              style={[s.card, darkMode && s.cardDark]}
              onPress={() => handleQuickAction(action.action)}
              activeOpacity={0.78}
            >
              {/* Top: icon + chevron */}
              <View style={s.cardTop}>
                <View style={[s.iconBubble, { backgroundColor: action.color + '1C' }]}>
                  <ActionIcon color={action.color} size={17} strokeWidth={2.2} />
                </View>
                <ChevronRight color={action.color} size={12} strokeWidth={2.8} style={{ opacity: 0.7 }} />
              </View>

              {/* Text */}
              <Text style={[s.cardTitle, darkMode && s.cardTitleDark]} numberOfLines={2}>
                {action.title}
              </Text>
              <Text style={[s.cardDesc, darkMode && s.cardDescDark]} numberOfLines={2}>
                {action.description}
              </Text>

              {/* Gold bottom accent — même langage que SpiritualHeader */}
              {/* <View style={s.cardGoldLine}>
                <LinearGradient
                  colors={['transparent', action.color + '80', 'transparent']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </View> */}
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>

      {/* ── Scroll indicator ── */}
      <View style={[s.trackWrap, darkMode && s.trackWrapDark]}>
        <Animated.View
          style={[
            s.thumb,
            {
              width: thumbWidth,
              backgroundColor: GREEN_MID,
              transform: [{
                translateX: scrollX.interpolate({
                  inputRange: [0, Math.max(totalScrollWidth, 1)],
                  outputRange: [0, SCREEN_WIDTH - 32 - thumbWidth],
                  extrapolate: 'clamp',
                }),
              }],
            },
          ]}
        />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Header
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, marginBottom: 10,
  },
  labelRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  labelBar:  { width: 3, height: 16, borderRadius: 2, backgroundColor: GREEN_MID },
  sectionTitle:     { fontSize: 17, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  sectionTitleDark: { color: '#F1F5F9' },

  countPill: {
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  countPillDark: { backgroundColor: '#1E293B' },
  countTxt:      { fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  countTxtDark:  { color: '#475569' },

  // Scroll
  scrollContent: {
    paddingHorizontal: 16, paddingVertical: 4, gap: ITEM_GAP,
  },

  // Card
  card: {
    width: ITEM_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16, padding: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    overflow: 'hidden',
  },
  cardDark: { backgroundColor: '#1E293B' },

  cardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 10,
  },

  iconBubble: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },

  cardTitle:     { fontSize: 12, fontWeight: '800', color: '#1E293B', marginBottom: 3, letterSpacing: -0.1 },
  cardTitleDark: { color: '#F1F5F9' },
  cardDesc:      { fontSize: 10, color: '#94A3B8', lineHeight: 14 },
  cardDescDark:  { color: '#64748B' },

  // Accent line at bottom of each card
  cardGoldLine: { height: 2, marginTop: 10, opacity: 0.7 },

  // Track
  trackWrap: {
    height: 3, backgroundColor: '#F1F5F9',
    borderRadius: 2, marginTop: 8, marginHorizontal: 16,
    overflow: 'hidden',
  },
  trackWrapDark: { backgroundColor: '#1E293B' },
  thumb: { height: 3, borderRadius: 2 },
});