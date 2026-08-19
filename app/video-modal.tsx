import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function VideoModal() {
  return (
    <Modal 
      visible={true} 
      transparent 
      animationType="fade"
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.videoWrapper}>
          <FontAwesome name="video" size={64} color="#7B3E52" style={styles.icon} />
          <Text style={styles.videoText}>Video Player Placeholder</Text>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="-window-close" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 400,
    marginHorizontal: 20,
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
  videoText: {
    marginTop: 10,
    fontSize: 16,
    color: '#5a3d40',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  iconButton: {
    padding: 8,
  },
});