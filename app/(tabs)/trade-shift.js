import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

// Dummy Data for Shift Trade Requests (Incoming)
const tradeRequests = [
  {
    id: "1",
    name: "John Doe",
    currentShift: "Night Shift (March 10, 2025)",
    requestedShift: "Morning Shift (March 10, 2025)",
    status: "Pending",
  },
  {
    id: "2",
    name: "Sarah Smith",
    currentShift: "Evening Shift (March 12, 2025)",
    requestedShift: "Day Shift (March 12, 2025)",
    status: "Pending",
  },
];

// Dummy Data for Sent Shift Trades (Outgoing)
const sentRequests = [
  {
    id: "1",
    to: "Michael Johnson",
    fromShift: "Morning Shift (March 15, 2025)",
    toShift: "Night Shift (March 15, 2025)",
    status: "Approved",
  },
  {
    id: "2",
    to: "Emma Watson",
    fromShift: "Evening Shift (March 18, 2025)",
    toShift: "Morning Shift (March 18, 2025)",
    status: "Rejected",
  },
];

// Shift Status Colors
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

const TradeShift = () => {
  const [activeTab, setActiveTab] = useState("Requests");

  const renderTradeRequest = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.shift}>Current: {item.currentShift}</Text>
      <Text style={styles.shift}>Requested: {item.requestedShift}</Text>
      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
        {item.status}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.acceptButton}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSentRequest = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>To: {item.to}</Text>
      <Text style={styles.shift}>Your Shift: {item.fromShift}</Text>
      <Text style={styles.shift}>Requested: {item.toShift}</Text>
      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shift Trade</Text>

      {/* Tab Switch */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Requests" && styles.activeTab]}
          onPress={() => setActiveTab("Requests")}
        >
          <Text style={styles.tabText}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Sent" && styles.activeTab]}
          onPress={() => setActiveTab("Sent")}
        >
          <Text style={styles.tabText}>Sent</Text>
        </TouchableOpacity>
      </View>

      {/* Display the Corresponding List */}
      {activeTab === "Requests" ? (
        <FlatList
          data={tradeRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderTradeRequest}
          contentContainerStyle={styles.list}
        />
      ) : (
        <FlatList
          data={sentRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderSentRequest}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default TradeShift;

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
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: "#E0E0E0",
  },
  activeTab: {
    backgroundColor: "#007BFF",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  shift: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "#28A745",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: "#DC3545",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
