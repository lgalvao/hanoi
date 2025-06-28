// Configurações visuais do tabuleiro
export const tabuleiroVisual = {
  larguraBaseDisco: 60,
  fatorLarguraDisco: 20,
  baseDiscos: 70,
  espacoEntreDiscos: 25
} as const;

// Configurações de animação
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

// Configurações visuais do disco
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