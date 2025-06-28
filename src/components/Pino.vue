<template>
  <div
      class="caixa-pino"
      :class="{
      'pode-soltar': podeSoltar,
      'pino-selecionado': selecionado,
      'pino-hover': hover
    }"
      @click="$emit('clique')"
      @dragover.prevent="$emit('arrastar-hover')"
      @dragleave="$emit('arrastar-sair')"
      @drop="$emit('soltar')"
      @mouseenter="$emit('mouse-entrar')"
      @mouseleave="$emit('mouse-sair')"
  >
    <div class="haste-pino"></div>
    <div class="base-pino"></div>

    <!-- Discos empilhados neste pino -->
    <div class="container-discos" role="list">
      <Disco
          v-for="(disco, i) in pino"
          :key="`${indicePino}-${disco.id}`"
          :tamanho="disco.tamanho"
          :largura="disco.largura"
          :cor="disco.cor"
          :posy="posicoesBase[i]"
          :topo="i === indiceTopo"
          :selecionado="selecionados[i]"
          :hover="comHover[i]"
          :arrastando="sendoArrastado[i]"
          :oculto="!!ocultos[i]"
          :arrastavel="arrastaveis[i]"
          :animado="false"
          :movendo="!!(discoMovendo && discoMovendo.id === disco.id)"
          role="listitem"
          @click="$emit('disco-clique')"
          @dragstart="$emit('disco-arrastar')"
          @dragend="$emit('disco-arrastar-fim')"
      />
    </div>

    <!-- Disco animado (quando este pino é origem) -->
    <Disco v-if="discoAnimadoDestePino" v-bind="discoAnimadoDestePino" />
  </div>
</template>

<script setup lang="ts">
import Disco from './Disco.vue';
import {tabuleiroVisual, animacaoMovimento} from '../visualConfig.ts';
import {computed} from 'vue';
import type { Disco as DiscoType, DiscoAnimado } from '../types.ts';

const props = defineProps<{
  pino: DiscoType[],
  indicePino: number,
  podeSoltar: boolean,
  selecionado: boolean,
  hover: boolean,
  arrastando: boolean,
  arrastavel: boolean,
  discoMovendo: DiscoAnimado | null
}>();

const posicoesBase = computed(() =>
    props.pino.map((_, i) => tabuleiroVisual.baseDiscos + i * tabuleiroVisual.espacoEntreDiscos)
);

const indiceTopo = computed(() => props.pino.length > 0 ? props.pino.length - 1 : -1);

const selecionados = computed(() =>
    props.pino.map((_, i) => props.selecionado && i === indiceTopo.value)
);

const comHover = computed(() =>
    props.pino.map((_, i) => props.hover && i === indiceTopo.value)
);

const sendoArrastado = computed(() =>
    props.pino.map((_, i) => props.arrastando && i === indiceTopo.value)
);

const ocultos = computed(() =>
    props.pino.map((disco) => props.discoMovendo && props.discoMovendo.id === disco.id)
);

const arrastaveis = computed(() =>
    props.pino.map((_, i) => i === indiceTopo.value && props.arrastavel)
);

const discoAnimadoDestePino = computed(() => {
  const d = props.discoMovendo;
  if (!d || d.pinoOrigem !== props.indicePino) return null;
  
  // Calcula o deslocamento horizontal para o pino de destino
  const deslocamentoHorizontal = (d.pinoDestino - d.pinoOrigem) * (animacaoMovimento.larguraPino + animacaoMovimento.margemPino);
  
  return {
    tamanho: d.tamanho,
    largura: d.largura,
    cor: d.cor,
    posx: '50%',
    posy: d.animandoFinal ? d.bottomFinal : d.bottom,
    topo: false,
    selecionado: false,
    hover: false,
    arrastando: false,
    oculto: false,
    arrastavel: false,
    animado: true,
    transition: animacaoMovimento.transicaoAnimacao,
    transform: d.animandoFinal ? `translateX(calc(-50% + ${deslocamentoHorizontal}px))` : 'translateX(-50%)',
    boxShadow: animacaoMovimento.sombraAnimacao
  };
});

// Eventos emitidos para o pai
defineEmits([
  'clique', 'arrastar-hover', 'arrastar-sair', 'soltar', 'mouse-entrar', 'mouse-sair',
  'disco-clique', 'disco-arrastar', 'disco-arrastar-fim'
]);
</script>

<style scoped>
.caixa-pino {
  width: var(--pino-largura);
  min-height: var(--pino-altura);
  background: var(--pino-cor-fundo);
  border-radius: var(--pino-raio-borda);
  position: relative;
  cursor: pointer;
  padding-bottom: 30px;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s, background 0.2s;
  box-shadow: 0 0 0 0 transparent;
}

.caixa-pino.pino-selecionado, .caixa-pino.pino-hover {
  box-shadow: var(--pino-box-shadow-selecionado);
  background: var(--pino-cor-fundo-selecionado);
}

.caixa-pino.pode-soltar {
  box-shadow: var(--pino-box-shadow-pode-soltar);
  background: var(--pino-cor-fundo-pode-soltar);
}

.caixa-pino.pode-soltar.pino-hover {
  box-shadow: var(--pino-box-shadow-pode-soltar-sobre);
  background: var(--pino-cor-fundo-pode-soltar-sobre);
}

.haste-pino {
  width: var(--pino-largura-haste);
  height: var(--pino-altura-haste);
  background: var(--pino-cor);
  border-radius: var(--pino-raio-haste);
  margin: 0 auto 0 auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  z-index: 1;
}

.base-pino {
  width: var(--pino-largura-base);
  height: var(--pino-altura-base);
  background: var(--pino-cor);
  border-radius: var(--pino-raio-base);
  margin-top: 10px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  z-index: 0;
}

.container-discos {
  position: absolute;
  left: 0;
  bottom: 70px;
  width: 100%;
  height: var(--pino-altura-haste);
  pointer-events: none;
  z-index: 2;
}
</style> 