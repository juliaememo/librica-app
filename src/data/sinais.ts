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
  'Separação de misturas',
  'Estados físicos',
  'Medições',
  'Gráficos',
  'Materiais',
  'Conceitos gerais',
];

export const sinaisData: Sinal[] = [
  { id: '1', titulo: 'Aço', icone: 'wrench', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '2', titulo: 'Água', icone: 'water', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '85', titulo: 'Álcool', icone: 'wine-bottle', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas', 'Materiais'] },
  { id: '3', titulo: 'Aquecer', icone: 'fire', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '4', titulo: 'Ar', icone: 'wind', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas', 'Estados físicos'] },
  { id: '5', titulo: 'Área', icone: 'square', corTema: '#2e7d32', corFundo: '#e8f5e9', categorias: ['Medições'] },
  { id: '6', titulo: 'Areia', icone: 'hourglass-start', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais', 'Substâncias e misturas'] },
  { id: '7', titulo: 'Argônio', icone: 'atom', simbolo: 'Ar', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '86', titulo: 'Arroz', icone: 'bowl-rice', iconeLib: 'fa6', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '8', titulo: 'Aspirar', icone: 'spray-can', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '9', titulo: 'Atmosfera', icone: 'cloud', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '10', titulo: 'Átomo', icone: 'atom', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '87', titulo: 'Bacia', icone: 'bath', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '11', titulo: 'Balão volumétrico', icone: 'balloon-outline', iconeLib: 'ionicons', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Medições'] },
  { id: '12', titulo: 'Becker', icone: 'beaker', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '88', titulo: 'Bolha', icone: 'circle-dot', iconeLib: 'fa6', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos', 'Conceitos gerais'] },
  { id: '13', titulo: 'Bureta', icone: 'test-tube-empty', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Medições'] },
  { id: '89', titulo: 'Café', icone: 'mug-hot', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais', 'Substâncias e misturas'] },
  { id: '90', titulo: 'Campo magnético', icone: 'magnet', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades', 'Conceitos gerais'] },
  { id: '14', titulo: 'Carbono', icone: 'atom', simbolo: 'C', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '91', titulo: 'Catação', icone: 'hand-pointer', iconeLib: 'fa6', corTema: '#00695c', corFundo: '#e0f2f1', categorias: ['Separação de misturas', 'Verbos químicos'] },
  { id: '15', titulo: 'Celsius', icone: 'temperature-half', iconeLib: 'fa6', corTema: '#2e7d32', corFundo: '#e8f5e9', categorias: ['Medições'] },
  { id: '92', titulo: 'Centrifugação', icone: 'arrows-spin', iconeLib: 'fa6', corTema: '#00695c', corFundo: '#e0f2f1', categorias: ['Separação de misturas'] },
  { id: '93', titulo: 'Clipe de metal', icone: 'paperclip', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '16', titulo: 'Cloro', icone: 'atom', simbolo: 'Cl', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '17', titulo: 'Colher', icone: 'spoon', iconeLib: 'fa6', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '18', titulo: 'Comprimir', icone: 'down-left-and-up-right-to-center', iconeLib: 'fa6', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '19', titulo: 'Concentração', icone: 'eye-dropper', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades', 'Substâncias e misturas'] },
  { id: '94', titulo: 'Condensação', icone: 'cloud-rain', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos', 'Verbos químicos'] },
  { id: '95', titulo: 'Contrário', icone: 'right-left', iconeLib: 'fa6', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '20', titulo: 'Copo', icone: 'glass-water', iconeLib: 'fa6', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '96', titulo: 'Criar', icone: 'wand-magic-sparkles', iconeLib: 'fa6', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '97', titulo: 'Curva de aquecimento', icone: 'chart-line', iconeLib: 'fa6', corTema: '#ad1457', corFundo: '#fce4ec', categorias: ['Gráficos'] },
  { id: '98', titulo: 'Curva de resfriamento', icone: 'chart-area', iconeLib: 'fa6', corTema: '#ad1457', corFundo: '#fce4ec', categorias: ['Gráficos'] },
  { id: '99', titulo: 'Decantação', icone: 'glass-water', iconeLib: 'fa6', corTema: '#00695c', corFundo: '#e0f2f1', categorias: ['Separação de misturas'] },
  { id: '21', titulo: 'Densidade', icone: 'border-all', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades'] },
  { id: '100', titulo: 'Destilação fracionada', icone: 'flask-vial', iconeLib: 'fa6', corTema: '#00695c', corFundo: '#e0f2f1', categorias: ['Separação de misturas'] },
  { id: '101', titulo: 'Destilação simples', icone: 'flask', corTema: '#00695c', corFundo: '#e0f2f1', categorias: ['Separação de misturas'] },
  { id: '102', titulo: 'Diferenciar', icone: 'not-equal', iconeLib: 'fa6', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '103', titulo: 'Direita', icone: 'arrow-right', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '22', titulo: 'Dissolver', icone: 'glass-water-droplet', iconeLib: 'fa6', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '23', titulo: 'Divisível', icone: 'division', iconeLib: 'material', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades'] },
  { id: '104', titulo: 'Eixo x', icone: 'arrows-left-right', iconeLib: 'fa6', corTema: '#ad1457', corFundo: '#fce4ec', categorias: ['Gráficos'] },
  { id: '105', titulo: 'Eixo y', icone: 'arrows-up-down', iconeLib: 'fa6', corTema: '#ad1457', corFundo: '#fce4ec', categorias: ['Gráficos'] },
  { id: '24', titulo: 'Elétron', icone: 'square-minus', iconeLib: 'fa6', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '106', titulo: 'Energia', icone: 'bolt', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades', 'Conceitos gerais'] },
  { id: '107', titulo: 'Energia térmica', icone: 'temperature-high', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades', 'Conceitos gerais'] },
  { id: '25', titulo: 'EPI', icone: 'shield-alt', corTema: '#d84315', corFundo: '#fbe9e7', categorias: ['Segurança no laboratório'] },
  { id: '26', titulo: 'Erlenmeyer', icone: 'flask-empty-outline', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '108', titulo: 'Ervilha', icone: 'seedling', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '27', titulo: 'Espaço', icone: 'keyboard-space', iconeLib: 'material', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '109', titulo: 'Esquerda', icone: 'arrow-left', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '110', titulo: 'Estabelecer', icone: 'handshake', iconeLib: 'fa6', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '28', titulo: 'Estado físico', icone: 'state-machine', iconeLib: 'material', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos'] },
  { id: '111', titulo: 'Evaporação', icone: 'temperature-arrow-up', iconeLib: 'fa6', corTema: '#00695c', corFundo: '#e0f2f1', categorias: ['Separação de misturas', 'Estados físicos'] },
  { id: '29', titulo: 'Exatidão', icone: 'bullseye', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades', 'Medições'] },
  { id: '30', titulo: 'Exercício', icone: 'pen-to-square', iconeLib: 'fa6', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '112', titulo: 'Extração', icone: 'fill-drip', iconeLib: 'fa6', corTema: '#00695c', corFundo: '#e0f2f1', categorias: ['Separação de misturas'] },
  { id: '113', titulo: 'Farinha de trigo', icone: 'wheat-awn', iconeLib: 'fa6', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '31', titulo: 'Fases', icone: 'layer-group', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '114', titulo: 'Feijão', icone: 'seedling', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '32', titulo: 'Ferramenta', icone: 'screwdriver-wrench', iconeLib: 'fa6', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '33', titulo: 'Ferro', icone: 'atom', simbolo: 'Fe', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '115', titulo: 'Ferver', icone: 'fire', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos', 'Estados físicos'] },
  { id: '116', titulo: 'Filtração', icone: 'filter', corTema: '#00695c', corFundo: '#e0f2f1', categorias: ['Separação de misturas'] },
  { id: '117', titulo: 'Fundo', icone: 'arrow-down', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '118', titulo: 'Funil', icone: 'filter-variant', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Materiais'] },
  { id: '34', titulo: 'Gasoso', icone: 'smog', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos'] },
  { id: '119', titulo: 'Gelo', icone: 'snowflake', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos', 'Materiais'] },
  { id: '120', titulo: 'Gráfico', icone: 'chart-simple', iconeLib: 'fa6', corTema: '#ad1457', corFundo: '#fce4ec', categorias: ['Gráficos'] },
  { id: '121', titulo: 'Gravidade', icone: 'weight-hanging', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais', 'Propriedades'] },
  { id: '35', titulo: 'Grécia antiga', icone: 'landmark', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '36', titulo: 'H₂O', icone: 'atom', simbolo: 'H₂O', tamanhoSimbolo: 26, corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas', 'Substâncias e misturas'] },
  { id: '37', titulo: 'Heterogênea', icone: 'bars-staggered', iconeLib: 'fa6', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '38', titulo: 'Hidrogênio', icone: 'atom', simbolo: 'H', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '39', titulo: 'Homogênea', icone: 'equals', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '122', titulo: 'Ímã', icone: 'magnet', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Materiais'] },
  { id: '40', titulo: 'Imutável', icone: 'lock', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades'] },
  { id: '123', titulo: 'Inclinação', icone: 'arrow-trend-up', iconeLib: 'fa6', corTema: '#ad1457', corFundo: '#fce4ec', categorias: ['Gráficos'] },
  { id: '41', titulo: 'Jaleco', icone: 'tshirt', corTema: '#d84315', corFundo: '#fbe9e7', categorias: ['Segurança no laboratório'] },
  { id: '124', titulo: 'Junto', icone: 'object-group', iconeLib: 'fa6', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '42', titulo: 'Laboratório', icone: 'microscope', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '125', titulo: 'Leve', icone: 'feather', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades'] },
  { id: '126', titulo: 'Levigação', icone: 'water', corTema: '#00695c', corFundo: '#e0f2f1', categorias: ['Separação de misturas'] },
  { id: '43', titulo: 'Ligação covalente', icone: 'circle-nodes', iconeLib: 'fa6', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '127', titulo: 'Limpo', icone: 'broom', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '128', titulo: 'Linha', icone: 'minus', corTema: '#ad1457', corFundo: '#fce4ec', categorias: ['Gráficos'] },
  { id: '44', titulo: 'Líquido', icone: 'droplet', iconeLib: 'fa6', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos'] },
  { id: '129', titulo: 'Máquina de lavar', icone: 'washing-machine', iconeLib: 'material', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '130', titulo: 'Mar', icone: 'water', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '45', titulo: 'Massa', icone: 'weight-scale', iconeLib: 'fa6', corTema: '#2e7d32', corFundo: '#e8f5e9', categorias: ['Medições', 'Propriedades'] },
  { id: '46', titulo: 'Matéria', icone: 'cubes', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '131', titulo: 'Material', icone: 'cube', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '47', titulo: 'Mensurar', icone: 'ruler', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos', 'Medições'] },
  { id: '132', titulo: 'Metal', icone: 'cog', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '133', titulo: 'Método', icone: 'list-check', iconeLib: 'fa6', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '134', titulo: 'Milho', icone: 'wheat-awn', iconeLib: 'fa6', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '48', titulo: 'Mililitro (ml)', icone: 'syringe', corTema: '#2e7d32', corFundo: '#e8f5e9', categorias: ['Medições'] },
  { id: '135', titulo: 'Mistura azeotrópica', icone: 'chart-line', iconeLib: 'fa6', corTema: '#ad1457', corFundo: '#fce4ec', categorias: ['Gráficos', 'Propriedades'] },
  { id: '136', titulo: 'Mistura eutética', icone: 'chart-line', iconeLib: 'fa6', corTema: '#ad1457', corFundo: '#fce4ec', categorias: ['Gráficos', 'Propriedades'] },
  { id: '49', titulo: 'Misturar', icone: 'mortar-pestle', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '50', titulo: 'Molécula', icone: 'dna', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '51', titulo: 'Mundo', icone: 'globe', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '52', titulo: 'Nêutron', icone: 'circle', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '53', titulo: 'Óculos de proteção', icone: 'glasses', corTema: '#d84315', corFundo: '#fbe9e7', categorias: ['Segurança no laboratório'] },
  { id: '137', titulo: 'Óleo', icone: 'tint', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas', 'Materiais'] },
  { id: '54', titulo: 'Olho', icone: 'eye', corTema: '#2e7d32', corFundo: '#e8f5e9', categorias: ['Medições'] },
  { id: '55', titulo: 'Oxigênio', icone: 'atom', simbolo: 'O', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '138', titulo: 'Papel de filtro', icone: 'scroll', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Materiais'] },
  { id: '56', titulo: 'Parcela', icone: 'puzzle-piece', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '139', titulo: 'Parecido', icone: 'clone', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '57', titulo: 'Partícula', icone: 'cubes-stacked', iconeLib: 'fa6', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '140', titulo: 'Patamar', icone: 'equals', iconeLib: 'fa6', corTema: '#ad1457', corFundo: '#fce4ec', categorias: ['Gráficos'] },
  { id: '141', titulo: 'Peneiração', icone: 'th', corTema: '#00695c', corFundo: '#e0f2f1', categorias: ['Separação de misturas'] },
  { id: '142', titulo: 'Perder', icone: 'arrow-trend-down', iconeLib: 'fa6', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '143', titulo: 'Pingar', icone: 'droplet', iconeLib: 'fa6', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '58', titulo: 'Pipeta graduada', icone: 'vial', iconeLib: 'fa6', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Medições'] },
  { id: '59', titulo: 'Pipeta volumétrica', icone: 'vials', iconeLib: 'fa6', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Medições'] },
  { id: '60', titulo: 'Pisseta', icone: 'bottle-water', iconeLib: 'fa6', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '61', titulo: 'Ponto de ebulição', icone: 'temperature-high', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos', 'Propriedades'] },
  { id: '62', titulo: 'Ponto de fusão', icone: 'temperature-low', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos', 'Propriedades'] },
  { id: '144', titulo: 'Praia', icone: 'umbrella-beach', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '145', titulo: 'Prato', icone: 'plate-wheat', iconeLib: 'fa6', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '64', titulo: 'Pressão (grandeza física)', icone: 'gauge', iconeLib: 'fa6', corTema: '#2e7d32', corFundo: '#e8f5e9', categorias: ['Medições', 'Propriedades'] },
  { id: '63', titulo: 'Pressão exercida pelo vapor', icone: 'arrows-to-circle', iconeLib: 'fa6', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades', 'Estados físicos'] },
  { id: '65', titulo: 'Próton', icone: 'square-plus', iconeLib: 'fa6', corTema: '#00796b', corFundo: '#e0f2f1', categorias: ['Átomos e moléculas'] },
  { id: '66', titulo: 'Proveta', icone: 'beaker-outline', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Medições'] },
  { id: '67', titulo: 'Química', icone: 'flask-vial', iconeLib: 'fa6', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '146', titulo: 'Rapidamente', icone: 'gauge-high', iconeLib: 'fa6', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '147', titulo: 'Raso', icone: 'arrows-down-to-line', iconeLib: 'fa6', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '68', titulo: 'Reação', icone: 'arrow-right-arrow-left', iconeLib: 'fa6', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais', 'Verbos químicos'] },
  { id: '69', titulo: 'Redundante', icone: 'arrows-rotate', iconeLib: 'fa6', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '148', titulo: 'Resfriamento', icone: 'temperature-low', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos'] },
  { id: '70', titulo: 'Respirar', icone: 'lungs', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '149', titulo: 'Roupa', icone: 'tshirt', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '71', titulo: 'Sal de cozinha', icone: 'bowl-food', iconeLib: 'fa6', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais', 'Substâncias e misturas'] },
  { id: '150', titulo: 'Secador de cabelo', icone: 'wind', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '151', titulo: 'Seco', icone: 'sun', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades', 'Estados físicos'] },
  { id: '152', titulo: 'Separação magnética', icone: 'magnet', corTema: '#00695c', corFundo: '#e0f2f1', categorias: ['Separação de misturas'] },
  { id: '153', titulo: 'Separar', icone: 'arrows-split-up-and-left', iconeLib: 'fa6', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos', 'Separação de misturas'] },
  { id: '72', titulo: 'Sódio', icone: 'atom', simbolo: 'Na', corTema: '#3949ab', corFundo: '#e8eaf6', categorias: ['Elementos', 'Átomos e moléculas'] },
  { id: '73', titulo: 'Sólido', icone: 'gem', corTema: '#00838f', corFundo: '#e0f7fa', categorias: ['Estados físicos'] },
  { id: '74', titulo: 'Solução', icone: 'flask', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '75', titulo: 'Solúvel', icone: 'fill-drip', iconeLib: 'fa6', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades', 'Substâncias e misturas'] },
  { id: '76', titulo: 'Substância', icone: 'bottle-droplet', iconeLib: 'fa6', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '77', titulo: 'Substância composta', icone: 'ellipsis-vertical', iconeLib: 'fa6', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '78', titulo: 'Substância simples', icone: 'ellipsis', iconeLib: 'fa6', corTema: '#0277bd', corFundo: '#e1f5fe', categorias: ['Substâncias e misturas'] },
  { id: '154', titulo: 'Suspenso', icone: 'arrow-up', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '155', titulo: 'Tempo', icone: 'clock', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais', 'Medições'] },
  { id: '156', titulo: 'Terra', icone: 'mound', iconeLib: 'fa6', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais'] },
  { id: '157', titulo: 'Topo', icone: 'angle-up', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
  { id: '158', titulo: 'Tubo', icone: 'pipe', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório', 'Materiais'] },
  { id: '79', titulo: 'Tubo de ensaio', icone: 'test-tube', iconeLib: 'material', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '80', titulo: 'Variar', icone: 'shuffle', iconeLib: 'material', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '81', titulo: 'Variável', icone: 'code', corTema: '#f57f17', corFundo: '#fffde7', categorias: ['Propriedades'] },
  { id: '159', titulo: 'Ventar', icone: 'wind', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos'] },
  { id: '160', titulo: 'Ventilação', icone: 'fan', corTema: '#512da8', corFundo: '#ede7f6', categorias: ['Verbos químicos', 'Separação de misturas'] },
  { id: '82', titulo: 'Vidraria química', icone: 'lab-flask', iconeLib: 'entypo', corTema: '#880e4f', corFundo: '#fce4ec', categorias: ['Laboratório'] },
  { id: '83', titulo: 'Vinagre', icone: 'wine-bottle', corTema: '#6d4c41', corFundo: '#efebe9', categorias: ['Materiais', 'Substâncias e misturas'] },
  { id: '161', titulo: 'Visão', icone: 'eye', corTema: '#7B3E52', corFundo: '#f5e6ea', categorias: ['Conceitos gerais'] },
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

/**
 * Normaliza texto para busca: sem acentos, minúsculo, sem espaços nas pontas
 * e com subscritos químicos (H₂O) convertidos para dígitos (H2O).
 */
export function normalizarBusca(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[₀-₉]/g, (digito) => String(digito.charCodeAt(0) - 0x2080))
    .toLowerCase()
    .trim();
}

/**
 * Busca sinais pelo nome conforme o usuário digita, ignorando acentos e
 * maiúsculas. Casa o começo do título ou de qualquer palavra dele (assim
 * "ar" acha Ar, Área, Areia e Argônio, sem trazer "Aspirar"/"Parcela").
 * Ex.: "ebuli" -> Ponto de ebulição; "h2o" -> H₂O.
 */
export function buscarSinais(termo: string): Sinal[] {
  const busca = normalizarBusca(termo);
  if (!busca) return [];

  const encontrados = sinaisData
    .map((sinal) => {
      const titulo = normalizarBusca(sinal.titulo);
      const palavras = titulo.split(/[\s()\-–—/]+/).filter(Boolean);
      const simbolo = sinal.simbolo ? normalizarBusca(sinal.simbolo) : '';
      let relevancia = -1;
      if (titulo === busca || simbolo === busca) relevancia = 0;
      else if (titulo.startsWith(busca) || palavras.some((palavra) => palavra.startsWith(busca))) {
        relevancia = 1;
      } else if (simbolo.startsWith(busca)) {
        relevancia = 2;
      }
      return { sinal, relevancia, titulo };
    })
    .filter((item) => item.relevancia >= 0);

  encontrados.sort(
    (a, b) => a.relevancia - b.relevancia || a.titulo.localeCompare(b.titulo, 'pt-BR'),
  );
  return encontrados.map((item) => item.sinal);
}
