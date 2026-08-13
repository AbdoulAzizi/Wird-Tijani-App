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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/contexts/AppContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import Toast from 'react-native-toast-message';

import { InstallPromptModal } from '@/utils/OpenRawdatDhikr';
import { HadraMapInstallModal } from '@/utils/OpenHadraMap';

// preventAutoHideAsync peut rejeter si le splash est déjà masqué : on absorbe.
SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ fade: true, duration: 400 });

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({ Amiri_400Regular });
  const [appReady, setAppReady] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;

    let cancelled = false;

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale,   { toValue: 1, friction: 5,   useNativeDriver: true }),
    ]).start(async () => {
      if (cancelled) return;
      await SplashScreen.hideAsync().catch(() => {});
      setAppReady(true);
      Toast.show({
        type:           'success',
        text1:          'Bienvenue',
        text2:          'As-salāmu ʿalaykum 🌟',
        visibilityTime: 3000,
      });
    });

    return () => { cancelled = true; };
  }, [fontsLoaded, fontError]);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />

      {!appReady ? (
        <View style={styles.splashContainer}>
          <Animated.Image
            source={require('@/assets/images/icon.png')}
            style={[styles.logo, { opacity, transform: [{ scale }] }]}
            resizeMode="contain"
          />
        </View>
      ) : (
        <NotificationProvider>
          <AppProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)"     options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>

            {/* Rawdat Dhikr install modal — triggered by openRawdatDhikr() */}
            <InstallPromptModal />

            {/* Hadara Map install modal — triggered by openHadraMap() */}
            <HadraMapInstallModal />

            <Toast />
          </AppProvider>
        </NotificationProvider>
      )}
    </SafeAreaProvider>
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