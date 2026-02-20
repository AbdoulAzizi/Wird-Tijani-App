import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface SectionLabelProps {
  children: string;
  style?: ViewStyle;
  /** Accent line color — defaults to #059669 (green) */
  accentColor?: string;
}

/**
 * SectionLabel — reusable section header for the whole app.
 *
 * Visual recipe:
 *  - Semi-transparent frosted pill so it reads on any background
 *  - Bold uppercase spaced-out white text with a subtle text-shadow
 *  - A thin colored left-border accent for visual hierarchy
 *  - Optional `accentColor` prop to match the section's theme color
 */
export default function SectionLabel({
  children,
  style,
  accentColor = '#059669',
}: SectionLabelProps) {
  return (
    <View style={[styles.wrapper, { borderLeftColor: accentColor }, style]}>
      {/* Frosted glass background */}
      <View style={styles.pill}>
        <Text style={styles.text}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderRadius: 2,
    paddingLeft: 10,
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    // Subtle inner glow via border
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 2,
    // Crisp shadow so text pops on any background
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});