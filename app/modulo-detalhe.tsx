import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModuloVideoScreen() {
  const router = useRouter();
  const { id, titulo } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View>
          <Text style={styles.headerSubtitle}>Vídeo Explicativo</Text>
          <Text style={styles.title}>{titulo || 'Módulo'}</Text>
          
          <View style={styles.videoPlayerPlaceholder}>
            <FontAwesome name="play-circle" size={64} color="#7B3E52" />
            <Text style={styles.videoPlaceholderText}>Vídeo em LIBRAS rodando aqui...</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => router.push({
            pathname: '/exercicio',
            params: { id, titulo }
          })}
        >
          <Text style={styles.primaryButtonText}>Avançar para o Exercício</Text>
          <FontAwesome name="arrow-right" size={16} color="#fff" style={styles.iconRight} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fbf9f5' 
  },
  content: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'space-between' 
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: '#8c7b7d', 
    fontWeight: '600', 
    textTransform: 'uppercase', 
    marginBottom: 4 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#5a3d40', 
    marginBottom: 20 
  },
  videoPlayerPlaceholder: { 
    width: '100%', 
    height: 220, 
    backgroundColor: '#e6c68733', 
    borderRadius: 16, 
    borderWidth: 1.5, 
    borderColor: '#e6c687', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  videoPlaceholderText: { 
    marginTop: 10, 
    color: '#5a3d40', 
    fontWeight: '600' 
  },
  primaryButton: { 
    backgroundColor: '#7B3E52', 
    height: 52, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  primaryButtonText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  iconRight: { 
    marginLeft: 8 
  },
});