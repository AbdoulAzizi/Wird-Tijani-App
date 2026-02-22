import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart, Star, Users, BookOpen, TrendingUp, Clock,
  Award, ChevronRight, Sparkles, LucideIcon,
} from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { openHadraMap } from '../../utils/OpenHadraMap';
import QuickActionsBar from '../../components/QuickActionsBar';
import PracticeCard from '../../components/PracticeCard';
import DailyProgressCard from '../../components/DailyProgressCard';
import CategoryHeader, { PracticeCategory } from '../../components/CategoryHeader';
import SpiritualHeader from '../../components/SpiritualHeader';
import FeaturedCard from '../../components/FeaturedCard';          // ← nouveau
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

// Featured cards — couleurs plus claires pour contraste sur fond sombre
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

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const {
    state, getWirdProgress, getWazifaProgress,
    isWirdFullyDoneToday, isWazifaFullyDoneToday, isHadraFullyDoneToday,
    wirdCompletionsToday, wazifaCompletionsToday, hadraCompletionsToday,
  } = useApp();

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
    <View style={[s.root, dark && s.rootDark]}>

      <SpiritualHeader
        onMenuPress={openDrawer}
        currentPage="Home"
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