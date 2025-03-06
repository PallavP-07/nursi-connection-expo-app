import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Profile" }} />
      <Stack.Screen name="privacy-policy" options={{ title: "Privacy Policy" }} />
      <Stack.Screen name="contact-us" options={{ title: "Contact Us" }} />
      <Stack.Screen name="profile-details" options={{ title: "My Profile" }} />
      <Stack.Screen name="change-password" options={{ title: "Change Password" }} />
    </Stack>
  );
}
