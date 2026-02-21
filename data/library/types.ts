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

export interface Category {
  id: CategoryId; title: string; arabicTitle: string;
  emoji: string; color: string; gradient: [string, string, string];
  description: string; count: number;
}

export type CategoryId = 'masters' | 'formulas' | 'books' | 'places' | 'words';