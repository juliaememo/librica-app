// Exercício do módulo 6 — Separação de misturas heterogêneas.
// Cada tela mostra UMA cena (desenho da mistura) com espaço(s) faltando:
// tocar ou arrastar o(s) método(s) de separação correto(s). As telas e os
// métodos são embaralhados.

export type MetodoId =
  | 'catacao'
  | 'peneiracao'
  | 'ventilacao'
  | 'separacao-magnetica'
  | 'levigacao'
  | 'decantacao'
  | 'centrifugacao'
  | 'filtracao'
  | 'evaporacao'
  | 'destilacao-simples'
  | 'extracao'
  | 'destilacao-fracionada';

export interface MetodoSeparacao {
  id: MetodoId;
  /** Nome do sinal em Libras (chave do vídeo no Hosting). */
  nome: string;
  corTema: string;
  corFundo: string;
}

export type CenaId =
  | 'peneira'
  | 'ventilador'
  | 'prato-arroz'
  | 'prato-clipes'
  | 'bacia'
  | 'copo-terra'
  | 'filtro-cafe'
  | 'maquina'
  | 'copo-oleo'
  | 'copo-sal-agua'
  | 'copo-areia'
  | 'copo-alcool';

export interface SlotSeparacao {
  id: string;
  rotulo: string;
}

export interface EtapaSeparacao {
  id: string;
  /** Descrição da cena (ex.: "Peneira com sal e feijão"). */
  descricao: string;
  cena: CenaId;
  /** Espaços a preencher (tela 1 do módulo 7 tem dois). */
  slots: SlotSeparacao[];
  /** Métodos corretos (conjunto, ordem livre). */
  esperados: MetodoId[];
  /** Dica mostrada quando erra (descreve o método sem nomeá-lo). */
  dica: string;
}

export const ENUNCIADO_SEPARACAO_HET =
  'Determine qual tipo de separação é utilizado em cada uma das misturas.';

export const METODOS_HETEROGENEAS: MetodoSeparacao[] = [
  { id: 'catacao', nome: 'Catação', corTema: '#2e7d32', corFundo: '#e8f5e9' },
  { id: 'peneiracao', nome: 'Peneiração', corTema: '#0277bd', corFundo: '#e1f5fe' },
  { id: 'ventilacao', nome: 'Ventilação', corTema: '#00838f', corFundo: '#e0f7fa' },
  { id: 'separacao-magnetica', nome: 'Separação magnética', corTema: '#d84315', corFundo: '#fbe9e7' },
  { id: 'levigacao', nome: 'Levigação', corTema: '#512da8', corFundo: '#ede7f6' },
  { id: 'decantacao', nome: 'Decantação', corTema: '#f9a825', corFundo: '#fff8e1' },
  { id: 'centrifugacao', nome: 'Centrifugação', corTema: '#880e4f', corFundo: '#fce4ec' },
  { id: 'filtracao', nome: 'Filtração', corTema: '#455a64', corFundo: '#eceff1' },
];

function etapaUnica(
  id: string,
  descricao: string,
  cena: CenaId,
  esperado: MetodoId,
  dica: string,
): EtapaSeparacao {
  return {
    id,
    descricao,
    cena,
    slots: [{ id: 'metodo', rotulo: 'Método de separação' }],
    esperados: [esperado],
    dica,
  };
}

export const ETAPAS_SEPARACAO_HET: EtapaSeparacao[] = [
  etapaUnica(
    'peneira',
    'Peneira com uma mistura de sal e feijão',
    'peneira',
    'peneiracao',
    'Observe: os grãos maiores ficam retidos na malha. Qual método usa uma peneira?',
  ),
  etapaUnica(
    'ventilacao',
    'Cascas de alho e feijão no ar, com um ventilador',
    'ventilador',
    'ventilacao',
    'Observe: o vento leva a parte mais leve. Qual método usa ventilação?',
  ),
  etapaUnica(
    'catacao',
    'Prato com arroz e feijão',
    'prato-arroz',
    'catacao',
    'Observe: os grãos são separados um a um, com a mão ou pinça. Qual método é esse?',
  ),
  etapaUnica(
    'magnetica',
    'Prato com clipes e sal',
    'prato-clipes',
    'separacao-magnetica',
    'Observe: uma das partes é atraída por ímã. Qual método usa um ímã?',
  ),
  etapaUnica(
    'levigacao',
    'Feijão e farinha de trigo em uma bacia com água',
    'bacia',
    'levigacao',
    'Observe: a água carrega a parte mais leve (a farinha). Qual método usa água corrente?',
  ),
  etapaUnica(
    'decantacao-terra',
    'Água e terra em um copo, com a terra no fundo',
    'copo-terra',
    'decantacao',
    'Observe: a parte sólida afundou e o líquido é passado para outro recipiente. Qual método é esse?',
  ),
  etapaUnica(
    'filtracao',
    'Filtro de café com pó de café e água',
    'filtro-cafe',
    'filtracao',
    'Observe: o líquido passa e o sólido fica retido no papel. Qual método usa um filtro?',
  ),
  etapaUnica(
    'centrifugacao',
    'Máquina de lavar roupas',
    'maquina',
    'centrifugacao',
    'Observe: a máquina gira rapidinho para separar. Qual método usa rotação?',
  ),
  etapaUnica(
    'decantacao-oleo',
    'Água e óleo separados em um copo',
    'copo-oleo',
    'decantacao',
    'Observe: são dois líquidos que não se misturam, um sobre o outro. Como separar?',
  ),
];

export const TEXTO_FINAL_SEPARACAO_HET =
  'Parabéns! Você conseguiu identificar corretamente os tipos de separação de misturas heterogêneas. Identificou as separações entre sólidos, como a peneiração, a ventilação, a catação, a separação magnética e a levigação. Também identificou as separações entre sólidos e líquidos, como a decantação, a filtração e a centrifugação. Também identificou a separação entre líquidos, a decantação. 🎉';

export function getMetodoById(
  metodos: MetodoSeparacao[],
  id: MetodoId,
): MetodoSeparacao {
  const metodo = metodos.find((m) => m.id === id);
  if (!metodo) throw new Error(`Método desconhecido: ${id}`);
  return metodo;
}

/** Compara dois conjuntos de métodos (ordem livre). */
export function mesmoConjunto(a: MetodoId[], b: MetodoId[]): boolean {
  const chave = (ids: MetodoId[]) => [...ids].sort().join('+');
  return chave(a) === chave(b);
}
