import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, CategoryId } from '../../data/library/types';

interface ItemListProps {
  category: Category;
  items: any[];
  onItemPress: (item: any) => void;
  onBack: () => void;
  darkMode?: boolean;
}

const { width } = Dimensions.get('window');

function getSubline(item: any, catId: CategoryId): string {
  if (catId === 'masters') return `${item.title} · ${item.years}`;
  if (catId === 'formulas') return item.badge;
  if (catId === 'books') return item.author;
  if (catId === 'places') return item.location;
  if (catId === 'words') return `— ${item.speaker}`;
  return '';
}

export default function ItemList({ category, items, onItemPress, onBack, darkMode }: ItemListProps) {
  const bg = darkMode ? '#0F172A' : '#F8FAFC';
  const cardBg = darkMode ? '#1E293B' : '#FFFFFF';
  const textPri = darkMode ? '#F1F5F9' : '#1E293B';
  const textSec = darkMode ? '#94A3B8' : '#64748B';
  const border = darkMode ? '#334155' : '#F1F5F9';

  return (
    <View style={[il.root, { backgroundColor: bg }]}>
      {/* ✅ Status Bar */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={category.gradient[0]}
        translucent={false}
      />

      {/* ✅ Sub-header avec SafeAreaView */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: category.gradient[0] }}>
        <LinearGradient
          colors={category.gradient}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={il.subHeader}
        >
          <View style={il.subHeaderDeco} pointerEvents="none">
            <View style={il.shC1} /><View style={il.shC2} />
          </View>

          <View style={il.subHeaderRow}>
            <TouchableOpacity
              style={il.backBtn}
              onPress={onBack}
              activeOpacity={0.8}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <ArrowLeft color="#FFFFFF" size={18} strokeWidth={2.5} />
            </TouchableOpacity>

            <View style={il.subHeaderText}>
              <Text style={il.subHeaderTitle}>{category.title}</Text>
              <Text style={il.subHeaderArabic}>{category.arabicTitle}</Text>
            </View>

            <View style={il.countBadge}>
              <Text style={il.countBadgeTxt}>{items.length}</Text>
            </View>
          </View>

          <Text style={il.subHeaderDesc}>{category.description}</Text>

          {/* Gold line */}
          <View style={il.goldLine}>
            <LinearGradient
              colors={['transparent', '#F59E0B', '#FDE68A', '#F59E0B', 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        </LinearGradient>
      </SafeAreaView>

      {/* Items List */}
      <ScrollView
        contentContainerStyle={il.list}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[il.card, { backgroundColor: cardBg, borderColor: border }]}
            onPress={() => onItemPress(item)}
            activeOpacity={0.78}
          >
            {/* Left accent */}
            <View style={[il.leftAccent, { backgroundColor: category.color }]} />

            <View style={il.cardBody}>
              {/* Index + title */}
              <View style={il.cardTop}>
                <View style={[il.indexBadge, { backgroundColor: category.color + '18' }]}>
                  <Text style={[il.indexTxt, { color: category.color }]}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[il.itemTitle, { color: textPri }]} numberOfLines={2}>
                    {item.title || item.name}
                  </Text>
                  <Text style={[il.itemSub, { color: category.color }]} numberOfLines={1}>
                    {getSubline(item, category.id)}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text style={[il.itemDesc, { color: textSec }]} numberOfLines={2}>
                {item.description}
              </Text>
            </View>

            <ChevronRight color={category.color} size={18} strokeWidth={2.5} style={{ opacity: 0.7 }} />
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const il = StyleSheet.create({
  root: {
    flex: 1,
  },

  subHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8, // ← Petit padding pour espacement
    overflow: 'hidden',
  },
  subHeaderDeco: { ...StyleSheet.absoluteFillObject },
  shC1: {
    position: 'absolute',
    top: -40, right: -30,
    width: 120, height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  shC2: {
    position: 'absolute',
    bottom: -20, left: 20,
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    marginBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeaderText: { flex: 1 },
  subHeaderTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  subHeaderArabic: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 1,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  countBadgeTxt: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subHeaderDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 17,
    marginBottom: 12,
  },
  goldLine: {
    height: 2,
    opacity: 0.6,
  },

  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  leftAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  cardBody: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  indexBadge: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  indexTxt: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  itemSub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  itemDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
});