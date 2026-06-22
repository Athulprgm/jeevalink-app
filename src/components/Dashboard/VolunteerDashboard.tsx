import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, Users, MapPin, CheckCircle, XCircle, Calendar, Award } from 'lucide-react-native';
import { shadow } from '../../utils/shadow';
import { useEffect, useState, useRef } from 'react';
import api from '../../store/api';

/** Animated stat counter card */
function StatCard({
  icon,
  iconBg,
  borderColor,
  value,
  label,
  delay,
}: {
  icon: React.ReactNode;
  iconBg: string;
  borderColor: string;
  value: number;
  label: string;
  delay: number;
}) {
  const [scale] = useState(() => new Animated.Value(0.8));
  const [opacity] = useState(() => new Animated.Value(0));
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, tension: 80, friction: 7, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, [delay, opacity, scale]);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      tension: 150,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1 }}
    >
      <Animated.View style={[styles.statCard, { opacity, transform: [{ scale: Animated.multiply(scale, pressScale) }] }]}>
        <View style={[
          styles.statIcon, 
          { 
            backgroundColor: iconBg, 
            borderColor: borderColor, 
            borderWidth: 1,
            // Soft shadow for icon
            shadowColor: borderColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
            elevation: 2,
          }
        ]}>{icon}</View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const MOCK_DRIVES: any[] = [];

export default function VolunteerDashboard() {
  const { currentUser, bloodRequests, fetchBloodRequests, verifyBloodRequest } = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchBloodRequests({ verified: 'false' });
      setLoading(false);
    };
    loadData();
  }, [fetchBloodRequests]);

  const handleApprove = async (id: string) => {
    try {
      const res = await verifyBloodRequest(id);
      if (res.success) {
        Alert.alert('Success', 'Blood request verified and published!');
        fetchBloodRequests({ verified: 'false' });
      } else {
        Alert.alert('Error', res.error || 'Failed to verify request.');
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const handleReject = (id: string) => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject and delete this request from the platform?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject & Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await api.delete(`/requests/${id}`);
              if (res.data.success) {
                Alert.alert('Success', 'Request deleted successfully.');
                fetchBloodRequests({ verified: 'false' });
              } else {
                Alert.alert('Error', 'Failed to delete request.');
              }
            } catch (err: any) {
              const msg = err.response?.data?.message || 'You do not have permission to delete this request.';
              Alert.alert('Error', msg);
            }
          },
        },
      ]
    );
  };

  const pendingVerifications = bloodRequests.filter(
    (req) => !req.verified && req.status === 'Pending'
  );

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
        <StatCard
          icon={<CheckCircle color="#16A34A" size={20} />}
          iconBg="#ECFDF5"
          borderColor="#A7F3D0"
          value={14}
          label="Verified"
          delay={0}
        />
        <StatCard
          icon={<Calendar color="#8B5CF6" size={20} />}
          iconBg="#F5F3FF"
          borderColor="#D8B4FE"
          value={2}
          label="Drives"
          delay={80}
        />
        <StatCard
          icon={<Users color="#3B82F6" size={20} />}
          iconBg="#EFF6FF"
          borderColor="#BFDBFE"
          value={currentUser?.livesSaved ?? 0}
          label="Lives"
          delay={160}
        />
      </View>

      {/* Pending Verifications */}
      <View className="px-6 mb-8">
        <Text className="text-xl font-black text-slate-900 mb-6">Pending Verifications</Text>
        {loading ? (
          <ActivityIndicator color="#8B5CF6" size="large" className="my-8" />
        ) : pendingVerifications.length === 0 ? (
          <View className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm items-center">
            <Text className="text-slate-400 font-semibold text-sm">No pending verifications</Text>
          </View>
        ) : (
          pendingVerifications.map((req) => (
            <View key={req._id} className="bg-white rounded-[24px] p-5 mb-4 border border-slate-100 shadow-sm">
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 mr-4">
                  <Text className="font-black text-slate-900 text-base">
                    Patient: {req.patientName} ({req.bloodGroup}, {req.unitsRequired} Units)
                  </Text>
                  <Text className="text-slate-500 text-sm mt-1">Hospital: {req.hospitalName}</Text>
                  <View className="bg-purple-50 self-start px-2 py-0.5 rounded-full mt-2 flex-row items-center">
                    <Text className="text-purple-700 text-xs font-semibold">{req.urgencyLevel}</Text>
                  </View>
                  <View className="flex-row items-center mt-3">
                    <MapPin color="#94a3b8" size={14} />
                    <Text className="text-slate-500 text-xs ml-1.5">{req.location}</Text>
                  </View>
                </View>
              </View>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-emerald-50 border border-emerald-100 py-3 rounded-2xl"
                  onPress={() => handleApprove(req._id)}
                >
                  <CheckCircle color="#16A34A" size={16} />
                  <Text className="text-emerald-700 font-bold text-sm ml-1.5">Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center bg-red-50 border border-red-100 py-3 rounded-2xl"
                  onPress={() => handleReject(req._id)}
                >
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
              <Text className="text-slate-400 text-xs mb-4">{drive.date}</Text>
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

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
  },
});
