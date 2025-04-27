import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar, SafeAreaView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

const ProfileDetails = () => {
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
  // Dummy Nurse Data
  const nurseData = {
    name: "Kyra D'souza",
    role: "Registered Nurse",
    id: "RN123456",
    experience: "5 Years",
    specialization: "Critical Care",
    hospital: "St. Mary's Hospital",
    email: "janedoe@nurseapp.com",
    phone: "+1 987-654-3210",
    address: "123 Healthcare St, New York, USA",
    image: "https://avatar.iran.liara.run/public/27",
  };

  return (
    <SafeAreaView style={styles.container}>
       <StatusBar backgroundColor="#007bff" barStyle="light-content" />
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: nurseData.image }} style={styles.profileImage} />
        </View>

        {/* Basic Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <InfoRow label="Full Name" value={nurseData.name} icon="person-outline" />
          <InfoRow label="Nurse ID" value={nurseData.id} icon="id-card-outline" />
        </View>

        {/* Professional Details */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Professional Details</Text>
          <InfoRow label="Role" value={nurseData.role} icon="briefcase-outline" />
          <InfoRow label="Experience" value={nurseData.experience} icon="time-outline" />
          <InfoRow label="Specialization" value={nurseData.specialization} icon="medkit-outline" />
          <InfoRow label="Hospital" value={nurseData.hospital} icon="business-outline" />
        </View>

        {/* Contact Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <InfoRow label="Email" value={nurseData.email} icon="mail-outline" />
          <InfoRow label="Phone" value={nurseData.phone} icon="call-outline" />
          <InfoRow label="Address" value={nurseData.address} icon="location-outline" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable Row Component
const InfoRow = ({ label, value, icon }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={22} color="#007bff" />
    <View style={styles.infoText}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

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
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileImageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  infoSection: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoText: {
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    color: "#555",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ProfileDetails;
