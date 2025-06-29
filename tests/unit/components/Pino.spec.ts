import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pino from '@/components/Pino.vue'
import Disco from '@/components/Disco.vue'
import { gerarDiscos } from '@/logica'
import type { Pino as PinoType } from '@/types'

describe('Pino.vue', () => {
  const criarPino = (tamanhos: number[]): PinoType => {
    const todos = gerarDiscos(Math.max(...tamanhos))
    return tamanhos.map(t => todos.find(d => d.tamanho === t)!)
  }

  it('renderiza discos na ordem correta (maiores embaixo, menores em cima)', () => {
    // Cria um pino com discos de tamanhos diferentes
    const pino = criarPino([3, 1, 2]) // Disco 3 (maior) embaixo, disco 1 (menor) em cima
    
    const wrapper = mount(Pino, {
      props: {
        pino,
        indicePino: 0,
        podeSoltar: false,
        selecionado: false,
        hover: false,
        arrastando: false,
        arrastavel: true,
        discoMovendo: null
      }
    })

    // Encontra todos os componentes Disco renderizados
    const discos = wrapper.findAllComponents(Disco)
    
    expect(discos).toHaveLength(3)
    
    // Verifica se os discos estão na ordem correta no DOM
    // O primeiro disco no array deve ser o disco 3 (maior, embaixo)
    expect(discos[0].props('tamanho')).toBe(3)
    expect(discos[0].props('largura')).toBe(90) // 40 + (3-1)*25
    
    // O segundo disco no array deve ser o disco 1 (menor, meio)
    expect(discos[1].props('tamanho')).toBe(1)
    expect(discos[1].props('largura')).toBe(40) // 40 + (1-1)*25
    
    // O terceiro disco no array deve ser o disco 2 (médio, topo)
    expect(discos[2].props('tamanho')).toBe(2)
    expect(discos[2].props('largura')).toBe(65) // 40 + (2-1)*25
  })

  it('calcula posições base corretas para empilhamento', () => {
    const pino = criarPino([3, 1, 2])
    
    const wrapper = mount(Pino, {
      props: {
        pino,
        indicePino: 0,
        podeSoltar: false,
        selecionado: false,
        hover: false,
        arrastando: false,
        arrastavel: true,
        discoMovendo: null
      }
    })

    const discos = wrapper.findAllComponents(Disco)
    
    // O disco 3 (índice 0) deve estar na base (posição mais baixa)
    expect(discos[0].props('posy')).toBe(70) // 70
    // O disco 1 (índice 1) deve estar acima
    expect(discos[1].props('posy')).toBe(70 + 25) // 95
    // O disco 2 (índice 2) deve estar no topo
    expect(discos[2].props('posy')).toBe(70 + 2 * 25) // 120
  })

  it('identifica corretamente o disco do topo', () => {
    const pino = criarPino([3, 1, 2])
    
    const wrapper = mount(Pino, {
      props: {
        pino,
        indicePino: 0,
        podeSoltar: false,
        selecionado: false,
        hover: false,
        arrastando: false,
        arrastavel: true,
        discoMovendo: null
      }
    })

    const discos = wrapper.findAllComponents(Disco)
    
    // Apenas o último disco (índice 2) deve ser marcado como topo
    expect(discos[0].props('topo')).toBe(false)
    expect(discos[1].props('topo')).toBe(false)
    expect(discos[2].props('topo')).toBe(true)
  })

  it('aplica corretamente os estados de seleção', () => {
    const pino = criarPino([3, 1, 2])
    
    const wrapper = mount(Pino, {
      props: {
        pino,
        indicePino: 0,
        podeSoltar: false,
        selecionado: true, // Pino selecionado
        hover: false,
        arrastando: false,
        arrastavel: true,
        discoMovendo: null
      }
    })

    const discos = wrapper.findAllComponents(Disco)
    
    // Apenas o disco do topo deve estar selecionado
    expect(discos[0].props('selecionado')).toBe(false)
    expect(discos[1].props('selecionado')).toBe(false)
    expect(discos[2].props('selecionado')).toBe(true)
  })

  it('aplica corretamente os estados de hover', () => {
    const pino = criarPino([3, 1, 2])
    
    const wrapper = mount(Pino, {
      props: {
        pino,
        indicePino: 0,
        podeSoltar: false,
        selecionado: false,
        hover: true, // Pino com hover
        arrastando: false,
        arrastavel: true,
        discoMovendo: null
      }
    })

    const discos = wrapper.findAllComponents(Disco)
    
    // Apenas o disco do topo deve ter hover
    expect(discos[0].props('hover')).toBe(false)
    expect(discos[1].props('hover')).toBe(false)
    expect(discos[2].props('hover')).toBe(true)
  })

  it('aplica corretamente os estados de arrastando', () => {
    const pino = criarPino([3, 1, 2])
    
    const wrapper = mount(Pino, {
      props: {
        pino,
        indicePino: 0,
        podeSoltar: false,
        selecionado: false,
        hover: false,
        arrastando: true, // Disco sendo arrastado
        arrastavel: true,
        discoMovendo: null
      }
    })

    const discos = wrapper.findAllComponents(Disco)
    
    // Apenas o disco do topo deve estar sendo arrastado
    expect(discos[0].props('arrastando')).toBe(false)
    expect(discos[1].props('arrastando')).toBe(false)
    expect(discos[2].props('arrastando')).toBe(true)
  })

  it('aplica corretamente os estados de arrastável', () => {
    const pino = criarPino([3, 1, 2])
    
    const wrapper = mount(Pino, {
      props: {
        pino,
        indicePino: 0,
        podeSoltar: false,
        selecionado: false,
        hover: false,
        arrastando: false,
        arrastavel: true, // Arrastável habilitado
        discoMovendo: null
      }
    })

    const discos = wrapper.findAllComponents(Disco)
    
    // Apenas o disco do topo deve ser arrastável
    expect(discos[0].props('arrastavel')).toBe(false)
    expect(discos[1].props('arrastavel')).toBe(false)
    expect(discos[2].props('arrastavel')).toBe(true)
  })

  it('lida corretamente com pino vazio', () => {
    const wrapper = mount(Pino, {
      props: {
        pino: [],
        indicePino: 0,
        podeSoltar: false,
        selecionado: false,
        hover: false,
        arrastando: false,
        arrastavel: true,
        discoMovendo: null
      }
    })

    const discos = wrapper.findAllComponents(Disco)
    expect(discos).toHaveLength(0)
  })

  it('verifica se as larguras dos discos estão corretas', () => {
    const pino = criarPino([3, 1, 2])
    
    const wrapper = mount(Pino, {
      props: {
        pino,
        indicePino: 0,
        podeSoltar: false,
        selecionado: false,
        hover: false,
        arrastando: false,
        arrastavel: true,
        discoMovendo: null
      }
    })

    const discos = wrapper.findAllComponents(Disco)
    
    // Verifica se as larguras estão corretas
    // Disco 3 (maior) deve ter a maior largura
    expect(discos[0].props('largura')).toBe(90) // 40 + (3-1)*25
    
    // Disco 1 (menor) deve ter a menor largura
    expect(discos[1].props('largura')).toBe(40) // 40 + (1-1)*25
    
    // Disco 2 (médio) deve ter largura intermediária
    expect(discos[2].props('largura')).toBe(65) // 40 + (2-1)*25
    
    // Verifica se a largura está em ordem decrescente (maior embaixo, menor em cima)
    expect(discos[0].props('largura')).toBeGreaterThan(discos[1].props('largura'))
    expect(discos[2].props('largura')).toBeGreaterThan(discos[1].props('largura'))
    expect(discos[0].props('largura')).toBeGreaterThan(discos[2].props('largura'))
  })

  it('verifica se o array pino está na ordem correta', () => {
    // Testa com a função real gerarDiscos
    const discos = gerarDiscos(4) // Gera 4 discos
    
    // Verifica se o array está na ordem correta: [disco4, disco3, disco2, disco1]
    expect(discos).toHaveLength(4)
    expect(discos[0].tamanho).toBe(4) // Maior disco primeiro
    expect(discos[1].tamanho).toBe(3)
    expect(discos[2].tamanho).toBe(2)
    expect(discos[3].tamanho).toBe(1) // Menor disco por último
    
    // Verifica se as larguras estão em ordem decrescente
    expect(discos[0].largura).toBeGreaterThan(discos[1].largura)
    expect(discos[1].largura).toBeGreaterThan(discos[2].largura)
    expect(discos[2].largura).toBeGreaterThan(discos[3].largura)
  })

  it('verifica se os discos estão na ordem correta no DOM', () => {
    const pino = criarPino([4, 3, 2, 1]) // Maior para menor
    
    const wrapper = mount(Pino, {
      props: {
        pino,
        indicePino: 0,
        podeSoltar: false,
        selecionado: false,
        hover: false,
        arrastando: false,
        arrastavel: true,
        discoMovendo: null
      }
    })

    const discos = wrapper.findAllComponents(Disco)
    
    // Verifica se a ordem no DOM está correta
    expect(discos[0].props('tamanho')).toBe(4)
    expect(discos[1].props('tamanho')).toBe(3)
    expect(discos[2].props('tamanho')).toBe(2)
    expect(discos[3].props('tamanho')).toBe(1)
    
    // Verifica se as posições estão corretas (maior embaixo, menor em cima)
    const posy0 = discos[0].props('posy') as number
    const posy1 = discos[1].props('posy') as number
    const posy2 = discos[2].props('posy') as number
    const posy3 = discos[3].props('posy') as number
    
    expect(posy0).toBeLessThan(posy1)
    expect(posy1).toBeLessThan(posy2)
    expect(posy2).toBeLessThan(posy3)
  })
}) 