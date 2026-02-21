import React, { createContext, useContext, useState, useCallback } from 'react';

type HeaderMode = 'minimal' | 'spiritual' | 'none';

interface HeaderModeContextValue {
  headerMode: HeaderMode;
  setHeaderMode: (mode: HeaderMode) => void;
}

const HeaderModeContext = createContext<HeaderModeContextValue>({
  headerMode: 'minimal',
  setHeaderMode: () => {},
});

export function HeaderModeProvider({ children }: { children: React.ReactNode }) {
  const [headerMode, setHeaderModeState] = useState<HeaderMode>('minimal');
  const setHeaderMode = useCallback((mode: HeaderMode) => setHeaderModeState(mode), []);
  return (
    <HeaderModeContext.Provider value={{ headerMode, setHeaderMode }}>
      {children}
    </HeaderModeContext.Provider>
  );
}

export function useHeaderMode() {
  return useContext(HeaderModeContext);
}