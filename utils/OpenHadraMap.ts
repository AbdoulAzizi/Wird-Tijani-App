import { Platform, Linking } from "react-native";
import Toast from 'react-native-toast-message';

// ⚠️ Replace with the real Hadra Map info
const HADRA_MAP_PACKAGE = "com.example.hadaramap_app_mobile";
const HADRA_MAP_PLAYSTORE_URL = `https://play.google.com/store/apps/details?id=${HADRA_MAP_PACKAGE}`;
const HADRA_MAP_SCHEME = "hadramap://"; // iOS scheme defined in Hadra Map
const HADRA_MAP_APPSTORE_URL = "https://apps.apple.com/app/id1234567890"; // iOS App Store ID

export async function openHadraMap() {
  try {
    if (Platform.OS === "android") {
      const appUrl = `intent://${HADRA_MAP_PACKAGE}#Intent;scheme=package;end`;
      const supported = await Linking.canOpenURL(appUrl);
      
      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        Toast.show({
          type: 'info',
          text1: 'Hadra Map is not installed',
          text2: 'Tap here to install it from the Play Store',
          onPress: () => Linking.openURL(HADRA_MAP_PLAYSTORE_URL),
          visibilityTime: 5000,
        });
      }
    } else if (Platform.OS === "ios") {
      const supported = await Linking.canOpenURL(HADRA_MAP_SCHEME);
      
      if (supported) {
        await Linking.openURL(HADRA_MAP_SCHEME);
      } else {
        Toast.show({
          type: 'info',
          text1: 'Hadra Map is not installed',
          text2: 'Tap here to download it from the App Store',
          onPress: () => Linking.openURL(HADRA_MAP_APPSTORE_URL),
          visibilityTime: 5000,
        });
      }
    }
  } catch (error) {
    console.error("openHadraMap error:", error);
    Toast.show({
      type: 'error',
      text1: 'Something went wrong',
      text2: 'Could not open Hadra Map. Please try again.',
      visibilityTime: 3000,
    });
  }
}
