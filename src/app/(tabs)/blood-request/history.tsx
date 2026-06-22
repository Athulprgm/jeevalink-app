import { View, Text, ScrollView, TouchableOpacity, Linking, Share, Alert, ActivityIndicator } from 'react-native';
import { useAppStore, BloodRequest } from '../../../store/useAppStore';
import { ChevronLeft, MapPin, Clock, Phone, Share2, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

const STATUS_TABS = ['All', 'Active', 'Accepted', 'Expired', 'Completed'] as const;
type StatusFilter = typeof STATUS_TABS[number];

const getEmergencyStatus = (req: BloodRequest): 'active' | 'accepted' | 'expired' | 'completed' => {
  if (req.status === 'Fulfilled') return 'completed';
  if ((req as any).acceptedBy !== null && (req as any).acceptedBy !== undefined) return 'accepted';
  
  // Check if requiredByDate is past
  if (req.requiredByDate) {
    const limit = new Date(req.requiredByDate).getTime();
    if (limit < Date.now()) {
      return 'expired';
    }
  }
  return 'active';
};

const getStatusConfig = (status: 'active' | 'accepted' | 'expired' | 'completed') => {
  switch (status) {
    case 'completed': return { label: 'Completed', bg: '#DCFCE7', text: '#16A34A', border: '#BBF7D0' };
    case 'accepted': return { label: 'Accepted', bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' };
    case 'expired': return { label: 'Expired', bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' };
    case 'active': return { label: 'Active SOS', bg: '#FEF2F2', text: '#DC2626', border: '#FCA5A5' };
  }
};

export default function EmergencyHistoryScreen() {
  const { bloodRequests, fetchBloodRequests, acceptBloodRequest, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<StatusFilter>('All');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchBloodRequests();
      setLoading(false);
    };
    load();
  }, [fetchBloodRequests]);

  // Filter only Emergency SOS requests
  const sosRequests = bloodRequests.filter(req => req.urgencyLevel === 'Emergency SOS');

  const filtered = sosRequests.filter((req) => {
    const status = getEmergencyStatus(req);
    if (activeTab === 'All') return true;
    return status === activeTab.toLowerCase();
  });

  const handleCall = (number: string) => {
    if (!number) return;
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Error', 'Unable to open device dialer.');
    });
  };

  const handleWhatsApp = (req: BloodRequest) => {
    const text = `🚨 *JEEVALINK EMERGENCY BLOOD REQUEST* 🚨\n\n` +
                 `🩸 *Blood Group:* ${req.bloodGroup}\n` +
                 `👤 *Patient:* ${req.patientName}\n` +
                 `📦 *Units:* ${req.unitsRequired}\n` +
                 `🏥 *Hospital:* ${req.hospitalName}\n` +
                 `📍 *District:* ${req.district}\n` +
                 `📞 *Contact:* ${req.contactNumber}\n` +
                 `📝 *Details:* ${req.additionalNotes || 'N/A'}\n\n` +
                 `Please share this message to help save a life!`;

    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(text)}`).catch(() => {
      // Fallback to general Share
      Share.share({ message: text });
    });
  };

  const handleAccept = async (id: string) => {
    Alert.alert(
      'Accept SOS Request',
      'Are you sure you can help with this emergency request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Accept',
          onPress: async () => {
            const res = await acceptBloodRequest(id);
            if (res.success) {
              Alert.alert('Accepted', 'Thank you! The requester has been notified.');
              fetchBloodRequests();
            } else {
              Alert.alert('Error', res.error || 'Failed to accept request.');
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white border-b border-slate-100 pt-16 pb-6 px-6 flex-row items-center">
        <TouchableOpacity
          className="mr-5 w-12 h-12 bg-slate-50 rounded-[16px] items-center justify-center border border-slate-100"
          onPress={() => router.back()}
        >
          <ChevronLeft color="#64748b" size={24} />
        </TouchableOpacity>
        <View>
          <Text className="text-[24px] font-black text-slate-900">Emergency History</Text>
          <Text className="text-slate-500 text-[13px] mt-1">Siren SOS request logs</Text>
        </View>
      </View>

      {/* Tabs */}
      <View className="bg-white py-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}
        >
          {STATUS_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`px-4 py-2.5 rounded-[16px] border ${activeTab === tab ? 'bg-red-600 border-red-600' : 'bg-slate-50 border-slate-100'}`}
              onPress={() => setActiveTab(tab)}
            >
              <Text className={`font-black text-[13px] ${activeTab === tab ? 'text-white' : 'text-slate-500'}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#DC2626" size="large" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6 pt-4"
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View className="bg-white border border-slate-100 rounded-[24px] p-8 items-center mt-4">
              <AlertCircle color="#94A3B8" size={40} strokeWidth={1.5} />
              <Text className="text-slate-900 font-bold text-base mt-4">No emergency requests</Text>
              <Text className="text-slate-400 text-xs text-center mt-2">No SOS requests match this filter.</Text>
            </View>
          ) : (
            filtered.map((req) => {
              const status = getEmergencyStatus(req);
              const config = getStatusConfig(status);
              const isCreator = req.requestedBy === currentUser?._id;
              
              return (
                <View
                  key={req._id}
                  className="bg-white border border-slate-100 rounded-[24px] p-5 mb-4 shadow-sm"
                >
                  {/* Top Header */}
                  <View className="flex-row justify-between items-center mb-3">
                    <View className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl">
                      <Text className="text-red-600 font-black text-sm">{req.bloodGroup}</Text>
                    </View>
                    <View
                      className="px-3 py-1.5 rounded-xl border flex-row items-center gap-1"
                      style={{ backgroundColor: config.bg, borderColor: config.border }}
                    >
                      {status === 'completed' && <CheckCircle color={config.text} size={12} />}
                      {status === 'accepted' && <AlertCircle color={config.text} size={12} />}
                      {status === 'expired' && <AlertTriangle color={config.text} size={12} />}
                      <Text className="font-bold text-[12px]" style={{ color: config.text }}>
                        {config.label}
                      </Text>
                    </View>
                  </View>

                  {/* Body */}
                  <Text className="text-slate-900 font-black text-base mb-1">{req.patientName}</Text>
                  <Text className="text-slate-500 font-semibold text-xs mb-3">{req.hospitalName}</Text>

                  <View className="flex-row items-center gap-1.5 mb-1.5">
                    <MapPin color="#94A3B8" size={13} />
                    <Text className="text-slate-400 text-xs font-semibold">{req.location}</Text>
                  </View>

                  <View className="flex-row items-center gap-1.5 mb-4">
                    <Clock color="#94A3B8" size={13} />
                    <Text className="text-slate-400 text-xs font-semibold">
                      Required:{' '}
                      {req.requiredByDate
                        ? new Date(req.requiredByDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                        : 'N/A'}
                    </Text>
                  </View>

                  {req.additionalNotes ? (
                    <Text className="text-slate-400 italic text-[12px] border-l-2 border-slate-100 pl-3 py-0.5 mb-4 leading-4">
                      {`"${req.additionalNotes}"`}
                    </Text>
                  ) : null}

                  {/* CTAs */}
                  <View className="flex-row gap-2 mt-2">
                    {status === 'active' && !isCreator && (
                      <TouchableOpacity
                        className="flex-1 bg-red-600 py-3.5 rounded-xl items-center justify-center shadow-sm"
                        onPress={() => handleAccept(req._id)}
                      >
                        <Text className="text-white font-bold text-[13px]">Accept Request</Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity
                      className="flex-1 bg-slate-900 py-3.5 rounded-xl flex-row items-center justify-center gap-2"
                      onPress={() => handleCall(req.contactNumber)}
                    >
                      <Phone color="#fff" size={13} strokeWidth={2.5} />
                      <Text className="text-white font-bold text-[13px]">Call Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl items-center justify-center"
                      onPress={() => handleWhatsApp(req)}
                    >
                      <Share2 color="#059669" size={16} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}
