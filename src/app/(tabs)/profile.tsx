import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { Edit2, Heart, Droplet, Flame, Save, X, Camera } from 'lucide-react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '@/components/ui/input';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const FieldInput = ({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = 'default',
  editMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: any;
  editMode: boolean;
}) => (
  <View style={{ marginBottom: 4 }}>
    {editMode ? (
      <Input
        label={label}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || label}
        keyboardType={keyboardType}
      />
    ) : (
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', marginBottom: 4 }}>{label}</Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
          {value || <Text style={{ fontStyle: 'italic', color: '#9CA3AF' }}>Not set</Text>}
        </Text>
      </View>
    )}
  </View>
);

export default function ProfileScreen() {
  const { currentUser, updateProfile } = useAppStore();
  const [editMode, setEditMode] = useState(false);

  // Editable fields
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [bloodGroup, setBloodGroup] = useState(currentUser?.bloodGroup || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [district, setDistrict] = useState(currentUser?.district || '');
  const [weight, setWeight] = useState(String(currentUser?.weight || ''));
  const [lastDonatedDate, setLastDonatedDate] = useState(currentUser?.lastDonatedDate || '');
  const [profilePicture, setProfilePicture] = useState(currentUser?.profilePicture || '');

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    await updateProfile({
      fullName,
      email,
      mobile,
      bloodGroup,
      address,
      city,
      district,
      weight: parseFloat(weight) || undefined,
      lastDonatedDate,
      profilePicture,
    });
    setEditMode(false);
  };

  const handleCancel = () => {
    // Reset to store values
    setFullName(currentUser?.fullName || '');
    setEmail(currentUser?.email || '');
    setMobile(currentUser?.mobile || '');
    setBloodGroup(currentUser?.bloodGroup || '');
    setAddress(currentUser?.address || '');
    setCity(currentUser?.city || '');
    setDistrict(currentUser?.district || '');
    setWeight(String(currentUser?.weight || ''));
    setLastDonatedDate(currentUser?.lastDonatedDate || '');
    setProfilePicture(currentUser?.profilePicture || '');
    setEditMode(false);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>

        {/* Hero Header */}
        <View
          className="pt-16 pb-20 px-6 items-center relative"
          style={{ backgroundColor: '#DC2626', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
        >
          {/* Avatar */}
          <View className="relative mb-4">
            <View
              className="w-24 h-24 bg-white rounded-full items-center justify-center overflow-hidden"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' }}
            >
              {profilePicture || currentUser?.profilePicture ? (
                <Image source={{ uri: profilePicture || currentUser?.profilePicture }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Text className="text-3xl font-black text-red-600">{currentUser?.fullName?.charAt(0)}</Text>
              )}
            </View>
            {editMode && (
              <TouchableOpacity
                className="absolute bottom-0 right-0 bg-white w-8 h-8 rounded-full items-center justify-center shadow-md"
                onPress={handlePickImage}
              >
                <Camera color="#DC2626" size={14} />
              </TouchableOpacity>
            )}
          </View>

          {!editMode && (
            <>
              <Text className="text-2xl font-black text-white">{currentUser?.fullName}</Text>
              <Text className="text-red-200 mt-1 text-sm">{currentUser?.email}</Text>
              <View className="bg-white/20 self-start mt-2 px-3 py-1 rounded-full">
                <Text className="text-white font-bold text-xs capitalize">{currentUser?.role}</Text>
              </View>
            </>
          )}

          {/* Edit / Save / Cancel Buttons */}
          {!editMode ? (
            <TouchableOpacity
              className="absolute top-14 right-5 bg-white/20 p-2.5 rounded-full"
              onPress={() => setEditMode(true)}
            >
              <Edit2 color="#fff" size={18} />
            </TouchableOpacity>
          ) : (
            <View className="absolute top-14 right-5 flex-row gap-2">
              <TouchableOpacity className="bg-white/20 p-2.5 rounded-full" onPress={handleCancel}>
                <X color="#fff" size={18} />
              </TouchableOpacity>
              <TouchableOpacity className="bg-white p-2.5 rounded-full" onPress={handleSave}>
                <Save color="#DC2626" size={18} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Stats Row */}
        <View className="-mt-10 mx-6 mb-8">
          <View className="bg-white rounded-[24px] p-6 shadow-md border border-slate-100 flex-row justify-around">
            <View className="items-center">
              <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mb-1">
                <Heart color="#10B981" size={18} fill="#10B981" />
              </View>
              <Text className="text-2xl font-black text-slate-900">{currentUser?.livesSaved}</Text>
              <Text className="text-slate-500 text-xs">Lives Saved</Text>
            </View>
            <View className="w-px bg-slate-100" />
            <View className="items-center">
              <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mb-1">
                <Droplet color="#DC2626" size={18} fill="#DC2626" />
              </View>
              <Text className="text-2xl font-black text-slate-900">{currentUser?.totalDonations}</Text>
              <Text className="text-slate-500 text-xs">Donations</Text>
            </View>
            <View className="w-px bg-slate-100" />
            <View className="items-center">
              <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center mb-1">
                <Flame color="#F59E0B" size={18} />
              </View>
              <Text className="text-2xl font-black text-slate-900">{currentUser?.rewardPoints}</Text>
              <Text className="text-slate-500 text-xs">Points</Text>
            </View>
          </View>
        </View>

        {/* Profile Form */}
        <View className="px-6 mb-8">
          {editMode && (
            <View className="bg-blue-50 border border-blue-200 rounded-[24px] p-5 mb-6 flex-row items-center">
              <Edit2 color="#3B82F6" size={16} />
              <Text className="text-blue-700 font-semibold text-[13px] ml-2">Edit your profile details below</Text>
            </View>
          )}

          <View className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm mb-6">
            <Text className="text-[20px] font-black text-slate-900 mb-6">Personal Info</Text>
            <FieldInput label="Full Name" value={fullName} onChange={setFullName} editMode={editMode} />
            <FieldInput label="Email Address" value={email} onChange={setEmail} keyboardType="email-address" editMode={editMode} />
            <FieldInput label="Mobile Number" value={mobile} onChange={setMobile} keyboardType="phone-pad" editMode={editMode} />
          </View>

          {currentUser?.role === 'donor' && (
            <>
              <View className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm mb-6">
                <Text className="text-[20px] font-black text-slate-900 mb-6">Donor Details</Text>

                {/* Blood Group */}
                <Text className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Blood Group</Text>
                {editMode ? (
                  <View className="flex-row flex-wrap gap-2 mb-4">
                    {BLOOD_GROUPS.map((bg) => (
                      <TouchableOpacity
                        key={bg}
                        className={`px-4 py-2 rounded-xl border ${bloodGroup === bg ? 'bg-red-600 border-red-600' : 'bg-white border-slate-200'}`}
                        onPress={() => setBloodGroup(bg)}
                      >
                        <Text className={`font-bold text-sm ${bloodGroup === bg ? 'text-white' : 'text-slate-700'}`}>{bg}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text className="text-slate-900 font-semibold text-base py-1 mb-4">{bloodGroup || 'Not set'}</Text>
                )}

                <FieldInput label="Weight (kg)" value={weight} onChange={setWeight} keyboardType="numeric" placeholder="e.g. 70" editMode={editMode} />
                <FieldInput label="Last Donated Date" value={lastDonatedDate} onChange={setLastDonatedDate} placeholder="YYYY-MM-DD" editMode={editMode} />
              </View>
            </>
          )}

          <View className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm mb-8">
            <Text className="text-[20px] font-black text-slate-900 mb-6">Address</Text>
            <FieldInput label="Street Address" value={address} onChange={setAddress} editMode={editMode} />
            <FieldInput label="City" value={city} onChange={setCity} editMode={editMode} />
            <FieldInput label="District" value={district} onChange={setDistrict} editMode={editMode} />
          </View>

          {/* Donation History */}
          {currentUser?.role === 'donor' && (
            <View>
              <Text className="text-[20px] font-black text-slate-900 mb-6">Donation History</Text>
              <View className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm items-center mb-8">
                <Text className="text-slate-400 font-semibold text-sm">No donation history recorded</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
