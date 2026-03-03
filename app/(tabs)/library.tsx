// app/(tabs)/library.tsx
import React, { useState, useContext } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft }      from 'lucide-react-native';
import { useRouter }      from 'expo-router';

import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import { useApp }               from '../../contexts/AppContext';

import { categories } from '../../data/library/categories';
import { formulas }   from '../../data/library/formulas';
import { masters }    from '../../data/library/masters';
import { books }      from '../../data/library/books';
import { places }     from '../../data/library/places';
import { words }      from '../../data/library/words';
import { annashid }   from '../../data/library/annashid';
import type {
  CategoryId, LibraryItem, Master, Book, HolyPlace, LivingWord, Nashid, Category,
} from '../../data/library/types';

import CategoryGrid  from '../../components/library/CategoryGrid';
import ItemList      from '../../components/library/ItemList';
import FormulaDetail from '../../components/library/FormulaDetail';
import MasterDetail  from '../../components/library/MasterDetail';
import BookDetail    from '../../components/library/BookDetail';
import PlaceDetail   from '../../components/library/PlaceDetail';
import WordDetail    from '../../components/library/WordDetail';
import NashidDetail  from '../../components/library/Nashiddetail';

// ─── Palette ──────────────────────────────────────────────────────────────────
const GREEN_DARK  = '#064E3B';
const GREEN_MID   = '#065F46';
const GREEN_LIGHT = '#047857';
const GOLD        = '#F59E0B';
const GOLD_LIGHT  = '#FDE68A';

const STATUS_H = Platform.OS === 'ios'
  ? 52
  : (StatusBar.currentHeight ?? 24) + 12;

function getItemsForCategory(id: CategoryId): any[] {
  switch (id) {
    case 'formulas': return formulas;
    case 'masters':  return masters;
    case 'books':    return books;
    case 'places':   return places;
    case 'words':    return words;
    case 'annashid': return annashid;
    default:         return [];
  }
}

type Screen = 'home' | 'list';

export default function LibraryScreen() {
  const { state } = useApp();
  const dark      = state.settings?.darkMode ?? false;
  const router    = useRouter();

  const { handleBack: layoutBack } = useContext(LayoutActionsContext);

  const [screen,    setScreen]    = useState<Screen>('home');
  const [activeCat, setActiveCat] = useState<Category | null>(null);

  const [formula, setFormula] = useState<LibraryItem | null>(null);
  const [master,  setMaster]  = useState<Master | null>(null);
  const [book,    setBook]    = useState<Book | null>(null);
  const [place,   setPlace]   = useState<HolyPlace | null>(null);
  const [word,    setWord]    = useState<LivingWord | null>(null);
  const [nashid,  setNashid]  = useState<Nashid | null>(null);

  const bg      = dark ? '#0F172A' : '#F8FAFC';
  const textPri = dark ? '#F1F5F9' : '#1E293B';
  const textSec = dark ? '#94A3B8' : '#64748B';
  const cardBg  = dark ? '#1E293B' : '#FFFFFF';
  const border  = dark ? '#334155' : '#F1F5F9';

  const openCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (cat) { setActiveCat(cat); setScreen('list'); }
  };

  const openItem = (catId: CategoryId, item: any) => {
    switch (catId) {
      case 'formulas': setFormula(item); break;
      case 'masters':  setMaster(item);  break;
      case 'books':    setBook(item);    break;
      case 'places':   setPlace(item);   break;
      case 'words':    setWord(item);    break;
      case 'annashid': setNashid(item);  break;
    }
  };

  const closeAll = () => {
    setFormula(null); setMaster(null); setBook(null);
    setPlace(null);   setWord(null);   setNashid(null);
  };

  const handleBack = () => {
    if (screen === 'list') { setScreen('home'); setActiveCat(null); }
    else layoutBack();
  };

  // ── LIST VIEW ────────────────────────────────────────────────────────────────
  if (screen === 'list' && activeCat) {
    return (
      <>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ItemList
          category={activeCat}
          items={getItemsForCategory(activeCat.id)}
          onItemPress={item => openItem(activeCat.id, item)}
          onBack={handleBack}
          darkMode={dark}
        />
        <FormulaDetail item={formula} visible={!!formula} onClose={closeAll} />
        <MasterDetail  master={master} visible={!!master}  onClose={closeAll} />
        <BookDetail    book={book}     visible={!!book}     onClose={closeAll} />
        <PlaceDetail   place={place}   visible={!!place}    onClose={closeAll} />
        <WordDetail    word={word}     visible={!!word}     onClose={closeAll} />
        <NashidDetail  nashid={nashid} visible={!!nashid}  onClose={closeAll} />
      </>
    );
  }

  // ── HOME VIEW ────────────────────────────────────────────────────────────────
  return (
    <View style={[ls.root, { backgroundColor: bg }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/*
          ── COMPACT HERO ──────────────────────────────────────────────────────
          Tout tient en une seule rangée : back | titre + sous-titre | stats pill.
          Hauteur totale ~90–100 px (contre ~220 px avant).
        */}
        <LinearGradient
          colors={[GREEN_DARK, GREEN_MID]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[ls.hero, { paddingTop: STATUS_H }]}
        >
          {/* Unique cercle décoratif discret */}
          <View style={ls.heroDeco} pointerEvents="none" />

          {/* Rangée unique : back | centre | pill */}
          <View style={ls.navRow}>

            {/* Bouton back */}
            <TouchableOpacity
              style={ls.navBtn}
              onPress={handleBack}
              activeOpacity={0.8}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ArrowLeft color="#FFFFFF" size={18} strokeWidth={2.5} />
            </TouchableOpacity>

            {/* Titre + arabic subtitle */}
            <View style={ls.titleBlock}>
              <Text style={ls.heroTitle}>Spiritual Library</Text>
              <Text style={ls.heroArabic}>المكتبة الروحية</Text>
            </View>

            {/* Stats pill compact */}
            <View style={ls.statsPill}>
              <Text style={ls.pillCount}>
                {categories.reduce((a, c) => a + c.count, 0)}
              </Text>
              <Text style={ls.pillLabel}>items</Text>
            </View>
          </View>

          {/* Gold shimmer — signature visuelle, hauteur réduite */}
          <View style={ls.heroGold}>
            <LinearGradient
              colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        </LinearGradient>

        {/* Section label */}
        <View style={ls.sectionHead}>
          <View style={ls.sectionBar} />
          <Text style={[ls.sectionTitle, { color: textPri }]}>Browse Categories</Text>
        </View>

        {/* Grille des catégories */}
        <CategoryGrid categories={categories} onSelect={openCategory} darkMode={dark} />

        {/* Featured formula */}
        <View style={ls.featSection}>
          <View style={ls.sectionHead}>
            <View style={ls.sectionBar} />
            <Text style={[ls.sectionTitle, { color: textPri }]}>Featured Formula</Text>
          </View>
          <TouchableOpacity
            style={[ls.featCard, { backgroundColor: cardBg, borderColor: border }]}
            onPress={() => setFormula(formulas[1])}
            activeOpacity={0.82}
          >
            <View style={ls.featLeft}>
              <Text style={ls.featEmoji}>📿</Text>
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={ls.featBadge}>Signature Formula</Text>
              <Text style={[ls.featTitle, { color: textPri }]}>Ṣalāt al-Fātiḥ</Text>
              <Text style={[ls.featDesc, { color: textSec }]}>
                The Opening Prayer — recited morning & evening
              </Text>
            </View>
            <Text style={[ls.featArrow, { color: GREEN_MID }]}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Citation coranique */}
        <View style={ls.quoteSection}>
          <View style={[ls.quoteCard, { backgroundColor: cardBg }]}>
            <View style={ls.quoteAccent} />
            <View style={ls.quoteBody}>
              <Text style={[ls.quoteArabic, { color: textPri }]}>
                وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ
              </Text>
              <View style={[ls.quoteDivider, { backgroundColor: border }]} />
              <Text style={[ls.quoteTrans, { color: textSec }]}>
                "And remember Allah much that you may succeed"
              </Text>
              <Text style={ls.quoteRef}>Quran 62:10</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <FormulaDetail item={formula} visible={!!formula} onClose={closeAll} />
      <NashidDetail  nashid={nashid} visible={!!nashid}  onClose={closeAll} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const ls = StyleSheet.create({
  root: { flex: 1 },

  // ── Compact hero ──────────────────────────────────────────────────────────
  hero: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    overflow: 'hidden',
  },

  // Cercle décoratif unique — très discret
  heroDeco: {
    position: 'absolute',
    top: -30, right: -30,
    width: 120, height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  // Rangée principale : tout en une ligne
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 10,
  },

  // Back button — identique au MinimalHeader
  navBtn: {
    width: 36, height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  // Bloc titre (centre)
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 1,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  heroArabic: {
    fontSize: 11,
    color: 'rgba(252,211,77,0.9)',
    letterSpacing: 0.3,
  },

  // Stats pill (droite)
  statsPill: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    minWidth: 44,
    flexShrink: 0,
  },
  pillCount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 17,
  },
  pillLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Gold shimmer — plus fine
  heroGold: { height: 1.5, opacity: 0.7, marginTop: 2 },

  // ── Section head ──────────────────────────────────────────────────────────
  sectionHead:  { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginTop: 24, marginBottom: 0 },
  sectionBar:   { width: 3, height: 16, borderRadius: 2, backgroundColor: GREEN_MID },
  sectionTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.4 },

  // ── Featured card ─────────────────────────────────────────────────────────
  featSection: { paddingHorizontal: 16, marginTop: 8 },
  featCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: 18, borderWidth: 1, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
  },
  featLeft:  { width: 46, height: 46, borderRadius: 14, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center' },
  featEmoji: { fontSize: 22 },
  featBadge: { fontSize: 9, fontWeight: '800', color: '#D97706', textTransform: 'uppercase', letterSpacing: 0.5 },
  featTitle: { fontSize: 15, fontWeight: '800', letterSpacing: -0.2 },
  featDesc:  { fontSize: 12, lineHeight: 17 },
  featArrow: { fontSize: 18, fontWeight: '700' },

  // ── Quote ─────────────────────────────────────────────────────────────────
  quoteSection: { paddingHorizontal: 16, marginTop: 20 },
  quoteCard:    { borderRadius: 18, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 4 },
  quoteAccent:  { height: 3, backgroundColor: GREEN_MID },
  quoteBody:    { padding: 20, alignItems: 'center', gap: 8 },
  quoteArabic:  { fontSize: 16, textAlign: 'center', lineHeight: 28, fontWeight: '600' },
  quoteDivider: { width: 40, height: 1 },
  quoteTrans:   { fontSize: 13, textAlign: 'center', fontStyle: 'italic', lineHeight: 20 },
  quoteRef:     { fontSize: 11, color: GREEN_MID, fontWeight: '700', letterSpacing: 0.3 },
});