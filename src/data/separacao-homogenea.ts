// Exercício do módulo 7 — Separação de misturas homogêneas.
// Cada tela mostra UM copo (desenho da mistura) com espaço(s) faltando:
// tocar ou arrastar o(s) método(s) de separação correto(s). A tela 1
// aceita dois métodos (evaporação e destilação simples, em qualquer ordem).

import type { EtapaSeparacao, MetodoSeparacao } from '@/src/data/separacao-heterogenea';

export const ENUNCIADO_SEPARACAO_HOM =
  'Determine qual tipo de separação é utilizado em cada uma das misturas.';

export const METODOS_HOMOGENEAS: MetodoSeparacao[] = [
  { id: 'evaporacao', nome: 'Evaporação', corTema: '#f9a825', corFundo: '#fff8e1' },
  { id: 'destilacao-simples', nome: 'Destilação simples', corTema: '#0277bd', corFundo: '#e1f5fe' },
  { id: 'extracao', nome: 'Extração', corTema: '#2e7d32', corFundo: '#e8f5e9' },
  { id: 'destilacao-fracionada', nome: 'Destilação fracionada', corTema: '#512da8', corFundo: '#ede7f6' },
];

export const ETAPAS_SEPARACAO_HOM: EtapaSeparacao[] = [
  {
    id: 'sal-agua',
    descricao: 'Copo com uma mistura de sal e água',
    cena: 'copo-sal-agua',
    slots: [
      { id: 'metodo-1', rotulo: 'Método de separação 1' },
      { id: 'metodo-2', rotulo: 'Método de separação 2' },
    ],
    esperados: ['evaporacao', 'destilacao-simples'],
    dica: 'Observe: dá para separar aquecendo (o vapor pode ser recolhido ou não). Quais dois métodos servem aqui?',
  },
  {
    id: 'sal-agua-areia',
    descricao: 'Copo com uma mistura de sal, água e areia',
    cena: 'copo-areia',
    slots: [{ id: 'metodo', rotulo: 'Método de separação' }],
    esperados: ['extracao'],
    dica: 'Observe: a água dissolve o sal, mas não a areia. Qual método usa um líquido para extrair?',
  },
  {
    id: 'alcool-agua',
    descricao: 'Copo com uma mistura de álcool e água',
    cena: 'copo-alcool',
    slots: [{ id: 'metodo', rotulo: 'Método de separação' }],
    esperados: ['destilacao-fracionada'],
    dica: 'Observe: são dois líquidos com pontos de ebulição próximos. Qual destilação separa os dois?',
  },
];

export const TEXTO_FINAL_SEPARACAO_HOM =
  'Parabéns! Você conseguiu identificar corretamente os tipos de separação de misturas homogêneas. Identificou como podemos separar sal e água, com evaporação e destilação simples, como podemos separar água, areia e sal com extração e como podemos separar álcool e água com destilação fracionada. 🎉';
