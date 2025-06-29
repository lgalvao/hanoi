# Checklist de Release - Torre de Hanói

## ✅ Pré-Release

### Código e Funcionalidades
- [ ] Todos os testes passando (`npm test`)
- [ ] Cobertura de testes acima de 80%
- [ ] Lógica de empilhamento dos discos funcionando corretamente
- [ ] Animações de movimento funcionando
- [ ] Auto-resolução funcionando
- [ ] Controles de quantidade de discos funcionando
- [ ] Validação de movimentos (não permitir disco maior sobre menor)
- [ ] Detecção de vitória funcionando

### Qualidade do Código
- [ ] TypeScript sem erros de compilação
- [ ] Linter sem warnings/erros
- [ ] Imports organizados e usando aliases (@)
- [ ] Comentários em português e claros
- [ ] Nomes de variáveis/funções descritivos
- [ ] Separação de responsabilidades (lógica vs UI)

### Arquitetura
- [ ] Componentes bem estruturados e reutilizáveis
- [ ] Props e eventos bem definidos
- [ ] Configurações visuais centralizadas
- [ ] Tipos TypeScript bem definidos
- [ ] Funções puras na lógica do jogo

### Acessibilidade
- [ ] Controles acessíveis via teclado
- [ ] Aria-labels nos elementos interativos
- [ ] Roles semânticos nos componentes
- [ ] Contraste de cores adequado

## ✅ Build e Deploy

### Build
- [ ] `npm run build` executando sem erros
- [ ] Arquivos de build gerados corretamente
- [ ] Tamanho do bundle otimizado
- [ ] Assets (CSS, JS) minificados

### Teste de Produção
- [ ] Aplicação funcionando em ambiente de produção
- [ ] Responsividade testada em diferentes dispositivos
- [ ] Performance adequada
- [ ] Sem console errors no navegador

## ✅ Documentação

### README
- [ ] Instruções de instalação e uso
- [ ] Descrição das funcionalidades
- [ ] Screenshots da aplicação
- [ ] Tecnologias utilizadas
- [ ] Como executar testes

### Código
- [ ] Comentários JSDoc nas funções principais
- [ ] README de desenvolvimento
- [ ] Regras do projeto atualizadas

## ✅ Versionamento

### Git
- [ ] Commits organizados e descritivos
- [ ] Branch principal limpa
- [ ] Tag de versão criada
- [ ] Changelog atualizado

### Package.json
- [ ] Versão atualizada
- [ ] Dependências atualizadas
- [ ] Scripts funcionando

## ✅ Pós-Release

### Monitoramento
- [ ] Aplicação funcionando em produção
- [ ] Logs de erro monitorados
- [ ] Performance monitorada

### Feedback
- [ ] Testes com usuários
- [ ] Bugs reportados e corrigidos
- [ ] Melhorias identificadas

---

## Comandos Úteis

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npx vitest run --coverage

# Build de produção
npm run build

# Preview do build
npm run preview

# Verificar tipos TypeScript
npm run type-check
```

---

## Versão Atual: 1.0.0

**Data do Release:** [DATA]
**Responsável:** [NOME]
**Notas:** Primeira versão estável do jogo Torre de Hanói 