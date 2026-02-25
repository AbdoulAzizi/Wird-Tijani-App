import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Animated, Dimensions, Platform, Linking,
  KeyboardAvoidingView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Mail, MessageCircle, Phone, MapPin, Send, ChevronRight,
  Globe, Instagram, Twitter, Youtube, Heart, Star,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import MinimalHeader from '../../components/MinimalHeader';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';

const { width } = Dimensions.get('window');

// ─── Palette ──────────────────────────────────────────────────────────────────
const GREEN_DEEP  = '#022c22';
const GREEN_DARK  = '#064E3B';
const GREEN_MID   = '#065F46';
const GREEN_LIGHT = '#047857';
const GOLD        = '#F59E0B';
const GOLD_LIGHT  = '#FDE68A';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const haptic = (t: 'light' | 'medium' | 'success' = 'light') => {
  if (Platform.OS !== 'ios') return;
  if (t === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (t === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

// ─── Hero Banner ──────────────────────────────────────────────────────────────
function HeroBanner() {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={[GREEN_DEEP, GREEN_DARK, GREEN_MID]}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={hb.gradient}
    >
      <View style={hb.circle1} />
      <View style={hb.circle2} />
      <View style={hb.circle3} />

      <LinearGradient
        colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={hb.goldTop}
      />

      <Animated.View style={[hb.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={hb.bismillah}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</Text>
        <Text style={hb.title}>Contact Us</Text>
        <Text style={hb.arabic}>تواصل معنا</Text>
        <Text style={hb.subtitle}>
          We're here to support your spiritual journey.{'\n'}
          Reach out anytime — we'd love to hear from you.
        </Text>
      </Animated.View>

      <LinearGradient
        colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={hb.goldBottom}
      />
    </LinearGradient>
  );
}

const hb = StyleSheet.create({
  gradient:  { paddingTop: 36, paddingBottom: 32, paddingHorizontal: 24, overflow: 'hidden' },
  circle1:   { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.04)', top: -70, right: -60 },
  circle2:   { position: 'absolute', width: 130, height: 130, borderRadius: 65,  backgroundColor: 'rgba(255,255,255,0.04)', bottom: -40, left: -30 },
  circle3:   { position: 'absolute', width: 70,  height: 70,  borderRadius: 35,  backgroundColor: 'rgba(245,158,11,0.08)', top: 40, left: 30 },
  goldTop:   { height: 1.5, marginBottom: 22, opacity: 0.6 },
  goldBottom:{ height: 1.5, marginTop: 24, opacity: 0.6 },
  content:   { alignItems: 'center', gap: 8 },
  bismillah: { fontSize: 14, color: 'rgba(253,230,138,0.85)', fontWeight: '600', textAlign: 'center' },
  title:     { fontSize: 34, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.8, textAlign: 'center' },
  arabic:    { fontSize: 20, color: 'rgba(253,230,138,0.9)', fontWeight: '700', textAlign: 'center' },
  subtitle:  { fontSize: 13, color: 'rgba(209,250,229,0.8)', textAlign: 'center', lineHeight: 20, marginTop: 4, fontStyle: 'italic' },
});

// ─── Contact Info Card ────────────────────────────────────────────────────────
function ContactInfoCard({
  icon, label, value, onPress, color, delay,
}: {
  icon: React.ReactNode; label: string; value: string;
  onPress?: () => void; color: string; delay: number;
}) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        style={ci.card}
        onPress={() => { haptic('light'); onPress?.(); }}
        activeOpacity={onPress ? 0.75 : 1}
      >
        <View style={[ci.accent, { backgroundColor: color }]} />
        <View style={[ci.iconWrap, { backgroundColor: color + '15' }]}>
          {icon}
        </View>
        <View style={ci.body}>
          <Text style={ci.label}>{label}</Text>
          <Text style={[ci.value, { color }]}>{value}</Text>
        </View>
        {onPress && (
          <View style={[ci.arrow, { backgroundColor: color + '12' }]}>
            <ChevronRight color={color} size={16} strokeWidth={2.5} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const ci = StyleSheet.create({
  card:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 18, marginHorizontal: 16, marginBottom: 10, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3, gap: 14, paddingRight: 16 },
  accent:  { width: 4, alignSelf: 'stretch' },
  iconWrap:{ width: 44, height: 44, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginVertical: 14, flexShrink: 0 },
  body:    { flex: 1, paddingVertical: 14 },
  label:   { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  value:   { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  arrow:   { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
});

// ─── Social Links ─────────────────────────────────────────────────────────────
function SocialLinks() {
  const socials = [
    { icon: <Instagram color="#E1306C" size={20} strokeWidth={2} />, label: 'Instagram', color: '#E1306C', url: 'https://instagram.com' },
    { icon: <Youtube    color="#FF0000" size={20} strokeWidth={2} />, label: 'YouTube',   color: '#FF0000', url: 'https://youtube.com'   },
    { icon: <Twitter    color="#1DA1F2" size={20} strokeWidth={2} />, label: 'Twitter',   color: '#1DA1F2', url: 'https://twitter.com'   },
    { icon: <Globe      color={GREEN_MID} size={20} strokeWidth={2} />, label: 'Website', color: GREEN_MID, url: 'https://example.com'  },
  ];

  return (
    <View style={so.wrap}>
      {socials.map(s => (
        <TouchableOpacity
          key={s.label}
          style={[so.btn, { borderColor: s.color + '30' }]}
          onPress={() => { haptic('light'); Linking.openURL(s.url); }}
          activeOpacity={0.75}
        >
          <View style={[so.iconWrap, { backgroundColor: s.color + '12' }]}>
            {s.icon}
          </View>
          <Text style={[so.label, { color: s.color }]}>{s.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const so = StyleSheet.create({
  wrap:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16 },
  btn:     { flex: 1, minWidth: '44%', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 13, borderWidth: 1.5, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  iconWrap:{ width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  label:   { fontSize: 13, fontWeight: '800' },
});

// ─── Message Form ─────────────────────────────────────────────────────────────
function MessageForm() {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleSend = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Missing fields', 'Please fill in your name, email, and message.');
      return;
    }
    haptic('medium');
    setSending(true);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();
    await new Promise(r => setTimeout(r, 1400));
    setSending(false);
    setSent(true);
    haptic('success');
  };

  if (sent) {
    return (
      <View style={mf.successWrap}>
        <LinearGradient colors={[GREEN_DARK, GREEN_MID]} style={mf.successCard}>
          <View style={mf.successCircle}>
            <Heart color={GOLD} size={32} fill={GOLD} />
          </View>
          <Text style={mf.successArabic}>جزاكم الله خيرًا</Text>
          <Text style={mf.successTitle}>Message Sent!</Text>
          <Text style={mf.successSub}>
            May Allah bless you. We'll get back to you as soon as possible, inshallah.
          </Text>
          <TouchableOpacity
            style={mf.successBtn}
            onPress={() => { setSent(false); setName(''); setEmail(''); setSubject(''); setMessage(''); }}
          >
            <Text style={mf.successBtnText}>Send another message</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  const fields = [
    { label: 'Your Name',     value: name,    setter: setName,    placeholder: 'e.g. Muhammad Ali'   },
    { label: 'Email Address', value: email,   setter: setEmail,   placeholder: 'your@email.com'      },
    { label: 'Subject',       value: subject, setter: setSubject, placeholder: 'What is this about?' },
  ];

  return (
    <View style={mf.card}>
      <LinearGradient
        colors={[GREEN_DARK, GREEN_MID, GREEN_LIGHT]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={mf.topAccent}
      />
      <View style={mf.cardInner}>
        <View style={mf.cardHeader}>
          <View style={mf.cardIconWrap}>
            <MessageCircle color={GREEN_MID} size={20} strokeWidth={2} />
          </View>
          <View>
            <Text style={mf.cardTitle}>Send a Message</Text>
            <Text style={mf.cardSubtitle}>We usually reply within 24 hours</Text>
          </View>
        </View>

        {fields.map(f => (
          <View key={f.label} style={mf.fieldWrap}>
            <Text style={mf.fieldLabel}>{f.label}</Text>
            <TextInput
              style={mf.input}
              value={f.value}
              onChangeText={f.setter}
              placeholder={f.placeholder}
              placeholderTextColor="#CBD5E1"
            />
          </View>
        ))}

        <View style={mf.fieldWrap}>
          <Text style={mf.fieldLabel}>Message</Text>
          <TextInput
            style={[mf.input, mf.textarea]}
            value={message}
            onChangeText={setMessage}
            placeholder="Write your message here..."
            placeholderTextColor="#CBD5E1"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[mf.sendBtn, sending && mf.sendBtnLoading]}
            onPress={handleSend}
            activeOpacity={0.85}
            disabled={sending}
          >
            <LinearGradient
              colors={sending ? ['#94A3B8', '#64748B'] : [GREEN_DARK, GREEN_MID, GREEN_LIGHT]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={mf.sendGradient}
            >
              {sending
                ? <Text style={mf.sendText}>Sending...</Text>
                : <><Send color="#FFFFFF" size={16} strokeWidth={2.5} /><Text style={mf.sendText}>Send Message</Text></>
              }
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const mf = StyleSheet.create({
  card:          { marginHorizontal: 16, borderRadius: 22, backgroundColor: '#FFFFFF', overflow: 'hidden', shadowColor: GREEN_DARK, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 8 },
  topAccent:     { height: 3 },
  cardInner:     { padding: 20, gap: 16 },
  cardHeader:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  cardIconWrap:  { width: 40, height: 40, borderRadius: 12, backgroundColor: GREEN_MID + '12', justifyContent: 'center', alignItems: 'center' },
  cardTitle:     { fontSize: 17, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  cardSubtitle:  { fontSize: 11, color: '#94A3B8', fontWeight: '500', marginTop: 1 },
  fieldWrap:     { gap: 6 },
  fieldLabel:    { fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.8 },
  input:         { backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1E293B', fontWeight: '500' },
  textarea:      { height: 110, paddingTop: 12 },
  sendBtn:       { borderRadius: 16, overflow: 'hidden' },
  sendBtnLoading:{ opacity: 0.75 },
  sendGradient:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  sendText:      { fontSize: 15, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },
  successWrap:   { marginHorizontal: 16, borderRadius: 22, overflow: 'hidden' },
  successCard:   { padding: 32, alignItems: 'center', gap: 12 },
  successCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(245,158,11,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  successArabic: { fontSize: 18, color: GOLD_LIGHT, fontWeight: '700' },
  successTitle:  { fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.4 },
  successSub:    { fontSize: 13, color: 'rgba(209,250,229,0.8)', textAlign: 'center', lineHeight: 20, fontStyle: 'italic' },
  successBtn:    { marginTop: 8, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  successBtnText:{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});

// ─── Section Title ────────────────────────────────────────────────────────────
function SectionTitle({ children, sub }: { children: string; sub?: string }) {
  return (
    <View style={st.wrap}>
      <View style={st.row}>
        <LinearGradient colors={[GREEN_DARK, GREEN_LIGHT]} style={st.bar} />
        <Text style={st.title}>{children}</Text>
      </View>
      {sub && <Text style={st.sub}>{sub}</Text>}
    </View>
  );
}
const st = StyleSheet.create({
  wrap:  { paddingHorizontal: 16, marginBottom: 14 },
  row:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bar:   { width: 3, height: 20, borderRadius: 2 },
  title: { fontSize: 19, fontWeight: '900', color: '#1E293B', letterSpacing: -0.4 },
  sub:   { fontSize: 12, color: '#94A3B8', marginTop: 3, marginLeft: 13, fontWeight: '500' },
});

// ─── FAQ Row ──────────────────────────────────────────────────────────────────
function FAQRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    haptic('light');
    const toValue = open ? 0 : 1;
    setOpen(!open);
    Animated.spring(heightAnim, { toValue, tension: 60, friction: 12, useNativeDriver: false }).start();
  };

  const maxHeight = heightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 120] });

  return (
    <TouchableOpacity style={fq.row} onPress={toggle} activeOpacity={0.85}>
      <View style={fq.qRow}>
        <View style={fq.dot} />
        <Text style={fq.q}>{q}</Text>
        <Animated.View style={{ transform: [{ rotate: heightAnim.interpolate({ inputRange: [0,1], outputRange: ['0deg','90deg'] }) }] }}>
          <ChevronRight color={GREEN_MID} size={14} strokeWidth={2.5} />
        </Animated.View>
      </View>
      <Animated.View style={[fq.answer, { maxHeight }]}>
        <Text style={fq.a}>{a}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
const fq = StyleSheet.create({
  row:   { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 8, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  qRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16 },
  dot:   { width: 7, height: 7, borderRadius: 3.5, backgroundColor: GOLD, flexShrink: 0 },
  q:     { flex: 1, fontSize: 14, fontWeight: '700', color: '#1E293B', lineHeight: 20 },
  answer:{ overflow: 'hidden' },
  a:     { fontSize: 13, color: '#64748B', lineHeight: 20, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 2 },
});

// ─── Quote Banner ─────────────────────────────────────────────────────────────
function QuoteBanner() {
  return (
    <LinearGradient
      colors={['#FFFBEB', '#FEF3C7', '#FFFBEB']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
      style={qb.wrap}
    >
      <View style={qb.starRow}>
        {[...Array(5)].map((_, i) => <Star key={i} color={GOLD} size={12} fill={GOLD} />)}
      </View>
      <Text style={qb.arabic}>إِنَّ مَعَ الْعُسْرِ يُسْرًا</Text>
      <Text style={qb.trans}>"Verily, with hardship comes ease"</Text>
      <Text style={qb.ref}>Quran 94:6</Text>
    </LinearGradient>
  );
}
const qb = StyleSheet.create({
  wrap:   { marginHorizontal: 16, borderRadius: 20, padding: 22, alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: GOLD + '30' },
  starRow:{ flexDirection: 'row', gap: 4, marginBottom: 4 },
  arabic: { fontSize: 18, color: GREEN_DARK, fontWeight: '800', textAlign: 'center' },
  trans:  { fontSize: 13, color: '#78716C', fontStyle: 'italic', textAlign: 'center', lineHeight: 20 },
  ref:    { fontSize: 11, color: GOLD, fontWeight: '800', letterSpacing: 0.5 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ContactScreen() {
  const { handleBack } = useContext(LayoutActionsContext);

  const faqs = [
    { q: 'How do I reset my daily wird progress?',    a: "Go to Settings → Data Management → Reset Today's Progress. This only resets the current day without affecting your history." },
    { q: 'Can I use the app offline?',                 a: 'Yes! All core practices (Wird, Wazifa, Hadra, Names) are fully available offline. Only the Hadara Map requires an internet connection.' },
    { q: 'Is my data backed up?',                      a: "Your data is stored locally on your device. We recommend using your device's backup system to keep it safe." },
    { q: 'How do I report a mistake in the content?',  a: 'Please use the form below or email us directly. We take accuracy very seriously and will review any reported issue promptly.' },
  ];

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <MinimalHeader
        title="Contact"
        subtitle="We're here for you"
        onBackPress={handleBack}
        theme="default"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
      >
        <HeroBanner />

        <View style={s.section}>
          <SectionTitle sub="Multiple ways to reach us">Get in Touch</SectionTitle>
          <ContactInfoCard icon={<Mail color="#059669" size={20} strokeWidth={2} />}         label="Email"     value="abdoulaziz.dev@gmail.com" color="#059669" delay={100} onPress={() => Linking.openURL('mailto:abdoulaziz.dev@gmail.com')} />
          <ContactInfoCard icon={<MessageCircle color="#0891B2" size={20} strokeWidth={2} />} label="WhatsApp" value="+212 646 534 846"           color="#0891B2" delay={180} onPress={() => Linking.openURL('https://wa.me/212646534846')} />
          <ContactInfoCard icon={<Phone color="#7C3AED" size={20} strokeWidth={2} />}         label="Phone"    value="+212 646 534 846"           color="#7C3AED" delay={260} onPress={() => Linking.openURL('tel:+212646534846')} />
          <ContactInfoCard icon={<MapPin color="#B45309" size={20} strokeWidth={2} />}        label="Location" value="Available worldwide · Online" color="#B45309" delay={340} />
        </View>

        <View style={s.section}>
          <SectionTitle sub="Follow our community">Follow Us</SectionTitle>
          <SocialLinks />
        </View>

        <View style={s.section}>
          <QuoteBanner />
        </View>

        <View style={s.section}>
          <SectionTitle sub="We read every message">Write to Us</SectionTitle>
          <MessageForm />
        </View>

        <View style={s.section}>
          <SectionTitle sub="Quick answers">FAQ</SectionTitle>
          <View style={{ paddingHorizontal: 16 }}>
            {faqs.map((f, i) => <FAQRow key={i} q={f.q} a={f.a} />)}
          </View>
        </View>

        <LinearGradient colors={[GREEN_DEEP, GREEN_DARK]} style={s.footer}>
          <Text style={s.footerArabic}>بارك الله فيكم</Text>
          <Text style={s.footerText}>May Allah bless you all</Text>
          <LinearGradient
            colors={['transparent', GOLD, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.footerLine}
          />
          <Text style={s.footerSub}>© 2025 Spiritual App · Made with ♥ for the Ummah</Text>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: '#F8FAFC' },
  content:     { paddingBottom: 0 },
  section:     { marginTop: 28 },
  footer:      { marginTop: 36, padding: 28, alignItems: 'center', gap: 8 },
  footerArabic:{ fontSize: 20, color: GOLD_LIGHT, fontWeight: '800' },
  footerText:  { fontSize: 13, color: 'rgba(209,250,229,0.75)', fontStyle: 'italic' },
  footerLine:  { height: 1, width: '60%', opacity: 0.5, marginVertical: 6 },
  footerSub:   { fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: '500' },
});