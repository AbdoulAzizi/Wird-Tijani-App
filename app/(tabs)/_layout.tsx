import { Tabs } from 'expo-router';
import { Heart, BookOpen, ChartBar as BarChart3, Settings as SettingsIcon, Star, Moon, Home, Info } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#059669',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            paddingBottom: 5,
            paddingTop: 5,
            height: 65,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size} fill={color === '#059669' ? color : 'none'} />
            ),
          }}
        />
        <Tabs.Screen
          name="wird"
          options={{
            href: null, // masqué
          }}
        />
        <Tabs.Screen
          name="wazifa"
          options={{
            href: null, // masqué
          }}
        />
        <Tabs.Screen
          name="hadra"
          options={{
            href: null, // masqué
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, size }) => (
              <BookOpen color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ color, size }) => (
              <BarChart3 color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <SettingsIcon color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: 'About',
            tabBarIcon: ({ color, size }) => (
              <Info color={color} size={size} />
            ),
          }}
        />  
      </Tabs>
    </SafeAreaView>
  );
}
