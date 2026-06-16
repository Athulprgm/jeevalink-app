/**
 * JeevaLink Input — Premium v2
 * Animated focus glow, floating label support, improved validation states.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  type TextInputProps,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { DesignSystem } from '@/constants/design-system';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  style?: StyleProp<ViewStyle>;
  inputStyle?: TextInputProps['style'];
}

export function Input({
  label,
  error,
  success,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  placeholder,
  value,
  onFocus,
  onBlur,
  secureTextEntry,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const labelAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(glowAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
      Animated.timing(labelAnim, { toValue: 1, duration: 180, useNativeDriver: false }),
    ]).start();
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(glowAnim, { toValue: 0, duration: 200, useNativeDriver: false }),
      Animated.timing(labelAnim, { toValue: 0, duration: 180, useNativeDriver: false }),
    ]).start();
    if (onBlur) onBlur(e);
  };

  const shadowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.15] });
  const shadowRadius = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 12] });
  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [DesignSystem.colors.text_secondary, DesignSystem.colors.primary],
  });

  const borderColor = error
    ? DesignSystem.colors.error
    : success
    ? DesignSystem.colors.success
    : isFocused
    ? DesignSystem.colors.primary
    : 'rgba(0,0,0,0.08)';

  return (
    <View style={[styles.container]}>
      {label && (
        <Animated.Text style={[styles.label, { color: error ? '#DC2626' : labelColor }]}>
          {label}
        </Animated.Text>
      )}

      <Animated.View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            shadowColor: '#DC2626',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity,
            shadowRadius,
            elevation: isFocused ? 3 : 0,
          },
          style,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={`rgba(100, 116, 139, ${DesignSystem.input_fields.placeholder_opacity})`}
          style={[styles.textInput, inputStyle]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          accessibilityLabel={label || placeholder}
          {...props}
        />

        {rightIcon && (
          <Pressable
            onPress={onRightIconPress}
            style={styles.rightIconContainer}
            accessibilityRole={onRightIconPress ? 'button' : 'image'}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {rightIcon}
          </Pressable>
        )}
      </Animated.View>

      {error && <Text style={styles.errorText}>⚠ {error}</Text>}
      {success && !error && <Text style={styles.successText}>✓ Looks good</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: DesignSystem.grid.base_spacing * 2,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: DesignSystem.input_fields.height,
    borderRadius: DesignSystem.input_fields.radius,
    borderWidth: DesignSystem.input_fields.border_width,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: DesignSystem.colors.text_primary,
    fontSize: DesignSystem.typography.body.size,
    fontWeight: '500',
    paddingVertical: 0,
  },
  leftIconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconContainer: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: DesignSystem.colors.error,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 4,
  },
  successText: {
    color: DesignSystem.colors.success,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 4,
  },
});
