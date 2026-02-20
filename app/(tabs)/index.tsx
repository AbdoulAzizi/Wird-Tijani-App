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
import DailyProgressCard from '../../components/DailyProgressCard';

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
  isNew?: boolean;
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

// ── Main Screen ────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { state, getWirdProgress, getWazifaProgress } = useApp();
  const dark = state.settings.darkMode;

  const getTodayDate = (): string => new Date().toISOString().split('T')[0];
  const isFriday = (): boolean => new Date().getDay() === 5;

  const isCardCompletedToday = (cardId: string): boolean => {
    const today = getTodayDate();
    switch (cardId) {
      case 'wird':       return state.completedWirds.includes(today);
      case 'wazifa':     return state.completedWazifas.includes(today);
      case 'hadra-jumua':return state.completedHadras.includes(today);
      default:           return false;
    }
  };

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

      // ✅ Action intelligente : détecte le dhikr en cours
      case 'continue': {
        const today    = getTodayDate();
        const wirdDone  = state.completedWirds.includes(today);
        const wazifaDone = state.completedWazifas.includes(today);
        const hadraDone  = state.completedHadras.includes(today);

        if (!wirdDone)                       router.push('/(tabs)/wird');
        else if (!wazifaDone)                router.push('/(tabs)/wazifa');
        else if (isFriday() && !hadraDone)   router.push('/(tabs)/hadra');
        else                                 router.push('/(tabs)/stats'); // tout complété → stats
        break;
      }

      case 'schedule':       openHadraMap();                 break;
      case 'achievements':   router.push('/(tabs)/stats');   break;
      case 'names':          router.push('/(tabs)/names');   break;
      case 'library-screen': router.push('/(tabs)/library'); break;
      default: break;
    }
  };

  const wirdProgress   = getWirdProgress();
  const wazifaProgress = getWazifaProgress();

  const getCardProgress = (cardId: string): number => {
    if (cardId === 'wird')   return wirdProgress;
    if (cardId === 'wazifa') return wazifaProgress;
    return 0;
  };

  const handleProgressCardPress = () => {
    router.push('/(tabs)/daily-achievements');
  };

  return (
    <View style={[styles.container, dark && styles.containerDark]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ── DAILY PROGRESS CARD ─────────────────────────────── */}
        <DailyProgressCard
          onPress={handleProgressCardPress}
          darkMode={dark}
        />

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
                isCompletedToday={isCardCompletedToday(card.id)}
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

  quickActionsSection: { marginTop: 20 },

  practiceSection:  { marginTop: 28, paddingHorizontal: 16 },
  sectionHeader:    { marginBottom: 16 },
  sectionTitle:     { fontSize: 20, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5 },
  sectionTitleDark: { color: '#F8FAFC' },
  cardsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', gap: 16,
  },

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
  featuredText:   { flex: 1 },
  featuredArabic: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'right', marginBottom: 4 },
  featuredTitle:  { fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 3 },
  featuredSub:    { fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 17 },

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