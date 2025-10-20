// types/library.types.ts
import React from 'react';

export interface Category {
  id: string;
  title: string;
  arabicTitle: string;
  icon: React.ComponentType<any>; // ✅ On accepte un composant React
  color: string;
  description: string;
  count: number;
}


export interface LibraryItem {
  id: string;
  title: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  fullDescription: string;
  arabicText?: string;
  arabicTitle?: string;
  transliteration?: string;
  translation?: string;
  benefits?: string[];
  recitation?: {
    frequency: string;
    timing: string;
    requirements: string;
  };
}

export interface Master {
  id: string;
  name: string;
  title: string;
  years: string;
  location: string;
  description: string;
  fullBiography: string;
  achievements: string[];
  teachings: string[];
  legacy: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  fullDescription: string;
  keyTopics: string[];
  significance: string;
  arabicTitle?: string;
}

export interface HolyPlace {
  id: string;
  name: string;
  location: string;
  description: string;
  fullDescription: string;
  significance: string;
  history: string;
  practices: string[];
  arabicName?: string;
}

export interface LivingWord {
  id: string;
  title: string;
  speaker: string;
  description: string;
  fullText: string;
  context: string;
  lessons: string[];
  arabicText?: string;
}

export type ViewState = 'categories' | 'items';
export type ItemType = 'formula' | 'master' | 'book' | 'place' | 'word';