// ---------------------------------------------------------------------------
// Vídeos do Dicionário servidos pelo Firebase Hosting (plano gratuito OK).
// COMO USAR: grave/comprima cada sinal em .mp4, salve em public/videos/
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
  // Sinais do Dicionário (ordem alfabética, títulos iguais aos de sinaisData).
  'Aço': 'sinais/01aco.mp4',
  'Água': 'sinais/02agua.mp4',
  'Aquecer': 'sinais/03aquecer.mp4',
  'Ar': 'sinais/04ar.mp4',
  'Área': 'sinais/05area.mp4',
  'Areia': 'sinais/06areia.mp4',
  'Argônio': 'sinais/07argonio.mp4',
  'Aspirar': 'sinais/08aspirar.mp4',
  'Atmosfera': 'sinais/09atmosfera.mp4',
  'Átomo': 'sinais/10atomo.mp4',
  'Balão volumétrico': 'sinais/11balao_volumetrico.mp4',
  'Becker': 'sinais/12becker.mp4',
  'Bureta': 'sinais/13bureta.mp4',
  'Carbono': 'sinais/14carbono.mp4',
  'Celsius': 'sinais/15celsius.mp4',
  'Cloro': 'sinais/16cloro.mp4',
  'Colher': 'sinais/17colher.mp4',
  'Comprimir': 'sinais/18comprimir.mp4',
  'Concentração': 'sinais/19concentracao.mp4',
  'Copo': 'sinais/20copo.mp4',
  'Densidade': 'sinais/21densidade.mp4',
  'Dissolver': 'sinais/22dissolver.mp4',
  'Divisível': 'sinais/23divisivel.mp4',
  'Elétron': 'sinais/24eletron.mp4',
  'EPI': 'sinais/25EPI.mp4',
  'Erlenmeyer': 'sinais/26erlenmeyer.mp4',
  'Espaço': 'sinais/27espaco.mp4',
  'Estado físico': 'sinais/28estado_fisico.mp4',
  'Exatidão': 'sinais/29exatidao.mp4',
  'Exercício': 'sinais/30exercicio.mp4',
  'Fases': 'sinais/31fases.mp4',
  'Ferramenta': 'sinais/32ferramenta.mp4',
  'Ferro': 'sinais/33ferro.mp4',
  'Gasoso': 'sinais/34gasoso.mp4',
  'Grécia antiga': 'sinais/35grecia_antiga.mp4',
  'H₂O': 'sinais/36H2O.mp4',
  'Heterogênea': 'sinais/37heterogenea.mp4',
  'Hidrogênio': 'sinais/38hidrogenio.mp4',
  'Homogênea': 'sinais/39homogenea.mp4',
  'Imutável': 'sinais/40imutavel.mp4',
  'Jaleco': 'sinais/41jaleco.mp4',
  'Laboratório': 'sinais/42laboratorio.mp4',
  'Ligação covalente': 'sinais/43ligacao-covalente.mp4',
  'Líquido': 'sinais/44liquido.mp4',
  'Massa': 'sinais/45massa.mp4',
  'Matéria': 'sinais/46materia.mp4',
  'Mensurar': 'sinais/47mensurar.mp4',
  'Mililitro (ml)': 'sinais/48mililitro_ml.mp4',
  'Misturar': 'sinais/49misturar.mp4',
  'Molécula': 'sinais/50molecula.mp4',
  'Mundo': 'sinais/51mundo.mp4',
  'Nêutron': 'sinais/52neutron.mp4',
  'Óculos de proteção': 'sinais/53oculos_de_protecao.mp4',
  'Olho': 'sinais/54olho.mp4',
  'Oxigênio': 'sinais/55oxigenio.mp4',
  'Parcela': 'sinais/56parcela.mp4',
  'Partícula': 'sinais/57particula.mp4',
  'Pipeta graduada': 'sinais/58pipeta_graduada.mp4',
  'Pipeta volumétrica': 'sinais/59pipeta_volumetrica.mp4',
  'Pisseta': 'sinais/60pisseta.mp4',
  'Ponto de ebulição': 'sinais/61ponto_de_ebulicao.mp4',
  'Ponto de fusão': 'sinais/62ponto_de_fusao.mp4',
  'Pressão exercida pelo vapor': 'sinais/63pressao_exercida_pelo_vapor.mp4',
  'Pressão (grandeza física)': 'sinais/64pressao_grandeza_fisica.mp4',
  'Próton': 'sinais/65proton.mp4',
  'Proveta': 'sinais/66proveta.mp4',
  'Química': 'sinais/67quimica.mp4',
  'Reação': 'sinais/68reacao.mp4',
  'Redundante': 'sinais/69redundante.mp4',
  'Respirar': 'sinais/70respirar.mp4',
  'Sal de cozinha': 'sinais/71sal_de_cozinha.mp4',
  'Sódio': 'sinais/72sodio.mp4',
  'Sólido': 'sinais/73solido.mp4',
  'Solução': 'sinais/74solucao.mp4',
  'Solúvel': 'sinais/75soluvel.mp4',
  'Substância': 'sinais/76substancia.mp4',
  'Substância composta': 'sinais/77substancia_composta.mp4',
  'Substância simples': 'sinais/78substancia_simples.mp4',
  'Tubo de ensaio': 'sinais/79tubo_de_ensaio.mp4',
  'Variar': 'sinais/80variar.mp4',
  'Variável': 'sinais/81variavel.mp4',
  'Vidraria química': 'sinais/82vidraria_quimica.mp4',
  'Vinagre': 'sinais/83vinagre.mp4',
  'Volume': 'sinais/84volume.mp4',
  // Exercícios de Átomos e Moléculas, Vidraria, Substâncias, Misturas e
  // Gráficos reutilizam os vídeos do Dicionário acima (mesmo título = mesmo vídeo).
  // Só restam abaixo os nomes exclusivos de exercícios, sem vídeo no Dicionário.
  // 'Vidro de relógio': sem vídeo no Dicionário (fora dos 84).
  // Sinais do exercício de Substâncias (módulo 3).
  // Sinais EXCLUSIVOS da pasta secreta (id '8').
  // Estes títulos NÃO existem em `sinaisData`, por isso nunca aparecem
  // no Dicionário nem nos módulos 1-7. Para adicionar um vídeo novo:
  //  1. Suba o .mp4 em public/videos/segredo/ (ex.: segredo/novo.mp4).
  //     Pode usar subpasta — o código monta `base + '/' + nome`.
  //  2. Preencha o valor abaixo com o caminho relativo a videos/.
  //  3. Rode `firebase deploy --only hosting`.
  '67 Sinistro': 'segredo/67sinistro.mp4',
  '67 Olho Loucura': 'segredo/67olholoucura.mp4',
  '67 Aparece De Novo': 'segredo/67_aparece_denovo.mp4',
  'Bola de Pilates': 'segredo/bola_de_pilates.mp4',
  'Dançando sem Vida no Olhar': 'segredo/dancando_sem_vida_no_olhar.mp4',
  'Dançando Sertanejo ao Som de Pop Coreano Psicodélico': 'segredo/dancando_sertanejo_ao_som_de_pop_coreano_psicodelico.mp4',
  'Doideira': 'segredo/doideira.mp4',
  'Guerreiro Preparando': 'segredo/guerreiro_preparando.mp4',
  'Hm...Ok': 'segredo/hm...ok.mp4',
  'Jamal': 'segredo/jamal.mp4',
  'Lá Ele': 'segredo/laele.mp4',
  'Loucura Ai Dentro': 'segredo/loucura_aidentro.mp4',
  'Loucura 67 Parte 3': 'segredo/loucura67parte3.mp4',
  'Mini Dança Gamer': 'segredo/minidancagamer.mp4',
  'Pew Pew': 'segredo/pewpew.mp4',
  'Possuído pelo 67': 'segredo/possuido_pelo_67.mp4',
  'Quero Cagar': 'segredo/quero_cagar.mp4',
  'Quicada Dolorosa': 'segredo/quicada_dolorosa.mp4',
  'Rebolada para Relaxar': 'segredo/rebolada_pra_relaxar.mp4',
  'Rebolada Vitoriosa': 'segredo/rebolada_vitoriosa.mp4',
  'Selva 13 Foreshadowing': 'segredo/selva13foreshadowing.mp4',
  'Tico Tico Tico': 'segredo/ticoticotico.mp4',
  'Um Segundo Dança': 'segredo/umsegundo_danca.mp4',
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
