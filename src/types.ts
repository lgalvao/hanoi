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
  bottom: number;
  bottomFinal: number;
  animandoFinal: boolean;
  pinoOrigem: number;
  pinoDestino: number;
}

export interface EstadoJogo {
  pinos: Pino[];
  movimentos: number;
  vitoria: boolean;
} 