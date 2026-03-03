import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, Platform, StatusBar,
} from 'react-native';
import { X, MapPin, BookOpen, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HolyPlace } from '../../data/library/types';

interface PlaceDetailProps {
  place:   HolyPlace | null;
  visible: boolean;
  onClose: () => void;
}

// ─── Holy Places green palette — hero & tabs only ─────────────────────────────
const HERO_DARK   = '#022C22';
const GREEN_DEEP  = '#064E3B';
const GREEN_MID   = '#065F46';
const GREEN_LIGHT = '#047857';
const GREEN_PALE  = '#D1FAE5';
const GREEN_DIM   = '#6EE7B7';
const GREEN_MUTED = '#A7F3D0';
const BORDER_HERO = 'rgba(6,95,70,0.35)';

// ─── Neutral body palette ─────────────────────────────────────────────────────
const BODY_BG     = '#F8FAFC';
const BODY_TEXT   = '#374151';
const BODY_MUTED  = '#6B7280';
const BODY_BORDER = '#E2E8F0';
const SECTION_TXT = '#065F46';
const SIG_BG      = '#F0FDF4';
const SIG_BORDER  = '#065F46';

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
export default function PlaceDetail({ place, visible, onClose }: PlaceDetailProps) {
  const [tab, setTab] = useState<'about' | 'practices'>('about');

  if (!place) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={s.root}>
        <StatusBar barStyle="light-content" />

        {/* ── HERO — green gradient ─────────────────────────────────────── */}
        <LinearGradient colors={[HERO_DARK, GREEN_DEEP, GREEN_MID]} style={s.hero}>

          <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <X size={14} color={GREEN_MUTED} strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Arabic name if present */}
          {place.arabicName ? (
            <Text style={s.heroArabic} numberOfLines={2}>{place.arabicName}</Text>
          ) : null}

          {/* Thin separator */}
          <View style={s.ornRow}>
            <View style={s.ornLine} />
            <View style={s.ornDot} />
            <View style={s.ornLine} />
          </View>

          {/* Place name */}
          <Text style={s.heroTitle} numberOfLines={2}>{place.name}</Text>

          {/* Location meta */}
          <View style={s.heroMeta}>
            <MapPin size={10} color={GREEN_MUTED} strokeWidth={2} />
            <Text style={s.metaTxt} numberOfLines={1}>{place.location}</Text>
          </View>

          <LinearGradient
            colors={['transparent', GREEN_LIGHT, GREEN_DIM, GREEN_LIGHT, 'transparent']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.heroLine}
          />
        </LinearGradient>

        {/* ── TABS ──────────────────────────────────────────────────────── */}
        <View style={s.tabBar}>
          <TouchableOpacity style={[s.tab, tab === 'about' && s.tabActive]} onPress={() => setTab('about')} activeOpacity={0.8}>
            <BookOpen size={13} color={tab === 'about' ? GREEN_DIM : GREEN_MUTED} strokeWidth={2} />
            <Text style={[s.tabTxt, tab === 'about' && s.tabTxtActive]}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.tab, tab === 'practices' && s.tabActive]} onPress={() => setTab('practices')} activeOpacity={0.8}>
            <Star size={13} color={tab === 'practices' ? GREEN_DIM : GREEN_MUTED} strokeWidth={2} />
            <Text style={[s.tabTxt, tab === 'practices' && s.tabTxtActive]}>Practices</Text>
          </TouchableOpacity>
        </View>

        {/* ── BODY ──────────────────────────────────────────────────────── */}
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          {tab === 'about' ? (
            <>
              <View style={s.infoCard}>
                <SectionHeader label="About This Place" />
                <Text style={s.infoBody}>{place.fullDescription}</Text>
              </View>

              <View style={s.divider} />

              <View style={s.sigCard}>
                <Star size={14} color={GREEN_MID} strokeWidth={2} style={{ marginTop: 1 }} />
                <Text style={s.sigText}>{place.significance}</Text>
              </View>

              <View style={s.divider} />

              <View style={s.infoCard}>
                <SectionHeader label="History" />
                <Text style={s.infoBody}>{place.history}</Text>
              </View>
            </>
          ) : (
            <View style={s.infoCard}>
              <SectionHeader label="Spiritual Practices" />
              <BulletList items={place.practices} color={GREEN_MID} />
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
    backgroundColor: 'rgba(6,95,70,0.2)', borderWidth: 1, borderColor: BORDER_HERO,
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
  heroArabic: {
    fontSize: 22, color: GREEN_PALE, textAlign: 'center',
    writingDirection: 'rtl', fontWeight: '700', lineHeight: 32,
    paddingHorizontal: 40, marginBottom: 8,
  },
  ornRow:  { flexDirection: 'row', alignItems: 'center', width: '100%', gap: 8, marginBottom: 8 },
  ornLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: GREEN_DIM, opacity: 0.25 },
  ornDot:  { width: 4, height: 4, borderRadius: 2, backgroundColor: GREEN_DIM, opacity: 0.6 },
  heroTitle: {
    fontSize: 22, color: GREEN_PALE, textAlign: 'center',
    fontWeight: '800', letterSpacing: 0.2, marginBottom: 4, paddingHorizontal: 40,
  },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  metaTxt:  { fontSize: 11, color: GREEN_MUTED, fontWeight: '500', flexShrink: 1, maxWidth: 200 },
  heroLine: { height: 1, opacity: 0.7, width: '100%' },

  tabBar:       { flexDirection: 'row', backgroundColor: HERO_DARK, borderBottomWidth: 1, borderBottomColor: BORDER_HERO },
  tab:          { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive:    { borderBottomColor: GREEN_DIM },
  tabTxt:       { fontSize: 12, fontWeight: '600', color: GREEN_MUTED, letterSpacing: 0.3 },
  tabTxtActive: { color: GREEN_DIM },

  scroll:        { flex: 1, backgroundColor: BODY_BG },
  scrollContent: { padding: 16 },

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