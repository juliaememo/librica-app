// ---------------------------------------------------------------------------
// Vídeos do Dicionário servidos pelo Firebase Hosting (plano gratuito OK).
// COMO USAR: grave/comprima cada sinal em .mp4, salve em hosting-public/videos/
// com os nomes abaixo e rode `firebase deploy --only hosting`.
// O app faz STREAMING direto da URL do Hosting: nada é empacotado no app e
// nenhum arquivo fica salvo no celular (só buffer temporário de reprodução,
// descartado ao soltar o dedo).
// Deixe '' enquanto não tiver subido o vídeo — o app mostra
// "Vídeo ainda não enviado" em vez de quebrar.
// ---------------------------------------------------------------------------

/** Base pública do Hosting. Troque se usar domínio personalizado. */
export const HOSTING_VIDEO_BASE_URL = 'https://librica-app.web.app/videos';

export const SINAIS_HOSTING_VIDEO_MAP: Record<string, string> = {
  // ÚNICO vídeo já enviado (o resto fica '' até subir o .mp4 e dar deploy,
  // senão o player tenta tocar um arquivo inexistente e quebra).
  'Átomo': 'ligacao-covalente.mp4',
  'Vidraria': '',
  'Substância': '',
  'Mistura': '',
  'Gráfico': '',
  'Separação': '',
  'Balança': '',
  'Molécula': '',
  // Sinais do exercício de Átomos e Moléculas (etapas O2 e H2O).
  // Preencha com o nome do .mp4 quando o vídeo for enviado.
  'Oxigênio': '',
  'Hidrogênio': '',
  'Carbono': '',
  // Sinais do exercício de Vidraria de Laboratório (módulo 2).
  'Tubo de ensaio': '',
  'Becker': '',
  'Pipeta graduada': '',
  'Pipeta volumétrica': '',
  'Proveta': '',
  'Balão volumétrico': '',
  'Pisseta': '',
  'Bureta': '',
  'Erlenmeyer': '',
  'Vidro de relógio': '',
  'Óculos de proteção': '',
  // Sinais do exercício de Substâncias (módulo 3).
  'Gás Oxigênio': '',
  'Gás Carbônico': '',
  'Diamante': '',
  'Sal de Cozinha': '',
  'Gás Hidrogênio': '',
  'Água': '',
  'Simples': '',
  'Composta': '',
  // Sinais do exercício de Misturas (módulo 4).
  'Sal': '',
  'Óleo': '',
  'Arroz': '',
  'Feijão': '',
  'Vinagre': '',
  '1': '',
  '2': '',
  'Homogênea': '',
  'Heterogênea': '',
  // Sinais do exercício de Gráficos (módulo 5).
  // 'Substância' já existe acima (Dicionário) e é reutilizada.
  'Sólido': '',
  'Líquido': '',
  'Gasoso': '',
  'Mistura comum': '',
  'Mistura eutética': '',
  'Mistura azeotrópica': '',
  // Sinais do exercício de Separação de heterogêneas (módulo 6).
  'Catação': '',
  'Peneiração': '',
  'Ventilação': '',
  'Separação magnética': '',
  'Levigação': '',
  'Decantação': '',
  'Centrifugação': '',
  'Filtração': '',
  // Sinais do exercício de Separação de homogêneas (módulo 7).
  'Evaporação': '',
  'Destilação simples': '',
  'Extração': '',
  'Destilação fracionada': '',
};

/** Devolve a URL completa do vídeo no Hosting, ou null se ainda não enviado. */
export function getSinalHostingUrl(titulo: string): string | null {
  const arquivo = (SINAIS_HOSTING_VIDEO_MAP[titulo] ?? '').trim();
  if (!arquivo) return null;
  // Permite colar uma URL completa como exceção, se um dia precisar.
  if (/^https?:\/\//i.test(arquivo)) return arquivo;
  const base = HOSTING_VIDEO_BASE_URL.replace(/\/+$/, '');
  const nome = arquivo.replace(/^\/+/, '');
  return `${base}/${nome}`;
}
