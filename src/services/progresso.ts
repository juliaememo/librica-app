import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/src/services/firebase';

// ---------------------------------------------------------------------------
// Progresso dos módulos (fonte da verdade: Firestore, doc users/{uid}).
// Regra: vídeo do YouTube = 50% | exercícios = 50% (divididos por etapa).
// Ex.: módulo 1 tem 2 etapas -> cada acerto vale 25%.
// A escrita é SEMPRE aditiva (nunca remove): refazer o exercício depois de
// acertar não tira o progresso do usuário.
// ---------------------------------------------------------------------------

/** Ids dos módulos na ordem exibida no perfil. */
export const MODULO_IDS = ['1', '2', '3', '4', '5', '6', '7'];

/** Quantas telas/etapas de exercício cada módulo possui. */
export const TOTAL_ETAPAS_EXERCICIO: Record<string, number> = {
  '1': 2, // O2 + H2O
  '2': 11, // uma tela por vidraria
  '3': 6, // uma tela por substância
  '4': 4, // sal+água, água+óleo, arroz+feijão, água+vinagre
  '5': 4, // um gráfico de cada tipo
  '6': 9, // uma tela por mistura heterogênea
  '7': 3, // duas telas simples + uma com dois métodos
};

export interface ProgressoModuloBanco {
  video?: boolean;
  etapas?: number[];
}

type ProgressoBanco = Record<string, ProgressoModuloBanco | undefined>;

/**
 * Porcentagem de um módulo: 50 (vídeo) + 50 * (etapas concluídas / total).
 * Índices inválidos/duplicados são ignorados; o teto é 100.
 */
export function calcularPorcentagemModulo(
  moduloId: string,
  video: boolean,
  etapasConcluidas: number[] | undefined,
): number {
  const total = TOTAL_ETAPAS_EXERCICIO[moduloId] ?? 1;
  const validas = new Set(
    (etapasConcluidas ?? []).filter(
      (e) => Number.isInteger(e) && e >= 0 && e < total,
    ),
  );
  const parteVideo = video ? 50 : 0;
  const parteExercicio = Math.round((validas.size / total) * 50);
  return Math.min(parteVideo + parteExercicio, 100);
}

/** Lê o mapa `progresso` do documento do usuário (tolerante a ausente). */
export function lerMapaProgresso(data: unknown): ProgressoBanco {
  if (!data || typeof data !== 'object') return {};
  const rec = data as Record<string, unknown>;
  const prog = rec['progresso'];
  if (!prog || typeof prog !== 'object') return {};
  return prog as ProgressoBanco;
}

/** Devolve as 7 porcentagens na ordem dos módulos para a tela de perfil. */
export function calcularProgressoModulos(data: unknown): number[] {
  const mapa = lerMapaProgresso(data);
  return MODULO_IDS.map((moduloId) => {
    const entry = mapa[moduloId];
    return calcularPorcentagemModulo(
      moduloId,
      entry?.video === true,
      entry?.etapas,
    );
  });
}

/** Média arredondada dos 7 módulos (progresso total do perfil). */
export function calcularProgressoTotal(progressoModulos: number[]): number {
  if (progressoModulos.length === 0) return 0;
  const soma = progressoModulos.reduce((acc, p) => acc + p, 0);
  return Math.round(soma / progressoModulos.length);
}

/**
 * Marca o vídeo como visto (+50%). Só liga a flag — nunca desliga,
 * então chamar de novo não muda nada.
 */
export async function marcarVideoVisto(
  uid: string,
  moduloId: string,
): Promise<void> {
  if (!uid || !moduloId) return;
  await setDoc(
    doc(db, 'users', uid),
    { progresso: { [moduloId]: { video: true } } },
    { merge: true },
  );
}

/**
 * Registra uma etapa de exercício concluída (+fração dos 50%).
 * Usa arrayUnion: concluiu uma vez, fica valendo mesmo refazendo.
 */
export async function marcarEtapaConcluida(
  uid: string,
  moduloId: string,
  etapaIndex: number,
): Promise<void> {
  if (!uid || !moduloId || !Number.isInteger(etapaIndex) || etapaIndex < 0) return;
  await setDoc(
    doc(db, 'users', uid),
    { progresso: { [moduloId]: { etapas: arrayUnion(etapaIndex) } } },
    { merge: true },
  );
}
