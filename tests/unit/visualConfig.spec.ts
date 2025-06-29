import { describe, it, expect } from 'vitest';
import { gerarCores } from '@/visualConfig';

describe('visualConfig', () => {
  describe('gerarCores', () => {
    it('deve retornar o número correto de cores', () => {
      const cores = gerarCores(3);
      expect(cores).toHaveLength(3);
    });

    it('deve retornar cores válidas', () => {
      const cores = gerarCores(5);
      cores.forEach(cor => {
        expect(cor).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it('deve retornar array vazio para quantidade 0', () => {
      const cores = gerarCores(0);
      expect(cores).toHaveLength(0);
    });

    it('deve limitar a quantidade máxima de cores', () => {
      const cores = gerarCores(20);
      expect(cores.length).toBeLessThanOrEqual(16); // CORES_DISCOS tem 16 cores
    });
  });
}); 