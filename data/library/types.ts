export interface LibraryItem {
  id: string; title: string; badge: string; badgeColor: string;
  description: string; fullDescription: string;
  arabicText: string; transliteration: string; translation: string;
  benefits: string[];
  recitation: { frequency: string; timing: string; requirements: string };
}

export interface Master {
  id: string; name: string; title: string; years: string;
  location: string; description: string; fullBiography: string;
  achievements: string[]; teachings: string[]; legacy: string;
}

export interface Book {
  id: string; title: string; arabicTitle?: string; author: string;
  description: string; fullDescription: string;
  keyTopics: string[]; significance: string;
}

export interface HolyPlace {
  id: string; name: string; arabicName?: string; location: string;
  description: string; fullDescription: string;
  significance: string; history: string; practices: string[];
}

export interface LivingWord {
  id: string; title: string; speaker: string; description: string;
  fullText: string; arabicText?: string; context: string; lessons: string[];
}

// ─── Multi-language translation entry ────────────────────────────────────────
/**
 * Represents a single translation of a nashid in a given language.
 *
 * Usage in annashid.ts:
 *   translations: [
 *     { lang: 'fr', label: 'Français', text: "Louanges...\nAccorde..." },
 *     { lang: 'en', label: 'English',  text: "Praise...\nGrant..."    },
 *   ]
 */
export interface NashidTranslation {
  lang:  string;  // ISO code: 'fr' | 'en' | 'wo' | 'ar-translit' | ...
  label: string;  // Display label shown in the language selector
  text:  string;  // Full text — verses separated by \n, same structure as arabicText
}

export interface Nashid {
  id: string;
  title: string;
  arabicTitle?: string;
  composer: string;
  composerTitle?: string;   // "Imam", "Sheikh", "Collective"
  era: string;              // e.g. "Early 20th century"
  origin: string;           // e.g. "Tivaouane, Senegal"
  description: string;
  fullDescription: string;
  arabicText?: string;
  transliteration?: string;
  translation?: string;         // Legacy single-language field (kept for backwards compat)
  translations?: NashidTranslation[];  // New multi-language field — takes precedence over translation
  themes: string[];
  occasions: string[];
  significance: string;
}

export interface Category {
  id: CategoryId; title: string; arabicTitle: string;
  emoji: string; color: string; gradient: [string, string, string];
  description: string; count: number;
}

export type CategoryId = 'masters' | 'formulas' | 'books' | 'places' | 'words' | 'annashid';