
import { useState, useLayoutEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView } from "react-native"

// Dummy notification data
const dummyNotifications = [
  {
    id: "1",
    title: "New Message",
    message: "John Doe sent you a message",
    time: "2 min ago",
    read: false,
    icon: "chatbubble-ellipses",
    color: "#4F8EF7",
  },
  {
    id: "2",
    title: "Friend Request",
    message: "Sarah Johnson wants to connect with you",
    time: "1 hour ago",
    read: false,
    icon: "person-add",
    color: "#50C878",
  },
  {
    id: "3",
    title: "Event Reminder",
    message: "Your scheduled meeting starts in 30 minutes",
    time: "30 min ago",
    read: true,
    icon: "calendar",
    color: "#FF6B6B",
  },
  {
    id: "4",
    title: "Payment Successful",
    message: "Your payment of $24.99 was processed successfully",
    time: "2 hours ago",
    read: true,
    icon: "card",
    color: "#FFD700",
  },
  {
    id: "5",
    title: "New Update Available",
    message: "Version 2.0 is now available. Tap to update.",
    time: "1 day ago",
    read: true,
    icon: "arrow-up-circle",
    color: "#9370DB",
  },
]

// Notification Item Component
const NotificationItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={[styles.notificationItem, !item.read && styles.unreadNotification]} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={22} color="#FFFFFF" />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  )
}

// Empty State Component
const EmptyState = () => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={80} color="#CCCCCC" />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyMessage}>
        You don't have any notifications at the moment. We'll notify you when something new arrives.
      </Text>
    </View>
  )
}

const Notification = () => {
  const navigation = useNavigation()
  // State to toggle between having notifications and empty state
  // Set to true to show notifications, false to show empty state
  const [hasNotifications, setHasNotifications] = useState(true)

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    })
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      })
    }
  }, [navigation])

  const handleNotificationPress = (id) => {
    console.log(`Notification ${id} pressed`)
    // Handle notification press logic here
  }

  const toggleNotifications = () => {
    setHasNotifications(!hasNotifications)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F2F2F2" barStyle="dark-content" />

      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifications</Text>

        {/* Toggle button to switch between empty and filled states (for demo purposes) */}
        <TouchableOpacity style={styles.toggleButton} onPress={toggleNotifications}>
          <Ionicons name={hasNotifications ? "eye-off-outline" : "eye-outline"} size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Notification Content */}
      {hasNotifications ? (
        <FlatList
          data={dummyNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} onPress={() => handleNotificationPress(item.id)} />}
          contentContainerStyle={styles.notificationList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    backgroundColor: "#F2F2F2",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    flex: 1,
  },
  toggleButton: {
    padding: 5,
  },
  notificationList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: "relative",
  },
  unreadNotification: {
    backgroundColor: "#F8F9FF",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  notificationTime: {
    fontSize: 12,
    color: "#888888",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 20,
  },
  unreadDot: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4F8EF7",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    lineHeight: 24,
  },
})

export default Notification
