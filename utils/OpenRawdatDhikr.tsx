// utils/OpenRawdatDhikr.ts
// Cross-app deep-link utility for Rawdat Dhikr.
// Pattern mirrors OpenHadraMap.ts.
//
// Deep link format:  rawdatdhikr://screen/<screenName>
// e.g.              rawdatdhikr://screen/dhikr-counter
//                   rawdatdhikr://screen/azkars?period=morning
//
// If Rawdat Dhikr is not installed, a toast guides the user to the store.

import { Platform, Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import * as IntentLauncher from 'expo-intent-launcher';

// ─── App identifiers ──────────────────────────────────────────────────────────
const RD_PACKAGE        = 'com.rawdatdhikr.app';
const RD_MAIN_ACTIVITY  = 'com.rawdatdhikr.app.MainActivity';
const RD_SCHEME         = 'rawdatdhikr://';
const RD_PLAYSTORE_URL  = `https://play.google.com/store/apps/details?id=${RD_PACKAGE}`;
const RD_APPSTORE_URL   = 'https://apps.apple.com/app/rawdat-dhikr/id0000000000'; // ← replace with real App Store ID

// ─── Screen map ───────────────────────────────────────────────────────────────
// Maps internal screen keys to Rawdat Dhikr's deep-link paths.
const SCREEN_PATHS: Record<string, string> = {
  'dhikr-counter': 'screen/dhikr-counter',
  'azkars':        'screen/azkars',
  'asmaa-alhusna': 'screen/asmaa-alhusna',
  'asmaa-nabi':    'screen/asmaa-nabi',
  'suwar':         'screen/suwar',
  'hadra-station': 'screen/hadra-station',
};

// ─── Main function ────────────────────────────────────────────────────────────
/**
 * Opens Rawdat Dhikr, optionally at a specific screen.
 *
 * @param screen  Optional screen key (see SCREEN_PATHS above).
 *                If omitted, opens the app at its home screen.
 *
 * @example
 *   openRawdatDhikr();                   // open home
 *   openRawdatDhikr('dhikr-counter');    // open Dhikr Counter screen
 *   openRawdatDhikr('azkars');           // open Daily Adhkaar screen
 */
export async function openRawdatDhikr(screen?: string) {
  const path       = screen ? SCREEN_PATHS[screen] ?? '' : '';
  const deepLink   = path ? `${RD_SCHEME}${path}` : RD_SCHEME;
  const schemeBase = RD_SCHEME;

  try {
    if (Platform.OS === 'android') {
      // 1️⃣ Try deep link (scheme must be declared in Rawdat Dhikr's AndroidManifest)
      const canOpenDeepLink = await Linking.canOpenURL(deepLink);
      if (canOpenDeepLink) {
        await Linking.openURL(deepLink);
        return;
      }

      // 2️⃣ Try base scheme (app installed but deep-link path not registered yet)
      const canOpenScheme = await Linking.canOpenURL(schemeBase);
      if (canOpenScheme) {
        await Linking.openURL(schemeBase);
        return;
      }

      // 3️⃣ Try MainActivity intent
      try {
        await IntentLauncher.startActivityAsync('android.intent.action.MAIN', {
          packageName: RD_PACKAGE,
          className:   RD_MAIN_ACTIVITY,
        });
        return;
      } catch (intentErr) {
        console.warn('[OpenRawdatDhikr] MainActivity intent failed:', intentErr);
      }

      // 4️⃣ Not installed → Play Store
      _showInstallToast('Play Store', RD_PLAYSTORE_URL);

    } else if (Platform.OS === 'ios') {
      const supported = await Linking.canOpenURL(deepLink);
      if (supported) {
        await Linking.openURL(deepLink);
      } else {
        // App not installed → App Store
        _showInstallToast('App Store', RD_APPSTORE_URL);
      }
    }
  } catch (error) {
    console.error('[OpenRawdatDhikr] error:', error);
    Toast.show({
      type:            'error',
      text1:           'Erreur',
      text2:           'Impossible d\'ouvrir Rawdat Dhikr',
      visibilityTime:  3000,
    });
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function _showInstallToast(store: string, url: string) {
  Toast.show({
    type:            'info',
    text1:           'Rawdat Dhikr n\'est pas installée',
    text2:           `Touchez ici pour l'installer depuis ${store}`,
    onPress:         () => Linking.openURL(url),
    visibilityTime:  6000,
  });
}