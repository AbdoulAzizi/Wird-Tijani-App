import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, Platform, StatusBar,
} from 'react-native';
import { X, MessageSquare, BookOpen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LivingWord } from '../../data/library/types';

interface WordDetailProps {
  word:    LivingWord | null;
  visible: boolean;
  onClose: () => void;
}

// ─── Living Words indigo palette — hero & tabs only ───────────────────────────
const HERO_DARK    = '#0F0E2A';
const INDIGO_DEEP  = '#1E1B4B';
const INDIGO_MID   = '#1D4ED8';
const INDIGO_LIGHT = '#2563EB';
const INDIGO_PALE  = '#EEF2FF';
const INDIGO_DIM   = '#818CF8';
const INDIGO_MUTED = '#A5B4FC';
const BORDER_HERO  = 'rgba(29,78,216,0.35)';

// ─── Neutral body palette ─────────────────────────────────────────────────────
const BODY_BG     = '#F8FAFC';
const BODY_TEXT   = '#374151';
const BODY_MUTED  = '#6B7280';
const BODY_BORDER = '#E2E8F0';
const SECTION_TXT = '#1D4ED8';
const SIG_BG      = '#EEF2FF';
const SIG_BORDER  = '#1D4ED8';

// ─── Shared sub-components ────────────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <View style={s.infoHeader}>
      <View style={s.sectionBar} />
      <Text style={s.infoTitle}>{label}</Text>
    </View>
  );
}

function BulletList({ items, color = SECTION_TXT }: { items: string[]; color?: string }) {
  return (
    <View style={s.bulletList}>
      {items.map((item, i) => (
        <View key={i} style={s.bulletRow}>
          <View style={[s.bullet, { backgroundColor: color }]} />
          <Text style={s.bulletTxt}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function WordDetail({ word, visible, onClose }: WordDetailProps) {
  const [tab, setTab] = useState<'quote' | 'context'>('quote');

  if (!word) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={s.root}>
        <StatusBar barStyle="light-content" />

        {/* ── HERO — indigo gradient ────────────────────────────────────── */}
        <LinearGradient colors={[HERO_DARK, INDIGO_DEEP, INDIGO_MID]} style={s.hero}>

          <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X size={14} color={INDIGO_MUTED} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Arabic text if present */}
          {word.arabicText ? (
            <Text style={s.heroArabic} numberOfLines={2}>{word.arabicText}</Text>
          ) : null}

          {/* Thin separator */}
          <View style={s.ornRow}>
            <View style={s.ornLine} />
            <View style={s.ornDot} />
            <View style={s.ornLine} />
          </View>

          {/* Title */}
          <Text style={s.heroTitle} numberOfLines={2}>{word.title}</Text>

          {/* Speaker */}
          <Text style={s.heroSubtitle} numberOfLines={1}>— {word.speaker}</Text>

          <LinearGradient
            colors={['transparent', INDIGO_LIGHT, INDIGO_DIM, INDIGO_LIGHT, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.heroLine}
          />
        </LinearGradient>

        {/* ── TABS ──────────────────────────────────────────────────────── */}
        <View style={s.tabBar}>
          <TouchableOpacity style={[s.tab, tab === 'quote' && s.tabActive]} onPress={() => setTab('quote')} activeOpacity={0.8}>
            <MessageSquare size={13} color={tab === 'quote' ? INDIGO_DIM : INDIGO_MUTED} strokeWidth={2} />
            <Text style={[s.tabTxt, tab === 'quote' && s.tabTxtActive]}>Quote</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.tab, tab === 'context' && s.tabActive]} onPress={() => setTab('context')} activeOpacity={0.8}>
            <BookOpen size={13} color={tab === 'context' ? INDIGO_DIM : INDIGO_MUTED} strokeWidth={2} />
            <Text style={[s.tabTxt, tab === 'context' && s.tabTxtActive]}>Context & Lessons</Text>
          </TouchableOpacity>
        </View>

        {/* ── BODY ──────────────────────────────────────────────────────── */}
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          {tab === 'quote' ? (
            <>
              {/* The quote */}
              <View style={s.quoteCard}>
                <Text style={s.quoteOpen}>"</Text>
                <Text style={s.quoteTxt}>{word.fullText}</Text>
                <Text style={s.quoteClose}>"</Text>
                <View style={s.quoteDivider} />
                <Text style={s.quoteSpeaker}>— {word.speaker}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={s.infoCard}>
                <SectionHeader label="Context" />
                <Text style={s.infoBody}>{word.context}</Text>
              </View>

              <View style={s.divider} />

              <View style={s.infoCard}>
                <SectionHeader label="Lessons" />
                <BulletList items={word.lessons} color={INDIGO_MID} />
              </View>
            </>
          )}
          <View style={{ height: 48 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BODY_BG },

  hero: {
    paddingTop: Platform.OS === 'ios' ? 52 : 28,
    paddingBottom: 0, paddingHorizontal: 20,
    overflow: 'hidden', alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute', top: Platform.OS === 'ios' ? 52 : 24, right: 14,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(29,78,216,0.2)', borderWidth: 1, borderColor: BORDER_HERO,
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
  heroArabic: {
    fontSize: 22, color: INDIGO_PALE, textAlign: 'center',
    writingDirection: 'rtl', fontWeight: '700', lineHeight: 32,
    paddingHorizontal: 40, marginBottom: 8,
  },
  ornRow:  { flexDirection: 'row', alignItems: 'center', width: '100%', gap: 8, marginBottom: 8 },
  ornLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: INDIGO_DIM, opacity: 0.25 },
  ornDot:  { width: 4, height: 4, borderRadius: 2, backgroundColor: INDIGO_DIM, opacity: 0.6 },
  heroTitle: {
    fontSize: 18, color: INDIGO_PALE, textAlign: 'center',
    fontWeight: '700', letterSpacing: 0.2, marginBottom: 4, paddingHorizontal: 40,
  },
  heroSubtitle: {
    fontSize: 12, color: INDIGO_MUTED, textAlign: 'center',
    fontStyle: 'italic', letterSpacing: 0.4, marginBottom: 12,
  },
  heroLine: { height: 1, opacity: 0.7, width: '100%' },

  tabBar:       { flexDirection: 'row', backgroundColor: HERO_DARK, borderBottomWidth: 1, borderBottomColor: BORDER_HERO },
  tab:          { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive:    { borderBottomColor: INDIGO_DIM },
  tabTxt:       { fontSize: 12, fontWeight: '600', color: INDIGO_MUTED, letterSpacing: 0.3 },
  tabTxtActive: { color: INDIGO_DIM },

  scroll:        { flex: 1, backgroundColor: BODY_BG },
  scrollContent: { padding: 16 },

  // Quote card
  quoteCard:    { backgroundColor: SIG_BG, borderRadius: 18, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#C7D2FE' },
  quoteOpen:    { fontSize: 48, color: INDIGO_MID, opacity: 0.2, lineHeight: 48, marginBottom: -10 },
  quoteTxt:     { fontSize: 17, color: '#1E293B', fontStyle: 'italic', textAlign: 'center', lineHeight: 26, fontWeight: '600' },
  quoteClose:   { fontSize: 48, color: INDIGO_MID, opacity: 0.2, lineHeight: 32, marginTop: -10 },
  quoteDivider: { height: 1, width: 40, backgroundColor: '#C7D2FE', marginTop: 14, marginBottom: 8 },
  quoteSpeaker: { fontSize: 12, color: INDIGO_MID, fontWeight: '700' },

  infoCard:   { marginBottom: 4 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionBar: { width: 3, height: 13, borderRadius: 2, backgroundColor: SECTION_TXT },
  infoTitle:  { fontSize: 10, fontWeight: '800', color: BODY_MUTED, letterSpacing: 1, textTransform: 'uppercase' },
  infoBody:   { fontSize: 14, color: BODY_TEXT, lineHeight: 23 },

  divider: { height: 1, backgroundColor: BODY_BORDER, marginVertical: 16 },

  bulletList: { gap: 9 },
  bulletRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bullet:     { width: 6, height: 6, borderRadius: 3, marginTop: 8, flexShrink: 0 },
  bulletTxt:  { flex: 1, fontSize: 14, color: BODY_TEXT, lineHeight: 22 },
});