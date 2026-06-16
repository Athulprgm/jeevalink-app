/**
 * JeevaLink Badge — Premium Unified Status Badge
 * Used for urgency levels, availability states, and status indicators.
 */

import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export type BadgeVariant =
  | 'emergency'
  | 'urgent'
  | 'normal'
  | 'fulfilled'
  | 'available'
  | 'unavailable'
  | 'points'
  | 'role';

interface BadgeConfig {
  bg: string;
  text: string;
  dot: string;
  label: string;
}

const BADGE_CONFIG: Record<BadgeVariant, BadgeConfig> = {
  emergency: { bg: '#FEF2F2', text: '#DC2626', dot: '#DC2626', label: '🚨 Emergency SOS' },
  urgent:    { bg: '#FFFBEB', text: '#D97706', dot: '#F59E0B', label: '⚡ Urgent' },
  normal:    { bg: '#ECFDF5', text: '#059669', dot: '#10B981', label: '✅ Normal' },
  fulfilled: { bg: '#ECFDF5', text: '#059669', dot: '#10B981', label: '✓ Fulfilled' },
  available: { bg: '#ECFDF5', text: '#059669', dot: '#10B981', label: 'Available' },
  unavailable: { bg: '#FFF7ED', text: '#D97706', dot: '#F59E0B', label: 'Donated Recently' },
  points:    { bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B', label: '' },
  role:      { bg: '#EFF6FF', text: '#2563EB', dot: '#3B82F6', label: '' },
};

export interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export function Badge({ variant, label, showDot = true, size = 'sm', pulse = false }: BadgeProps) {
  const config = BADGE_CONFIG[variant];
  const displayLabel = label || config.label;
  const [pulseAnim] = React.useState(() => new Animated.Value(1));

  React.useEffect(() => {
    if (!pulse) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulse, pulseAnim]);

  const isLarge = size === 'md';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        isLarge && styles.badgeLarge,
      ]}
    >
      {showDot && (
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: config.dot },
            isLarge && styles.dotLarge,
            pulse && { transform: [{ scale: pulseAnim }] },
          ]}
        />
      )}
      <Text
        style={[
          styles.label,
          { color: config.text },
          isLarge && styles.labelLarge,
        ]}
        numberOfLines={1}
      >
        {displayLabel}
      </Text>
    </View>
  );
}

/** Maps urgency string → BadgeVariant */
export function urgencyToVariant(level: string): BadgeVariant {
  if (level === 'Emergency SOS') return 'emergency';
  if (level === 'Urgent') return 'urgent';
  if (level === 'Normal') return 'normal';
  return 'normal';
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dotLarge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  labelLarge: {
    fontSize: 13,
  },
});
