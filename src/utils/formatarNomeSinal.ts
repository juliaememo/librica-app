/**
 * Nome do sinal como deve aparecer na tela.
 *
 * Os vídeos usam underline no nome do arquivo (ex.: `danca_perto_da_vitoria.mp4`);
 * se algum título chegar nesse formato, a interface mostra o underline como
 * espaço — nunca `danca_perto_da_vitoria` no card.
 */
export function formatarNomeSinal(nome: string): string {
  return nome.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
}
