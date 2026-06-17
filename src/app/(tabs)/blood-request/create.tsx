import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { ChevronLeft, Check } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY_LEVELS = ['Normal', 'Urgent', 'Emergency SOS'] as const;

const URGENCY_CONFIG = {
  'Normal': { label: '✅ Normal', bg: '#ECFDF5', text: '#059669', activeBg: '#059669' },
  'Urgent': { label: '⚡ Urgent', bg: '#FFFBEB', text: '#D97706', activeBg: '#D97706' },
  'Emergency SOS': { label: '🚨 Emergency SOS', bg: '#FEF2F2', text: '#DC2626', activeBg: '#DC2626' },
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
        <View className="flex-row gap-3 mb-8">
          {URGENCY_LEVELS.map((u) => {
            const cfg = URGENCY_CONFIG[u];
            const isActive = urgencyLevel === u;
            return (
              <TouchableOpacity
                key={u}
                className="flex-1 py-4 rounded-[16px] border items-center"
                style={{
                  backgroundColor: isActive ? cfg.activeBg : '#fff',
                  borderColor: isActive ? cfg.activeBg : 'rgba(0,0,0,0.08)',
                }}
                onPress={() => setUrgencyLevel(u)}
              >
                <Text className="text-[13px] font-black text-center" style={{ color: isActive ? '#fff' : cfg.text }}>
                  {u === 'Emergency SOS' ? '🚨\nSOS' : u === 'Urgent' ? '⚡\nUrgent' : '✅\nNormal'}
                </Text>
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
