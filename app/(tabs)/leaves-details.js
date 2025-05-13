import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
  ScrollView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import CustomModel from "../../components/CustomModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native";
import { BlurView } from "expo-blur";

// Sample data
const leaveData = [
  {
    id: "1",
    type: "Sick Leave",
    from: "March 1, 2025",
    to: "March 3, 2025",
    status: "Approved",
    reason: "High fever and doctor's recommendation",
    approvedBy: "Dr. Sarah Johnson",
    appliedOn: "February 28, 2025",
  },
  {
    id: "2",
    type: "Casual Leave",
    from: "March 10, 2025",
    to: "March 11, 2025",
    status: "Pending",
    reason: "Family function",
    appliedOn: "March 5, 2025",
  },
  {
    id: "3",
    type: "Emergency Leave",
    from: "March 15, 2025",
    to: "March 16, 2025",
    status: "Rejected",
    reason: "Not enough staff availability",
    rejectedBy: "Manager David",
    appliedOn: "March 14, 2025",
  },
  {
    id: "4",
    type: "Vacation",
    from: "April 5, 2025",
    to: "April 10, 2025",
    status: "Approved",
    reason: "Annual leave",
    approvedBy: "HR Department",
    appliedOn: "March 20, 2025",
  },
  {
    id: "5",
    type: "Sick Leave",
    from: "April 15, 2025",
    to: "April 16, 2025",
    status: "Pending",
    reason: "Dental appointment",
    appliedOn: "April 10, 2025",
  },
];

// Leave types with icons
const leaveTypes = [
  { id: "sick", name: "Sick Leave", icon: "medkit-outline", color: "#FF5858" },
  { id: "casual", name: "Casual Leave", icon: "cafe-outline", color: "#36D1DC" },
  { id: "vacation", name: "Vacation", icon: "airplane-outline", color: "#42E695" },
  { id: "emergency", name: "Emergency", icon: "alert-circle-outline", color: "#9D50BB" },
  { id: "unpaid", name: "Unpaid Leave", icon: "wallet-outline", color: "#FF9D6C" },
];

const leaveSummary = {
  totalAllocated: 20,
  leaveTaken: 8,
  leaveAvailable: 12,
  totalHolidays: 10,
};

const leaveSummaryData = [
  { title: "Total Allocated", value: leaveSummary.totalAllocated, icon: "calendar-outline", color: ["#36D1DC", "#5B86E5"] },
  { title: "Leave Taken", value: leaveSummary.leaveTaken, icon: "checkmark-circle-outline", color: ["#FF5858", "#FB5895"] },
  { title: "Leave Available", value: leaveSummary.leaveAvailable, icon: "hourglass-outline", color: ["#42E695", "#3BB2B8"] },
  { title: "Total Holidays", value: leaveSummary.totalHolidays, icon: "gift-outline", color: ["#9D50BB", "#6E48AA"] },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "#22c55e";
    case "Pending":
      return "#f59e0b";
    case "Rejected":
      return "#ef4444";
    default:
      return "#333";
  }
};

const getStatusBgColor = (status) => {
  switch (status) {
    case "Approved":
      return "rgba(34, 197, 94, 0.1)";
    case "Pending":
      return "rgba(245, 158, 11, 0.1)";
    case "Rejected":
      return "rgba(239, 68, 68, 0.1)";
    default:
      return "rgba(51, 51, 51, 0.1)";
  }
};

// Modern Leave Request Form Component
const RequestLeaveForm = ({ onClose, onSubmit }) => {
  const [leaveType, setLeaveType] = useState(null);
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = () => {
    if (!leaveType || !reason) {
      // Show validation error
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newLeave = {
        id: Date.now().toString(),
        type: leaveTypes.find(type => type.id === leaveType)?.name || "Leave",
        from: formatDate(fromDate),
        to: formatDate(toDate),
        status: "Pending",
        reason: reason,
        appliedOn: formatDate(new Date()),
      };

      onSubmit(newLeave);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <ScrollView style={styles.formScrollView}>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Request Leave</Text>
        
        {/* Leave Type Selection */}
        <Text style={styles.formLabel}>Leave Type</Text>
        <View style={styles.leaveTypeContainer}>
          {leaveTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.leaveTypeButton,
                leaveType === type.id && { borderColor: type.color, backgroundColor: `${type.color}20` }
              ]}
              onPress={() => setLeaveType(type.id)}
            >
              <Ionicons name={type.icon} size={24} color={type.color} />
              <Text style={[styles.leaveTypeText, leaveType === type.id && { color: type.color }]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Selection */}
        <View style={styles.dateContainer}>
          <View style={styles.dateField}>
            <Text style={styles.formLabel}>From Date</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowFromDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
            </TouchableOpacity>
            {showFromDatePicker && (
              <DateTimePicker
                value={fromDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowFromDatePicker(Platform.OS === "ios");
                  if (selectedDate) {
                    setFromDate(selectedDate);
                    // If to date is before from date, update it
                    if (selectedDate > toDate) {
                      setToDate(selectedDate);
                    }
                  }
                }}
              />
            )}
          </View>

          <View style={styles.dateField}>
            <Text style={styles.formLabel}>To Date</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowToDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.dateText}>{formatDate(toDate)}</Text>
            </TouchableOpacity>
            {showToDatePicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                minimumDate={fromDate}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowToDatePicker(Platform.OS === "ios");
                  if (selectedDate) {
                    setToDate(selectedDate);
                  }
                }}
              />
            )}
          </View>
        </View>

        {/* Reason */}
        <Text style={styles.formLabel}>Reason</Text>
        <TextInput
          style={styles.reasonInput}
          placeholder="Enter reason for leave"
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!leaveType || !reason) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!leaveType || !reason || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const LeaveDetails = () => {
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);
  const filters = ["All", "Approved", "Pending", "Rejected"];
  const [leaves, setLeaves] = useState(leaveData);
  const [refreshing, setRefreshing] = useState(false);

  // Measure tab width dynamically
  const onTabLayout = (event) => {
    setTabWidth(event.nativeEvent.layout.width / filters.length);
  };

  // Smooth slide animation
  const onTabPress = (index) => {
    setFilter(filters[index]);
    Animated.spring(translateX, {
      toValue: index * tabWidth,
      useNativeDriver: true,
      friction: 8,
      tension: 70,
    }).start();
  };

  const filteredLeaveData =
    filter === "All"
      ? leaves
      : leaves.filter((item) => item.status === filter);

  const handleAddLeave = (newLeave) => {
    setLeaves([newLeave, ...leaves]);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderLeaveItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <Ionicons 
            name={leaveTypes.find(type => type.name === item.type)?.icon || "calendar-outline"} 
            size={20} 
            color={leaveTypes.find(type => type.name === item.type)?.color || "#666"} 
          />
          <Text style={styles.type}>{item.type}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(item.status) }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={18} color="#666" />
          <Text style={styles.dateLabel}>From:</Text>
          <Text style={styles.dateValue}>{item.from}</Text>
        </View>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={18} color="#666" />
          <Text style={styles.dateLabel}>To:</Text>
          <Text style={styles.dateValue}>{item.to}</Text>
        </View>
      </View>
      
      <View style={styles.reasonContainer}>
        <Text style={styles.reasonLabel}>Reason:</Text>
        <Text style={styles.reasonText}>{item.reason}</Text>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.appliedDate}>
          <Ionicons name="time-outline" size={14} color="#94a3b8" /> Applied on {item.appliedOn}
        </Text>
        
        {item.status === "Approved" && item.approvedBy && (
          <Text style={styles.approvedBy}>
            <Ionicons name="checkmark-circle-outline" size={14} color="#22c55e" /> Approved by {item.approvedBy}
          </Text>
        )}
        
        {item.status === "Rejected" && item.rejectedBy && (
          <Text style={styles.rejectedBy}>
            <Ionicons name="close-circle-outline" size={14} color="#ef4444" /> Rejected by {item.rejectedBy}
          </Text>
        )}
        
        {item.status === "Pending" && (
          <View style={styles.pendingActions}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={60} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No leaves found</Text>
      <Text style={styles.emptySubtitle}>
        {filter === "All" 
          ? "You haven't applied for any leaves yet" 
          : `No ${filter.toLowerCase()} leaves found`}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Leave Management</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Ionicons name="refresh-outline" size={22} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Leave Summary */}
      <View style={styles.summaryContainer}>
        {leaveSummaryData.map((item, index) => (
          <LinearGradient
            key={index}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={item.color}
            style={styles.summaryCard}
          >
            <Ionicons name={item.icon} size={24} color="white" style={styles.summaryIcon} />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryTitle}>{item.title}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
            </View>
          </LinearGradient>
        ))}
      </View>

      {/* Tab Filter */}
      <View style={styles.tabContainer} onLayout={onTabLayout}>
        <Animated.View
          style={[
            styles.activeTab,
            {
              width: tabWidth,
              transform: [{ translateX }],
            },
          ]}
        />
        {filters.map((status, index) => (
          <TouchableOpacity
            key={status}
            style={styles.tabButton}
            onPress={() => onTabPress(index)}
          >
            <Text
              style={[
                styles.tabText,
                filter === status && styles.activeTabText,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Leave List */}
      <FlatList
        data={filteredLeaveData}
        keyExtractor={(item) => item.id}
        renderItem={renderLeaveItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Request Leave Button */}
      <TouchableOpacity
        style={styles.requestLeaveButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Request Leave</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <CustomModel
          setModalVisible={setModalVisible}
          content={
            <RequestLeaveForm 
              onClose={() => setModalVisible(false)} 
              onSubmit={handleAddLeave}
            />
          }
        />
      </Modal>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  summaryIcon: {
    marginRight: 12,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 5,
    height: 45,
    alignItems: "center",
    position: "relative",
  },
  activeTab: {
    position: "absolute",
    height: 38,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    top:2,
    marginHorizontal:2,
    left:1,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    zIndex: 1,
  },
  tabText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabText: {
    color: "#0f172a",
    fontWeight: "700",
  },
  tabCount: {
    fontWeight: "700",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  type: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardBody: {
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 6,
    marginRight: 4,
    width: 40,
  },
  dateValue: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },
  reasonContainer: {
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  reasonLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: "#334155",
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
  },
  appliedDate: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  approvedBy: {
    fontSize: 12,
    color: "#22c55e",
  },
  rejectedBy: {
    fontSize: 12,
    color: "#ef4444",
  },
  pendingActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "600",
  },
  requestLeaveButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    paddingHorizontal: 32,
    alignItems:"center"
  },
  // Form styles
  formScrollView: {
    // maxHeight: 600,
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 20,
    textAlign: "center",
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  leaveTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  leaveTypeButton: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "white",
  },
  leaveTypeText: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateField: {
    width: "48%",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    backgroundColor: "white",
  },
  dateText: {
    fontSize: 14,
    color: "#334155",
    marginLeft: 8,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#334155",
    backgroundColor: "white",
    height: 100,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LeaveDetails;
