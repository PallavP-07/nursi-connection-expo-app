import React, { useState, useEffect, useRef } from "react";
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
  ActivityIndicator,
  Alert
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { height, width } = Dimensions.get("window");

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const scrollViewRef = useRef(null);

  useEffect(() => {
    let interval;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, resendDisabled]);

  const startResendTimer = () => {
    setResendDisabled(true);
    setTimer(30);
    // Simulate OTP resend
    Alert.alert("OTP Sent", "A new OTP has been sent to your email");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSendOTP = () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email");
      return;
    }
    
    setEmailError("");
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      startResendTimer();
    }, 1500);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  const handleResetPassword = () => {
    if (!newPassword) {
      setPasswordError("Password is required");
      return;
    }
    
    if (!validatePassword(newPassword)) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    setPasswordError("");
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Success",
        "Your password has been reset successfully",
        [
          {
            text: "Login Now",
            onPress: () => router.replace("/login")
          }
        ]
      );
    }, 1500);
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.stepRow}>
            <View 
              style={[
                styles.stepDot, 
                step >= item && styles.activeStepDot
              ]}
            >
              {step > item && (
                <Ionicons name="checkmark" size={12} color="#fff" />
              )}
              {step === item && (
                <Text style={styles.stepNumber}>{item}</Text>
              )}
            </View>
            {item < 3 && (
              <View 
                style={[
                  styles.stepLine, 
                  step > item && styles.activeStepLine
                ]} 
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient 
          style={styles.background} 
          colors={["#4776E6", "#8E54E9"]}
        >
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContainer} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.contentContainer}>
              {/* Header Image */}
              <Image 
                source={require("../../assets/images/forgot-password-bg.png")} 
                style={styles.animation} 
                resizeMode="contain"
              />
              
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  {step === 1 ? "Forgot Password" : 
                   step === 2 ? "Verify OTP" : 
                   "Reset Password"}
                </Text>
                
                <Text style={styles.cardSubtitle}>
                  {step === 1 ? "Enter your email to receive a verification code" : 
                   step === 2 ? `We've sent a 6-digit code to ${email}` : 
                   "Create a new secure password"}
                </Text>
                
                {renderStepIndicator()}

                {/* Step 1: Enter Email */}
                {step === 1 && (
                  <View style={styles.stepContainer}>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Email Address</Text>
                      <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter your email"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          value={email}
                          onChangeText={(text) => {
                            setEmail(text);
                            if (emailError) setEmailError("");
                          }}
                        />
                      </View>
                      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.button} 
                      onPress={handleSendOTP}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={styles.buttonText}>Send Verification Code</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {/* Step 2: Enter OTP */}
                {step === 2 && (
                  <View style={styles.stepContainer}>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Verification Code</Text>
                      <View style={styles.inputContainer}>
                        <Ionicons name="key-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter 6-digit code"
                          keyboardType="number-pad"
                          maxLength={6}
                          value={otp}
                          onChangeText={setOtp}
                        />
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.button} 
                      onPress={handleVerifyOTP}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={styles.buttonText}>Verify Code</Text>
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      disabled={resendDisabled}
                      style={styles.resendButton}
                      onPress={startResendTimer}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.resendText,
                        resendDisabled && styles.disabledText
                      ]}>
                        {resendDisabled ? `Resend code in ${timer}s` : "Resend code"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Step 3: Reset Password */}
                {step === 3 && (
                  <View style={styles.stepContainer}>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>New Password</Text>
                      <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter new password"
                          secureTextEntry={!showPassword}
                          value={newPassword}
                          onChangeText={(text) => {
                            setNewPassword(text);
                            if (passwordError) setPasswordError("");
                          }}
                        />
                        <TouchableOpacity 
                          style={styles.eyeIcon}
                          onPress={() => setShowPassword(!showPassword)}
                          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        >
                          <Ionicons 
                            name={showPassword ? "eye-off-outline" : "eye-outline"} 
                            size={20} 
                            color="#666" 
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Confirm Password</Text>
                      <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Confirm your password"
                          secureTextEntry={!showConfirmPassword}
                          value={confirmPassword}
                          onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (passwordError) setPasswordError("");
                          }}
                        />
                        <TouchableOpacity 
                          style={styles.eyeIcon}
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        >
                          <Ionicons 
                            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                            size={20} 
                            color="#666" 
                          />
                        </TouchableOpacity>
                      </View>
                      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    </View>
                    
                    <View style={styles.passwordRequirements}>
                      <Text style={styles.requirementTitle}>Password must:</Text>
                      <View style={styles.requirementItem}>
                        <Ionicons 
                          name={newPassword.length >= 8 ? "checkmark-circle" : "ellipse-outline"} 
                          size={16} 
                          color={newPassword.length >= 8 ? "#4CAF50" : "#999"} 
                        />
                        <Text style={styles.requirementText}>Be at least 8 characters</Text>
                      </View>
                      <View style={styles.requirementItem}>
                        <Ionicons 
                          name={/[A-Z]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                          size={16} 
                          color={/[A-Z]/.test(newPassword) ? "#4CAF50" : "#999"} 
                        />
                        <Text style={styles.requirementText}>Include uppercase letter</Text>
                      </View>
                      <View style={styles.requirementItem}>
                        <Ionicons 
                          name={/[0-9]/.test(newPassword) ? "checkmark-circle" : "ellipse-outline"} 
                          size={16} 
                          color={/[0-9]/.test(newPassword) ? "#4CAF50" : "#999"} 
                        />
                        <Text style={styles.requirementText}>Include a number</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.button} 
                      onPress={handleResetPassword}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={styles.buttonText}>Reset Password</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: width * 0.7,
    height: width * 0.5,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStepDot: {
    backgroundColor: "#8E54E9",
  },
  stepNumber: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  activeStepLine: {
    backgroundColor: "#8E54E9",
  },
  stepContainer: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
    height: 56,
    position: "relative",
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: "#333",
    paddingRight: 12,
  },
  eyeIcon: {
    padding: 12,
    position: "absolute",
    right: 0,
    height: "100%",
    justifyContent: "center",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#8E54E9",
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#8E54E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  resendButton: {
    alignItems: "center",
    marginTop: 16,
    padding: 8,
  },
  resendText: {
    color: "#8E54E9",
    fontWeight: "600",
  },
  disabledText: {
    color: "#999",
  },
  passwordRequirements: {
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  requirementTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
  },
});

export default ForgotPassword;