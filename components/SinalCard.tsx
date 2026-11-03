import React from 'react';
import { Keyboard, Pressable, StyleSheet } from 'react-native';
import { Entypo, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';
import SinalHostingPopup from '@/components/SinalHostingPopup';
import { getSinalHostingUrl } from '@/src/services/sinaisHosting';
import {
  esconderPreviewSinal,
  mostrarPreviewSinal,
  usePreviewSinal,
} from '@/src/services/sinalPreviewStore';
import type { Sinal } from '@/src/data/sinais';

interface SinalCardProps {
  sinal: Sinal;
  lado: 'esquerda' | 'direita';
  abreParaBaixo: boolean;
}

/**
 * Card de sinal do Dicionário: toque simples abre a prévia do vídeo (em
 * loop) ao lado do card; toque de novo fecha. Só uma prévia fica aberta
 * por vez — tocar em outro sinal troca direto para ele.
 */
export default function SinalCard({ sinal, lado, abreParaBaixo }: SinalCardProps) {
  const previa = usePreviewSinal();
  const ativo = previa?.titulo === sinal.titulo;
  const videoUrl = getSinalHostingUrl(sinal.titulo);

  const handlePress = () => {
    // Fecha o teclado da busca: a prévia precisa de espaço na tela.
    Keyboard.dismiss();
    if (ativo) {
      esconderPreviewSinal(sinal.titulo);
      return;
    }
    // Publica já no toque (sem esperar a montagem do pop-up) para fechar
    // imediatamente a prévia de outro sinal, se houver.
    mostrarPreviewSinal({
      titulo: sinal.titulo,
      videoUrl,
      corTema: sinal.corTema,
      ancora: null,
      lado,
      abreParaBaixo,
    });
  };

  function renderIcone() {
    if (sinal.simbolo) {
      return (
        <Text style={[styles.simboloTexto, { color: sinal.corTema, fontSize: sinal.tamanhoSimbolo ?? 32 }]}>
          {sinal.simbolo}
        </Text>
      );
    }
    const nome = sinal.icone as any;
    const cor = sinal.corTema;
    switch (sinal.iconeLib) {
      case 'fa6':
        return <FontAwesome6 name={nome} size={36} color={cor} />;
      case 'material':
        return <MaterialCommunityIcons name={nome} size={36} color={cor} />;
      case 'ionicons':
        return <Ionicons name={nome} size={36} color={cor} />;
      case 'entypo':
        return <Entypo name={nome} size={36} color={cor} />;
      default:
        return <FontAwesome5 name={nome} size={36} color={cor} />;
    }
  }

  return (
    <Pressable
      style={[styles.card, { borderColor: sinal.corTema }, ativo && styles.cardAtivo]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Sinal ${sinal.titulo}`}
      accessibilityHint="Toque para ver a prévia do vídeo em loop. Toque de novo para fechar."
      accessibilityState={{ expanded: ativo }}
    >
      {({ pressed }) => (
        <>
          {/* Só o conteúdo interno escurece no toque. O pop-up é irmão
              deste View, então fica sempre com 100% de opacidade. */}
          <View
            style={[styles.cardInner, pressed && styles.cardInnerPressed]}
          >
            <View style={[styles.iconBox, { backgroundColor: '#fff', borderColor: sinal.corTema }]}>
              {renderIcone()}
            </View>
            <Text style={[styles.cardTitle, { color: sinal.corTema }]} numberOfLines={3}>
              {sinal.titulo}
            </Text>
          </View>
          {ativo && (
            <SinalHostingPopup
              titulo={sinal.titulo}
              videoUrl={videoUrl}
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
    minHeight: 160,
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
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
  },
  simboloTexto: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
