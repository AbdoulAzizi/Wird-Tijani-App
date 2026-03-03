import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ArrowLeft, Music } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, CategoryId } from '../../data/library/types';

interface ItemListProps {
  category:    Category;
  items:       any[];
  onItemPress: (item: any) => void;
  onBack:      () => void;
  darkMode?:   boolean;
}

function getTitle(item: any): string {
  return item.title ?? item.name ?? '';
}

function getSubline(item: any, catId: CategoryId): string {
  switch (catId) {
    case 'masters':  return item.title + ' · ' + item.years;
    case 'formulas': return item.badge ?? '';
    case 'books':    return item.author ?? '';
    case 'places':   return item.location ?? '';
    case 'words':    return '— ' + item.speaker;
    case 'annashid': {
      const prefix = item.composerTitle ? item.composerTitle + ' ' : '';
      return prefix + item.composer + ' · ' + item.era;
    }
    default: return '';
  }
}

function getArabicPreview(item: any, catId: CategoryId): string | null {
  if ((catId === 'formulas' || catId === 'annashid') && item.arabicText) {
    return (item.arabicText as string).split('\n')[0];
  }
  return null;
}

export default function ItemList({ category, items, onItemPress, onBack, darkMode }: ItemListProps) {
  const bg      = darkMode ? "#0F172A" : "#F8FAFC";
  const cardBg  = darkMode ? "#1E293B" : "#FFFFFF";
  const textPri = darkMode ? "#F1F5F9" : "#1E293B";
  const textSec = darkMode ? "#94A3B8" : "#64748B";
  const border  = darkMode ? "#334155" : "#F1F5F9";
  const isAnnashid = category.id === "annashid";

  return (
    <View style={[s.root, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={category.gradient[0]} translucent={false} />

      <SafeAreaView edges={["top"]} style={{ backgroundColor: category.gradient[0] }}>
        <LinearGradient colors={category.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.header}>
          <View style={s.headerDeco} pointerEvents="none">
            <View style={s.hc1} /><View style={s.hc2} />
          </View>
          <View style={s.headerRow}>
            <TouchableOpacity
              style={s.backBtn} onPress={onBack} activeOpacity={0.8}
              accessibilityLabel="Go back" accessibilityRole="button"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ArrowLeft color="#FFFFFF" size={18} strokeWidth={2.5} />
            </TouchableOpacity>
            <View style={s.headerText}>
              <Text style={s.headerTitle} numberOfLines={1}>{category.title}</Text>
              <Text style={s.headerArabic} numberOfLines={1}>{category.arabicTitle}</Text>
            </View>
            <View style={s.countBadge}>
              <Text style={s.countN}>{items.length}</Text>
              <Text style={s.countLabel}>items</Text>
            </View>
          </View>
          <Text style={s.headerDesc}>{category.description}</Text>
          <View style={s.goldLine}>
            <LinearGradient
              colors={['transparent', '#F59E0B', '#FDE68A', '#F59E0B', 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        </LinearGradient>
      </SafeAreaView>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false} bounces>
        {items.map((item, index) => {
          const arabicPreview = getArabicPreview(item, category.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[s.card, { backgroundColor: cardBg, borderColor: border }]}
              onPress={() => onItemPress(item)}
              activeOpacity={0.78}
            >
              <View style={[s.leftAccent, { backgroundColor: category.color }]} />
              <View style={s.cardBody}>
                <View style={s.cardTop}>
                  <View style={[s.indexBadge, { backgroundColor: category.color + "1A" }]}>
                    {isAnnashid
                      ? <Music size={15} color={category.color} strokeWidth={2.5} />
                      : <Text style={[s.indexTxt, { color: category.color }]}>{String(index + 1).padStart(2, "0")}</Text>
                    }
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.itemTitle, { color: textPri }]} numberOfLines={2}>{getTitle(item)}</Text>
                    <Text style={[s.itemSub, { color: category.color }]} numberOfLines={1}>{getSubline(item, category.id)}</Text>
                  </View>
                </View>
                <Text style={[s.itemDesc, { color: textSec }]} numberOfLines={2}>{item.description}</Text>
                {arabicPreview != null && (
                  <View style={[s.arabicPill, { backgroundColor: category.color + "0E", borderColor: category.color + "28" }]}>
                    <Text style={[s.arabicPillTxt, { color: category.color }]} numberOfLines={1}>{arabicPreview}</Text>
                  </View>
                )}
              </View>
              <ChevronRight color={category.color} size={16} strokeWidth={2.5} style={s.chevron} />
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  header:     { paddingHorizontal: 16, paddingBottom: 14, paddingTop: 8, overflow: 'hidden' },
  headerDeco: { ...StyleSheet.absoluteFillObject },
  hc1: { position: 'absolute', top: -40, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.06)' },
  hc2: { position: 'absolute', bottom: -20, left: 20, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.04)' },

  headerRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 8, marginBottom: 8 },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  headerText:   { flex: 1 },
  headerTitle:  { fontSize: 19, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.4 },
  headerArabic: { fontSize: 12, color: 'rgba(255,255,255,0.70)', marginTop: 1 },

  countBadge: {
    alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', flexShrink: 0,
  },
  countN:     { fontSize: 13, fontWeight: '800', color: '#FFFFFF', lineHeight: 16 },
  countLabel: { fontSize: 8, fontWeight: '700', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: 0.5 },

  headerDesc: { fontSize: 12, color: 'rgba(255,255,255,0.72)', lineHeight: 17, marginBottom: 12 },
  goldLine:   { height: 1.5, opacity: 0.65 },

  list: { padding: 16, gap: 10 },

  card: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, borderWidth: 1, overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  leftAccent: { width: 4, alignSelf: 'stretch' },
  cardBody:   { flex: 1, padding: 14, gap: 7 },
  cardTop:    { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },

  indexBadge: { width: 34, height: 34, borderRadius: 9, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  indexTxt:   { fontSize: 12, fontWeight: '900', letterSpacing: -0.3 },
  itemTitle:  { fontSize: 14, fontWeight: '800', lineHeight: 20, letterSpacing: -0.2 },
  itemSub:    { fontSize: 11, fontWeight: '600', marginTop: 2 },
  itemDesc:   { fontSize: 12, lineHeight: 18 },

  arabicPill:    { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, marginTop: 2 },
  arabicPillTxt: { fontSize: 13, fontWeight: '500', writingDirection: 'rtl' },

  chevron: { opacity: 0.55, marginRight: 14 },
});