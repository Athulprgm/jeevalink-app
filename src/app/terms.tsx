import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsAndConditionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="#64748b" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.lastUpdated}>Last Updated: June 2026</Text>

        <Text style={styles.paragraph}>
          Please read these Terms and Conditions carefully before using the JeevaLink mobile application operated by us.
        </Text>

        <Text style={styles.heading}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using the JeevaLink app, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
        </Text>

        <Text style={styles.heading}>2. Eligibility</Text>
        <Text style={styles.paragraph}>
          You must be at least 18 years old and in good health to register as a blood donor on JeevaLink. By creating an account, you confirm that you meet these eligibility requirements and that the information you provide is accurate and complete.
        </Text>

        <Text style={styles.heading}>3. User Responsibilities</Text>
        <Text style={styles.paragraph}>
          - You agree to provide accurate and truthful medical and personal information.
          {"\n"}- You agree to respond promptly to donation requests if you mark yourself as "Available".
          {"\n"}- You must not use the platform for any fraudulent or malicious activity, including creating false emergency requests.
        </Text>

        <Text style={styles.heading}>4. Medical Disclaimer</Text>
        <Text style={styles.paragraph}>
          JeevaLink is a platform designed to connect blood donors with individuals in need. We are not a healthcare provider and do not provide medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional regarding any medical concerns or your suitability to donate blood.
        </Text>

        <Text style={styles.heading}>5. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          JeevaLink shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from your use of the application or the inability to secure a blood donation match. We do not guarantee that a donor will be found for every request.
        </Text>

        <Text style={styles.heading}>6. Account Termination</Text>
        <Text style={styles.paragraph}>
          We reserve the right to suspend or terminate your account immediately, without prior notice, if you breach these Terms or engage in abusive behavior on the platform.
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
