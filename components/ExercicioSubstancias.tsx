import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { lerMapaProgresso, marcarEtapaConcluida } from '@/src/services/progresso';
import SegurarParaVer from '@/components/SegurarParaVer';
import { embaralhar } from '@/src/utils/embaralhar';
import {
  ENUNCIADO_SUBSTANCIAS,
  ROTULO_TIPO,
  SUBSTANCIAS_DATA,
  type Substancia,
  type TipoSubstancia,
} from '@/src/data/substancias';

/** Índices (estáveis) das substâncias já acertadas. */
const STORAGE_ETAPAS_MODULO_3 = 'librica:exercicio:3:etapasConcluidas';

const TODOS_INDICES = SUBSTANCIAS_DATA.map((_, i) => i);
const OPCOES: TipoSubstancia[] = ['simples', 'composta'];

interface Feedback {
  tipo: 'sucesso' | 'erro';
  texto: string;
}

export default function ExercicioSubstancias() {
  const router = useRouter();
  const { user } = useAuth();
  const { titulo } = useLocalSearchParams<{ titulo: string }>();

  const [carregando, setCarregando] = useState<boolean>(true);
  // Fila de índices restantes NA ORDEM sorteada; a da vez é sempre fila[0].
  const [fila, setFila] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [etapaTravada, setEtapaTravada] = useState<boolean>(false);
  const [tudoConcluido, setTudoConcluido] = useState<boolean>(false);
  const [selecionado, setSelecionado] = useState<TipoSubstancia | null>(null);

  const total = SUBSTANCIAS_DATA.length;
  const atual: Substancia | null = fila.length > 0 ? SUBSTANCIAS_DATA[fila[0]] : null;

  // Carrega UMA única vez por montagem: união do cache local + Firestore.
  // Só as restantes entram na fila (embaralhadas); as acertadas ficam de fora.
  useEffect(() => {
    let montado = true;
    setCarregando(true);
    (async () => {
      try {
        let concluidos: number[] = [];
        try {
          const salvo = await AsyncStorage.getItem(STORAGE_ETAPAS_MODULO_3);
          if (salvo) {
            const lista = JSON.parse(salvo) as unknown;
            if (Array.isArray(lista)) {
              concluidos = lista.filter(
                (n): n is number =>
                  Number.isInteger(n) && n >= 0 && n < SUBSTANCIAS_DATA.length,
              );
            }
          }
        } catch {
          // segue sem o cache local
        }
        try {
          const uid = auth.currentUser?.uid;
          if (uid) {
            const snap = await getDoc(doc(db, 'users', uid));
            if (snap.exists()) {
              const etapas = lerMapaProgresso(snap.data())['3']?.etapas ?? [];
              const validos = etapas.filter(
                (n) => Number.isInteger(n) && n >= 0 && n < SUBSTANCIAS_DATA.length,
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
  }, []);

  async function persistirAcerto(indice: number, novosConcluidos: number[]) {
    try {
      await AsyncStorage.setItem(
        STORAGE_ETAPAS_MODULO_3,
        JSON.stringify(novosConcluidos),
      );
    } catch {
      // segue sem o cache local
    }
    if (user?.uid) {
      marcarEtapaConcluida(user.uid, '3', indice).catch(() => {});
    }
  }

  function handleSelect(tipo: TipoSubstancia) {
    if (etapaTravada || tudoConcluido) return;
    setSelecionado(tipo);
    setFeedback(null);
  }

  async function handleConcluir() {
    if (etapaTravada || tudoConcluido || !atual) return;
    if (selecionado === null) {
      setFeedback({
        tipo: 'erro',
        texto: 'Escolha Simples ou Composta antes de concluir.',
      });
      return;
    }
    const indiceAtual = SUBSTANCIAS_DATA.findIndex((s) => s.id === atual.id);
    if (selecionado === atual.tipo) {
      const novosConcluidos = [...done, indiceAtual];
      // Grava ANTES de atualizar a tela: se sair e voltar em seguida,
      // os acertados já estão salvos e ficam de fora do embaralhamento.
      await persistirAcerto(indiceAtual, novosConcluidos);
      setDone(novosConcluidos);
      setEtapaTravada(true);
      const ehUltima = fila.length <= 1;
      if (ehUltima) {
        setTudoConcluido(true);
        setFeedback({
          tipo: 'sucesso',
          texto: `Parabéns! Você classificou todas as ${total} substâncias corretamente! 🎉`,
        });
      } else {
        setFeedback({
          tipo: 'sucesso',
          texto: `Isso mesmo! ${atual.nome} (${atual.formula}) é uma substância ${ROTULO_TIPO[atual.tipo].toLowerCase()}! 🎉`,
        });
      }
    } else {
      setFeedback({
        tipo: 'erro',
        texto: `Ops! ${atual.nome} (${atual.formula}) é uma substância ${ROTULO_TIPO[atual.tipo].toLowerCase()}. Tente de novo!`,
      });
    }
  }

  function handleProxima() {
    setFila((atualFila) => atualFila.slice(1));
    setSelecionado(null);
    setFeedback(null);
    setEtapaTravada(false);
  }

  async function handleRefazer() {
    // Só zera o estado local p/ treinar de novo — o Firestore (perfil)
    // mantém as etapas já concluídas, sem retirar o progresso.
    try {
      await AsyncStorage.setItem(STORAGE_ETAPAS_MODULO_3, JSON.stringify([]));
    } catch {
      // ignora
    }
    setDone([]);
    setFila(embaralhar(TODOS_INDICES));
    setSelecionado(null);
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
          <ActivityIndicator size="large" color="#f57f17" />
          <Text style={styles.loadingTexto}>Embaralhando as substâncias…</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View>
            <Text style={styles.headerSubtitle}>Atividade Prática</Text>
            <Text style={styles.title}>{titulo || 'Substâncias'}</Text>
            <Text style={styles.moduloTag}>
              {tudoConcluido
                ? 'Concluído ✓'
                : `Substância ${done.length + 1} de ${total}`}
            </Text>
            <Text style={styles.enunciado}>{ENUNCIADO_SUBSTANCIAS}</Text>
          </View>

          {/* Cartão da substância (segurar mostra o vídeo do sinal). */}
          {!tudoConcluido && atual && (
            <SegurarParaVer
              titulo={atual.nome}
              corTema={atual.corTema}
              lado="direita"
              abreParaBaixo
              style={[styles.substancia, { borderColor: atual.corTema, backgroundColor: atual.corFundo }]}
              accessibilityLabel={`Substância ${atual.nome}, ${atual.formula}`}
            >
              <View style={styles.substanciaInner}>
                <Text style={[styles.formula, { color: atual.corTema }]}>
                  {atual.formula}
                </Text>
                <Text style={[styles.nome, { color: atual.corTema }]}>
                  {atual.nome}
                </Text>
                <Text style={styles.substanciaDica}>Segure p/ ver o sinal</Text>
              </View>
            </SegurarParaVer>
          )}

          {/* Botões Simples / Composta (segurar mostra o vídeo do sinal). */}
          {!tudoConcluido && (
            <View>
              <Text style={styles.opcoesRotulo}>Essa substância é:</Text>
              <View style={styles.opcoes}>
                {OPCOES.map((tipo) => {
                  const ativo = selecionado === tipo;
                  return (
                    <SegurarParaVer
                      key={tipo}
                      titulo={ROTULO_TIPO[tipo]}
                      corTema={tipo === 'simples' ? '#00796b' : '#d84315'}
                      lado={tipo === 'simples' ? 'direita' : 'esquerda'}
                      abreParaBaixo={false}
                      onTap={() => handleSelect(tipo)}
                      style={[
                        styles.opcao,
                        ativo ? styles.opcaoSelecionada : styles.opcaoNormal,
                        ativo && {
                          borderColor: tipo === 'simples' ? '#00796b' : '#d84315',
                        },
                      ]}
                      accessibilityLabel={`${ROTULO_TIPO[tipo]}${ativo ? ', selecionado' : ''}`}
                    >
                      <View style={styles.opcaoInner}>
                        {ativo && (
                          <FontAwesome
                            name="check-circle"
                            size={22}
                            color={tipo === 'simples' ? '#00796b' : '#d84315'}
                          />
                        )}
                        <Text
                          style={[
                            styles.opcaoTexto,
                            { color: tipo === 'simples' ? '#00796b' : '#d84315' },
                          ]}
                        >
                          {ROTULO_TIPO[tipo]}
                        </Text>
                        <Text style={styles.opcaoDica}>Segure p/ ver o sinal</Text>
                      </View>
                    </SegurarParaVer>
                  );
                })}
              </View>
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
    justifyContent: 'space-between',
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
    color: '#f57f17',
    marginBottom: 8,
  },
  enunciado: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5a3d40',
  },
  substancia: {
    borderWidth: 1.5,
    borderRadius: 16,
    minHeight: 170,
  },
  substanciaInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    padding: 16,
  },
  formula: {
    fontSize: 52,
    fontWeight: 'bold',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  substanciaDica: {
    fontSize: 12,
    color: '#7B3E52',
    fontWeight: '600',
  },
  opcoesRotulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5a3d40',
    marginBottom: 8,
    textAlign: 'center',
  },
  opcoes: {
    flexDirection: 'row',
    gap: 12,
  },
  opcao: {
    flex: 1,
    minHeight: 96,
    borderRadius: 14,
    backgroundColor: '#fff',
  },
  opcaoNormal: {
    borderWidth: 1.5,
    borderColor: '#dcd6ce',
  },
  opcaoSelecionada: {
    borderWidth: 2.5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  opcaoInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    padding: 12,
  },
  opcaoTexto: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  opcaoDica: {
    fontSize: 11,
    color: '#8c7b7d',
    fontWeight: '600',
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
