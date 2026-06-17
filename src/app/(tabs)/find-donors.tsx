import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import { MapPin, Search, SlidersHorizontal, X, Phone, Star } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { useAppStore, User } from '../../store/useAppStore';

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const AVAILABILITY_OPTIONS = ['All', 'Available', 'Donated Recently'];

/** Animated donor card entrance */
function DonorCard({ donor, index }: { donor: User; index: number }) {
  const [slide]   = useState(() => new Animated.Value(40));
  const [opacity] = useState(() => new Animated.Value(0));
  const [scale]   = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 70),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slide, { toValue: 0, tension: 70, friction: 9, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.97, tension: 200, friction: 8, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }).start();

  const distanceVal = (donor as any).distance ?? 2.5;
  const distanceText = `${distanceVal} km`;
  const distanceColor = distanceVal <= 3.0 ? '#10B981' : distanceVal <= 6.0 ? '#F59E0B' : '#EF4444';
  const isAvailable = donor.availableForDonation;
  const matchPercent = (donor as any).matchScore ?? (donor as any).compatibilityScore ?? 90;

  return (
    <Animated.View
      style={[styles.donorCard, { opacity, transform: [{ translateY: slide }, { scale }] }]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ flex: 1 }}
      >
        {/* Top row */}
        <View style={styles.donorTopRow}>
          <View style={styles.donorLeft}>
            <Avatar name={donor.fullName} size={56} borderRadius={18} />
            <View style={{ flex: 1 }}>
              <Text style={styles.donorName}>{donor.fullName}</Text>
              <View style={styles.donorMeta}>
                <MapPin color={distanceColor} size={12} />
                <Text style={[styles.donorDist, { color: distanceColor }]}>
                  {distanceText}
                </Text>
                <View
                  style={[
                    styles.availBadge,
                    { backgroundColor: isAvailable ? '#ECFDF5' : '#FFF7ED' },
                  ]}
                >
                  <View
                    style={[
                      styles.availDot,
                      { backgroundColor: isAvailable ? '#10B981' : '#F59E0B' },
                    ]}
                  />
                  <Text
                    style={[
                      styles.availText,
                      { color: isAvailable ? '#059669' : '#D97706' },
                    ]}
                  >
                    {isAvailable ? 'Available' : 'Donated Recently'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* Blood group + match */}
          <View style={styles.donorBGWrap}>
            <Text style={styles.donorBG}>{donor.bloodGroup}</Text>
            <View style={styles.matchChip}>
              <Star color="#F59E0B" size={10} fill="#F59E0B" />
              <Text style={styles.matchText}>{matchPercent}%</Text>
            </View>
          </View>
        </View>

        {/* Contact CTA */}
        <TouchableOpacity style={styles.contactBtn} activeOpacity={0.85}>
          <Phone color="#fff" size={15} strokeWidth={2.5} />
          <Text style={styles.contactBtnText}>Contact Donor</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function FindDonorsScreen() {
  const { donors, searchDonors } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const [headerOpacity] = useState(() => new Animated.Value(0));
  const [headerSlide]   = useState(() => new Animated.Value(-16));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 70, friction: 9, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    searchDonors({
      bloodGroup: selectedBloodGroup !== 'All' ? selectedBloodGroup : undefined,
      district: districtFilter || undefined,
      city: searchQuery || undefined,
    });
  }, [selectedBloodGroup, districtFilter, searchQuery]);

  const filtered = donors.filter((d) => {
    const matchesAvail =
      selectedAvailability === 'All' ||
      (selectedAvailability === 'Available' && d.availableForDonation) ||
      (selectedAvailability === 'Donated Recently' && !d.availableForDonation);
    return matchesAvail;
  });

  const hasFilters = selectedBloodGroup !== 'All' || selectedAvailability !== 'All' || !!districtFilter;

  const clearFilter = (which: 'bg' | 'avail' | 'district') => {
    if (which === 'bg') setSelectedBloodGroup('All');
    else if (which === 'avail') setSelectedAvailability('All');
    else setDistrictFilter('');
  };

  return (
    <View style={styles.screen}>
      {/* ─── Header ─── */}
      <Animated.View
        style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerSlide }] }]}
      >
        <View>
          <Text style={styles.headerTitle}>Find Donors</Text>
          <Text style={styles.headerSub}>{filtered.length} donors found nearby</Text>
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, hasFilters && styles.filterBtnActive]}
          onPress={() => setFilterVisible(true)}
        >
          <SlidersHorizontal color={hasFilters ? '#fff' : '#64748b'} size={20} />
        </TouchableOpacity>
      </Animated.View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Input
          placeholder="Search by name or location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search color="#94a3b8" size={18} />}
          rightIcon={searchQuery ? <X color="#94a3b8" size={18} /> : undefined}
          onRightIconPress={() => setSearchQuery('')}
        />
      </View>

      {/* Active Filter Chips */}
      {hasFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
        >
          {selectedBloodGroup !== 'All' && (
            <TouchableOpacity style={styles.chip} onPress={() => clearFilter('bg')}>
              <Text style={styles.chipTextRed}>{selectedBloodGroup}</Text>
              <X color="#DC2626" size={11} />
            </TouchableOpacity>
          )}
          {selectedAvailability !== 'All' && (
            <TouchableOpacity style={[styles.chip, styles.chipBlue]} onPress={() => clearFilter('avail')}>
              <Text style={styles.chipTextBlue}>{selectedAvailability}</Text>
              <X color="#2563EB" size={11} />
            </TouchableOpacity>
          )}
          {districtFilter ? (
            <TouchableOpacity style={[styles.chip, styles.chipGreen]} onPress={() => clearFilter('district')}>
              <Text style={styles.chipTextGreen}>{districtFilter}</Text>
              <X color="#059669" size={11} />
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      )}

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapInner}>
          <View style={styles.mapPinWrap}>
            <MapPin color="#DC2626" size={28} fill="rgba(220,38,38,0.15)" />
          </View>
          <Text style={styles.mapTitle}>Interactive Map</Text>
          <Text style={styles.mapSub}>Coming Soon · Tap to enable location</Text>
        </View>
        {/* Map grid dots */}
        {[...Array(6)].map((_, i) => (
          <View key={i} style={[styles.mapDot, { top: 20 + (i % 3) * 28, left: 40 + Math.floor(i / 3) * 140 }]} />
        ))}
      </View>

      {/* Donor List */}
      <ScrollView
        style={{ paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text style={styles.listLabel}>Top Matches · 10km Radius</Text>

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🩸</Text>
            <Text style={styles.emptyTitle}>No donors found</Text>
            <Text style={styles.emptySub}>Try adjusting your filters or search query.</Text>
          </View>
        )}

        {filtered.map((donor, i) => (
          <DonorCard key={donor._id} donor={donor} index={i} />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ─── Filter Bottom Sheet ─── */}
      <Modal visible={filterVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setFilterVisible(false)} />
          <View style={styles.filterSheet}>
            {/* Handle */}
            <View style={styles.filterHandle} />
            <View style={styles.filterSheetHeader}>
              <Text style={styles.filterSheetTitle}>Filter Donors</Text>
              <TouchableOpacity style={styles.filterCloseBtn} onPress={() => setFilterVisible(false)}>
                <X color="#64748b" size={18} />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSectionLabel}>Blood Group</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 24 }}
              contentContainerStyle={{ gap: 10 }}
            >
              {BLOOD_GROUPS.map((bg) => (
                <TouchableOpacity
                  key={bg}
                  style={[styles.bgChip, selectedBloodGroup === bg && styles.bgChipActive]}
                  onPress={() => setSelectedBloodGroup(bg)}
                >
                  <Text style={[styles.bgChipText, selectedBloodGroup === bg && styles.bgChipTextActive]}>
                    {bg}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Input
              label="District / Area"
              placeholder="e.g. Koramangala"
              value={districtFilter}
              onChangeText={setDistrictFilter}
            />

            <Text style={styles.filterSectionLabel}>Availability</Text>
            <View style={{ flexDirection: 'row', marginBottom: 32, gap: 10 }}>
              {AVAILABILITY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.availChip, selectedAvailability === opt && styles.bgChipActive]}
                  onPress={() => setSelectedAvailability(opt)}
                >
                  <Text style={[styles.bgChipText, selectedAvailability === opt && styles.bgChipTextActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button label="Apply Filters" onPress={() => setFilterVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: 52 },
  header: { paddingHorizontal: 24, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 3, fontWeight: '500' },
  filterBtn: {
    width: 46, height: 46, borderRadius: 999, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  filterBtnActive: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  searchWrap: { paddingHorizontal: 24, marginBottom: 8 },
  // Chips
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
  },
  chipBlue: { backgroundColor: '#DBEAFE' },
  chipGreen: { backgroundColor: '#D1FAE5' },
  chipTextRed: { color: '#B91C1C', fontWeight: '700', fontSize: 12 },
  chipTextBlue: { color: '#1D4ED8', fontWeight: '700', fontSize: 12 },
  chipTextGreen: { color: '#065F46', fontWeight: '700', fontSize: 12 },
  // Map
  mapPlaceholder: {
    marginHorizontal: 24, height: 130, borderRadius: 24, marginBottom: 20,
    backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative',
  },
  mapInner: { alignItems: 'center', zIndex: 1 },
  mapPinWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(220,38,38,0.10)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  mapTitle: { fontSize: 14, fontWeight: '800', color: '#1E40AF' },
  mapSub: { fontSize: 12, color: '#3B82F6', fontWeight: '500', marginTop: 2 },
  mapDot: {
    position: 'absolute', width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(59,130,246,0.25)',
  },
  // List
  listLabel: {
    color: '#94A3B8', fontWeight: '700', marginBottom: 16,
    fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2,
  },
  // Empty
  emptyState: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 40,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  emptyIcon: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#334155' },
  emptySub: { fontSize: 13, color: '#94A3B8', marginTop: 6, textAlign: 'center' },
  // Donor card
  donorCard: {
    backgroundColor: '#FFFFFF', padding: 18, borderRadius: 24, borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)', marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  donorTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  donorLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 14 },
  donorName: { fontSize: 17, fontWeight: '900', color: '#0F172A', marginBottom: 5 },
  donorMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  donorDist: { fontSize: 12, fontWeight: '700', marginLeft: 2 },
  availBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, gap: 4 },
  availDot: { width: 6, height: 6, borderRadius: 3 },
  availText: { fontSize: 11, fontWeight: '700' },
  donorBGWrap: { alignItems: 'center', marginLeft: 8 },
  donorBG: { color: '#DC2626', fontWeight: '900', fontSize: 22, letterSpacing: -0.5 },
  matchChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#FFFBEB', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999, marginTop: 4,
  },
  matchText: { fontSize: 11, fontWeight: '700', color: '#D97706' },
  contactBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 16, backgroundColor: '#0F172A', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4,
  },
  contactBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  // Filter sheet
  filterSheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 40,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 20,
  },
  filterHandle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  filterSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  filterSheetTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
  filterCloseBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center',
  },
  filterSectionLabel: {
    color: '#94A3B8', fontWeight: '700', fontSize: 11,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12,
  },
  bgChip: {
    paddingHorizontal: 16, paddingVertical: 11, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#FFFFFF',
  },
  bgChipActive: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  bgChipText: { fontWeight: '700', fontSize: 14, color: '#334155' },
  bgChipTextActive: { color: '#FFFFFF' },
  availChip: {
    flex: 1, paddingVertical: 14, borderRadius: 16, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#FFFFFF',
  },
});
