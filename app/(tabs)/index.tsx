import React, { useCallback, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/components/AuthContext';
import { db } from '@/src/services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { calcularProgressoModulos, calcularProgressoTotal } from '@/src/services/progresso';
import {
  DESCRICAO_MODULO_SECRETO,
  TITULO_MODULO_SECRETO,
  VIDEO_ID_MODULO_SECRETO,
} from '@/src/data/modulo-secreto';

const modulosData = [
  {
    id: '1',
    titulo: 'Átomos e Moléculas',
    descricao: 'Entenda qual a base de todo o nosso universo e como a matéria é constituída!',
    icone: 'atom',
    corTema: '#00796b',
    corFundo: '#e0f2f1',
    videoId: 'FSyAehMdpyI',
  },
  {
    id: '2',
    titulo: 'Vidraria de Laboratório',
    descricao: 'Aprenda o nome de todas as principais vidrarias usadas por cientistas em laboratórios!',
    icone: 'flask',
    corTema: '#880e4f',
    corFundo: '#fce4ec',
    videoId: 'WorXRPZqjeI',
  },
  {
    id: '3',
    titulo: 'Substâncias',
    descricao: 'Descubra como classificar diferentes tipos de substâncias: simples e compostas!',
    icone: 'cube',
    corTema: '#f57f17',
    corFundo: '#fffde7',
    videoId: 'hbwKwNhIFM4',
  },
  {
    id: '4',
    titulo: 'Misturas',
    descricao: 'Explore o conceito de misturas e seus diferentes tipos: homogênea e heterogênea!',
    icone: 'tint',
    corTema: '#512da8',
    corFundo: '#ede7f6',
    videoId: 'iWQfTI0_fFc',
  },
  {
    id: '5',
    titulo: 'Comportamento em gráfico',
    descricao: 'Compreenda como substâncias e misturas se comportam em gráficos de aquecimento e resfriamento!',
    icone: 'chart-line',
    corTema: '#0277bd',
    corFundo: '#e1f5fe',
    videoId: 'KcMkKfcc7_M',
  },
  {
    id: '6',
    titulo: 'Separação de misturas heterogêneas',
    descricao: 'Estude como separar misturas com mais de uma fase!',
    icone: 'filter',
    corTema: '#d84315',
    corFundo: '#fbe9e7',
    videoId: '3__FIWo28QM',
  },
  {
    id: '7',
    titulo: 'Separação de misturas homogêneas',
    descricao: 'Analise como separar misturas com apenas uma fase!',
    icone: 'balance-scale',
    corTema: '#2e7d32',
    corFundo: '#e8f5e9',
    videoId: 'oCI-07oGg_s',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Módulo secreto: só aparece com 100% de progresso total.
  // A senha vem do Firestore (config/geral), nunca do código.
  const [progressoTotal, setProgressoTotal] = useState<number>(0);
  const [senhaRemota, setSenhaRemota] = useState<string | null>(null);
  const [senhaVisivel, setSenhaVisivel] = useState<boolean>(false);
  const [senha, setSenha] = useState<string>('');
  const [senhaErro, setSenhaErro] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          if (!user?.uid) return;
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            const modulos = calcularProgressoModulos(snap.data());
            setProgressoTotal(calcularProgressoTotal(modulos));
          }
          try {
            const configSnap = await getDoc(doc(db, 'config', 'geral'));
            if (configSnap.exists()) {
              const valor = (configSnap.data() as Record<string, unknown>)['senhaModuloSecreto'];
              setSenhaRemota(typeof valor === 'string' ? valor : null);
            }
          } catch {
            // Sem acesso ao config: a senha será pedida com aviso de conexão.
          }
        } catch {
          // mantém o valor atual
        }
      })();
    }, [user?.uid]),
  );

  const secretoLiberado = progressoTotal >= 100;

  function abrirSecreto() {
    setSenha('');
    setSenhaErro(null);
    setSenhaVisivel(true);
  }

  function confirmarSenha() {
    if (!senhaRemota) {
      setSenhaErro('Sem conexão para validar. Tente novamente online.');
      return;
    }
    if (senha === senhaRemota) {
      setSenhaVisivel(false);
      setSenha('');
      setSenhaErro(null);
      router.push({
        pathname: '/modulo-detalhe',
        params: {
          id: '8',
          titulo: TITULO_MODULO_SECRETO,
          videoId: VIDEO_ID_MODULO_SECRETO,
          semExercicio: '1',
        },
      });
    } else {
      setSenhaErro('Senha incorreta. Tente novamente.');
    }
  }

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
            params: { id: modulo.id, titulo: modulo.titulo, videoId: modulo.videoId }
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

      {secretoLiberado && (
        <TouchableOpacity
          style={[styles.card, styles.secretoCard]}
          onPress={abrirSecreto}
          accessibilityRole="button"
          accessibilityLabel="Módulo Secreto, bloqueado por senha"
        >
          <View style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Text style={[styles.cardTitle, { color: '#4a2c00' }]}>
                {TITULO_MODULO_SECRETO}
              </Text>
              <Text style={styles.cardDescription}>
                {DESCRICAO_MODULO_SECRETO}
              </Text>

              <View style={[styles.tagBadge, { backgroundColor: '#fff', borderColor: '#4a2c00' }]}>
                <FontAwesome name="lock" size={12} color="#4a2c00" style={{ marginRight: 6 }} />
                <Text style={[styles.tagBadgeText, { color: '#4a2c00' }]}>Só com senha</Text>
              </View>
            </View>

            <View style={[styles.iconBox, { borderColor: '#4a2c00', backgroundColor: '#fff' }]}>
              <FontAwesome name="gift" size={40} color="#4a2c00" />
            </View>
          </View>
        </TouchableOpacity>
      )}

      <Modal
        visible={senhaVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setSenhaVisivel(false)}
      >
        <View style={styles.senhaFundo}>
          <View style={styles.senhaBox}>
            <FontAwesome name="lock" size={28} color="#4a2c00" />
            <Text style={styles.senhaTitulo}>{TITULO_MODULO_SECRETO}</Text>
            <Text style={styles.senhaSubtitulo}>Digite a senha para entrar</Text>
            <TextInput
              style={[styles.senhaInput, senhaErro && styles.senhaInputErro]}
              value={senha}
              onChangeText={(texto) => {
                setSenha(texto);
                setSenhaErro(null);
              }}
              placeholder="Senha"
              placeholderTextColor="#a89a91"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={confirmarSenha}
            />
            {senhaErro && <Text style={styles.senhaErroTexto}>{senhaErro}</Text>}
            <View style={styles.senhaBotoes}>
              <TouchableOpacity
                style={[styles.senhaBotao, styles.senhaCancelar]}
                onPress={() => setSenhaVisivel(false)}
              >
                <Text style={styles.senhaCancelarTexto}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.senhaBotao, styles.senhaConfirmar]}
                onPress={confirmarSenha}
              >
                <Text style={styles.senhaConfirmarTexto}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 60,
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
  secretoCard: {
    borderColor: '#4a2c00',
    backgroundColor: '#ffe9b8',
  },
  senhaFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  senhaBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#e6c687',
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  senhaTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5a3d40',
  },
  senhaSubtitulo: {
    fontSize: 14,
    color: '#8c7b7d',
    marginBottom: 4,
  },
  senhaInput: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#dcd6ce',
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#5a3d40',
    backgroundColor: '#fbf9f5',
  },
  senhaInputErro: {
    borderColor: '#b00020',
  },
  senhaErroTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#b00020',
  },
  senhaBotoes: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  senhaBotao: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  senhaCancelar: {
    backgroundColor: '#fff',
    borderColor: '#7B3E52',
  },
  senhaCancelarTexto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7B3E52',
  },
  senhaConfirmar: {
    backgroundColor: '#4a2c00',
    borderColor: '#4a2c00',
  },
  senhaConfirmarTexto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
});