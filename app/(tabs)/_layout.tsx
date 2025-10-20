import { Tabs, useRouter, usePathname } from 'expo-router';
import { Heart, BookOpen, ChartBar as BarChart3, Settings as SettingsIcon, Star, Moon, Home, Info, Menu, X, ChevronRight, Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView, Pressable, PanResponder, Platform } from 'react-native';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import SpiritualHeader from '@/components/SpiritualHeader';
import Ionicons from '@expo/vector-icons/Ionicons';

// Types pour améliorer la sécurité du code
interface MenuItem {
  name: string;
  route: string;
  icon: any;
  description: string;
}

export default function TabLayout() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const pathname = usePathname();

  // Mémoiser les éléments du menu pour éviter les recréations
  const menuItems: MenuItem[] = useMemo(() => [
    { name: 'Home', route: '/', icon: Home, description: 'Main page' },
    { name: 'Wird', route: '/wird', icon: Heart, description: 'Daily prayers' },
    { name: 'Wazifa', route: '/wazifa', icon: Star, description: 'Special invocations' },
    { name: 'Hadra', route: '/hadra', icon: Moon, description: 'Spiritual sessions' },
    { name: 'Names', route: '/names', icon: Sparkles, description: 'Divine names' },
    { name: 'Library', route: '/library', icon: BookOpen, description: 'Resources' },
    { name: 'Bibliothèque', route: '/library-screen', icon: BookOpen, description: 'Ressources' },
    { name: 'Statistics', route: '/stats', icon: BarChart3, description: 'Your progress' },
    { name: 'Settings', route: '/settings', icon: SettingsIcon, description: 'Configuration' },
    { name: 'About', route: '/about', icon: Info, description: 'Information' },
  ], []);

  // Animations optimisées avec useCallback
  const openDrawer = useCallback(() => {
    setDrawerVisible(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerVisible(false);
  }, []);

  // PanResponder optimisé avec useCallback
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dx > 10 && Math.abs(gestureState.dy) < 80;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0 && gestureState.dx < 300) {
          slideAnim.setValue(-300 + gestureState.dx);
          fadeAnim.setValue(gestureState.dx / 300);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 150) {
          openDrawer();
        } else {
          Animated.parallel([
            Animated.spring(slideAnim, {
              toValue: -300,
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

  // Effet pour les animations d'ouverture/fermeture
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
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: -300,
          useNativeDriver: true,
          damping: 22,
          stiffness: 200,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [drawerVisible, slideAnim, fadeAnim]);

  // Navigation optimisée
  const handleNavigation = useCallback((route: string) => {
    closeDrawer();
    // Utiliser requestAnimationFrame pour une meilleure performance
    requestAnimationFrame(() => {
      setTimeout(() => {
        router.push(route as any);
      }, 250);
    });
  }, [router, closeDrawer]);

  // Vérification de la route active
  const isCurrentRoute = useCallback((route: string) => {
    return pathname === route;
  }, [pathname]);

  // Obtenir le nom de l'onglet actuel
  const getTabName = useCallback(() => {
    const currentItem = menuItems.find(item => item.route === pathname);
    return currentItem?.name || 'Home';
  }, [pathname, menuItems]);

  // Composant MenuItem optimisé
  const MenuItem = useCallback(({ item, index }: { item: MenuItem; index: number }) => {
    const IconComponent = item.icon;
    const isActive = isCurrentRoute(item.route);
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.menuItem,
          isActive && styles.menuItemActive
        ]}
        onPress={() => handleNavigation(item.route)}
        activeOpacity={0.7}
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
          <Text style={[
            styles.menuItemText,
            isActive && styles.menuItemTextActive
          ]}>
            {item.name}
          </Text>
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
    );
  }, [handleNavigation, isCurrentRoute]);

  // Composant TabIcon optimisé
  const TabIcon = useCallback(({ IconComponent, color, focused, name }: any) => (
    <View style={[
      styles.tabIconContainer,
      focused && styles.tabIconContainerActive
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
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header amélioré */}
      <SpiritualHeader 
        onMenuPress={openDrawer} 
        currentPage={getTabName()} 
      />

      {/* Zone de swipe pour ouvrir le drawer */}
      {!drawerVisible && (
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
              >
                <X color="#FFFFFF" size={24} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Liste des pages */}
            <ScrollView 
              style={styles.menuList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.menuListContent}
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
          name="library-screen"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon IconComponent={BookOpen} color={color} focused={focused} />
            ),
          }}
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
    width: 30,
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
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuItemTextActive: {
    color: '#059669',
    fontWeight: '700',
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#6B7280',
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
    backgroundColor: '#E5E7EB',
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
    paddingBottom: 8,
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
  },
  tabIconContainerActive: {
    transform: [{ scale: 1.15 }],
  },
});