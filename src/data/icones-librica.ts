// Desenhos dos exercícios (assets em `assets/images/icones librica`).
// Centraliza os requires para que os componentes só escolham o ícone pelo id.

import type { ImageSourcePropType } from 'react-native';
import type { CenaId } from '@/src/data/separacao-heterogenea';
import type { VidrariaId } from '@/src/data/vidrarias';

export const ICONES_VIDRARIA: Record<VidrariaId, ImageSourcePropType> = {
  'tubo-ensaio': require('@/assets/images/icones librica/tubo-de-ensaio.png'),
  becker: require('@/assets/images/icones librica/becker.png'),
  'pipeta-graduada': require('@/assets/images/icones librica/pipeta-graduada.png'),
  'pipeta-volumetrica': require('@/assets/images/icones librica/pipeta-volumetrica.png'),
  proveta: require('@/assets/images/icones librica/proveta.png'),
  'balao-volumetrico': require('@/assets/images/icones librica/balao-volumetrico.png'),
  pisseta: require('@/assets/images/icones librica/pisseta.png'),
  bureta: require('@/assets/images/icones librica/bureta.png'),
  erlenmeyer: require('@/assets/images/icones librica/erlenmeyer.png'),
  'vidro-relogio': require('@/assets/images/icones librica/vidro-de-relogio.png'),
  oculos: require('@/assets/images/icones librica/oculos-de-protecao.png'),
};

export const ICONES_CENA: Record<CenaId, ImageSourcePropType> = {
  peneira: require('@/assets/images/icones librica/peneira-com-feijao-e-sal.png'),
  ventilador: require('@/assets/images/icones librica/ventilador-com-feijao-e-cascas-de-alho.png'),
  'prato-arroz': require('@/assets/images/icones librica/prato-com-arroz-e-feijao.png'),
  'prato-clipes': require('@/assets/images/icones librica/prato-com-sal-e-clipes.png'),
  bacia: require('@/assets/images/icones librica/bacia-com-agua-feijao-e-farinha.png'),
  'copo-terra': require('@/assets/images/icones librica/copo-com-agua-e-terra-no-fundo.png'),
  'filtro-cafe': require('@/assets/images/icones librica/filtro-com-po-de-cafe-e-agua.png'),
  maquina: require('@/assets/images/icones librica/maquina-de-lavar.png'),
  'copo-oleo': require('@/assets/images/icones librica/copo-com-agua-e-oleo.png'),
  'copo-sal-agua': require('@/assets/images/icones librica/copo-com-agua-e-sal.png'),
  'copo-areia': require('@/assets/images/icones librica/copo-com-agua-areia-e-sal.png'),
  'copo-alcool': require('@/assets/images/icones librica/copo-com-agua-e-alcool.png'),
};
