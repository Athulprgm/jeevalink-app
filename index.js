/**
 * index.js — JeevaLink App Entry Point
 *
 * How notification display works in this project:
 *
 *  ┌─────────────────────┬──────────────────────────────────────────────────────┐
 *  │ App state           │ Who displays the notification                        │
 *  ├─────────────────────┼──────────────────────────────────────────────────────┤
 *  │ Foreground          │ _layout.tsx onMessage handler (in-app popup/alert)   │
 *  │ Background          │ Android OS — displays from `notification` field      │
 *  │ Terminated          │ Android OS — displays from `notification` field      │
 *  └─────────────────────┴──────────────────────────────────────────────────────┘
 *
 * No setBackgroundMessageHandler is needed here because the backend ALWAYS sends
 * both a `notification` field AND a `data` field in the FCM payload. Android
 * handles display natively for any message that contains a `notification` field.
 *
 * setBackgroundMessageHandler is only required for data-only messages (no
 * `notification` field). Since our backend (FirebaseService.php) always includes
 * `notification.title` and `notification.body`, the OS notification tray handles
 * background/terminated display automatically via the `jeevalink_urgent` channel
 * created in MainActivity.kt.
 */

import 'expo-router/entry';
