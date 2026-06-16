import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Check } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const StepIndicator = ({ step }: { step: number }) => (
  <View className="flex-row items-center justify-center mb-10 mt-2">
    {[1, 2].map((s) => (
      <View key={s} className="flex-row items-center">
        <View
          className={`w-10 h-10 rounded-[16px] items-center justify-center ${
            s <= step ? 'bg-red-600' : 'bg-slate-100'
          }`}
        >
          {s < step ? (
            <Check color="#fff" size={18} />
          ) : (
            <Text className={`font-black text-[15px] ${s <= step ? 'text-white' : 'text-slate-400'}`}>{s}</Text>
          )}
        </View>
        {s < 2 && (
          <View className={`h-[3px] w-12 mx-2 rounded-full ${step > 1 ? 'bg-red-600' : 'bg-slate-100'}`} />
        )}
      </View>
    ))}
  </View>
);

export default function RegisterScreen() {
  const [step, setStep] = useState(1);

  // Step 1 — Common fields
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 — Donor specific
  const [bloodGroup, setBloodGroup] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');



  const { register } = useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canProceedStep1 = () => {
    if (!fullName || !mobile || !password) return false;
    return true;
  };

  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage(null);
    const result = await register({
      fullName,
      mobile,
      email: email || undefined,
      password,
      role: 'donor',
      bloodGroup: bloodGroup || 'N/A',
      dateOfBirth: dateOfBirth || null,
      district,
      city,
    });
    setLoading(false);
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setErrorMessage(result.error || 'Registration failed.');
    }
  };


  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="pt-16 pb-6 px-6">
          <TouchableOpacity
            className="flex-row items-center mb-8"
            onPress={() => (step === 1 ? router.back() : setStep(1))}
          >
            <ChevronLeft color="#64748b" size={22} />
            <Text className="text-slate-500 ml-1 font-semibold text-[15px]">
              {step === 1 ? 'Back to Login' : 'Back to Step 1'}
            </Text>
          </TouchableOpacity>

          <Text className="text-[32px] font-black text-slate-900 mb-2">Create Account</Text>
          <Text className="text-slate-500 mb-8 text-[15px]">Join the JeevaLink network to save lives.</Text>

          <StepIndicator step={step} />

          {/* ─── Step 1 ─── */}
          {step === 1 && (
            <View>
              <Text className="text-[20px] font-black text-slate-900 mb-6">Basic Credentials</Text>

              <Input
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
              />

              <Input
                placeholder="Mobile Number (10 digits)"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
              />

              <Input
                placeholder="Email Address (Optional)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                placeholder="Password (min. 6 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightIcon={
                  showPassword ? (
                    <EyeOff color="#94a3b8" size={18} />
                  ) : (
                    <Eye color="#94a3b8" size={18} />
                  )
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <Button
                label="Continue"
                disabled={!canProceedStep1()}
                onPress={() => canProceedStep1() && setStep(2)}
                rightIcon={<ChevronRight color={canProceedStep1() ? '#fff' : '#94a3b8'} size={18} />}
              />
            </View>
          )}

          {/* ─── Step 2 ─── */}
          {step === 2 && (
            <View>
              <Text className="text-[20px] font-black text-slate-900 mb-6">
                Donor Details
              </Text>

              {/* Blood Group Picker */}
              <Text className="text-slate-500 text-[13px] font-semibold mb-3 ml-1 uppercase tracking-wider">Blood Group</Text>
              <View className="flex-row flex-wrap mb-6 gap-3">
                {BLOOD_GROUPS.map((bg) => (
                  <TouchableOpacity
                    key={bg}
                    className={`px-5 py-3 rounded-[16px] border ${bloodGroup === bg ? 'bg-red-600 border-red-600' : 'bg-white border-slate-100'}`}
                    onPress={() => setBloodGroup(bg)}
                  >
                    <Text className={`font-bold text-[15px] ${bloodGroup === bg ? 'text-white' : 'text-slate-700'}`}>{bg}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />

              <Input
                placeholder="District"
                value={district}
                onChangeText={setDistrict}
              />

              <Input
                placeholder="City"
                value={city}
                onChangeText={setCity}
              />

              {errorMessage && (
                <Text style={{ color: '#DC2626', fontSize: 14, fontWeight: '600', marginBottom: 16, textAlign: 'center' }}>
                  {errorMessage}
                </Text>
              )}

              <Button
                label="🩸 Register as Donor"
                onPress={handleRegister}
                loading={loading}
                style={{ marginBottom: 48 }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
