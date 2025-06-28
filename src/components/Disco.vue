<template>
  <div
      class="disco"
      :class="{
      'selecionado': props.selecionado,
      'hover': props.hover,
      'arrastando': props.arrastando,
      'oculto': props.oculto,
      'disco-animado': props.animado
    }"
      :style="estiloDisco"
      :draggable="props.arrastavel && !props.animado"
      :aria-label="`Disco de tamanho ${props.tamanho}`"
      role="button"
      tabindex="0"
      @keydown="onKeydown"
      @click.stop="$emit('clique')"
      @dragstart="$emit('arrastar')"
      @dragend="$emit('arrastar-fim')"
  >
    {{ props.tamanho || '' }}
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {discoVisual, animacaoMovimento} from '../visualConfig.ts';

// --- PROPS DO COMPONENTE ---
// Define as propriedades que o componente Disco pode receber. A maioria delas controla o estado visual do disco.
interface DiscoProps {
  tamanho: number; // O tamanho lógico do disco (ex: 1, 2, 3...), usado para calcular a largura.
  largura: number; // A largura visual em pixels.
  cor: string; // A cor de fundo do disco.
  posx?: string; // Posição horizontal (CSS 'left'). Padrão é '50%'.
  posy?: number; // Posição vertical (CSS 'bottom'). Padrão é 0.
  topo?: boolean; // É o disco do topo da pilha?
  selecionado?: boolean; // O pino de origem está selecionado?
  hover?: boolean; // O mouse está sobre o pino de origem?
  arrastando?: boolean; // Este disco está sendo arrastado?
  oculto?: boolean; // Deve ser ocultado (durante a animação fantasma)?
  arrastavel?: boolean; // Pode ser arrastado pelo usuário?
  movendo?: boolean; // Está em movimento?
  animado?: boolean; // É um disco "fantasma" em animação?
  transition?: string; // Propriedade CSS 'transition' para animações.
  transform?: string; // Propriedade CSS 'transform' para animações.
  boxShadow?: string // Propriedade CSS 'box-shadow' para animações.
}

const props = withDefaults(defineProps<DiscoProps>(), {
  // Valores padrão para as props opcionais.
  posx: '50%',
  posy: 0,
  topo: false,
  selecionado: false,
  hover: false,
  arrastando: false,
  oculto: false,
  arrastavel: false,
  movendo: false,
  animado: false,
});

// --- PROPRIEDADES COMPUTADAS PARA ESTILOS ---
// O Vue recalculará essas propriedades automaticamente sempre que uma das 'props' de que elas dependem mudar.

/**
 * 'estiloAnimado' é uma propriedade computada que gera um objeto de estilos CSS inline.
 * Usar estilos inline aqui é ideal para propriedades dinâmicas que mudam com frequência,
 * como a posição e a cor, que são baseadas no estado do jogo.
 */
const estiloAnimado = computed(() => {
  return {
    width: `${props.largura}px`, // Largura visual do disco.
    height: `${discoVisual.altura}px`, // Altura visual do disco.
    backgroundColor: props.cor, // Cor do disco.
    left: props.posx, // Posição horizontal (geralmente '50%' para centralizar).
    bottom: `${props.posy}px`, // Posição vertical a partir da base do pino.
    zIndex: animacaoMovimento.zIndexAnimacao, // Z-index para garantir que o disco animado fique acima dos outros.
    transition: props.transition || animacaoMovimento.transicaoAnimacao, // Transição para animações.
    transform: props.transform || 'translateX(-50%)', // Transformação para animações.
    boxShadow: props.boxShadow || discoVisual.sombra, // Sombra para destacar o disco.
    border: discoVisual.borda, // Borda do disco.
    borderRadius: `${discoVisual.raioBorda}px`, // Raio da borda do disco.
    display: 'flex', // Display para centralizar o texto.
    alignItems: 'center', // Alinha os itens verticalmente.
    justifyContent: 'center', // Alinha os itens horizontalmente.
    fontWeight: discoVisual.fontePeso, // Peso da fonte do texto.
    color: discoVisual.corTexto, // Cor do texto.
    textShadow: discoVisual.sombraTexto, // Sombra do texto.
    position: 'absolute', // Posição absoluta para permitir a animação.
    pointerEvents: 'none' as const, // Desabilita os eventos de ponteiro para o disco animado.
  };
});

/**
 * 'estiloEmpilhado' é uma propriedade computada que gera um objeto de estilos CSS inline.
 * Usar estilos inline aqui é ideal para propriedades dinâmicas que mudam com frequência,
 * como a posição e a cor, que são baseadas no estado do jogo.
 */
const estiloEmpilhado = computed(() => {
  const largura = props.largura;
  const posicaoBase = props.posy;
  let transform = 'translateX(-50%)';
  let boxShadow = discoVisual.sombra;
  let transition = discoVisual.transicao;
  let opacity = 1;

  if (props.movendo) { opacity = 0; }

  return {
    width: `${largura}px`, // Largura visual do disco.
    height: `${discoVisual.altura}px`, // Altura visual do disco.
    backgroundColor: props.cor, // Cor do disco.
    bottom: `${posicaoBase}px`, // Posição vertical a partir da base do pino.
    zIndex: props.topo ? 100 : 10, // Z-index para garantir que o disco do topo fique acima dos outros.
    transition, // Transição para animações.
    transform, // Transformação para animações.
    boxShadow, // Sombra para destacar o disco.
    opacity, // Opacidade para o disco em movimento.
    border: discoVisual.borda, // Borda do disco.
    borderRadius: `${discoVisual.raioBorda}px`, // Raio da borda do disco.
    display: 'flex', // Display para centralizar o texto.
    alignItems: 'center', // Alinha os itens verticalmente.
    justifyContent: 'center', // Alinha os itens horizontalmente.
    fontWeight: discoVisual.fontePeso, // Peso da fonte do texto.
    color: discoVisual.corTexto, // Cor do texto.
    textShadow: discoVisual.sombraTexto, // Sombra do texto.
    position: 'absolute', // Posição absoluta para permitir a animação.
    left: '50%' // Posição horizontal (geralmente '50%' para centralizar).
  };
});

/**
 * 'estiloDisco' é uma propriedade computada que gera um objeto de estilos CSS inline.
 * Usar estilos inline aqui é ideal para propriedades dinâmicas que mudam com frequência,
 * como a posição e a cor, que são baseadas no estado do jogo.
 */
const estiloDisco = computed(() => {
  return props.animado ? estiloAnimado.value : estiloEmpilhado.value;
});

// --- EVENTOS EMITIDOS ---
// Declara os eventos que o componente pode emitir. Eles são capturados pelo Pino.vue e delegados para cima.
const emit = defineEmits(['clique', 'arrastar', 'arrastar-fim']);

// --- LÓGICA DE EVENTOS ---

/**
 * Manipulador para o evento 'keydown'.
 * Permite ativar o disco via teclado (Enter ou Espaço).
 * @param {KeyboardEvent} evento - O evento de teclado do navegador.
 */
function onKeydown(evento: KeyboardEvent) {
  if ((evento.key === 'Enter' || evento.key === ' ') && !props.animado && props.arrastavel) {
    evento.preventDefault();
    // Emite clique para seleção/movimentação (o pai deve tratar esse evento).
    emit('clique');
  }
}
</script>

<style scoped>
.disco {
  pointer-events: auto;
  cursor: pointer;
  user-select: none;
}

.disco:hover {
  transform: scale(1.02);
}

.disco.selecionado {
  transform: scale(1.05) !important;
  box-shadow: 0 0 15px var(--disco-selecionado-glow1), 0 0 25px var(--disco-selecionado-glow2) !important;
  z-index: 100 !important;
}

.disco.hover {
  box-shadow: 0 0 0 4px var(--disco-hover-border), 0 4px 16px var(--disco-hover-shadow) !important;
  border: 3px solid var(--disco-hover-border) !important;
  z-index: 2000 !important;
}

.disco.arrastando {
  opacity: 0.7;
  box-shadow: 0 0 0 6px var(--disco-drag-shadow) !important;
  z-index: 3000 !important;
}

.disco.oculto {
  opacity: 0 !important;
  pointer-events: none;
}

.disco-animado {
  pointer-events: none;
}
</style>