import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";

const RequestLeaveForm = () => {
  const [leaveType, setLeaveType] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateSelection, setDateSelection] = useState("start");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDayPress = (day) => {
    if (dateSelection === "start") {
      setStartDate(day.dateString);
      setDateSelection("end");
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
    console.log("Leave Request Submitted:", {
      leaveType,
      startDate,
      endDate,
      leaveReason,
    });
  };

  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Request Leave</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={leaveType}
          onValueChange={(itemValue) => setLeaveType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Leave Type" value="" />
          <Picker.Item label="Sick Leave" value="Sick Leave" />
          <Picker.Item label="Casual Leave" value="Casual Leave" />
          <Picker.Item label="Emergency Leave" value="Emergency Leave" />
          <Picker.Item label="Vacation" value="Vacation" />
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => {
          setDateSelection("start");
          setShowCalendar(true);
        }}
      >
        <Text style={styles.dateText}>
          {startDate ? `Start Date: ${startDate}` : "Select Start Date"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => {
          setDateSelection("end");
          setShowCalendar(true);
        }}
      >
        <Text style={styles.dateText}>
          {endDate ? `End Date: ${endDate}` : "Select End Date"}
        </Text>
      </TouchableOpacity>

      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              [startDate]: {
                selected: true,
                marked: true,
                selectedColor: "#28A745",
              },
              [endDate]: {
                selected: true,
                marked: true,
                selectedColor: "#007BFF",
              },
            }}
          />
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter Reason for Leave"
        placeholderTextColor="#888"
        value={leaveReason}
        onChangeText={setLeaveReason}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Request</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RequestLeaveForm;

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#F2F2F2",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  dateInput: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#444",
  },
  calendarContainer: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    backgroundColor: "#F9F9F9",
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#28A745",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});
