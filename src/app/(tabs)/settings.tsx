import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useRouter } from 'expo-router';
import {
  LogOut, Moon, Sun, Bell, Mail, Smartphone, ShieldCheck, Eye, ChevronRight, Globe, Info, Palette,
} from 'lucide-react-native';
import { DesignSystemShowcase } from '../../components/ui/design-system-showcase';


type Theme = 'Light' | 'Dark' | 'System';

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
    className={`p-4 flex-row items-center justify-between ${!isLast ? 'border-b border-slate-100' : ''}`}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View className="flex-row items-center flex-1">
      <View className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center mr-4">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-slate-900 text-[15px]">{label}</Text>
        {subtitle && <Text className="text-slate-500 text-[13px] mt-0.5">{subtitle}</Text>}
      </View>
    </View>
    {right}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const [showDesignSystem, setShowDesignSystem] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [theme, setTheme] = useState<Theme>('System');

  const { logout, currentUser } = useAppStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const THEME_OPTIONS: Theme[] = ['Light', 'Dark', 'System'];
  const THEME_ICONS = { Light: <Sun color="#F59E0B" size={16} />, Dark: <Moon color="#8B5CF6" size={16} />, System: <Globe color="#3B82F6" size={16} /> };

  if (showDesignSystem) {
    return <DesignSystemShowcase onClose={() => setShowDesignSystem(false)} />;
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 pt-12" showsVerticalScrollIndicator={false}>


      {/* Header */}
      <View className="px-6 mb-8">
        <Text className="text-[28px] font-black text-slate-900">Settings</Text>
        <Text className="text-slate-500 text-sm mt-1">Manage your preferences</Text>
      </View>

      {/* Profile Quick View */}
      <View className="mx-6 bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm mb-8 flex-row items-center">
        <View className="w-14 h-14 bg-red-50 rounded-[16px] items-center justify-center mr-4">
          <Text className="text-red-600 font-black text-xl">{currentUser?.fullName?.charAt(0)}</Text>
        </View>
        <View className="flex-1">
          <Text className="font-black text-slate-900 text-lg">{currentUser?.fullName}</Text>
          <Text className="text-slate-500 text-sm capitalize mt-0.5">{currentUser?.role} · {currentUser?.bloodGroup}</Text>
        </View>
        <TouchableOpacity
          className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100"
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Text className="text-slate-700 font-bold text-[13px]">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View className="px-6 mb-3">
        <Text className="text-slate-400 font-bold text-[13px] uppercase tracking-wider">Notifications</Text>
      </View>
      <View className="mx-6 bg-white rounded-[24px] border border-slate-100 shadow-sm mb-8 overflow-hidden">
        <SettingRow
          icon={<Bell color="#DC2626" size={18} />}
          label="Push Notifications"
          subtitle="Receive alerts on your device"
          right={<Switch value={pushAlerts} onValueChange={setPushAlerts} trackColor={{ true: '#DC2626' }} thumbColor="#fff" />}
        />
        <SettingRow
          icon={<Mail color="#3B82F6" size={18} />}
          label="Email Alerts"
          subtitle="Updates sent to your email"
          right={<Switch value={emailAlerts} onValueChange={setEmailAlerts} trackColor={{ true: '#DC2626' }} thumbColor="#fff" />}
        />
        <SettingRow
          icon={<Smartphone color="#10B981" size={18} />}
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
      <View className="mx-6 bg-white rounded-[24px] border border-slate-100 shadow-sm mb-8 overflow-hidden">
        <SettingRow
          icon={<Eye color="#8B5CF6" size={18} />}
          label="Profile Visibility"
          subtitle={profileVisible ? 'Your profile is public' : 'Your profile is private'}
          right={<Switch value={profileVisible} onValueChange={setProfileVisible} trackColor={{ true: '#DC2626' }} thumbColor="#fff" />}
        />
        <SettingRow
          icon={<ShieldCheck color="#10B981" size={18} />}
          label="Privacy & Security"
          subtitle="Manage data and permissions"
          right={<ChevronRight color="#CBD5E1" size={18} />}
          onPress={() => {}}
          isLast
        />
      </View>

      {/* Appearance Section */}
      <View className="px-6 mb-3">
        <Text className="text-slate-400 font-bold text-[13px] uppercase tracking-wider">Appearance</Text>
      </View>
      <View className="mx-6 bg-white rounded-[24px] border border-slate-100 shadow-sm mb-8 p-5 overflow-hidden">
        <View className="flex-row items-center mb-3">
          <View className="w-9 h-9 bg-slate-100 rounded-xl items-center justify-center mr-3">
            {THEME_ICONS[theme]}
          </View>
          <Text className="font-semibold text-slate-900">Theme Preference</Text>
        </View>
        <View className="flex-row gap-2">
          {THEME_OPTIONS.map((t) => (
            <TouchableOpacity
              key={t}
              className={`flex-1 py-2.5 rounded-xl border items-center flex-row justify-center gap-1.5 ${theme === t ? 'bg-red-600 border-red-600' : 'bg-slate-50 border-slate-200'}`}
              onPress={() => setTheme(t)}
            >
              {theme === t && (
                t === 'Light' ? <Sun color="#fff" size={14} /> : t === 'Dark' ? <Moon color="#fff" size={14} /> : <Globe color="#fff" size={14} />
              )}
              <Text className={`text-xs font-bold ${theme === t ? 'text-white' : 'text-slate-600'}`}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Account Section */}
      <View className="px-6 mb-3">
        <Text className="text-slate-400 font-bold text-[13px] uppercase tracking-wider">Account</Text>
      </View>
      <View className="mx-6 bg-white rounded-[24px] border border-slate-100 shadow-sm mb-8 overflow-hidden">
        <SettingRow
          icon={<Palette color="#EC4899" size={18} />}
          label="Design System Showcase"
          subtitle="Preview premium UI components"
          right={<ChevronRight color="#CBD5E1" size={18} />}
          onPress={() => setShowDesignSystem(true)}
        />
        <SettingRow
          icon={<Info color="#64748b" size={18} />}
          label="About JeevaLink"
          subtitle="Version 1.0.0 · Expo SDK 56"
          right={<ChevronRight color="#CBD5E1" size={18} />}
          onPress={() => {}}
        />
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
        <Text className="text-slate-300 text-xs mt-1">Expo SDK 56 · NativeWind v4 · Zustand</Text>
      </View>
    </ScrollView>
  );
}
