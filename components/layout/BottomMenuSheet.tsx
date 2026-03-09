// components/layout/BottomMenuSheet.tsx

import { X, ChevronRight } from 'lucide-react-native';
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet, ScrollView, Pressable, Dimensions, Platform,
} from 'react-native';
import { useRef, useEffect } from 'react';

import { useAppVersion } from '@/hooks/useAppVersion';
import { MenuItem }      from '@/constants/menuItems';

// ─── Constants ────────────────────────────────────────────────────────────────
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.76;

// Groups to display in the sheet
const GROUPS: { label: string; emoji: string; routes: string[] }[] = [
  { label: 'Daily Practices',       emoji: '🕌', routes: ['/', '/wird', '/wazifa', '/hadra'] },
  { label: "Qur'ān & Dhikr",        emoji: '📗', routes: ['/suwar', '/asmaa-alhusna', '/asmaa-nabi', '/dhikr-counter'] },
  { label: 'Meditation & Presence', emoji: '✦',  routes: ['/hadra-station'] },
  { label: 'Discover',              emoji: '✨', routes: ['/library', '/hadra-map'] },
  { label: 'Tools',                 emoji: '⚙️', routes: ['/stats', '/notifications', '/notification-settings', '/settings', '/about', '/contact'] },
];

// ─── Ornamental divider ───────────────────────────────────────────────────────
function OrnamentalDivider() {
  return (
    <View style={s.divider}>
      <View style={s.dividerLine} />
      <Text style={s.dividerGlyph}>✦</Text>
      <View style={s.dividerLine} />
    </View>
  );
}

// ─── Special card : Al-Hadra ──────────────────────────────────────────────────
function HadraCard({
  item, isActive, onPress, index,
}: {
  item: MenuItem; isActive: boolean; onPress: () => void; index: number;
}) {
  const Icon      = item.icon;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1, delay: index * 55,
        damping: 18, stiffness: 200, useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 280, delay: index * 55, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], width: '100%' }}>
      <TouchableOpacity
        style={[s.hadraCard, isActive && { borderColor: '#C8922A', borderWidth: 1.5 }]}
        onPress={onPress}
        activeOpacity={0.78}
      >
        <View style={s.hadraBg} />
        <View style={s.hadraInner}>
          <View style={[s.cardIcon, s.hadraIcon]}>
            <Icon color="#C8922A" size={22} strokeWidth={1.8} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <Text style={s.hadraCardTitle}>{item.name}</Text>
              <View style={s.hadraBadge}>
                <Text style={s.hadraBadgeTxt}>✦ PRESENCE</Text>
              </View>
            </View>
            <Text style={s.hadraCardDesc}>{item.description}</Text>
          </View>
          <ChevronRight color="#C8922A" size={16} strokeWidth={2} />
        </View>
        <View style={s.hadraGoldLine} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Standard card ────────────────────────────────────────────────────────────
function MenuCard({
  item, isActive, onPress, index,
}: {
  item: MenuItem; isActive: boolean; onPress: () => void; index: number;
}) {
  const Icon      = item.icon;
  const color     = item.color || '#059669';
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1, delay: index * 55,
        damping: 18, stiffness: 200, useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 280, delay: index * 55, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[s.cardAnimWrap, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[s.card, isActive && s.cardActive, isActive && { borderColor: color }]}
        onPress={onPress}
        activeOpacity={0.72}
      >
        <View style={[s.cardIcon, { backgroundColor: isActive ? color : color + '15' }]}>
          <Icon color={isActive ? '#FFFFFF' : color} size={20} strokeWidth={2} />
        </View>
        <Text style={[s.cardTitle, isActive && { color }]} numberOfLines={1}>{item.name}</Text>
        <Text style={s.cardDesc} numberOfLines={1}>{item.description}</Text>

        {item.badge && item.badge > 0 ? (
          <View style={s.badgePill}>
            <Text style={s.badgeTxt}>{item.badge > 9 ? '9+' : item.badge}</Text>
          </View>
        ) : item.isNew ? (
          <View style={s.newPill}>
            <Text style={s.newTxt}>NEW</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Bottom menu sheet ────────────────────────────────────────────────────────
interface Props {
  visible:    boolean;
  onClose:    () => void;
  menuItems:  MenuItem[];
  onNavigate: (route: string) => void;
  pathname:   string;
}

export function BottomMenuSheet({ visible, onClose, menuItems, onNavigate, pathname }: Props) {
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const { appName, fullVersion } = useAppVersion();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue:         visible ? 0 : SHEET_HEIGHT,
        useNativeDriver: true,
        damping:         visible ? 22 : 26,
        stiffness:       visible ? 160 : 180,
      }),
      Animated.timing(fadeAnim, {
        toValue:         visible ? 1 : 0,
        duration:        visible ? 220 : 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  if (!visible) return null;

  const groups = GROUPS
    .map(g => ({
      ...g,
      items: menuItems.filter(i => g.routes.includes(i.route)),
    }))
    .filter(g => g.items.length > 0);

  let cardIndex = 0;

  return (
    <View style={s.overlay} pointerEvents="box-none">
      <Animated.View style={[s.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <View style={s.handleWrap}>
          <View style={s.handle} />
        </View>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.headerTitle}>Navigation</Text>
            <Text style={s.headerSub}>Where would you like to go?</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
            <X color="#64748B" size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <OrnamentalDivider />

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
          bounces={false}
        >
          {groups.map(group => (
            <View key={group.label} style={s.group}>
              <View style={s.groupLabelRow}>
                <Text style={s.groupEmoji}>{group.emoji}</Text>
                <Text style={s.groupLabel}>{group.label}</Text>
              </View>
              <View style={s.grid}>
                {group.items.map(item => {
                  const isActive = pathname === item.route;
                  const navigate = () => onNavigate(item.route);
                  const idx      = cardIndex++;

                  if (item.route === '/hadra-station')
                    return (
                      <HadraCard
                        key={item.route}
                        item={item}
                        isActive={isActive}
                        onPress={navigate}
                        index={idx}
                      />
                    );

                  return (
                    <MenuCard
                      key={item.route}
                      item={item}
                      isActive={isActive}
                      onPress={navigate}
                      index={idx}
                    />
                  );
                })}
              </View>
            </View>
          ))}

          <Text style={s.footerArabic}>بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيم</Text>
          <Text style={s.version}>{appName} · v{fullVersion}</Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  overlay:  { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, justifyContent: 'flex-end', marginBottom: 110},
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: '#FFFFFF', height: SHEET_HEIGHT,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.14, shadowRadius: 18, elevation: 30,
  },

  handleWrap: { alignItems: 'center', paddingTop: 12, paddingBottom: 2 },
  handle:     { width: 36, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 22, paddingVertical: 14,
    // removed borderBottom — divider takes that role now
  },
  headerTitle: { fontSize: 19, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  headerSub:   { fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: '500' },
  closeBtn:    { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  // Ornamental divider — uses existing palette colors
  divider:      { flexDirection: 'row', alignItems: 'center', marginHorizontal: 22, marginBottom: 6 },
  dividerLine:  { flex: 1, height: 1, backgroundColor: '#F1F5F9' },
  dividerGlyph: { fontSize: 10, color: '#CBD5E1', marginHorizontal: 10 },

  scrollContent: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 30 },
  group:         { marginBottom: 22 },
  groupLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, marginLeft: 2 },
  groupEmoji:    { fontSize: 13 },
  groupLabel:    { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.2 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  // Card animation wrapper (half width)
  cardAnimWrap: { width: '47.5%' },

  // Standard card — original colors untouched
  card: {
    width: '100%', backgroundColor: '#F8FAFC', borderRadius: 16,
    padding: 14, borderWidth: 1.5, borderColor: 'transparent', position: 'relative',
  },
  cardActive: { backgroundColor: '#F0FDF4' },
  cardIcon:   { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginBottom: 9 },
  cardTitle:  { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  cardDesc:   { fontSize: 10.5, color: '#94A3B8', fontWeight: '500' },

  badgePill: {
    position: 'absolute', top: 9, right: 9,
    backgroundColor: '#EF4444', borderRadius: 7,
    minWidth: 16, height: 16, paddingHorizontal: 3,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeTxt: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },

  newPill: { position: 'absolute', top: 9, right: 9, backgroundColor: '#065F46', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 },
  newTxt:  { color: '#FFFFFF', fontSize: 8, fontWeight: '800', letterSpacing: 0.6 },

  // Hadra card — original colors untouched
  hadraCard: {
    width: '100%', backgroundColor: '#0A0A0F', borderRadius: 16,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(200,146,42,0.22)', position: 'relative',
  },
  hadraBg:        { ...StyleSheet.absoluteFillObject, backgroundColor: '#000000', opacity: 0.92 },
  hadraInner:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  hadraIcon:      { backgroundColor: 'rgba(200,146,42,0.10)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.25)', marginBottom: 0 },
  hadraCardTitle: { fontSize: 14, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },
  hadraBadge:     { backgroundColor: 'rgba(200,146,42,0.15)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.35)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  hadraBadgeTxt:  { fontSize: 8, fontWeight: '800', color: '#C8922A', letterSpacing: 0.8 },
  hadraCardDesc:  { fontSize: 11, color: 'rgba(255,255,255,0.40)', marginTop: 2, fontWeight: '400' },
  hadraGoldLine:  { height: 1, backgroundColor: '#C8922A', opacity: 0.25 },

  // Footer
  footerArabic: {
    textAlign: 'center', fontSize: 13, color: '#CBD5E1',
    paddingTop: 10, paddingBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'serif',
    opacity: 0.8,
  },
  version: { textAlign: 'center', fontSize: 11, color: '#CBD5E1', fontWeight: '500', marginTop: 2 },
});