// ─── DhikrCard — smart proxy ─────────────────────────────────────────────────
//
// Single import point for all screens. Reads dhikrCardTheme from AppContext
// and renders the matching variant. No logic, no tokens — just routing.
//
// To add a new variant:
//   1. Create DhikrCardXxx.tsx  (same DhikrCardProps interface)
//   2. Add an import below
//   3. Add a case in CARD_REGISTRY
//   4. Add the theme entry in dhikrCardThemes.ts → CardStylePicker picks it up automatically

import React from 'react';
import { useApp } from '../contexts/AppContext';

import DhikrCardGold  from './DhikrCardGold';
import DhikrCardWhite from './DhikrCardWhite';
import DhikrCardSimple  from './DhikrCardSimple';

// ─── Shared prop interface — re-exported so screens only need one import ──────

export interface DhikrCardProps {
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  target: number;
  stepNumber?: number;
  totalSteps?: number;
  prevStepTitle?: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
  onPlayAudio?: () => void;
  status?: 'completed' | 'active' | 'disabled';
  blessing?: string;
}

// ─── Registry ─────────────────────────────────────────────────────────────────
// Keys must match the `key` field in dhikrCardThemes.ts exactly.

const CARD_REGISTRY: Record<string, React.ComponentType<DhikrCardProps & { dark?: boolean }>> = {
  gold:  DhikrCardGold,
  white: DhikrCardWhite,
  simple: DhikrCardSimple,  // placeholder for future theme
};

const DEFAULT_CARD = DhikrCardWhite;

// ─── Proxy component ──────────────────────────────────────────────────────────

export default function DhikrCard(props: DhikrCardProps) {
  const { state } = useApp();
  const dark     = state.settings.darkMode;
  const themeKey = state.settings.dhikrCardTheme ?? 'gold';

  const CardComponent = CARD_REGISTRY[themeKey] ?? DEFAULT_CARD;

  return <CardComponent {...props} dark={dark} />;
}