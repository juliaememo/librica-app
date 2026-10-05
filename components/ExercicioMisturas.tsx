import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { lerMapaProgresso, marcarEtapaConcluida } from '@/src/services/progresso';
import BeckerMistura from '@/components/BeckerMistura';
import IngredienteCard from '@/components/IngredienteCard';
import SegurarParaVer from '@/components/SegurarParaVer';
import {
  ENUNCIADO_MISTURAS,
  ETAPAS_MISTURAS,
  INGREDIENTES_DATA,
  TEXTO_FINAL_MISTURAS,
  validarMistura,
  type Ingrediente,
  type IngredienteId,
  type QtdFases,
  type TipoMistura,
} from '@/src/data/misturas';

/** Quantas misturas do módulo 4 já foram concluídas (0 a 4). */
const STORAGE_ETAPAS_MODULO_4 = 'librica:exercicio:4:etapasConcluidas';

const COR_FASES = '#512da8';
const COR_HOMOGENEA = '#00796b';
const COR_HETEROGENEA = '#d84315';

interface Feedback {
  tipo: 'sucesso' | 'erro';
  texto: string;
}

interface BeckerRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function ExercicioMisturas() {
  const router = useRouter();
  const { user } = useAuth();
  const { titulo } = useLocalSearchParams<{ titulo: string }>();

  const [carregando, setCarregando] = useState<boolean>(true);
  const [etapaIndex, setEtapaIndex] = useState<number>(0);
  const [colocados, setColocados] = useState<IngredienteId[]>([]);
  const [fases, setFases] = useState<QtdFases | null>(null);
  const [tipo, setTipo] = useState<TipoMistura | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [etapaTravada, setEtapaTravada] = useState<boolean>(false);
  const [tudoConcluido, setTudoConcluido] = useState<boolean>(false);
  const [beckerDestacado, setBeckerDestacado] = useState<boolean>(false);
  const [rolagemTravada, setRolagemTravada] = useState<boolean>(false);

  const beckerRef = useRef<View>(null);
  const beckerRectRef = useRef<BeckerRect | null>(null);

  const etapa =
    ETAPAS_MISTURAS[Math.min(etapaIndex, ETAPAS_MISTURAS.length - 1)];
  const total = ETAPAS_MISTURAS.length;

  // Retoma de onde parou (maior entre o cache local e o Firestore).
  useEffect(() => {
    let montado = true;
    setCarregando(true);
    (async () => {
      try {
        const salvo = await AsyncStorage.getItem(STORAGE_ETAPAS_MODULO_4);
        let concluidas = salvo === '4' ? 4 : salvo === '3' ? 3 : salvo === '2' ? 2 : salvo === '1' ? 1 : 0;
        try {
          const uid = auth.currentUser?.uid;
          if (uid) {
            const snap = await getDoc(doc(db, 'users', uid));
            if (snap.exists()) {
              const etapas = lerMapaProgresso(snap.data())['4']?.etapas ?? [];
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
  }, [total]);

  const medirBecker = useCallback(() => {
    setTimeout(() => {
      try {
        beckerRef.current?.measureInWindow((x, y, w, h) => {
          if (typeof x === 'number' && typeof y === 'number') {
            beckerRectRef.current = { x, y, w, h };
          }
        });
      } catch {
        // ignora
      }
    }, 60);
  }, []);

  // Remede se o layout deslocar o béquer.
  useEffect(() => {
    if (carregando) return;
    medirBecker();
  }, [carregando, feedback, etapaIndex, tudoConcluido, medirBecker]);

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

  const handleArrastando = useCallback(
    (arrastando: boolean, sobreBecker: boolean) => {
      setBeckerDestacado(sobreBecker);
      setRolagemTravada(arrastando);
    },
    [],
  );

  async function persistirAcerto(indice: number, concluidas: number) {
    try {
      await AsyncStorage.setItem(STORAGE_ETAPAS_MODULO_4, String(concluidas));
    } catch {
      // segue sem o cache local
    }
    if (user?.uid) {
      marcarEtapaConcluida(user.uid, '4', indice).catch(() => {});
    }
  }

  function handleDrop(ingrediente: Ingrediente) {
    if (etapaTravada || tudoConcluido) return;
    setBeckerDestacado(false);
    if (colocados.length >= etapa.esperados.length) {
      setFeedback({
        tipo: 'erro',
        texto: 'O béquer está cheio! Retire um ingrediente (✕) antes de colocar outro.',
      });
      return;
    }
    setColocados((atual) => [...atual, ingrediente.id]);
    setFeedback(null);
  }

  function handleRemover(indice: number) {
    if (etapaTravada) return;
    setColocados((atual) => atual.filter((_, i) => i !== indice));
    setFeedback(null);
  }

  function handleSelectFases(valor: QtdFases) {
    if (etapaTravada || tudoConcluido) return;
    setFases(valor);
    setFeedback(null);
  }

  function handleSelectTipo(valor: TipoMistura) {
    if (etapaTravada || tudoConcluido) return;
    setTipo(valor);
    setFeedback(null);
  }

  async function handleConcluir() {
    if (etapaTravada || tudoConcluido) return;
    const resultado = validarMistura(colocados, fases, tipo, etapa);
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
      setFeedback({ tipo: 'sucesso', texto: TEXTO_FINAL_MISTURAS });
    } else {
      setFeedback({
        tipo: 'sucesso',
        texto: 'Parabéns! Mistura correta! 🎉 Vamos para a próxima.',
      });
    }
  }

  function handleProxima() {
    setEtapaIndex((i) => Math.min(i + 1, total - 1));
    setColocados([]);
    setFases(null);
    setTipo(null);
    setFeedback(null);
    setEtapaTravada(false);
    medirBecker();
  }

  async function handleRefazer() {
    // Só zera o estado local p/ treinar de novo — o Firestore (perfil)
    // mantém as etapas já concluídas, sem retirar o progresso.
    try {
      await AsyncStorage.setItem(STORAGE_ETAPAS_MODULO_4, '0');
    } catch {
      // ignora
    }
    setEtapaIndex(0);
    setColocados([]);
    setFases(null);
    setTipo(null);
    setFeedback(null);
    setEtapaTravada(false);
    setTudoConcluido(false);
    medirBecker();
  }

  function balaoFases(valor: QtdFases) {
    const ativo = fases === valor;
    return (
      <SegurarParaVer
        key={valor}
        titulo={String(valor)}
        corTema={COR_FASES}
        lado={valor === 1 ? 'direita' : 'esquerda'}
        abreParaBaixo={false}
        onTap={() => handleSelectFases(valor)}
        style={[styles.balaoNumero, ativo && styles.balaoNumeroAtivo]}
        accessibilityLabel={`${valor} fase${valor === 2 ? 's' : ''}${ativo ? ', escolhido' : ''}`}
      >
        <View style={styles.balaoNumeroInner}>
          <Text style={[styles.balaoNumeroTexto, ativo && styles.balaoTextoAtivo]}>
            {valor}
          </Text>
        </View>
      </SegurarParaVer>
    );
  }

  function balaoTipo(valor: TipoMistura, rotulo: string, cor: string) {
    const ativo = tipo === valor;
    return (
      <SegurarParaVer
        key={valor}
        titulo={rotulo}
        corTema={cor}
        lado={valor === 'homogenea' ? 'direita' : 'esquerda'}
        abreParaBaixo={false}
        onTap={() => handleSelectTipo(valor)}
        style={[styles.balaoTexto, ativo && { borderColor: cor, backgroundColor: cor }]}
        accessibilityLabel={`${rotulo}${ativo ? ', escolhido' : ''}`}
      >
        <View style={styles.balaoTextoInner}>
          <Text style={[styles.balaoTextoRotulo, ativo && styles.balaoTextoAtivo]}>
            {rotulo}
          </Text>
        </View>
      </SegurarParaVer>
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
          <ActivityIndicator size="large" color={COR_FASES} />
          <Text style={styles.loadingTexto}>Preparando as misturas…</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* A tela rola (a grade é fixa): o arrasto funciona porque o card
              assume o gesto no toque, e a rolagem trava durante o arrasto. */}
          <ScrollView
            style={styles.rolagem}
            contentContainerStyle={styles.rolagemConteudo}
            scrollEnabled={!rolagemTravada}
            showsVerticalScrollIndicator={false}
          >
          <View>
            <Text style={styles.headerSubtitle}>Atividade Prática</Text>
            <Text style={styles.title}>{titulo || 'Misturas'}</Text>
            <Text style={styles.moduloTag}>
              {tudoConcluido ? 'Concluído ✓' : `Mistura ${etapaIndex + 1} de ${total}`}
            </Text>
            <Text style={styles.enunciado}>{ENUNCIADO_MISTURAS}</Text>
          </View>

          {/* Béquer + ingredientes colocados. */}
          <View onLayout={medirBecker}>
            <BeckerMistura
              ref={beckerRef}
              colocados={colocados}
              capacidade={etapa.esperados.length}
              onRemover={handleRemover}
              destacado={beckerDestacado}
              duasCamadas={etapa.fases === 2 && colocados.length >= 2}
            />
          </View>

          <Text style={styles.alvoTexto}>{etapa.alvoDescricao}</Text>

          {/* Balões: fases e classificação (segurar mostra o vídeo). */}
          <View style={styles.baloes}>
            <View style={styles.balaoLinha}>
              <Text style={styles.balaoRotulo}>Fases:</Text>
              {balaoFases(1)}
              {balaoFases(2)}
            </View>
            <View style={styles.balaoLinha}>
              {balaoTipo('homogenea', 'Homogênea', COR_HOMOGENEA)}
              {balaoTipo('heterogenea', 'Heterogênea', COR_HETEROGENEA)}
            </View>
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

          {/* Ingredientes arrastáveis (todos, sempre). */}
          {!tudoConcluido && (
            <View style={styles.trayFixo}>
              <Text style={styles.trayHint}>
                Toque p/ colocar • segure p/ ver o vídeo • arraste p/ o béquer
              </Text>
              <View style={styles.grid}>
                {INGREDIENTES_DATA.map((ingrediente, index) => (
                  <View key={ingrediente.id} style={styles.gridItem}>
                    <IngredienteCard
                      ingrediente={ingrediente}
                      onDrop={handleDrop}
                      isDentroDoBecker={isDentroDoBecker}
                      onArrastando={handleArrastando}
                      onPrimeiroToque={medirBecker}
                      lado={index % 3 === 0 ? 'direita' : 'esquerda'}
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
    gap: 8,
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
    color: '#512da8',
    marginBottom: 8,
  },
  enunciado: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5a3d40',
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
  baloes: {
    gap: 8,
  },
  balaoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  balaoRotulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5a3d40',
  },
  balaoNumero: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#dcd6ce',
    backgroundColor: '#fff',
  },
  balaoNumeroAtivo: {
    borderColor: COR_FASES,
    backgroundColor: COR_FASES,
  },
  balaoNumeroInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balaoNumeroTexto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COR_FASES,
  },
  balaoTexto: {
    flex: 1,
    minHeight: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#dcd6ce',
    backgroundColor: '#fff',
    maxWidth: 170,
  },
  balaoTextoInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  balaoTextoRotulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5a3d40',
  },
  balaoTextoAtivo: {
    color: '#fff',
  },
  trayFixo: {
    paddingBottom: 4,
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
