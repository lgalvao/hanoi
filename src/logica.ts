import type { Disco, Pino, EstadoJogo } from '@/types';
import { gerarCores } from '@/visualConfig';

/**
 * Gera os discos para uma determinada quantidade, com tamanhos e cores.
 * Os discos são gerados do maior para o menor, seguindo a ordem da Torre de Hanói.
 * 
 * @param {number} quantidade - O número de discos a serem gerados (1-16).
 * @returns {Disco[]} Array de discos ordenados do maior (índice 0) para o menor.
 * 
 * @example
 * ```typescript
 * const discos = gerarDiscos(3);
 * // Retorna: [
 * //   { id: 3, tamanho: 3, largura: 90, cor: '#f44336' },
 * //   { id: 2, tamanho: 2, largura: 65, cor: '#e91e63' },
 * //   { id: 1, tamanho: 1, largura: 40, cor: '#9c27b0' }
 * // ]
 * ```
 */
export function gerarDiscos(quantidade: number): Disco[] {
  const cores = gerarCores(quantidade);
  return Array.from({ length: quantidade }, (_, i) => {
    const tamanho = quantidade - i; // do maior para o menor
    const largura = 40 + (tamanho - 1) * 25;
    return {
      id: tamanho,
      tamanho,
      largura,
      cor: cores[i],
    };
  });
}

/**
 * Gera o estado inicial dos pinos, com todos os discos no primeiro pino.
 * 
 * @param {number} quantidade - O número de discos para o jogo.
 * @returns {Pino[]} Array com 3 pinos: primeiro com todos os discos, outros vazios.
 * 
 * @example
 * ```typescript
 * const pinos = gerarPinosIniciais(3);
 * // Retorna: [
 * //   [{ id: 3, tamanho: 3, ... }, { id: 2, tamanho: 2, ... }, { id: 1, tamanho: 1, ... }],
 * //   [],
 * //   []
 * // ]
 * ```
 */
export function gerarPinosIniciais(quantidade: number): Pino[] {
  return [gerarDiscos(quantidade), [], []];
}

/**
 * Retorna o disco do topo de um pino.
 * 
 * @param {Pino} pino - O pino a ser verificado.
 * @returns {Disco | null} O disco do topo ou null se o pino estiver vazio.
 * 
 * @example
 * ```typescript
 * const pino = [{ id: 3, tamanho: 3, ... }, { id: 1, tamanho: 1, ... }];
 * const topo = topoDisco(pino); // { id: 1, tamanho: 1, ... }
 * ```
 */
export function topoDisco(pino: Pino): Disco | null {
  return pino.length > 0 ? pino[pino.length - 1] : null;
}

/**
 * Verifica se um movimento de um pino para outro é válido de acordo com as regras da Torre de Hanói.
 * 
 * @param {Pino[]} pinos - O estado atual do tabuleiro.
 * @param {number} de - O índice do pino de origem (0, 1 ou 2).
 * @param {number} para - O índice do pino de destino (0, 1 ou 2).
 * @returns {boolean} True se o movimento for válido, false caso contrário.
 * 
 * @example
 * ```typescript
 * const pinos = [
 *   [{ id: 3, tamanho: 3, ... }, { id: 1, tamanho: 1, ... }],
 *   [{ id: 2, tamanho: 2, ... }],
 *   []
 * ];
 * const valido = podeMover(pinos, 0, 1); // false (disco 1 < disco 2)
 * const valido2 = podeMover(pinos, 0, 2); // true (pino vazio)
 * ```
 */
export function podeMover(pinos: Pino[], de: number, para: number): boolean {
  // Não pode mover para o mesmo pino.
  if (de === para) return false;

  const discoDe = topoDisco(pinos[de]);
  const discoPara = topoDisco(pinos[para]);

  // Não pode mover de um pino vazio.
  if (!discoDe) {
    return false;
  }

  // Pode mover para um pino vazio.
  if (!discoPara) {
    return true;
  }

  // Só pode mover um disco menor sobre um maior.
  return discoDe.tamanho < discoPara.tamanho;
}

/**
 * Gera a sequência de movimentos para resolver a Torre de Hanói automaticamente.
 * Implementa o algoritmo recursivo clássico da Torre de Hanói.
 * 
 * @param {number} n - Quantidade de discos a mover.
 * @param {number} de - Pino de origem (0, 1 ou 2).
 * @param {number} para - Pino de destino (0, 1 ou 2).
 * @param {number} aux - Pino auxiliar (0, 1 ou 2).
 * @returns {[number, number][]} Array de movimentos [de, para] para resolver o jogo.
 * 
 * @example
 * ```typescript
 * const movimentos = gerarMovimentosHanoi(3, 0, 2, 1);
 * // Retorna: [[0, 2], [0, 1], [2, 1], [0, 2], [1, 0], [1, 2], [0, 2]]
 * ```
 */
export function gerarMovimentosHanoi(n: number, de: number, para: number, aux: number): [number, number][] {
  const movimentos: [number, number][] = [];
  function resolver(m: number, d: number, p: number, a: number) {
    if (m > 0) {
      resolver(m - 1, d, a, p);
      movimentos.push([d, p]);
      resolver(m - 1, a, p, d);
    }
  }
  resolver(n, de, para, aux);
  return movimentos;
}

/**
 * Move um disco de um pino para outro, retornando um novo array de pinos (imutável).
 * Retorna null se o movimento não for válido.
 *
 * @param {Pino[]} pinos - Estado atual dos pinos.
 * @param {number} de - Índice do pino de origem.
 * @param {number} para - Índice do pino de destino.
 * @returns {Pino[] | null} Novo array de pinos após o movimento, ou null se inválido.
 *
 * @example
 * ```typescript
 * const novoEstado = moverDisco(pinos, 0, 2);
 * ```
 */
export function moverDisco(pinos: Pino[], de: number, para: number): Pino[] | null {
  if (!podeMover(pinos, de, para)) return null;
  if (de === para) return null;
  if (pinos[de].length === 0) return null;

  // Copia profunda dos pinos
  const novosPinos: Pino[] = pinos.map(p => [...p]);
  const disco = novosPinos[de].pop();
  if (!disco) return null;
  novosPinos[para].push(disco);
  return novosPinos;
}

/**
 * Verifica se o jogo foi vencido (todos os discos no último pino).
 *
 * @param {Pino[]} pinos - Estado atual dos pinos.
 * @returns {boolean} True se o jogo foi vencido.
 *
 * @example
 * ```typescript
 * const ganhou = verificarVitoria(pinos);
 * ```
 */
export function verificarVitoria(pinos: Pino[]): boolean {
  // Considera vitória se todos os discos estão no último pino e os outros estão vazios
  return pinos.slice(0, -1).every(p => p.length === 0) && pinos[pinos.length - 1].length > 0;
}

/**
 * Inicializa o estado completo do jogo.
 * @param quantidade Número de discos
 * @returns EstadoJogo inicial
 */
export function inicializarJogo(quantidade: number): EstadoJogo {
  return {
    pinos: gerarPinosIniciais(quantidade),
    movimentos: 0,
    vitoria: false,
  };
}

/**
 * Aplica um movimento ao estado do jogo, retornando um novo estado (imutável).
 * Retorna null se o movimento não for válido.
 * @param estado Estado atual do jogo
 * @param de Índice do pino de origem
 * @param para Índice do pino de destino
 * @returns Novo EstadoJogo ou null se inválido
 */
export function aplicarMovimento(estado: EstadoJogo, de: number, para: number): EstadoJogo | null {
  const novosPinos = moverDisco(estado.pinos, de, para);
  if (!novosPinos) return null;
  const vitoria = verificarVitoria(novosPinos);
  return {
    pinos: novosPinos,
    movimentos: estado.movimentos + 1,
    vitoria,
  };
}
