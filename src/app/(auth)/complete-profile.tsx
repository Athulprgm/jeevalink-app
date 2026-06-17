import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Save } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function CompleteProfileScreen() {
  const { currentUser, updateProfile } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [profilePicture, setProfilePicture] = useState(currentUser?.profilePicture || '');
  const [bloodGroup, setBloodGroup] = useState(currentUser?.bloodGroup || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [district, setDistrict] = useState(currentUser?.district || '');

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
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);
    const result = await updateProfile({
      profilePicture: profilePicture || undefined,
      bloodGroup: currentUser?.role === 'volunteer' ? 'N/A' : bloodGroup,
      city,
      district,
    });
    setLoading(false);
    if (!result.success) {
      setErrorMessage(result.error || 'Failed to update profile.');
    }
  };

  const isVolunteer = currentUser?.role === 'volunteer';
  const canSave = !!(city && district && (isVolunteer || (bloodGroup && bloodGroup !== 'N/A')));

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
        <View className="pt-20 px-6">
          <Text className="text-[32px] font-black text-slate-900 mb-2">Complete Profile</Text>
          <Text className="text-slate-500 mb-8 text-[15px]">Please complete your profile to continue.</Text>

          {/* Profile Picture */}
          <View className="items-center mb-8">
            <TouchableOpacity
              onPress={handlePickImage}
              className="relative w-32 h-32 bg-slate-200 rounded-full items-center justify-center border-4 border-white shadow-sm overflow-hidden"
            >
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Camera color="#94A3B8" size={32} />
              )}
              <View className="absolute bottom-0 w-full bg-black/40 py-1.5 items-center">
                <Text className="text-white text-[10px] font-bold uppercase">Upload</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Blood Group Picker for Donors */}
          {!isVolunteer && (
            <>
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
            </>
          )}

          <Input
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />

          <Input
            placeholder="District"
            value={district}
            onChangeText={setDistrict}
          />

          {errorMessage && (
            <Text className="text-red-600 text-sm font-semibold mb-4 text-center">
              {errorMessage}
            </Text>
          )}

          <Button
            label="Save Profile"
            disabled={!canSave}
            loading={loading}
            onPress={handleSave}
            leftIcon={canSave ? <Save color="#fff" size={18} /> : undefined}
            style={{ marginTop: 20 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
