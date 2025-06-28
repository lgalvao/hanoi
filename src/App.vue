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
// Importações essenciais do Vue e dos componentes filhos.
import {onMounted, ref} from 'vue';
import Controles from './components/Controles.vue';
import Tabuleiro from './components/Tabuleiro.vue';
// Importa configurações visuais e de animação para manter a consistência.
import {tabuleiroVisual, animacaoMovimento} from './visualConfig.ts';

// --- ESTADO REATIVO DO JOGO ---
// A função ref() do Vue cria uma referência reativa. Sempre que o valor .value
// de uma referência é alterado, o Vue atualiza automaticamente a interface.

/** @type {import('vue').Ref<number>} Número de discos no jogo. */
const quantidadeDiscos = ref(4);

/** @type {import('vue').Ref<Array<Array<{id: number, tamanho: number, cor: string, largura: number}>>>} Estrutura principal do jogo. Um array de 3 pinos, onde cada pino é um array de discos. */
const pinos = ref([[], [], []]);

/** @type {import('vue').Ref<number | null>} Índice do pino de origem selecionado pelo jogador (0, 1 ou 2). */
const pinoSelecionado = ref(null);

/** @type {import('vue').Ref<number>} Contador de movimentos realizados. */
const movimentos = ref(0);

/** @type {import('vue').Ref<boolean>} Indica se a condição de vitória foi alcançada. */
const jogoGanho = ref(false);

/** @type {import('vue').Ref<boolean>} Flag para controlar o modo de resolução automática, desabilitando interações do usuário. */
const autoResolvendo = ref(false);

/** @type {import('vue').Ref<Object | null>} Objeto que representa o disco "fantasma" durante a animação de movimento. */
const discoMovendo = ref(null);

/** @type {import('vue').Ref<number | null>} Índice do pino sobre o qual o mouse está passando durante um arraste. */
const pinoHover = ref(null);

/** @type {import('vue').Ref<number | null>} Índice do pino de onde um disco está sendo arrastado. */
const discoArrastando = ref(null);

/** @type {import('vue').Ref<boolean>} Controla a exibição da mensagem de vitória para jogadas manuais. */
const vitoriaManual = ref(false);

// --- FUNÇÕES DE CONFIGURAÇÃO E UTILITÁRIOS ---

// Paleta de cores para os discos. O operador de módulo (%) garante que as cores se repitam se houver mais discos que cores.
const coresDiscos = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24',
  '#eb4d4b', '#a55eea', '#fd79a8', '#6c5ce7'
];

/**
 * Retorna uma cor para o disco com base em seu ID.
 * @param {number} id - O ID do disco.
 * @returns {string} A cor em formato hexadecimal.
 */
function corDisco(id) {
  return coresDiscos[(id - 1) % coresDiscos.length];
}

/**
 * Calcula a largura visual de um disco com base em seu tamanho lógico.
 * @param {number} tamanho - O tamanho do disco (ex: 1, 2, 3...).
 * @returns {number} A largura em pixels.
 */
function larguraDisco(tamanho) {
  return tabuleiroVisual.larguraBaseDisco + tamanho * tabuleiroVisual.fatorLarguraDisco;
}

// --- LÓGICA PRINCIPAL DO JOGO ---

/**
 * Prepara o tabuleiro para um novo jogo. Limpa os pinos e adiciona o número
 * correto de discos ao primeiro pino, em ordem decrescente.
 */
function inicializarJogo() {
  // Reseta todos os estados para os valores iniciais.
  pinos.value = [[], [], []];

  // Cria os discos e os coloca no primeiro pino (pino 0).
  for (let i = quantidadeDiscos.value; i >= 1; i--) {
    pinos.value[0].push({id: i, tamanho: i, cor: corDisco(i), largura: larguraDisco(i)});
  }

  // Limpa o estado de interação e progresso.
  pinoSelecionado.value = null;
  movimentos.value = 0;
  jogoGanho.value = false;
  autoResolvendo.value = false;
  discoMovendo.value = null;
  pinoHover.value = null;
  discoArrastando.value = null;
}

/**
 * Reinicia o jogo, chamando a inicialização e resetando a mensagem de vitória.
 */
function reiniciarJogo() {
  inicializarJogo();
  vitoriaManual.value = false;
}

/**
 * Callback para quando o usuário altera a quantidade de discos no componente Controles.
 * @param {number} novoValor - O novo número de discos selecionado.
 */
function aoAlterarQuantidadeDiscos(novoValor) {
  quantidadeDiscos.value = novoValor;
  reiniciarJogo(); // Reinicia o jogo com a nova configuração.
}

/**
 * Gerencia a lógica de clique nos pinos para mover os discos.
 * @param {number} indicePino - O índice do pino que foi clicado.
 */
function aoClicarPinoOuDisco(indicePino) {
  // Ignora cliques se o jogo estiver no modo automático ou já tiver sido ganho.
  if (autoResolvendo.value || jogoGanho.value) return;

  const pino = pinos.value[indicePino];

  // Caso 1: Nenhum pino está selecionado. Seleciona o pino clicado se ele tiver discos.
  if (pinoSelecionado.value === null) {
    if (pino.length > 0) pinoSelecionado.value = indicePino;
  // Caso 2: O jogador clica no pino que já estava selecionado. Desseleciona-o.
  } else if (pinoSelecionado.value === indicePino) {
    pinoSelecionado.value = null;
  // Caso 3: Um pino de origem já está selecionado, e o jogador clica em um pino de destino.
  } else {
    // Verifica se o movimento é válido antes de executá-lo.
    if (podeMover(pinoSelecionado.value, indicePino)) {
      moverAnimadoSimples(pinoSelecionado.value, indicePino);
    }
    // Desseleciona o pino de origem após a tentativa de movimento.
    pinoSelecionado.value = null;
  }
}

/**
 * Valida se um movimento de um pino para outro é permitido pelas regras de Hanói.
 * @param {number} de - Índice do pino de origem.
 * @param {number} para - Índice do pino de destino.
 * @returns {boolean} - True se o movimento for válido, false caso contrário.
 */
function podeMover(de, para) {
  const discoDe = topoDisco(de);
  const discoPara = topoDisco(para);

  if (!discoDe) return false; // Não pode mover de um pino vazio.
  if (!discoPara) return true; // Pode mover para qualquer pino vazio.

  // A regra principal: o disco de origem deve ser menor que o disco do topo do destino.
  return discoDe.tamanho < discoPara.tamanho;
}

/**
 * Retorna o disco que está no topo de um pino especificado.
 * @param {number} indicePino - O índice do pino.
 * @returns {Object | null} - O objeto do disco ou null se o pino estiver vazio.
 */
function topoDisco(indicePino) {
  const pino = pinos.value[indicePino];
  return pino.length > 0 ? pino[pino.length - 1] : null;
}

/**
 * Verifica se o jogo foi concluído (todos os discos no último pino).
 */
function verificarVitoria() {
  // A condição de vitória é ter todos os discos no último pino (índice 2).
  if (pinos.value[2].length === quantidadeDiscos.value) {
    // Se não foi resolvido automaticamente, mostra a mensagem de vitória manual.
    if (!autoResolvendo.value) {
      vitoriaManual.value = true;
    }
    jogoGanho.value = true;
  }
}

/**
 * Inicia o processo de resolução automática usando o algoritmo recursivo de Hanói.
 */
async function autoResolver() {
  if (jogoGanho.value) return;
  autoResolvendo.value = true;
  pinoSelecionado.value = null;
  vitoriaManual.value = false;

  /**
   * A função recursiva que implementa a solução da Torre de Hanói.
   * @param {number} n - O número de discos a mover.
   * @param {number} de - Pino de origem.
   * @param {number} para - Pino de destino.
   * @param {number} aux - Pino auxiliar.
   */
  async function resolver(n, de, para, aux) {
    if (n === 1) {
      // Caso base: mover um único disco é trivial.
      await moverAnimadoSimples(de, para);
    } else {
      // Passo 1: Mover n-1 discos da origem para o auxiliar, usando o destino como auxiliar.
      await resolver(n - 1, de, aux, para);
      // Passo 2: Mover o maior disco restante da origem para o destino.
      await moverAnimadoSimples(de, para);
      // Passo 3: Mover os n-1 discos do auxiliar para o destino, usando a origem como auxiliar.
      await resolver(n - 1, aux, para, de);
    }
  }

  // Inicia a resolução para todos os discos, do pino 0 para o 2, usando o 1 como auxiliar.
  await resolver(quantidadeDiscos.value, 0, 2, 1);
  autoResolvendo.value = false;
}

// --- HANDLERS DE EVENTOS DE ARRASTAR E SOLTAR (DRAG & DROP) ---

/**
 * Chamado quando o jogador começa a arrastar um disco.
 * @param {number} indicePino - O pino de onde o disco está sendo arrastado.
 */
function aoArrastarInicio(indicePino) {
  if (autoResolvendo.value || jogoGanho.value) return;
  const pino = pinos.value[indicePino];
  if (pino.length > 0) {
    // Define o pino de origem para a operação de arrastar.
    pinoSelecionado.value = indicePino;
    discoArrastando.value = indicePino;
  }
}

/** Chamado quando a operação de arrastar termina, independentemente de onde o disco foi solto. */
function aoArrastarFim() {
  discoArrastando.value = null;
}

/**
 * Chamado quando um disco arrastado passa por cima de outro pino.
 * @param {number} indicePino - O pino que está sob o cursor.
 */
function aoArrastarHover(indicePino) {
  // Se o movimento para este pino for válido, marca-o como 'hover' para dar feedback visual.
  if (pinoSelecionado.value !== null && pinoSelecionado.value !== indicePino && podeMover(pinoSelecionado.value, indicePino)) {
    pinoHover.value = indicePino;
  }
}

/**
 * Chamado quando um disco arrastado sai de cima de um pino.
 * @param {number} indicePino - O pino que o cursor deixou.
 */
function aoArrastarSair(indicePino) {
  if (pinoHover.value === indicePino) {
    pinoHover.value = null;
  }
}

/**
 * Chamado quando o jogador solta um disco em um pino.
 * @param {number} indicePino - O pino de destino onde o disco foi solto.
 */
function aoSoltar(indicePino) {
  // Verifica se há um pino de origem selecionado e se o destino é diferente.
  if (pinoSelecionado.value !== null && pinoSelecionado.value !== indicePino) {
    // Se o movimento for válido, executa-o.
    if (podeMover(pinoSelecionado.value, indicePino)) {
      moverAnimadoSimples(pinoSelecionado.value, indicePino);
    }
  }
  // Limpa o estado de interação de arrastar e soltar.
  pinoSelecionado.value = null;
  pinoHover.value = null;
  discoArrastando.value = null;
}

/**
 * Executa o movimento de um disco com animação. Esta é uma função central.
 * Retorna uma Promise que resolve quando a animação e a atualização dos dados terminam.
 * @param {number} de - Pino de origem.
 * @param {number} para - Pino de destino.
 * @returns {Promise<void>}
 */
function moverAnimadoSimples(de, para) {
  return new Promise(async (resolve) => {
    if (!podeMover(de, para)) return resolve();

    // --- LÓGICA DA ANIMAÇÃO "FANTASMA" ---
    // 1. Pega os dados do disco que será movido, mas NÃO o remove do array de dados ainda.
    const disco = pinos.value[de][pinos.value[de].length - 1];
    const cor = corDisco(disco.id);
    const largura = larguraDisco(disco.tamanho);
    
    // 2. Calcula as posições inicial e final da animação.
    const indiceOrigem = pinos.value[de].length - 1;
    const indiceDestino = pinos.value[para].length;
    const bottomOrigem = tabuleiroVisual.baseDiscos + indiceOrigem * tabuleiroVisual.espacoEntreDiscos;
    const bottomDestino = tabuleiroVisual.baseDiscos + indiceDestino * tabuleiroVisual.espacoEntreDiscos;

    // 3. Cria o objeto do disco "fantasma" e o define em `discoMovendo`. O componente Pino
    //    usará este objeto para renderizar um disco animado separado.
    discoMovendo.value = {
      id: disco.id,
      tamanho: disco.tamanho,
      cor,
      largura,
      bottom: bottomOrigem,
      bottomFinal: bottomDestino,
      animandoFinal: false, // Flag para controlar as etapas da animação CSS
      pinoOrigem: de,
      pinoDestino: para
    };

    // 4. Espera um "tick" para o Vue renderizar o disco fantasma em sua posição inicial.
    await new Promise(r => setTimeout(r, animacaoMovimento.tempoRenderizacao));
    
    // 5. Ativa a segunda parte da animação (o movimento para o destino).
    discoMovendo.value.animandoFinal = true;

    // 6. Espera a duração da animação CSS.
    await new Promise(r => setTimeout(r, animacaoMovimento.tempoAnimacao));

    // 7. Agora que a animação visual terminou, atualiza o estado real dos dados.
    pinos.value[para].push(pinos.value[de].pop());
    movimentos.value++;
    verificarVitoria();

    // 8. Limpa o disco fantasma, fazendo-o desaparecer.
    discoMovendo.value = null;
    
    // 9. Espera um pouco antes de resolver a promise para evitar animações sobrepostas.
    await new Promise(r => setTimeout(r, animacaoMovimento.tempoLimpeza));
    resolve();
  });
}

// --- CICLO DE VIDA DO COMPONENTE ---

// onMounted é um "hook" do ciclo de vida do Vue. A função dentro dele é executada
// assim que o componente é inserido no DOM pela primeira vez.
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