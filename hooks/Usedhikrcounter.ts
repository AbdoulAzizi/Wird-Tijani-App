import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AzkarItem, PRESET_AZKARS } from '@/data/dhikrCounterData';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DhikrSession {
  id: string;
  azkarId: string;
  azkarTitle: string;
  azkarArabic: string;
  target: number;
  count: number;
  completedAt: string;   // ISO date
  durationSeconds: number;
  isComplete: boolean;
}

export interface ActiveDhikr {
  azkar: AzkarItem;
  target: number;
  count: number;
  startedAt: string;     // ISO date
}

export interface DhikrCounterState {
  // Active session
  active: ActiveDhikr | null;
  isRunning: boolean;
  elapsedSeconds: number;

  // Library
  presetAzkars: AzkarItem[];
  customAzkars: AzkarItem[];

  // History
  sessions: DhikrSession[];

  // Favorites
  favoriteIds: string[];

  // Stats
  totalSessions: number;
  totalCounts: number;
  todayCounts: number;
}

const STORAGE_KEYS = {
  CUSTOM_AZKARS: 'dhikr_custom_azkars',
  SESSIONS:      'dhikr_sessions',
  ACTIVE:        'dhikr_active_session',
  FAVORITES:     'dhikr_favorites',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDhikrCounter() {
  const [customAzkars, setCustomAzkars] = useState<AzkarItem[]>([]);
  const [sessions,     setSessions]     = useState<DhikrSession[]>([]);
  const [active,       setActive]       = useState<ActiveDhikr | null>(null);
  const [isRunning,    setIsRunning]    = useState(false);
  const [elapsed,      setElapsed]      = useState(0);
  const [favoriteIds,  setFavoriteIds]  = useState<string[]>([]);

  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // ── Load persisted data ──────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [rawCustom, rawSessions, rawActive, rawFavorites] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_AZKARS),
          AsyncStorage.getItem(STORAGE_KEYS.SESSIONS),
          AsyncStorage.getItem(STORAGE_KEYS.ACTIVE),
          AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
        ]);
        if (rawCustom)    setCustomAzkars(JSON.parse(rawCustom));
        if (rawSessions)  setSessions(JSON.parse(rawSessions));
        if (rawFavorites) setFavoriteIds(JSON.parse(rawFavorites));
        if (rawActive) {
          const saved: ActiveDhikr = JSON.parse(rawActive);
          setActive(saved);
          // Don't auto-resume timer — user must tap Start
        }
      } catch (e) {
        console.error('useDhikrCounter: load error', e);
      }
    })();
  }, []);

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsed * 1000;
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // ── Persist active session ───────────────────────────────────────────────
  useEffect(() => {
    if (active) {
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE, JSON.stringify(active)).catch(() => {});
    } else {
      AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE).catch(() => {});
    }
  }, [active]);

  // ── Derived stats ────────────────────────────────────────────────────────
  const todayStr      = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.completedAt.startsWith(todayStr));
  const todayCounts   = todaySessions.reduce((sum, s) => sum + s.count, 0);
  const totalCounts   = sessions.reduce((sum, s) => sum + s.count, 0);

  // ── Favorites helpers ────────────────────────────────────────────────────
  const allAzkars = [...PRESET_AZKARS, ...customAzkars];

  const favoriteAzkars = favoriteIds
    .map(id => allAzkars.find(a => a.id === id))
    .filter(Boolean) as AzkarItem[];

  // ── Actions ──────────────────────────────────────────────────────────────

  /** Start a new dhikr session */
  const startDhikr = useCallback((azkar: AzkarItem, target: number) => {
    const newActive: ActiveDhikr = {
      azkar,
      target,
      count: 0,
      startedAt: new Date().toISOString(),
    };
    setActive(newActive);
    setIsRunning(true);
    setElapsed(0);
  }, []);

  /** Replay a session from history */
  const replaySession = useCallback((session: DhikrSession) => {
    // Try to find the original azkar object
    const azkar = allAzkars.find(a => a.id === session.azkarId) ?? {
      id:             session.azkarId,
      category:       'custom' as const,
      title:          session.azkarTitle,
      arabic:         session.azkarArabic,
      transliteration: '',
      translation:    '',
      defaultTarget:  session.target,
      color:          '#059669',
    };
    startDhikr(azkar, session.target);
  }, [allAzkars, startDhikr]);

  /** Tap to increment */
  const increment = useCallback(() => {
    setActive(prev => {
      if (!prev) return prev;
      const next = Math.min(prev.count + 1, prev.target);
      return { ...prev, count: next };
    });
  }, []);

  /** Decrement */
  const decrement = useCallback(() => {
    setActive(prev => {
      if (!prev || prev.count <= 0) return prev;
      return { ...prev, count: prev.count - 1 };
    });
  }, []);

  /** Reset count without ending session */
  const resetCount = useCallback(() => {
    setActive(prev => prev ? { ...prev, count: 0 } : prev);
    setElapsed(0);
    startTimeRef.current = Date.now();
  }, []);

  /** Toggle pause / resume */
  const togglePause = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  /** Save session and clear active */
  const completeSession = useCallback(async () => {
    if (!active) return;
    const session: DhikrSession = {
      id:              `session_${Date.now()}`,
      azkarId:         active.azkar.id,
      azkarTitle:      active.azkar.title,
      azkarArabic:     active.azkar.arabic,
      target:          active.target,
      count:           active.count,
      completedAt:     new Date().toISOString(),
      durationSeconds: elapsed,
      isComplete:      active.count >= active.target,
    };
    const updated = [session, ...sessions].slice(0, 200); // keep last 200
    setSessions(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
    setActive(null);
    setIsRunning(false);
    setElapsed(0);
  }, [active, sessions, elapsed]);

  /** Discard active session without saving */
  const discardSession = useCallback(() => {
    setActive(null);
    setIsRunning(false);
    setElapsed(0);
  }, []);

  /** Add a new custom azkar */
  const addCustomAzkar = useCallback(async (
    item: Omit<AzkarItem, 'id' | 'category' | 'isCustom' | 'createdAt'>,
  ) => {
    const newItem: AzkarItem = {
      ...item,
      id:        `custom_${Date.now()}`,
      category:  'custom',
      isCustom:  true,
      createdAt: new Date().toISOString(),
      color:     item.color ?? '#6366F1',
    };
    const updated = [...customAzkars, newItem];
    setCustomAzkars(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_AZKARS, JSON.stringify(updated));
    return newItem;
  }, [customAzkars]);

  /** Edit an existing custom azkar */
  const editCustomAzkar = useCallback(async (
    id: string,
    updates: Partial<Omit<AzkarItem, 'id' | 'category' | 'isCustom' | 'createdAt'>>,
  ) => {
    const updated = customAzkars.map(a =>
      a.id === id ? { ...a, ...updates } : a,
    );
    setCustomAzkars(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_AZKARS, JSON.stringify(updated));
    // If the active session uses this azkar, update it too
    setActive(prev => {
      if (!prev || prev.azkar.id !== id) return prev;
      return { ...prev, azkar: { ...prev.azkar, ...updates } };
    });
  }, [customAzkars]);

  /** Delete a custom azkar */
  const deleteCustomAzkar = useCallback(async (id: string) => {
    const updated = customAzkars.filter(a => a.id !== id);
    setCustomAzkars(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_AZKARS, JSON.stringify(updated));
    // Also remove from favorites
    setFavoriteIds(prev => {
      const next = prev.filter(fid => fid !== id);
      AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, [customAzkars]);

  /** Toggle favorite */
  const toggleFavorite = useCallback(async (azkarId: string) => {
    setFavoriteIds(prev => {
      const next = prev.includes(azkarId)
        ? prev.filter(id => id !== azkarId)
        : [...prev, azkarId];
      AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  /** Delete a history session */
  const deleteSession = useCallback(async (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
  }, [sessions]);

  /** Clear all history */
  const clearHistory = useCallback(async () => {
    setSessions([]);
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSIONS);
  }, []);

  return {
    // state
    active,
    isRunning,
    elapsed,
    presetAzkars: PRESET_AZKARS,
    customAzkars,
    allAzkars,
    sessions,
    totalSessions: sessions.length,
    totalCounts,
    todayCounts,
    favoriteIds,
    favoriteAzkars,
    // actions
    startDhikr,
    replaySession,
    increment,
    decrement,
    resetCount,
    togglePause,
    completeSession,
    discardSession,
    addCustomAzkar,
    editCustomAzkar,
    deleteCustomAzkar,
    toggleFavorite,
    deleteSession,
    clearHistory,
  };
}