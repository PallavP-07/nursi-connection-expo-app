import { useContext, useEffect } from "react";
import {Stack, router } from "expo-router";
 import { AuthContext, AuthProvider } from "../context/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthHandler />
    </AuthProvider>
  );
};

function AuthHandler() {
     const { authToken, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!authToken) {
      router.replace("/(auth)/sign-in");
    }
  }, [authToken]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}