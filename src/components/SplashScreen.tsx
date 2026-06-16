import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Image, Dimensions, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  // Core animations
  const [logoScale]    = useState(() => new Animated.Value(0.65));
  const [logoOpacity]  = useState(() => new Animated.Value(0));
  const [textOpacity]  = useState(() => new Animated.Value(0));
  const [textY]        = useState(() => new Animated.Value(24));
  const [taglineOpacity] = useState(() => new Animated.Value(0));
  // Heartbeat pulse ring
  const [pulseScale]   = useState(() => new Animated.Value(1));
  const [pulseOpacity] = useState(() => new Animated.Value(0.6));
  // Decorative circles
  const [circleScale1] = useState(() => new Animated.Value(0.7));
  const [circleScale2] = useState(() => new Animated.Value(0.5));
  const [circleOpacity1] = useState(() => new Animated.Value(0));
  const [circleOpacity2] = useState(() => new Animated.Value(0));
  // Dot indicator
  const [dotOpacity]   = useState(() => new Animated.Value(0));

  useEffect(() => {
    // --- Sequence ---
    // 1. Background circles burst in
    Animated.parallel([
      Animated.timing(circleOpacity1, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(circleOpacity2, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(circleScale1, { toValue: 1, tension: 30, friction: 6, useNativeDriver: true }),
      Animated.spring(circleScale2, { toValue: 1, tension: 25, friction: 7, useNativeDriver: true }),
    ]).start();

    // 2. Logo entrance
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
      ]),
    ]).start();

    // 3. Heartbeat pulse loop (after logo appears)
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseScale,   { toValue: 1.35, duration: 600, useNativeDriver: true }),
            Animated.timing(pulseOpacity, { toValue: 0,    duration: 600, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(pulseScale,   { toValue: 1,   duration: 0,   useNativeDriver: true }),
            Animated.timing(pulseOpacity, { toValue: 0.5, duration: 200, useNativeDriver: true }),
          ]),
        ])
      ).start();
    }, 700);

    // 4. Text slides up
    Animated.sequence([
      Animated.delay(700),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(textY, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      ]),
    ]).start();

    // 5. Tagline fades in
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // 6. Dot indicator
    Animated.sequence([
      Animated.delay(1400),
      Animated.timing(dotOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(onFinish, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Gradient BG — deep crimson using layered views */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {/* Decorative bg circles */}
      <Animated.View
        style={[
          styles.bgCircle1,
          { opacity: circleOpacity1, transform: [{ scale: circleScale1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.bgCircle2,
          { opacity: circleOpacity2, transform: [{ scale: circleScale2 }] },
        ]}
      />
      <Animated.View style={[styles.bgCircle3, { opacity: circleOpacity1 }]} />

      {/* Logo area */}
      <View style={styles.logoArea}>
        {/* Pulse ring */}
        <Animated.View
          style={[
            styles.pulseRing,
            { opacity: pulseOpacity, transform: [{ scale: pulseScale }] },
          ]}
        />
        {/* Second pulse ring (offset) */}
        <Animated.View
          style={[
            styles.pulseRing2,
            {
              opacity: Animated.multiply(pulseOpacity, 0.5),
              transform: [
                {
                  scale: pulseScale.interpolate({
                    inputRange: [1, 1.35],
                    outputRange: [1.1, 1.5],
                  }),
                },
              ],
            },
          ]}
        />

        {/* Logo card */}
        <Animated.View
          style={[
            styles.logoCard,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Text block */}
      <Animated.View
        style={[styles.textContainer, { opacity: textOpacity, transform: [{ translateY: textY }] }]}
      >
        <Text style={styles.title}>JeevaLink</Text>
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Connecting Lifesavers · Saving Lives
        </Animated.Text>
      </Animated.View>

      {/* Loading dots */}
      <Animated.View style={[styles.dotsRow, { opacity: dotOpacity }]}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[styles.dot, i === 1 && { backgroundColor: 'rgba(255,255,255,0.9)', width: 20 }]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  // Gradient background via layered views
  bgTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#EF4444',
  },
  bgBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.55,
    backgroundColor: '#991B1B',
    borderTopLeftRadius: 120,
  },
  // Decorative background circles
  bgCircle1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: 40,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  bgCircle3: {
    position: 'absolute',
    top: height * 0.35,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  // Logo area
  logoArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  pulseRing: {
    position: 'absolute',
    width: 176,
    height: 176,
    borderRadius: 88,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'transparent',
  },
  pulseRing2: {
    position: 'absolute',
    width: 176,
    height: 176,
    borderRadius: 88,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'transparent',
  },
  logoCard: {
    width: 130,
    height: 130,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logo: {
    width: 78,
    height: 78,
  },
  // Text
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.80)',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  // Dots
  dotsRow: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});
