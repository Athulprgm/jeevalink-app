import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Vibration,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { useAppStore } from '../../../store/useAppStore';
import {
  ChevronLeft,
  AlertOctagon,
  Flame,
  Siren,
  BellRing,
  ShieldCheck,
  CircleCheck,
  Circle,
} from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

type PriorityValue = 'Normal' | 'Urgent' | 'Emergency SOS';

interface PriorityLevel {
  value: PriorityValue;
  title: string;
  description: string;
  iconColor: string;
  accentColor: string;
  isSOS: boolean;
}

const PRIORITY_LEVELS: PriorityLevel[] = [
  {
    value: 'Emergency SOS',
    title: 'Immediate (SOS)',
    description: 'Emergency broadcast with siren and full-screen alert',
    iconColor: '#FFFFFF',
    accentColor: '#DC2626',
    isSOS: true,
  },
  {
    value: 'Urgent',
    title: 'Urgent',
    description: 'High priority push notification and feed promotion',
    iconColor: '#F59E0B',
    accentColor: '#F59E0B',
    isSOS: false,
  },
  {
    value: 'Normal',
    title: 'Normal',
    description: 'Standard donor matching and notification',
    iconColor: '#10B981',
    accentColor: '#10B981',
    isSOS: false,
  },
];

const SectionLabel = ({ children }: { children: string }) => (
  <Text style={styles.sectionLabel}>{children}</Text>
);

// ─── Animated Priority Card ──────────────────────────────────────────────────
interface PriorityCardProps {
  level: PriorityLevel;
  isSelected: boolean;
  onPress: () => void;
}

function PriorityCard({ level, isSelected, onPress }: PriorityCardProps) {
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(isSelected ? 1 : 0);
  const checkOpacity = useSharedValue(isSelected ? 1 : 0);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);
  const elevation = useSharedValue(isSelected ? 8 : 2);

  // SOS pulse animation
  useEffect(() => {
    if (level.isSOS && isSelected) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.18, { duration: 700, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 700, easing: Easing.in(Easing.ease) }),
        ),
        -1,
        false,
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 700 }),
          withTiming(0.55, { duration: 700 }),
        ),
        -1,
        false,
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 300 });
      pulseOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isSelected, level.isSOS]);

  // Check mark animation
  useEffect(() => {
    checkScale.value = withSpring(isSelected ? 1 : 0, {
      damping: 18,
      stiffness: 280,
      mass: 0.6,
    });
    checkOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 150 });
    elevation.value = withSpring(isSelected ? 8 : 2, {
      damping: 20,
      stiffness: 200,
    });
  }, [isSelected]);

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.97, { duration: 80, easing: Easing.out(Easing.ease) }),
      withSpring(1, { damping: 15, stiffness: 300 }),
    );
    if (Platform.OS !== 'web') {
      Vibration.vibrate(30);
    }
    onPress();
  };

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: withTiming(isSelected ? 0.18 : 0.06, { duration: 200 }),
    shadowRadius: withTiming(isSelected ? 16 : 6, { duration: 200 }),
    elevation: elevation.value,
  }));

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));

  const pulseAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const PriorityIcon = level.value === 'Emergency SOS'
    ? Siren
    : level.value === 'Urgent'
    ? BellRing
    : ShieldCheck;

  if (level.isSOS) {
    // ── SOS Card (Gradient Red) ──
    return (
      <Pressable onPress={handlePress} accessibilityRole="button" accessibilityLabel={`Select ${level.title} priority`}>
        <Animated.View style={[styles.sosCard, cardAnimStyle]}>
          {/* Pulse Halo */}
          <Animated.View
            style={[
              styles.sosHalo,
              pulseAnimStyle,
            ]}
          />
          {/* Icon Container */}
          <View style={styles.sosIconWrap}>
            <PriorityIcon color="#FFFFFF" size={22} strokeWidth={2.2} />
          </View>

          {/* Text */}
          <View style={styles.cardTextWrap}>
            <Text style={styles.sosTitleText}>{level.title}</Text>
            <Text style={styles.sosDescText}>{level.description}</Text>
          </View>

          {/* Selection Indicator */}
          <Animated.View style={[styles.checkWrap, checkAnimStyle]}>
            <CircleCheck color="#FFFFFF" size={22} strokeWidth={2.5} />
          </Animated.View>
          {!isSelected && (
            <View style={styles.unselectedCircle}>
              <View style={styles.unselectedInnerCircle} />
            </View>
          )}
        </Animated.View>
      </Pressable>
    );
  }

  // ── Normal / Urgent Card (White) ──
  return (
    <Pressable onPress={handlePress} accessibilityRole="button" accessibilityLabel={`Select ${level.title} priority`}>
      <Animated.View
        style={[
          styles.standardCard,
          isSelected && {
            borderColor: level.accentColor,
            borderWidth: 1.5,
          },
          cardAnimStyle,
        ]}
      >
        {/* Icon Container */}
        <View
          style={[
            styles.standardIconWrap,
            { backgroundColor: `${level.accentColor}14` },
          ]}
        >
          <PriorityIcon color={level.iconColor} size={20} strokeWidth={2.2} />
        </View>

        {/* Text */}
        <View style={styles.cardTextWrap}>
          <Text style={[styles.standardTitleText, isSelected && { color: '#0F172A' }]}>
            {level.title}
          </Text>
          <Text style={styles.standardDescText}>{level.description}</Text>
        </View>

        {/* Selection Indicator */}
        <Animated.View style={checkAnimStyle}>
          <CircleCheck color={level.accentColor} size={22} strokeWidth={2.5} />
        </Animated.View>
        {!isSelected && (
          <Circle color="#CBD5E1" size={22} strokeWidth={1.5} />
        )}
      </Animated.View>
    </Pressable>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function EmergencyRequestScreen() {
  const router = useRouter();
  const { createBloodRequest, currentUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [units, setUnits] = useState('1');
  const [hospitalName, setHospitalName] = useState('');
  const [city, setCity] = useState(currentUser?.city || '');
  const [district, setDistrict] = useState(currentUser?.district || '');
  const [contactNumber, setContactNumber] = useState(currentUser?.mobile || '');
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [priority, setPriority] = useState<PriorityValue>('Emergency SOS');

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const isValid =
    patientName.trim() &&
    bloodGroup &&
    hospitalName.trim() &&
    city.trim() &&
    district.trim() &&
    contactNumber.trim();

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setErrorMessage(null);
    const result = await createBloodRequest({
      patientName,
      bloodGroup,
      unitsRequired: parseInt(units, 10) || 1,
      hospitalName,
      hospitalAddress: '',
      city,
      district,
      location: city ? `${city}, ${district}` : (currentUser?.city || 'Unknown'),
      contactNumber,
      contactPersonName: currentUser?.fullName || 'Attendant',
      requiredByDate: getTodayDateString(),
      urgencyLevel: priority,
      additionalNotes: emergencyMessage,
    });
    setLoading(false);
    if (result.success) {
      router.back();
    } else {
      setErrorMessage(result.error || 'Failed to trigger emergency request.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft color="#fff" size={24} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Emergency Alert</Text>
            <Flame color="#FDE68A" size={20} fill="#FDE68A" />
          </View>
          <Text style={styles.headerSubtitle}>Publish critical SOS request immediately</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Warning Banner ── */}
        <View style={styles.warningBanner}>
          <View style={styles.warningIconWrap}>
            <AlertOctagon color="#DC2626" size={22} strokeWidth={2} />
          </View>
          <View style={styles.warningTextWrap}>
            <Text style={styles.warningTitle}>SOS Alert Protocol</Text>
            <Text style={styles.warningDesc}>
              Warning: This triggers loud siren notifications to all compatible donors. Use only for genuine emergencies where blood is needed within hours.
            </Text>
          </View>
        </View>

        {/* ── Priority Selector ── */}
        <View style={styles.prioritySection}>
          <Text style={styles.prioritySectionTitle}>ALERT PRIORITY LEVEL</Text>
          <Text style={styles.prioritySectionSubtitle}>
            Choose how urgently this request should be broadcast
          </Text>

          <View style={styles.priorityList}>
            {PRIORITY_LEVELS.map((level) => (
              <PriorityCard
                key={level.value}
                level={level}
                isSelected={priority === level.value}
                onPress={() => setPriority(level.value)}
              />
            ))}
          </View>
        </View>

        {/* ── Patient Info ── */}
        <SectionLabel>Patient Info</SectionLabel>
        <Input
          placeholder="Patient Full Name *"
          value={patientName}
          onChangeText={setPatientName}
        />

        {/* ── Blood Group ── */}
        <SectionLabel>Required Blood Group *</SectionLabel>
        <View style={styles.bloodGroupGrid}>
          {BLOOD_GROUPS.map((bg) => (
            <TouchableOpacity
              key={bg}
              style={[
                styles.bloodGroupBtn,
                bloodGroup === bg && styles.bloodGroupBtnActive,
              ]}
              onPress={() => setBloodGroup(bg)}
              accessibilityRole="button"
              accessibilityLabel={`Blood group ${bg}`}
            >
              <Text style={[styles.bloodGroupText, bloodGroup === bg && styles.bloodGroupTextActive]}>
                {bg}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Units ── */}
        <SectionLabel>Units Required</SectionLabel>
        <View style={styles.unitsRow}>
          {['1', '2', '3', '4', '5+'].map((u) => {
            const isActive = units === u || (u === '5+' && parseInt(units) >= 5);
            return (
              <TouchableOpacity
                key={u}
                style={[styles.unitBtn, isActive && styles.unitBtnActive]}
                onPress={() => setUnits(u === '5+' ? '5' : u)}
                accessibilityRole="button"
                accessibilityLabel={`${u} units`}
              >
                <Text style={[styles.unitText, isActive && styles.unitTextActive]}>{u}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Hospital & Location ── */}
        <SectionLabel>Hospital & Location</SectionLabel>
        <Input placeholder="Hospital Name / Details *" value={hospitalName} onChangeText={setHospitalName} />
        <Input placeholder="City / Area *" value={city} onChangeText={setCity} />
        <Input placeholder="District *" value={district} onChangeText={setDistrict} />

        {/* ── Contact ── */}
        <SectionLabel>Emergency Contact Number</SectionLabel>
        <Input
          placeholder="Contact Mobile Number *"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />

        {/* ── Message ── */}
        <SectionLabel>Emergency Message / Details</SectionLabel>
        <Input
          placeholder="Describe the medical situation or urgent details here..."
          value={emergencyMessage}
          onChangeText={setEmergencyMessage}
          multiline
          numberOfLines={4}
          style={{ height: 'auto', minHeight: 88, paddingTop: 12 }}
          inputStyle={{ textAlignVertical: 'top' }}
        />

        {/* ── Submit ── */}
        {errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
        <Button
          label={isValid ? 'Trigger Siren SOS Alert' : 'Complete Required Fields'}
          disabled={!isValid}
          loading={loading}
          onPress={handleSubmit}
          style={{ backgroundColor: isValid ? '#DC2626' : '#94A3B8', marginTop: 24, marginBottom: 16 }}
        />

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Header
  header: {
    backgroundColor: '#DC2626',
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(220,38,38,0.5)',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerTextWrap: { flex: 1 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
    fontWeight: '500',
  },

  scroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Warning Banner
  warningBanner: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  warningIconWrap: {
    width: 36,
    height: 36,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  warningTextWrap: { flex: 1 },
  warningTitle: {
    color: '#991B1B',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: -0.1,
  },
  warningDesc: {
    color: '#B91C1C',
    fontSize: 12,
    marginTop: 3,
    lineHeight: 18,
    fontWeight: '400',
  },

  // ── Priority Section Header ──
  prioritySection: {
    marginBottom: 8,
  },
  prioritySectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  prioritySectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 16,
  },
  priorityList: {
    gap: 10,
  },

  // ── SOS Card ──
  sosCard: {
    height: 84,
    backgroundColor: '#DC2626',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 14,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'visible',
    position: 'relative',
  },
  sosHalo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: '#EF4444',
    left: 0,
    top: 0,
  },
  sosIconWrap: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  sosTitleText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  sosDescText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 16,
  },

  // ── Standard Card (Urgent / Normal) ──
  standardCard: {
    height: 84,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  standardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  standardTitleText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  standardDescText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    lineHeight: 16,
  },

  // Shared card text
  cardTextWrap: { flex: 1 },

  // Selection Indicator
  checkWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselectedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselectedInnerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },

  // Section Label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 20,
  },

  // Blood Group
  bloodGroupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 4,
  },
  bloodGroupBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  bloodGroupBtnActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
    shadowColor: '#DC2626',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bloodGroupText: {
    fontWeight: '700',
    fontSize: 15,
    color: '#475569',
  },
  bloodGroupTextActive: {
    color: '#FFFFFF',
  },

  // Units
  unitsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  unitBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  unitBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  unitText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#475569',
  },
  unitTextActive: {
    color: '#FFFFFF',
  },

  // Submit / Cancel
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 48,
  },
  cancelText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 15,
  },
});
