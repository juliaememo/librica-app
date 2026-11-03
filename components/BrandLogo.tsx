import React from 'react';
import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

/**
 * Logo oficial do app.
 *
 * Para trocar a logo, substitua apenas o arquivo:
 *   assets/images/librica-icon.png
 *
 * Use um PNG quadrado (1024x1024) com fundo transparente.
 * O mesmo arquivo é usado no splash nativo (configurado em app.json),
 * então a tela de carregamento e a tela inicial ficam sempre iguais.
 */
const LOGO_SOURCE = require('../assets/images/librica-icon.png');

type Props = {
  /** Lado do quadrado da imagem, em pixels. */
  size?: number;
  /** Mostra o nome "LIBRICA" embaixo da imagem. */
  showWordmark?: boolean;
  /** Cor do nome quando `showWordmark` está ativo. */
  wordmarkColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function BrandLogo({
  size = 96,
  showWordmark = false,
  wordmarkColor = '#7B3E52',
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={LOGO_SOURCE}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="Logo do LIBRICA"
      />
      {showWordmark && (
        <Text style={[styles.wordmark, { color: wordmarkColor, marginTop: size * 0.16 }]}>
          LIBRICA
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  wordmark: {
    fontFamily: 'Gabarito-Black',
    fontSize: 40,
    letterSpacing: 1,
  },
});
