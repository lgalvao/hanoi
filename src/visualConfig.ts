/**
 * Configurações visuais do tabuleiro do jogo.
 * Define dimensões, espaçamentos e posicionamento dos elementos.
 */
export const tabuleiroVisual = {
  larguraBaseDisco: 60,
  fatorLarguraDisco: 20,
  baseDiscos: 70,
  espacoEntreDiscos: 25,
  alturaDisco: 25
} as const;

/**
 * Configurações de animação para movimentos de discos.
 * Controla timing, transições e efeitos visuais das animações.
 */
export const animacaoMovimento = {
  larguraTabuleiro: 900,
  larguraPino: 200,
  margemPino: 10,
  tempoAnimacao: 300,
  tempoRenderizacao: 10,
  tempoLimpeza: 50,
  transicaoAnimacao: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndexAnimacao: 1000,
  sombraAnimacao: '0 8px 32px rgba(0, 0, 0, 0.3)'
} as const;

/**
 * Configurações visuais dos discos individuais.
 * Define aparência, dimensões e estilos dos discos.
 */
export const discoVisual = {
  altura: 25,
  raioBorda: 12.5,
  borda: '2px solid rgba(0, 0, 0, 0.1)',
  sombra: '0 2px 8px rgba(0, 0, 0, 0.15)',
  transicao: 'all 0.2s ease',
  fontePeso: 'bold',
  corTexto: '#ffffff',
  sombraTexto: '1px 1px 2px rgba(0, 0, 0, 0.5)'
} as const;

/**
 * Paleta de cores para os discos do jogo.
 * Cores vibrantes e distintas para facilitar identificação visual.
 */
export const CORES_DISCOS = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
  '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
  '#ff5722'
];

/**
 * Gera uma lista de cores para os discos baseada na quantidade especificada.
 * Retorna uma fatia da paleta de cores, garantindo que não exceda o limite disponível.
 * 
 * @param {number} quantidade - O número de discos que precisam de cores.
 * @returns {string[]} Array de strings de cores hexadecimais.
 * 
 * @example
 * ```typescript
 * const cores = gerarCores(3);
 * // Retorna: ['#f44336', '#e91e63', '#9c27b0']
 * ```
 */
export function gerarCores(quantidade: number): string[] {
  // Retorna uma fatia da paleta de cores, garantindo que não estoure o limite.
  return CORES_DISCOS.slice(0, quantidade);
}