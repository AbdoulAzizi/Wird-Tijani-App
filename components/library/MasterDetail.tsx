import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, Platform, StatusBar,
} from 'react-native';
import { X, User, MapPin, Calendar, Star, BookOpen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Master } from '../../data/library/types';

interface MasterDetailProps {
  master:  Master | null;
  visible: boolean;
  onClose: () => void;
}

// ─── Masters amber/brown palette — hero & tabs only ───────────────────────────
const HERO_DARK   = '#2C1505';
const BROWN       = '#78350F';
const AMBER_MID   = '#B45309';
const AMBER       = '#D97706';
const AMBER_LIGHT = '#F59E0B';
const AMBER_PALE  = '#FEF3C7';
const AMBER_DIM   = '#FCD34D';
const AMBER_MUTED = '#FDE68A';
const BORDER_HERO = 'rgba(217,119,6,0.35)';

// ─── Neutral body palette ─────────────────────────────────────────────────────
const BODY_BG     = '#F8FAFC';
const BODY_TEXT   = '#374151';
const BODY_MUTED  = '#6B7280';
const BODY_BORDER = '#E2E8F0';
const SECTION_TXT = '#B45309';   // masters accent on white
const TAG_BG      = '#FFFBEB';
const TAG_BORDER  = '#FDE68A';
const TAG_TXT     = '#92400E';
const SIG_BG      = '#FFFBEB';
const SIG_BORDER  = '#D97706';
const TEAL        = '#059669';   // teachings bullet

// ─── Section header (body) ────────────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <View style={s.infoHeader}>
      <View style={s.sectionBar} />
      <Text style={s.infoTitle}>{label}</Text>
    </View>
  );
}

// ─── Bullet list ──────────────────────────────────────────────────────────────
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
export default function MasterDetail({ master, visible, onClose }: MasterDetailProps) {
  const [tab, setTab] = useState<'bio' | 'teachings'>('bio');

  if (!master) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={s.root}>
        <StatusBar barStyle="light-content" />

        {/* ── HERO — amber/brown gradient ───────────────────────────────── */}
        <LinearGradient colors={[HERO_DARK, BROWN, AMBER_MID]} style={s.hero}>

          {/* Close button */}
          <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X size={14} color={AMBER_MUTED} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Name */}
          <Text style={s.heroTitle} numberOfLines={2}>{master.name}</Text>

          {/* Thin separator */}
          <View style={s.ornRow}>
            <View style={s.ornLine} />
            <View style={s.ornDot} />
            <View style={s.ornLine} />
          </View>

          {/* Subtitle / honorific */}
          {master.title ? (
            <Text style={s.heroSubtitle} numberOfLines={1}>{master.title}</Text>
          ) : null}

          {/* Meta: period · location */}
          <View style={s.heroMeta}>
            <Calendar size={10} color={AMBER_MUTED} strokeWidth={2} />
            <Text style={s.metaTxt} numberOfLines={1}>{master.years}</Text>
            <View style={s.metaDot} />
            <MapPin size={10} color={AMBER_MUTED} strokeWidth={2} />
            <Text style={s.metaTxt} numberOfLines={1}>{master.location}</Text>
          </View>

          {/* Bottom accent line */}
          <LinearGradient
            colors={['transparent', AMBER, AMBER_DIM, AMBER, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.heroLine}
          />
        </LinearGradient>

        {/* ── TABS — masters dark ────────────────────────────────────────── */}
        <View style={s.tabBar}>
          <TouchableOpacity style={[s.tab, tab === 'bio' && s.tabActive]} onPress={() => setTab('bio')} activeOpacity={0.8}>
            <User size={13} color={tab === 'bio' ? AMBER_DIM : AMBER_MUTED} strokeWidth={2} />
            <Text style={[s.tabTxt, tab === 'bio' && s.tabTxtActive]}>Biography</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.tab, tab === 'teachings' && s.tabActive]} onPress={() => setTab('teachings')} activeOpacity={0.8}>
            <BookOpen size={13} color={tab === 'teachings' ? AMBER_DIM : AMBER_MUTED} strokeWidth={2} />
            <Text style={[s.tabTxt, tab === 'teachings' && s.tabTxtActive]}>Teachings</Text>
          </TouchableOpacity>
        </View>

        {/* ── BODY ──────────────────────────────────────────────────────── */}
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          {tab === 'bio' ? (
            <>
              {/* Biography */}
              <View style={s.infoCard}>
                <SectionHeader label="Biography" />
                <Text style={s.infoBody}>{master.fullBiography}</Text>
              </View>

              <View style={s.divider} />

              {/* Achievements */}
              <View style={s.infoCard}>
                <SectionHeader label="Major Achievements" />
                <BulletList items={master.achievements} color={AMBER_MID} />
              </View>

              {/* Legacy */}
              <View style={s.divider} />
              <View style={s.sigCard}>
                <Star size={14} color={AMBER_MID} strokeWidth={2} style={{ marginTop: 1 }} />
                <Text style={s.sigText}>{master.legacy}</Text>
              </View>
            </>
          ) : (
            <>
              {/* Key Teachings */}
              <View style={s.infoCard}>
                <SectionHeader label="Key Teachings" />
                <BulletList items={master.teachings} color={TEAL} />
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

  // ── Hero — amber/brown
  hero: {
    paddingTop: Platform.OS === 'ios' ? 52 : 28,
    paddingBottom: 0,
    paddingHorizontal: 20,
    overflow: 'hidden',
    alignItems: 'center',
  },

  closeBtn: {
    position: 'absolute', top: Platform.OS === 'ios' ? 52 : 24, right: 14,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(217,119,6,0.2)', borderWidth: 1, borderColor: BORDER_HERO,
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },


  ornRow:  { flexDirection: 'row', alignItems: 'center', width: '100%', gap: 8, marginBottom: 8 },
  ornLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: AMBER_DIM, opacity: 0.25 },
  ornDot:  { width: 4, height: 4, borderRadius: 2, backgroundColor: AMBER_DIM, opacity: 0.6 },

  heroTitle: {
    fontSize: 22, color: AMBER_PALE, textAlign: 'center',
    fontWeight: '800', letterSpacing: 0.2, marginBottom: 4,
    paddingHorizontal: 40,
  },
  heroSubtitle: {
    fontSize: 12, color: AMBER_MUTED, textAlign: 'center',
    fontStyle: 'italic', letterSpacing: 0.4, marginBottom: 10,
  },

  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  metaTxt:  { fontSize: 11, color: AMBER_MUTED, fontWeight: '500', flexShrink: 1, maxWidth: 130 },
  metaDot:  { width: 3, height: 3, borderRadius: 2, backgroundColor: AMBER_MID, opacity: 0.7 },

  heroLine: { height: 1, opacity: 0.7, width: '100%' },

  // ── Tabs — masters dark
  tabBar:       { flexDirection: 'row', backgroundColor: HERO_DARK, borderBottomWidth: 1, borderBottomColor: BORDER_HERO },
  tab:          { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive:    { borderBottomColor: AMBER_DIM },
  tabTxt:       { fontSize: 12, fontWeight: '600', color: AMBER_MUTED, letterSpacing: 0.3 },
  tabTxtActive: { color: AMBER_DIM },

  // ── Body — neutral light
  scroll:        { flex: 1, backgroundColor: BODY_BG },
  scrollContent: { padding: 16, gap: 0 },

  infoCard:   { marginBottom: 4 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionBar: { width: 3, height: 13, borderRadius: 2, backgroundColor: SECTION_TXT },
  infoTitle:  { fontSize: 10, fontWeight: '800', color: BODY_MUTED, letterSpacing: 1, textTransform: 'uppercase' },
  infoBody:   { fontSize: 14, color: BODY_TEXT, lineHeight: 23 },

  divider: { height: 1, backgroundColor: BODY_BORDER, marginVertical: 16 },

  sigCard: { flexDirection: 'row', gap: 10, backgroundColor: SIG_BG, borderRadius: 14, padding: 14, borderLeftWidth: 3, borderLeftColor: SIG_BORDER },
  sigText: { flex: 1, fontSize: 14, color: BODY_TEXT, lineHeight: 23, fontStyle: 'italic' },

  bulletList: { gap: 9 },
  bulletRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bullet:     { width: 6, height: 6, borderRadius: 3, marginTop: 8, flexShrink: 0 },
  bulletTxt:  { flex: 1, fontSize: 14, color: BODY_TEXT, lineHeight: 22 },
});