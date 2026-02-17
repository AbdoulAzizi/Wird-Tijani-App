import { Tabs, useRouter, usePathname } from 'expo-router';
import {
  Heart, BookOpen, ChartBar as BarChart3, Settings as SettingsIcon,
  Star, Moon, Home, Info, Menu, X, ChevronRight, Sparkles, Bell,
  Users, MapPin, Grid3X3
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView,
  Pressable, PanResponder, Platform, Dimensions
} from 'react-native';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import SpiritualHeader from '@/components/SpiritualHeader';
import MinimalHeader from '@/components/MinimalHeader';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  HeaderActionsProvider,
  useHeaderActions,
} from '@/contexts/HeaderActionsContext';

// ─── Types ───────────────────────────────────────────────────────────────────
interface MenuItem {
  name: string;
  route: string;
  icon: any;
  description: string;
  badge?: number;
  dividerAfter?: boolean;
  useMinimalHeader?: boolean;
  color?: string;
}

interface TabIconProps {
  IconComponent: any;
  color: string;
  focused: boolean;
  name?: string;
}

// ─── Constantes ──────────────────────────────────────────────────────────────
const DRAWER_WIDTH = 300;
const SWIPE_THRESHOLD = 150;
const SWIPE_AREA_WIDTH = 30;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.72;
const MAIN_PAGES = ['/', '/wird', '/wazifa', '/hadra'];

// ─── Bottom Sheet Component ───────────────────────────────────────────────────
function BottomMenuSheet({
  visible,
  onClose,
  menuItems,
  onNavigate,
  pathname,
}: {
  visible: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onNavigate: (route: string) => void;
  pathname: string;
}) {
  const slideAnim = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 160,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: BOTTOM_SHEET_HEIGHT,
          useNativeDriver: true,
          damping: 24,
          stiffness: 180,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const groups = [
    {
      label: 'Daily Practices',
      items: menuItems.filter(i => ['/', '/wird', '/wazifa', '/hadra'].includes(i.route)),
    },
    {
      label: 'Discover',
      items: menuItems.filter(i => ['/names', '/library'].includes(i.route)),
    },
    {
      label: 'Tools',
      items: menuItems.filter(i =>
        ['/stats', '/notifications', '/notification-settings', '/settings', '/about'].includes(i.route)
      ),
    },
  ];

  return (
    <View style={bsStyles.overlay} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View style={[bsStyles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          bsStyles.sheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Handle bar */}
        <View style={bsStyles.handleContainer}>
          <View style={bsStyles.handle} />
        </View>

        {/* Header */}
        <View style={bsStyles.header}>
          <View>
            <Text style={bsStyles.headerTitle}>Navigation</Text>
            <Text style={bsStyles.headerSubtitle}>Where would you like to go?</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={bsStyles.closeBtn} activeOpacity={0.7}>
            <X color="#6B7280" size={22} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Menu groups */}
        <ScrollView
          style={bsStyles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={bsStyles.scrollContent}
          bounces={false}
        >
          {groups.map((group) => (
            <View key={group.label} style={bsStyles.group}>
              <Text style={bsStyles.groupLabel}>{group.label}</Text>
              <View style={bsStyles.groupGrid}>
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.route;
                  const bgColor = item.color || '#059669';
                  return (
                    <TouchableOpacity
                      key={item.route}
                      style={[bsStyles.card, isActive && bsStyles.cardActive]}
                      onPress={() => onNavigate(item.route)}
                      activeOpacity={0.75}
                    >
                      <View style={[bsStyles.cardIcon, { backgroundColor: isActive ? bgColor : bgColor + '18' }]}>
                        <IconComponent
                          color={isActive ? '#FFFFFF' : bgColor}
                          size={22}
                          strokeWidth={2}
                        />
                      </View>
                      <Text style={[bsStyles.cardTitle, isActive && bsStyles.cardTitleActive]} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={bsStyles.cardDesc} numberOfLines={1}>
                        {item.description}
                      </Text>
                      {item.badge !== undefined && item.badge > 0 && (
                        <View style={bsStyles.cardBadge}>
                          <Text style={bsStyles.cardBadgeText}>
                            {item.badge > 9 ? '9+' : item.badge}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Version */}
          <Text style={bsStyles.version}>Wird & Wazīfa Tijāniyya — v1.0.0</Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ─── Bottom Sheet Styles ──────────────────────────────────────────────────────
const bsStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 2000,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: BOTTOM_SHEET_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 30,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  group: {
    marginBottom: 24,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginLeft: 4,
  },
  groupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    position: 'relative',
  },
  cardActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#059669',
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 3,
  },
  cardTitleActive: {
    color: '#059669',
  },
  cardDesc: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  cardBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '500',
    marginTop: 4,
  },
});

// ─── Inner Layout (accède au HeaderActionsContext) ────────────────────────────
function InnerTabLayout() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const pathname = usePathname();
  const { unreadCount, markAllAsRead } = useNotifications();

  // ← Récupère les actions injectées par le screen courant
  const { actions: headerMenuActions } = useHeaderActions();

  const menuItems: MenuItem[] = useMemo(() => [
    { name: 'Home',            route: '/',                      icon: Home,         description: 'Main dashboard',        color: '#059669', useMinimalHeader: false },
    { name: 'Wird',            route: '/wird',                  icon: Heart,        description: 'Daily prayers',         color: '#DC2626', useMinimalHeader: true  },
    { name: 'Wazifa',          route: '/wazifa',                icon: Star,         description: 'Special invocations',   color: '#D97706', useMinimalHeader: true  },
    { name: 'Hadra',           route: '/hadra',                 icon: Moon,         description: 'Spiritual sessions',    color: '#7C3AED', useMinimalHeader: true  },
    { name: 'Names',           route: '/names',                 icon: Sparkles,     description: 'Divine names',          color: '#1E40AF', useMinimalHeader: true  },
    { name: 'Library',         route: '/library',               icon: BookOpen,     description: 'Resources & texts',     color: '#059669', useMinimalHeader: true, dividerAfter: true },
    { name: 'Statistics',      route: '/stats',                 icon: BarChart3,    description: 'Your progress',         color: '#0891B2', useMinimalHeader: true  },
    { name: 'Notifications',   route: '/notifications',         icon: Bell,         description: 'Alerts & reminders',    color: '#059669', badge: unreadCount, useMinimalHeader: true },
    { name: 'Notif. Settings', route: '/notification-settings', icon: Bell,         description: 'Manage notifications',  color: '#64748B', useMinimalHeader: true  },
    { name: 'Settings',        route: '/settings',              icon: SettingsIcon, description: 'Configuration',         color: '#475569', useMinimalHeader: true  },
    { name: 'About',           route: '/about',                 icon: Info,         description: 'App information',       color: '#7C3AED', useMinimalHeader: true  },
  ], [unreadCount]);

  const shouldUseMinimalHeader = useMemo(() => !MAIN_PAGES.includes(pathname), [pathname]);

  const currentPageInfo = useMemo(() => {
    const currentItem = menuItems.find(item => item.route === pathname);
    return {
      name: currentItem?.name || 'Home',
      useMinimal: currentItem?.useMinimalHeader ?? shouldUseMinimalHeader,
      icon: currentItem?.icon,
      description: currentItem?.description,
    };
  }, [pathname, menuItems, shouldUseMinimalHeader]);

  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'success' = 'light') => {
    if (Platform.OS === 'ios') {
      switch (type) {
        case 'light':   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);             break;
        case 'medium':  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);            break;
        case 'success': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
      }
    }
  }, []);

  const openDrawer  = useCallback(() => { setDrawerVisible(true);  triggerHaptic('light'); }, [triggerHaptic]);
  const closeDrawer = useCallback(() => { setDrawerVisible(false); triggerHaptic('light'); }, [triggerHaptic]);

  const openBottomSheet  = useCallback(() => { triggerHaptic('medium'); setBottomSheetVisible(true);  }, [triggerHaptic]);
  const closeBottomSheet = useCallback(() => { triggerHaptic('light');  setBottomSheetVisible(false); }, [triggerHaptic]);

  const handleBackPress = useCallback(() => {
    triggerHaptic('light');
    router.canGoBack() ? router.back() : router.push('/');
  }, [router, triggerHaptic]);

  const handleNotifications = useCallback(() => {
    triggerHaptic('medium');
    router.push('/notifications' as any);
    setTimeout(() => markAllAsRead(), 500);
  }, [router, markAllAsRead, triggerHaptic]);

  const handleBottomSheetNavigate = useCallback((route: string) => {
    triggerHaptic('success');
    setBottomSheetVisible(false);
    setTimeout(() => router.push(route as any), 280);
  }, [router, triggerHaptic]);

  // Side drawer animation
  useEffect(() => {
    if (drawerVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0,             useNativeDriver: true, damping: 20, stiffness: 180 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 0.95,          useNativeDriver: true, damping: 15 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: -DRAWER_WIDTH, useNativeDriver: true, damping: 22, stiffness: 200 }),
        Animated.timing(fadeAnim,  { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1,             useNativeDriver: true, damping: 15 }),
      ]).start();
    }
  }, [drawerVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gs) => gs.dx > 10 && Math.abs(gs.dy) < 80,
      onPanResponderGrant: () => {
        if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: (evt, gs) => {
        if (gs.dx > 0 && gs.dx < DRAWER_WIDTH) {
          slideAnim.setValue(-DRAWER_WIDTH + gs.dx);
          fadeAnim.setValue(gs.dx / DRAWER_WIDTH);
        }
      },
      onPanResponderRelease: (evt, gs) => {
        if (gs.dx > SWIPE_THRESHOLD || gs.vx > 0.5) {
          openDrawer();
        } else {
          Animated.parallel([
            Animated.spring(slideAnim, { toValue: -DRAWER_WIDTH, useNativeDriver: true, damping: 20, stiffness: 200 }),
            Animated.timing(fadeAnim,  { toValue: 0, duration: 200, useNativeDriver: true }),
          ]).start();
        }
      },
    })
  ).current;

  const handleNavigation = useCallback((route: string) => {
    triggerHaptic('success');
    closeDrawer();
    requestAnimationFrame(() => setTimeout(() => router.push(route as any), 250));
  }, [router, closeDrawer, triggerHaptic]);

  const isCurrentRoute = useCallback((route: string) => pathname === route, [pathname]);

  const SideMenuItem = useCallback(({ item }: { item: MenuItem; index: number }) => {
    const IconComponent = item.icon;
    const isActive = isCurrentRoute(item.route);
    return (
      <>
        <TouchableOpacity
          style={[styles.menuItem, isActive && styles.menuItemActive]}
          onPress={() => handleNavigation(item.route)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Navigate to ${item.name}`}
          accessibilityState={{ selected: isActive }}
        >
          <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
            <IconComponent color={isActive ? '#FFFFFF' : '#059669'} size={22} strokeWidth={2.5} />
          </View>
          <View style={styles.menuItemTextContainer}>
            <View style={styles.menuItemTitleRow}>
              <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>{item.name}</Text>
              {item.badge !== undefined && item.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge > 99 ? '99+' : item.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.menuItemDescription}>{item.description}</Text>
          </View>
          <ChevronRight color={isActive ? '#059669' : '#9CA3AF'} size={20} strokeWidth={2} />
        </TouchableOpacity>
        {item.dividerAfter && <View style={styles.menuDivider} />}
      </>
    );
  }, [handleNavigation, isCurrentRoute]);

  const TabIcon = useCallback(({ IconComponent, color, focused, name }: TabIconProps) => (
    <Animated.View style={[
      styles.tabIconContainer,
      { transform: [{ scale: focused ? 1.15 : 1 }] }
    ]}>
      {name === 'home' ? (
        <Ionicons name="home" color={color} size={24} />
      ) : (
        <IconComponent color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
      )}
      {focused && <View style={styles.activeIndicator} />}
    </Animated.View>
  ), []);

  const BurgerTabButton = useCallback(() => (
    <TouchableOpacity
      style={styles.burgerTabButton}
      onPress={openBottomSheet}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel="Open navigation menu"
    >
      <View style={[
        styles.burgerIconWrapper,
        bottomSheetVisible && styles.burgerIconWrapperActive
      ]}>
        {bottomSheetVisible
          ? <X color="#FFFFFF" size={22} strokeWidth={2.5} />
          : <Grid3X3 color="#059669" size={22} strokeWidth={2} />
        }
        {unreadCount > 0 && (
          <View style={styles.burgerBadge}>
            <Text style={styles.burgerBadgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.burgerLabel, bottomSheetVisible && styles.burgerLabelActive]}>
        Menu
      </Text>
    </TouchableOpacity>
  ), [openBottomSheet, bottomSheetVisible, unreadCount]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* ── Header intelligent ── */}
      {currentPageInfo.useMinimal ? (
        <MinimalHeader
          title={currentPageInfo.name}
          subtitle={currentPageInfo.description}
          onBackPress={handleBackPress}
          showMore={true}
          // ← On passe les actions du screen courant au dropdown du header
          menuActions={headerMenuActions}
          theme="default"
        />
      ) : (
        <SpiritualHeader
          onMenuPress={openDrawer}
          currentPage={currentPageInfo.name}
          onNotificationPress={handleNotifications}
          notificationCount={unreadCount}
          showNotification={true}
          showHijriDate={true}
          theme="default"
        />
      )}

      {/* Zone swipe latérale */}
      {!drawerVisible && !currentPageInfo.useMinimal && (
        <View style={styles.swipeArea} {...panResponder.panHandlers} />
      )}

      {/* Side Drawer */}
      {drawerVisible && (
        <View style={styles.drawerOverlay}>
          <Pressable style={styles.backdrop} onPress={closeDrawer} accessibilityRole="button" accessibilityLabel="Close menu">
            <Animated.View style={[styles.backdropFade, { opacity: fadeAnim }]} />
          </Pressable>
          <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerTitle}>Menu</Text>
                <Text style={styles.drawerSubtitle}>Navigation</Text>
              </View>
              <TouchableOpacity onPress={closeDrawer} style={styles.closeButton} activeOpacity={0.7}>
                <X color="#FFFFFF" size={24} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuListContent}>
              {menuItems.map((item, index) => <SideMenuItem key={item.route} item={item} index={index} />)}
            </ScrollView>
            <View style={styles.drawerFooter}>
              <View style={styles.footerDivider} />
              <Text style={styles.footerText}>Version 1.0.0</Text>
              <Text style={styles.footerTextSmall}>© 2025 Spiritual App</Text>
            </View>
          </Animated.View>
        </View>
      )}

      {/* Bottom Sheet Navigation */}
      <BottomMenuSheet
        visible={bottomSheetVisible}
        onClose={closeBottomSheet}
        menuItems={menuItems}
        onNavigate={handleBottomSheetNavigate}
        pathname={pathname}
      />

      {/* Tab Bar */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#059669',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarItemStyle: styles.tabBarItem,
          tabBarHideOnKeyboard: true,
        }}
        screenListeners={{
          tabPress: () => triggerHaptic('light'),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon IconComponent={Home} color={color} focused={focused} name="home" />
            ),
          }}
        />
        <Tabs.Screen
          name="wird"
          options={{
            title: 'Wird',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon IconComponent={Heart} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="wazifa"
          options={{
            title: 'Wazifa',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon IconComponent={Star} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="hadra"
          options={{
            title: 'Menu',
            tabBarButton: () => <BurgerTabButton />,
          }}
        />
        <Tabs.Screen name="names"                options={{ href: null }} />
        <Tabs.Screen name="stats"                options={{ href: null }} />
        <Tabs.Screen name="settings"             options={{ href: null }} />
        <Tabs.Screen name="about"                options={{ href: null }} />
        <Tabs.Screen name="library"              options={{ href: null }} />
        <Tabs.Screen name="library-screen"       options={{ href: null }} />
        <Tabs.Screen name="notifications"        options={{ href: null }} />
        <Tabs.Screen name="notification-settings" options={{ href: null }} />
        <Tabs.Screen name="notification-test"    options={{ href: null }} />
      </Tabs>
    </SafeAreaView>
  );
}

// ─── Layout principal — wrappé dans le Provider ────────────────────────────────
export default function TabLayout() {
  return (
    <HeaderActionsProvider>
      <InnerTabLayout />
    </HeaderActionsProvider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  swipeArea: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: SWIPE_AREA_WIDTH,
    zIndex: 999,
  },

  // ── Burger Tab Button ──
  burgerTabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
  burgerIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D1FAE5',
    position: 'relative',
  },
  burgerIconWrapperActive: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  burgerBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  burgerBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  burgerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 3,
    letterSpacing: 0.3,
  },
  burgerLabelActive: {
    color: '#059669',
  },

  // ── Side Drawer ──
  drawerOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 1000,
  },
  backdrop: { flex: 1 },
  backdropFade: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: '85%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    backgroundColor: '#059669',
    borderTopRightRadius: 24,
  },
  drawerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  drawerSubtitle: {
    fontSize: 14,
    color: '#D1FAE5',
    marginTop: 2,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuList: { flex: 1 },
  menuListContent: { paddingTop: 8, paddingBottom: 16 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
  },
  menuItemActive: { backgroundColor: '#F0FDF4' },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconContainerActive: { backgroundColor: '#059669' },
  menuItemTextContainer: { flex: 1 },
  menuItemTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuItemText: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  menuItemTextActive: { color: '#059669', fontWeight: '700' },
  menuItemDescription: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
    marginHorizontal: 24,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
    borderBottomRightRadius: 24,
  },
  footerDivider: {
    width: 40, height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 12,
  },
  footerText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  footerTextSmall: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },

  // ── Tab Bar ──
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    paddingBottom: Platform.OS === 'ios' ? 8 : 8,
    paddingTop: 8,
    height: Platform.OS === 'ios' ? 85 : 70,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  tabBarItem: { paddingVertical: 6 },
  tabIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4, height: 4,
    borderRadius: 2,
    backgroundColor: '#059669',
  },
});