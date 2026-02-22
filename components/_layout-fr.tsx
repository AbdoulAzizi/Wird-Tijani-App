import { Tabs, useRouter, usePathname } from 'expo-router';
import { Heart, HomeIcon,BookOpen, ChartBar as BarChart3, Settings as SettingsIcon, Star, Moon, Home, Info, Menu, X, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView, Pressable, PanResponder } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import SpiritualHeader from '@/components/SpiritualHeader';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function TabLayout() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Accueil', route: '/', icon: Home, description: 'Page principale' },
    { name: 'Wird', route: '/wird', icon: BookOpen, description: 'Prières quotidiennes' },
    { name: 'Wazifa', route: '/wazifa', icon: Star, description: 'Invocations spéciales' },
    { name: 'Hadra', route: '/hadra', icon: Heart, description: 'Séances spirituelles' },
    { name: 'Les Noms', route: '/asmaa-alhusna', icon: Moon, description: 'Noms divins' },
    { name: 'Bibliothèque', route: '/library', icon: BookOpen, description: 'Ressources' },
    { name: 'Statistiques', route: '/stats', icon: BarChart3, description: 'Vos progrès' },
    { name: 'Paramètres', route: '/settings', icon: SettingsIcon, description: 'Configuration' },
    { name: 'À propos', route: '/about', icon: Info, description: 'Informations' },
  ];

  // PanResponder pour le geste de swipe
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Détecter le swipe de gauche vers droite
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
          setDrawerVisible(true);
        } else {
          Animated.parallel([
            Animated.timing(slideAnim, {
              toValue: -300,
              duration: 200,
              useNativeDriver: true,
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

  useEffect(() => {
    if (drawerVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [drawerVisible]);

  const handleNavigation = (route: string) => {
    setDrawerVisible(false);
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const isCurrentRoute = (route: string) => {
    return pathname === route;
  };

  const getTabName = () => {
    const currentItem = menuItems.find(item => item.route === pathname);
    return currentItem?.name || 'Home';
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header avec Menu Burger */}
      {/* <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDrawerVisible(true)}
          activeOpacity={0.7}
        >
          <Menu color="#059669" size={26} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Spiritual App</Text>
          <Text style={styles.headerSubtitle}>{getTabName()}</Text>
        </View>
        <View style={styles.menuButton} />
      </View> */}
      <SpiritualHeader 
        onMenuPress={() => setDrawerVisible(true)}
        currentPage={getTabName()}
      />
      {/* Zone de swipe pour ouvrir le drawer */}
      {!drawerVisible && (
        <View 
          style={styles.swipeArea}
          {...panResponder.panHandlers}
        />
      )}

      {/* Drawer Menu */}
      {drawerVisible && (
        <View style={styles.drawerOverlay}>
          <Pressable 
            style={styles.backdrop} 
            onPress={() => setDrawerVisible(false)}
          >
            <Animated.View style={[styles.backdropFade, { opacity: fadeAnim }]} />
          </Pressable>

          <Animated.View 
            style={[
              styles.drawerContainer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            {/* Header du Drawer avec gradient */}
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerTitle}>Menu</Text>
                <Text style={styles.drawerSubtitle}>Navigation</Text>
              </View>
              <TouchableOpacity
                onPress={() => setDrawerVisible(false)}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <X color="#FFFFFF" size={24} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Liste des pages avec scroll */}
            <ScrollView 
              style={styles.menuList}
              showsVerticalScrollIndicator={false}
            >
              {menuItems.map((item, index) => {
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
              })}
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

      {/* Tabs Navigation Améliorée */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#059669',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            marginTop: 4,
            letterSpacing: 0.3,
          },
          tabBarItemStyle: {
            paddingVertical: 6,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <View style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive
              ]}>
                <Ionicons 
                  name="home" 
                  color={color} 
                  size={24} 
                  strokeWidth={focused ? 2.5 : 2}
                  fill={focused ? color : 'none'} 
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="wird"
          options={{
            title: 'Wird',
            tabBarIcon: ({ color, focused }) => (
              <View style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive
              ]}>
                <Heart 
                  color={color} 
                  size={24}
                  strokeWidth={focused ? 2.5 : 2}
                />
              </View>
            ),
          }}
          // options={{
          //   href: null,
          // }}
        />
        <Tabs.Screen
          name="wazifa"
          // options={{
          //   href: null,
          // }}
          options={{
            title: 'Wazifa',
            tabBarIcon: ({ color, focused }) => (
              <View style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive
              ]}>
                <Star 
                  color={color} 
                  size={24}
                  strokeWidth={focused ? 2.5 : 2}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="hadra"
          // options={{
          //   href: null,
          // }}
          options={{
            title: 'Hadra',
            tabBarIcon: ({ color, focused }) => (
              <View style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive
              ]}>
                <Moon 
                  color={color} 
                  size={24}
                  strokeWidth={focused ? 2.5 : 2}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="names"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, focused }) => (
              <View style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive
              ]}>
                <BookOpen 
                  color={color} 
                  size={24}
                  strokeWidth={focused ? 2.5 : 2}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          // options={{
          //   title: 'Stats',
          //   tabBarIcon: ({ color, focused }) => (
          //     <View style={[
          //       styles.tabIconContainer,
          //       focused && styles.tabIconContainerActive
          //     ]}>
          //       <BarChart3 
          //         color={color} 
          //         size={24}
          //         strokeWidth={focused ? 2.5 : 2}
          //       />
          //     </View>
          //   ),
          // }}
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="settings"
          // options={{
          //   title: 'Settings',
          //   tabBarIcon: ({ color, focused }) => (
          //     <View style={[
          //       styles.tabIconContainer,
          //       focused && styles.tabIconContainerActive
          //     ]}>
          //       <SettingsIcon 
          //         color={color} 
          //         size={24}
          //         strokeWidth={focused ? 2.5 : 2}
          //       />
          //     </View>
          //   ),
          // }}
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: 'About',
            tabBarIcon: ({ color, focused }) => (
              <View style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive
              ]}>
                <Info 
                  color={color} 
                  size={24}
                  strokeWidth={focused ? 2.5 : 2}
                />
              </View>
            ),
          }}
          // options={{
          //   href: null,
          // }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    width: 42,
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
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#059669',
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
    paddingTop: 8,
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
  tabIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
  },
  tabIconContainerActive: {
    transform: [{ scale: 1.1 }],
  },
});