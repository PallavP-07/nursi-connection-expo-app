"use client"

import { useContext, useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { Calendar } from "react-native-calendars"
import moment from "moment"
import { Image } from "react-native"
import { AuthContext } from "../../context/authContext"
import { getNurseDetailsAPI } from "../../api/authApi"
import Toast from "react-native-toast-message"
import ToastConfig from "../../components/ToastConfig"
import showToast from "../../utils/showToast"
import {
  useFonts,
  Poppins_500Medium,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins"
import { router } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

// Dummy Data - Replace with API Response
const allShiftData = Array.from({ length: 15 }, (_, index) => ({
  shift_time: index % 2 === 0 ? "N" : "M",
  full_date: moment().add(index, "days").format("YYYY-MM-DD"),
  shift_time_full: index % 2 === 0 ? "Night (7PM-7AM)" : "Morning (7AM-7PM)",
}))

// Colors for Shift Types
const shiftColors = {
  N: ["#5E60CE", "#4EA8DE"], // Night shift colors
  M: ["#4EA8DE", "#48BFE3"], // Morning shift colors
}

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
]

const Home = () => {
  const [selectedDate, setSelectedDate] = useState("")
  const [showCalendar, setShowCalendar] = useState(false)
  const [displayCount, setDisplayCount] = useState(20)
  const [filterType, setFilterType] = useState("all") // all | day | week | month
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [nurseDetails, setNurseDetails] = useState("")
  const [shiftData, setShiftData] = useState([])
  const { authToken } = useContext(AuthContext)
  const [workHistoryExpanded, setWorkHistoryExpanded] = useState(false)

  // Clock in/out state
  const [clockedIn, setClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState(null)
  const [clockOutTime, setClockOutTime] = useState(null)
  const [totalHours, setTotalHours] = useState(0)
  const [workHistory, setWorkHistory] = useState([])

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  const getFilteredShifts = () => {
    let filteredData = [...shiftData]
    if (selectedDate) {
      filteredData = filteredData.filter((shift) => shift.full_date === selectedDate)
    } else if (filterType === "week") {
      const startOfWeek = moment().startOf("isoWeek")
      const endOfWeek = moment().endOf("isoWeek")
      filteredData = filteredData.filter((shift) =>
        moment(shift.full_date).isBetween(startOfWeek, endOfWeek, "day", "[]"),
      )
    } else if (filterType === "month") {
      const currentMonth = moment().format("YYYY-MM")
      filteredData = filteredData.filter((shift) => shift.full_date.startsWith(currentMonth))
    }
    return filteredData.slice(0, displayCount)
  }

  const filteredShifts = getFilteredShifts()

  const handleClockIn = () => {
    const now = new Date()
    setClockedIn(true)
    setClockInTime(now)
    setClockOutTime(null)
    showToast("success", "You've clocked in successfully! ⏰", "top")
  }

  const handleClockOut = () => {
    const now = new Date()
    setClockedIn(false)
    setClockOutTime(now)

    // Calculate hours worked
    const startTime = clockInTime
    const endTime = now
    const hoursWorked = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(2)

    setTotalHours(Number.parseFloat(hoursWorked))

    // Add to work history
    const newEntry = {
      date: moment().format("YYYY-MM-DD"),
      clockIn: moment(startTime).format("hh:mm A"),
      clockOut: moment(endTime).format("hh:mm A"),
      hours: hoursWorked,
    }

    setWorkHistory([newEntry, ...workHistory])
    showToast("success", `Clocked out after ${hoursWorked} hours! 👍`, "top")
  }

  const renderShift = ({ item }) => {
    const dayShort = moment(item.full_date).format("ddd") // Mon, Tue, etc.
    const dateNumber = moment(item.full_date).format("D") // 20, 21, etc.
    const monthShort = moment(item.full_date).format("MMM") // Mar, Apr, etc.

    const callToastMsg = () => {
      showToast("success", "Your Shift Assigned Successfully!🎉 ", "top")
    }

    const callToastMsgOnCancel = () => {
      showToast("success", "This Shift Removed! 😞", "top")
    }

    return (
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={["#ffffff", "#f8f9fa"]}
          style={styles.shiftCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View
            style={[
              styles.dateContainer,
              {
                backgroundColor: `${shiftColors[item.shift_time][1]}20`, // 20% opacity
              },
            ]}
          >
            <Text style={styles.dayText}>{dayShort}</Text>
            <Text style={styles.dateText}>{dateNumber}</Text>
            <Text style={styles.monthText}>{monthShort}</Text>
          </View>

          <View style={styles.shiftInfo}>
            <View style={styles.shiftTypeContainer}>
              <View style={[styles.shiftTypeBadge, { backgroundColor: shiftColors[item.shift_time][0] }]}>
                <Text style={styles.shiftTypeText}>{item.shift_time}</Text>
              </View>
              <Text style={styles.shiftTime}>{item.shift_time_full}</Text>
            </View>
          </View>

          <View style={styles.shiftAction}>
            <TouchableOpacity style={styles.acceptButton} onPress={callToastMsg}>
              <Ionicons name="checkmark" size={20} color="green" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.rejectButton} onPress={callToastMsgOnCancel}>
              <Ionicons name="close" size={20} color="#F56565" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    )
  }

  const renderWorkHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyDate}>
        <MaterialCommunityIcons name="calendar-clock" size={18} color="#4EA8DE" />
        <Text style={styles.historyDateText}>{moment(item.date).format("MMM D, YYYY")}</Text>
      </View>
      <View style={styles.historyTimes}>
        <View style={styles.historyTimeBlock}>
          <Text style={styles.historyTimeLabel}>In</Text>
          <Text style={styles.historyTimeValue}>{item.clockIn}</Text>
        </View>
        <View style={styles.historyDivider} />
        <View style={styles.historyTimeBlock}>
          <Text style={styles.historyTimeLabel}>Out</Text>
          <Text style={styles.historyTimeValue}>{item.clockOut}</Text>
        </View>
        <View style={styles.historyDivider} />
        <View style={styles.historyTimeBlock}>
          <Text style={styles.historyTimeLabel}>Hours</Text>
          <Text style={styles.historyTimeValue}>{item.hours}</Text>
        </View>
      </View>
    </View>
  )

  useEffect(() => {
    const fetchNurseDetails = async () => {
      if (!authToken) return
      try {
        const response = await getNurseDetailsAPI(authToken)
        if (response.status && response.data) {
          setNurseDetails(response.data)
          setShiftData(response.data.all_shift_data)
        } else {
          setShiftData(fallbackShiftData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchNurseDetails()
  }, [authToken])

  if (!nurseDetails)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={60} color="#4EA8DE" />
      </View>
    )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.nurseInfo}>
            <Image
              source={{
                uri: nurseDetails.imageUrl ? nurseDetails.imageUrl : "https://avatar.iran.liara.run/public/27",
              }}
              style={styles.nurseImage}
            />
            <View>
              <Text style={styles.nurseName}>
                {nurseDetails.first_name} {nurseDetails.last_name}
              </Text>
              <Text style={styles.nurseRole}>{nurseDetails.email}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.notificationButton} onPress={() => router.push("/(tabs)/notifications")}>
            <Ionicons name="notifications-outline" size={24} color="#4EA8DE" />
            {shiftData.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{shiftData.length > 99 ? "99+" : shiftData.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Clock In/Out Card */}
        <View style={styles.clockCard}>
          <View style={styles.clockCardContent}>
            <View style={styles.clockStatusContainer}>
              <View style={styles.clockStatusIndicator}>
                <View style={[styles.statusDot, { backgroundColor: clockedIn ? "#4ADE80" : "#94A3B8" }]} />
                <Text style={styles.clockStatusText}>{clockedIn ? "On Duty" : "Off Duty"}</Text>
              </View>

              {totalHours > 0 && (
                <View style={styles.totalHoursContainer}>
                  <Text style={styles.totalHoursValue}>{totalHours} hrs</Text>
                  <Text style={styles.totalHoursLabel}>today</Text>
                </View>
              )}
            </View>

            <View style={styles.clockTimesRow}>
              {clockInTime && (
                <View style={styles.clockTimeItem}>
                  <Text style={styles.clockTimeLabel}>IN</Text>
                  <Text style={styles.clockTimeValue}>{moment(clockInTime).format("hh:mm A")}</Text>
                </View>
              )}

              {clockOutTime && (
                <View style={styles.clockTimeItem}>
                  <Text style={styles.clockTimeLabel}>OUT</Text>
                  <Text style={styles.clockTimeValue}>{moment(clockOutTime).format("hh:mm A")}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.clockButtonsRow}>
            <TouchableOpacity
              style={[styles.clockButton, clockedIn ? styles.clockButtonDisabled : styles.clockInButton]}
              onPress={handleClockIn}
              disabled={clockedIn}
            >
              <MaterialCommunityIcons name="login" size={18} color={clockedIn ? "#94A3B8" : "#4EA8DE"} />
              <Text style={[styles.clockButtonText, { color: clockedIn ? "#94A3B8" : "#4EA8DE" }]}>Clock In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.clockButton, !clockedIn ? styles.clockButtonDisabled : styles.clockOutButton]}
              onPress={handleClockOut}
              disabled={!clockedIn}
            >
              <MaterialCommunityIcons name="logout" size={18} color={!clockedIn ? "#94A3B8" : "#F56565"} />
              <Text style={[styles.clockButtonText, { color: !clockedIn ? "#94A3B8" : "#F56565" }]}>Clock Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Work History Section */}
        {workHistory.length > 0 && (
          <View style={styles.historySection}>
            <TouchableOpacity
              style={[styles.accordionHeader, workHistoryExpanded && styles.accordionHeaderExpanded]}
              onPress={() => setWorkHistoryExpanded(!workHistoryExpanded)}
            >
              <View style={styles.accordionTitleContainer}>
                <MaterialCommunityIcons name="history" size={20} color="#4EA8DE" />
                <Text style={styles.sectionTitle}>Work History</Text>
              </View>
              <Ionicons name={workHistoryExpanded ? "chevron-up" : "chevron-down"} size={20} color="#4A5568" />
            </TouchableOpacity>

            {workHistoryExpanded && (
              <>
                <FlatList
                  data={workHistory.slice(0, 3)}
                  renderItem={renderWorkHistoryItem}
                  keyExtractor={(item, index) => `history-${index}`}
                  scrollEnabled={false}
                />
                {workHistory.length > 3 && (
                  <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View All History</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}

        {/* Schedule Header */}
        <View style={styles.scheduleHeader}>
          <Text style={styles.sectionTitle}>Upcoming Shifts</Text>

          <View style={styles.headerActions}>
            {/* Calendar Icon */}
            <TouchableOpacity style={styles.iconButton} onPress={() => setShowCalendar(!showCalendar)}>
              <Ionicons name="calendar-outline" size={22} color="#4EA8DE" />
            </TouchableOpacity>

            {/* Filter Icon */}
            <TouchableOpacity style={styles.iconButton} onPress={() => setShowFilterDropdown(!showFilterDropdown)}>
              <Ionicons name="filter-outline" size={22} color="#4EA8DE" />
            </TouchableOpacity>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <View style={styles.filterDropdown}>
                {["all", "day", "week", "month"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.filterOption, filterType === type && styles.activeFilter]}
                    onPress={() => {
                      setFilterType(type)
                      setShowFilterDropdown(false)
                    }}
                  >
                    <Text style={[styles.filterText, filterType === type && styles.activeFilterText]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Active Filter Indicator */}
        {(selectedDate || filterType !== "all") && (
          <View style={styles.activeFilterIndicator}>
            <Text style={styles.activeFilterText}>
              {selectedDate
                ? `Date: ${moment(selectedDate).format("MMM D, YYYY")}`
                : `Filter: ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedDate("")
                setFilterType("all")
              }}
            >
              <Ionicons name="close-circle" size={20} color="#4EA8DE" />
            </TouchableOpacity>
          </View>
        )}

        {/* Calendar */}
        {showCalendar && (
          <View style={styles.calendarContainer}>
            <Calendar
              theme={{
                calendarBackground: "#FFFFFF",
                textSectionTitleColor: "#4EA8DE",
                selectedDayBackgroundColor: "#4EA8DE",
                selectedDayTextColor: "#FFFFFF",
                todayTextColor: "#4EA8DE",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e1e8",
                dotColor: "#4EA8DE",
                selectedDotColor: "#FFFFFF",
                arrowColor: "#4EA8DE",
                monthTextColor: "#4EA8DE",
                indicatorColor: "#4EA8DE",
                textDayFontFamily: "Poppins_400Regular",
                textMonthFontFamily: "Poppins_600SemiBold",
                textDayHeaderFontFamily: "Poppins_500Medium",
              }}
              onDayPress={(day) => {
                setSelectedDate(day.dateString === selectedDate ? "" : day.dateString)
                setShowCalendar(false)
              }}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: "#4EA8DE" },
              }}
            />
          </View>
        )}

        {/* Empty State */}
        {filteredShifts.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color="#DFE6ED" />
            <Text style={styles.emptyStateTitle}>No Shifts Found</Text>
            <Text style={styles.emptyStateMessage}>No shifts match your current filter criteria</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSelectedDate("")
                setFilterType("all")
              }}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Shift List */}
        {filteredShifts.length > 0 && (
          <FlatList
            data={filteredShifts}
            keyExtractor={(item) => item.full_date}
            renderItem={renderShift}
            contentContainerStyle={styles.list}
            scrollEnabled={false}
          />
        )}

        {/* Load More Button */}
        {displayCount < allShiftData.length && filteredShifts.length > 0 && (
          <TouchableOpacity style={styles.loadMoreButton} onPress={() => setDisplayCount(displayCount + 5)}>
            <Text style={styles.loadMoreText}>Load More</Text>
            <Ionicons name="chevron-down" size={16} color="#4EA8DE" />
          </TouchableOpacity>
        )}
      </ScrollView>
      <Toast config={ToastConfig} />
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F8F9FA",
    marginHorizontal:20,
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  nurseInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  nurseImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#4EA8DE",
  },
  nurseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 2,
    fontFamily: "Poppins_600SemiBold",
  },
  nurseRole: {
    fontSize: 14,
    color: "#718096",
    fontFamily: "Poppins_400Regular",
  },
  notificationButton: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight:10,
    backgroundColor: "#EDF2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#F56565",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  // Clock In/Out Card Styles
  clockCard: {
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  clockCardContent: {
    padding: 20,
  },
  clockStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  clockStatusIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  clockStatusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    fontFamily: "Poppins_600SemiBold",
  },
  totalHoursContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  totalHoursValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    fontFamily: "Poppins_700Bold",
  },
  totalHoursLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginLeft: 4,
    fontFamily: "Poppins_400Regular",
  },
  clockTimesRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  clockTimeItem: {
    marginRight: 24,
  },
  clockTimeLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontFamily: "Poppins_500Medium",
    marginBottom: 2,
  },
  clockTimeValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    fontFamily: "Poppins_600SemiBold",
  },
  clockButtonsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  clockButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  clockInButton: {
    borderRightWidth: 1,
    borderRightColor: "#F1F5F9",
  },
  clockOutButton: {},
  clockButtonDisabled: {
    opacity: 0.7,
  },
  clockButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: "Poppins_600SemiBold",
  },
  // Work History Accordion Styles
  historySection: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 0,
    borderBottomColor: "#F1F5F9",
  },
  accordionHeaderExpanded: {
    borderBottomWidth: 1,
  },
  accordionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  historyDate: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  historyDateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A5568",
    marginLeft: 6,
    fontFamily: "Poppins_500Medium",
  },
  historyTimes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyTimeBlock: {
    flex: 1,
    alignItems: "center",
  },
  historyTimeLabel: {
    fontSize: 12,
    color: "#718096",
    fontFamily: "Poppins_400Regular",
  },
  historyTimeValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D3748",
    fontFamily: "Poppins_500Medium",
  },
  historyDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#EDF2F7",
  },
  viewAllButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: "#4EA8DE",
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },
  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
    marginLeft: 8,
    fontFamily: "Poppins_600SemiBold",
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: "row",
    position: "relative",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDF2F7",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  filterDropdown: {
    position: "absolute",
    top: 44,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 20,
    width: 120,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  activeFilter: {
    backgroundColor: "#EBF8FF",
  },
  filterText: {
    fontSize: 14,
    color: "#4A5568",
    fontFamily: "Poppins_400Regular",
  },
  activeFilterText: {
    color: "#4EA8DE",
    fontWeight: "500",
    fontFamily: "Poppins_500Medium",
  },
  activeFilterIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  calendarContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  list: {
    paddingBottom: 24,
  },
  cardWrapper: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  shiftCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4EA8DE",
  },
  dateContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 70,
    borderRadius: 8,
    marginRight: 16,
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4A5568",
    fontFamily: "Poppins_500Medium",
  },
  dateText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D3748",
    fontFamily: "Poppins_600SemiBold",
  },
  monthText: {
    fontSize: 12,
    color: "#4A5568",
    fontFamily: "Poppins_400Regular",
  },
  shiftInfo: {
    flex: 1,
    marginRight: 8,
  },
  shiftTypeContainer: {
    flexDirection: "column",
  },
  shiftTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  shiftTypeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Poppins_600SemiBold",
  },
  shiftTime: {
    fontSize: 14,
    color: "#4A5568",
    fontWeight: "500",
    fontFamily: "Poppins_500Medium",
  },
  shiftAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  acceptButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#FFFFFF",
  },
  rejectButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#FFFFFF",
  },
  loadMoreButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  loadMoreText: {
    color: "#4EA8DE",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
    fontFamily: "Poppins_600SemiBold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginTop: 16,
    marginBottom: 8,
    fontFamily: "Poppins_600SemiBold",
  },
  emptyStateMessage: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "Poppins_400Regular",
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#4EA8DE",
    borderRadius: 8,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins_500Medium",
  },
})
