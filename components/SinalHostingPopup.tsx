import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  esconderPreviewSinal,
  mostrarPreviewSinal,
} from '@/src/services/sinalPreviewStore';

interface SinalHostingPopupProps {
  titulo: string;
  videoUrl: string | null;
  corTema?: string;
  /** Lado preferido da prévia em relação ao card (com ajuste p/ caber). */
  lado?: 'esquerda' | 'direita';
  /** Cards de cima abrem para baixo (com ajuste p/ caber). */
  abreParaBaixo?: boolean;
}

export const POPUP_LARGURA = 150;

/**
 * Ponte de compatibilidade: os cards continuam renderizando
 * `<SinalHostingPopup>` condicionalmente ao segurar. Aqui nada visível é
 * desenhado — só um marcador invisível do tamanho do card para medir onde
 * ele está na tela (`measureInWindow`) e publicar no store global. O
 * `SinalPreviewOverlay` da raiz desenha a prévia pequena ao lado do ícone,
 * sempre inteiramente visível e sem corte.
 */
export default function SinalHostingPopup({
  titulo,
  videoUrl,
  corTema = '#7B3E52',
  lado = 'direita',
  abreParaBaixo = false,
}: SinalHostingPopupProps) {
  const marcadorRef = useRef<View | null>(null);

  useEffect(() => {
    mostrarPreviewSinal({ titulo, videoUrl, corTema, ancora: null, lado, abreParaBaixo });

    const quadro = requestAnimationFrame(() => {
      try {
        marcadorRef.current?.measureInWindow((x: number, y: number, largura: number, altura: number) => {
          if (typeof x === 'number' && typeof y === 'number' && x > -10000 && y > -10000) {
            mostrarPreviewSinal({
              titulo,
              videoUrl,
              corTema,
              ancora: { x, y, largura, altura },
              lado,
              abreParaBaixo,
            });
          }
        });
      } catch {
        // Sem âncora: o overlay usa o centro como fallback.
      }
    });

    return () => {
      cancelAnimationFrame(quadro);
      esconderPreviewSinal(titulo);
    };
  }, [titulo, videoUrl, corTema, lado, abreParaBaixo]);

  return (
    <View
      ref={marcadorRef}
      collapsable={false}
      pointerEvents="none"
      style={styles.medidor}
    />
  );
}

const styles = StyleSheet.create({
  // Preenche o card inteiro (sem afetar layout/toque): assim a medida
  // traz x, y, largura e altura reais do card, e a prévia pode colar nele.
  medidor: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
});
