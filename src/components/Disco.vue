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

interface DiscoProps {
  tamanho: number;
  largura: number;
  cor: string;
  posx?: number | string;
  posy?: number;
  topo?: boolean;
  selecionado?: boolean;
  hover?: boolean;
  arrastando?: boolean;
  oculto?: boolean;
  arrastavel?: boolean;
  movendo?: boolean;
  animado?: boolean;
  transition?: string;
  transform?: string;
  sombra?: string;
}

const props = withDefaults(defineProps<DiscoProps>(), {
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
  transition: '',
  transform: 'translateX(-50%)',
  sombra: ''
});

const emit = defineEmits(['clique', 'arrastar', 'arrastar-fim']);

const estiloAnimado = computed(() => {
  return {
    width: `${props.largura}px`,
    height: `${discoVisual.altura}px`,
    backgroundColor: props.cor,
    left: props.posx,
    bottom: `${props.posy}px`,
    zIndex: animacaoMovimento.zIndexAnimacao,
    transition: props.transition || animacaoMovimento.transicaoAnimacao,
    transform: props.transform || 'translateX(-50%)',
    boxShadow: props.sombra || discoVisual.sombra,
    border: discoVisual.borda,
    borderRadius: `${discoVisual.raioBorda}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: discoVisual.fontePeso,
    color: discoVisual.corTexto,
    textShadow: discoVisual.sombraTexto,
    position: 'absolute',
    pointerEvents: 'none' as const,
  };
});

const estiloEmpilhado = computed(() => {
  const largura = props.largura;
  const posicaoBase = props.posy;
  let transform = 'translateX(-50%)';
  let boxShadow = discoVisual.sombra;
  let transition = discoVisual.transicao;
  let opacity = 1;

  if (props.movendo) { opacity = 0; }

  return {
    width: `${largura}px`,
    height: `${discoVisual.altura}px`,
    backgroundColor: props.cor,
    bottom: `${posicaoBase}px`,
    zIndex: props.topo ? 100 : 10,
    transition,
    transform,
    boxShadow,
    opacity,
    border: discoVisual.borda,
    borderRadius: `${discoVisual.raioBorda}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: discoVisual.fontePeso,
    color: discoVisual.corTexto,
    textShadow: discoVisual.sombraTexto,
    position: 'absolute',
    left: '50%'
  };
});

const estiloDisco = computed(() => {
  return props.animado ? estiloAnimado.value : estiloEmpilhado.value;
});

// Acessibilidade: permite ativar o disco via teclado (Enter ou Espaço)
function onKeydown(e: KeyboardEvent) {
  if ((e.key === 'Enter' || e.key === ' ') && !props.animado && props.arrastavel) {
    e.preventDefault();
    // Emite clique para seleção/movimentação (o pai deve tratar esse evento)
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