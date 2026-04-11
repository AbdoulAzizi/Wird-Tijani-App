// app/(tabs)/contact.tsx — Wird Tijani
// تواصل معنا · Contact Us

import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Animated, Easing, Platform, Linking,
  KeyboardAvoidingView, Alert, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft, Mail, Send, Instagram, Globe,
  ChevronRight, Heart, Phone, MessageCircle,
  MapPin, Star, AlertCircle, CheckCircle2,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useAppInfo }           from '@/hooks/useAppInfo';
import MinimalHeader            from '../../components/MinimalHeader';
import { LayoutActionsContext } from '../../contexts/LayoutActionsContext';

const { width } = Dimensions.get('window');

// ─── Palette (Wird Tijani green brand) ────────────────────────────────────────
const GREEN_DEEP  = '#022c22';
const GREEN_DARK  = '#064E3B';
const GREEN_MID   = '#065F46';
const GREEN_LIGHT = '#047857';
const GREEN_PALE  = '#D1FAE5';
const GOLD        = '#F59E0B';
const GOLD_LIGHT  = '#FDE68A';
const GOLD_MID    = '#D97706';
const WHITE       = '#F0FDF4';
const SLATE       = '#64748B';
const SLATE_LIGHT = '#94A3B8';
const SURFACE     = '#F8FAFC';
const DANGER      = '#EF4444';
const SUCCESS     = '#22C55E';

// ─── Haptic helper ─────────────────────────────────────────────────────────────
const haptic = (t: 'light' | 'medium' | 'success' = 'light') => {
  if (Platform.OS !== 'ios') return;
  if (t === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (t === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

// ─── Contact constants ─────────────────────────────────────────────────────────
const CONTACT_EMAIL = 'abdoulaziz.dev@gmail.com';
const WHATSAPP_NUM  = '+212646534846';
const GOOGLE_PLAY   = 'https://play.google.com/store/apps/dev?id=7231445670946996267';
const INSTAGRAM     = 'https://instagram.com/khadimlabs';

// ─── Subject chips ─────────────────────────────────────────────────────────────
const SUBJECTS = [
  { id: 'bug',      label: 'Bug Report',              color: DANGER        },
  { id: 'feature',  label: 'Feature Request',          color: '#7C3AED'     },
  { id: 'content',  label: 'Islamic Content',          color: GOLD_MID      },
  { id: 'collab',   label: 'Collaboration',            color: SUCCESS       },
  { id: 'question', label: 'General Inquiry',          color: GREEN_LIGHT   },
  { id: 'other',    label: 'Other',                    color: SLATE         },
];

// ─── Section Title ─────────────────────────────────────────────────────────────
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
  sub:   { fontSize: 12, color: SLATE_LIGHT, marginTop: 3, marginLeft: 13, fontWeight: '500' },
});

// ─── Animated Section ──────────────────────────────────────────────────────────
function Section({ anim, children, style }: { anim: Animated.Value; children: React.ReactNode; style?: object }) {
  return (
    <Animated.View style={[{
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
    }, style]}>
      {children}
    </Animated.View>
  );
}

// ─── Hero Banner ───────────────────────────────────────────────────────────────
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

      {/* Gold shimmer top */}
      <LinearGradient
        colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={hb.goldLine}
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

      {/* Gold shimmer bottom */}
      <LinearGradient
        colors={['transparent', GOLD, GOLD_LIGHT, GOLD, 'transparent']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={hb.goldLine}
      />
    </LinearGradient>
  );
}

const hb = StyleSheet.create({
  gradient:  { paddingTop: 32, paddingBottom: 28, paddingHorizontal: 24, overflow: 'hidden', position: 'relative' },
  circle1:   { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(255,255,255,0.04)', top: -80, right: -70 },
  circle2:   { position: 'absolute', width: 140, height: 140, borderRadius: 70,  backgroundColor: 'rgba(255,255,255,0.04)', bottom: -50, left: -40 },
  circle3:   { position: 'absolute', width: 80,  height: 80,  borderRadius: 40,  backgroundColor: 'rgba(245,158,11,0.07)', top: 50, left: 40 },
  goldLine:  { height: 1.5, opacity: 0.55, marginVertical: 16 },
  content:   { alignItems: 'center', gap: 7 },
  bismillah: { fontSize: 13, color: 'rgba(253,230,138,0.82)', fontWeight: '600', textAlign: 'center' },
  title:     { fontSize: 34, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.8, textAlign: 'center' },
  arabic:    { fontSize: 20, color: 'rgba(253,230,138,0.90)', fontWeight: '700', textAlign: 'center' },
  subtitle:  { fontSize: 13, color: 'rgba(209,250,229,0.78)', textAlign: 'center', lineHeight: 20, marginTop: 4, fontStyle: 'italic' },
});

// ─── Contact Info Card ─────────────────────────────────────────────────────────
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
        <View style={[ci.iconWrap, { backgroundColor: color + '18' }]}>
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
  label:   { fontSize: 11, fontWeight: '700', color: SLATE_LIGHT, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  value:   { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  arrow:   { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
});

// ─── Animated Text Input ───────────────────────────────────────────────────────
interface FocusInputProps {
  label:         string;
  value:         string;
  onChange:      (v: string) => void;
  placeholder:   string;
  multiline?:    boolean;
  keyboardType?: any;
  error?:        string;
}

function FocusInput({ label, value, onChange, placeholder, multiline, keyboardType, error }: FocusInputProps) {
  const borderAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => Animated.timing(borderAnim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
  const onBlur  = () => Animated.timing(borderAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();

  const borderColor = borderAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [error ? `${DANGER}55` : '#E2E8F0', GREEN_MID],
  });

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={fi.label}>{label}</Text>
      <Animated.View style={[fi.wrap, { borderColor }]}>
        <TextInput
          style={[fi.field, multiline && fi.fieldMulti]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#CBD5E1"
          multiline={multiline}
          numberOfLines={multiline ? 5 : 1}
          keyboardType={keyboardType ?? 'default'}
          textAlignVertical={multiline ? 'top' : 'center'}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
          returnKeyType={multiline ? 'default' : 'next'}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Animated.View>
      {error ? (
        <View style={fi.errorRow}>
          <AlertCircle size={11} color={DANGER} strokeWidth={2} />
          <Text style={fi.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const fi = StyleSheet.create({
  label:      { fontSize: 11, fontWeight: '700', color: SLATE, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  wrap:       { borderRadius: 14, borderWidth: 1.5, overflow: 'hidden', backgroundColor: SURFACE },
  field:      { paddingHorizontal: 14, paddingVertical: 12, color: '#1E293B', fontSize: 14, fontWeight: '500' },
  fieldMulti: { minHeight: 110, paddingTop: 12 },
  errorRow:   { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  errorText:  { fontSize: 11, color: DANGER, fontWeight: '500' },
});

// ─── Message Form ──────────────────────────────────────────────────────────────
function MessageForm() {
  const appInfo = useAppInfo();

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const canSend = selectedSubject !== null && message.trim().length >= 10;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedSubject)                  e.subject = 'Please select a subject';
    if (!message.trim())                   e.message = 'Message is required';
    else if (message.trim().length < 10)   e.message = 'Message too short (min 10 chars)';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Invalid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = async () => {
    if (!validate() || sending) return;
    haptic('medium');
    setSending(true);

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();

    const subjectObj = SUBJECTS.find(s => s.id === selectedSubject);
    const deviceLine = appInfo?.loading
      ? ''
      : `\n\n---\nApp: ${appInfo?.appName} ${appInfo?.fullVersion}\nOS: ${appInfo?.osName} ${appInfo?.osVersion}\nDevice: ${appInfo?.deviceModel ?? '—'}`;

    const body = [
      name.trim()  ? `From: ${name.trim()}`  : '',
      email.trim() ? `Email: ${email.trim()}` : '',
      '',
      message.trim(),
      deviceLine,
    ].filter(Boolean).join('\n');

    const mailUrl =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(`[Wird Tijani] ${subjectObj?.label ?? ''}`)}` +
      `&body=${encodeURIComponent(body)}`;

    try {
      const supported = await Linking.canOpenURL(mailUrl);
      if (supported) {
        await Linking.openURL(mailUrl);
        setTimeout(() => {
          setSent(true);
          setSending(false);
          haptic('success');
        }, 600);
      } else {
        Alert.alert(
          'No mail app found',
          `Please contact us directly at:\n${CONTACT_EMAIL}`,
          [
            { text: 'Copy address', onPress: () => Linking.openURL(`mailto:${CONTACT_EMAIL}`) },
            { text: 'OK', style: 'cancel' },
          ],
        );
        setSending(false);
      }
    } catch {
      Alert.alert('Error', 'Unable to open mail client.');
      setSending(false);
    }
  };

  const reset = () => {
    setSent(false);
    setSelectedSubject(null);
    setName(''); setEmail(''); setMessage('');
    setErrors({});
  };

  // ── Success state ──────────────────────────────────────────────────────────
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
          <TouchableOpacity style={mf.successBtn} onPress={reset}>
            <Text style={mf.successBtnText}>Send another message</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={mf.card}>
      <LinearGradient
        colors={[GREEN_DARK, GREEN_MID, GREEN_LIGHT]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={mf.topAccent}
      />
      <View style={mf.inner}>

        {/* Header */}
        <View style={mf.cardHeader}>
          <View style={mf.cardIconWrap}>
            <MessageCircle color={GREEN_MID} size={20} strokeWidth={2} />
          </View>
          <View>
            <Text style={mf.cardTitle}>Send a Message</Text>
            <Text style={mf.cardSubtitle}>We usually reply within 24 hours</Text>
          </View>
        </View>

        {/* Subject chips */}
        <View style={mf.subjectBlock}>
          <Text style={mf.subjectLabel}>Subject *</Text>
          <View style={mf.chipGrid}>
            {SUBJECTS.map(subj => {
              const active = selectedSubject === subj.id;
              return (
                <TouchableOpacity
                  key={subj.id}
                  style={[mf.chip, active && { backgroundColor: `${subj.color}15`, borderColor: `${subj.color}55` }]}
                  onPress={() => { haptic('light'); setSelectedSubject(subj.id); setErrors(e => ({ ...e, subject: '' })); }}
                  activeOpacity={0.78}
                >
                  <Text style={[mf.chipText, { color: active ? subj.color : SLATE }]}>{subj.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.subject ? (
            <View style={fi.errorRow}>
              <AlertCircle size={11} color={DANGER} strokeWidth={2} />
              <Text style={fi.errorText}>{errors.subject}</Text>
            </View>
          ) : null}
        </View>

        {/* Fields */}
        <FocusInput label="Your Name (optional)"     value={name}    onChange={setName}    placeholder="e.g. Ahmad Al-Tijani" />
        <FocusInput label="Email Address (optional)" value={email}   onChange={setEmail}   placeholder="your@email.com" keyboardType="email-address" error={errors.email} />
        <FocusInput
          label="Message *"
          value={message}
          onChange={(v) => { setMessage(v); if (errors.message) setErrors(e => ({ ...e, message: '' })); }}
          placeholder="Describe your request… (min 10 characters)"
          multiline
          error={errors.message}
        />

        {/* Char count */}
        <View style={mf.charRow}>
          <Text style={[mf.charCount, { color: message.length >= 10 ? SUCCESS : SLATE_LIGHT }]}>
            {message.length} / 10 min
          </Text>
        </View>

        {/* Device note */}
        <View style={mf.noteCard}>
          <Heart size={12} color={GOLD_MID} fill={GOLD_MID} strokeWidth={0} />
          <Text style={mf.noteText}>
            Device info ({appInfo?.loading ? '…' : `${appInfo?.appName} ${appInfo?.fullVersion}, ${appInfo?.osName} ${appInfo?.osVersion}`}) will be attached to help with diagnosis.
          </Text>
        </View>

        {/* Send button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[mf.sendBtn, !canSend && mf.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!canSend || sending}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={!canSend ? ['#94A3B8', '#64748B'] : [GREEN_DARK, GREEN_MID, GREEN_LIGHT]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={mf.sendGradient}
            >
              {sending
                ? <Text style={mf.sendText}>Opening mail…</Text>
                : (
                  <>
                    <Send color="#FFFFFF" size={16} strokeWidth={2.5} />
                    <Text style={mf.sendText}>Send Message</Text>
                  </>
                )
              }
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {!canSend && (
          <Text style={mf.sendHint}>
            {selectedSubject === null
              ? 'Choose a subject to continue'
              : 'Message must be at least 10 characters'}
          </Text>
        )}
      </View>
    </View>
  );
}

const mf = StyleSheet.create({
  card:          { marginHorizontal: 16, borderRadius: 22, backgroundColor: '#FFFFFF', overflow: 'hidden', shadowColor: GREEN_DARK, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 8 },
  topAccent:     { height: 3 },
  inner:         { padding: 20, gap: 4 },
  cardHeader:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  cardIconWrap:  { width: 40, height: 40, borderRadius: 12, backgroundColor: GREEN_MID + '12', justifyContent: 'center', alignItems: 'center' },
  cardTitle:     { fontSize: 17, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  cardSubtitle:  { fontSize: 11, color: SLATE_LIGHT, fontWeight: '500', marginTop: 1 },

  subjectBlock:  { marginBottom: 18 },
  subjectLabel:  { fontSize: 11, fontWeight: '700', color: SLATE, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  chipGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:          { borderRadius: 12, paddingHorizontal: 13, paddingVertical: 8, backgroundColor: SURFACE, borderWidth: 1.5, borderColor: '#E2E8F0' },
  chipText:      { fontSize: 12, fontWeight: '700' },

  charRow:       { alignItems: 'flex-end', marginTop: -8, marginBottom: 14 },
  charCount:     { fontSize: 11, fontWeight: '500' },

  noteCard:      { flexDirection: 'row', alignItems: 'flex-start', gap: 9, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: GOLD + '30', borderRadius: 13, padding: 12, marginBottom: 16 },
  noteText:      { flex: 1, fontSize: 11, color: SLATE, lineHeight: 17 },

  sendBtn:       { borderRadius: 16, overflow: 'hidden', marginTop: 4 },
  sendBtnDisabled: { opacity: 0.65 },
  sendGradient:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  sendText:      { fontSize: 15, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },
  sendHint:      { textAlign: 'center', fontSize: 11, color: SLATE_LIGHT, marginTop: 10 },

  successWrap:   { marginHorizontal: 16, borderRadius: 22, overflow: 'hidden' },
  successCard:   { padding: 32, alignItems: 'center', gap: 12 },
  successCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(245,158,11,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  successArabic: { fontSize: 18, color: GOLD_LIGHT, fontWeight: '700' },
  successTitle:  { fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.4 },
  successSub:    { fontSize: 13, color: 'rgba(209,250,229,0.8)', textAlign: 'center', lineHeight: 20, fontStyle: 'italic' },
  successBtn:    { marginTop: 8, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  successBtnText:{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});

// ─── Social Link Row ───────────────────────────────────────────────────────────
function SocialLinkRow({
  icon, label, sub, onPress,
}: {
  icon: React.ReactNode; label: string; sub: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={so.row} onPress={() => { haptic('light'); onPress(); }} activeOpacity={0.78}>
      <View style={so.iconWrap}>{icon}</View>
      <View style={so.body}>
        <Text style={so.label}>{label}</Text>
        <Text style={so.sub}>{sub}</Text>
      </View>
      <ChevronRight color={SLATE_LIGHT} size={14} strokeWidth={2.5} />
    </TouchableOpacity>
  );
}
const so = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 11, paddingHorizontal: 4 },
  iconWrap: { width: 38, height: 38, borderRadius: 11, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  body:     { flex: 1 },
  label:    { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  sub:      { fontSize: 11, color: SLATE_LIGHT, marginTop: 1 },
});

// ─── FAQ Row ───────────────────────────────────────────────────────────────────
function FAQRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    haptic('light');
    setOpen(prev => !prev);
    Animated.spring(heightAnim, {
      toValue: open ? 0 : 1,
      tension: 60, friction: 12, useNativeDriver: false,
    }).start();
  };

  const maxHeight = heightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 130] });

  return (
    <TouchableOpacity style={fq.row} onPress={toggle} activeOpacity={0.85}>
      <View style={fq.qRow}>
        <View style={fq.dot} />
        <Text style={fq.q}>{q}</Text>
        <Animated.View style={{
          transform: [{
            rotate: heightAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] }),
          }],
        }}>
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
  row:    { backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 8, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  qRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16 },
  dot:    { width: 7, height: 7, borderRadius: 3.5, backgroundColor: GOLD, flexShrink: 0 },
  q:      { flex: 1, fontSize: 14, fontWeight: '700', color: '#1E293B', lineHeight: 20 },
  answer: { overflow: 'hidden' },
  a:      { fontSize: 13, color: SLATE, lineHeight: 20, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 2 },
});

// ─── Quote Banner ──────────────────────────────────────────────────────────────
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
  wrap:    { marginHorizontal: 16, borderRadius: 20, padding: 22, alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: GOLD + '30' },
  starRow: { flexDirection: 'row', gap: 4, marginBottom: 4 },
  arabic:  { fontSize: 18, color: GREEN_DARK, fontWeight: '800', textAlign: 'center' },
  trans:   { fontSize: 13, color: '#78716C', fontStyle: 'italic', textAlign: 'center', lineHeight: 20 },
  ref:     { fontSize: 11, color: GOLD_MID, fontWeight: '800', letterSpacing: 0.5 },
});

// ─── Row divider ───────────────────────────────────────────────────────────────
function RowDiv() {
  return <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 2 }} />;
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function ContactScreen() {
  const { handleBack } = useContext(LayoutActionsContext);

  const anims = useRef(Array.from({ length: 6 }, () => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      70,
      anims.map(a => Animated.timing(a, {
        toValue: 1, duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })),
    ).start();
  }, []);

  const faqs = [
    {
      q: 'How do I reset my daily wird progress?',
      a: "Go to Settings → Data Management → Reset Today's Progress. This only resets the current day without affecting your history.",
    },
    {
      q: 'Can I use the app offline?',
      a: 'Yes! All core practices (Wird, Wazifa, Hadra) are fully available offline. Only the Hadara Map requires an internet connection.',
    },
    {
      q: 'Is my data backed up?',
      a: "Your data is stored locally on your device. We recommend using your device's backup system to keep it safe.",
    },
    {
      q: 'How do I report a mistake in the content?',
      a: 'Please use the form below or email us directly. We take accuracy very seriously and will review any reported issue promptly.',
    },
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
        {/* ── Hero ── */}
        <Section anim={anims[0]}>
          <HeroBanner />
        </Section>

        {/* ── Contact cards ── */}
        <Section anim={anims[1]} style={s.section}>
          <SectionTitle sub="Multiple ways to reach us">Get in Touch</SectionTitle>
          <ContactInfoCard
            icon={<Mail color={GREEN_LIGHT} size={20} strokeWidth={2} />}
            label="Email" value={CONTACT_EMAIL} color={GREEN_LIGHT} delay={0}
            onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}
          />
          <ContactInfoCard
            icon={<MessageCircle color="#0891B2" size={20} strokeWidth={2} />}
            label="WhatsApp" value={WHATSAPP_NUM} color="#0891B2" delay={80}
            onPress={() => Linking.openURL(`https://wa.me/${WHATSAPP_NUM.replace(/\D/g, '')}`)}
          />
          <ContactInfoCard
            icon={<Phone color="#7C3AED" size={20} strokeWidth={2} />}
            label="Phone" value={WHATSAPP_NUM} color="#7C3AED" delay={160}
            onPress={() => Linking.openURL(`tel:${WHATSAPP_NUM}`)}
          />
          <ContactInfoCard
            icon={<MapPin color={GOLD_MID} size={20} strokeWidth={2} />}
            label="Location" value="Available worldwide · Online" color={GOLD_MID} delay={240}
          />
        </Section>

        {/* ── Quote ── */}
        <Section anim={anims[2]} style={s.section}>
          <QuoteBanner />
        </Section>

        {/* ── Message form ── */}
        <Section anim={anims[3]} style={s.section}>
          <SectionTitle sub="We read every message">Write to Us</SectionTitle>
          <MessageForm />
        </Section>

        {/* ── Find us ── */}
        <Section anim={anims[4]} style={s.section}>
          <SectionTitle sub="Our other channels">Find Us</SectionTitle>
          <View style={s.card}>
            <SocialLinkRow
              icon={<Globe size={18} color={GREEN_MID} strokeWidth={2} />}
              label="Google Play"
              sub="KhadimLabs — Developer Profile"
              onPress={() => Linking.openURL(GOOGLE_PLAY)}
            />
            <RowDiv />
            <SocialLinkRow
              icon={<Instagram size={18} color="#E1306C" strokeWidth={2} />}
              label="Instagram"
              sub="@khadimlabs"
              onPress={() => Linking.openURL(INSTAGRAM)}
            />
            <RowDiv />
            <SocialLinkRow
              icon={<Mail size={18} color={GOLD_MID} strokeWidth={2} />}
              label="Email"
              sub={CONTACT_EMAIL}
              onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}
            />
          </View>
        </Section>

        {/* ── FAQ ── */}
        <Section anim={anims[5]} style={s.section}>
          <SectionTitle sub="Quick answers">FAQ</SectionTitle>
          <View style={{ paddingHorizontal: 16 }}>
            {faqs.map((f, i) => <FAQRow key={i} q={f.q} a={f.a} />)}
          </View>
        </Section>

        {/* ── Footer ── */}
        <LinearGradient colors={[GREEN_DEEP, GREEN_DARK]} style={s.footer}>
          <Text style={s.footerArabic}>بارك الله فيكم</Text>
          <Text style={s.footerText}>May Allah bless you all</Text>
          <LinearGradient
            colors={['transparent', GOLD, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.footerLine}
          />
          <Text style={s.footerSub}>© 2025 Wird Tijani · Made with ♥ for the Ummah</Text>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: SURFACE },
  content:      { paddingBottom: 0 },
  section:      { marginTop: 28 },
  card:         {
    marginHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 18,
    paddingHorizontal: 16, paddingVertical: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  footer:       { marginTop: 36, padding: 28, alignItems: 'center', gap: 8 },
  footerArabic: { fontSize: 20, color: GOLD_LIGHT, fontWeight: '800' },
  footerText:   { fontSize: 13, color: 'rgba(209,250,229,0.75)', fontStyle: 'italic' },
  footerLine:   { height: 1, width: '60%', opacity: 0.5, marginVertical: 6 },
  footerSub:    { fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: '500' },
});