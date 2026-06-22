import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="#64748b" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.lastUpdated}>Last Updated: June 2026</Text>

        <Text style={styles.paragraph}>
          Welcome to JeevaLink. Your privacy is critically important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our mobile application and services.
        </Text>

        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect personal information that you provide to us directly, such as your name, mobile number, email address, blood group, date of birth, and government ID proof. We also collect location data to match donors with nearby emergencies efficiently.
        </Text>

        <Text style={styles.heading}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          The primary purpose of collecting your data is to facilitate blood donation requests. Your location and blood group are used to notify you of nearby requests. Your contact information is shared with recipients or hospitals only when a match is confirmed or a request is accepted.
        </Text>

        <Text style={styles.heading}>3. Data Protection and Security</Text>
        <Text style={styles.paragraph}>
          We implement industry-standard security measures to protect your personal data and government ID proofs. We do not sell your personal information to third parties.
        </Text>

        <Text style={styles.heading}>4. Location Services</Text>
        <Text style={styles.paragraph}>
          JeevaLink requires access to your device's location to function correctly. You can enable or disable location tracking at any time through your device settings, although disabling it may limit your ability to receive local donation alerts.
        </Text>

        <Text style={styles.heading}>5. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </Text>

        <Text style={styles.heading}>6. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or concerns about this Privacy Policy, please contact us at support@jeevalink.org.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  contentContainer: {
    padding: 24,
  },
  lastUpdated: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 24,
    fontWeight: "600",
  },
  heading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    marginTop: 24,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: "#475569",
    marginBottom: 12,
  },
});
