import {beforeEach, describe, expect, it, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import Tabuleiro from '@/components/Tabuleiro.vue';
import Pino from '@/components/Pino.vue';
import type {Disco} from '@/types';
import {podeMover} from '@/logica';

// Mock das funções de lógica
vi.mock('../../../src/logica', () => ({
    podeMover: vi.fn(),
    topoDisco: vi.fn(() => null),
    gerarDiscos: vi.fn(() => []),
    gerarPinosIniciais: vi.fn(() => []),
}));

describe('Tabuleiro.vue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const pinosMock: Disco[][] = [
        [{id: 10, tamanho: 1, cor: '#fff', largura: 60}],
        [],
        [],
    ];

    // Helper function para criar wrapper com props padrão
    const createWrapper = (overrides = {}) => {
        const defaultProps = {
            pinos: pinosMock,
            pinoSelecionado: null,
            pinoHover: null,
            discoArrastando: null,
            discoMovendo: null,
            autoResolvendo: false,
            jogoGanho: false,
        };
        
        return mount(Tabuleiro, {
            props: { ...defaultProps, ...overrides }
        });
    };

    // Helper function para obter pino alvo
    const getPinoAlvo = (wrapper: any, index: number) => {
        const pino = wrapper.findAllComponents(Pino).at(index);
        if (!pino) throw new Error(`Componente Pino alvo não encontrado no índice ${index}`);
        return pino;
    };

    it('renderiza o número correto de pinos baseado na prop', () => {
        const wrapper = createWrapper();
        const pinoComponents = wrapper.findAllComponents(Pino);
        expect(pinoComponents.length).toBe(3);
    });

    it('emite "pino-soltar" quando um pino filho emite "soltar" e o movimento é válido', async () => {
        vi.mocked(podeMover).mockReturnValue(true);
        const wrapper = createWrapper({
            pinoSelecionado: 1,
            discoArrastando: 1
        });
        
        const pinoAlvo = getPinoAlvo(wrapper, 2);
        await pinoAlvo.vm.$emit('soltar');
        
        expect(podeMover).toHaveBeenCalledWith(pinosMock, 1, 2);
        expect(wrapper.emitted('pino-soltar')).toHaveLength(1);
        expect(wrapper.emitted('pino-soltar')?.[0]).toEqual([2]);
    });

    it('emite "pino-soltar" mesmo quando o movimento for inválido', async () => {
        vi.mocked(podeMover).mockReturnValue(false);
        const wrapper = createWrapper({
            pinoSelecionado: 1,
            discoArrastando: 1
        });
        
        const pinoAlvo = getPinoAlvo(wrapper, 2);
        await pinoAlvo.vm.$emit('soltar');
        
        expect(podeMover).toHaveBeenCalledWith(pinosMock, 1, 2);
        expect(wrapper.emitted('pino-soltar')).toHaveLength(1);
        expect(wrapper.emitted('pino-soltar')?.[0]).toEqual([2]);
    });

    it('emite "mover-disco" apenas quando o movimento é válido', async () => {
        const wrapper = createWrapper({
            pinoSelecionado: 1,
            discoArrastando: 1
        });
        const pinoAlvo = getPinoAlvo(wrapper, 2);
        
        // Movimento válido
        vi.mocked(podeMover).mockReturnValue(true);
        await pinoAlvo.vm.$emit('soltar');
        expect(wrapper.emitted('mover-disco')).toHaveLength(1);

        // Movimento inválido
        vi.mocked(podeMover).mockReturnValue(false);
        await pinoAlvo.vm.$emit('soltar');
        expect(wrapper.emitted('mover-disco')).toHaveLength(1); // Não deve emitir novamente
    });
});
