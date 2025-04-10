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
import { Image } from "react-native";

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
      fromImage: "https://avatar.iran.liara.run/public/2",
      to: "You",
      toImage: "https://avatar.iran.liara.run/public/4",
      fromShift: { date: "04-07-2025", shift: "Night", time: "7 PM - 7 AM" },
      toShift: { date: "04-08-2025", shift: "Morning", time: "7 AM - 7 PM" },
      status: "Pending",
      timeLeft: "3 days left",
    },
    {
      id: "2",
      from: "Emma Watson",
      fromImage: "https://avatar.iran.liara.run/public/9",
      to: "You",
      toImage: "https://avatar.iran.liara.run/public/8",
      fromShift: { date: "04-09-2025", shift: "Morning", time: "7 AM - 7 PM" },
      toShift: { date: "04-10-2025", shift: "Night", time: "7 PM - 7 AM" },
      status: "Accepted",
    },
    {
      id: "3",
      from: "Michael Smith",
      fromImage: "https://avatar.iran.liara.run/public/42",
      to: "You",
      toImage: "https://avatar.iran.liara.run/public/10",
      fromShift: { date: "04-11-2025", shift: "Night", time: "7 PM - 7 AM" },
      toShift: { date: "04-12-2025", shift: "Morning", time: "7 AM - 7 PM" },
      status: "Rejected",
    },
    {
      id: "4",
      from: "Sophia Lee",
      fromImage: "https://avatar.iran.liara.run/public/15",
      to: "You",
      toImage: "https://avatar.iran.liara.run/public/12",
      fromShift: { date: "04-13-2025", shift: "Morning", time: "7 AM - 7 PM" },
      toShift: { date: "04-14-2025", shift: "Night", time: "7 PM - 7 AM" },
      status: "Pending",
      timeLeft: "8 days left",
    },
    {
      id: "5",
      from: "Daniel Kim",
      fromImage: "https://avatar.iran.liara.run/public/32",
      to: "You",
      toImage: "https://avatar.iran.liara.run/public/39",
      fromShift: { date: "04-15-2025", shift: "Night", time: "7 PM - 7 AM" },
      toShift: { date: "04-16-2025", shift: "Morning", time: "7 AM - 7 PM" },
      status: "Pending",
      timeLeft: "1 days left",
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
      {/* Profile Section */}
      <View style={styles.userAvatarRow}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: item.fromImage }}
            style={styles.avatar}
          />
          <Text style={styles.avatarLabel}>{item.from}</Text>
        </View>
        <Ionicons name="repeat" size={22} color="#444" />
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: item.toImage }}
            style={styles.avatar}
          />
          <Text style={styles.avatarLabel}>{item.to}</Text>
        </View>
      </View>
  
      {/* Shift Box */}
      <View style={styles.shiftBox}>
        <View style={[styles.shiftCard]}>
          <Text style={styles.cardSubtitle}>
            {activeTab === "Received" ? "They want to trade:" : "You want to trade:"}
          </Text>
          <Text style={styles.cardText}>{item.fromShift.date}</Text>
          <Text style={styles.cardShiftTime}>
            {item.fromShift.shift} ({item.fromShift.time})
          </Text>
        </View>
  
        {/* <Ionicons
          name={activeTab === "Received" ? "arrow-forward" : "arrow-back"}
          size={22}
          color="#888"
          style={{ marginHorizontal: 10 }}
        /> */}
  
        <View style={[styles.shiftCard]}>
          <Text style={styles.cardSubtitle}>
            {activeTab === "Received" ? "With your shift:" : "Their shift:"}
          </Text>
          <Text style={styles.cardText}>{item.toShift.date}</Text>
          <Text style={styles.cardShiftTime}>
            {item.toShift.shift} ({item.toShift.time})
          </Text>
        </View>
      </View>
  
      {/* Accept/Reject or Status */}
      {activeTab === "Received" && item.status === "Pending" ? (
  <>
    {item.timeLeft && (
      <View style={styles.pendingTimeCard}>

<View style={styles.pendingTimeContainer}>
        <Ionicons name="timer-outline" size={16} color="white" />
        <Text style={styles.pendingTimeText}>{item.timeLeft}</Text>
      </View>
    <View style={styles.iconContainer}>
      <TouchableOpacity onPress={() => handleAccept(item.id)}>
        <Ionicons name="checkmark-circle" size={32} color="#28a745" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleReject(item.id)}>
        <Ionicons name="close-circle" size={32} color="#dc3545" />
      </TouchableOpacity>
    </View>
      </View>
    )}
  </>
) : (
  <Text style={styles.statusText}>
    Status:{" "}
    <Text style={{ fontWeight: "bold", color: getStatusColor(item.status) }}>
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Trade Request</Text>

            <Text style={styles.label}>Select a colleague:</Text>
            <View style={{ zIndex: 3000, marginBottom: 10 }}>
              <DropDownPicker
                open={userDropdownOpen}
                value={selectedUser?.name}
                items={users.map((u) => ({
                  label: u.name,
                  value: u.name,
                }))}
                setOpen={setUserDropdownOpen}
                setValue={(callback) => {
                  const name = callback(selectedUser?.name);
                  const user = users.find((u) => u.name === name);
                  setSelectedUser(user);
                  setSelectedUserShift(null);
                }}
                dropDownContainerStyle={{ zIndex: 3000 }}
              />
            </View>

            <Text style={styles.label}>
              <Ionicons name="calendar-outline" size={20} /> Choose their shift:
            </Text>
            <View style={{ zIndex: 2000, marginBottom: 10 }}>
              <DropDownPicker
                open={userShiftDropdownOpen}
                value={selectedUserShift?.id}
                items={
                  selectedUser?.shifts?.map((s) => ({
                    label: `${s.date} - ${s.shift} (${s.time})`,
                    value: s.id,
                  })) || []
                }
                setOpen={setUserShiftDropdownOpen}
                setValue={(callback) =>
                  setSelectedUserShift(
                    selectedUser.shifts.find(
                      (s) => s.id === callback(null)
                    )
                  )
                }
                dropDownContainerStyle={{ zIndex: 2000 }}
              />
            </View>

            <Text style={styles.label}>
              <Ionicons name="calendar-outline" size={20} /> Offer your shift:
            </Text>
            <View style={{ zIndex: 1000, marginBottom: 10 }}>
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
                dropDownContainerStyle={{ zIndex: 1000 }}
              />
            </View>

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
    margin: 20,
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
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 5000,
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
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0.3,
    borderColor: "#ddd",
  },
  userAvatarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginBottom: 4,
  },
  avatarLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  shiftBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  shiftCard: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
  },
  cardSubtitle: {
    fontWeight: "600",
    fontSize: 13.5,
    marginBottom: 4,
    color: "#444",
  },
  cardText: {
    fontSize: 13,
    color: "#333",
  },
  cardShiftTime: {
    fontSize: 13,
    color: "#666",
  },
  // iconContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-around",
  // },
  statusText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
    color: "#555",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,
    // marginTop: 12,
  },
  pendingTimeCard:{
    display:'flex',
    flexDirection:"row",
    justifyContent:"space-between"
  },
  pendingTimeContainer: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#f0ad4e",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    marginBottom: 8,
  },
  pendingTimeText: {
    color: "white",
    fontSize: 13.5,
    fontWeight: "600",
    marginLeft: 4,
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
