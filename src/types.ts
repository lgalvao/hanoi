export interface Disco {
  id: number;
  tamanho: number;
  cor: string;
  largura: number;
}

export type Pino = Disco[];

export interface DiscoAnimado {
  id: number;
  tamanho: number;
  cor: string;
  largura: number;
  posY: number;
  posX: number;
  pinoOrigem: number;
  pinoDestino: number;
  animandoFinal: boolean;
  bottomFinal: number;
}

export interface EstadoJogo {
  pinos: Pino[];
  movimentos: number;
  vitoria: boolean;
} 