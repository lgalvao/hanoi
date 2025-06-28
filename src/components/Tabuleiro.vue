<template>
  <div class="tabuleiro" role="region"
       aria-label="Tabuleiro da Torre de Hanói"
       @click.self="$emit('tabuleiro-clique')"
       :style="{ '--tabuleiro-largura': tabuleiroLargura }">

    <Pino
        v-for="(pino, indicePino) in pinos"
        :key="indicePino"
        :pino="pino"
        :indice-pino="indicePino"
        :pode-soltar="podeSoltar(indicePino)"
        :selecionado="pinoSelecionado === indicePino"
        :hover="pinoHover === indicePino"
        :arrastando="estaArrastando(indicePino)"
        :arrastavel="!autoResolvendo && !jogoGanho"
        :disco-movendo="discoMovendo"
        @click="$emit('pino-clique', indicePino)"
        @dragover="$emit('pino-hover', indicePino)"
        @dragleave="$emit('arrastar-sair', indicePino)"
        @drop="$emit('pino-soltar', indicePino)"
        @mouseenter="$emit('pino-mouseentrar', indicePino)"
        @mouseleave="$emit('pino-mousesair', indicePino)"
        @disco-clique="$emit('disco-clique', indicePino)"
        @disco-dragstart="$emit('disco-arrastar', indicePino)"
        @disco-dragend="$emit('disco-arrastar-fim')"
        role="list"
    />
  </div>
</template>

<script setup lang="ts">

import Pino from './Pino.vue';
import {animacaoMovimento} from '../visualConfig.ts';
import type { Disco, DiscoAnimado } from '../types.ts';

/**
 * Props do componente Tabuleiro
 * @prop {Disco[][]} pinos - Array de pinos (cada um é um array de discos)
 * @prop {Number} pinoSelecionado - Índice do pino selecionado
 * @prop {Number} pinoHover - Índice do pino com hover
 * @prop {Number} discoArrastando - Índice do pino sendo arrastado (ou null)
 * @prop {Boolean} autoResolvendo - Se está no modo auto-resolver
 * @prop {Boolean} jogoGanho - Se o jogo foi ganho
 * @prop {Object} discoMovendo - Disco em animação
 */
const props = defineProps<{
  pinos: Disco[][],
  pinoSelecionado: number | null,
  pinoHover: number | null,
  discoArrastando: number | null,
  autoResolvendo: boolean,
  jogoGanho: boolean,
  discoMovendo: DiscoAnimado | null
}>();

defineEmits([
  'tabuleiro-clique', 'pino-clique', 'pino-hover', 'arrastar-sair', 'pino-soltar',
  'pino-mouseentrar', 'pino-mousesair', 'disco-clique', 'disco-arrastar', 'disco-arrastar-fim'
]);

// Verifica se pode soltar um disco neste pino
function podeSoltar(indicePino: number): boolean {
  return props.pinoSelecionado !== null &&
      props.pinoSelecionado !== indicePino &&
      podeMover(props.pinoSelecionado, indicePino);
}

// Verifica se está arrastando um disco neste pino
function estaArrastando(indicePino: number): boolean {
  return props.discoArrastando !== null && props.discoArrastando === indicePino;
}

// Verifica se pode mover um disco de um pino para outro
function podeMover(de: number, para: number): boolean {
  const discoDe = topoDisco(de);
  const discoPara = topoDisco(para);
  if (!discoDe) return false;
  if (!discoPara) return true;
  return discoDe.tamanho < discoPara.tamanho;
}

// Retorna o disco do topo de um pino
function topoDisco(indicePino: number): Disco | null {
  const pino = props.pinos[indicePino];
  return pino.length > 0 ? pino[pino.length - 1] : null;
}

const tabuleiroLargura = animacaoMovimento.larguraTabuleiro + 'px';
</script>

<style scoped>
.tabuleiro {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: var(--tabuleiro-altura);
  background: var(--tabuleiro-cor-fundo);
  border-radius: var(--tabuleiro-raio-borda);
  box-shadow: var(--tabuleiro-box-shadow);
  padding: 32px 0 48px 0;
  position: relative;
  overflow: visible;
  width: var(--tabuleiro-largura);
  margin: 40px auto 0;
}

@media (max-width: 900px) {
  .tabuleiro {
    height: 320px;
    padding: 12px 0 0 0;
  }
}
</style> 