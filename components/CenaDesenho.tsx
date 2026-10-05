import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { CenaId } from '@/src/data/separacao-heterogenea';

const VIDRO = '#546e7a';
const CINZA = '#b0bec5';

interface CenaDesenhoProps {
  cena: CenaId;
}

/** Desenhos das misturas feitos com Views (sem assets). */
export default function CenaDesenho({ cena }: CenaDesenhoProps) {
  return <View style={styles.palco}>{desenhar(cena)}</View>;
}

function graoFeijao(pequeno = false) {
  return (
    <View
      style={[
        styles.feijao,
        pequeno && styles.feijaoPequeno,
      ]}
    />
  );
}

function graoArroz() {
  return <View style={styles.arroz} />;
}

function pontoSal() {
  return <View style={styles.sal} />;
}

/** Tela 1: peneira com sal e feijão. */
function peneira() {
  return (
    <View style={styles.centro}>
      <View style={styles.peneiraAro}>
        <View style={styles.peneiraMalha}>
          <View style={styles.peneiraLinhaH} />
          <View style={[styles.peneiraLinhaH, { top: 22 }]} />
          <View style={styles.peneiraLinhaV} />
          <View style={[styles.peneiraLinhaV, { left: 30 }]} />
          <View style={styles.peneiraConteudo}>
            {pontoSal()}{pontoSal()}{graoFeijao(true)}{pontoSal()}{graoFeijao(true)}
          </View>
        </View>
      </View>
      <View style={styles.peneiraCabo} />
    </View>
  );
}

/** Tela 2: ventilador + cascas e feijão no ar. */
function ventilador() {
  return (
    <View style={styles.centro}>
      <View style={styles.ventoLinha}>
        {graoFeijao(true)}
        <View style={styles.casca} />
        {graoFeijao(true)}
        <View style={styles.casca} />
      </View>
      <View style={styles.ventiladorCorpo}>
        <View style={[styles.ventoinha, { transform: [{ rotate: '0deg' }] }]} />
        <View style={[styles.ventoinha, { transform: [{ rotate: '60deg' }] }]} />
        <View style={[styles.ventoinha, { transform: [{ rotate: '120deg' }] }]} />
        <View style={styles.ventiladorMiolo} />
      </View>
      <View style={styles.ventiladorPe} />
    </View>
  );
}

/** Tela 3: prato com arroz e feijão. */
function pratoArroz() {
  return (
    <View style={styles.centro}>
      <View style={styles.pratoLinha}>
        {graoArroz()}{graoFeijao()}{graoArroz()}{graoFeijao()}{graoArroz()}
      </View>
      <View style={styles.prato}>
        <View style={styles.pratoFundo} />
      </View>
    </View>
  );
}

/** Tela 4: prato com clipes e sal. */
function pratoClipes() {
  return (
    <View style={styles.centro}>
      <View style={styles.pratoLinha}>
        <View style={styles.clipe} />
        {pontoSal()}{pontoSal()}
        <View style={styles.clipe} />
        {pontoSal()}
        <View style={styles.clipe} />
      </View>
      <View style={styles.prato}>
        <View style={styles.pratoFundo} />
      </View>
    </View>
  );
}

/** Tela 5: bacia com água, feijão e farinha. */
function bacia() {
  return (
    <View style={styles.centro}>
      <View style={styles.baciaAgua}>
        <View style={styles.farinhaNuvem}>
          <View style={styles.farinhaBola} />
          <View style={[styles.farinhaBola, styles.farinhaBolaMeio]} />
          <View style={styles.farinhaBola} />
        </View>
        <View style={styles.baciaFeijoes}>
          {graoFeijao()}{graoFeijao()}{graoFeijao()}
        </View>
      </View>
      <View style={styles.baciaCorpo} />
    </View>
  );
}

/** Tela 6: copo com água e terra no fundo. */
function copoTerra() {
  return (
    <View style={styles.centro}>
      <View style={styles.copo}>
        <View style={styles.copoAgua}>
          <View style={styles.copoTerra}>
            <View style={styles.terraOndas}>
              <View style={styles.terraOnda} />
              <View style={[styles.terraOnda, styles.terraOndaMeio]} />
              <View style={styles.terraOnda} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

/** Tela 7: filtro de café com pó e água. */
function filtroCafe() {
  return (
    <View style={styles.centro}>
      <View style={styles.filtroCone}>
        <View style={styles.filtroPo} />
      </View>
      <View style={styles.filtroGota} />
      <View style={styles.filtroXicara}>
        <View style={styles.filtroCafeLiquido} />
      </View>
    </View>
  );
}

/** Tela 8: máquina de lavar. */
function maquina() {
  return (
    <View style={styles.centro}>
      <View style={styles.maquinaCorpo}>
        <View style={styles.maquinaPainel}>
          <View style={styles.maquinaBotao} />
          <View style={styles.maquinaBotao} />
        </View>
        <View style={styles.maquinaPorta}>
          <View style={styles.maquinaAgua}>
            <View style={styles.maquinaEspuma} />
          </View>
        </View>
      </View>
    </View>
  );
}

/** Tela 9: copo com água e óleo separados (óleo por cima, pois flutua).
 *  Com justifyContent flex-end, o ÚLTIMO filho fica no fundo. */
function copoOleo() {
  return (
    <View style={styles.centro}>
      <View style={styles.copo}>
        <View style={styles.copoOleo} />
        <View style={styles.copoAguaCheia} />
      </View>
    </View>
  );
}

/** Módulo 7, tela 1: copo com sal e água (solução). */
function copoSalAgua() {
  return (
    <View style={styles.centro}>
      <View style={styles.copo}>
        <View style={styles.copoSolucao}>
          <View style={styles.solucaoSalLinha}>
            <View style={styles.salDissolvido} />
            <View style={styles.salDissolvido} />
            <View style={styles.salDissolvido} />
            <View style={styles.salDissolvido} />
          </View>
        </View>
      </View>
    </View>
  );
}

/** Módulo 7, tela 2: copo com sal, água e areia no fundo. */
function copoAreia() {
  return (
    <View style={styles.centro}>
      <View style={styles.copo}>
        <View style={styles.copoSolucao}>
          <View style={styles.copoAreia}>
            <View style={styles.areiaOndas}>
              <View style={styles.areiaOnda} />
              <View style={styles.areiaOnda} />
              <View style={styles.areiaOnda} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

/** Módulo 7, tela 3: copo com álcool e água (límpido, com bolhas). */
function copoAlcool() {
  return (
    <View style={styles.centro}>
      <View style={styles.copo}>
        <View style={styles.copoAlcool}>
          <View style={styles.bolha} />
          <View style={[styles.bolha, styles.bolhaMeio]} />
          <View style={styles.bolha} />
        </View>
      </View>
    </View>
  );
}

function desenhar(cena: CenaId): React.ReactNode {
  switch (cena) {
    case 'peneira': return peneira();
    case 'ventilador': return ventilador();
    case 'prato-arroz': return pratoArroz();
    case 'prato-clipes': return pratoClipes();
    case 'bacia': return bacia();
    case 'copo-terra': return copoTerra();
    case 'filtro-cafe': return filtroCafe();
    case 'maquina': return maquina();
    case 'copo-oleo': return copoOleo();
    case 'copo-sal-agua': return copoSalAgua();
    case 'copo-areia': return copoAreia();
    case 'copo-alcool': return copoAlcool();
  }
}

const styles = StyleSheet.create({
  palco: {
    width: '100%',
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  centro: {
    alignItems: 'center',
  },
  feijao: {
    width: 20,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#4e342e',
    backgroundColor: '#6d4c41',
    marginHorizontal: 2,
  },
  feijaoPequeno: {
    width: 14,
    height: 10,
    borderRadius: 5,
  },
  arroz: {
    width: 14,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#a1887f',
    backgroundColor: '#fff',
    marginHorizontal: 2,
  },
  sal: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#cfd8dc',
    marginHorizontal: 1,
  },
  // Peneira
  peneiraAro: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 6,
    borderColor: '#8d6e63',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eceff1',
  },
  peneiraMalha: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: CINZA,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  peneiraLinhaH: {
    position: 'absolute',
    top: 36,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: CINZA,
  },
  peneiraLinhaV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 44,
    width: 1,
    backgroundColor: CINZA,
  },
  peneiraConteudo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  peneiraCabo: {
    width: 56,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8d6e63',
    marginTop: -4,
    marginLeft: 90,
    transform: [{ rotate: '24deg' }],
  },
  // Ventilador
  ventoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  casca: {
    width: 16,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#a1887f',
    backgroundColor: '#efebe9',
    marginHorizontal: 3,
    transform: [{ rotate: '18deg' }],
  },
  ventiladorCorpo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: VIDRO,
    backgroundColor: '#eceff1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ventoinha: {
    position: 'absolute',
    width: 60,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#90a4ae',
  },
  ventiladorMiolo: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: VIDRO,
  },
  ventiladorPe: {
    width: 10,
    height: 22,
    backgroundColor: VIDRO,
    borderRadius: 3,
    marginTop: -2,
  },
  // Pratos
  pratoLinha: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: -8,
    zIndex: 2,
  },
  prato: {
    width: 150,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: VIDRO,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pratoFundo: {
    width: 110,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#eceff1',
  },
  clipe: {
    width: 10,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#78909c',
    marginHorizontal: 3,
  },
  // Bacia
  baciaAgua: {
    width: 150,
    height: 56,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#b3e5fc',
    borderWidth: 2,
    borderColor: VIDRO,
    borderBottomWidth: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  farinhaNuvem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  farinhaBola: {
    width: 22,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: -4,
  },
  farinhaBolaMeio: {
    width: 26,
    height: 20,
    borderRadius: 10,
    marginBottom: 2,
  },
  baciaFeijoes: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  baciaCorpo: {
    width: 158,
    height: 26,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#90a4ae',
    borderWidth: 2,
    borderColor: VIDRO,
    borderTopWidth: 0,
    marginTop: -2,
  },
  // Copos
  copo: {
    width: 84,
    height: 96,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: VIDRO,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  copoAgua: {
    height: 62,
    backgroundColor: '#29b6f6',
    justifyContent: 'flex-end',
  },
  copoTerra: {
    height: 26,
    backgroundColor: '#6d4c41',
  },
  terraOndas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -7,
  },
  terraOnda: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#6d4c41',
  },
  terraOndaMeio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginTop: -4,
  },
  copoOleo: {
    height: 34,
    backgroundColor: '#ffb300',
  },
  copoAguaCheia: {
    height: 40,
    backgroundColor: '#29b6f6',
  },
  // Copos do módulo 7
  copoSolucao: {
    height: 66,
    backgroundColor: '#4fc3f7',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  solucaoSalLinha: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  salDissolvido: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fff',
    opacity: 0.9,
  },
  copoAreia: {
    height: 24,
    backgroundColor: '#dcc9a3',
  },
  areiaOndas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -6,
  },
  areiaOnda: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#dcc9a3',
  },
  copoAlcool: {
    height: 66,
    backgroundColor: '#e1f5fe',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  bolha: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#4fc3f7',
    backgroundColor: '#fff',
  },
  bolhaMeio: {
    marginBottom: 18,
  },
  // Filtro de café
  filtroCone: {
    width: 30,
    height: 0,
    borderLeftWidth: 26,
    borderRightWidth: 26,
    borderTopWidth: 44,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
    alignItems: 'center',
  },
  filtroPo: {
    width: 34,
    height: 10,
    backgroundColor: '#4e342e',
    borderRadius: 3,
    marginTop: -44,
  },
  filtroGota: {
    width: 8,
    height: 10,
    borderRadius: 4,
    backgroundColor: '#4e342e',
    marginVertical: 2,
  },
  filtroXicara: {
    width: 56,
    height: 34,
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
  filtroCafeLiquido: {
    height: 16,
    backgroundColor: '#4e342e',
  },
  // Máquina de lavar
  maquinaCorpo: {
    width: 110,
    height: 120,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: VIDRO,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 8,
    gap: 8,
  },
  maquinaPainel: {
    flexDirection: 'row',
    gap: 8,
  },
  maquinaBotao: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: CINZA,
  },
  maquinaPorta: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: VIDRO,
    backgroundColor: '#e1f5fe',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  maquinaAgua: {
    width: 56,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#4fc3f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  maquinaEspuma: {
    width: 34,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    opacity: 0.85,
  },
});
