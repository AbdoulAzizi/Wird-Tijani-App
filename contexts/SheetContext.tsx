// contexts/SheetContext.tsx
//
// Source de vérité unique pour l'état des sheets de navigation.
// N'importe quel composant peut lire ou piloter les sheets sans prop drilling.

import {
  createContext, useContext, useState, useCallback, useMemo,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// ─── Types ────────────────────────────────────────────────────────────────────
type SheetId = 'menu' | 'wird' | null;

interface SheetContextValue {
  /** Sheet actuellement ouverte (null = aucune) */
  activeSheet:  SheetId;
  /** Ouvre un sheet — ferme automatiquement l'autre */
  openSheet:    (id: SheetId) => void;
  /** Ferme le sheet en cours */
  closeSheet:   () => void;
  /** Toggle : ouvre si fermé, ferme si déjà ouvert */
  toggleSheet:  (id: Exclude<SheetId, null>) => void;
  /** Ferme tout (appelé sur tabPress standard) */
  closeAll:     () => void;
  // Raccourcis booléens pour les consommateurs
  menuOpen:     boolean;
  wirdOpen:     boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const SheetContext = createContext<SheetContextValue | null>(null);

export function useSheets(): SheetContextValue {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error('useSheets must be used inside <SheetProvider>');
  return ctx;
}

// ─── Haptic interne ───────────────────────────────────────────────────────────
function haptic(type: 'light' | 'medium') {
  if (Platform.OS !== 'ios') return;
  Haptics.impactAsync(
    type === 'medium'
      ? Haptics.ImpactFeedbackStyle.Medium
      : Haptics.ImpactFeedbackStyle.Light,
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function SheetProvider({ children }: { children: ReactNode }) {
  const [activeSheet, setActiveSheet] = useState<SheetId>(null);

  const openSheet = useCallback((id: SheetId) => {
    haptic('medium');
    setActiveSheet(id);
  }, []);

  const closeSheet = useCallback(() => {
    haptic('light');
    setActiveSheet(null);
  }, []);

  const toggleSheet = useCallback((id: Exclude<SheetId, null>) => {
    setActiveSheet(prev => {
      const next = prev === id ? null : id;
      haptic(next ? 'medium' : 'light');
      return next;
    });
  }, []);

  const closeAll = useCallback(() => {
    setActiveSheet(null);
  }, []);

  const value = useMemo<SheetContextValue>(() => ({
    activeSheet,
    openSheet,
    closeSheet,
    toggleSheet,
    closeAll,
    menuOpen: activeSheet === 'menu',
    wirdOpen: activeSheet === 'wird',
  }), [activeSheet, openSheet, closeSheet, toggleSheet, closeAll]);

  return (
    <SheetContext.Provider value={value}>
      {children}
    </SheetContext.Provider>
  );
}