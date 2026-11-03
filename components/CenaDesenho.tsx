import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ICONES_CENA } from '@/src/data/icones-librica';
import type { CenaId } from '@/src/data/separacao-heterogenea';

interface CenaDesenhoProps {
  cena: CenaId;
}

/** Desenhos das misturas (assets em `assets/images/icones librica`). */
export default function CenaDesenho({ cena }: CenaDesenhoProps) {
  return (
    <View style={styles.palco}>
      <Image source={ICONES_CENA[cena]} style={styles.icone} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  // O palco antigo tinha 150px de altura; 170 mantém os desenhos no
  // mesmo tamanho visual mesmo com a margem transparente dos PNGs.
  palco: {
    width: '100%',
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icone: {
    width: 170,
    height: 170,
  },
});
