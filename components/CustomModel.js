import React from "react";
import {
  View,
  
  StyleSheet,
  TouchableOpacity,
 
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";


const CustomModel = ({ setModalVisible,content }) => {
  return ( 
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          {content}
        </View>
      </View>
  );
};
export default CustomModel;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
});