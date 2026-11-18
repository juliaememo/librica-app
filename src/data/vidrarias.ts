// Exercício do módulo 2 — Vidraria de Laboratório.
// Cada tela mostra UMA função; o usuário arrasta a vidraria correta.
// Todas as 9 vidrarias aparecem em todas as telas. A ordem das telas
// é embaralhada cada vez que o exercício começa.

import type { ChaveSinalEnunciado } from '@/src/services/sinaisEnunciados';

export type VidrariaId =
  | 'tubo-ensaio'
  | 'becker'
  | 'pipeta-graduada'
  | 'pipeta-volumetrica'
  | 'proveta'
  | 'balao-volumetrico'
  | 'pisseta'
  | 'bureta'
  | 'erlenmeyer';

export interface Vidraria {
  id: VidrariaId;
  /** Nome do sinal em Libras (chave do vídeo no Hosting). */
  nome: string;
  /** Função exibida como alvo de uma das telas. */
  funcao: string;
  /** Vídeo de Libras que explica o enunciado desta tela. */
  sinal: ChaveSinalEnunciado;
  corTema: string;
  corFundo: string;
}

export const ENUNCIADO_VIDRARIAS = 'Associe as funções com cada vidraria.';

export const VIDRIAS_DATA: Vidraria[] = [
  { id: 'tubo-ensaio', nome: 'Tubo de ensaio', funcao: 'Realizar pequenas reações.', sinal: 'vidrariaTuboDeEnsaio', corTema: '#0277bd', corFundo: '#e1f5fe' },
  { id: 'becker', nome: 'Becker', funcao: 'Dissolver substâncias, preparar soluções e fazer misturas.', sinal: 'vidrariaBecker', corTema: '#00796b', corFundo: '#e0f2f1' },
  { id: 'pipeta-graduada', nome: 'Pipeta graduada', funcao: 'Transferir líquidos de um lugar para outro, podendo medir vários volumes.', sinal: 'vidrariaPipetaGraduada', corTema: '#512da8', corFundo: '#ede7f6' },
  { id: 'pipeta-volumetrica', nome: 'Pipeta volumétrica', funcao: 'Transferir líquidos de um lugar para outro, medindo apenas um volume, mas com precisão.', sinal: 'vidrariaPipetaVolumetrica', corTema: '#3949ab', corFundo: '#e8eaf6' },
  { id: 'proveta', nome: 'Proveta', funcao: 'Medir volumes de líquidos com menor precisão.', sinal: 'vidrariaProveta', corTema: '#00838f', corFundo: '#e0f7fa' },
  { id: 'balao-volumetrico', nome: 'Balão volumétrico', funcao: 'Preparar ou diluir um determinado volume de solução.', sinal: 'vidrariaBalaoVolumetrico', corTema: '#f57f17', corFundo: '#fff8e1' },
  { id: 'pisseta', nome: 'Pisseta', funcao: 'Lavar vidrarias.', sinal: 'vidrariaPisseta', corTema: '#2e7d32', corFundo: '#e8f5e9' },
  { id: 'bureta', nome: 'Bureta', funcao: 'Transferir um volume de outro aos poucos, com auxílio de uma torneira.', sinal: 'vidrariaBureta', corTema: '#d84315', corFundo: '#fbe9e7' },
  { id: 'erlenmeyer', nome: 'Erlenmeyer', funcao: 'Agitar soluções.', sinal: 'vidrariaErlenmeyer', corTema: '#880e4f', corFundo: '#fce4ec' },
];

export function getVidrariaById(id: VidrariaId): Vidraria {
  const vidraria = VIDRIAS_DATA.find((v) => v.id === id);
  if (!vidraria) throw new Error(`Vidraria desconhecida: ${id}`);
  return vidraria;
}

// Reexportado do util compartilhado (mantém o import existente funcionando).
export { embaralhar } from '@/src/utils/embaralhar';
