import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import CategoryHeader, { PracticeCategory } from './CategoryHeader';

// ─── Palette ──────────────────────────────────────────────────────────────────
const GOLD       = '#F59E0B';
const GOLD_LIGHT = '#FDE68A';

// ─── Props ────────────────────────────────────────────────────────────────────
interface FeaturedCardProps {
  gradientColors: readonly [string, string, string];
  sub: string;
  onPress: () => void;
  shadowColor: string;
  featuredCategory: PracticeCategory;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FeaturedCard({
  gradientColors,
  sub,
  onPress,
  shadowColor,
  featuredCategory,
}: FeaturedCardProps) {
  return (
    <TouchableOpacity style={[s.wrap, { shadowColor }]} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.gradient}
      >
        {/* Cercles décoratifs d'ambiance */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <View style={s.c1} />
          <View style={s.c2} />
          <View style={s.c3} />
        </View>

        {/* CategoryHeader sur fond sombre */}
        <View style={s.headerWrap}>
          <CategoryHeader category={featuredCategory} onDark hideBadge />
        </View>

        {/* Séparateur doré fin */}
        <LinearGradient
          colors={['transparent', GOLD + '55', GOLD_LIGHT + '70', GOLD + '55', 'transparent'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.goldSep}
        />

        {/* Footer : description + chevron */}
        <View style={s.footer}>
          <Text style={s.sub}>{sub}</Text>
          <View style={s.chevronCircle}>
            <ChevronRight color="rgba(255,255,255,0.85)" size={13} strokeWidth={2.5} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
    overflow: 'hidden',
  },
  gradient: {
    overflow: 'hidden',
  },

  // Décorations — légèrement plus petites
  c1: { position: 'absolute', top: -40, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.07)' },
  c2: { position: 'absolute', bottom: -20, left: 8,   width: 65,  height: 65,  borderRadius: 33, backgroundColor: 'rgba(255,255,255,0.05)' },
  c3: { position: 'absolute', top: 8,    left: -15, width: 50,  height: 50,  borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.04)' },

  headerWrap: {
    paddingHorizontal: 16,
    paddingTop: 14,   // ↓ réduit (était 18)
    paddingBottom: 4,
  },

  goldSep: {
    height: 1,
    marginHorizontal: 16,
    opacity: 0.8,
    marginBottom: 2,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,  // ↓ réduit (était 14)
    gap: 10,
  },
  sub: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 17,
  },
  chevronCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
});