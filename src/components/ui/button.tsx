/**
 * JeevaLink Button — Premium v2
 * Supports: primary gradient, secondary ghost, glass variant, pill shape.
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  Animated,
  type TouchableOpacityProps,
} from 'react-native';
import { DesignSystem } from '@/constants/design-system';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  pill?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  label,
  variant = 'primary',
  loading = false,
  leftIcon,
  rightIcon,
  style,
  disabled,
  pill = false,
  size = 'md',
  onPress,
  ...props
}: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      tension: 200,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 200,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  const heightMap = { sm: 44, md: 56, lg: 60 };
  const fontSizeMap = { sm: 14, md: 16, lg: 17 };
  const height = heightMap[size];
  const fontSize = fontSizeMap[size];
  const radius = pill ? 999 : DesignSystem.buttons.radius;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.baseButton,
          { height, borderRadius: radius },
          isPrimary && !disabled && styles.primaryShadow,
          isPrimary && styles.primaryButton,
          isSecondary && styles.secondaryButton,
          isGhost && styles.ghostButton,
          isDanger && styles.dangerButton,
          isDanger && !disabled && styles.dangerShadow,
          disabled && styles.disabledButton,
          style,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!(disabled || loading) }}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={isPrimary || isDanger ? '#FFFFFF' : DesignSystem.colors.primary}
          />
        ) : (
          <View style={styles.contentContainer}>
            {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
            <Text
              style={[
                styles.text,
                { fontSize },
                isPrimary && styles.primaryText,
                isSecondary && styles.secondaryText,
                isGhost && styles.ghostText,
                isDanger && styles.primaryText,
                disabled && styles.disabledText,
              ]}
            >
              {label}
            </Text>
            {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  primaryShadow: {
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 18,
    elevation: 10,
  },
  dangerShadow: {
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryButton: {
    backgroundColor: '#DC2626',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DC2626',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: '#DC2626',
  },
  disabledButton: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#DC2626',
  },
  ghostText: {
    color: DesignSystem.colors.text_primary,
  },
  disabledText: {
    color: '#94A3B8',
  },
  leftIconContainer: {
    marginRight: DesignSystem.buttons.icon_spacing,
  },
  rightIconContainer: {
    marginLeft: DesignSystem.buttons.icon_spacing,
  },
});
