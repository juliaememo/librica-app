import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import VidrariaDesenho from '@/components/VidrariaDesenho';
import SinalHostingPopup from '@/components/SinalHostingPopup';
import { getSinalHostingUrl } from '@/src/services/sinaisHosting';
import type { Vidraria } from '@/src/data/vidrarias';

interface VidrariaCardProps {
  vidraria: Vidraria;
  /** Card tocado como resposta (destaque + verificado). */
  selecionado: boolean;
  /** Toque rápido escolhe a vidraria como resposta. */
  onSelect: (vidraria: Vidraria) => void;
  /** De que lado abre a prévia do vídeo (igual ao Dicionário). */
  lado?: 'esquerda' | 'direita';
  /** Primeira fileira abre a prévia para baixo (não estoura o topo). */
  abreParaBaixo?: boolean;
}

/**
 * Card com o DESENHO da vidraria (não só o ícone).
 * Igual ao Dicionário: segurar mostra a prévia do vídeo e soltar fecha.
 * Toque rápido seleciona a vidraria (o botão Concluir verifica a resposta).
 */
export default function VidrariaCard({
  vidraria,
  selecionado,
  onSelect,
  lado = 'direita',
  abreParaBaixo = false,
}: VidrariaCardProps) {
  const [mostrarPreview, setMostrarPreview] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mostrouPreviewRef = useRef<boolean>(false);
  const suprimirPressRef = useRef<boolean>(false);

  const videoUrl = getSinalHostingUrl(vidraria.nome);
  const ativo = mostrarPreview;

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
    // Segurou (viu a prévia) e soltou: não seleciona, como no Dicionário.
    if (suprimirPressRef.current) {
      suprimirPressRef.current = false;
      return;
    }
    onSelect(vidraria);
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
    // Soltou: a prévia some na hora.
    if (mostrouPreviewRef.current) {
      suprimirPressRef.current = true;
    }
    limparTimer();
    setMostrarPreview(false);
  };

  return (
    <Pressable
      style={[
        styles.card,
        { backgroundColor: vidraria.corFundo },
        selecionado ? styles.cardSelecionado : styles.cardNormal,
        selecionado && { borderColor: vidraria.corTema },
        ativo && styles.cardAtivo,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`${vidraria.nome}${selecionado ? ', selecionada' : ''}`}
      accessibilityHint="Toque para escolher. Segure para ver a prévia do vídeo e solte para fechar."
    >
      {({ pressed }) => (
        <>
          <View style={[styles.cardInner, (pressed || ativo) && styles.cardInnerDim]}>
            {selecionado && (
              <View style={styles.check}>
                <FontAwesome name="check-circle" size={22} color={vidraria.corTema} />
              </View>
            )}
              <VidrariaDesenho id={vidraria.id} />
              <Text style={[styles.cardTitulo, { color: vidraria.corTema }]}>
                {vidraria.nome}
              </Text>
          </View>
          {ativo && (
            <SinalHostingPopup
              titulo={vidraria.nome}
              videoUrl={videoUrl}
              corTema={vidraria.corTema}
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
    flex: 1,
    minHeight: 128,
    borderRadius: 16,
    // Sem elevation/sombra: no Android, sombra sobre fundo transparente
    // vira aquela faixa cinza sólida ao redor do card.
    elevation: 0,
  },
  cardNormal: {
    borderWidth: 1.5,
    borderColor: '#dcd6ce',
  },
  cardSelecionado: {
    borderWidth: 2.5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardAtivo: {
    zIndex: 10,
    elevation: 0,
  },
  cardInner: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'transparent',
  },
  cardInnerDim: {
    opacity: 0.6,
  },
  check: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 11,
  },
  cardTitulo: {
    width: '100%',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 13,
  },
});
