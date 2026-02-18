import React, {
  createContext, useContext, useCallback,
  useRef, useState, ReactNode,
} from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface HeaderAction {
  key: string;
  label: string;
  icon?: ReactNode;
  onPress: () => void;
  destructive?: boolean;
  dividerAfter?: boolean;
}

interface HeaderActionsContextValue {
  /** Appelé par chaque screen pour enregistrer ses actions sous sa route */
  registerActions: (route: string, actions: HeaderAction[]) => void;
  /** Appelé par le layout pour lire les actions de la route active */
  getActionsForRoute: (route: string) => HeaderAction[];
}

// ─── Context ───────────────────────────────────────────────────────────────────
const HeaderActionsContext = createContext<HeaderActionsContextValue>({
  registerActions: () => {},
  getActionsForRoute: () => [],
});

// ─── Provider ──────────────────────────────────────────────────────────────────
export function HeaderActionsProvider({ children }: { children: ReactNode }) {
  // On utilise une ref pour le registre (pas de re-render à chaque update)
  // + un compteur pour forcer le re-render du layout quand les actions changent
  const registryRef = useRef<Map<string, HeaderAction[]>>(new Map());
  const [, forceUpdate] = useState(0);

  const registerActions = useCallback((route: string, actions: HeaderAction[]) => {
    registryRef.current.set(route, actions);
    forceUpdate(n => n + 1); // notifie le layout
  }, []);

  const getActionsForRoute = useCallback((route: string): HeaderAction[] => {
    return registryRef.current.get(route) ?? [];
  }, []);

  return (
    <HeaderActionsContext.Provider value={{ registerActions, getActionsForRoute }}>
      {children}
    </HeaderActionsContext.Provider>
  );
}

// ─── Hook pour les screens ─────────────────────────────────────────────────────
export function useRegisterHeaderActions(route: string, actions: HeaderAction[]) {
  const { registerActions } = useContext(HeaderActionsContext);

  // On sérialise les actions pour détecter les vrais changements
  // (évite les re-renders infinis si le tableau est recréé à chaque render)
  const actionsKey = actions.map(a => a.key).join(',');

  React.useEffect(() => {
    registerActions(route, actions);
    // Pas de cleanup ! Les actions restent enregistrées.
    // Le layout lit toujours la route active → pas de "fantôme"
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, actionsKey]);
}

// ─── Hook pour le layout ───────────────────────────────────────────────────────
export function useHeaderActionsForRoute(route: string): HeaderAction[] {
  const { getActionsForRoute } = useContext(HeaderActionsContext);
  return getActionsForRoute(route);
}

// ─── Hook legacy (compatibilité) ──────────────────────────────────────────────
// Gardé si d'autres composants l'utilisent encore
export function useHeaderActions() {
  return useContext(HeaderActionsContext);
}