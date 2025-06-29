# Guia de Contribuição

Obrigado por considerar contribuir para o projeto Torre de Hanoi! Este documento fornece diretrizes para contribuições.

## Como Contribuir

### Reportando Bugs

- Use o template de issue para bugs
- Inclua passos detalhados para reproduzir o problema
- Adicione screenshots se aplicável
- Especifique seu ambiente (OS, navegador, versão)

### Sugerindo Features

- Use o template de issue para features
- Descreva o problema que a feature resolveria
- Explique como a feature deveria funcionar
- Considere alternativas e trade-offs

### Fazendo Pull Requests

1. **Fork o repositório**
2. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/nova-feature
   ```
3. **Faça suas mudanças**
   - Siga as convenções de código
   - Adicione testes para novas funcionalidades
   - Atualize a documentação se necessário
4. **Teste suas mudanças**
   ```bash
   npm run lint
   npm run test:unit
   npm run test:coverage
   npm run build
   ```
5. **Commit suas mudanças**
   ```bash
   git commit -m "feat: adiciona nova funcionalidade"
   ```
6. **Push para sua branch**
   ```bash
   git push origin feature/nova-feature
   ```
7. **Abra um Pull Request**
   - Use o template de PR
   - Descreva suas mudanças claramente
   - Referencie issues relacionadas

## Convenções de Código

### TypeScript/JavaScript
- Use TypeScript para todo código novo
- Siga as regras do ESLint
- Use nomes descritivos para variáveis e funções
- Adicione JSDoc para funções públicas

### Vue.js
- Use Composition API para componentes novos
- Mantenha componentes pequenos e focados
- Use props para dados de entrada
- Emita eventos para comunicação pai-filho

### Testes
- Mantenha cobertura de testes alta (>90%)
- Teste casos de borda e erros
- Use nomes descritivos para testes
- Agrupe testes relacionados

### Commits
Siga o [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova feature
- `fix:` correção de bug
- `docs:` mudanças na documentação
- `style:` formatação, ponto e vírgula, etc.
- `refactor:` refatoração de código
- `test:` adicionando ou corrigindo testes
- `chore:` mudanças em build, dependências, etc.

## Estrutura do Projeto

```
src/
├── components/     # Componentes Vue
├── types.ts        # Definições de tipos TypeScript
├── logica.ts       # Lógica do jogo
├── visualConfig.ts # Configurações visuais
└── main.ts         # Ponto de entrada
```

## Configuração do Ambiente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/hanoi.git
   cd hanoi
   ```

2. **Instale dependências**
   ```bash
   npm install
   ```

3. **Execute em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Execute testes**
   ```bash
   npm run test:unit
   npm run test:coverage
   ```

## Processo de Review

1. **Revisão automática**: CI/CD verifica lint, testes e build
2. **Revisão manual**: Mantenedores revisam código e funcionalidade
3. **Feedback**: Comentários são feitos no PR
4. **Iteração**: Faça mudanças conforme solicitado
5. **Merge**: PR é mergeado após aprovação

## Recursos Úteis

- [Documentação Vue 3](https://vuejs.org/)
- [Documentação TypeScript](https://www.typescriptlang.org/)
- [Documentação Vitest](https://vitest.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Perguntas?

Se você tem dúvidas sobre como contribuir, abra uma issue ou entre em contato com os mantenedores.

Obrigado por contribuir! 🎉 