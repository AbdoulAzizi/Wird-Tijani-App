import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Category } from '../../data/library/types';

const { width } = Dimensions.get('window');
const CARD = (width - 48) / 2;

interface CategoryGridProps {
  categories: Category[];
  onSelect: (id: string) => void;
  darkMode?: boolean;
}

export default function CategoryGrid({ categories, onSelect, darkMode }: CategoryGridProps) {
  return (
    <View style={cg.grid}>
      {categories.map(cat => (
        <TouchableOpacity
          key={cat.id}
          style={cg.cardWrap}
          onPress={() => onSelect(cat.id)}
          activeOpacity={0.82}
        >
          <LinearGradient
            colors={cat.gradient}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={cg.card}
          >
            {/* Deco circles */}
            <View style={cg.deco} pointerEvents="none">
              <View style={cg.c1} /><View style={cg.c2} />
            </View>

            {/* Emoji */}
            <Text style={cg.emoji}>{cat.emoji}</Text>

            {/* Titles */}
            <Text style={cg.title}>{cat.title}</Text>
            <Text style={cg.arabic}>{cat.arabicTitle}</Text>

            {/* Count pill */}
            <View style={cg.countPill}>
              <Text style={cg.countTxt}>{cat.count}</Text>
            </View>

            {/* Gold bottom line */}
            <View style={cg.goldLine} />
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const cg = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, padding: 16 },
  cardWrap: {
    width: CARD, borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 8,
  },
  card: { padding: 18, minHeight: 160, justifyContent: 'flex-end', overflow: 'hidden' },
  deco: { ...StyleSheet.absoluteFillObject },
  c1: { position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.08)' },
  c2: { position: 'absolute', top: 20, right: 30, width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.05)' },
  emoji:  { fontSize: 32, marginBottom: 8 },
  title:  { fontSize: 15, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3, marginBottom: 3 },
  arabic: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 10 },
  countPill: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  countTxt: { fontSize: 10, fontWeight: '800', color: '#FFFFFF' },
  goldLine: { height: 2, backgroundColor: 'rgba(252,211,77,0.5)', marginTop: 12 },
});