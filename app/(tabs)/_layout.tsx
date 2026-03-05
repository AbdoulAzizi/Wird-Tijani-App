// app/(tabs)/_layout.tsx

import { Tabs, useRouter, usePathname } from 'expo-router';
import { SafeAreaView }                 from 'react-native-safe-area-context';
import { View, StyleSheet, Platform }   from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import * as Haptics from 'expo-haptics';

import { useNotifications }      from '@/contexts/NotificationContext';
import { HeaderActionsProvider } from '@/contexts/HeaderActionsContext';
import { LayoutActionsContext }  from '@/contexts/LayoutActionsContext';
import { AnimatedTabBar }        from '@/components/layout/AnimatedTabBar';
import { BottomMenuSheet }       from '@/components/layout/BottomMenuSheet';
import { SideDrawer }            from '@/components/layout/SideDrawer';
import { MENU_ITEMS }            from '@/constants/menuItems';
import { useSwipeDrawer }        from '@/hooks/useSwipeDrawer';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAIN_PAGES = ['/', '/wird', '/wazifa', '/hadra'];

const HIDDEN_TABS = [
  'suwar', 'hadra-station', 'asmaa-alhusna', 'dhikr-counter',
  'stats', 'settings', 'about', 'library', 'notifications',
  'notification-settings', 'azkars', 'notification-test',
  'daily-achievements', 'asmaa-nabi', 'contact',
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

  const router   = useRouter();
  const pathname = usePathname();
  const haptic   = useHaptic();

  const { unreadCount } = useNotifications();
  const isMainPage      = MAIN_PAGES.includes(pathname);

  // ── Navigation ──
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

  // ── Drawer ──
  const openDrawer  = useCallback(() => { haptic('light');  setDrawerOpen(true);  }, [haptic]);
  const closeDrawer = useCallback(() => { haptic('light');  setDrawerOpen(false); }, [haptic]);
  const onDrawerNav = useCallback((route: string) => { closeDrawer(); navigate(route, 240); }, [closeDrawer, navigate]);

  // ── Bottom sheet ──
  const openSheet  = useCallback(() => { haptic('medium'); setBottomSheetOpen(true);  }, [haptic]);
  const closeSheet = useCallback(() => { haptic('light');  setBottomSheetOpen(false); }, [haptic]);
  const onSheetNav = useCallback((route: string) => { closeSheet(); navigate(route, 260); }, [closeSheet, navigate]);

  // ── Swipe to open drawer ──
  const swipeHandlers = useSwipeDrawer({ enabled: isMainPage && !drawerOpen, onOpen: openDrawer });

  // ── Context ──
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

        <Tabs
          screenOptions={{ headerShown: false }}
          tabBar={(props) => (
            <AnimatedTabBar
              {...props}
              onBurgerPress={openSheet}
              burgerActive={bottomSheetOpen}
              unreadCount={unreadCount}
            />
          )}
          screenListeners={{ tabPress: () => haptic('light') }}
        >
          <Tabs.Screen name="index"  options={{ title: 'Home'   }} />
          <Tabs.Screen name="wird"   options={{ title: 'Wird'   }} />
          <Tabs.Screen name="wazifa" options={{ title: 'Wazifa' }} />
          <Tabs.Screen name="hadra"  options={{ title: 'Haḍra'  }} />

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
  root:      { flex: 1, backgroundColor: '#043D2E' },
  swipeZone: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 30, zIndex: 999 },
});