import { Redirect, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import Feather from "@expo/vector-icons/Feather";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function TabLayout() {
  const { authToken, loading } = useContext(AuthContext);

  if (!authToken) {
    return <Redirect href="/sign-in" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4DA6FF",
        tabBarStyle: { backgroundColor: "#ffff", paddingTop: 10, height: 65 },
        headerShown: false, // Hide header for all tabs
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="leaves-details"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="check-circle" size={24} color={color} />
          ),
          tabBarLabel: "Leave",
        }}
      />

      <Tabs.Screen
        name="trade-shift"
        options={{
          tabBarIcon: ({ color }) => (
            <Octicons name="arrow-switch" size={24} color={color} />
          ),
          tabBarLabel: "Trade Shift",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Octicons name="person" size={24} color={color} />
          ),
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}
