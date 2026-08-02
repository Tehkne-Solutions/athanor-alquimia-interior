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

Entregas:

- mapa atualizado das rotas e estados;
- auditoria do fluxo de primeira sessão;
- inventário de fricções P0/P1/P2;
- correção dos bloqueios P0;
- smoke test do ciclo principal;
- relatório visual antes/depois;
- atualização do README para refletir a Fase 8.37.

Critérios de aceite:

- onboarding concluível em mobile e desktop;
- nenhum beco sem saída;
- progresso preservado após recarregar;
- próxima ação clara em todas as etapas críticas;
- fluxo principal coberto por teste automatizado.

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

1. Atualizar documentação da Fase 8.37.
2. Mapear rotas, telas, stores e persistência.
3. Executar e registrar testes atuais.
4. Auditar visualmente o fluxo de primeira sessão.
5. Corrigir todos os bloqueios P0.
6. Criar smoke test automatizado do ciclo principal.
7. Abrir a Sprint 9.1 somente após o fluxo principal estar estável.

## 5. Regra de foco

Até o encerramento da Sprint 9.0, novas políticas defensivas da série 8.x só devem ser adicionadas quando corrigirem um risco real reproduzível. Melhorias abstratas de robustez não devem ultrapassar em prioridade problemas de navegação, compreensão, acessibilidade, conteúdo, qualidade visual ou entrega.

## 6. Atualização de fechamento funcional — 2 de agosto de 2026

A implementação da Sprint 9.0 consolidou o fluxo inicial e a Primeira Obra em uma única máquina de estados de domínio.

Concluído no código:

- onboarding sequencial e guards defensivos;
- retomada determinística da Primeira Obra;
- centralização de rotas, bloqueios, CTAs e apresentação em `firstMissionFlow.ts`;
- `MissionPage`, `FirstMissionGuard` e `TemplePage` consumindo o mesmo contrato;
- lifecycle `resting` formalizado no schema e no tipo;
- testes de domínio e review;
- testes integrados de roteamento;
- testes dos CTAs reais do Átrio e da missão;
- `jsdom` + Testing Library + matchers globais;
- skip link, landmarks, região live e navegação semântica;
- transferência de foco para o conteúdo principal após mudança de rota;
- smoke de acessibilidade e foco;
- workflow de CI com validação de conteúdo, typecheck, testes e build;
- relatório de evidências em `docs/SPRINT-9-BETA-READINESS-REPORT.md`;
- README já documentando a Fase 8.37.

### Gate administrativo remanescente

O conector do GitHub ainda retorna `statuses: []` para os commits recentes. Por isso, o roadmap não presume sucesso de execução remota.

O fechamento administrativo definitivo da Sprint 9.0 depende de evidência verde para:

```text
npm run validate:content
npm run lint
npm test
npm run build
```

Com esse gate aprovado, a execução pode avançar para a Sprint 9.1 e homologação visual sem reabrir a arquitetura do fluxo inicial.
