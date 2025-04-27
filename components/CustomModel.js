import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";

const { height } = Dimensions.get("window");

const CustomModel = ({ setModalVisible, content }) => {
  // Animation for modal slide up
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, []);

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={closeModal}>
      <View style={styles.modalContainer}>
        {Platform.OS === "ios" ? (
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={styles.backdrop} />
        )}
        
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <Animated.View 
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.dragIndicator} />
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            {content}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomModel;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  modalHeader: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    position: "relative",
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#e2e8f0",
    borderRadius: 2.5,
    marginBottom: 8,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 12,
    padding: 4,
  },
});

// Log the component to show it's been created
console.log("CustomModel component updated with improved animations and UI");