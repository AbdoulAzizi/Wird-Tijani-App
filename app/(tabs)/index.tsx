import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
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
import GradientHeader from '../../components/GradientHeader';
import { useApp } from '../../contexts/AppContext';
import { openHadraMap } from "../../utils/OpenHadraMap";
import QuickActionsBar from '../../components/QuickActionsBar';

// Interface pour les cartes de pratique
interface PracticeCard {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  icon?: LucideIcon;
  image?: any; // Pour les images requises avec require()
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
const CARD_WIDTH = (width - 48) / 2;

const practiceCards: PracticeCard[] = [
  {
    id: 'wird',
    title: 'Wird Tijāni',
    arabicTitle: 'الوِرد التجاني',
    description: 'Daily spiritual practice',
    icon: Heart, // Utilise une icône
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
    icon: Star, // Utilise une icône
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
    // Exemple avec image au lieu d'icône
    // image: require('../../assets/images/hadra.png'), // Utilise une image
    icon: Users, // Utilise une icône
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
    description: 'Find local Zawiya & spiritual gatherings',
    // icon: MapPin, // Utilise une icône
    image: require('../../assets/images/hadara-map-logo.png'), // Utilise une image
    color: '#059669',
    lightColor: '#D1FAE5',
    // lightColor: 'transparent',
    route: '/hadra-map',
    time: 'Dhikr, Prayer & Zakat',
    priority: 'low',
  },
   {
    id: 'names-allah',
    title: 'Asmā\' Al-Husnā',
    arabicTitle: 'أسماء الله الحسنى',
    description: 'The 99 Beautiful Names of Allah',
    icon: Sparkles, // Utilise une icône
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
    description: 'Sacred formulas, biographies & wisdom',
    // Exemple avec image au lieu d'icône
    // image: require('../../assets/images/library.png'), // Utilise une image
    icon: BookOpen, // Utilise une icône
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
      console.log('Navigate to Hadra Map');
      openHadraMap(); // ✅ Appel du composant indépendant
      break;
    default:
      console.log(`Navigate to ${route}`);
      break;
  }
};

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'continue':
        // Navigate to the practice with highest priority or incomplete progress
        router.push('/(tabs)/wird');
        break;
      case 'schedule':
        // Navigate to schedule/calendar view
        console.log('Navigate to schedule');
        openHadraMap();
        break;
      case 'achievements':
        // Navigate to achievements
        router.push('/(tabs)/stats');
        console.log('Navigate to achievements');
        break;
      case 'names':
        // Navigate to names
        router.push('/(tabs)/names');
        console.log('Navigate to names');
        break;
      case 'library-screen':
        // Navigate to library
        router.push('/(tabs)/library-screen');
        console.log('Navigate to library');
        break;
      default:
        console.log(`Navigate to ${action}`);
        break;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { 
      text: 'Good Morning', 
      icon: Sunrise, 
      arabic: 'صباح الخير',
      message: 'Start your day with remembrance'
    };
    if (hour < 18) return { 
      text: 'Good Afternoon', 
      icon: Calendar, 
      arabic: 'مساء الخير',
      message: 'Continue your spiritual journey'
    };
    return { 
      text: 'Good Evening', 
      icon: Moon, 
      arabic: 'مساء الخير',
      message: 'End your day with gratitude'
    };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // Get today's progress stats
  const wirdProgress = getWirdProgress();
  const wazifaProgress = getWazifaProgress();
  const totalProgress = Math.round((wirdProgress + wazifaProgress) / 2);
  const streak = 5; // This should come from your context

  // Fonction pour rendre l'icône ou l'image
  const renderCardIcon = (card: PracticeCard, isDarkMode: boolean) => {
    if (card.image) {
      // Si c'est une image
      return (
        <Image
          source={card.image}
          style={[
            styles.cardImage,
            isDarkMode && styles.cardImageDark
          ]}
          resizeMode="cover"
        />
      );
    } else if (card.icon) {
      // Si c'est une icône
      const CardIcon = card.icon;
      return (
        <CardIcon 
          color={isDarkMode ? "#FFFFFF" : card.color} 
          size={24} 
        />
      );
    }
    return null;
  };

  return (
    <View style={[
      styles.container,
      state.settings.darkMode && styles.containerDark
    ]}
    >
      {/* <GradientHeader
        arabicTitle="بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ"
        englishTitle="Wird & Wazīfa Tijāniyya"
        subtitle="Spiritual Practice Companion"
        icon={<Heart color="#FFFFFF" size={32} fill="#FFFFFF" />}
      /> */}

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
                  <TrendingUp color="#059669" size={24} />
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
                  <Text style={[
                    styles.streakValue,
                    state.settings.darkMode && styles.streakValueDark
                  ]}>
                    {streak}
                  </Text>
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
          {/* <Text style={[
            styles.sectionTitle, {
              marginHorizontal: 20, marginBottom: 10,
            },
            state.settings.darkMode && styles.sectionTitleDark
          ]}>
            Quick Actions
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.quickActionsContainer}
          >
            {quickActions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quickActionCard,
                    state.settings.darkMode && styles.quickActionCardDark
                  ]}
                  onPress={() => handleQuickAction(action.action)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                    <ActionIcon color="#FFFFFF" size={20} />
                  </View>
                  <Text style={[
                    styles.quickActionTitle,
                    state.settings.darkMode && styles.quickActionTitleDark
                  ]}>
                    {action.title}
                  </Text>
                  <Text style={[
                    styles.quickActionDescription,
                    state.settings.darkMode && styles.quickActionDescriptionDark
                  ]}>
                    {action.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView> */}
        </View>

        {/* Redesigned Practice Cards */}
        <View style={styles.practiceSection}>
          <View style={styles.sectionHeader}>
            <Text style={[
              styles.sectionTitle,
              state.settings.darkMode && styles.sectionTitleDark
            ]}>
              Spiritual Practices
            </Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight color="#6B7280" size={16} />
            </TouchableOpacity>
          </View>

          <View style={styles.cardsGrid}>
            {practiceCards.map((card) => {
              const isWird = card.id === 'wird';
              const isWazifa = card.id === 'wazifa';
              const progress = isWird ? wirdProgress : isWazifa ? wazifaProgress : 0;
              
              return (
                <TouchableOpacity
                  key={card.id}
                  style={[
                    styles.practiceCard,
                    state.settings.darkMode && styles.practiceCardDark,
                    { width: CARD_WIDTH }
                  ]}
                  onPress={() => handleCardPress(card.route)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardHeader}>
                    <View style={[
                      styles.cardIconContainer,
                      card.image && styles.cardIconContainerImage,
                      state.settings.darkMode 
                        ? { backgroundColor: card.color }
                        : { backgroundColor: card.lightColor }
                    ]}>
                      {renderCardIcon(card, state.settings.darkMode)}
                    </View>
                    {card.priority === 'high' && (
                      <View style={styles.priorityBadge}>
                        <Text style={styles.priorityText}>Priority</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={[
                    styles.cardArabicTitle,
                    state.settings.darkMode && styles.cardArabicTitleDark
                  ]}>
                    {card.arabicTitle}
                  </Text>
                  
                  <Text style={[
                    styles.cardTitle,
                    state.settings.darkMode && styles.cardTitleDark
                  ]}>
                    {card.title}
                  </Text>
                  
                  <Text style={[
                    styles.cardDescription,
                    state.settings.darkMode && styles.cardDescriptionDark
                  ]}>
                    {card.description}
                  </Text>

                  {(isWird || isWazifa) && progress > 0 && (
                    <View style={styles.cardProgressContainer}>
                      <View style={[
                        styles.cardProgressBar,
                        state.settings.darkMode && styles.cardProgressBarDark
                      ]}>
                        <View 
                          style={[
                            styles.cardProgressFill,
                            { width: `${progress}%`, backgroundColor: card.color }
                          ]} 
                        />
                      </View>
                      <Text style={[
                        styles.cardProgressText,
                        state.settings.darkMode && styles.cardProgressTextDark
                      ]}>
                        {Math.round(progress)}%
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.cardFooter}>
                    <Clock color="#9CA3AF" size={12} />
                    <Text style={[
                      styles.cardTime,
                      state.settings.darkMode && styles.cardTimeDark
                    ]}>
                      {card.time}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
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
                  <Sparkles color="#FFFFFF" size={32} />
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
                <BookOpen color="#FFFFFF" size={28} />
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

        {/* Inspirational Quote with better design */}
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
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressInfo: {
    flex: 1,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  progressValueDark: {
    color: '#F8FAFC',
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  progressLabelDark: {
    color: '#CBD5E1',
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D97706',
  },
  streakValueDark: {
    color: '#FBBF24',
  },
  streakLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  streakLabelDark: {
    color: '#CBD5E1',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarDark: {
    backgroundColor: '#334155',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },

  // Quick Actions
  quickActionsSection: {
    // marginLeft: 4,
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionCardDark: {
    backgroundColor: '#1E293B',
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  quickActionTitleDark: {
    color: '#F8FAFC',
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  quickActionDescriptionDark: {
    color: '#CBD5E1',
  },

  // Featured Card for 99 Names
  featuredCard: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
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
    width: 56,
    height: 56,
    borderRadius: 28,
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
    marginBottom: 4,
    textAlign: 'right',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },

  // Section Headers
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionTitleDark: {
    color: '#F8FAFC',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
    fontWeight: '500',
  },

  // Practice Section
  practiceSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  practiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  practiceCardDark: {
    backgroundColor: '#1E293B',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Nouveau style pour les containers d'images
  cardIconContainerImage: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  // Style pour les images dans les cartes
  cardImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  cardImageDark: {
    opacity: 0.9,
  },
  priorityBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '600',
  },
  cardArabicTitle: {
    fontSize: 16,
    color: '#1E293B',
    fontFamily: 'Amiri_400Regular',
    marginBottom: 4,
  },
  cardArabicTitleDark: {
    color: '#F8FAFC',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  cardTitleDark: {
    color: '#F8FAFC',
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 18,
  },
  cardDescriptionDark: {
    color: '#CBD5E1',
  },
  cardProgressContainer: {
    marginBottom: 16,
  },
  cardProgressBar: {
    height: 3,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  cardProgressBarDark: {
    backgroundColor: '#334155',
  },
  cardProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  cardProgressText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'right',
    fontWeight: '500',
  },
  cardProgressTextDark: {
    color: '#CBD5E1',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  cardTime: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    marginLeft: 4,
  },
  cardTimeDark: {
    color: '#9CA3AF',
  },

  // Library Card
  libraryCard: {
    backgroundColor: '#059669',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 20,
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
    width: 52,
    height: 52,
    borderRadius: 26,
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
    lineHeight: 18,
  },

  // Quote
  quoteContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    marginHorizontal: 16,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
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