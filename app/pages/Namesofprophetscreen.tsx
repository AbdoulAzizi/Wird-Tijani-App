import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, Animated,
} from 'react-native';
import { Search, X, Sparkles, Heart, LayoutGrid } from 'lucide-react-native';
import ScreenBackground from '../../components/ScreenBackground';
import NameCard from '@/components/NameCard';
import MeditationModal from '@/components/MeditationNabiNamesModal';
import { useApp } from '../../contexts/AppContext';
import { PROPHET_NAMES, THEME_LABELS, THEME_COLORS } from '../../data/prophetNames';
import type { ProphetName, NameTheme } from '../../data/prophetNames';

// ─── Theme filter pill ────────────────────────────────────────────────────────
function ThemePill({
  theme, selected, onPress, dark,
}: { theme: NameTheme | 'all' | 'favorites'; selected: boolean; onPress: () => void; dark: boolean }) {
  const color = theme === 'all' || theme === 'favorites'
    ? { border: '#059669', text: '#6EE7B7', bg: '#052E16' }
    : THEME_COLORS[theme as NameTheme];

  const label = theme === 'all' ? 'All Names'
    : theme === 'favorites' ? '♥ Favorites'
    : THEME_LABELS[theme as NameTheme];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        tp.pill,
        selected
          ? { backgroundColor: color.border, borderColor: color.border }
          : { backgroundColor: dark ? '#0F172A' : '#F8FAFC', borderColor: dark ? '#1E293B' : '#E2E8F0' },
      ]}
    >
      <Text style={[tp.label, { color: selected ? '#FFFFFF' : dark ? '#64748B' : '#94A3B8' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const tp = StyleSheet.create({
  pill:  { borderRadius: 20, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8 },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
});

// ─── Header Stats ─────────────────────────────────────────────────────────────
function HeaderBanner({ count, dark }: { count: number; dark: boolean }) {
  return (
    <View style={[hb.wrap, dark ? hb.wrapDark : hb.wrapLight]}>
      {/* Golden calligraphy-style decorative text */}
      <Text style={hb.basmala}>ﷺ</Text>
      <View style={hb.textBlock}>
        <Text style={[hb.title, dark ? hb.titleDark : hb.titleLight]}>
          أسماء النبي الكريم
        </Text>
        <Text style={[hb.subtitle, dark ? hb.subtitleDark : hb.subtitleLight]}>
          201 Names of the Beloved Prophet
        </Text>
        <Text style={[hb.hadith, dark ? hb.hadithDark : hb.hadithLight]}>
          "Whoever recites blessings upon me once, Allah sends blessings upon him tenfold."
        </Text>
      </View>
      <View style={hb.badge}>
        <Text style={hb.badgeNum}>{count}</Text>
        <Text style={hb.badgeLabel}>showing</Text>
      </View>
    </View>
  );
}

const hb = StyleSheet.create({
  wrap:       { marginHorizontal: 16, marginTop: 12, marginBottom: 4, borderRadius: 22, padding: 20, borderWidth: 1, overflow: 'hidden' },
  wrapLight:  { backgroundColor: '#FFFBF0', borderColor: '#FDE68A' },
  wrapDark:   { backgroundColor: '#1A1200', borderColor: '#92400E' },
  basmala:    { fontSize: 32, textAlign: 'center', color: '#D97706', marginBottom: 8 },
  textBlock:  { gap: 4 },
  title:      { fontSize: 22, textAlign: 'center', fontWeight: '700', letterSpacing: 1 },
  titleLight: { color: '#78350F' },
  titleDark:  { color: '#FCD34D' },
  subtitle:   { fontSize: 13, textAlign: 'center', fontWeight: '600', letterSpacing: 0.3 },
  subtitleLight: { color: '#92400E' },
  subtitleDark:  { color: '#D97706' },
  hadith:     { fontSize: 11, textAlign: 'center', fontStyle: 'italic', marginTop: 8, lineHeight: 17 },
  hadithLight: { color: '#A16207' },
  hadithDark:  { color: '#78350F' },
  badge:      { position: 'absolute', top: 14, right: 14, alignItems: 'center' },
  badgeNum:   { fontSize: 22, fontWeight: '800', color: '#D97706' },
  badgeLabel: { fontSize: 10, fontWeight: '600', color: '#92400E', letterSpacing: 0.5 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const ALL_THEMES: Array<NameTheme | 'all' | 'favorites'> = [
  'all', 'favorites', 'essence', 'mercy', 'light', 'praise',
  'intercession', 'prophecy', 'character', 'quran',
];

export default function NamesOfProphetScreen() {
  const { state } = useApp();
  const dark = state.settings.darkMode;

  const [query,        setQuery]        = useState('');
  const [activeTheme,  setActiveTheme]  = useState<NameTheme | 'all' | 'favorites'>('all');
  const [favorites,    setFavorites]    = useState<Set<number>>(new Set());
  const [meditName,    setMeditName]    = useState<ProphetName | null>(null);
  const [meditVisible, setMeditVisible] = useState(false);
  const [viewMode,     setViewMode]     = useState<'list' | 'grid'>('list');

  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSearch = useCallback(() => {
    const toVal = searchOpen ? 0 : 1;
    setSearchOpen(!searchOpen);
    if (searchOpen) setQuery('');
    Animated.spring(searchBarAnim, { toValue: toVal, damping: 18, stiffness: 200, useNativeDriver: false }).start();
  }, [searchOpen]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = PROPHET_NAMES;

    if (activeTheme === 'favorites') {
      list = list.filter(n => favorites.has(n.id));
    } else if (activeTheme !== 'all') {
      list = list.filter(n => n.theme === activeTheme);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(n =>
        n.arabic.includes(query.trim()) ||
        n.transliteration.toLowerCase().includes(q) ||
        n.translation.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeTheme, query, favorites]);

  // ── Meditation navigation ─────────────────────────────────────────────────
  const meditIndex = useMemo(() =>
    meditName ? filtered.findIndex(n => n.id === meditName.id) : -1,
    [filtered, meditName]
  );

  const openMeditation = useCallback((name: ProphetName) => {
    setMeditName(name);
    setMeditVisible(true);
  }, []);

  const handleMeditNext = useCallback(() => {
    if (meditIndex < filtered.length - 1) setMeditName(filtered[meditIndex + 1]);
  }, [meditIndex, filtered]);

  const handleMeditPrev = useCallback(() => {
    if (meditIndex > 0) setMeditName(filtered[meditIndex - 1]);
  }, [meditIndex, filtered]);

  // ── Search bar animated width ─────────────────────────────────────────────
  const searchWidth = searchBarAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const searchOp    = searchBarAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  // ── Render item ───────────────────────────────────────────────────────────
  const renderItem = useCallback(({ item }: { item: ProphetName }) => (
    <NameCard
      name={item}
      dark={dark}
      onPress={openMeditation}
      isFavorite={favorites.has(item.id)}
      onToggleFavorite={toggleFavorite}
    />
  ), [dark, favorites, openMeditation, toggleFavorite]);

  const keyExtractor = useCallback((item: ProphetName) => String(item.id), []);

  return (
    <View style={[s.root, dark ? s.rootDark : s.rootLight]}>
      <ScreenBackground>

        {/* ── Header Banner ─────────────────────────────────────────────── */}
        <HeaderBanner count={filtered.length} dark={dark} />

        {/* ── Toolbar ───────────────────────────────────────────────────── */}
        <View style={s.toolbar}>
          {/* Search toggle */}
          <TouchableOpacity
            style={[s.toolBtn, dark ? s.toolBtnDark : s.toolBtnLight]}
            onPress={toggleSearch}
            activeOpacity={0.7}
          >
            {searchOpen
              ? <X color="#059669" size={18} strokeWidth={2.5} />
              : <Search color="#059669" size={18} strokeWidth={2.5} />
            }
          </TouchableOpacity>

          {/* Search input */}
          <Animated.View style={[s.searchWrap, { width: searchWidth, opacity: searchOp }]}>
            <TextInput
              style={[s.searchInput, dark ? s.searchInputDark : s.searchInputLight]}
              placeholder="Search names…"
              placeholderTextColor={dark ? '#475569' : '#94A3B8'}
              value={query}
              onChangeText={setQuery}
              autoFocus={searchOpen}
            />
          </Animated.View>

          {!searchOpen && <View style={{ flex: 1 }} />}

          {/* Meditate button */}
          {!searchOpen && (
            <TouchableOpacity
              style={[s.meditBtn]}
              onPress={() => filtered.length > 0 && openMeditation(filtered[0])}
              activeOpacity={0.8}
            >
              <Sparkles color="#FFFFFF" size={14} strokeWidth={2.5} />
              <Text style={s.meditBtnText}>Meditate</Text>
            </TouchableOpacity>
          )}

          {/* Favorites shortcut */}
          {!searchOpen && (
            <TouchableOpacity
              style={[s.toolBtn, dark ? s.toolBtnDark : s.toolBtnLight,
                activeTheme === 'favorites' && s.toolBtnActive]}
              onPress={() => setActiveTheme(t => t === 'favorites' ? 'all' : 'favorites')}
              activeOpacity={0.7}
            >
              <Heart
                color={activeTheme === 'favorites' ? '#FFFFFF' : '#F43F5E'}
                size={17}
                strokeWidth={2.5}
                fill={activeTheme === 'favorites' ? '#FFFFFF' : 'transparent'}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Theme filter pills ─────────────────────────────────────────── */}
        <FlatList
          horizontal
          data={ALL_THEMES}
          keyExtractor={t => t}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.pillsContent}
          style={s.pillsList}
          renderItem={({ item }) => (
            <ThemePill
              theme={item}
              selected={activeTheme === item}
              onPress={() => setActiveTheme(item)}
              dark={dark}
            />
          )}
        />

        {/* ── Names list ────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyEmoji}>🌙</Text>
            <Text style={[s.emptyText, dark ? s.emptyTextDark : s.emptyTextLight]}>
              No names found
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.listContent}
            initialNumToRender={15}
            maxToRenderPerBatch={20}
            windowSize={10}
            removeClippedSubviews
          />
        )}
      </ScreenBackground>

      {/* ── Meditation Modal ───────────────────────────────────────────── */}
      <MeditationModal
        visible={meditVisible}
        name={meditName}
        dark={dark}
        onClose={() => setMeditVisible(false)}
        onNext={handleMeditNext}
        onPrev={handleMeditPrev}
        hasPrev={meditIndex > 0}
        hasNext={meditIndex < filtered.length - 1}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:      { flex: 1 },
  rootLight: { backgroundColor: '#F8FAFC' },
  rootDark:  { backgroundColor: '#0F172A' },

  // Toolbar
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  toolBtn: {
    width: 38, height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    flexShrink: 0,
  },
  toolBtnLight:  { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  toolBtnDark:   { backgroundColor: '#1E293B', borderColor: '#334155' },
  toolBtnActive: { backgroundColor: '#F43F5E', borderColor: '#F43F5E' },

  searchWrap: {
    overflow: 'hidden',
    height: 38,
  },
  searchInput: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '500',
    borderWidth: 1.5,
  },
  searchInputLight: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#0F172A' },
  searchInputDark:  { backgroundColor: '#1E293B', borderColor: '#334155', color: '#F8FAFC' },

  meditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  meditBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // Pills
  pillsList:    { maxHeight: 48, marginBottom: 4 },
  pillsContent: { paddingHorizontal: 16, paddingVertical: 6 },

  // List
  listContent: { paddingTop: 4, paddingBottom: 40 },

  // Empty
  empty:         { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyEmoji:    { fontSize: 40, marginBottom: 12 },
  emptyText:     { fontSize: 15, fontWeight: '600' },
  emptyTextLight: { color: '#94A3B8' },
  emptyTextDark:  { color: '#475569' },
});