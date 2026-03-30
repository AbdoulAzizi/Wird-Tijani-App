// components/layout/BottomMenuSheet.tsx — Wird Tijani
//
// Groups: Daily Awrād · Library & Resources · Tools
// Removed: Qur'ān & Dhikr / Al-Hadra / Meditation (those belong to Rawdat Dhikr)

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
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.72;  // slightly shorter — fewer groups

// Wird Tijani navigation groups
// Routes that are present in this app only
const GROUPS: { label: string; emoji: string; routes: string[] }[] = [
  {
    label: 'Daily Awrād',
    emoji: '🕌',
    routes: ['/', '/wird', '/wazifa', '/hadra'],
  },
  {
    label: 'Library & Resources',
    emoji: '📚',
    routes: ['/library', '/hadra-map'],
  },
  {
    label: 'Tools',
    emoji: '⚙️',
    routes: ['/stats', '/notifications', '/notification-settings', '/settings', '/about', '/contact'],
  },
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

        <View style={s.handleWrap}>
          <View style={s.handle} />
        </View>

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
  overlay:  { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, justifyContent: 'flex-end', marginBottom: 86 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: '#FFFFFF', height: SHEET_HEIGHT,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.14, shadowRadius: 18, elevation: 30,
    // Subtle green top border matching brand
    borderTopWidth: 1.5, borderLeftWidth: 0, borderRightWidth: 0,
    borderColor: 'rgba(6,78,59,0.20)',
  },

  handleWrap: { alignItems: 'center', paddingTop: 12, paddingBottom: 2 },
  handle:     { width: 36, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 22, paddingVertical: 14,
  },
  headerTitle: { fontSize: 19, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  headerSub:   { fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: '500' },
  closeBtn:    { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  divider:      { flexDirection: 'row', alignItems: 'center', marginHorizontal: 22, marginBottom: 6 },
  dividerLine:  { flex: 1, height: 1, backgroundColor: '#F1F5F9' },
  dividerGlyph: { fontSize: 10, color: '#CBD5E1', marginHorizontal: 10 },

  scrollContent: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 30 },
  group:         { marginBottom: 22 },
  groupLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, marginLeft: 2 },
  groupEmoji:    { fontSize: 13 },
  groupLabel:    { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.2 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  cardAnimWrap: { width: '47.5%' },

  card: {
    width: '100%', backgroundColor: '#F8FAFC', borderRadius: 16,
    padding: 14, borderWidth: 1.5, borderColor: 'transparent', position: 'relative',
  },
  // Active card: green tint
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

  footerArabic: {
    textAlign: 'center', fontSize: 13, color: '#CBD5E1',
    paddingTop: 10, paddingBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'serif',
    opacity: 0.8,
  },
  version: { textAlign: 'center', fontSize: 11, color: '#CBD5E1', fontWeight: '500', marginTop: 2 },
});