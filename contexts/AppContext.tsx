import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WirdState {
  istighfar: number;
  salatFatih: number;
  tahlil: number;
}

interface WazifaState {
  istighfar: number;
  salatFatih1: number;
  tahlil: number;
  jawhara: number;
}

interface HadraState {
  tahlil: number;
  ismuLlah: number;
}

interface HadraTargets {
  tahlil: number;
  ismuLlah: number;
}

interface WazifaSettings {
  useJawhara: boolean;
  jawharaCount: 11 | 12;
}

interface WirdSettings {
  salawatFormula: 'salatulFatih' | 'salatulIbrahimiyya' | 'salawatSimple' | 'salatulKamila';
}

// ── NEW: Frequency Settings ──────────────────────────────────────────────────
export interface FrequencySettings {
  wirdPerDay: 1 | 2;       // Wird: 1 or 2 times/day (default 2)
  wazifaPerDay: 1 | 2;     // Wazifa: 1 or 2 times/day (default 1)
  hadraPerDay: 1;           // Hadra: always 1 (Friday only) — kept for consistency
}

interface AppSettings {
  audioEnabled: boolean;
  notificationsEnabled: boolean;
  darkMode: boolean;
  language: 'ar' | 'en' | 'fr';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  reminderTimes: {
    morning: string;
    evening: string;
    wazifa: string;
    friday: string;
  };
}

interface AppState {
  wird: WirdState;
  wazifa: WazifaState;
  hadra: HadraState;
  hadraTargets: HadraTargets;
  wazifaSettings: WazifaSettings;
  wirdSettings: WirdSettings;
  frequencySettings: FrequencySettings;
  // completedWirds / completedWazifas / completedHadras now store entries like
  // "2025-01-01" (once) or "2025-01-01", "2025-01-01" (twice = two entries with same date)
  completedWirds: string[];
  completedWazifas: string[];
  completedHadras: string[];
  streak: number;
  settings: AppSettings;
  currentWirdStep: number;
  currentWazifaStep: number;
  currentHadraStep: number;
}

type AppAction =
  | { type: 'INCREMENT_WIRD'; dhikr: keyof WirdState }
  | { type: 'DECREMENT_WIRD'; dhikr: keyof WirdState }
  | { type: 'RESET_WIRD'; dhikr: keyof WirdState }
  | { type: 'RESET_ALL_WIRD' }
  | { type: 'INCREMENT_WAZIFA'; dhikr: keyof WazifaState }
  | { type: 'DECREMENT_WAZIFA'; dhikr: keyof WazifaState }
  | { type: 'RESET_WAZIFA'; dhikr: keyof WazifaState }
  | { type: 'RESET_ALL_WAZIFA' }
  | { type: 'INCREMENT_HADRA'; dhikr: keyof HadraState }
  | { type: 'DECREMENT_HADRA'; dhikr: keyof HadraState }
  | { type: 'RESET_HADRA'; dhikr: keyof HadraState }
  | { type: 'RESET_ALL_HADRA' }
  | { type: 'UPDATE_HADRA_TARGETS'; targets: HadraTargets }
  | { type: 'UPDATE_WAZIFA_SETTINGS'; settings: Partial<WazifaSettings> }
  | { type: 'UPDATE_WIRD_SETTINGS'; settings: WirdSettings }
  | { type: 'UPDATE_FREQUENCY_SETTINGS'; settings: Partial<FrequencySettings> }
  | { type: 'COMPLETE_WIRD' }
  | { type: 'COMPLETE_WAZIFA' }
  | { type: 'COMPLETE_HADRA' }
  | { type: 'LOAD_STATE'; state: AppState }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppSettings> }
  | { type: 'SET_WIRD_STEP'; step: number }
  | { type: 'SET_WAZIFA_STEP'; step: number }
  | { type: 'SET_HADRA_STEP'; step: number }
  | { type: 'UPDATE_REMINDER_TIME'; reminderType: keyof AppSettings['reminderTimes']; time: string };

const initialState: AppState = {
  wird: { istighfar: 0, salatFatih: 0, tahlil: 0 },
  wazifa: { istighfar: 0, salatFatih1: 0, tahlil: 0, jawhara: 0 },
  hadra: { tahlil: 0, ismuLlah: 0 },
  hadraTargets: { tahlil: 800, ismuLlah: 400 },
  wazifaSettings: { useJawhara: true, jawharaCount: 12 },
  wirdSettings: { salawatFormula: 'salatulFatih' },
  frequencySettings: {
    wirdPerDay: 2,
    wazifaPerDay: 1,
    hadraPerDay: 1,
  },
  completedWirds: [],
  completedWazifas: [],
  completedHadras: [],
  streak: 0,
  settings: {
    audioEnabled: true,
    notificationsEnabled: true,
    darkMode: false,
    language: 'en',
    fontSize: 'medium',
    reminderTimes: { morning: '05:30', evening: '18:45', wazifa: '15:30', friday: '15:30' },
  },
  currentWirdStep: 0,
  currentWazifaStep: 0,
  currentHadraStep: 0,
};

const WIRD_TARGETS = { istighfar: 100, salatFatih: 100, tahlil: 100 };
const WAZIFA_TARGETS = { istighfar: 30, salatFatih1: 50, tahlil: 100, jawhara: 12 };
const WAZIFA_SALAT_FATIH_TARGET = 20;
const HADRA_TARGETS = { tahlil: 800, ismuLlah: 400 };

export const SALAWAT_FORMULAS = {
  salatulFatih: {
    title: 'Salat al-Fātiḥ',
    arabic: 'اَللَّهُمَّ صَلِّ عَلى سَيِّدِنَا مُحَمَّدٍ اَلْفَاتِحِ لِمَا أُغْلِقَ وَ اَلْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بَالْحَقَّ وَ الْهَادِي إلى صِرَاطِكَ الْمُسْتَقِيمِ وَ عَلَى آلِهِ حَقَّ قَدْرِهِ و مِقْدَارِهِ الْعَظِيمِ',
    transliteration: 'Allāhumma ṣalli ʿalā sayyidinā Muḥammadin l-fātiḥi limā ughliqa wa l-khātimi limā sabaqa nāṣiri l-ḥaqqi bi-l-ḥaqqa wa l-hādī ilā ṣirāṭika l-mustaqīm wa ʿalā ālihi ḥaqqa qadrihi wa miqdārihi l-ʿaẓīm',
    translation: 'O Allah, send blessings upon our master Muhammad, the Opener of what was closed, the Seal of what has passed, the Helper of the Truth with the Truth, the Guide to Your Straight Path, and upon his family according to his great worth and measure',
    description: 'The traditional Tijani formula revealed to Sidi Ahmad al-Tijani',
  },
  salatulIbrahimiyya: {
    title: 'Salat al-Ibrāhīmiyya',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: 'Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad...',
    translation: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad...',
    description: 'The classical Ibrahimiyya prayer from the Sunnah',
  },
  salawatSimple: {
    title: 'Salawāt Simple',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ',
    transliteration: 'Allāhumma ṣalli wa sallim ʿalā sayyidinā Muḥammadin wa ʿalā ālihi wa ṣaḥbihi',
    translation: 'O Allah, send prayers and peace upon our master Muhammad and upon his family and companions',
    description: 'A simple and widely used formula',
  },
  salatulKamila: {
    title: 'Salat al-Kāmila',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلاَةً تُنْجِينَا بِهَا مِنْ جَمِيعِ الأَهْوَالِ وَالآفَاتِ...',
    transliteration: 'Allāhumma ṣalli ʿalā sayyidinā Muḥammadin ṣalātan tunajjīnā...',
    translation: 'O Allah, send blessings upon our master Muhammad, a prayer by which You save us from all terrors...',
    description: 'A comprehensive prayer seeking protection and blessings',
  },
};

// ── Helper: count entries for a given date ───────────────────────────────────
export function countForDate(entries: string[], date: string): number {
  return entries.filter(d => d === date).length;
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'INCREMENT_WIRD':
      return {
        ...state,
        wird: { ...state.wird, [action.dhikr]: Math.min(state.wird[action.dhikr] + 1, WIRD_TARGETS[action.dhikr]) },
      };
    case 'DECREMENT_WIRD':
      return {
        ...state,
        wird: { ...state.wird, [action.dhikr]: Math.max(state.wird[action.dhikr] - 1, 0) },
      };
    case 'RESET_WIRD':
      return { ...state, wird: { ...state.wird, [action.dhikr]: 0 } };
    case 'RESET_ALL_WIRD':
      return { ...state, wird: initialState.wird, currentWirdStep: 0, completedWirds: [] };

    case 'INCREMENT_WAZIFA': {
      const wazifaTarget =
        action.dhikr === 'jawhara'
          ? state.wazifaSettings.useJawhara
            ? state.wazifaSettings.jawharaCount
            : WAZIFA_SALAT_FATIH_TARGET
          : WAZIFA_TARGETS[action.dhikr];
      return {
        ...state,
        wazifa: { ...state.wazifa, [action.dhikr]: Math.min(state.wazifa[action.dhikr] + 1, wazifaTarget) },
      };
    }
    case 'DECREMENT_WAZIFA':
      return { ...state, wazifa: { ...state.wazifa, [action.dhikr]: Math.max(state.wazifa[action.dhikr] - 1, 0) } };
    case 'RESET_WAZIFA':
      return { ...state, wazifa: { ...state.wazifa, [action.dhikr]: 0 } };
    case 'RESET_ALL_WAZIFA':
      return { ...state, wazifa: initialState.wazifa, currentWazifaStep: 0, completedWazifas: [] };

    case 'INCREMENT_HADRA':
      return {
        ...state,
        hadra: { ...state.hadra, [action.dhikr]: Math.min(state.hadra[action.dhikr] + 1, state.hadraTargets[action.dhikr]) },
      };
    case 'DECREMENT_HADRA':
      return { ...state, hadra: { ...state.hadra, [action.dhikr]: Math.max(state.hadra[action.dhikr] - 1, 0) } };
    case 'RESET_HADRA':
      return { ...state, hadra: { ...state.hadra, [action.dhikr]: 0 } };
    case 'RESET_ALL_HADRA':
      return { ...state, hadra: initialState.hadra, currentHadraStep: 0, completedHadras: [] };

    case 'UPDATE_HADRA_TARGETS':
      return { ...state, hadraTargets: action.targets };

    case 'UPDATE_WAZIFA_SETTINGS':
      return {
        ...state,
        wazifaSettings: { ...state.wazifaSettings, ...action.settings },
        wazifa: { ...state.wazifa, jawhara: 0 },
      };

    case 'UPDATE_WIRD_SETTINGS':
      return {
        ...state,
        wirdSettings: action.settings,
        wird: { ...state.wird, salatFatih: 0 },
      };

    case 'UPDATE_FREQUENCY_SETTINGS':
      return {
        ...state,
        frequencySettings: { ...state.frequencySettings, ...action.settings },
      };

    // COMPLETE_WIRD: push today's date — if already done once, pushes again (twice = 2 entries)
    case 'COMPLETE_WIRD': {
      const today = getTodayDate();
      return {
        ...state,
        completedWirds: [...state.completedWirds, today],
        wird: initialState.wird,
        currentWirdStep: 0,
      };
    }
    case 'COMPLETE_WAZIFA': {
      const today = getTodayDate();
      return {
        ...state,
        completedWazifas: [...state.completedWazifas, today],
        wazifa: initialState.wazifa,
        currentWazifaStep: 0,
      };
    }
    case 'COMPLETE_HADRA': {
      const today = getTodayDate();
      return {
        ...state,
        completedHadras: [...state.completedHadras, today],
        hadra: initialState.hadra,
        currentHadraStep: 0,
      };
    }

    case 'LOAD_STATE': {
      const migratedState: AppState = {
        ...action.state,
        hadra: action.state.hadra || initialState.hadra,
        hadraTargets: action.state.hadraTargets || initialState.hadraTargets,
        frequencySettings: {
          ...initialState.frequencySettings,
          ...(action.state.frequencySettings || {}),
        },
        wazifaSettings: {
          ...initialState.wazifaSettings,
          ...(action.state.wazifaSettings || {}),
          jawharaCount: action.state.wazifaSettings?.jawharaCount || 12,
        },
        wirdSettings: action.state.wirdSettings || initialState.wirdSettings,
        completedHadras: action.state.completedHadras || [],
        currentHadraStep: action.state.currentHadraStep || 0,
        settings: {
          ...initialState.settings,
          ...action.state.settings,
          reminderTimes: {
            ...initialState.settings.reminderTimes,
            ...(action.state.settings?.reminderTimes || {}),
          },
        },
      };
      if (migratedState.wazifa && (migratedState.wazifa as any).salatFatih2 !== undefined) {
        delete (migratedState.wazifa as any).salatFatih2;
      }
      return migratedState;
    }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };

    case 'UPDATE_REMINDER_TIME':
      return {
        ...state,
        settings: {
          ...state.settings,
          reminderTimes: { ...state.settings.reminderTimes, [action.reminderType]: action.time },
        },
      };

    case 'SET_WIRD_STEP':  return { ...state, currentWirdStep: action.step };
    case 'SET_WAZIFA_STEP': return { ...state, currentWazifaStep: action.step };
    case 'SET_HADRA_STEP':  return { ...state, currentHadraStep: action.step };

    default: return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  isWirdComplete: boolean;
  isWazifaComplete: boolean;
  isHadraComplete: boolean;
  isWirdFullyDoneToday: boolean;
  isWazifaFullyDoneToday: boolean;
  isHadraFullyDoneToday: boolean;
  wirdCompletionsToday: number;
  wazifaCompletionsToday: number;
  hadraCompletionsToday: number;
  getWirdStepStatus: (step: number) => 'completed' | 'active' | 'disabled';
  getWazifaStepStatus: (step: number) => 'completed' | 'active' | 'disabled';
  getHadraStepStatus: (step: number) => 'completed' | 'active' | 'disabled';
  getWirdProgress: () => number;
  getWazifaProgress: () => number;
  getHadraProgress: () => number;
  getWazifaJawharaTarget: () => number;
  getCurrentSalawatFormula: () => typeof SALAWAT_FORMULAS[keyof typeof SALAWAT_FORMULAS];
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const today = getTodayDate();

  // How many completions today
  const wirdCompletionsToday  = countForDate(state.completedWirds,  today);
  const wazifaCompletionsToday = countForDate(state.completedWazifas, today);
  const hadraCompletionsToday  = countForDate(state.completedHadras,  today);

  // Is the current session complete (dhikr counters all maxed)
  const getWazifaJawharaTarget = () =>
    state.wazifaSettings.useJawhara ? state.wazifaSettings.jawharaCount : WAZIFA_SALAT_FATIH_TARGET;

  const getCurrentSalawatFormula = () => SALAWAT_FORMULAS[state.wirdSettings.salawatFormula];

  const isWirdComplete =
    state.wird.istighfar >= WIRD_TARGETS.istighfar &&
    state.wird.salatFatih >= WIRD_TARGETS.salatFatih &&
    state.wird.tahlil >= WIRD_TARGETS.tahlil;

  const isWazifaComplete =
    state.wazifa.istighfar >= WAZIFA_TARGETS.istighfar &&
    state.wazifa.salatFatih1 >= WAZIFA_TARGETS.salatFatih1 &&
    state.wazifa.tahlil >= WAZIFA_TARGETS.tahlil &&
    state.wazifa.jawhara >= getWazifaJawharaTarget();

  const isHadraComplete =
    state.hadra.tahlil >= state.hadraTargets.tahlil &&
    state.hadra.ismuLlah >= state.hadraTargets.ismuLlah;

  // "Fully done today" = completed the required number of times
  const isWirdFullyDoneToday   = wirdCompletionsToday  >= state.frequencySettings.wirdPerDay;
  const isWazifaFullyDoneToday = wazifaCompletionsToday >= state.frequencySettings.wazifaPerDay;
  const isHadraFullyDoneToday  = hadraCompletionsToday  >= state.frequencySettings.hadraPerDay;

  const getWirdStepStatus = (step: number): 'completed' | 'active' | 'disabled' => {
    const steps = ['istighfar', 'salatFatih', 'tahlil'] as const;
    const key = steps[step];
    if (state.wird[key] >= WIRD_TARGETS[key]) return 'completed';
    if (step === state.currentWirdStep) return 'active';
    if (step < state.currentWirdStep) return 'completed';
    return 'disabled';
  };

  const getWazifaStepStatus = (step: number): 'completed' | 'active' | 'disabled' => {
    const steps = ['istighfar', 'salatFatih1', 'tahlil', 'jawhara'] as const;
    const key = steps[step];
    const target = key === 'jawhara' ? getWazifaJawharaTarget() : WAZIFA_TARGETS[key];
    if (state.wazifa[key] >= target) return 'completed';
    if (step === state.currentWazifaStep) return 'active';
    if (step < state.currentWazifaStep) return 'completed';
    return 'disabled';
  };

  const getHadraStepStatus = (step: number): 'completed' | 'active' | 'disabled' => {
    const steps = ['tahlil', 'ismuLlah'] as const;
    const key = steps[step];
    if (state.hadra[key] >= state.hadraTargets[key]) return 'completed';
    if (step === state.currentHadraStep) return 'active';
    if (step < state.currentHadraStep) return 'completed';
    return 'disabled';
  };

  const getWirdProgress = () => {
    const keys = Object.keys(WIRD_TARGETS) as (keyof typeof WIRD_TARGETS)[];
    const completed = keys.filter(k => state.wird[k] >= WIRD_TARGETS[k]).length;
    return (completed / keys.length) * 100;
  };

  const getWazifaProgress = () => {
    let completed = 0;
    if (state.wazifa.istighfar >= WAZIFA_TARGETS.istighfar) completed++;
    if (state.wazifa.salatFatih1 >= WAZIFA_TARGETS.salatFatih1) completed++;
    if (state.wazifa.tahlil >= WAZIFA_TARGETS.tahlil) completed++;
    if (state.wazifa.jawhara >= getWazifaJawharaTarget()) completed++;
    return (completed / 4) * 100;
  };

  const getHadraProgress = () => {
    const keys = Object.keys(state.hadraTargets) as (keyof HadraTargets)[];
    const completed = keys.filter(k => state.hadra[k] >= state.hadraTargets[k]).length;
    return (completed / keys.length) * 100;
  };

  useEffect(() => { loadState(); }, []);
  useEffect(() => { saveState(); }, [state]);

  const loadState = async () => {
    try {
      const saved = await AsyncStorage.getItem('tijaniApp');
      if (saved) dispatch({ type: 'LOAD_STATE', state: JSON.parse(saved) });
    } catch (e) { console.error('Error loading state:', e); }
  };

  const saveState = async () => {
    try { await AsyncStorage.setItem('tijaniApp', JSON.stringify(state)); }
    catch (e) { console.error('Error saving state:', e); }
  };

  return (
    <AppContext.Provider value={{
      state, dispatch,
      isWirdComplete, isWazifaComplete, isHadraComplete,
      isWirdFullyDoneToday, isWazifaFullyDoneToday, isHadraFullyDoneToday,
      wirdCompletionsToday, wazifaCompletionsToday, hadraCompletionsToday,
      getWirdStepStatus, getWazifaStepStatus, getHadraStepStatus,
      getWirdProgress, getWazifaProgress, getHadraProgress,
      getWazifaJawharaTarget, getCurrentSalawatFormula,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export { WIRD_TARGETS, WAZIFA_TARGETS, HADRA_TARGETS, WAZIFA_SALAT_FATIH_TARGET };