import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const users = [
  { name: "Michael Johnson", shift: "Morning Shift (7 AM - 7 PM)" },
  { name: "Sarah Connor", shift: "Night Shift (7 PM - 7 AM)" },
  { name: "David Smith", shift: "Evening Shift (3 PM - 11 PM)" },
];

const TradeShift = () => {
  const [activeTab, setActiveTab] = useState("Received");
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
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
    {
      id: "3",
      from: "Alice Brown",
      date: new Date(),
      fromShift: "Evening Shift",
      toShift: "Night Shift",
      status: "Pending",
    },
    {
      id: "4",
      from: "Bob White",
      date: new Date(),
      fromShift: "Night Shift",
      toShift: "Morning Shift",
      status: "Pending",
    },
    {
      id: "5",
      from: "Emma Green",
      date: new Date(),
      fromShift: "Morning Shift",
      toShift: "Evening Shift",
      status: "Pending",
    },
    {
      id: "6",
      from: "Oliver Black",
      date: new Date(),
      fromShift: "Evening Shift",
      toShift: "Morning Shift",
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

  const renderTradeRequest = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>From: {item.from}</Text>
      <Text style={styles.shift}>Date: {item.date.toDateString()}</Text>
      <Text style={styles.shift}>Current Shift: {item.fromShift}</Text>
      <Text style={styles.shift}>Requested: {item.toShift}</Text>
      {activeTab === "Received" && (
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Ionicons name="checkmark-circle-outline" size={28} color="green" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="close-circle-outline" size={28} color="red" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const handleUserChange = (selectedUser) => {
    const user = users.find((u) => u.name === selectedUser);
    setTradeDetails({
      ...tradeDetails,
      to: selectedUser,
      fromShift: user?.shift || "",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shift Trade</Text>

      {/* Tabs */}

      <View style={styles.mainSection}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("Received")}
            style={[
              styles.tabButton,
              activeTab === "Received" && styles.activeTab,
            ]}
          >
            <Text style={styles.tabText}>Received</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("Sent")}
            style={[styles.tabButton, activeTab === "Sent" && styles.activeTab]}
          >
            <Text style={styles.tabText}>Sent by me</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            isAvailableTrade ? styles.tradeIn : styles.tradeOut,
          ]}
          onPress={() => setIsAvailableTrade(!isAvailableTrade)}
        >
          <MaterialCommunityIcons
            name={isAvailableTrade ? "swap-horizontal" : "swap-vertical"}
            size={24}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.text}>
            {isAvailableTrade ? "Trade In" : "Trade Out"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Trade Requests */}
      <FlatList
        data={activeTab === "Received" ? tradeRequests : sentRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderTradeRequest}
      />

      {/* Trade Button */}
      {isAvailableTrade ? (
        <TouchableOpacity
          style={styles.tradeButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.tradeButtonText}>Shift Trade</Text>
        </TouchableOpacity>
      ) : null}

      {/* Trade Request Form Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Trade Request</Text>

            {/* User Dropdown */}
            <Picker
              selectedValue={tradeDetails.to}
              onValueChange={handleUserChange}
            >
              {users.map((user, index) => (
                <Picker.Item key={index} label={user.name} value={user.name} />
              ))}
            </Picker>

            {/* Date Picker */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>
                Date: {tradeDetails.date.toDateString()}
              </Text>
            </TouchableOpacity>
            {/* {showDatePicker && (
              <DateTimePicker value={tradeDetails.date} mode="date" display="default" onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setTradeDetails({ ...tradeDetails, date: selectedDate });
              }} />
            )} */}

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleTradeSubmit}
            >
              <Text style={styles.buttonText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingTop: 30 ,paddingHorizontal:20, },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  mainSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center"
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap:14,
  },
  tabButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
    
  },
  activeTab: { backgroundColor: "#007BFF",color: "#FFF" },
  tradeButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  tradeButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  card: {
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  shift: { fontSize: 16, color: "#555", lineHeight: 22 },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  submitButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal:10,
    borderRadius: 8,
  },
  tradeIn: {
    backgroundColor: "#4CAF50", // Green for Trade In
  },
  tradeOut: {
    backgroundColor: "#FF5733", // Orange for Trade Out
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 3,
  },
  icon: {
    marginRight: 1,
  },
});

export default TradeShift;
