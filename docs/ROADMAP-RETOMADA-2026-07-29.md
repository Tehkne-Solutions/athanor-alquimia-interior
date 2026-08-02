# Roadmap de retomada — Athanor App

**Data de consolidação:** 29 de julho de 2026  
**Base auditada:** `main` após o merge da Fase 8.37  
**Produto:** Athanor — Alquimia Interior  
**Assinatura:** Tehkné Solutions

## 1. Estado atual

O Athanor já possui um vertical slice funcional e uma fundação técnica madura:

- onboarding, limites do produto e criação de personagem;
- Templo Astral, Átrio da Presença e mapa do Templo;
- jornadas da Palavra, Água, Fogo, Terra e Espírito;
- crafting, revisão, transformação e Nova Obra contínua;
- coleções, partilha consentida, recepção separada e respostas opcionais;
- armazenamento local em IndexedDB;
- PWA offline e configuração SPA para Vercel;
- acessibilidade básica, alto contraste e redução de movimento;
- validação editorial e técnica automatizada;
- testes com Vitest;
- políticas defensivas de importação e persistência até a Fase 8.37.

A sequência 8.12–8.37 elevou significativamente a segurança dos dados locais, formatos recebidos, concorrência entre abas e hidratação. O próximo ciclo precisa deslocar o foco principal de infraestrutura defensiva para experiência de produto, conteúdo, acabamento visual, validação com usuários e lançamento.

## 2. Lacunas prioritárias

### P0 — Produto jogável e compreensível

1. Auditar o fluxo completo de primeira sessão.
2. Reduzir fricção e excesso de texto nas primeiras telas.
3. Tornar objetivo, progresso e próximo passo sempre visíveis.
4. Garantir que cada jornada tenha início, meio, retorno e encerramento claros.
5. Criar estados vazios, feedbacks de sucesso, erro e retomada consistentes.
6. Validar navegação por teclado, mobile e leitores de tela.

### P0 — Qualidade e lançamento

1. Criar smoke tests para os fluxos críticos.
2. Adicionar teste E2E do ciclo principal.
3. Auditar service worker, atualização de versão e funcionamento offline.
4. Definir estratégia segura de backup/exportação do progresso local.
5. Criar checklist de release e rollback.
6. Publicar ambiente de homologação estável.

### P1 — UI, identidade e experiência contemplativa

1. Consolidar direção visual única para Templo, jornadas, crafting e coleção.
2. Revisar hierarquia tipográfica, densidade, espaçamento e responsividade.
3. Padronizar componentes, estados e motion.
4. Criar ilustrações, texturas, ícones e ambientações próprias.
5. Remover aparência de painel técnico nas telas voltadas ao usuário.
6. Preservar a sobriedade contemplativa sem transformar a experiência em interface clínica ou dashboard corporativo.

### P1 — Conteúdo e progressão

1. Auditar repetição e equilíbrio entre as jornadas elementais.
2. Expandir variações curadas sem inflar complexidade.
3. Revisar linguagem, consistência editorial e tamanho das instruções.
4. Criar progressão percebida do Templo sem ranking pessoal.
5. Adicionar retornos contextuais e recompensas simbólicas não competitivas.
6. Preparar conteúdo inicial suficiente para validação de retenção.

### P1 — Observabilidade privada

1. Criar diagnóstico local exportável pelo usuário.
2. Registrar somente eventos técnicos e consentidos.
3. Evitar conteúdo íntimo, respostas pessoais e textos de jornada em telemetria.
4. Preparar canal de feedback manual e minimizado.
5. Documentar claramente o que nunca é coletado.

### P2 — Conta e sincronização opcional

Esta frente não deve bloquear o primeiro lançamento local-first.

1. Definir arquitetura opt-in para conta.
2. Projetar sincronização criptografada e resolução explícita de conflitos.
3. Manter modo sem conta como experiência completa.
4. Separar autenticação, backup e sincronização como capacidades independentes.
5. Só implementar após validação do valor central do produto.

### P2 — Sustentabilidade do produto

1. Definir proposta gratuita e possíveis planos futuros.
2. Evitar monetização baseada em vulnerabilidade emocional ou espiritual.
3. Avaliar conteúdo premium, apoio recorrente ou licenciamento institucional.
4. Criar termos, privacidade, suporte e política de exclusão de dados.

## 3. Roadmap recomendado

### Sprint 9.0 — Auditoria do ciclo real

**Objetivo:** provar que uma pessoa nova consegue entrar, compreender, concluir uma jornada e retornar ao Templo sem orientação externa.

Entregas concluídas no código:

- mapa atualizado das rotas e estados;
- correção dos bloqueios P0;
- retomada centralizada da Primeira Obra;
- guards determinísticos;
- CTAs centralizados no domínio;
- smoke tests de fluxo e acessibilidade;
- gerenciamento de foco pós-navegação;
- relatório final em `docs/SPRINT-9-BETA-READINESS-REPORT.md`;
- README atualizado para a Fase 8.37;
- CI com typecheck, diagnóstico por etapa, `workflow_dispatch`, concorrência e resumo final;
- configuração do Vitest unificada em `vitest.config.ts`;
- comando local `npm run verify` reproduzindo o gate completo.

Gate pendente para fechamento administrativo:

```text
npm run verify
```

ou um run verde equivalente do workflow **Athanor CI** no GitHub Actions.

Após o gate verde, executar homologação visual desktop/mobile e encerrar a issue #70.

### Sprint 9.1 — Sistema visual e shell do produto

**Objetivo:** consolidar a identidade do Athanor como experiência contemplativa e não como painel técnico.

Entregas:

- tokens visuais revisados;
- shell responsivo;
- navegação principal simplificada;
- componentes de missão, prática, retorno e crafting;
- estados de carregamento, vazio, erro e conclusão;
- revisão de contraste, foco e redução de movimento.

### Sprint 9.2 — Jornada inicial definitiva

**Objetivo:** transformar “A Palavra Antes da Resposta” na experiência de entrada oficial e altamente polida.

Entregas:

- copy revisada;
- duração e ritmo ajustados;
- feedback contextual;
- transições e ambientação;
- encerramento com retorno ao Templo;
- testes de usabilidade internos.

### Sprint 9.3 — Conteúdo elemental e progressão do Templo

**Objetivo:** harmonizar Água, Fogo, Terra e Espírito e tornar a transformação do Templo perceptível.

Entregas:

- matriz editorial comparativa;
- redução de repetições;
- progressão visual não competitiva;
- recompensas simbólicas;
- revisão de crafting e coleção.

### Sprint 9.4 — Confiabilidade de produção

**Objetivo:** preparar uma versão candidata a beta.

Entregas:

- testes E2E;
- auditoria PWA/offline/update;
- exportação e restauração do progresso;
- diagnóstico local;
- checklist de release;
- homologação Vercel.

### Sprint 9.5 — Beta fechado

**Objetivo:** validar clareza, valor percebido, retorno e segurança com usuários reais.

Entregas:

- roteiro de teste;
- formulário de feedback minimizado;
- métricas consentidas e não sensíveis;
- triagem de achados;
- plano de correções para lançamento público.

### Sprint 10 — Lançamento público local-first

**Objetivo:** publicar uma versão estável, documentada e sustentável.

Entregas:

- domínio e ambiente de produção;
- páginas legais e suporte;
- onboarding final;
- monitoramento técnico não invasivo;
- estratégia de comunicação;
- backlog pós-lançamento.

## 4. Ordem de execução imediata

1. Executar `npm run verify` ou disparar manualmente **Athanor CI** em Actions.
2. Corrigir qualquer falha observada no gate.
3. Fazer homologação visual desktop/mobile do build aprovado.
4. Encerrar a issue #70.
5. Abrir a Sprint 9.1 somente após o fluxo principal estar estável e o gate verde.

## 5. Regra de foco

Até o encerramento da Sprint 9.0, novas políticas defensivas da série 8.x só devem ser adicionadas quando corrigirem um risco real reproduzível. Melhorias abstratas de robustez não devem ultrapassar em prioridade problemas de navegação, compreensão, acessibilidade, conteúdo, qualidade visual ou entrega.
