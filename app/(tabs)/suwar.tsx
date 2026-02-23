import React, {
  useState, useCallback, useRef, useEffect, useContext, useMemo, memo,
} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList,
  Animated, Dimensions, Platform, TextInput, Modal, Pressable,
  PanResponder, Share, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  Search, Heart, Bookmark, Share2, ChevronLeft, ChevronRight,
  X, Filter, BookOpen, Eye, Star, MapPin, Layers,
} from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';
import MinimalHeader from '../../components/MinimalHeader';
import {
  suwar, Surah, SurahCategory,
  SURAH_CATEGORY_LABELS, SURAH_CATEGORY_COLORS, SURAH_CATEGORY_GRADIENTS,
  REVELATION_COLORS, ALL_SURAH_CATEGORIES, BISMILLAH, ISTI_ADHA,
} from '../../data/suwar';

const { width, height } = Dimensions.get('window');

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
        <LinearGradient colors={['#1E1B4B', '#312E81', '#1E3A8A']} style={ob.gradient}>
          <View style={ob.circle1} /><View style={ob.circle2} /><View style={ob.circle3} />

          <Text style={ob.isti}>{ISTI_ADHA}</Text>
          <Text style={ob.bismillah}>{BISMILLAH}</Text>

          <LinearGradient
            colors={['transparent', '#F59E0B', '#FDE68A', '#F59E0B', 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={ob.goldLine}
          />

          <Text style={ob.title}>سُوَر القُرْآن الكَرِيم</Text>
          <Text style={ob.subtitle}>114 Surahs of the Holy Qur'an</Text>
          <Text style={ob.desc}>
            The Qur'an is Allah's speech, preserved perfectly across fourteen centuries.{'\n'}
            Each surah is a door. Open it with presence.
          </Text>

          <View style={ob.statsRow}>
            {[
              { n: '114', l: 'Surahs' },
              { n: '30', l: 'Juz' },
              { n: '6,236', l: 'Verses' },
            ].map(s => (
              <View key={s.l} style={ob.stat}>
                <Text style={ob.statNum}>{s.n}</Text>
                <Text style={ob.statLabel}>{s.l}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={ob.btn} onPress={onClose} activeOpacity={0.85}>
            <Text style={ob.btnText}>Begin Meditation  ✦</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
});

const ob = StyleSheet.create({
  overlay:   { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 999, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card:      { width: '100%', borderRadius: 28, overflow: 'hidden' },
  gradient:  { padding: 28, alignItems: 'center', gap: 10, overflow: 'hidden' },
  circle1:   { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.04)', top: -70, right: -60 },
  circle2:   { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -30, left: -20 },
  circle3:   { position: 'absolute', width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.05)', top: 40, left: 30 },
  isti:      { fontSize: 12, color: 'rgba(209,213,219,0.75)', textAlign: 'center', lineHeight: 22 },
  bismillah: { fontSize: 17, color: 'rgba(253,230,138,0.9)', textAlign: 'center', fontWeight: '600' },
  goldLine:  { height: 2, width: '100%', opacity: 0.65 },
  title:     { fontSize: 30, color: '#FFFFFF', textAlign: 'center', fontWeight: '900', lineHeight: 46 },
  subtitle:  { fontSize: 13, color: 'rgba(199,210,254,0.9)', textAlign: 'center', fontWeight: '600', letterSpacing: 0.5 },
  desc:      { fontSize: 13, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 20, fontStyle: 'italic' },
  statsRow:  { flexDirection: 'row', gap: 24, marginVertical: 8 },
  stat:      { alignItems: 'center' },
  statNum:   { fontSize: 22, fontWeight: '900', color: '#F59E0B' },
  statLabel: { fontSize: 10, fontWeight: '600', color: 'rgba(199,210,254,0.7)', textTransform: 'uppercase', letterSpacing: 0.8 },
  btn:       { backgroundColor: 'rgba(245,158,11,0.9)', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 18, marginTop: 6 },
  btnText:   { fontSize: 15, fontWeight: '800', color: '#1C1000', letterSpacing: 0.3 },
});

// ─── Deep Meditation Modal ────────────────────────────────────────────────────

const SurahMeditationModal = memo(({
  visible, surah, onClose, onPrev, onNext, hasPrev, hasNext,
}: {
  visible: boolean; surah: Surah | null;
  onClose: () => void; onPrev: () => void; onNext: () => void;
  hasPrev: boolean; hasNext: boolean;
}) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const glowAnim  = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowLoop  = useRef<Animated.CompositeAnimation | null>(null);
  const floatLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0); scaleAnim.setValue(0.92); glowAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, damping: 18, stiffness: 180, useNativeDriver: true }),
      ]).start(() => {
        glowLoop.current = Animated.loop(Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]));
        glowLoop.current.start();
        floatLoop.current = Animated.loop(Animated.sequence([
          Animated.timing(floatAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(floatAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]));
        floatLoop.current.start();
      });
    } else {
      glowLoop.current?.stop(); floatLoop.current?.stop();
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.92, duration: 250, useNativeDriver: true }),
      ]).start();
    }
    return () => { glowLoop.current?.stop(); floatLoop.current?.stop(); };
  }, [visible]);

  const handleNav = useCallback((fn: () => void) => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, damping: 18, stiffness: 200, useNativeDriver: true }),
    ]).start();
    fn();
  }, [scaleAnim]);

  if (!surah) return null;

  const accent    = SURAH_CATEGORY_COLORS[surah.category];
  const catLabel  = SURAH_CATEGORY_LABELS[surah.category];
  const revColor  = REVELATION_COLORS[surah.revelation];
  const glowScale = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] });
  const glowOp    = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.35] });
  const floatY    = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[mm.backdrop, { opacity: fadeAnim }]}>

        {/* Radial glow */}
        <Animated.View style={[mm.glow, { backgroundColor: accent, opacity: glowOp, transform: [{ scale: glowScale }] }]} />

        <Animated.View style={[mm.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity style={mm.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X color="#FFFFFF" size={20} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Number badge */}
          <View style={[mm.numberWrap, { borderColor: accent + '60' }]}>
            <Text style={[mm.numberText, { color: accent }]}>
              {String(surah.id).padStart(3, '0')}  ·  114
            </Text>
          </View>

          {/* Gold line */}
          <LinearGradient
            colors={['transparent', '#F59E0B', '#FDE68A', '#F59E0B', 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={mm.goldLine}
          />

          {/* Floating Arabic name */}
          <Animated.Text style={[mm.arabic, { transform: [{ translateY: floatY }], textShadowColor: accent, textShadowRadius: 30, textShadowOffset: { width: 0, height: 0 } }]}>
            {surah.arabic}
          </Animated.Text>

          {/* Divider */}
          <View style={[mm.divider, { backgroundColor: accent + '40' }]} />

          {/* Transliteration */}
          <Text style={[mm.transliteration, { color: accent }]}>{surah.transliteration}</Text>

          {/* English meaning */}
          <Text style={mm.translation}>{surah.english}</Text>

          {/* Meta chips */}
          <View style={mm.metaRow}>
            <View style={[mm.chip, { backgroundColor: accent + '20', borderColor: accent + '50' }]}>
              <Text style={[mm.chipText, { color: accent }]}>{catLabel.toUpperCase()}</Text>
            </View>
            <View style={[mm.chip, { backgroundColor: revColor + '20', borderColor: revColor + '50' }]}>
              <Text style={[mm.chipText, { color: revColor }]}>{surah.revelation.toUpperCase()}</Text>
            </View>
            <View style={mm.chip}>
              <Text style={mm.chipText}>{surah.verses} VERSES</Text>
            </View>
          </View>

          {/* Opening verse */}
          <View style={[mm.verseWrap, { borderColor: accent + '35', backgroundColor: accent + '0C' }]}>
            <Text style={mm.verseLabel}>Opening Verse</Text>
            <Text style={[mm.verseArabic, { color: '#FFFFFF' }]}>{surah.openingVerse}</Text>
            <Text style={mm.verseTrans}>{surah.openingTrans}</Text>
          </View>

          {/* Reflection */}
          <ScrollView style={mm.reflectScroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
            <Text style={[mm.reflectTitle, { color: accent }]}>✦  Reflection</Text>
            <Text style={mm.reflectText}>{surah.reflection}</Text>
            {surah.virtue && (
              <View style={[mm.virtuePill, { borderColor: '#F59E0B40', backgroundColor: '#F59E0B0F' }]}>
                <Star color="#F59E0B" size={11} strokeWidth={2} fill="#F59E0B" />
                <Text style={mm.virtueText}>{surah.virtue}</Text>
              </View>
            )}
          </ScrollView>

          {/* Navigation */}
          <View style={mm.nav}>
            <TouchableOpacity style={[mm.navBtn, !hasPrev && mm.navBtnDisabled]} onPress={() => handleNav(onPrev)} disabled={!hasPrev} activeOpacity={0.7}>
              <ChevronLeft color={hasPrev ? '#FFFFFF' : '#334155'} size={22} strokeWidth={2.5} />
            </TouchableOpacity>
            <View style={mm.navCenter}>
              <Text style={[mm.navLabel, { color: accent }]}>{catLabel.toUpperCase()}</Text>
            </View>
            <TouchableOpacity style={[mm.navBtn, !hasNext && mm.navBtnDisabled]} onPress={() => handleNav(onNext)} disabled={!hasNext} activeOpacity={0.7}>
              <ChevronRight color={hasNext ? '#FFFFFF' : '#334155'} size={22} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
});

const mm = StyleSheet.create({
  backdrop:      { flex: 1, backgroundColor: '#020817', justifyContent: 'center', alignItems: 'center' },
  glow:          { position: 'absolute', width: width * 1.2, height: width * 1.2, borderRadius: width * 0.6, top: height / 2 - width * 0.6 },
  content:       { width: width - 32, alignItems: 'center', paddingVertical: 32, paddingHorizontal: 22, maxHeight: height * 0.9 },
  closeBtn:      { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.10)', justifyContent: 'center', alignItems: 'center' },
  numberWrap:    { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 16 },
  numberText:    { fontSize: 11, fontWeight: '800', letterSpacing: 3, textTransform: 'uppercase' },
  goldLine:      { height: 1.5, width: '65%', opacity: 0.65, marginBottom: 20 },
  arabic:        { fontSize: 42, textAlign: 'center', lineHeight: 62, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1, marginBottom: 16 },
  divider:       { width: 50, height: 1, marginBottom: 14 },
  transliteration: { fontSize: 15, fontStyle: 'italic', fontWeight: '700', letterSpacing: 0.5, marginBottom: 8, textAlign: 'center' },
  translation:   { fontSize: 20, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', lineHeight: 30, marginBottom: 14, letterSpacing: -0.3 },
  metaRow:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' },
  chip:          { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.07)' },
  chipText:      { fontSize: 9, fontWeight: '800', letterSpacing: 1.2, color: 'rgba(255,255,255,0.6)' },
  verseWrap:     { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 16, width: '100%', alignItems: 'center', gap: 8 },
  verseLabel:    { fontSize: 9, fontWeight: '800', color: 'rgba(253,230,138,0.6)', textTransform: 'uppercase', letterSpacing: 1.5 },
  verseArabic:   { fontSize: 15, fontWeight: '600', textAlign: 'center', lineHeight: 28 },
  verseTrans:    { fontSize: 11, color: 'rgba(255,255,255,0.55)', textAlign: 'center', fontStyle: 'italic', lineHeight: 18 },
  reflectScroll: { width: '100%', maxHeight: 160, marginBottom: 20 },
  reflectTitle:  { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  reflectText:   { fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 22 },
  virtuePill:    { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 12, borderWidth: 1, borderRadius: 12, padding: 10 },
  virtueText:    { fontSize: 11, color: 'rgba(253,230,138,0.75)', lineHeight: 18, flex: 1, fontStyle: 'italic' },
  nav:           { flexDirection: 'row', alignItems: 'center', gap: 20 },
  navBtn:        { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center' },
  navBtnDisabled:{ backgroundColor: 'rgba(255,255,255,0.04)' },
  navCenter:     { flex: 1, alignItems: 'center' },
  navLabel:      { fontSize: 10, fontWeight: '800', letterSpacing: 2.5 },
});

// ─── Surah Card (browse view) ─────────────────────────────────────────────────

const SurahCard = memo(({
  surah, isFavorite, isBookmarked, onPress, onFavorite, onBookmark,
}: {
  surah: Surah; isFavorite: boolean; isBookmarked: boolean;
  onPress: () => void; onFavorite: () => void; onBookmark: () => void;
}) => {
  const accent   = SURAH_CATEGORY_COLORS[surah.category];
  const [g1, g2] = SURAH_CATEGORY_GRADIENTS[surah.category];
  const revColor = REVELATION_COLORS[surah.revelation];

  return (
    <TouchableOpacity style={sc.wrap} onPress={onPress} activeOpacity={0.88}>
      <LinearGradient colors={[g1, g2, accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={sc.card}>
        <View style={sc.deco1} /><View style={sc.deco2} />

        <View style={sc.topRow}>
          {/* Number + revelation */}
          <View style={sc.numBox}>
            <Text style={sc.numSub}>No.</Text>
            <Text style={sc.numMain}>{surah.id}</Text>
          </View>
          {/* Actions */}
          <View style={sc.actions}>
            <TouchableOpacity style={[sc.actionBtn, isBookmarked && sc.actionBookmark]} onPress={onBookmark} activeOpacity={0.75}>
              <Bookmark color={isBookmarked ? '#F59E0B' : '#FFFFFF'} size={13} fill={isBookmarked ? '#F59E0B' : 'transparent'} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={[sc.actionBtn, isFavorite && sc.actionFav]} onPress={onFavorite} activeOpacity={0.75}>
              <Heart color={isFavorite ? '#F87171' : '#FFFFFF'} size={13} fill={isFavorite ? '#F87171' : 'transparent'} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Gold shimmer */}
        <LinearGradient
          colors={['transparent', '#F59E0B', '#FDE68A', '#F59E0B', 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={sc.goldLine}
        />

        {/* Arabic name */}
        <Text style={sc.arabic}>{surah.arabic}</Text>
        <Text style={sc.translit}>{surah.transliteration}</Text>
        <Text style={sc.english}>{surah.english}</Text>

        {/* Bottom meta */}
        <View style={sc.bottomRow}>
          <View style={[sc.revBadge, { backgroundColor: revColor + '30', borderColor: revColor + '60' }]}>
            <MapPin color={revColor} size={9} strokeWidth={2.5} />
            <Text style={[sc.revText, { color: revColor }]}>{surah.revelation}</Text>
          </View>
          <View style={sc.versesBadge}>
            <Text style={sc.versesText}>{surah.verses} verses</Text>
          </View>
          <View style={sc.juzBadge}>
            <Text style={sc.juzText}>Juz {surah.juz}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
});

const sc = StyleSheet.create({
  wrap:         { marginHorizontal: 16, marginBottom: 12, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  card:         { padding: 18, gap: 8, overflow: 'hidden' },
  deco1:        { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.05)', top: -30, right: -20 },
  deco2:        { position: 'absolute', width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -20, left: 20 },
  topRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  numBox:       { backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center' },
  numSub:       { fontSize: 8, fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1 },
  numMain:      { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  actions:      { flexDirection: 'row', gap: 7 },
  actionBtn:    { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.14)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)', justifyContent: 'center', alignItems: 'center' },
  actionFav:    { backgroundColor: 'rgba(248,113,113,0.25)', borderColor: 'rgba(248,113,113,0.45)' },
  actionBookmark:{ backgroundColor: 'rgba(245,158,11,0.25)', borderColor: 'rgba(245,158,11,0.45)' },
  goldLine:     { height: 1, width: '100%', opacity: 0.5 },
  arabic:       { fontSize: 36, color: '#FFFFFF', fontWeight: '800', lineHeight: 52, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  translit:     { fontSize: 14, color: 'rgba(253,230,138,0.9)', fontWeight: '700', fontStyle: 'italic' },
  english:      { fontSize: 17, color: '#FFFFFF', fontWeight: '700', lineHeight: 24 },
  bottomRow:    { flexDirection: 'row', gap: 7, flexWrap: 'wrap', marginTop: 4 },
  revBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3 },
  revText:      { fontSize: 10, fontWeight: '700' },
  versesBadge:  { backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3 },
  versesText:   { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  juzBadge:     { backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3 },
  juzText:      { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.65)' },
});

// ─── List Item (compact view) ─────────────────────────────────────────────────

const SurahListItem = memo(({ surah, isFavorite, isBookmarked, onPress }: {
  surah: Surah; isFavorite: boolean; isBookmarked: boolean; onPress: () => void;
}) => {
  const accent   = SURAH_CATEGORY_COLORS[surah.category];
  const revColor = REVELATION_COLORS[surah.revelation];

  return (
    <TouchableOpacity style={li.row} onPress={onPress} activeOpacity={0.8}>
      <View style={[li.bar, { backgroundColor: accent }]} />
      <View style={[li.numBox, { backgroundColor: accent + '15' }]}>
        <Text style={[li.num, { color: accent }]}>{surah.id}</Text>
      </View>
      <View style={li.body}>
        <View style={li.titleRow}>
          <Text style={li.arabic}>{surah.arabic}</Text>
          <View style={[li.revDot, { backgroundColor: revColor }]} />
        </View>
        <Text style={li.translit}>{surah.transliteration}</Text>
        <Text style={li.english} numberOfLines={1}>{surah.english}  ·  {surah.verses}v  ·  Juz {surah.juz}</Text>
      </View>
      <View style={li.icons}>
        {isFavorite && <Heart size={12} color="#F87171" fill="#F87171" />}
        {isBookmarked && <Bookmark size={12} color="#F59E0B" fill="#F59E0B" />}
        {surah.virtue && <Star size={12} color={accent} fill={accent} />}
      </View>
    </TouchableOpacity>
  );
});

const li = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 8, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  bar:       { width: 4, alignSelf: 'stretch' },
  numBox:    { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center', margin: 10, flexShrink: 0 },
  num:       { fontSize: 13, fontWeight: '800' },
  body:      { flex: 1, paddingVertical: 11, paddingRight: 8 },
  titleRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  arabic:    { fontSize: 17, color: '#1E293B', fontWeight: '700', lineHeight: 26 },
  revDot:    { width: 6, height: 6, borderRadius: 3 },
  translit:  { fontSize: 11, color: '#7C3AED', fontWeight: '600', fontStyle: 'italic', marginBottom: 1 },
  english:   { fontSize: 11, color: '#64748B', fontWeight: '500' },
  icons:     { flexDirection: 'row', gap: 5, paddingRight: 14, alignItems: 'center' },
});

// ─── Filter Modal ─────────────────────────────────────────────────────────────

type ActiveFilter = SurahCategory | 'all' | 'meccan' | 'medinan' | 'favorites' | 'bookmarks';

const FilterModal = memo(({ visible, onClose, activeFilter, onSelectFilter }: {
  visible: boolean; onClose: () => void;
  activeFilter: ActiveFilter; onSelectFilter: (f: ActiveFilter) => void;
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

  const filters: Array<{ key: ActiveFilter; label: string; color: string; count: number }> = [
    { key: 'all',       label: 'All Surahs',     color: '#F59E0B', count: suwar.length },
    { key: 'meccan',    label: 'Meccan Surahs',  color: '#7C3AED', count: suwar.filter(s => s.revelation === 'Meccan').length },
    { key: 'medinan',   label: 'Medinan Surahs', color: '#059669', count: suwar.filter(s => s.revelation === 'Medinan').length },
    { key: 'favorites', label: 'Favorites',       color: '#F87171', count: 0 },
    { key: 'bookmarks', label: 'Bookmarks',       color: '#F59E0B', count: 0 },
    ...ALL_SURAH_CATEGORIES.map(k => ({
      key: k as ActiveFilter,
      label: SURAH_CATEGORY_LABELS[k],
      color: SURAH_CATEGORY_COLORS[k],
      count: suwar.filter(s => s.category === k).length,
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
          <Text style={fm.title}>Filter Surahs</Text>
          <TouchableOpacity onPress={onClose} style={fm.closeBtn}>
            <X color="#64748B" size={18} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={fm.scroll}>
          {filters.map(f => (
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
  sheet:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: Platform.OS === 'ios' ? 32 : 20, maxHeight: height * 0.78, overflow: 'hidden' },
  accent:     { height: 3, backgroundColor: '#1E40AF' },
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

const SuwarProgressBar = memo(({ current, total, surah }: { current: number; total: number; surah: Surah }) => {
  const pct   = Math.round((current / total) * 100);
  const color = SURAH_CATEGORY_COLORS[surah.category];
  return (
    <View style={pb.wrap}>
      <View style={pb.track}>
        <View style={[pb.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={pb.label}>{current} / {total}</Text>
    </View>
  );
});

const pb = StyleSheet.create({
  wrap:  { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 8 },
  track: { flex: 1, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 2 },
  label: { fontSize: 11, fontWeight: '700', color: '#94A3B8', minWidth: 44, textAlign: 'right' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

type ViewMode = 'cards' | 'list';

export default function SuwarScreen() {
  const { state } = useApp();
  const dark = state.settings.darkMode;
  const { handleBack } = useContext(LayoutActionsContext);

  const [viewMode,       setViewMode]       = useState<ViewMode>('list');
  const [currentIndex,   setCurrentIndex]   = useState(0);
  const [favorites,      setFavorites]      = useState<Set<number>>(new Set());
  const [bookmarks,      setBookmarks]      = useState<Set<number>>(new Set());
  const [filter,         setFilter]         = useState<ActiveFilter>('all');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [showOpening,    setShowOpening]    = useState(true);
  const [showFilter,     setShowFilter]     = useState(false);
  const [showSearch,     setShowSearch]     = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const flatRef   = useRef<FlatList<Surah>>(null);

  // ── Filtered surahs ──
  const filtered = useMemo(() => {
    let list = suwar;
    if      (filter === 'favorites')  list = list.filter(s => favorites.has(s.id));
    else if (filter === 'bookmarks')  list = list.filter(s => bookmarks.has(s.id));
    else if (filter === 'meccan')     list = list.filter(s => s.revelation === 'Meccan');
    else if (filter === 'medinan')    list = list.filter(s => s.revelation === 'Medinan');
    else if (filter !== 'all')        list = list.filter(s => s.category === (filter as SurahCategory));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.arabic.includes(searchQuery) ||
        s.transliteration.toLowerCase().includes(q) ||
        s.english.toLowerCase().includes(q) ||
        String(s.id) === q.trim()
      );
    }
    return list;
  }, [filter, searchQuery, favorites, bookmarks]);

  const currentSurah = filtered[currentIndex] ?? suwar[0];

  // ── Navigation ──
  const goNext = useCallback(() => {
    if (currentIndex < filtered.length - 1) {
      haptic();
      setCurrentIndex(i => i + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [currentIndex, filtered.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      haptic();
      setCurrentIndex(i => i - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [currentIndex]);

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
  const shareSurah = useCallback((s: Surah) => {
    Share.share({
      message: `📖 Surah ${s.transliteration} (${s.id}/114)\n${s.arabic}\n"${s.english}"\n${s.verses} verses · ${s.revelation}\n\n${s.openingVerse}\n\n${BISMILLAH}`,
      title: `Surah ${s.transliteration}`,
    });
  }, []);

  // ── Header actions ──
  const menuActions = useMemo(() => [
    { key: 'meditate', label: 'Deep Meditation',  icon: <Eye      color="#4C1D95" size={16} strokeWidth={2} />, onPress: () => setShowMeditation(true) },
    { key: 'cards',    label: 'Cards View',        icon: <Layers   color="#059669" size={16} strokeWidth={2} />, onPress: () => setViewMode('cards') },
    { key: 'list',     label: 'List View',         icon: <BookOpen color="#059669" size={16} strokeWidth={2} />, onPress: () => setViewMode('list') },
    { key: 'filter',   label: 'Filter Surahs',     icon: <Filter   color="#7C3AED" size={16} strokeWidth={2} />, onPress: () => setShowFilter(true), dividerAfter: true },
    { key: 'fav',      label: `Favorites (${favorites.size})`, icon: <Heart color="#F87171" size={16} strokeWidth={2} />, onPress: () => { setFilter('favorites'); setViewMode('list'); } },
    { key: 'bkm',      label: `Bookmarks (${bookmarks.size})`, icon: <Bookmark color="#F59E0B" size={16} strokeWidth={2} />, onPress: () => { setFilter('bookmarks'); setViewMode('list'); } },
  ], [favorites.size, bookmarks.size]);

  useRegisterHeaderActions('/suwar', menuActions);

  const subtitle = `${filtered.length === suwar.length ? '114' : filtered.length} Surahs`;

  return (
    <View style={[rs.root, dark && rs.rootDark]}>
      <MinimalHeader
        title="سُوَرُ القُرْآن"
        subtitle={subtitle}
        onBackPress={handleBack}
        showMore={true}
        menuActions={menuActions}
        theme="default"
      />

      {/* Search bar */}
      {showSearch && (
        <View style={ts.searchBar}>
          <Search color="#94A3B8" size={16} strokeWidth={2} />
          <TextInput
            style={ts.searchInput}
            placeholder="Search by name, meaning or number…"
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

      {/* Toolbar */}
      <View style={ts.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, flexDirection: 'row' }}>
          {/* Deep meditation */}
          <TouchableOpacity style={[ts.toolBtn, ts.toolBtnMeditate]} onPress={() => setShowMeditation(true)}>
            <Eye color="#FFFFFF" size={13} strokeWidth={2} />
            <Text style={[ts.toolBtnText, ts.toolBtnTextActive]}>Meditate</Text>
          </TouchableOpacity>
          {/* Cards view */}
          <TouchableOpacity style={[ts.toolBtn, viewMode === 'cards' && ts.toolBtnActive]} onPress={() => setViewMode('cards')}>
            <Layers color={viewMode === 'cards' ? '#FFFFFF' : '#64748B'} size={13} strokeWidth={2} />
            <Text style={[ts.toolBtnText, viewMode === 'cards' && ts.toolBtnTextActive]}>Cards</Text>
          </TouchableOpacity>
          {/* List view */}
          <TouchableOpacity style={[ts.toolBtn, viewMode === 'list' && ts.toolBtnActive]} onPress={() => setViewMode('list')}>
            <BookOpen color={viewMode === 'list' ? '#FFFFFF' : '#64748B'} size={13} strokeWidth={2} />
            <Text style={[ts.toolBtnText, viewMode === 'list' && ts.toolBtnTextActive]}>List</Text>
          </TouchableOpacity>
          <View style={ts.sep} />
          {/* Search */}
          <TouchableOpacity style={ts.toolBtn} onPress={() => setShowSearch(s => !s)}>
            <Search color="#64748B" size={13} strokeWidth={2} />
            <Text style={ts.toolBtnText}>Search</Text>
          </TouchableOpacity>
          {/* Filter */}
          <TouchableOpacity style={ts.toolBtn} onPress={() => setShowFilter(true)}>
            <Filter color="#1E40AF" size={13} strokeWidth={2} />
            <Text style={[ts.toolBtnText, { color: '#1E40AF' }]}>Filter</Text>
            {filter !== 'all' && <View style={ts.filterDot} />}
          </TouchableOpacity>
          {/* Favorites shortcut */}
          {favorites.size > 0 && (
            <TouchableOpacity style={ts.toolBtn} onPress={() => { setFilter('favorites'); setViewMode('list'); }}>
              <Heart color="#F87171" size={13} fill="#F87171" />
              <Text style={[ts.toolBtnText, { color: '#F87171' }]}>{favorites.size}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Progress bar when not in list mode */}
      {viewMode === 'cards' && (
        <SuwarProgressBar current={currentIndex + 1} total={filtered.length} surah={currentSurah} />
      )}

      {/* ── CARDS VIEW ── */}
      {viewMode === 'cards' ? (
        <>
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
          >
            <SurahCard
              surah={currentSurah}
              isFavorite={favorites.has(currentSurah.id)}
              isBookmarked={bookmarks.has(currentSurah.id)}
              onPress={() => setShowMeditation(true)}
              onFavorite={() => toggleFavorite(currentSurah.id)}
              onBookmark={() => toggleBookmark(currentSurah.id)}
            />

            {/* Reflection card */}
            <View style={[dc.reflectCard, { marginHorizontal: 16 }]}>
              <View style={[dc.reflectLine, { backgroundColor: SURAH_CATEGORY_COLORS[currentSurah.category] }]} />
              <Text style={dc.reflectTitle}>✦  Reflection</Text>
              <Text style={dc.reflectText}>{currentSurah.reflection}</Text>
              {currentSurah.virtue && (
                <View style={dc.virtuePill}>
                  <Star color="#F59E0B" size={11} strokeWidth={2} fill="#F59E0B" />
                  <Text style={dc.virtueText}>{currentSurah.virtue}</Text>
                </View>
              )}
            </View>

            {/* Opening verse card */}
            <View style={[dc.verseCard, { marginHorizontal: 16 }]}>
              <LinearGradient colors={['#1E1B4B', '#312E81']} style={dc.verseGradient}>
                <Text style={dc.verseLabel}>Opening Verse</Text>
                <LinearGradient
                  colors={['transparent', '#F59E0B', '#FDE68A', '#F59E0B', 'transparent']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={{ height: 1, opacity: 0.5, marginBottom: 10 }}
                />
                <Text style={dc.verseArabic}>{currentSurah.openingVerse}</Text>
                <Text style={dc.verseTrans}>{currentSurah.openingTrans}</Text>
              </LinearGradient>
            </View>

            {/* Share row */}
            <TouchableOpacity style={[dc.shareBtn, { marginHorizontal: 16 }]} onPress={() => shareSurah(currentSurah)} activeOpacity={0.8}>
              <Share2 color="#64748B" size={15} strokeWidth={2} />
              <Text style={dc.shareBtnText}>Share this Surah</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Bottom navigation bar */}
          <View style={nc.wrap}>
            <LinearGradient
              colors={['transparent', '#F59E0B', '#FDE68A', '#F59E0B', 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={nc.goldLine}
            />
            <View style={nc.row}>
              <TouchableOpacity
                style={[nc.navBtn, currentIndex === 0 && nc.navBtnDisabled]}
                onPress={goPrev} disabled={currentIndex === 0} activeOpacity={0.75}
              >
                <ChevronLeft color={currentIndex === 0 ? '#CBD5E1' : '#1E40AF'} size={22} strokeWidth={2.5} />
                <Text style={[nc.navLabel, currentIndex === 0 && nc.navLabelDis]}>Prev</Text>
              </TouchableOpacity>

              <View style={nc.center}>
                <Text style={nc.centerNum}>{currentIndex + 1}</Text>
                <Text style={nc.centerOf}>of {filtered.length}</Text>
                <TouchableOpacity onPress={() => setShowMeditation(true)} style={nc.meditateBtn}>
                  <Eye color="#4C1D95" size={12} strokeWidth={2} />
                  <Text style={nc.meditateBtnText}>Deep Meditate</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[nc.navBtn, currentIndex === filtered.length - 1 && nc.navBtnDisabled]}
                onPress={goNext} disabled={currentIndex === filtered.length - 1} activeOpacity={0.75}
              >
                <Text style={[nc.navLabel, currentIndex === filtered.length - 1 && nc.navLabelDis]}>Next</Text>
                <ChevronRight color={currentIndex === filtered.length - 1 ? '#CBD5E1' : '#1E40AF'} size={22} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        // ── LIST VIEW ──
        <FlatList
          ref={flatRef}
          data={filtered}
          keyExtractor={s => String(s.id)}
          renderItem={({ item, index }) => (
            <SurahListItem
              surah={item}
              isFavorite={favorites.has(item.id)}
              isBookmarked={bookmarks.has(item.id)}
              onPress={() => {
                setCurrentIndex(index);
                setShowMeditation(true);
              }}
            />
          )}
          ListHeaderComponent={(
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: dark ? '#F1F5F9' : '#1E293B', marginBottom: 4 }}>
                {filter === 'all' ? 'All 114 Surahs'
                  : filter === 'meccan' ? 'Meccan Surahs'
                  : filter === 'medinan' ? 'Medinan Surahs'
                  : filter === 'favorites' ? 'Favorites'
                  : filter === 'bookmarks' ? 'Bookmarks'
                  : SURAH_CATEGORY_LABELS[filter as SurahCategory]}
              </Text>
              <Text style={{ fontSize: 13, color: '#94A3B8' }}>{filtered.length} surahs found</Text>
            </View>
          )}
          ListEmptyComponent={(
            <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
              <Text style={{ fontSize: 40 }}>📖</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B' }}>No surahs found</Text>
              <Text style={{ fontSize: 13, color: '#94A3B8' }}>Try a different search or filter</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 4 }}
        />
      )}

      {/* ── Filter Modal ── */}
      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        activeFilter={filter}
        onSelectFilter={f => { setFilter(f); setCurrentIndex(0); }}
      />

      {/* ── Deep Meditation Modal ── */}
      <SurahMeditationModal
        visible={showMeditation}
        surah={currentSurah}
        onClose={() => setShowMeditation(false)}
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < filtered.length - 1}
      />

      {showOpening && <OpeningBanner onClose={() => setShowOpening(false)} />}
    </View>
  );
}

// ─── Root styles ──────────────────────────────────────────────────────────────
const rs = StyleSheet.create({
  root:     { flex: 1, backgroundColor: '#F8FAFC' },
  rootDark: { backgroundColor: '#0F172A' },
});

// ─── Detail card styles ───────────────────────────────────────────────────────
const dc = StyleSheet.create({
  reflectCard:  { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  reflectLine:  { height: 3, borderRadius: 2, marginBottom: 12, width: 40 },
  reflectTitle: { fontSize: 11, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  reflectText:  { fontSize: 14, color: '#475569', lineHeight: 22 },
  virtuePill:   { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 12, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 12, padding: 10 },
  virtueText:   { fontSize: 12, color: '#92400E', lineHeight: 18, flex: 1, fontStyle: 'italic' },
  verseCard:    { borderRadius: 20, overflow: 'hidden', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 6 },
  verseGradient:{ padding: 18, gap: 10 },
  verseLabel:   { fontSize: 9, fontWeight: '800', color: 'rgba(253,230,138,0.65)', textTransform: 'uppercase', letterSpacing: 1.5 },
  verseArabic:  { fontSize: 17, color: '#FFFFFF', fontWeight: '600', lineHeight: 32, textAlign: 'center' },
  verseTrans:   { fontSize: 12, color: 'rgba(199,210,254,0.8)', fontStyle: 'italic', textAlign: 'center', lineHeight: 18 },
  shareBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  shareBtnText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
});

// ─── Toolbar styles ───────────────────────────────────────────────────────────
const ts = StyleSheet.create({
  searchBar:          { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginTop: 10, backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1, borderColor: '#E2E8F0' },
  searchInput:        { flex: 1, fontSize: 14, color: '#1E293B' },
  toolbar:            { paddingVertical: 10 },
  toolBtn:            { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E2E8F0' },
  toolBtnActive:      { backgroundColor: '#1E40AF', borderColor: '#1E40AF' },
  toolBtnMeditate:    { backgroundColor: '#4C1D95', borderColor: '#4C1D95' },
  toolBtnText:        { fontSize: 12, fontWeight: '700', color: '#64748B' },
  toolBtnTextActive:  { color: '#FFFFFF' },
  sep:                { width: 1, backgroundColor: '#E2E8F0', marginHorizontal: 4, alignSelf: 'stretch' },
  filterDot:          { position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#1E40AF' },
});

// ─── Nav bar styles ───────────────────────────────────────────────────────────
const nc = StyleSheet.create({
  wrap:           { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', paddingBottom: Platform.OS === 'ios' ? 28 : 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 12 },
  goldLine:       { height: 2, opacity: 0.6 },
  row:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12 },
  navBtn:         { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, backgroundColor: '#EFF6FF', borderWidth: 1.5, borderColor: '#BFDBFE', minWidth: 80 },
  navBtnDisabled: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  navLabel:       { fontSize: 13, fontWeight: '700', color: '#1E40AF' },
  navLabelDis:    { color: '#CBD5E1' },
  center:         { alignItems: 'center', gap: 2 },
  centerNum:      { fontSize: 22, fontWeight: '900', color: '#1E293B', lineHeight: 26 },
  centerOf:       { fontSize: 10, fontWeight: '600', color: '#94A3B8' },
  meditateBtn:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, backgroundColor: '#F3E8FF', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  meditateBtnText:{ fontSize: 10, fontWeight: '700', color: '#4C1D95' },
});