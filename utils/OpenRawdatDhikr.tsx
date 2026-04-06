// utils/OpenRawdatDhikr.ts — Wird Tijani
//
// ── Correction "toujours redirige vers Play Store" ───────────────────────────
//
// CAUSE : Android 11+ (API 30+) applique le "Package Visibility" (PV).
// Linking.canOpenURL('rawdatdhikr://...') retourne TOUJOURS false pour un
// scheme custom d'une autre app, sauf si ce scheme est déclaré dans la
// section <queries> de l'AndroidManifest de l'app appelante (Wird Tijani).
//
// Deux corrections nécessaires :
//
//  1. Ne plus conditionner l'ouverture sur canOpenURL().
//     On appelle directement Linking.openURL() dans un try/catch.
//     Si l'app est installée → elle s'ouvre.
//     Si elle n'est pas installée → openURL lance une exception → toast Play Store.
//
//  2. Déclarer le scheme dans app.json de Wird Tijani (voir commentaire
//     APP_JSON_PATCH ci-dessous).
//
// Sur iOS, même logique — canOpenURL retourne false si le scheme n'est pas
// dans LSApplicationQueriesSchemes du Info.plist de Wird Tijani.

import { Platform, Linking } from 'react-native';
import Toast from 'react-native-toast-message';

// ─── App identifiers ──────────────────────────────────────────────────────────
const RD_PACKAGE       = 'com.rawdatdhikr.app';
const RD_SCHEME        = 'rawdatdhikr://';
const RD_PLAYSTORE_URL = `https://play.google.com/store/apps/details?id=${RD_PACKAGE}`;
const RD_APPSTORE_URL  = 'https://apps.apple.com/app/rawdat-dhikr/id0000000000'; // ← replace with real ID

// ─── Screen map ───────────────────────────────────────────────────────────────
// Pas de préfixe "(tabs)/" — Expo Router résout les groupes automatiquement.
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

  // Petit délai pour laisser le JS bridge flush l'événement touch en cours
  // (animation du bouton pressé) avant que Wird Tijani passe en background.
  await new Promise(r => setTimeout(r, 100));

  try {
    // On tente directement openURL() sans passer par canOpenURL().
    // canOpenURL() retourne false sur Android 11+ pour les schemes custom
    // non déclarés dans <queries>, même quand l'app est bien installée.
    await Linking.openURL(deepLink);

  } catch {
    // openURL a lancé une exception → l'app n'est pas installée (ou le
    // scheme n'est pas reconnu). On guide l'utilisateur vers le store.
    if (Platform.OS === 'android') {
      _showInstallToast('Play Store', RD_PLAYSTORE_URL);
    } else {
      _showInstallToast('App Store', RD_APPSTORE_URL);
    }
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

/*
──────────────────────────────────────────────────────────────────────────────
APP_JSON_PATCH — à ajouter dans app.json de Wird Tijani
──────────────────────────────────────────────────────────────────────────────

Sans cette déclaration, canOpenURL() ET openURL() peuvent échouer silencieusement
sur Android 11+ même avec l'app installée. Avec la correction try/catch ci-dessus
openURL() fonctionne déjà, mais déclarer le scheme est recommandé pour la
compatibilité complète.

Dans "android" → ajouter "intentFilters" de type QUERY (pas VIEW) :

"android": {
  ...
  "intentFilters": [
    {
      "action": "VIEW",
      "data": [{ "scheme": "rawdatdhikr" }],
      "category": ["BROWSABLE", "DEFAULT"]
    }
  ]
}

OU via expo-build-properties, ajouter dans le AndroidManifest via
config plugin un bloc <queries> :

  <queries>
    <intent>
      <action android:name="android.intent.action.VIEW" />
      <data android:scheme="rawdatdhikr" />
    </intent>
  </queries>

Pour iOS — dans "ios" → "infoPlist" :

"ios": {
  ...
  "infoPlist": {
    "LSApplicationQueriesSchemes": ["rawdatdhikr"]
  }
}
──────────────────────────────────────────────────────────────────────────────
*/