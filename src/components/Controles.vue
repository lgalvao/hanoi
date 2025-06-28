<template>
  <div class="secao-controles">
    <div class="linha-controles">
      <label for="select-discos">Discos:
        <!-- Seletor de quantidade de discos -->
        <select id="select-discos" v-model="quantidadeDiscosLocal"
                @change="$emit('alterar-quantidade-discos', quantidadeDiscosLocal)"
                tabindex="0"
                aria-label="Selecionar quantidade de discos">
          <option v-for="n in [3,4,5,6,7,8]" :key="n" :value="n">{{ n }}</option>
        </select>
      </label>

      <!-- Botão para reiniciar o jogo -->
      <button @click="$emit('reiniciar')" aria-label="Reiniciar o jogo" tabindex="0">
        Reiniciar
      </button>

      <!-- Botão para auto-resolver -->
      <button @click="$emit('auto-resolver')" :disabled="autoResolvendo || jogoGanho" 
              aria-label="Auto resolver" 
              tabindex="0">
        Auto Resolver
      </button>
    </div>

    <div class="linha-estatisticas">
      <span>Movimentos: <b>{{ movimentos }}</b></span>
      <span>Mínimo necessário: <b>{{ movimentosOtimos }}</b></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// --- PROPS DO COMPONENTE ---
// Define as propriedades que o componente Controles recebe do App.vue.
const props = defineProps<{
  quantidadeDiscos: number, // O número atual de discos no jogo.
  movimentos: number, // O contador de movimentos do jogador.
  autoResolvendo: boolean, // Flag que indica se a resolução automática está em andamento.
  jogoGanho: boolean // Flag que indica se o jogo foi concluído.
}>();

// --- EVENTOS EMITIDOS ---
// Declara os eventos que este componente pode emitir para o App.vue.
// Isso permite que o componente pai reaja às ações do usuário (cliques em botões, etc.).
const emit = defineEmits(['reiniciar', 'auto-resolver', 'alterar-quantidade-discos']);

// --- PROPRIEDADES COMPUTADAS ---

/**
 * Calcula o número mínimo de movimentos necessários para resolver o quebra-cabeça.
 * A fórmula é 2^n - 1, onde n é o número de discos.
 * Esta é uma propriedade computada, então o Vue a recalculará automaticamente
 * sempre que a prop 'quantidadeDiscos' mudar.
 */
const movimentosOtimos = computed(() => Math.pow(2, props.quantidadeDiscos) - 1);

/**
 * 'quantidadeDiscosLocal' é uma propriedade computada com getter e setter.
 * Este é um padrão comum no Vue para criar um v-model bidirecional em um componente filho
 * que se baseia em uma prop (que é unidirecional por natureza).
 *
 * - get: Quando o <select> precisa ler o valor, ele lê diretamente da prop 'quantidadeDiscos'.
 * - set: Quando o usuário seleciona um novo valor no <select>, o 'set' é chamado.
 *        Ele não modifica a prop diretamente (o que causaria um aviso no Vue), mas emite um evento
 *        'alterar-quantidade-discos' para o componente pai. O pai, então, atualiza o estado, e a nova
 *        prop é passada de volta para este componente, completando o ciclo.
 */
const quantidadeDiscosLocal = computed({
  get: () => props.quantidadeDiscos,
  set: (valor) => emit('alterar-quantidade-discos', valor)
});
</script>

<style scoped>
.secao-controles {
  margin-bottom: 18px;
}
.linha-controles {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
label {
  font-weight: 600;
  color: #444;
  font-size: 1.1rem;
}
select, button {
  padding: 8px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s;
  background: #fff;
  margin-left: 6px;
}
button {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}
button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.linha-estatisticas {
  display: flex;
  justify-content: center;
  gap: 32px;
  font-size: 1.1rem;
  color: #555;
}
.linha-estatisticas b {
  color: #222;
  font-weight: 700;
}
</style> 