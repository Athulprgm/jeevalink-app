import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { DesignSystem } from '@/constants/design-system';
import { shadow } from '@/utils/shadow';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: DesignSystem.cards.radius, // 24px
    padding: DesignSystem.cards.padding, // 20px
    borderWidth: DesignSystem.cards.border ? 1 : 0,
    borderColor: DesignSystem.glass.borderDark,
    width: '100%',
    marginBottom: DesignSystem.grid.card_gap, // 16px
    ...DesignSystem.elevation.e1,
  },
});

