import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";

// Dummy Nurse Profile
const nurseProfile = {
  id: "1",
  name: "John Doe",
  role: "Senior Nurse - Night Shift",
  image: "https://randomuser.me/api/portraits/men/1.jpg",
};

// Dummy Weekly Shift Data
const weeklyShifts = [
  {
    id: "1",
    shiftName: "Morning Shift",
    time: "8:00 AM - 4:00 PM",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    color: "#28A745", // Green
  },
  {
    id: "2",
    shiftName: "Evening Shift",
    time: "2:00 PM - 10:00 PM",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    color: "#FFA500", // Orange
  },
  {
    id: "3",
    shiftName: "Night Shift",
    time: "10:00 PM - 6:00 AM",
    days: ["Sat", "Sun"],
    color: "#007BFF", // Blue
  },
];

const Home = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  // Render Weekly Shift Item
  const renderShift = ({ item }) => (
    <View style={[styles.shiftCard, { borderLeftColor: item.color }]}>
      <Text style={styles.shiftTitle}>{item.shiftName}</Text>
      <Text style={styles.shiftTime}>{item.time}</Text>

      {/* Days in a Row */}
      <View style={styles.dayContainer}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <View
            key={day}
            style={[
              styles.dayBox,
              item.days.includes(day) ? styles.activeDay : styles.inactiveDay,
            ]}
          >
            <Text
              style={[
                styles.dayText,
                item.days.includes(day) ? styles.activeDayText : styles.inactiveDayText,
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image source={{ uri: nurseProfile.image }} style={styles.image} />
          <View>
            <Text style={styles.name}>{nurseProfile.name}</Text>
            <Text style={styles.role}>{nurseProfile.role}</Text>
          </View>
        </View>

        {/* Icons */}
        <View style={styles.iconContainer}>
          {/* Notification Icon */}
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="#333" />
          </TouchableOpacity>

          {/* Calendar Filter Icon */}
          <TouchableOpacity onPress={() => setShowCalendar(true)}>
            <Ionicons name="calendar-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Display Selected Month */}
      <Text style={styles.monthText}>March 2025</Text>

      {/* Calendar Modal */}
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setShowCalendar(false);
            }}
            markedDates={{ [selectedDate]: { selected: true, selectedColor: "blue" } }}
          />
        </View>
      )}

      {/* Shift Details */}
      <Text style={styles.sectionTitle}>Shift Details</Text>
      <FlatList
        data={weeklyShifts}
        keyExtractor={(item) => item.id}
        renderItem={renderShift}
        contentContainerStyle={styles.list}
      />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
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
  iconContainer: {
    flexDirection: "row",
    gap: 15,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#444",
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
  shiftCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 5,
  },
  shiftTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  shiftTime: {
    fontSize: 14,
    color: "#444",
    marginTop: 5,
  },
  dayContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  dayBox: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  activeDay: {
    backgroundColor: "#28A745", // Green for active days
  },
  inactiveDay: {
    backgroundColor: "#DDD",
  },
  activeDayText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  inactiveDayText: {
    color: "#555",
  },
  calendarContainer: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
});
 