import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { VidrariaId } from '@/src/data/vidrarias';

const VIDRO = '#546e7a';
const LIQUIDO = '#b3e5fc';
const CINZA = '#b0bec5';

interface VidrariaDesenhoProps {
  id: VidrariaId;
}

/** Desenhos estilizados das vidrarias feitos com Views (sem assets). */
export default function VidrariaDesenho({ id }: VidrariaDesenhoProps) {
  return <View style={styles.palco}>{desenhar(id)}</View>;
}

function tuboEnsaio() {
  return (
    <View style={styles.tubo}>
      <View style={styles.tuboLiquido} />
    </View>
  );
}

function becker() {
  return (
    <View style={styles.centro}>
      <View style={styles.beckerBoca} />
      <View style={styles.beckerCopo}>
        <View style={styles.beckerLiquido} />
      </View>
    </View>
  );
}

function pipetaGraduada() {
  return (
    <View style={styles.centroRow}>
      <View style={styles.pipetaTubo}>
        <View style={styles.tick} />
        <View style={styles.tick} />
        <View style={styles.tick} />
        <View style={styles.tick} />
      </View>
    </View>
  );
}

function pipetaVolumetrica() {
  return (
    <View style={styles.centro}>
      <View style={styles.pipetaVolTopo} />
      <View style={styles.pipetaVolBojo} />
      <View style={styles.pipetaVolBase} />
    </View>
  );
}

function proveta() {
  return (
    <View style={styles.centro}>
      <View style={styles.provetaCorpo}>
        <View style={styles.tick} />
        <View style={styles.tick} />
        <View style={styles.tick} />
      </View>
      <View style={styles.provetaBase} />
    </View>
  );
}

function balaoVolumetrico() {
  return (
    <View style={styles.centro}>
      <View style={styles.balaoGargalo} />
      <View style={styles.balaoBojo}>
        <View style={styles.balaoLiquido} />
      </View>
    </View>
  );
}

function pisseta() {
  return (
    <View style={styles.centro}>
      <View style={styles.pissetaBico} />
      <View style={styles.pissetaTampa} />
      <View style={styles.pissetaCorpo}>
        <View style={styles.pissetaLiquido} />
      </View>
    </View>
  );
}

function bureta() {
  return (
    <View style={styles.centro}>
      <View style={styles.buretaTubo}>
        <View style={styles.tick} />
        <View style={styles.tick} />
        <View style={styles.tick} />
      </View>
      <View style={styles.buretaTorneira} />
      <View style={styles.buretaBico} />
    </View>
  );
}

function erlenmeyer() {
  return (
    <View style={styles.centro}>
      <View style={styles.erlenGargalo} />
      <View style={styles.erlenCorpo} />
      <View style={styles.erlenLiquido} />
    </View>
  );
}

function vidroRelogio() {
  return (
    <View style={styles.centro}>
      <View style={styles.relogioPrato} />
    </View>
  );
}

function oculos() {
  return (
    <View style={styles.oculosLinha}>
      <View style={styles.oculosHaste} />
      <View style={styles.oculosLente} />
      <View style={styles.oculosPonte} />
      <View style={styles.oculosLente} />
      <View style={styles.oculosHaste} />
    </View>
  );
}

function desenhar(id: VidrariaId): React.ReactNode {
  switch (id) {
    case 'tubo-ensaio': return tuboEnsaio();
    case 'becker': return becker();
    case 'pipeta-graduada': return pipetaGraduada();
    case 'pipeta-volumetrica': return pipetaVolumetrica();
    case 'proveta': return proveta();
    case 'balao-volumetrico': return balaoVolumetrico();
    case 'pisseta': return pisseta();
    case 'bureta': return bureta();
    case 'erlenmeyer': return erlenmeyer();
    case 'vidro-relogio': return vidroRelogio();
    case 'oculos': return oculos();
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
  centroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tick: {
    width: 6,
    height: 2,
    borderRadius: 1,
    backgroundColor: VIDRO,
    alignSelf: 'flex-end',
    marginRight: 1,
    marginVertical: 3,
  },
  // Tubo de ensaio
  tubo: {
    width: 20,
    height: 52,
    borderWidth: 2,
    borderColor: VIDRO,
    borderRadius: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  tuboLiquido: {
    height: 20,
    backgroundColor: LIQUIDO,
  },
  // Becker
  beckerBoca: {
    width: 46,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: CINZA,
    borderWidth: 1,
    borderColor: VIDRO,
    zIndex: 2,
  },
  beckerCopo: {
    width: 40,
    height: 34,
    marginTop: -2,
    borderLeftWidth: 2.5,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: VIDRO,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  beckerLiquido: {
    height: 18,
    backgroundColor: LIQUIDO,
  },
  // Pipeta graduada
  pipetaTubo: {
    width: 10,
    height: 56,
    borderWidth: 2,
    borderColor: VIDRO,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 4,
  },
  // Pipeta volumétrica
  pipetaVolTopo: {
    width: 8,
    height: 16,
    borderWidth: 2,
    borderColor: VIDRO,
    borderBottomWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  pipetaVolBojo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: VIDRO,
    backgroundColor: LIQUIDO,
  },
  pipetaVolBase: {
    width: 8,
    height: 20,
    borderWidth: 2,
    borderColor: VIDRO,
    borderTopWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  // Proveta
  provetaCorpo: {
    width: 24,
    height: 46,
    borderWidth: 2,
    borderColor: VIDRO,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 4,
    justifyContent: 'flex-start',
  },
  provetaBase: {
    width: 38,
    height: 6,
    borderRadius: 3,
    backgroundColor: CINZA,
    borderWidth: 1,
    borderColor: VIDRO,
    marginTop: 1,
  },
  // Balão volumétrico
  balaoGargalo: {
    width: 12,
    height: 16,
    borderWidth: 2,
    borderColor: VIDRO,
    borderBottomWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  balaoBojo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: VIDRO,
    backgroundColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  balaoLiquido: {
    height: 14,
    backgroundColor: LIQUIDO,
  },
  // Pisseta
  pissetaBico: {
    width: 26,
    height: 7,
    borderWidth: 2,
    borderColor: VIDRO,
    borderRadius: 3,
    backgroundColor: '#fff',
    transform: [{ rotate: '-18deg' }],
    marginBottom: -3,
    marginLeft: 10,
  },
  pissetaTampa: {
    width: 16,
    height: 6,
    borderRadius: 2,
    backgroundColor: CINZA,
    borderWidth: 1,
    borderColor: VIDRO,
  },
  pissetaCorpo: {
    width: 30,
    height: 36,
    borderWidth: 2,
    borderColor: VIDRO,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  pissetaLiquido: {
    height: 20,
    backgroundColor: LIQUIDO,
  },
  // Bureta
  buretaTubo: {
    width: 11,
    height: 38,
    borderWidth: 2,
    borderColor: VIDRO,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 3,
  },
  buretaTorneira: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: CINZA,
    borderWidth: 1.5,
    borderColor: VIDRO,
    marginVertical: 1,
  },
  buretaBico: {
    width: 7,
    height: 9,
    borderWidth: 2,
    borderColor: VIDRO,
    borderTopWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  // Erlenmeyer
  erlenGargalo: {
    width: 14,
    height: 12,
    borderWidth: 2,
    borderColor: VIDRO,
    borderBottomWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  erlenCorpo: {
    width: 30,
    height: 0,
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderBottomWidth: 34,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255,255,255,0.55)',
  },
  erlenLiquido: {
    width: 32,
    height: 9,
    marginTop: -9,
    backgroundColor: LIQUIDO,
    opacity: 0.9,
  },
  // Vidro de relógio
  relogioPrato: {
    width: 50,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: VIDRO,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  // Óculos de proteção
  oculosLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oculosHaste: {
    width: 8,
    height: 4,
    backgroundColor: VIDRO,
    borderRadius: 2,
  },
  oculosLente: {
    width: 19,
    height: 17,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: VIDRO,
    backgroundColor: 'rgba(179,229,252,0.55)',
  },
  oculosPonte: {
    width: 7,
    height: 4,
    backgroundColor: VIDRO,
    borderRadius: 2,
  },
});
