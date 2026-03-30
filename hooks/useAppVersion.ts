import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * useAppVersion
 *
 * Centralise toutes les infos utiles de l'application
 * issues de app.json / package.json via expo-constants.
 *
 * Usage:
 *   const { appVersion, buildNumber, appName, ... } = useAppVersion();
 */

export interface AppVersionInfo {
  /** Nom affiché de l'app  — "Wird Tijani" */
  appName: string;
  /** Slug expo                — "wird-tijani" */
  slug: string;
  /** Version publique        — "1.0.2" */
  appVersion: string;
  /** Build natif (iOS buildNumber / Android versionCode) */
  buildNumber: string;
  /** Version formatée lisible — "v1.0.2 (3)" */
  fullVersion: string;
  /** Bundle ID / package name — "com.wirdtijani.app" */
  bundleId: string;
  /** Couleur primaire définie dans app.json */
  primaryColor: string;
  /** Scheme de deep-link      — "wirdtijani" */
  scheme: string;
  /** Plateforme courante      — "ios" | "android" | "web" */
  platform: 'ios' | 'android' | 'web';
  /** EAS project ID */
  easProjectId: string;
  /** OTA update URL */
  updatesUrl: string;
  /** Owner du projet Expo     — "abdoul-aziz" */
  owner: string;
}

export function useAppVersion(): AppVersionInfo {
  const expoConfig = Constants.expoConfig ?? Constants.manifest ?? {};

  const appName    = (expoConfig as any).name    ?? 'Wird Tijāni';
  const slug       = (expoConfig as any).slug    ?? 'wird-tijani';
  const appVersion = (expoConfig as any).version ?? '1.0.0';
  const scheme     = (expoConfig as any).scheme  ?? 'wirdtijani';
  const primaryColor = (expoConfig as any).primaryColor ?? '#059669';
  const owner      = (expoConfig as any).owner   ?? 'abdoul-aziz';

  const easProjectId = (expoConfig as any).extra?.eas?.projectId ?? '';
  const updatesUrl   = (expoConfig as any).updates?.url ?? '';

  // Build number : iOS → buildNumber, Android → versionCode (as string)
  const iosBuild     = (expoConfig as any).ios?.buildNumber     ?? '';
  const androidBuild = (expoConfig as any).android?.versionCode ?? '';
  const buildNumber  = Platform.select({
    ios:     String(iosBuild),
    android: String(androidBuild),
    default: '',
  });

  // Bundle ID / package
  const bundleId = Platform.select({
    ios:     (expoConfig as any).ios?.bundleIdentifier ?? '',
    android: (expoConfig as any).android?.package ?? '',
    default: '',
  });

  // Version lisible : "v1.0.2 (3)" — build omis si vide
  const fullVersion = buildNumber
    ? `v${appVersion} (${buildNumber})`
    : `v${appVersion}`;

  const platform = Platform.select<'ios' | 'android' | 'web'>({
    ios:     'ios',
    android: 'android',
    default: 'web',
  });

  return {
    appName,
    slug,
    appVersion,
    buildNumber,
    fullVersion,
    bundleId,
    primaryColor,
    scheme,
    platform,
    easProjectId,
    updatesUrl,
    owner,
  };
}