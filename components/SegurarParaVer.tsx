import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import SinalHostingPopup from '@/components/SinalHostingPopup';
import { getSinalHostingUrl } from '@/src/services/sinaisHosting';

interface SegurarParaVerProps {
  /** Chave do vídeo no Hosting (ex.: nome do sinal). */
  titulo: string;
  corTema: string;
  lado?: 'esquerda' | 'direita';
  abreParaBaixo?: boolean;
  /** Toque rápido (sem segurar p/ a prévia). */
  onTap?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * Envolve qualquer conteúdo com o comportamento do Dicionário:
 * segurar mostra a prévia do vídeo e soltar fecha na hora.
 * Toque rápido dispara onTap (segurar+soltar não dispara).
 */
export default function SegurarParaVer({
  titulo,
  corTema,
  lado = 'direita',
  abreParaBaixo = false,
  onTap,
  style,
  children,
  accessibilityLabel,
  accessibilityHint,
}: SegurarParaVerProps) {
  const [mostrarPreview, setMostrarPreview] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mostrouPreviewRef = useRef<boolean>(false);
  const suprimirPressRef = useRef<boolean>(false);

  const videoUrl = getSinalHostingUrl(titulo);

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

  const handlePress = () => {
    if (suprimirPressRef.current) {
      suprimirPressRef.current = false;
      return;
    }
    onTap?.();
  };

  const handlePressIn = () => {
    mostrouPreviewRef.current = false;
    limparTimer();
    // 180ms: mesmo tempo do Dicionário.
    timerRef.current = setTimeout(() => {
      mostrouPreviewRef.current = true;
      setMostrarPreview(true);
    }, 180);
  };

  const handlePressOut = () => {
    if (mostrouPreviewRef.current) {
      suprimirPressRef.current = true;
    }
    limparTimer();
    setMostrarPreview(false);
  };

  return (
    <Pressable
      style={[style, mostrarPreview && styles.ativo]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? titulo}
      accessibilityHint={
        accessibilityHint ?? 'Toque para escolher. Segure para ver a prévia do vídeo e solte para fechar.'
      }
    >
      {({ pressed }) => (
        <>
          <View style={[styles.conteudo, (pressed || mostrarPreview) && styles.dim]}>
            {children}
          </View>
          {mostrarPreview && (
            <SinalHostingPopup
              titulo={titulo}
              videoUrl={videoUrl}
              corTema={corTema}
              lado={lado}
              abreParaBaixo={abreParaBaixo}
            />
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ativo: {
    zIndex: 10,
    elevation: 0,
  },
  conteudo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dim: {
    opacity: 0.6,
  },
});
