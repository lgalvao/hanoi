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
      <DiscoComponent
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
    <DiscoComponent v-if="discoAnimadoDestePino" v-bind="discoAnimadoDestePino" />
  </div>
</template>

<script setup lang="ts">
import DiscoComponent from '@/components/Disco.vue';
import {tabuleiroVisual, animacaoMovimento} from '@/visualConfig.ts';
import {computed} from 'vue';
import type { DiscoAnimado, Pino, Disco } from '@/types.ts';

// --- PROPS DO COMPONENTE ---
// Estas são as propriedades que o Pino recebe do Tabuleiro.
const props = defineProps<{
  pino: Pino, // O array de discos deste pino.
  indicePino: number, // O índice deste pino (0, 1 ou 2).
  podeSoltar: boolean, // Indica se este pino é um destino válido para soltar um disco.
  selecionado: boolean, // Indica se este pino é o pino de origem selecionado.
  hover: boolean, // Indica se o mouse está sobre este pino durante um arraste.
  arrastando: boolean, // Indica se um disco está sendo ativamente arrastado deste pino.
  arrastavel: boolean, // Flag global que permite ou não o arraste (desabilitado durante a auto-resolução).
  discoMovendo: DiscoAnimado | null // O objeto do disco "fantasma" em animação.
}>();

// --- PROPRIEDADES COMPUTADAS (COMPUTED) ---
// Propriedades computadas são uma das funcionalidades mais poderosas do Vue. Elas criam valores
// reativos que são derivados de outras fontes reativas (como props ou refs). Elas são eficientes
// porque o Vue armazena o resultado em cache e só recalcula quando uma de suas dependências muda.

/** Calcula a posição 'bottom' (CSS) para cada disco empilhado no pino. */
const posicoesBase = computed(() =>
    props.pino.map((_: Disco, i: number) =>
        tabuleiroVisual.baseDiscos + i * tabuleiroVisual.alturaDisco
    )
);

/** Retorna o índice do disco que está no topo do pino. */
const indiceTopo = computed(() => (props.pino.length > 0 ? props.pino.length - 1 : -1));

/** Gera um array de booleanos indicando qual disco (se algum) deve ter o estilo 'selecionado'. */
const selecionados = computed(() =>
    props.pino.map((_: Disco, i: number) => props.selecionado && i === indiceTopo.value)
);

/** Gera um array de booleanos indicando qual disco (se algum) deve ter o estilo 'hover'. */
const comHover = computed(() =>
    props.pino.map((_: Disco, i: number) => props.hover && i === indiceTopo.value)
);

/** Gera um array de booleanos indicando qual disco (se algum) está sendo arrastado. */
const sendoArrastado = computed(() =>
    props.pino.map((_: Disco, i: number) => props.arrastando && i === indiceTopo.value)
);

/** Gera um array de booleanos para ocultar o disco original enquanto sua versão "fantasma" está animando. */
const ocultos = computed(() =>
    props.pino.map((disco: Disco) => props.discoMovendo && props.discoMovendo.id === disco.id)
);

/** Gera um array de booleanos indicando qual disco (apenas o do topo) pode ser arrastado. */
const arrastaveis = computed(() =>
    props.pino.map((_: Disco, i: number) => i === indiceTopo.value && props.arrastavel)
);

/**
 * Esta é a lógica central da animação "fantasma".
 * Se este pino for a origem de um movimento, esta propriedade computada cria um objeto
 * com todas as props necessárias para renderizar um componente Disco.vue "fantasma" que
 * se moverá para o pino de destino.
 */
const discoAnimadoDestePino = computed(() => {
  const d = props.discoMovendo;
  // Só cria o disco animado se houver um disco se movendo e se este pino for a origem.
  if (!d || d.pinoOrigem !== props.indicePino) return null;
  
  // Calcula o deslocamento horizontal necessário para a animação.
  const deslocamentoHorizontal = (d.pinoDestino - d.pinoOrigem) * (animacaoMovimento.larguraPino + animacaoMovimento.margemPino);
  
  // Retorna um objeto que será passado como props para um novo componente Disco.
  // Este objeto controla a posição, transformação e estilo do disco durante a animação.
  return {
    tamanho: d.tamanho,
    largura: d.largura,
    cor: d.cor,
    posx: '50%',
    posy: d.animandoFinal ? d.bottomFinal : d.bottom, // Anima a posição vertical.
    topo: false,
    selecionado: false,
    hover: false,
    arrastando: false,
    oculto: false,
    arrastavel: false,
    animado: true, // Flag crucial que diz ao Disco.vue para usar seu estilo de animação.
    transition: animacaoMovimento.transicaoAnimacao,
    transform: d.animandoFinal ? `translateX(calc(-50% + ${deslocamentoHorizontal}px))` : 'translateX(-50%)', // Anima a posição horizontal.
    boxShadow: animacaoMovimento.sombraAnimacao
  };
});

// --- EVENTOS EMITIDOS ---
// Declara os eventos que este componente emite para o Tabuleiro, que por sua vez os delega para o App.vue.
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