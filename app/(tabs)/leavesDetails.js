import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

// Dummy Leave Data
const leaveData = [
  {
    id: "1",
    type: "Sick Leave",
    from: "March 1, 2025",
    to: "March 3, 2025",
    status: "Approved",
    reason: "High fever and doctor's recommendation",
  },
  {
    id: "2",
    type: "Casual Leave",
    from: "March 10, 2025",
    to: "March 11, 2025",
    status: "Pending",
    reason: "Family function",
  },
  {
    id: "3",
    type: "Emergency Leave",
    from: "March 15, 2025",
    to: "March 16, 2025",
    status: "Rejected",
    reason: "Not enough staff availability",
  },
];

// Leave Status Colors
const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "#28A745"; // Green
    case "Pending":
      return "#FFC107"; // Yellow
    case "Rejected":
      return "#DC3545"; // Red
    default:
      return "#333";
  }
};

const LeaveDetails = () => {
  // Render Leave Item
  const renderLeaveItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.date}>
        {item.from} - {item.to}
      </Text>
      <Text style={styles.reason}>{item.reason}</Text>
      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leave Details</Text>
      <FlatList
        data={leaveData}
        keyExtractor={(item) => item.id}
        renderItem={renderLeaveItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default LeaveDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
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
});
