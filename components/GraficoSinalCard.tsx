import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import SinalHostingPopup from '@/components/SinalHostingPopup';
import { getSinalHostingUrl } from '@/src/services/sinaisHosting';
import type { SinalGrafico } from '@/src/data/graficos';

interface GraficoSinalCardProps {
  sinal: SinalGrafico;
  /** Soltou o card: o pai descobre o espaço pelo ponto (x, y) da tela. */
  onDrop: (sinal: SinalGrafico, x: number, y: number) => void;
  /** Avisa o pai durante o arrasto (p/ destacar o espaço sob o dedo). */
  onArrastando?: (arrastando: boolean, x: number, y: number) => void;
  /** Chamado ao tocar o card (p/ o pai remediar a posição dos espaços). */
  onPrimeiroToque?: () => void;
  /** De que lado abre a prévia do vídeo (igual ao Dicionário). */
  lado?: 'esquerda' | 'direita';
}

/**
 * Sinal do gráfico: SÓ segurar mostra a prévia (igual ao Dicionário).
 * Toque não abre vídeo; mover arrasta até um espaço do gráfico.
 */
export default function GraficoSinalCard({
  sinal,
  onDrop,
  onArrastando,
  onPrimeiroToque,
  lado = 'direita',
}: GraficoSinalCardProps) {
  const [mostrarPreview, setMostrarPreview] = useState<boolean>(false);
  const [arrastando, setArrastando] = useState<boolean>(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveuRef = useRef<boolean>(false);
  const baseRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  const videoUrl = getSinalHostingUrl(sinal.nome);
  const ativo = mostrarPreview || arrastando;

  // O PanResponder é criado uma vez: acessa as props via ref p/ nunca
  // usar callbacks desatualizadas do primeiro render.
  const cbRef = useRef({ onDrop, onArrastando, onPrimeiroToque, sinal });
  cbRef.current = { onDrop, onArrastando, onPrimeiroToque, sinal };

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
        const dist = Math.abs(g.dx) + Math.abs(g.dy);
        // Virou arrasto: cancela a prévia e começa a mover o card.
        if (!moveuRef.current && dist > 8) {
          moveuRef.current = true;
          limparTimer();
          setMostrarPreview(false);
          setArrastando(true);
        }
        if (!moveuRef.current) return;
        // Segue o dedo a partir do ponto onde o arrasto começou.
        if (baseRef.current.dx === 0 && baseRef.current.dy === 0) {
          baseRef.current = { dx: g.dx, dy: g.dy };
          pan.setValue({ x: 0, y: 0 });
        } else {
          pan.setValue({
            x: g.dx - baseRef.current.dx,
            y: g.dy - baseRef.current.dy,
          });
        }
        cbRef.current.onArrastando?.(true, g.moveX, g.moveY);
      },
      onPanResponderRelease: (_, g) => {
        // Soltou: a prévia some na hora (igual ao Dicionário).
        limparTimer();
        setMostrarPreview(false);
        baseRef.current = { dx: 0, dy: 0 };
        if (!moveuRef.current) {
          // Toque: não abre vídeo, só devolve o card.
          pan.setValue({ x: 0, y: 0 });
          setArrastando(false);
          cbRef.current.onArrastando?.(false, 0, 0);
          return;
        }
        // Arrasto: o pai coloca no espaço sob o dedo.
        cbRef.current.onDrop(cbRef.current.sinal, g.moveX, g.moveY);
        finalizarArrasto();
      },
      onPanResponderTerminate: () => {
        limparTimer();
        setMostrarPreview(false);
        baseRef.current = { dx: 0, dy: 0 };
        if (moveuRef.current) finalizarArrasto();
        else pan.setValue({ x: 0, y: 0 });
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: sinal.corFundo },
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          zIndex: ativo ? 50 : 1,
          elevation: ativo ? 8 : 0,
        },
        ativo && styles.cardAtivo,
      ]}
      {...panResponder.panHandlers}
      accessibilityRole="button"
      accessibilityLabel={`Sinal ${sinal.nome}`}
      accessibilityHint="Segure para ver a prévia do vídeo e solte para fechar. Arraste até um espaço do gráfico."
    >
      <View style={[styles.cardInner, mostrarPreview && styles.cardInnerDim]}>
        <Text style={[styles.cardTitulo, { color: sinal.corTema }]} numberOfLines={2}>
          {sinal.nome}
        </Text>
      </View>
      {mostrarPreview && (
        <SinalHostingPopup
          titulo={sinal.nome}
          videoUrl={videoUrl}
          corTema={sinal.corTema}
          lado={lado}
          abreParaBaixo={false}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: '#dcd6ce',
    borderRadius: 14,
  },
  cardAtivo: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  cardInner: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInnerDim: {
    opacity: 0.6,
  },
  cardTitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 16,
  },
});
