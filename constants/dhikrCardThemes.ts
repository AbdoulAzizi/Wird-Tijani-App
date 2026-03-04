// ─── DhikrCard Theme Registry ─────────────────────────────────────────────────
//
// SINGLE SOURCE OF TRUTH for all card themes.
//
// Each theme:
//   • defines light + dark token sets consumed by its component
//   • declares `componentName` — the key used by DhikrCard proxy to pick the right component
//   • carries display metadata (label, description, previewColor) for CardStylePicker
//
// To add a new theme:
//   1. Add tokens + metadata here
//   2. Create DhikrCardXxx.tsx that imports its tokens from here
//   3. Register DhikrCardXxx in DhikrCard.tsx CARD_REGISTRY
//   That's it — CardStylePicker auto-discovers it from DHIKR_CARD_THEMES.

// ─── Token interface ──────────────────────────────────────────────────────────

export interface DhikrCardTokens {
  // Surfaces
  bg:           string;
  bgArabic:     string;
  bgCounter:    string;
  // Borders
  border:       string;
  borderSoft:   string;
  // Text hierarchy
  text:         string;
  textMid:      string;
  textMuted:    string;
  textLocked:   string;
  // Accent — in-progress / active colour
  emerald:      string;
  emeraldMid:   string;
  emeraldLight: string;
  emeraldTrack: string;
  // Complete colour
  gold:         string;
  goldMid:      string;
  goldLight:    string;
  goldTrack:    string;
  // Locked state
  lockedBg:     string;
  lockedBorder: string;
}

export interface DhikrCardTheme {
  /** Must match the key in DhikrCard.tsx CARD_REGISTRY */
  key:           string;
  /** Component filename key — maps to CARD_REGISTRY in DhikrCard.tsx */
  componentName: string;
  /** Display name in picker */
  label:         string;
  /** One-line description */
  description:   string;
  /** Representative swatch colour (light mode) */
  previewColor:  string;
  light:         DhikrCardTokens;
  dark:          DhikrCardTokens;
}

// ─── Theme: Gold ──────────────────────────────────────────────────────────────
// Warm ivory base · deep forest green progress · antique amber completion
// Component: DhikrCardGold

export const goldTheme: DhikrCardTheme = {
  key:           'gold',
  componentName: 'gold',
  label:         'Gold',
  description:   'Warm ivory · forest green · antique amber',
  previewColor:  '#C49020',
  light: {
    bg:           '#F9F7F2',
    bgArabic:     '#F3F0E8',
    bgCounter:    '#EDE9DF',
    border:       '#DDD8CC',
    borderSoft:   '#E8E3D9',
    text:         '#1A2520',
    textMid:      '#445C52',
    textMuted:    '#8FA499',
    textLocked:   '#ABBAB3',
    emerald:      '#1B6B4A',
    emeraldMid:   '#2A9468',
    emeraldLight: '#DCF0E7',
    emeraldTrack: '#C8E6D8',
    gold:         '#9A6C00',
    goldMid:      '#C49020',
    goldLight:    '#F5ECCE',
    goldTrack:    '#EAD9A0',
    lockedBg:     '#F0EDE6',
    lockedBorder: '#D5D0C5',
  },
  dark: {
    bg:           '#0C1510',
    bgArabic:     '#091208',
    bgCounter:    '#101A14',
    border:       '#1C2E22',
    borderSoft:   '#162419',
    text:         '#DFF0E8',
    textMid:      '#7AA890',
    textMuted:    '#3D6050',
    textLocked:   '#2A4838',
    emerald:      '#3DD68C',
    emeraldMid:   '#2DBB78',
    emeraldLight: '#0A2418',
    emeraldTrack: '#0C2010',
    gold:         '#E8C060',
    goldMid:      '#D4A840',
    goldLight:    '#1E1600',
    goldTrack:    '#221800',
    lockedBg:     '#0A1410',
    lockedBorder: '#162018',
  },
};

// ─── Theme: White ─────────────────────────────────────────────────────────────
// Pure white surface · deep teal accent · clean emerald completion
// Component: DhikrCardWhite

export const whiteTheme: DhikrCardTheme = {
  key:           'white',
  componentName: 'white',
  label:         'White',
  description:   'Pure white · deep teal · emerald done state',
  previewColor:  '#FFFFFF',
  light: {
    bg:           '#FFFFFF',
    bgArabic:     '#F8F8F8',
    bgCounter:    '#F2F2F2',
    border:       '#E4E4E4',
    borderSoft:   '#EFEFEF',
    text:         '#111827',
    textMid:      '#374151',
    textMuted:    '#9CA3AF',
    textLocked:   '#D1D5DB',
    emerald:      '#047857',
    emeraldMid:   '#059669',
    emeraldLight: '#D1FAE5',
    emeraldTrack: '#A7F3D0',
    gold:         '#374151',   // "done" text — slate
    goldMid:      '#6B7280',   // ring fill — mid-grey
    goldLight:    '#F3F4F6',   // chip bg
    goldTrack:    '#E5E7EB',   // ring track
    lockedBg:     '#F9FAFB',
    lockedBorder: '#E5E7EB',
  },
  dark: {
    bg:           '#111827',
    bgArabic:     '#0D1117',
    bgCounter:    '#1A2130',
    border:       '#1F2937',
    borderSoft:   '#1A2236',
    text:         '#F9FAFB',
    textMid:      '#D1D5DB',
    textMuted:    '#6B7280',
    textLocked:   '#374151',
    emerald:      '#34D399',
    emeraldMid:   '#10B981',
    emeraldLight: '#064E3B',
    emeraldTrack: '#065F46',
    gold:         '#F9FAFB',   // "done" — pure white
    goldMid:      '#9CA3AF',   // ring fill — mid-grey
    goldLight:    '#1F2937',   // chip bg
    goldTrack:    '#111827',   // ring track
    lockedBg:     '#0F172A',
    lockedBorder: '#1E293B',
  },
};

// ─── Add future themes here ────────────────────────────────────────────────────
//
export const simpleTheme: DhikrCardTheme = {
  key:           'simple',
  componentName: 'simple',
  label:         'Simple',
  description:   'Pure white · teal accent · clean ring counter',
  previewColor:  '#059669',
  light: {
    bg:           '#FFFFFF',
    bgArabic:     '#F8F8F8',
    bgCounter:    '#F2F2F2',
    border:       '#E4E4E4',
    borderSoft:   '#EFEFEF',
    text:         '#111827',
    textMid:      '#374151',
    textMuted:    '#9CA3AF',
    textLocked:   '#D1D5DB',
    // Accent — deep teal
    emerald:      '#047857',
    emeraldMid:   '#059669',
    emeraldLight: '#D1FAE5',
    emeraldTrack: '#A7F3D0',
    // Complete — neutral slate (no gold, clean finish)
    gold:         '#374151',
    goldMid:      '#6B7280',
    goldLight:    '#F3F4F6',
    goldTrack:    '#E5E7EB',
    lockedBg:     '#F9FAFB',
    lockedBorder: '#E5E7EB',
  },
  dark: {
    bg:           '#111827',
    bgArabic:     '#0D1117',
    bgCounter:    '#1A2130',
    border:       '#1F2937',
    borderSoft:   '#1A2236',
    text:         '#F9FAFB',
    textMid:      '#D1D5DB',
    textMuted:    '#6B7280',
    textLocked:   '#374151',
    // Accent — bright mint on dark
    emerald:      '#34D399',
    emeraldMid:   '#10B981',
    emeraldLight: '#064E3B',
    emeraldTrack: '#065F46',
    // Complete — cool white
    gold:         '#F9FAFB',
    goldMid:      '#9CA3AF',
    goldLight:    '#1F2937',
    goldTrack:    '#111827',
    lockedBg:     '#0F172A',
    lockedBorder: '#1E293B',
  },
};

// ─── Registry — order controls picker display order ───────────────────────────

export const DHIKR_CARD_THEMES: DhikrCardTheme[] = [
  goldTheme,
  whiteTheme,
  simpleTheme,
];

export const DEFAULT_THEME_KEY = 'gold';

/** Safe lookup — falls back to gold if key is unknown */
export function getDhikrCardTheme(key: string): DhikrCardTheme {
  return DHIKR_CARD_THEMES.find(t => t.key === key) ?? goldTheme;
}