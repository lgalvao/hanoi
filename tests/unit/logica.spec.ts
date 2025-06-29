import { describe, it, expect } from 'vitest';
import { podeMover, gerarDiscos, gerarPinosIniciais, gerarMovimentosHanoi } from '@/logica';
import type { Pino } from '@/types.ts';

// Testes unitários para a lógica da Torre de Hanói

describe('Funções de lógica do jogo', () => {
  describe('podeMover', () => {
    it('permite mover para pino vazio', () => {
      // Arrange
      const pinos: Pino[] = [
        [{ id: 1, tamanho: 1, largura: 100, cor: '#fff' }],
        [],
        [],
      ];
      // Act & Assert
      expect(podeMover(pinos, 0, 1)).toBe(true);
    });

    it('permite mover disco menor sobre maior', () => {
      // Arrange
      const pinos: Pino[] = [
        [{ id: 1, tamanho: 1, largura: 100, cor: '#fff' }],
        [{ id: 2, tamanho: 2, largura: 120, cor: '#fff' }],
        [],
      ];
      // Act & Assert
      expect(podeMover(pinos, 0, 1)).toBe(true);
    });

    it('não permite mover disco maior sobre menor', () => {
      // Arrange
      const pinos: Pino[] = [
        [{ id: 2, tamanho: 2, largura: 120, cor: '#fff' }],
        [{ id: 1, tamanho: 1, largura: 100, cor: '#fff' }],
        [],
      ];
      // Act & Assert
      expect(podeMover(pinos, 0, 1)).toBe(false);
    });

    it('não permite mover de pino vazio', () => {
      // Arrange
      const pinos: Pino[] = [
        [],
        [{ id: 1, tamanho: 1, largura: 100, cor: '#fff' }],
        [],
      ];
      // Act & Assert
      expect(podeMover(pinos, 0, 1)).toBe(false);
    });

    it('não permite mover para o mesmo pino', () => {
      // Arrange
      const pinos: Pino[] = [
        [{ id: 1, tamanho: 1, largura: 100, cor: '#fff' }],
        [],
        [],
      ];
      // Act & Assert
      expect(podeMover(pinos, 0, 0)).toBe(false);
    });

    it('deve retornar false quando tentar mover para o mesmo pino', () => {
      const pinos = [
        [{ id: 1, tamanho: 1, cor: '#fff', largura: 60 }],
        [],
        []
      ];
      expect(podeMover(pinos, 0, 0)).toBe(false);
    });

    it('deve retornar false quando tentar mover de um pino vazio', () => {
      const pinos = [
        [],
        [{ id: 1, tamanho: 1, cor: '#fff', largura: 60 }],
        []
      ];
      expect(podeMover(pinos, 0, 1)).toBe(false);
    });

    it('deve retornar true quando mover para um pino vazio', () => {
      const pinos = [
        [{ id: 1, tamanho: 1, cor: '#fff', largura: 60 }],
        [],
        []
      ];
      expect(podeMover(pinos, 0, 1)).toBe(true);
    });

    it('deve retornar true quando mover disco menor sobre maior', () => {
      const pinos = [
        [{ id: 1, tamanho: 1, cor: '#fff', largura: 60 }],
        [{ id: 2, tamanho: 2, cor: '#fff', largura: 80 }],
        []
      ];
      expect(podeMover(pinos, 0, 1)).toBe(true);
    });

    it('deve retornar false quando tentar mover disco maior sobre menor', () => {
      const pinos = [
        [{ id: 2, tamanho: 2, cor: '#fff', largura: 80 }],
        [{ id: 1, tamanho: 1, cor: '#fff', largura: 60 }],
        []
      ];
      expect(podeMover(pinos, 0, 1)).toBe(false);
    });
  });

  describe('gerarDiscos', () => {
    it('deve gerar o número correto de discos', () => {
      const discos = gerarDiscos(3);
      expect(discos).toHaveLength(3);
    });

    it('deve gerar discos com tamanhos decrescentes', () => {
      const discos = gerarDiscos(4);
      expect(discos[0].tamanho).toBe(4);
      expect(discos[1].tamanho).toBe(3);
      expect(discos[2].tamanho).toBe(2);
      expect(discos[3].tamanho).toBe(1);
    });

    it('deve gerar discos com cores diferentes', () => {
      const discos = gerarDiscos(3);
      const cores = discos.map(d => d.cor);
      expect(new Set(cores).size).toBe(3); // Todas as cores são diferentes
    });

    it('deve gerar discos com larguras proporcionais', () => {
      const discos = gerarDiscos(3);
      expect(discos[0].largura).toBeGreaterThan(discos[1].largura);
      expect(discos[1].largura).toBeGreaterThan(discos[2].largura);
    });
  });

  describe('gerarPinosIniciais', () => {
    it('deve gerar 3 pinos', () => {
      const pinos = gerarPinosIniciais(3);
      expect(pinos).toHaveLength(3);
    });

    it('deve colocar todos os discos no primeiro pino', () => {
      const pinos = gerarPinosIniciais(4);
      expect(pinos[0]).toHaveLength(4);
      expect(pinos[1]).toHaveLength(0);
      expect(pinos[2]).toHaveLength(0);
    });

    it('deve gerar discos com IDs corretos', () => {
      const pinos = gerarPinosIniciais(3);
      const discos = pinos[0];
      expect(discos[0].id).toBe(3);
      expect(discos[1].id).toBe(2);
      expect(discos[2].id).toBe(1);
    });
  });

  describe('gerarMovimentosHanoi', () => {
    function nuncaHaDiscoMaiorSobreMenor(pinos: ReturnType<typeof gerarPinosIniciais>) {
      for (const pino of pinos) {
        for (let i = 0; i < pino.length - 1; i++) {
          if (pino[i].tamanho < pino[i + 1].tamanho) {
            return false;
          }
        }
      }
      return true;
    }

    it('nunca coloca disco maior sobre menor durante a auto-resolução (3 discos)', () => {
      const movimentos = gerarMovimentosHanoi(3, 0, 2, 1);
      let pinos = [
        gerarDiscos(3),
        [],
        []
      ];
      for (const [de, para] of movimentos) {
        const disco = pinos[de].pop();
        expect(disco).toBeDefined();
        if (disco) pinos[para].push(disco);
        expect(nuncaHaDiscoMaiorSobreMenor(pinos)).toBe(true);
      }
    });

    it('nunca coloca disco maior sobre menor durante a auto-resolução (4 discos)', () => {
      const movimentos = gerarMovimentosHanoi(4, 0, 2, 1);
      let pinos = [
        gerarDiscos(4),
        [],
        []
      ];
      for (const [de, para] of movimentos) {
        const disco = pinos[de].pop();
        expect(disco).toBeDefined();
        if (disco) pinos[para].push(disco);
        expect(nuncaHaDiscoMaiorSobreMenor(pinos)).toBe(true);
      }
    });
  });
});
