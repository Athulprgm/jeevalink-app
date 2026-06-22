import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DateTimePicker, {
    DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
    Camera,
    Check,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    Droplet,
    Square,
    CheckSquare,
} from "lucide-react-native";
import { Link } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import api from "../../store/api";
import { useAppStore } from "../../store/useAppStore";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const StepIndicator = ({ step }: { step: number }) => (
  <View className="flex-row items-center justify-center mb-10 mt-2">
    {[1, 2].map((s) => (
      <View key={s} className="flex-row items-center">
        <View
          className={`w-10 h-10 rounded-[16px] items-center justify-center ${
            s <= step ? "bg-red-600" : "bg-slate-100"
          }`}
        >
          {s < step ? (
            <Check color="#fff" size={18} />
          ) : (
            <Text
              className={`font-black text-[15px] ${s <= step ? "text-white" : "text-slate-400"}`}
            >
              {s}
            </Text>
          )}
        </View>
        {s < 2 && (
          <View
            className={`h-[3px] w-12 mx-2 rounded-full ${step > 1 ? "bg-red-600" : "bg-slate-100"}`}
          />
        )}
      </View>
    ))}
  </View>
);

export default function RegisterScreen() {
  const [step, setStep] = useState(1);

  // Step 1 — Common fields
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 — Donor specific
  const [bloodGroup, setBloodGroup] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");

  const [idProofFront, setIdProofFront] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [idProofBack, setIdProofBack] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [imagePickerSide, setImagePickerSide] = useState<
    "front" | "back" | null
  >(null);

  const { register } = useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const canProceedStep1 = () => {
    if (!fullName || !mobile || !password || !confirmPassword) return false;
    if (password !== confirmPassword) return false;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    return true;
  };

  const handlePincodeChange = async (pin: string) => {
    setPincode(pin);
    if (pin.length === 6) {
      try {
        const res = await api.get(`/location/pincode/${pin}`);
        if (res.data && res.data.success) {
          setDistrict(res.data.district || "");
          setCity(res.data.city || res.data.district || "");
        }
      } catch (err) {
        console.log("Pincode fetch error", err);
      }
    }
  };

  const handlePickImage = async (sourceType: "camera" | "gallery") => {
    const side = imagePickerSide;
    setImagePickerSide(null);
    if (!side) return;

    if (sourceType === "camera") {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission required", "You need to allow camera access.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (side === "front") {
          setIdProofFront(result.assets[0]);
        } else {
          setIdProofBack(result.assets[0]);
        }
      }
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (side === "front") {
          setIdProofFront(result.assets[0]);
        } else {
          setIdProofBack(result.assets[0]);
        }
      }
    }
  };

  const pickImage = (side: "front" | "back") => {
    setImagePickerSide(side);
  };

  const handleRegister = async () => {
    setErrorMessage(null);
    if (!bloodGroup) {
      setErrorMessage("Blood Group is required.");
      return;
    }
    if (!dateOfBirth) {
      setErrorMessage("Date of Birth is required.");
      return;
    }

    // Age Validation
    const ageDifMs = Date.now() - dateOfBirth.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age < 18) {
      setErrorMessage("You must be at least 18 years old to register.");
      return;
    }

    if (!pincode || pincode.length !== 6) {
      setErrorMessage("Valid 6-digit PIN code is required.");
      return;
    }
    if (!address) {
      setErrorMessage("Full address is required.");
      return;
    }
    if (!district || !city) {
      setErrorMessage("District and City are required.");
      return;
    }
    if (!idProofFront || !idProofBack) {
      setErrorMessage("Both Front and Back ID proofs are required.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("mobile", mobile);
    if (email) formData.append("email", email);
    formData.append("password", password);
    formData.append("role", "donor");
    formData.append("blood_group", bloodGroup);
    formData.append("date_of_birth", dateOfBirth.toISOString().split("T")[0]);
    formData.append("pincode", pincode);
    formData.append("address", address);
    formData.append("district", district);
    formData.append("city", city);

    formData.append("id_proof_front", {
      uri: idProofFront.uri,
      name: idProofFront.uri.split("/").pop() || "front.jpg",
      type: idProofFront.mimeType || "image/jpeg",
    } as any);

    formData.append("id_proof_back", {
      uri: idProofBack.uri,
      name: idProofBack.uri.split("/").pop() || "back.jpg",
      type: idProofBack.mimeType || "image/jpeg",
    } as any);

    const result = await register(formData);
    setLoading(false);
    if (result.success) {
      router.replace("/(tabs)");
    } else {
      setErrorMessage(result.error || "Registration failed.");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1 bg-slate-50"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="pt-16 pb-6 px-6">
          <TouchableOpacity
            className="flex-row items-center mb-8"
            onPress={() => (step === 1 ? router.back() : setStep(1))}
          >
            <ChevronLeft color="#64748b" size={22} />
            <Text className="text-slate-500 ml-1 font-semibold text-[15px]">
              {step === 1 ? "Back to Login" : "Back to Step 1"}
            </Text>
          </TouchableOpacity>

          <Text className="text-[32px] font-black text-slate-900 mb-2">
            Create Account
          </Text>
          <Text className="text-slate-500 mb-8 text-[15px]">
            Join the JeevaLink network to save lives.
          </Text>

          <StepIndicator step={step} />

          {/* ─── Step 1 ─── */}
          {step === 1 && (
            <View>
              <Text className="text-[20px] font-black text-slate-900 mb-6">
                Basic Credentials
              </Text>

              <Input
                placeholder="Full Name (As per Government ID)"
                value={fullName}
                onChangeText={setFullName}
              />

              <Input
                placeholder="Mobile Number (10 digits)"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={10}
              />

              <Input
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                placeholder="Password (min. 6 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightIcon={
                  showPassword ? (
                    <EyeOff color="#94a3b8" size={18} />
                  ) : (
                    <Eye color="#94a3b8" size={18} />
                  )
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <Input
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                rightIcon={
                  showConfirmPassword ? (
                    <EyeOff color="#94a3b8" size={18} />
                  ) : (
                    <Eye color="#94a3b8" size={18} />
                  )
                }
                onRightIconPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />
              {password && confirmPassword && password !== confirmPassword && (
                <Text
                  style={{
                    color: "#DC2626",
                    fontSize: 12,
                    marginTop: -12,
                    marginBottom: 12,
                    marginLeft: 4,
                  }}
                >
                  Passwords do not match
                </Text>
              )}

              <Button
                label="Continue"
                disabled={!canProceedStep1()}
                onPress={() => canProceedStep1() && setStep(2)}
                rightIcon={
                  <ChevronRight
                    color={canProceedStep1() ? "#fff" : "#94a3b8"}
                    size={18}
                  />
                }
              />
            </View>
          )}

          {/* ─── Step 2 ─── */}
          {step === 2 && (
            <View>
              <Text className="text-[20px] font-black text-slate-900 mb-6">
                Donor Details
              </Text>

              {/* Blood Group Picker */}
              <Text className="text-slate-500 text-[13px] font-semibold mb-3 ml-1 uppercase tracking-wider">
                Blood Group
              </Text>
              <View className="flex-row flex-wrap mb-6 gap-3">
                {BLOOD_GROUPS.map((bg) => (
                  <TouchableOpacity
                    key={bg}
                    className={`px-5 py-3 rounded-[16px] border ${bloodGroup === bg ? "bg-red-600 border-red-600" : "bg-white border-slate-100"}`}
                    onPress={() => setBloodGroup(bg)}
                  >
                    <Text
                      className={`font-bold text-[15px] ${bloodGroup === bg ? "text-white" : "text-slate-700"}`}
                    >
                      {bg}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === "android") {
                    DateTimePickerAndroid.open({
                      value: dateOfBirth || new Date(),
                      mode: "date",
                      display: "default",
                      maximumDate: new Date(),
                      onValueChange: (event, selectedDate) => {
                        if (selectedDate) setDateOfBirth(selectedDate);
                      },
                    });
                  } else {
                    setShowDatePicker(true);
                  }
                }}
                className="mb-4"
              >
                <View pointerEvents="none">
                  <Input
                    placeholder="Date of Birth"
                    value={dateOfBirth ? dateOfBirth.toLocaleDateString() : ""}
                    editable={false}
                  />
                </View>
              </TouchableOpacity>

              {Platform.OS === "ios" && showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth || new Date()}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onValueChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDateOfBirth(selectedDate);
                  }}
                  onDismiss={() => setShowDatePicker(false)}
                />
              )}

              <Input
                placeholder="PIN Code"
                value={pincode}
                onChangeText={handlePincodeChange}
                keyboardType="numeric"
                maxLength={6}
              />

              <Input
                placeholder="Full Address"
                value={address}
                onChangeText={setAddress}
              />

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input
                    placeholder="District"
                    value={district}
                    onChangeText={setDistrict}
                  />
                </View>
                <View className="flex-1">
                  <Input
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
              </View>

              <Text className="text-slate-500 text-[13px] font-semibold mb-3 ml-1 uppercase tracking-wider mt-2">
                Government ID Proof
              </Text>
              <View className="flex-row gap-3 mb-6">
                <TouchableOpacity
                  onPress={() => pickImage("front")}
                  className="flex-1 h-32 rounded-2xl border-2 border-dashed border-slate-300 items-center justify-center bg-white overflow-hidden"
                >
                  {idProofFront ? (
                    <Image
                      source={{ uri: idProofFront.uri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <>
                      <Camera color="#94a3b8" size={28} className="mb-2" />
                      <Text className="text-slate-500 text-[13px] font-semibold text-center px-2">
                        Upload Front
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => pickImage("back")}
                  className="flex-1 h-32 rounded-2xl border-2 border-dashed border-slate-300 items-center justify-center bg-white overflow-hidden"
                >
                  {idProofBack ? (
                    <Image
                      source={{ uri: idProofBack.uri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <>
                      <Camera color="#94a3b8" size={28} className="mb-2" />
                      <Text className="text-slate-500 text-[13px] font-semibold text-center px-2">
                        Upload Back
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {errorMessage && (
                <Text
                  style={{
                    color: "#DC2626",
                    fontSize: 14,
                    fontWeight: "600",
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  {errorMessage}
                </Text>
              )}

              {/* Terms and Conditions Checkbox */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 24,
                  marginTop: 8,
                }}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                activeOpacity={0.7}
              >
                {acceptedTerms ? (
                  <CheckSquare color="#DC2626" size={22} />
                ) : (
                  <Square color="#94a3b8" size={22} />
                )}
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ color: "#475569", fontSize: 13, lineHeight: 18 }}>
                    I agree to the{" "}
                    <Link href="/terms" style={{ color: "#DC2626", fontWeight: "600" }}>
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" style={{ color: "#DC2626", fontWeight: "600" }}>
                      Privacy Policy
                    </Link>
                  </Text>
                </View>
              </TouchableOpacity>

              <Button
                label="Register as Donor"
                leftIcon={<Droplet color="#fff" size={18} fill="#fff" />}
                onPress={handleRegister}
                loading={loading}
                disabled={!acceptedTerms}
                style={{ marginBottom: 48 }}
              />
            </View>
          )}
        </View>
      </ScrollView>
      {/* Image Picker Modal */}
      <Modal visible={!!imagePickerSide} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 24,
              borderRadius: 16,
              width: "100%",
              gap: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Upload ID Proof
            </Text>
            <Button
              label="Take Photo"
              onPress={() => handlePickImage("camera")}
            />
            <Button
              label="Choose from Gallery"
              onPress={() => handlePickImage("gallery")}
            />
            <TouchableOpacity
              style={{
                padding: 16,
                backgroundColor: "#f1f5f9",
                borderRadius: 8,
                alignItems: "center",
                marginTop: 4,
              }}
              onPress={() => setImagePickerSide(null)}
            >
              <Text style={{ fontWeight: "600", color: "#64748b" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
