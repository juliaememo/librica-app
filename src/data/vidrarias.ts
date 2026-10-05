// Exercício do módulo 2 — Vidraria de Laboratório.
// Cada tela mostra UMA função; o usuário arrasta a vidraria correta.
// Todas as 11 vidrarias aparecem em todas as telas. A ordem das telas
// é embaralhada cada vez que o exercício começa.

export type VidrariaId =
  | 'tubo-ensaio'
  | 'becker'
  | 'pipeta-graduada'
  | 'pipeta-volumetrica'
  | 'proveta'
  | 'balao-volumetrico'
  | 'pisseta'
  | 'bureta'
  | 'erlenmeyer'
  | 'vidro-relogio'
  | 'oculos';

export interface Vidraria {
  id: VidrariaId;
  /** Nome do sinal em Libras (chave do vídeo no Hosting). */
  nome: string;
  /** Função exibida como alvo de uma das telas. */
  funcao: string;
  corTema: string;
  corFundo: string;
}

export const ENUNCIADO_VIDRARIAS = 'Associe as funções com cada vidraria.';

export const VIDRIAS_DATA: Vidraria[] = [
  { id: 'tubo-ensaio', nome: 'Tubo de ensaio', funcao: 'Realizar pequenas reações.', corTema: '#0277bd', corFundo: '#e1f5fe' },
  { id: 'becker', nome: 'Becker', funcao: 'Dissolver substâncias, preparar soluções e fazer misturas.', corTema: '#00796b', corFundo: '#e0f2f1' },
  { id: 'pipeta-graduada', nome: 'Pipeta graduada', funcao: 'Transferir líquidos de um lugar para outro, podendo medir vários volumes.', corTema: '#512da8', corFundo: '#ede7f6' },
  { id: 'pipeta-volumetrica', nome: 'Pipeta volumétrica', funcao: 'Transferir líquidos de um lugar para outro, medindo apenas um volume, mas com precisão.', corTema: '#3949ab', corFundo: '#e8eaf6' },
  { id: 'proveta', nome: 'Proveta', funcao: 'Medir volumes de líquidos com menor precisão.', corTema: '#00838f', corFundo: '#e0f7fa' },
  { id: 'balao-volumetrico', nome: 'Balão volumétrico', funcao: 'Preparar ou diluir um determinado volume de solução.', corTema: '#f57f17', corFundo: '#fff8e1' },
  { id: 'pisseta', nome: 'Pisseta', funcao: 'Lavar vidrarias.', corTema: '#2e7d32', corFundo: '#e8f5e9' },
  { id: 'bureta', nome: 'Bureta', funcao: 'Transferir um volume de outro aos poucos, com auxílio de uma torneira.', corTema: '#d84315', corFundo: '#fbe9e7' },
  { id: 'erlenmeyer', nome: 'Erlenmeyer', funcao: 'Agitar soluções.', corTema: '#880e4f', corFundo: '#fce4ec' },
  { id: 'vidro-relogio', nome: 'Vidro de relógio', funcao: 'Aquecer e medir a massa de uma substância e tampar vidrarias.', corTema: '#6d4c41', corFundo: '#efebe9' },
  { id: 'oculos', nome: 'Óculos de proteção', funcao: 'Proteger nossos olhos.', corTema: '#455a64', corFundo: '#eceff1' },
];

export function getVidrariaById(id: VidrariaId): Vidraria {
  const vidraria = VIDRIAS_DATA.find((v) => v.id === id);
  if (!vidraria) throw new Error(`Vidraria desconhecida: ${id}`);
  return vidraria;
}

// Reexportado do util compartilhado (mantém o import existente funcionando).
export { embaralhar } from '@/src/utils/embaralhar';
