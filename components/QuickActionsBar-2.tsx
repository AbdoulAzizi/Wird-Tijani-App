import React, { useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { ChevronRight, LucideIcon } from "lucide-react-native";

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  action: string;
}

interface QuickActionsBarProps {
  quickActions: QuickAction[];
  handleQuickAction: (action: string) => void;
  darkMode?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = 130;
const ITEM_GAP   = 10;

export default function QuickActionsBar({
  quickActions,
  handleQuickAction,
  darkMode = false,
}: QuickActionsBarProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const totalScrollWidth = quickActions.length * (ITEM_WIDTH + ITEM_GAP) - SCREEN_WIDTH;

  return (
    <View>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
          Quick Actions
        </Text>
      </View>

      {/* Cards */}
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
              style={[styles.card, darkMode && styles.cardDark]}
              onPress={() => handleQuickAction(action.action)}
              activeOpacity={0.75}
            >
              {/* Icon bubble */}
              <View style={[styles.iconBubble, { backgroundColor: action.color + '18' }]}>
                <ActionIcon color={action.color} size={19} strokeWidth={2} />
              </View>

              {/* Text */}
              <Text
                style={[styles.cardTitle, darkMode && styles.cardTitleDark]}
                numberOfLines={2}
              >
                {action.title}
              </Text>
              <Text
                style={[styles.cardDesc, darkMode && styles.cardDescDark]}
                numberOfLines={2}
              >
                {action.description}
              </Text>

              {/* Arrow accent */}
              <View style={styles.arrowWrap}>
                <ChevronRight color={action.color} size={13} strokeWidth={2.5} />
              </View>

              {/* Bottom colour bar */}
              <View style={[styles.bottomBar, { backgroundColor: action.color }]} />
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>

      {/* Scroll indicator dots */}
      <View style={styles.dotsRow}>
        {quickActions.map((_, i) => {
          const inputStart = i * (ITEM_WIDTH + ITEM_GAP);
          const dotOpacity = scrollX.interpolate({
            inputRange: [
              inputStart - (ITEM_WIDTH + ITEM_GAP),
              inputStart,
              inputStart + (ITEM_WIDTH + ITEM_GAP),
            ],
            outputRange: [0.25, 1, 0.25],
            extrapolate: 'clamp',
          });
          const dotWidth = scrollX.interpolate({
            inputRange: [
              inputStart - (ITEM_WIDTH + ITEM_GAP),
              inputStart,
              inputStart + (ITEM_WIDTH + ITEM_GAP),
            ],
            outputRange: [6, 18, 6],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                darkMode && styles.dotDark,
                { opacity: dotOpacity, width: dotWidth },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.4,
  },
  sectionTitleDark: { color: "#F8FAFC" },

  // Scroll
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: ITEM_GAP,
  },

  // Card
  card: {
    width: ITEM_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
  },
  cardDark: { backgroundColor: "#1E293B" },

  // Icon
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  // Text
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 3,
    lineHeight: 18,
  },
  cardTitleDark: { color: "#F8FAFC" },
  cardDesc: {
    fontSize: 11,
    color: "#94A3B8",
    lineHeight: 15,
    marginBottom: 8,
  },
  cardDescDark: { color: "#64748B" },

  // Arrow
  arrowWrap: {
    alignSelf: "flex-end",
    marginBottom: 6,
  },

  // Bottom accent bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    opacity: 0.7,
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#059669",
  },
  dotDark: { backgroundColor: "#10B981" },
});