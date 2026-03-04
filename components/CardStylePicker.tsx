// ─── CardStylePicker ──────────────────────────────────────────────────────────
// Compact inline picker rendered inside the More menu.
// Shows a swatch + label + description for each registered theme.
// Selected theme gets a checkmark and an accent border.

import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform,
} from 'react-native';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { DHIKR_CARD_THEMES, DEFAULT_THEME_KEY } from '../constants/dhikrCardThemes';
import { useApp } from '../contexts/AppContext';

interface CardStylePickerProps {
  /** Called after the theme is persisted — lets the parent close a modal etc. */
  onSelect?: (themeKey: string) => void;
}

export default function CardStylePicker({ onSelect }: CardStylePickerProps) {
  const { state, dispatch } = useApp();
  const dark         = state.settings.darkMode;
  const currentKey   = state.settings.dhikrCardTheme ?? DEFAULT_THEME_KEY;

  const handleSelect = useCallback((key: string) => {
    if (key === currentKey) return;
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch({ type: 'SET_DHIKR_CARD_THEME', themeKey: key });
    onSelect?.(key);
  }, [currentKey, dispatch, onSelect]);

  const bg          = dark ? '#0C1510' : '#F9F7F2';
  const borderColor = dark ? '#1C2E22' : '#DDD8CC';
  const textColor   = dark ? '#DFF0E8' : '#1A2520';
  const subColor    = dark ? '#3D6050' : '#8FA499';
  const activeBg    = dark ? '#101A14' : '#F3F0E8';
  const activeBorder= dark ? '#2A9468' : '#1B6B4A';
  const checkColor  = dark ? '#3DD68C' : '#1B6B4A';

  return (
    <View style={[p.container, { backgroundColor: bg, borderColor }]}>
      <Text style={[p.heading, { color: subColor }]}>CARD STYLE</Text>

      {DHIKR_CARD_THEMES.map((theme, i) => {
        const isSelected = theme.key === currentKey;
        const isLast     = i === DHIKR_CARD_THEMES.length - 1;

        return (
          <TouchableOpacity
            key={theme.key}
            onPress={() => handleSelect(theme.key)}
            activeOpacity={0.75}
            style={[
              p.row,
              isSelected && { backgroundColor: activeBg },
              isSelected && { borderColor: activeBorder, borderWidth: 1 },
              !isLast    && { marginBottom: 6 },
            ]}
          >
            {/* Colour swatch */}
            <View style={[p.swatch, { backgroundColor: theme.previewColor }]} />

            {/* Labels */}
            <View style={p.labels}>
              <Text style={[p.label, { color: textColor }, isSelected && { fontWeight: '700' }]}>
                {theme.label}
              </Text>
              <Text style={[p.sub, { color: subColor }]} numberOfLines={1}>
                {theme.description}
              </Text>
            </View>

            {/* Checkmark */}
            {isSelected && (
              <Check size={15} color={checkColor} strokeWidth={2.5} style={p.check} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const p = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },
  heading: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  swatch: {
    width: 22,
    height: 22,
    borderRadius: 11,
    flexShrink: 0,
  },
  labels: {
    flex: 1,
    gap: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  sub: {
    fontSize: 11,
    fontWeight: '400',
  },
  check: {
    flexShrink: 0,
  },
});