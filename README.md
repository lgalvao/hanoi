# 🗼 Torre de Hanói

Uma implementação moderna e interativa do clássico quebra-cabeça Torre de Hanói, construída com Vue 3, TypeScript e Vite.

![Torre de Hanói](https://img.shields.io/badge/Vue-3.4+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Vite](https://img.shields.io/badge/Vite-5.0+-purple)
![Testes](https://img.shields.io/badge/Testes-Vitest-orange)

## 🎮 Como Jogar

O objetivo é mover todos os discos do pino da esquerda para o pino da direita, seguindo estas regras:

1. **Apenas um disco pode ser movido por vez**
2. **Sempre mova o disco do topo de qualquer pino**
3. **Nunca coloque um disco maior sobre um disco menor**

### Controles

- **Clique** em um disco para selecioná-lo, depois clique em outro pino para movê-lo
- **Arraste e solte** discos entre os pinos
- **Teclado**: Use Tab para navegar e Enter/Espaço para selecionar discos
- **Auto-resolução**: Clique no botão "Auto-resolver" para ver a solução automática

## 🚀 Funcionalidades

- ✨ **Interface moderna e responsiva**
- 🎯 **Validação automática de movimentos**
- 🎬 **Animações suaves de movimento**
- 🤖 **Auto-resolução com visualização**
- 🎮 **Controles por mouse e teclado**
- 📱 **Design responsivo para mobile**
- ♿ **Acessibilidade completa**
- 🧪 **Testes automatizados**

## 🛠️ Tecnologias

- **Frontend**: Vue 3 (Composition API)
- **Linguagem**: TypeScript
- **Build Tool**: Vite
- **Testes**: Vitest + Vue Test Utils
- **Estilização**: CSS Custom Properties
- **Linting**: ESLint + TypeScript

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/hanoi.git
cd hanoi

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npx vitest run --coverage

# Executar testes em modo watch
npm run test:watch
```

## 🏗️ Build

```bash
# Build para produção
npm run build

# Preview do build
npm run preview

# Verificar tipos TypeScript
npm run type-check
```

## 📁 Estrutura do Projeto

```
hanoi/
├── src/
│   ├── components/          # Componentes Vue
│   │   ├── App.vue         # Componente principal
│   │   ├── Tabuleiro.vue   # Tabuleiro do jogo
│   │   ├── Pino.vue        # Pino individual
│   │   ├── Disco.vue       # Disco individual
│   │   └── Controles.vue   # Controles do jogo
│   ├── logica.ts           # Lógica do jogo
│   ├── visualConfig.ts     # Configurações visuais
│   ├── types.ts            # Tipos TypeScript
│   └── main.ts             # Ponto de entrada
├── tests/
│   └── unit/               # Testes unitários
├── rules.md                # Regras do projeto
└── RELEASE_CHECKLIST.md    # Checklist de release
```

## 🎨 Arquitetura

O projeto segue uma arquitetura limpa com separação clara de responsabilidades:

- **Lógica do Jogo**: Funções puras em `logica.ts`
- **Componentes UI**: Vue 3 com Composition API
- **Configurações**: Centralizadas em `visualConfig.ts`
- **Tipos**: Definidos em `types.ts`
- **Testes**: Cobertura completa de lógica e UI

## 🔧 Desenvolvimento

### Regras do Projeto

Consulte o arquivo `rules.md` para as regras e padrões do projeto.

### Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm test` - Executar testes
- `npm run type-check` - Verificar tipos TypeScript

## 📊 Cobertura de Testes

O projeto mantém alta cobertura de testes:

- **Lógica do jogo**: 100%
- **Componentes**: >95%
- **Configurações**: 100%

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- [Vue.js](https://vuejs.org/) - Framework JavaScript progressivo
- [Vite](https://vitejs.dev/) - Build tool rápida
- [Vitest](https://vitest.dev/) - Framework de testes
- [TypeScript](https://www.typescriptlang.org/) - JavaScript tipado

---

**Desenvolvido com ❤️ usando Vue 3 + TypeScript** 