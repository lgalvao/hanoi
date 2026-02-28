import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '@/App.vue';
import { inicializarJogo } from '@/logica';

// Mock das funções de lógica
vi.mock('@/logica', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/logica')>();
  return {
    ...actual,
    inicializarJogo: vi.fn(() => ({
      pinos: [[{ id: 1, tamanho: 1, cor: '#fff', largura: 60 }], [], []],
      movimentos: 0,
      vitoria: false,
    })),
    podeMover: vi.fn(() => true),
    topoDisco: vi.fn(() => ({ id: 1, tamanho: 1, cor: '#fff', largura: 60 }))
  };
});

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza o título do jogo', () => {
    const wrapper = mount(App);
    expect(wrapper.find('h1').text()).toBe('Torre de Hanói');
  });

  it('renderiza os componentes Controles e Tabuleiro', () => {
    const wrapper = mount(App);
    expect(wrapper.findComponent({ name: 'Controles' })).toBeTruthy();
    expect(wrapper.findComponent({ name: 'Tabuleiro' })).toBeTruthy();
  });

  it('passa props corretas para o componente Controles', () => {
    const wrapper = mount(App);
    const controles = wrapper.findComponent({ name: 'Controles' });
    
    expect(controles.props('quantidadeDiscos')).toBe(4);
    expect(controles.props('movimentos')).toBe(0);
    expect(controles.props('autoResolvendo')).toBe(false);
    expect(controles.props('jogoGanho')).toBe(false);
  });

  it('passa props corretas para o componente Tabuleiro', () => {
    const wrapper = mount(App);
    const tabuleiro = wrapper.findComponent({ name: 'Tabuleiro' });
    
    expect(tabuleiro.props('pinos')).toBeDefined();
    expect(tabuleiro.props('pinoSelecionado')).toBe(null);
    expect(tabuleiro.props('autoResolvendo')).toBe(false);
    expect(tabuleiro.props('jogoGanho')).toBe(false);
  });

  it('reinicia o jogo quando evento reiniciar é emitido', async () => {
    const wrapper = mount(App);
    const controles = wrapper.findComponent({ name: 'Controles' });
    
    await controles.vm.$emit('reiniciar');
    
    expect(inicializarJogo).toHaveBeenCalledWith(4);
  });

  it('altera quantidade de discos quando evento é emitido', async () => {
    const wrapper = mount(App);
    const controles = wrapper.findComponent({ name: 'Controles' });
    
    await controles.vm.$emit('alterar-quantidade-discos', 6);
    
    expect(inicializarJogo).toHaveBeenCalledWith(6);
  });

  it('inicia auto-resolução quando evento é emitido', async () => {
    const wrapper = mount(App);
    const controles = wrapper.findComponent({ name: 'Controles' });
    
    await controles.vm.$emit('auto-resolver');
    
    // Verifica se autoResolvendo foi ativado
    expect(wrapper.findComponent({ name: 'Tabuleiro' }).props('autoResolvendo')).toBe(true);
  });

  it('processa início de arraste quando evento é emitido', async () => {
    const wrapper = mount(App);
    const tabuleiro = wrapper.findComponent({ name: 'Tabuleiro' });
    
    await tabuleiro.vm.$emit('disco-arrastar', 0);
    
    // Verifica se o disco está sendo arrastado
    expect(tabuleiro.props('discoArrastando')).toBe(0);
  });

  it('processa fim de arraste quando evento é emitido', async () => {
    const wrapper = mount(App);
    const tabuleiro = wrapper.findComponent({ name: 'Tabuleiro' });
    
    // Primeiro inicia o arraste
    await tabuleiro.vm.$emit('disco-arrastar', 0);
    expect(tabuleiro.props('discoArrastando')).toBe(0);
    
    // Depois finaliza o arraste
    await tabuleiro.vm.$emit('disco-arrastar-fim');
    expect(tabuleiro.props('discoArrastando')).toBe(null);
  });
}); 