import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '@/components/Themed';
import SinalCard from '@/components/SinalCard';
import { sinaisData, type Sinal } from '@/src/data/sinais';

export default function DicionarioScreen() {
  const router = useRouter();

  const handleTapSinal = (sinal: Sinal) => {
    // Toque curto: mantém o fluxo atual.
    router.push({
      pathname: '/modulo-detalhe',
      params: { titulo: sinal.titulo }
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
          <Text style={styles.headerHint}>Segure um sinal p/ ver a prévia • solte p/ fechar</Text>
        </View>

        <View style={styles.gridContainer}>
          {sinaisData.map((sinal, index) => (
            <SinalCard
              key={sinal.id}
              sinal={sinal}
              lado={index % 2 === 0 ? 'direita' : 'esquerda'}
              abreParaBaixo={index < 4}
              onTap={handleTapSinal}
            />
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
  headerHint: {
    fontSize: 12,
    color: '#7B3E52',
    fontWeight: '600',
    marginTop: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
});
