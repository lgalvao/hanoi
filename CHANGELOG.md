# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-12-29

### Adicionado
- 🎮 **Jogo Torre de Hanói completo** com interface moderna
- ✨ **Animações suaves** para movimentos de discos
- 🤖 **Auto-resolução** com visualização passo a passo
- 🎯 **Validação automática** de movimentos (não permite disco maior sobre menor)
- 🎮 **Controles múltiplos**: clique, arraste/solta, teclado
- 📱 **Design responsivo** para desktop e mobile
- ♿ **Acessibilidade completa** com navegação por teclado e aria-labels
- 🧪 **Testes automatizados** com cobertura de 87%
- 📊 **Cobertura de testes**: 100% na lógica, >95% nos componentes

### Funcionalidades
- **Empilhamento correto**: Discos maiores embaixo, menores em cima
- **Controle de quantidade**: 1 a 16 discos configuráveis
- **Detecção de vitória**: Identifica quando o jogo foi completado
- **Contador de movimentos**: Acompanha o número de movimentos realizados
- **Reiniciar jogo**: Botão para recomeçar com a mesma quantidade de discos

### Arquitetura
- **Vue 3** com Composition API
- **TypeScript** para tipagem forte
- **Vite** para build rápido
- **Vitest** para testes unitários
- **CSS Custom Properties** para estilização
- **Separação clara** entre lógica e UI

### Documentação
- **README.md** completo com instruções e exemplos
- **Regras do projeto** documentadas em `rules.md`
- **Checklist de release** em `RELEASE_CHECKLIST.md`
- **Comentários JSDoc** em todas as funções principais
- **Changelog** para acompanhar mudanças

### Performance
- **Build otimizado**: 74KB (28KB gzipped)
- **Carregamento rápido** com Vite
- **Animações fluidas** com CSS transitions
- **Responsividade** em todos os dispositivos

---

## [Unreleased]

### Planejado
- 🌐 **Internacionalização** (i18n)
- 🎨 **Temas visuais** (claro/escuro)
- 📈 **Estatísticas** de jogo
- 💾 **Persistência** de progresso
- 🏆 **Sistema de pontuação**
- 📱 **PWA** (Progressive Web App)

---

## Convenções

### Tipos de Mudanças
- **Adicionado** para novas funcionalidades
- **Alterado** para mudanças em funcionalidades existentes
- **Depreciado** para funcionalidades que serão removidas
- **Removido** para funcionalidades removidas
- **Corrigido** para correções de bugs
- **Segurança** para correções de vulnerabilidades

### Versionamento Semântico
- **MAJOR**: Mudanças incompatíveis com versões anteriores
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs compatíveis 