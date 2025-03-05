import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { AuthContext } from "../../context/authContext";

// Dummy Nurse Profile
const nurseProfile = {
  id: "1",
  name: "John Doe",
  role: "Senior Nurse - Night Shift",
  image: "https://randomuser.me/api/portraits/men/1.jpg",
};

// Dummy Task List
const tasks = [
  {
    id: "101",
    title: "Administer Medication",
    date: "March 6, 2025",
    time: "10:30 AM",
  },
  {
    id: "102",
    title: "Check Patient Vitals",
    date: "March 6, 2025",
    time: "12:00 PM",
  },
  {
    id: "103",
    title: "Prepare Discharge Reports",
    date: "March 6, 2025",
    time: "2:00 PM",
  },
];

const Home = () => {
  const { removeToken } = useContext(AuthContext);

  const userLogout = async () => {
    await removeToken();
  };

  // Render Task Item
  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDate}>{item.date}</Text>
      <Text style={styles.taskTime}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Nurse Profile */}
      <View style={styles.profileCard}>
        <Image source={{ uri: nurseProfile.image }} style={styles.image} />
        <View style={styles.profileText}>
          <Text style={styles.name}>{nurseProfile.name}</Text>
          <Text style={styles.role}>{nurseProfile.role}</Text>
        </View>
      </View>

      {/* Task List */}
      <Text style={styles.sectionTitle}>Today's Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.list}
      />

      {/* Logout Button */}
      <TouchableOpacity style={styles.button} onPress={userLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  role: {
    fontSize: 14,
    color: "#777",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  list: {
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  taskDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  taskTime: {
    fontSize: 14,
    color: "#888",
  },
  button: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
