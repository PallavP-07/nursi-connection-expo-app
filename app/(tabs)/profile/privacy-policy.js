import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(()=>{
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined, 
      });
    };
  },[navigation]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#007bff" barStyle="light-content" />
      {/* Header Section with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Privacy Policy</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.content}>
          Welcome to the Nurse Connection App. Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
        </Text>

        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.content}>
          We may collect personal details such as your name, email, phone number, and employment information. We also gather data on how you interact with our app.
        </Text>

        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.content}>
          - To provide and improve our services.{"\n"}
          - To communicate with you about updates and support.{"\n"}
          - To ensure security and compliance with legal requirements.
        </Text>

        <Text style={styles.sectionTitle}>Data Security</Text>
        <Text style={styles.content}>
          We take appropriate security measures to protect your data from unauthorized access, alteration, or destruction.
        </Text>

        <Text style={styles.sectionTitle}>Your Rights</Text>
        <Text style={styles.content}>
          You have the right to access, update, or delete your personal information. Contact us at support@nurseapp.com for any requests.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.content}>
          If you have any questions about this Privacy Policy, please reach out to us at support@nurseapp.com.
        </Text>

        {/* Bottom Space for Better Scroll Experience */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    marginTop: 20,
  },
  content: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
    lineHeight: 22,
  },
});

export default PrivacyPolicyScreen;
