<template>
  <div class="container-jogo">
    <h1>Torre de Hanói</h1>

    <Controles
        :quantidade-discos="quantidadeDiscos"
        :movimentos="movimentos"
        :auto-resolvendo="autoResolvendo"
        :jogo-ganho="jogoGanho"
        @reiniciar="reiniciarJogo"
        @auto-resolver="autoResolver"
        @alterar-quantidade-discos="aoAlterarQuantidadeDiscos"
    />

    <Tabuleiro
        :pinos="pinos"
        :pino-selecionado="pinoSelecionado"
        :pino-hover="pinoHover"
        :disco-arrastando="discoArrastando"
        :auto-resolvendo="autoResolvendo"
        :jogo-ganho="jogoGanho"
        :disco-movendo="discoMovendo"
        @tabuleiro-clique="pinoSelecionado = null"
        @pino-clique="aoClicarPinoOuDisco"
        @pino-hover="aoArrastarHover"
        @pino-sair="aoArrastarSair"
        @pino-soltar="aoSoltar"
        @pino-mouseentrar="pinoHover = $event"
        @pino-mousesair="pinoHover = null"
        @disco-clique="aoClicarPinoOuDisco"
        @disco-arrastar="aoArrastarInicio"
        @disco-arrastar-fim="aoArrastarFim"
    />

    <div v-if="vitoriaManual" class="mensagem-vitoria">
      🎉 Você venceu em <b>{{ movimentos }}</b> movimentos!
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, nextTick, computed} from 'vue';
import Controles from '@/components/Controles.vue';
import Tabuleiro from '@/components/Tabuleiro.vue';
import {animacaoMovimento, tabuleiroVisual} from '@/visualConfig.ts';
import {inicializarJogo, aplicarMovimento, podeMover, topoDisco} from '@/logica.ts';
import type { DiscoAnimado, EstadoJogo } from '@/types.ts';

// --- ESTADO REATIVO DO JOGO ---
const quantidadeDiscos = ref(4);
const estado = ref<EstadoJogo>(inicializarJogo(quantidadeDiscos.value));
const pinoSelecionado = ref<number | null>(null);
const discoArrastando = ref<number | null>(null);
const pinoHover = ref<number | null>(null);
const autoResolvendo = ref(false);
const discoMovendo = ref<DiscoAnimado | null>(null);
const vitoriaManual = ref(false);

// --- GETTERS DERIVADOS ---
const pinos = computed(() => estado.value.pinos);
const movimentos = computed(() => estado.value.movimentos);
const jogoGanho = computed(() => estado.value.vitoria);

// --- FUNÇÕES DE LÓGICA DO JOGO ---
function reiniciarJogo(novaQuantidade?: number) {
  if (novaQuantidade) {
    quantidadeDiscos.value = novaQuantidade;
  }
  estado.value = inicializarJogo(quantidadeDiscos.value);
  pinoSelecionado.value = null;
  autoResolvendo.value = false;
}

function moverDisco(de: number, para: number) {
  const novoEstado = aplicarMovimento(estado.value, de, para);
  if (novoEstado) {
    estado.value = novoEstado;
  }
}

// --- MANIPULADORES DE EVENTOS (CLIQUE) ---
function aoClicarPinoOuDisco(indicePino: number) {
  if (autoResolvendo.value || jogoGanho.value) return;
  const pino = pinos.value[indicePino];

  if (pinoSelecionado.value === null) {
    if (pino.length > 0) pinoSelecionado.value = indicePino;
  } else if (pinoSelecionado.value === indicePino) {
    pinoSelecionado.value = null;
  } else {
    if (podeMover(pinos.value, pinoSelecionado.value, indicePino)) {
      moverAnimadoSimples(pinoSelecionado.value, indicePino);
    }
    pinoSelecionado.value = null;
  }
}

// --- MANIPULADORES DE EVENTOS (ARRASTAR E SOLTAR) ---
function aoArrastarInicio(indicePino: number) {
  if (autoResolvendo.value || jogoGanho.value) return;
  const pino = pinos.value[indicePino];
  if (pino.length > 0) {
    pinoSelecionado.value = indicePino;
    discoArrastando.value = indicePino;
  }
}

function aoArrastarFim() {
  discoArrastando.value = null;
}

function aoArrastarHover(indicePino: number) {
  if (pinoSelecionado.value !== null && pinoSelecionado.value !== indicePino && podeMover(pinos.value, pinoSelecionado.value, indicePino)) {
    pinoHover.value = indicePino;
  }
}

function aoArrastarSair(indicePino: number) {
  if (pinoHover.value === indicePino) {
    pinoHover.value = null;
  }
}

function aoSoltar(indicePino: number) {
  if (pinoSelecionado.value !== null && pinoSelecionado.value !== indicePino) {
    if (podeMover(pinos.value, pinoSelecionado.value, indicePino)) {
      moverAnimadoSimples(pinoSelecionado.value, indicePino);
    }
  }
  pinoSelecionado.value = null;
  pinoHover.value = null;
  discoArrastando.value = null;
}

// --- LÓGICA DE ANIMAÇÃO ---
function moverAnimadoSimples(de: number, para: number) {
  return new Promise<void>(async (resolve) => {
    if (!podeMover(pinos.value, de, para)) return resolve();

    const disco = topoDisco(pinos.value[de]);
    if (!disco) return resolve();

    const baseDiscos = tabuleiroVisual.baseDiscos;
    const espacoDiscos = tabuleiroVisual.espacoEntreDiscos;
    const bottomInicial = baseDiscos + (pinos.value[de].length - 1) * espacoDiscos;
    const bottomFinal = baseDiscos + pinos.value[para].length * espacoDiscos;

    // Calculando a distância X baseada no DOM real (caixa-pino)
    const pinosDOM = document.querySelectorAll('.caixa-pino');
    let posXAtual = 0;

    if (pinosDOM.length >= 3) {
      const pinoDe = pinosDOM[de].getBoundingClientRect();
      const pinoPara = pinosDOM[para].getBoundingClientRect();

      const pinoDeCenterX = pinoDe.left + pinoDe.width / 2;
      const pinoParaCenterX = pinoPara.left + pinoPara.width / 2;

      // O offset de deslocamento X
      posXAtual = pinoParaCenterX - pinoDeCenterX;
    }

    discoMovendo.value = {
      ...disco,
      pinoOrigem: de,
      pinoDestino: para,
      posY: bottomInicial,
      posX: 0,
      bottomFinal: bottomFinal,
      animandoFinal: false,
    };

    await nextTick();

    // 1. Move para cima
    discoMovendo.value.posY = 350; // alturaAnimacao fixa, superior ao topo do pino
    await new Promise(r => setTimeout(r, animacaoMovimento.tempoAnimacao));

    // 2. Move para os lados
    discoMovendo.value.posX = posXAtual;
    await new Promise(r => setTimeout(r, animacaoMovimento.tempoAnimacao));

    // 3. Move para baixo (até o bottomFinal)
    discoMovendo.value.posY = bottomFinal;
    await new Promise(r => setTimeout(r, animacaoMovimento.tempoAnimacao));

    moverDisco(de, para);

    discoMovendo.value = null;
    resolve();
  });
}

// --- RESOLUÇÃO AUTOMÁTICA ---
async function autoResolver() {
  reiniciarJogo();
  autoResolvendo.value = true;
  await nextTick();
  await resolver(quantidadeDiscos.value, 0, 2, 1);
  autoResolvendo.value = false;
}

async function resolver(n: number, de: number, para: number, aux: number) {
  if (n > 0 && autoResolvendo.value) {
    await resolver(n - 1, de, aux, para);
    if (!autoResolvendo.value) return;
    await moverAnimadoSimples(de, para);
    await resolver(n - 1, aux, para, de);
  }
}

function aoAlterarQuantidadeDiscos(novaQuantidade: number) {
  reiniciarJogo(novaQuantidade);
}

// --- CICLO DE VIDA ---
onMounted(reiniciarJogo);
</script>

<style scoped>
.container-jogo {
  font-family: 'Inter', 'Nunito', 'Segoe UI', Arial, sans-serif;
  width: 100%;
  max-width: 900px;
  margin: 48px auto;
  padding: 36px 32px 32px 32px;
  border-radius: 24px;
  background: #fafdff;
  box-shadow: 0 6px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  box-sizing: border-box;
}

h1 {
  font-size: 2.6rem;
  font-weight: 700;
  margin-bottom: 18px;
  letter-spacing: -1px;
  color: #3a3a4a;
}

.mensagem-vitoria {
  margin-top: 28px;
  color: #26b47a;
  font-size: 1.3rem;
  font-weight: 700;
}

@media (max-width: 900px) {
  .container-jogo {
    margin: 20px;
    padding: 20px;
  }

  h1 {
    font-size: 2rem;
  }
}
</style>