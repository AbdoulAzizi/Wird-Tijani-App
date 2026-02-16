import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Heart, 
  Star, 
  Users, 
  MapPin, 
  BookOpen,
  Calendar,
  Sunrise,
  Moon,
  TrendingUp,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  LucideIcon
} from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { openHadraMap } from "../../utils/OpenHadraMap";
import QuickActionsBar from '../../components/QuickActionsBar';
import PracticeCard from '../../components/PracticeCard';

// Interface pour les cartes de pratique
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
}

interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  action: string;
}

const { width } = Dimensions.get('window');

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
    title: 'Today\'s Schedule',
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

export default function HomeScreen() {
  const { state, getWirdProgress, getWazifaProgress } = useApp();

  const handleCardPress = (route: string) => {
    switch (route) {
      case '/wird':
        router.push('/(tabs)/wird');
        break;
      case '/wazifa':
        router.push('/(tabs)/wazifa');
        break;
      case '/names':
        router.push('/(tabs)/names');
        break;
      case '/library':
        router.push('/(tabs)/library');
        break;
      case '/hadra-jumua':
        router.push('/(tabs)/hadra');
        break;
      case '/hadra-map':
        openHadraMap();
        break;
      default:
        console.log(`Navigate to ${route}`);
        break;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'continue':
        router.push('/(tabs)/wird');
        break;
      case 'schedule':
        openHadraMap();
        break;
      case 'achievements':
        router.push('/(tabs)/stats');
        break;
      case 'names':
        router.push('/(tabs)/names');
        break;
      case 'library-screen':
        router.push('/(tabs)/library-screen');
        break;
      default:
        console.log(`Navigate to ${action}`);
        break;
    }
  };

  // Get today's progress stats
  const wirdProgress = getWirdProgress();
  const wazifaProgress = getWazifaProgress();
  const totalProgress = Math.round((wirdProgress + wazifaProgress) / 2);
  const streak = state.streak || 0;

  // Get progress for specific cards
  const getCardProgress = (cardId: string): number => {
    switch (cardId) {
      case 'wird':
        return wirdProgress;
      case 'wazifa':
        return wazifaProgress;
      default:
        return 0;
    }
  };

  return (
    <View style={[
      styles.container,
      state.settings.darkMode && styles.containerDark
    ]}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Enhanced Progress Stats */}
        <View style={styles.progressSection}>
          <Text style={[
            styles.sectionTitle,
            state.settings.darkMode && styles.sectionTitleDark
          ]}>
            Today's Progress
          </Text>
          
          <View style={styles.progressCard}>
            <View style={[
              styles.progressMainCard,
              state.settings.darkMode && styles.progressMainCardDark
            ]}>
              <View style={styles.progressHeader}>
                <View style={styles.progressIconContainer}>
                  <TrendingUp color="#059669" size={24} strokeWidth={2} />
                </View>
                <View style={styles.progressInfo}>
                  <Text style={[
                    styles.progressValue,
                    state.settings.darkMode && styles.progressValueDark
                  ]}>
                    {totalProgress}%
                  </Text>
                  <Text style={[
                    styles.progressLabel,
                    state.settings.darkMode && styles.progressLabelDark
                  ]}>
                    Daily Goal
                  </Text>
                </View>
                <View style={styles.streakContainer}>
                  <View style={styles.streakBadge}>
                    <Text style={styles.streakValue}>
                      {streak}
                    </Text>
                  </View>
                  <Text style={[
                    styles.streakLabel,
                    state.settings.darkMode && styles.streakLabelDark
                  ]}>
                    day streak
                  </Text>
                </View>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View style={[
                  styles.progressBar,
                  state.settings.darkMode && styles.progressBarDark
                ]}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${totalProgress}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <QuickActionsBar
            quickActions={quickActions}
            handleQuickAction={handleQuickAction}
            darkMode={state.settings.darkMode}
          />
        </View>

        {/* Practice Cards Grid */}
        <View style={styles.practiceSection}>
          <View style={styles.sectionHeader}>
            <Text style={[
              styles.sectionTitle,
              state.settings.darkMode && styles.sectionTitleDark
            ]}>
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
                darkMode={state.settings.darkMode}
              />
            ))}
          </View>
        </View>

        {/* Featured: 99 Names of Allah */}
        <TouchableOpacity
          style={[
            styles.featuredCard,
            state.settings.darkMode && styles.featuredCardDark
          ]}
          onPress={() => router.push('/(tabs)/names')}
          activeOpacity={0.8}
        >
          <View style={styles.featuredCardGradient}>
            <View style={styles.featuredContent}>
              <View style={styles.featuredLeft}>
                <View style={styles.featuredIconContainer}>
                  <Sparkles color="#FFFFFF" size={32} strokeWidth={2} />
                </View>
                <View style={styles.featuredTextContainer}>
                  <Text style={styles.featuredArabicTitle}>
                    أسماء الله الحسنى
                  </Text>
                  <Text style={styles.featuredTitle}>
                    The 99 Beautiful Names of Allah
                  </Text>
                  <Text style={styles.featuredSubtitle}>
                    Meditate and reflect on Allah's divine attributes
                  </Text>
                </View>
              </View>
              <ChevronRight color="rgba(255, 255, 255, 0.8)" size={24} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Enhanced Library Card */}
        <TouchableOpacity
          style={[
            styles.libraryCard,
            state.settings.darkMode && styles.libraryCardDark
          ]}
          onPress={() => router.push('/(tabs)/library')}
          activeOpacity={0.8}
        >
          <View style={styles.libraryContent}>
            <View style={styles.libraryLeft}>
              <View style={styles.libraryIconContainer}>
                <BookOpen color="#FFFFFF" size={28} strokeWidth={2} />
              </View>
              <View style={styles.libraryTextContainer}>
                <Text style={styles.libraryTitle}>
                  Spiritual Library
                </Text>
                <Text style={styles.librarySubtitle}>
                  Sacred formulas, biographies & wisdom
                </Text>
              </View>
            </View>
            <ChevronRight color="rgba(255, 255, 255, 0.8)" size={20} />
          </View>
        </TouchableOpacity>

        {/* Inspirational Quote */}
        <View style={[
          styles.quoteContainer,
          state.settings.darkMode && styles.quoteContainerDark
        ]}>
          <View style={styles.quoteIcon}>
            <Text style={styles.quoteMark}>"</Text>
          </View>
          <Text style={[
            styles.arabicQuote,
            state.settings.darkMode && styles.arabicQuoteDark
          ]}>
            وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ
          </Text>
          <Text style={[
            styles.quoteTranslation,
            state.settings.darkMode && styles.quoteTranslationDark
          ]}>
            "And remember Allah much that you may succeed"
          </Text>
          <Text style={[
            styles.quoteReference,
            state.settings.darkMode && styles.quoteReferenceDark
          ]}>
            — Quran 62:10
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Progress Section
  progressSection: {
    marginTop: 4,
    paddingHorizontal: 16,
  },
  progressCard: {
    marginTop: 12,
  },
  progressMainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  progressMainCardDark: {
    backgroundColor: '#1E293B',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressInfo: {
    flex: 1,
  },
  progressValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  progressValueDark: {
    color: '#F8FAFC',
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  progressLabelDark: {
    color: '#CBD5E1',
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D97706',
  },
  streakLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  streakLabelDark: {
    color: '#CBD5E1',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarDark: {
    backgroundColor: '#334155',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 5,
  },

  // Quick Actions
  quickActionsSection: {
    marginTop: 24,
  },

  // Practice Section
  practiceSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  sectionTitleDark: {
    color: '#F8FAFC',
  },
  sectionHeader: {
    marginBottom: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },

  // Featured Card for 99 Names
  featuredCard: {
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  featuredCardDark: {
    shadowColor: '#1e40af',
  },
  featuredCardGradient: {
    backgroundColor: '#1e40af',
    padding: 24,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featuredIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featuredTextContainer: {
    flex: 1,
  },
  featuredArabicTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    textAlign: 'right',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },

  // Library Card
  libraryCard: {
    backgroundColor: '#059669',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  libraryCardDark: {
    backgroundColor: '#047857',
  },
  libraryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  libraryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  libraryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  libraryTextContainer: {
    flex: 1,
  },
  libraryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  librarySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },

  // Quote
  quoteContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    marginHorizontal: 16,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  quoteContainerDark: {
    backgroundColor: '#1E293B',
  },
  quoteIcon: {
    marginBottom: 16,
  },
  quoteMark: {
    fontSize: 48,
    color: '#059669',
    fontWeight: 'bold',
    opacity: 0.3,
  },
  arabicQuote: {
    fontSize: 18,
    textAlign: 'center',
    color: '#1E293B',
    marginBottom: 16,
    fontFamily: 'Amiri_400Regular',
    lineHeight: 28,
  },
  arabicQuoteDark: {
    color: '#F8FAFC',
  },
  quoteTranslation: {
    fontSize: 14,
    textAlign: 'center',
    color: '#64748B',
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 20,
  },
  quoteTranslationDark: {
    color: '#CBD5E1',
  },
  quoteReference: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  quoteReferenceDark: {
    color: '#9CA3AF',
  },
  bottomSpacing: {
    height: 32,
  },
});