/**
 * JeevaLink Theme — Premium v2
 * Colors, typography, spacing, gradients, elevations, and animation constants.
 */

import '@/global.css';

import { Platform } from 'react-native';
import { DesignSystem } from './design-system';

export const Colors = {
  light: {
    text: DesignSystem.colors.text_primary,
    background: DesignSystem.colors.background,
    backgroundElement: DesignSystem.colors.surface,
    backgroundSelected: DesignSystem.colors.border,
    textSecondary: DesignSystem.colors.text_secondary,
    primary: DesignSystem.colors.primary,
    secondary: DesignSystem.colors.secondary,
  },
  dark: {
    text: '#ffffff',
    background: '#0f172a',
    backgroundElement: '#1e293b',
    backgroundSelected: '#334155',
    textSecondary: '#94a3b8',
    primary: DesignSystem.colors.primary,
    secondary: DesignSystem.colors.secondary,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: DesignSystem.grid.base_spacing / 4,  // 2px
  one: DesignSystem.grid.base_spacing / 2,   // 4px
  two: DesignSystem.grid.base_spacing,        // 8px (base spacing)
  three: DesignSystem.grid.base_spacing * 2,  // 16px (container padding / card gap)
  four: DesignSystem.grid.base_spacing * 3,   // 24px (section gap)
  five: DesignSystem.grid.base_spacing * 4,   // 32px
  six: DesignSystem.grid.base_spacing * 8,    // 64px
} as const;

/** Hero gradient stops — use with expo-linear-gradient */
export const Gradients = {
  /** Main crimson hero (Login, Profile, Dashboard headers) */
  heroCrimson: {
    colors: ['#EF4444', '#DC2626', '#B91C1C'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  /** Deep crimson for splash screen */
  heroCrimsonDeep: {
    colors: ['#DC2626', '#991B1B', '#7F1D1D'] as const,
    start: { x: 0, y: 0 },
    end: { x: 0.6, y: 1 },
  },
  /** Button gradient */
  buttonPrimary: {
    colors: ['#EF4444', '#DC2626'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  /** Donor passport card */
  donorCard: {
    colors: ['#EF4444', '#DC2626', '#B91C1C'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  /** Success green */
  success: {
    colors: ['#22C55E', '#16A34A'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
} as const;

/** 5-level elevation system */
export const Elevations = {
  e1: DesignSystem.elevation.e1,
  e2: DesignSystem.elevation.e2,
  e3: DesignSystem.elevation.e3,
  e4: DesignSystem.elevation.e4,
  e5: DesignSystem.elevation.e5,
  crimsonGlow: DesignSystem.elevation.crimsonGlow,
  crimsonGlowStrong: DesignSystem.elevation.crimsonGlowStrong,
  floatingNav: DesignSystem.elevation.floatingNav,
} as const;

/** Animation duration & spring config */
export const Animations = {
  fast: DesignSystem.animations.duration.fast,
  normal: DesignSystem.animations.duration.normal,
  slow: DesignSystem.animations.duration.slow,
  splash: DesignSystem.animations.duration.splash,
  spring: DesignSystem.animations.easing.spring,
  springBouncy: DesignSystem.animations.easing.springBouncy,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/** Floating nav bottom offset — content should have this paddingBottom */
export const FloatingNavOffset = 100;
