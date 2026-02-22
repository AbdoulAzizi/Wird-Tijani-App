import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Type ─────────────────────────────────────────────────────────────────────
export interface PracticeCategory {
  id:          string;
  label:       string;
  arabicLabel: string;
  emoji:       string;
  color:       string;
  cards:       any[];
}

interface Props {
  category:  PracticeCategory;
  dark?:     boolean;
  /** Sur fond foncé (ex: FeaturedCard gradient) — textes blancs, pas de badge */
  onDark?:   boolean;
  /** Masque le badge compteur (utile dans les FeaturedCards) */
  hideBadge?: boolean;
}

// ─── Diamond ornament ─────────────────────────────────────────────────────────
function Diamond({ color }: { color: string }) {
  return <View style={[orn.d, { borderColor: color }]} />;
}
const orn = StyleSheet.create({
  d: {
    width: 5, height: 5,
    borderWidth: 1.5,
    transform: [{ rotate: '45deg' }],
    flexShrink: 0,
  },
});

// ─── Component ────────────────────────────────────────────────────────────────
export default function CategoryHeader({
  category,
  dark = false,
  onDark = false,
  hideBadge = false,
}: Props) {
  const c = category.color;

  // Sur fond sombre (FeaturedCard), on force les couleurs en blanc
  const labelColor   = onDark ? '#FFFFFF'              : c;
  const arabicColor  = onDark ? 'rgba(255,255,255,0.55)' : (dark ? '#475569' : '#94A3B8');
  const diamondColor = onDark ? 'rgba(255,255,255,0.35)' : c + '70';
  const ruleStart    = onDark ? 'rgba(255,255,255,0.50)' : c + 'B0';
  const ruleEnd      = 'transparent';

  const lineAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(lineAnim, {
      toValue: 1, duration: 550, delay: 80, useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={s.wrap}>

      {/* ── Top rule ── */}
      <View style={s.rule}>
        <Diamond color={diamondColor} />
        <LinearGradient
          colors={[ruleStart, c + '20', ruleEnd] as const}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={s.ruleLine}
        />
      </View>

      {/* ── Body ── */}
      <View style={s.body}>

        {/* Emoji nu */}
        <Text style={s.emoji}>{category.emoji}</Text>

        {/* Texts */}
        <View style={s.textBlock}>
          <Text style={[s.label, { color: labelColor }]}>{category.label}</Text>
          <Text style={[s.arabic, { color: arabicColor }]}>{category.arabicLabel}</Text>
        </View>

        {/* Badge — masqué sur les FeaturedCards */}
        {!hideBadge && !onDark && (
          <View style={[s.badge, { borderColor: c + '55' }]}>
            <Text style={[s.badgeNum, { color: c }]}>{category.cards.length}</Text>
          </View>
        )}
      </View>

      {/* ── Bottom rule ── */}
      <View style={[s.rule, s.ruleReverse]}>
        <LinearGradient
          colors={[ruleEnd, c + '20', onDark ? 'rgba(255,255,255,0.40)' : c + '60'] as const}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={s.ruleLine}
        />
        <Diamond color={diamondColor} />
      </View>

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  wrap: {
    marginBottom: 16,
    gap: 5,
  },

  // Rules
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleReverse: {},
  ruleLine: {
    flex: 1,
    height: 1,
  },

  // Body
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 2,
    paddingVertical: 3,
  },

  // Emoji nu
  emoji: {
    fontSize: 26,
    lineHeight: 32,
    flexShrink: 0,
  },

  // Texts
  textBlock: {
    flex: 1,
    gap: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 19,
  },
  arabic: {
    fontSize: 12,
    fontFamily: 'Amiri_400Regular',
    letterSpacing: 0.2,
    lineHeight: 17,
  },

  // Badge
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    flexShrink: 0,
    minWidth: 32,
    alignItems: 'center',
  },
  badgeNum: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
});