// theme/azkar.ts — Single source of truth for the Azkar screen design system

import { Platform } from 'react-native';

// ─── Period accents ────────────────────────────────────────────────────────────
export const PERIODS = {
  morning: {
    accent:      '#D4913A',
    accentDeep:  '#8B5A1C',
    accentSoft:  '#D4913A22',
    accentBorder:'#D4913A35',
    glow:        '#E8B96044',
    bg:          ['#070401', '#0D0802', '#070401'] as const,
    label:       'Al-Sabah',
    labelAr:     'أذكار الصباح',
    labelFull:   'Azkaar Al-Sabah',
    period:      'MORNING',
  },
  evening: {
    accent:      '#6B8FC4',
    accentDeep:  '#2E4A78',
    accentSoft:  '#6B8FC422',
    accentBorder:'#6B8FC435',
    glow:        '#4A6EA844',
    bg:          ['#010209', '#02050F', '#010209'] as const,
    label:       'Al-Masa',
    labelAr:     'أذكار المساء',
    labelFull:   'Azkaar Al-Masa',
    period:      'EVENING',
  },
} as const;

// ─── Neutral whites ────────────────────────────────────────────────────────────
export const W = {
  95:  'rgba(255,255,255,0.95)',
  80:  'rgba(255,255,255,0.80)',
  60:  'rgba(255,255,255,0.60)',
  35:  'rgba(255,255,255,0.35)',
  18:  'rgba(255,255,255,0.18)',
  10:  'rgba(255,255,255,0.10)',
  '06': 'rgba(255,255,255,0.06)',
  '03': 'rgba(255,255,255,0.03)',
} as const;

// ─── Status colors ─────────────────────────────────────────────────────────────
export const GREEN      = '#4CAF7A';
export const GREEN_BG   = '#0F2A1A';
export const GREEN_GLOW = '#4CAF7A20';

// ─── Typography scale ──────────────────────────────────────────────────────────
export const TYPE = {
  // Arabic display
  arabicDisplay: { fontSize: 28, fontWeight: '300' as const, lineHeight: 52, letterSpacing: 0.5 },
  arabicLarge:   { fontSize: 22, fontWeight: '300' as const, lineHeight: 42 },
  arabicBody:    { fontSize: 16, fontWeight: '300' as const, lineHeight: 28 },

  // Latin display
  displayXL:     { fontSize: 38, fontWeight: '200' as const, letterSpacing: 0.5 },
  displayL:      { fontSize: 28, fontWeight: '200' as const, letterSpacing: 0.3 },
  displayM:      { fontSize: 22, fontWeight: '300' as const },

  // UI text
  labelCaps:     { fontSize: 9,  fontWeight: '800' as const, letterSpacing: 3.5, textTransform: 'uppercase' as const },
  labelSmall:    { fontSize: 10, fontWeight: '700' as const, letterSpacing: 2 },
  bodyM:         { fontSize: 14, fontWeight: '400' as const, lineHeight: 24 },
  bodyS:         { fontSize: 12, fontWeight: '400' as const, lineHeight: 20 },
  caption:       { fontSize: 11, fontWeight: '500' as const },

  transliteration:{ fontSize: 13, fontStyle: 'italic' as const, lineHeight: 22, letterSpacing: 0.3 },
} as const;

// ─── Spacing ───────────────────────────────────────────────────────────────────
export const SPACE = {
  xs:  4,
  sm:  8,
  md:  14,
  lg:  20,
  xl:  28,
  xxl: 40,
} as const;

// ─── Radii ─────────────────────────────────────────────────────────────────────
export const RADIUS = {
  sm:   10,
  md:   16,
  lg:   22,
  xl:   28,
  pill: 999,
} as const;

// ─── Arabic font ───────────────────────────────────────────────────────────────
export const ARABIC_FONT = Platform.OS === 'ios' ? 'Geeza Pro' : 'serif';