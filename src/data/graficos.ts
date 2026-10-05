// Exercício do módulo 5 — Comportamento em gráfico.
// Cada tela mostra UMA curva de aquecimento com espaços faltando: arrastar
// os estados físicos (Sólido, Líquido, Gasoso) para cada trecho e o tipo
// do gráfico (Substância, Mistura comum, Eutética, Azeotrópica) para o
// espaço do tipo. Ordem fixa das 4 telas.

export type EstadoId = 'solido' | 'liquido' | 'gasoso';
export type TipoGraficoId =
  | 'substancia'
  | 'mistura-comum'
  | 'eutetica'
  | 'azeotropica';

export type SinalGraficoId = EstadoId | TipoGraficoId;

export interface SinalGrafico {
  id: SinalGraficoId;
  /** Nome do sinal em Libras (chave do vídeo no Hosting). */
  nome: string;
  corTema: string;
  corFundo: string;
}

export interface SlotGrafico {
  id: string;
  /** Descrição do trecho (ex.: "1º patamar: início"). */
  rotulo: string;
  esperado: SinalGraficoId;
}

export type CurvaTipo = 'substancia' | 'comum' | 'eutetica' | 'azeotropica';

export interface EtapaGrafico {
  id: string;
  titulo: string;
  curva: CurvaTipo;
  slots: SlotGrafico[];
  /** Dica específica quando o espaço do tipo está errado. */
  dicaTipo: string;
}

export const ENUNCIADO_GRAFICOS =
  'Determine quais estados físicos estão presentes em cada área do gráfico e determine que tipo de gráfico que é.';

export const SINAIS_GRAFICOS: SinalGrafico[] = [
  { id: 'solido', nome: 'Sólido', corTema: '#0277bd', corFundo: '#e1f5fe' },
  { id: 'liquido', nome: 'Líquido', corTema: '#00838f', corFundo: '#e0f7fa' },
  { id: 'gasoso', nome: 'Gasoso', corTema: '#78909c', corFundo: '#eceff1' },
  { id: 'substancia', nome: 'Substância', corTema: '#00796b', corFundo: '#e0f2f1' },
  { id: 'mistura-comum', nome: 'Mistura comum', corTema: '#512da8', corFundo: '#ede7f6' },
  { id: 'eutetica', nome: 'Mistura eutética', corTema: '#f57f17', corFundo: '#fff8e1' },
  { id: 'azeotropica', nome: 'Mistura azeotrópica', corTema: '#d84315', corFundo: '#fbe9e7' },
];

export const ETAPAS_GRAFICOS: EtapaGrafico[] = [
  {
    id: 'substancia',
    titulo: 'Gráfico 1',
    curva: 'substancia',
    slots: [
      { id: 's1', rotulo: 'Inclinação inferior', esperado: 'solido' },
      { id: 's2', rotulo: '1º patamar: início', esperado: 'solido' },
      { id: 's3', rotulo: '1º patamar: fim', esperado: 'liquido' },
      { id: 's4', rotulo: 'Inclinação do meio', esperado: 'liquido' },
      { id: 's5', rotulo: '2º patamar: início', esperado: 'liquido' },
      { id: 's6', rotulo: '2º patamar: fim', esperado: 'gasoso' },
      { id: 's7', rotulo: 'Inclinação superior', esperado: 'gasoso' },
      { id: 'tipo', rotulo: 'Tipo de gráfico', esperado: 'substancia' },
    ],
    dicaTipo: 'Conte os patamares: este gráfico tem 2 patamares (fusão e ebulição). Que tipo de gráfico é?',
  },
  {
    id: 'mistura-comum',
    titulo: 'Gráfico 2',
    curva: 'comum',
    slots: [
      { id: 's1', rotulo: 'Inclinação inferior', esperado: 'solido' },
      { id: 's2', rotulo: '1ª transição: início', esperado: 'solido' },
      { id: 's3', rotulo: '1ª transição: fim', esperado: 'liquido' },
      { id: 's4', rotulo: 'Inclinação do meio', esperado: 'liquido' },
      { id: 's5', rotulo: '2ª transição: início', esperado: 'liquido' },
      { id: 's6', rotulo: '2ª transição: fim', esperado: 'gasoso' },
      { id: 's7', rotulo: 'Inclinação superior', esperado: 'gasoso' },
      { id: 'tipo', rotulo: 'Tipo de gráfico', esperado: 'mistura-comum' },
    ],
    dicaTipo: 'Observe: este gráfico não tem nenhum patamar. Que tipo de gráfico é?',
  },
  {
    id: 'eutetica',
    titulo: 'Gráfico 3',
    curva: 'eutetica',
    slots: [
      { id: 's1', rotulo: 'Inclinação inferior', esperado: 'solido' },
      { id: 's2', rotulo: 'Patamar: início', esperado: 'solido' },
      { id: 's3', rotulo: 'Patamar: fim', esperado: 'liquido' },
      { id: 's4', rotulo: 'Inclinação do meio', esperado: 'liquido' },
      { id: 's5', rotulo: '2ª transição: início', esperado: 'liquido' },
      { id: 's6', rotulo: '2ª transição: fim', esperado: 'gasoso' },
      { id: 's7', rotulo: 'Inclinação superior', esperado: 'gasoso' },
      { id: 'tipo', rotulo: 'Tipo de gráfico', esperado: 'eutetica' },
    ],
    dicaTipo: 'Observe: este gráfico tem 1 patamar no ponto de fusão. Que tipo de gráfico é?',
  },
  {
    id: 'azeotropica',
    titulo: 'Gráfico 4',
    curva: 'azeotropica',
    slots: [
      { id: 's1', rotulo: 'Inclinação inferior', esperado: 'solido' },
      { id: 's2', rotulo: '1ª transição: início', esperado: 'solido' },
      { id: 's3', rotulo: '1ª transição: fim', esperado: 'liquido' },
      { id: 's4', rotulo: 'Inclinação do meio', esperado: 'liquido' },
      { id: 's5', rotulo: 'Patamar: início', esperado: 'liquido' },
      { id: 's6', rotulo: 'Patamar: fim', esperado: 'gasoso' },
      { id: 's7', rotulo: 'Inclinação superior', esperado: 'gasoso' },
      { id: 'tipo', rotulo: 'Tipo de gráfico', esperado: 'azeotropica' },
    ],
    dicaTipo: 'Observe: este gráfico tem 1 patamar no ponto de ebulição. Que tipo de gráfico é?',
  },
];

export const TEXTO_FINAL_GRAFICOS =
  'Parabéns! Você conseguiu identificar corretamente os tipos de gráficos! Substância, onde há dois patamares; mistura comum, onde não há patamares; mistura eutética, onde há um patamar no ponto de fusão; e mistura azeotrópica, onde há um patamar no ponto de ebulição. 🎉';

export function getSinalGraficoById(id: SinalGraficoId): SinalGrafico {
  const sinal = SINAIS_GRAFICOS.find((s) => s.id === id);
  if (!sinal) throw new Error(`Sinal desconhecido: ${id}`);
  return sinal;
}

export interface ResultadoGraficos {
  ok: boolean;
  dica?: string;
}

/** Confere todos os espaços; a dica aponta o primeiro espaço errado. */
export function validarGrafico(
  preenchidos: Record<string, SinalGraficoId | null>,
  etapa: EtapaGrafico,
): ResultadoGraficos {
  for (const slot of etapa.slots) {
    if (!preenchidos[slot.id]) {
      return {
        ok: false,
        dica: `Falta preencher o espaço "${slot.rotulo}". Arraste um sinal para ele.`,
      };
    }
  }
  for (const slot of etapa.slots) {
    if (preenchidos[slot.id] !== slot.esperado) {
      if (slot.id === 'tipo') {
        return { ok: false, dica: `Ops no tipo do gráfico. ${etapa.dicaTipo}` };
      }
      const esperado = getSinalGraficoById(slot.esperado);
      return {
        ok: false,
        dica: `Confira o espaço "${slot.rotulo}": ali está presente ${esperado.nome}.`,
      };
    }
  }
  return { ok: true };
}
