# Regras do Projeto Torre de Hanói

## 1. Centralização de Constantes Visuais
- Todas as cores, tamanhos, bordas, sombras, espaçamentos e transições devem ser centralizadas em variáveis CSS globais no arquivo `style.css`.
- Não é permitido usar valores visuais hardcoded (`#hex`, `rgba`, `px`, etc) diretamente nos componentes.
- O arquivo `visualConfig.js` pode ser usado para gerar ou documentar as constantes visuais.

## 2. Tipagem TypeScript
- Sempre prefira tipos TypeScript específicos em vez de `Object` ou `object`.
- Defina interfaces claras para objetos usados em props e estados.
- Props que podem ser `null` devem ser tipadas como `tipo | null`.

## 3. Props Booleanas
- Props booleanas devem ser tipadas como `boolean` e, se necessário, ter valor padrão (`default: false`).
- Não é necessário passar props booleanas como `:prop="undefined"`.
- Se a prop não for passada, será `undefined` (falsy), mas o ideal é garantir o default.

## 4. Limpeza e Clareza de Código
- Remova props desnecessárias ou redundantes, como `:prop="undefined"`.
- Mantenha o código enxuto e fácil de entender.
- Use nomes de variáveis e props descritivos.

## 5. Animação de Discos
- A animação de movimento de disco deve ser simples: do ponto inicial ao final, usando o mesmo cálculo de empilhamento dos discos.
- Não use fases intermediárias ou cálculos de coordenadas absolutas desnecessários.

## 6. Boas Práticas Gerais
- Prefira componentes simples e funções puras.
- Documente as interfaces e props principais.
- Mantenha o projeto fácil de manter e expandir.
