import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LIBRICA</Text>
      <Text style={styles.subtitle}>Cadastro não necessário em modo desenvolvimento</Text>
      <Text style={styles.instruction}>Você tem acesso direto ao aplicativo</Text>
      
      <TouchableOpacity 
        style={styles.buttonContainer}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.btnText}>Continuar para o app</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ec',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7B3E52',
    fontFamily: 'SpaceMono',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    maxWidth: 300,
  },
  buttonContainer: {
    backgroundColor: '#7B3E52',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});