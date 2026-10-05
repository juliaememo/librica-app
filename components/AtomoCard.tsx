import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import SinalHostingPopup from '@/components/SinalHostingPopup';
import { getSinalHostingUrl } from '@/src/services/sinaisHosting';
import type { AtomoDisponivel } from '@/src/data/exercicios';

interface AtomoCardProps {
  atomo: AtomoDisponivel;
  /** Chamado quando o usuário solta o card dentro do béquer. */
  onDrop: (atomo: AtomoDisponivel) => void;
  /** Diz se um ponto da tela (moveX/moveY) está dentro do béquer. */
  isDentroDoBecker: (x: number, y: number) => boolean;
  /** Avisa o pai quando começa/termina o arrasto (p/ destacar o béquer). */
  onArrastando?: (arrastando: boolean, sobreBecker: boolean) => void;
  /** De que lado abre a prévia do vídeo (igual ao Dicionário). */
  lado?: 'esquerda' | 'direita';
  /** No tray (parte de baixo da tela), a prévia abre para cima. */
  abreParaBaixo?: boolean;
  /** Chamado ao tocar o card (p/ o pai remediar a posição do béquer). */
  onPrimeiroToque?: () => void;
}

/**
 * Sinal do exercício: visual próximo ao do Dicionário, mas com a borda
 * externa neutra (só a borda interna — a "menor" — leva a cor do tema).
 * Igual ao Dicionário: segurar mostra a prévia do vídeo e soltar fecha.
 * Arrastar até o béquer adiciona o átomo (o arrasto cancela a prévia).
 */
export default function AtomoCard({
  atomo,
  onDrop,
  isDentroDoBecker,
  onArrastando,
  lado = 'direita',
  abreParaBaixo = false,
  onPrimeiroToque,
}: AtomoCardProps) {
  const [mostrarPreview, setMostrarPreview] = useState<boolean>(false);
  const [arrastando, setArrastando] = useState<boolean>(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveuRef = useRef<boolean>(false);
  const sobreBeckerRef = useRef<boolean>(false);

  const videoUrl = getSinalHostingUrl(atomo.titulo);
  const ativo = mostrarPreview || arrastando;

  // O PanResponder é criado uma vez: acessa as props via ref p/ nunca
  // usar callbacks/estado desatualizados do primeiro render.
  const cbRef = useRef({ onDrop, isDentroDoBecker, onPrimeiroToque, onArrastando, atomo });
  cbRef.current = { onDrop, isDentroDoBecker, onPrimeiroToque, onArrastando, atomo };

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
    onArrastando?.(false, false);
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
        sobreBeckerRef.current = false;
        limparTimer();
        // Remede a posição do béquer: garante o drop mesmo se o layout
        // deslocou desde a última medição.
        cbRef.current.onPrimeiroToque?.();
        // 180ms: mesmo tempo do Dicionário — segura e a prévia aparece.
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
          cbRef.current.onArrastando?.(true, false);
        }
        if (!moveuRef.current) return;
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(_, g);
        const sobre = cbRef.current.isDentroDoBecker(g.moveX, g.moveY);
        if (sobre !== sobreBeckerRef.current) {
          sobreBeckerRef.current = sobre;
          cbRef.current.onArrastando?.(true, sobre);
        }
      },
      onPanResponderRelease: (_, g) => {
        // Soltou: a prévia some na hora (igual ao Dicionário).
        limparTimer();
        setMostrarPreview(false);
        if (!moveuRef.current) {
          pan.setValue({ x: 0, y: 0 });
          return;
        }
        if (cbRef.current.isDentroDoBecker(g.moveX, g.moveY)) {
          cbRef.current.onDrop(cbRef.current.atomo);
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
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          zIndex: ativo ? 50 : 1,
          elevation: ativo ? 8 : 0,
        },
      ]}
      {...panResponder.panHandlers}
      accessibilityRole="button"
      accessibilityLabel={`Sinal ${atomo.titulo}`}
      accessibilityHint="Segure para ver a prévia do vídeo e solte para fechar. Arraste até o béquer para usar no exercício."
    >
      <View style={[styles.cardInner, ativo && styles.cardInnerAtivo]}>
        {/* Borda menor colorida (interna) — a externa fica neutra. */}
        <View style={[styles.simboloBox, { borderColor: atomo.corTema, backgroundColor: '#fff' }]}>
          <Text style={[styles.simboloTexto, { color: atomo.corTema }]}>
            {atomo.simbolo}
          </Text>
        </View>
        <Text style={[styles.cardTitulo, { color: atomo.corTema }]} numberOfLines={1}>
          {atomo.titulo}
        </Text>
        <Text style={styles.cardDica} numberOfLines={1}>
          Segure p/ ver • arraste
        </Text>
      </View>
      {mostrarPreview && (
        <SinalHostingPopup
          titulo={atomo.titulo}
          videoUrl={videoUrl}
          corTema={atomo.corTema}
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
    minHeight: 128,
    borderWidth: 1.5,
    borderColor: '#dcd6ce',
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  cardInner: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cardInnerAtivo: {
    opacity: 0.92,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  simboloBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  simboloTexto: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardTitulo: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardDica: {
    fontSize: 10,
    color: '#8c7b7d',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
});
