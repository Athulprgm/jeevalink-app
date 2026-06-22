import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useRouter } from 'expo-router';
import {
  LogOut, Bell, Mail, Smartphone, Eye, ChevronRight,
} from 'lucide-react-native';




const SettingRow = ({
  icon,
  label,
  subtitle,
  right,
  onPress,
  isLast,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  right: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}) => (
  <TouchableOpacity
    className={`p-4 flex-row items-center justify-between ${!isLast ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View className="flex-row items-center flex-1">
      <View className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-xl items-center justify-center mr-4">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-slate-900 dark:text-white text-[15px]">{label}</Text>
        {subtitle && <Text className="text-slate-500 dark:text-slate-400 text-[13px] mt-0.5">{subtitle}</Text>}
      </View>
    </View>
    {right}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const [pushAlerts, setPushAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);

  const { logout, currentUser } = useAppStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };



  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-900 pt-12" showsVerticalScrollIndicator={false}>


      {/* Header */}
      <View className="px-6 mb-8">
        <Text className="text-[28px] font-black text-slate-900 dark:text-white">Settings</Text>
        <Text className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your preferences</Text>
      </View>

      {/* Profile Quick View */}
      <View className="mx-6 bg-white dark:bg-slate-800 rounded-[24px] p-5 border border-slate-100 dark:border-slate-700 shadow-sm mb-8 flex-row items-center">
        <View className="w-14 h-14 bg-red-50 dark:bg-red-900/30 rounded-[16px] items-center justify-center mr-4">
          <Text className="text-red-600 dark:text-red-400 font-black text-xl">{currentUser?.fullName?.charAt(0)}</Text>
        </View>
        <View className="flex-1">
          <Text className="font-black text-slate-900 dark:text-white text-lg">{currentUser?.fullName}</Text>
          <Text className="text-slate-500 dark:text-slate-400 text-sm capitalize mt-0.5">{currentUser?.role} · {currentUser?.bloodGroup}</Text>
        </View>
        <TouchableOpacity
          className="bg-red-600 dark:bg-red-600 px-4 py-2.5 rounded-xl border border-red-600 dark:border-red-600"
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Text className="text-white font-bold text-[13px]">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View className="px-6 mb-3">
        <Text className="text-slate-400 font-bold text-[13px] uppercase tracking-wider">Notifications</Text>
      </View>
      <View className="mx-6 bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm mb-8 overflow-hidden">
        <SettingRow
          icon={<Bell color="#DC2626" size={18} />}
          label="Push Notifications"
          subtitle="Receive alerts on your device"
          right={<Switch value={pushAlerts} onValueChange={setPushAlerts} trackColor={{ true: '#DC2626' }} thumbColor="#fff" />}
        />
        <SettingRow
          icon={<Mail color="#DC2626" size={18} />}
          label="Email Alerts"
          subtitle="Updates sent to your email"
          right={<Switch value={emailAlerts} onValueChange={setEmailAlerts} trackColor={{ true: '#DC2626' }} thumbColor="#fff" />}
        />
        <SettingRow
          icon={<Smartphone color="#DC2626" size={18} />}
          label="SMS Broadcasts"
          subtitle="Emergency SMS alerts"
          right={<Switch value={smsAlerts} onValueChange={setSmsAlerts} trackColor={{ true: '#DC2626' }} thumbColor="#fff" />}
          isLast
        />
      </View>

      {/* Privacy Section */}
      <View className="px-6 mb-3">
        <Text className="text-slate-400 font-bold text-[13px] uppercase tracking-wider">Privacy</Text>
      </View>
      <View className="mx-6 bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm mb-8 overflow-hidden">
        <SettingRow
          icon={<Eye color="#DC2626" size={18} />}
          label="Profile Visibility"
          subtitle={profileVisible ? 'Your profile is public' : 'Your profile is private'}
          right={<Switch value={profileVisible} onValueChange={setProfileVisible} trackColor={{ true: '#DC2626' }} thumbColor="#fff" />}
          isLast
        />
      </View>


      {/* Account Section */}
      <View className="px-6 mb-3">
        <Text className="text-slate-400 font-bold text-[13px] uppercase tracking-wider">Account</Text>
      </View>
      <View className="mx-6 bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm mb-8 overflow-hidden">
        <SettingRow
          icon={<LogOut color="#DC2626" size={18} />}
          label="Sign Out"
          right={<ChevronRight color="#FCA5A5" size={18} />}
          onPress={handleLogout}
          isLast
        />
      </View>

      <View className="items-center mb-10">
        <Text className="text-slate-400 text-xs">JeevaLink · Connecting Lifesavers</Text>
        <Text className="text-slate-400 dark:text-slate-500 text-xs mt-1">Expo SDK 56 · NativeWind v4 · Zustand</Text>
      </View>
    </ScrollView>
  );
}
