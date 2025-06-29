import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Controles from '@/components/Controles.vue';

describe('Controles.vue', () => {
  it('emite o evento "reiniciar" ao clicar no botão Reiniciar', async () => {
    // Monta o componente com as props necessárias
    const wrapper = mount(Controles, {
      props: {
        quantidadeDiscos: 4,
        movimentos: 0,
        autoResolvendo: false,
        jogoGanho: false,
      },
    });

    // Encontra o botão "Reiniciar"
    const botaoReiniciar = wrapper.find('button[aria-label="Reiniciar o jogo"]');

    // Simula um clique no botão
    await botaoReiniciar.trigger('click');

    // Verifica se o evento 'reiniciar' foi emitido
    expect(wrapper.emitted()).toHaveProperty('reiniciar');
    expect(wrapper.emitted().reiniciar).toHaveLength(1);
  });

  it('emite o evento "auto-resolver" ao clicar no botão Auto Resolver', async () => {
    const wrapper = mount(Controles, {
      props: {
        quantidadeDiscos: 4,
        movimentos: 0,
        autoResolvendo: false,
        jogoGanho: false,
      },
    });

    const botaoAutoResolver = wrapper.find('button[aria-label="Auto resolver"]');
    await botaoAutoResolver.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('auto-resolver');
  });

  it('desabilita o botão "Auto Resolver" quando autoResolvendo é true', async () => {
    const wrapper = mount(Controles, {
      props: {
        quantidadeDiscos: 4,
        movimentos: 0,
        autoResolvendo: true, // Propriedade chave para este teste
        jogoGanho: false,
      },
    });

    const botaoAutoResolver = wrapper.find('button[aria-label="Auto resolver"]');
    
    // Verifica se o atributo 'disabled' está presente no elemento
    expect(botaoAutoResolver.attributes('disabled')).toBeDefined();
  });
  
  it('emite o evento "alterar-quantidade-discos" com o valor correto quando o select é alterado', async () => {
    const wrapper = mount(Controles, {
      props: {
        quantidadeDiscos: 4,
        movimentos: 0,
        autoResolvendo: false,
        jogoGanho: false,
      },
    });

    const seletor = wrapper.find('select');
    
    // Simula a seleção de um novo valor
    await seletor.setValue('6');

    // Verifica se o evento foi emitido
    expect(wrapper.emitted()).toHaveProperty('alterar-quantidade-discos');
    
    // Verifica se o evento foi emitido com o payload correto (agora esperando um número)
    expect(wrapper.emitted()['alterar-quantidade-discos'][0]).toEqual([6]);
  });

  it('desabilita o botão "Auto Resolver" quando jogoGanho é true', async () => {
    const wrapper = mount(Controles, {
      props: {
        quantidadeDiscos: 4,
        movimentos: 0,
        autoResolvendo: false,
        jogoGanho: true, // Propriedade chave para este teste
      },
    });

    const botaoAutoResolver = wrapper.find('button[aria-label="Auto resolver"]');
    expect(botaoAutoResolver.attributes('disabled')).toBeDefined();
  });
});
