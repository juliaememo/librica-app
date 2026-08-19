import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModuloExercicioScreen() {
  const router = useRouter();
  const { titulo } = useLocalSearchParams<{ titulo: string }>();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View>
          <Text style={styles.headerSubtitle}>Atividade Prática</Text>
          <Text style={styles.title}>{titulo || 'Exercício'}</Text>
          
          <View style={styles.exerciseBox}>
            <Text style={styles.exerciseText}>Aqui ficam as perguntas e alternativas da atividade...</Text>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.backButton]} 
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={16} color="#7B3E52" style={styles.iconLeft} />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.finishButton]} 
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.finishButtonText}>Concluir</Text>
            <FontAwesome name="check" size={16} color="#fff" style={styles.iconRight} />
          </TouchableOpacity>
        </View>
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
  exerciseBox: { 
    width: '100%', 
    height: 220, 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    borderWidth: 1.5, 
    borderColor: '#dcd6ce', 
    padding: 16, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  exerciseText: { 
    color: '#5a3d40', 
    textAlign: 'center' 
  },
  footerContainer: { 
    flexDirection: 'row', 
    gap: 12 
  },
  button: { 
    flex: 1, 
    height: 52, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1.5 
  },
  backButton: { 
    backgroundColor: '#fff', 
    borderColor: '#7B3E52' 
  },
  backButtonText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#7B3E52' 
  },
  finishButton: { 
    backgroundColor: '#00796b', 
    borderColor: '#00796b' 
  },
  finishButtonText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  iconLeft: { 
    marginRight: 8 
  },
  iconRight: { 
    marginLeft: 8 
  },
});