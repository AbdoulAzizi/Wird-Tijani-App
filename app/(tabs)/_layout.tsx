// app/(tabs)/_layout.tsx
// Design adapté depuis le bottom tab bar avec notch SVG animé
// Architecture : layout sans header, notch fluide animé, bottom sheet menu

import { Tabs, useRouter, usePathname } from 'expo-router';
import {
  Heart, BookOpen, ChartBar as BarChart3, Settings as SettingsIcon,
  Star, Moon, Home, Info, X, ChevronRight, Sparkles, Bell,
  Grid3X3, Timer, CheckCircle2, BookMarked, Eye, MapPin, Mail,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView,
  Pressable, PanResponder, Platform, Dimensions,
} from 'react-native';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Ellipse } from 'react-native-svg';
import { useNotifications }       from '@/contexts/NotificationContext';
import { useAppVersion }          from '@/hooks/useAppVersion';
import { HeaderActionsProvider }  from '@/contexts/HeaderActionsContext';
import { LayoutActionsContext }   from '@/contexts/LayoutActionsContext';

// ─── Types ─────────────────────────────────────────────────────────────────
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

// ─── Constants ──────────────────────────────────────────────────────────────
const DRAWER_WIDTH      = 300;
const SWIPE_THRESHOLD   = 150;
const SWIPE_AREA_WIDTH  = 30;
const { width: SW, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_H    = SCREEN_HEIGHT * 0.76;
const MAIN_PAGES        = ['/', '/wird', '/wazifa', '/hadra'];
const TAB_COUNT         = 5; // Home, Wird, Menu(burger), Wazifa, Haḍra

// ─── Tab definitions (order matters for notch index) ────────────────────────
const TABS = [
  { key: 'index',  label: 'Home',   index: 0 },
  { key: 'wird',   label: 'Wird',   index: 1 },
  { key: 'menu',   label: 'Menu',   index: 2, isBurger: true },
  { key: 'wazifa', label: 'Wazifa', index: 3 },
  { key: 'hadra',  label: 'Haḍra',  index: 4 },
];

const TAB_BAR_H = Platform.OS === 'ios' ? 86 : 70;

// ─── Notch SVG — pixel-accurate, no clamp ────────────────────────────────────
// cx: absolute pixel X center of the notch (exact tab center)
function NotchBarSVG({ cx }: { cx: number }) {
  const W    = SW;
  const H    = TAB_BAR_H;
  const NR   = 26;   // notch radius
  const ND   = 20;   // notch depth
  const CR   = 20;   // corner radius
  const WING = 12;   // smooth transition wing

  const mainPath = [
    `M 0 ${CR}`,
    `Q 0 0 ${CR} 0`,
    `L ${cx - NR - WING} 0`,
    `C ${cx - NR - 4} 0 ${cx - NR} ${ND * 0.3} ${cx - NR} ${ND * 0.7}`,
    `A ${NR} ${NR} 0 0 0 ${cx + NR} ${ND * 0.7}`,
    `C ${cx + NR} ${ND * 0.3} ${cx + NR + 4} 0 ${cx + NR + WING} 0`,
    `L ${W - CR} 0`,
    `Q ${W} 0 ${W} ${CR}`,
    `L ${W} ${H}`,
    `L 0 ${H}`,
    `Z`,
  ].join(' ');

  const borderPath = [
    `M 0 0.5`,
    `L ${cx - NR - WING} 0.5`,
    `C ${cx - NR - 4} 0.5 ${cx - NR} ${ND * 0.3} ${cx - NR} ${ND * 0.7}`,
    `A ${NR} ${NR} 0 0 0 ${cx + NR} ${ND * 0.7}`,
    `C ${cx + NR} ${ND * 0.3} ${cx + NR + 4} 0.5 ${cx + NR + WING} 0.5`,
    `L ${W} 0.5`,
  ].join(' ');

  const arcPath = [
    `M ${cx - NR} ${ND * 0.7}`,
    `A ${NR} ${NR} 0 0 0 ${cx + NR} ${ND * 0.7}`,
  ].join(' ');

  return (
    <Svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <SvgLinearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#064E3B" />
          <Stop offset="100%" stopColor="#043D2E" />
        </SvgLinearGradient>
      </Defs>
      <Path d={mainPath} fill="url(#barGrad)" />
      <Path d={borderPath} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <Path d={arcPath}    fill="none" stroke="rgba(245,158,11,0.70)" strokeWidth="1.5" />
      <Ellipse cx={cx} cy={ND * 0.4} rx={NR * 1.1} ry={8} fill="rgba(245,158,11,0.07)" />
    </Svg>
  );
}

// ─── Tab center positions (pixels) ───────────────────────────────────────────
// Each of the 5 tabs gets SW/5 width. Center of tab i = (i + 0.5) * (SW/5)
const TAB_PX = (logIdx: number) => (logIdx + 0.5) * (SW / TAB_COUNT);

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────
function AnimatedTabBar({
  state, navigation,
  onBurgerPress, burgerActive, unreadCount,
}: any) {
  const focusedRouteName = state.routes[state.index]?.name ?? 'index';

  const logicalIndex = (() => {
    if (focusedRouteName === 'index')  return 0;
    if (focusedRouteName === 'wird')   return 1;
    if (focusedRouteName === 'wazifa') return 3;
    if (focusedRouteName === 'hadra')  return 4;
    return 0;
  })();

  // Animate notch in absolute pixels — perfectly aligned with flex tabs
  const targetPx  = TAB_PX(logicalIndex);
  const notchAnim = useRef(new Animated.Value(targetPx)).current;
  const notchVal  = useRef<number>(targetPx);
  const animFrame = useRef<number>(0);

  useEffect(() => {
    const target = targetPx;
    const animate = () => {
      notchVal.current += (target - notchVal.current) * 0.14;
      notchAnim.setValue(notchVal.current);
      if (Math.abs(target - notchVal.current) > 0.3) {
        animFrame.current = requestAnimationFrame(animate);
      }
    };
    cancelAnimationFrame(animFrame.current);
    animFrame.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animFrame.current); animFrame.current = 0; };
  }, [targetPx]);

  const [notchPx, setNotchPx] = useState(targetPx);
  useEffect(() => {
    const id = notchAnim.addListener(({ value }) => setNotchPx(value));
    return () => notchAnim.removeListener(id);
  }, []);

  const handleTabPress = (routeName: string) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes.find((r: any) => r.name === routeName)?.key,
      canPreventDefault: true,
    });
    if (!event.defaultPrevented) navigation.navigate(routeName);
  };

  const TABS_DISPLAY = [
    { routeName: 'index',  label: 'Home',   logIdx: 0, isBurger: false },
    { routeName: 'wird',   label: 'Wird',   logIdx: 1, isBurger: false },
    { routeName: '__menu', label: 'Menu',   logIdx: 2, isBurger: true  },
    { routeName: 'wazifa', label: 'Wazifa', logIdx: 3, isBurger: false },
    { routeName: 'hadra',  label: 'Haḍra',  logIdx: 4, isBurger: false },
  ];

  return (
    <View style={{ width: SW, height: TAB_BAR_H }}>
      {/* SVG receives exact pixel center — perfectly aligned with flex tab */}
      <NotchBarSVG cx={notchPx} />

      <View style={tb.tabRow}>
        {TABS_DISPLAY.map((tab) => {
          const isActive = tab.logIdx === logicalIndex && !tab.isBurger;

          if (tab.isBurger) {
            return (
              <TouchableOpacity
                key="menu"
                style={tb.tabBtn}
                onPress={onBurgerPress}
                activeOpacity={0.75}
              >
                <View style={[tb.burgerCircle, burgerActive && tb.burgerCircleActive]}>
                  {burgerActive
                    ? <X color="#FFFFFF" size={19} strokeWidth={2.5} />
                    : <Grid3X3 color="#F59E0B" size={18} strokeWidth={2} />
                  }
                  {unreadCount > 0 && (
                    <View style={tb.badge}>
                      <Text style={tb.badgeTxt}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                    </View>
                  )}
                </View>
                <Text style={[tb.label, { color: burgerActive ? '#FCD34D' : '#A7C4B5' }]}>Menu</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.routeName}
              style={[tb.tabBtn, isActive && tb.tabBtnActive]}
              onPress={() => handleTabPress(tab.routeName)}
              activeOpacity={0.8}
            >
              {/* Circular icon — adapts to notch shape */}
              <View style={[tb.iconCircle, isActive && tb.iconCircleActive]}>
                <TabIcon routeName={tab.routeName} isActive={isActive} />
              </View>
              <Text style={[tb.label, isActive && tb.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function TabIcon({ routeName, isActive }: { routeName: string; isActive: boolean }) {
  const color = isActive ? '#FFFFFF' : '#A7C4B5';
  const size  = 20;
  const sw    = isActive ? 2.2 : 1.8;

  if (routeName === 'index')  return <Ionicons name="home"  color={color} size={size} />;
  if (routeName === 'wird')   return <Heart    color={color} size={size} strokeWidth={sw} />;
  if (routeName === 'wazifa') return <Star     color={color} size={size} strokeWidth={sw} />;
  if (routeName === 'hadra')  return <Moon     color={color} size={size} strokeWidth={sw} />;
  return null;
}

const ICON_SIZE = 40;

const tb = StyleSheet.create({
  tabRow:             { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'flex-end', paddingBottom: Platform.OS === 'ios' ? 10 : 8 },
  tabBtn:             { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 3 },
  tabBtnActive:       { transform: [{ translateY: -8 }] },
  // Inactive: faint ring so the icon area reads as a visible target
  iconCircle:         { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(167,196,181,0.20)', marginBottom: 2 },
  // Active: solid green circle, sized to sit inside the notch
  iconCircleActive:   { backgroundColor: '#065F46', borderColor: 'rgba(252,211,77,0.18)', shadowColor: '#064E3B', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.45, shadowRadius: 8, elevation: 8, borderWidth: 2 },
  label:              { fontSize: 10, fontWeight: '600', color: '#A7C4B5', letterSpacing: 0.2 },
  labelActive:        { color: '#FCD34D', fontWeight: '700', letterSpacing: 0.3 },
  // Burger: its own circle style
  burgerCircle:       { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(252,211,77,0.08)', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(252,211,77,0.28)', position: 'relative', marginBottom: 4 },
  burgerCircleActive: { backgroundColor: '#065F46', borderColor: 'rgba(252,211,77,0.40)', shadowColor: '#064E3B', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 10, elevation: 10 },
  badge:              { position: 'absolute', top: -2, right: -2, backgroundColor: '#EF4444', borderRadius: 7, minWidth: 15, height: 15, paddingHorizontal: 2, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#043D2E' },
  badgeTxt:           { color: '#FFFFFF', fontSize: 8, fontWeight: '800' },
});


// ─── Bottom Sheet ────────────────────────────────────────────────────────────
function BottomMenuSheet({ visible, onClose, menuItems, onNavigate, pathname }: {
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
    { label: 'Daily Practices',         emoji: '🕌', items: menuItems.filter(i => ['/', '/wird', '/wazifa', '/hadra'].includes(i.route)) },
    { label: "Qur'ān & Dhikr",          emoji: '📗', items: menuItems.filter(i => ['/suwar', '/asmaa-alhusna', '/asmaa-nabi', '/dhikr-counter'].includes(i.route)) },
    { label: 'Meditation & Presence',   emoji: '✦',  items: menuItems.filter(i => ['/hadra-station'].includes(i.route)) },
    { label: 'Discover',                emoji: '✨', items: menuItems.filter(i => ['/library', '/hadra-map'].includes(i.route)) },
    { label: 'Tools',                   emoji: '⚙️', items: menuItems.filter(i => ['/stats', '/notifications', '/notification-settings', '/settings', '/about', '/contact'].includes(i.route)) },
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

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={bs.scrollContent} bounces={false}>
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

                  if (item.route === '/hadra-station') {
                    return (
                      <TouchableOpacity key={item.route} style={[bs.hadraCard, isActive && { borderColor: '#C8922A', borderWidth: 1.5 }]} onPress={() => onNavigate(item.route)} activeOpacity={0.78}>
                        <View style={bs.hadraBg} />
                        <View style={bs.hadraInner}>
                          <View style={[bs.cardIcon, bs.hadraIcon]}>
                            <Icon color="#C8922A" size={22} strokeWidth={1.8} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                              <Text style={bs.hadraCardTitle}>{item.name}</Text>
                              <View style={bs.hadraBadge}><Text style={bs.hadraBadgeText}>✦ PRESENCE</Text></View>
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
                    <TouchableOpacity key={item.route} style={[bs.card, isActive && bs.cardActive, isActive && { borderColor: color }]} onPress={() => onNavigate(item.route)} activeOpacity={0.72}>
                      <View style={[bs.cardIcon, { backgroundColor: isActive ? color : color + '15' }]}>
                        <Icon color={isActive ? '#FFFFFF' : color} size={20} strokeWidth={2} />
                      </View>
                      <Text style={[bs.cardTitle, isActive && { color }]} numberOfLines={1}>{item.name}</Text>
                      <Text style={bs.cardDesc} numberOfLines={1}>{item.description}</Text>
                      {!!item.badge && item.badge > 0 ? (
                        <View style={bs.badgePill}><Text style={bs.badgeTxt}>{item.badge > 9 ? '9+' : item.badge}</Text></View>
                      ) : item.isNew ? (
                        <View style={bs.newPill}><Text style={bs.newTxt}>NEW</Text></View>
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
  overlay:        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, justifyContent: 'flex-end' },
  backdrop:       { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet:          { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: BOTTOM_SHEET_H, shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.14, shadowRadius: 18, elevation: 30 },
  handleWrap:     { alignItems: 'center', paddingTop: 12, paddingBottom: 2 },
  handle:         { width: 36, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0' },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle:    { fontSize: 19, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  headerSub:      { fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: '500' },
  closeBtn:       { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  scrollContent:  { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 30 },
  group:          { marginBottom: 22 },
  groupLabelRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, marginLeft: 2 },
  groupEmoji:     { fontSize: 13 },
  groupLabel:     { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.2 },
  grid:           { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card:           { width: '47.5%', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: 'transparent', position: 'relative' },
  cardActive:     { backgroundColor: '#F0FDF4' },
  cardIcon:       { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginBottom: 9 },
  cardTitle:      { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  cardDesc:       { fontSize: 10.5, color: '#94A3B8', fontWeight: '500' },
  badgePill:      { position: 'absolute', top: 9, right: 9, backgroundColor: '#EF4444', borderRadius: 7, minWidth: 16, height: 16, paddingHorizontal: 3, justifyContent: 'center', alignItems: 'center' },
  badgeTxt:       { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  newPill:        { position: 'absolute', top: 9, right: 9, backgroundColor: '#065F46', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 },
  newTxt:         { color: '#FFFFFF', fontSize: 8, fontWeight: '800', letterSpacing: 0.6 },
  version:        { textAlign: 'center', fontSize: 11, color: '#CBD5E1', fontWeight: '500', marginTop: 6 },
  hadraCard:      { width: '100%', backgroundColor: '#0A0A0F', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(200,146,42,0.22)', position: 'relative' },
  hadraBg:        { ...StyleSheet.absoluteFillObject, backgroundColor: '#000000', opacity: 0.92 },
  hadraInner:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  hadraIcon:      { backgroundColor: 'rgba(200,146,42,0.10)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.25)', marginBottom: 0 },
  hadraCardTitle: { fontSize: 14, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },
  hadraBadge:     { backgroundColor: 'rgba(200,146,42,0.15)', borderWidth: 1, borderColor: 'rgba(200,146,42,0.35)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  hadraBadgeText: { fontSize: 8, fontWeight: '800', color: '#C8922A', letterSpacing: 0.8 },
  hadraCardDesc:  { fontSize: 11, color: 'rgba(255,255,255,0.40)', marginTop: 2, fontWeight: '400' },
  hadraGoldLine:  { height: 1, backgroundColor: '#C8922A', opacity: 0.25 },
});

// ─── InnerTabLayout ──────────────────────────────────────────────────────────
function InnerTabLayout() {
  const [drawerVisible,      setDrawerVisible]      = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const router   = useRouter();
  const pathname = usePathname();

  const { unreadCount } = useNotifications();
  const isMainPage      = MAIN_PAGES.includes(pathname);

  const menuItems: MenuItem[] = useMemo(() => [
    { name: 'Home',              route: '/',                  icon: Home,        description: 'Main dashboard',                  color: '#059669' },
    { name: 'Wird',              route: '/wird',              icon: Heart,       description: 'Daily litany',                    color: '#DC2626' },
    { name: 'Wazifa',            route: '/wazifa',            icon: Star,        description: 'The daily collective invocation', color: '#D97706' },
    { name: 'Haḍratu-Jumūʿa',   route: '/hadra',             icon: Moon,        description: 'Friday sacred gathering',         color: '#7C3AED' },
    { name: "Sūras of Qur'ān",  route: '/suwar',             icon: BookMarked,  description: '114 Surahs · Reflect & meditate', color: '#1E3A8A', isNew: true },
    { name: "Asmā' Allāh",      route: '/asmaa-alhusna',     icon: Sparkles,    description: 'The 99 Names of Allah',           color: '#1E40AF', isNew: true },
    { name: "Asmā' An-Nabī",    route: '/asmaa-nabi',        icon: Star,        description: '201 Names of the Prophet ﷺ',     color: '#B45309', isNew: true },
    { name: 'Dhikr Counter',    route: '/dhikr-counter',     icon: Timer,       description: 'Your dhikr counter',              color: '#0891B2', isNew: true },
    { name: 'Library',          route: '/library',           icon: BookOpen,    description: 'Resources & sacred texts',        color: '#059669', dividerAfter: true },
    { name: 'Hadara Map',       route: '/hadra-map',         icon: MapPin,      description: 'Find local Zawiya & gatherings',  color: '#059669' },
    { name: 'Al-Hadra',         route: '/hadra-station',     icon: Eye,         description: 'The Station of Presence',        color: '#C8922A', isNew: true },
    { name: 'Statistics',       route: '/stats',             icon: BarChart3,   description: 'Consistency & discipline',        color: '#0891B2' },
    { name: 'Settings',         route: '/settings',          icon: SettingsIcon,description: 'Configuration',                  color: '#475569' },
    { name: 'About',            route: '/about',             icon: Info,        description: 'App information',                color: '#7C3AED' },
    { name: 'Contact Us',       route: '/contact',           icon: Mail,        description: 'Get in touch',                   color: '#0891B2' },
  ], []);

  const haptic = useCallback((t: 'light' | 'medium' | 'success' = 'light') => {
    if (Platform.OS !== 'ios') return;
    if (t === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else Haptics.impactAsync(t === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const openDrawer  = useCallback(() => { haptic('light'); setDrawerVisible(true);  }, [haptic]);
  const closeDrawer = useCallback(() => { haptic('light'); setDrawerVisible(false); }, [haptic]);
  const openBS      = useCallback(() => { haptic('medium'); setBottomSheetVisible(true);  }, [haptic]);
  const closeBS     = useCallback(() => { haptic('light');  setBottomSheetVisible(false); }, [haptic]);

  const handleBack = useCallback(() => {
    haptic('light');
    router.canGoBack() ? router.back() : router.push('/');
  }, [router, haptic]);

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

  // Drawer animation
  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: drawerVisible ? 0 : -DRAWER_WIDTH, useNativeDriver: true, damping: 20, stiffness: 180 }),
      Animated.timing(fadeAnim,  { toValue: drawerVisible ? 1 : 0, duration: drawerVisible ? 280 : 220, useNativeDriver: true }),
    ]).start();
  }, [drawerVisible]);

  // Swipe to open drawer
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => gs.dx > 10 && Math.abs(gs.dy) < 80,
      onPanResponderGrant: () => { if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); },
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

  const SideMenuItem = useCallback(({ item }: { item: MenuItem }) => {
    const Icon   = item.icon;
    const active = isActive(item.route);
    const color  = item.color || '#059669';

    if (item.route === '/hadra-station') {
      return (
        <>
          <View style={s.sideHadraWrap}>
            <TouchableOpacity style={[s.sideHadraItem, active && { borderColor: '#C8922A', borderWidth: 1.5 }]} onPress={() => handleNavigation(item.route)} activeOpacity={0.75}>
              <View style={s.sideHadraIconWrap}><Icon color="#C8922A" size={20} strokeWidth={1.8} /></View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  <Text style={s.sideHadraLabel}>{item.name}</Text>
                  <View style={s.sideHadraBadge}><Text style={s.sideHadraBadgeText}>✦ PRESENCE</Text></View>
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
        <TouchableOpacity style={[s.menuItem, active && s.menuItemActive]} onPress={() => handleNavigation(item.route)} activeOpacity={0.7}>
          <View style={[s.menuIcon, { backgroundColor: active ? color : color + '15' }]}>
            <Icon color={active ? '#FFFFFF' : color} size={20} strokeWidth={2.2} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <Text style={[s.menuLabel, active && { color }]}>{item.name}</Text>
              {!!item.badge && item.badge > 0 ? (
                <View style={s.menuBadge}><Text style={s.menuBadgeText}>{item.badge > 99 ? '99+' : item.badge}</Text></View>
              ) : item.isNew ? (
                <View style={s.menuNewBadge}><Text style={s.menuNewBadgeText}>NEW</Text></View>
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

  const layoutActions = useMemo(() => ({
    openDrawer, handleBack, handleNotifications, unreadCount,
  }), [openDrawer, handleBack, handleNotifications, unreadCount]);

  return (
    <LayoutActionsContext.Provider value={layoutActions}>
      <SafeAreaView style={s.root} edges={['bottom']}>

        {!drawerVisible && isMainPage && (
          <View style={s.swipeZone} {...panResponder.panHandlers} />
        )}

        {/* Side Drawer */}
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
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}>
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

        {/* Bottom Sheet */}
        <BottomMenuSheet
          visible={bottomSheetVisible}
          onClose={closeBS}
          menuItems={menuItems}
          onNavigate={handleBSNavigate}
          pathname={pathname}
        />

        {/* Tabs with custom tab bar */}
        <Tabs
          screenOptions={{ headerShown: false }}
          tabBar={(props) => (
            <AnimatedTabBar
              {...props}
              onBurgerPress={openBS}
              burgerActive={bottomSheetVisible}
              unreadCount={unreadCount}
            />
          )}
          screenListeners={{ tabPress: () => haptic('light') }}
        >
          <Tabs.Screen name="index"  options={{ title: 'Home'   }} />
          <Tabs.Screen name="wird"   options={{ title: 'Wird'   }} />
          <Tabs.Screen name="wazifa" options={{ title: 'Wazifa' }} />
          <Tabs.Screen name="hadra"  options={{ title: 'Haḍra'  }} />

          {[
            'suwar', 'hadra-station', 'asmaa-alhusna', 'dhikr-counter',
            'stats', 'settings', 'about', 'library', 'notifications',
            'notification-settings', 'azkars', 'notification-test',
            'daily-achievements', 'asmaa-nabi', 'contact',
          ].map(name => (
            <Tabs.Screen key={name} name={name} options={{ href: null }} />
          ))}
        </Tabs>

      </SafeAreaView>
    </LayoutActionsContext.Provider>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────
export default function TabLayout() {
  return (
    <HeaderActionsProvider>
      <InnerTabLayout />
    </HeaderActionsProvider>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:      { flex: 1, backgroundColor: '#043D2E' },
  swipeZone: { position: 'absolute', left: 0, top: 0, bottom: 0, width: SWIPE_AREA_WIDTH, zIndex: 999 },

  drawerOverlay:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 },
  drawerBackdrop:   { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.48)' },
  drawer:           { position: 'absolute', left: 0, top: 0, bottom: 0, width: '85%', maxWidth: 340, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.22, shadowRadius: 12, elevation: 18, borderTopRightRadius: 28, borderBottomRightRadius: 28 },
  drawerHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 22, paddingTop: Platform.OS === 'ios' ? 60 : 46, backgroundColor: '#064E3B', borderTopRightRadius: 28 },
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
  menuNewBadge:     { backgroundColor: '#065F46', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
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