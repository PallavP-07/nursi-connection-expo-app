import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const users = [
  { name: "Michael Johnson", shift: "Morning Shift (7 AM - 7 PM)" },
  { name: "Sarah Connor", shift: "Night Shift (7 PM - 7 AM)" },
  { name: "David Smith", shift: "Evening Shift (3 PM - 11 PM)" },
];

const shiftOptions = [
  "Morning Shift (7 AM - 7 PM)",
  "Evening Shift (3 PM - 11 PM)",
  "Night Shift (7 PM - 7 AM)",
];

const TradeShift = () => {
  const [activeTab, setActiveTab] = useState("Received");
  const [modalVisible, setModalVisible] = useState(false);
  const [isAvailableTrade, setIsAvailableTrade] = useState(true);
  const [tradeRequests, setTradeRequests] = useState([
    {
      id: "1",
      from: "John Doe",
      date: new Date(),
      fromShift: "Night Shift",
      toShift: "Morning Shift",
      status: "Pending",
    },
    {
      id: "2",
      from: "Jane Doe",
      date: new Date(),
      fromShift: "Morning Shift",
      toShift: "Night Shift",
      status: "Pending",
    },
  ]);
  const [sentRequests, setSentRequests] = useState([]);
  const [tradeDetails, setTradeDetails] = useState({
    to: users[0].name,
    date: new Date(),
    fromShift: users[0].shift,
    toShift: "",
  });

  const handleTradeSubmit = () => {
    if (!tradeDetails.toShift) return;
    setSentRequests([
      ...sentRequests,
      { ...tradeDetails, id: Date.now().toString(), status: "Pending" },
    ]);
    setModalVisible(false);
    setTradeDetails({
      to: users[0].name,
      date: new Date(),
      fromShift: users[0].shift,
      toShift: "",
    });
  };

  const handleUserChange = (selectedUser) => {
    const user = users.find((u) => u.name === selectedUser);
    setTradeDetails({
      ...tradeDetails,
      to: selectedUser,
      fromShift: user?.shift || "",
    });
  };

  const handleAccept = (id) => {
    setTradeRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Accepted" } : req))
    );
  };

  const handleReject = (id) => {
    setTradeRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Rejected" } : req))
    );
  };

  const renderTradeRequest = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>From: {item.from}</Text>
      <Text style={styles.shift}>
        Date: {item.date.toLocaleDateString("en-US")}
      </Text>
      <Text style={styles.shift}>Current Shift: {item.fromShift}</Text>
      <Text style={styles.shift}>Requested: {item.toShift}</Text>

      {activeTab === "Received" && item.status === "Pending" ? (
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleAccept(item.id)}>
            <Ionicons name="checkmark-circle-outline" size={28} color="green" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReject(item.id)}>
            <Ionicons name="close-circle-outline" size={28} color="red" />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[styles.shift, { marginTop: 10 }]}>
          Status: <Text style={{ fontWeight: "bold" }}>{item.status}</Text>
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shift Trade</Text>

      <View style={styles.mainSection}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("Received")}
            style={[styles.tabButton, activeTab === "Received" && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, activeTab === "Received" && styles.activeText]}
            >
              Received
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("Sent")}
            style={[styles.tabButton, activeTab === "Sent" && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, activeTab === "Sent" && styles.activeText]}
            >
              Sent by me
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, isAvailableTrade ? styles.tradeIn : styles.tradeOut]}
          onPress={() => setIsAvailableTrade(!isAvailableTrade)}
        >
          <MaterialCommunityIcons
            name={isAvailableTrade ? "swap-horizontal" : "swap-vertical"}
            size={20}
            color="white"
          />
          <Text style={styles.text}>
            {isAvailableTrade ? "Trade In" : "Trade Out"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === "Received" ? tradeRequests : sentRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderTradeRequest}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {isAvailableTrade && (
        <TouchableOpacity
          style={styles.tradeButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.tradeButtonText}>Request Shift Trade</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Trade Request</Text>

            <Text style={styles.label}>Select User:</Text>
            <Picker
              selectedValue={tradeDetails.to}
              onValueChange={handleUserChange}
            >
              {users.map((user, index) => (
                <Picker.Item key={index} label={user.name} value={user.name} />
              ))}
            </Picker>

            <Text style={styles.label}>Select Shift to Offer:</Text>
            <Picker
              selectedValue={tradeDetails.toShift}
              onValueChange={(value) =>
                setTradeDetails({ ...tradeDetails, toShift: value })
              }
            >
              <Picker.Item label="-- Select --" value="" />
              {shiftOptions.map((shift, index) => (
                <Picker.Item key={index} label={shift} value={shift} />
              ))}
            </Picker>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleTradeSubmit}
              disabled={!tradeDetails.toShift}
            >
              <Text style={styles.buttonText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingTop: 30, paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  mainSection: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tabContainer: { flexDirection: "row", gap: 12 },
  tabButton: { padding: 10, borderRadius: 8, backgroundColor: "#E0E0E0" },
  activeTab: { backgroundColor: "#007BFF" },
  tabText: { fontSize: 14 },
  activeText: { color: "#FFF", fontWeight: "bold" },
  button: { flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  tradeIn: { backgroundColor: "#4CAF50" },
  tradeOut: { backgroundColor: "#FF5733" },
  text: { color: "white", fontSize: 14, fontWeight: "bold", marginLeft: 5 },
  card: { backgroundColor: "#F8F9FA", padding: 15, borderRadius: 15, marginBottom: 15 },
  name: { fontSize: 16, fontWeight: "bold" },
  shift: { fontSize: 14, color: "#555", marginTop: 2 },
  iconContainer: { flexDirection: "row", justifyContent: "flex-end", gap: 15, marginTop: 10 },
  tradeButton: { backgroundColor: "#007BFF", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  tradeButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#FFF", padding: 20, borderRadius: 10, margin: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  label: { marginTop: 10, marginBottom: 4, fontSize: 14 },
  submitButton: { backgroundColor: "#28A745", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
});

export default TradeShift;
