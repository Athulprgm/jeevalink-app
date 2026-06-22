import { View, Text, Button, TextInput, ActivityIndicator, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { getMessaging, getToken } from '@react-native-firebase/messaging';

export default function TestFCMScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = async () => {
    if (Platform.OS === 'web') {
      setError('FCM Native module is not supported on Web. Run on Android or iOS.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fcmToken = await getToken(getMessaging());
      setToken(fcmToken);
      console.log('FCM TOKEN:', fcmToken);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve FCM token.');
      console.error('FCM Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchToken();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F8FAFC' }}>
      <Text style={{ fontSize: 22, fontWeight: '900', color: '#0F172A', marginBottom: 8 }}>
        Firebase FCM Connection Test
      </Text>
      <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 32 }}>
        Verifies that native Firebase SDK can register and fetch device push tokens.
      </Text>
      
      {loading && (
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <ActivityIndicator color="#DC2626" size="large" />
          <Text style={{ color: '#64748B', fontSize: 13, marginTop: 12 }}>Contacting Firebase servers...</Text>
        </View>
      )}
      
      {error && (
        <View style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', borderWidth: 1, borderRadius: 16, padding: 16, width: '100%', marginBottom: 24 }}>
          <Text style={{ color: '#DC2626', fontWeight: 'bold', fontSize: 14 }}>Connection Failed</Text>
          <Text style={{ color: '#B91C1C', fontSize: 12, marginTop: 4 }}>{error}</Text>
        </View>
      )}

      {token && (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text style={{ color: '#16A34A', fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
            ✓ Connected Successfully!
          </Text>
          <Text style={{ color: '#64748B', fontSize: 12, marginBottom: 12 }}>
            FCM Token logged to console and displayed below:
          </Text>
          
          <TextInput
            value={token}
            editable={false}
            selectTextOnFocus
            multiline
            style={{
              width: '100%',
              backgroundColor: '#EDF2F7',
              color: '#334155',
              padding: 12,
              borderRadius: 16,
              fontSize: 11,
              fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
              borderWidth: 1,
              borderColor: '#E2E8F0',
              textAlign: 'center',
              minHeight: 80,
              marginBottom: 24,
            }}
          />
        </View>
      )}

      {!loading && (
        <Button title={token ? "Test Again" : "Try Fetching Token"} onPress={fetchToken} color="#DC2626" />
      )}
    </View>
  );
}
