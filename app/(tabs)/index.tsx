import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart, Star, Users, BookOpen, TrendingUp, Clock,
  Award, ChevronRight, Sparkles, Sun, Moon, LucideIcon,
} from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { openHadraMap } from '../../utils/OpenHadraMap';
import QuickActionsBar from '../../components/QuickActionsBar';
import PracticeCard from '../../components/PracticeCard';
import DailyProgressCard from '../../components/DailyProgressCard';
import CategoryHeader, { PracticeCategory } from '../../components/CategoryHeader';
import SpiritualHeader from '../../components/SpiritualHeader';
import FeaturedCard from '../../components/FeaturedCard';
import { useAppVersion }    from '@/hooks/useAppVersion';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';

// ─── Palette ──────────────────────────────────────────────────────────────────
const GREEN_DARK  = '#064E3B';
const GREEN_MID   = '#065F46';
const GREEN_LIGHT = '#047857';
const GOLD        = '#F59E0B';
const GOLD_LIGHT  = '#FDE68A';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PracticeCardData {
  id: string; title: string; arabicTitle: string; description: string;
  icon?: LucideIcon; image?: any; color: string; lightColor: string;
  route: string; time: string; priority: string; isNew?: boolean;
}
interface QuickAction {
  title: string; description: string;
  icon: LucideIcon; color: string; action: string;
}

const { width } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────
const ALL_PRACTICE_CARDS: PracticeCardData[] = [
  { id: 'wird',          title: 'Wird Tijāni',        arabicTitle: 'الوِرد التجاني',            description: 'Daily spiritual practice',        icon: Heart,    color: '#DC2626', lightColor: '#FEE2E2', route: '/wird',          time: 'Morning & Evening',       priority: 'high'   },
  { id: 'wazifa',        title: 'Wazīfa Tijāniyya',   arabicTitle: 'الوَظِيفَة التِّجَانِيَّة', description: 'Daily spiritual practice',        icon: Star,     color: '#D97706', lightColor: '#FEF3C7', route: '/wazifa',        time: 'Once or twice a day',     priority: 'medium' },
  { id: 'hadra-jumua',   title: 'Haḍratu-Jumūʿa',     arabicTitle: 'حضرة الجمعة',               description: 'Friday spiritual gathering',      icon: Users,    color: '#7C3AED', lightColor: '#EDE9FE', route: '/hadra-jumua',   time: 'Friday evening',          priority: 'medium' },
  { id: 'names-allah',   title: "Asmā' Al-Husnā",      arabicTitle: 'أسماء الله الحسنى',          description: 'The 99 Beautiful Names of Allah', icon: Sparkles, color: '#1e40af', lightColor: '#dbeafe', route: '/asmaa-alhusna', time: 'Meditation & Reflection', priority: 'high',   isNew: true },
  { id: 'names-nabi',    title: "Asmā' An-Nabī",        arabicTitle: 'أسماء النبي الشريف',         description: '201 Names of the Prophet ﷺ',      icon: Star,     color: '#B45309', lightColor: '#FEF3C7', route: '/asmaa-nabi',    time: 'Meditation & Reflection', priority: 'high',   isNew: true },
  { id: 'dhikr-counter', title: 'Dhikr Counter',       arabicTitle: 'عداد الذكر',                description: 'Personal dhikr counter',          icon: Clock,    color: '#0891B2', lightColor: '#E0F2FE', route: '/dhikr-counter', time: 'Anytime',                 priority: 'medium', isNew: true },
  { id: 'hadra-map',     title: 'Hadara Map',          arabicTitle: 'خريطة الحضرة',              description: 'Find local Zawiya & gatherings',  image: require('../../assets/images/hadara-map-logo.png'), color: '#059669', lightColor: '#D1FAE5', route: '/hadra-map', time: 'Dhikr, Prayer & Zakat', priority: 'low' },
  { id: 'library',       title: 'Spiritual Library',   arabicTitle: 'المكتبة الروحية',           description: 'Sacred texts & wisdom',           icon: BookOpen, color: '#059669', lightColor: '#D1FAE5', route: '/library',       time: 'Anytime',                 priority: 'low'   },
];

const PRACTICE_CATEGORIES: PracticeCategory[] = [
  {
    id: 'awrad', label: 'Daily Awrād', arabicLabel: 'الأوراد اليومية', emoji: '🕌', color: '#DC2626',
    cards: ALL_PRACTICE_CARDS.filter(c => ['wird', 'wazifa', 'hadra-jumua', 'dhikr-counter'].includes(c.id)),
  },
  {
    id: 'resources', label: 'Resources', arabicLabel: 'الموارد', emoji: '📚', color: '#059669',
    cards: ALL_PRACTICE_CARDS.filter(c => ['hadra-map', 'library'].includes(c.id)),
  },
  {
    id: 'meditation', label: 'Meditation & Names', arabicLabel: 'التأمل والأسماء', emoji: '✨', color: '#1e40af',
    cards: ALL_PRACTICE_CARDS.filter(c => ['names-allah', 'names-nabi'].includes(c.id)),
  },
];

// ─── Featured categories ──────────────────────────────────────────────────────
const FEATURED_CATEGORY_ASMA_ALLAH: PracticeCategory = {
  id: 'asmaalhusna', label: 'The 99 Names of Allah', arabicLabel: 'أسماء الله الحسنى',
  emoji: '✨', color: '#93C5FD', cards: [],
};
const FEATURED_CATEGORY_ASMA_NABI: PracticeCategory = {
  id: 'asmaanabi', label: '201 Names of the Prophet ﷺ', arabicLabel: 'أسماء النبي الشريف',
  emoji: '🌙', color: '#FCD34D', cards: [],
};
const FEATURED_CATEGORY_LIBRARY: PracticeCategory = {
  id: 'library-feat', label: 'Spiritual Library', arabicLabel: 'المكتبة الروحية',
  emoji: '📖', color: '#6EE7B7', cards: [],
};
const FEATURED_CATEGORY_SUWAR: PracticeCategory = {
  id: 'suwar', label: "Sūras of the Qur'ān", arabicLabel: 'سُوَر القُرْآن الكَرِيم',
  emoji: '📗', color: '#FDE68A', cards: [],
};

const quickActions: QuickAction[] = [
  { title: 'Continue Practice', description: 'Resume your spiritual journey',   icon: TrendingUp, color: '#059669', action: 'continue'       },
  { title: 'Dhikr Counter',     description: 'Personal dhikr counter',          icon: Clock,      color: '#0891B2', action: 'dhikr-counter'  },
  { title: "Today's Schedule",  description: 'View prayer times & practices',   icon: Clock,      color: '#7C3AED', action: 'schedule'       },
  { title: "Asmā' Al-Husnā",    description: 'The 99 Beautiful Names of Allah', icon: Sparkles,   color: '#1e40af', action: 'names'          },
  { title: "Asmā' An-Nabī",     description: '201 Names of the Prophet ﷺ',     icon: Star,       color: '#B45309', action: 'asmaa-nabi'     },
  { title: 'Library',           description: 'Sacred formulas & wisdom',        icon: BookOpen,   color: '#059669', action: 'library-screen' },
  { title: 'Achievements',      description: 'Your spiritual milestones',       icon: Award,      color: '#D97706', action: 'achievements'   },
];

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children, dark }: { children: string; dark: boolean }) {
  return (
    <View style={sl.row}>
      <View style={sl.bar} />
      <Text style={[sl.text, dark && sl.textDark]}>{children}</Text>
    </View>
  );
}
const sl = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  bar:      { width: 3, height: 18, borderRadius: 2, backgroundColor: GREEN_MID },
  text:     { fontSize: 18, fontWeight: '800', color: '#1E293B', letterSpacing: -0.4 },
  textDark: { color: '#F1F5F9' },
});

// ─── Quote card ───────────────────────────────────────────────────────────────
function QuoteCard({ dark }: { dark: boolean }) {
  return (
    <View style={[qc.card, dark && qc.cardDark]}>
      <View style={qc.accent} />
      <View style={qc.body}>
        <Text style={[qc.arabic, dark && qc.arabicDark]}>
          وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ
        </Text>
        <View style={[qc.divider, dark && qc.dividerDark]} />
        <Text style={[qc.translation, dark && qc.translationDark]}>
          "And remember Allah much that you may succeed"
        </Text>
        <Text style={qc.ref}>Quran 62:10</Text>
      </View>
    </View>
  );
}
const qc = StyleSheet.create({
  card:            { marginHorizontal: 16, marginTop: 20, borderRadius: 18, backgroundColor: '#FFFFFF', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 4 },
  cardDark:        { backgroundColor: '#1E293B' },
  accent:          { height: 3, backgroundColor: GREEN_MID },
  body:            { padding: 20, alignItems: 'center' },
  arabic:          { fontSize: 16, textAlign: 'center', color: '#1E293B', lineHeight: 28, fontWeight: '600', marginBottom: 12 },
  arabicDark:      { color: '#F1F5F9' },
  divider:         { width: 40, height: 1, backgroundColor: '#E2E8F0', marginBottom: 12 },
  dividerDark:     { backgroundColor: '#334155' },
  translation:     { fontSize: 13, textAlign: 'center', color: '#64748B', fontStyle: 'italic', lineHeight: 20, marginBottom: 8 },
  translationDark: { color: '#94A3B8' },
  ref:             { fontSize: 11, color: GREEN_MID, fontWeight: '700', letterSpacing: 0.3 },
});

// ─── Quran Suwar Banner ───────────────────────────────────────────────────────
function SuwarBanner({ dark, onPress }: { dark: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={sb.wrap}>
      <LinearGradient
        colors={['#1E1B4B', '#312E81', '#1E3A8A']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={sb.gradient}
      >
        <View style={sb.circle1} /><View style={sb.circle2} />
        <LinearGradient colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={sb.goldLine} />
        <View style={sb.row}>
          <View style={sb.left}>
            <View style={sb.badgeRow}>
              <View style={sb.badge}><Text style={sb.badgeText}>📗 NEW</Text></View>
            </View>
            <Text style={sb.arabicTitle}>سُوَر القُرْآن</Text>
            <Text style={sb.title}>Sūras of the Qur'ān</Text>
            <Text style={sb.sub}>114 surahs · Reflect & meditate on{'\n'}the words of Allah</Text>
            <View style={sb.statsRow}>
              {[{ n: '114', l: 'Surahs' }, { n: '30', l: "Juz'" }, { n: '6236', l: 'Verses' }].map(s => (
                <View key={s.l} style={sb.stat}>
                  <Text style={sb.statNum}>{s.n}</Text>
                  <Text style={sb.statLabel}>{s.l}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={sb.right}>
            <View style={sb.ctaCircle}><Text style={sb.ctaEmoji}>📖</Text></View>
            <View style={sb.ctaBtn}>
              <Text style={sb.ctaBtnText}>Explore</Text>
              <ChevronRight color={GOLD} size={14} strokeWidth={2.5} />
            </View>
          </View>
        </View>
        <LinearGradient colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={sb.goldLine} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const sb = StyleSheet.create({
  wrap:      { marginHorizontal: 16, marginBottom: 12, borderRadius: 22, overflow: 'hidden', shadowColor: '#1E1B4B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
  gradient:  { padding: 20, gap: 12, overflow: 'hidden' },
  circle1:   { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.04)', top: -70, right: -50 },
  circle2:   { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -30, left: -20 },
  goldLine:  { height: 1.5, width: '100%', opacity: 0.55 },
  row:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  left:      { flex: 1, gap: 6 },
  badgeRow:  { flexDirection: 'row' },
  badge:     { backgroundColor: 'rgba(245,158,11,0.25)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.5)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 9, fontWeight: '800', color: GOLD, letterSpacing: 0.8 },
  arabicTitle:{ fontSize: 22, color: '#FFFFFF', fontWeight: '800', lineHeight: 34 },
  title:     { fontSize: 16, color: '#C7D2FE', fontWeight: '700', letterSpacing: 0.2 },
  sub:       { fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 17 },
  statsRow:  { flexDirection: 'row', gap: 16, marginTop: 4 },
  stat:      { alignItems: 'center' },
  statNum:   { fontSize: 15, fontWeight: '900', color: GOLD },
  statLabel: { fontSize: 9, fontWeight: '600', color: 'rgba(199,210,254,0.7)', textTransform: 'uppercase', letterSpacing: 0.6 },
  right:     { alignItems: 'center', gap: 10 },
  ctaCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  ctaEmoji:  { fontSize: 28 },
  ctaBtn:    { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(245,158,11,0.2)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.4)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  ctaBtnText:{ fontSize: 12, fontWeight: '800', color: GOLD },
});

// ─── Azkars Banner ────────────────────────────────────────────────────────────
// Design nuit cohérent avec l'écran Azkars : fond noir, accent doré/bleu.
// Deux boutons : Morning (doré) + Evening (bleu), séparés par un divider.
function AzkarsBanner({ onPressMorning, onPressEvening }: {
  onPressMorning: () => void;
  onPressEvening: () => void;
}) {
  return (
    <View style={az.wrap}>

      {/* ── En-tête descriptif ── */}
      <LinearGradient
        colors={['#050400', '#0d0b00', '#050400']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={az.header}
      >
        {/* Anneaux décoratifs */}
        <View pointerEvents="none" style={[az.ring, { width: 180, height: 180, borderRadius: 90, right: -40, top: -70 }]} />
        <View pointerEvents="none" style={[az.ring, { width: 100, height: 100, borderRadius: 50, right: 50,  top: -10 }]} />

        <LinearGradient colors={['transparent', '#C8922A', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={az.shimmerLine} />

        <View style={az.headerInner}>
          <View style={az.headerLeft}>
            <View style={az.badge}>
              <Text style={az.badgeText}>✦ REMEMBRANCE</Text>
            </View>
            <Text style={az.arabicTitle}>الأَذْكَار اليَوْمِيَّة</Text>
            <Text style={az.mainTitle}>Daily Azkaar</Text>
            <Text style={az.desc}>Morning & evening remembrance{'\n'}of Allah — a light for the heart.</Text>
          </View>
          <View style={az.headerRight}>
            <View style={[az.iconCircle, { borderColor: '#C8922A40' }]}>
              <Text style={az.iconEmoji}>☀️</Text>
            </View>
            <View style={[az.iconCircle, { borderColor: '#5a7db540' }]}>
              <Text style={az.iconEmoji}>🌙</Text>
            </View>
          </View>
        </View>

        <LinearGradient colors={['transparent', '#C8922A', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={az.shimmerLine} />
      </LinearGradient>

      {/* ── Bouton Morning ── */}
      <TouchableOpacity onPress={onPressMorning} activeOpacity={0.82}>
        <LinearGradient colors={['#180d00', '#1e1100', '#180d00']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={az.sessionRow}>
          <View style={[az.sessionIcon, { borderColor: '#C8922A50', backgroundColor: '#C8922A10' }]}>
            <Sun size={22} color="#C8922A" strokeWidth={1.5} />
          </View>
          <View style={az.sessionInfo}>
            <Text style={[az.sessionPeriod, { color: '#C8922A' }]}>MORNING</Text>
            <Text style={az.sessionTitle}>Adhkar Al-Sabah</Text>
            <Text style={[az.sessionArabic, { color: '#C8922A70' }]}>أذكار الصباح</Text>
          </View>
          <ChevronRight size={18} color="#C8922A45" />
        </LinearGradient>
      </TouchableOpacity>

      <View style={az.divider} />

      {/* ── Bouton Evening ── */}
      <TouchableOpacity onPress={onPressEvening} activeOpacity={0.82}>
        <LinearGradient colors={['#00020e', '#000414', '#00020e']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={az.sessionRow}>
          <View style={[az.sessionIcon, { borderColor: '#5a7db550', backgroundColor: '#5a7db510' }]}>
            <Moon size={20} color="#5a7db5" strokeWidth={1.5} />
          </View>
          <View style={az.sessionInfo}>
            <Text style={[az.sessionPeriod, { color: '#5a7db5' }]}>EVENING</Text>
            <Text style={az.sessionTitle}>Adhkar Al-Masa</Text>
            <Text style={[az.sessionArabic, { color: '#5a7db570' }]}>أذكار المساء</Text>
          </View>
          <ChevronRight size={18} color="#5a7db545" />
        </LinearGradient>
      </TouchableOpacity>

    </View>
  );
}

const az = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(200,146,42,0.20)',
    shadowColor: '#C8922A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  header:       { overflow: 'hidden' },
  ring:         { position: 'absolute', borderWidth: 1, borderColor: '#C8922A', opacity: 0.10 },
  shimmerLine:  { height: 1, width: '100%', opacity: 0.40 },
  headerInner:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 14 },
  headerLeft:   { flex: 1, gap: 3 },
  badge:        { alignSelf: 'flex-start', backgroundColor: 'rgba(200,146,42,0.15)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.38)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 5 },
  badgeText:    { fontSize: 9, fontWeight: '800', color: '#C8922A', letterSpacing: 1.2 },
  arabicTitle:  { fontSize: 15, color: 'rgba(255,255,255,0.80)', fontWeight: '400', letterSpacing: 0.8, lineHeight: 22 },
  mainTitle:    { fontSize: 22, color: '#FFFFFF', fontWeight: '800', letterSpacing: -0.3 },
  desc:         { fontSize: 11, color: 'rgba(255,255,255,0.42)', lineHeight: 17, marginTop: 3 },
  headerRight:  { alignItems: 'center', gap: 8 },
  iconCircle:   { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(200,146,42,0.07)', borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  iconEmoji:    { fontSize: 20 },
  sessionRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 16 },
  sessionIcon:  { width: 46, height: 46, borderRadius: 23, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  sessionInfo:  { flex: 1, gap: 2 },
  sessionPeriod:{ fontSize: 9, fontWeight: '800', letterSpacing: 2.5 },
  sessionTitle: { fontSize: 16, color: '#ffffff', fontWeight: '300' },
  sessionArabic:{ fontSize: 12, fontWeight: '300' },
  divider:      { height: 1, backgroundColor: 'rgba(200,146,42,0.10)', marginHorizontal: 20 },
});

// ─── Al-Hadra Banner ──────────────────────────────────────────────────────────
function AlHadraBanner({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={hb.wrap}>
      <LinearGradient
        colors={['#000000', '#0A0005', '#050010', '#000000']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={hb.gradient}
      >
        <View style={hb.glow} />
        <View style={[hb.ring, { width: 180, height: 180, borderRadius: 90, opacity: 0.06 }]} />
        <View style={[hb.ring, { width: 120, height: 120, borderRadius: 60, opacity: 0.09 }]} />
        <View style={[hb.ring, { width: 70,  height: 70,  borderRadius: 35, opacity: 0.13 }]} />
        <LinearGradient colors={['transparent', '#C8922A', '#FDE68A', '#C8922A', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={hb.goldLine} />
        <View style={hb.inner}>
          <View style={hb.left}>
            <View style={hb.badgeRow}>
              <View style={hb.badge}><Text style={hb.badgeText}>✦ MÉDITATION</Text></View>
            </View>
            <Text style={hb.arabicTitle}>الأَسْمَاءُ الحُسْنَى</Text>
            <Text style={hb.title}>Al-Hadra</Text>
            <Text style={hb.subtitle}>Station of Presence</Text>
            <Text style={hb.desc}>Entrez dans la présence des 99 Noms.{'\n'}Une expérience méditative immersive.</Text>
            <View style={hb.statsRow}>
              {[{ n: '99', l: 'Names' }, { n: '5', l: 'Dimensions' }, { n: '∞', l: 'Depth' }].map(stat => (
                <View key={stat.l} style={hb.stat}>
                  <Text style={hb.statNum}>{stat.n}</Text>
                  <Text style={hb.statLabel}>{stat.l}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={hb.right}>
            <View style={hb.arabicCircle}>
              <Text style={hb.arabicSymbol}>الله</Text>
            </View>
            <View style={hb.ctaBtn}>
              <Text style={hb.ctaBtnText}>Enter</Text>
              <ChevronRight color="#C8922A" size={14} strokeWidth={2.5} />
            </View>
          </View>
        </View>
        <LinearGradient colors={['transparent', '#C8922A', '#FDE68A', '#C8922A', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={hb.goldLine} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const hb = StyleSheet.create({
  wrap:         { marginHorizontal: 16, marginBottom: 12, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(200,146,42,0.25)', shadowColor: '#C8922A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.20, shadowRadius: 18, elevation: 12 },
  gradient:     { padding: 0, overflow: 'hidden', position: 'relative' },
  glow:         { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: '#C8922A', opacity: 0.06, top: -60, left: -40 },
  ring:         { position: 'absolute', borderWidth: 1, borderColor: '#C8922A', right: 30, top: '50%', marginTop: -90 },
  goldLine:     { height: 1.5, width: '100%', opacity: 0.55 },
  inner:        { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, paddingVertical: 18 },
  left:         { flex: 1, gap: 5 },
  badgeRow:     { flexDirection: 'row', marginBottom: 2 },
  badge:        { backgroundColor: 'rgba(200,146,42,0.18)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.45)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText:    { fontSize: 9, fontWeight: '800', color: '#C8922A', letterSpacing: 1 },
  arabicTitle:  { fontSize: 18, color: 'rgba(255,255,255,0.90)', fontWeight: '400', letterSpacing: 1, lineHeight: 28 },
  title:        { fontSize: 22, color: '#FFFFFF', fontWeight: '800', letterSpacing: -0.3 },
  subtitle:     { fontSize: 12, color: '#C8922A', fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  desc:         { fontSize: 11, color: 'rgba(255,255,255,0.50)', lineHeight: 17 },
  statsRow:     { flexDirection: 'row', gap: 18, marginTop: 8 },
  stat:         { alignItems: 'center' },
  statNum:      { fontSize: 16, fontWeight: '900', color: '#C8922A' },
  statLabel:    { fontSize: 8, fontWeight: '600', color: 'rgba(200,146,42,0.65)', textTransform: 'uppercase', letterSpacing: 0.8 },
  right:        { alignItems: 'center', gap: 10 },
  arabicCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(200,146,42,0.08)', borderWidth: 1.5, borderColor: 'rgba(200,146,42,0.30)', justifyContent: 'center', alignItems: 'center' },
  arabicSymbol: { fontSize: 22, color: 'rgba(200,146,42,0.90)', fontWeight: '400', letterSpacing: 1 },
  ctaBtn:       { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(200,146,42,0.15)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.40)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 7 },
  ctaBtnText:   { fontSize: 12, fontWeight: '800', color: '#C8922A', letterSpacing: 0.5 },
});

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const {
    state, getWirdProgress, getWazifaProgress,
    isWirdFullyDoneToday, isWazifaFullyDoneToday, isHadraFullyDoneToday,
    wirdCompletionsToday, wazifaCompletionsToday, hadraCompletionsToday,
  } = useApp();

  const { appName, fullVersion } = useAppVersion();
  const { openDrawer, handleNotifications, unreadCount } = useContext(LayoutActionsContext);

  const dark = state.settings.darkMode;
  const { frequencySettings } = state;
  const isFriday = () => new Date().getDay() === 5;

  const isCardCompletedToday = (id: string) => {
    if (id === 'wird')        return isWirdFullyDoneToday;
    if (id === 'wazifa')      return isWazifaFullyDoneToday;
    if (id === 'hadra-jumua') return isHadraFullyDoneToday;
    return false;
  };

  const getCompletionsToday = (id: string) => {
    if (id === 'wird')        return wirdCompletionsToday;
    if (id === 'wazifa')      return wazifaCompletionsToday;
    if (id === 'hadra-jumua') return hadraCompletionsToday;
    return 0;
  };

  const getTargetPerDay = (id: string) => {
    if (id === 'wird')        return frequencySettings.wirdPerDay;
    if (id === 'wazifa')      return frequencySettings.wazifaPerDay;
    if (id === 'hadra-jumua') return frequencySettings.hadraPerDay;
    return 1;
  };

  const handleCardPress = (route: string) => {
    switch (route) {
      case '/wird':          router.push('/(tabs)/wird');          break;
      case '/wazifa':        router.push('/(tabs)/wazifa');        break;
      case '/asmaa-alhusna': router.push('/(tabs)/asmaa-alhusna'); break;
      case '/asmaa-nabi':    router.push('/(tabs)/asmaa-nabi');    break;
      case '/library':       router.push('/(tabs)/library');       break;
      case '/dhikr-counter': router.push('/(tabs)/dhikr-counter'); break;
      case '/hadra-jumua':   router.push('/(tabs)/hadra');         break;
      case '/hadra-map':     openHadraMap();                       break;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'continue':
        if (!isWirdFullyDoneToday)                     router.push('/(tabs)/wird');
        else if (!isWazifaFullyDoneToday)              router.push('/(tabs)/wazifa');
        else if (isFriday() && !isHadraFullyDoneToday) router.push('/(tabs)/hadra');
        else                                           router.push('/(tabs)/stats');
        break;
      case 'dhikr-counter':  router.push('/(tabs)/dhikr-counter'); break;
      case 'schedule':       openHadraMap();                        break;
      case 'achievements':   router.push('/(tabs)/stats');          break;
      case 'names':          router.push('/(tabs)/asmaa-alhusna');  break;
      case 'asmaa-nabi':     router.push('/(tabs)/asmaa-nabi');     break;
      case 'library-screen': router.push('/(tabs)/library');        break;
    }
  };

  const wirdProgress   = getWirdProgress();
  const wazifaProgress = getWazifaProgress();
  const getCardProgress = (id: string) =>
    id === 'wird' ? wirdProgress : id === 'wazifa' ? wazifaProgress : 0;

  return (
    <View style={s.root}>

      <SpiritualHeader
        onMenuPress={openDrawer}
        currentPage={appName}
        onNotificationPress={handleNotifications}
        notificationCount={unreadCount}
        showNotification={true}
        showHijriDate={true}
        theme="default"
      />

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
      >
        <DailyProgressCard
          onPress={() => router.push('/(tabs)/daily-achievements')}
          darkMode={dark}
        />

        <View style={s.quickSection}>
          <QuickActionsBar
            quickActions={quickActions}
            handleQuickAction={handleQuickAction}
            darkMode={dark}
          />
        </View>

        {/* ── Categorized Practice Cards ── */}
        <View style={s.section}>
          <SectionLabel dark={dark}>Spiritual Practices</SectionLabel>

          {PRACTICE_CATEGORIES.map((category, catIndex) => (
            <View key={category.id} style={s.categoryBlock}>
              <CategoryHeader category={category} dark={dark} />
              <View style={s.grid}>
                {category.cards.map(card => (
                  <PracticeCard
                    key={card.id}
                    card={card}
                    progress={getCardProgress(card.id)}
                    onPress={handleCardPress}
                    darkMode={dark}
                    isCompletedToday={isCardCompletedToday(card.id)}
                    completionsToday={getCompletionsToday(card.id)}
                    targetPerDay={getTargetPerDay(card.id)}
                  />
                ))}
              </View>
              {catIndex < PRACTICE_CATEGORIES.length - 1 && (
                <View style={[s.catDivider, dark && s.catDividerDark]} />
              )}
            </View>
          ))}
        </View>

        {/* ── Daily Azkaar ── */}
        <View style={s.section}>
          <SectionLabel dark={dark}>Daily Azkaar</SectionLabel>
        </View>
        <AzkarsBanner
          onPressMorning={() =>
            router.push({ pathname: '/(tabs)/azkars', params: { period: 'morning' } })
          }
          onPressEvening={() =>
            router.push({ pathname: '/(tabs)/azkars', params: { period: 'evening' } })
          }
        />

        {/* ── Quran Suwar Banner ── */}
        <View style={s.section}>
          <SectionLabel dark={dark}>Holy Qur'ān</SectionLabel>
        </View>
        <SuwarBanner
          dark={dark}
          onPress={() => router.push('/(tabs)/suwar')}
        />

        {/* ── Al-Hadra — Station of Presence ── */}
        <View style={s.section}>
          <SectionLabel dark={dark}>Meditation & Presence</SectionLabel>
        </View>
        <AlHadraBanner
          onPress={() => router.push('/(tabs)/hadra-station')}
        />

        {/* ── Featured Cards ── */}
        <View style={s.section}>
          <SectionLabel dark={dark}>Explore</SectionLabel>
        </View>

        <FeaturedCard
          gradientColors={['#1e3a8a', '#1e40af', '#2563eb']}
          sub="Meditate and reflect on Allah's divine attributes"
          onPress={() => router.push('/(tabs)/asmaa-alhusna')}
          shadowColor="#1e40af"
          featuredCategory={FEATURED_CATEGORY_ASMA_ALLAH}
        />

        <FeaturedCard
          gradientColors={['#78350F', '#92400E', '#B45309']}
          sub="Recite, reflect, and let your heart draw near"
          onPress={() => router.push('/(tabs)/asmaa-nabi')}
          shadowColor="#92400E"
          featuredCategory={FEATURED_CATEGORY_ASMA_NABI}
        />

        <FeaturedCard
          gradientColors={[GREEN_DARK, GREEN_MID, GREEN_LIGHT]}
          sub="Sacred formulas, biographies & wisdom"
          onPress={() => router.push('/(tabs)/library')}
          shadowColor={GREEN_DARK}
          featuredCategory={FEATURED_CATEGORY_LIBRARY}
        />

        <QuoteCard dark={dark} />
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:           { flex: 1, backgroundColor: '#F8FAFC' },
  rootDark:       { backgroundColor: '#0F172A' },
  scroll:         { flex: 1 },
  content:        { paddingBottom: 20 },
  quickSection:   { marginTop: 18 },
  section:        { marginTop: 26, paddingHorizontal: 16 },
  categoryBlock:  {},
  grid:           { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14 },
  catDivider:     { height: 1, backgroundColor: '#E2E8F0', marginVertical: 22 },
  catDividerDark: { backgroundColor: '#1E293B' },
});