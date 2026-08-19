import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'; // Importação correta
import YoutubeIframe from 'react-native-youtube-iframe';

export default function ModuloVideoScreen() {
  const router = useRouter();
  const { id, titulo, videoId } = useLocalSearchParams<{ id: string, titulo: string, videoId: string }>();

  // Se o videoId não vier dos parâmetros, usa um padrão de segurança
  const safeVideoId = videoId || 'dQw4w9WgXcQ';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <Text style={styles.headerSubtitle}>Vídeo Explicativo</Text>
          <Text style={styles.title}>{titulo || 'Módulo'}</Text>
          
          <View style={styles.videoWrapper}>
            <YoutubeIframe height={220} videoId={safeVideoId} />
          </View>

          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={() => router.push({ 
              pathname: '/exercicio', 
              params: { id, titulo } 
            })}
          >
            <Text style={styles.nextButtonText}>Ir para Exercício</Text>
            <FontAwesome name="arrow-right" size={16} color="#fff" style={styles.iconRight} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fbf9f5' 
  },
  scroll: {
    flexGrow: 1,
    padding: 20,
  },
  content: { 
    flex: 1, 
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
  videoWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#e6c687',
    marginBottom: 30,
    backgroundColor: '#000',
  },
  nextButton: {
    backgroundColor: '#00796b',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#00796b',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconRight: {
    marginLeft: 8,
  },
});