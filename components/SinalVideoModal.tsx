import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { VideoView, useVideoPlayer } from 'expo-video';
import { getSinalHostingUrl } from '@/src/services/sinaisHosting';

interface SinalVideoModalProps {
  visivel: boolean;
  titulo: string;
  corTema?: string;
  onFechar: () => void;
}

function VideoPlayer({ uri }: { uri: string }) {
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
  // montagem, para nunca entregar ao VideoView um player já liberado.
  const player = useVideoPlayer(uri);
  const { status } = useEvent(player, 'statusChange', { status: player.status });

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
            <Text style={styles.estadoTexto}>Não foi possível carregar o vídeo</Text>
          </View>
        </View>
      )}
    </View>
  );
}

/**
 * Modal com o mesmo vídeo de sinal do Dicionário (streaming do Hosting).
 * Usado quando o toque precisa abrir o vídeo sem conflitar com o arrasto.
 */
export default function SinalVideoModal({
  visivel,
  titulo,
  corTema = '#7B3E52',
  onFechar,
}: SinalVideoModalProps) {
  const videoUrl = getSinalHostingUrl(titulo);

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onFechar}
    >
      <View style={styles.fundo}>
        <View style={[styles.box, { borderColor: corTema }]}>
          <View style={styles.header}>
            <FontAwesome name="play-circle" size={16} color={corTema} />
            <Text style={[styles.titulo, { color: corTema }]} numberOfLines={1}>
              Sinal: {titulo}
            </Text>
            <Pressable
              onPress={onFechar}
              hitSlop={12}
              style={styles.fechar}
              accessibilityRole="button"
              accessibilityLabel="Fechar vídeo"
            >
              <FontAwesome name="times" size={18} color="#5a3d40" />
            </Pressable>
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
            <VideoPlayer key={videoUrl} uri={videoUrl} />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  box: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  titulo: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
  },
  fechar: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBox: {
    width: '100%',
    height: 320,
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
    padding: 8,
    zIndex: 1,
  },
  erroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  estadoBox: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    backgroundColor: '#f3ece7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 6,
  },
  estadoTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5a3d40',
    textAlign: 'center',
  },
  estadoDica: {
    fontSize: 11,
    color: '#8c7b7d',
    textAlign: 'center',
  },
});
