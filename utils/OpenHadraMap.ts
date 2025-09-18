import { Platform, Linking } from "react-native";
import Toast from "react-native-toast-message";
import * as IntentLauncher from "expo-intent-launcher";

// Infos HadraMap
const HADRA_MAP_PACKAGE = "com.hadaramap.mobile";
const HADRA_MAP_MAIN_ACTIVITY = "com.hadaramap.mobile.MainActivity";
const HADRA_MAP_PLAYSTORE_URL = `https://play.google.com/store/apps/details?id=${HADRA_MAP_PACKAGE}`;
const HADRA_MAP_APPSTORE_URL = "https://apps.apple.com/app/id1234567890"; // remplace par ton ID App Store
const HADRA_MAP_SCHEME = "hadramap://"; // deep link à configurer plus tard dans HadraMap

export async function openHadraMap() {
  try {
    if (Platform.OS === "android") {
      // 1️⃣ Essayer via deep link (si défini)
      const canOpenScheme = await Linking.canOpenURL(HADRA_MAP_SCHEME);
      if (canOpenScheme) {
        await Linking.openURL(HADRA_MAP_SCHEME);
        return;
      }

      // 2️⃣ Essayer via MainActivity
      try {
        await IntentLauncher.startActivityAsync("android.intent.action.MAIN", {
          packageName: HADRA_MAP_PACKAGE,
          className: HADRA_MAP_MAIN_ACTIVITY,
        });
        return;
      } catch (err) {
        console.warn("MainActivity not found:", err);
      }

      // 3️⃣ Fallback → Play Store
      Toast.show({
        type: "info",
        text1: "Hadra Map n'est pas installée",
        text2: "Touchez ici pour l’installer depuis Play Store",
        onPress: () => Linking.openURL(HADRA_MAP_PLAYSTORE_URL),
        visibilityTime: 5000,
      });

    } else if (Platform.OS === "ios") {
      // iOS : essaie scheme d'abord
      const supported = await Linking.canOpenURL(HADRA_MAP_SCHEME);
      if (supported) {
        await Linking.openURL(HADRA_MAP_SCHEME);
      } else {
        // Fallback → App Store
        Linking.openURL(HADRA_MAP_APPSTORE_URL);
      }
    }
  } catch (error) {
    console.error("openHadraMap error:", error);
    Toast.show({
      type: "error",
      text1: "Erreur",
      text2: "Impossible d’ouvrir Hadra Map",
      visibilityTime: 3000,
    });
  }
}
