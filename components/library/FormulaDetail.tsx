import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, Platform, StatusBar,
} from 'react-native';
import { X, BookOpen, Star, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LibraryItem } from '../../data/library/types';

interface FormulaDetailProps {
  item:    LibraryItem | null;
  visible: boolean;
  onClose: () => void;
}

// ─── Sacred Formulas red palette — hero & tabs only ───────────────────────────
const HERO_DARK   = '#2D0707';
const RED_DEEP    = '#7F1D1D';
const RED_MID     = '#B91C1C';
const RED_LIGHT   = '#DC2626';
const RED_PALE    = '#FEE2E2';
const RED_DIM     = '#FCA5A5';
const RED_MUTED   = '#FECACA';
const BORDER_HERO = 'rgba(185,28,28,0.35)';

// ─── Neutral body palette ─────────────────────────────────────────────────────
const BODY_BG     = '#F8FAFC';
const BODY_TEXT   = '#374151';
const BODY_MUTED  = '#6B7280';
const BODY_BORDER = '#E2E8F0';
const SECTION_TXT = '#B91C1C';
const SIG_BG      = '#FFF1F2';
const SIG_BORDER  = '#DC2626';

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
export default function FormulaDetail({ item, visible, onClose }: FormulaDetailProps) {
  const [tab, setTab] = useState<'text' | 'benefits'>('text');

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={s.root}>
        <StatusBar barStyle="light-content" />

        {/* ── HERO — red gradient ───────────────────────────────────────── */}
        <LinearGradient colors={[HERO_DARK, RED_DEEP, RED_MID]} style={s.hero}>

          <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X size={14} color={RED_MUTED} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Badge */}
          <View style={[s.heroBadge, { backgroundColor: item.badgeColor + '22', borderColor: item.badgeColor + '55' }]}>
            <Text style={[s.heroBadgeTxt, { color: item.badgeColor === '#DC2626' ? RED_PALE : item.badgeColor }]}>
              {item.badge}
            </Text>
          </View>

          {/* Arabic text — dominant */}
          {item.arabicText ? (
            <Text style={s.heroArabic} numberOfLines={3}>{item.arabicText}</Text>
          ) : null}

          {/* Thin separator */}
          <View style={s.ornRow}>
            <View style={s.ornLine} />
            <View style={s.ornDot} />
            <View style={s.ornLine} />
          </View>

          {/* Title */}
          <Text style={s.heroTitle} numberOfLines={2}>{item.title}</Text>

          {/* Subtitle */}
          <Text style={s.heroSubtitle}>Sacred Formula · الوِرد</Text>

          <LinearGradient
            colors={['transparent', RED_LIGHT, RED_DIM, RED_LIGHT, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.heroLine}
          />
        </LinearGradient>

        {/* ── TABS ──────────────────────────────────────────────────────── */}
        <View style={s.tabBar}>
          <TouchableOpacity style={[s.tab, tab === 'text' && s.tabActive]} onPress={() => setTab('text')} activeOpacity={0.8}>
            <BookOpen size={13} color={tab === 'text' ? RED_DIM : RED_MUTED} strokeWidth={2} />
            <Text style={[s.tabTxt, tab === 'text' && s.tabTxtActive]}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.tab, tab === 'benefits' && s.tabActive]} onPress={() => setTab('benefits')} activeOpacity={0.8}>
            <Star size={13} color={tab === 'benefits' ? RED_DIM : RED_MUTED} strokeWidth={2} />
            <Text style={[s.tabTxt, tab === 'benefits' && s.tabTxtActive]}>Benefits</Text>
          </TouchableOpacity>
        </View>

        {/* ── BODY ──────────────────────────────────────────────────────── */}
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          {tab === 'text' ? (
            <>
              {/* Description */}
              <Text style={s.desc}>{item.fullDescription}</Text>

              <View style={s.divider} />

              {/* Arabic text block */}
              <View style={s.arabicCard}>
                <SectionHeader label="Arabic Text" />
                <View style={s.arabicBox}>
                  <Text style={s.arabicTxt}>{item.arabicText}</Text>
                </View>
              </View>

              <View style={s.divider} />

              {/* Transliteration */}
              <View style={s.infoCard}>
                <SectionHeader label="Transliteration" />
                <View style={s.transBox}>
                  <Text style={s.transTxt}>{item.transliteration}</Text>
                </View>
              </View>

              <View style={s.divider} />

              {/* Translation */}
              <View style={s.infoCard}>
                <SectionHeader label="Translation" />
                <Text style={s.infoBody}>{item.translation}</Text>
              </View>
            </>
          ) : (
            <View style={s.infoCard}>
              <SectionHeader label="Spiritual Benefits" />
              <BulletList items={item.benefits} color={RED_MID} />
            </View>
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
    backgroundColor: 'rgba(185,28,28,0.2)', borderWidth: 1, borderColor: BORDER_HERO,
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
  heroBadge: {
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
    borderWidth: 1, marginBottom: 10,
  },
  heroBadgeTxt: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  heroArabic: {
    fontSize: 20, color: RED_PALE, textAlign: 'center',
    writingDirection: 'rtl', fontWeight: '700', lineHeight: 32,
    paddingHorizontal: 20, marginBottom: 8,
  },
  ornRow:  { flexDirection: 'row', alignItems: 'center', width: '100%', gap: 8, marginBottom: 8 },
  ornLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: RED_DIM, opacity: 0.25 },
  ornDot:  { width: 4, height: 4, borderRadius: 2, backgroundColor: RED_DIM, opacity: 0.6 },
  heroTitle: {
    fontSize: 18, color: RED_PALE, textAlign: 'center',
    fontWeight: '800', letterSpacing: 0.2, marginBottom: 4, paddingHorizontal: 40,
  },
  heroSubtitle: {
    fontSize: 11, color: RED_MUTED, textAlign: 'center',
    fontStyle: 'italic', letterSpacing: 0.6, marginBottom: 12,
  },
  heroLine: { height: 1, opacity: 0.7, width: '100%' },

  tabBar:       { flexDirection: 'row', backgroundColor: HERO_DARK, borderBottomWidth: 1, borderBottomColor: BORDER_HERO },
  tab:          { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive:    { borderBottomColor: RED_DIM },
  tabTxt:       { fontSize: 12, fontWeight: '600', color: RED_MUTED, letterSpacing: 0.3 },
  tabTxtActive: { color: RED_DIM },

  scroll:        { flex: 1, backgroundColor: BODY_BG },
  scrollContent: { padding: 16 },

  desc: { fontSize: 15, color: BODY_TEXT, lineHeight: 24, marginBottom: 4 },

  arabicCard: { marginBottom: 4 },
  arabicBox:  {
    backgroundColor: '#FFF1F2', borderRadius: 14, padding: 20,
    borderWidth: 1, borderColor: '#FECDD3', alignItems: 'center',
  },
  arabicTxt: {
    fontSize: 20, color: '#881337', textAlign: 'center',
    writingDirection: 'rtl', fontWeight: '600', lineHeight: 34,
  },

  infoCard:   { marginBottom: 4 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionBar: { width: 3, height: 13, borderRadius: 2, backgroundColor: SECTION_TXT },
  infoTitle:  { fontSize: 10, fontWeight: '800', color: BODY_MUTED, letterSpacing: 1, textTransform: 'uppercase' },
  infoBody:   { fontSize: 14, color: BODY_TEXT, lineHeight: 23 },

  transBox: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 14 },
  transTxt: { fontSize: 13, color: '#475569', fontStyle: 'italic', lineHeight: 22 },

  divider: { height: 1, backgroundColor: BODY_BORDER, marginVertical: 16 },

  sigCard: { flexDirection: 'row', gap: 10, backgroundColor: SIG_BG, borderRadius: 14, padding: 14, borderLeftWidth: 3, borderLeftColor: SIG_BORDER },
  sigText: { flex: 1, fontSize: 14, color: BODY_TEXT, lineHeight: 23, fontStyle: 'italic' },

  bulletList: { gap: 9 },
  bulletRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bullet:     { width: 6, height: 6, borderRadius: 3, marginTop: 8, flexShrink: 0 },
  bulletTxt:  { flex: 1, fontSize: 14, color: BODY_TEXT, lineHeight: 22 },
});