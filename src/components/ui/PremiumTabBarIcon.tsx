import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Home, Search, Droplet, Bell, User, Settings } from 'lucide-react-native';

export type TabIconName = 'home' | 'search' | 'droplet' | 'bell' | 'user' | 'settings';

interface PremiumTabBarIconProps {
  name: TabIconName;
  focused: boolean;
  color: any;
  size?: number;
}

export default function PremiumTabBarIcon({
  name,
  focused,
  color,
  size = 22,
}: PremiumTabBarIconProps) {
  // Core scale animation for spring effect on select
  const scaleAnim = useRef(new Animated.Value(1)).current;
  // Rotation animation for settings gear & bell wiggle
  const rotateAnim = useRef(new Animated.Value(0)).current;
  // Pulse animation for droplet heartbeat
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Opacity for the active background glow aura
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Spring scale animation
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.16 : 1.0,
      tension: 100,
      friction: 6,
      useNativeDriver: true,
    }).start();

    // 2. Active backdrop glow transition
    Animated.timing(glowOpacity, {
      toValue: focused ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();

    // 3. Tab-specific interactive micro-animations
    if (focused) {
      if (name === 'bell') {
        // Bell wobble/ring sequence
        rotateAnim.setValue(0);
        Animated.sequence([
          Animated.timing(rotateAnim, { toValue: 1, duration: 80, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(rotateAnim, { toValue: -1, duration: 100, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(rotateAnim, { toValue: 0.8, duration: 100, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(rotateAnim, { toValue: -0.8, duration: 100, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(rotateAnim, { toValue: 0.5, duration: 120, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(rotateAnim, { toValue: -0.5, duration: 120, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(rotateAnim, { toValue: 0, duration: 150, easing: Easing.linear, useNativeDriver: true }),
        ]).start();
      } else if (name === 'settings') {
        // Gear rotate 90 degrees
        rotateAnim.setValue(0);
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }).start();
      } else if (name === 'droplet') {
        // Droplet heartbeat pulsing loop
        pulseAnim.setValue(1);
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.2, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 0.95, duration: 120, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1.1, duration: 150, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1.0, duration: 200, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            Animated.delay(1200),
          ])
        ).start();
      }
    } else {
      // Clean reset when not focused
      rotateAnim.setValue(0);
      pulseAnim.setValue(1);
    }
  }, [focused, name, glowOpacity, rotateAnim, scaleAnim, pulseAnim]);

  // Tab configurations (Unified Premium colors)
  const getTabStyles = () => {
    switch (name) {
      case 'home':
        return {
          glowColor: 'rgba(239, 68, 68, 0.12)',
          activeColor: '#EF4444',
          iconComponent: <Home color={focused ? '#EF4444' : '#94A3B8'} size={size} strokeWidth={focused ? 2.5 : 2} />,
        };
      case 'search':
        return {
          glowColor: 'rgba(239, 68, 68, 0.12)',
          activeColor: '#EF4444',
          iconComponent: <Search color={focused ? '#EF4444' : '#94A3B8'} size={size} strokeWidth={focused ? 2.5 : 2} />,
        };
      case 'droplet':
        return {
          glowColor: 'rgba(239, 68, 68, 0.12)',
          activeColor: '#EF4444',
          iconComponent: (
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Droplet
                color={focused ? '#EF4444' : '#94A3B8'}
                size={size + 1}
                strokeWidth={focused ? 2.5 : 2}
                fill={focused ? '#EF4444' : 'none'}
              />
            </Animated.View>
          ),
        };
      case 'bell':
        return {
          glowColor: 'rgba(239, 68, 68, 0.12)',
          activeColor: '#EF4444',
          iconComponent: <Bell color={focused ? '#EF4444' : '#94A3B8'} size={size} strokeWidth={focused ? 2.5 : 2} />,
        };
      case 'user':
        return {
          glowColor: 'rgba(239, 68, 68, 0.12)',
          activeColor: '#EF4444',
          iconComponent: <User color={focused ? '#EF4444' : '#94A3B8'} size={size} strokeWidth={focused ? 2.5 : 2} />,
        };
      case 'settings':
        return {
          glowColor: 'rgba(239, 68, 68, 0.12)',
          activeColor: '#EF4444',
          iconComponent: <Settings color={focused ? '#EF4444' : '#94A3B8'} size={size} strokeWidth={focused ? 2.5 : 2} />,
        };
    }
  };

  const { glowColor, activeColor, iconComponent } = getTabStyles();

  // Interpolate rotation for bell (wobble) and gear (spin)
  const rotation = rotateAnim.interpolate({
    inputRange: name === 'bell' ? [-1, 1] : [0, 1],
    outputRange: name === 'bell' ? ['-15deg', '15deg'] : ['0deg', '90deg'],
  });

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Premium Glow Aura Backdrop */}
      <Animated.View
        style={[
          styles.glowBackdrop,
          {
            backgroundColor: glowColor,
            opacity: glowOpacity,
          },
        ]}
      />

      {/* Icon with rotation if applicable */}
      <Animated.View
        style={
          name === 'bell' || name === 'settings'
            ? { transform: [{ rotate: rotation }] }
            : null
        }
      >
        {iconComponent}
      </Animated.View>

      {/* Tiny active indicator pill/line at the bottom */}
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            backgroundColor: activeColor,
            opacity: glowOpacity,
            transform: [
              {
                scaleX: glowOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.2, 1],
                }),
              },
            ],
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowBackdrop: {
    position: 'absolute',
    width: 44,
    height: 32,
    borderRadius: 14,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 14,
    height: 3,
    borderRadius: 1.5,
  },
});
