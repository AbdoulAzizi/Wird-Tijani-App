import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
  actions: HeaderAction[];
  setActions: (actions: HeaderAction[]) => void;
  clearActions: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────────
const HeaderActionsContext = createContext<HeaderActionsContextValue>({
  actions: [],
  setActions: () => {},
  clearActions: () => {},
});

// ─── Provider ──────────────────────────────────────────────────────────────────
export function HeaderActionsProvider({ children }: { children: ReactNode }) {
  const [actions, setActionsState] = useState<HeaderAction[]>([]);

  const setActions = useCallback((a: HeaderAction[]) => setActionsState(a), []);
  const clearActions = useCallback(() => setActionsState([]), []);

  return (
    <HeaderActionsContext.Provider value={{ actions, setActions, clearActions }}>
      {children}
    </HeaderActionsContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useHeaderActions() {
  return useContext(HeaderActionsContext);
}