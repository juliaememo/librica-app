/**
 * Store global da prévia de vídeo de sinal (segurar para ver).
 *
 * Motivo: a prévia era renderizada como filha absoluta de cada card, então
 * ficava presa ao layout local — exigia rolar a tela e era cortada por
 * ScrollView, overflow hidden e containers pequenos (exercícios, páginas
 * de vídeos).
 *
 * Agora cada card apenas publica "quero mostrar X" aqui (com a posição do
 * card na tela); um único overlay montado na raiz do app
 * (`SinalPreviewOverlay`) desenha uma prévia PEQUENA ao lado do ícone,
 * sempre inteiramente visível (sem corte, sem exigir rolagem),
 * independente de onde o dedo está.
 */

/** Posição e tamanho do card na tela (medidos via `measureInWindow`). */
export interface SinalPreviewAncora {
  x: number;
  y: number;
  largura: number;
  altura: number;
}

export interface SinalPreviewPayload {
  titulo: string;
  videoUrl: string | null;
  corTema: string;
  /** Onde o card está na tela — sem isso, a prévia cai no centro. */
  ancora?: SinalPreviewAncora | null;
  lado?: 'esquerda' | 'direita';
  abreParaBaixo?: boolean;
}

type PreviewListener = () => void;

let atual: SinalPreviewPayload | null = null;
const ouvintes = new Set<PreviewListener>();

function notificar(): void {
  ouvintes.forEach((ouvinte) => ouvinte());
}

/** Publica uma prévia (chamado ao segurar o card por ~180ms). */
export function mostrarPreviewSinal(payload: SinalPreviewPayload): void {
  atual = payload;
  notificar();
}

/**
 * Esconde a prévia (chamado ao soltar o dedo / desmontar o card).
 * O `tituloEsperado` evita que a limpeza de um card antigo apague a
 * prévia de um card novo numa troca rápida de dedo.
 */
export function esconderPreviewSinal(tituloEsperado?: string): void {
  if (tituloEsperado !== undefined && atual?.titulo !== tituloEsperado) {
    return;
  }
  if (atual === null) return;
  atual = null;
  notificar();
}

export function assinarPreviewSinal(ouvinte: PreviewListener): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

export function lerPreviewSinal(): SinalPreviewPayload | null {
  return atual;
}
