// app/(tabs)/library.tsx
// Ce fichier montre le PATTERN à suivre pour tous les écrans.
// ─────────────────────────────────────────────────────────────────────────────
// RÈGLE GÉNÉRALE :
//   • index.tsx / wird.tsx / wazifa.tsx / hadra.tsx
//       → importer et rendre <SpiritualHeader> en PREMIÈRE ligne du JSX
//         en passant { openDrawer, handleNotifications, unreadCount }
//         via useContext(LayoutActionsContext)
//
//   • Tous les autres écrans SAUF library.tsx
//       → importer et rendre <MinimalHeader> en PREMIÈRE ligne du JSX
//         en passant { handleBack } via useContext(LayoutActionsContext)
//
//   • library.tsx (ce fichier)
//       → header custom intégré dans le ScrollView (hero gradient)
// ─────────────────────────────────────────────────────────────────────────────

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

// Data
import { categories } from '../../data/library/categories';
import { formulas }   from '../../data/library/formulas';
import { masters }    from '../../data/library/masters';
import { books }      from '../../data/library/books';
import { places }     from '../../data/library/places';
import { words }      from '../../data/library/words';
import type {
  CategoryId, LibraryItem, Master, Book, HolyPlace, LivingWord, Category,
} from '../../data/library/types';

// Library components
import CategoryGrid  from '../../components/library/CategoryGrid';
import ItemList      from '../../components/library/ItemList';
import FormulaDetail from '../../components/library/FormulaDetail';
import MasterDetail  from '../../components/library/MasterDetail';
import BookDetail    from '../../components/library/BookDetail';
import PlaceDetail   from '../../components/library/PlaceDetail';
import WordDetail    from '../../components/library/WordDetail';

// ─── Palette ─────────────────────────────────────────────────────────────────
const GREEN_DARK  = '#064E3B';
const GREEN_MID   = '#065F46';
const GREEN_LIGHT = '#047857';
const GOLD        = '#F59E0B';
const GOLD_LIGHT  = '#FDE68A';

// Hauteur de la status bar selon la plateforme
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
    default:         return [];
  }
}

type Screen = 'home' | 'list';

// ─────────────────────────────────────────────────────────────────────────────
export default function LibraryScreen() {
  const { state }     = useApp();
  const dark          = state.settings?.darkMode ?? false;
  const router        = useRouter();

  // Callbacks du layout (drawer, back, notifications)
  const { handleBack: layoutBack } = useContext(LayoutActionsContext);

  const [screen,    setScreen]    = useState<Screen>('home');
  const [activeCat, setActiveCat] = useState<Category | null>(null);

  // Detail modals
  const [formula, setFormula] = useState<LibraryItem | null>(null);
  const [master,  setMaster]  = useState<Master | null>(null);
  const [book,    setBook]    = useState<Book | null>(null);
  const [place,   setPlace]   = useState<HolyPlace | null>(null);
  const [word,    setWord]    = useState<LivingWord | null>(null);

  // Theme tokens
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
    }
  };

  const closeAll = () => {
    setFormula(null); setMaster(null); setBook(null);
    setPlace(null);   setWord(null);
  };

  // Bouton back : retour à home si on est dans une liste, sinon retour layout
  const handleBack = () => {
    if (screen === 'list') {
      setScreen('home');
      setActiveCat(null);
    } else {
      layoutBack();
    }
  };

  // ── LIST VIEW ───────────────────────────────────────────────────────────────
  if (screen === 'list' && activeCat) {
    return (
      <>
        {/* StatusBar en mode light (fond gradient de ItemList) */}
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
      </>
    );
  }

  // ── HOME VIEW ───────────────────────────────────────────────────────────────
  return (
    <View style={[ls.root, { backgroundColor: bg }]}>
      {/* StatusBar transparente — le hero gradient remonte dessous */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/*
          ══════════════════════════════════════════════════════════════
          HERO BANNER — remplace le MinimalHeader pour cet écran.
          paddingTop = STATUS_H pour passer sous la status bar native.
          ══════════════════════════════════════════════════════════════
        */}
        <LinearGradient
          colors={[GREEN_DARK, GREEN_MID, GREEN_LIGHT]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[ls.hero, { paddingTop: STATUS_H }]}
        >
          {/* Deco circles */}
          <View style={ls.heroDeco} pointerEvents="none">
            <View style={ls.hc1} />
            <View style={ls.hc2} />
            <View style={ls.hc3} />
          </View>

          {/* Nav row — même dimensions/style que MinimalHeader */}
          <View style={ls.navRow}>
            {/* Bouton back */}
            <TouchableOpacity
              style={ls.navBtn}
              onPress={handleBack}
              activeOpacity={0.8}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ArrowLeft color="#FFFFFF" size={20} strokeWidth={2.5} />
            </TouchableOpacity>

            {/* Spacer droit pour équilibrer visuellement */}
            <View style={ls.navBtnSpacer} />
          </View>

          {/* Titres */}
          <View style={ls.heroTitles}>
            <Text style={ls.heroArabic}>المكتبة الروحية</Text>
            <Text style={ls.heroTitle}>Spiritual Library</Text>
            <Text style={ls.heroSub}>Sacred knowledge of the Tijāni path</Text>
          </View>

          {/* Stats */}
          <View style={ls.heroStats}>
            {[
              { n: categories.reduce((a, c) => a + c.count, 0), label: 'Resources'  },
              { n: categories.length,                           label: 'Categories' },
              { n: masters.length,                              label: 'Masters'    },
            ].map(stat => (
              <View key={stat.label} style={ls.heroStat}>
                <Text style={ls.heroStatN}>{stat.n}</Text>
                <Text style={ls.heroStatL}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Gold shimmer line — signature du design system */}
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
              <Text style={[ls.featDesc,  { color: textSec }]}>
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

      {/* Detail modal accessible depuis le featured card */}
      <FormulaDetail item={formula} visible={!!formula} onClose={closeAll} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const ls = StyleSheet.create({
  root: { flex: 1 },

  // ── Hero ──
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    overflow: 'hidden',
  },
  heroDeco: { ...StyleSheet.absoluteFillObject },
  hc1: { position: 'absolute', top: -50,  right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.06)' },
  hc2: { position: 'absolute', top: 30,   right: 60,  width: 60,  height: 60,  borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.04)' },
  hc3: { position: 'absolute', bottom: -30, left: -20, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.03)' },

  // Nav row — miroir du MinimalHeader (back | spacer)
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  navBtn: {
    width: 38, height: 38, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },
  // Spacer invisible — même taille que navBtn pour centrer les titres
  navBtnSpacer: { width: 38, height: 38 },

  // Titres
  heroTitles: { alignItems: 'center', marginBottom: 20 },
  heroArabic: { fontSize: 13, color: 'rgba(252,211,77,0.85)', marginBottom: 5 },
  heroTitle:  { fontSize: 26, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.6, marginBottom: 5 },
  heroSub:    { fontSize: 12, color: 'rgba(255,255,255,0.72)', textAlign: 'center' },

  // Stats
  heroStats: { flexDirection: 'row', justifyContent: 'center', gap: 32, marginBottom: 20 },
  heroStat:  { alignItems: 'center', gap: 2 },
  heroStatN: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  heroStatL: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: 0.6 },

  // Gold line
  heroGold: { height: 2, opacity: 0.6 },

  // Section head
  sectionHead:  { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginTop: 24, marginBottom: 0 },
  sectionBar:   { width: 3, height: 16, borderRadius: 2, backgroundColor: GREEN_MID },
  sectionTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.4 },

  // Featured card
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

  // Quote
  quoteSection: { paddingHorizontal: 16, marginTop: 20 },
  quoteCard:    { borderRadius: 18, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 4 },
  quoteAccent:  { height: 3, backgroundColor: GREEN_MID },
  quoteBody:    { padding: 20, alignItems: 'center', gap: 8 },
  quoteArabic:  { fontSize: 16, textAlign: 'center', lineHeight: 28, fontWeight: '600' },
  quoteDivider: { width: 40, height: 1 },
  quoteTrans:   { fontSize: 13, textAlign: 'center', fontStyle: 'italic', lineHeight: 20 },
  quoteRef:     { fontSize: 11, color: GREEN_MID, fontWeight: '700', letterSpacing: 0.3 },
});