/**
 * notifications.ts — JeevaLink Notification Utility
 *
 * Uses ONLY @react-native-firebase/messaging — no Notifee.
 *
 * Background/terminated notification display is handled natively by Android
 * when the FCM payload contains a `notification` field. The backend must always
 * send both `notification` (for native display) and `data` (for routing).
 *
 * This module handles:
 *  - Android 13+ POST_NOTIFICATIONS permission request
 *  - OEM battery optimization prompt (Xiaomi, Samsung, Vivo, Oppo, Realme, POCO)
 *  - Navigation routing from FCM data payload (screen field or type mapping)
 */

import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import type { router as RouterType } from 'expo-router';
type Router = typeof RouterType;

// ─── Navigation Route Map ─────────────────────────────────────────────────────

/** Maps FCM data.type values to app routes */
const ROUTE_MAP: Record<string, string> = {
  blood_request:        '/(tabs)/blood-request/history',
  sos:                  '/(tabs)/alerts',
  emergency_sos:        '/(tabs)/alerts',
  donor_match:          '/(tabs)/find-donors',
  hospital_alert:       '/(tabs)/alerts',
  chat_message:         '/(tabs)/notifications',
  reward:               '/(tabs)/notifications',
  fulfilled:            '/(tabs)/notifications',
  match:                '/(tabs)/find-donors',
  general_notification: '/(tabs)/notifications',
};

/**
 * Resolves the router push path from notification data.
 * Priority: data.screen > data.type lookup > fallback /notifications
 */
export function resolveNotificationRoute(data: Record<string, string>): string {
  if (data?.screen) return data.screen;
  const type = (data?.type || data?.notification_type || '').toLowerCase();
  let route = ROUTE_MAP[type] ?? '/(tabs)/notifications';

  // Append requestId as query parameter if present in data
  const requestId = data?.requestId || data?.request_id || data?.id;
  if (requestId && (type === 'sos' || type === 'emergency_sos' || type === 'blood_request')) {
    route = `${route}?requestId=${requestId}`;
  }

  return route;
}

/**
 * Navigates the user to the appropriate screen based on notification data.
 */
export function navigateFromNotification(
  data: Record<string, string> | undefined,
  router: Router
): void {
  if (!data) {
    router.push('/(tabs)/notifications');
    return;
  }
  const route = resolveNotificationRoute(data);
  try {
    router.push(route as any);
  } catch {
    router.push('/(tabs)/notifications');
  }
}

// ─── Permission Flow ──────────────────────────────────────────────────────────

/**
 * Requests POST_NOTIFICATIONS permission on Android 13+ (API 33+).
 * No-op on older Android (auto-granted) and iOS.
 * Returns true if permission is granted.
 */
export async function requestAndroidNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  if (Platform.Version < 33) return true;

  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'JeevaLink Notifications',
        message:
          'JeevaLink needs notification permission to alert you about emergency ' +
          'blood requests nearby. Please allow notifications to save lives.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      }
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.error('[JeevaLink] POST_NOTIFICATIONS permission request failed:', err);
    return false;
  }
}

// ─── OEM Battery Optimization Prompt ─────────────────────────────────────────

const OEM_KEYWORDS = ['xiaomi', 'redmi', 'poco', 'vivo', 'oppo', 'realme', 'oneplus'];

/** Returns true if running on a known OEM device that kills background processes. */
export function isOEMDevice(): boolean {
  if (Platform.OS !== 'android') return false;
  const brand = ((Platform.constants as any)?.Brand ?? '').toLowerCase();
  const manufacturer = ((Platform.constants as any)?.Manufacturer ?? '').toLowerCase();
  return OEM_KEYWORDS.some((kw) => brand.includes(kw) || manufacturer.includes(kw));
}

/**
 * Shows a one-time prompt for OEM users to whitelist the app from battery optimization.
 * Only shows once per install.
 */
export async function promptBatteryOptimization(): Promise<void> {
  if (!isOEMDevice()) return;

  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  const shown = await AsyncStorage.getItem('jeevalink_battery_prompt_shown');
  if (shown === 'true') return;

  await AsyncStorage.setItem('jeevalink_battery_prompt_shown', 'true');

  Alert.alert(
    '🔋 Enable Background Notifications',
    'Your phone may restrict JeevaLink from sending emergency blood request alerts.\n\n' +
      'To receive all emergency alerts:\n' +
      '1. Tap "Open Settings"\n' +
      '2. Allow "Autostart" / "Background Activity"\n' +
      '3. Remove JeevaLink from battery restrictions',
    [
      {
        text: 'Open Settings',
        onPress: () => {
          Linking.openSettings().catch(() => {});
        },
      },
      { text: 'Later', style: 'cancel' },
    ],
    { cancelable: true }
  );
}
