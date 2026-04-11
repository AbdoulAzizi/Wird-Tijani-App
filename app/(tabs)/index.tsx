// app/(tabs)/index.tsx — Wird Tijāni
// Awrād Tijāniyya · Library · Hadara Map
// Cross-app Quick Actions → Rawdat Dhikr

import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart, Star, BookOpen, TrendingUp, Clock,
  Award, ChevronRight, Moon, LucideIcon, ExternalLink,
} from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { openHadraMap } from '../../utils/OpenHadraMap';
import { openRawdatDhikr } from '../../utils/OpenRawdatDhikr';
import QuickActionsBar from '../../components/QuickActionsBar';
import PracticeCard from '../../components/PracticeCard';
import DailyProgressCard from '../../components/DailyProgressCard';
import CategoryHeader, { PracticeCategory } from '../../components/CategoryHeader';
import SpiritualHeader from '../../components/SpiritualHeader';
import { useAppVersion } from '@/hooks/useAppVersion';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';

// ─── Palette ──────────────────────────────────────────────────────────────────
const GREEN_DARK  = '#064E3B';
const GREEN_MID   = '#065F46';
const GREEN_LIGHT = '#047857';

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

// ─── Cards — Tariqa Tijaniyya + Library + Hadara Map only ────────────────────
const ALL_PRACTICE_CARDS: PracticeCardData[] = [
  {
    id: 'wird',
    title: 'Lāzim Tijāni', arabicTitle: 'الوِرد التجاني',
    description: 'Daily spiritual practice',
    icon: Heart, color: '#DC2626', lightColor: '#FEE2E2',
    route: '/wird', time: 'Morning & Evening', priority: 'high',
  },
  {
    id: 'wazifa',
    title: 'Wazīfa Tijāniyya', arabicTitle: 'الوَظِيفَة التِّجَانِيَّة',
    description: 'Daily spiritual practice',
    icon: Star, color: '#D97706', lightColor: '#FEF3C7',
    route: '/wazifa', time: 'Once or twice a day', priority: 'medium',
  },
  {
    id: 'hadra-jumua',
    title: 'Haḍratu-Jumūʿa', arabicTitle: 'حضرة الجمعة',
    description: 'Friday spiritual gathering',
    icon: Moon, color: '#7C3AED', lightColor: '#EDE9FE',
    route: '/hadra-jumua', time: 'Friday evening', priority: 'medium',
  },
  {
    id: 'dhikr-counter',
    title: 'Dhikr Counter', arabicTitle: 'عداد الذكر',
    description: 'Personal counter for your dhikr sessions',
    icon: Clock, color: '#0891B2', lightColor: '#E0F2FE',
    route: '/dhikr-counter', time: 'Anytime', priority: 'low',
  },
  {
    id: 'hadra-map',
    title: 'Hadara Map', arabicTitle: 'خريطة الحضرة',
    description: 'Find local Zawiya & gatherings',
    image: require('../../assets/images/hadara-map-logo.png'),
    color: '#059669', lightColor: '#D1FAE5',
    route: '/hadra-map', time: 'Dhikr, Prayer & Zakat', priority: 'low',
  },
  {
    id: 'library',
    title: 'Spiritual Library', arabicTitle: 'المكتبة الروحية',
    description: 'Sacred texts & wisdom',
    icon: BookOpen, color: '#059669', lightColor: '#D1FAE5',
    route: '/library', time: 'Anytime', priority: 'low',
  },
];

const PRACTICE_CATEGORIES: PracticeCategory[] = [
  {
    id: 'awrad', label: 'Daily Awrād', arabicLabel: 'الأوراد اليومية',
    emoji: '🕌', color: '#DC2626',
    cards: ALL_PRACTICE_CARDS.filter(c => ['wird', 'wazifa', 'hadra-jumua', 'dhikr-counter'].includes(c.id)),
  },
  {
    id: 'resources', label: 'Resources', arabicLabel: 'الموارد',
    emoji: '📚', color: '#059669',
    cards: ALL_PRACTICE_CARDS.filter(c => ['hadra-map', 'library'].includes(c.id)),
  },
];

// ─── Quick Actions — local + cross-app ───────────────────────────────────────
// Actions prefixed [↗] open Rawdat Dhikr (or prompt install)
const quickActions: QuickAction[] = [
  { title: 'Continue Practice',  description: 'Resume your spiritual journey',     icon: TrendingUp,  color: '#059669', action: 'continue'      },
  { title: "Today's Schedule",   description: 'View prayer times & practices',     icon: Clock,       color: '#7C3AED', action: 'schedule'      },
  { title: '↗ Dhikr Counter',    description: 'Personal counter — Rawdat Dhikr',   icon: Clock,       color: '#0891B2', action: 'dhikr-counter' },
  { title: '↗ Daily Adhkaar',    description: 'Morning & evening — Rawdat Dhikr',  icon: Moon,        color: '#C8922A', action: 'azkars'        },
  { title: '↗ Asmā\' Al-Husnā', description: '99 Names — Rawdat Dhikr',            icon: Star,        color: '#1e40af', action: 'names-allah'   },
  { title: '↗ Asmā\' An-Nabī',  description: '201 Names — Rawdat Dhikr',           icon: Star,        color: '#B45309', action: 'asmaa-nabi'    },
  { title: 'Achievements',       description: 'Your spiritual milestones',         icon: Award,       color: '#D97706', action: 'achievements'  },
];

// ─── Section Label ────────────────────────────────────────────────────────────
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

// ─── Rawdat Dhikr companion banner ───────────────────────────────────────────
function RawdatDhikrBanner({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={rd.wrap}>
      <LinearGradient
        colors={['#050A1F', '#0C1545', '#071232']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={rd.gradient}
      >
        <View style={[rd.ring, { width: 200, height: 200, borderRadius: 100, right: -50, top: -80 }]} />
        <View style={[rd.ring, { width: 120, height: 120, borderRadius: 60, right: 38, top: -20 }]} />

        <LinearGradient
          colors={['transparent', '#6366F1', '#818CF8', '#6366F1', 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={rd.shimmerLine}
        />

        <View style={rd.inner}>
          <View style={rd.left}>
            <View style={rd.badgeRow}>
              <View style={rd.badge}>
                <Text style={rd.badgeText}>✦ APPLICATION COMPAGNON</Text>
              </View>
            </View>
            <Text style={rd.arabicTitle}>رَوْضَةُ الذِّكْر</Text>
            <Text style={rd.title}>Rawdat Dhikr</Text>
            <Text style={rd.desc}>
              Dhikr Counter · Adhkaar · Al-Hadra{'\n'}
              Asmā' Allāh · Asmā' An-Nabī · Qur'ān
            </Text>
            <View style={rd.featsRow}>
              {['Dhikr', 'Adhkaar', "Qur'ān", 'Al-Hadra', 'Asmā\''].map(f => (
                <View key={f} style={rd.feat}>
                  <Text style={rd.featText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={rd.right}>
            <View style={rd.iconCircle}>
              <Text style={rd.iconEmoji}>🌿</Text>
            </View>
            <View style={rd.ctaBtn}>
              <Text style={rd.ctaBtnText}>Ouvrir</Text>
              <ExternalLink color="#818CF8" size={13} strokeWidth={2.5} />
            </View>
          </View>
        </View>

        <LinearGradient
          colors={['transparent', '#6366F1', '#818CF8', '#6366F1', 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={rd.shimmerLine}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const rd = StyleSheet.create({
  wrap:        { marginHorizontal: 16, marginBottom: 12, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(99,102,241,0.30)', shadowColor: '#6366F1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 18, elevation: 12 },
  gradient:    { overflow: 'hidden', position: 'relative' },
  ring:        { position: 'absolute', borderWidth: 1, borderColor: '#6366F1', opacity: 0.10 },
  shimmerLine: { height: 1.5, width: '100%', opacity: 0.50 },
  inner:       { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, paddingVertical: 18 },
  left:        { flex: 1, gap: 5 },
  badgeRow:    { flexDirection: 'row', marginBottom: 2 },
  badge:       { backgroundColor: 'rgba(99,102,241,0.20)', borderWidth: 1, borderColor: 'rgba(99,102,241,0.45)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText:   { fontSize: 9, fontWeight: '800', color: '#818CF8', letterSpacing: 1 },
  arabicTitle: { fontSize: 17, color: 'rgba(255,255,255,0.88)', fontWeight: '400', letterSpacing: 1, lineHeight: 26 },
  title:       { fontSize: 22, color: '#FFFFFF', fontWeight: '800', letterSpacing: -0.3 },
  desc:        { fontSize: 11, color: 'rgba(255,255,255,0.48)', lineHeight: 17, marginTop: 2 },
  featsRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  feat:        { backgroundColor: 'rgba(99,102,241,0.15)', borderWidth: 1, borderColor: 'rgba(99,102,241,0.30)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  featText:    { fontSize: 9.5, color: '#A5B4FC', fontWeight: '600' },
  right:       { alignItems: 'center', gap: 10 },
  iconCircle:  { width: 66, height: 66, borderRadius: 33, backgroundColor: 'rgba(99,102,241,0.10)', borderWidth: 1, borderColor: 'rgba(99,102,241,0.30)', justifyContent: 'center', alignItems: 'center' },
  iconEmoji:   { fontSize: 30 },
  ctaBtn:      { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(99,102,241,0.18)', borderWidth: 1, borderColor: 'rgba(99,102,241,0.40)', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 7 },
  ctaBtnText:  { fontSize: 12, fontWeight: '800', color: '#818CF8', letterSpacing: 0.4 },
});

// ─── Quote Card ───────────────────────────────────────────────────────────────
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

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const {
    state, getWirdProgress, getWazifaProgress,
    isWirdFullyDoneToday, isWazifaFullyDoneToday, isHadraFullyDoneToday,
    wirdCompletionsToday, wazifaCompletionsToday, hadraCompletionsToday,
  } = useApp();

  const { appName } = useAppVersion();
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
      case '/wird':        router.push('/(tabs)/wird');    break;
      case '/wazifa':      router.push('/(tabs)/wazifa');  break;
      case '/library':     router.push('/(tabs)/library'); break;
      case '/hadra-jumua': router.push('/(tabs)/hadra');   break;
      case '/dhikr-counter': openRawdatDhikr('dhikr-counter'); break;
      case '/hadra-map':   openHadraMap();                 break;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      // ── Local ─────────────────────────────────────────────────────────────
      case 'continue':
        if (!isWirdFullyDoneToday)                     router.push('/(tabs)/wird');
        else if (!isWazifaFullyDoneToday)              router.push('/(tabs)/wazifa');
        else if (isFriday() && !isHadraFullyDoneToday) router.push('/(tabs)/hadra');
        else                                           router.push('/(tabs)/stats');
        break;
      case 'schedule':     openHadraMap();               break;
      case 'achievements': router.push('/(tabs)/stats'); break;

      // ── Cross-app → Rawdat Dhikr ──────────────────────────────────────────
      case 'dhikr-counter': openRawdatDhikr('dhikr-counter'); break;
      case 'azkars':        openRawdatDhikr('azkars');        break;
      case 'names-allah':   openRawdatDhikr('asmaa-alhusna'); break;
      case 'asmaa-nabi':    openRawdatDhikr('asmaa-nabi');    break;
    }
  };

  const wirdProgress   = getWirdProgress();
  const wazifaProgress = getWazifaProgress();
  const getCardProgress = (id: string) =>
    id === 'wird' ? wirdProgress : id === 'wazifa' ? wazifaProgress : 0;

  return (
    <View style={[s.root, dark && s.rootDark]}>
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

        {/* ── Awrād + Resources ── */}
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

        {/* ── Rawdat Dhikr companion app ── */}
        <View style={s.section}>
          <SectionLabel dark={dark}>Application Compagnon</SectionLabel>
        </View>
        <RawdatDhikrBanner onPress={() => openRawdatDhikr()} />

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