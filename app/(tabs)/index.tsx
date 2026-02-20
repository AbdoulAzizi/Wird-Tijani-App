import React from 'react';
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

// ─── Palette partagée ─────────────────────────────────────────────────────────
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
const practiceCards: PracticeCardData[] = [
  { id: 'wird',          title: 'Wird Tijāni',           arabicTitle: 'الوِرد التجاني',         description: 'Daily spiritual practice',         icon: Heart,    color: '#DC2626', lightColor: '#FEE2E2', route: '/wird',          time: 'Morning & Evening',      priority: 'high'   },
  { id: 'wazifa',        title: 'Wazīfa Tijāniyya',      arabicTitle: 'الوَظِيفَة التِّجَانِيَّة', description: 'Daily spiritual practice',         icon: Star,     color: '#D97706', lightColor: '#FEF3C7', route: '/wazifa',        time: 'Once or twice a day',    priority: 'medium' },
  { id: 'hadra-jumua',   title: 'Haḍratu-Jumūʿa',        arabicTitle: 'حضرة الجمعة',            description: 'Friday spiritual gathering',       icon: Users,    color: '#7C3AED', lightColor: '#EDE9FE', route: '/hadra-jumua',   time: 'Friday evening',         priority: 'medium' },
  { id: 'hadra-map',     title: 'Hadara Map',             arabicTitle: 'خريطة الحضرة',           description: 'Find local Zawiya & gatherings',   image: require('../../assets/images/hadara-map-logo.png'), color: '#059669', lightColor: '#D1FAE5', route: '/hadra-map', time: 'Dhikr, Prayer & Zakat', priority: 'low' },
  { id: 'names-allah',   title: "Asmā' Al-Husnā",         arabicTitle: 'أسماء الله الحسنى',       description: 'The 99 Beautiful Names of Allah',  icon: Sparkles, color: '#1e40af', lightColor: '#dbeafe', route: '/names',         time: 'Meditation & Reflection', priority: 'high',   isNew: true },
  { id: 'dhikr-counter', title: 'Dhikr Counter',          arabicTitle: 'عداد الذكر',             description: 'Free personal dhikr counter',      icon: Clock,    color: '#0891B2', lightColor: '#E0F2FE', route: '/dhikr-counter', time: 'Anytime',                priority: 'medium', isNew: true },
  { id: 'library',       title: 'Spiritual Library',      arabicTitle: 'المكتبة الروحية',        description: 'Sacred texts & wisdom',            icon: BookOpen, color: '#059669', lightColor: '#D1FAE5', route: '/library',       time: 'Anytime',                priority: 'low'   },
];

const quickActions: QuickAction[] = [
  { title: 'Continue Practice', description: 'Resume your spiritual journey',  icon: TrendingUp, color: '#059669', action: 'continue'       },
  { title: "Today's Schedule",  description: 'View prayer times & practices',  icon: Clock,      color: '#7C3AED', action: 'schedule'       },
  { title: "Asmā' Al-Husnā",    description: 'The 99 Beautiful Names of Allah',icon: Sparkles,   color: '#1e40af', action: 'names'          },
  { title: 'Library',           description: 'Sacred formulas & wisdom',       icon: BookOpen,   color: '#059669', action: 'library-screen' },
  { title: 'Achievements',      description: 'Your spiritual milestones',      icon: Award,      color: '#D97706', action: 'achievements'   },
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
  row:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  bar:     { width: 3, height: 18, borderRadius: 2, backgroundColor: GREEN_MID },
  text:    { fontSize: 18, fontWeight: '800', color: '#1E293B', letterSpacing: -0.4 },
  textDark:{ color: '#F1F5F9' },
});

// ─── Featured card (generic) ──────────────────────────────────────────────────
function FeaturedCard({
  gradientColors, icon, arabic, title, sub, onPress, shadowColor,
}: {
  gradientColors: [string, string, string];
  icon: React.ReactNode;
  arabic: string; title: string; sub: string;
  onPress: () => void; shadowColor: string;
}) {
  return (
    <TouchableOpacity
      style={[fc.wrap, { shadowColor }]}
      onPress={onPress} activeOpacity={0.85}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={fc.gradient}
      >
        {/* Deco circles — même que SpiritualHeader */}
        <View style={fc.deco} pointerEvents="none">
          <View style={fc.c1} /><View style={fc.c2} />
        </View>

        <View style={fc.row}>
          <View style={fc.iconWrap}>{icon}</View>
          <View style={fc.textBlock}>
            <Text style={fc.arabic}>{arabic}</Text>
            <Text style={fc.title}>{title}</Text>
            <Text style={fc.sub}>{sub}</Text>
          </View>
          <ChevronRight color="rgba(255,255,255,0.55)" size={18} strokeWidth={2.5} />
        </View>

        {/* Gold bottom line — identique SpiritualHeader */}
        <View style={fc.goldLine}>
          <LinearGradient
            colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
const fc = StyleSheet.create({
  wrap: {
    marginHorizontal: 16, marginTop: 14, borderRadius: 20,
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28,
    shadowRadius: 16, elevation: 8, overflow: 'hidden',
  },
  gradient: { overflow: 'hidden' },
  deco:     { ...StyleSheet.absoluteFillObject },
  c1: { position: 'absolute', top: -40, right: -30, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.07)' },
  c2: { position: 'absolute', bottom: -20, left: 20, width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.04)' },
  row:      { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 },
  iconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.16)', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  textBlock:{ flex: 1 },
  arabic:   { fontSize: 12, color: 'rgba(255,255,255,0.75)', textAlign: 'right', marginBottom: 3 },
  title:    { fontSize: 15, fontWeight: '800', color: '#FFFFFF', marginBottom: 2, letterSpacing: -0.2 },
  sub:      { fontSize: 12, color: 'rgba(255,255,255,0.72)', lineHeight: 17 },
  goldLine: { height: 2, opacity: 0.55 },
});

// ─── Quote card ───────────────────────────────────────────────────────────────
function QuoteCard({ dark }: { dark: boolean }) {
  return (
    <View style={[qc.card, dark && qc.cardDark]}>
      {/* Accent bar — même vert que SpiritualHeader */}
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
  card: {
    marginHorizontal: 16, marginTop: 20, borderRadius: 18,
    backgroundColor: '#FFFFFF', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 4,
  },
  cardDark:      { backgroundColor: '#1E293B' },
  accent:        { height: 3, backgroundColor: GREEN_MID },
  body:          { padding: 20, alignItems: 'center' },
  arabic:        { fontSize: 16, textAlign: 'center', color: '#1E293B', lineHeight: 28, fontWeight: '600', marginBottom: 12 },
  arabicDark:    { color: '#F1F5F9' },
  divider:       { width: 40, height: 1, backgroundColor: '#E2E8F0', marginBottom: 12 },
  dividerDark:   { backgroundColor: '#334155' },
  translation:   { fontSize: 13, textAlign: 'center', color: '#64748B', fontStyle: 'italic', lineHeight: 20, marginBottom: 8 },
  translationDark: { color: '#94A3B8' },
  ref:           { fontSize: 11, color: GREEN_MID, fontWeight: '700', letterSpacing: 0.3 },
});

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const {
    state, getWirdProgress, getWazifaProgress,
    isWirdFullyDoneToday, isWazifaFullyDoneToday, isHadraFullyDoneToday,
    wirdCompletionsToday, wazifaCompletionsToday, hadraCompletionsToday,
  } = useApp();

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
      case '/names':         router.push('/(tabs)/names');         break;
      case '/library':       router.push('/(tabs)/library');       break;
      case '/dhikr-counter': router.push('/(tabs)/dhikr-counter'); break;
      case '/hadra-jumua':   router.push('/(tabs)/hadra');         break;
      case '/hadra-map':     openHadraMap();                       break;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'continue':
        if (!isWirdFullyDoneToday)                    router.push('/(tabs)/wird');
        else if (!isWazifaFullyDoneToday)             router.push('/(tabs)/wazifa');
        else if (isFriday() && !isHadraFullyDoneToday)router.push('/(tabs)/hadra');
        else                                          router.push('/(tabs)/stats');
        break;
      case 'schedule':       openHadraMap();                 break;
      case 'achievements':   router.push('/(tabs)/stats');   break;
      case 'names':          router.push('/(tabs)/names');   break;
      case 'library-screen': router.push('/(tabs)/library'); break;
    }
  };

  const wirdProgress   = getWirdProgress();
  const wazifaProgress = getWazifaProgress();
  const getCardProgress = (id: string) => id === 'wird' ? wirdProgress : id === 'wazifa' ? wazifaProgress : 0;

  return (
    <View style={[s.root, dark && s.rootDark]}>
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
      >

        {/* ── Daily Progress ── */}
        <DailyProgressCard
          onPress={() => router.push('/(tabs)/daily-achievements')}
          darkMode={dark}
        />

        {/* ── Quick Actions ── */}
        <View style={s.quickSection}>
          <QuickActionsBar
            quickActions={quickActions}
            handleQuickAction={handleQuickAction}
            darkMode={dark}
          />
        </View>

        {/* ── Practice Cards ── */}
        <View style={s.section}>
          <SectionLabel dark={dark}>Spiritual Practices</SectionLabel>
          <View style={s.grid}>
            {practiceCards.map(card => (
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
        </View>

        {/* ── Featured: 99 Names ── */}
        <FeaturedCard
          gradientColors={['#1e3a8a', '#1e40af', '#2563eb']}
          icon={<Sparkles color="#FFFFFF" size={24} strokeWidth={2} />}
          arabic="أسماء الله الحسنى"
          title="The 99 Beautiful Names of Allah"
          sub="Meditate and reflect on Allah's divine attributes"
          onPress={() => router.push('/(tabs)/names')}
          shadowColor="#1e40af"
        />

        {/* ── Featured: Library ── */}
        <FeaturedCard
          gradientColors={[GREEN_DARK, GREEN_MID, GREEN_LIGHT]}
          icon={<BookOpen color="#FFFFFF" size={22} strokeWidth={2} />}
          arabic="المكتبة الروحية"
          title="Spiritual Library"
          sub="Sacred formulas, biographies & wisdom"
          onPress={() => router.push('/(tabs)/library')}
          shadowColor={GREEN_DARK}
        />

        {/* ── Quote ── */}
        <QuoteCard dark={dark} />

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#F8FAFC' },
  rootDark:{ backgroundColor: '#0F172A' },
  scroll:  { flex: 1 },
  content: { paddingBottom: 20 },

  quickSection: { marginTop: 18 },

  section: { marginTop: 26, paddingHorizontal: 16 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', gap: 14,
  },
});