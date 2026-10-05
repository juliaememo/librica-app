export interface Sinal {
  id: string;
  titulo: string;
  icone: string;
  corTema: string;
  corFundo: string;
}

export const sinaisData: Sinal[] = [
  { id: '1', titulo: 'Átomo', icone: 'atom', corTema: '#00796b', corFundo: '#e0f2f1' },
  { id: '2', titulo: 'Vidraria', icone: 'flask', corTema: '#880e4f', corFundo: '#fce4ec' },
  { id: '3', titulo: 'Substância', icone: 'cube', corTema: '#f57f17', corFundo: '#fffde7' },
  { id: '4', titulo: 'Mistura', icone: 'tint', corTema: '#512da8', corFundo: '#ede7f6' },
  { id: '5', titulo: 'Gráfico', icone: 'chart-line', corTema: '#0277bd', corFundo: '#e1f5fe' },
  { id: '6', titulo: 'Separação', icone: 'filter', corTema: '#d84315', corFundo: '#fbe9e7' },
  { id: '7', titulo: 'Balança', icone: 'balance-scale', corTema: '#2e7d32', corFundo: '#e8f5e9' },
  { id: '8', titulo: 'Molécula', icone: 'project-diagram', corTema: '#7B3E52', corFundo: '#f5e6ea' },
];

/** Módulo (id da home) -> sinais relacionados (ids do dicionário). */
export const MODULO_SINAIS: Record<string, string[]> = {
  '1': ['1', '8'], // Átomos e Moléculas -> Átomo, Molécula
  '2': ['2', '7'], // Vidraria -> Vidraria, Balança
  '3': ['3', '8'], // Substâncias -> Substância, Molécula
  '4': ['4', '3'], // Misturas -> Mistura, Substância
  '5': ['5', '7'], // Gráficos -> Gráfico, Balança
  '6': ['6', '4'], // Separação heterogêneas -> Separação, Mistura
  '7': ['6', '2'], // Separação homogêneas -> Separação, Vidraria
  '8': ['1', '2', '3', '4', '5', '6', '7', '8'], // Módulo secreto -> todos
};

export function getSinaisDoModulo(moduloId: string | undefined): Sinal[] {
  const ids = (moduloId && MODULO_SINAIS[moduloId]) || sinaisData.map((s) => s.id);
  return ids
    .map((sid) => sinaisData.find((s) => s.id === sid))
    .filter((s): s is Sinal => !!s);
}
