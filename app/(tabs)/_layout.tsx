import { Tabs, useRouter, usePathname } from 'expo-router';
import { Heart, BookOpen, ChartBar as BarChart3, Settings as SettingsIcon, Star, Moon, Home, Info, Menu, X, ChevronRight, Sparkles, Bell } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView, Pressable, PanResponder, Platform } from 'react-native';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import * as Haptics from 'expo-haptics';
import SpiritualHeader from '@/components/SpiritualHeader';
import MinimalHeader from '@/components/MinimalHeader';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNotifications } from '@/contexts/NotificationContext';

// Types pour améliorer la sécurité du code
interface MenuItem {
  name: string;
  route: string;
  icon: any;
  description: string;
  badge?: number;
  dividerAfter?: boolean;
  useMinimalHeader?: boolean; // Nouveau: indique si cette page utilise le header minimal
}

interface TabIconProps {
  IconComponent: any;
  color: string;
  focused: boolean;
  name?: string;
}

// Configuration des constantes
const DRAWER_WIDTH = 300;
const SWIPE_THRESHOLD = 150;
const SWIPE_AREA_WIDTH = 30;

// Pages principales qui utilisent le SpiritualHeader

const MAIN_PAGES = ['/', '/wird', '/wazifa', '/hadra'];
export default function TabLayout() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const pathname = usePathname();
  
  const { unreadCount, markAllAsRead } = useNotifications();

  // Mémoiser les éléments du menu pour éviter les recréations
  const menuItems: MenuItem[] = useMemo(() => [
    { 
      name: 'Home', 
      route: '/', 
      icon: Home, 
      description: 'Main page',
      useMinimalHeader: false // Page principale
    },
    { 
      name: 'Wird', 
      route: '/wird', 
      icon: Heart, 
      description: 'Daily prayers',
      dividerAfter: false,
      useMinimalHeader: true // Page principale
    },
    { 
      name: 'Wazifa', 
      route: '/wazifa', 
      icon: Star, 
      description: 'Special invocations',
      useMinimalHeader: true // Page principale
    },
    { 
      name: 'Hadra Jumuah', 
      route: '/hadra', 
      icon: Moon, 
      description: 'Spiritual sessions',
      dividerAfter: true,
      useMinimalHeader: true // Page principale
    },
    { 
      name: 'Names', 
      route: '/names', 
      icon: Sparkles, 
      description: 'Divine names',
      useMinimalHeader: true // Page secondaire
    },
    { 
      name: 'Library', 
      route: '/library', 
      icon: BookOpen, 
      description: 'Resources',
      dividerAfter: true,
      useMinimalHeader: true // Page secondaire
    },
    { 
      name: 'Statistics', 
      route: '/stats', 
      icon: BarChart3, 
      description: 'Your progress',
      useMinimalHeader: true // Page secondaire
    },
    { 
      name: 'Notifications', 
      route: '/notifications', 
      icon: Bell, 
      description: 'Notifications',
      badge: unreadCount,
      useMinimalHeader: true // Page secondaire
    },
    { 
      name: 'Notification Settings', 
      route: '/notification-settings', 
      icon: Bell, 
      description: 'Manage notifications',
      useMinimalHeader: true // Page secondaire
    },
    { 
      name: 'Settings', 
      route: '/settings', 
      icon: SettingsIcon, 
      description: 'Configuration',
      useMinimalHeader: true // Page secondaire
    },
    { 
      name: 'About', 
      route: '/about', 
      icon: Info, 
      description: 'Information',
      useMinimalHeader: true // Page secondaire
    },
  ], [unreadCount]);

  // Déterminer si on doit utiliser le header minimal
  const shouldUseMinimalHeader = useMemo(() => {
    return !MAIN_PAGES.includes(pathname);
  }, [pathname]);

  // Obtenir les infos de la page courante
  const currentPageInfo = useMemo(() => {
    const currentItem = menuItems.find(item => item.route === pathname);
    return {
      name: currentItem?.name || 'Home',
      useMinimal: currentItem?.useMinimalHeader ?? shouldUseMinimalHeader,
      icon: currentItem?.icon,
      description: currentItem?.description,
    };
  }, [pathname, menuItems, shouldUseMinimalHeader]);

  // Feedback haptique pour améliorer l'UX
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'success' = 'light') => {
    if (Platform.OS === 'ios') {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
      }
    }
  }, []);

  // Animations optimisées avec useCallback
  const openDrawer = useCallback(() => {
    setDrawerVisible(true);
    triggerHaptic('light');
  }, [triggerHaptic]);

  const closeDrawer = useCallback(() => {
    setDrawerVisible(false);
    triggerHaptic('light');
  }, [triggerHaptic]);

  // Handler pour le retour (MinimalHeader)
  const handleBackPress = useCallback(() => {
    triggerHaptic('light');
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router, triggerHaptic]);

  // Handler pour les notifications avec feedback haptique
  const handleNotifications = useCallback(() => {
    triggerHaptic('medium');
    router.push('/notifications' as any);
    setTimeout(() => {
      markAllAsRead();
    }, 500);
  }, [router, markAllAsRead, triggerHaptic]);

  // PanResponder optimisé avec gestion améliorée du swipe
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Détecter le swipe depuis le bord gauche
        return gestureState.dx > 10 && Math.abs(gestureState.dy) < 80;
      },
      onPanResponderGrant: () => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0 && gestureState.dx < DRAWER_WIDTH) {
          slideAnim.setValue(-DRAWER_WIDTH + gestureState.dx);
          fadeAnim.setValue(gestureState.dx / DRAWER_WIDTH);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD || gestureState.vx > 0.5) {
          openDrawer();
        } else {
          Animated.parallel([
            Animated.spring(slideAnim, {
              toValue: -DRAWER_WIDTH,
              useNativeDriver: true,
              damping: 20,
              stiffness: 200,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  // Effet pour les animations d'ouverture/fermeture avec micro-interactions
  useEffect(() => {
    if (drawerVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 180,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          useNativeDriver: true,
          damping: 15,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: -DRAWER_WIDTH,
          useNativeDriver: true,
          damping: 22,
          stiffness: 200,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 15,
        }),
      ]).start();
    }
  }, [drawerVisible, slideAnim, fadeAnim, scaleAnim]);

  // Navigation optimisée avec feedback haptique
  const handleNavigation = useCallback((route: string) => {
    triggerHaptic('success');
    closeDrawer();
    requestAnimationFrame(() => {
      setTimeout(() => {
        router.push(route as any);
      }, 250);
    });
  }, [router, closeDrawer, triggerHaptic]);

  // Vérification de la route active
  const isCurrentRoute = useCallback((route: string) => {
    return pathname === route;
  }, [pathname]);

  // Composant MenuItem optimisé avec badge et divider
  const MenuItem = useCallback(({ item, index }: { item: MenuItem; index: number }) => {
    const IconComponent = item.icon;
    const isActive = isCurrentRoute(item.route);
    
    return (
      <>
        <TouchableOpacity
          key={index}
          style={[
            styles.menuItem,
            isActive && styles.menuItemActive
          ]}
          onPress={() => handleNavigation(item.route)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Navigate to ${item.name}`}
          accessibilityState={{ selected: isActive }}
        >
          <View style={[
            styles.iconContainer,
            isActive && styles.iconContainerActive
          ]}>
            <IconComponent 
              color={isActive ? "#FFFFFF" : "#059669"} 
              size={22}
              strokeWidth={2.5}
            />
          </View>
          <View style={styles.menuItemTextContainer}>
            <View style={styles.menuItemTitleRow}>
              <Text style={[
                styles.menuItemText,
                isActive && styles.menuItemTextActive
              ]}>
                {item.name}
              </Text>
              {item.badge !== undefined && item.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.menuItemDescription}>
              {item.description}
            </Text>
          </View>
          <ChevronRight 
            color={isActive ? "#059669" : "#9CA3AF"} 
            size={20}
            strokeWidth={2}
          />
        </TouchableOpacity>
        {item.dividerAfter && (
          <View style={styles.menuDivider} />
        )}
      </>
    );
  }, [handleNavigation, isCurrentRoute]);

  // Composant TabIcon optimisé avec animation
  const TabIcon = useCallback(({ IconComponent, color, focused, name }: TabIconProps) => (
    <Animated.View style={[
      styles.tabIconContainer,
      focused && styles.tabIconContainerActive,
      { transform: [{ scale: focused ? 1.15 : 1 }] }
    ]}>
      {name === 'home' ? (
        <Ionicons 
          name="home" 
          color={color} 
          size={24} 
        />
      ) : (
        <IconComponent 
          color={color} 
          size={24}
          strokeWidth={focused ? 2.5 : 2}
        />
      )}
      {focused && <View style={styles.activeIndicator} />}
    </Animated.View>
  ), []);

  const handleMorePress = useCallback(() => {
    triggerHaptic('light');
    // Logique pour le bouton "More" du MinimalHeader (ex: ouvrir un menu contextuel)
    // Pour l'instant, on peut simplement afficher une alerte ou naviguer vers une page de paramètres rapides
    // router.push('/settings' as any);
  }, [router, triggerHaptic]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header intelligent qui switch entre Spiritual et Minimal */}
      {currentPageInfo.useMinimal ? (
        <MinimalHeader
          title={currentPageInfo.name}
          subtitle={currentPageInfo.description}
          onBackPress={handleBackPress}
          showMore={true}
          onMorePress={handleMorePress}
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

      {/* Zone de swipe pour ouvrir le drawer (seulement sur pages principales) */}
      {!drawerVisible && !currentPageInfo.useMinimal && (
        <View 
          style={styles.swipeArea}
          {...panResponder.panHandlers}
        />
      )}

      {/* Drawer Menu optimisé */}
      {drawerVisible && (
        <View style={styles.drawerOverlay}>
          <Pressable 
            style={styles.backdrop} 
            onPress={closeDrawer}
            accessibilityRole="button"
            accessibilityLabel="Close menu"
          >
            <Animated.View style={[styles.backdropFade, { opacity: fadeAnim }]} />
          </Pressable>

          <Animated.View 
            style={[
              styles.drawerContainer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            {/* Header du Drawer */}
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerTitle}>Menu</Text>
                <Text style={styles.drawerSubtitle}>Navigation</Text>
              </View>
              <TouchableOpacity
                onPress={closeDrawer}
                style={styles.closeButton}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Close menu"
              >
                <X color="#FFFFFF" size={24} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Liste des pages avec ScrollView optimisé */}
            <ScrollView 
              style={styles.menuList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.menuListContent}
              bounces={true}
              overScrollMode="auto"
            >
              {menuItems.map((item, index) => (
                <MenuItem key={item.route} item={item} index={index} />
              ))}
            </ScrollView>

            {/* Footer du Drawer */}
            <View style={styles.drawerFooter}>
              <View style={styles.footerDivider} />
              <Text style={styles.footerText}>Version 1.0.0</Text>
              <Text style={styles.footerTextSmall}>© 2025 Spiritual App</Text>
            </View>
          </Animated.View>
        </View>
      )}

      {/* Navigation par onglets améliorée */}
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
          tabPress: () => {
            triggerHaptic('light');
          },
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
            title: 'Hadra',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon IconComponent={Moon} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="names"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="stats"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="settings"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: 'About',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon IconComponent={Info} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="library-screen"
            options={{ href: null }}
        />  
        <Tabs.Screen
          name="notifications"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="notification-settings"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="notification-test"
          options={{ href: null }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  swipeArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SWIPE_AREA_WIDTH,
    zIndex: 999,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
  },
  backdropFade: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
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
  menuList: {
    flex: 1,
  },
  menuListContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
  },
  menuItemActive: {
    backgroundColor: '#F0FDF4',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconContainerActive: {
    backgroundColor: '#059669',
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuItemTextActive: {
    color: '#059669',
    fontWeight: '700',
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
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
    width: 40,
    height: 3,
    backgroundColor: '#Es5E7EB',
    borderRadius: 2,
    marginBottom: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  footerTextSmall: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
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
  tabBarItem: {
    paddingVertical: 6,
  },
  tabIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    position: 'relative',
  },
  tabIconContainerActive: {
    // Animation gérée via Animated.View
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#059669',
  },
});