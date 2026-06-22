import { useEffect, useState, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useAppStore, isProfileComplete } from '../store/useAppStore';
import SplashScreen from '../components/SplashScreen';
import '../global.css';
import { LogBox } from 'react-native';

// Suppress web-only deprecation warnings that don't affect Android/iOS.
// - "shadow*" props are valid on native; only web needs boxShadow.
// - useNativeDriver is valid on native; web falls back to JS animations automatically.
// - pointerEvents as a prop is still valid in our RN version.
LogBox.ignoreLogs([
  '"shadow*" style props are deprecated',
  'useNativeDriver',
  'props.pointerEvents is deprecated',
]);


// React Native
import {
  Platform,
  Modal,
  StyleSheet,
  Linking,
  Share,
  Alert,
  Vibration,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

// Firebase Messaging — the only notification library used
import {
  getMessaging,
  onMessage,
  onTokenRefresh,
  requestPermission,
  getToken,
  getInitialNotification,
  onNotificationOpenedApp,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';

// Video player for SOS siren audio
import { useVideoPlayer, VideoView } from 'expo-video';

// Icons
import { Phone, Share2, ShieldAlert, X } from 'lucide-react-native';

// Notification utilities (pure RN — no third-party notification library)
import {
  navigateFromNotification,
  requestAndroidNotificationPermission,
  promptBatteryOptimization,
} from '../utils/notifications';

// ─── Emergency Alert Popup ────────────────────────────────────────────────────
// Full-screen modal shown when an Emergency SOS FCM message arrives while the
// app is in the foreground. Plays siren audio via expo-video (hidden VideoView).

function EmergencyAlertPopup({
  request,
  onClose,
  onAccept,
}: {
  request: any;
  onClose: () => void;
  onAccept: (id: string) => void;
}) {
  const player = useVideoPlayer(require('../../assets/siren.mp3'), (p) => {
    p.loop = true;
    p.muted = false;
    // Start playing immediately inside the setup callback so audio begins
    // as soon as the player is initialized — no async useEffect delay.
    if (Platform.OS !== 'web') {
      p.play();
    }
  });

  useEffect(() => {
    // Fallback: also try playing in effect in case setup callback was too early.
    if (player && Platform.OS !== 'web') {
      try { player.play(); } catch {}
    }
    return () => {
      if (player) {
        try { player.pause(); } catch {}
      }
    };
  }, [player]);

  const handleCall = () => {
    if (!request.contactNumber) return;
    Linking.openURL(`tel:${request.contactNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to open device dialer.');
    });
  };

  const handleWhatsApp = () => {
    const text =
      `🚨 *JEEVALINK EMERGENCY BLOOD REQUEST* 🚨\n\n` +
      `🩸 *Blood Group:* ${request.bloodGroup}\n` +
      `👤 *Patient:* ${request.patientName}\n` +
      `🏥 *Hospital:* ${request.hospitalName}\n` +
      `📞 *Contact:* ${request.contactNumber}\n\n` +
      `Please share this to help save a life!`;

    Linking.openURL(
      `whatsapp://send?text=${encodeURIComponent(text)}`
    ).catch(() => {
      Share.share({ message: text });
    });
  };

  return (
    <Modal visible={!!request} transparent animationType="fade">
      {Platform.OS !== 'web' && player && (
        <VideoView
          player={player}
          style={{ width: 0, height: 0, position: 'absolute', opacity: 0 }}
        />
      )}
      <View style={styles.modalOverlay}>
        <View style={styles.alertBox}>
          <View style={styles.alertHeader}>
            <ShieldAlert color="#fff" size={44} strokeWidth={2} />
            <Text style={styles.alertHeaderTitle}>EMERGENCY SOS ALERT</Text>
          </View>

          <View style={styles.alertBody}>
            <View style={styles.bgGroupWrap}>
              <Text style={styles.bgGroupLabel}>Required Blood</Text>
              <Text style={styles.bgGroupVal}>{request.bloodGroup}</Text>
              <Text style={styles.unitsVal}>
                {request.unitsRequired} Units needed
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Patient Name</Text>
              <Text style={styles.infoVal}>{request.patientName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Hospital / Location</Text>
              <Text style={styles.infoVal}>{request.hospitalName}</Text>
            </View>

            {request.additionalNotes ? (
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>
                  {`"${request.additionalNotes}"`}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.btnAccept}
              onPress={() => {
                onAccept(request._id);
                onClose();
              }}
            >
              <Text style={styles.btnAcceptText}>Accept Donation</Text>
            </TouchableOpacity>

            <View style={styles.rowBtns}>
              <TouchableOpacity style={styles.btnCall} onPress={handleCall}>
                <Phone color="#fff" size={16} strokeWidth={2.5} />
                <Text style={styles.btnCallText}>Call Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnWhatsApp}
                onPress={handleWhatsApp}
              >
                <Share2 color="#059669" size={16} />
                <Text style={styles.btnWhatsAppText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.btnClose} onPress={onClose}>
            <X color="#ffffff" size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Beta Welcome Popup ───────────────────────────────────────────────────────
function BetaWelcomePopup({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.betaOverlay}>
        <View style={styles.betaBox}>
          <View style={styles.betaBadge}>
            <Text style={styles.betaBadgeText}>BETA</Text>
          </View>
          <Text style={styles.betaTitle}>JeevaLink Beta</Text>
          <Text style={styles.betaMessage}>
            Welcome to the first beta release of JeevaLink.{'\n\n'}
            We're still refining features and improving performance. You may experience occasional issues during testing.{'\n\n'}
            Thank you for helping us build a better experience.
          </Text>
          <TouchableOpacity style={styles.betaBtn} onPress={onClose}>
            <Text style={styles.betaBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout() {
  const {
    currentUser,
    _hasHydrated,
    token,
    registerPushToken,
    acceptBloodRequest,
    themePreference,
  } = useAppStore();
  const segments = useSegments();
  const router = useRouter();
  const { setColorScheme } = useColorScheme();
  const [isSplashReady, setIsSplashReady] = useState(false);
  const [activeSOSRequest, setActiveSOSRequest] = useState<any | null>(null);
  const [showBetaPopup, setShowBetaPopup] = useState(false);

  // Sync theme with NativeWind
  useEffect(() => {
    if (themePreference) {
      setColorScheme(themePreference.toLowerCase() as 'light' | 'dark' | 'system');
    }
  }, [themePreference, setColorScheme]);

  // Prevent duplicate token registrations within the same session
  const registeredTokenRef = useRef<string | null>(null);

  // ── Beta Version Popup ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isSplashReady) {
      setShowBetaPopup(true);
    }
  }, [isSplashReady]);

  // ── 1. Auth redirect ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!segments || !_hasHydrated || !isSplashReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isPublicRoute = segments[0] === 'terms' || segments[0] === 'privacy';
    const inCompleteProfile = segments[1] === 'complete-profile';

    if (!currentUser && !inAuthGroup && !isPublicRoute) {
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

  // ── 2. FCM foreground listener + background-tap handler ─────────────────────
  useEffect(() => {
    if (Platform.OS === 'web') return;

    // ── Foreground: app is open when FCM message arrives ──
    // - SOS type → show in-app popup with siren audio
    // - All other types → show Alert with a "View" button that navigates
    //   (Android doesn't auto-show a banner when the app is foregrounded)
    const unsubscribeFCM = onMessage(
      getMessaging(),
      async (remoteMessage) => {
        console.log(
          '[JeevaLink] Foreground FCM received. Full message:',
          JSON.stringify(remoteMessage, null, 2)
        );

        const data = (remoteMessage.data ?? {}) as Record<string, string>;
        console.log('[JeevaLink] Foreground FCM data payload:', JSON.stringify(data));

        const getString = (val: any): string =>
          typeof val === 'string' ? val.trim() : (val != null ? String(val) : '');

        // Normalize type — backend sends 'sos', 'emergency_sos', 'SOS', 'EMERGENCY_SOS'
        const rawType = getString(data.type) || getString(data.notification_type);
        const type = rawType.toLowerCase().replace(/[\s-]+/g, '_'); // e.g. 'emergency sos' → 'emergency_sos'

        // Normalize urgency — backend sends 'Emergency SOS', 'emergency sos', etc.
        const rawUrgency = getString(data.urgency_level) || getString(data.urgency);
        const urgency = rawUrgency.toLowerCase().replace(/[\s-]+/g, '_'); // 'emergency sos' → 'emergency_sos'

        const isSOS =
          type === 'sos' ||
          type === 'emergency_sos' ||
          urgency === 'emergency_sos';

        console.log('[JeevaLink] type:', type, '| urgency:', urgency, '| isSOS:', isSOS);

        if (isSOS) {
          // ── Emergency SOS: full-screen popup + siren audio via expo-video ──
          Vibration.vibrate([0, 500, 200, 500, 200, 500, 200, 500]); // SOS vibration pattern
          setActiveSOSRequest({
            _id:
              getString(data.requestId) ||
              getString(data.request_id) ||
              getString(data.id),
            patientName:
              getString(data.patientName) ||
              getString(data.patient_name) ||
              'Emergency Patient',
            bloodGroup:
              getString(data.bloodGroup) ||
              getString(data.blood_group) ||
              'O+',
            unitsRequired:
              getString(data.unitsRequired) ||
              getString(data.units_required) ||
              '1',
            hospitalName:
              getString(data.hospitalName) ||
              getString(data.hospital_name) ||
              'Local Hospital',
            contactNumber:
              getString(data.contactNumber) ||
              getString(data.contact_number) ||
              '',
            location: getString(data.location),
            additionalNotes:
              getString(data.additionalNotes) ||
              getString(data.additional_notes) ||
              '',
          });
        } else {
          // ── Normal blood request: vibrate + Alert with navigation ──
          // Vibration pattern: short-long-short (distinct from SOS pattern)
          // Background equivalent: `jeevalink_urgent` channel plays the default
          // system notification sound.
          Vibration.vibrate([0, 250, 100, 250]);

          const title =
            remoteMessage.notification?.title ||
            getString(data.title) ||
            'JeevaLink Alert';
          const body =
            remoteMessage.notification?.body ||
            getString(data.message) ||
            getString(data.body) ||
            'You have a new notification.';

          Alert.alert(
            title,
            body,
            [
              {
                text: 'View',
                onPress: () => navigateFromNotification(data, router),
              },
              { text: 'Dismiss', style: 'cancel' },
            ],
            { cancelable: true }
          );
        }
      }
    );

    // ── Background tap: user tapped notification while app was backgrounded ──
    // Fires after app resumes from background state.
    const unsubscribeOpenedApp = onNotificationOpenedApp(
      getMessaging(),
      (remoteMessage) => {
        console.log(
          '[JeevaLink] App resumed from backgrounded notification:',
          remoteMessage.messageId
        );
        const data = (remoteMessage.data ?? {}) as Record<string, string>;
        // Small delay to ensure router is mounted
        setTimeout(() => navigateFromNotification(data, router), 300);
      }
    );

    return () => {
      unsubscribeFCM();
      unsubscribeOpenedApp();
    };
  }, [router]);

  // ── 3. Cold-start: handle notification tap from terminated state ─────────────
  // getInitialNotification fires once when app is cold-launched by tapping
  // a notification. Must run after the router/splash is ready.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!isSplashReady) return;

    getInitialNotification(getMessaging()).then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          '[JeevaLink] App cold-started from notification:',
          remoteMessage.messageId
        );
        const data = (remoteMessage.data ?? {}) as Record<string, string>;
        setTimeout(() => navigateFromNotification(data, router), 500);
      }
    });
  }, [isSplashReady, router]);

  // ── 4. Permission request + FCM token registration + token refresh ───────────
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!currentUser || !token) return;

    let unsubscribeTokenRefresh: (() => void) | undefined;

    const setupPush = async () => {
      try {
        // Step 1: Android 13+ — request POST_NOTIFICATIONS runtime permission
        const androidGranted = await requestAndroidNotificationPermission();
        if (!androidGranted) {
          console.warn('[JeevaLink] Android POST_NOTIFICATIONS denied.');
          return;
        }

        // Step 2: Request FCM authorization (required to get the token)
        const authStatus = await requestPermission(getMessaging());
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.warn('[JeevaLink] FCM permission not granted.');
          return;
        }

        // Step 3: Get token and register with backend
        const pushToken = await getToken(getMessaging());
        if (pushToken && pushToken !== registeredTokenRef.current) {
          console.log('[JeevaLink] FCM token obtained, registering...');
          registeredTokenRef.current = pushToken;
          await registerPushToken(pushToken);
        }

        // Step 4: Listen for token refreshes (reboot, reinstall, cache clear)
        unsubscribeTokenRefresh = onTokenRefresh(
          getMessaging(),
          async (newToken) => {
            console.log('[JeevaLink] FCM token refreshed, re-registering...');
            if (newToken !== registeredTokenRef.current) {
              registeredTokenRef.current = newToken;
              await registerPushToken(newToken);
            }
          }
        );

        // Step 5: One-time OEM battery optimization prompt
        await promptBatteryOptimization();
      } catch (err) {
        console.error('[JeevaLink] Push setup failed:', err);
      }
    };

    setupPush();

    return () => {
      unsubscribeTokenRefresh?.();
    };
  }, [currentUser, token, registerPushToken]);

  // ── Render ──────────────────────────────────────────────────────────────────

  if (!_hasHydrated || !isSplashReady) {
    return <SplashScreen onFinish={() => setIsSplashReady(true)} />;
  }

  const handleAcceptSOS = async (id: string) => {
    try {
      const res = await acceptBloodRequest(id);
      if (res.success) {
        Alert.alert(
          'Thank you!',
          'You have accepted this emergency request. The requester has been notified.'
        );
      } else {
        Alert.alert('Error', res.error || 'Failed to accept the request.');
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>

      {activeSOSRequest && (
        <EmergencyAlertPopup
          request={activeSOSRequest}
          onClose={() => setActiveSOSRequest(null)}
          onAccept={handleAcceptSOS}
        />
      )}

      <BetaWelcomePopup 
        visible={showBetaPopup} 
        onClose={() => setShowBetaPopup(false)} 
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 15,
  },
  alertHeader: {
    backgroundColor: '#DC2626',
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  alertHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  alertBody: {
    padding: 24,
  },
  bgGroupWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bgGroupLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bgGroupVal: {
    fontSize: 52,
    fontWeight: '900',
    color: '#DC2626',
    lineHeight: 56,
  },
  unitsVal: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoVal: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '700',
  },
  notesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#CBD5E1',
    marginBottom: 24,
  },
  notesText: {
    fontSize: 13,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  btnAccept: {
    backgroundColor: '#DC2626',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnAcceptText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  rowBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  btnCall: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnCallText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  btnWhatsApp: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnWhatsAppText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 13,
  },
  btnClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  betaOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  betaBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 20,
  },
  betaBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  betaBadgeText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  betaTitle: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 16,
    textAlign: 'center',
  },
  betaMessage: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  betaBtn: {
    width: '100%',
    backgroundColor: '#DC2626',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  betaBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
