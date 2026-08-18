import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';

const modulosData = [
  {
    id: '1',
    titulo: 'Átomos e Moléculas',
    descricao: 'Entenda qual a base de todo o nosso universo e como a matéria é constituída!',
    icone: 'atom',
    corTema: '#00796b',
    corFundo: '#e0f2f1',
  },
  {
    id: '2',
    titulo: 'Vidraria de Laboratório',
    descricao: 'Aprenda o nome de todas as principais vidrarias usadas por cientistas em laboratórios!',
    icone: 'flask',
    corTema: '#880e4f',
    corFundo: '#fce4ec',
  },
  {
    id: '3',
    titulo: 'Substâncias',
    descricao: 'Descubra como classificar diferentes tipos de substâncias: simples e compostas!',
    icone: 'cube',
    corTema: '#f57f17',
    corFundo: '#fffde7',
  },
  {
    id: '4',
    titulo: 'Misturas',
    descricao: 'Explore o conceito de misturas e seus diferentes tipos: homogênea e heterogênea!',
    icone: 'tint',
    corTema: '#512da8',
    corFundo: '#ede7f6',
  },
  {
    id: '5',
    titulo: 'Comportamento em gráfico',
    descricao: 'Compreenda como substâncias e misturas se comportam em gráficos de aquecimento e resfriamento!',
    icone: 'chart-line',
    corTema: '#0277bd',
    corFundo: '#e1f5fe',
  },
  {
    id: '6',
    titulo: 'Separação de misturas heterogêneas',
    descricao: 'Estude como separar misturas com mais de uma fase!',
    icone: 'filter',
    corTema: '#d84315',
    corFundo: '#fbe9e7',
  },
  {
    id: '7',
    titulo: 'Separação de misturas homogêneas',
    descricao: 'Analise como separar misturas com apenas uma fase!',
    icone: 'balance-scale',
    corTema: '#2e7d32',
    corFundo: '#e8f5e9',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.brandContainer}>
        <Text style={styles.brandTitle}>LIBRICA</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>APRENDENDO QUÍMICA EM LIBRAS</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Módulos</Text>
        <Text style={styles.sectionCounter}>7 Temas</Text>
      </View>

      {modulosData.map((modulo) => (
        <TouchableOpacity 
          key={modulo.id} 
          style={[styles.card, { borderColor: modulo.corTema, backgroundColor: modulo.corFundo }]}
          onPress={() => router.push({
            pathname: '/modulo-detalhe', 
            params: { id: modulo.id, titulo: modulo.titulo }
          })}
        >
          <View style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Text style={[styles.cardTitle, { color: modulo.corTema }]}>
                {modulo.titulo}
              </Text>
              <Text style={styles.cardDescription}>
                {modulo.descricao}
              </Text>
              
              <View style={[styles.tagBadge, { backgroundColor: '#fff', borderColor: modulo.corTema }]}>
                <FontAwesome name="sign-language" size={12} color={modulo.corTema} style={{ marginRight: 6 }} />
                <Text style={[styles.tagBadgeText, { color: modulo.corTema }]}>Vídeo & Atividade</Text>
              </View>
            </View>

            <View style={[styles.iconBox, { borderColor: modulo.corTema, backgroundColor: '#fff' }]}>
              <FontAwesome5 name={modulo.icone as any} size={40} color={modulo.corTema} />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f5',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 60, // Margem de segurança adequada para a câmera/notch do celular
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  brandTitle: {
    fontSize: 56,
    fontWeight: 'normal',
    color: '#7B3E52',
    fontFamily: 'Gabarito-Black',
    letterSpacing: 0,
  },
  badgeContainer: {
    backgroundColor: '#e6c687',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5a3d40',
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5a3d40',
  },
  sectionCounter: {
    fontSize: 18,
    color: '#8c7b7d',
    fontWeight: '600',
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
    backgroundColor: 'transparent',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 18,
    marginBottom: 10,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});