// ==========================================
// 🔔 NOTIFICATIONS LOADER (SHARED UTILITY)
// ==========================================
// utils/notifications.loader.ts

import * as Device from 'expo-device';
import * as NotificationsType from 'expo-notifications';
import { Platform } from 'react-native';

// ──────────────────────────────────────────────────────────────────────────────
// FLAG DE FORÇAGE
// Permet de réactiver expo-notifications même en Expo Go / __DEV__.
// Modifiable via setForceNotificationsEnabled() — typiquement depuis un écran
// de debug ou de settings.
// ──────────────────────────────────────────────────────────────────────────────

let _forceEnabled = false;

/**
 * Active ou désactive le forçage d'expo-notifications dans les environnements
 * non supportés (Expo Go, __DEV__, simulateur Android).
 * Vide automatiquement le cache interne pour forcer un rechargement.
 */
export const setForceNotificationsEnabled = (value: boolean): void => {
  _forceEnabled = value;
  _cachedModule = undefined; // invalide le cache → prochain appel recharge
  console.log(
    value
      ? '🔔 expo-notifications : forçage activé (Expo Go / __DEV__)'
      : '🔕 expo-notifications : forçage désactivé'
  );
};

export const isForceEnabled = (): boolean => _forceEnabled;

// ──────────────────────────────────────────────────────────────────────────────
// DÉTECTION D'ENVIRONNEMENT
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Détecte si l'app tourne dans Expo Go ou en mode __DEV__.
 * Retourne false si le forçage est actif.
 */
export const isExpoGo = (): boolean =>
  !_forceEnabled && (!Device.isDevice || __DEV__);

// ──────────────────────────────────────────────────────────────────────────────
// CACHE INTERNE
// Évite de réimporter le module à chaque appel.
// undefined = pas encore chargé, null = chargé mais non disponible.
// ──────────────────────────────────────────────────────────────────────────────

let _cachedModule: typeof NotificationsType | null | undefined = undefined;

/**
 * Charge dynamiquement expo-notifications (avec cache).
 *
 * - Retourne null + warning si l'environnement n'est pas supporté
 *   ET que le forçage n'est pas actif.
 * - Retourne le module complet sinon.
 * - Met le résultat en cache pour tous les appelants suivants.
 *
 * Utilisé par usePushNotifications, NotificationContext et ReminderService.
 */
export const loadNotificationsModule = async (): Promise<typeof NotificationsType | null> => {
  // Retourner le cache si disponible (undefined = pas encore chargé)
  if (_cachedModule !== undefined) return _cachedModule;

  if (isExpoGo() && Platform.OS === 'android') {
    console.warn("ℹ️ expo-notifications non disponible ou erreur d'importation.");
    _cachedModule = null;
    return null;
  }

  try {
    const module  = await import('expo-notifications');
    _cachedModule = module as typeof NotificationsType;
    return _cachedModule;
  } catch {
    console.warn("ℹ️ expo-notifications non disponible ou erreur d'importation.");
    _cachedModule = null;
    return null;
  }
};