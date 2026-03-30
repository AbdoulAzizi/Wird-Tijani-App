// ─────────────────────────────────────────────────────────────────────────────
// theme.ts  —  Design System · Spiritual App
// ─────────────────────────────────────────────────────────────────────────────
//
//  STRUCTURE
//  ├── 1. PRIMITIVES   Raw values — never used directly in components
//  │     ├── palette      All named colours
//  │     ├── scale        Numeric spacing scale (4-pt grid)
//  │     └── typeScale    Font-size ramp
//  │
//  ├── 2. TOKENS       Single-purpose semantic values
//  │     ├── color        Semantic colour aliases
//  │     ├── gradient     Named gradient stops
//  │     ├── text         Typography (size / weight / tracking / lineHeight)
//  │     ├── space        Semantic spacing aliases
//  │     ├── radius       Border-radius aliases
//  │     └── shadow       Text & view shadow presets
//  │
//  ├── 3. PRACTICES   Identity tokens (colors + labels per practice)
//  │     ├── PracticeKey  'wird' | 'wazifa' | 'hadra'
//  │     └── practices    Record<PracticeKey, colors + labels + route>
//  │
//  └── 4. THEME        Public API — variants consumed by components
//        ├── ThemeVariant
//        └── themes       Per-variant gradient sets
//
// ─────────────────────────────────────────────────────────────────────────────



// ─────────────────────────────────────────────────────────────────────────────
// 1. PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw colour palette — all hex values used across the design system.
 * Organised by hue family with a numeric lightness scale (100 = lightest).
 * Do NOT reference these directly in component styles — use `color.*`.
 */
export const palette = {
  emerald: {
    950: '#022c22',
    900: '#064E3B',
    800: '#065F46',
    700: '#047857',
    600: '#059669',
    500: '#10B981',
    200: '#A7F3D0',
    100: '#D1FAE5',
  },
  gold: {
    900: '#92400E',
    600: '#D97706',
    500: '#F59E0B',
    400: '#FCD34D',
    300: '#FDE68A',
    100: '#FEF3C7',
  },
  night: {
    950: '#0A0F1E',
    900: '#111827',
    800: '#0F172A',
    700: '#1E293B',
  },
  sky: {
    400: '#38BDF8',
    200: '#A5F3FC',
  },
  violet: {
    500: '#8B5CF6',
    300: '#C4B5FD',
  },
  // Wird — deep red / crimson
  crimson: {
    700: '#B91C1C',
    600: '#DC2626',
    500: '#EF4444',
    100: '#FEE2E2',
    50:  '#FEF2F2',
  },
  // Wazifa — warm amber
  amber: {
    700: '#B45309',
    600: '#D97706',
    500: '#F59E0B',
    100: '#FEF3C7',
    50:  '#FFFBEB',
  },
  // Hadra — deep violet / purple
  purple: {
    800: '#5B21B6',
    700: '#6D28D9',
    600: '#7C3AED',
    500: '#8B5CF6',
    100: '#EDE9FE',
    50:  '#F5F3FF',
  },
  status: {
    danger: '#EF4444',
  },
  base: {
    white:       '#FFFFFF',
    black:       '#000000',
    transparent: 'transparent' as const,
  },
} as const;

/**
 * 4-pt base spacing scale.
 * Keys are step numbers; values are dp (1 step = 4 dp).
 */
export const scale = {
  0:   0,
  1:   4,
  2:   8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  8:  32,
  10: 40,
  12: 48,
} as const;

/**
 * Typographic size ramp — values in dp / pt.
 */
export const typeScale = {
  '2xs':  9,
  xs:    10,
  sm:    11,
  md:    13,
  lg:    16,
  xl:    20,
  '2xl': 22,
  '3xl': 28,
} as const;



// ─────────────────────────────────────────────────────────────────────────────
// 2. TOKENS
// ─────────────────────────────────────────────────────────────────────────────

// ── 2a. Color ─────────────────────────────────────────────────────────────────

export const color = {

  bg: {
    /** Primary app surface */
    primary:     palette.emerald[900],
    /** Secondary surface / card */
    secondary:   palette.emerald[800],
    /** Subtle tertiary surface */
    tertiary:    palette.emerald[700],
    /** Dark-mode surface */
    dark:        palette.night[900],
    /** Frosted-glass overlay — white @ 10 % */
    glass:       'rgba(255,255,255,0.10)' as const,
    /** Very subtle fill — white @ 5 % */
    subtle:      'rgba(255,255,255,0.05)' as const,
    /** Interactive element fill — white @ 12 % */
    interactive: 'rgba(255,255,255,0.12)' as const,
    /** Decorative background circles */
    deco: {
      layer1: 'rgba(255,255,255,0.05)' as const,
      layer2: 'rgba(255,255,255,0.04)' as const,
      layer3: 'rgba(255,255,255,0.03)' as const,
    },
  },

  text: {
    /** High-contrast primary label */
    primary:   palette.base.white,
    /** Secondary label — soft emerald tint @ 85 % */
    secondary: 'rgba(209,250,229,0.85)' as const,
    /** Dimmed / disabled label @ 40 % */
    muted:     'rgba(209,250,229,0.40)' as const,
    /** Gold accent label (Arabic names, titles) */
    gold:      palette.gold[400],
    /** Gold with slight transparency — captions, Hijri date */
    goldSoft:  'rgba(252,211,77,0.85)' as const,
  },

  border: {
    /** Frosted glass rim */
    glass:   'rgba(255,255,255,0.18)' as const,
    /** Gold-tinted glass rim */
    gold:    'rgba(252,211,77,0.22)' as const,
    /** Badge outline — matches bg.primary for cut-out effect */
    cutout:  palette.emerald[900],
    /** Vertical name separator */
    divider: 'rgba(252,211,77,0.40)' as const,
  },

  icon: {
    /** Default icon on dark background */
    onDark:    palette.base.white,
    /** Gold icon (logo ornament) */
    gold:      palette.gold[400],
    /** Prayer-time contextual tints */
    prayerTime: {
      fajr:      palette.gold[300],
      morning:   palette.gold[300],
      afternoon: palette.gold[400],
      evening:   palette.sky[200],
      night:     palette.violet[300],
    },
  },

  status: {
    /** Notification / error badge */
    danger:   palette.status.danger,
    /** Shimmer highlight sweep */
    shimmer:  'rgba(255,255,255,0.50)' as const,
  },

} as const;

// ── 2b. Gradient ──────────────────────────────────────────────────────────────

export const gradient = {
  /** Deep emerald — default header background */
  emeraldDeep:   [palette.emerald[900], palette.emerald[800], palette.emerald[700]] as const,
  /** Vibrant emerald — light theme header */
  emeraldBright: [palette.emerald[700], palette.emerald[600], palette.emerald[500]] as const,
  /** Midnight navy — dark theme header */
  midnight:      [palette.night[950],   palette.night[900],   palette.night[800]]   as const,
  /** Five-stop gold for the animated shimmer bar */
  goldShimmer:   [palette.gold[900], palette.gold[500], palette.gold[300], palette.gold[500], palette.gold[900]] as const,
  /** Five-stop gold for the horizontal divider line */
  goldDivider:   [palette.base.transparent, palette.gold[500], palette.gold[400], palette.gold[500], palette.base.transparent] as const,
} as const;

// ── 2c. Typography ────────────────────────────────────────────────────────────

export const text = {

  /** Font-size aliases — mirrors typeScale */
  size: typeScale,

  weight: {
    regular:   '400' as const,
    medium:    '500' as const,
    semibold:  '600' as const,
    bold:      '700' as const,
    extrabold: '800' as const,
  },

  tracking: {
    tight:  -0.3,
    normal:  0,
    wide:    0.1,
    wider:   0.2,
  },

  lineHeight: {
    /** Arabic / RTL script */
    arabic: 26,
    tight:  16,
    normal: 20,
  },

} as const;

// ── 2d. Spacing ───────────────────────────────────────────────────────────────

export const space = {
  /** 3 dp — micro gap between tightly packed items */
  micro:   3,
  /** 5 dp — tight inline gap */
  tight:   5,
  /** 10 dp — standard inner gap */
  inner:   10,
  /** 12 dp — section / divider gap */
  section: 12,
  /** 14 dp — block-level gap */
  block:   14,
  /** 16 dp — screen edge margin */
  screen:  16,
} as const;

// ── 2e. Radius ────────────────────────────────────────────────────────────────

export const radius = {
  /** 2 dp — hairline cap (lines, shimmer bar) */
  hairline: 2,
  /** 9 dp — badge / small pill */
  pill:     9,
  /** 10 dp — card / date chip */
  card:     10,
  /** 11 dp — icon button */
  button:   11,
  /** Fully circular */
  circle:   9999,
} as const;

// ── 2f. Shadow ────────────────────────────────────────────────────────────────

export const shadow = {
  /** Subtle text lift */
  textSoft: {
    textShadowColor:  'rgba(0,0,0,0.20)' as const,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  /** Stronger text lift for gold/Arabic labels */
  textStrong: {
    textShadowColor:  'rgba(0,0,0,0.25)' as const,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
} as const;



// ─────────────────────────────────────────────────────────────────────────────
// 3. PRACTICES  (Wird · Wazifa · Haḍra)
// ─────────────────────────────────────────────────────────────────────────────

export type PracticeKey = 'wird' | 'wazifa' | 'hadra';

/**
 * Identity tokens for each practice — colors, labels, route.
 * Layout details stay in the component.
 */
export const practices: Record<PracticeKey, {
  route:       string;
  label:       string;
  arabicTitle: string;
  arabicLarge: string;
  description: string;
  accent:      string;
  accentLight: string;
  accentBorder:string;
  bg:          string;
}> = {
  wird: {
    route:        '/wird',
    label:        'Lāzim',
    arabicTitle:  'لازم', // "Lāzim" = "Must" — short, punchy label for the tab bar
    arabicLarge:  'وِرْد',
    description:  'Personal daily litany',
    accent:       palette.crimson[600],
    accentLight:  'rgba(220,38,38,0.13)',
    accentBorder: 'rgba(220,38,38,0.16)',
    bg:           palette.crimson[50],
  },
  wazifa: {
    route:        '/wazifa',
    label:        'Wazifa',
    arabicTitle:  'الوَظِيفَة',
    arabicLarge:  'وَظِيفَة',
    description:  'The daily collective invocation',
    accent:       palette.amber[600],
    accentLight:  'rgba(217,119,6,0.13)',
    accentBorder: 'rgba(217,119,6,0.16)',
    bg:           palette.amber[50],
  },
  hadra: {
    route:        '/hadra',
    label:        'Haḍra',
    arabicTitle:  'الحَضْرَة',
    arabicLarge:  'حَضْرَة',
    description:  'Friday sacred gathering',
    accent:       palette.purple[600],
    accentLight:  'rgba(124,58,237,0.13)',
    accentBorder: 'rgba(124,58,237,0.16)',
    bg:           palette.purple[50],
  },
} as const;



// ─────────────────────────────────────────────────────────────────────────────
// 4. THEME  (public API)
// ─────────────────────────────────────────────────────────────────────────────

export type ThemeVariant = 'default' | 'dark' | 'light';

/**
 * Map each ThemeVariant to its three-stop header gradient.
 * Usage in component:  `themes[theme]`
 */
export const themes: Record<ThemeVariant, readonly [string, string, string]> = {
  default: gradient.emeraldDeep,
  dark:    gradient.midnight,
  light:   gradient.emeraldBright,
} as const;

// ─── Convenience barrel re-export ─────────────────────────────────────────────
// Import all at once :  import * as Theme from './theme'
// Import selectively :  import { color, text, space, themes } from './theme'