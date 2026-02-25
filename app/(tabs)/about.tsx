import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking,
} from 'react-native';
import {
  Heart, Star, Users, Mail, Globe, Award, Code, Coffee,
  Moon, Sparkles, MapPin, BookOpen, Info, Github, ShieldCheck,
  Timer, BarChart3,
} from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { useAppVersion } from '@/hooks/useAppVersion';
import ScreenBackground from '../../components/ScreenBackground';
import SectionLabel from '../../components/SectionLabel';

import { useContext } from 'react';
import MinimalHeader from '../../components/MinimalHeader';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';


// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Heart,    title: 'Daily Wird',       description: 'Guided counters and progress tracking for your daily practice.', color: '#DC2626' },
  { icon: Star,     title: 'Daily Wazīfa',     description: 'The traditional Friday Wazīfa sequence with collective dhikr.', color: '#D97706' },
  { icon: Moon,     title: 'Ḥaḍra Sessions',   description: 'Spiritual gatherings with audio guidance and timers.',            color: '#7C3AED' },
  { icon: Sparkles, title: 'Asmā al-Ḥusnā',   description: 'The 99 Names of Allah with meanings and recitation guides.',     color: '#1E40AF' },
  { icon: Timer,    title: 'Dhikr Counter',    description: 'Count your personal dhikr with a dedicated tasbih counter.',     color: '#0891B2' },
  { icon: BookOpen, title: 'Library',          description: 'A rich library of spiritual texts, prayers and resources.',       color: '#059669' },
  { icon: MapPin,   title: 'Hadara Map',       description: 'Find nearby zawiyas and community events.',                      color: '#B45309' },
  { icon: BarChart3,title: 'Progress Tracking',description: 'Detailed statistics, streaks and spiritual achievements.',        color: '#0891B2' },
];

const TEAM = [
  { icon: Code,   name: 'Development Team', role: 'Mobile App Development',   quote: '"Dedicated to serving the Tijāni community through technology, and the entire Muslim Ummah."' },
  { icon: Coffee, name: 'UI/UX Design',     role: 'User Experience Design',   quote: 'Crafting intuitive and beautiful spiritual experiences.' },
];

const CONTACT = [
  { icon: Mail,   label: 'Email Support', value: 'abdoulaziz.dev@gmail.com', onPress: () => Linking.openURL('mailto:support@tijaniapp.com') },
  { icon: Globe,  label: 'Website',       value: 'tijaniapp.com',          onPress: () => Linking.openURL('https://tijaniapp.com') },
  { icon: Github, label: 'Open Source',   value: 'Contribute on GitHub',   onPress: () => {} },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AboutScreen() {
  const { state }                    = useApp();
  const { appName, appVersion }      = useAppVersion();

  const { handleBack } = useContext(LayoutActionsContext);

  useRegisterHeaderActions('/about', []);


  return (
  <View style={styles.root}>
      <MinimalHeader
        title="About"
        subtitle="Wird & Wazīfa Tijāniyya"
        onBackPress={handleBack}
        showMore={false}
        theme="default"
      />
      <ScreenBackground>
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {/* ── HERO CARD ── */}
          <View style={styles.heroCard}>
            {/* Decor circles */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />

            <View style={styles.heroIconRing}>
              <Heart color="#FFFFFF" size={28} fill="rgba(255,255,255,0.3)" />
            </View>
            <Text style={styles.heroAppName}>{appName}</Text>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Version {appVersion}</Text>
            </View>
            <Text style={styles.heroDesc}>
              A spiritual companion for disciples of the Tijāniyya Sufi order — maintaining
              daily practices, tracking progress, and connecting with the tradition of Tijāni dhikr.
            </Text>
          </View>

          {/* ── MISSION ── */}
          <SectionLabel accentColor="#059669">Our Mission</SectionLabel>
          <View style={styles.card}>
            <View style={styles.missionInner}>
              <View style={styles.missionIconBox}>
                <ShieldCheck color="#059669" size={22} strokeWidth={2} />
              </View>
              <Text style={styles.missionText}>
                To support the spiritual journey of Tijāni disciples worldwide by providing a modern,
                accessible tool for maintaining traditional practices while fostering community
                connection and spiritual growth.
              </Text>
            </View>
          </View>

          {/* ── FEATURES ── */}
          <SectionLabel accentColor="#6366F1">Key Features</SectionLabel>
          <View style={styles.featuresGrid}>
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <View key={f.title} style={styles.featureCard}>
                  <View style={[styles.featureIconBox, { backgroundColor: f.color + '15' }]}>
                    <Icon color={f.color} size={20} strokeWidth={2} />
                  </View>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.description}</Text>
                </View>
              );
            })}
          </View>

          {/* ── TEAM ── */}
          <SectionLabel accentColor="#D97706">Development Team</SectionLabel>
          <View style={styles.card}>
            {TEAM.map((member, i) => {
              const Icon = member.icon;
              return (
                <View
                  key={member.name}
                  style={[styles.teamRow, i < TEAM.length - 1 && styles.teamRowBorder]}
                >
                  <View style={styles.teamIconBox}>
                    <Icon color="#059669" size={20} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.teamName}>{member.name}</Text>
                    <Text style={styles.teamRole}>{member.role}</Text>
                    <Text style={styles.teamQuote}>{member.quote}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* ── ACKNOWLEDGMENTS ── */}
          <SectionLabel accentColor="#7C3AED">Acknowledgments</SectionLabel>
          <View style={styles.card}>
            <Text style={styles.ackText}>
              Above all, we extend our deepest gratitude to Allah ﷻ, the Source of all guidance
              and light. We are profoundly thankful to the esteemed scholars and spiritual guides
              of the Tijāniyya, whose dedication has preserved and transmitted these sacred
              practices across generations. Special thanks are also due to the community members
              whose guidance and thoughtful feedback greatly enriched this work.
            </Text>
          </View>

          {/* ── CONTACT ── */}
          <SectionLabel accentColor="#0891B2">Contact &amp; Support</SectionLabel>
          <View style={styles.card}>
            {CONTACT.map((c, i) => {
              const Icon = c.icon;
              return (
                <TouchableOpacity
                  key={c.label}
                  style={[styles.contactRow, i < CONTACT.length - 1 && styles.contactRowBorder]}
                  onPress={c.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.contactIconBox}>
                    <Icon color="#059669" size={18} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contactLabel}>{c.label}</Text>
                    <Text style={styles.contactValue}>{c.value}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── QUOTE ── */}
          <SectionLabel accentColor="#7C3AED">Reflection</SectionLabel>
          <View style={styles.quoteCard}>
            <Sparkles color="#7C3AED" size={16} strokeWidth={2} />
            <Text style={styles.quoteArabic}>
              رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
            </Text>
            <Text style={styles.quoteTranslation}>
              "Our Lord, give us good in this world and good in the next world,
              and save us from the punishment of the Fire"
            </Text>
            <Text style={styles.quoteRef}>— Quran 2:201</Text>
          </View>

          {/* ── COPYRIGHT ── */}
          <View style={styles.copyrightCard}>
            <View style={styles.copyrightCircle1} />
            <View style={styles.copyrightCircle2} />
            <Heart color="#FFFFFF" size={18} fill="rgba(255,255,255,0.4)" strokeWidth={0} />
            <Text style={styles.copyrightText}>
              © {new Date().getFullYear()} {appName}
            </Text>
            <Text style={styles.copyrightSub}>Made with ❤️ for the Muslim community</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenBackground>
    </View>
  );
}

// ─── Styles — same tokens as StatsScreen ──────────────────────────────────────

const styles = StyleSheet.create({
  root:          { flex: 1 },
  scroll:        { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // ── Hero card (copied from StatsScreen heroCard)
  heroCard: {
    backgroundColor: '#059669',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  heroCircle1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -50, right: -40,
  },
  heroCircle2: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.06)', bottom: -30, left: -10,
  },
  heroIconRing: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
  },
  heroAppName: {
    fontSize: 20, fontWeight: '800', color: '#FFFFFF',
    textAlign: 'center', letterSpacing: -0.3, marginBottom: 10,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4,
    marginBottom: 14,
  },
  heroBadgeText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  heroDesc: {
    fontSize: 13, color: 'rgba(255,255,255,0.82)',
    textAlign: 'center', lineHeight: 20,
  },

  // ── Generic white card (StatsScreen .card)
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  // ── Mission
  missionInner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingVertical: 16,
  },
  missionIconBox: {
    width: 40, height: 40, borderRadius: 11,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  missionText: { flex: 1, fontSize: 14, color: '#4B5563', lineHeight: 22 },

  // ── Features grid (2 columns, white cards)
  featuresGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 10, marginHorizontal: 16,
  },
  featureCard: {
    width: '47.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14, padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  featureIconBox: {
    width: 38, height: 38, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  featureTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 4 },
  featureDesc:  { fontSize: 11, color: '#6B7280', lineHeight: 16 },

  // ── Team rows
  teamRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingVertical: 14,
  },
  teamRowBorder:  { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  teamIconBox: {
    width: 40, height: 40, borderRadius: 11,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  teamName:  { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  teamRole:  { fontSize: 12, fontWeight: '600', color: '#059669', marginBottom: 6 },
  teamQuote: { fontSize: 12, color: '#6B7280', lineHeight: 18, fontStyle: 'italic' },

  // ── Acknowledgments
  ackText: {
    fontSize: 14, color: '#4B5563', lineHeight: 22,
    paddingVertical: 16,
  },

  // ── Contact rows (same pattern as stat rows)
  contactRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14,
  },
  contactRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  contactIconBox: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  contactLabel: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 2 },
  contactValue: { fontSize: 13, color: '#6B7280' },

  // ── Quote card (same as DailyAchievementsScreen)
  quoteCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16, padding: 20,
    alignItems: 'center', gap: 8,
    borderLeftWidth: 4, borderLeftColor: '#7C3AED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  quoteArabic: {
    fontSize: 16, textAlign: 'center', color: '#1F2937',
    lineHeight: 30, marginTop: 4,
  },
  quoteTranslation: {
    fontSize: 12, textAlign: 'center', color: '#6B7280',
    fontStyle: 'italic', lineHeight: 19,
  },
  quoteRef: { fontSize: 10, color: '#7C3AED', fontWeight: '700', opacity: 0.6 },

  // ── Copyright
  copyrightCard: {
    backgroundColor: '#059669',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  copyrightCircle1: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -30, right: -20,
  },
  copyrightCircle2: {
    position: 'absolute', width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.07)', bottom: -20, left: 10,
  },
  copyrightText: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
  copyrightSub:  { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
});