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

<script setup>
import {onMounted, ref} from 'vue';
import Controles from './components/Controles.vue';
import Tabuleiro from './components/Tabuleiro.vue';
import {tabuleiroVisual, animacaoMovimento} from './visualConfig.ts';

/**
 * Estado principal do jogo e funções utilitárias
 * @prop {Number} quantidadeDiscos - Quantidade de discos
 * @prop {Array} pinos - Array de pinos (cada um é um array de discos)
 * @prop {Number} pinoSelecionado - Índice do pino selecionado
 * @prop {Number} movimentos - Número de movimentos realizados
 * @prop {Boolean} jogoGanho - Se o jogo foi ganho
 * @prop {Boolean} autoResolvendo - Se está no modo auto-resolver
 * @prop {Object} discoMovendo - Disco em animação
 * @prop {Number} pinoHover - Índice do pino com hover
 * @prop {Number} discoArrastando - Índice do pino sendo arrastado (ou null)
 */
const quantidadeDiscos = ref(4);
const pinos = ref([[], [], []]);
const pinoSelecionado = ref(null);
const movimentos = ref(0);
const jogoGanho = ref(false);
const autoResolvendo = ref(false);
const discoMovendo = ref(null);
const pinoHover = ref(null);
const discoArrastando = ref(null);
const vitoriaManual = ref(false);

// === Tempos de animação (ms) ===

// Utilitário para cor e largura do disco
const coresDiscos = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24',
  '#eb4d4b', '#a55eea', '#fd79a8', '#6c5ce7'
];

/**
 * Retorna a cor do disco pelo id
 * @param {Number} id
 * @returns {String}
 */
function corDisco(id) {
  return coresDiscos[(id - 1) % coresDiscos.length];
}

/**
 * Retorna a largura do disco pelo tamanho
 * @param {Number} tamanho
 * @returns {Number}
 */
function larguraDisco(tamanho) {
  return tabuleiroVisual.larguraBaseDisco + tamanho * tabuleiroVisual.fatorLarguraDisco;
}

/**
 * Inicializa o jogo com todos os discos no primeiro pino
 */
function inicializarJogo() {
  pinos.value = [[], [], []];

  for (let i = quantidadeDiscos.value; i >= 1; i--) {
    pinos.value[0].push({id: i, tamanho: i, cor: corDisco(i), largura: larguraDisco(i)});
  }

  pinoSelecionado.value = null;
  movimentos.value = 0;
  jogoGanho.value = false;
  autoResolvendo.value = false;
  discoMovendo.value = null;
  pinoHover.value = null;
  discoArrastando.value = null;
}

/**
 * Reinicia o jogo
 */
function reiniciarJogo() {
  inicializarJogo();
  vitoriaManual.value = false;
}

/**
 * Altera a quantidade de discos e reinicia o jogo
 * @param {Number} novoValor
 */
function aoAlterarQuantidadeDiscos(novoValor) {
  quantidadeDiscos.value = novoValor;
  reiniciarJogo();
}

/**
 * Lida com o clique em pino ou disco
 * @param {Number} indicePino
 */
function aoClicarPinoOuDisco(indicePino) {
  if (autoResolvendo.value || jogoGanho.value) return;

  const pino = pinos.value[indicePino];

  if (pinoSelecionado.value === null) {
    if (pino.length > 0) pinoSelecionado.value = indicePino;
  } else if (pinoSelecionado.value === indicePino) {
    pinoSelecionado.value = null;
  } else {
    if (podeMover(pinoSelecionado.value, indicePino)) {
      moverAnimadoSimples(pinoSelecionado.value, indicePino);
    }
    pinoSelecionado.value = null;
  }
}

/**
 * Verifica se pode mover o disco do topo de um pino para outro
 * @param {Number} de
 * @param {Number} para
 * @returns {Boolean}
 */
function podeMover(de, para) {
  const discoDe = topoDisco(de);
  const discoPara = topoDisco(para);

  if (!discoDe) return false;
  if (!discoPara) return true;

  return discoDe.tamanho < discoPara.tamanho;
}

/**
 * Retorna o disco do topo de um pino
 * @param {Number} indicePino
 * @returns {Object|null}
 */
function topoDisco(indicePino) {
  const pino = pinos.value[indicePino];
  return pino.length > 0 ? pino[pino.length - 1] : null;
}

/**
 * Verifica se o jogo foi ganho
 */
function verificarVitoria() {
  if (pinos.value[2].length === quantidadeDiscos.value) {
    if (!autoResolvendo.value) {
      vitoriaManual.value = true;
    }
    jogoGanho.value = true;
  }
}

/**
 * Resolve o jogo automaticamente usando o algoritmo de Hanói
 */
async function autoResolver() {
  if (jogoGanho.value) return;
  autoResolvendo.value = true;
  pinoSelecionado.value = null;
  vitoriaManual.value = false;

  async function resolver(n, de, para, aux) {
    if (n === 1) {
      await moverAnimadoSimples(de, para);
    } else {
      await resolver(n - 1, de, aux, para);
      await moverAnimadoSimples(de, para);
      await resolver(n - 1, aux, para, de);
    }
  }

  await resolver(quantidadeDiscos.value, 0, 2, 1);
  autoResolvendo.value = false;
}

// Eventos de arrastar e soltar
function aoArrastarInicio(indicePino) {
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

function aoArrastarHover(indicePino) {
  if (pinoSelecionado.value !== null && pinoSelecionado.value !== indicePino && podeMover(pinoSelecionado.value, indicePino)) {
    pinoHover.value = indicePino;
  }
}

function aoArrastarSair(indicePino) {
  if (pinoHover.value === indicePino) {
    pinoHover.value = null;
  }
}

function aoSoltar(indicePino) {
  if (pinoSelecionado.value !== null && pinoSelecionado.value !== indicePino) {
    if (podeMover(pinoSelecionado.value, indicePino)) {
      moverAnimadoSimples(pinoSelecionado.value, indicePino);
    }
  }
  pinoSelecionado.value = null;
  pinoHover.value = null;
  discoArrastando.value = null;
}

function moverAnimadoSimples(de, para) {
  return new Promise(async (resolve) => {
    if (!podeMover(de, para)) return resolve();

    const disco = pinos.value[de][pinos.value[de].length - 1];
    const cor = corDisco(disco.id);
    const largura = larguraDisco(disco.tamanho);
    // Índice do disco no pino de origem
    const indiceOrigem = pinos.value[de].length - 1;
    // Índice do disco no pino de destino
    const indiceDestino = pinos.value[para].length;
    // Cálculo igual ao dos discos empilhados
    const bottomOrigem = tabuleiroVisual.baseDiscos + indiceOrigem * tabuleiroVisual.espacoEntreDiscos;
    const bottomDestino = tabuleiroVisual.baseDiscos + indiceDestino * tabuleiroVisual.espacoEntreDiscos;

    // Cria disco na posição inicial
    discoMovendo.value = {
      id: disco.id,
      tamanho: disco.tamanho,
      cor,
      largura,
      bottom: bottomOrigem,
      bottomFinal: bottomDestino,
      animandoFinal: false,
      pinoOrigem: de,
      pinoDestino: para
    };

    // Espera próximo tick para garantir renderização
    await new Promise(r => setTimeout(r, animacaoMovimento.tempoRenderizacao));
    // Agora ativa animação para destino
    discoMovendo.value = {
      ...discoMovendo.value,
      animandoFinal: true
    };

    // Tempo da animação
    await new Promise(r => setTimeout(r, animacaoMovimento.tempoAnimacao));

    // Move o disco nos dados
    pinos.value[para].push(pinos.value[de].pop());
    movimentos.value++;
    verificarVitoria();

    // Limpa animação
    discoMovendo.value = null;
    await new Promise(r => setTimeout(r, animacaoMovimento.tempoLimpeza));
    resolve();
  });
}

// Inicializa o jogo ao montar o componente
onMounted(() => {
  inicializarJogo();
});
</script>

<style scoped>
.container-jogo {
  font-family: 'Inter', 'Nunito', 'Segoe UI', Arial, sans-serif;
  max-width: 900px;
  margin: 48px auto;
  padding: 36px 32px 32px 32px;
  border-radius: 24px;
  background: #fafdff;
  box-shadow: 0 6px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
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