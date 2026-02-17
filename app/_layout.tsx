import { useEffect, useState, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Amiri_400Regular } from '@expo-google-fonts/amiri';
import * as SplashScreen from 'expo-splash-screen';
import { Animated, View, StyleSheet, Image } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/contexts/AppContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import {HeaderActionsProvider} from '@/contexts/HeaderActionsContext';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({ Amiri_400Regular });
  const [appReady, setAppReady] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (fontsLoaded || fontError) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start(() => {
        setTimeout(async () => {
          await SplashScreen.hideAsync();
          setAppReady(true);

          // 🔔 Toast de bienvenue avec react-native-toast-message
          Toast.show({
            type: 'success',
            text1: 'Welcome !',
            text2: 'Peace be upon you 🌟',
            visibilityTime: 3000,
          });
        }, 800);
      });
    }
  }, [fontsLoaded, fontError]);

  if (!appReady) {
    return (
      <View style={styles.splashContainer}>
        <Animated.Image
          source={require('@/assets/images/icon.png')}
          style={[styles.logo, { opacity, transform: [{ scale }] }]}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <HeaderActionsProvider>
    <NotificationProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        
        {/* 🔔 Toast component - OBLIGATOIRE à la racine */}
        <Toast />
      </AppProvider>
    </NotificationProvider>
    </HeaderActionsProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  logo: { width: 160, height: 160 },
});