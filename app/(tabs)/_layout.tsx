// app/(tabs)/_layout.tsx
// ARCHITECTURE : Le layout ne rend AUCUN header.
// Chaque écran importe et rend son propre SpiritualHeader ou MinimalHeader.
// Le layout expose seulement les callbacks (drawer, notifications) via LayoutActionsContext.

import { Tabs, useRouter, usePathname } from 'expo-router';
import {
  Heart, BookOpen, ChartBar as BarChart3, Settings as SettingsIcon,
  Star, Moon, Home, Info, X, ChevronRight, Sparkles, Bell,
  Grid3X3, Timer, CheckCircle2, BookMarked, Eye, MapPin,
  Mail
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView,
  Pressable, PanResponder, Platform, Dimensions,
} from 'react-native';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAppVersion }    from '@/hooks/useAppVersion';
import { HeaderActionsProvider } from '@/contexts/HeaderActionsContext';
import { LayoutActionsContext }  from '@/contexts/LayoutActionsContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MenuItem {
  name:          string;
  route:         string;
  icon:          any;
  description:   string;
  badge?:        number;
  isNew?:        boolean;
  dividerAfter?: boolean;
  color?:        string;
}

interface TabIconProps {
  IconComponent: any;
  color:  string;
  focused: boolean;
  name?:  string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DRAWER_WIDTH     = 300;
const SWIPE_THRESHOLD  = 150;
const SWIPE_AREA_WIDTH = 30;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_H   = SCREEN_HEIGHT * 0.76;

const MAIN_PAGES = ['/', '/wird', '/wazifa', '/hadra'];

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────
function BottomMenuSheet({
  visible, onClose, menuItems, onNavigate, pathname,
}: {
  visible: boolean; onClose: () => void;
  menuItems: MenuItem[]; onNavigate: (r: string) => void; pathname: string;
}) {
  const slideAnim = useRef(new Animated.Value(BOTTOM_SHEET_H)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const { appName, fullVersion } = useAppVersion();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0,              useNativeDriver: true, damping: 22, stiffness: 160 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: BOTTOM_SHEET_H, useNativeDriver: true, damping: 26, stiffness: 180 }),
        Animated.timing(fadeAnim,  { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const groups = [
    {
      label: 'Daily Practices', emoji: '🕌',
      items: menuItems.filter(i => ['/', '/wird', '/wazifa', '/hadra'].includes(i.route)),
    },
    {
      label: "Qur'ān & Dhikr", emoji: '📗',
      items: menuItems.filter(i => ['/suwar', '/asmaa-alhusna', '/asmaa-nabi', '/dhikr-counter'].includes(i.route)),
    },
    {
      label: 'Meditation & Presence', emoji: '✦',
      items: menuItems.filter(i => ['/hadra-station'].includes(i.route)),
    },
    {
      label: 'Discover', emoji: '✨',
      items: menuItems.filter(i => ['/library', '/hadra-map'].includes(i.route)),
    },
    {
      label: 'Tools', emoji: '⚙️',
      items: menuItems.filter(i => ['/stats', '/notifications', '/notification-settings', '/settings', '/about', '/contact'].includes(i.route)),
    },
  ].filter(g => g.items.length > 0);

  return (
    <View style={bs.overlay} pointerEvents="box-none">
      <Animated.View style={[bs.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[bs.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={bs.handleWrap}><View style={bs.handle} /></View>

        <View style={bs.header}>
          <View>
            <Text style={bs.headerTitle}>Navigation</Text>
            <Text style={bs.headerSub}>Where would you like to go?</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={bs.closeBtn} activeOpacity={0.7}>
            <X color="#64748B" size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={bs.scrollContent}
          bounces={false}
        >
          {groups.map(group => (
            <View key={group.label} style={bs.group}>
              <View style={bs.groupLabelRow}>
                <Text style={bs.groupEmoji}>{group.emoji}</Text>
                <Text style={bs.groupLabel}>{group.label}</Text>
              </View>
              <View style={bs.grid}>
                {group.items.map(item => {
                  const Icon     = item.icon;
                  const isActive = pathname === item.route;
                  const color    = item.color || '#059669';

                  // ── Special render for Al-Hadra ──
                  if (item.route === '/hadra-station') {
                    return (
                      <TouchableOpacity
                        key={item.route}
                        style={[bs.hadraCard, isActive && { borderColor: '#C8922A', borderWidth: 1.5 }]}
                        onPress={() => onNavigate(item.route)}
                        activeOpacity={0.78}
                      >
                        <View style={bs.hadraBg} />
                        <View style={bs.hadraInner}>
                          <View style={[bs.cardIcon, bs.hadraIcon]}>
                            <Icon color="#C8922A" size={22} strokeWidth={1.8} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                              <Text style={bs.hadraCardTitle}>{item.name}</Text>
                              <View style={bs.hadraBadge}>
                                <Text style={bs.hadraBadgeText}>✦ PRESENCE</Text>
                              </View>
                            </View>
                            <Text style={bs.hadraCardDesc}>{item.description}</Text>
                          </View>
                          <ChevronRight color="#C8922A" size={16} strokeWidth={2} />
                        </View>
                        <View style={bs.hadraGoldLine} />
                      </TouchableOpacity>
                    );
                  }

                  return (
                    <TouchableOpacity
                      key={item.route}
                      style={[
                        bs.card,
                        isActive && bs.cardActive,
                        isActive && { borderColor: color },
                      ]}
                      onPress={() => onNavigate(item.route)}
                      activeOpacity={0.72}
                    >
                      <View style={[bs.cardIcon, { backgroundColor: isActive ? color : color + '15' }]}>
                        <Icon color={isActive ? '#FFFFFF' : color} size={20} strokeWidth={2} />
                      </View>
                      <Text style={[bs.cardTitle, isActive && { color }]} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={bs.cardDesc} numberOfLines={1}>{item.description}</Text>
                      {!!item.badge && item.badge > 0 ? (
                        <View style={bs.badgePill}>
                          <Text style={bs.badgeTxt}>{item.badge > 9 ? '9+' : item.badge}</Text>
                        </View>
                      ) : item.isNew ? (
                        <View style={bs.newPill}>
                          <Text style={bs.newTxt}>NEW</Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
          <Text style={bs.version}>{appName} · v{fullVersion}</Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const bs = StyleSheet.create({
  overlay:       { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, justifyContent: 'flex-end' },
  backdrop:      { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.40)' },
  sheet:         { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: BOTTOM_SHEET_H, shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.14, shadowRadius: 18, elevation: 30 },
  handleWrap:    { alignItems: 'center', paddingTop: 12, paddingBottom: 2 },
  handle:        { width: 36, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0' },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle:   { fontSize: 19, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  headerSub:     { fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: '500' },
  closeBtn:      { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 30 },
  group:         { marginBottom: 22 },
  groupLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, marginLeft: 2 },
  groupEmoji:    { fontSize: 13 },
  groupLabel:    { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.2 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card:          { width: '47.5%', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: 'transparent', position: 'relative' },
  cardActive:    { backgroundColor: '#F0FDF4' },
  cardIcon:      { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginBottom: 9 },
  cardTitle:     { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  cardDesc:      { fontSize: 10.5, color: '#94A3B8', fontWeight: '500' },
  badgePill:     { position: 'absolute', top: 9, right: 9, backgroundColor: '#EF4444', borderRadius: 7, minWidth: 16, height: 16, paddingHorizontal: 3, justifyContent: 'center', alignItems: 'center' },
  badgeTxt:      { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  newPill:       { position: 'absolute', top: 9, right: 9, backgroundColor: '#059669', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 },
  newTxt:        { color: '#FFFFFF', fontSize: 8, fontWeight: '800', letterSpacing: 0.6 },
  version:       { textAlign: 'center', fontSize: 11, color: '#CBD5E1', fontWeight: '500', marginTop: 6 },

  hadraCard:     { width: '100%', backgroundColor: '#0A0A0F', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(200,146,42,0.22)', position: 'relative' },
  hadraBg:       { ...StyleSheet.absoluteFillObject, backgroundColor: '#000000', opacity: 0.92 },
  hadraInner:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  hadraIcon:     { backgroundColor: 'rgba(200,146,42,0.10)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.25)', marginBottom: 0 },
  hadraCardTitle:{ fontSize: 14, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },
  hadraBadge:    { backgroundColor: 'rgba(200,146,42,0.15)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.35)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  hadraBadgeText:{ fontSize: 8, fontWeight: '800', color: '#C8922A', letterSpacing: 0.8 },
  hadraCardDesc: { fontSize: 11, color: 'rgba(255,255,255,0.40)', marginTop: 2, fontWeight: '400' },
  hadraGoldLine: { height: 1, backgroundColor: '#C8922A', opacity: 0.25 },
});

// ─── InnerTabLayout ───────────────────────────────────────────────────────────
function InnerTabLayout() {
  const [drawerVisible,      setDrawerVisible]      = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const router   = useRouter();
  const pathname = usePathname();

  // ✅ unreadCount comes directly from NotificationContext — always in sync
  const { unreadCount } = useNotifications();

  const isMainPage = MAIN_PAGES.includes(pathname);

  const menuItems: MenuItem[] = useMemo(() => [
    { name: 'Home',              route: '/',               icon: Home,        description: 'Main dashboard',                  color: '#059669' },
    { name: 'Wird',              route: '/wird',           icon: Heart,       description: 'Daily litany',                    color: '#DC2626' },
    { name: 'Wazifa',            route: '/wazifa',         icon: Star,        description: 'The daily collective invocation', color: '#D97706' },
    { name: 'Haḍratu-Jumūʿa',   route: '/hadra',          icon: Moon,        description: 'Friday sacred gathering',         color: '#7C3AED' },
    { name: "Sūras of Qur'ān",  route: '/suwar',          icon: BookMarked,  description: '114 Surahs · Reflect & meditate', color: '#1E3A8A', isNew: true },
    { name: "Asmā' Allāh",      route: '/asmaa-alhusna',  icon: Sparkles,    description: 'The 99 Names of Allah',           color: '#1E40AF', isNew: true },
    { name: "Asmā' An-Nabī",    route: '/asmaa-nabi',     icon: Star,        description: '201 Names of the Prophet ﷺ',     color: '#B45309', isNew: true },
    { name: 'Dhikr Counter',    route: '/dhikr-counter',  icon: Timer,       description: 'Your dhikr counter',              color: '#0891B2', isNew: true },
    { name: 'Library',          route: '/library',        icon: BookOpen,    description: 'Resources & sacred texts',        color: '#059669', dividerAfter: true },
    { name: 'Hadara Map',       route: '/hadra-map',      icon: MapPin,      description: 'Find local Zawiya & gatherings',  color: '#059669' },
    { name: 'Adhkar',           route: '/azkars',         icon: BookOpen,    description: 'Morning & evening adhkar',        color: '#059669' },
    { name: 'Al-Hadra',         route: '/hadra-station',  icon: Eye,         description: 'The Station of Presence · 99 Names', color: '#C8922A', isNew: true },
    { name: 'Statistics',       route: '/stats',          icon: BarChart3,   description: 'Consistency & discipline',        color: '#0891B2' },
    { name: "Today's Practices",route: '/daily-achievements', icon: CheckCircle2, description: "Today's completed awrād",    color: '#059669' },
    { name: 'Settings',         route: '/settings',       icon: SettingsIcon,description: 'Configuration',                  color: '#475569' },
    { name: 'About',            route: '/about',          icon: Info,        description: 'App information',                color: '#7C3AED' },
    { name: 'Contact Us',       route: '/contact',        icon: Mail,        description: 'Get in touch',                   color: '#0891B2' },
  ], []); // no dependency on unreadCount — badge shown via separate Bell icon

  // ── Haptics ─────────────────────────────────────────────────────────────────
  const haptic = useCallback((t: 'light' | 'medium' | 'success' = 'light') => {
    if (Platform.OS !== 'ios') return;
    if (t === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else Haptics.impactAsync(t === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // ── Drawer ───────────────────────────────────────────────────────────────────
  const openDrawer  = useCallback(() => { haptic('light'); setDrawerVisible(true);  }, [haptic]);
  const closeDrawer = useCallback(() => { haptic('light'); setDrawerVisible(false); }, [haptic]);

  const openBS  = useCallback(() => { haptic('medium'); setBottomSheetVisible(true);  }, [haptic]);
  const closeBS = useCallback(() => { haptic('light');  setBottomSheetVisible(false); }, [haptic]);

  const handleBack = useCallback(() => {
    haptic('light');
    router.canGoBack() ? router.back() : router.push('/');
  }, [router, haptic]);

  // ✅ FIX: Do NOT call markAllAsRead() here.
  // The badge should clear only when the user actually reads the notifications
  // (i.e. when they tap each notification or press "Mark all as read" on the screen).
  const handleNotifications = useCallback(() => {
    haptic('medium');
    router.push('/notifications' as any);
  }, [router, haptic]);

  const handleBSNavigate = useCallback((route: string) => {
    haptic('success');
    setBottomSheetVisible(false);
    setTimeout(() => router.push(route as any), 260);
  }, [router, haptic]);

  const handleNavigation = useCallback((route: string) => {
    haptic('success');
    closeDrawer();
    requestAnimationFrame(() => setTimeout(() => router.push(route as any), 240));
  }, [router, closeDrawer, haptic]);

  // ── Drawer animation ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (drawerVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0,             useNativeDriver: true, damping: 20, stiffness: 180 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 0.96,          useNativeDriver: true, damping: 15 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: -DRAWER_WIDTH, useNativeDriver: true, damping: 22, stiffness: 200 }),
        Animated.timing(fadeAnim,  { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1,             useNativeDriver: true, damping: 15 }),
      ]).start();
    }
  }, [drawerVisible]);

  // ── Swipe gesture ────────────────────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => gs.dx > 10 && Math.abs(gs.dy) < 80,
      onPanResponderGrant: () => {
        if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: (_, gs) => {
        if (gs.dx > 0 && gs.dx < DRAWER_WIDTH) {
          slideAnim.setValue(-DRAWER_WIDTH + gs.dx);
          fadeAnim.setValue(gs.dx / DRAWER_WIDTH);
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE_THRESHOLD || gs.vx > 0.5) openDrawer();
        else {
          Animated.parallel([
            Animated.spring(slideAnim, { toValue: -DRAWER_WIDTH, useNativeDriver: true, damping: 20, stiffness: 200 }),
            Animated.timing(fadeAnim,  { toValue: 0, duration: 200, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  const isActive = useCallback((r: string) => pathname === r, [pathname]);

  // ── Side Menu Item ───────────────────────────────────────────────────────────
  const SideMenuItem = useCallback(({ item }: { item: MenuItem }) => {
    const Icon   = item.icon;
    const active = isActive(item.route);
    const color  = item.color || '#059669';

    if (item.route === '/hadra-station') {
      return (
        <>
          <View style={s.sideHadraWrap}>
            <TouchableOpacity
              style={[s.sideHadraItem, active && { borderColor: '#C8922A', borderWidth: 1.5 }]}
              onPress={() => handleNavigation(item.route)}
              activeOpacity={0.75}
            >
              <View style={s.sideHadraIconWrap}>
                <Icon color="#C8922A" size={20} strokeWidth={1.8} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  <Text style={s.sideHadraLabel}>{item.name}</Text>
                  <View style={s.sideHadraBadge}>
                    <Text style={s.sideHadraBadgeText}>✦ PRESENCE</Text>
                  </View>
                </View>
                <Text style={s.sideHadraDesc}>{item.description}</Text>
              </View>
              <ChevronRight color="#C8922A" size={16} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          {item.dividerAfter && <View style={s.divider} />}
        </>
      );
    }

    return (
      <>
        <TouchableOpacity
          style={[s.menuItem, active && s.menuItemActive]}
          onPress={() => handleNavigation(item.route)}
          activeOpacity={0.7}
        >
          <View style={[s.menuIcon, { backgroundColor: active ? color : color + '15' }]}>
            <Icon color={active ? '#FFFFFF' : color} size={20} strokeWidth={2.2} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <Text style={[s.menuLabel, active && { color }]}>{item.name}</Text>
              {!!item.badge && item.badge > 0 ? (
                <View style={s.menuBadge}>
                  <Text style={s.menuBadgeText}>{item.badge > 99 ? '99+' : item.badge}</Text>
                </View>
              ) : item.isNew ? (
                <View style={s.menuNewBadge}>
                  <Text style={s.menuNewBadgeText}>NEW</Text>
                </View>
              ) : null}
            </View>
            <Text style={s.menuDesc}>{item.description}</Text>
          </View>
          <ChevronRight color={active ? color : '#CBD5E1'} size={16} strokeWidth={2.5} />
        </TouchableOpacity>
        {item.dividerAfter && <View style={s.divider} />}
      </>
    );
  }, [handleNavigation, isActive]);

  // ── Tab Icon ─────────────────────────────────────────────────────────────────
  const TabIcon = useCallback(({ IconComponent, color, focused, name }: TabIconProps) => (
    <View style={s.tabIconWrap}>
      {name === 'home'
        ? <Ionicons name="home" color={color} size={23} />
        : <IconComponent color={color} size={23} strokeWidth={focused ? 2.5 : 2} />
      }
      {focused && <View style={[s.dot, { backgroundColor: color }]} />}
    </View>
  ), []);

  // ── Burger ───────────────────────────────────────────────────────────────────
  const BurgerBtn = useCallback(() => (
    <TouchableOpacity style={s.burgerBtn} onPress={openBS} activeOpacity={0.75}>
      <View style={[s.burgerCircle, bottomSheetVisible && s.burgerCircleActive]}>
        {bottomSheetVisible
          ? <X color="#FFFFFF" size={20} strokeWidth={2.5} />
          : <Grid3X3 color="#059669" size={20} strokeWidth={2} />
        }
        {unreadCount > 0 && (
          <View style={s.burgerBadge}>
            <Text style={s.burgerBadgeTxt}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
          </View>
        )}
      </View>
      <Text style={[s.burgerLabel, bottomSheetVisible && { color: '#059669' }]}>Menu</Text>
    </TouchableOpacity>
  ), [openBS, bottomSheetVisible, unreadCount]);

  // ── Context value ────────────────────────────────────────────────────────────
  const layoutActions = useMemo(() => ({
    openDrawer,
    handleBack,
    handleNotifications,
    unreadCount,
  }), [openDrawer, handleBack, handleNotifications, unreadCount]);

  return (
    <LayoutActionsContext.Provider value={layoutActions}>
      <SafeAreaView style={s.root} edges={['bottom']}>

        {!drawerVisible && isMainPage && (
          <View style={s.swipeZone} {...panResponder.panHandlers} />
        )}

        {/* ── Side Drawer ── */}
        {drawerVisible && (
          <View style={s.drawerOverlay}>
            <Pressable style={{ flex: 1 }} onPress={closeDrawer}>
              <Animated.View style={[s.drawerBackdrop, { opacity: fadeAnim }]} />
            </Pressable>
            <Animated.View style={[s.drawer, { transform: [{ translateX: slideAnim }] }]}>
              <View style={s.drawerHeader}>
                <View>
                  <Text style={s.drawerTitle}>Menu</Text>
                  <Text style={s.drawerSub}>Navigation</Text>
                </View>
                <TouchableOpacity onPress={closeDrawer} style={s.drawerClose} activeOpacity={0.7}>
                  <X color="#FFFFFF" size={22} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
              >
                {menuItems.map(item => <SideMenuItem key={item.route} item={item} />)}
              </ScrollView>
              <View style={s.drawerFooter}>
                <View style={s.footerLine} />
                <Text style={s.footerText}>Version 1.0.0</Text>
                <Text style={s.footerSub}>© 2025 Spiritual App</Text>
              </View>
            </Animated.View>
          </View>
        )}

        {/* ── Bottom Sheet ── */}
        <BottomMenuSheet
          visible={bottomSheetVisible}
          onClose={closeBS}
          menuItems={menuItems}
          onNavigate={handleBSNavigate}
          pathname={pathname}
        />

        {/* ── Tabs ── */}
        <Tabs
          screenOptions={{
            headerShown:             false,
            tabBarActiveTintColor:   '#059669',
            tabBarInactiveTintColor: '#94A3B8',
            tabBarStyle:             s.tabBar,
            tabBarLabelStyle:        s.tabLabel,
            tabBarItemStyle:         s.tabItem,
            tabBarHideOnKeyboard:    true,
          }}
          screenListeners={{ tabPress: () => haptic('light') }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) =>
                <TabIcon IconComponent={Home} color={color} focused={focused} name="home" />,
            }}
          />
          <Tabs.Screen
            name="wird"
            options={{
              title: 'Wird',
              tabBarIcon: ({ color, focused }) =>
                <TabIcon IconComponent={Heart} color={color} focused={focused} />,
            }}
          />
          <Tabs.Screen
            name="wazifa"
            options={{
              title: 'Wazifa',
              tabBarIcon: ({ color, focused }) =>
                <TabIcon IconComponent={Star} color={color} focused={focused} />,
            }}
          />
          <Tabs.Screen
            name="hadra"
            options={{
              title: 'Menu',
              tabBarButton: () => <BurgerBtn />,
            }}
          />

          {[
            'suwar',
            'hadra-station',
            'asmaa-alhusna', 'dhikr-counter', 'stats', 'settings', 'about',
            'library', 'notifications', 'notification-settings', 'azkars',
            'notification-test', 'daily-achievements', 'asmaa-nabi', 'contact',
          ].map(name => (
            <Tabs.Screen key={name} name={name} options={{ href: null }} />
          ))}
        </Tabs>

      </SafeAreaView>
    </LayoutActionsContext.Provider>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function TabLayout() {
  return (
    <HeaderActionsProvider>
      <InnerTabLayout />
    </HeaderActionsProvider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:      { flex: 1, backgroundColor: '#F8FAFC' },
  swipeZone: { position: 'absolute', left: 0, top: 0, bottom: 0, width: SWIPE_AREA_WIDTH, zIndex: 999 },

  tabIconWrap: { justifyContent: 'center', alignItems: 'center', paddingTop: 2 },
  dot:         { position: 'absolute', bottom: -7, width: 4, height: 4, borderRadius: 2 },

  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    paddingBottom: Platform.OS === 'ios' ? 8 : 8,
    paddingTop: 8,
    height: Platform.OS === 'ios' ? 84 : 68,
    elevation: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  tabLabel: { fontSize: 11, fontWeight: '700', marginTop: 3, letterSpacing: 0.2 },
  tabItem:  { paddingVertical: 4 },

  burgerBtn:          { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 4 },
  burgerCircle:       { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#D1FAE5', position: 'relative' },
  burgerCircleActive: { backgroundColor: '#059669', borderColor: '#047857' },
  burgerBadge:        { position: 'absolute', top: -2, right: -2, backgroundColor: '#EF4444', borderRadius: 7, minWidth: 15, height: 15, paddingHorizontal: 2, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#FFFFFF' },
  burgerBadgeTxt:     { color: '#FFFFFF', fontSize: 8, fontWeight: '800' },
  burgerLabel:        { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginTop: 3, letterSpacing: 0.2 },

  drawerOverlay:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 },
  drawerBackdrop:   { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.48)' },
  drawer:           { position: 'absolute', left: 0, top: 0, bottom: 0, width: '85%', maxWidth: 340, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.22, shadowRadius: 12, elevation: 18, borderTopRightRadius: 28, borderBottomRightRadius: 28 },
  drawerHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 22, paddingTop: Platform.OS === 'ios' ? 60 : 46, backgroundColor: '#059669', borderTopRightRadius: 28 },
  drawerTitle:      { fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  drawerSub:        { fontSize: 13, color: '#D1FAE5', marginTop: 2, fontWeight: '500' },
  drawerClose:      { padding: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)' },
  drawerFooter:     { padding: 18, borderTopWidth: 1, borderTopColor: '#F1F5F9', alignItems: 'center', borderBottomRightRadius: 28 },
  footerLine:       { width: 36, height: 3, backgroundColor: '#E2E8F0', borderRadius: 2, marginBottom: 10 },
  footerText:       { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  footerSub:        { fontSize: 10, color: '#CBD5E1', marginTop: 3 },

  menuItem:         { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16, marginHorizontal: 10, marginVertical: 2, borderRadius: 14 },
  menuItemActive:   { backgroundColor: '#F0FDF4' },
  menuIcon:         { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuLabel:        { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  menuDesc:         { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  menuBadge:        { backgroundColor: '#EF4444', borderRadius: 9, minWidth: 18, height: 18, paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center' },
  menuBadgeText:    { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  menuNewBadge:     { backgroundColor: '#059669', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  menuNewBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },
  divider:          { height: 1, backgroundColor: '#F1F5F9', marginVertical: 6, marginHorizontal: 20 },

  sideHadraWrap:      { marginHorizontal: 10, marginVertical: 6, borderRadius: 14, overflow: 'hidden' },
  sideHadraItem:      { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 16, backgroundColor: '#0A0A0F', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(200,146,42,0.20)' },
  sideHadraIconWrap:  { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(200,146,42,0.10)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.22)', justifyContent: 'center', alignItems: 'center' },
  sideHadraLabel:     { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  sideHadraBadge:     { backgroundColor: 'rgba(200,146,42,0.15)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.30)', borderRadius: 7, paddingHorizontal: 6, paddingVertical: 2 },
  sideHadraBadgeText: { fontSize: 8, fontWeight: '800', color: '#C8922A', letterSpacing: 0.8 },
  sideHadraDesc:      { fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 2 },
});