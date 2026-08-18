import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LIBRICA</Text>
      <Text style={styles.subtitle}>Bem-vindo ao aplicativo de química em LIBRAS</Text>
      <Text style={styles.instruction}>Acesse as funcionalidades pelo menu inferior</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ec',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7B3E52',
    fontFamily: 'SpaceMono',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginVertical: 20,
    fontFamily: 'SpaceMono',
  },
  instruction: {
    fontSize: 14,
    color: '#888',
  },
});