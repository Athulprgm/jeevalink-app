import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { MapPin, Clock, CheckCircle, Plus, Droplet } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Badge, urgencyToVariant } from '@/components/ui/badge';

const URGENCY_TABS = ['All', 'Emergency SOS', 'Urgent', 'Normal'] as const;
type UrgencyFilter = typeof URGENCY_TABS[number];

const TAB_LABELS: Record<string, string> = {
  'All': 'All',
  'Emergency SOS': '🚨 SOS',
  'Urgent': '⚡ Urgent',
  'Normal': '✅ Normal',
};

export default function RequestsScreen() {
  const { bloodRequests, fulfillBloodRequest, fetchBloodRequests, currentUser } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<UrgencyFilter>('All');
  const router = useRouter();

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerSlide   = useRef(new Animated.Value(-16)).current;
  const listOpacity   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchBloodRequests();
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 70, friction: 9, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.delay(200),
      Animated.timing(listOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  const filtered =
    activeFilter === 'All'
      ? bloodRequests
      : bloodRequests.filter((r) => r.urgencyLevel === activeFilter);

  const isVolunteer = currentUser?.role === 'volunteer';

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
        {currentUser && (
          <TouchableOpacity
            style={styles.fabSmall}
            onPress={() => router.push('/(tabs)/blood-request/create')}
          >
            <Plus color="#fff" size={22} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* ─── Urgency Filter Tabs ─── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, minHeight: 46, maxHeight: 46, marginBottom: 20 }}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 10, alignItems: 'center' }}
      >
        {URGENCY_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeFilter === tab && styles.tabActive]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.tabText, activeFilter === tab && styles.tabTextActive]}>
              {TAB_LABELS[tab]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ─── Requests List ─── */}
      <Animated.ScrollView
        style={{ flex: 1, opacity: listOpacity }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Droplet color="#DC2626" size={36} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No requests found</Text>
            <Text style={styles.emptySub}>Try selecting a different urgency filter.</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(tabs)/blood-request/create')}
            >
              <Text style={styles.emptyBtnText}>Post a Request</Text>
            </TouchableOpacity>
          </View>
        )}

        {filtered.map((req, idx) => {
          const isEmergency = req.urgencyLevel === 'Emergency SOS';
          const isFulfilled = req.status === 'Fulfilled';

          return (
            <Animated.View
              key={req._id}
              style={[
                styles.requestCard,
                isEmergency && styles.requestCardEmergency,
                isFulfilled && styles.requestCardFulfilled,
              ]}
            >
              {/* Blood group avatar */}
              <View style={[styles.bgAvatar, { backgroundColor: isEmergency ? '#FEF2F2' : isFulfilled ? '#ECFDF5' : '#F8FAFC' }]}>
                <Text style={[styles.bgAvatarText, { color: isEmergency ? '#DC2626' : isFulfilled ? '#059669' : '#475569' }]}>
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

                {/* Additional notes */}
                {req.additionalNotes && (
                  <Text style={styles.notes} numberOfLines={2}>
                    "{req.additionalNotes}"
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
    paddingHorizontal: 18, paddingVertical: 11,
    borderRadius: 16, borderWidth: 1,
    backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.08)',
  },
  tabActive: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#FFFFFF' },
  // Empty
  emptyState: {
    backgroundColor: '#FFFFFF', borderRadius: 28, padding: 40,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
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
  requestCardFulfilled: { opacity: 0.75 },
  bgAvatar: {
    width: 60, height: 60, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
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
