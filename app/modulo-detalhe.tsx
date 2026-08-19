import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Modal, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ModuloVideoScreen() {
  const router = useRouter();
  const { id, titulo } = useLocalSearchParams();
  const [videoUrl, setVideoUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(!modalVisible);

  const handleWatchVideo = (url: string) => {
    Alert.alert('URL do vídeo', `URL: ${url}\n(Em um aplicativo completo, este vídeo seria reproduzido aqui)`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.scroll}>
        <View style={styles.content}>
          <Text style={styles.headerSubtitle}>Vídeo Explicativo</Text>
          <Text style={styles.title}>{titulo || 'Módulo'}</Text>
          
          <View style={styles.videoInputContainer}>
            <TextInput
              style={styles.videoInput}
              placeholder="Digite a URL do vídeo"
              value={videoUrl}
              onChangeText={setVideoUrl}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.playButton} onPress={toggleModal}>
              <FontAwesome name="play-circle" size={24} color="#7B3E52" />
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.videoSection}>
            <Text style={styles.sectionTitle}>Vídeos Relacionados</Text>
            {[
              'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            ].map((url, index) => (
              <View key={index} style={styles.videoItem}>
                <TouchableOpacity style={styles.videoTrigger} onPress={() => handleWatchVideo(url)}>
                  <FontAwesome name="play-circle" size={20} color="#7B3E52" />
                  <Text style={styles.videoTriggerText}>Assistir</Text>
                </TouchableOpacity>
              </View>
            ))}
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
    justifyContent: 'flex-start',
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
  videoInputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e6c687',
    marginBottom: 20,
  },
  videoInput: {
    width: '100%',
    height: 50,
    fontSize: 16,
    color: '#5a3d40',
  },
  playButton: {
    position: 'absolute',
    right: 20,
    top: 50,
  },
  playButtonText: {
    color: '#7B3E52',
    fontSize: 14,
    marginLeft: 8,
  },
  videoSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#5a3d40',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  videoTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6c687',
  },
  videoTriggerText: {
    color: '#5a3d40',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
});