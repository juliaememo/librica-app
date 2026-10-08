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
import { lerMapaProgresso, marcarEtapaConcluida, storageKeyExercicio } from '@/src/services/progresso';
import GraficoCurva from '@/components/GraficoCurva';
import GraficoSinalCard from '@/components/GraficoSinalCard';
import {
  ENUNCIADO_GRAFICOS,
  ETAPAS_GRAFICOS,
  SINAIS_GRAFICOS,
  TEXTO_FINAL_GRAFICOS,
  getSinalGraficoById,
  validarGrafico,
  type SinalGrafico,
  type SinalGraficoId,
} from '@/src/data/graficos';

/** Quantos gráficos do módulo 5 já foram concluídos (0 a 4) — cache por usuário. */

interface Feedback {
  tipo: 'sucesso' | 'erro';
  texto: string;
}

interface SlotRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function ExercicioGraficos() {
  const router = useRouter();
  const { user } = useAuth();
  const { titulo } = useLocalSearchParams<{ titulo: string }>();

  const [carregando, setCarregando] = useState<boolean>(true);
  const [etapaIndex, setEtapaIndex] = useState<number>(0);
  const [preenchidos, setPreenchidos] = useState<Record<string, SinalGraficoId | null>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [etapaTravada, setEtapaTravada] = useState<boolean>(false);
  const [tudoConcluido, setTudoConcluido] = useState<boolean>(false);
  const [hoverSlot, setHoverSlot] = useState<string | null>(null);
  const [rolagemTravada, setRolagemTravada] = useState<boolean>(false);

  const slotRefs = useRef<Record<string, View | null>>({});
  const slotRectsRef = useRef<Record<string, SlotRect>>({});

  const etapa =
    ETAPAS_GRAFICOS[Math.min(etapaIndex, ETAPAS_GRAFICOS.length - 1)];
  const total = ETAPAS_GRAFICOS.length;

  const sinaisEstados = SINAIS_GRAFICOS.slice(0, 3);
  const sinaisTipos = SINAIS_GRAFICOS.slice(3);

  // Retoma de onde parou (cache por usuário + Firestore). Conta nova começa zerada.
  useEffect(() => {
    let montado = true;
    setCarregando(true);
    setPreenchidos({});
    setFeedback(null);
    setEtapaTravada(false);
    setTudoConcluido(false);
    (async () => {
      try {
        const uid = user?.uid ?? auth.currentUser?.uid ?? null;
        const salvo = uid ? await AsyncStorage.getItem(storageKeyExercicio('5', uid)) : null;
        let concluidas = salvo === '4' ? 4 : salvo === '3' ? 3 : salvo === '2' ? 2 : salvo === '1' ? 1 : 0;
        try {
          if (uid) {
            const snap = await getDoc(doc(db, 'users', uid));
            if (snap.exists()) {
              const etapas = lerMapaProgresso(snap.data())['5']?.etapas ?? [];
              const validos = new Set(
                etapas.filter((n) => Number.isInteger(n) && n >= 0 && n < total),
              );
              concluidas = Math.max(concluidas, Math.min(validos.size, total));
            }
          }
        } catch {
          // Sem rede: segue só com o valor local.
        }
        if (!montado) return;
        if (concluidas >= total) {
          setTudoConcluido(true);
          setEtapaIndex(total - 1);
        } else {
          setEtapaIndex(concluidas);
        }
      } catch {
        if (!montado) return;
        setEtapaIndex(0);
      } finally {
        if (montado) setCarregando(false);
      }
    })();
    return () => {
      montado = false;
    };
  }, [total, user?.uid]);

  const medirSlots = useCallback(() => {
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
    medirSlots();
  }, [carregando, feedback, etapaIndex, tudoConcluido, medirSlots]);

  const slotEm = useCallback((px: number, py: number): string | null => {
    const margem = 10;
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

  function handleDrop(sinal: SinalGrafico, x: number, y: number) {
    if (etapaTravada || tudoConcluido) return;
    setHoverSlot(null);
    const slotId = slotEm(x, y);
    if (!slotId) return;
    setPreenchidos((atual) => ({ ...atual, [slotId]: sinal.id }));
    setFeedback(null);
  }

  function handleArrastando(arrastando: boolean, x: number, y: number) {
    setRolagemTravada(arrastando);
    setHoverSlot(arrastando ? slotEm(x, y) : null);
  }

  function handleLimpar(slotId: string) {
    if (etapaTravada) return;
    setPreenchidos((atual) => ({ ...atual, [slotId]: null }));
    setFeedback(null);
  }

  async function persistirAcerto(indice: number, concluidas: number) {
    try {
      const uid = user?.uid ?? auth.currentUser?.uid;
      if (uid) {
        await AsyncStorage.setItem(storageKeyExercicio('5', uid), String(concluidas));
      }
    } catch {
      // segue sem o cache local
    }
    if (user?.uid) {
      marcarEtapaConcluida(user.uid, '5', indice).catch(() => {});
    }
  }

  async function handleConcluir() {
    if (etapaTravada || tudoConcluido) return;
    const resultado = validarGrafico(preenchidos, etapa);
    if (!resultado.ok) {
      setFeedback({ tipo: 'erro', texto: `Ops, ainda não está certo. ${resultado.dica ?? ''}` });
      return;
    }
    const ehUltima = etapaIndex >= total - 1;
    const concluidas = etapaIndex + 1;
    // Grava ANTES de atualizar a tela: se sair e voltar em seguida,
    // a retomada já encontra a etapa salva.
    await persistirAcerto(etapaIndex, concluidas);
    setEtapaTravada(true);
    if (ehUltima) {
      setTudoConcluido(true);
      setFeedback({ tipo: 'sucesso', texto: TEXTO_FINAL_GRAFICOS });
    } else {
      setFeedback({
        tipo: 'sucesso',
        texto: 'Parabéns! Gráfico correto! 🎉 Vamos para o próximo.',
      });
    }
  }

  function limparEtapa() {
    setPreenchidos({});
    setFeedback(null);
    setEtapaTravada(false);
    setHoverSlot(null);
    medirSlots();
  }

  function handleProxima() {
    setEtapaIndex((i) => Math.min(i + 1, total - 1));
    limparEtapa();
  }

  async function handleRefazer() {
    // Só zera o estado local p/ treinar de novo — o Firestore (perfil)
    // mantém as etapas já concluídas, sem retirar o progresso.
    try {
      const uid = user?.uid ?? auth.currentUser?.uid;
      if (uid) {
        await AsyncStorage.setItem(storageKeyExercicio('5', uid), '0');
      }
    } catch {
      // ignora
    }
    setEtapaIndex(0);
    limparEtapa();
    setTudoConcluido(false);
  }

  function renderSlot(slotId: string, rotulo: string, destaqueTipo: boolean) {
    const valor = preenchidos[slotId] ?? null;
    const sinal = valor ? getSinalGraficoById(valor) : null;
    const hover = hoverSlot === slotId;
    return (
      <View style={styles.slotLinha} key={slotId}>
        <Text style={[styles.slotRotulo, destaqueTipo && styles.slotRotuloTipo]}>
          {rotulo}
        </Text>
        <View
          ref={(ref) => {
            slotRefs.current[slotId] = ref;
          }}
          collapsable={false}
          onLayout={medirSlots}
          style={[
            styles.slot,
            hover && styles.slotHover,
            destaqueTipo && styles.slotTipo,
          ]}
        >
          {sinal ? (
            <View style={[styles.slotCheio, { borderColor: sinal.corTema, backgroundColor: sinal.corFundo }]}>
              <Text style={[styles.slotTexto, { color: sinal.corTema }]} numberOfLines={1}>
                {sinal.nome}
              </Text>
              {!etapaTravada && (
                <Pressable
                  onPress={() => handleLimpar(slotId)}
                  hitSlop={8}
                  style={styles.slotLimpar}
                  accessibilityRole="button"
                  accessibilityLabel={`Retirar ${sinal.nome} do espaço ${rotulo}`}
                >
                  <FontAwesome name="times" size={13} color="#7B3E52" />
                </Pressable>
              )}
            </View>
          ) : (
            <Text style={styles.slotVazio}>Arraste para cá</Text>
          )}
        </View>
      </View>
    );
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
          <ActivityIndicator size="large" color="#0277bd" />
          <Text style={styles.loadingTexto}>Preparando os gráficos…</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <ScrollView
            style={styles.rolagem}
            contentContainerStyle={styles.rolagemConteudo}
            scrollEnabled={!rolagemTravada}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Text style={styles.headerSubtitle}>Atividade Prática</Text>
              <Text style={styles.title}>{titulo || 'Comportamento em gráfico'}</Text>
              <Text style={styles.moduloTag}>
                {tudoConcluido ? 'Concluído ✓' : `${etapa.titulo} de ${total}`}
              </Text>
              <Text style={styles.enunciado}>{ENUNCIADO_GRAFICOS}</Text>
            </View>

            <GraficoCurva curva={etapa.curva} />

            {/* Espaços do gráfico (zonas de drop). */}
            <View style={styles.slots}>
              {etapa.slots.map((slot) =>
                renderSlot(slot.id, slot.rotulo, slot.id === 'tipo'),
              )}
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

            {/* Sinais arrastáveis (todos, sempre). */}
            {!tudoConcluido && (
              <View style={styles.trayFixo}>
                <Text style={styles.trayHint}>
                  Segure p/ ver o vídeo • solte p/ fechar • arraste p/ o espaço
                </Text>
                <Text style={styles.trayGrupo}>Estados físicos</Text>
                <View style={styles.grid}>
                  {sinaisEstados.map((sinal, index) => (
                    <View key={sinal.id} style={styles.gridItem3}>
                      <GraficoSinalCard
                        sinal={sinal}
                        onDrop={handleDrop}
                        onArrastando={handleArrastando}
                        onPrimeiroToque={medirSlots}
                        lado={index === 0 ? 'direita' : 'esquerda'}
                      />
                    </View>
                  ))}
                </View>
                <Text style={styles.trayGrupo}>Tipos de gráfico</Text>
                <View style={styles.grid}>
                  {sinaisTipos.map((sinal, index) => (
                    <View key={sinal.id} style={styles.gridItem2}>
                      <GraficoSinalCard
                        sinal={sinal}
                        onDrop={handleDrop}
                        onArrastando={handleArrastando}
                        onPrimeiroToque={medirSlots}
                        lado={index % 2 === 0 ? 'direita' : 'esquerda'}
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
                <Text style={styles.finishButtonText}>Próximo</Text>
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
    color: '#0277bd',
    marginBottom: 8,
  },
  enunciado: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5a3d40',
  },
  slots: {
    gap: 8,
  },
  slotLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  slotRotulo: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#5a3d40',
  },
  slotRotuloTipo: {
    fontWeight: 'bold',
    color: '#7B3E52',
  },
  slot: {
    width: 140,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#c9bebb',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  slotHover: {
    borderStyle: 'solid',
    borderColor: '#00796b',
    backgroundColor: '#e0f2f1',
  },
  slotTipo: {
    borderColor: '#e6c687',
  },
  slotVazio: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8c7b7d',
    textAlign: 'center',
  },
  slotCheio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderRadius: 9,
    paddingVertical: 5,
    paddingLeft: 8,
    paddingRight: 4,
    maxWidth: '100%',
  },
  slotTexto: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
  },
  slotLimpar: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
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
  trayGrupo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5a3d40',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  gridItem3: {
    width: '31.5%',
  },
  gridItem2: {
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
