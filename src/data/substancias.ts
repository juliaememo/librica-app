// Exercício do módulo 3 — Substâncias.
// Cada tela mostra UMA substância; o usuário escolhe Simples ou Composta
// e confirma no Concluir. A ordem das telas é embaralhada a cada início
// (só as restantes entram no embaralhamento ao retomar).

export type TipoSubstancia = 'simples' | 'composta';

export interface Substancia {
  id: string;
  /** Nome do sinal em Libras (chave do vídeo no Hosting). */
  nome: string;
  formula: string;
  tipo: TipoSubstancia;
  corTema: string;
  corFundo: string;
}

export const ENUNCIADO_SUBSTANCIAS =
  'Separe as substâncias em substâncias simples e compostas.';

export const SUBSTANCIAS_DATA: Substancia[] = [
  { id: 'o2', nome: 'Gás Oxigênio', formula: 'O₂', tipo: 'simples', corTema: '#0277bd', corFundo: '#e1f5fe' },
  { id: 'co2', nome: 'Gás Carbônico', formula: 'CO₂', tipo: 'composta', corTema: '#d84315', corFundo: '#fbe9e7' },
  { id: 'c', nome: 'Diamante', formula: 'C', tipo: 'simples', corTema: '#512da8', corFundo: '#ede7f6' },
  { id: 'nacl', nome: 'Sal de Cozinha', formula: 'NaCl', tipo: 'composta', corTema: '#f57f17', corFundo: '#fff8e1' },
  { id: 'h2', nome: 'Gás Hidrogênio', formula: 'H₂', tipo: 'simples', corTema: '#00796b', corFundo: '#e0f2f1' },
  { id: 'h2o', nome: 'Água', formula: 'H₂O', tipo: 'composta', corTema: '#00838f', corFundo: '#e0f7fa' },
];

export const ROTULO_TIPO: Record<TipoSubstancia, string> = {
  simples: 'Simples',
  composta: 'Composta',
};
