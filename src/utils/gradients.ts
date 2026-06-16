/**
 * JeevaLink Gradient Utilities
 * Reusable gradient configurations for expo-linear-gradient.
 */

import type { ViewStyle } from 'react-native';

export type GradientConfig = {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
};

/** Crimson hero — full bleed headers */
export const GRADIENT_HERO_CRIMSON: GradientConfig = {
  colors: ['#EF4444', '#DC2626', '#B91C1C'],
  start: { x: 0.1, y: 0 },
  end: { x: 0.9, y: 1 },
};

/** Deep crimson — splash screen */
export const GRADIENT_HERO_DEEP: GradientConfig = {
  colors: ['#EF4444', '#DC2626', '#7F1D1D'],
  start: { x: 0, y: 0 },
  end: { x: 0.8, y: 1 },
};

/** Button primary gradient */
export const GRADIENT_BUTTON_PRIMARY: GradientConfig = {
  colors: ['#F87171', '#DC2626'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
};

/** Donor passport card gradient */
export const GRADIENT_DONOR_CARD: GradientConfig = {
  colors: ['#EF4444', '#DC2626', '#991B1B'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

/** Medical blue accent */
export const GRADIENT_MEDICAL_BLUE: GradientConfig = {
  colors: ['#3B82F6', '#2563EB'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
};

/** Success green */
export const GRADIENT_SUCCESS: GradientConfig = {
  colors: ['#4ADE80', '#16A34A'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
};

/** Glassmorphism card style */
export const glassStyle = (opacity = 0.9): ViewStyle => ({
  backgroundColor: `rgba(255,255,255,${opacity})`,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.6)',
});

/** Crimson glow shadow for brand elements */
export const crimsonGlowShadow = (intensity: 'soft' | 'medium' | 'strong' = 'medium') => {
  const map = {
    soft:   { shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
    medium: { shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
    strong: { shadowOpacity: 0.35, shadowRadius: 28, shadowOffset: { width: 0, height: 12 } },
  };
  return { shadowColor: '#DC2626', elevation: 12, ...map[intensity] };
};
