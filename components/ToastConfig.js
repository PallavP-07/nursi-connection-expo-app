// src/components/ToastConfig.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ToastBase = ({ icon, bgColor, text1 }) => (
  <View style={[styles.container, { backgroundColor: bgColor }]}>
    <Ionicons name={icon} size={22} color="#fff" />
    <Text style={styles.text}>{text1}</Text>
  </View>
);

export default {
  success: ({ text1 }) => <ToastBase icon="checkmark-circle" bgColor="#22c55e" text1={text1} />,
  error: ({ text1 }) => <ToastBase icon="close-circle" bgColor="#ef4444" text1={text1} />,
  info: ({ text1 }) => <ToastBase icon="information-circle" bgColor="#3b82f6" text1={text1} />,
  warning: ({ text1 }) => <ToastBase icon="warning" bgColor="#f59e0b" text1={text1} />,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    elevation: 3,

  },
  text: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },
});
