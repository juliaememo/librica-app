import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '@/components/Themed';

const sinaisData = [
  { id: '1', titulo: 'Átomo', icone: 'atom', corTema: '#00796b', corFundo: '#e0f2f1' },
  { id: '2', titulo: 'Vidraria', icone: 'flask', corTema: '#880e4f', corFundo: '#fce4ec' },
  { id: '3', titulo: 'Substância', icone: 'cube', corTema: '#f57f17', corFundo: '#fffde7' },
  { id: '4', titulo: 'Mistura', icone: 'tint', corTema: '#512da8', corFundo: '#ede7f6' },
  { id: '5', titulo: 'Gráfico', icone: 'chart-line', corTema: '#0277bd', corFundo: '#e1f5fe' },
  { id: '6', titulo: 'Separação', icone: 'filter', corTema: '#d84315', corFundo: '#fbe9e7' },
  { id: '7', titulo: 'Balança', icone: 'balance-scale', corTema: '#2e7d32', corFundo: '#e8f5e9' },
  { id: '8', titulo: 'Molécula', icone: 'project-diagram', corTema: '#7B3E52', corFundo: '#f5e6ea' },
];

export default function DicionarioScreen() {
  const router = useRouter();

  const handlePressSinal = (titulo: string) => {
    // Direciona para a tela interna do app (sem envolver YouTube)
    router.push({
      pathname: '/modulo-detalhe', 
      params: { titulo }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Dicionário de Sinais</Text>
          <Text style={styles.headerSubtitle}>Consulte os termos em Libras da química</Text>
        </View>

        <View style={styles.gridContainer}>
          {sinaisData.map((sinal) => (
            <TouchableOpacity 
              key={sinal.id} 
              style={[styles.card, { borderColor: sinal.corTema, backgroundColor: sinal.corFundo }]}
              onPress={() => handlePressSinal(sinal.titulo)}
            >
              <View style={[styles.iconBox, { backgroundColor: '#fff', borderColor: sinal.corTema }]}>
                <FontAwesome5 name={sinal.icone as any} size={36} color={sinal.corTema} />
              </View>
              <Text style={[styles.cardTitle, { color: sinal.corTema }]} numberOfLines={1}>
                {sinal.titulo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  headerContainer: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5a3d40',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8c7b7d',
    marginTop: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});