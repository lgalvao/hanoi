import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Disco from '@/components/Disco.vue';

describe('Disco.vue', () => {
  const defaultProps = {
    tamanho: 3,
    largura: 80,
    cor: '#ff0000'
  };

  it('renderiza o disco com o tamanho correto', () => {
    const wrapper = mount(Disco, {
      props: defaultProps
    });
    
    expect(wrapper.text()).toBe('3');
  });

  it('aplica a classe selecionado quando prop é true', () => {
    const wrapper = mount(Disco, {
      props: {
        ...defaultProps,
        selecionado: true
      }
    });
    
    expect(wrapper.classes()).toContain('selecionado');
  });

  it('aplica a classe hover quando prop é true', () => {
    const wrapper = mount(Disco, {
      props: {
        ...defaultProps,
        hover: true
      }
    });
    
    expect(wrapper.classes()).toContain('hover');
  });

  it('aplica a classe arrastando quando prop é true', () => {
    const wrapper = mount(Disco, {
      props: {
        ...defaultProps,
        arrastando: true
      }
    });
    
    expect(wrapper.classes()).toContain('arrastando');
  });

  it('aplica a classe oculto quando prop é true', () => {
    const wrapper = mount(Disco, {
      props: {
        ...defaultProps,
        oculto: true
      }
    });
    
    expect(wrapper.classes()).toContain('oculto');
  });

  it('aplica a classe disco-animado quando prop é true', () => {
    const wrapper = mount(Disco, {
      props: {
        ...defaultProps,
        animado: true
      }
    });
    
    expect(wrapper.classes()).toContain('disco-animado');
  });

  it('emite evento clique quando clicado', async () => {
    const wrapper = mount(Disco, {
      props: defaultProps
    });
    
    await wrapper.trigger('click');
    
    expect(wrapper.emitted()).toHaveProperty('clique');
  });

  it('emite evento arrastar quando dragstart é disparado', async () => {
    const wrapper = mount(Disco, {
      props: defaultProps
    });
    
    await wrapper.trigger('dragstart');
    
    expect(wrapper.emitted()).toHaveProperty('arrastar');
  });

  it('emite evento arrastar-fim quando dragend é disparado', async () => {
    const wrapper = mount(Disco, {
      props: defaultProps
    });
    
    await wrapper.trigger('dragend');
    
    expect(wrapper.emitted()).toHaveProperty('arrastar-fim');
  });

  it('tem draggable true quando arrastavel é true e animado é false', () => {
    const wrapper = mount(Disco, {
      props: {
        ...defaultProps,
        arrastavel: true,
        animado: false
      }
    });
    
    expect(wrapper.attributes('draggable')).toBe('true');
  });

  it('tem draggable false quando arrastavel é false', () => {
    const wrapper = mount(Disco, {
      props: {
        ...defaultProps,
        arrastavel: false
      }
    });
    
    expect(wrapper.attributes('draggable')).toBe('false');
  });

  it('tem draggable false quando animado é true', () => {
    const wrapper = mount(Disco, {
      props: {
        ...defaultProps,
        arrastavel: true,
        animado: true
      }
    });
    
    expect(wrapper.attributes('draggable')).toBe('false');
  });

  it('tem aria-label correto', () => {
    const wrapper = mount(Disco, {
      props: defaultProps
    });
    
    expect(wrapper.attributes('aria-label')).toBe('Disco de tamanho 3');
  });

  it('aplica estilos corretos para posição', () => {
    const wrapper = mount(Disco, {
      props: {
        ...defaultProps,
        posx: '25%',
        posy: 50
      }
    });
    
    const style = wrapper.attributes('style');
    expect(style).toContain('left: 50%');
    expect(style).toContain('bottom: 50px');
  });
}); 