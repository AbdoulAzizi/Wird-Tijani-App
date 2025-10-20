import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Info, 
  Heart, 
  Star, 
  Users, 
  Mail, 
  Globe, 
  Award, 
  Code,
  Coffee,
  Github,
  Moon, 
  Sparkles, 
  ChevronLeft,
  MapPin,
  BookOpen,
  ShieldCheck,
} from 'lucide-react-native';
import GradientHeader from '../../components/GradientHeader';
import { useApp } from '../../contexts/AppContext';
import ScreenBackground from '../../components/ScreenBackground';

const features = [
  {
    icon: Heart,
    title: 'Daily Wird',
    description: 'Complete your daily spiritual practice with guided counters and progress tracking.',
    color: '#059669',
  },
  {
    icon: Star,
    title: 'Daily Wazīfa',
    description: 'Join the collective dhikr with the traditional Friday Wazīfa sequence.',
    color: '#D97706',
  },
  {
    icon: Moon,
    title: 'Hadra Sessions',
    description: 'Participate in spiritual gatherings with audio guidance and timers.',
    color: '#9333EA',
  },
  {
    icon: MapPin,
    title: 'Hadara Map',
    description: 'Find nearby zawiyas and community events to enhance your spiritual journey.',
    color: '#B45309',
  },
  {
    icon: Info,
    title: 'Prayer Times',
    description: 'Get accurate prayer times and schedules for your location.',
    color: '#1e40af',
  },
  { icon: Sparkles,
    title: 'Asma al-Husna',
    description: 'Explore the 99 Names of Allah with meanings and recitation guides.',
    color: '#2563EB',
  },
  {
    icon: BookOpen,
    title: 'Spiritual Library',
    description: 'Access a vast library of spiritual texts, prayers, and resources.',
    color: '#7C3AED',
  },
  
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with fellow disciples and find local spiritual gatherings.',
    color: '#7C3AED',
  },
  {
    icon: Award,
    title: 'Progress Tracking',
    description: 'Monitor your spiritual journey with detailed statistics and achievements.',
    color: '#DC2626',
  },
];

const developers = [
  {
    name: 'Development Team',
    role: 'Mobile App Development',
    description: '“Dedicated to serving the Tijāni community through technology, and the entire Muslim Ummah.”',
    icon: Code,
  },
  {
    name: 'UI/UX Design',
    role: 'User Experience Design',
    description: 'Crafting intuitive and beautiful spiritual experiences',
    icon: Coffee,
  },
];

export default function AboutScreen() {
  const { state } = useApp();

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@tijaniapp.com');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://hadaramap.com');
  };

  const handleGithubPress = () => {
    // Add GitHub link if available
    console.log('GitHub link clicked');
  };

  return (
    <SafeAreaView style={[
      styles.container,
      state.settings.darkMode && styles.containerDark
    ]}>
      <ScreenBackground>
      {/* <GradientHeader
        arabicTitle="حول التطبيق"
        englishTitle="About"
        subtitle="Learn More About Our Mission"
        icon={<Info color="#FFFFFF" size={32} />}
      /> */}

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* App Description */}
        <View style={[
          styles.descriptionContainer,
          state.settings.darkMode && styles.descriptionContainerDark
        ]}>
          <View style={styles.appIconContainer}>
            <Heart color="#059669" size={32} fill="#059669" />
          </View>
          <Text style={[
            styles.appTitle,
            state.settings.darkMode && styles.appTitleDark
          ]}>
            Wird & Wazīfa Tijāniyya
          </Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
          <Text style={[
            styles.description,
            state.settings.darkMode && styles.descriptionDark
          ]}>
            A spiritual companion app designed specifically for disciples of the Tijāniyya Sufi order. 
            This app helps you maintain your daily spiritual practices, track your progress, and connect 
            with the rich tradition of Tijāni dhikr and worship.
          </Text>
        </View>

        {/* Mission Statement */}
        <View style={[
          styles.missionContainer,
          state.settings.darkMode && styles.missionContainerDark
        ]}>
          <Text style={[
            styles.sectionTitle,
            state.settings.darkMode && styles.sectionTitleDark
          ]}>
            Our Mission
          </Text>
          <Text style={[
            styles.missionText,
            state.settings.darkMode && styles.missionTextDark
          ]}>
            To support the spiritual journey of Tijāni disciples worldwide by providing a modern, 
            accessible tool for maintaining traditional practices while fostering community connection 
            and spiritual growth.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={[
            styles.sectionTitle,
            state.settings.darkMode && styles.sectionTitleDark
          ]}>
            Key Features
          </Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <View key={index} style={[
                  styles.featureCard,
                  state.settings.darkMode && styles.featureCardDark
                ]}>
                  <View style={[
                    styles.featureIconContainer,
                    { backgroundColor: `${feature.color}15` }
                  ]}>
                    <FeatureIcon color={feature.color} size={24} />
                  </View>
                  <Text style={[
                    styles.featureTitle,
                    state.settings.darkMode && styles.featureTitleDark
                  ]}>
                    {feature.title}
                  </Text>
                  <Text style={[
                    styles.featureDescription,
                    state.settings.darkMode && styles.featureDescriptionDark
                  ]}>
                    {feature.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Development Team */}
        <View style={styles.developersSection}>
          <Text style={[
            styles.sectionTitle,
            state.settings.darkMode && styles.sectionTitleDark
          ]}>
            Development Team
          </Text>
          
          {developers.map((developer, index) => {
            const DeveloperIcon = developer.icon;
            return (
              <View key={index} style={[
                styles.developerCard,
                state.settings.darkMode && styles.developerCardDark
              ]}>
                <View style={styles.developerHeader}>
                  <View style={styles.developerIconContainer}>
                    <DeveloperIcon color="#059669" size={24} />
                  </View>
                  <View style={styles.developerInfo}>
                    <Text style={[
                      styles.developerName,
                      state.settings.darkMode && styles.developerNameDark
                    ]}>
                      {developer.name}
                    </Text>
                    <Text style={[
                      styles.developerRole,
                      state.settings.darkMode && styles.developerRoleDark
                    ]}>
                      {developer.role}
                    </Text>
                  </View>
                </View>
                <Text style={[
                  styles.developerDescription,
                  state.settings.darkMode && styles.developerDescriptionDark
                ]}>
                  {developer.description}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Acknowledgments */}
        <View style={[
          styles.acknowledgementsContainer,
          state.settings.darkMode && styles.acknowledgementsContainerDark
        ]}>
          <Text style={[
            styles.sectionTitle,
            state.settings.darkMode && styles.sectionTitleDark
          ]}>
            Acknowledgments
          </Text>
          <Text style={[
            styles.acknowledgmentText,
            state.settings.darkMode && styles.acknowledgmentTextDark
          ]}>
            Above all, we extend our deepest gratitude to Allah ﷻ, the Source of all guidance and light. We are profoundly thankful to the esteemed scholars and spiritual guides of the Tijāniyya, whose dedication has preserved and transmitted these sacred practices across generations. Special thanks are also due to the community members whose guidance and thoughtful feedback greatly enriched this work.
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={[
            styles.sectionTitle,
            state.settings.darkMode && styles.sectionTitleDark
          ]}>
            Contact & Support
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.contactCard,
              state.settings.darkMode && styles.contactCardDark
            ]}
            onPress={handleEmailPress}
            activeOpacity={0.7}
          >
            <View style={styles.contactIconContainer}>
              <Mail color="#059669" size={20} />
            </View>
            <View style={styles.contactContent}>
              <Text style={[
                styles.contactTitle,
                state.settings.darkMode && styles.contactTitleDark
              ]}>
                Email Support
              </Text>
              <Text style={[
                styles.contactDescription,
                state.settings.darkMode && styles.contactDescriptionDark
              ]}>
                support@tijaniapp.com
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.contactCard,
              state.settings.darkMode && styles.contactCardDark
            ]}
            onPress={handleWebsitePress}
            activeOpacity={0.7}
          >
            <View style={styles.contactIconContainer}>
              <Globe color="#059669" size={20} />
            </View>
            <View style={styles.contactContent}>
              <Text style={[
                styles.contactTitle,
                state.settings.darkMode && styles.contactTitleDark
              ]}>
                Website
              </Text>
              <Text style={[
                styles.contactDescription,
                state.settings.darkMode && styles.contactDescriptionDark
              ]}>
                hadaramap.com
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.contactCard,
              state.settings.darkMode && styles.contactCardDark
            ]}
            onPress={handleGithubPress}
            activeOpacity={0.7}
          >
            <View style={styles.contactIconContainer}>
              <Github color="#059669" size={20} />
            </View>
            <View style={styles.contactContent}>
              <Text style={[
                styles.contactTitle,
                state.settings.darkMode && styles.contactTitleDark
              ]}>
                Open Source
              </Text>
              <Text style={[
                styles.contactDescription,
                state.settings.darkMode && styles.contactDescriptionDark
              ]}>
                Contribute on GitHub
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Spiritual Quote */}
        <View style={[
          styles.quoteContainer,
          state.settings.darkMode && styles.quoteContainerDark
        ]}>
          <View style={styles.quoteIconContainer}>
            <Text style={styles.quoteMark}>"</Text>
          </View>
          <Text style={[
            styles.arabicQuote,
            state.settings.darkMode && styles.arabicQuoteDark
          ]}>
            رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
          </Text>
          <Text style={[
            styles.quoteTranslation,
            state.settings.darkMode && styles.quoteTranslationDark
          ]}>
            "Our Lord, give us good in this world and good in the next world, and save us from the punishment of the Fire"
          </Text>
          <Text style={[
            styles.quoteReference,
            state.settings.darkMode && styles.quoteReferenceDark
          ]}>
            — Quran 2:201
          </Text>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightContainer}>
          <Text style={[
            styles.copyrightText,
            state.settings.darkMode && styles.copyrightTextDark
          ]}>
            © 2024 Wird & Wazīfa Tijāniyya
          </Text>
          <Text style={[
            styles.copyrightSubtext,
            state.settings.darkMode && styles.copyrightSubtextDark
          ]}>
            Made with ❤️ for the Tijāni community
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
      </ScreenBackground>
    </SafeAreaView>
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
  
  // App Description
  descriptionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  descriptionContainerDark: {
    backgroundColor: '#1E293B',
  },
  appIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  appTitleDark: {
    color: '#F8FAFC',
  },
  versionBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  descriptionDark: {
    color: '#CBD5E1',
  },

  // Mission
  missionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  missionContainerDark: {
    backgroundColor: '#1E293B',
  },
  sectionTitle: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    // textAlign: 'center',
  },
  sectionTitleDark: {
    color: '#F8FAFC',
  },
  missionText: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
  missionTextDark: {
    color: '#CBD5E1',
  },

  // Features
  featuresSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  featureCardDark: {
    backgroundColor: '#1E293B',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  featureTitleDark: {
    color: '#F8FAFC',
  },
  featureDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  featureDescriptionDark: {
    color: '#CBD5E1',
  },

  // Developers Section
  developersSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  developerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  developerCardDark: {
    backgroundColor: '#1E293B',
  },
  developerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  developerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  developerInfo: {
    flex: 1,
  },
  developerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  developerNameDark: {
    color: '#F8FAFC',
  },
  developerRole: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  developerRoleDark: {
    color: '#10B981',
  },
  developerDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  developerDescriptionDark: {
    color: '#CBD5E1',
  },

  // Acknowledgments
  acknowledgementsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  acknowledgementsContainerDark: {
    backgroundColor: '#1E293B',
  },
  acknowledgmentText: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
  acknowledgmentTextDark: {
    color: '#CBD5E1',
  },

  // Contact
  contactSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  contactCardDark: {
    backgroundColor: '#1E293B',
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  contactTitleDark: {
    color: '#F8FAFC',
  },
  contactDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  contactDescriptionDark: {
    color: '#CBD5E1',
  },

  // Quote
  quoteContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
  quoteIconContainer: {
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

  // Copyright
  copyrightContainer: {
   backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    marginTop: 32,
  },
  copyrightText: {
    
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  copyrightTextDark: {
    color: '#CBD5E1',
  },
  copyrightSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  copyrightSubtextDark: {
    color: '#9CA3AF',
  },
  bottomSpacing: {
    height: 20,
  },
});