# Regras do Projeto Torre de Hanói

## 1. Centralização de Constantes Visuais
- Todas as cores, tamanhos, bordas, sombras, espaçamentos e transições devem ser centralizadas em variáveis CSS globais no arquivo `style.css`.
- Não é permitido usar valores visuais hardcoded (`#hex`, `rgba`, `px`, etc) diretamente nos componentes.
- O arquivo `visualConfig.ts` deve ser usado para gerar ou documentar as constantes visuais e lógicas de layout.

## 2. Tipagem TypeScript
- Sempre prefira tipos TypeScript específicos em vez de `Object` ou `object`.
- Defina interfaces claras para objetos usados em props e estados.
- Props que podem ser `null` devem ser tipadas como `tipo | null`.

## 3. Props Booleanas
- Props booleanas devem ser tipadas como `boolean` e, se necessário, ter valor padrão (`default: false`).
- Não é necessário passar props booleanas como `:prop="undefined"`.
- Se a prop não for passada, será `undefined` (falsy), mas o ideal é garantir o default.

## 4. Limpeza e Clareza de Código
- Remova props desnecessárias ou redundantes.
- Mantenha o código enxuto e fácil de entender.
- Use nomes de variáveis e props descritivos.

## 5. Lógica de Empilhamento e Renderização dos Discos
- O array de discos de cada pino deve estar ordenado do maior (índice 0, base) para o menor (último índice, topo).
- O cálculo da posição vertical (`bottom`) dos discos deve considerar a ordem do array, garantindo que o disco de índice 0 fique na base e os demais empilhem acima.
- O cálculo da largura dos discos deve garantir que o maior disco tenha a maior largura e o menor, a menor largura. Exemplo: `largura = base + (tamanho - 1) * fator`.
- Não deve haver sobreposição visual no eixo Z (z-index) entre discos empilhados; a sobreposição deve ser apenas no eixo Y (vertical).

## 6. Testes Automatizados
- Testes devem garantir:
  - Ordem correta dos discos no DOM (maior embaixo, menor em cima).
  - Cálculo correto das posições e larguras dos discos.
  - Estados visuais (selecionado, hover, arrastando, arrastável) aplicados corretamente.
  - O array de discos gerado pela lógica deve estar na ordem correta e com larguras decrescentes.
- Use sempre o comando `npx vitest run` para rodar os testes de forma não interativa.

## 7. Animação de Discos
- A animação de movimento de disco deve ser simples: do ponto inicial ao final, usando o mesmo cálculo de empilhamento dos discos.
- Não use fases intermediárias ou cálculos de coordenadas absolutas desnecessários.

## 8. Boas Práticas Gerais
- Prefira componentes simples e funções puras.
- Documente as interfaces e props principais.
- Mantenha o projeto fácil de manter e expandir.
