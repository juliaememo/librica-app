import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';
import SinalCard from '@/components/SinalCard';
import { esconderPreviewSinal } from '@/src/services/sinalPreviewStore';
import {
  CATEGORIAS_SINAIS,
  CATEGORIA_TODOS,
  buscarSinais,
  sinaisData,
} from '@/src/data/sinais';

export default function DicionarioScreen() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>(CATEGORIA_TODOS);
  const [busca, setBusca] = useState('');

  // Ao sair da aba, fecha a prévia: o overlay vive na raiz do app e, sem
  // isso, continuaria aparecendo por cima das outras telas.
  useFocusEffect(
    useCallback(() => {
      return () => esconderPreviewSinal();
    }, []),
  );

  // Mudar a busca/categoria reordena a grade: fecha a prévia para ela não
  // ficar ancorada na posição antiga do card.
  useEffect(() => {
    esconderPreviewSinal();
  }, [busca, categoriaAtiva]);

  const sinaisFiltrados = useMemo(() => {
    const termo = busca.trim();
    if (!termo) {
      return categoriaAtiva === CATEGORIA_TODOS
        ? sinaisData
        : sinaisData.filter((sinal) => sinal.categorias.includes(categoriaAtiva));
    }
    return buscarSinais(termo).filter(
      (sinal) =>
        categoriaAtiva === CATEGORIA_TODOS || sinal.categorias.includes(categoriaAtiva),
    );
  }, [busca, categoriaAtiva]);

  const buscando = busca.trim().length > 0;

  // Busca sempre no dicionário inteiro: se havia uma categoria selecionada,
  // volta para "Todos" ao digitar (senão o termo poderia não aparecer).
  const handleBusca = (texto: string) => {
    setBusca(texto);
    if (texto.trim() && categoriaAtiva !== CATEGORIA_TODOS) {
      setCategoriaAtiva(CATEGORIA_TODOS);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Dicionário de Sinais</Text>
          <Text style={styles.headerSubtitle}>Consulte os termos em Libras da química</Text>

          <View style={styles.buscaBox}>
            <FontAwesome name="search" size={18} color="#8c7b7d" />
            <TextInput
              style={styles.buscaInput}
              value={busca}
              onChangeText={handleBusca}
              placeholder="Buscar sinal (ex.: ar, água, átomo)"
              placeholderTextColor="#8c7b7d"
              selectionColor="#7B3E52"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              accessibilityLabel="Buscar sinal no dicionário"
            />
            {buscando && (
              <TouchableOpacity
                onPress={() => setBusca('')}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Limpar busca"
              >
                <FontAwesome name="times-circle" size={18} color="#8c7b7d" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.headerHint}>
            {buscando
              ? `${sinaisFiltrados.length} ${
                  sinaisFiltrados.length === 1 ? 'sinal encontrado' : 'sinais encontrados'
                }`
              : 'Toque em um sinal p/ ver a prévia • toque de novo p/ fechar'}
          </Text>
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
            <Text style={styles.vazioTexto}>
              {buscando
                ? `Nenhum sinal encontrado para "${busca.trim()}".`
                : 'Nenhum sinal nesta categoria.'}
            </Text>
            {buscando && (
              <TouchableOpacity
                style={styles.vazioBotao}
                onPress={() => setBusca('')}
                accessibilityRole="button"
                accessibilityLabel="Limpar busca"
              >
                <Text style={styles.vazioBotaoTexto}>Limpar busca</Text>
              </TouchableOpacity>
            )}
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
  buscaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#dcd6ce',
    backgroundColor: '#fff',
  },
  buscaInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#5a3d40',
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
  vazioBotao: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#7B3E52',
  },
  vazioBotaoTexto: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginTop: 8,
  },
});
