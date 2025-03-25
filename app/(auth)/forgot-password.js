import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, resendDisabled]);

  const startResendTimer = () => {
    setResendDisabled(true);
    setTimer(30);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <LinearGradient style={styles.background} colors={["#1856d9", "#030B4A"]}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={26} color="#ffffff" />
            </TouchableOpacity>

            {/* Lottie Animation or Image */}
            <Image source={require("../../assets/images/forgotPassword.png")} style={styles.animation} />

            {/* Step 1: Enter Email */}
            {step === 1 && (
              <View style={styles.stepContainer}>
                <Text style={styles.title}>Enter your email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
                  <Text style={styles.buttonText}>Send OTP</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Enter OTP */}
            {step === 2 && (
              <View style={styles.stepContainer}>
                <Text style={styles.title}>Enter OTP</Text>
                <TextInput
                  style={styles.input}
                  placeholder="OTP"
                  keyboardType="numeric"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                />
                <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
                  <Text style={styles.buttonText}>Verify OTP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={resendDisabled}
                  style={[styles.resendButton, resendDisabled && styles.disabledButton]}
                  onPress={startResendTimer}
                >
                  <Text style={styles.resendText}>
                    {resendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <View style={styles.stepContainer}>
                <Text style={styles.title}>Set New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => alert("Password Updated Successfully")}
                >
                  <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>
              </View>
            )}
          </LinearGradient>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
  },
  animation: {
    width: 380,
    height: 380,
    alignSelf: "center",
    marginBottom: 40,
  },
  stepContainer: {
    width: "90%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
    color: "#ffffff",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  resendButton: {
    marginTop: 10,
  },
  resendText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
