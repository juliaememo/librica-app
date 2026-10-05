// Exercícios do módulo 1 — Átomos e Moléculas.
// Etapa 0: montar gás oxigênio (O2 = 2x O).
// Etapa 1: montar água (H2O = 2x H + 1x O).
// Os átomos disponíveis durante todo o exercício: O, H e C.

export type AtomoId = 'O' | 'H' | 'C';

export interface AtomoDisponivel {
  id: AtomoId;
  /** Nome do sinal em Libras (chave do vídeo no Hosting). */
  titulo: string;
  /** Letra exibida no lugar do ícone (símbolo químico). */
  simbolo: string;
  corTema: string;
  corFundo: string;
}

export interface EtapaExercicio {
  id: string;
  /** Texto exibido embaixo do béquer (o que deve ser formado). */
  alvoTitulo: string;
  alvoFormula: string;
  alvoDescricao: string;
  /** Composição exata esperada dentro do béquer. */
  esperado: Record<AtomoId, number>;
  /** Capacidade máxima do béquer nesta etapa (trava drops além disso). */
  capacidade: number;
  dicaGeral: string;
}

export const ATOMOS_EXERCICIO: AtomoDisponivel[] = [
  { id: 'O', titulo: 'Oxigênio', simbolo: 'O', corTema: '#0277bd', corFundo: '#e1f5fe' },
  { id: 'H', titulo: 'Hidrogênio', simbolo: 'H', corTema: '#d84315', corFundo: '#fbe9e7' },
  { id: 'C', titulo: 'Carbono', simbolo: 'C', corTema: '#2e7d32', corFundo: '#e8f5e9' },
];

export const ENUNCIADO_ATOMOS_MOLECULAS =
  'Junte os átomos para formar as moléculas correspondentes.';

export const ETAPAS_ATOMOS_MOLECULAS: EtapaExercicio[] = [
  {
    id: 'o2',
    alvoTitulo: 'Gás Oxigênio',
    alvoFormula: 'O₂',
    alvoDescricao: 'Forme: Gás Oxigênio (O₂)',
    esperado: { O: 2, H: 0, C: 0 },
    capacidade: 3,
    dicaGeral:
      'O gás oxigênio (O₂) é formado por 2 átomos de Oxigênio ligados. Retire os átomos que sobram e complete com Oxigênio.',
  },
  {
    id: 'h2o',
    alvoTitulo: 'Água',
    alvoFormula: 'H₂O',
    alvoDescricao: 'Forme: Água (H₂O)',
    esperado: { O: 1, H: 2, C: 0 },
    capacidade: 3,
    dicaGeral:
      'A água (H₂O) tem 2 átomos de Hidrogênio e 1 de Oxigênio. O Carbono não entra nessa molécula.',
  },
];

export function getAtomoById(id: AtomoId): AtomoDisponivel {
  const atomo = ATOMOS_EXERCICIO.find((a) => a.id === id);
  if (!atomo) throw new Error(`Átomo desconhecido: ${id}`);
  return atomo;
}

/** Conta quantos átomos de cada tipo há no béquer. */
export function contarAtomos(colocados: AtomoId[]): Record<AtomoId, number> {
  const contagem: Record<AtomoId, number> = { O: 0, H: 0, C: 0 };
  for (const id of colocados) contagem[id] += 1;
  return contagem;
}

/** Confere se a composição está exatamente igual ao esperado (ordem não importa). */
export function composicaoCorreta(
  colocados: AtomoId[],
  etapa: EtapaExercicio,
): boolean {
  const contagem = contarAtomos(colocados);
  return (
    (Object.keys(etapa.esperado) as AtomoId[]).every(
      (k) => contagem[k] === etapa.esperado[k],
    ) && colocados.length === Object.values(etapa.esperado).reduce((a, b) => a + b, 0)
  );
}

/** Gera uma dica específica conforme o erro cometido. */
export function gerarDica(colocados: AtomoId[], etapa: EtapaExercicio): string {
  if (colocados.length === 0) {
    return 'O béquer está vazio. Arraste os átomos para dentro do béquer antes de concluir.';
  }
  const contagem = contarAtomos(colocados);
  const totalEsperado = Object.values(etapa.esperado).reduce((a, b) => a + b, 0);

  if (etapa.id === 'o2') {
    if (contagem.C > 0) return 'O gás oxigênio não usa Carbono. Toque no ✕ ao lado do béquer para retirar o Carbono.';
    if (contagem.H > 0) return 'O gás oxigênio não usa Hidrogênio. Retire o Hidrogênio e use só Oxigênio.';
    if (contagem.O < 2) return 'Falta Oxigênio! O gás oxigênio precisa de 2 átomos de Oxigênio (O₂).';
    if (colocados.length > 2) return 'Tem átomos demais! O gás oxigênio usa exatamente 2 átomos de Oxigênio.';
    return etapa.dicaGeral;
  }

  // Etapa água (H2O).
  if (contagem.C > 0) return 'A água não usa Carbono. Retire o Carbono (✕) e complete com Hidrogênio e Oxigênio.';
  if (contagem.O === 0) return 'Falta Oxigênio! A água precisa de 1 átomo de Oxigênio.';
  if (contagem.O > 1) return 'Oxigênio demais! A água usa só 1 átomo de Oxigênio.';
  if (contagem.H < 2) return 'Falta Hidrogênio! A água precisa de 2 átomos de Hidrogênio.';
  if (contagem.H > 2) return 'Hidrogênio demais! A água usa exatamente 2 átomos de Hidrogênio.';
  if (colocados.length !== totalEsperado) return etapa.dicaGeral;
  return etapa.dicaGeral;
}
