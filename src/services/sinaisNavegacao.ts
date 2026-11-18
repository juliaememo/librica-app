// ---------------------------------------------------------------------------
// Vídeos de sinais em Libras usados na navegação do app (cadastro, login,
// perfil e tela inicial). Diferente do Dicionário, aqui cada vídeo explica
// um elemento de interface ("nome", "senha", "entrar", "sair"...).
//
// COMO ADICIONAR UM VÍDEO NOVO:
//   1. Grave/comprima em .mp4 (formato 3:4, retrato) e salve em
//      public/videos/sinais-navegacao/.
//   2. Adicione uma entrada em SINAIS_NAVEGACAO.
//   3. Rode `firebase deploy --only hosting`.
//
// Os vídeos são servidos por STREAMING pelo Firebase Hosting: nada é
// empacotado no app e nenhum arquivo fica salvo no celular.
// ---------------------------------------------------------------------------

import { HOSTING_VIDEO_BASE_URL } from './sinaisHosting';

export const SINAIS_NAVEGACAO = {
  // Cadastro
  nome: { arquivo: 'sinais-navegacao/primeiro_nome.mp4', rotulo: 'Nome' },
  sobrenome: { arquivo: 'sinais-navegacao/ultimo_nome.mp4', rotulo: 'Sobrenome' },
  nomeUsuario: {
    arquivo: 'sinais-navegacao/nome_do_perfil_de_usuario.mp4',
    rotulo: 'Nome de usuário',
  },
  email: { arquivo: 'sinais-navegacao/email.mp4', rotulo: 'E-mail' },
  senha: { arquivo: 'sinais-navegacao/senha.mp4', rotulo: 'Senha' },
  confirmarSenha: {
    arquivo: 'sinais-navegacao/confirmar_senha.mp4',
    rotulo: 'Confirmar senha',
  },

  // Login
  entrar: { arquivo: 'sinais-navegacao/login.mp4', rotulo: 'Entrar' },
  esqueciSenha: {
    arquivo: 'sinais-navegacao/esqueci_senha.mp4',
    rotulo: 'Esqueci minha senha',
  },
  novaSenha: { arquivo: 'sinais-navegacao/nova_senha.mp4', rotulo: 'Nova senha' },

  // Perfil
  sair: { arquivo: 'sinais-navegacao/logout.mp4', rotulo: 'Sair da conta' },

  // Tela inicial (um sinal para cada módulo)
  moduloAtomos: {
    arquivo: 'sinais-navegacao/modulo_atomo_e_molecula.mp4',
    rotulo: 'Átomos e Moléculas',
  },
  moduloVidraria: {
    arquivo: 'sinais-navegacao/modulo_vidraria_de_laboratorio.mp4',
    rotulo: 'Vidraria de Laboratório',
  },
  moduloSubstancias: {
    arquivo: 'sinais-navegacao/modulo_substancias.mp4',
    rotulo: 'Substâncias',
  },
  moduloMisturas: {
    arquivo: 'sinais-navegacao/modulo_misturas.mp4',
    rotulo: 'Misturas',
  },
  moduloGraficos: {
    arquivo: 'sinais-navegacao/modulo_comportamento_grafico.mp4',
    rotulo: 'Comportamento em gráfico',
  },
  moduloSeparacaoHeterogenea: {
    arquivo: 'sinais-navegacao/modulo_separacao_de_misturas_heterogeneas.mp4',
    rotulo: 'Separação de misturas heterogêneas',
  },
  moduloSeparacaoHomogenea: {
    arquivo: 'sinais-navegacao/modulo_separacao_de_misturas_homogeneas.mp4',
    rotulo: 'Separação de misturas homogêneas',
  },
} as const satisfies Record<string, { arquivo: string; rotulo: string }>;

export type ChaveSinalNavegacao = keyof typeof SINAIS_NAVEGACAO;

/** Devolve a URL completa do vídeo no Hosting, ou null se não cadastrado. */
export function getSinalNavegacaoUrl(chave: ChaveSinalNavegacao): string | null {
  const entrada = SINAIS_NAVEGACAO[chave];
  if (!entrada) return null;
  const arquivo = (entrada.arquivo ?? '').trim();
  if (!arquivo) return null;
  if (/^https?:\/\//i.test(arquivo)) return arquivo;
  const base = HOSTING_VIDEO_BASE_URL.replace(/\/+$/, '');
  return `${base}/${arquivo.replace(/^\/+/, '')}`;
}

/** Nome amigável do sinal, usado no botão e no título do modal. */
export function getSinalNavegacaoRotulo(chave: ChaveSinalNavegacao): string {
  return SINAIS_NAVEGACAO[chave]?.rotulo ?? chave;
}
