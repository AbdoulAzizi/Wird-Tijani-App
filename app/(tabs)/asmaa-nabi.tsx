import React, {
  useState, useCallback, useRef, useEffect, useContext, useMemo, memo,
} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList,
  Animated, Dimensions, Platform, TextInput, Modal,
  Pressable, PanResponder, Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  Search, Heart, Bookmark, Share2, ChevronLeft, ChevronRight,
  X, Filter, Sparkles, BookOpen, Eye, ArrowUpDown, Shuffle, ArrowDown, ArrowUp,
} from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';
import MinimalHeader from '../../components/MinimalHeader';
import MeditationModal from '../../components/MeditationModal';
import {
  asmaaAnNabi,
  NabiName,
  NabiNameCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  CATEGORY_GRADIENTS,
  SALAWAT_OPENING,
} from '../../data/asmaaAnNabi';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

// ─── Reading Order ─────────────────────────────────────────────────────────────

export type ReadingOrder =
  | 'sequential'   // 1 → 201, default
  | 'reverse'      // 201 → 1
  | 'random'       // shuffled
  | 'by_category'; // grouped by category

const ORDER_OPTIONS: Array<{
  key: ReadingOrder;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    key: 'sequential',
    label: 'Sequential',
    sublabel: 'Name 1 to 201, in order',
    icon: <ArrowDown color="#059669" size={18} strokeWidth={2} />,
    color: '#059669',
  },
  {
    key: 'reverse',
    label: 'Reverse Order',
    sublabel: 'Name 201 down to 1',
    icon: <ArrowUp color="#1E40AF" size={18} strokeWidth={2} />,
    color: '#1E40AF',
  },
  {
    key: 'random',
    label: 'Random / Shuffle',
    sublabel: 'A new order every session',
    icon: <Shuffle color="#7C3AED" size={18} strokeWidth={2} />,
    color: '#7C3AED',
  },
  {
    key: 'by_category',
    label: 'By Category',
    sublabel: 'Grouped by theme',
    icon: <ArrowUpDown color="#D97706" size={18} strokeWidth={2} />,
    color: '#D97706',
  },
];

function applyOrder(names: NabiName[], order: ReadingOrder): NabiName[] {
  switch (order) {
    case 'reverse':     return [...names].reverse();
    case 'random':      return [...names].sort(() => Math.random() - 0.5);
    case 'by_category': {
      const cats: NabiNameCategory[] = ['quran', 'essence', 'honor', 'mercy', 'guidance', 'mission', 'character', 'intercession'];
      return cats.flatMap(cat => names.filter(n => n.category === cat));
    }
    default:            return [...names];
  }
}

// ─── Order Modal ───────────────────────────────────────────────────────────────

const OrderModal = memo(({
  visible, onClose, activeOrder, onSelectOrder,
}: {
  visible: boolean;
  onClose: () => void;
  activeOrder: ReadingOrder;
  onSelectOrder: (o: ReadingOrder) => void;
}) => {
  const slide = useRef(new Animated.Value(300)).current;
  const fade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slide, { toValue: visible ? 0 : 300, useNativeDriver: true, damping: 20, stiffness: 180 }),
      Animated.timing(fade,  { toValue: visible ? 1 : 0, duration: visible ? 200 : 150, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <Animated.View style={[om.overlay, { opacity: fade }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[om.sheet, { transform: [{ translateY: slide }] }]}>
        {/* Accent bar */}
        <LinearGradient
          colors={['#7C3AED', '#1E40AF', '#059669']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={om.accent}
        />
        <View style={om.handle} />

        <View style={om.header}>
          <View style={om.headerLeft}>
            <ArrowUpDown color="#7C3AED" size={18} strokeWidth={2} />
            <Text style={om.title}>Reading Order</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={om.closeBtn}>
            <X color="#64748B" size={18} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <Text style={om.subtitle}>
          Choose how the 201 names are presented during your meditation session.
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={om.scroll}
        >
          {ORDER_OPTIONS.map(opt => {
            const isActive = activeOrder === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[om.item, isActive && { borderColor: opt.color, backgroundColor: opt.color + '0D' }]}
                onPress={() => { haptic('medium'); onSelectOrder(opt.key); onClose(); }}
                activeOpacity={0.8}
              >
                <View style={[om.iconWrap, { backgroundColor: opt.color + '18' }]}>
                  {opt.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[om.itemLabel, isActive && { color: opt.color, fontWeight: '800' }]}>
                    {opt.label}
                  </Text>
                  <Text style={om.itemSub}>{opt.sublabel}</Text>
                </View>
                {isActive && (
                  <View style={[om.activeDot, { backgroundColor: opt.color }]} />
                )}
              </TouchableOpacity>
            );
          })}

          {/* Info note */}
          <View style={om.note}>
            <Text style={om.noteText}>
              ✦ Changing the order resets your current position to the first name in the new sequence.
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
});

const om = StyleSheet.create({
  overlay:    { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: Platform.OS === 'ios' ? 36 : 24, maxHeight: height * 0.72, overflow: 'hidden' },
  accent:     { height: 3 },
  handle:     { width: 36, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title:      { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  closeBtn:   { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  subtitle:   { fontSize: 12, color: '#94A3B8', paddingHorizontal: 20, marginBottom: 4, lineHeight: 18 },
  scroll:     { padding: 16, gap: 10 },
  item:       { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16, borderWidth: 1.5, borderColor: '#F1F5F9', backgroundColor: '#FAFAFA' },
  iconWrap:   { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  itemLabel:  { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  itemSub:    { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  activeDot:  { width: 10, height: 10, borderRadius: 5 },
  note:       { backgroundColor: '#FEF9EC', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#FDE68A', marginTop: 4 },
  noteText:   { fontSize: 12, color: '#92400E', lineHeight: 18, fontStyle: 'italic' },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const haptic = (t: 'light' | 'medium' | 'success' = 'light') => {
  if (Platform.OS !== 'ios') return;
  if (t === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (t === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

// ─── Opening Banner ───────────────────────────────────────────────────────────

const OpeningBanner = memo(({ onClose }: { onClose: () => void }) => {
  const fade  = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 9, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[ob.overlay, { opacity: fade }]}>
      <Animated.View style={[ob.card, { transform: [{ scale }] }]}>
        <LinearGradient colors={['#064E3B', '#065F46', '#047857']} style={ob.gradient}>
          <View style={ob.circle1} />
          <View style={ob.circle2} />
          <View style={ob.circle3} />

          <Text style={ob.bismillah}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</Text>

          <LinearGradient
            colors={['transparent', '#F59E0B', '#FDE68A', '#F59E0B', 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={ob.goldLine}
          />

          <Text style={ob.title}>أَسْمَاء النَّبِيّ الشَّرِيف</Text>
          <Text style={ob.subtitle}>201 Names of the Beloved Prophet</Text>
          <Text style={ob.salawat}>صَلَّى اللّٰهُ عَلَيْهِ وَعَلَى آلِهِ وَسَلَّم</Text>

          <Text style={ob.opening}>{SALAWAT_OPENING}</Text>

          <Text style={ob.instruction}>
            Each name is a door to his light ﷺ.{'\n'}
            Recite, reflect, and let your heart draw near.
          </Text>

          <TouchableOpacity style={ob.btn} onPress={onClose} activeOpacity={0.85}>
            <Text style={ob.btnText}>Begin Meditation  ✦</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
});

const ob = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 999, justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  card:     { width: '100%', borderRadius: 28, overflow: 'hidden' },
  gradient: { padding: 32, alignItems: 'center', gap: 14, overflow: 'hidden' },
  circle1:  { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.04)', top: -60, right: -50 },
  circle2:  { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -30, left: -20 },
  circle3:  { position: 'absolute', width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.05)', top: 30, left: 20 },
  bismillah:{ fontSize: 18, color: 'rgba(253,230,138,0.9)', textAlign: 'center', fontWeight: '600' },
  goldLine: { height: 2, width: '100%', opacity: 0.7 },
  title:    { fontSize: 28, color: '#FFFFFF', textAlign: 'center', fontWeight: '900', lineHeight: 42 },
  subtitle: { fontSize: 14, color: 'rgba(209,250,229,0.9)', textAlign: 'center', fontWeight: '600', letterSpacing: 0.5 },
  salawat:  { fontSize: 16, color: 'rgba(253,230,138,0.85)', textAlign: 'center', fontWeight: '600', lineHeight: 28 },
  opening:  { fontSize: 15, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 28 },
  instruction: { fontSize: 13, color: 'rgba(209,250,229,0.7)', textAlign: 'center', lineHeight: 20, fontStyle: 'italic', marginTop: 4 },
  btn:      { backgroundColor: 'rgba(245,158,11,0.9)', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 18, marginTop: 8 },
  btnText:  { fontSize: 15, fontWeight: '800', color: '#1C1000', letterSpacing: 0.3 },
});

// ─── Category Pill ────────────────────────────────────────────────────────────

const CategoryPill = memo(({
  cat, selected, onPress,
}: { cat: NabiNameCategory | 'all'; selected: boolean; onPress: () => void }) => {
  const color  = cat === 'all' ? '#F59E0B' : CATEGORY_COLORS[cat as NabiNameCategory];
  const label  = cat === 'all' ? 'All Names' : CATEGORY_LABELS[cat as NabiNameCategory];
  const count  = cat === 'all' ? asmaaAnNabi.length : asmaaAnNabi.filter(n => n.category === cat).length;

  return (
    <TouchableOpacity
      style={[cp.pill, selected && { backgroundColor: color, borderColor: color }]}
      onPress={onPress} activeOpacity={0.8}
    >
      <Text style={[cp.label, selected && cp.labelActive]}>{label}</Text>
      <View style={[cp.badge, { backgroundColor: selected ? 'rgba(255,255,255,0.3)' : color + '20' }]}>
        <Text style={[cp.badgeText, { color: selected ? '#FFFFFF' : color }]}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
});

const cp = StyleSheet.create({
  pill:       { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', marginRight: 8 },
  label:      { fontSize: 12, fontWeight: '700', color: '#64748B' },
  labelActive:{ color: '#FFFFFF' },
  badge:      { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 10 },
  badgeText:  { fontSize: 10, fontWeight: '800' },
});

// ─── Name Card (Detail View) ──────────────────────────────────────────────────

const NameDetailCard = memo(({
  name, isFavorite, isBookmarked,
  onFavorite, onBookmark, onShare,
  panHandlers, fadeAnim, scaleAnim,
}: {
  name: NabiName;
  isFavorite: boolean;
  isBookmarked: boolean;
  onFavorite: () => void;
  onBookmark: () => void;
  onShare: () => void;
  panHandlers: any;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
}) => {
  const color = CATEGORY_COLORS[name.category];
  const [g1, g2] = CATEGORY_GRADIENTS[name.category];

  return (
    <View style={{ width, paddingHorizontal: 16 }} {...panHandlers}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>

        {/* Hero card */}
        <View style={dc.heroShadow}>
          <LinearGradient colors={[g1, g2, color]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={dc.hero}>
            <View style={dc.deco1} /><View style={dc.deco2} /><View style={dc.deco3} />

            {/* Top row */}
            <View style={dc.topRow}>
              <View style={dc.numBadge}>
                <Text style={dc.numSub}>Ism</Text>
                <Text style={dc.numMain}>{String(name.id).padStart(3, '0')}</Text>
              </View>
              <View style={dc.actions}>
                <TouchableOpacity style={[dc.actionBtn, isBookmarked && dc.actionBookmark]} onPress={onBookmark} activeOpacity={0.75}>
                  <Bookmark color={isBookmarked ? '#F59E0B' : '#FFFFFF'} size={16} fill={isBookmarked ? '#F59E0B' : 'transparent'} strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity style={[dc.actionBtn, isFavorite && dc.actionFav]} onPress={onFavorite} activeOpacity={0.75}>
                  <Heart color={isFavorite ? '#F87171' : '#FFFFFF'} size={16} fill={isFavorite ? '#F87171' : 'transparent'} strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity style={dc.actionBtn} onPress={onShare} activeOpacity={0.75}>
                  <Share2 color="#FFFFFF" size={16} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Gold divider */}
            <LinearGradient colors={['transparent', '#F59E0B', '#FDE68A', '#F59E0B', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={dc.goldLine} />

            {/* Main Arabic name */}
            <Text style={dc.arabic}>{name.arabic}</Text>
            <Text style={dc.translit}>{name.transliteration}</Text>

            {/* Category badge */}
            <View style={dc.catBadge}>
              <Text style={dc.catText}>{CATEGORY_LABELS[name.category]}</Text>
            </View>

            {/* English meaning */}
            <Text style={dc.meaning}>{name.english}</Text>

            {/* Source */}
            {name.source && (
              <View style={dc.sourcePill}>
                <BookOpen color="rgba(253,230,138,0.8)" size={11} strokeWidth={2} />
                <Text style={dc.sourceText}>{name.source}</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Salawat card */}
        <View style={dc.salawatCard}>
          <View style={[dc.salawatAccent, { backgroundColor: color }]} />
          <View style={dc.salawatInner}>
            <View style={[dc.salawatIconWrap, { backgroundColor: color + '15' }]}>
              <Sparkles color={color} size={16} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={dc.salawatLabel}>Say with each name:</Text>
              <Text style={dc.salawatArabic}>اللهم صل وسلم على سيدنا محمد</Text>
              <Text style={dc.salawatTrans}>"O Allah, bestow blessings and peace upon our Master Muḥammad"</Text>
            </View>
          </View>
        </View>

        {/* Reflection card */}
        <View style={dc.reflectCard}>
          <View style={[dc.reflectLine, { backgroundColor: color }]} />
          <Text style={dc.reflectTitle}>✦  Reflection</Text>
          <Text style={dc.reflectText}>{getReflection(name.category, name.english)}</Text>
        </View>

      </Animated.View>
    </View>
  );
});

function getReflection(cat: NabiNameCategory, name: string): string {
  const map: Record<NabiNameCategory, string> = {
    essence:      `Contemplate this name with stillness. The Prophet ﷺ is the most complete manifestation of divine beauty. Let this name draw your heart into the ocean of his reality.`,
    mercy:        `Feel the warmth of his mercy ﷺ surrounding you right now. He carried the weight of every soul's pain and prayed for his nation with every breath. You are part of that love.`,
    guidance:     `In your moments of confusion, remember: his light ﷺ is your guide. The path he showed is the straight path — every step you take following him is illuminated.`,
    honor:        `Reflect on the honor Allah has bestowed upon him ﷺ and know that by loving him, you are elevated. Association with the noble ennobles the soul.`,
    intercession: `On the Day when all will be in need, he ﷺ will intercede. Strengthen your bond with him now through salawat, so your name is on his lips in the greatest moment.`,
    character:    `Study his character ﷺ and you study the Quran walking on earth. Each virtue he embodied is an invitation for you to embody it too, through love and remembrance.`,
    mission:      `He ﷺ came to complete, not to fragment. His message brought light to every corner of existence. In following him, you participate in the ongoing completion of his noble mission.`,
    quran:        `This sacred name appears in Allah's own words — the eternal speech. When you read the Quran, you hear Allah speaking of His Beloved ﷺ. Pause. Breathe. Feel the honor.`,
  };
  return map[cat];
}

const dc = StyleSheet.create({
  heroShadow: { borderRadius: 24, overflow: 'hidden', marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 12 },
  hero:       { padding: 22, gap: 10 },
  deco1:      { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.05)', top: -50, right: -40 },
  deco2:      { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.04)', top: 40, right: 70 },
  deco3:      { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -30, left: -20 },

  topRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  numBadge:   { backgroundColor: 'rgba(255,255,255,0.14)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7, alignItems: 'center' },
  numSub:     { fontSize: 8, fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 },
  numMain:    { fontSize: 20, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  actions:    { flexDirection: 'row', gap: 7 },
  actionBtn:  { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.14)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)', justifyContent: 'center', alignItems: 'center' },
  actionFav:  { backgroundColor: 'rgba(248,113,113,0.25)', borderColor: 'rgba(248,113,113,0.45)' },
  actionBookmark: { backgroundColor: 'rgba(245,158,11,0.25)', borderColor: 'rgba(245,158,11,0.45)' },

  goldLine:   { height: 1, width: '100%', opacity: 0.65, marginVertical: 4 },
  arabic:     { fontSize: 52, color: '#FFFFFF', textAlign: 'center', fontWeight: '900', lineHeight: 68, textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
  translit:   { fontSize: 16, color: 'rgba(253,230,138,0.9)', textAlign: 'center', fontStyle: 'italic', fontWeight: '600', letterSpacing: 0.5 },
  catBadge:   { alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  catText:    { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 0.8 },
  meaning:    { fontSize: 20, color: '#FFFFFF', textAlign: 'center', fontWeight: '700', lineHeight: 28 },
  sourcePill: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  sourceText: { fontSize: 10, fontWeight: '700', color: 'rgba(253,230,138,0.75)', letterSpacing: 0.5 },

  salawatCard:  { backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  salawatAccent:{ height: 3 },
  salawatInner: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16 },
  salawatIconWrap: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0, marginTop: 2 },
  salawatLabel: { fontSize: 11, fontWeight: '600', color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  salawatArabic:{ fontSize: 15, color: '#1E293B', fontWeight: '700', lineHeight: 26, marginBottom: 4 },
  salawatTrans: { fontSize: 12, color: '#64748B', fontStyle: 'italic', lineHeight: 18 },

  reflectCard:  { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  reflectLine:  { height: 3, borderRadius: 2, marginBottom: 12, width: 40 },
  reflectTitle: { fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  reflectText:  { fontSize: 14, color: '#475569', lineHeight: 22 },
});

// ─── Name List Item ───────────────────────────────────────────────────────────

const NameListItem = memo(({ name, onPress, isFavorite, isBookmarked }: {
  name: NabiName; onPress: () => void; isFavorite: boolean; isBookmarked: boolean;
}) => {
  const color = CATEGORY_COLORS[name.category];
  return (
    <TouchableOpacity style={li.row} onPress={onPress} activeOpacity={0.8}>
      <View style={[li.bar, { backgroundColor: color }]} />
      <View style={[li.numBox, { backgroundColor: color + '15' }]}>
        <Text style={[li.num, { color }]}>{name.id}</Text>
      </View>
      <View style={li.body}>
        <Text style={li.arabic}>{name.arabic}</Text>
        <Text style={li.translit}>{name.transliteration}</Text>
        <Text style={li.english} numberOfLines={1}>{name.english}</Text>
      </View>
      <View style={li.icons}>
        {isFavorite && <Heart size={12} color="#F87171" fill="#F87171" />}
        {isBookmarked && <Bookmark size={12} color="#F59E0B" fill="#F59E0B" />}
        {name.source && <BookOpen size={12} color={color} strokeWidth={2} />}
      </View>
    </TouchableOpacity>
  );
});

const li = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 8, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  bar:     { width: 4, alignSelf: 'stretch' },
  numBox:  { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center', margin: 10, flexShrink: 0 },
  num:     { fontSize: 13, fontWeight: '800' },
  body:    { flex: 1, paddingVertical: 12, paddingRight: 8 },
  arabic:  { fontSize: 18, color: '#1E293B', fontWeight: '700', lineHeight: 26 },
  translit:{ fontSize: 11, color: '#7C3AED', fontWeight: '600', fontStyle: 'italic', marginBottom: 2 },
  english: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  icons:   { flexDirection: 'row', gap: 5, paddingRight: 14, alignItems: 'center' },
});

// ─── Filter Modal ─────────────────────────────────────────────────────────────

const FilterModal = memo(({ visible, onClose, activeFilter, onSelectFilter }: {
  visible: boolean; onClose: () => void;
  activeFilter: NabiNameCategory | 'all' | 'favorites' | 'bookmarks';
  onSelectFilter: (f: NabiNameCategory | 'all' | 'favorites' | 'bookmarks') => void;
}) => {
  const slide = useRef(new Animated.Value(300)).current;
  const fade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slide, { toValue: visible ? 0 : 300, useNativeDriver: true, damping: 20, stiffness: 180 }),
      Animated.timing(fade,  { toValue: visible ? 1 : 0, duration: visible ? 200 : 150, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  if (!visible) return null;

  const allFilters: Array<{ key: NabiNameCategory | 'all' | 'favorites' | 'bookmarks'; label: string; color: string; count: number }> = [
    { key: 'all',       label: 'All Names',  color: '#F59E0B', count: asmaaAnNabi.length },
    { key: 'favorites', label: 'Favorites',  color: '#F87171', count: 0 },
    { key: 'bookmarks', label: 'Bookmarks',  color: '#F59E0B', count: 0 },
    ...Object.entries(CATEGORY_LABELS).map(([k, label]) => ({
      key: k as NabiNameCategory,
      label,
      color: CATEGORY_COLORS[k as NabiNameCategory],
      count: asmaaAnNabi.filter(n => n.category === k).length,
    })),
  ];

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <Animated.View style={[fm.overlay, { opacity: fade }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[fm.sheet, { transform: [{ translateY: slide }] }]}>
        <View style={fm.accent} />
        <View style={fm.handle} />
        <View style={fm.header}>
          <Text style={fm.title}>Filter Names</Text>
          <TouchableOpacity onPress={onClose} style={fm.closeBtn}>
            <X color="#64748B" size={18} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={fm.scroll}>
          {allFilters.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[fm.item, activeFilter === f.key && { backgroundColor: f.color + '12', borderColor: f.color }]}
              onPress={() => { haptic(); onSelectFilter(f.key); onClose(); }}
              activeOpacity={0.8}
            >
              <View style={[fm.dot, { backgroundColor: f.color }]} />
              <Text style={[fm.itemLabel, activeFilter === f.key && { color: f.color, fontWeight: '800' }]}>{f.label}</Text>
              <View style={[fm.countBadge, { backgroundColor: f.color + '18' }]}>
                <Text style={[fm.countText, { color: f.color }]}>{f.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
});

const fm = StyleSheet.create({
  overlay:    { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: Platform.OS === 'ios' ? 32 : 20, maxHeight: height * 0.75, overflow: 'hidden' },
  accent:     { height: 3, backgroundColor: '#059669' },
  handle:     { width: 36, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  title:      { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  closeBtn:   { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  scroll:     { padding: 16, gap: 8 },
  item:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5, borderColor: '#F1F5F9', backgroundColor: '#FAFAFA' },
  dot:        { width: 10, height: 10, borderRadius: 5 },
  itemLabel:  { flex: 1, fontSize: 14, fontWeight: '600', color: '#374151' },
  countBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  countText:  { fontSize: 11, fontWeight: '800' },
});

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const NabiProgressBar = memo(({ current, total, order }: {
  current: number; total: number; order: ReadingOrder;
}) => {
  const pct   = Math.round((current / total) * 100);
  const color = CATEGORY_COLORS[asmaaAnNabi[current - 1]?.category] ?? '#059669';
  const orderOpt = ORDER_OPTIONS.find(o => o.key === order);

  return (
    <View style={pb.wrap}>
      <View style={pb.track}>
        <View style={[pb.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <View style={pb.right}>
        <Text style={pb.label}>{current} / {total}</Text>
        {order !== 'sequential' && (
          <View style={[pb.orderTag, { backgroundColor: (orderOpt?.color ?? '#059669') + '18' }]}>
            <Text style={[pb.orderTagText, { color: orderOpt?.color ?? '#059669' }]}>
              {order === 'random' ? '🔀' : order === 'reverse' ? '↑' : '⊞'} {orderOpt?.label}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

const pb = StyleSheet.create({
  wrap:        { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 8 },
  track:       { flex: 1, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, overflow: 'hidden' },
  fill:        { height: '100%', borderRadius: 2 },
  right:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label:       { fontSize: 11, fontWeight: '700', color: '#94A3B8', minWidth: 44, textAlign: 'right' },
  orderTag:    { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  orderTagText:{ fontSize: 10, fontWeight: '700' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

type ViewMode = 'meditation' | 'list';

export default function AsmaaAnNabiScreen() {
  const { state } = useApp();
  const dark = state.settings.darkMode;
  const { handleBack } = useContext(LayoutActionsContext);

  const [viewMode,       setViewMode]       = useState<ViewMode>('meditation');
  const [currentIndex,   setCurrentIndex]   = useState(0);
  const [favorites,      setFavorites]      = useState<Set<number>>(new Set());
  const [bookmarks,      setBookmarks]      = useState<Set<number>>(new Set());
  const [filter,         setFilter]         = useState<NabiNameCategory | 'all' | 'favorites' | 'bookmarks'>('all');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [readingOrder,   setReadingOrder]   = useState<ReadingOrder>('sequential');
  const [showOpening,    setShowOpening]    = useState(true);
  const [showFilter,     setShowFilter]     = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSearch,     setShowSearch]     = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);

  const scrollRef    = useRef<ScrollView>(null);
  const flatRef      = useRef<FlatList<NabiName>>(null);

  // ── Filtered + ordered names ──
  const filteredNames = useMemo(() => {
    let names = asmaaAnNabi;
    if (filter === 'favorites') names = names.filter(n => favorites.has(n.id));
    else if (filter === 'bookmarks') names = names.filter(n => bookmarks.has(n.id));
    else if (filter !== 'all') names = names.filter(n => n.category === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      names = names.filter(n =>
        n.arabic.includes(searchQuery) ||
        n.transliteration.toLowerCase().includes(q) ||
        n.english.toLowerCase().includes(q)
      );
    }
    return applyOrder(names, readingOrder);
  }, [filter, searchQuery, favorites, bookmarks, readingOrder]);

  // ── displayedName: the name the card shows. Lives in a ref so it can be
  //    swapped synchronously while the overlay is opaque — zero flicker. ──
  const displayedNameRef = useRef<NabiName>(filteredNames[0] ?? asmaaAnNabi[0]);
  const [, forceRender]  = useState(0);
  const displayedName    = displayedNameRef.current;

  // ── Overlay: a thin opaque layer that covers the card during the swap.
  //    It fades in → content swaps instantly → fades out. The user only
  //    ever sees a brief blink-free dimming, not a blank card. ──
  const overlayOpacity  = useRef(new Animated.Value(0)).current;
  const isBusy          = useRef(false);

  // ── Fade anim kept for NameDetailCard's entrance only (first load) ──
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Reset displayedName when filter/order changes
  useEffect(() => {
    displayedNameRef.current = filteredNames[0] ?? asmaaAnNabi[0];
    forceRender(n => n + 1);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [filteredNames]);

  // ── Handle order change ──
  const handleOrderChange = useCallback((order: ReadingOrder) => {
    haptic('medium');
    setReadingOrder(order);
    setCurrentIndex(0);
  }, []);

  // ── Core navigation: overlay fades in → swap → overlay fades out ──
  const navigate = useCallback((nextIndex: number) => {
    if (isBusy.current) return;
    isBusy.current = true;

    const nextName = filteredNames[nextIndex] ?? filteredNames[0] ?? asmaaAnNabi[0];

    // Phase 1: fade overlay IN (covers the card)
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      // Phase 2: swap content while overlay is fully opaque (invisible to user)
      displayedNameRef.current = nextName;
      setCurrentIndex(nextIndex);
      forceRender(n => n + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: false });

      // Phase 3: fade overlay OUT (reveal new content)
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        isBusy.current = false;
      });
    });
  }, [filteredNames, overlayOpacity]);

  const goNext = useCallback(() => {
    if (!isBusy.current && currentIndex < filteredNames.length - 1) {
      haptic('light');
      navigate(currentIndex + 1);
    }
  }, [currentIndex, filteredNames.length, navigate]);

  const goPrev = useCallback(() => {
    if (!isBusy.current && currentIndex > 0) {
      haptic('light');
      navigate(currentIndex - 1);
    }
  }, [currentIndex, navigate]);

  // ── Pan responder ──
  const goNextRef = useRef(goNext);
  const goPrevRef = useRef(goPrev);
  useEffect(() => { goNextRef.current = goNext; }, [goNext]);
  useEffect(() => { goPrevRef.current = goPrev; }, [goPrev]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > Math.abs(gs.dy) && Math.abs(gs.dx) > 25,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -50) goNextRef.current();
        else if (gs.dx > 50) goPrevRef.current();
      },
    })
  ).current;

  // ── Favorites / Bookmarks ──
  const toggleFavorite = useCallback((id: number) => {
    haptic('medium');
    setFavorites(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }, []);
  const toggleBookmark = useCallback((id: number) => {
    haptic();
    setBookmarks(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }, []);

  // ── Share ──
  const shareName = useCallback((name: NabiName) => {
    Share.share({
      message: `✨ Name of the Prophet ﷺ (${name.id}/201)\n\n${name.arabic}\n${name.transliteration}\n"${name.english}"\n\nاللهم صل وسلم على سيدنا محمد وعلى آله وصحبه أجمعين`,
      title: 'Name of the Prophet ﷺ',
    });
  }, []);

  // ── Header actions ──
  const activeOrderOpt = ORDER_OPTIONS.find(o => o.key === readingOrder);

  const menuActions = useMemo(() => [
    { key: 'meditation', label: 'Deep Meditation',  icon: <Eye      color="#7C3AED" size={16} strokeWidth={2} />, onPress: () => setShowMeditation(true) },
    { key: 'card',       label: 'Card View',        icon: <Sparkles color="#059669" size={16} strokeWidth={2} />, onPress: () => setViewMode('meditation') },
    { key: 'list',       label: 'List View',        icon: <BookOpen color="#059669" size={16} strokeWidth={2} />, onPress: () => setViewMode('list') },
    { key: 'order',      label: `Order: ${activeOrderOpt?.label ?? 'Sequential'}`, icon: <ArrowUpDown color="#D97706" size={16} strokeWidth={2} />, onPress: () => setShowOrderModal(true) },
    { key: 'filter',     label: 'Filter Names',     icon: <Filter   color="#7C3AED" size={16} strokeWidth={2} />, onPress: () => setShowFilter(true), dividerAfter: true },
    { key: 'fav',        label: `Favorites (${favorites.size})`, icon: <Heart    color="#F87171" size={16} strokeWidth={2} />, onPress: () => { setFilter('favorites'); setViewMode('list'); } },
    { key: 'bkm',        label: `Bookmarks (${bookmarks.size})`, icon: <Bookmark color="#F59E0B" size={16} strokeWidth={2} />, onPress: () => { setFilter('bookmarks'); setViewMode('list'); } },
  ], [favorites.size, bookmarks.size, activeOrderOpt]);

  useRegisterHeaderActions('/asmaa-nabi', menuActions);

  const subtitle = viewMode === 'meditation'
    ? `${currentIndex + 1} of ${filteredNames.length}`
    : `${filteredNames.length} names`;

  const orderColor = activeOrderOpt?.color ?? '#059669';

  return (
    <View style={{ flex: 1, backgroundColor: dark ? '#0F172A' : '#F8FAFC' }}>
      <MinimalHeader
        title="أَسْمَاء النَّبِيّ ﷺ"
        subtitle={subtitle}
        onBackPress={handleBack}
        showMore={true}
        menuActions={menuActions}
        theme="default"
      />

      {/* Search bar */}
      {showSearch && (
        <View style={ss.searchBar}>
          <Search color="#94A3B8" size={16} strokeWidth={2} />
          <TextInput
            style={ss.searchInput}
            placeholder="Search in Arabic, transliteration or English..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color="#94A3B8" size={16} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Tool bar */}
      <View style={ss.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, flexDirection: 'row' }}>
          {/* Deep meditation button */}
          <TouchableOpacity style={[ss.toolBtn, ss.toolBtnMeditate]} onPress={() => setShowMeditation(true)}>
            <Eye color="#FFFFFF" size={13} strokeWidth={2} />
            <Text style={[ss.toolBtnText, ss.toolBtnTextActive]}>Meditate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[ss.toolBtn, viewMode === 'meditation' && ss.toolBtnActive]} onPress={() => setViewMode('meditation')}>
            <Sparkles color={viewMode === 'meditation' ? '#FFFFFF' : '#64748B'} size={13} strokeWidth={2} />
            <Text style={[ss.toolBtnText, viewMode === 'meditation' && ss.toolBtnTextActive]}>Cards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[ss.toolBtn, viewMode === 'list' && ss.toolBtnActive]} onPress={() => setViewMode('list')}>
            <BookOpen color={viewMode === 'list' ? '#FFFFFF' : '#64748B'} size={13} strokeWidth={2} />
            <Text style={[ss.toolBtnText, viewMode === 'list' && ss.toolBtnTextActive]}>Browse</Text>
          </TouchableOpacity>
          <View style={ss.sep} />

          {/* ── Reading Order button ── */}
          <TouchableOpacity
            style={[ss.toolBtn, { borderColor: orderColor + '60', backgroundColor: orderColor + '0D' }]}
            onPress={() => setShowOrderModal(true)}
          >
            <ArrowUpDown color={orderColor} size={13} strokeWidth={2} />
            <Text style={[ss.toolBtnText, { color: orderColor }]}>
              {readingOrder === 'sequential' ? 'Order' :
               readingOrder === 'reverse'   ? 'Rev.' :
               readingOrder === 'random'    ? 'Shuffle' : 'By Cat.'}
            </Text>
            {readingOrder !== 'sequential' && (
              <View style={[ss.orderActiveDot, { backgroundColor: orderColor }]} />
            )}
          </TouchableOpacity>

          <View style={ss.sep} />
          <TouchableOpacity style={ss.toolBtn} onPress={() => setShowSearch(s => !s)}>
            <Search color="#64748B" size={13} strokeWidth={2} />
            <Text style={ss.toolBtnText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ss.toolBtn} onPress={() => setShowFilter(true)}>
            <Filter color="#7C3AED" size={13} strokeWidth={2} />
            <Text style={[ss.toolBtnText, { color: '#7C3AED' }]}>Filter</Text>
            {filter !== 'all' && <View style={ss.filterDot} />}
          </TouchableOpacity>
          {favorites.size > 0 && (
            <TouchableOpacity style={ss.toolBtn} onPress={() => { setFilter('favorites'); setViewMode('list'); }}>
              <Heart color="#F87171" size={13} fill="#F87171" />
              <Text style={[ss.toolBtnText, { color: '#F87171' }]}>{favorites.size}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {viewMode === 'meditation' ? (
        <>
          <NabiProgressBar
            current={currentIndex + 1}
            total={filteredNames.length}
            order={readingOrder}
          />

          {/* Single card + invisible overlay.
              Overlay fades IN → content swaps instantly → overlay fades OUT.
              The user sees a seamless blink-free transition, never a blank card. */}
          <View style={{ flex: 1 }}>
            <ScrollView
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 140, paddingTop: 8 }}
            >
              <NameDetailCard
                name={displayedName}
                isFavorite={favorites.has(displayedName.id)}
                isBookmarked={bookmarks.has(displayedName.id)}
                onFavorite={() => toggleFavorite(displayedName.id)}
                onBookmark={() => toggleBookmark(displayedName.id)}
                onShare={() => shareName(displayedName)}
                panHandlers={panResponder.panHandlers}
                fadeAnim={fadeAnim}
                scaleAnim={scaleAnim}
              />
            </ScrollView>

            {/* Transition overlay — covers the card during content swap */}
            <Animated.View
              pointerEvents="none"
              style={[styles.transitionOverlay, { opacity: overlayOpacity }]}
            />
          </View>

          {/* Navigation controls */}
          <View style={nc.wrap}>
            <LinearGradient colors={['transparent', '#F59E0B', '#FDE68A', '#F59E0B', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={nc.goldLine} />
            <View style={nc.row}>
              <TouchableOpacity
                style={[nc.navBtn, currentIndex === 0 && nc.navBtnDisabled]}
                onPress={goPrev} disabled={currentIndex === 0} activeOpacity={0.75}
              >
                <ChevronLeft color={currentIndex === 0 ? '#CBD5E1' : '#059669'} size={22} strokeWidth={2.5} />
                <Text style={[nc.navLabel, currentIndex === 0 && nc.navLabelDis]}>Prev</Text>
              </TouchableOpacity>

              <View style={nc.center}>
                <Text style={nc.centerNum}>{currentIndex + 1}</Text>
                <Text style={nc.centerOf}>of {filteredNames.length}</Text>
                {/* Tappable order indicator in nav bar */}
                <TouchableOpacity
                  style={[nc.orderChip, { backgroundColor: orderColor + '18', borderColor: orderColor + '40' }]}
                  onPress={() => setShowOrderModal(true)}
                  activeOpacity={0.75}
                >
                  <ArrowUpDown color={orderColor} size={9} strokeWidth={2.5} />
                  <Text style={[nc.orderChipText, { color: orderColor }]}>
                    {readingOrder === 'sequential' ? 'Sequential' :
                     readingOrder === 'reverse'   ? 'Reverse' :
                     readingOrder === 'random'    ? 'Shuffled' : 'By Category'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[nc.navBtn, currentIndex === filteredNames.length - 1 && nc.navBtnDisabled]}
                onPress={goNext} disabled={currentIndex === filteredNames.length - 1} activeOpacity={0.75}
              >
                <Text style={[nc.navLabel, currentIndex === filteredNames.length - 1 && nc.navLabelDis]}>Next</Text>
                <ChevronRight color={currentIndex === filteredNames.length - 1 ? '#CBD5E1' : '#059669'} size={22} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <FlatList
          ref={flatRef}
          data={filteredNames}
          keyExtractor={n => String(n.id)}
          renderItem={({ item }) => (
            <NameListItem
              name={item}
              isFavorite={favorites.has(item.id)}
              isBookmarked={bookmarks.has(item.id)}
              onPress={() => {
                const idx = filteredNames.indexOf(item);
                if (idx !== -1) {
                  setCurrentIndex(idx);
                  setShowMeditation(true);
                }
              }}
            />
          )}
          ListHeaderComponent={(
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 4 }}>
                {filter === 'all' ? 'All 201 Names' : CATEGORY_LABELS[filter as NabiNameCategory] ?? filter}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 13, color: '#94A3B8' }}>{filteredNames.length} names</Text>
                {/* Order indicator in list header */}
                <TouchableOpacity
                  style={[ss.listOrderBadge, { backgroundColor: orderColor + '18', borderColor: orderColor + '40' }]}
                  onPress={() => setShowOrderModal(true)}
                  activeOpacity={0.8}
                >
                  <ArrowUpDown color={orderColor} size={10} strokeWidth={2.5} />
                  <Text style={[ss.listOrderText, { color: orderColor }]}>{activeOrderOpt?.label}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={(
            <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
              <Text style={{ fontSize: 40 }}>🔍</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>No names found</Text>
              <Text style={{ fontSize: 13, color: '#94A3B8' }}>Try a different search or filter</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 4 }}
        />
      )}

      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        activeFilter={filter}
        onSelectFilter={f => { setFilter(f); setCurrentIndex(0); }}
      />

      {/* ── Reading Order Modal ── */}
      <OrderModal
        visible={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        activeOrder={readingOrder}
        onSelectOrder={handleOrderChange}
      />

      {/* ── Deep Meditation Modal ── */}
      <MeditationModal
        visible={showMeditation}
        name={displayedName}
        dark={dark}
        onClose={() => setShowMeditation(false)}
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < filteredNames.length - 1}
      />

      {showOpening && <OpeningBanner onClose={() => setShowOpening(false)} />}
    </View>
  );
}

// ─── Transition overlay style ────────────────────────────────────────────────
const styles = StyleSheet.create({
  transitionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F8FAFC', // matches screen background
    zIndex: 10,
  },
});

// ─── Toolbar styles ───────────────────────────────────────────────────────────
const ss = StyleSheet.create({
  searchBar:        { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginTop: 10, backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1, borderColor: '#E2E8F0' },
  searchInput:      { flex: 1, fontSize: 14, color: '#1E293B' },
  toolbar:          { paddingVertical: 10 },
  toolBtn:          { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E2E8F0' },
  toolBtnActive:    { backgroundColor: '#059669', borderColor: '#059669' },
  toolBtnMeditate:  { backgroundColor: '#4C1D95', borderColor: '#4C1D95' },
  toolBtnText:      { fontSize: 12, fontWeight: '700', color: '#64748B' },
  toolBtnTextActive:{ color: '#FFFFFF' },
  sep:              { width: 1, backgroundColor: '#E2E8F0', marginHorizontal: 4, alignSelf: 'stretch' },
  filterDot:        { position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#7C3AED' },
  orderActiveDot:   { position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: 3.5 },
  listOrderBadge:   { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  listOrderText:    { fontSize: 11, fontWeight: '700' },
});

// ─── Nav controls styles ──────────────────────────────────────────────────────
const nc = StyleSheet.create({
  wrap:           { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', paddingBottom: Platform.OS === 'ios' ? 28 : 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 12 },
  goldLine:       { height: 2, opacity: 0.6 },
  row:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12 },
  navBtn:         { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, backgroundColor: '#F0FDF4', borderWidth: 1.5, borderColor: '#A7F3D0', minWidth: 80 },
  navBtnDisabled: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  navLabel:       { fontSize: 13, fontWeight: '700', color: '#059669' },
  navLabelDis:    { color: '#CBD5E1' },
  center:         { alignItems: 'center', gap: 3 },
  centerNum:      { fontSize: 22, fontWeight: '900', color: '#1E293B', lineHeight: 26 },
  centerOf:       { fontSize: 10, fontWeight: '600', color: '#94A3B8' },
  orderChip:      { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  orderChipText:  { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
});