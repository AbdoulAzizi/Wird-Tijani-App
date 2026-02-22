import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import type { ProphetName } from '@/data/prophetNames';
import { THEME_COLORS, THEME_LABELS } from '@/data/prophetNames';

interface NameCardProps {
  name: ProphetName;
  onPress: (name: ProphetName) => void;
  dark: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

export default function NameCard({
  name, onPress, dark, isFavorite = false, onToggleFavorite,
}: NameCardProps) {
  const theme = THEME_COLORS[name.theme];
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, damping: 15, stiffness: 300 }).start();
  }, []);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 15, stiffness: 300 }).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[nc.card, dark ? nc.cardDark : nc.cardLight]}
        onPress={() => onPress(name)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Left accent bar */}
        <View style={[nc.accent, { backgroundColor: theme.border }]} />

        {/* Number */}
        <View style={[nc.numberBadge, { backgroundColor: theme.border + '22' }]}>
          <Text style={[nc.numberText, { color: theme.text }]}>{name.id}</Text>
        </View>

        {/* Content */}
        <View style={nc.content}>
          {/* Arabic */}
          <Text style={[nc.arabic, dark ? nc.arabicDark : nc.arabicLight]} numberOfLines={2}>
            {name.arabic}
          </Text>

          {/* Transliteration */}
          <Text style={[nc.transliteration, dark ? nc.transliterationDark : nc.transliterationLight]}>
            {name.transliteration}
          </Text>

          {/* Translation */}
          <Text style={[nc.translation, dark ? nc.translationDark : nc.translationLight]}>
            {name.translation}
          </Text>

          {/* Theme badge */}
          <View style={[nc.badge, { backgroundColor: theme.border + '20', borderColor: theme.border + '50' }]}>
            <Text style={[nc.badgeText, { color: theme.text }]}>{THEME_LABELS[name.theme]}</Text>
          </View>
        </View>

        {/* Favorite + info */}
        <View style={nc.actions}>
          <TouchableOpacity
            onPress={() => onToggleFavorite?.(name.id)}
            style={nc.actionBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[nc.heartIcon, isFavorite && { color: '#F43F5E' }]}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
          {name.description && (
            <BookOpen size={14} color={dark ? '#475569' : '#CBD5E1'} strokeWidth={2} />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const nc = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 5,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },

  accent: {
    width: 4,
    alignSelf: 'stretch',
  },

  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    flexShrink: 0,
  },
  numberText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  content: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 8,
    gap: 4,
  },

  arabic: {
    fontSize: 20,
    textAlign: 'right',
    lineHeight: 32,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  arabicLight: { color: '#0F172A' },
  arabicDark:  { color: '#F8FAFC' },

  transliteration: {
    fontSize: 12,
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  transliterationLight: { color: '#64748B' },
  transliterationDark:  { color: '#64748B' },

  translation: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  translationLight: { color: '#334155' },
  translationDark:  { color: '#94A3B8' },

  badge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  actions: {
    paddingRight: 14,
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 20,
    color: '#CBD5E1',
  },
});