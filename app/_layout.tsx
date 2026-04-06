// app/_layout.tsx — Wird Tijani
//
// InstallPromptModal is mounted here at the root so it can render
// above any screen when openRawdatDhikr() triggers it.

import { useEffect, useState, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Amiri_400Regular } from '@expo-google-fonts/amiri';
import * as SplashScreen from 'expo-splash-screen';
import { Animated, View, StyleSheet } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/contexts/AppContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import Toast from 'react-native-toast-message';

// Import the modal — it registers itself as the global listener on mount
import { InstallPromptModal } from '@/utils/OpenRawdatDhikr';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({ Amiri_400Regular });
  const [appReady, setAppReady] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (fontsLoaded || fontError) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.spring(scale,   { toValue: 1, friction: 4,    useNativeDriver: true }),
      ]).start(() => {
        setTimeout(async () => {
          await SplashScreen.hideAsync();
          setAppReady(true);

          Toast.show({
            type:           'success',
            text1:          'Welcome!',
            text2:          'Peace be upon you 🌟',
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
    <NotificationProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)"     options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />

        {/*
          InstallPromptModal is mounted here at root level so it renders
          above all screens. It stays invisible (visible=false internally)
          until openRawdatDhikr() detects the app is not installed and
          calls the global trigger.
        */}
        <InstallPromptModal />

        <Toast />
      </AppProvider>
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 160, height: 160 },
});