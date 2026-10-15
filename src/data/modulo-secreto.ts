// ---------------------------------------------------------------------------
// MÓDULO SECRETO — aparece na home quando o progresso total chega a 100%.
//
// A SENHA NÃO FICA NO CÓDIGO: ela está no Firestore, no documento
//   config/geral, campo "senhaModuloSecreto".
// Para trocar a senha, edite o valor lá no console do Firebase
// (sem mexer no código e sem gerar APK novo).
// O vídeo continua aqui abaixo (não é sensível).
// ---------------------------------------------------------------------------

import type { Sinal } from './sinais';

/** Vídeo do YouTube exibido na página (só o ID, ex.: 'FSyAehMdpyI'). */
export const VIDEO_ID_MODULO_SECRETO = 'MQ1HKKFtTJs';

export const TITULO_MODULO_SECRETO = 'Módulo Secreto';

export const DESCRICAO_MODULO_SECRETO =
  'Descubra como foi o processo de criação do Librica!';

// ---------------------------------------------------------------------------
// SINAIS EXCLUSIVOS DA PASTA SECRETA — não aparecem em nenhum outro lugar.
// Motivo: o Dicionário lista `sinaisData` e os módulos 1-7 usam
// `MODULO_SINAIS`. Esta lista é separada de propósito: só o id '8'
// (modulo-detalhe com semExercicio='1') usa `SINAIS_SECRETOS`.
// COMO ADICIONAR UM VÍDEO NOVO (sem tocar em outro arquivo de lógica):
//  1. Adicione uma linha aqui abaixo com um `titulo` único
//     (ex.: 'Bastidores 1' — não reuse título do Dicionário).
//  2. Em `src/services/sinaisHosting.ts`, na seção SECRETA, adicione:
//       'Bastidores 1': 'segredo/bastidores-1.mp4',
//  3. Coloque o .mp4 em `public/videos/segredo/` (é essa pasta que o
//     `firebase deploy --only hosting` envia — ver `firebase.json`)
//     e rode:
//       firebase deploy --only hosting
// Enquanto o mapa estiver '' o card mostra "Vídeo ainda não enviado".
// ---------------------------------------------------------------------------

export const SINAIS_SECRETOS: Sinal[] = [
  { id: 's1', titulo: '67 Sinistro', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's2', titulo: '67 Olho Loucura', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's3', titulo: '67 Aparece De Novo', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's4', titulo: 'Bola de Pilates', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's5', titulo: 'Dançando sem Vida no Olhar', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's6', titulo: 'Dançando Sertanejo ao Som de Pop Coreano Psicodélico', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's7', titulo: 'Doideira', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's8', titulo: 'Guerreiro Preparando', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's9', titulo: 'Hm...Ok', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's10', titulo: 'Jamal', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's11', titulo: 'Lá Ele', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's12', titulo: 'Loucura Ai Dentro', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's13', titulo: 'Loucura 67 Parte 3', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's14', titulo: 'Mini Dança Gamer', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's15', titulo: 'Pew Pew', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's16', titulo: 'Possuído pelo 67', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's17', titulo: 'Quero Cagar', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's18', titulo: 'Quicada Dolorosa', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's19', titulo: 'Rebolada para Relaxar', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's20', titulo: 'Rebolada Vitoriosa', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's21', titulo: 'Selva 13 Foreshadowing', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's22', titulo: 'Tico Tico Tico', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
  { id: 's23', titulo: 'Um Segundo Dança', icone: 'gift', corTema: '#4a2c00', corFundo: '#ffe9b8', categorias: ['Secreta'] },
];
