import React, { useState, useRef, useCallback, useEffect, memo, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, Dimensions,
  TouchableOpacity, Animated, ScrollView,
  PanResponder, Alert, Platform, Modal, Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart, BookOpen, Pause, Play, SkipBack, SkipForward,
  Star, Quote, Share2, Bookmark, Volume2, VolumeX,
  Settings, Moon, Sun, Repeat, Shuffle, X,
  Zap, Hash, ChevronLeft, ChevronRight,
} from 'lucide-react-native';
import { asmaAlHusna, AsmaAlHusnaItem } from '../../data/asmaAlHusna';
import { useApp } from '../../contexts/AppContext';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';
import { useContext } from 'react';
import MinimalHeader from '../../components/MinimalHeader';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';

// ─── Constants ────────────────────────────────────────────────────────────────
const { width } = Dimensions.get('window');
const CARD_PADDING = 16;
type Language = 'english' | 'french' | 'arabic';

const SPEED_OPTIONS = [
  { label: '0.5×', value: 0.5, ms: 20000 },
  { label: '1×',   value: 1.0, ms: 10000 },
  { label: '1.5×', value: 1.5, ms: 6600  },
  { label: '2×',   value: 2.0, ms: 5000  },
  { label: '3×',   value: 3.0, ms: 3300  },
  { label: '5×',   value: 5.0, ms: 2000  },
];

// Palette alignée sur le nouveau SpiritualHeader
const GREEN_DARK   = '#064E3B';
const GREEN_MID    = '#065F46';
const GREEN_LIGHT  = '#047857';
const GOLD_DEEP    = '#92400E';
const GOLD         = '#F59E0B';
const GOLD_LIGHT   = '#FDE68A';

const haptic = (t: 'light' | 'medium' | 'heavy' = 'light') => {
  if (Platform.OS !== 'ios') return;
  Haptics.impactAsync({ light: Haptics.ImpactFeedbackStyle.Light, medium: Haptics.ImpactFeedbackStyle.Medium, heavy: Haptics.ImpactFeedbackStyle.Heavy }[t]);
};

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────
const BottomSheet = memo(({ visible, onClose, children, title }: {
  visible: boolean; onClose: () => void;
  children: React.ReactNode; title: string;
}) => {
  const slide = useRef(new Animated.Value(300)).current;
  const fade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slide, { toValue: visible ? 0 : 300, useNativeDriver: true, damping: 20, stiffness: 160 }),
      Animated.timing(fade,  { toValue: visible ? 1 : 0,   duration: visible ? 200 : 150, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <Animated.View style={[bs.overlay, { opacity: fade }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[bs.sheet, { transform: [{ translateY: slide }] }]}>
        {/* Green accent top — cohérent avec MinimalHeader dropdown */}
        <View style={bs.accent} />
        <View style={bs.handle} />
        <View style={bs.sheetHeader}>
          <Text style={bs.sheetTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={bs.closeBtn} activeOpacity={0.7}>
            <X color="#64748B" size={18} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        {children}
      </Animated.View>
    </Modal>
  );
});

const bs = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    paddingHorizontal: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15, shadowRadius: 16, elevation: 20,
    overflow: 'hidden',
  },
  accent:  { height: 3, backgroundColor: GREEN_MID },
  handle:  { width: 36, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 16,
  },
  sheetTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', letterSpacing: -0.2 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
});

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ icon, title, bg, border, accent = GREEN_MID, children }: {
  icon: React.ReactNode; title: string;
  bg: string; border: string; accent?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={[sc.card, { backgroundColor: bg, borderColor: border }]}>
      <View style={[sc.header, { borderBottomColor: border }]}>
        <View style={[sc.iconWrap, { backgroundColor: accent + '18' }]}>{icon}</View>
        <Text style={[sc.title, { color: accent }]}>{title}</Text>
      </View>
      <View style={sc.body}>{children}</View>
    </View>
  );
}
const sc = StyleSheet.create({
  card: {
    borderRadius: 20, marginBottom: 14, borderWidth: 1.5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, overflow: 'hidden',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderBottomWidth: 1 },
  iconWrap: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 13, fontWeight: '700', flex: 1, textTransform: 'uppercase', letterSpacing: 0.6 },
  body: { padding: 14 },
});

// ─── Name Card ────────────────────────────────────────────────────────────────
const NameCard = memo(({
  item, language, setLanguage, isFavorite, isBookmarked,
  onFavorite, onBookmark, onShare, isDark, progressAnim, fadeAnim, panHandlers,
}: {
  item: AsmaAlHusnaItem; language: Language; setLanguage: (l: Language) => void;
  isFavorite: boolean; isBookmarked: boolean;
  onFavorite: () => void; onBookmark: () => void; onShare: () => void;
  isDark: boolean; progressAnim: Animated.Value; fadeAnim: Animated.Value; panHandlers: any;
}) => {
  const cardBg  = isDark ? '#1E293B' : '#FFFFFF';
  const textPri = isDark ? '#F8FAFC' : '#1E293B';
  const textSec = isDark ? '#94A3B8' : '#64748B';
  const borderC = isDark ? '#334155' : '#F1F5F9';

  const getText = (en: string, fr: string, ar: string) =>
    language === 'french' ? fr : language === 'arabic' ? ar : en;

  return (
    <View style={nc.wrapper} {...panHandlers}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={nc.scroll}>

        {/* ── Hero ── */}
        <View style={nc.heroShadow}>
          <LinearGradient
            colors={[GREEN_DARK, GREEN_MID, GREEN_LIGHT]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={nc.hero}
          >
            {/* Deco circles — identique SpiritualHeader */}
            <View style={nc.deco} pointerEvents="none">
              <View style={nc.decoC1} />
              <View style={nc.decoC2} />
              <View style={nc.decoC3} />
            </View>

            {/* ── Top row: number | actions ── */}
            <View style={nc.heroTop}>
              <View style={nc.numBadge}>
                <Text style={nc.numLabel}>Ism</Text>
                <Text style={nc.numText}>{String(item.id).padStart(2, '0')}</Text>
              </View>
              <View style={nc.actions}>
                <TouchableOpacity
                  style={[nc.actionBtn, isBookmarked && nc.actionBookmark]}
                  onPress={onBookmark} activeOpacity={0.75}
                >
                  <Bookmark
                    color={isBookmarked ? GOLD : '#FFFFFF'} size={16} strokeWidth={2}
                    fill={isBookmarked ? GOLD : 'transparent'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[nc.actionBtn, isFavorite && nc.actionFav]}
                  onPress={onFavorite} activeOpacity={0.75}
                >
                  <Heart
                    color={isFavorite ? '#F87171' : '#FFFFFF'} size={16} strokeWidth={2}
                    fill={isFavorite ? '#F87171' : 'transparent'}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={nc.actionBtn} onPress={onShare} activeOpacity={0.75}>
                  <Share2 color="#FFFFFF" size={16} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Gold divider — même que SpiritualHeader ── */}
            <View style={nc.goldDivider}>
              <LinearGradient
                colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </View>

            {/* ── Arabic name (main) ── */}
            <Animated.View style={[nc.nameBlock, { opacity: fadeAnim }]}>
              <Text style={nc.arabicName}>{item.arabic}</Text>
              <Text style={nc.transliteration}>{item.transliteration}</Text>
            </Animated.View>

            {/* ── Language tabs ── */}
            <View style={nc.langPill}>
              {(['english', 'french', 'arabic'] as Language[]).map(l => (
                <TouchableOpacity
                  key={l}
                  style={[nc.langBtn, language === l && nc.langBtnActive]}
                  onPress={() => setLanguage(l)}
                  activeOpacity={0.75}
                >
                  <Text style={[nc.langTxt, language === l && nc.langTxtActive]}>
                    {l === 'english' ? 'EN' : l === 'french' ? 'FR' : 'ع'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Translation ── */}
            <Text style={nc.mainTranslation}>
              {getText(item.english, item.french, item.arabic)}
            </Text>

            {/* ── Progress gold bar ── */}
            <View style={nc.progressWrap}>
              <View style={nc.progressTrack}>
                <Animated.View style={[
                  nc.progressFill,
                  { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
                ]} />
              </View>
              <Text style={nc.progressCount}>
                {item.id} / {asmaAlHusna.length}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* ── Sections ── */}
        <SectionCard
          icon={<BookOpen color={GREEN_MID} size={16} strokeWidth={2} />}
          title="Quranic Reference" bg={cardBg} border={borderC}
        >
          <Text style={[nc.arabicVerse, { color: textPri }]}>{item.verse.arabic}</Text>
          <View style={[nc.divider, { backgroundColor: borderC }]} />
          <Text style={[nc.verseTranslation, { color: textSec }]}>
            {getText(item.verse.english, item.verse.french, item.verse.arabic)}
          </Text>
          <Text style={nc.verseRef}>{item.verse.reference}</Text>
        </SectionCard>

        <SectionCard
          icon={<Quote color="#7C3AED" size={16} strokeWidth={2} />}
          title="Spiritual Reflection" bg={cardBg} border={borderC}
          accent="#7C3AED"
        >
          <Text style={[nc.bodyText, { color: textSec }]}>
            {getText(item.meditation.english, item.meditation.french, item.meditation.english)}
          </Text>
        </SectionCard>

        <SectionCard
          icon={<Star color="#D97706" size={16} strokeWidth={2} />}
          title="Suggested Invocation" bg={cardBg} border={borderC}
          accent="#D97706"
        >
          <View style={[nc.invocBox, isDark && nc.invocBoxDark]}>
            <Text style={[nc.invocArabic, { color: textPri }]}>
              اللهم إنك {item.arabic} أسألك بهذا الاسم العظيم
            </Text>
            <Text style={[nc.invocTrans, { color: textSec }]}>
              "O Allah, You are {item.transliteration}, I ask You by this magnificent name…"
            </Text>
          </View>
        </SectionCard>

        <View style={{ height: 160 }} />
      </ScrollView>
    </View>
  );
});

const nc = StyleSheet.create({
  wrapper: { width, paddingHorizontal: CARD_PADDING, flex: 1 },
  scroll:  { paddingTop: 14 },

  // Hero
  heroShadow: {
    borderRadius: 24, marginBottom: 14,
    shadowColor: GREEN_DARK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.30, shadowRadius: 20, elevation: 14,
    overflow: 'hidden',
  },
  hero: { padding: 20 },
  deco: { ...StyleSheet.absoluteFillObject },
  decoC1: { position: 'absolute', top: -50, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.06)' },
  decoC2: { position: 'absolute', top: 30, right: 60,   width: 60,  height: 60,  borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.04)' },
  decoC3: { position: 'absolute', bottom: -20, left: -20, width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.03)' },

  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },

  numBadge: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
  },
  numLabel: { fontSize: 8,  fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 },
  numText:  { fontSize: 18, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },

  actions: { flexDirection: 'row', gap: 7 },
  actionBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
  },
  actionFav:      { backgroundColor: 'rgba(248,113,113,0.22)', borderColor: 'rgba(248,113,113,0.4)' },
  actionBookmark: { backgroundColor: 'rgba(245,158,11,0.22)',  borderColor: 'rgba(245,158,11,0.4)'  },

  // Gold divider — même que SpiritualHeader
  goldDivider: { height: 1, marginBottom: 18, opacity: 0.6 },

  // Arabic name
  nameBlock: { alignItems: 'center', marginBottom: 16 },
  arabicName: {
    fontSize: 64, fontWeight: '900', color: '#FFFFFF',
    textAlign: 'center', marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
    lineHeight: 76,
  },
  transliteration: {
    fontSize: 18, color: 'rgba(252,211,77,0.92)',
    fontStyle: 'italic', fontWeight: '600', letterSpacing: 0.8,
  },

  // Language tabs
  langPill: {
    flexDirection: 'row', gap: 4, alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18, padding: 3, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  langBtn:       { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 14 },
  langBtnActive: { backgroundColor: 'rgba(252,211,77,0.22)', borderRadius: 14 },
  langTxt:       { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.65)' },
  langTxtActive: { color: GOLD_LIGHT },

  mainTranslation: {
    fontSize: 20, fontWeight: '700', color: '#FFFFFF',
    textAlign: 'center', lineHeight: 28, marginBottom: 18,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },

  // Progress
  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressTrack: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 2, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: GOLD, borderRadius: 2 },
  progressCount: { fontSize: 10, fontWeight: '700', color: 'rgba(252,211,77,0.8)', minWidth: 36, textAlign: 'right' },

  // Section cards content
  arabicVerse: { fontSize: 19, textAlign: 'center', lineHeight: 32, fontWeight: '600', marginBottom: 10 },
  divider: { height: 1, marginVertical: 10 },
  verseTranslation: { fontSize: 14, textAlign: 'center', lineHeight: 22, fontStyle: 'italic', marginBottom: 8, color: '#64748B' },
  verseRef: { fontSize: 12, color: GREEN_MID, textAlign: 'center', fontWeight: '700' },
  bodyText: { fontSize: 14, lineHeight: 23, textAlign: 'justify' },
  invocBox: { backgroundColor: '#F0FDF4', borderRadius: 12, padding: 14, gap: 8 },
  invocBoxDark: { backgroundColor: '#042F20' },
  invocArabic: { fontSize: 16, textAlign: 'center', lineHeight: 26, fontWeight: '600' },
  invocTrans:  { fontSize: 12, textAlign: 'center', fontStyle: 'italic', lineHeight: 18, color: '#64748B' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function NamesScreen() {
  const { state } = useApp();
  const { handleBack } = useContext(LayoutActionsContext);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [language,     setLanguage]     = useState<Language>('english');
  const [favorites,    setFavorites]    = useState<Set<number>>(new Set());
  const [bookmarks,    setBookmarks]    = useState<Set<number>>(new Set());
  const [isDark,       setIsDark]       = useState(state.settings.darkMode);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [autoPlay,     setAutoPlay]     = useState(false);
  const [isMuted,      setIsMuted]      = useState(false);
  const [speed,        setSpeed]        = useState(1.0);
  const [showSpeed,    setShowSpeed]    = useState(false);
  const [showOptions,  setShowOptions]  = useState(false);

  const listRef      = useRef<FlatList>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim     = useRef(new Animated.Value(1)).current;
  const scaleAnim    = useRef(new Animated.Value(1)).current;

  // Pulse arabic name
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.84, duration: 3000, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1,    duration: 3000, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  // Progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / asmaAlHusna.length,
      duration: 400, useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || !isPlaying) return;
    const ms = SPEED_OPTIONS.find(o => o.value === speed)?.ms ?? 10000;
    const t = setTimeout(() => {
      if (currentIndex < asmaAlHusna.length - 1) goToNext();
      else { setIsPlaying(false); setAutoPlay(false); }
    }, ms);
    return () => clearTimeout(t);
  }, [autoPlay, isPlaying, currentIndex, speed]);

  const scrollTo = useCallback((idx: number) => {
    listRef.current?.scrollToIndex({ index: idx, animated: true });
    setCurrentIndex(idx);
  }, []);

  const goToNext     = useCallback(() => { if (currentIndex < asmaAlHusna.length - 1) { haptic(); scrollTo(currentIndex + 1); } }, [currentIndex, scrollTo]);
  const goToPrevious = useCallback(() => { if (currentIndex > 0)                      { haptic(); scrollTo(currentIndex - 1); } }, [currentIndex, scrollTo]);

  const toggleFavorite = useCallback((id: number) => {
    haptic('medium');
    setFavorites(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }, []);
  const toggleBookmark = useCallback((id: number) => {
    haptic();
    setBookmarks(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }, []);

  const togglePlay = useCallback(() => {
    haptic('medium');
    const next = !isPlaying;
    setIsPlaying(next); setAutoPlay(next);
  }, [isPlaying]);

  const shareCurrentName = useCallback(() => {
    const n = asmaAlHusna[currentIndex];
    console.log(`Sharing: ${n.arabic} - ${n.transliteration}`);
  }, [currentIndex]);

  const handleResetAll = useCallback(() => {
    haptic('heavy');
    Alert.alert('Reset all data', 'This will clear all your favorites and bookmarks.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => {
        setFavorites(new Set()); setBookmarks(new Set()); scrollTo(0); setShowOptions(false);
      }},
    ]);
  }, [scrollTo]);

 const menuActions = useMemo(() => [
  { key: 'counter', label: `Name ${currentIndex + 1} of ${asmaAlHusna.length}`, icon: <Hash color={GREEN_MID} size={18} strokeWidth={2} />, onPress: () => {} , dividerAfter: true },
  { key: 'darkmode', label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode', icon: isDark ? <Sun color="#D97706" size={18} strokeWidth={2} /> : <Moon color="#7C3AED" size={18} strokeWidth={2} />, onPress: () => { haptic('medium'); setIsDark(d => !d); } },
  { key: 'speed', label: `Playback Speed: ${speed}×`, icon: <Zap color="#0891B2" size={18} strokeWidth={2} />, onPress: () => { haptic(); setShowSpeed(true); } },
  { key: 'mute', label: isMuted ? 'Unmute Audio' : 'Mute Audio', icon: isMuted ? <VolumeX color="#64748B" size={18} strokeWidth={2} /> : <Volume2 color="#64748B" size={18} strokeWidth={2} />, onPress: () => { haptic(); setIsMuted(m => !m); }, dividerAfter: true },
  { key: 'beginning', label: 'Back to beginning', icon: <SkipBack color={GREEN_MID} size={18} strokeWidth={2} />, onPress: () => scrollTo(0) },
  { key: 'random', label: 'Random name', icon: <Shuffle color="#7C3AED" size={18} strokeWidth={2} />, onPress: () => scrollTo(Math.floor(Math.random() * asmaAlHusna.length)), dividerAfter: true },
  { key: 'reset', label: 'Reset all data', icon: <Settings color="#EF4444" size={18} strokeWidth={2} />, onPress: handleResetAll, destructive: true },
], [currentIndex, isDark, isMuted, speed, scrollTo, handleResetAll]);

useRegisterHeaderActions('/asmaa-alhusna', menuActions);

  useRegisterHeaderActions('/asmaa-alhusna', menuActions);

  // Pan responder
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > Math.abs(gs.dy) && Math.abs(gs.dx) > 20,
      onPanResponderMove:  (_, gs) => scaleAnim.setValue(Math.max(0.95, 1 - Math.abs(gs.dx) / (width * 2.5))),
      onPanResponderRelease: (_, gs) => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
        if      (gs.dx >  50 && currentIndex > 0)                      goToPrevious();
        else if (gs.dx < -50 && currentIndex < asmaAlHusna.length - 1) goToNext();
      },
    })
  ).current;

  const pct     = Math.round(((currentIndex + 1) / asmaAlHusna.length) * 100);
  const bg      = isDark ? '#0F172A' : '#F8FAFC';
  const ctrlBg  = isDark ? '#1E293B' : '#FFFFFF';
  const textSec = isDark ? '#94A3B8' : '#64748B';
  const border  = isDark ? '#334155' : '#E2E8F0';
  const isFirst = currentIndex === 0;
  const isLast  = currentIndex === asmaAlHusna.length - 1;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>

      <MinimalHeader
        title="Asmāʾ Al-Ḥusnā"
        subtitle="The 99 Divine Names"
        onBackPress={handleBack}
        showMore={true}
        menuActions={menuActions}
        theme="default"
      />

      {/* ── Cards ── */}
      <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
        <FlatList
          ref={listRef}
          data={asmaAlHusna}
          renderItem={({ item }) => (
            <NameCard
              item={item} language={language} setLanguage={setLanguage}
              isFavorite={favorites.has(item.id)} isBookmarked={bookmarks.has(item.id)}
              onFavorite={() => toggleFavorite(item.id)}
              onBookmark={() => toggleBookmark(item.id)}
              onShare={shareCurrentName}
              isDark={isDark} progressAnim={progressAnim} fadeAnim={fadeAnim}
              panHandlers={panResponder.panHandlers}
            />
          )}
          keyExtractor={item => item.id.toString()}
          horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          onMomentumScrollEnd={e => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / width);
            if (idx !== currentIndex) setCurrentIndex(idx);
          }}
        />
      </Animated.View>

      {/* ── Player Bar ── */}
      <View style={[styles.playerWrap, { backgroundColor: ctrlBg, borderTopColor: border }]}>

        {/* Gold top edge — même que SpiritualHeader */}
        <View style={styles.playerGoldEdge}>
          <LinearGradient
            colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Progress row */}
        <View style={styles.progressRow}>
          <View style={[styles.progressTrack, isDark && styles.progressTrackDark]}>
            <Animated.View style={[
              styles.progressFill,
              { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]} />
          </View>
          <View style={styles.progressMeta}>
            <Text style={[styles.metaTxt, { color: textSec }]}>{pct}% completed</Text>
            <Text style={[styles.metaTxt, { color: textSec }]}>
              {asmaAlHusna.length - currentIndex - 1} remaining
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.ctrlRow}>

          {/* Auto-play toggle */}
          <TouchableOpacity
            style={[styles.sideBtn, autoPlay && styles.sideBtnActive, isDark && styles.sideBtnDark]}
            onPress={() => { haptic('medium'); setAutoPlay(a => { const n = !a; setIsPlaying(n); return n; }); }}
            activeOpacity={0.75}
          >
            <Zap color={autoPlay ? GREEN_MID : textSec} size={13} strokeWidth={2.5} />
            <Text style={[styles.sideBtnTxt, { color: autoPlay ? GREEN_MID : textSec }]}>AUTO</Text>
          </TouchableOpacity>

          {/* Prev */}
          <TouchableOpacity
            style={[styles.navBtn, isDark && styles.navBtnDark, isFirst && styles.navBtnDis]}
            onPress={goToPrevious} disabled={isFirst} activeOpacity={0.75}
          >
            <ChevronLeft
              color={isFirst ? (isDark ? '#475569' : '#CBD5E1') : GREEN_MID}
              size={24} strokeWidth={2.5}
            />
          </TouchableOpacity>

          {/* Play / Pause — gradient aligné */}
          <TouchableOpacity style={styles.playBtn} onPress={togglePlay} activeOpacity={0.85}>
            <LinearGradient
              colors={isPlaying ? [GOLD_DEEP, GOLD] : [GREEN_DARK, GREEN_LIGHT]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.playGrad}
            >
              {isPlaying
                ? <Pause color="#FFFFFF" size={26} strokeWidth={2.5} />
                : <Play  color="#FFFFFF" size={26} strokeWidth={2.5} />
              }
            </LinearGradient>
          </TouchableOpacity>

          {/* Next */}
          <TouchableOpacity
            style={[styles.navBtn, isDark && styles.navBtnDark, isLast && styles.navBtnDis]}
            onPress={goToNext} disabled={isLast} activeOpacity={0.75}
          >
            <ChevronRight
              color={isLast ? (isDark ? '#475569' : '#CBD5E1') : GREEN_MID}
              size={24} strokeWidth={2.5}
            />
          </TouchableOpacity>

          {/* Speed */}
          <TouchableOpacity
            style={[styles.sideBtn, showSpeed && styles.sideBtnActive, isDark && styles.sideBtnDark]}
            onPress={() => { haptic(); setShowSpeed(s => !s); }}
            activeOpacity={0.75}
          >
            <Text style={[styles.sideBtnTxt, { color: showSpeed ? GREEN_MID : textSec }]}>
              {speed}×
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Speed Sheet ── */}
      <BottomSheet visible={showSpeed} onClose={() => setShowSpeed(false)} title="Playback Speed">
        <View style={styles.speedGrid}>
          {SPEED_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.speedOpt, speed === opt.value && styles.speedOptActive, isDark && styles.speedOptDark]}
              onPress={() => { haptic(); setSpeed(opt.value); setShowSpeed(false); }}
              activeOpacity={0.75}
            >
              <Text style={[styles.speedLbl, speed === opt.value && styles.speedLblActive]}>{opt.label}</Text>
              <Text style={styles.speedSec}>{Math.round(opt.ms / 1000)}s / name</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>

      {/* ── Options Sheet ── */}
      <BottomSheet visible={showOptions} onClose={() => setShowOptions(false)} title="Options">
        <View style={styles.optionsList}>
          {[
            { icon: <SkipBack  color={GREEN_MID} size={18} strokeWidth={2} />, label: 'Back to beginning', onPress: () => { scrollTo(0); setShowOptions(false); } },
            { icon: <Shuffle   color="#7C3AED"   size={18} strokeWidth={2} />, label: 'Random name',       onPress: () => { scrollTo(Math.floor(Math.random() * asmaAlHusna.length)); setShowOptions(false); } },
            { icon: <Volume2   color="#0891B2"   size={18} strokeWidth={2} />, label: isMuted ? 'Unmute' : 'Mute', onPress: () => { setIsMuted(m => !m); setShowOptions(false); } },
            { icon: <Settings  color="#EF4444"   size={18} strokeWidth={2} />, label: 'Reset all data', onPress: handleResetAll, danger: true },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.optionRow} onPress={item.onPress} activeOpacity={0.7}>
              <View style={[styles.optionIcon, isDark && styles.optionIconDark]}>{item.icon}</View>
              <Text style={[styles.optionLbl, isDark && styles.optionLblDark, (item as any).danger && styles.optionDanger]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  // Player bar
  playerWrap: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 8,
  },
  playerGoldEdge: { height: 2, marginBottom: 14, opacity: 0.65 },

  progressRow:      { marginBottom: 14 },
  progressTrack:    { height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressTrackDark:{ backgroundColor: '#334155' },
  progressFill:     { height: '100%', backgroundColor: GREEN_MID, borderRadius: 3 },
  progressMeta:     { flexDirection: 'row', justifyContent: 'space-between' },
  metaTxt:          { fontSize: 11, fontWeight: '600' },

  ctrlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  // Side buttons
  sideBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 9,
    borderRadius: 12, backgroundColor: '#F8FAFC',
    borderWidth: 1.5, borderColor: '#E2E8F0',
    minWidth: 50, justifyContent: 'center',
  },
  sideBtnDark:   { backgroundColor: '#1E293B', borderColor: '#334155' },
  sideBtnActive: { backgroundColor: '#F0FDF4', borderColor: '#A7F3D0' },
  sideBtnTxt:    { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },

  // Nav buttons
  navBtn: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#D1FAE5',
  },
  navBtnDark: { backgroundColor: '#1E3A2F', borderColor: '#065F46' },
  navBtnDis:  { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', opacity: 0.4 },

  // Play button — diagonal gradient aligné sur le header
  playBtn: {
    width: 64, height: 64, borderRadius: 32,
    shadowColor: GREEN_DARK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 12,
  },
  playGrad: { flex: 1, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },

  // Speed sheet
  speedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 8 },
  speedOpt: {
    flex: 1, minWidth: '30%', maxWidth: '32%',
    paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC', alignItems: 'center',
  },
  speedOptDark:   { backgroundColor: '#1E293B', borderColor: '#334155' },
  speedOptActive: { borderColor: GREEN_MID, backgroundColor: '#F0FDF4' },
  speedLbl:       { fontSize: 16, fontWeight: '800', color: '#374151', marginBottom: 2 },
  speedLblActive: { color: GREEN_MID },
  speedSec:       { fontSize: 9, color: '#94A3B8', fontWeight: '600' },

  // Options sheet
  optionsList: { gap: 2, paddingBottom: 8 },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, paddingHorizontal: 4, borderRadius: 12 },
  optionIcon:     { width: 38, height: 38, borderRadius: 11, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  optionIconDark: { backgroundColor: '#273549' },
  optionLbl:      { fontSize: 14, fontWeight: '600', color: '#1E293B', flex: 1 },
  optionLblDark:  { color: '#F1F5F9' },
  optionDanger:   { color: '#EF4444' },
});