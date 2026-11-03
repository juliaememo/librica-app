import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ICONES_VIDRARIA } from '@/src/data/icones-librica';
import type { VidrariaId } from '@/src/data/vidrarias';

interface VidrariaDesenhoProps {
  id: VidrariaId;
}

/** Desenhos das vidrarias (assets em `assets/images/icones librica`). */
export default function VidrariaDesenho({ id }: VidrariaDesenhoProps) {
  return (
    <View style={styles.palco}>
      <Image source={ICONES_VIDRARIA[id]} style={styles.icone} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  // O palco antigo tinha 64x64; 72 compensa a margem transparente dos PNGs
  // para o desenho ficar no tamanho parecido com o anterior.
  palco: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icone: {
    width: '100%',
    height: '100%',
  },
});
