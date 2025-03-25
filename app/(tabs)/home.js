import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { Image } from "react-native";
import { AuthContext } from "../../context/authContext";
import { getNurseDetailsAPI } from "../../api/authApi";

// Dummy Data - Replace with API Response
const allShiftData = Array.from({ length: 15 }, (_, index) => ({
  shift_time: index % 2 === 0 ? "N" : "M",
  full_date: moment().add(index, "days").format("YYYY-MM-DD"),
  shift_time_full: index % 2 === 0 ? "Night (7PM-7AM)" : "Morning (7AM-7PM)",
}));

// Colors for Shift Types
const shiftColors = {
  N: ["#007BFF", "#0056b3"], 
  M: ["#28A745", "#1f7d3f"], 
};
const fallbackShiftData = [
  {
    shift_time: "N",
    full_date: moment().format("YYYY-MM-DD"),
    shift_time_full: "Night (7PM-7AM)",
  },
  {
    shift_time: "M",
    full_date: moment().add(1, "days").format("YYYY-MM-DD"),
    shift_time_full: "Morning (7AM-7PM)",
  },
];
const Home = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [displayCount, setDisplayCount] = useState(10);
  const [filterType, setFilterType] = useState("all"); // all | day | week | month
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [nurseDetails,setNurseDetails]=useState("")
  const [shiftData, setShiftData] = useState([]);
    const { authToken } = useContext(AuthContext);
  const getFilteredShifts = () => {
    let filteredData = [...shiftData];
    if (selectedDate) {
      filteredData = filteredData.filter(
        (shift) => shift.full_date === selectedDate
      );
    } else if (filterType === "week") {
      const startOfWeek = moment().startOf("isoWeek");
      const endOfWeek = moment().endOf("isoWeek");
      filteredData = filteredData.filter((shift) =>
        moment(shift.full_date).isBetween(startOfWeek, endOfWeek, "day", "[]")
      );
    } else if (filterType === "month") {
      const currentMonth = moment().format("YYYY-MM");
      filteredData = filteredData.filter((shift) =>
        shift.full_date.startsWith(currentMonth)
      );
    }
    return filteredData.slice(0, displayCount);
  };

  const filteredShifts = getFilteredShifts();

  const renderShift = ({ item }) => {
    const dayShort = moment(item.full_date).format("ddd"); // Mon, Tue, etc.
    const dateNumber = moment(item.full_date).format("D"); // 20, 21, etc.
    const monthShort = moment(item.full_date).format("MMM"); // Mar, Apr, etc.

    return (
      <View style={styles.cardWrapper}>
        <View
          style={[
            styles.shiftCard,
            { borderLeftColor: shiftColors[item.shift_time][0] },
          ]}
        >
          <View style={styles.dateContainer}>
            <Text style={styles.dayText}>{dayShort}</Text>
            <Text style={styles.dateText}>{dateNumber}</Text>
            <Text style={styles.monthText}>{monthShort}</Text>
          </View>
          <View style={styles.shiftInfo}>
            <Text style={styles.shiftTime}>{item.shift_time_full}</Text>
          </View>
          <View style={styles.shiftAction}>
            <TouchableOpacity style={styles.actionButton}>
             
              <Ionicons name="checkmark-circle-outline" size={24} color="green" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="close-circle-outline" size={24} color="red"/>
         
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
useEffect(()=>{
  const fetchNurseDetails = async()=>{
    if(!authToken) return;
    try{
      const response = await getNurseDetailsAPI(authToken);
      if(response.status && response.data){
        setNurseDetails(response.data);
        setShiftData(response.data.all_shift_data);
      }else{
        setShiftData(fallbackShiftData);
      }
    }catch(error){
      console.log(error);
    }
  }
  fetchNurseDetails();
},[authToken]);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
      <View style={styles.nurseInfo}>
        <Image
           source={{
            uri: nurseDetails.imageUrl
              ? nurseDetails.imageUrl
              : "https://avatar.iran.liara.run/public/27"
          }}
          style={styles.nurseImage}
        />
        <View>
          <Text style={styles.nurseName}>{nurseDetails.first_name} {nurseDetails.last_name}</Text>
          <Text style={styles.nurseRole}>{nurseDetails.email}</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
      <Ionicons name="notifications-outline" size={32} color="black" />
      <Text style={styles.badge}>{shiftData.length}</Text>
    </View>
      </View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Shift Schedule</Text>

        <View style={styles.iconContainer}>
          {/* Calendar Icon */}
          <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
            <Ionicons name="calendar-outline" size={28} color="#333" />
          </TouchableOpacity>

          {/* Filter Icon */}
          <TouchableOpacity
            onPress={() => setShowFilterDropdown(!showFilterDropdown)}
            style={styles.filterIcon}
          >
            <Ionicons name="filter-outline" size={28} color="#333" />
          </TouchableOpacity>
          {showFilterDropdown && (
        <View style={styles.filterDropdown}>
          {["all", "day", "week", "month"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterOption,
                filterType === type && styles.activeFilter,
              ]}
              onPress={() => {
                setFilterType(type);
                setShowFilterDropdown(false);
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  filterType === type && { color: "#FFF" },
                ]}
              >
                {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
        </View>
      </View>
      {/* Calendar Modal */}
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(
                day.dateString === selectedDate ? "" : day.dateString
              );
              setShowCalendar(false);
            }}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: "blue" },
            }}
          />
        </View>
      )}

      {/* Shift List */}
      <FlatList
        data={filteredShifts}
        keyExtractor={(item) => item.full_date}
        renderItem={renderShift}
        contentContainerStyle={styles.list}
      />

      {/* Load More Button */}
      {displayCount < allShiftData.length && (
        <TouchableOpacity
          style={styles.loadMore}
          onPress={() => setDisplayCount(displayCount + 5)}
        >
          <Ionicons name="chevron-down" size={28} color="#007BFF" />
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  topContainer:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom: 20},
  nurseInfo: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -1,
    right: -1,
    fontSize:14,
    backgroundColor: "red",
    color: "white",
    padding:0,
    borderRadius:50,
    width:"50%",
    textAlign:"center"
  },
  nurseImage: { width: 60, height: 60, borderRadius: 50, marginRight: 16 },
  nurseName:{fontSize:24, fontWeight:"600" },
  nurseRole:{ fontSize:16},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#333" },
  iconContainer: { flexDirection: "row" },
  filterIcon: { marginLeft: 15,position:"relative" },
  list: { paddingBottom: 24 },
  cardWrapper: { marginBottom: 10, elevation: 3 },
  shiftCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 6,
    borderRadius: 20,
    borderLeftWidth: 5,
  },
  dateContainer: {
    alignItems: "center",
    width: 50,
    marginRight: 20,
    borderWidth: 1.4,
    borderColor: "#007BFF",
    borderRadius: 14,
    padding:4,
  },
  dayText: { fontSize: 12, fontWeight: "bold", color: "#222" },
  dateText: { fontSize: 18, fontWeight: "bold", color: "#007BFF" },
  monthText: { fontSize: 13, color: "#555" },
  shiftInfo: { flex: 1 },
  shiftTime: { fontSize: 16, color: "#555" },
  shiftAction: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  actionButton: {
    padding: 5,
  },
  filterDropdown: {
    position: "absolute",
    top:30,
    right: 0,
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    padding: 3,
    elevation: 2,
    zIndex: 20,
    borderWidth: 0.4,
    borderColor: "#808080",
  },
  filterOption: { paddingVertical: 5, paddingHorizontal: 10 },
  activeFilter: { backgroundColor: "#007BFF", borderRadius: 10 },
  filterText: { fontSize: 14, fontWeight: "bold", color: "#333" },
  calendarContainer: { borderRadius: 10, overflow: "hidden", marginBottom: 10 },
  loadMore: {
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    gap:1,
    padding: 3,
    backgroundColor:"none",
    borderRadius: 8,
    color:"#0000",
    alignItems: "center",
    margin: 5,
  },
  loadMoreText: { color: "#007BFF", fontSize: 14, fontWeight:"bold" },
});
