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
// Importações necessárias: o componente filho Pino e tipos TypeScript.
import Pino from './Pino.vue';
import {animacaoMovimento} from '../visualConfig.ts';
import type { Disco, DiscoAnimado } from '../types.ts';

// --- PROPS DO COMPONENTE ---
// defineProps é uma macro do Vue que define as propriedades que o componente pode receber de seu pai.
// Usar TypeScript aqui garante que o pai passe os dados no formato correto.
/**
 * @property {Disco[][]} pinos - A estrutura de dados principal do jogo.
 * @property {number | null} pinoSelecionado - O índice do pino de origem atualmente selecionado.
 * @property {number | null} pinoHover - O índice do pino que está sob o cursor durante um arraste.
 * @property {number | null} discoArrastando - O índice do pino de onde um disco está sendo arrastado.
 * @property {boolean} autoResolvendo - Flag que indica se o modo de resolução automática está ativo.
 * @property {boolean} jogoGanho - Flag que indica se o jogo foi vencido.
 * @property {DiscoAnimado | null} discoMovendo - O objeto do disco "fantasma" em animação.
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

// --- EVENTOS EMITIDOS ---
// defineEmits declara os eventos que este componente pode emitir para o seu pai (App.vue).
// Isso é bom para a documentação e organização do código.
defineEmits([
  'tabuleiro-clique', 'pino-clique', 'pino-hover', 'arrastar-sair', 'pino-soltar',
  'pino-mouseentrar', 'pino-mousesair', 'disco-clique', 'disco-arrastar', 'disco-arrastar-fim'
]);

// --- LÓGICA DE DELEGAÇÃO ---
// Este componente não possui muita lógica própria. Sua principal função é renderizar os pinos
// e delegar as decisões para o componente pai (App.vue), que centraliza o estado.

/**
 * Verifica se um disco pode ser solto em um determinado pino.
 * Esta lógica é usada para aplicar um estilo visual de "drop zone" no Pino.vue.
 * @param {number} indicePino - O índice do pino de destino a ser verificado.
 * @returns {boolean} - True se o disco puder ser solto aqui.
 */
function podeSoltar(indicePino: number): boolean {
  // A condição é que um pino de origem esteja selecionado, o destino não seja a própria origem,
  // e o movimento seja válido de acordo com as regras.
  return props.pinoSelecionado !== null &&
      props.pinoSelecionado !== indicePino &&
      podeMover(props.pinoSelecionado, indicePino);
}

/**
 * Verifica se um disco está sendo arrastado a partir de um pino específico.
 * Usado para passar a prop 'arrastando' para o Pino.vue correto.
 * @param {number} indicePino - O índice do pino a ser verificado.
 * @returns {boolean} - True se um disco está sendo arrastado deste pino.
 */
function estaArrastando(indicePino: number): boolean {
  return props.discoArrastando !== null && props.discoArrastando === indicePino;
}

// --- LÓGICA DE VALIDAÇÃO (DUPLICADA) ---
// As funções `podeMover` e `topoDisco` são duplicadas do App.vue. Em um projeto maior,
// elas poderiam ser extraídas para um arquivo utilitário (um "composable" do Vue)
// para evitar repetição de código. Aqui, a duplicação é mantida para simplicidade,
// já que o Tabuleiro precisa dessa lógica para o feedback visual imediato (`podeSoltar`).

/**
 * Verifica se pode mover um disco de um pino para outro.
 * @param {number} de - Índice do pino de origem.
 * @param {number} para - Índice do pino de destino.
 * @returns {boolean}
 */
function podeMover(de: number, para: number): boolean {
  const discoDe = topoDisco(de);
  const discoPara = topoDisco(para);
  if (!discoDe) return false;
  if (!discoPara) return true;
  return discoDe.tamanho < discoPara.tamanho;
}

/**
 * Retorna o disco do topo de um pino.
 * @param {number} indicePino - O índice do pino.
 * @returns {Disco | null}
 */
function topoDisco(indicePino: number): Disco | null {
  const pino = props.pinos[indicePino];
  return pino.length > 0 ? pino[pino.length - 1] : null;
}

// Define uma variável CSS para a largura do tabuleiro, baseada na configuração visual.
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