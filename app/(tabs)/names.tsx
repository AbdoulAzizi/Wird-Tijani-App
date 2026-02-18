import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
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
  Zap, Hash,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { asmaAlHusna, AsmaAlHusnaItem } from '../../data/asmaAlHusna';
import { useApp } from '../../contexts/AppContext';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';

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

const haptic = (t: 'light' | 'medium' | 'heavy' = 'light') => {
  if (Platform.OS !== 'ios') return;
  const map = {
    light:  Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy:  Haptics.ImpactFeedbackStyle.Heavy,
  };
  Haptics.impactAsync(map[t]);
};

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────
const BottomSheet = memo(({
  visible, onClose, children, title,
}: {
  visible: boolean; onClose: () => void;
  children: React.ReactNode; title: string;
}) => {
  const slide = useRef(new Animated.Value(300)).current;
  const fade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slide, { toValue: 0,   useNativeDriver: true, damping: 20, stiffness: 160 }),
        Animated.timing(fade,  { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slide, { toValue: 300, useNativeDriver: true, damping: 22, stiffness: 200 }),
        Animated.timing(fade,  { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <Animated.View style={[bs.overlay, { opacity: fade }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[bs.sheet, { transform: [{ translateY: slide }] }]}>
        <View style={bs.handle} />
        <View style={bs.sheetHeader}>
          <Text style={bs.sheetTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={bs.closeBtn} activeOpacity={0.7}>
            <X color="#64748B" size={20} strokeWidth={2.5} />
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
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#D1D5DB', alignSelf: 'center', marginTop: 12, marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 16,
  },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B' },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center',
  },
});

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ icon, title, bg, border, accent = '#059669', children }: {
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
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 16, borderBottomWidth: 1,
  },
  iconWrap: {
    width: 36, height: 36, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  title: { fontSize: 15, fontWeight: '700', flex: 1 },
  body: { padding: 16 },
});

// ─── Name Card ────────────────────────────────────────────────────────────────
const NameCard = memo(({
  item, language, setLanguage, isFavorite, isBookmarked,
  onFavorite, onBookmark, onShare, isDark, progressAnim, fadeAnim,
  panHandlers,
}: {
  item: AsmaAlHusnaItem;
  language: Language;
  setLanguage: (l: Language) => void;
  isFavorite: boolean;
  isBookmarked: boolean;
  onFavorite: () => void;
  onBookmark: () => void;
  onShare: () => void;
  isDark: boolean;
  progressAnim: Animated.Value;
  fadeAnim: Animated.Value;
  panHandlers: any;
}) => {
  const cardBg  = isDark ? '#1E293B' : '#FFFFFF';
  const textPri = isDark ? '#F8FAFC' : '#1E293B';
  const textSec = isDark ? '#94A3B8' : '#64748B';
  const borderC = isDark ? '#334155' : '#F1F5F9';

  const getText = (en: string, fr: string, ar: string) =>
    language === 'french' ? fr : language === 'arabic' ? ar : en;

  return (
    <View style={[nc.wrapper]} {...panHandlers}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={nc.scroll}>
        {/* Hero card */}
        <View style={nc.heroShadow}>
          <LinearGradient
            colors={isDark ? ['#064E3B', '#065F46'] : ['#065F46', '#059669']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={nc.hero}
          >
            <View style={nc.deco} pointerEvents="none">
              <View style={nc.decoC1} /><View style={nc.decoC2} />
            </View>

            {/* Number + actions */}
            <View style={nc.heroTop}>
              <View style={nc.numBadge}>
                <Text style={nc.numText}>{item.id}</Text>
              </View>
              <View style={nc.actions}>
                <TouchableOpacity
                  style={[nc.actionBtn, isBookmarked && nc.actionBookmark]}
                  onPress={onBookmark} activeOpacity={0.75}>
                  <Bookmark
                    color={isBookmarked ? '#F59E0B' : '#FFFFFF'}
                    size={18} strokeWidth={2}
                    fill={isBookmarked ? '#F59E0B' : 'transparent'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[nc.actionBtn, isFavorite && nc.actionFav]}
                  onPress={onFavorite} activeOpacity={0.75}>
                  <Heart
                    color={isFavorite ? '#F87171' : '#FFFFFF'}
                    size={18} strokeWidth={2}
                    fill={isFavorite ? '#F87171' : 'transparent'}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={nc.actionBtn} onPress={onShare} activeOpacity={0.75}>
                  <Share2 color="#FFFFFF" size={18} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Arabic + transliteration */}
            <Animated.View style={[nc.nameBlock, { opacity: fadeAnim }]}>
              <Text style={nc.arabicName}>{item.arabic}</Text>
              <Text style={nc.transliteration}>{item.transliteration}</Text>
            </Animated.View>

            {/* Language selector */}
            <View style={nc.langRow}>
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

            <Text style={nc.mainTranslation}>
              {getText(item.english, item.french, item.arabic)}
            </Text>

            {/* Progress strip */}
            <View style={nc.progressStrip}>
              <Animated.View style={[
                nc.progressFill,
                { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }
              ]} />
            </View>
          </LinearGradient>
        </View>

        {/* Quranic Reference */}
        <SectionCard
          icon={<BookOpen color="#059669" size={18} strokeWidth={2} />}
          title="Quranic Reference"
          bg={cardBg} border={borderC}
        >
          <Text style={[nc.arabicVerse, { color: textPri }]}>{item.verse.arabic}</Text>
          <View style={[nc.divider, { backgroundColor: borderC }]} />
          <Text style={[nc.verseTranslation, { color: textSec }]}>
            {getText(item.verse.english, item.verse.french, item.verse.arabic)}
          </Text>
          <Text style={nc.verseRef}>{item.verse.reference}</Text>
        </SectionCard>

        {/* Reflection */}
        <SectionCard
          icon={<Quote color="#7C3AED" size={18} strokeWidth={2} />}
          title="Spiritual Reflection"
          bg={cardBg} border={borderC}
          accent="#7C3AED"
        >
          <Text style={[nc.bodyText, { color: textSec }]}>
            {getText(item.meditation.english, item.meditation.french, item.meditation.english)}
          </Text>
        </SectionCard>

        {/* Invocation */}
        <SectionCard
          icon={<Star color="#D97706" size={18} strokeWidth={2} />}
          title="Suggested Invocation"
          bg={cardBg} border={borderC}
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
  scroll: { paddingTop: 16 },
  heroShadow: {
    borderRadius: 24, marginBottom: 16,
    shadowColor: '#059669', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25, shadowRadius: 20, elevation: 14,
    overflow: 'hidden',
  },
  hero: { padding: 24 },
  deco: { ...StyleSheet.absoluteFillObject },
  decoC1: {
    position: 'absolute', top: -40, right: -40,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  decoC2: {
    position: 'absolute', bottom: -20, left: 40,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  numBadge: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },
  numText: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  actionFav:      { backgroundColor: 'rgba(248,113,113,0.22)', borderColor: 'rgba(248,113,113,0.4)' },
  actionBookmark: { backgroundColor: 'rgba(245,158,11,0.22)',  borderColor: 'rgba(245,158,11,0.4)'  },
  nameBlock: { alignItems: 'center', marginBottom: 20 },
  arabicName: {
    fontSize: 58, fontWeight: '900', color: '#FFFFFF',
    textAlign: 'center', marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6,
    lineHeight: 70,
  },
  transliteration: {
    fontSize: 20, color: 'rgba(255,255,255,0.92)',
    fontStyle: 'italic', fontWeight: '600', letterSpacing: 0.5,
  },
  langRow: {
    flexDirection: 'row', gap: 6, alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20, padding: 4, marginBottom: 16,
  },
  langBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16 },
  langBtnActive: { backgroundColor: 'rgba(255,255,255,0.28)' },
  langTxt: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.75)' },
  langTxtActive: { color: '#FFFFFF' },
  mainTranslation: {
    fontSize: 22, fontWeight: '700', color: '#FFFFFF',
    textAlign: 'center', lineHeight: 30, marginBottom: 20,
  },
  progressStrip: {
    height: 4, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#FCD34D', borderRadius: 2 },
  arabicVerse: {
    fontSize: 20, textAlign: 'center', lineHeight: 34,
    fontWeight: '600', marginBottom: 12,
  },
  divider: { height: 1, marginVertical: 12 },
  verseTranslation: {
    fontSize: 15, textAlign: 'center', lineHeight: 23,
    fontStyle: 'italic', marginBottom: 10,
  },
  verseRef: { fontSize: 13, color: '#059669', textAlign: 'center', fontWeight: '700' },
  bodyText: { fontSize: 15, lineHeight: 24, textAlign: 'justify' },
  invocBox: {
    backgroundColor: '#F0FDF4', borderRadius: 14,
    padding: 16, gap: 10,
  },
  invocBoxDark: { backgroundColor: '#042F20' },
  invocArabic: {
    fontSize: 17, textAlign: 'center', lineHeight: 28, fontWeight: '600',
  },
  invocTrans: {
    fontSize: 13, textAlign: 'center', fontStyle: 'italic', lineHeight: 20,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function NamesScreen() {
  const { state }          = useApp();
  // const { setActions, clearActions } = useHeaderActions();

  const [currentIndex,   setCurrentIndex]   = useState(0);
  const [language,       setLanguage]        = useState<Language>('english');
  const [favorites,      setFavorites]       = useState<Set<number>>(new Set());
  const [bookmarks,      setBookmarks]       = useState<Set<number>>(new Set());
  const [isDark,         setIsDark]          = useState(state.settings.darkMode);
  const [isPlaying,      setIsPlaying]       = useState(false);
  const [autoPlay,       setAutoPlay]        = useState(false);
  const [isMuted,        setIsMuted]         = useState(false);
  const [speed,          setSpeed]           = useState(1.0);
  const [showSpeed,      setShowSpeed]       = useState(false);
  const [showOptions,    setShowOptions]     = useState(false);

  const listRef      = useRef<FlatList>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim     = useRef(new Animated.Value(1)).current;
  const scaleAnim    = useRef(new Animated.Value(1)).current;

  // ─── Pulse arabic name ───────────────────────────────────────────────────
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.82, duration: 3000, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1,    duration: 3000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // ─── Progress bar ────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / asmaAlHusna.length,
      duration: 450, useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  // ─── Auto-play ───────────────────────────────────────────────────────────
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

  const goToNext     = useCallback(() => {
    if (currentIndex < asmaAlHusna.length - 1) { haptic(); scrollTo(currentIndex + 1); }
  }, [currentIndex, scrollTo]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) { haptic(); scrollTo(currentIndex - 1); }
  }, [currentIndex, scrollTo]);

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
    setIsPlaying(next);
    setAutoPlay(next);
  }, [isPlaying]);

  const shareCurrentName = useCallback(() => {
    const n = asmaAlHusna[currentIndex];
    console.log(`Sharing: ${n.arabic} - ${n.transliteration}`);
  }, [currentIndex]);

  const handleResetAll = useCallback(() => {
    haptic('heavy');
    Alert.alert(
      'Reset all data',
      'This will clear all your favorites and bookmarks.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset', style: 'destructive',
          onPress: () => {
            setFavorites(new Set()); setBookmarks(new Set());
            scrollTo(0); setShowOptions(false);
          },
        },
      ]
    );
  }, [scrollTo]);

  // ─── Inject actions into MinimalHeader via Context ───────────────────────
    useRegisterHeaderActions('/names', ([
      // Counter (display only - non-destructive, tap does nothing)
      {
        key: 'counter',
        label: `Name ${currentIndex + 1} of ${asmaAlHusna.length}`,
        icon: <Hash color="#059669" size={18} strokeWidth={2} />,
        onPress: () => {},
        dividerAfter: true,
      },
      // Dark mode toggle
      {
        key: 'darkmode',
        label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        icon: isDark
          ? <Sun  color="#D97706" size={18} strokeWidth={2} />
          : <Moon color="#7C3AED" size={18} strokeWidth={2} />,
        onPress: () => { haptic('medium'); setIsDark(d => !d); },
        dividerAfter: false,
      },
      // Speed
      {
        key: 'speed',
        label: `Playback Speed: ${speed}×`,
        icon: <Zap color="#0891B2" size={18} strokeWidth={2} />,
        onPress: () => { haptic(); setShowSpeed(true); },
        dividerAfter: false,
      },
      // Mute
      {
        key: 'mute',
        label: isMuted ? 'Unmute Audio' : 'Mute Audio',
        icon: isMuted
          ? <VolumeX color="#64748B" size={18} strokeWidth={2} />
          : <Volume2 color="#64748B" size={18} strokeWidth={2} />,
        onPress: () => { haptic(); setIsMuted(m => !m); },
        dividerAfter: true,
      },
      // Go to beginning
      {
        key: 'beginning',
        label: 'Back to beginning',
        icon: <SkipBack color="#059669" size={18} strokeWidth={2} />,
        onPress: () => { scrollTo(0); },
        dividerAfter: false,
      },
      // Random
      {
        key: 'random',
        label: 'Random name',
        icon: <Shuffle color="#7C3AED" size={18} strokeWidth={2} />,
        onPress: () => { scrollTo(Math.floor(Math.random() * asmaAlHusna.length)); },
        dividerAfter: true,
      },
      // Reset all (destructive)
      {
        key: 'reset',
        label: 'Reset all data',
        icon: <Settings color="#EF4444" size={18} strokeWidth={2} />,
        onPress: handleResetAll,
        destructive: true,
      },
    ]));
  // ─── Pan responder ───────────────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > Math.abs(gs.dy) && Math.abs(gs.dx) > 20,
      onPanResponderMove: (_, gs) =>
        scaleAnim.setValue(Math.max(0.94, 1 - Math.abs(gs.dx) / (width * 2.5))),
      onPanResponderRelease: (_, gs) => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
        if      (gs.dx >  50 && currentIndex > 0)                       goToPrevious();
        else if (gs.dx < -50 && currentIndex < asmaAlHusna.length - 1)  goToNext();
      },
    })
  ).current;

  // ─── Derived ─────────────────────────────────────────────────────────────
  const pct    = Math.round(((currentIndex + 1) / asmaAlHusna.length) * 100);
  const bg     = isDark ? '#0F172A' : '#F8FAFC';
  const ctrlBg = isDark ? '#1E293B' : '#FFFFFF';
  const textSec = isDark ? '#94A3B8' : '#64748B';
  const border  = isDark ? '#334155' : '#E2E8F0';

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>

      {/* ── Cards ── */}
      <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
        <FlatList
          ref={listRef}
          data={asmaAlHusna}
          renderItem={({ item }) => (
            <NameCard
              item={item}
              language={language}
              setLanguage={setLanguage}
              isFavorite={favorites.has(item.id)}
              isBookmarked={bookmarks.has(item.id)}
              onFavorite={() => toggleFavorite(item.id)}
              onBookmark={() => toggleBookmark(item.id)}
              onShare={shareCurrentName}
              isDark={isDark}
              progressAnim={progressAnim}
              fadeAnim={fadeAnim}
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

      {/* ── Bottom Controls ── */}
      <View style={[styles.ctrlWrap, { backgroundColor: ctrlBg, borderTopColor: border }]}>
        {/* Progress */}
        <View style={styles.progressRow}>
          <View style={[styles.progressTrack, isDark && styles.progressTrackDark]}>
            <Animated.View style={[
              styles.progressFill,
              { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }
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
          {/* Auto */}
          <TouchableOpacity
            style={[styles.sideBtn, autoPlay && styles.sideBtnActive, isDark && styles.sideBtnDark]}
            onPress={() => { haptic('medium'); setAutoPlay(a => { const n = !a; setIsPlaying(n); return n; }); }}
            activeOpacity={0.75}
          >
            <Zap color={autoPlay ? '#059669' : textSec} size={14} strokeWidth={2.5} />
            <Text style={[styles.sideBtnTxt, { color: autoPlay ? '#059669' : textSec }]}>AUTO</Text>
          </TouchableOpacity>

          {/* Prev */}
          <TouchableOpacity
            style={[styles.navBtn, isDark && styles.navBtnDark, currentIndex === 0 && styles.navBtnDis]}
            onPress={goToPrevious} disabled={currentIndex === 0} activeOpacity={0.75}>
            <SkipBack
              color={currentIndex === 0 ? (isDark ? '#475569' : '#CBD5E1') : '#059669'}
              size={22} strokeWidth={2.5}
            />
          </TouchableOpacity>

          {/* Play / Pause */}
          <TouchableOpacity style={styles.playBtn} onPress={togglePlay} activeOpacity={0.85}>
            <LinearGradient
              colors={isPlaying ? ['#F59E0B', '#D97706'] : ['#10B981', '#059669']}
              style={styles.playGrad}>
              {isPlaying
                ? <Pause color="#FFFFFF" size={28} strokeWidth={2.5} />
                : <Play  color="#FFFFFF" size={28} strokeWidth={2.5} />
              }
            </LinearGradient>
          </TouchableOpacity>

          {/* Next */}
          <TouchableOpacity
            style={[styles.navBtn, isDark && styles.navBtnDark, currentIndex === asmaAlHusna.length - 1 && styles.navBtnDis]}
            onPress={goToNext} disabled={currentIndex === asmaAlHusna.length - 1} activeOpacity={0.75}>
            <SkipForward
              color={currentIndex === asmaAlHusna.length - 1 ? (isDark ? '#475569' : '#CBD5E1') : '#059669'}
              size={22} strokeWidth={2.5}
            />
          </TouchableOpacity>

          {/* Speed */}
          <TouchableOpacity
            style={[styles.sideBtn, showSpeed && styles.sideBtnActive, isDark && styles.sideBtnDark]}
            onPress={() => { haptic(); setShowSpeed(s => !s); }}
            activeOpacity={0.75}
          >
            <Text style={[styles.sideBtnTxt, { color: showSpeed ? '#059669' : textSec }]}>
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
              style={[styles.speedOpt, speed === opt.value && styles.speedOptActive]}
              onPress={() => { haptic(); setSpeed(opt.value); setShowSpeed(false); }}
              activeOpacity={0.75}
            >
              <Text style={[styles.speedLbl, speed === opt.value && styles.speedLblActive]}>
                {opt.label}
              </Text>
              <Text style={styles.speedSec}>{Math.round(opt.ms / 1000)}s/name</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>

      {/* ── Options Sheet (kept for programmatic access) ── */}
      <BottomSheet visible={showOptions} onClose={() => setShowOptions(false)} title="Options">
        <View style={styles.optionsList}>
          {[
            { icon: <SkipBack color="#059669" size={20} strokeWidth={2} />, label: 'Back to beginning', onPress: () => { scrollTo(0); setShowOptions(false); } },
            { icon: <Shuffle  color="#7C3AED" size={20} strokeWidth={2} />, label: 'Random name',       onPress: () => { scrollTo(Math.floor(Math.random() * asmaAlHusna.length)); setShowOptions(false); } },
            { icon: <Volume2  color="#0891B2" size={20} strokeWidth={2} />, label: isMuted ? 'Unmute' : 'Mute', onPress: () => { setIsMuted(m => !m); setShowOptions(false); } },
            { icon: <Settings color="#EF4444" size={20} strokeWidth={2} />, label: 'Reset all data',    onPress: handleResetAll, danger: true },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.optionRow} onPress={item.onPress} activeOpacity={0.7}>
              <View style={styles.optionIcon}>{item.icon}</View>
              <Text style={[styles.optionLbl, (item as any).danger && styles.optionDanger]}>
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

  // Bottom controls
  ctrlWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 18,
    borderTopWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 10,
  },
  progressRow: { marginBottom: 16 },
  progressTrack: {
    height: 6, backgroundColor: '#E2E8F0', borderRadius: 3,
    overflow: 'hidden', marginBottom: 8,
  },
  progressTrackDark: { backgroundColor: '#334155' },
  progressFill: { height: '100%', backgroundColor: '#059669', borderRadius: 3 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaTxt: { fontSize: 12, fontWeight: '600' },

  ctrlRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 14, backgroundColor: '#F8FAFC',
    borderWidth: 1.5, borderColor: '#E2E8F0', minWidth: 54,
    justifyContent: 'center',
  },
  sideBtnDark: { backgroundColor: '#1E293B', borderColor: '#334155' },
  sideBtnActive: { backgroundColor: '#F0FDF4', borderColor: '#A7F3D0' },
  sideBtnTxt: { fontSize: 11, fontWeight: '800', letterSpacing: 0.4 },
  navBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#D1FAE5',
  },
  navBtnDark: { backgroundColor: '#1E3A2F', borderColor: '#065F46' },
  navBtnDis:  { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', opacity: 0.5 },
  playBtn: {
    width: 68, height: 68, borderRadius: 34,
    shadowColor: '#059669', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 14, elevation: 12,
  },
  playGrad: { flex: 1, borderRadius: 34, justifyContent: 'center', alignItems: 'center' },

  // Speed sheet
  speedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 8 },
  speedOpt: {
    flex: 1, minWidth: '30%', maxWidth: '32%',
    paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC', alignItems: 'center',
  },
  speedOptActive: { borderColor: '#059669', backgroundColor: '#F0FDF4' },
  speedLbl: { fontSize: 16, fontWeight: '800', color: '#374151', marginBottom: 3 },
  speedLblActive: { color: '#059669' },
  speedSec: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },

  // Options sheet
  optionsList: { gap: 4, paddingBottom: 8 },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, paddingHorizontal: 4, borderRadius: 12,
  },
  optionIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center',
  },
  optionLbl: { fontSize: 15, fontWeight: '600', color: '#1E293B', flex: 1 },
  optionDanger: { color: '#EF4444' },
});