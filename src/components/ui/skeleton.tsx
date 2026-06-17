/**
 * JeevaLink Skeleton — Premium Loading Skeleton
 * Used as placeholder while content loads.
 */

import React, { useEffect, useState } from 'react';
import { Animated, View, StyleSheet, type ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  const [shimmer] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: '#E2E8F0',
          opacity,
        },
        style,
      ]}
    />
  );
}

/** Pre-built skeleton for a donor card */
export function DonorCardSkeleton() {
  return (
    <View style={skeletonStyles.card}>
      <View style={skeletonStyles.row}>
        <Skeleton width={56} height={56} borderRadius={16} />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Skeleton width="60%" height={18} borderRadius={6} style={{ marginBottom: 8 }} />
          <Skeleton width="40%" height={14} borderRadius={6} />
        </View>
        <Skeleton width={40} height={40} borderRadius={8} />
      </View>
      <Skeleton width="100%" height={48} borderRadius={16} style={{ marginTop: 16 }} />
    </View>
  );
}

/** Pre-built skeleton for a notification item */
export function NotificationSkeleton() {
  return (
    <View style={skeletonStyles.notifCard}>
      <Skeleton width={56} height={56} borderRadius={16} />
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Skeleton width="75%" height={16} borderRadius={6} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={12} borderRadius={6} style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height={12} borderRadius={6} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
