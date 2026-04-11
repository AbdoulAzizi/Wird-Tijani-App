// app/(tabs)/about.tsx — Wird Tijani

import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, Animated, Easing,
} from 'react-native';
import {
  Heart, Star, Users, Mail, Globe, Award, Code, Coffee,
  Moon, Sparkles, MapPin, BookOpen, Info, Github, ShieldCheck,
  Timer, BarChart3,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp }           from '../../contexts/AppContext';
import { useAppVersion }    from '@/hooks/useAppVersion';
import ScreenBackground     from '../../components/ScreenBackground';
import SectionLabel         from '../../components/SectionLabel';
import { useContext }       from 'react';
import MinimalHeader        from '../../components/MinimalHeader';
import { LayoutActionsContext }   from '../../contexts/LayoutActionsContext';
import { useRegisterHeaderActions } from '../../contexts/HeaderActionsContext';

// ─── Palette ──────────────────────────────────────────────────────────────────
const GREEN_DEEP  = '#022c22';
const GREEN_DARK  = '#064E3B';
const GREEN_MID   = '#065F46';
const GREEN_LIGHT = '#059669';
const GOLD        = '#C8922A';
const GOLD_LIGHT  = '#E8B84B';
const GOLD_PALE   = '#FEF3C7';

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Heart,    title: 'Daily Wird',        description: 'Guided counters and progress tracking for your daily practice.', color: '#DC2626' },
  { icon: Star,     title: 'Daily Wazīfa',      description: 'The traditional Wazīfa sequence with collective dhikr.',          color: '#D97706' },
  { icon: Moon,     title: 'Ḥaḍra Sessions',    description: 'Spiritual gatherings with audio guidance and timers.',             color: '#7C3AED' },
  { icon: Sparkles, title: 'Asmā al-Ḥusnā',    description: 'The 99 Names of Allah with meanings and recitation guides.',      color: '#1E40AF' },
  { icon: Timer,    title: 'Dhikr Counter',     description: 'Count your personal dhikr with a dedicated tasbih counter.',      color: '#0891B2' },
  { icon: BookOpen, title: 'Library',           description: 'A rich library of spiritual texts, prayers and resources.',        color: GREEN_LIGHT },
  { icon: MapPin,   title: 'Hadara Map',        description: 'Find nearby zawiyas and community events.',                       color: '#B45309' },
  { icon: BarChart3,title: 'Progress Tracking', description: 'Detailed statistics, streaks and spiritual achievements.',         color: '#0891B2' },
];

const TEAM = [
  { icon: Code,   name: 'Development Team', role: 'Mobile App Development', quote: '"Dedicated to serving the Tijāni community through technology, and the entire Muslim Ummah."' },
  { icon: Coffee, name: 'UI/UX Design',     role: 'User Experience Design',  quote: 'Crafting intuitive and beautiful spiritual experiences.' },
];

const CONTACT = [
  { icon: Mail,   label: 'Email Support', value: 'abdoulaziz.dev@gmail.com', onPress: () => Linking.openURL('mailto:abdoulaziz.dev@gmail.com') },
  { icon: Globe,  label: 'Website',       value: 'tijaniapp.com',            onPress: () => Linking.openURL('https://tijaniapp.com') },
  { icon: Github, label: 'Open Source',   value: 'Contribute on GitHub',     onPress: () => {} },
];

// ─── Hadiya Card — Dedicated to Maulana Sheikh Ahmad Tijani ──────────────────
function HadiyaCard() {
  const glowAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 10, useNativeDriver: true }),
    ]).start();

    // Pulsing glow loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ]),
    ).start();
  }, []);

  const borderColor = glowAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['rgba(200,146,42,0.30)', 'rgba(200,146,42,0.80)'],
  });

  const shadowOpacity = glowAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0.18, 0.50],
  });

  return (
    <Animated.View style={[h.wrapper, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <Animated.View style={[h.borderGlow, { borderColor, shadowOpacity }]}>
        <LinearGradient
          colors={['#0A0A0F', '#0D1520', '#0A0A0F']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={h.gradient}
        >
          {/* ── Decorative rings ── */}
          <View style={[h.ring, { width: 220, height: 220, borderRadius: 110, top: -80, right: -70, borderColor: 'rgba(200,146,42,0.07)' }]} />
          <View style={[h.ring, { width: 130, height: 130, borderRadius: 65,  top: -30, right: -10, borderColor: 'rgba(200,146,42,0.05)' }]} />
          <View style={[h.ring, { width:  90, height:  90, borderRadius: 45,  bottom: -30, left: -20, borderColor: 'rgba(200,146,42,0.06)' }]} />

          {/* ── Gold shimmer top ── */}
          <LinearGradient
            colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={h.shimmer}
          />

          <View style={h.inner}>

            {/* ── Icon medallion ── */}
            <View style={h.medallion}>
              <View style={h.medallionRing}>
                <Heart color={GOLD} size={26} fill={GOLD} strokeWidth={0} />
              </View>
              <View style={h.medallionDot} />
            </View>

            {/* ── Badge ── */}
            <View style={h.badge}>
              <Text style={h.badgeText}>✦ إِهْدَاءٌ ✦</Text>
            </View>

            {/* ── Arabic dedication ── */}
            <Text style={h.arabicTitle}>
              إِلَى سَيِّدِنَا وَمَوْلانَا
            </Text>
            <Text style={h.arabicName}>
              الشَّيْخُ أَحْمَدُ التِّجَانِيُّ
            </Text>
            <Text style={h.arabicSub}>
              رَضِيَ اللهُ عَنْهُ
            </Text>

            {/* ── Gold divider ── */}
            <LinearGradient
              colors={['transparent', GOLD_LIGHT, 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={h.divider}
            />

            {/* ── French / English dedication text ── */}
            <Text style={h.dedicationTitle}>Hadiya — هَدِيَّة</Text>
            <Text style={h.dedicationText}>
              This application is offered as a humble spiritual gift{'\n'}
              to our beloved Master and Pole,{'\n'}
              <Text style={h.dedicationHighlight}>Maulana Sheikh Ahmad Tijani</Text>,{'\n'}
              may Allah be pleased with him.{'\n\n'}
              Every dhikr counted, every wird completed,{'\n'}
              every moment of remembrance within these pages{'\n'}
              is a gift of love sent to his noble soul.
            </Text>

            {/* ── Arabic closing ── */}
            <View style={h.closingWrap}>
              <Text style={h.closingArabic}>
                اَللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ
              </Text>
              <Text style={h.closingArabic}>
                وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ
              </Text>
            </View>

            {/* ── Stars ── */}
            <View style={h.starsRow}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} color={GOLD} size={11} fill={GOLD} strokeWidth={0} />
              ))}
            </View>

          </View>

          {/* ── Gold shimmer bottom ── */}
          <LinearGradient
            colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={h.shimmer}
          />
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

const h = StyleSheet.create({
  wrapper:    { marginHorizontal: 16, marginBottom: 4 },
  borderGlow: {
    borderRadius: 24, borderWidth: 1.5,
    shadowColor: GOLD, shadowOffset: { width: 0, height: 8 }, shadowRadius: 20,
    elevation: 16, overflow: 'hidden',
  },
  gradient:   { position: 'relative', overflow: 'hidden' },
  ring:       { position: 'absolute', borderWidth: 1 },
  shimmer:    { height: 1.5, opacity: 0.55 },
  inner:      { paddingHorizontal: 22, paddingVertical: 24, alignItems: 'center', gap: 10 },

  medallion:     { marginBottom: 4, alignItems: 'center', justifyContent: 'center' },
  medallionRing: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: 'rgba(200,146,42,0.10)',
    borderWidth: 1.5, borderColor: 'rgba(200,146,42,0.40)',
    justifyContent: 'center', alignItems: 'center',
  },
  medallionDot: {
    position: 'absolute', bottom: -4,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: GOLD, opacity: 0.8,
  },

  badge:     { backgroundColor: 'rgba(200,146,42,0.12)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.38)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 },
  badgeText: { fontSize: 10, fontWeight: '800', color: GOLD_LIGHT, letterSpacing: 2 },

  arabicTitle: { fontSize: 15, color: 'rgba(255,255,255,0.65)', fontWeight: '400', textAlign: 'center', letterSpacing: 0.5, lineHeight: 26 },
  arabicName:  { fontSize: 24, color: '#FFFFFF', fontWeight: '700', textAlign: 'center', letterSpacing: 0.5, lineHeight: 36, marginTop: -4 },
  arabicSub:   { fontSize: 13, color: GOLD_LIGHT, fontWeight: '500', textAlign: 'center', letterSpacing: 0.3, opacity: 0.9, marginTop: -4 },

  divider: { height: 1, width: '70%', opacity: 0.5, marginVertical: 4 },

  dedicationTitle:    { fontSize: 14, fontWeight: '800', color: GOLD, letterSpacing: 1, textAlign: 'center' },
  dedicationText:     { fontSize: 13, color: 'rgba(255,255,255,0.58)', textAlign: 'center', lineHeight: 22, fontStyle: 'italic' },
  dedicationHighlight:{ color: GOLD_LIGHT, fontWeight: '700', fontStyle: 'normal' },

  closingWrap:   { alignItems: 'center', gap: 2, marginTop: 4 },
  closingArabic: { fontSize: 13, color: 'rgba(255,255,255,0.50)', textAlign: 'center', lineHeight: 22, letterSpacing: 0.3 },

  starsRow: { flexDirection: 'row', gap: 6, marginTop: 4, opacity: 0.85 },
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function AboutScreen() {
  const { state }               = useApp();
  const { appName, appVersion } = useAppVersion();
  const { handleBack }          = useContext(LayoutActionsContext);

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

          {/* ── HADIYA — Dedication to Maulana Sheikh Ahmad Tijani ── */}
          <SectionLabel accentColor={GOLD}>Hadiya · هَدِيَّة</SectionLabel>
          <HadiyaCard />

          {/* ── MISSION ── */}
          <SectionLabel accentColor={GREEN_LIGHT}>Our Mission</SectionLabel>
          <View style={styles.card}>
            <View style={styles.missionInner}>
              <View style={styles.missionIconBox}>
                <ShieldCheck color={GREEN_LIGHT} size={22} strokeWidth={2} />
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
                    <Icon color={GREEN_LIGHT} size={20} strokeWidth={2} />
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
                    <Icon color={GREEN_LIGHT} size={18} strokeWidth={2} />
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
            <Text style={styles.copyrightSub}>Made with ❤️ for the Tijāniyya community worldwide</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenBackground>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:          { flex: 1 },
  scroll:        { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  heroCard: {
    backgroundColor: GREEN_LIGHT,
    borderRadius: 20, marginHorizontal: 16, marginTop: 20,
    padding: 24, alignItems: 'center', overflow: 'hidden',
    shadowColor: GREEN_LIGHT, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  heroCircle1: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.06)', top: -50, right: -40 },
  heroCircle2: { position: 'absolute', width: 100, height: 100, borderRadius: 50,  backgroundColor: 'rgba(255,255,255,0.06)', bottom: -30, left: -10 },
  heroIconRing: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  heroAppName:  { fontSize: 20, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', letterSpacing: -0.3, marginBottom: 10 },
  heroBadge:    { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 14 },
  heroBadgeText:{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  heroDesc:     { fontSize: 13, color: 'rgba(255,255,255,0.82)', textAlign: 'center', lineHeight: 20 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 4, marginHorizontal: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },

  missionInner:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 16 },
  missionIconBox:{ width: 40, height: 40, borderRadius: 11, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  missionText:   { flex: 1, fontSize: 14, color: '#4B5563', lineHeight: 22 },

  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginHorizontal: 16 },
  featureCard:  { width: '47.5%', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  featureIconBox:{ width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  featureTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 4 },
  featureDesc:  { fontSize: 11, color: '#6B7280', lineHeight: 16 },

  teamRow:       { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 14 },
  teamRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  teamIconBox:   { width: 40, height: 40, borderRadius: 11, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  teamName:      { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  teamRole:      { fontSize: 12, fontWeight: '600', color: GREEN_LIGHT, marginBottom: 6 },
  teamQuote:     { fontSize: 12, color: '#6B7280', lineHeight: 18, fontStyle: 'italic' },

  ackText: { fontSize: 14, color: '#4B5563', lineHeight: 22, paddingVertical: 16 },

  contactRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  contactRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  contactIconBox:   { width: 38, height: 38, borderRadius: 10, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  contactLabel:     { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 2 },
  contactValue:     { fontSize: 13, color: '#6B7280' },

  quoteCard: {
    marginHorizontal: 16, backgroundColor: '#FFFFFF',
    borderRadius: 16, padding: 20, alignItems: 'center', gap: 8,
    borderLeftWidth: 4, borderLeftColor: '#7C3AED',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  quoteArabic:     { fontSize: 16, textAlign: 'center', color: '#1F2937', lineHeight: 30, marginTop: 4 },
  quoteTranslation:{ fontSize: 12, textAlign: 'center', color: '#6B7280', fontStyle: 'italic', lineHeight: 19 },
  quoteRef:        { fontSize: 10, color: '#7C3AED', fontWeight: '700', opacity: 0.6 },

  copyrightCard: {
    backgroundColor: GREEN_LIGHT, borderRadius: 16,
    marginHorizontal: 16, marginTop: 24,
    paddingVertical: 20, paddingHorizontal: 24,
    alignItems: 'center', gap: 6, overflow: 'hidden',
    shadowColor: GREEN_LIGHT, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  copyrightCircle1: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.07)', top: -30, right: -20 },
  copyrightCircle2: { position: 'absolute', width: 60,  height: 60,  borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.07)', bottom: -20, left: 10 },
  copyrightText:    { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
  copyrightSub:     { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
});