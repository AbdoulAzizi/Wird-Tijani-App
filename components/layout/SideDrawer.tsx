// components/layout/SideDrawer.tsx — Wird Tijani
//
// Green brand: header #064E3B, active items #F0FDF4.
// Includes HadraMenuItem special treatment for /hadra-station
// (though that route does not exist in Wird Tijani, the component
//  handles it gracefully if ever passed through MENU_ITEMS).

import { X, ChevronRight } from 'lucide-react-native';
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet, ScrollView, Pressable, Platform,
} from 'react-native';
import { useRef, useEffect, useCallback } from 'react';

import { useAppVersion } from '@/hooks/useAppVersion';
import { MenuItem }      from '@/constants/menuItems';

const DRAWER_WIDTH = 300;

// ─── Special item : Al-Hadra (gold) ──────────────────────────────────────────
function HadraMenuItem({ item, isActive, onPress }: { item: MenuItem; isActive: boolean; onPress: () => void }) {
  const Icon = item.icon;
  return (
    <View style={s.hadraWrap}>
      <TouchableOpacity
        style={[s.hadraItem, isActive && { borderColor: '#C8922A', borderWidth: 1.5 }]}
        onPress={onPress} activeOpacity={0.75}
      >
        <View style={s.hadraIconWrap}>
          <Icon color="#C8922A" size={20} strokeWidth={1.8} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <Text style={s.hadraLabel}>{item.name}</Text>
            <View style={s.hadraBadge}><Text style={s.hadraBadgeTxt}>✦ PRESENCE</Text></View>
          </View>
          <Text style={s.hadraDesc}>{item.description}</Text>
        </View>
        <ChevronRight color="#C8922A" size={16} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Standard item ────────────────────────────────────────────────────────────
function MenuItem_({ item, isActive, onPress }: { item: MenuItem; isActive: boolean; onPress: () => void }) {
  const Icon  = item.icon;
  const color = item.color || '#059669';
  return (
    <>
      <TouchableOpacity style={[s.item, isActive && s.itemActive]} onPress={onPress} activeOpacity={0.7}>
        <View style={[s.icon, { backgroundColor: isActive ? color : color + '15' }]}>
          <Icon color={isActive ? '#FFFFFF' : color} size={20} strokeWidth={2.2} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <Text style={[s.label, isActive && { color }]}>{item.name}</Text>
            {item.badge && item.badge > 0 ? (
              <View style={s.badge}><Text style={s.badgeTxt}>{item.badge > 99 ? '99+' : item.badge}</Text></View>
            ) : item.isNew ? (
              <View style={s.newBadge}><Text style={s.newBadgeTxt}>NEW</Text></View>
            ) : null}
          </View>
          <Text style={s.desc}>{item.description}</Text>
        </View>
        <ChevronRight color={isActive ? color : '#CBD5E1'} size={16} strokeWidth={2.5} />
      </TouchableOpacity>
      {item.dividerAfter && <View style={s.divider} />}
    </>
  );
}

// ─── Side drawer ──────────────────────────────────────────────────────────────
interface Props {
  visible:    boolean;
  onClose:    () => void;
  menuItems:  MenuItem[];
  onNavigate: (route: string) => void;
  pathname:   string;
}

export function SideDrawer({ visible, onClose, menuItems, onNavigate, pathname }: Props) {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const { appName, fullVersion } = useAppVersion();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: visible ? 0 : -DRAWER_WIDTH, useNativeDriver: true, damping: 20, stiffness: 180 }),
      Animated.timing(fadeAnim,  { toValue: visible ? 1 : 0, duration: visible ? 280 : 220, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  const renderItem = useCallback((item: MenuItem) => {
    const isActive = pathname === item.route;
    const onPress  = () => onNavigate(item.route);
    if (item.route === '/hadra-station')
      return <HadraMenuItem key={item.route} item={item} isActive={isActive} onPress={onPress} />;
    return <MenuItem_ key={item.route} item={item} isActive={isActive} onPress={onPress} />;
  }, [pathname, onNavigate]);

  if (!visible) return null;

  return (
    <View style={s.overlay}>
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <Animated.View style={[s.backdrop, { opacity: fadeAnim }]} />
      </Pressable>

      <Animated.View style={[s.drawer, { transform: [{ translateX: slideAnim }] }]}>

        {/* ── Green header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.headerTitle}>Menu</Text>
            <Text style={s.headerSub}>Navigation</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
            <X color="#FFFFFF" size={22} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}>
          {menuItems.map(renderItem)}
        </ScrollView>

        <View style={s.footer}>
          <View style={s.footerLine} />
          <Text style={s.footerVersion}>{appName} · v{fullVersion}</Text>
          <Text style={s.footerCopy}>© 2025 Wird Tijani</Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  overlay:  { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.48)' },
  drawer: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: '85%', maxWidth: 340, backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.22, shadowRadius: 12, elevation: 18,
    borderTopRightRadius: 28, borderBottomRightRadius: 28,
  },

  // Green brand header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 22, paddingTop: Platform.OS === 'ios' ? 60 : 46,
    backgroundColor: '#064E3B', borderTopRightRadius: 28,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  headerSub:   { fontSize: 13, color: '#D1FAE5', marginTop: 2, fontWeight: '500' },
  closeBtn:    { padding: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)' },

  item:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16, marginHorizontal: 10, marginVertical: 2, borderRadius: 14 },
  // Active: green tint
  itemActive: { backgroundColor: '#F0FDF4' },
  icon:       { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  label:      { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  desc:       { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  divider:    { height: 1, backgroundColor: '#F1F5F9', marginVertical: 6, marginHorizontal: 20 },

  badge:      { backgroundColor: '#EF4444', borderRadius: 9, minWidth: 18, height: 18, paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center' },
  badgeTxt:   { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  // New badge: green
  newBadge:   { backgroundColor: '#065F46', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  newBadgeTxt:{ color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },

  hadraWrap:    { marginHorizontal: 10, marginVertical: 6, borderRadius: 14, overflow: 'hidden' },
  hadraItem:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 16, backgroundColor: '#0A0A0F', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(200,146,42,0.20)' },
  hadraIconWrap:{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(200,146,42,0.10)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.22)', justifyContent: 'center', alignItems: 'center' },
  hadraLabel:   { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  hadraBadge:   { backgroundColor: 'rgba(200,146,42,0.15)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.30)', borderRadius: 7, paddingHorizontal: 6, paddingVertical: 2 },
  hadraBadgeTxt:{ fontSize: 8, fontWeight: '800', color: '#C8922A', letterSpacing: 0.8 },
  hadraDesc:    { fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 2 },

  footer:        { padding: 18, borderTopWidth: 1, borderTopColor: '#F1F5F9', alignItems: 'center', borderBottomRightRadius: 28 },
  footerLine:    { width: 36, height: 3, backgroundColor: '#E2E8F0', borderRadius: 2, marginBottom: 10 },
  footerVersion: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  footerCopy:    { fontSize: 10, color: '#CBD5E1', marginTop: 3 },
});