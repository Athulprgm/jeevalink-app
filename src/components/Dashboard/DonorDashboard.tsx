import { View, Text, Switch, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { Heart, Droplet, MapPin, Flame, AlertTriangle, CheckCircle, Bell, Plus, ChevronRight, TrendingUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { shadows, shadow } from '../../utils/shadow';
import { Button } from '@/components/ui/button';
import { Badge, urgencyToVariant } from '@/components/ui/badge';
import { useRef, useEffect, useState } from 'react';

const getDaysUntilEligible = (lastDonated?: string): number | null => {
  if (!lastDonated) return null;
  const last = new Date(lastDonated);
  const eligible = new Date(last.getTime() + 90 * 24 * 60 * 60 * 1000);
  const days = Math.ceil((eligible.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return days;
};

/** Animated stat counter card */
function StatCard({
  icon,
  iconBg,
  value,
  label,
  delay,
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: number;
  label: string;
  delay: number;
}) {
  const [scale] = useState(() => new Animated.Value(0.8));
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, tension: 80, friction: 7, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.statCard, { opacity, transform: [{ scale }] }]}>
      <View style={[styles.statIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function DonorDashboard() {
  const { currentUser, toggleAvailability, bloodRequests, fetchBloodRequests, fetchNotifications } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    fetchBloodRequests();
    fetchNotifications();
  }, []);

  const eligibleIn = getDaysUntilEligible(currentUser?.lastDonatedDate);
  const isEligible = eligibleIn === null || eligibleIn <= 0;

  // Section entrance
  const [headerSlide] = useState(() => new Animated.Value(-20));
  const [headerOpacity] = useState(() => new Animated.Value(0));
  const [cardSlide] = useState(() => new Animated.Value(30));
  const [cardOpacity] = useState(() => new Animated.Value(0));
  const [contentOpacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 70, friction: 9, useNativeDriver: true }),
    ]).start();
    Animated.sequence([
      Animated.delay(150),
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(cardSlide, { toValue: 0, tension: 60, friction: 9, useNativeDriver: true }),
      ]),
    ]).start();
    Animated.sequence([
      Animated.delay(350),
      Animated.timing(contentOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 110 }}
    >
      {/* ─── Glass Header ─── */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerOpacity, transform: [{ translateY: headerSlide }] },
        ]}
      >
        <View style={styles.headerDecorCircle} />
        <View>
          <Text style={styles.headerGreeting}>Welcome back,</Text>
          <Text style={styles.headerName} numberOfLines={1}>
            {currentUser?.fullName} 👋
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {/* Notification bell */}
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => router.push('/(tabs)/notifications')}
          >
            <Bell color="#DC2626" size={20} strokeWidth={2} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ─── Donor Passport Card ─── */}
      <Animated.View
        style={[
          styles.passportCard,
          { opacity: cardOpacity, transform: [{ translateY: cardSlide }] },
        ]}
      >
        {/* Decorative arcs */}
        <View style={styles.passportCircle1} />
        <View style={styles.passportCircle2} />
        <View style={styles.passportCircle3} />

        {/* Card content */}
        <View style={styles.passportTop}>
          <View>
            <Text style={styles.passportBGLabel}>Blood Group</Text>
            <Text style={styles.passportBG}>{currentUser?.bloodGroup}</Text>
          </View>
          <View style={styles.passportPointsWrap}>
            <Text style={styles.passportPointsLabel}>JeevaPoints</Text>
            <View style={styles.passportPointsBadge}>
              <Flame color="#FDE68A" size={16} />
              <Text style={styles.passportPoints}>{currentUser?.rewardPoints}</Text>
            </View>
          </View>
        </View>

        <View style={styles.passportDivider} />

        <View style={styles.passportBottom}>
          <View style={styles.passportLocation}>
            <MapPin color="rgba(255,255,255,0.7)" size={13} />
            <Text style={styles.passportLocationText}>
              {currentUser?.city}, {currentUser?.district}
            </Text>
          </View>
          <View style={styles.passportAvailRow}>
            <Text style={styles.passportAvailLabel}>Available</Text>
            <Switch
              trackColor={{ false: 'rgba(255,255,255,0.25)', true: '#22C55E' }}
              thumbColor="#ffffff"
              onValueChange={toggleAvailability}
              value={currentUser?.availableForDonation}
            />
          </View>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: contentOpacity }}>
        {/* ─── Eligibility Banner ─── */}
        <View style={styles.section}>
          {isEligible ? (
            <View style={styles.eligibleBanner}>
              <View style={styles.eligibleIcon}>
                <CheckCircle color="#16A34A" size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eligibleTitle}>{"You're Eligible to Donate!"}</Text>
                <Text style={styles.eligibleSubtitle}>Your next donation can save up to 3 lives.</Text>
              </View>
              <ChevronRight color="#16A34A" size={16} />
            </View>
          ) : (
            <View style={styles.waitingBanner}>
              <View style={styles.waitingIcon}>
                <AlertTriangle color="#D97706" size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.waitingTitle}>Next Donation in {eligibleIn} days</Text>
                <Text style={styles.waitingSubtitle}>90-day cooldown after last donation.</Text>
              </View>
            </View>
          )}
        </View>

        {/* ─── Stats Row ─── */}
        <View style={styles.statsRow}>
          <StatCard
            icon={<Heart color="#16A34A" size={20} fill="#16A34A" />}
            iconBg="#ECFDF5"
            value={currentUser?.livesSaved ?? 0}
            label="Lives Saved"
            delay={0}
          />
          <StatCard
            icon={<Droplet color="#DC2626" size={20} fill="#DC2626" />}
            iconBg="#FEF2F2"
            value={currentUser?.totalDonations ?? 0}
            label="Donations"
            delay={80}
          />
          <StatCard
            icon={<Flame color="#F59E0B" size={20} />}
            iconBg="#FFFBEB"
            value={currentUser?.rewardPoints ?? 0}
            label="Points"
            delay={160}
          />
        </View>

        {/* ─── Quick Actions ─── */}
        <View style={styles.section}>
          <Button
            label="Post a Blood Request"
            leftIcon={<Plus color="#fff" size={18} />}
            onPress={() => router.push('/(tabs)/blood-request/create')}
          />
        </View>

        {/* ─── Impact Tip Card ─── */}
        <TouchableOpacity style={styles.tipCard} activeOpacity={0.85}>
          <View style={styles.tipIconWrap}>
            <TrendingUp color="#2563EB" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Your impact this year</Text>
            <Text style={styles.tipSubtitle}>{"You've helped"} {currentUser?.livesSaved} {"people. Keep going!"}</Text>
          </View>
          <ChevronRight color="#94A3B8" size={16} />
        </TouchableOpacity>

        {/* ─── Urgent SOS Feed ─── */}
        <View style={[styles.section, { marginTop: 8 }]}>
          <View style={styles.feedHeader}>
            <Text style={styles.feedTitle}>Urgent Requests Nearby</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/alerts')}>
              <Text style={styles.feedSeeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {bloodRequests.slice(0, 3).map((req) => {
            const isEmergency = req.urgencyLevel === 'Emergency SOS';
            return (
              <TouchableOpacity
                key={req._id}
                style={[styles.requestCard, isEmergency && styles.requestCardEmergency]}
                activeOpacity={0.85}
              >
                {/* Pulse indicator for emergency */}
                <View
                  style={[
                    styles.requestBGAvatar,
                    { backgroundColor: isEmergency ? '#FEF2F2' : '#F8FAFC' },
                  ]}
                >
                  <Text
                    style={[
                      styles.requestBGText,
                      { color: isEmergency ? '#DC2626' : '#475569' },
                    ]}
                  >
                    {req.bloodGroup}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.requestHospital} numberOfLines={1}>
                    {req.hospitalName}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                    <MapPin color="#94a3b8" size={12} />
                    <Text style={styles.requestLocation}>{req.location}</Text>
                  </View>
                  <View style={{ marginTop: 8 }}>
                    <Badge
                      variant={urgencyToVariant(req.urgencyLevel)}
                      pulse={isEmergency}
                    />
                  </View>
                </View>
                <TouchableOpacity style={styles.respondBtn}>
                  <Text style={styles.respondBtnText}>Respond</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  // Header
  header: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerDecorCircle: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(220,38,38,0.04)',
  },
  headerGreeting: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  headerName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    maxWidth: 220,
  },
  headerBtn: {
    width: 46,
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  // Passport card
  passportCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 28,
    padding: 24,
    backgroundColor: '#DC2626',
    overflow: 'hidden',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.30,
    shadowRadius: 24,
    elevation: 14,
  },
  passportCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  passportCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  passportCircle3: {
    position: 'absolute',
    top: 20,
    left: '45%',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  passportTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  passportBGLabel: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  passportBG: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 56,
    letterSpacing: -1,
  },
  passportPointsWrap: { alignItems: 'flex-end' },
  passportPointsLabel: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  passportPointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  passportPoints: { color: '#FFFFFF', fontWeight: '900', fontSize: 18 },
  passportDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.18)', marginBottom: 16 },
  passportBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  passportLocation: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  passportLocationText: { color: 'rgba(255,255,255,0.80)', fontSize: 13, fontWeight: '500' },
  passportAvailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  passportAvailLabel: { color: 'rgba(255,255,255,0.80)', fontSize: 13, fontWeight: '600' },
  // Eligibility
  section: { paddingHorizontal: 24, marginBottom: 20 },
  eligibleBanner: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eligibleIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eligibleTitle: { fontSize: 15, fontWeight: '800', color: '#15803D' },
  eligibleSubtitle: { fontSize: 13, color: '#16A34A', fontWeight: '500', marginTop: 2 },
  waitingBanner: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  waitingIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingTitle: { fontSize: 15, fontWeight: '800', color: '#92400E' },
  waitingSubtitle: { fontSize: 13, color: '#D97706', fontWeight: '500', marginTop: 2 },
  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  // Tip card
  tipCard: {
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tipIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: { fontSize: 14, fontWeight: '800', color: '#1E40AF' },
  tipSubtitle: { fontSize: 12, color: '#3B82F6', fontWeight: '500', marginTop: 2 },
  // Feed
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  feedTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  feedSeeAll: { fontSize: 13, fontWeight: '700', color: '#DC2626' },
  // Request cards
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  requestCardEmergency: {
    borderColor: '#FCA5A5',
    borderWidth: 1.5,
  },
  requestBGAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestBGText: { fontSize: 16, fontWeight: '900' },
  requestHospital: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  requestLocation: { fontSize: 12, color: '#94A3B8', marginLeft: 4, fontWeight: '500' },
  respondBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  respondBtnText: { color: '#fff', fontWeight: '800', fontSize: 12 },
});
