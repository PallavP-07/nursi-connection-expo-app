
import { useState, useEffect } from "react"
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
  Animated,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native"
import DropDownPicker from "react-native-dropdown-picker"
import Ionicons from "@expo/vector-icons/Ionicons"
import { BlurView } from "expo-blur"


// Utility functions
const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "#f59e0b" // Amber
    case "Accepted":
      return "#10b981" // Green
    case "Rejected":
      return "#ef4444" // Red
    default:
      return "#333" // Default color
  }
}

const getShiftColor = (shift) => {
  switch (shift) {
    case "Morning":
      return "#3b82f6" // Blue
    case "Evening":
      return "#8b5cf6" // Purple
    case "Night":
      return "#1e293b" // Dark blue
    default:
      return "#64748b" // Slate
  }
}

// Sample data
const myShifts = [
  { id: "my1", date: "2025-04-08", shift: "Morning", time: "7 AM - 7 PM" },
  { id: "my2", date: "2025-04-10", shift: "Night", time: "7 PM - 7 AM" },
  { id: "my3", date: "2025-04-12", shift: "Morning", time: "7 AM - 7 PM" },
]

// Available shifts data - showing when users are free
const availableUserShifts = {
  u1: [
    { id: "av1", date: "2025-04-09", shift: "Morning", time: "7 AM - 7 PM" },
    { id: "av2", date: "2025-04-11", shift: "Night", time: "7 PM - 7 AM" },
  ],
  u2: [
    { id: "av3", date: "2025-04-12", shift: "Evening", time: "3 PM - 11 PM" },
    { id: "av4", date: "2025-04-14", shift: "Morning", time: "7 AM - 7 PM" },
  ],
  u3: [
    { id: "av5", date: "2025-04-10", shift: "Evening", time: "3 PM - 11 PM" },
    { id: "av6", date: "2025-04-15", shift: "Morning", time: "7 AM - 7 PM" },
  ],
}

const users = [
  {
    id: "u1",
    name: "Michael Johnson",
    image: "https://avatar.iran.liara.run/public/2",
    shifts: [
      { id: "mj1", date: "2025-04-08", shift: "Morning", time: "7 AM - 7 PM" },
      { id: "mj2", date: "2025-04-09", shift: "Evening", time: "3 PM - 11 PM" },
    ],
  },
  {
    id: "u2",
    name: "Sarah Connor",
    image: "https://avatar.iran.liara.run/public/9",
    shifts: [
      { id: "sc1", date: "2025-04-08", shift: "Night", time: "7 PM - 7 AM" },
      { id: "sc2", date: "2025-04-10", shift: "Morning", time: "7 AM - 7 PM" },
    ],
  },
  {
    id: "u3",
    name: "David Miller",
    image: "https://avatar.iran.liara.run/public/42",
    shifts: [
      { id: "dm1", date: "2025-04-11", shift: "Night", time: "7 PM - 7 AM" },
      { id: "dm2", date: "2025-04-13", shift: "Morning", time: "7 AM - 7 PM" },
    ],
  },
]

const initialTradeRequests = [
  {
    id: "1",
    from: "John Doe",
    fromImage: "https://avatar.iran.liara.run/public/2",
    to: "You",
    toImage: "https://avatar.iran.liara.run/public/4",
    fromShift: { date: "2025-04-07", shift: "Night", time: "7 PM - 7 AM" },
    status: "Pending",
    timeLeft: "3 days left",
  },
  {
    id: "2",
    from: "Emma Watson",
    fromImage: "https://avatar.iran.liara.run/public/9",
    to: "You",
    toImage: "https://avatar.iran.liara.run/public/8",
    fromShift: { date: "2025-04-09", shift: "Morning", time: "7 AM - 7 PM" },
    status: "Accepted",
  },
  {
    id: "3",
    from: "Michael Smith",
    fromImage: "https://avatar.iran.liara.run/public/42",
    to: "You",
    toImage: "https://avatar.iran.liara.run/public/10",
    fromShift: { date: "2025-04-11", shift: "Night", time: "7 PM - 7 AM" },
    status: "Rejected",
  },
]

const initialSentRequests = [
  {
    id: "s1",
    from: "You",
    fromImage: "https://avatar.iran.liara.run/public/4",
    to: "Lisa Johnson",
    toImage: "https://avatar.iran.liara.run/public/22",
    fromShift: { date: "2025-04-18", shift: "Morning", time: "7 AM - 7 PM" },
    status: "Pending",
    timeLeft: "5 days left",
  },
]

// Main component
const TradeShift = () => {
  const [activeTab, setActiveTab] = useState("Received")
  const [modalVisible, setModalVisible] = useState(false)
  const [modalAnimation] = useState(new Animated.Value(0))
  const [tradeRequests, setTradeRequests] = useState(initialTradeRequests)
  const [sentRequests, setSentRequests] = useState(initialSentRequests)

  // Form state
  const [selectedUser, setSelectedUser] = useState(null)
  const [availableShifts, setAvailableShifts] = useState([])
  const [selectedAvailableShift, setSelectedAvailableShift] = useState(null)
  const [myOfferedShift, setMyOfferedShift] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dropdown state
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [availableShiftDropdownOpen, setAvailableShiftDropdownOpen] = useState(false)
  const [myShiftDropdownOpen, setMyShiftDropdownOpen] = useState(false)

  // Update available shifts when user changes
  useEffect(() => {
    if (selectedUser) {
      const userAvailableShifts = availableUserShifts[selectedUser.id] || []
      setAvailableShifts(userAvailableShifts)
      setSelectedAvailableShift(null)
    } else {
      setAvailableShifts([])
      setSelectedAvailableShift(null)
    }
  }, [selectedUser])

  // Animation for modal
  useEffect(() => {
    if (modalVisible) {
      Animated.spring(modalAnimation, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start()
    } else {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [modalVisible])

  const handleTradeSubmit = () => {
    if (!selectedUser || !myOfferedShift) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newRequest = {
        id: Date.now().toString(),
        from: "You",
        fromImage: "https://avatar.iran.liara.run/public/4",
        to: selectedUser.name,
        toImage: selectedUser.image,
        fromShift: {
          date: myOfferedShift.date,
          shift: myOfferedShift.shift,
          time: myOfferedShift.time,
        },
        status: "Pending",
        timeLeft: "14 days left",
      }

      setSentRequests([newRequest, ...sentRequests])
      setIsSubmitting(false)
      setModalVisible(false)
      resetForm()
    }, 1000)
  }

  const resetForm = () => {
    setSelectedUser(null)
    setSelectedAvailableShift(null)
    setMyOfferedShift(null)
  }

  const handleAccept = (id) => {
    setTradeRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "Accepted" } : req)))
  }

  const handleReject = (id) => {
    setTradeRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "Rejected" } : req)))
  }

  const handleCancel = (id) => {
    setSentRequests((prev) => prev.filter((req) => req.id !== id))
  }

  const modalTranslateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  })

  // Component for status badge
  const StatusBadge = ({ status }) => {
    const statusColor = getStatusColor(status)

    return (
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: statusColor + "20" }, // 20% opacity
        ]}
      >
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.statusBadgeText, { color: statusColor }]}>{status}</Text>
      </View>
    )
  }

  // Component for shift box
  const ShiftBox = ({ shift }) => {
    return (
      <View style={styles.shiftBox}>
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Date</Text>
            <Text style={styles.dateValue}>{shift.date}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Time</Text>
            <Text style={styles.timeValue}>{shift.time}</Text>
          </View>
        </View>
        <View style={[styles.shiftTypeBadge, { backgroundColor: getShiftColor(shift.shift) }]}>
          <Text style={styles.shiftTypeText}>{shift.shift}</Text>
        </View>
      </View>
    )
  }

  // Component for empty state
  const EmptyState = ({ type }) => {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name={type === "received" ? "mail-outline" : "paper-plane-outline"} size={40} color="#94a3b8" />
        </View>
        <Text style={styles.emptyTitle}>No {type} requests</Text>
        <Text style={styles.emptySubtitle}>
          {type === "received"
            ? "When colleagues request to trade shifts with you, they'll appear here."
            : "When you request to trade shifts with colleagues, they'll appear here."}
        </Text>
      </View>
    )
  }

  // Render trade request card
  const renderTradeRequest = ({ item }) => {
    const isPending = item.status === "Pending"

    return (
      <View style={styles.card}>
        <StatusBadge status={item.status} />

        {/* Profile Section */}
        <View style={styles.userAvatarRow}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: item.fromImage }} style={styles.avatar} />
            <Text style={styles.avatarLabel}>{item.from}</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward" size={20} color="#94a3b8" />
          </View>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: item.toImage }} style={styles.avatar} />
            <Text style={styles.avatarLabel}>{item.to}</Text>
          </View>
        </View>

        <ShiftBox shift={item.fromShift} />

        {/* Action Buttons */}
        {isPending && (
          <View style={styles.actionRow}>
            {item.timeLeft && (
              <View style={styles.timeLeftContainer}>
                <Ionicons name="time-outline" size={14} color="#94a3b8" />
                <Text style={styles.timeLeftText}>{item.timeLeft}</Text>
              </View>
            )}

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.id)}>
                <Text style={styles.rejectButtonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.id)}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    )
  }

  // Render sent request card
  const renderSentRequest = ({ item }) => {
    const isPending = item.status === "Pending"

    return (
      <View style={styles.cardModern}>
        <StatusBadge status={item.status} />

        {/* Profile Section */}
        <View style={styles.userAvatarRowModern}>
          <View style={styles.avatarContainerModern}>
            <Image source={{ uri: item.fromImage }} style={styles.avatarModern} />
            <Text style={styles.avatarLabelModern}>{item.from}</Text>
          </View>
          <View style={styles.arrowContainerModern}>
            <Ionicons name="arrow-forward" size={24} color="#94a3b8" />
          </View>
          <View style={styles.avatarContainerModern}>
            <Image source={{ uri: item.toImage }} style={styles.avatarModern} />
            <Text style={styles.avatarLabelModern}>{item.to}</Text>
          </View>
        </View>

        {/* Shift Card */}
        <View style={styles.sentShiftCard}>
          <View style={styles.sentShiftHeader}>
            <Text style={styles.sentShiftTitle}>Your Offered Shift</Text>
            <View style={[styles.sentShiftBadge, { backgroundColor: getShiftColor(item.fromShift.shift) }]}>
              <Text style={styles.sentShiftBadgeText}>{item.fromShift.shift}</Text>
            </View>
          </View>

          <View style={styles.sentShiftDetails}>
            <View style={styles.sentShiftDetail}>
              <Ionicons name="calendar-outline" size={18} color="#64748b" />
              <Text style={styles.sentShiftDetailText}>{item.fromShift.date}</Text>
            </View>
            <View style={styles.sentShiftDetail}>
              <Ionicons name="time-outline" size={18} color="#64748b" />
              <Text style={styles.sentShiftDetailText}>{item.fromShift.time}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {isPending && (
          <View style={styles.actionRowModern}>
            {item.timeLeft && (
              <View style={styles.timeLeftContainerModern}>
                <Ionicons name="time-outline" size={16} color="#94a3b8" />
                <Text style={styles.timeLeftTextModern}>{item.timeLeft}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.cancelButtonModern} onPress={() => handleCancel(item.id)}>
              <Text style={styles.cancelButtonTextModern}>Cancel Request</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Shift Trade</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {["Received", "Sent"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
              {tab === "Received" && tradeRequests.length > 0 && (
                <Text style={styles.tabBadge}> {tradeRequests.length}</Text>
              )}
              {tab === "Sent" && sentRequests.length > 0 && <Text style={styles.tabBadge}> {sentRequests.length}</Text>}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Request List */}
      <FlatList
        data={activeTab === "Received" ? tradeRequests : sentRequests}
        keyExtractor={(item) => item.id}
        renderItem={activeTab === "Received" ? renderTradeRequest : renderSentRequest}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState type={activeTab.toLowerCase()} />}
      />

      {/* Request Trade Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="swap-horizontal" size={24} color="white" />
        <Text style={styles.floatingButtonText}>Request Trade</Text>
      </TouchableOpacity>

      {/* Trade Request Modal */}
      <Modal visible={modalVisible} transparent animationType="none">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="dark" />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [{ translateY: modalTranslateY }],
                  },
                ]}
              >
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>New Trade Request</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>

                {/* Form Content */}
                <View style={styles.formContainer}>
                  {/* Your Shift - Now first as requested */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Your Shift</Text>
                    <View style={{ zIndex: 3000 }}>
                      <DropDownPicker
                        open={myShiftDropdownOpen}
                        value={myOfferedShift?.id}
                        items={myShifts.map((shift) => ({
                          label: `${shift.date} - ${shift.shift} (${shift.time})`,
                          value: shift.id,
                        }))}
                        setOpen={setMyShiftDropdownOpen}
                        setValue={(callback) => {
                          const shiftId = callback(myOfferedShift?.id)
                          setMyOfferedShift(myShifts.find((s) => s.id === shiftId) || null)
                        }}
                        placeholder="Select your shift"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        placeholderStyle={styles.dropdownPlaceholder}
                        listItemLabelStyle={styles.dropdownItemLabel}
                        selectedItemLabelStyle={styles.dropdownSelectedItemLabel}
                        ArrowDownIconComponent={() => <Ionicons name="chevron-down" size={18} color="#64748b" />}
                        ArrowUpIconComponent={() => <Ionicons name="chevron-up" size={18} color="#64748b" />}
                        zIndex={3000}
                        zIndexInverse={1000}
                      />
                    </View>
                  </View>

                  {/* Select Colleague - Now second as requested */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Select Colleague</Text>
                    <View style={{ zIndex: 2000 }}>
                      <DropDownPicker
                        open={userDropdownOpen}
                        value={selectedUser?.id}
                        items={users.map((user) => ({
                          label: user.name,
                          value: user.id,
                        }))}
                        setOpen={setUserDropdownOpen}
                        setValue={(callback) => {
                          const userId = callback(selectedUser?.id)
                          const user = users.find((u) => u.id === userId)
                          setSelectedUser(user || null)
                        }}
                        placeholder="Select a colleague"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                        placeholderStyle={styles.dropdownPlaceholder}
                        listItemLabelStyle={styles.dropdownItemLabel}
                        selectedItemLabelStyle={styles.dropdownSelectedItemLabel}
                        ArrowDownIconComponent={() => <Ionicons name="chevron-down" size={18} color="#64748b" />}
                        ArrowUpIconComponent={() => <Ionicons name="chevron-up" size={18} color="#64748b" />}
                        zIndex={2000}
                        zIndexInverse={2000}
                      />
                    </View>
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[styles.submitButton, (!selectedUser || !myOfferedShift) && styles.submitButtonDisabled]}
                  onPress={handleTradeSubmit}
                  disabled={!selectedUser || !myOfferedShift || isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Ionicons name="paper-plane" size={18} color="white" style={styles.submitButtonIcon} />
                      <Text style={styles.submitButtonText}>Send Request</Text>
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#3b82f6",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748b",
  },
  activeTabText: {
    color: "white",
  },
  tabBadge: {
    fontWeight: "700",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  cardModern: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    position: "relative",
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 16,
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
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  userAvatarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 30,
  },
  userAvatarRowModern: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 30,
  },
  avatarContainer: {
    alignItems: "center",
    flex: 1,
  },
  avatarContainerModern: {
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  avatarModern: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#e2e8f0",
  },
  avatarLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
  avatarLabelModern: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
  arrowContainer: {
    paddingHorizontal: 8,
  },
  arrowContainerModern: {
    paddingHorizontal: 8,
  },
  // Shift box for received requests
  shiftBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateContainer: {
    marginRight: 20,
  },
  dateLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  timeContainer: {},
  timeLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  shiftTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  shiftTypeText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
  },
  // Sent shift card
  sentShiftCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sentShiftHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sentShiftTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  sentShiftBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sentShiftBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  sentShiftDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sentShiftDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  sentShiftDetailText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#334155",
    marginLeft: 6,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionRowModern: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeLeftContainerModern: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timeLeftText: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 4,
  },
  timeLeftTextModern: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 6,
    fontWeight: "500",
  },
  actionButtonsContainer: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  rejectButton: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rejectButtonText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonModern: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 14,
  },
  cancelButtonTextModern: {
    color: "#b91c1c",
    fontWeight: "600",
    fontSize: 14,
  },
  floatingButton: {
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
  floatingButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: Dimensions.get("window").height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  dropdown: {
    borderColor: "#e2e8f0",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownContainer: {
    borderColor: "#e2e8f0",
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownPlaceholder: {
    color: "#94a3b8",
    fontSize: 14,
  },
  dropdownItemLabel: {
    color: "#334155",
    fontSize: 14,
  },
  dropdownSelectedItemLabel: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  submitButtonIcon: {
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    paddingHorizontal: 32,
  },
})

export default TradeShift
