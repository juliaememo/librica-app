// ---------------------------------------------------------------------------
// Vídeos de sinais em Libras usados nos enunciados e nas partes dos exercícios
// práticos (Misturas, Vidraria, Átomos e Moléculas e Substâncias).
//
// COMO ADICIONAR UM VÍDEO NOVO:
//   1. Grave/comprima em .mp4 (formato 16:9, paisagem) e salve em
//      public/videos/enunciados/.
//   2. Adicione uma entrada em SINAIS_ENUNCIADOS.
//   3. Rode `firebase deploy --only hosting`.
//
// Os vídeos são servidos por STREAMING pelo Firebase Hosting: nada é
// empacotado no app e nenhum arquivo fica salvo no celular.
// ---------------------------------------------------------------------------

import { HOSTING_VIDEO_BASE_URL } from './sinaisHosting';

export const SINAIS_ENUNCIADOS = {
  // Exercício de Misturas (módulo 4)
  enunciadoMisturas: {
    arquivo:
      'enunciados/faca_misturas_indique_quantas_fases_ela_tem_e_classifique_como_homogenea_ou_heterogenea.mp4',
    rotulo: 'Enunciado: Misturas',
  },
  misturaSalAgua: {
    arquivo: 'enunciados/sal_mais_agua.mp4',
    rotulo: 'Mistura: Sal + Água',
  },
  misturaAguaOleo: {
    arquivo: 'enunciados/agua_mais_oleo.mp4',
    rotulo: 'Mistura: Água + Óleo',
  },
  misturaArrozFeijao: {
    arquivo: 'enunciados/arroz_mais_feijao.mp4',
    rotulo: 'Mistura: Arroz + Feijão',
  },
  misturaAguaVinagre: {
    arquivo: 'enunciados/agua_mais_vinagre.mp4',
    rotulo: 'Mistura: Água + Vinagre',
  },
  quantasFases: {
    arquivo: 'enunciados/quantas_fases.mp4',
    rotulo: 'Fases',
  },

  // Exercício de Vidraria de Laboratório (módulo 2)
  enunciadoVidrarias: {
    arquivo: 'enunciados/associe_as_funcoes_com_cada_vidraria.mp4',
    rotulo: 'Enunciado: Vidrarias',
  },
  // Um vídeo por tela: mostra a função da vidraria que o aluno deve associar.
  vidrariaTuboDeEnsaio: {
    arquivo: 'enunciados/enunciado_tubo_de_ensaio.mp4',
    rotulo: 'Vidraria',
  },
  vidrariaBecker: {
    arquivo: 'enunciados/enunciado_becker.mp4',
    rotulo: 'Vidraria',
  },
  vidrariaPipetaGraduada: {
    arquivo: 'enunciados/enunciado_pipeta_graduada.mp4',
    rotulo: 'Vidraria',
  },
  vidrariaPipetaVolumetrica: {
    arquivo: 'enunciados/enunciado_pipeta_volumetrica.mp4',
    rotulo: 'Vidraria',
  },
  vidrariaProveta: {
    arquivo: 'enunciados/enunciado_proveta.mp4',
    rotulo: 'Vidraria',
  },
  vidrariaBalaoVolumetrico: {
    arquivo: 'enunciados/enunciado_balao_volumetrico.mp4',
    rotulo: 'Vidraria',
  },
  vidrariaPisseta: {
    arquivo: 'enunciados/enunciado_pisseta.mp4',
    rotulo: 'Vidraria',
  },
  vidrariaBureta: {
    arquivo: 'enunciados/enunciado_bureta.mp4',
    rotulo: 'Vidraria',
  },
  vidrariaErlenmeyer: {
    arquivo: 'enunciados/enunciado_erlenmeyer.mp4',
    rotulo: 'Vidraria',
  },

  // Exercício de Átomos e Moléculas (módulo 1)
  enunciadoAtomos: {
    arquivo: 'enunciados/junte_os_atomos_para_formar_as_moleculas_correspondentes.mp4',
    rotulo: 'Enunciado: Átomos e Moléculas',
  },
  // Um vídeo por etapa: mostra a molécula que deve ser formada no béquer.
  moleculaO2: {
    arquivo: 'enunciados/o2.mp4',
    rotulo: 'Molécula: Gás Oxigênio (O₂)',
  },
  moleculaAgua: {
    arquivo: 'enunciados/agua_h2o.mp4',
    rotulo: 'Molécula: Água (H₂O)',
  },

  // Exercício de Substâncias (módulo 3)
  enunciadoSubstancias: {
    arquivo: 'enunciados/separe_as_substancias_em_substancias_simples_e_compostas.mp4',
    rotulo: 'Enunciado: Substâncias',
  },
  // Um vídeo por substância: mostra a substância da tela atual em Libras.
  substanciaO2: {
    arquivo: 'enunciados/o2.mp4',
    rotulo: 'Substância: Gás Oxigênio (O₂)',
  },
  substanciaCO2: {
    arquivo: 'enunciados/co2.mp4',
    rotulo: 'Substância: Gás Carbônico (CO₂)',
  },
  substanciaDiamante: {
    arquivo: 'enunciados/diamante_c.mp4',
    rotulo: 'Substância: Diamante (C)',
  },
  substanciaNaCl: {
    arquivo: 'enunciados/sal_de_cozinha_nacl.mp4',
    rotulo: 'Substância: Sal de Cozinha (NaCl)',
  },
  substanciaH2: {
    arquivo: 'enunciados/gas_hidrogenio_h2.mp4',
    rotulo: 'Substância: Gás Hidrogênio (H₂)',
  },
  substanciaAgua: {
    arquivo: 'enunciados/agua_h2o.mp4',
    rotulo: 'Substância: Água (H₂O)',
  },
} as const satisfies Record<string, { arquivo: string; rotulo: string }>;

export type ChaveSinalEnunciado = keyof typeof SINAIS_ENUNCIADOS;

/** Devolve a URL completa do vídeo no Hosting, ou null se não cadastrado. */
export function getSinalEnunciadoUrl(chave: ChaveSinalEnunciado): string | null {
  const entrada = SINAIS_ENUNCIADOS[chave];
  if (!entrada) return null;
  const arquivo = (entrada.arquivo ?? '').trim();
  if (!arquivo) return null;
  if (/^https?:\/\//i.test(arquivo)) return arquivo;
  const base = HOSTING_VIDEO_BASE_URL.replace(/\/+$/, '');
  return `${base}/${arquivo.replace(/^\/+/, '')}`;
}

/** Nome amigável do sinal, usado no botão e no título da janelinha. */
export function getSinalEnunciadoRotulo(chave: ChaveSinalEnunciado): string {
  return SINAIS_ENUNCIADOS[chave]?.rotulo ?? chave;
}
