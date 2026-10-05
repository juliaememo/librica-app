import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'; // Importação correta
import YoutubeIframe from 'react-native-youtube-iframe';
import SinalCard from '@/components/SinalCard';
import { getSinaisDoModulo } from '@/src/data/sinais';
import { useAuth } from '@/components/AuthContext';
import { marcarVideoVisto } from '@/src/services/progresso';

export default function ModuloVideoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id, titulo, videoId, semExercicio } = useLocalSearchParams<{ id: string, titulo: string, videoId: string, semExercicio?: string }>();

  // Se o videoId não vier dos parâmetros, usa um padrão de segurança
  const safeVideoId = videoId || 'dQw4w9WgXcQ';

  // Módulo secreto: página só de vídeo, sem botão de exercício.
  const soVideo = semExercicio === '1';

  // Sinais relacionados a este módulo (mesmos vídeos do Dicionário).
  const sinaisRelacionados = getSinaisDoModulo(id);

  // Parte 1 do progresso (50%): vídeo assistido até o fim.
  // O módulo secreto não conta progresso.
  const videoRegistradoRef = useRef<boolean>(false);
  function handleVideoStateChange(estado: string) {
    if (estado !== 'ended') return;
    if (!id || id === '8' || !user?.uid || videoRegistradoRef.current) return;
    videoRegistradoRef.current = true;
    marcarVideoVisto(user.uid, id).catch(() => {
      // Falha de rede: tenta de novo se o vídeo for revisto.
      videoRegistradoRef.current = false;
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Troca o "modulo-detalhe" da faixa superior pelo nome do módulo. */}
      <Stack.Screen
        options={{
          title: titulo || 'Módulo',
          headerStyle: { backgroundColor: '#fbf9f5' },
          headerTintColor: '#5a3d40',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <Text style={styles.headerSubtitle}>Vídeo Explicativo</Text>
          <Text style={styles.title}>{titulo || 'Módulo'}</Text>
          
          <View style={styles.videoWrapper}>
            <YoutubeIframe
              height={220}
              videoId={safeVideoId}
              onChangeState={handleVideoStateChange}
            />
          </View>

          {!soVideo && (
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
          )}

          <View style={styles.sinaisSection}>
            <Text style={styles.sinaisTitle}>Sinais deste módulo em Libras</Text>
            <Text style={styles.sinaisHint}>Segure um sinal p/ ver a prévia • solte p/ fechar</Text>
            <View style={styles.sinaisGrid}>
              {sinaisRelacionados.map((sinal, index) => (
                <SinalCard
                  key={sinal.id}
                  sinal={sinal}
                  lado={index % 2 === 0 ? 'direita' : 'esquerda'}
                  abreParaBaixo={false}
                />
              ))}
            </View>
          </View>
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
  sinaisSection: {
    marginTop: 28,
  },
  sinaisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5a3d40',
    marginBottom: 4,
  },
  sinaisHint: {
    fontSize: 12,
    color: '#7B3E52',
    fontWeight: '600',
    marginBottom: 12,
  },
  sinaisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});