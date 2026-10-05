// Exercício do módulo 4 — Misturas.
// Cada tela pede UMA mistura: arrastar os ingredientes p/ o béquer,
// indicar quantas fases (1 ou 2) e classificar (homogênea/heterogênea).
// Ordem fixa (1. sal+água, 2. água+óleo, 3. arroz+feijão, 4. água+vinagre).

export type IngredienteId = 'agua' | 'sal' | 'oleo' | 'arroz' | 'feijao' | 'vinagre';

export interface Ingrediente {
  id: IngredienteId;
  /** Nome do sinal em Libras (chave do vídeo no Hosting). */
  nome: string;
  /** Letras exibidas no card (símbolo curto). */
  letra: string;
  corTema: string;
  corFundo: string;
}

export type QtdFases = 1 | 2;
export type TipoMistura = 'homogenea' | 'heterogenea';

export interface EtapaMistura {
  id: string;
  /** Texto exibido embaixo do béquer (o que deve ser misturado). */
  alvoDescricao: string;
  /** Ingredientes exatos esperados no béquer (ordem não importa). */
  esperados: IngredienteId[];
  fases: QtdFases;
  tipo: TipoMistura;
}

export const ENUNCIADO_MISTURAS =
  'Faça misturas, indique quantas fases ela tem e classifique como homogênea ou heterogênea.';

export const INGREDIENTES_DATA: Ingrediente[] = [
  { id: 'agua', nome: 'Água', letra: 'Á', corTema: '#0277bd', corFundo: '#e1f5fe' },
  { id: 'sal', nome: 'Sal', letra: 'S', corTema: '#78909c', corFundo: '#eceff1' },
  { id: 'oleo', nome: 'Óleo', letra: 'O', corTema: '#f9a825', corFundo: '#fff8e1' },
  { id: 'arroz', nome: 'Arroz', letra: 'Ar', corTema: '#8d6e63', corFundo: '#efebe9' },
  { id: 'feijao', nome: 'Feijão', letra: 'F', corTema: '#4e342e', corFundo: '#efebe9' },
  { id: 'vinagre', nome: 'Vinagre', letra: 'V', corTema: '#6a1b9a', corFundo: '#f3e5f5' },
];

export const ETAPAS_MISTURAS: EtapaMistura[] = [
  {
    id: 'sal-agua',
    alvoDescricao: 'Misture: Sal + Água',
    esperados: ['sal', 'agua'],
    fases: 1,
    tipo: 'homogenea',
  },
  {
    id: 'agua-oleo',
    alvoDescricao: 'Misture: Água + Óleo',
    esperados: ['agua', 'oleo'],
    fases: 2,
    tipo: 'heterogenea',
  },
  {
    id: 'arroz-feijao',
    alvoDescricao: 'Misture: Arroz + Feijão',
    esperados: ['arroz', 'feijao'],
    fases: 2,
    tipo: 'heterogenea',
  },
  {
    id: 'agua-vinagre',
    alvoDescricao: 'Misture: Água + Vinagre',
    esperados: ['agua', 'vinagre'],
    fases: 1,
    tipo: 'homogenea',
  },
];

export const TEXTO_FINAL_MISTURAS =
  'Parabéns! Você conseguiu criar misturas, identificar a quantidade de fases e dizer se é homogênea ou heterogênea. As misturas homogêneas eram água e sal e água e vinagre e as heterogêneas eram água e óleo e arroz e feijão. 🎉';

export function getIngredienteById(id: IngredienteId): Ingrediente {
  const ingrediente = INGREDIENTES_DATA.find((i) => i.id === id);
  if (!ingrediente) throw new Error(`Ingrediente desconhecido: ${id}`);
  return ingrediente;
}

function nomesDos(ids: IngredienteId[]): string {
  return ids.map((id) => getIngredienteById(id).nome).join(' e ');
}

export type ParteErrada = 'ingredientes' | 'fases' | 'tipo';

export interface ResultadoValidacao {
  ok: boolean;
  parte?: ParteErrada;
  dica?: string;
}

/** Confere ingredientes, fases e tipo — nesta ordem (uma dica por vez). */
export function validarMistura(
  colocados: IngredienteId[],
  fases: QtdFases | null,
  tipo: TipoMistura | null,
  etapa: EtapaMistura,
): ResultadoValidacao {
  if (colocados.length === 0) {
    return {
      ok: false,
      parte: 'ingredientes',
      dica: 'O béquer está vazio. Arraste os ingredientes para dentro do béquer.',
    };
  }
  const chave = (ids: IngredienteId[]) => [...ids].sort().join('+');
  if (chave(colocados) !== chave(etapa.esperados)) {
    return {
      ok: false,
      parte: 'ingredientes',
      dica: `Confira o béquer: esta mistura leva ${nomesDos(etapa.esperados)}. Toque no ✕ para retirar o que está sobrando.`,
    };
  }
  if (fases === null) {
    return {
      ok: false,
      parte: 'fases',
      dica: 'Escolha quantas fases a mistura tem: toque no balão 1 ou 2.',
    };
  }
  if (fases !== etapa.fases) {
    return {
      ok: false,
      parte: 'fases',
      dica:
        etapa.fases === 1
          ? 'Observe bem: não dá para ver partes separadas — essa mistura tem 1 só fase.'
          : 'Observe bem: dá para ver partes separadas — essa mistura tem 2 fases.',
    };
  }
  if (tipo === null) {
    return {
      ok: false,
      parte: 'tipo',
      dica: 'Escolha a classificação: toque no balão Homogênea ou Heterogênea.',
    };
  }
  if (tipo !== etapa.tipo) {
    return {
      ok: false,
      parte: 'tipo',
      dica:
        etapa.tipo === 'homogenea'
          ? 'Lembre: mistura de 1 só fase é homogênea.'
          : 'Lembre: mistura com 2 fases é heterogênea.',
    };
  }
  return { ok: true };
}
