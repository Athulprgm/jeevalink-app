import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import {
  MapPin,
  Clock,
  CheckCircle,
  Plus,
  Droplet,
  Siren,
  BellRing,
  ShieldCheck,
  LayoutList,
  RefreshCw,
} from 'lucide-react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Badge, urgencyToVariant } from '@/components/ui/badge';

const URGENCY_TABS = ['All', 'Emergency SOS', 'Urgent', 'Normal'] as const;
type UrgencyFilter = typeof URGENCY_TABS[number];

const TAB_DISPLAY: Record<string, { label: string; activeColor: string }> = {
  'All':           { label: 'All',    activeColor: '#DC2626' },
  'Emergency SOS': { label: 'SOS',    activeColor: '#DC2626' },
  'Urgent':        { label: 'Urgent', activeColor: '#F59E0B' },
  'Normal':        { label: 'Normal', activeColor: '#10B981' },
};

export default function RequestsScreen() {
  const {
    bloodRequests,
    fulfillBloodRequest,
    fetchBloodRequests,
    currentUser,
    token,
    _hasHydrated,
  } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<UrgencyFilter>('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const router = useRouter();
  const { requestId } = useLocalSearchParams<{ requestId?: string }>();

  const [headerOpacity] = useState(() => new Animated.Value(0));
  const [headerSlide]   = useState(() => new Animated.Value(-16));
  const [listOpacity]   = useState(() => new Animated.Value(0));

  // Entrance animation (only once)
  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(headerSlide,   { toValue: 0, tension: 70, friction: 9, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.delay(200),
      Animated.timing(listOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = useCallback(async (isRefresh = false) => {
    // Wait until store has hydrated and token is available
    if (!token) return;
    if (isRefresh) {
      setRefreshing(true);
    } else if (bloodRequests.length === 0) {
      setLoading(true);
    }
    setFetchError(null);
    try {
      // Fetch verified=true so only published requests are shown
      await fetchBloodRequests({ verified: 'true' });
    } catch {
      setFetchError('Could not load requests. Pull down to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, bloodRequests.length, fetchBloodRequests]);

  // Fetch when hydration completes and token becomes available
  useEffect(() => {
    if (_hasHydrated && token) {
      loadData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated, token]);

  // Re-fetch every time the tab is focused (catches stale data)
  useFocusEffect(
    useCallback(() => {
      if (token) loadData();
    }, [token, loadData])
  );

  // If a request ID is passed via deep link, show All so it is visible
  useEffect(() => {
    if (requestId) setActiveFilter('All');
  }, [requestId]);

  const filtered =
    activeFilter === 'All'
      ? bloodRequests
      : bloodRequests.filter((r) => r.urgencyLevel === activeFilter);

  const isVolunteer = currentUser?.role === 'volunteer';

  // ─── Loading skeleton ────────────────────────────────────────────────────────
  if (loading && bloodRequests.length === 0) {
    return (
      <View style={styles.screen}>
        <Animated.View
          style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerSlide }] }]}
        >
          <View>
            <Text style={styles.headerTitle}>Blood Requests</Text>
            <Text style={styles.headerSub}>Loading…</Text>
          </View>
        </Animated.View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={{ color: '#94A3B8', fontWeight: '600', fontSize: 14 }}>
            Fetching latest requests…
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* ─── Header ─── */}
      <Animated.View
        style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerSlide }] }]}
      >
        <View>
          <Text style={styles.headerTitle}>Blood Requests</Text>
          <Text style={styles.headerSub}>{filtered.length} active requests</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* Refresh button */}
          <TouchableOpacity
            style={[styles.fabSmall, { backgroundColor: '#F1F5F9' }]}
            onPress={() => loadData(true)}
          >
            {refreshing
              ? <ActivityIndicator size="small" color="#DC2626" />
              : <RefreshCw color="#DC2626" size={18} strokeWidth={2.2} />
            }
          </TouchableOpacity>
          {currentUser && (
            <TouchableOpacity
              style={styles.fabSmall}
              onPress={() => router.push('/(tabs)/blood-request/create')}
            >
              <Plus color="#fff" size={22} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* ─── Urgency Filter Tabs ─── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, minHeight: 46, maxHeight: 46, marginBottom: 20 }}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 10, alignItems: 'center' }}
      >
        {URGENCY_TABS.map((tab) => {
          const cfg = TAB_DISPLAY[tab];
          const isActive = activeFilter === tab;
          const TabIcon =
            tab === 'Emergency SOS' ? Siren :
            tab === 'Urgent'        ? BellRing :
            tab === 'Normal'        ? ShieldCheck :
            LayoutList;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                isActive && { backgroundColor: cfg.activeColor, borderColor: cfg.activeColor },
              ]}
              onPress={() => setActiveFilter(tab)}
            >
              <TabIcon color={isActive ? '#FFFFFF' : '#94A3B8'} size={13} strokeWidth={2.2} />
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {cfg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ─── Error Banner ─── */}
      {fetchError && (
        <TouchableOpacity
          style={styles.errorBanner}
          onPress={() => loadData(true)}
        >
          <RefreshCw color="#DC2626" size={14} />
          <Text style={styles.errorBannerText}>{fetchError}</Text>
        </TouchableOpacity>
      )}

      {/* ─── Requests List ─── */}
      <Animated.ScrollView
        style={{ flex: 1, opacity: listOpacity }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            colors={['#DC2626']}
            tintColor="#DC2626"
          />
        }
      >
        {filtered.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Droplet color="#DC2626" size={36} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No requests found</Text>
            <Text style={styles.emptySub}>
              {activeFilter === 'All'
                ? 'No blood requests at the moment. Check back soon.'
                : `No ${activeFilter} requests. Try another filter.`}
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(tabs)/blood-request/create')}
            >
              <Text style={styles.emptyBtnText}>Post a Request</Text>
            </TouchableOpacity>
          </View>
        )}

        {filtered.map((req) => {
          const isEmergency  = req.urgencyLevel === 'Emergency SOS';
          const isFulfilled  = req.status === 'Fulfilled';
          const isHighlighted = req._id === requestId;

          return (
            <Animated.View
              key={req._id}
              style={[
                styles.requestCard,
                isEmergency   && styles.requestCardEmergency,
                isFulfilled   && styles.requestCardFulfilled,
                isHighlighted && styles.requestCardHighlighted,
              ]}
            >
              {/* Blood group avatar */}
              <View style={[
                styles.bgAvatar,
                { backgroundColor: isEmergency ? '#FEF2F2' : isFulfilled ? '#ECFDF5' : '#F8FAFC' },
              ]}>
                <Text style={[
                  styles.bgAvatarText,
                  { color: isEmergency ? '#DC2626' : isFulfilled ? '#059669' : '#475569' },
                ]}>
                  {req.bloodGroup}
                </Text>
                <Text style={styles.bgAvatarUnits}>{req.unitsRequired}u</Text>
              </View>

              {/* Details */}
              <View style={{ flex: 1 }}>
                <Text style={styles.patientName} numberOfLines={1}>{req.patientName}</Text>
                <Text style={styles.hospitalName} numberOfLines={1}>{req.hospitalName}</Text>

                <View style={styles.detailRow}>
                  <MapPin color="#94a3b8" size={12} />
                  <Text style={styles.detailText}>{req.location}</Text>
                </View>
                {req.requiredByDate && (
                  <View style={styles.detailRow}>
                    <Clock color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>
                      Required by{' '}
                      {new Date(req.requiredByDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Text>
                  </View>
                )}

                {/* Footer row */}
                <View style={styles.cardFooter}>
                  <Badge variant={urgencyToVariant(req.urgencyLevel)} pulse={isEmergency} />
                  <View>
                    {isFulfilled ? (
                      <View style={styles.fulfilledChip}>
                        <CheckCircle color="#059669" size={13} />
                        <Text style={styles.fulfilledText}>Fulfilled</Text>
                      </View>
                    ) : isVolunteer ? (
                      <TouchableOpacity
                        style={styles.fulfillBtn}
                        onPress={() => fulfillBloodRequest(req._id)}
                      >
                        <CheckCircle color="#059669" size={14} />
                        <Text style={styles.fulfillBtnText}>Mark Fulfilled</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.respondBtn}>
                        <Text style={styles.respondBtnText}>Respond</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {req.additionalNotes && (
                  <Text style={styles.notes} numberOfLines={2}>
                    {'\u201c'}{req.additionalNotes}{'\u201d'}
                  </Text>
                )}
              </View>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: 52 },
  header: {
    paddingHorizontal: 24, marginBottom: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 3, fontWeight: '500' },
  fabSmall: {
    width: 46, height: 46, borderRadius: 999, backgroundColor: '#DC2626',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#DC2626', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30, shadowRadius: 10, elevation: 8,
  },
  // Tabs
  tab: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 999, borderWidth: 1,
    backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.08)',
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  tabText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#FFFFFF' },
  // Error banner
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEF2F2', borderRadius: 16, marginHorizontal: 24,
    paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16,
    borderWidth: 1, borderColor: '#FCA5A5',
  },
  errorBannerText: { color: '#DC2626', fontWeight: '600', fontSize: 13, flex: 1 },
  // Empty state
  emptyState: {
    backgroundColor: '#FFFFFF', borderRadius: 28, padding: 40,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', marginTop: 20,
  },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 8 },
  emptySub: { fontSize: 13, color: '#94A3B8', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  emptyBtn: {
    backgroundColor: '#DC2626', paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 999,
    shadowColor: '#DC2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  emptyBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  // Request cards
  requestCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18,
    marginBottom: 14, flexDirection: 'row', gap: 14,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  requestCardEmergency: { borderColor: '#FCA5A5', borderWidth: 1.5 },
  requestCardHighlighted: { borderColor: '#DC2626', borderWidth: 2, backgroundColor: '#FFF5F5' },
  requestCardFulfilled: { opacity: 0.75 },
  bgAvatar: { width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  bgAvatarText: { fontSize: 17, fontWeight: '900' },
  bgAvatarUnits: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 1 },
  patientName: { fontSize: 16, fontWeight: '900', color: '#0F172A', marginBottom: 1 },
  hospitalName: { fontSize: 13, color: '#64748B', fontWeight: '600', marginBottom: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  detailText: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  fulfilledChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  fulfilledText: { color: '#059669', fontWeight: '700', fontSize: 12 },
  fulfillBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  fulfillBtnText: { color: '#059669', fontWeight: '700', fontSize: 12 },
  respondBtn: {
    backgroundColor: '#DC2626', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999,
    shadowColor: '#DC2626', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
  },
  respondBtnText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  notes: {
    fontSize: 12, color: '#94A3B8', fontStyle: 'italic',
    marginTop: 8, borderLeftWidth: 2, borderLeftColor: '#E2E8F0', paddingLeft: 10, lineHeight: 18,
  },
});
