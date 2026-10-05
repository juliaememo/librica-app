import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
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
import { lerMapaProgresso, marcarEtapaConcluida } from '@/src/services/progresso';
import CenaDesenho from '@/components/CenaDesenho';
import MetodoCard from '@/components/MetodoCard';
import { embaralhar } from '@/src/utils/embaralhar';
import {
  getMetodoById,
  mesmoConjunto,
  type EtapaSeparacao,
  type MetodoId,
  type MetodoSeparacao,
} from '@/src/data/separacao-heterogenea';

interface ExercicioSeparacaoProps {
  moduloId: string;
  storageKey: string;
  enunciado: string;
  metodos: MetodoSeparacao[];
  etapas: EtapaSeparacao[];
  textoFinal: string;
  /** Rótulo do contador (ex.: "Mistura"). */
  rotuloContador: string;
  corTag: string;
}

interface Feedback {
  tipo: 'sucesso' | 'erro';
  texto: string;
}

interface EspacoRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Exercício genérico de separação de misturas: cada tela mostra uma cena
 * com um espaço faltando; o usuário toca ou arrasta o método correto.
 * Serve para o módulo 6 (heterogêneas) e o 7 (homogêneas).
 */
export default function ExercicioSeparacao({
  moduloId,
  storageKey,
  enunciado,
  metodos,
  etapas,
  textoFinal,
  rotuloContador,
  corTag,
}: ExercicioSeparacaoProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { titulo } = useLocalSearchParams<{ titulo: string }>();

  const [carregando, setCarregando] = useState<boolean>(true);
  // Fila de índices restantes NA ORDEM sorteada; a da vez é sempre fila[0].
  const [fila, setFila] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [preenchidos, setPreenchidos] = useState<Record<string, MetodoId | null>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [etapaTravada, setEtapaTravada] = useState<boolean>(false);
  const [tudoConcluido, setTudoConcluido] = useState<boolean>(false);
  const [hoverSlot, setHoverSlot] = useState<string | null>(null);
  // Ordem dos métodos embaralhada a cada início (as telas seguem a ordem do plano).
  const [ordemMetodos, setOrdemMetodos] = useState<MetodoSeparacao[]>(() =>
    embaralhar(metodos),
  );

  const slotRefs = useRef<Record<string, View | null>>({});
  const slotRectsRef = useRef<Record<string, EspacoRect>>({});

  const total = etapas.length;
  const atualIdx = fila.length > 0 ? fila[0] : total - 1;
  const etapa = etapas[atualIdx];

  const TODOS = etapas.map((_, i) => i);

  /** Lê o salvo aceitando o formato novo (lista) e o antigo (contagem). */
  function interpretarSalvos(salvo: string | null): number[] {
    const valido = (n: unknown): n is number =>
      Number.isInteger(n) && (n as number) >= 0 && (n as number) < total;
    if (!salvo) return [];
    try {
      const parsed: unknown = JSON.parse(salvo);
      if (Array.isArray(parsed)) return parsed.filter(valido);
      // Formato antigo: contagem das primeiras telas (ordem era fixa).
      if (valido(parsed)) {
        return TODOS.slice(0, Math.min(parsed as number, total));
      }
    } catch {
      // cai no plano B abaixo
    }
    const n = Number.parseInt(salvo, 10);
    if (Number.isInteger(n) && n >= 0) {
      return TODOS.slice(0, Math.min(n, total));
    }
    return [];
  }

  // Começo (telas embaralhadas) ou retomada das que faltam (também
  // embaralhadas). Só as restantes entram na fila.
  useEffect(() => {
    let montado = true;
    setCarregando(true);
    (async () => {
      try {
        let concluidos = interpretarSalvos(
          await AsyncStorage.getItem(storageKey),
        );
        try {
          const uid = auth.currentUser?.uid;
          if (uid) {
            const snap = await getDoc(doc(db, 'users', uid));
            if (snap.exists()) {
              const lista = lerMapaProgresso(snap.data())[moduloId]?.etapas ?? [];
              const validos = lista.filter(
                (n) => Number.isInteger(n) && n >= 0 && n < total,
              );
              concluidos = Array.from(new Set([...concluidos, ...validos]));
            }
          }
        } catch {
          // Sem rede: segue só com o valor local.
        }
        if (!montado) return;
        const restantes = embaralhar(
          TODOS.filter((i) => !concluidos.includes(i)),
        );
        setDone(concluidos);
        setFila(restantes);
        setTudoConcluido(restantes.length === 0 && concluidos.length > 0);
      } catch {
        if (!montado) return;
        setFila(embaralhar(TODOS));
      } finally {
        if (montado) setCarregando(false);
      }
    })();
    return () => {
      montado = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const medirEspacos = useCallback(() => {
    setTimeout(() => {
      try {
        Object.entries(slotRefs.current).forEach(([id, ref]) => {
          ref?.measureInWindow((x, y, w, h) => {
            if (typeof x === 'number' && typeof y === 'number') {
              slotRectsRef.current[id] = { x, y, w, h };
            }
          });
        });
      } catch {
        // ignora
      }
    }, 60);
  }, []);

  // Remede se o layout deslocar os espaços.
  useEffect(() => {
    if (carregando) return;
    medirEspacos();
  }, [carregando, feedback, fila, tudoConcluido, medirEspacos]);

  const slotEm = useCallback((px: number, py: number): string | null => {
    const margem = 14;
    for (const [id, r] of Object.entries(slotRectsRef.current)) {
      if (
        px >= r.x - margem &&
        px <= r.x + r.w + margem &&
        py >= r.y - margem &&
        py <= r.y + r.h + margem
      ) {
        return id;
      }
    }
    return null;
  }, []);

  const handleArrastando = useCallback(
    (arrastando: boolean, x: number, y: number) => {
      setHoverSlot(arrastando ? slotEm(x, y) : null);
    },
    [slotEm],
  );

  async function persistirAcerto(indice: number, novosConcluidos: number[]) {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(novosConcluidos));
    } catch {
      // segue sem o cache local
    }
    if (user?.uid) {
      marcarEtapaConcluida(user.uid, moduloId, indice).catch(() => {});
    }
  }

  function handleDrop(metodo: MetodoSeparacao, x: number, y: number) {
    if (etapaTravada || tudoConcluido) return;
    setHoverSlot(null);
    // Espaço sob o dedo ou, se soltou fora, o primeiro espaço vazio.
    const alvo =
      slotEm(x, y) ?? etapa.slots.find((s) => !preenchidos[s.id])?.id ?? null;
    if (!alvo) return;
    setPreenchidos((atual) => ({ ...atual, [alvo]: metodo.id }));
    setFeedback(null);
  }

  function handleLimpar(slotId: string) {
    if (etapaTravada) return;
    setPreenchidos((atual) => ({ ...atual, [slotId]: null }));
    setFeedback(null);
  }

  async function handleConcluir() {
    if (etapaTravada || tudoConcluido) return;
    const faltando = etapa.slots.some((s) => !preenchidos[s.id]);
    if (faltando) {
      setFeedback({
        tipo: 'erro',
        texto: 'Preencha todos os espaços antes de concluir: toque ou arraste.',
      });
      return;
    }
    const dados = etapa.slots.map((s) => preenchidos[s.id]) as MetodoId[];
    if (!mesmoConjunto(dados, etapa.esperados)) {
      setFeedback({ tipo: 'erro', texto: `Ops, ainda não está certo. ${etapa.dica}` });
      return;
    }
    const ehUltima = fila.length <= 1;
    const novosConcluidos = [...done, atualIdx];
    // Grava ANTES de atualizar a tela: se sair e voltar em seguida,
    // a retomada já encontra a etapa salva.
    await persistirAcerto(atualIdx, novosConcluidos);
    setDone(novosConcluidos);
    setEtapaTravada(true);
    if (ehUltima) {
      setTudoConcluido(true);
      setFeedback({ tipo: 'sucesso', texto: textoFinal });
    } else {
      const nomes = etapa.esperados
        .map((id) => getMetodoById(metodos, id).nome)
        .join(' e ');
      setFeedback({
        tipo: 'sucesso',
        texto: `Isso mesmo! É ${nomes}! 🎉 Vamos para a próxima.`,
      });
    }
  }

  function limparEtapa() {
    setPreenchidos({});
    setFeedback(null);
    setEtapaTravada(false);
    setHoverSlot(null);
    medirEspacos();
  }

  function handleProxima() {
    setFila((atual) => atual.slice(1));
    limparEtapa();
  }

  async function handleRefazer() {
    // Só zera o estado local p/ treinar de novo — o Firestore (perfil)
    // mantém as etapas já concluídas, sem retirar o progresso.
    // Reembaralha telas e métodos ao recomeçar.
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify([]));
    } catch {
      // ignora
    }
    setDone([]);
    setFila(embaralhar(TODOS));
    limparEtapa();
    setTudoConcluido(false);
    // Novo embaralhamento dos métodos ao recomeçar.
    setOrdemMetodos(embaralhar(metodos));
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
          <ActivityIndicator size="large" color={corTag} />
          <Text style={styles.loadingTexto}>Preparando as misturas…</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <ScrollView
            style={styles.rolagem}
            contentContainerStyle={styles.rolagemConteudo}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Text style={styles.headerSubtitle}>Atividade Prática</Text>
              <Text style={styles.title}>{titulo || 'Separação de misturas'}</Text>
              <Text style={[styles.moduloTag, { color: corTag }]}>
                {tudoConcluido ? 'Concluído ✓' : `${rotuloContador} ${done.length + 1} de ${total}`}
              </Text>
              <Text style={styles.enunciado}>{enunciado}</Text>
            </View>

            {/* Cena da mistura. */}
            <View style={styles.cena}>
              <CenaDesenho cena={etapa.cena} />
              <Text style={styles.cenaDescricao}>{etapa.descricao}</Text>
            </View>

            {/* Espaços do(s) método(s) (zonas de drop). */}
            <View style={styles.espacos}>
              {etapa.slots.map((slot) => {
                const valor = preenchidos[slot.id] ?? null;
                const metodo = valor ? getMetodoById(metodos, valor) : null;
                const hover = hoverSlot === slot.id;
                return (
                  <View
                    key={slot.id}
                    ref={(ref) => {
                      slotRefs.current[slot.id] = ref;
                    }}
                    collapsable={false}
                    onLayout={medirEspacos}
                    style={[styles.espaco, hover && styles.espacoDestacado]}
                  >
                    <Text style={styles.espacoRotulo}>{slot.rotulo}</Text>
                    {metodo ? (
                      <View style={[styles.espacoCheio, { borderColor: metodo.corTema, backgroundColor: metodo.corFundo }]}>
                        <Text style={[styles.espacoTexto, { color: metodo.corTema }]}>
                          {metodo.nome}
                        </Text>
                        {!etapaTravada && (
                          <Pressable
                            onPress={() => handleLimpar(slot.id)}
                            hitSlop={8}
                            style={styles.espacoLimpar}
                            accessibilityRole="button"
                            accessibilityLabel={`Retirar ${metodo.nome}`}
                          >
                            <FontAwesome name="times" size={14} color="#7B3E52" />
                          </Pressable>
                        )}
                      </View>
                    ) : (
                      <Text style={styles.espacoVazio}>Toque ou arraste o método para cá</Text>
                    )}
                  </View>
                );
              })}
            </View>

            {feedback && (
              <View
                style={[
                  styles.feedback,
                  feedback.tipo === 'sucesso' ? styles.feedbackSucesso : styles.feedbackErro,
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
                    feedback.tipo === 'sucesso' ? styles.feedbackTextoSucesso : styles.feedbackTextoErro,
                  ]}
                >
                  {feedback.texto}
                </Text>
              </View>
            )}

            {/* Métodos (todos, sempre). */}
            {!tudoConcluido && (
              <View style={styles.trayFixo}>
                <Text style={styles.trayHint}>
                  Toque p/ escolher • segure p/ ver o vídeo • arraste p/ o espaço
                </Text>
                <View style={styles.grid}>
                  {ordemMetodos.map((metodo, index) => (
                    <View key={metodo.id} style={styles.gridItem}>
                      <MetodoCard
                        metodo={metodo}
                        onDrop={handleDrop}
                        onArrastando={handleArrastando}
                        onPrimeiroToque={medirEspacos}
                        lado={index % 2 === 0 ? 'direita' : 'esquerda'}
                        abreParaBaixo={false}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

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
  },
  rolagem: {
    flex: 1,
  },
  rolagemConteudo: {
    gap: 10,
    paddingBottom: 12,
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
    marginBottom: 8,
  },
  enunciado: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5a3d40',
  },
  cena: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e6c687',
    padding: 8,
    alignItems: 'center',
  },
  cenaDescricao: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5a3d40',
    textAlign: 'center',
    marginTop: 4,
  },
  espacos: {
    gap: 8,
  },
  espaco: {
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#c9bebb',
    backgroundColor: '#fff',
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  espacoDestacado: {
    borderStyle: 'solid',
    borderColor: '#00796b',
    backgroundColor: '#e0f2f1',
  },
  espacoRotulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8c7b7d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  espacoVazio: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8c7b7d',
    textAlign: 'center',
  },
  espacoCheio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 6,
  },
  espacoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  espacoLimpar: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  trayFixo: {
    paddingBottom: 4,
    gap: 8,
  },
  trayHint: {
    fontSize: 12,
    color: '#7B3E52',
    fontWeight: '600',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  gridItem: {
    width: '48.5%',
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
    marginTop: 8,
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
