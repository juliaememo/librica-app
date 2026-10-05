import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import IngredienteDesenho from '@/components/IngredienteDesenho';
import SinalHostingPopup from '@/components/SinalHostingPopup';
import { getSinalHostingUrl } from '@/src/services/sinaisHosting';
import type { Ingrediente } from '@/src/data/misturas';

interface IngredienteCardProps {
  ingrediente: Ingrediente;
  /** Chamado ao soltar o card dentro do béquer OU ao tocar no card. */
  onDrop: (ingrediente: Ingrediente) => void;
  /** Diz se um ponto da tela (moveX/moveY) está dentro do béquer. */
  isDentroDoBecker: (x: number, y: number) => boolean;
  /** Avisa o pai quando começa/termina o arrasto (p/ destacar o béquer). */
  onArrastando?: (arrastando: boolean, sobreBecker: boolean) => void;
  /** Chamado ao tocar o card (p/ o pai remediar a posição do béquer). */
  onPrimeiroToque?: () => void;
  /** De que lado abre a prévia do vídeo (igual ao Dicionário). */
  lado?: 'esquerda' | 'direita';
  /** A prévia abre para cima (a grade é fixa, sem corte). */
  abreParaBaixo?: boolean;
}

/**
 * Ingrediente da mistura com o DESENHO (não letras).
 * Igual ao Dicionário: SÓ segurar mostra a prévia do vídeo (soltar fecha).
 * Toque coloca direto no béquer; arrastar até o béquer também coloca.
 */
export default function IngredienteCard({
  ingrediente,
  onDrop,
  isDentroDoBecker,
  onArrastando,
  onPrimeiroToque,
  lado = 'direita',
  abreParaBaixo = false,
}: IngredienteCardProps) {
  const [mostrarPreview, setMostrarPreview] = useState<boolean>(false);
  const [arrastando, setArrastando] = useState<boolean>(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveuRef = useRef<boolean>(false);
  const sobreBeckerRef = useRef<boolean>(false);

  const videoUrl = getSinalHostingUrl(ingrediente.nome);
  const ativo = mostrarPreview || arrastando;

  // O PanResponder é criado uma vez: acessa as props via ref p/ nunca
  // usar callbacks desatualizadas do primeiro render.
  const cbRef = useRef({ onDrop, isDentroDoBecker, onPrimeiroToque, onArrastando, ingrediente });
  cbRef.current = { onDrop, isDentroDoBecker, onPrimeiroToque, onArrastando, ingrediente };

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
    cbRef.current.onArrastando?.(false, false);
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
          // Toque: coloca direto no béquer (sem vídeo).
          pan.setValue({ x: 0, y: 0 });
          cbRef.current.onDrop(cbRef.current.ingrediente);
          return;
        }
        if (cbRef.current.isDentroDoBecker(g.moveX, g.moveY)) {
          cbRef.current.onDrop(cbRef.current.ingrediente);
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
      accessibilityLabel={`${ingrediente.nome}`}
      accessibilityHint="Segure para ver a prévia do vídeo e solte para fechar. Toque ou arraste até o béquer para usar na mistura."
    >
      <View style={[styles.cardInner, ativo && styles.cardInnerAtivo]}>
        <IngredienteDesenho id={ingrediente.id} />
        <Text style={[styles.cardTitulo, { color: ingrediente.corTema }]}>
          {ingrediente.nome}
        </Text>
      </View>
      {mostrarPreview && (
        <SinalHostingPopup
          titulo={ingrediente.nome}
          videoUrl={videoUrl}
          corTema={ingrediente.corTema}
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
    minHeight: 104,
    borderWidth: 1.5,
    borderColor: '#dcd6ce',
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  cardInner: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
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
  cardTitulo: {
    width: '100%',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
