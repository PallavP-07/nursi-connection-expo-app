import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

const ContactUs = () => {
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
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Contact Us</Text>
      </View>

      {/* Contact Information */}
      <View style={styles.contentContainer}>
        <Ionicons name="mail-outline" size={28} color="#007bff" />
        <Text style={styles.label}>Email</Text>
        <Text style={styles.info}>support@nurseapp.com</Text>

        <Ionicons name="call-outline" size={28} color="#007bff" style={styles.iconSpacing} />
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.info}>+1 123-456-7890</Text>

        <Ionicons name="location-outline" size={28} color="#007bff" style={styles.iconSpacing} />
        <Text style={styles.label}>Address</Text>
        <Text style={styles.info}>123, Healthcare Street, New York, USA</Text>
      </View>
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
    paddingVertical: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  iconSpacing: {
    marginTop: 20,
  },
});

export default ContactUs;
