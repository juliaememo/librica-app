import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { VideoView, useVideoPlayer } from 'expo-video';

interface SinalHostingPopupProps {
  titulo: string;
  videoUrl: string | null;
  corTema?: string;
  /** De que lado do card o pop-up abre (espelha conforme a coluna do grid). */
  lado?: 'esquerda' | 'direita';
  /** Cards das fileiras de cima abrem para baixo (não estouram o topo). */
  abreParaBaixo?: boolean;
}

export const POPUP_LARGURA = 190;
// Formato YouTube Shorts (vertical 9:16). Altura ≈ 2 cards do grid.
// Se seus .mp4 forem HORIZONTAIS, troque contentFit para 'contain' abaixo.
const POPUP_VIDEO_ALTURA = Math.round((POPUP_LARGURA * 16) / 9);

/** Player com streaming direto do Firebase Hosting (nada fica salvo). */
function HostingPlayer({ uri }: { uri: string }) {
  const [pronto, setPronto] = useState<boolean>(false);
  const [erro, setErro] = useState<boolean>(false);
  const montadoRef = useRef<boolean>(true);

  useEffect(() => {
    montadoRef.current = true;
    return () => {
      montadoRef.current = false;
    };
  }, []);

  // Sem autoplay no inicializador: o play acontece num efeito após a
  // montagem, para nunca entregar ao VideoView um player já liberado
  // (era isso que quebrava com "shared object already released").
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
      // Ao desmontar (soltou o dedo), pausa e o buffer é descartado.
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
    <View style={styles.videoBox}>
      {!pronto && !erro && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      )}
      {/* O VideoView continua montado mesmo com erro: trocar o componente
          no momento do erro liberava o player nativo no meio da troca. */}
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        onFirstFrameRender={() => {
          if (montadoRef.current) setPronto(true);
        }}
      />
      {erro && (
        <View style={styles.erroOverlay}>
          <View style={styles.estadoBox}>
            <FontAwesome name="exclamation-triangle" size={28} color="#b00020" />
            <Text style={styles.estadoTexto}>
              Não foi possível carregar a prévia
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default function SinalHostingPopup({
  titulo,
  videoUrl,
  corTema = '#7B3E52',
  lado = 'direita',
  abreParaBaixo = false,
}: SinalHostingPopupProps) {
  // pointerEvents="none": a prévia some no onPressOut do card.
  // Se o pop-up roubasse o toque, o "soltar" não chegaria no card.
  return (
    <View
      pointerEvents="none"
      style={[
        styles.popup,
        { borderColor: corTema },
        lado === 'direita' ? styles.popupDireita : styles.popupEsquerda,
        abreParaBaixo ? styles.popupAbaixo : styles.popupAcima,
      ]}
    >
      <View style={styles.tituloBar}>
        <FontAwesome name="play-circle" size={14} color={corTema} />
        <Text style={[styles.titulo, { color: corTema }]} numberOfLines={1}>
          {titulo}
        </Text>
      </View>

      {!videoUrl ? (
        <View style={styles.estadoBox}>
          <FontAwesome name="video-camera" size={28} color="#8c7b7d" />
          <Text style={styles.estadoTexto}>Vídeo ainda não enviado</Text>
          <Text style={styles.estadoDica}>
            Suba o .mp4 em hosting-public/videos e rode o deploy
          </Text>
        </View>
      ) : (
        <HostingPlayer key={videoUrl} uri={videoUrl} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    width: POPUP_LARGURA,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 8,
    zIndex: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  popupDireita: {
    left: -8,
  },
  popupEsquerda: {
    right: -8,
  },
  popupAcima: {
    bottom: '88%',
    marginBottom: 8,
  },
  popupAbaixo: {
    top: '88%',
    marginTop: 8,
  },
  tituloBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  titulo: {
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },
  videoBox: {
    width: '100%',
    height: POPUP_VIDEO_ALTURA,
    borderRadius: 8,
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
    borderRadius: 8,
    overflow: 'hidden',
  },
  estadoBox: {
    width: '100%',
    height: POPUP_VIDEO_ALTURA,
    borderRadius: 8,
    backgroundColor: '#f3ece7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    gap: 6,
  },
  estadoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5a3d40',
    textAlign: 'center',
  },
  estadoDica: {
    fontSize: 10,
    color: '#8c7b7d',
    textAlign: 'center',
  },
});
