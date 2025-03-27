import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";
import CustomModel from "../../components/CustomModel";
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from "expo-linear-gradient";
const leaveData = [
  { id: "1", type: "Sick Leave", from: "March 1, 2025", to: "March 3, 2025", status: "Approved", reason: "High fever and doctor's recommendation" },
  { id: "2", type: "Casual Leave", from: "March 10, 2025", to: "March 11, 2025", status: "Pending", reason: "Family function" },
  { id: "3", type: "Emergency Leave", from: "March 15, 2025", to: "March 16, 2025", status: "Rejected", reason: "Not enough staff availability" },
  { id: "4", type: "Vacation", from: "April 5, 2025", to: "April 10, 2025", status: "Approved", reason: "Annual leave" },
];
const leaveGradients = [
  ["#6D80FE", "#23D2FD"], // Orange-Red
  ["#FF998B", "#FF6D88"], // Purple-Blue
  ["#09AFE8", "#29F499"], // Green-Blue
  ["#FA81E8", "#707CFF"], // Red-Pink
];

const leaveSummary = {
  totalAllocated: 20,
  leaveTaken: 8,
  leaveAvailable: 12,
  totalHolidays: 10,
};
const leaveSummaryData = [
  { title: "Total Allocated", value: leaveSummary.totalAllocated },
  { title: "Leave Taken", value: leaveSummary.leaveTaken },
  { title: "Leave Available", value: leaveSummary.leaveAvailable },
  { title: "Total Holidays", value: leaveSummary.totalHolidays },
];
const getStatusColor = (status) => {
  switch (status) {
    case "Approved": return "#28A745";
    case "Pending": return "#FFC107";
    case "Rejected": return "#DC3545";
    default: return "#333";
  }
};

const LeaveDetails = () => {
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);
  const filters = ["All", "Approved", "Pending", "Rejected"];

  // Measure tab width dynamically
  const onTabLayout = (event) => {
    setTabWidth(event.nativeEvent.layout.width / filters.length);
  };

  // Smooth slide animation
  const onTabPress = (index) => {
    setFilter(filters[index]);
    Animated.spring(translateX, {
      toValue: index * tabWidth,
      useNativeDriver: true,
    }).start();
  };

  const filteredLeaveData = filter === "All" ? leaveData : leaveData.filter((item) => item.status === filter);

  const renderLeaveItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.date}>{item.from} - {item.to}</Text>
      <Text style={styles.reason}>{item.reason}</Text>
      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave Details</Text>

      {/* Leave Summary */}
      <View style={styles.summaryContainer}>
  {leaveSummaryData.map((item, index) => (
    <LinearGradient
      key={index}
      start={{ x: 1, y: 0 }} 
      end={{ x: 0, y: 0 }} 
      colors={leaveGradients[index]} // Assign a unique gradient to each card
      style={styles.summaryCard}
    >
      <Text style={styles.summaryTitle}>{item.title}</Text>
      <Text style={styles.summaryValue}>{item.value}</Text>
    </LinearGradient>
  ))}
</View>

      {/* Tab Filter */}
      <View style={styles.tabContainer} onLayout={onTabLayout}>
        <Animated.View
          style={[
            styles.activeTab,
            {
              width: tabWidth,
              transform: [{ translateX }],
            },
          ]}
        />
        {filters.map((status, index) => (
          <TouchableOpacity key={status} style={styles.tabButton} onPress={() => onTabPress(index)}>
            <Text style={[styles.tabText, filter === status && styles.activeTabText]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Leave List */}
      <FlatList
        data={filteredLeaveData}
        keyExtractor={(item) => item.id}
        renderItem={renderLeaveItem}
        contentContainerStyle={styles.list}
      />

      {/* Request Leave Button */}
      <TouchableOpacity style={styles.requestLeaveButton} onPress={() => setModalVisible(true)}>
      <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Request Leave</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <CustomModel setModalVisible={setModalVisible} modalVisible={modalVisible} />
      </Modal>
    </View>
  );
};

export default LeaveDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryCard: {
    width: "48%",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight:"600"
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 20,
    height: 40,
    alignItems: "center",
    position: "relative",
  },
  activeTab: {
    position: "absolute",
    height: "100%",
    backgroundColor: "gray",
    borderRadius: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  tabText: {
    color: "#333",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#FFF",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  type: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  reason: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
    fontStyle: "italic",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  requestLeaveButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom:15,
    flexDirection:"row",
    justifyContent:"center",
    alignContent:"center",
    gap:4
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
