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
  useJawhara: boolean; // true = Jawhara (12x), false = Salatul Fatih (20x)
}

interface WirdSettings {
  salawatFormula: 'salatulFatih' | 'salatulIbrahimiyya' | 'salawatSimple' | 'salatulKamila';
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
  | { type: 'UPDATE_WAZIFA_SETTINGS'; settings: WazifaSettings }
  | { type: 'UPDATE_WIRD_SETTINGS'; settings: WirdSettings }
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
  wird: {
    istighfar: 0,
    salatFatih: 0,
    tahlil: 0,
  },
  wazifa: {
    istighfar: 0,
    salatFatih1: 0,
    tahlil: 0,
    jawhara: 0,
  },
  hadra: {
    tahlil: 0,
    ismuLlah: 0,
  },
  hadraTargets: {
    tahlil: 800,
    ismuLlah: 400,
  },
  wazifaSettings: {
    useJawhara: true, // Par défaut, utiliser Jawhara
  },
  wirdSettings: {
    salawatFormula: 'salatulFatih', // Par défaut, Salatul Fatih
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
    reminderTimes: {
      morning: '05:30',
      evening: '18:45',
      friday: '15:30'
    }
  },
  currentWirdStep: 0,
  currentWazifaStep: 0,
  currentHadraStep: 0,
};

const WIRD_TARGETS = {
  istighfar: 100,
  salatFatih: 100,
  tahlil: 100,
};

const WAZIFA_TARGETS = {
  istighfar: 30,
  salatFatih1: 50,
  tahlil: 100,
  jawhara: 12,
};

const WAZIFA_SALAT_FATIH_TARGET = 20; // Cible pour Salatul Fatih à la place de Jawhara

const HADRA_TARGETS = {
  tahlil: 800,
  ismuLlah: 400,
};

// Définition des formules de Salawat
export const SALAWAT_FORMULAS = {
  salatulFatih: {
    title: 'Salat al-Fātiḥ',
    arabic: 'اَللَّهُمَّ صَلِّ عَلى سَيِّدِنَا مُحَمَّدٍ اَلْفَاتِحِ لِمَا أُغْلِقَ وَ اَلْخَاتِمِ لِمَا سَبَقَ نَاصِرِ الْحَقِّ بَالْحَقَّ وَ الْهَادِي إلى صِرَاطِكَ الْمُسْتَقِيمِ وَ عَلَى آلِهِ حَقَّ قَدْرِهِ و مِقْدَارِهِ الْعَظِيمِ',
    transliteration: 'Allāhumma ṣalli ʿalā sayyidinā Muḥammadin l-fātiḥi limā ughliqa wa l-khātimi limā sabaqa nāṣiri l-ḥaqqi bi-l-ḥaqqa wa l-hādī ilā ṣirāṭika l-mustaqīm wa ʿalā ālihi ḥaqqa qadrihi wa miqdārihi l-ʿaẓīm',
    translation: 'O Allah, send blessings upon our master Muhammad, the Opener of what was closed, the Seal of what has passed, the Helper of the Truth with the Truth, the Guide to Your Straight Path, and upon his family according to his great worth and measure',
    description: 'The traditional Tijani formula revealed to Sidi Ahmad al-Tijani'
  },
  salatulIbrahimiyya: {
    title: 'Salat al-Ibrāhīmiyya',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: 'Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka Ḥamīdun Majīd. Allāhumma bārik ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā bārakta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka Ḥamīdun Majīd',
    translation: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Verily, You are Praiseworthy and Glorious. O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim and upon the family of Ibrahim. Verily, You are Praiseworthy and Glorious',
    description: 'The classical Ibrahimiyya prayer from the Sunnah'
  },
  salawatSimple: {
    title: 'Salawāt Simple',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ',
    transliteration: 'Allāhumma ṣalli wa sallim ʿalā sayyidinā Muḥammadin wa ʿalā ālihi wa ṣaḥbihi',
    translation: 'O Allah, send prayers and peace upon our master Muhammad and upon his family and companions',
    description: 'A simple and widely used formula'
  },
  salatulKamila: {
    title: 'Salat al-Kāmila',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلاَةً تُنْجِينَا بِهَا مِنْ جَمِيعِ الأَهْوَالِ وَالآفَاتِ وَتَقْضِي لَنَا بِهَا جَمِيعَ الْحَاجَاتِ وَتُطَهِّرُنَا بِهَا مِنْ جَمِيعِ السَّيِّئَاتِ وَتَرْفَعُنَا بِهَا أَعْلَى الدَّرَجَاتِ وَتُبَلِّغُنَا بِهَا أَقْصَى الْغَايَاتِ مِنْ جَمِيعِ الْخَيْرَاتِ فِي الْحَيَاةِ وَبَعْدَ الْمَمَاتِ',
    transliteration: 'Allāhumma ṣalli ʿalā sayyidinā Muḥammadin ṣalātan tunajjīnā bihā min jamīʿi l-ahwāli wa l-āfāt, wa taqḍī lanā bihā jamīʿa l-ḥājāt, wa tuṭahhirunā bihā min jamīʿi s-sayyiʾāt, wa tarfaʿunā bihā aʿlā d-darajāt, wa tuballiughunā bihā aqṣā l-ghāyāt min jamīʿi l-khayrāt fī l-ḥayāti wa baʿda l-mamāt',
    translation: 'O Allah, send blessings upon our master Muhammad, a prayer by which You save us from all terrors and calamities, fulfill all our needs, purify us from all bad deeds, raise us to the highest ranks, and make us reach the utmost goals of all good things in life and after death',
    description: 'A comprehensive prayer seeking protection and blessings'
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'INCREMENT_WIRD':
      return {
        ...state,
        wird: {
          ...state.wird,
          [action.dhikr]: Math.min(state.wird[action.dhikr] + 1, WIRD_TARGETS[action.dhikr]),
        },
      };
    case 'DECREMENT_WIRD':
      return {
        ...state,
        wird: {
          ...state.wird,
          [action.dhikr]: Math.max(state.wird[action.dhikr] - 1, 0),
        },
      };
    case 'RESET_WIRD':
      return {
        ...state,
        wird: {
          ...state.wird,
          [action.dhikr]: 0,
        },
      };
    case 'RESET_ALL_WIRD':
      return {
        ...state,
        wird: initialState.wird,
        currentWirdStep: 0,
        completedWirds: [],
      };
    case 'INCREMENT_WAZIFA':
      const wazifaTarget = action.dhikr === 'jawhara' 
        ? (state.wazifaSettings.useJawhara ? WAZIFA_TARGETS.jawhara : WAZIFA_SALAT_FATIH_TARGET)
        : WAZIFA_TARGETS[action.dhikr];
      return {
        ...state,
        wazifa: {
          ...state.wazifa,
          [action.dhikr]: Math.min(state.wazifa[action.dhikr] + 1, wazifaTarget),
        },
      };
    case 'DECREMENT_WAZIFA':
      return {
        ...state,
        wazifa: {
          ...state.wazifa,
          [action.dhikr]: Math.max(state.wazifa[action.dhikr] - 1, 0),
        },
      };
    case 'RESET_WAZIFA':
      return {
        ...state,
        wazifa: {
          ...state.wazifa,
          [action.dhikr]: 0,
        },
      };
    case 'RESET_ALL_WAZIFA':
      return {
        ...state,
        wazifa: initialState.wazifa,
        currentWazifaStep: 0,
        completedWazifas: [],
      };
    case 'INCREMENT_HADRA':
      return {
        ...state,
        hadra: {
          ...state.hadra,
          [action.dhikr]: Math.min(state.hadra[action.dhikr] + 1, state.hadraTargets[action.dhikr]),
        },
      };
    case 'DECREMENT_HADRA':
      return {
        ...state,
        hadra: {
          ...state.hadra,
          [action.dhikr]: Math.max(state.hadra[action.dhikr] - 1, 0),
        },
      };
    case 'RESET_HADRA':
      return {
        ...state,
        hadra: {
          ...state.hadra,
          [action.dhikr]: 0,
        },
      };
    case 'RESET_ALL_HADRA':
      return {
        ...state,
        hadra: initialState.hadra,
        currentHadraStep: 0,
        completedHadras: [],
      };
    case 'UPDATE_HADRA_TARGETS':
      return {
        ...state,
        hadraTargets: action.targets,
      };
    case 'UPDATE_WAZIFA_SETTINGS':
      return {
        ...state,
        wazifaSettings: action.settings,
        // Réinitialiser le compteur jawhara quand on change de paramètre
        wazifa: {
          ...state.wazifa,
          jawhara: 0,
        },
      };
    case 'UPDATE_WIRD_SETTINGS':
      return {
        ...state,
        wirdSettings: action.settings,
        // Réinitialiser le compteur salat quand on change de formule
        wird: {
          ...state.wird,
          salatFatih: 0,
        },
      };
    case 'COMPLETE_WIRD':
      const today = new Date().toISOString().split('T')[0];
      return {
        ...state,
        completedWirds: [...state.completedWirds, today],
        wird: initialState.wird,
        currentWirdStep: 0,
      };
    case 'COMPLETE_WAZIFA':
      const todayWazifa = new Date().toISOString().split('T')[0];
      return {
        ...state,
        completedWazifas: [...state.completedWazifas, todayWazifa],
        wazifa: initialState.wazifa,
        currentWazifaStep: 0,
      };
    case 'COMPLETE_HADRA':
      const todayHadra = new Date().toISOString().split('T')[0];
      return {
        ...state,
        completedHadras: [...state.completedHadras, todayHadra],
        hadra: initialState.hadra,
        currentHadraStep: 0,
      };
    case 'LOAD_STATE':
      // Migration pour les anciennes versions
      const migratedState = {
        ...action.state,
        hadra: action.state.hadra || initialState.hadra,
        hadraTargets: action.state.hadraTargets || initialState.hadraTargets,
        wazifaSettings: action.state.wazifaSettings || initialState.wazifaSettings,
        wirdSettings: action.state.wirdSettings || initialState.wirdSettings,
        completedHadras: action.state.completedHadras || [],
        currentHadraStep: action.state.currentHadraStep || 0,
        settings: {
          ...initialState.settings,
          ...action.state.settings,
          reminderTimes: {
            ...initialState.settings.reminderTimes,
            ...(action.state.settings?.reminderTimes || {})
          }
        }
      };
      
      // Migration: supprimer salatFatih2 des anciennes données
      if (migratedState.wazifa && (migratedState.wazifa as any).salatFatih2 !== undefined) {
        delete (migratedState.wazifa as any).salatFatih2;
      }
      
      return migratedState;
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.settings,
        },
      };
    case 'UPDATE_REMINDER_TIME':
      return {
        ...state,
        settings: {
          ...state.settings,
          reminderTimes: {
            ...state.settings.reminderTimes,
            [action.reminderType]: action.time
          }
        }
      };
    case 'SET_WIRD_STEP':
      return {
        ...state,
        currentWirdStep: action.step,
      };
    case 'SET_WAZIFA_STEP':
      return {
        ...state,
        currentWazifaStep: action.step,
      };
    case 'SET_HADRA_STEP':
      return {
        ...state,
        currentHadraStep: action.step,
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  isWirdComplete: boolean;
  isWazifaComplete: boolean;
  isHadraComplete: boolean;
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

  const getWazifaJawharaTarget = () => {
    return state.wazifaSettings.useJawhara ? WAZIFA_TARGETS.jawhara : WAZIFA_SALAT_FATIH_TARGET;
  };

  const getCurrentSalawatFormula = () => {
    return SALAWAT_FORMULAS[state.wirdSettings.salawatFormula];
  };

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

  const getWirdStepStatus = (step: number) => {
    const steps = ['istighfar', 'salatFatih', 'tahlil'] as const;
    const currentStepKey = steps[step];
    const currentCount = state.wird[currentStepKey];
    const target = WIRD_TARGETS[currentStepKey];
    
    if (currentCount >= target) return 'completed';
    if (step === state.currentWirdStep) return 'active';
    if (step < state.currentWirdStep) return 'completed';
    return 'disabled';
  };

  const getWazifaStepStatus = (step: number) => {
    const steps = ['istighfar', 'salatFatih1', 'tahlil', 'jawhara'] as const;
    const currentStepKey = steps[step];
    const currentCount = state.wazifa[currentStepKey];
    const target = currentStepKey === 'jawhara' 
      ? getWazifaJawharaTarget()
      : WAZIFA_TARGETS[currentStepKey];
    
    if (currentCount >= target) return 'completed';
    if (step === state.currentWazifaStep) return 'active';
    if (step < state.currentWazifaStep) return 'completed';
    return 'disabled';
  };

  const getHadraStepStatus = (step: number) => {
    const steps = ['tahlil', 'ismuLlah'] as const;
    const currentStepKey = steps[step];
    const currentCount = state.hadra[currentStepKey];
    const target = state.hadraTargets[currentStepKey];
    
    if (currentCount >= target) return 'completed';
    if (step === state.currentHadraStep) return 'active';
    if (step < state.currentHadraStep) return 'completed';
    return 'disabled';
  };

  const getWirdProgress = () => {
    const totalSteps = Object.keys(WIRD_TARGETS).length;
    const completedSteps = Object.entries(state.wird).filter(([key, count]) => {
      return count >= WIRD_TARGETS[key as keyof typeof WIRD_TARGETS];
    }).length;
    return (completedSteps / totalSteps) * 100;
  };

  const getWazifaProgress = () => {
    const totalSteps = Object.keys(WAZIFA_TARGETS).length;
    let completedSteps = 0;
    
    // Compter les étapes complétées
    if (state.wazifa.istighfar >= WAZIFA_TARGETS.istighfar) completedSteps++;
    if (state.wazifa.salatFatih1 >= WAZIFA_TARGETS.salatFatih1) completedSteps++;
    if (state.wazifa.tahlil >= WAZIFA_TARGETS.tahlil) completedSteps++;
    if (state.wazifa.jawhara >= getWazifaJawharaTarget()) completedSteps++;
    
    return (completedSteps / totalSteps) * 100;
  };

  const getHadraProgress = () => {
    const totalSteps = Object.keys(state.hadraTargets).length;
    const completedSteps = Object.entries(state.hadra).filter(([key, count]) => {
      return count >= state.hadraTargets[key as keyof typeof state.hadraTargets];
    }).length;
    return (completedSteps / totalSteps) * 100;
  };
  
  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    saveState();
  }, [state]);

  const loadState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('tijaniApp');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', state: parsedState });
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

  const saveState = async () => {
    try {
      await AsyncStorage.setItem('tijaniApp', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      isWirdComplete, 
      isWazifaComplete,
      isHadraComplete,
      getWirdStepStatus,
      getWazifaStepStatus,
      getHadraStepStatus,
      getWirdProgress,
      getWazifaProgress,
      getHadraProgress,
      getWazifaJawharaTarget,
      getCurrentSalawatFormula
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export { WIRD_TARGETS, WAZIFA_TARGETS, HADRA_TARGETS, WAZIFA_SALAT_FATIH_TARGET };