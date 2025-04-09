import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaProvider } from "react-native-safe-area-context";

const myShifts = [
  { id: "my1", date: "2025-04-08", shift: "Morning", time: "7 AM - 7 PM" },
  { id: "my2", date: "2025-04-10", shift: "Night", time: "7 PM - 7 AM" },
];

const users = [
  {
    name: "Michael Johnson",
    shifts: [
      { id: "mj1", date: "2025-04-08", shift: "Morning", time: "7 AM - 7 PM" },
      { id: "mj2", date: "2025-04-09", shift: "Evening", time: "3 PM - 11 PM" },
    ],
  },
  {
    name: "Sarah Connor",
    shifts: [
      { id: "sc1", date: "2025-04-08", shift: "Night", time: "7 PM - 7 AM" },
      { id: "sc2", date: "2025-04-10", shift: "Morning", time: "7 AM - 7 PM" },
    ],
  },
];

const TradeShift = () => {
  const [activeTab, setActiveTab] = useState("Received");
  const [modalVisible, setModalVisible] = useState(false);
  const [tradeRequests, setTradeRequests] = useState([
    {
      id: "1",
      from: "John Doe",
      to: "You",
      fromShift: { date: "04-07-2025", shift: "Night", time: "7 PM - 7 AM" },
      toShift: { date: "04-08-2025", shift: "Morning", time: "7 AM - 7 PM" },
      status: "Pending",
    },
    {
      id: "2",
      from: "Emma Watson",
      to: "You",
      fromShift: { date: "04-09-2025", shift: "Morning", time: "7 AM - 7 PM" },
      toShift: { date: "04-10-2025", shift: "Night", time: "7 PM - 7 AM" },
      status: "Accepted",
    },
    {
      id: "3",
      from: "Michael Smith",
      to: "You",
      fromShift: { date: "04-11-2025", shift: "Night", time: "7 PM - 7 AM" },
      toShift: { date: "04-12-2025", shift: "Morning", time: "7 AM - 7 PM" },
      status: "Rejected",
    },
    {
      id: "4",
      from: "Sophia Lee",
      to: "You",
      fromShift: { date: "04-13-2025", shift: "Morning", time: "7 AM - 7 PM" },
      toShift: { date: "04-14-2025", shift: "Night", time: "7 PM - 7 AM" },
      status: "Pending",
    },
    {
      id: "5",
      from: "Daniel Kim",
      to: "You",
      fromShift: { date: "04-15-2025", shift: "Night", time: "7 PM - 7 AM" },
      toShift: { date: "04-16-2025", shift: "Morning", time: "7 AM - 7 PM" },
      status: "Pending",
    },
  ]);
  const [sentRequests, setSentRequests] = useState([]);

  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [selectedUserShift, setSelectedUserShift] = useState(null);
  const [myOfferedShift, setMyOfferedShift] = useState(null);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userShiftDropdownOpen, setUserShiftDropdownOpen] = useState(false);
  const [myShiftDropdownOpen, setMyShiftDropdownOpen] = useState(false);

  const handleTradeSubmit = () => {
    if (!selectedUser || !selectedUserShift || !myOfferedShift) return;

    const newRequest = {
      id: Date.now().toString(),
      from: "You",
      to: selectedUser.name,
      fromShift: myOfferedShift,
      toShift: selectedUserShift,
      status: "Pending",
    };

    setSentRequests([...sentRequests, newRequest]);
    setModalVisible(false);
    setSelectedUser(users[0]);
    setSelectedUserShift(null);
    setMyOfferedShift(null);
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
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f0ad4e"; // Yellow
      case "Accepted":
        return "#28a745"; // Green
      case "Rejected":
        return "#dc3545"; // Red
      default:
        return "#333"; // Default color
    }
  };
  const renderTradeRequest = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.tradeUserDetails}>
        <Text style={styles.cardText}>From: {item.from}</Text>
        <Text style={styles.cardText}>To:{item.to}</Text>
      </View>
      <View style={styles.shiftBox}>
        <View style={styles.tradeTimeCard}>
        {activeTab === "Received" ? (
          <Text style={styles.cardSubtitle}>They want to trade:</Text>
        ) : (
          <Text style={styles.cardSubtitle}>You want to trade:</Text>
        )}
         
          <Text style={styles.cardText}>{item.fromShift.date}</Text>
          <Text>
            {item.fromShift.shift}({item.fromShift.time})
          </Text>
        </View>
        {activeTab === "Received" ? (
          <Ionicons name="arrow-forward" size={28} color="black" />
        ) : (
          <Ionicons name="arrow-back" size={24} color="black" />
        )}
        <View style={styles.tradeTimeCard}>
        {activeTab === "Received" ? (
          <Text style={styles.cardSubtitle}>With your Shift:</Text>
        ) : (
          <Text style={styles.cardSubtitle}>Their Shift:</Text>
        )}
          <Text style={styles.cardText}>{item.toShift.date}</Text>
          <Text>
            {item.toShift.shift}({item.toShift.time})
          </Text>
        </View>
      </View>

      {activeTab === "Received" && item.status === "Pending" ? (
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleAccept(item.id)}>
            <Ionicons
              name="checkmark-circle-outline"
              size={30}
              color="#28a738"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReject(item.id)}>
            <Ionicons name="close-circle-outline" size={30} color="#dc3545" />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.statusText}>
          Status:{" "}
          <Text
            style={{ fontWeight: "bold", color: getStatusColor(item.status) }}
          >
            {item.status}
          </Text>
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shift Trade</Text>

      <View style={styles.tabContainer}>
        {["Received", "Sent"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeText]}
            >
              {tab === "Received" ? "Received" : "Sent by me"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={activeTab === "Received" ? tradeRequests : sentRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderTradeRequest}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="swap-horizontal" size={46} color="#666" />
            </View>
            <Text style={styles.emptyText}>
              No {activeTab.toLowerCase()} requests.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.tradeButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.tradeButtonText}>Request a Trade</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Trade Request</Text>

                <Text style={styles.label}>Select a colleague:</Text>
                <DropDownPicker
                  open={userDropdownOpen}
                  value={selectedUser.name}
                  items={users.map((u) => ({ label: u.name, value: u.name }))}
                  setOpen={setUserDropdownOpen}
                  setValue={(callback) => {
                    const name = callback(selectedUser.name);
                    const user = users.find((u) => u.name === name);
                    setSelectedUser(user);
                    setSelectedUserShift(null);
                  }}
                  containerStyle={{ marginBottom: 10 }}
                />

                <Text style={styles.label}>
                  <Ionicons name="calendar-outline" size={24} color="black" />{" "}
                  Choose their shift:
                </Text>
                <DropDownPicker
                  open={userShiftDropdownOpen}
                  value={selectedUserShift?.id}
                  items={selectedUser.shifts.map((s) => ({
                    label: `${s.date} - ${s.shift} (${s.time})`,
                    value: s.id,
                  }))}
                  setOpen={setUserShiftDropdownOpen}
                  setValue={(callback) =>
                    setSelectedUserShift(
                      selectedUser.shifts.find((s) => s.id === callback(null))
                    )
                  }
                  containerStyle={{ marginBottom: 10 }}
                />

                <Text style={styles.label}>
                  <Ionicons name="calendar-outline" size={24} color="black" />{" "}
                  Offer your shift:
                </Text>
                <DropDownPicker
                  open={myShiftDropdownOpen}
                  value={myOfferedShift?.id}
                  items={myShifts.map((s) => ({
                    label: `${s.date} - ${s.shift} (${s.time})`,
                    value: s.id,
                  }))}
                  setOpen={setMyShiftDropdownOpen}
                  setValue={(callback) =>
                    setMyOfferedShift(
                      myShifts.find((s) => s.id === callback(null))
                    )
                  }
                  containerStyle={{ marginBottom: 10 }}
                />

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !(selectedUserShift && myOfferedShift) && {
                      backgroundColor: "#ccc",
                    },
                  ]}
                  onPress={handleTradeSubmit}
                  disabled={!selectedUserShift || !myOfferedShift}
                >
                  <Text style={styles.buttonText}>Send Request</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin:20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  activeTab: { backgroundColor: "#007BFF" },
  tabText: { fontSize: 14 },
  activeText: { color: "#FFF", fontWeight: "bold" },
  tradeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 25,
    marginTop: 15,
  },
  tradeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    margin: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  label: { marginTop: 12, fontSize: 14, fontWeight: "600" },
  submitButton: {
    backgroundColor: "#28A745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.2,
  },
  tradeUserDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cardTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 6 },
  cardSubtitle: { fontWeight: "600", fontSize: 13 },
  cardText: { fontSize: 13.5, color: "#333", marginTop: 2 },
  shiftBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 0.3,
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    padding: 6,
  },
  tradeTimeCard: {},
  statusText: { marginTop: 10, fontSize: 13, fontWeight: "500", color: "#555" },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 25,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  emptyText: {
    color: "#888",
    fontSize: 20,
    textAlign: "center",
  },
});

export default TradeShift;
