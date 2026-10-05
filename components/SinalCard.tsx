import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';
import SinalHostingPopup from '@/components/SinalHostingPopup';
import { getSinalHostingUrl } from '@/src/services/sinaisHosting';
import type { Sinal } from '@/src/data/sinais';

interface SinalCardProps {
  sinal: Sinal;
  lado: 'esquerda' | 'direita';
  abreParaBaixo: boolean;
  /** Toque curto. Se omitido, o card só mostra a prévia ao segurar. */
  onTap?: (sinal: Sinal) => void;
}

/**
 * Card de sinal igual ao do Dicionário: toque curto dispara onTap,
 * segurar abre a prévia do vídeo (mesmo vídeo do Hosting) e
 * soltar fecha na hora.
 */
export default function SinalCard({ sinal, lado, abreParaBaixo, onTap }: SinalCardProps) {
  const [mostrarPreview, setMostrarPreview] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mostrouPreviewRef = useRef<boolean>(false);
  const suprimirPressRef = useRef<boolean>(false);

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
    onTap?.(sinal);
  };

  const handlePressIn = () => {
    mostrouPreviewRef.current = false;
    limparTimer();
    // 180ms: rápido para aparecer, mas sem piscar num toque normal.
    timerRef.current = setTimeout(() => {
      mostrouPreviewRef.current = true;
      setMostrarPreview(true);
    }, 180);
  };

  const handlePressOut = () => {
    // Soltou: a prévia some na hora (o player desmonta e o vídeo para).
    if (mostrouPreviewRef.current) {
      suprimirPressRef.current = true;
    }
    limparTimer();
    setMostrarPreview(false);
  };

  const ativo = mostrarPreview;

  return (
    <Pressable
      style={[styles.card, { borderColor: sinal.corTema }, ativo && styles.cardAtivo]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Sinal ${sinal.titulo}`}
      accessibilityHint="Toque para abrir o detalhe. Segure para ver a prévia do vídeo e solte para fechar."
    >
      {({ pressed }) => (
        <>
          {/* Só o conteúdo interno escurece no toque. O pop-up é irmão
              deste View, então fica sempre com 100% de opacidade. */}
          <View
            style={[styles.cardInner, (pressed || ativo) && styles.cardInnerPressed]}
          >
            <View style={[styles.iconBox, { backgroundColor: '#fff', borderColor: sinal.corTema }]}>
              <FontAwesome5 name={sinal.icone as any} size={36} color={sinal.corTema} />
            </View>
            <Text style={[styles.cardTitle, { color: sinal.corTema }]} numberOfLines={1}>
              {sinal.titulo}
            </Text>
          </View>
          {ativo && (
            <SinalHostingPopup
              titulo={sinal.titulo}
              videoUrl={getSinalHostingUrl(sinal.titulo)}
              corTema={sinal.corTema}
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
  card: {
    width: '48%',
    aspectRatio: 1,
    borderWidth: 1.5,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: 'transparent',
    // Sem elevation/sombra: no Android, sombra sobre fundo transparente
    // vira aquela faixa cinza sólida ao redor do card.
    elevation: 0,
  },
  cardAtivo: {
    zIndex: 10,
    elevation: 0,
  },
  cardInner: {
    flex: 1,
    width: '100%',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // Transparente de propósito: sem isso, o View temático pinta de preto
    // no modo escuro do celular.
    backgroundColor: 'transparent',
  },
  cardInnerPressed: {
    opacity: 0.6,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
