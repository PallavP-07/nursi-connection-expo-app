import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import * as ImagePicker from 'expo-image-picker';
const NurseProfile = () => {
  const [image, setImage] = useState(null);
  // Dummy data
  const nurseData = {
    name: "Kyra D'souza",
    role: "Registered Nurse",
    id: "RN123456",
    image: "https://avatar.iran.liara.run/public/27", // Placeholder image URL
  };
  const { removeToken } = useContext(AuthContext);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const userLogout = async () => {
    await removeToken();
  };
  return (
    <View style={styles.container}>
       <StatusBar backgroundColor="#1856d9" barStyle="light-content"/>
    
      <View style={styles.profile_card}>
        <View style={styles.profileImage}>
        {image ? <Image source={{ uri: image }} style={styles.profile_img}  />:<Image source={{ uri: nurseData.image }} style={styles.profile_img} />}  
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={pickImage}
          >
            <Ionicons
              name="camera-outline"
              size={25}
              style={styles.changeImageButton_icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.user_details}>
          <Text style={styles.name}>{nurseData.name}</Text>
          <Text style={styles.id}>ID: {nurseData.id}</Text>
        </View>
        <TouchableOpacity
          style={styles.optionBox}
          onPress={() => router.push("/(tabs)/profile/profile-details")}
        >
          <Ionicons name="person-outline" size={20} color="#333" />
          <Text style={styles.optionText}>My Profile</Text>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionBox}
          onPress={() => router.push("/(tabs)/profile/change-password")}
        >
          <Ionicons name="key-outline" size={20} color="#333" />
          <Text style={styles.optionText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionBox}
          onPress={() => router.push("/(tabs)/profile/privacy-policy")}
        >
          <Ionicons name="lock-closed-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionBox}
          onPress={() => router.push("/(tabs)/profile/contact-us")}
        >
          <Ionicons name="call-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Contact Us</Text>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={userLogout}>
          <Text style={styles.buttonText}>Logout</Text>
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#fff"
            style={styles.logoutIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1856d9",
    position: "relative",
  },
  header: {
    color: "#fafafa",
    fontSize: 22,
    zIndex: 20,
    position: "absolute",
    top: 0,
    alignSelf: "center",
    padding: 30,
    fontWeight: "600",
    letterSpacing: 1,
  },
  profile_card: {
    backgroundColor: "#fbfcfc",
    height: 540,
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    display: "flex",
    alignItems: "center",
  },
  profileImage: {
    position: "absolute",
    top: -80,
    backgroundColor: "#cecece",
    width: 160,
    height: 160,
    borderRadius: 100,
    zIndex: 20,
  },
  profile_img: {
    width: 160,
    height: 160,
    borderRadius: 100,
    zIndex: 20,
  },
  user_details: {
    marginTop: 80,
    display: "flex",
    gap: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  role: {
    fontSize: 18,
    color: "#555",
  },
  id: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
  changeImageButton: {
    backgroundColor: "#eeeeee",
    width: 40,
    height: 40,
    padding: 4,
    borderRadius: 50,
    position: "absolute",
    bottom: 0,
    right: 2,
    zIndex: 20,
    marginBottom: 10,
    borderWidth:1,
    borderColor:"#cecece"
  },
  changeImageButton_icon: {
    color: "#616161",
    margin: 2,
    textAlign:"center"
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5733",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 34,
    justifyContent: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginRight:5
  },
  optionBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 15,
    color: "#333",
  },
});

export default NurseProfile;
