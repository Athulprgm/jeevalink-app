import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, Users, MapPin, CheckCircle, XCircle, Calendar, Award } from 'lucide-react-native';
import { shadow } from '../../utils/shadow';


const MOCK_PENDING_VERIFICATIONS: any[] = [];
const MOCK_DRIVES: any[] = [];

export default function VolunteerDashboard() {
  const { currentUser } = useAppStore();

  return (
    <ScrollView className="flex-1 bg-slate-50 pt-12" showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View className="px-6 flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-slate-500">Volunteer Portal</Text>
          <Text className="text-2xl font-black text-slate-900">{currentUser?.fullName}</Text>
        </View>
        <View className="w-11 h-11 bg-purple-100 rounded-full items-center justify-center">
          <ShieldCheck color="#8B5CF6" size={22} />
        </View>
      </View>

      {/* Volunteer Card */}
      <View
        className="mx-6 rounded-[24px] p-6 mb-8 overflow-hidden"
        style={[{ backgroundColor: '#8B5CF6' }, shadow('#8B5CF6', 0, 8, 0.25, 12)]}
      >
        <View style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <Text className="text-purple-200 text-xs font-semibold uppercase tracking-wider mb-1">Active Volunteer</Text>
        <Text className="text-white text-xl font-black mb-2">{currentUser?.city}, {currentUser?.district}</Text>
        <View className="flex-row items-center bg-white/20 self-start px-3 py-1.5 rounded-full">
          <Award color="#E9D5FF" size={14} />
          <Text className="text-purple-100 font-bold ml-1.5 text-sm">{currentUser?.rewardPoints} Points</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View className="flex-row px-6 mb-8 gap-4">
        <View className="flex-1 bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm items-center">
          <View className="w-12 h-12 bg-emerald-50 rounded-2xl items-center justify-center mb-3">
            <CheckCircle color="#16A34A" size={20} />
          </View>
          <Text className="text-2xl font-black text-slate-900">14</Text>
          <Text className="text-slate-500 text-xs text-center mt-1">Verified</Text>
        </View>
        <View className="flex-1 bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm items-center">
          <View className="w-12 h-12 bg-purple-50 rounded-2xl items-center justify-center mb-3">
            <Calendar color="#8B5CF6" size={20} />
          </View>
          <Text className="text-2xl font-black text-slate-900">2</Text>
          <Text className="text-slate-500 text-xs text-center mt-1">Drives</Text>
        </View>
        <View className="flex-1 bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm items-center">
          <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-3">
            <Users color="#3B82F6" size={20} />
          </View>
          <Text className="text-2xl font-black text-slate-900">{currentUser?.livesSaved}</Text>
          <Text className="text-slate-500 text-xs text-center mt-1">Lives</Text>
        </View>
      </View>

      {/* Pending Verifications */}
      <View className="px-6 mb-8">
        <Text className="text-xl font-black text-slate-900 mb-6">Pending Verifications</Text>
        {MOCK_PENDING_VERIFICATIONS.length === 0 ? (
          <View className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm items-center">
            <Text className="text-slate-400 font-semibold text-sm">No pending verifications</Text>
          </View>
        ) : (
          MOCK_PENDING_VERIFICATIONS.map((item) => (
            <View key={item.id} className="bg-white rounded-[24px] p-5 mb-4 border border-slate-100 shadow-sm">
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 mr-4">
                  <Text className="font-bold text-slate-900">{item.name}</Text>
                  <View className="bg-purple-50 self-start px-2 py-0.5 rounded-full mt-2">
                    <Text className="text-purple-700 text-xs font-semibold">{item.type}</Text>
                  </View>
                  <View className="flex-row items-center mt-3">
                    <MapPin color="#94a3b8" size={14} />
                    <Text className="text-slate-500 text-xs ml-1.5">{item.location}</Text>
                  </View>
                </View>
              </View>
              <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-emerald-50 border border-emerald-100 py-3 rounded-2xl">
                  <CheckCircle color="#16A34A" size={16} />
                  <Text className="text-emerald-700 font-bold text-sm ml-1.5">Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-red-50 border border-red-100 py-3 rounded-2xl">
                  <XCircle color="#DC2626" size={16} />
                  <Text className="text-red-600 font-bold text-sm ml-1.5">Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Managed Blood Drives */}
      <View className="px-6 mb-10">
        <Text className="text-xl font-black text-slate-900 mb-6">My Blood Drives</Text>
        {MOCK_DRIVES.length === 0 ? (
          <View className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm items-center">
            <Text className="text-slate-400 font-semibold text-sm">No managed blood drives</Text>
          </View>
        ) : (
          MOCK_DRIVES.map((drive) => (
            <View key={drive.id} className="bg-white rounded-[24px] p-6 mb-4 border border-slate-100 shadow-sm">
              <Text className="font-black text-slate-900 text-base mb-2">{drive.name}</Text>
              <View className="flex-row items-center mb-2">
                <MapPin color="#94a3b8" size={14} />
                <Text className="text-slate-500 text-sm ml-1.5">{drive.location}</Text>
              </View>
              <Text className="text-slate-400 text-xs mb-4">📅 {drive.date}</Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-1 bg-slate-100 rounded-full h-2 mr-4">
                  <View
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(drive.registered / drive.slots) * 100}%` }}
                  />
                </View>
                <Text className="text-slate-600 text-sm font-semibold">{drive.registered}/{drive.slots}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
