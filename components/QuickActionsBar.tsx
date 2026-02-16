import React, { useRef } from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Dimensions, Animated } from "react-native";
import { LucideIcon } from "lucide-react-native"; // or the type of your icon component

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon; // type from lucide-react-native
  color: string;
  action: string; // or a union type if you know the values
}

interface QuickActionsBarProps {
  quickActions: QuickAction[];
  handleQuickAction: (action: string) => void;
  darkMode?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function QuickActionsBar({
  quickActions,
  handleQuickAction,
  darkMode = false,
}: QuickActionsBarProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const ITEM_WIDTH = 140 + 12;

  return (
    <View style={{ marginTop: 4 }}>
      <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
        Quick Actions
      </Text>

      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickActionsContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {quickActions.map((action, index) => {
          const ActionIcon = action.icon;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.quickActionCard, darkMode && styles.quickActionCardDark]}
              onPress={() => handleQuickAction(action.action)}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <ActionIcon color="#FFFFFF" size={20} />
              </View>
              <Text style={[styles.quickActionTitle, darkMode && styles.quickActionTitleDark]}>
                {action.title}
              </Text>
              <Text style={[styles.quickActionDescription, darkMode && styles.quickActionDescriptionDark]}>
                {action.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>

      {/* Custom Scrollbar */}
      <View style={styles.scrollBarBackground}>
        <Animated.View
          style={[
            styles.scrollBarThumb,
            {
              width: SCREEN_WIDTH / 3,
              transform: [
                {
                  translateX: scrollX.interpolate({
                    inputRange: [0, quickActions.length * ITEM_WIDTH - SCREEN_WIDTH],
                    outputRange: [0, SCREEN_WIDTH - SCREEN_WIDTH / 3],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 16,
    marginBottom: 10,
  },
  sectionTitleDark: {
    color: "#F8FAFC",
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  quickActionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionCardDark: {
    backgroundColor: "#1E293B",
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  quickActionTitleDark: {
    color: "#F8FAFC",
  },
  quickActionDescription: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
  },
  quickActionDescriptionDark: {
    color: "#CBD5E1",
  },

  // Scrollbar
  scrollBarBackground: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginTop: 6,
    marginHorizontal: 20,
    overflow: "hidden",
  },
  scrollBarThumb: {
    height: 6,
    backgroundColor: "#059669",
    borderRadius: 3,
  },
});
