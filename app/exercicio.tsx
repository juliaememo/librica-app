import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { useAuth } from '@/components/AuthContext';
import { lerMapaProgresso, marcarEtapaConcluida } from '@/src/services/progresso';
import BeckerView from '@/components/BeckerView';
import AtomoCard from '@/components/AtomoCard';
import ExercicioVidraria from '@/components/ExercicioVidraria';
import ExercicioSubstancias from '@/components/ExercicioSubstancias';
import ExercicioMisturas from '@/components/ExercicioMisturas';
import ExercicioGraficos from '@/components/ExercicioGraficos';
import ExercicioSeparacao from '@/components/ExercicioSeparacao';
import {
  ENUNCIADO_SEPARACAO_HET,
  ETAPAS_SEPARACAO_HET,
  METODOS_HETEROGENEAS,
  TEXTO_FINAL_SEPARACAO_HET,
} from '@/src/data/separacao-heterogenea';
import {
  ENUNCIADO_SEPARACAO_HOM,
  ETAPAS_SEPARACAO_HOM,
  METODOS_HOMOGENEAS,
  TEXTO_FINAL_SEPARACAO_HOM,
} from '@/src/data/separacao-homogenea';
import {
  ATOMOS_EXERCICIO,
  ENUNCIADO_ATOMOS_MOLECULAS,
  ETAPAS_ATOMOS_MOLECULAS,
  composicaoCorreta,
  gerarDica,
  type AtomoDisponivel,
  type AtomoId,
} from '@/src/data/exercicios';

/** Quantas etapas do módulo 1 já foram concluídas (0, 1 ou 2). */
const STORAGE_ETAPAS_MODULO_1 = 'librica:exercicio:1:etapasConcluidas';

interface Feedback {
  tipo: 'sucesso' | 'erro';
  texto: string;
}

const textosPorModulo: Record<string, string> = {
  '1': 'Atividade 1 — Átomos e Moléculas: identifique prótons, nêutrons e elétrons e monte moléculas simples.',
  '2': 'Atividade 2 — Vidraria de Laboratório: relacione cada vidraria (béquer, erlenmeyer, proveta…) ao seu uso.',
  '3': 'Atividade 3 — Substâncias: classifique os exemplos em substâncias simples ou compostas.',
  '4': 'Atividade 4 — Misturas: diga se cada mistura é homogênea ou heterogênea e quantas fases ela tem.',
  '5': 'Atividade 5 — Comportamento em gráfico: leia curvas de aquecimento e encontre os patamares de fusão e ebulição.',
  '6': 'Atividade 6 — Separação de misturas heterogêneas: escolha o método certo (filtração, decantação, catação…).',
  '7': 'Atividade 7 — Separação de misturas homogêneas: escolha o método certo (destilação simples, fracionada…).',
};

interface BeckerRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function ModuloExercicioScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id, titulo } = useLocalSearchParams<{ id: string; titulo: string }>();

  // Só o módulo 1 tem o exercício interativo por enquanto.
  const isModuloAtomos = id === '1';

  const [carregando, setCarregando] = useState<boolean>(isModuloAtomos);
  const [etapaIndex, setEtapaIndex] = useState<number>(0);
  const [colocados, setColocados] = useState<AtomoId[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [etapaTravada, setEtapaTravada] = useState<boolean>(false);
  const [tudoConcluido, setTudoConcluido] = useState<boolean>(false);
  const [beckerDestacado, setBeckerDestacado] = useState<boolean>(false);

  const beckerRef = useRef<View>(null);
  const beckerRectRef = useRef<BeckerRect | null>(null);

  const etapa = ETAPAS_ATOMOS_MOLECULAS[Math.min(etapaIndex, ETAPAS_ATOMOS_MOLECULAS.length - 1)];

  // Retoma de onde parou: se concluiu o O2, volta direto p/ a água.
  // Considera o maior entre o AsyncStorage (local) e o Firestore (nuvem,
  // fonte do perfil) — vale em qualquer aparelho.
  useEffect(() => {
    if (!isModuloAtomos) return;
    setCarregando(true);
    (async () => {
      try {
        const salvo = await AsyncStorage.getItem(STORAGE_ETAPAS_MODULO_1);
        let concluidas = salvo === '2' ? 2 : salvo === '1' ? 1 : 0;
        try {
          if (user?.uid) {
            const snap = await getDoc(doc(db, 'users', user.uid));
            if (snap.exists()) {
              const etapas = lerMapaProgresso(snap.data())['1']?.etapas ?? [];
              const tem = (i: number) => etapas.includes(i);
              const remoto = tem(0) && tem(1) ? 2 : tem(0) ? 1 : 0;
              concluidas = Math.max(concluidas, remoto);
            }
          }
        } catch {
          // Sem rede: segue só com o valor local.
        }
        if (concluidas >= 2) {
          setTudoConcluido(true);
          setEtapaIndex(1);
        } else if (concluidas === 1) {
          setEtapaIndex(1);
        } else {
          setEtapaIndex(0);
        }
      } catch {
        setEtapaIndex(0);
      } finally {
        setCarregando(false);
      }
    })();
  }, [isModuloAtomos, user?.uid]);

  const medirBecker = useCallback(() => {
    // measureInWindow usa coordenadas de tela — iguais às do PanResponder.
    setTimeout(() => {
      try {
        beckerRef.current?.measureInWindow((x, y, w, h) => {
          if (typeof x === 'number' && typeof y === 'number') {
            beckerRectRef.current = { x, y, w, h };
          }
        });
      } catch {
        // ignora: o drop só não destaca até a próxima medição
      }
    }, 60);
  }, []);

  const isDentroDoBecker = useCallback((px: number, py: number): boolean => {
    const r = beckerRectRef.current;
    if (!r) return false;
    const margem = 12;
    return (
      px >= r.x - margem &&
      px <= r.x + r.w + margem &&
      py >= r.y - margem &&
      py <= r.y + r.h + margem
    );
  }, []);

  // O banner de feedback mostra/some e desloca o béquer na tela — a posição
  // gravada p/ o drop precisa ser remedida sempre que o layout mudar,
  // senão o drop cai "fora" e parece que não dá p/ arrastar.
  useEffect(() => {
    if (!isModuloAtomos || carregando) return;
    medirBecker();
  }, [isModuloAtomos, carregando, feedback, etapaIndex, tudoConcluido, medirBecker]);

  const handleArrastando = useCallback((_arrastando: boolean, sobreBecker: boolean) => {
    setBeckerDestacado(sobreBecker);
  }, []);

  function handleDrop(atomo: AtomoDisponivel) {
    if (etapaTravada || tudoConcluido) return;
    setBeckerDestacado(false);
    if (colocados.length >= etapa.capacidade) {
      setFeedback({
        tipo: 'erro',
        texto: `O béquer está cheio! Retire um átomo (✕) antes de colocar outro.`,
      });
      return;
    }
    setColocados((atual) => [...atual, atomo.id]);
    setFeedback(null);
  }

  function handleRemover(indice: number) {
    if (etapaTravada) return;
    setColocados((atual) => atual.filter((_, i) => i !== indice));
    setFeedback(null);
  }

  async function handleConcluir() {
    if (etapaTravada || tudoConcluido) return;
    if (composicaoCorreta(colocados, etapa)) {
      const ehUltima = etapaIndex >= ETAPAS_ATOMOS_MOLECULAS.length - 1;
      try {
        await AsyncStorage.setItem(
          STORAGE_ETAPAS_MODULO_1,
          ehUltima ? '2' : '1',
        );
      } catch {
        // Sem persistência o fluxo continua; só não retoma depois.
      }
      // Parte 2 do progresso (25% por etapa): escrita aditiva no Firestore,
      // que alimenta o perfil. Refazer depois não apaga (arrayUnion).
      if (user?.uid) {
        marcarEtapaConcluida(user.uid, '1', etapaIndex).catch(() => {});
      }
      setEtapaTravada(true);
      if (ehUltima) {
        setTudoConcluido(true);
        setFeedback({
          tipo: 'sucesso',
          texto: `Parabéns! Você formou a ${etapa.alvoTitulo} (${etapa.alvoFormula}) corretamente! 🎉`,
        });
      } else {
        setFeedback({
          tipo: 'sucesso',
          texto: `Parabéns! Você formou o ${etapa.alvoTitulo} (${etapa.alvoFormula}) corretamente! 🎉`,
        });
      }
    } else {
      setFeedback({ tipo: 'erro', texto: `Ops, ainda não está certo. ${gerarDica(colocados, etapa)}` });
    }
  }

  function handleAvancar() {
    setEtapaIndex(1);
    setColocados([]);
    setFeedback(null);
    setEtapaTravada(false);
    medirBecker();
  }

  async function handleRefazer() {
    // Só zera o estado local p/ treinar de novo — o Firestore (perfil)
    // mantém as etapas já concluídas, sem retirar o progresso.
    try {
      await AsyncStorage.setItem(STORAGE_ETAPAS_MODULO_1, '0');
    } catch {
      // ignora
    }
    setEtapaIndex(0);
    setColocados([]);
    setFeedback(null);
    setEtapaTravada(false);
    setTudoConcluido(false);
    // O feedback some e o layout desloca o béquer: remede a posição do drop.
    medirBecker();
  }

  // ---- Outros módulos: mantém o placeholder atual ----
  if (!isModuloAtomos) {
    // Módulo 2 tem o exercício interativo de vidrarias.
    if (id === '2') {
      return <ExercicioVidraria />;
    }
    // Módulo 3 tem o exercício interativo de substâncias.
    if (id === '3') {
      return <ExercicioSubstancias />;
    }
    // Módulo 4 tem o exercício interativo de misturas.
    if (id === '4') {
      return <ExercicioMisturas />;
    }
    // Módulo 5 tem o exercício interativo de gráficos.
    if (id === '5') {
      return <ExercicioGraficos />;
    }
    // Módulo 6 tem o exercício de separação de misturas heterogêneas.
    if (id === '6') {
      return (
        <ExercicioSeparacao
          moduloId="6"
          storageKey="librica:exercicio:6:etapasConcluidas"
          enunciado={ENUNCIADO_SEPARACAO_HET}
          metodos={METODOS_HETEROGENEAS}
          etapas={ETAPAS_SEPARACAO_HET}
          textoFinal={TEXTO_FINAL_SEPARACAO_HET}
          rotuloContador="Mistura"
          corTag="#d84315"
        />
      );
    }
    // Módulo 7 tem o exercício de separação de misturas homogêneas.
    if (id === '7') {
      return (
        <ExercicioSeparacao
          moduloId="7"
          storageKey="librica:exercicio:7:etapasConcluidas"
          enunciado={ENUNCIADO_SEPARACAO_HOM}
          metodos={METODOS_HOMOGENEAS}
          etapas={ETAPAS_SEPARACAO_HOM}
          textoFinal={TEXTO_FINAL_SEPARACAO_HOM}
          rotuloContador="Mistura"
          corTag="#2e7d32"
        />
      );
    }
    const textoAtividade =
      (id && textosPorModulo[id]) ||
      `Atividade de ${titulo || 'química'}: as questões deste módulo entram aqui em breve.`;
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
        <View style={styles.content}>
          <View>
            <Text style={styles.headerSubtitle}>Atividade Prática</Text>
            <Text style={styles.title}>{titulo || 'Exercício'}</Text>
            {id && <Text style={styles.moduloTag}>Módulo {id} de 7</Text>}
            <View style={styles.exerciseBox}>
              <Text style={styles.exerciseText}>{textoAtividade}</Text>
            </View>
          </View>
          <View style={styles.footerContainer}>
            <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.back()}>
              <FontAwesome name="arrow-left" size={16} color="#7B3E52" style={styles.iconLeft} />
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.finishButton]} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.finishButtonText}>Concluir</Text>
              <FontAwesome name="check" size={16} color="#fff" style={styles.iconRight} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ---- Módulo 1: montar moléculas ----
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
          <ActivityIndicator size="large" color="#00796b" />
          <Text style={styles.loadingTexto}>Preparando seu exercício…</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View>
            <Text style={styles.headerSubtitle}>Atividade Prática</Text>
            <Text style={styles.title}>{titulo || 'Átomos e Moléculas'}</Text>
            <Text style={styles.moduloTag}>
              {tudoConcluido ? 'Concluído ✓' : `Etapa ${etapaIndex + 1} de ${ETAPAS_ATOMOS_MOLECULAS.length}`}
            </Text>
            <Text style={styles.enunciado}>{ENUNCIADO_ATOMOS_MOLECULAS}</Text>
          </View>

          {/* Béquer + sinais colocados (mede a posição p/ o drop). */}
          <View onLayout={medirBecker}>
            <BeckerView
              ref={beckerRef}
              colocados={colocados}
              capacidade={etapa.capacidade}
              onRemover={handleRemover}
              destacado={beckerDestacado}
            />
          </View>

          <Text style={styles.alvoTexto}>{etapa.alvoDescricao}</Text>

          {/* Sinais arrastáveis (segurar mostra o vídeo, igual ao Dicionário). */}
          <View style={styles.trayHintRow}>
            <Text style={styles.trayHint}>Segure um sinal p/ ver a prévia • solte p/ fechar</Text>
          </View>
          <View style={styles.tray}>
            {ATOMOS_EXERCICIO.map((atomo, index) => (
              <AtomoCard
                key={atomo.id}
                atomo={atomo}
                onDrop={handleDrop}
                isDentroDoBecker={isDentroDoBecker}
                onArrastando={handleArrastando}
                onPrimeiroToque={medirBecker}
                lado={index === 0 ? 'direita' : 'esquerda'}
                abreParaBaixo={false}
              />
            ))}
          </View>

          {/* Feedback de acerto/erro. */}
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
            ) : etapaTravada && etapaIndex === 0 ? (
              <TouchableOpacity
                style={[styles.button, styles.finishButton]}
                onPress={handleAvancar}
              >
                <Text style={styles.finishButtonText}>Próximo: Água</Text>
                <FontAwesome name="arrow-right" size={16} color="#fff" style={styles.iconRight} />
              </TouchableOpacity>
            ) : etapaTravada ? (
              <TouchableOpacity
                style={[styles.button, styles.finishButton]}
                onPress={() => router.replace('/(tabs)')}
              >
                <Text style={styles.finishButtonText}>Concluir</Text>
                <FontAwesome name="check" size={16} color="#fff" style={styles.iconRight} />
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
    gap: 8,
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
    color: '#00796b',
    marginBottom: 8,
  },
  enunciado: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5a3d40',
    marginBottom: 4,
  },
  alvoTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7B3E52',
    textAlign: 'center',
    backgroundColor: '#f5e6ea',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  trayHintRow: {
    alignItems: 'center',
    marginTop: 2,
  },
  trayHint: {
    fontSize: 12,
    color: '#7B3E52',
    fontWeight: '600',
  },
  tray: {
    flexDirection: 'row',
    gap: 10,
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
  exerciseBox: {
    width: '100%',
    height: 220,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#dcd6ce',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseText: {
    color: '#5a3d40',
    textAlign: 'center',
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
