import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, Platform,
  Animated, Pressable, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, BookOpen, MapPin, Star, Clock, Music2, Globe, Eye, EyeOff } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Nashid } from '../../data/library/types';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_H = SCREEN_H;

// ─── Multi-language translation type ─────────────────────────────────────────
export interface NashidTranslation {
  lang:  string;
  label: string;
  text:  string;
}

type NashidEx = Nashid & { translations?: NashidTranslation[] };

interface NashidDetailProps {
  nashid:  NashidEx | null;
  visible: boolean;
  onClose: () => void;
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function buildLangs(n: NashidEx): NashidTranslation[] {
  if (n.translations && n.translations.length > 0) return n.translations;
  if (n.translation) return [{ lang: 'fr', label: 'French', text: n.translation }];
  return [];
}

// ─── Annashid blue palette — hero & tabs only ─────────────────────────────────
const HERO_DARK   = '#082F49';
const NAVY        = '#0C4A6E';
const BLUE_MID    = '#0369A1';
const BLUE_LIGHT  = '#0284C7';
const BLUE_PALE   = '#BAE6FD';
const BLUE_DIM    = '#38BDF8';
const BLUE_MUTED  = '#7DD3FC';
const BORDER_HERO = 'rgba(3,105,161,0.35)';

// ─── Neutral body palette (matches PlaceDetail) ───────────────────────────────
const BODY_BG     = '#F8FAFC';
const BODY_TEXT   = '#374151';
const BODY_MUTED  = '#6B7280';
const BODY_BORDER = '#E2E8F0';
const SECTION_TXT = '#0369A1';   // annashid accent on white background
const TAG_BG      = '#EFF6FF';
const TAG_BORDER  = '#BFDBFE';
const TAG_TXT     = '#1D4ED8';
const SIG_BG      = '#F0F9FF';
const SIG_BORDER  = '#0369A1';

// ─── Ornament ─────────────────────────────────────────────────────────────────
function GeomOrnament({ size = 32, color = SECTION_TXT }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ position: 'absolute', width: size * 0.7, height: size * 0.7,
        borderWidth: 1, borderColor: color, transform: [{ rotate: '45deg' }], opacity: 0.4 }} />
      <View style={{ position: 'absolute', width: size * 0.35, height: size * 0.35,
        borderWidth: 1, borderColor: color, transform: [{ rotate: '45deg' }] }} />
      <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: color }} />
    </View>
  );
}

function OrnamentalDivider() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 14, paddingHorizontal: 4 }}>
      <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: BODY_BORDER }} />
      <GeomOrnament size={16} color={BODY_BORDER} />
      <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: BODY_BORDER }} />
    </View>
  );
}

// ─── Language selector ────────────────────────────────────────────────────────
function LangSelector({ langs, selected, onSelect }: {
  langs: NashidTranslation[]; selected: string; onSelect: (l: string) => void;
}) {
  if (langs.length <= 1) return null;
  return (
    <View style={ls.wrap}>
      <Globe size={12} color={BODY_MUTED} strokeWidth={2} />
      <Text style={ls.label}>Translation:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ls.pills}>
        {langs.map(t => (
          <TouchableOpacity
            key={t.lang}
            style={[ls.pill, selected === t.lang && ls.pillActive]}
            onPress={() => onSelect(t.lang)}
            activeOpacity={0.75}
          >
            <Text style={[ls.pillTxt, selected === t.lang && ls.pillTxtActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const ls = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingLeft: 12, paddingRight: 8, paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: BODY_BORDER,
  },
  label:         { fontSize: 10, fontWeight: '700', color: BODY_MUTED, letterSpacing: 0.5, textTransform: 'uppercase' },
  pills:         { flexDirection: 'row', gap: 6, paddingRight: 8 },
  pill:          { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: BODY_BORDER, backgroundColor: '#FFFFFF' },
  pillActive:    { backgroundColor: TAG_BG, borderColor: BLUE_LIGHT },
  pillTxt:       { fontSize: 12, fontWeight: '600', color: BODY_MUTED },
  pillTxtActive: { color: BLUE_MID },
});

// ─── Poem toolbar ─────────────────────────────────────────────────────────────
function PoemToolbar({ showAll, onToggleAll, versCount, coupletCount }: {
  showAll: boolean; onToggleAll: () => void;
  versCount: number; coupletCount: number;
}) {
  return (
    <View style={pt.row}>
      <View style={pt.badge}>
        <Text style={pt.badgeTxt}>{versCount} verses · {coupletCount} couplets</Text>
      </View>
      <View style={{ flex: 1 }} />
      <TouchableOpacity style={[pt.btn, showAll && pt.btnActive]} onPress={onToggleAll} activeOpacity={0.75}>
        {showAll
          ? <EyeOff size={12} color={BLUE_MID} strokeWidth={2} />
          : <Eye    size={12} color={BODY_MUTED} strokeWidth={2} />
        }
        <Text style={[pt.btnTxt, showAll && pt.btnTxtActive]}>
          {showAll ? 'Hide translation' : 'Show all'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const pt = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: BODY_BORDER,
    gap: 8,
  },
  badge:        { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10, backgroundColor: TAG_BG, borderWidth: 1, borderColor: TAG_BORDER },
  badgeTxt:     { fontSize: 10, fontWeight: '700', color: TAG_TXT, letterSpacing: 0.4 },
  btn:          { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: BODY_BORDER },
  btnActive:    { backgroundColor: TAG_BG, borderColor: BLUE_LIGHT },
  btnTxt:       { fontSize: 11, fontWeight: '600', color: BODY_MUTED },
  btnTxtActive: { color: BLUE_MID },
});

// ─── Couplet row ──────────────────────────────────────────────────────────────
function CoupletRow({ arabic, translation, index, isOpen, forceOpen, onPress }: {
  arabic: string; translation: string; index: number;
  isOpen: boolean; forceOpen: boolean; onPress: () => void;
}) {
  const transAnim = useRef(new Animated.Value(isOpen || forceOpen ? 1 : 0)).current;
  const showTrans = isOpen || forceOpen;

  useEffect(() => {
    Animated.timing(transAnim, {
      toValue: showTrans ? 1 : 0, duration: 180, useNativeDriver: true,
    }).start();
  }, [showTrans]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={forceOpen ? 1 : 0.75}
      style={[cr.row, (isOpen && !forceOpen) && cr.rowActive]}
    >
      <View style={cr.numWrap}>
        <Text style={cr.num}>{String(index + 1).padStart(2, '0')}</Text>
      </View>

      <View style={cr.body}>
        <Text style={cr.arabic}>{arabic}</Text>
        <Animated.View style={{ opacity: transAnim }}>
          {showTrans && translation ? (
            <>
              <View style={cr.divider} />
              <Text style={cr.translation}>{translation}</Text>
            </>
          ) : null}
        </Animated.View>
      </View>

      {!forceOpen && (
        <View style={cr.indWrap}>
          <View style={[cr.indDot, isOpen && cr.indDotOn]} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const cr = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingVertical: 11, paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BODY_BORDER,
    gap: 10,
  },
  rowActive: {
    backgroundColor: TAG_BG, borderRadius: 8,
    paddingHorizontal: 8, marginHorizontal: -4,
    borderBottomColor: TAG_BORDER,
  },
  numWrap:    { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: TAG_BORDER, justifyContent: 'center', alignItems: 'center', marginTop: 4, flexShrink: 0 },
  num:        { fontSize: 9, fontWeight: '700', color: BLUE_MID, letterSpacing: 0.4 },
  body:       { flex: 1 },
  arabic:     { fontSize: 17, color: BODY_TEXT, textAlign: 'right', writingDirection: 'rtl', lineHeight: 30, fontWeight: '500' },
  divider:    { height: 1, backgroundColor: BODY_BORDER, marginHorizontal: 24, marginTop: 8, marginBottom: 5 },
  translation:{ fontSize: 12, color: BODY_MUTED, fontStyle: 'italic', lineHeight: 19, textAlign: 'right' },
  indWrap:    { justifyContent: 'center', paddingTop: 14, flexShrink: 0 },
  indDot:     { width: 5, height: 5, borderRadius: 3, backgroundColor: BODY_BORDER },
  indDotOn:   { backgroundColor: BLUE_MID },
});

// ─── Main component ───────────────────────────────────────────────────────────
export default function NashidDetail({ nashid, visible, onClose }: NashidDetailProps) {
  const insets = useSafeAreaInsets();
  const topInset   = insets.top;          // exact safe area top
  const heroPadTop = insets.top + 52;     // status bar + generous breathing room
  const closeBtnTop = insets.top + 48;    // status bar + comfortable offset
  const [tab,     setTab]     = useState<'poem' | 'info'>('poem');
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [langKey, setLangKey] = useState('');
  const [mounted, setMounted] = useState(false);

  const translateY = useRef(new Animated.Value(SHEET_H)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  // Animate in/out
  useEffect(() => {
    if (visible) {
      setMounted(true);
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0, useNativeDriver: true,
            damping: 26, stiffness: 220, mass: 0.85,
          }),
          Animated.timing(opacity, {
            toValue: 1, duration: 200, useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SHEET_H, duration: 260, useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0, duration: 200, useNativeDriver: true,
        }),
      ]).start(() => {
        setMounted(false);
        setTab('poem'); setOpenIdx(null); setShowAll(false);
      });
    }
  }, [visible]);

  // Reset state when nashid changes (new item opened)
  useEffect(() => {
    if (visible && nashid) {
      setTab('poem'); setOpenIdx(null); setShowAll(false);
      const ls = buildLangs(nashid);
      setLangKey(ls.length > 0 ? ls[0].lang : '');
    }
  }, [nashid]);

  const langs    = useMemo(() => nashid ? buildLangs(nashid) : [], [nashid]);
  const activeTr = useMemo(() => langs.find(l => l.lang === langKey) ?? langs[0], [langs, langKey]);

  const arabicLines = useMemo(
    () => nashid?.arabicText ? nashid.arabicText.split('\n') : [],
    [nashid?.arabicText]
  );
  const transLines = useMemo(
    () => activeTr ? activeTr.text.split('\n') : [],
    [activeTr]
  );
  const couplets = useMemo(() => {
    const result: { arabic: string; trans: string }[] = [];
    for (let i = 0; i < arabicLines.length; i += 2) {
      result.push({
        arabic: arabicLines.slice(i, i + 2).join('\n'),
        trans:  transLines.slice(i, i + 2).join('\n'),
      });
    }
    return result;
  }, [arabicLines, transLines]);

  const toggleCouplet = useCallback((i: number) => {
    if (showAll) return;
    setOpenIdx(p => p === i ? null : i);
  }, [showAll]);

  const handleLangChange = useCallback((l: string) => {
    setLangKey(l); setOpenIdx(null);
  }, []);

  if (!mounted && !visible) return null;

  return (
    <Modal transparent visible={mounted} animationType="none" onRequestClose={onClose} statusBarTranslucent>

      {/* Backdrop */}
      <Animated.View style={[s.backdrop, { opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[s.sheet, { transform: [{ translateY }] }]}>
        {nashid && (
          <>
            {/* Close button — absolute on sheet, above hero */}
            <TouchableOpacity style={[s.closeBtn, { top: closeBtnTop }]} onPress={onClose} activeOpacity={0.7}>
              <X size={14} color={BLUE_MUTED} strokeWidth={2.5} />
            </TouchableOpacity>

            {/* ── HERO — annashid blue gradient ───────────────────────────── */}
            <LinearGradient colors={[HERO_DARK, NAVY, BLUE_MID]} style={[s.hero, { paddingTop: heroPadTop }]}>

              {nashid.arabicTitle ? (
                <Text style={s.heroArabic} numberOfLines={2}>{nashid.arabicTitle}</Text>
              ) : null}

              <View style={s.ornRow}>
                <View style={s.ornLine} />
                <View style={s.ornDot} />
                <View style={s.ornLine} />
              </View>

              <Text style={s.heroTitle} numberOfLines={1}>{nashid.title}</Text>

              <View style={s.heroMeta}>
                <Music2 size={10} color={BLUE_MUTED} strokeWidth={2} />
                <Text style={s.metaTxt} numberOfLines={1}>{nashid.composer}</Text>
                <View style={s.metaDot} />
                <MapPin size={10} color={BLUE_MUTED} strokeWidth={2} />
                <Text style={s.metaTxt} numberOfLines={1}>{nashid.origin}</Text>
              </View>

              <LinearGradient
                colors={['transparent', BLUE_LIGHT, BLUE_DIM, BLUE_LIGHT, 'transparent']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.heroLine}
              />
            </LinearGradient>

            {/* ── TABS ────────────────────────────────────────────────────── */}
            <View style={s.tabBar}>
              <TouchableOpacity style={[s.tab, tab === 'poem' && s.tabActive]} onPress={() => setTab('poem')} activeOpacity={0.8}>
                <BookOpen size={13} color={tab === 'poem' ? BLUE_DIM : BLUE_MUTED} strokeWidth={2} />
                <Text style={[s.tabTxt, tab === 'poem' && s.tabTxtActive]}>Poem</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.tab, tab === 'info' && s.tabActive]} onPress={() => setTab('info')} activeOpacity={0.8}>
                <Star size={13} color={tab === 'info' ? BLUE_DIM : BLUE_MUTED} strokeWidth={2} />
                <Text style={[s.tabTxt, tab === 'info' && s.tabTxtActive]}>About</Text>
              </TouchableOpacity>
            </View>

            {/* ── SUB-BAR ─────────────────────────────────────────────────── */}
            {tab === 'poem' && (
              <>
                <LangSelector langs={langs} selected={langKey} onSelect={handleLangChange} />
                <PoemToolbar
                  showAll={showAll}
                  onToggleAll={() => { setShowAll(v => !v); setOpenIdx(null); }}
                  versCount={arabicLines.length}
                  coupletCount={couplets.length}
                />
              </>
            )}

            {/* ── BODY ────────────────────────────────────────────────────── */}
            <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
              {tab === 'poem' ? (
                <>
                  {!showAll && (
                    <Text style={s.tapHint}>Tap a couplet to reveal the translation</Text>
                  )}
                  {couplets.map((c, i) => (
                    <CoupletRow
                      key={`${langKey}-${i}`}
                      arabic={c.arabic}
                      translation={c.trans}
                      index={i}
                      isOpen={openIdx === i}
                      forceOpen={showAll}
                      onPress={() => toggleCouplet(i)}
                    />
                  ))}
                  <View style={{ height: 48 }} />
                </>
              ) : (
                <>
                  <View style={s.infoCard}>
                    <View style={s.infoHeader}>
                      <GeomOrnament size={15} color={SECTION_TXT} />
                      <Text style={s.infoTitle}>Overview</Text>
                    </View>
                    <Text style={s.infoBody}>{nashid.fullDescription}</Text>
                  </View>

                  <OrnamentalDivider />

                  <View style={s.sigCard}>
                    <Star size={14} color={BLUE_MID} strokeWidth={2} style={{ marginTop: 1 }} />
                    <Text style={s.sigText}>{nashid.significance}</Text>
                  </View>

                  <OrnamentalDivider />

                  <View style={s.infoCard}>
                    <View style={s.infoHeader}>
                      <GeomOrnament size={15} color={SECTION_TXT} />
                      <Text style={s.infoTitle}>Themes</Text>
                    </View>
                    <View style={s.tagWrap}>
                      {nashid.themes.map(t => (
                        <View key={t} style={s.tag}><Text style={s.tagTxt}>{t}</Text></View>
                      ))}
                    </View>
                  </View>

                  <OrnamentalDivider />

                  <View style={s.infoCard}>
                    <View style={s.infoHeader}>
                      <GeomOrnament size={15} color={SECTION_TXT} />
                      <Text style={s.infoTitle}>When to Recite</Text>
                    </View>
                    {nashid.occasions.map((o, i) => (
                      <View key={i} style={s.occasionRow}>
                        <Clock size={12} color={BLUE_MID} strokeWidth={2} style={{ marginTop: 3 }} />
                        <Text style={s.occasionTxt}>{o}</Text>
                      </View>
                    ))}
                  </View>

                  {langs.length > 1 && (
                    <>
                      <OrnamentalDivider />
                      <View style={s.infoCard}>
                        <View style={s.infoHeader}>
                          <GeomOrnament size={15} color={SECTION_TXT} />
                          <Text style={s.infoTitle}>Available Translations</Text>
                        </View>
                        <View style={s.tagWrap}>
                          {langs.map(l => (
                            <View key={l.lang} style={s.tag}><Text style={s.tagTxt}>{l.label}</Text></View>
                          ))}
                        </View>
                      </View>
                    </>
                  )}

                  <View style={{ height: 48 }} />
                </>
              )}
            </ScrollView>
          </>
        )}
      </Animated.View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: BODY_BG,
    overflow: 'hidden',
  },

  // Hero — annashid blue, compact & clean
  hero: {
    paddingBottom: 0,
    paddingHorizontal: 20,
    overflow: 'hidden',
    alignItems: 'center',
  },

  closeBtn: {
    position: 'absolute', right: 14,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(3,105,161,0.2)', borderWidth: 1, borderColor: BORDER_HERO,
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },

  // Arabic title — large, centred, dominant
  heroArabic: {
    fontSize: 22, color: BLUE_PALE, textAlign: 'center',
    writingDirection: 'rtl', fontWeight: '700', lineHeight: 32,
    paddingHorizontal: 40, marginBottom: 8,
  },

  // Thin separator between Arabic and Latin
  ornRow:  { flexDirection: 'row', alignItems: 'center', width: '100%', gap: 8, marginBottom: 8 },
  ornLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: BLUE_DIM, opacity: 0.25 },
  ornDot:  { width: 4, height: 4, borderRadius: 2, backgroundColor: BLUE_DIM, opacity: 0.6 },

  // Latin subtitle — restrained
  heroTitle: {
    fontSize: 12, color: BLUE_MUTED, textAlign: 'center',
    fontStyle: 'italic', letterSpacing: 0.8, marginBottom: 10,
  },

  // Meta: simple inline row
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  metaTxt:  { fontSize: 11, color: BLUE_MUTED, fontWeight: '500', flexShrink: 1, maxWidth: 130 },
  metaDot:  { width: 3, height: 3, borderRadius: 2, backgroundColor: BLUE_MID, opacity: 0.7 },

  heroLine: { height: 1, opacity: 0.7, width: '100%' },

  // Tabs — annashid dark
  tabBar:       { flexDirection: 'row', backgroundColor: HERO_DARK, borderBottomWidth: 1, borderBottomColor: BORDER_HERO },
  tab:          { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive:    { borderBottomColor: BLUE_DIM },
  tabTxt:       { fontSize: 12, fontWeight: '600', color: BLUE_MUTED, letterSpacing: 0.3 },
  tabTxtActive: { color: BLUE_DIM },

  // Body — neutral light (matches PlaceDetail)
  scroll:        { flex: 1, backgroundColor: BODY_BG },
  scrollContent: { padding: 16 },

  tapHint: { fontSize: 10, color: BODY_MUTED, fontStyle: 'italic', textAlign: 'center', marginBottom: 10 },

  infoCard:   { marginBottom: 4 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  infoTitle:  { fontSize: 12, fontWeight: '800', color: SECTION_TXT, letterSpacing: 0.8, textTransform: 'uppercase' },
  infoBody:   { fontSize: 14, color: BODY_TEXT, lineHeight: 23 },

  sigCard: { flexDirection: 'row', gap: 10, backgroundColor: SIG_BG, borderRadius: 14, padding: 14, borderLeftWidth: 3, borderLeftColor: SIG_BORDER },
  sigText: { flex: 1, fontSize: 14, color: BODY_TEXT, lineHeight: 23, fontStyle: 'italic' },

  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag:     { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: TAG_BG, borderWidth: 1, borderColor: TAG_BORDER },
  tagTxt:  { fontSize: 11, fontWeight: '600', color: TAG_TXT },

  occasionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  occasionTxt: { flex: 1, fontSize: 14, color: BODY_TEXT, lineHeight: 22 },
});