import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import { Stack } from "expo-router/stack";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { loginAPI } from "../../api/authApi";
import { AuthContext } from "../../context/authContext";
import { router } from "expo-router";

const SignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const { generateToken } = useContext(AuthContext);

  const handleChangeStatus = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChangeData = (field, value) => {
    setLoginData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await loginAPI({
        email: loginData.email,
        password: loginData.password,
      });
      const { access_token } = response.data;
      if (access_token) {
        await generateToken(access_token);
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient style={styles.background} colors={["#1856d9", "#030B4A"]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Stack.Screen options={{ headerShown: false }} />

          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/mainLogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.welcome_message}>Welcome Back! Login here</Text>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter Your Email"
              style={styles.input}
              value={loginData.email}
              onChangeText={(text) => handleChangeData("email", text)}
              keyboardType="email-address"
              placeholderTextColor="gray"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter Your Password"
                style={[styles.input, styles.passwordInput]}
                value={loginData.password}
                onChangeText={(text) => handleChangeData("password", text)}
                placeholderTextColor="gray"
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={handleChangeStatus}
              >
                <Feather
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotBtn}
             onPress={() => router.push("/forgot-password")}
            >
              <Text style={styles.forgotBtnTxt}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          {loading ? (
            <ActivityIndicator size="large" color="#fff" style={styles.loader} />
          ) : (
            <TouchableOpacity
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    width: "100%",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  welcome_message: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
    color: "#ffff",
    marginBottom: 20,
  },
  logoContainer: {
    marginBottom: 10,
  },
  logo: {
    width: 240,
    height: 120,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 16,
    borderWidth: 3,
    borderColor: "#b9b9b9",
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    paddingRight: 40, // Ensure space for the icon
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    bottom: 30,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  disabledButton: {
    backgroundColor: "#b0c4de", // Light gray when disabled
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginVertical: 2,
  },
  forgotBtnTxt: {
    color: "#fff",
    fontSize: 16,
    textAlign: "right",
  },
  loader: {
    marginVertical: 20,
  },
});
