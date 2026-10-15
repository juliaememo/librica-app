import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '@/components/Themed';
import SinalCard from '@/components/SinalCard';
import {
  CATEGORIAS_SINAIS,
  CATEGORIA_TODOS,
  sinaisData,
} from '@/src/data/sinais';

export default function DicionarioScreen() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>(CATEGORIA_TODOS);

  const sinaisFiltrados =
    categoriaAtiva === CATEGORIA_TODOS
      ? sinaisData
      : sinaisData.filter((sinal) => sinal.categorias.includes(categoriaAtiva));

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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtroLinha}
        >
          {CATEGORIAS_SINAIS.map((categoria) => {
            const ativa = categoria === categoriaAtiva;
            return (
              <TouchableOpacity
                key={categoria}
                style={[styles.chip, ativa && styles.chipAtivo]}
                onPress={() => setCategoriaAtiva(categoria)}
                accessibilityRole="button"
                accessibilityLabel={`Filtrar por ${categoria}`}
                accessibilityState={{ selected: ativa }}
              >
                <Text style={[styles.chipTexto, ativa && styles.chipTextoAtivo]}>
                  {categoria}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {sinaisFiltrados.length === 0 ? (
          <View style={styles.vazioBox}>
            <Text style={styles.vazioTexto}>Nenhum sinal nesta categoria.</Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {sinaisFiltrados.map((sinal, index) => (
              <SinalCard
                key={sinal.id}
                sinal={sinal}
                lado={index % 2 === 0 ? 'direita' : 'esquerda'}
                abreParaBaixo={index < 2}
              />
            ))}
          </View>
        )}
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
    marginBottom: 12,
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
  filtroLinha: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
    paddingRight: 16,
  },
  chip: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#7B3E52',
    backgroundColor: '#fff',
  },
  chipAtivo: {
    backgroundColor: '#7B3E52',
    borderColor: '#7B3E52',
  },
  chipTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7B3E52',
  },
  chipTextoAtivo: {
    color: '#fff',
  },
  vazioBox: {
    marginTop: 24,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#dcd6ce',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  vazioTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8c7b7d',
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginTop: 8,
  },
});
