import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { VideoView, useVideoPlayer } from 'expo-video';
import {
  assinarPreviewSinal,
  lerPreviewSinal,
} from '@/src/services/sinalPreviewStore';

interface OverlayPlayerProps {
  uri: string;
  altura: number;
}

/**
 * Player da prévia global. `contain` (em vez de `cover`) garante que o
 * vídeo apareça completo, sem corte, seja vertical (Shorts 9:16) ou
 * horizontal — sobre fundo preto com letterbox.
 */
function OverlayPlayer({ uri, altura }: OverlayPlayerProps) {
  const [pronto, setPronto] = useState<boolean>(false);
  const [erro, setErro] = useState<boolean>(false);
  const montadoRef = useRef<boolean>(true);

  useEffect(() => {
    montadoRef.current = true;
    return () => {
      montadoRef.current = false;
    };
  }, []);

  const player = useVideoPlayer(uri);
  const { status } = useEvent(player, 'statusChange', {
    status: player.status,
  });

  useEffect(() => {
    try {
      player.loop = true;
      player.play();
    } catch {
      // Falha refletida no status abaixo.
    }
    return () => {
      try {
        player.pause();
      } catch {
        // ignora (player já liberado)
      }
    };
  }, [player]);

  useEffect(() => {
    if (status === 'error' && montadoRef.current) {
      setErro(true);
      try {
        player.pause();
      } catch {
        // ignora
      }
    }
  }, [status, player]);

  return (
    <View style={[styles.videoBox, { height: altura }]}>
      {!pronto && !erro && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      )}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        onFirstFrameRender={() => {
          if (montadoRef.current) setPronto(true);
        }}
      />
      {erro && (
        <View style={styles.erroOverlay}>
          <FontAwesome name="exclamation-triangle" size={28} color="#b00020" />
          <Text style={styles.estadoTexto}>Não foi possível carregar a prévia</Text>
        </View>
      )}
    </View>
  );
}

/**
 * Overlay global da prévia: montado uma única vez na raiz do app.
 * - `pointerEvents="none"`: nunca rouba o toque; o card mantém o responder
 *   e o `onPressOut`/`onPanResponderRelease` (soltar fecha) continua
 *   funcionando normalmente.
 * - Prévia PEQUENA ao lado do ícone (não um modal enorme): usa a posição
 *   do card na tela e prende (clamp) dentro da área visível — nunca exige
 *   rolar e nunca é cortada por `overflow: hidden`/ScrollView dos
 *   exercícios e páginas de vídeo.
 * - Sem fundo escuro: só o cartão pequeno com sombra.
 */
export default function SinalPreviewOverlay() {
  const previa = useSyncExternalStore(
    assinarPreviewSinal,
    lerPreviewSinal,
    lerPreviewSinal,
  );
  const { width, height } = useWindowDimensions();
  // Altura real do cartão após montar: zera o vão da prévia que abre para
  // cima (a de baixo já é exata, pois parte da borda do card).
  const [alturaReal, setAlturaReal] = useState<number | null>(null);

  if (!previa) return null;

  // Compacta: ~150px de largura (antes eram 190–300).
  const larguraCard = Math.min(150, Math.floor(width - 24));
  const alturaVideo = Math.round((larguraCard * 16) / 9);
  // Título + paddings + vídeo (estimativa p/ o 1º frame; depois usa a real).
  const alturaEstimada = alturaVideo + 46;
  const alturaUsada = alturaReal ?? alturaEstimada;
  const lado = previa.lado ?? 'direita';
  const abreParaBaixo = previa.abreParaBaixo ?? false;
  const FOLGA = 6;

  // Posição: colada no card (centro horizontal do card, acima ou abaixo
  // com 6px de folga). Se o lado preferido não couber na tela, inverte —
  // em vez de jogar a prévia para longe do ícone.
  let esquerda: number;
  let topo: number;
  if (previa.ancora) {
    const { x, y, largura, altura } = previa.ancora;
    const centroX = x + largura / 2;
    const deslocamentoLateral = lado === 'direita' ? 8 : -8;
    esquerda = centroX + deslocamentoLateral - larguraCard / 2;
    const topoAbaixo = y + altura + FOLGA;
    const topoAcima = y - alturaUsada - FOLGA;
    if (abreParaBaixo) {
      topo = topoAbaixo + alturaUsada > height - 8 ? topoAcima : topoAbaixo;
    } else {
      topo = topoAcima < 8 ? topoAbaixo : topoAcima;
    }
  } else {
    esquerda = (width - larguraCard) / 2;
    topo = (height - alturaUsada) / 2;
  }
  esquerda = Math.min(Math.max(8, esquerda), Math.max(8, width - larguraCard - 8));
  topo = Math.min(Math.max(8, topo), Math.max(8, height - alturaUsada - 8));

  return (
    <View pointerEvents="none" style={styles.raiz}>
      <View
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (typeof h === 'number' && h > 0 && h !== alturaReal) {
            setAlturaReal(h);
          }
        }}
        style={[
          styles.card,
          { width: larguraCard, left: esquerda, top: topo, borderColor: previa.corTema },
        ]}
      >
        <View style={styles.tituloBar}>
          <FontAwesome name="play-circle" size={14} color={previa.corTema} />
          <Text style={[styles.titulo, { color: previa.corTema }]} numberOfLines={1}>
            {previa.titulo}
          </Text>
        </View>

        {!previa.videoUrl ? (
          <View style={[styles.estadoBox, { height: alturaVideo }]}>
            <FontAwesome name="video-camera" size={22} color="#8c7b7d" />
            <Text style={styles.estadoTexto}>Vídeo ainda não enviado</Text>
          </View>
        ) : (
          <OverlayPlayer key={previa.videoUrl} uri={previa.videoUrl} altura={alturaVideo} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 999,
  },
  card: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  tituloBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  titulo: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  videoBox: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    padding: 6,
    zIndex: 1,
  },
  erroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    padding: 12,
  },
  estadoBox: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#f3ece7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    gap: 6,
  },
  estadoTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5a3d40',
    textAlign: 'center',
  },
});
