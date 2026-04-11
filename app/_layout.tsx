// app/_layout.tsx — Wird Tijāni
//
// Both install-prompt modals are mounted here at root level so they can
// render above any screen when triggered by openRawdatDhikr() or openHadraMap().

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

import { InstallPromptModal } from '@/utils/OpenRawdatDhikr';
import { HadraMapInstallModal } from '@/utils/OpenHadraMap';

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

        {/* Rawdat Dhikr install modal — triggered by openRawdatDhikr() */}
        <InstallPromptModal />

        {/* Hadara Map install modal — triggered by openHadraMap() */}
        <HadraMapInstallModal />

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