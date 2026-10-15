/** Biblioteca do ícone (todas gratuitas e compatíveis com Expo Go). */
export type IconeLib = 'fa5' | 'fa6' | 'material' | 'ionicons' | 'entypo';

export interface Sinal {
  id: string;
  titulo: string;
  icone: string;
  /** De qual pacote vem o `icone`. Omitido = FontAwesome5. */
  iconeLib?: IconeLib;
  corTema: string;
  corFundo: string;
  /** Categorias do filtro do Dicionário (a 1ª é a principal e define a cor). */
  categorias: string[];
  /** Símbolo químico exibido no lugar do ícone (ex.: 'H'). Se omitido, usa FontAwesome. */
  simbolo?: string;
  /** Tamanho da fonte do `simbolo`. Omitido = 32. */
  tamanhoSimbolo?: number;
}

/** Opção "mostrar tudo" do filtro. */
export const CATEGORIA_TODOS = 'Todos';

/** Categorias disponíveis no filtro do Dicionário. */
export const CATEGORIAS_SINAIS: string[] = [
  CATEGORIA_TODOS,
  'Átomos e moléculas',
  'Elementos',
  'Laboratório',
  'Segurança no laboratório',
  'Verbos químicos',
  'Propriedades',
  'Substâncias e misturas',
  'Estados físicos',
  'Medições',
  'Materiais',
  'Conceitos gerais',
];

/** Cor oficial de cada categoria (paleta do app: corTema + corFundo). */
export const CATEGORIA_CORES: Record<string, { corTema: string; corFundo: string }> = {
  'Átomos e moléculas': { corTema: '#00796b', corFundo: '#e0f2f1' },
  'Elementos': { corTema: '#3949ab', corFundo: '#e8eaf6' },
  'Laboratório': { corTema: '#880e4f', corFundo: '#fce4ec' },
  'Segurança no laboratório': { corTema: '#d84315', corFundo: '#fbe9e7' },
  'Verbos químicos': { corTema: '#512da8', corFundo: '#ede7f6' },
  'Propriedades': { corTema: '#f57f17', corFundo: '#fffde7' },
  'Substâncias e misturas': { corTema: '#0277bd', corFundo: '#e1f5fe' },
  'Estados físicos': { corTema: '#00838f', corFundo: '#e0f7fa' },
  'Medições': { corTema: '#2e7d32', corFundo: '#e8f5e9' },
  'Materiais': { corTema: '#6d4c41', corFundo: '#efebe9' },
  'Conceitos gerais': { corTema: '#7B3E52', corFundo: '#f5e6ea' },
};

export const sinaisData: Sinal[] = [
  { id: '1', titulo: 'Aço', icone: 'wrench', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '2', titulo: 'Água', icone: 'water', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '3', titulo: 'Aquecer', icone: 'fire', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '4', titulo: 'Ar', icone: 'wind', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas', 'Estados físicos'] },
  { id: '5', titulo: 'Área', icone: 'square', corTema: '#2e7d32', corFundo: '#e8f5e9', categorias: ['Medições'] },
  { id: '6', titulo: 'Areia', icone: 'hourglass-start', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais', 'Substâncias e misturas'] },
  { id: '7', titulo: 'Argônio', icone: 'atom', simbolo: 'Ar', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '8', titulo: 'Aspirar', icone: 'spray-can', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '9', titulo: 'Atmosfera', icone: 'cloud', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '10', titulo: 'Átomo', icone: 'atom', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '11', titulo: 'Balão volumétrico', icone: 'balloon-outline', iconeLib: 'ionicons', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Medições'] },
  { id: '12', titulo: 'Becker', icone: 'beaker', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '13', titulo: 'Bureta', icone: 'test-tube-empty', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Medições'] },
  { id: '14', titulo: 'Carbono', icone: 'atom', simbolo: 'C', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '15', titulo: 'Celsius', icone: 'temperature-half', iconeLib: 'fa6', corTema: '#2e7d32', corFundo: '#e8f5e9', categorias: ['Medições'] },
  { id: '16', titulo: 'Cloro', icone: 'atom', simbolo: 'Cl', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '17', titulo: 'Colher', icone: 'spoon', iconeLib: 'fa6', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '18', titulo: 'Comprimir', icone: 'down-left-and-up-right-to-center', iconeLib: 'fa6', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '19', titulo: 'Concentração', icone: 'eye-dropper', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades', 'Substâncias e misturas'] },
  { id: '20', titulo: 'Copo', icone: 'glass-water', iconeLib: 'fa6', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '21', titulo: 'Densidade', icone: 'border-all', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades'] },
  { id: '22', titulo: 'Dissolver', icone: 'glass-water-droplet', iconeLib: 'fa6', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '23', titulo: 'Divisível', icone: 'division', iconeLib: 'material', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades'] },
  { id: '24', titulo: 'Elétron', icone: 'square-minus', iconeLib: 'fa6', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '25', titulo: 'EPI', icone: 'shield-alt', corTema: '#d84315', corFundo: '#fbe9e7', categorias: ['Segurança no laboratório'] },
  { id: '26', titulo: 'Erlenmeyer', icone: 'flask-empty-outline', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '27', titulo: 'Espaço', icone: 'keyboard-space', iconeLib: 'material', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '28', titulo: 'Estado físico', icone: 'state-machine', iconeLib: 'material', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos'] },
  { id: '29', titulo: 'Exatidão', icone: 'bullseye', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades', 'Medições'] },
  { id: '30', titulo: 'Exercício', icone: 'pen-to-square', iconeLib: 'fa6', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '31', titulo: 'Fases', icone: 'layer-group', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '32', titulo: 'Ferramenta', icone: 'screwdriver-wrench', iconeLib: 'fa6', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '33', titulo: 'Ferro', icone: 'atom', simbolo: 'Fe', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '34', titulo: 'Gasoso', icone: 'smog', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos'] },
  { id: '35', titulo: 'Grécia antiga', icone: 'landmark', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '36', titulo: 'H₂O', icone: 'atom', simbolo: 'H₂O', tamanhoSimbolo: 26, corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas', 'Substâncias e misturas'] },
  { id: '37', titulo: 'Heterogênea', icone: 'bars-staggered', iconeLib: 'fa6', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '38', titulo: 'Hidrogênio', icone: 'atom', simbolo: 'H', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '39', titulo: 'Homogênea', icone: 'equals', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '40', titulo: 'Imutável', icone: 'lock', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades'] },
  { id: '41', titulo: 'Jaleco', icone: 'tshirt', corTema: '#d84315', corFundo: '#fbe9e7', categorias: ['Segurança no laboratório'] },
  { id: '42', titulo: 'Laboratório', icone: 'microscope', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '43', titulo: 'Ligação covalente', icone: 'circle-nodes', iconeLib: 'fa6', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '44', titulo: 'Líquido', icone: 'droplet', iconeLib: 'fa6', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos'] },
  { id: '45', titulo: 'Massa', icone: 'weight-scale', iconeLib: 'fa6', corTema: '#2e7d32', corFundo: '#e8f5e9', categorias: ['Medições', 'Propriedades'] },
  { id: '46', titulo: 'Matéria', icone: 'cubes', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '47', titulo: 'Mensurar', icone: 'ruler', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos', 'Medições'] },
  { id: '48', titulo: 'Mililitro (ml)', icone: 'syringe', corTema: '#2e7d32', corFundo: '#e8f5e9', categorias: ['Medições'] },
  { id: '49', titulo: 'Misturar', icone: 'mortar-pestle', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '50', titulo: 'Molécula', icone: 'dna', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '51', titulo: 'Mundo', icone: 'globe', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '52', titulo: 'Nêutron', icone: 'circle', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '53', titulo: 'Óculos de proteção', icone: 'glasses', corTema: '#d84315', corFundo: '#fbe9e7', categorias: ['Segurança no laboratório'] },
  { id: '54', titulo: 'Olho', icone: 'eye', corTema: '#2e7d32', corFundo: '#e8f5e9', categorias: ['Medições'] },
  { id: '55', titulo: 'Oxigênio', icone: 'atom', simbolo: 'O', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '56', titulo: 'Parcela', icone: 'puzzle-piece', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '57', titulo: 'Partícula', icone: 'cubes-stacked', iconeLib: 'fa6', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '58', titulo: 'Pipeta graduada', icone: 'vial', iconeLib: 'fa6', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Medições'] },
  { id: '59', titulo: 'Pipeta volumétrica', icone: 'vials', iconeLib: 'fa6', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Medições'] },
  { id: '60', titulo: 'Pisseta', icone: 'bottle-water', iconeLib: 'fa6', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '61', titulo: 'Ponto de ebulição', icone: 'temperature-high', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos', 'Propriedades'] },
  { id: '62', titulo: 'Ponto de fusão', icone: 'temperature-low', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos', 'Propriedades'] },
  { id: '63', titulo: 'Pressão exercida pelo vapor', icone: 'arrows-to-circle', iconeLib: 'fa6', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades', 'Estados físicos'] },
  { id: '64', titulo: 'Pressão (grandeza física)', icone: 'gauge', iconeLib: 'fa6', corTema: '#2e7d32', corFundo: '#e8f5e9', categorias: ['Medições', 'Propriedades'] },
  { id: '65', titulo: 'Próton', icone: 'square-plus', iconeLib: 'fa6', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '66', titulo: 'Proveta', icone: 'beaker-outline', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Medições'] },
  { id: '67', titulo: 'Química', icone: 'flask-vial', iconeLib: 'fa6', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '68', titulo: 'Reação', icone: 'arrow-right-arrow-left', iconeLib: 'fa6', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais', 'Verbos químicos'] },
  { id: '69', titulo: 'Redundante', icone: 'arrows-rotate', iconeLib: 'fa6', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '70', titulo: 'Respirar', icone: 'lungs', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '71', titulo: 'Sal de cozinha', icone: 'bowl-food', iconeLib: 'fa6', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais', 'Substâncias e misturas'] },
  { id: '72', titulo: 'Sódio', icone: 'atom', simbolo: 'Na', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '73', titulo: 'Sólido', icone: 'gem', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos'] },
  { id: '74', titulo: 'Solução', icone: 'flask', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '75', titulo: 'Solúvel', icone: 'fill-drip', iconeLib: 'fa6', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades', 'Substâncias e misturas'] },
  { id: '76', titulo: 'Substância', icone: 'bottle-droplet', iconeLib: 'fa6', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '77', titulo: 'Substância composta', icone: 'ellipsis-vertical', iconeLib: 'fa6', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '78', titulo: 'Substância simples', icone: 'ellipsis', iconeLib: 'fa6', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '79', titulo: 'Tubo de ensaio', icone: 'test-tube', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '80', titulo: 'Variar', icone: 'shuffle', iconeLib: 'material', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '81', titulo: 'Variável', icone: 'code', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades'] },
  { id: '82', titulo: 'Vidraria química', icone: 'lab-flask', iconeLib: 'entypo', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '83', titulo: 'Vinagre', icone: 'wine-bottle', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais', 'Substâncias e misturas'] },
  { id: '84', titulo: 'Volume', icone: 'cube', corTema: '#2e7d32', corFundo: '#e8f5e9', categorias: ['Medições', 'Propriedades'] },
];

/** Módulo (id da home) -> sinais relacionados (ids do dicionário). */
export const MODULO_SINAIS: Record<string, string[]> = {
  '1': ['10', '50'], // Átomos e Moléculas -> Átomo, Molécula
  '2': ['82', '42'], // Vidraria -> Vidraria química, Laboratório
  '3': ['76', '50'], // Substâncias -> Substância, Molécula
  '4': ['37', '39'], // Misturas -> Heterogênea, Homogênea
  '5': ['28', '47'], // Gráficos -> Estado físico, Mensurar
  '6': ['31', '37'], // Separação heterogêneas -> Fases, Heterogênea
  '7': ['31', '82'], // Separação homogêneas -> Fases, Vidraria química
  '8': ['10', '50', '76', '82', '28', '31', '42', '46'], // Módulo secreto (legado) -> amostra
};

export function getSinaisDoModulo(moduloId: string | undefined): Sinal[] {
  const ids = (moduloId && MODULO_SINAIS[moduloId]) || sinaisData.map((s) => s.id);
  return ids
    .map((sid) => sinaisData.find((s) => s.id === sid))
    .filter((s): s is Sinal => !!s);
}
