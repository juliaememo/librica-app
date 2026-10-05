import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { IngredienteId } from '@/src/data/misturas';

const VIDRO = '#546e7a';

interface IngredienteDesenhoProps {
  id: IngredienteId;
}

/** Desenhos estilizados dos ingredientes feitos com Views (sem assets). */
export default function IngredienteDesenho({ id }: IngredienteDesenhoProps) {
  return <View style={styles.palco}>{desenhar(id)}</View>;
}

function agua() {
  return (
    <View style={styles.centro}>
      <View style={styles.gotaTriangulo} />
      <View style={styles.gotaCirculo}>
        <View style={styles.gotaBrilho} />
      </View>
    </View>
  );
}

function sal() {
  return (
    <View style={styles.centro}>
      <View style={styles.salGraos}>
        <View style={styles.salGrao} />
        <View style={styles.salGrao} />
        <View style={styles.salGrao} />
      </View>
      <View style={styles.salMonte} />
    </View>
  );
}

function oleo() {
  return (
    <View style={styles.centro}>
      <View style={styles.garrafaTampaMarrom} />
      <View style={styles.garrafaGargalo} />
      <View style={styles.garrafaCorpoAmbar}>
        <View style={styles.garrafaBrilho} />
      </View>
    </View>
  );
}

function arroz() {
  return (
    <View style={styles.arrozLinha}>
      <View style={[styles.graoArroz, { transform: [{ rotate: '-22deg' }] }]} />
      <View style={[styles.graoArroz, { transform: [{ rotate: '12deg' }] }]} />
      <View style={[styles.graoArroz, { transform: [{ rotate: '-6deg' }] }]} />
    </View>
  );
}

function feijao() {
  return (
    <View style={styles.centro}>
      <View style={styles.feijaoCorpo}>
        <View style={styles.feijaoBrilho} />
      </View>
    </View>
  );
}

function vinagre() {
  return (
    <View style={styles.centro}>
      <View style={styles.garrafaTampaEscura} />
      <View style={styles.garrafaGargalo} />
      <View style={styles.garrafaCorpoVerde}>
        <View style={styles.vinagreRotulo} />
      </View>
    </View>
  );
}

function desenhar(id: IngredienteId): React.ReactNode {
  switch (id) {
    case 'agua': return agua();
    case 'sal': return sal();
    case 'oleo': return oleo();
    case 'arroz': return arroz();
    case 'feijao': return feijao();
    case 'vinagre': return vinagre();
  }
}

const styles = StyleSheet.create({
  palco: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centro: {
    alignItems: 'center',
  },
  // Gota d'água
  gotaTriangulo: {
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#4fc3f7',
  },
  gotaCirculo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4fc3f7',
    marginTop: -4,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  gotaBrilho: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    opacity: 0.85,
  },
  // Monte de sal
  salGraos: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 2,
  },
  salGrao: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#cfd8dc',
  },
  salMonte: {
    width: 42,
    height: 20,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    borderWidth: 2,
    borderColor: '#90a4ae',
    borderBottomWidth: 0,
    backgroundColor: '#fff',
  },
  // Garrafas (óleo e vinagre)
  garrafaTampaMarrom: {
    width: 12,
    height: 6,
    borderRadius: 2,
    backgroundColor: '#8d6e63',
    borderWidth: 1,
    borderColor: VIDRO,
  },
  garrafaTampaEscura: {
    width: 12,
    height: 6,
    borderRadius: 2,
    backgroundColor: '#37474f',
  },
  garrafaGargalo: {
    width: 10,
    height: 8,
    borderWidth: 2,
    borderColor: VIDRO,
    borderBottomWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  garrafaCorpoAmbar: {
    width: 28,
    height: 32,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: VIDRO,
    backgroundColor: 'rgba(255,193,7,0.45)',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  garrafaBrilho: {
    width: 5,
    height: 20,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  garrafaCorpoVerde: {
    width: 26,
    height: 34,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: VIDRO,
    backgroundColor: 'rgba(102,187,106,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vinagreRotulo: {
    width: 22,
    height: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: VIDRO,
  },
  // Grãos de arroz
  arrozLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  graoArroz: {
    width: 20,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#a1887f',
    backgroundColor: '#fff',
    marginHorizontal: -2,
  },
  // Feijão
  feijaoCorpo: {
    width: 32,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#4e342e',
    backgroundColor: '#6d4c41',
    justifyContent: 'center',
    paddingLeft: 7,
  },
  feijaoBrilho: {
    width: 9,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#a1887f',
  },
});
