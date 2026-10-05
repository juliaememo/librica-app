import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import SinalHostingPopup from '@/components/SinalHostingPopup';
import { getSinalHostingUrl } from '@/src/services/sinaisHosting';
import type { MetodoSeparacao } from '@/src/data/separacao-heterogenea';

interface MetodoCardProps {
  metodo: MetodoSeparacao;
  /** Soltou o card: o pai descobre o espaço pelo ponto (x, y) da tela. */
  onDrop: (metodo: MetodoSeparacao, x: number, y: number) => void;
  /** Avisa o pai durante o arrasto (p/ destacar o espaço sob o dedo). */
  onArrastando?: (arrastando: boolean, x: number, y: number) => void;
  /** Chamado ao tocar o card (p/ o pai remediar a posição dos espaços). */
  onPrimeiroToque?: () => void;
  /** De que lado abre a prévia do vídeo (igual ao Dicionário). */
  lado?: 'esquerda' | 'direita';
  /** A prévia abre para cima (a grade é fixa, sem corte). */
  abreParaBaixo?: boolean;
}

/**
 * Método de separação: igual ao Dicionário, SÓ segurar mostra a prévia
 * (soltar fecha). Toque preenche o primeiro espaço vazio; arrastar
 * preenche o espaço sob o dedo.
 */
export default function MetodoCard({
  metodo,
  onDrop,
  onArrastando,
  onPrimeiroToque,
  lado = 'direita',
  abreParaBaixo = false,
}: MetodoCardProps) {
  const [mostrarPreview, setMostrarPreview] = useState<boolean>(false);
  const [arrastando, setArrastando] = useState<boolean>(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveuRef = useRef<boolean>(false);

  const videoUrl = getSinalHostingUrl(metodo.nome);
  const ativo = mostrarPreview || arrastando;

  // O PanResponder é criado uma vez: acessa as props via ref p/ nunca
  // usar callbacks desatualizadas do primeiro render.
  const cbRef = useRef({ onDrop, onPrimeiroToque, onArrastando, metodo });
  cbRef.current = { onDrop, onPrimeiroToque, onArrastando, metodo };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function limparTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function finalizarArrasto() {
    setArrastando(false);
    cbRef.current.onArrastando?.(false, 0, 0);
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        moveuRef.current = false;
        limparTimer();
        cbRef.current.onPrimeiroToque?.();
        // 180ms: mesmo tempo do Dicionário — SÓ segurar mostra a prévia.
        timerRef.current = setTimeout(() => {
          setMostrarPreview(true);
        }, 180);
      },
      onPanResponderMove: (_, g) => {
        // Virou arrasto: cancela a prévia e começa a mover o card.
        if (!moveuRef.current && Math.abs(g.dx) + Math.abs(g.dy) > 8) {
          moveuRef.current = true;
          limparTimer();
          setMostrarPreview(false);
          setArrastando(true);
        }
        if (!moveuRef.current) return;
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(_, g);
        cbRef.current.onArrastando?.(true, g.moveX, g.moveY);
      },
      onPanResponderRelease: (_, g) => {
        // Soltou: a prévia some na hora (igual ao Dicionário).
        limparTimer();
        setMostrarPreview(false);
        // Tanto o toque quanto o arrasto informam o ponto: o pai preenche
        // o espaço sob o dedo (ou o primeiro vazio, se soltar fora).
        cbRef.current.onDrop(cbRef.current.metodo, g.moveX, g.moveY);
        if (!moveuRef.current) {
          pan.setValue({ x: 0, y: 0 });
          setArrastando(false);
          cbRef.current.onArrastando?.(false, 0, 0);
          return;
        }
        finalizarArrasto();
      },
      onPanResponderTerminate: () => {
        limparTimer();
        setMostrarPreview(false);
        if (moveuRef.current) finalizarArrasto();
        else pan.setValue({ x: 0, y: 0 });
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: metodo.corFundo },
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          zIndex: ativo ? 50 : 1,
          elevation: ativo ? 8 : 0,
        },
      ]}
      {...panResponder.panHandlers}
      accessibilityRole="button"
      accessibilityLabel={`Método ${metodo.nome}`}
      accessibilityHint="Segure para ver a prévia do vídeo e solte para fechar. Toque ou arraste até o espaço para escolher."
    >
      <View style={[styles.cardInner, ativo && styles.cardInnerAtivo]}>
        <Text style={[styles.cardTitulo, { color: metodo.corTema }]} numberOfLines={2}>
          {metodo.nome}
        </Text>
      </View>
      {mostrarPreview && (
        <SinalHostingPopup
          titulo={metodo.nome}
          videoUrl={videoUrl}
          corTema={metodo.corTema}
          lado={lado}
          abreParaBaixo={abreParaBaixo}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 60,
    borderWidth: 1.5,
    borderColor: '#dcd6ce',
    borderRadius: 14,
  },
  cardInner: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInnerAtivo: {
    opacity: 0.92,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  cardTitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 16,
  },
});
