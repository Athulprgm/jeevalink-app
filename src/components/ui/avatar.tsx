/**
 * JeevaLink Avatar — Premium Avatar with Gradient Fallback
 */

import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';

const GRADIENT_PAIRS = [
  ['#EF4444', '#DC2626'],
  ['#3B82F6', '#2563EB'],
  ['#8B5CF6', '#7C3AED'],
  ['#10B981', '#059669'],
  ['#F59E0B', '#D97706'],
  ['#EC4899', '#DB2777'],
];

function getGradientIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return hash % GRADIENT_PAIRS.length;
}

export interface AvatarProps {
  name: string;
  size?: number;
  borderRadius?: number;
  ringColor?: string;
  style?: ViewStyle;
}

export function Avatar({ name, size = 56, borderRadius, style }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const idx = getGradientIndex(name);
  const [from, to] = GRADIENT_PAIRS[idx];
  const radius = borderRadius ?? size / 4;
  const fontSize = Math.max(12, size * 0.32);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: from,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: from,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        },
        style,
      ]}
    >
      <Text style={{ color: '#fff', fontSize, fontWeight: '900', letterSpacing: 0.5 }}>
        {initials}
      </Text>
    </View>
  );
}
