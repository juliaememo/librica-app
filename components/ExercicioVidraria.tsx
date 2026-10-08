import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/src/services/firebase';
import { useAuth } from '@/components/AuthContext';
import { lerMapaProgresso, marcarEtapaConcluida, storageKeyExercicio } from '@/src/services/progresso';
import VidrariaCard from '@/components/VidrariaCard';
import {
  ENUNCIADO_VIDRARIAS,
  VIDRIAS_DATA,
  embaralhar,
  type Vidraria,
} from '@/src/data/vidrarias';

/** Índices (estáveis) das vidrarias já acertadas — cache local é por usuário. */

const TODOS_INDICES = VIDRIAS_DATA.map((_, i) => i);

interface Feedback {
  tipo: 'sucesso' | 'erro';
  texto: string;
}

export default function ExercicioVidraria() {
  const router = useRouter();
  const { user } = useAuth();
  const { titulo } = useLocalSearchParams<{ titulo: string }>();

  const [carregando, setCarregando] = useState<boolean>(true);
  // Fila de índices restantes NA ORDEM sorteada; o alvo é sempre fila[0].
  const [fila, setFila] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [etapaTravada, setEtapaTravada] = useState<boolean>(false);
  const [tudoConcluido, setTudoConcluido] = useState<boolean>(false);
  const [selecionada, setSelecionada] = useState<number | null>(null);

  const total = VIDRIAS_DATA.length;
  const alvo: Vidraria | null = fila.length > 0 ? VIDRIAS_DATA[fila[0]] : null;

  // Carrega por usuário: conta nova no mesmo aparelho começa zerada.
  // Cache local (por uid) + Firestore (fonte do perfil). Sem uid, sem cache.
  useEffect(() => {
    let montado = true;
    setCarregando(true);
    // Reseta ao trocar de conta para não vazar a sessão anterior.
    setFila([]);
    setDone([]);
    setFeedback(null);
    setEtapaTravada(false);
    setTudoConcluido(false);
    setSelecionada(null);
    (async () => {
      try {
        const uid = user?.uid ?? auth.currentUser?.uid ?? null;
        let concluidos: number[] = [];
        try {
          if (uid) {
            const salvo = await AsyncStorage.getItem(storageKeyExercicio('2', uid));
            if (salvo) {
              const lista = JSON.parse(salvo) as unknown;
              if (Array.isArray(lista)) {
                concluidos = lista.filter(
                  (n): n is number =>
                    Number.isInteger(n) && n >= 0 && n < VIDRIAS_DATA.length,
                );
              }
            }
          }
        } catch {
          // segue sem o cache local
        }
        try {
          const uidRemoto = user?.uid ?? auth.currentUser?.uid;
          if (uidRemoto) {
            const snap = await getDoc(doc(db, 'users', uidRemoto));
            if (snap.exists()) {
              const etapas = lerMapaProgresso(snap.data())['2']?.etapas ?? [];
              const validos = etapas.filter(
                (n) => Number.isInteger(n) && n >= 0 && n < VIDRIAS_DATA.length,
              );
              concluidos = Array.from(new Set([...concluidos, ...validos]));
            }
          }
        } catch {
          // Sem rede: segue só com o valor local.
        }
        if (!montado) return;
        const restantes = embaralhar(
          TODOS_INDICES.filter((i) => !concluidos.includes(i)),
        );
        setDone(concluidos);
        setFila(restantes);
        setTudoConcluido(restantes.length === 0 && concluidos.length > 0);
      } catch {
        if (!montado) return;
        setFila(embaralhar(TODOS_INDICES));
      } finally {
        if (montado) setCarregando(false);
      }
    })();
    return () => {
      montado = false;
    };
  }, [user?.uid]);

  function handleSelect(vidraria: Vidraria) {
    if (etapaTravada || tudoConcluido) return;
    const indice = VIDRIAS_DATA.findIndex((v) => v.id === vidraria.id);
    setSelecionada(indice);
    setFeedback(null);
  }

  async function persistirAcerto(indice: number, novosConcluidos: number[]) {
    try {
      const uid = user?.uid ?? auth.currentUser?.uid;
      if (uid) {
        await AsyncStorage.setItem(
          storageKeyExercicio('2', uid),
          JSON.stringify(novosConcluidos),
        );
      }
    } catch {
      // segue sem o cache local
    }
    if (user?.uid) {
      marcarEtapaConcluida(user.uid, '2', indice).catch(() => {});
    }
  }

  async function handleConcluir() {
    if (etapaTravada || tudoConcluido || !alvo) return;
    if (selecionada === null) {
      setFeedback({
        tipo: 'erro',
        texto: 'Escolha uma vidraria antes de concluir.',
      });
      return;
    }
    const indiceAlvo = VIDRIAS_DATA.findIndex((v) => v.id === alvo.id);
    const escolhida = VIDRIAS_DATA[selecionada];
    if (selecionada === indiceAlvo) {
      const novosConcluidos = [...done, indiceAlvo];
      // Grava ANTES de atualizar a tela: se sair e voltar em seguida,
      // os concluídos já estão salvos e ficam de fora do embaralhamento.
      await persistirAcerto(indiceAlvo, novosConcluidos);
      setDone(novosConcluidos);
      setEtapaTravada(true);
      const ehUltima = fila.length <= 1;
      if (ehUltima) {
        setTudoConcluido(true);
        setFeedback({
          tipo: 'sucesso',
          texto: `Parabéns! Você associou todas as ${total} vidrarias corretamente! 🎉`,
        });
      } else {
        setFeedback({
          tipo: 'sucesso',
          texto: `Isso mesmo! Essa função é do(a) ${alvo.nome}! 🎉`,
        });
      }
    } else {
      setFeedback({
        tipo: 'erro',
        texto: `Ops! ${escolhida.nome} serve para: ${escolhida.funcao} Tente outra vidraria!`,
      });
    }
  }

  function handleProxima() {
    setFila((atual) => atual.slice(1));
    setSelecionada(null);
    setFeedback(null);
    setEtapaTravada(false);
  }

  async function handleRefazer() {
    try {
      const uid = user?.uid ?? auth.currentUser?.uid;
      if (uid) {
        await AsyncStorage.setItem(storageKeyExercicio('2', uid), JSON.stringify([]));
      }
    } catch {
      // ignora
    }
    setDone([]);
    setFila(embaralhar(TODOS_INDICES));
    setSelecionada(null);
    setFeedback(null);
    setEtapaTravada(false);
    setTudoConcluido(false);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen
        options={{
          title: titulo || 'Exercício',
          headerStyle: { backgroundColor: '#fbf9f5' },
          headerTintColor: '#5a3d40',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      {carregando ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#880e4f" />
          <Text style={styles.loadingTexto}>Embaralhando as vidrarias…</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View>
            <Text style={styles.headerSubtitle}>Atividade Prática</Text>
            <Text style={styles.title}>{titulo || 'Vidraria de Laboratório'}</Text>
            <Text style={styles.moduloTag}>
              {tudoConcluido
                ? 'Concluído ✓'
                : `Vidraria ${done.length + 1} de ${total}`}
            </Text>
            <Text style={styles.enunciado}>{ENUNCIADO_VIDRARIAS}</Text>
          </View>

          {/* Cartão da função: toque na vidraria e confirme no Concluir. */}
          {!tudoConcluido && alvo && (
            <View style={styles.alvo}>
              <Text style={styles.alvoRotulo}>Qual vidraria tem esta função?</Text>
              <Text style={styles.alvoFuncao}>{alvo.funcao}</Text>
              <Text style={styles.alvoDica}>Toque na vidraria e clique em Concluir</Text>
            </View>
          )}

          {feedback && (
            <View
              style={[
                styles.feedback,
                feedback.tipo === 'sucesso'
                  ? styles.feedbackSucesso
                  : styles.feedbackErro,
              ]}
              accessibilityRole="alert"
            >
              <FontAwesome
                name={feedback.tipo === 'sucesso' ? 'trophy' : 'lightbulb-o'}
                size={18}
                color={feedback.tipo === 'sucesso' ? '#00796b' : '#b26a00'}
                style={{ marginTop: 2 }}
              />
              <Text
                style={[
                  styles.feedbackTexto,
                  feedback.tipo === 'sucesso'
                    ? styles.feedbackTextoSucesso
                    : styles.feedbackTextoErro,
                ]}
              >
                {feedback.texto}
              </Text>
            </View>
          )}

          {/* Todas as vidrarias, sempre — role para ver as outras. */}
          {!tudoConcluido && (
            <ScrollView
              style={styles.trayScroll}
              contentContainerStyle={styles.trayGrid}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.trayHint}>
                Toque p/ escolher • segure p/ ver a prévia • solte p/ fechar
              </Text>
              <View style={styles.grid}>
                {VIDRIAS_DATA.map((vidraria, index) => (
                  <View key={vidraria.id} style={styles.gridItem}>
                    <VidrariaCard
                      vidraria={vidraria}
                      selecionado={
                        selecionada !== null &&
                        VIDRIAS_DATA[selecionada].id === vidraria.id
                      }
                      onSelect={handleSelect}
                      lado={index % 3 === 0 ? 'direita' : 'esquerda'}
                      abreParaBaixo={index < 3}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={() => router.back()}
            >
              <FontAwesome name="arrow-left" size={16} color="#7B3E52" style={styles.iconLeft} />
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>

            {tudoConcluido ? (
              <TouchableOpacity
                style={[styles.button, styles.finishButton]}
                onPress={() => router.replace('/(tabs)')}
              >
                <Text style={styles.finishButtonText}>Concluir</Text>
                <FontAwesome name="check" size={16} color="#fff" style={styles.iconRight} />
              </TouchableOpacity>
            ) : etapaTravada ? (
              <TouchableOpacity
                style={[styles.button, styles.finishButton]}
                onPress={handleProxima}
              >
                <Text style={styles.finishButtonText}>Próxima</Text>
                <FontAwesome name="arrow-right" size={16} color="#fff" style={styles.iconRight} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.finishButton]}
                onPress={handleConcluir}
              >
                <Text style={styles.finishButtonText}>Concluir</Text>
                <FontAwesome name="check" size={16} color="#fff" style={styles.iconRight} />
              </TouchableOpacity>
            )}
          </View>

          {tudoConcluido && (
            <TouchableOpacity style={styles.refazerBtn} onPress={handleRefazer}>
              <Text style={styles.refazerTexto}>Refazer exercício</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f5',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8c7b7d',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8c7b7d',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5a3d40',
    marginBottom: 4,
  },
  moduloTag: {
    fontSize: 13,
    fontWeight: '600',
    color: '#880e4f',
    marginBottom: 8,
  },
  enunciado: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5a3d40',
  },
  alvo: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e6c687',
    borderStyle: 'dashed',
    padding: 14,
    gap: 6,
    alignItems: 'center',
  },
  alvoDestacado: {
    borderStyle: 'solid',
    borderColor: '#00796b',
    backgroundColor: '#e0f2f1',
  },  alvoRotulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8c7b7d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  alvoFuncao: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5a3d40',
    textAlign: 'center',
    lineHeight: 22,
  },
  alvoDica: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7B3E52',
  },
  feedback: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    alignItems: 'flex-start',
  },
  feedbackSucesso: {
    backgroundColor: '#e0f2f1',
    borderColor: '#00796b',
  },
  feedbackErro: {
    backgroundColor: '#fff8e1',
    borderColor: '#e6a817',
  },
  feedbackTexto: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  feedbackTextoSucesso: {
    color: '#00594f',
    fontWeight: '600',
  },
  feedbackTextoErro: {
    color: '#6d4c00',
    fontWeight: '600',
  },
  trayScroll: {
    flex: 1,
  },
  trayGrid: {
    paddingBottom: 8,
  },
  trayHint: {
    fontSize: 12,
    color: '#7B3E52',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  gridItem: {
    width: '31.5%',
  },
  footerContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  backButton: {
    backgroundColor: '#fff',
    borderColor: '#7B3E52',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B3E52',
  },
  finishButton: {
    backgroundColor: '#00796b',
    borderColor: '#00796b',
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  refazerBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  refazerTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8c7b7d',
    textDecorationLine: 'underline',
  },
});
