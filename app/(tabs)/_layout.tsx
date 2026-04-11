// app/(tabs)/_layout.tsx — Wird Tijāni
// Tabs: Home · Wird · Wazifa · Library
// Hidden: hadra, stats, settings, about, notifications, etc.

import { Tabs, useRouter, usePathname }   from 'expo-router';
import { SafeAreaView }                   from 'react-native-safe-area-context';
import { View, StyleSheet, Platform }     from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import * as Haptics from 'expo-haptics';

import { useNotifications }      from '@/contexts/NotificationContext';
import { HeaderActionsProvider } from '@/contexts/HeaderActionsContext';
import { LayoutActionsContext }  from '@/contexts/LayoutActionsContext';
import { AnimatedTabBar }        from '@/components/layout/AnimatedTabBar';
import { BottomMenuSheet }       from '@/components/layout/BottomMenuSheet';
import { SideDrawer }            from '@/components/layout/SideDrawer';
import { WirdPickerSheet }       from '@/components/layout/WirdPickerSheet';
import { MENU_ITEMS }            from '@/constants/menuItems';
import { useSwipeDrawer }        from '@/hooks/useSwipeDrawer';
import { openHadraMap } from '@/utils/OpenHadraMap';
// ─── Constants ────────────────────────────────────────────────────────────────
// Pages where the swipe-to-open-drawer gesture is active
const MAIN_PAGES = ['/', '/wird'];

// Screens that exist but are NOT shown as tabs
const HIDDEN_TABS = [
  'wazifa', 'hadra',
  'stats', 'settings', 'about', 'library', 'notifications',
  'notification-settings', 'notification-test',
  'daily-achievements', 'contact',
  'hadra-map',   // ← ajouté
];

// ─── Haptic helper ────────────────────────────────────────────────────────────
function useHaptic() {
  return useCallback((type: 'light' | 'medium' | 'success' = 'light') => {
    if (Platform.OS !== 'ios') return;
    if (type === 'success')
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else
      Haptics.impactAsync(
        type === 'medium'
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light,
      );
  }, []);
}

// ─── Layout ───────────────────────────────────────────────────────────────────
function InnerTabLayout() {
  const [drawerOpen,      setDrawerOpen]      = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [wirdPickerOpen,  setWirdPickerOpen]  = useState(false);

  const router   = useRouter();
  const pathname = usePathname();
  const haptic   = useHaptic();

  const { unreadCount } = useNotifications();
  const isMainPage      = MAIN_PAGES.includes(pathname);

  const closeAllSheets = useCallback(() => {
    setBottomSheetOpen(false);
    setWirdPickerOpen(false);
  }, []);

  const navigate = useCallback((route: string, delay = 0) => {
    haptic('success');
    const go = () => router.push(route as any);
    delay ? setTimeout(go, delay) : go();
  }, [router, haptic]);

  const handleBack = useCallback(() => {
    haptic('light');
    router.canGoBack() ? router.back() : router.push('/');
  }, [router, haptic]);

  const handleNotifications = useCallback(() => navigate('/notifications'), [navigate]);

  // ── Drawer ─────────────────────────────────────────────────────────────────
  const openDrawer  = useCallback(() => { haptic('light'); setDrawerOpen(true);  }, [haptic]);
  const closeDrawer = useCallback(() => { haptic('light'); setDrawerOpen(false); }, [haptic]);
 const onDrawerNav = useCallback(
  (route: string) => {
    closeDrawer();
    if (route === '/hadra-map') {
      setTimeout(() => openHadraMap(), 240);
    } else {
      navigate(route, 240);
    }
  },
  [closeDrawer, navigate],
);

  // ── Bottom sheet ────────────────────────────────────────────────────────────
  const toggleSheet = useCallback(() => {
    haptic('medium');
    setBottomSheetOpen(prev => { if (!prev) setWirdPickerOpen(false); return !prev; });
  }, [haptic]);

  const closeSheet  = useCallback(() => { haptic('light'); setBottomSheetOpen(false); }, [haptic]);
  const onSheetNav = useCallback(
    (route: string) => {
      closeSheet();
      if (route === '/hadra-map') {
        setTimeout(() => openHadraMap(), 260);   // ← ouvre l'app externe
      } else {
        navigate(route, 260);
      }
    },
    [closeSheet, navigate],
  );

  // ── Wird picker ─────────────────────────────────────────────────────────────
  const toggleWirdPicker = useCallback(() => {
    haptic('medium');
    setWirdPickerOpen(prev => { if (!prev) setBottomSheetOpen(false); return !prev; });
  }, [haptic]);

  const closeWirdPicker = useCallback(() => { haptic('light'); setWirdPickerOpen(false); }, [haptic]);
  const onWirdPickerNav = useCallback(
    (route: string) => { closeWirdPicker(); navigate(route, 240); },
    [closeWirdPicker, navigate],
  );

  // ── Swipe gesture ───────────────────────────────────────────────────────────
  const swipeHandlers = useSwipeDrawer({
    enabled: isMainPage && !drawerOpen,
    onOpen:  openDrawer,
  });

  // ── Shared context ──────────────────────────────────────────────────────────
  const layoutActions = useMemo(() => ({
    openDrawer, handleBack, handleNotifications, unreadCount,
  }), [openDrawer, handleBack, handleNotifications, unreadCount]);

  return (
    <LayoutActionsContext.Provider value={layoutActions}>
      <SafeAreaView style={s.root} edges={['bottom']}>

        {isMainPage && !drawerOpen && (
          <View style={s.swipeZone} {...swipeHandlers} />
        )}

        <SideDrawer
          visible={drawerOpen}
          onClose={closeDrawer}
          menuItems={MENU_ITEMS}
          onNavigate={onDrawerNav}
          pathname={pathname}
        />

        <BottomMenuSheet
          visible={bottomSheetOpen}
          onClose={closeSheet}
          menuItems={MENU_ITEMS}
          onNavigate={onSheetNav}
          pathname={pathname}
        />

        <WirdPickerSheet
          visible={wirdPickerOpen}
          onClose={closeWirdPicker}
          onNavigate={onWirdPickerNav}
          pathname={pathname}
        />

        <Tabs
          screenOptions={{ headerShown: false }}
          tabBar={(props) => (
            <View style={s.tabBarWrapper}>
              <AnimatedTabBar
                {...props}
                onBurgerPress={toggleSheet}
                onWirdPress={toggleWirdPicker}
                burgerActive={bottomSheetOpen}
                wirdActive={wirdPickerOpen}
                unreadCount={unreadCount}
              />
            </View>
          )}
          screenListeners={{
            tabPress: () => { haptic('light'); closeAllSheets(); },
          }}
        >
          {/* ── Visible tabs ── */}
          <Tabs.Screen name="index" options={{ title: 'Home'    }} />
          <Tabs.Screen name="wird"  options={{ title: 'Wird'    }} />

          {/* ── Hidden screens ── */}
          {HIDDEN_TABS.map(name => (
            <Tabs.Screen key={name} name={name} options={{ href: null }} />
          ))}
        </Tabs>

      </SafeAreaView>
    </LayoutActionsContext.Provider>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function TabLayout() {
  return (
    <HeaderActionsProvider>
      <InnerTabLayout />
    </HeaderActionsProvider>
  );
}

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: '#043D2E' },
  swipeZone:     { position: 'absolute', left: 0, top: 0, bottom: 0, width: 30, zIndex: 999 },
  tabBarWrapper: { zIndex: 3000, elevation: 30 },
});