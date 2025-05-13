import { useContext, useEffect } from "react";
import { Slot, router } from "expo-router";
import { AuthContext, AuthProvider, useAuth } from "../context/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { authToken, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && !authToken) {
      // Only redirect if we've finished loading and there's no auth token
      router.replace("/(auth)/sign-in");
    } else if (!loading && authToken) {
      // If user is authenticated, ensure they're in the tabs
      router.replace("/(tabs)");
    }
  }, [authToken, loading]);

  // The critical change: Always render the Slot component
  return <Slot />;
}