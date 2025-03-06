import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";

const CustomModel = ({ setModalVisible, modalVisible }) => {
  const [leaveType, setLeaveType] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateSelection, setDateSelection] = useState("start");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDayPress = (day) => {
    if (dateSelection === "start") {
      setStartDate(day.dateString);
      setDateSelection("end"); // Automatically switch to end date selection
    } else {
      if (day.dateString < startDate) {
        alert("End date cannot be before start date.");
      } else {
        setEndDate(day.dateString);
        setShowCalendar(false);
      }
    }
  };

  const handleSubmit = () => {
    if (!leaveType || !startDate || !endDate || !leaveReason) {
      alert("Please fill in all fields.");
      return;
    }
    // Handle the submission logic here
    console.log("Leave Request Submitted:", { leaveType, startDate, endDate, leaveReason });
    setModalVisible(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Request Leave</Text>

          <View style={styles.pickerContainer}>
            <Picker selectedValue={leaveType} onValueChange={(itemValue) => setLeaveType(itemValue)}>
              <Picker.Item label="Select Leave Type" value="" />
              <Picker.Item label="Sick Leave" value="Sick Leave" />
              <Picker.Item label="Casual Leave" value="Casual Leave" />
              <Picker.Item label="Emergency Leave" value="Emergency Leave" />
              <Picker.Item label="Vacation" value="Vacation" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.dateInput} onPress={() => { setDateSelection("start"); setShowCalendar(true); }}>
            <Text style={styles.dateText}>{startDate ? `Start Date: ${startDate}` : "Select Start Date"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateInput} onPress={() => { setDateSelection("end"); setShowCalendar(true); }}>
            <Text style={styles.dateText}>{endDate ? `End Date: ${endDate}` : "Select End Date"}</Text>
          </TouchableOpacity>

          {showCalendar && (
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={handleDayPress}
                markedDates={{
                  [startDate]: { selected: true, marked: true, selectedColor: "green" },
                  [endDate]: { selected: true, marked: true, selectedColor: "blue" },
                }}
              />
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Enter Reason"
            value={leaveReason}
            onChangeText={setLeaveReason}
            multiline
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModel;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#F8F8F8",
  },
  dateInput: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  calendarContainer: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#28A745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});