import { Platform, ViewStyle } from 'react-native';

/**
 * Returns cross-platform shadow styles.
 * On web: uses CSS boxShadow (no deprecation warning).
 * On native: uses React Native shadow props + elevation.
 */
export function shadow(
  color: string,
  offsetY: number,
  radius: number,
  opacity: number,
  elevation: number = 4,
): ViewStyle {
  if (Platform.OS === 'web') {
    // Parse hex color to rgb for rgba()
    let r = 0, g = 0, b = 0;
    const hex = color.replace('#', '');
    if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
    return {
      boxShadow: `0 ${offsetY}px ${radius}px rgba(${r}, ${g}, ${b}, ${opacity})`,
    };
  }
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
}

/** Pre-built common shadows */
export const shadows: {
  sm: ViewStyle;
  md: ViewStyle;
  lg: ViewStyle;
  card: ViewStyle;
  hero: ViewStyle;
  red: (intensity?: number) => ViewStyle;
} = {
  sm: shadow('#0F172A', 2, 4, 0.08, 2),
  md: shadow('#0F172A', 4, 8, 0.12, 4),
  lg: shadow('#0F172A', 8, 16, 0.15, 8),
  red: (intensity: number = 0.3) => shadow('#DC2626', 4, 8, intensity, 6),
  card: shadow('#0F172A', 4, 12, 0.1, 4),
  hero: shadow('#0F172A', 8, 20, 0.35, 12),
};
