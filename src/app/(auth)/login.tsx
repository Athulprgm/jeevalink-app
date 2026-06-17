import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Phone, Mail, X, Heart } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email'>('mobile');
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotCredential, setForgotCredential] = useState('');

  // Entrance animation
  const [formSlide] = useState(() => new Animated.Value(40));
  const [formOpacity] = useState(() => new Animated.Value(0));
  const [heroScale] = useState(() => new Animated.Value(1.05));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroScale, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(formOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(formSlide, { toValue: 0, tension: 60, friction: 9, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const { login } = useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!credential || !password) {
      setErrorMessage('Please enter both credential and password.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    const result = await login(credential, password);
    setLoading(false);
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Hero Header ─── */}
        <Animated.View style={[styles.hero, { transform: [{ scale: heroScale }] }]}>
          {/* Decorative circles */}
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />
          <View style={styles.heroCircle3} />

          {/* Logo */}
          <View style={styles.logoCard}>
            <Image
              source={require('../../../assets/logo.png')}
              style={{ width: 56, height: 56 }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.heroTitle}>JeevaLink</Text>
          <Text style={styles.heroSubtitle}>Blood Donation Network</Text>

          {/* Tagline chips */}
          <View style={styles.heroChipsRow}>
            {['🩸 Donate', '💙 Connect', '❤️ Save Lives'].map((chip) => (
              <View key={chip} style={styles.heroChip}>
                <Text style={styles.heroChipText}>{chip}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ─── Form Card ─── */}
        <Animated.View
          style={[
            styles.formCard,
            { opacity: formOpacity, transform: [{ translateY: formSlide }] },
          ]}
        >
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to continue saving lives.</Text>

          {/* Login Method Toggle */}
          <View style={styles.methodWrapper}>
            <TouchableOpacity
              style={[styles.methodItem, loginMethod === 'mobile' && styles.methodItemActive]}
              onPress={() => { setLoginMethod('mobile'); setCredential(''); }}
              activeOpacity={0.8}
            >
              <Phone color={loginMethod === 'mobile' ? '#DC2626' : '#94a3b8'} size={15} />
              <Text style={[styles.methodText, loginMethod === 'mobile' && styles.methodTextActive]}>
                Mobile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.methodItem, loginMethod === 'email' && styles.methodItemActive]}
              onPress={() => { setLoginMethod('email'); setCredential(''); }}
              activeOpacity={0.8}
            >
              <Mail color={loginMethod === 'email' ? '#DC2626' : '#94a3b8'} size={15} />
              <Text style={[styles.methodText, loginMethod === 'email' && styles.methodTextActive]}>
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <Input
            placeholder={loginMethod === 'mobile' ? 'Mobile Number' : 'Email Address'}
            value={credential}
            onChangeText={setCredential}
            keyboardType={loginMethod === 'mobile' ? 'phone-pad' : 'email-address'}
            autoCapitalize="none"
            leftIcon={
              loginMethod === 'mobile'
                ? <Phone color="#94a3b8" size={18} />
                : <Mail color="#94a3b8" size={18} />
            }
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            leftIcon={<Text style={{ fontSize: 16 }}>🔒</Text>}
            rightIcon={
              showPassword
                ? <EyeOff color="#94a3b8" size={18} />
                : <Eye color="#94a3b8" size={18} />
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          {/* Remember & Forgot */}
          <View style={styles.rememberRow}>
            <TouchableOpacity
              style={styles.rememberLeft}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setForgotModalVisible(true)}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {errorMessage && (
            <Text style={{ color: '#DC2626', fontSize: 14, fontWeight: '600', marginBottom: 16, textAlign: 'center' }}>
              {errorMessage}
            </Text>
          )}

          {/* CTA */}
          <Button label="Sign In" onPress={handleLogin} loading={loading} style={{ marginBottom: 20 }} />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.registerText}>
              {"Don't have an account? "}
              <Text style={styles.registerHighlight}>Create one</Text>
            </Text>
          </TouchableOpacity>

          {/* Tagline */}
          <View style={styles.taglineRow}>
            <Heart color="#DC2626" size={12} fill="#DC2626" />
            <Text style={styles.taglineText}>Your donation can save up to 3 lives</Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Forgot Password Modal */}
      <Modal visible={forgotModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setForgotModalVisible(false)}
              >
                <X color="#64748b" size={20} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDesc}>
              Enter your mobile number or email to receive a reset link.
            </Text>
            <Input
              placeholder="Mobile or Email"
              value={forgotCredential}
              onChangeText={setForgotCredential}
              autoCapitalize="none"
            />
            <Button label="Send Reset Link" onPress={() => setForgotModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  // Hero
  hero: {
    backgroundColor: '#DC2626',
    paddingTop: 68,
    paddingBottom: 52,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute',
    top: -60,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  heroCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  heroCircle3: {
    position: 'absolute',
    top: 20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  logoCard: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
    elevation: 12,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.80)',
    marginBottom: 20,
  },
  heroChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heroChip: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  heroChipText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 12,
    fontWeight: '600',
  },
  // Form
  formCard: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    marginBottom: 40,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 24,
  },
  // Role & method toggles
  segmentWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  segmentItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  segmentTextActive: {
    color: '#DC2626',
  },
  methodWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: 4,
  },
  methodItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 6,
  },
  methodItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  methodText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  methodTextActive: {
    color: '#0F172A',
  },
  // Remember me
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  rememberText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '700',
  },
  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  registerLink: {
    alignItems: 'center',
    marginBottom: 24,
  },
  registerText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  registerHighlight: {
    color: '#DC2626',
    fontWeight: '800',
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  taglineText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.50)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDesc: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 20,
  },
});
