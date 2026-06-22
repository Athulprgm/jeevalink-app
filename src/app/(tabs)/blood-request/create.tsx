import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { ChevronLeft, Check, Siren, BellRing, ShieldCheck, CircleCheck, Circle } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY_LEVELS = ['Normal', 'Urgent', 'Emergency SOS'] as const;

const URGENCY_CONFIG = {
  'Normal': {
    icon: ShieldCheck,
    iconColor: '#10B981',
    accentColor: '#10B981',
    title: 'Normal',
    desc: 'Standard donor matching',
  },
  'Urgent': {
    icon: BellRing,
    iconColor: '#F59E0B',
    accentColor: '#F59E0B',
    title: 'Urgent',
    desc: 'High priority notification',
  },
  'Emergency SOS': {
    icon: Siren,
    iconColor: '#FFFFFF',
    accentColor: '#DC2626',
    title: 'SOS',
    desc: 'Siren broadcast alert',
  },
};

const SectionLabel = ({ children }: { children: string }) => (
  <Text className="text-slate-500 text-[13px] font-bold uppercase tracking-wider mb-3">{children}</Text>
);

const InputField = ({
  placeholder,
  value,
  onChange,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: any;
  multiline?: boolean;
  numberOfLines?: number;
}) => (
  <Input
    placeholder={placeholder}
    value={value}
    onChangeText={onChange}
    keyboardType={keyboardType}
    multiline={multiline}
    numberOfLines={numberOfLines}
    style={multiline ? { height: 'auto', minHeight: 88, alignItems: 'flex-start', paddingTop: 12 } : {}}
    inputStyle={multiline ? { textAlignVertical: 'top', minHeight: 64 } : {}}
  />
);

export default function CreateBloodRequestScreen() {
  const router = useRouter();
  const { createBloodRequest, currentUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [urgencyLevel, setUrgencyLevel] = useState<'Normal' | 'Urgent' | 'Emergency SOS'>('Normal');
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [units, setUnits] = useState('1');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState(
    currentUser?.address || ''
  );
  const [city, setCity] = useState(currentUser?.city || '');
  const [district, setDistrict] = useState(currentUser?.district || '');

  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };
  const [requiredByDate, setRequiredByDate] = useState(getTomorrowDateString());
  const [contactPerson, setContactPerson] = useState('');
  const [contactMobile, setContactMobile] = useState(currentUser?.mobile || '');
  const [notes, setNotes] = useState('');

  const isValid =
    patientName.trim() &&
    bloodGroup &&
    hospitalName.trim() &&
    city.trim() &&
    district.trim() &&
    requiredByDate.trim();

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setErrorMessage(null);
    const result = await createBloodRequest({
      patientName,
      bloodGroup,
      unitsRequired: parseInt(units, 10) || 1,
      hospitalName,
      hospitalAddress,
      city,
      district,
      location: city ? `${city}, ${district}` : (currentUser?.city || 'Unknown'),
      contactNumber: contactMobile,
      contactPersonName: contactPerson,
      requiredByDate: requiredByDate,
      urgencyLevel,
      additionalNotes: notes,
    });
    setLoading(false);
    if (result.success) {
      router.back();
    } else {
      setErrorMessage(result.error || 'Failed to create request.');
    }
  };


  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="bg-white border-b border-slate-100 pt-16 pb-6 px-6 flex-row items-center">
        <TouchableOpacity
          className="mr-5 w-12 h-12 bg-slate-50 rounded-[16px] items-center justify-center border border-slate-100"
          onPress={() => router.back()}
        >
          <ChevronLeft color="#64748b" size={24} />
        </TouchableOpacity>
        <View>
          <Text className="text-[24px] font-black text-slate-900">Create Request</Text>
          <Text className="text-slate-500 text-[13px] mt-1">Fill in all required details</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>

        {/* Request Urgency */}
        <SectionLabel>Request Urgency *</SectionLabel>
        <View style={urgencyStyles.list}>
          {URGENCY_LEVELS.map((u) => {
            const cfg = URGENCY_CONFIG[u];
            const isActive = urgencyLevel === u;
            const UrgencyIcon = cfg.icon;
            const isSOS = u === 'Emergency SOS';
            return (
              <TouchableOpacity
                key={u}
                style={[
                  urgencyStyles.card,
                  isSOS && isActive && urgencyStyles.cardSOS,
                  !isSOS && isActive && { borderColor: cfg.accentColor, borderWidth: 1.5 },
                ]}
                onPress={() => setUrgencyLevel(u)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${u} urgency`}
              >
                <View
                  style={[
                    urgencyStyles.iconWrap,
                    isSOS
                      ? { backgroundColor: 'rgba(255,255,255,0.18)' }
                      : { backgroundColor: `${cfg.accentColor}18` },
                  ]}
                >
                  <UrgencyIcon
                    color={isSOS ? '#FFFFFF' : cfg.iconColor}
                    size={18}
                    strokeWidth={2.2}
                  />
                </View>
                <View style={urgencyStyles.textWrap}>
                  <Text
                    style={[
                      urgencyStyles.title,
                      isSOS && urgencyStyles.titleSOS,
                    ]}
                  >
                    {cfg.title}
                  </Text>
                  <Text
                    style={[
                      urgencyStyles.desc,
                      isSOS && urgencyStyles.descSOS,
                    ]}
                  >
                    {cfg.desc}
                  </Text>
                </View>
                {isActive
                  ? <CircleCheck color={isSOS ? '#FFFFFF' : cfg.accentColor} size={20} strokeWidth={2.5} />
                  : <Circle color="#CBD5E1" size={20} strokeWidth={1.5} />
                }
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Patient Info */}
        <SectionLabel>Patient Information</SectionLabel>
        <InputField placeholder="Patient Full Name *" value={patientName} onChange={setPatientName} />

        {/* Blood Group */}
        <SectionLabel>Required Blood Group *</SectionLabel>
        <View className="flex-row flex-wrap gap-3 mb-8">
          {BLOOD_GROUPS.map((bg) => (
            <TouchableOpacity
              key={bg}
              className={`px-5 py-3 rounded-[16px] border ${bloodGroup === bg ? 'bg-red-600 border-red-600' : 'bg-white border-slate-100'}`}
              onPress={() => setBloodGroup(bg)}
            >
              <Text className={`font-black text-[15px] ${bloodGroup === bg ? 'text-white' : 'text-slate-700'}`}>{bg}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Units */}
        <SectionLabel>Units Required</SectionLabel>
        <View className="flex-row gap-3 mb-8">
          {['1', '2', '3', '4', '5+'].map((u) => (
            <TouchableOpacity
              key={u}
              className={`flex-1 py-3.5 rounded-[16px] border items-center ${units === u || (u === '5+' && parseInt(units) >= 5) ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-100'}`}
              onPress={() => setUnits(u === '5+' ? '5' : u)}
            >
              <Text className={`font-bold text-[15px] ${units === u || (u === '5+' && parseInt(units) >= 5) ? 'text-white' : 'text-slate-700'}`}>{u}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hospital */}
        <SectionLabel>Hospital Details</SectionLabel>
        <InputField
          placeholder="Hospital Name / Location *"
          value={hospitalName}
          onChange={setHospitalName}
        />
        <InputField
          placeholder="Hospital Street Address"
          value={hospitalAddress}
          onChange={setHospitalAddress}
        />
        <InputField
          placeholder="City *"
          value={city}
          onChange={setCity}
        />
        <InputField
          placeholder="District *"
          value={district}
          onChange={setDistrict}
        />

        {/* Date Required */}
        <SectionLabel>Date Required *</SectionLabel>
        <InputField
          placeholder="YYYY-MM-DD (e.g. 2024-12-20) *"
          value={requiredByDate}
          onChange={setRequiredByDate}
        />

        {/* Contact */}
        <SectionLabel>Contact Details</SectionLabel>
        <InputField
          placeholder="Contact Person Name (Doctor / Attendant)"
          value={contactPerson}
          onChange={setContactPerson}
        />
        <InputField
          placeholder="Contact Mobile Number"
          value={contactMobile}
          onChange={setContactMobile}
          keyboardType="phone-pad"
        />

        {/* Notes */}
        <SectionLabel>Additional Notes / Medical Info</SectionLabel>
        <InputField
          placeholder="Any relevant medical details or special requirements..."
          value={notes}
          onChange={setNotes}
          multiline
          numberOfLines={4}
        />

        {/* Submit */}
        {errorMessage && (
          <Text className="text-red-600 text-[14px] font-semibold mb-4 text-center">
            {errorMessage}
          </Text>
        )}
        <Button
          label={isValid ? 'Submit Request' : 'Fill Required Fields'}
          disabled={!isValid}
          loading={loading}
          onPress={handleSubmit}
          leftIcon={isValid ? <Check color="#fff" size={20} /> : undefined}
          style={{ marginBottom: 16 }}
        />

        <TouchableOpacity className="py-4 rounded-2xl items-center mb-10" onPress={() => router.back()}>
          <Text className="text-slate-500 font-semibold">Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const urgencyStyles = StyleSheet.create({
  list: { gap: 10, marginBottom: 28 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSOS: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
    shadowColor: '#DC2626',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  titleSOS: { color: '#FFFFFF' },
  desc: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 1,
  },
  descSOS: { color: 'rgba(255,255,255,0.72)' },
});
