import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAppStore, isProfileComplete } from '../store/useAppStore';
import SplashScreen from '../components/SplashScreen';
import '../global.css';

export default function RootLayout() {
  const { currentUser, _hasHydrated } = useAppStore();
  const segments = useSegments();
  const router = useRouter();
  const [isSplashReady, setIsSplashReady] = useState(false);

  useEffect(() => {
    // Wait until segments are loaded, store is hydrated, and splash animation is finished
    if (!segments || !_hasHydrated || !isSplashReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inCompleteProfile = segments[1] === 'complete-profile';

    if (!currentUser && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (currentUser) {
      const complete = isProfileComplete(currentUser);
      if (!complete && !inCompleteProfile) {
        router.replace('/(auth)/complete-profile');
      } else if (complete && inAuthGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [currentUser, segments, _hasHydrated, isSplashReady, router]);

  if (!_hasHydrated || !isSplashReady) {
    return <SplashScreen onFinish={() => setIsSplashReady(true)} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

