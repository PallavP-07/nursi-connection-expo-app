import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { router } from "expo-router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        setAuthToken(token);
        setLoading(false);
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/sign-in");
      }
    };
    loadToken();
  }, []);

  const generateToken = async (token) => {
    await AsyncStorage.setItem("auth_token", token);
    setAuthToken(token);
    router.replace("/(tabs)/home");
  };

  const removeToken = async () => {
    await AsyncStorage.removeItem("auth_token");
    setAuthToken(null);
    router.replace("/(auth)/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{ removeToken, generateToken, authToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};




//========= here is the prod level secure store Auto code===========//

// import { createContext, useEffect, useState } from "react";
// import { router } from "expo-router";
// import * as SecureStore from "expo-secure-store";

// // Create Authentication Context
// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authToken, setAuthToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load token when the app starts
//   useEffect(() => {
//     const loadToken = async () => {
//       try {
//         const token = await SecureStore.getItemAsync("auth_token");
//         if (token) {
//           setAuthToken(token);
//           router.replace("/(tabs)/home");
//         } else {
//           router.replace("/(auth)/sign-in");
//         }
//       } catch (error) {
//         console.error("Error loading token:", error);
//       } finally {
//         setLoading(false); // Ensure loading is set to false in all cases
//       }
//     };

//     loadToken();
//   }, []);

//   // Function to store token securely
//   const generateToken = async (token) => {
//     try {
//       await SecureStore.setItemAsync("auth_token", token);
//       setAuthToken(token);
//       router.replace("/(tabs)/home");
//     } catch (error) {
//       console.error("Error saving token:", error);
//     }
//   };

//   // Function to remove stored token
//   const removeToken = async () => {
//     try {
//       await SecureStore.deleteItemAsync("auth_token");
//       setAuthToken(null);
//       router.replace("/(auth)/sign-in");
//     } catch (error) {
//       console.error("Error deleting token:", error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ authToken, loading, generateToken, removeToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
