// utils/OpenRawdatDhikr.ts — Wird Tijani
//
// ── Correction des deep links ────────────────────────────────────────────────
//
// PROBLÈME : les chemins contenaient le préfixe "(tabs)/" avec des parenthèses.
// Les parenthèses sont des caractères réservés dans les URLs (RFC 3986).
// Selon le système, le lien "rawdatdhikr://(tabs)/dhikr-counter" pouvait être :
//   • rejeté silencieusement par Android/iOS
//   • ouvert mais la navigation vers la cible échouait
//   • ouvert sur l'accueil sans redirection vers l'écran cible
//
// SOLUTION : Expo Router résout automatiquement les groupes de routes "(tabs)".
// Le bon format est simplement "rawdatdhikr://dhikr-counter" — sans préfixe.
// Expo Router mappe "dhikr-counter" → "app/(tabs)/dhikr-counter.tsx" tout seul.
//
// Format correct des deep links Expo Router avec un scheme custom :
//   rawdatdhikr://             → app/(tabs)/index.tsx
//   rawdatdhikr://dhikr-counter → app/(tabs)/dhikr-counter.tsx
//   rawdatdhikr://asmaa-alhusna → app/(tabs)/asmaa-alhusna.tsx

import { Platform, Linking } from 'react-native';
import Toast from 'react-native-toast-message';

// ─── App identifiers ──────────────────────────────────────────────────────────
const RD_PACKAGE       = 'com.rawdatdhikr.app';
const RD_SCHEME        = 'rawdatdhikr://';
const RD_PLAYSTORE_URL = `https://play.google.com/store/apps/details?id=${RD_PACKAGE}`;
const RD_APPSTORE_URL  = 'https://apps.apple.com/app/rawdat-dhikr/id0000000000'; // ← replace with real ID

// ─── Screen map ───────────────────────────────────────────────────────────────
// Pas de préfixe "(tabs)/" — Expo Router le résout automatiquement.
// Le segment doit correspondre exactement au nom du fichier dans app/(tabs)/.
const SCREEN_PATHS: Record<string, string> = {
  'dhikr-counter': 'dhikr-counter',
  'azkars':        'azkars',
  'asmaa-alhusna': 'asmaa-alhusna',
  'asmaa-nabi':    'asmaa-nabi',
  'suwar':         'suwar',
  'hadra-station': 'hadra-station',
};

// ─── Main function ────────────────────────────────────────────────────────────
/**
 * Ouvre Rawdat Dhikr, optionnellement sur un écran précis.
 *
 * @param screen  Clé d'écran optionnelle (voir SCREEN_PATHS ci-dessus).
 *                Si omise, ouvre l'accueil de Rawdat Dhikr.
 *
 * @example
 *   openRawdatDhikr();                  // → rawdatdhikr://
 *   openRawdatDhikr('dhikr-counter');   // → rawdatdhikr://dhikr-counter
 *   openRawdatDhikr('asmaa-alhusna');   // → rawdatdhikr://asmaa-alhusna
 */
export async function openRawdatDhikr(screen?: string) {
  const path     = screen ? (SCREEN_PATHS[screen] ?? '') : '';
  const deepLink = path ? `${RD_SCHEME}${path}` : RD_SCHEME;

  try {
    if (Platform.OS === 'android') {
      // Délai minimal pour laisser le JS bridge de Wird Tijani flush ses
      // événements en cours avant que l'app passe en background.
      await new Promise(r => setTimeout(r, 100));

      const canOpen = await Linking.canOpenURL(deepLink);
      if (canOpen) {
        await Linking.openURL(deepLink);
        return;
      }

      // App non installée → Play Store
      _showInstallToast('Play Store', RD_PLAYSTORE_URL);

    } else if (Platform.OS === 'ios') {
      const canOpen = await Linking.canOpenURL(deepLink);
      if (canOpen) {
        await Linking.openURL(deepLink);
      } else {
        _showInstallToast('App Store', RD_APPSTORE_URL);
      }
    }
  } catch (error) {
    console.error('[OpenRawdatDhikr] error:', error);
    Toast.show({
      type:           'error',
      text1:          'Erreur',
      text2:          "Impossible d'ouvrir Rawdat Dhikr",
      visibilityTime: 3000,
    });
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function _showInstallToast(store: string, url: string) {
  Toast.show({
    type:           'info',
    text1:          "Rawdat Dhikr n'est pas installée",
    text2:          `Touchez ici pour l'installer depuis ${store}`,
    onPress:        () => Linking.openURL(url),
    visibilityTime: 6000,
  });
}