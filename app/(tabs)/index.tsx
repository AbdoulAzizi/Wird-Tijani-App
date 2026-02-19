import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import {
  Heart,
  Star,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  Flame,
  LucideIcon,
  ArrowRight,
} from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { openHadraMap } from '../../utils/OpenHadraMap';
import QuickActionsBar from '../../components/QuickActionsBar';
import PracticeCard from '../../components/PracticeCard';

// ── Types ──────────────────────────────────────────────────────────────────
interface PracticeCardData {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  icon?: LucideIcon;
  image?: any;
  color: string;
  lightColor: string;
  route: string;
  time: string;
  priority: string;
  isNew?: boolean;           // ← badge "New"
}

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  action: string;
}

const { width } = Dimensions.get('window');

// ── Data ───────────────────────────────────────────────────────────────────
const practiceCards: PracticeCardData[] = [
  {
    id: 'wird',
    title: 'Wird Tijāni',
    arabicTitle: 'الوِرد التجاني',
    description: 'Daily spiritual practice',
    icon: Heart,
    color: '#DC2626',
    lightColor: '#FEE2E2',
    route: '/wird',
    time: 'Morning & Evening',
    priority: 'high',
  },
  {
    id: 'wazifa',
    title: 'Wazīfa Tijāniyya',
    arabicTitle: 'الوَظِيفَة التِّجَانِيَّة',
    description: 'Daily spiritual practice',
    icon: Star,
    color: '#D97706',
    lightColor: '#FEF3C7',
    route: '/wazifa',
    time: 'Once or twice a day',
    priority: 'medium',
  },
  {
    id: 'hadra-jumua',
    title: 'Haḍratu-Jumūʿa',
    arabicTitle: 'حضرة الجمعة',
    description: 'Friday spiritual gathering',
    icon: Users,
    color: '#7C3AED',
    lightColor: '#EDE9FE',
    route: '/hadra-jumua',
    time: 'Friday evening',
    priority: 'medium',
  },
  {
    id: 'hadra-map',
    title: 'Hadara Map',
    arabicTitle: 'خريطة الحضرة',
    description: 'Find local Zawiya & gatherings',
    image: require('../../assets/images/hadara-map-logo.png'),
    color: '#059669',
    lightColor: '#D1FAE5',
    route: '/hadra-map',
    time: 'Dhikr, Prayer & Zakat',
    priority: 'low',
  },
  {
    id: 'names-allah',
    title: 'Asmā\' Al-Husnā',
    arabicTitle: 'أسماء الله الحسنى',
    description: 'The 99 Beautiful Names of Allah',
    icon: Sparkles,
    color: '#1e40af',
    lightColor: '#dbeafe',
    route: '/names',
    time: 'Meditation & Reflection',
    priority: 'high',
    isNew: true,
  },
  {
    id: 'dhikr-counter',
    title: 'Dhikr Counter',
    arabicTitle: 'عداد الذكر',
    description: 'Free personal dhikr counter',
    icon: Clock,
    color: '#0891B2',
    lightColor: '#E0F2FE',
    route: '/dhikr-counter',
    time: 'Anytime',
    priority: 'medium',
    isNew: true,
  },
  {
    id: 'library',
    title: 'Spiritual Library',
    arabicTitle: 'المكتبة الروحية',
    description: 'Sacred texts & wisdom',
    icon: BookOpen,
    color: '#059669',
    lightColor: '#D1FAE5',
    route: '/library',
    time: 'Anytime',
    priority: 'low',
  },
];

const quickActions: QuickAction[] = [
  {
    title: 'Continue Practice',
    description: 'Resume your spiritual journey',
    icon: TrendingUp,
    color: '#059669',
    action: 'continue',
  },
  {
    title: "Today's Schedule",
    description: 'View prayer times & practices',
    icon: Clock,
    color: '#7C3AED',
    action: 'schedule',
  },
  {
    title: "Asm'a Al-Husn'a",
    description: 'The 99 Beautiful Names of Allah',
    icon: Sparkles,
    color: '#1e40af',
    action: 'names',
  },
  {
    title: 'Library',
    description: 'Sacred formulas, biographies & wisdom',
    icon: BookOpen,
    color: '#059669',
    action: 'library-screen',
  },
  {
    title: 'Achievements',
    description: 'Your spiritual milestones',
    icon: Award,
    color: '#D97706',
    action: 'achievements',
  },
];

// ── Compact Progress Bar ───────────────────────────────────────────────────
const MiniBar = ({
  label,
  value,
  color,
  darkMode,
}: {
  label: string;
  value: number;
  color: string;
  darkMode: boolean;
}) => (
  <View style={miniStyles.row}>
    <Text style={[miniStyles.label, darkMode && miniStyles.labelDark]}>{label}</Text>
    <View style={[miniStyles.track, darkMode && miniStyles.trackDark]}>
      <View style={[miniStyles.fill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
    <Text style={[miniStyles.pct, { color }]}>{value}%</Text>
  </View>
);

const miniStyles = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  label:    { fontSize: 11, fontWeight: '600', color: '#64748B', width: 44 },
  labelDark:{ color: '#94A3B8' },
  track:    { flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  trackDark:{ backgroundColor: '#334155' },
  fill:     { height: '100%', borderRadius: 3 },
  pct:      { fontSize: 11, fontWeight: '700', width: 32, textAlign: 'right' },
});

// ── Main Screen ────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { state, getWirdProgress, getWazifaProgress } = useApp();
  const dark = state.settings.darkMode;

  const handleCardPress = (route: string) => {
    switch (route) {
      case '/wird':          router.push('/(tabs)/wird');          break;
      case '/wazifa':        router.push('/(tabs)/wazifa');        break;
      case '/names':         router.push('/(tabs)/names');         break;
      case '/library':       router.push('/(tabs)/library');       break;
      case '/dhikr-counter': router.push('/(tabs)/dhikr-counter'); break;
      case '/hadra-jumua':   router.push('/(tabs)/hadra');         break;
      case '/hadra-map':     openHadraMap();                       break;
      default: break;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'continue':       router.push('/(tabs)/wird');    break;
      case 'schedule':       openHadraMap();                 break;
      case 'achievements':   router.push('/(tabs)/stats');   break;
      case 'names':          router.push('/(tabs)/names');   break;
      case 'library-screen': router.push('/(tabs)/library'); break;
      default: break;
    }
  };

  const wirdProgress   = getWirdProgress();
  const wazifaProgress = getWazifaProgress();
  const totalProgress  = Math.round((wirdProgress + wazifaProgress) / 2);
  const streak         = state.streak || 0;

  const getCardProgress = (cardId: string): number => {
    if (cardId === 'wird')   return wirdProgress;
    if (cardId === 'wazifa') return wazifaProgress;
    return 0;
  };

  return (
    <View style={[styles.container, dark && styles.containerDark]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ── COMPACT PROGRESS CARD ─────────────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/(tabs)/stats')}
          style={styles.progressWrapper}
        >
          <View style={[styles.progressCard, dark && styles.progressCardDark]}>
            {/* Left: icon + total */}
            <View style={styles.progressLeft}>
              <View style={[styles.progressIconBg, { backgroundColor: totalProgress >= 100 ? '#D1FAE5' : dark ? '#1E3A2F' : '#F0FDF4' }]}>
                <TrendingUp color="#059669" size={18} strokeWidth={2.5} />
              </View>
              <View>
                <Text style={[styles.progressPct, dark && styles.progressPctDark]}>
                  {totalProgress}%
                </Text>
                <Text style={[styles.progressLabel, dark && styles.progressLabelDark]}>
                  Daily Goal
                </Text>
              </View>
            </View>

            {/* Center: mini bars */}
            <View style={styles.progressCenter}>
              <MiniBar label="Wird"   value={Math.round(wirdProgress)}   color="#059669" darkMode={dark} />
              <MiniBar label="Wazifa" value={Math.round(wazifaProgress)} color="#D97706" darkMode={dark} />
            </View>

            {/* Right: streak + arrow */}
            <View style={styles.progressRight}>
              <View style={styles.streakPill}>
                <Flame color="#D97706" size={13} />
                <Text style={styles.streakNum}>{streak}</Text>
              </View>
              <Text style={[styles.streakDays, dark && styles.streakDaysDark]}>streak</Text>
              <ArrowRight color={dark ? '#475569' : '#CBD5E1'} size={14} style={{ marginTop: 4 }} />
            </View>
          </View>
        </TouchableOpacity>

        {/* ── QUICK ACTIONS ──────────────────────────────────────── */}
        <View style={styles.quickActionsSection}>
          <QuickActionsBar
            quickActions={quickActions}
            handleQuickAction={handleQuickAction}
            darkMode={dark}
          />
        </View>

        {/* ── PRACTICE CARDS ─────────────────────────────────────── */}
        <View style={styles.practiceSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, dark && styles.sectionTitleDark]}>
              Spiritual Practices
            </Text>
          </View>
          <View style={styles.cardsGrid}>
            {practiceCards.map((card) => (
              <PracticeCard
                key={card.id}
                card={card}
                progress={getCardProgress(card.id)}
                onPress={handleCardPress}
                darkMode={dark}
              />
            ))}
          </View>
        </View>

        {/* ── 99 NAMES FEATURED CARD ─────────────────────────────── */}
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => router.push('/(tabs)/names')}
          activeOpacity={0.85}
        >
          <View style={styles.featuredInner}>
            <View style={styles.featuredIconWrap}>
              <Sparkles color="#FFFFFF" size={28} strokeWidth={2} />
            </View>
            <View style={styles.featuredText}>
              <Text style={styles.featuredArabic}>أسماء الله الحسنى</Text>
              <Text style={styles.featuredTitle}>The 99 Beautiful Names of Allah</Text>
              <Text style={styles.featuredSub}>Meditate and reflect on Allah's divine attributes</Text>
            </View>
            <ChevronRight color="rgba(255,255,255,0.7)" size={20} />
          </View>
        </TouchableOpacity>

        {/* ── LIBRARY CARD ───────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.libraryCard}
          onPress={() => router.push('/(tabs)/library')}
          activeOpacity={0.85}
        >
          <View style={styles.libraryInner}>
            <View style={styles.libraryIconWrap}>
              <BookOpen color="#FFFFFF" size={24} strokeWidth={2} />
            </View>
            <View style={styles.libraryText}>
              <Text style={styles.libraryTitle}>Spiritual Library</Text>
              <Text style={styles.librarySub}>Sacred formulas, biographies & wisdom</Text>
            </View>
            <ChevronRight color="rgba(255,255,255,0.7)" size={20} />
          </View>
        </TouchableOpacity>

        {/* ── QUOTE ──────────────────────────────────────────────── */}
        <View style={[styles.quoteCard, dark && styles.quoteCardDark]}>
          <Text style={styles.quoteOpenMark}>"</Text>
          <Text style={[styles.arabicQuote, dark && styles.arabicQuoteDark]}>
            وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ
          </Text>
          <Text style={[styles.quoteTranslation, dark && styles.quoteTranslationDark]}>
            "And remember Allah much that you may succeed"
          </Text>
          <Text style={styles.quoteRef}>— Quran 62:10</Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#0F172A' },
  scrollView:    { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // ── Compact progress card
  progressWrapper: { paddingHorizontal: 16, marginTop: 8 },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  progressCardDark: { backgroundColor: '#1E293B' },

  progressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 96,
  },
  progressIconBg: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  progressPct: {
    fontSize: 18, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5,
  },
  progressPctDark:  { color: '#F8FAFC' },
  progressLabel:    { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 1 },
  progressLabelDark:{ color: '#64748B' },

  progressCenter: { flex: 1 },

  progressRight: { alignItems: 'center', gap: 2 },
  streakPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#FEF3C7', borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  streakNum:  { fontSize: 13, fontWeight: '800', color: '#D97706' },
  streakDays: { fontSize: 9, color: '#94A3B8', fontWeight: '600' },
  streakDaysDark: { color: '#64748B' },

  // ── Quick actions
  quickActionsSection: { marginTop: 20 },

  // ── Practice cards
  practiceSection: { marginTop: 28, paddingHorizontal: 16 },
  sectionHeader:   { marginBottom: 16 },
  sectionTitle:    { fontSize: 20, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5 },
  sectionTitleDark:{ color: '#F8FAFC' },
  cardsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', gap: 16,
  },

  // ── 99 Names featured
  featuredCard: {
    marginHorizontal: 16, marginTop: 28,
    borderRadius: 20, overflow: 'hidden',
    backgroundColor: '#1e40af',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28, shadowRadius: 18, elevation: 8,
  },
  featuredInner: {
    flexDirection: 'row', alignItems: 'center',
    padding: 20, gap: 14,
  },
  featuredIconWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  featuredText:  { flex: 1 },
  featuredArabic:{ fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'right', marginBottom: 4 },
  featuredTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 3 },
  featuredSub:   { fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 17 },

  // ── Library
  libraryCard: {
    marginHorizontal: 16, marginTop: 14,
    borderRadius: 20, backgroundColor: '#059669',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 14, elevation: 6,
  },
  libraryInner: {
    flexDirection: 'row', alignItems: 'center',
    padding: 18, gap: 14,
  },
  libraryIconWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  libraryText:  { flex: 1 },
  libraryTitle: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 3 },
  librarySub:   { fontSize: 12, color: 'rgba(255,255,255,0.78)', lineHeight: 17 },

  // ── Quote
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20, padding: 24,
    marginHorizontal: 16, marginTop: 20,
    alignItems: 'center',
    borderLeftWidth: 4, borderLeftColor: '#059669',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 4,
  },
  quoteCardDark:        { backgroundColor: '#1E293B' },
  quoteOpenMark:        { fontSize: 40, color: '#059669', fontWeight: 'bold', opacity: 0.25, marginBottom: 6 },
  arabicQuote:          { fontSize: 17, textAlign: 'center', color: '#1E293B', marginBottom: 12, lineHeight: 28 },
  arabicQuoteDark:      { color: '#F8FAFC' },
  quoteTranslation:     { fontSize: 13, textAlign: 'center', color: '#64748B', fontStyle: 'italic', marginBottom: 10, lineHeight: 19 },
  quoteTranslationDark: { color: '#CBD5E1' },
  quoteRef:             { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },

  bottomSpacing: { height: 32 },
});