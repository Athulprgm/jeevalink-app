import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { Siren, MapPin, Trophy, CheckCircle, Check, BellOff, RefreshCw } from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';

const getConfig = (type: string) => {
  switch (type) {
    case 'SOS': return { bg: '#FEF2F2', border: '#FCA5A5', icon: <Siren color="#EF4444" size={22} />, dot: '#DC2626' };
    case 'Match': return { bg: '#EFF6FF', border: '#BFDBFE', icon: <MapPin color="#3B82F6" size={22} />, dot: '#3B82F6' };
    case 'Reward': return { bg: '#FFFBEB', border: '#FDE68A', icon: <Trophy color="#F59E0B" size={22} />, dot: '#F59E0B' };
    case 'Fulfilled': return { bg: '#ECFDF5', border: '#A7F3D0', icon: <CheckCircle color="#10B981" size={22} />, dot: '#10B981' };
    default: return { bg: '#F8FAFC', border: '#E2E8F0', icon: <Siren color="#64748b" size={22} />, dot: '#94A3B8' };
  }
};

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    fetchNotifications,
    token,
    _hasHydrated,
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadData = useCallback(async (isRefresh = false) => {
    // Only load if hydrated and we have a token
    if (!token) return;

    if (isRefresh) {
      setRefreshing(true);
    } else if (notifications.length === 0) {
      setLoading(true);
    }
    setFetchError(null);

    try {
      await fetchNotifications();
    } catch {
      setFetchError('Could not load notifications. Pull down to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, notifications.length, fetchNotifications]);

  // Initial load when hydration completes and token is available
  useEffect(() => {
    if (_hasHydrated && token) {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, token]);

  // Re-fetch on focus
  useFocusEffect(
    useCallback(() => {
      if (token) loadData();
    }, [token, loadData])
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading && notifications.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 pt-12">
        <View className="px-6 mb-8">
          <Text className="text-[28px] font-black text-slate-900">Notifications</Text>
          <Text className="text-slate-500 mt-1">Loading…</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={{ color: '#94A3B8', fontWeight: '600', fontSize: 14 }}>
            Fetching notifications…
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 pt-12">
      {/* Header */}
      <View className="px-6 mb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-[28px] font-black text-slate-900">Notifications</Text>
          {unreadCount > 0 && (
            <Text className="text-red-600 text-sm font-semibold mt-1">{unreadCount} unread</Text>
          )}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TouchableOpacity
            className="bg-slate-100 p-2.5 rounded-full border border-slate-200"
            onPress={() => loadData(true)}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#64748b" />
            ) : (
              <RefreshCw color="#64748b" size={16} strokeWidth={2.2} />
            )}
          </TouchableOpacity>
          {unreadCount > 0 && (
            <TouchableOpacity
              className="bg-slate-100 px-3 py-2 rounded-full border border-slate-200"
              onPress={markAllNotificationsRead}
            >
              <Text className="text-slate-600 font-semibold text-xs">Mark All Read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Error Banner */}
      {fetchError && (
        <TouchableOpacity
          className="flex-row items-center gap-2 bg-red-50 rounded-[16px] mx-6 px-4 py-3 mb-4 border border-red-200"
          onPress={() => loadData(true)}
        >
          <RefreshCw color="#DC2626" size={14} />
          <Text className="text-red-600 font-semibold text-[13px] flex-1">{fetchError}</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        className="px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            colors={['#DC2626']}
            tintColor="#DC2626"
          />
        }
      >
        {notifications.length === 0 && !loading && (
          <View className="items-center py-16 bg-white rounded-[24px] border border-slate-100 mt-4 shadow-sm">
            <BellOff color="#CBD5E1" size={48} />
            <Text className="text-slate-400 font-semibold text-base mt-4">No notifications yet</Text>
          </View>
        )}
        
        {notifications.map((notif) => {
          const config = getConfig(notif.type);
          return (
            <TouchableOpacity
              key={notif._id}
              className="rounded-[24px] p-5 mb-4 border flex-row items-start shadow-sm"
              style={{
                backgroundColor: notif.read ? '#FFFFFF' : config.bg,
                borderColor: notif.read ? '#F1F5F9' : config.border,
                opacity: notif.read ? 0.75 : 1,
              }}
              onPress={() => {
                markNotificationRead(notif._id);
                if (notif.type === 'SOS' || notif.type === 'Match') {
                  router.push('/(tabs)/alerts');
                }
              }}
            >
              {/* Icon */}
              <View
                className="w-14 h-14 rounded-[16px] items-center justify-center mr-4 shadow-sm"
                style={{ backgroundColor: notif.read ? '#F8FAFC' : '#FFFFFF' }}
              >
                {config.icon}
              </View>

              {/* Content */}
              <View className="flex-1">
                <View className="flex-row items-start justify-between">
                  <Text className="font-black text-slate-900 text-lg flex-1 pr-2">{notif.title}</Text>
                  {!notif.read && (
                    <View style={{ backgroundColor: config.dot }} className="w-2.5 h-2.5 rounded-full mt-1.5" />
                  )}
                  {notif.read && <Check color="#94a3b8" size={16} style={{ marginTop: 2 }} />}
                </View>
                <Text className="text-slate-600 mt-1 text-sm leading-5">{notif.message}</Text>
                <Text className="text-slate-400 text-xs mt-2">{formatDate(notif.createdAt)}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
