# Sprint 9.0 — Relatório final de preparação do beta

## Objetivo

Provar e estabilizar o fluxo inicial do Athanor para que uma pessoa possa entrar, compreender a proposta, iniciar a Primeira Obra, retomar o progresso e voltar ao Átrio sem depender de orientação externa.

## Fluxo estabilizado

```text
/
→ welcome
→ limits
→ character
→ foundation
→ setup
→ temple
→ Primeira Obra
→ classificação
→ cadeia
→ crafting
→ item
→ revisão
→ biblioteca / retorno ao Átrio
```

## Mudanças principais

### Onboarding e guards

- fluxo inicial tornado sequencial e defensivo;
- `OnboardingGuard` impede acesso fora de ordem;
- `FirstMissionGuard` delega as decisões de retomada ao domínio central;
- becos sem saída do fluxo crítico foram substituídos por redirects determinísticos.

### Domínio da Primeira Obra

A lógica foi centralizada em `src/domain/firstMissionFlow.ts`.

O domínio resolve:

- rota de retomada;
- bloqueios por etapa;
- estados revisáveis;
- apresentação do card principal;
- CTA e destino;
- compatibilidade com lifecycle `resting`.

`MissionPage`, `FirstMissionGuard` e `TemplePage` passaram a consumir esse mesmo contrato.

### Átrio

A Primeira Obra foi priorizada visualmente no `TemplePage` e seu card deixou de manter uma árvore de decisão própria.

Estados cobertos:

- missão não iniciada;
- missão ativa;
- item criado;
- `awaiting_review`;
- `adjusted`;
- `resting`;
- `integrated`.

### Retomada

A retomada da Primeira Obra agora é determinística:

```text
sem missão → introdução
passo < 2 → classificação
classificação concluída → cadeia
item ativo → item
awaiting_review / adjusted / resting → revisão
integrated → biblioteca
```

### Acessibilidade

O shell protegido possui:

- skip link para `#main-content`;
- landmark `<main>` focável programaticamente;
- navegação desktop e mobile nomeadas;
- links semânticos operáveis por teclado;
- região `aria-live="polite"` para anunciar a rota;
- transferência de foco para o conteúdo principal após mudança real de rota;
- suporte existente a alto contraste e redução de movimento.

O foco não é deslocado no carregamento inicial; somente mudanças subsequentes de rota acionam a transferência.

## Cobertura automatizada adicionada

### Domínio

- `src/domain/firstMissionFlow.test.ts`
- `src/domain/review.test.ts`

### Roteamento integrado

- `src/app/App.firstMissionRouting.test.tsx`

Cobre redirects para introdução, classificação, item e revisão, inclusive lifecycle legado `resting`.

### Entradas da Primeira Obra

- `src/pages/FirstMissionEntryPoints.test.tsx`

Cobre CTAs reais da `MissionPage` e do card do `TemplePage`.

### Smoke de acessibilidade

- `src/app/App.accessibilitySmoke.test.tsx`

Cobre skip link, landmarks, navegação nomeada, semântica para teclado, anúncio de rota e foco pós-navegação.

## Infraestrutura de testes e CI

O ambiente de componentes usa uma única configuração oficial em `vitest.config.ts`, com:

- `jsdom`;
- Testing Library;
- `@testing-library/jest-dom/vitest`;
- setup global em `tests/setup.ts`.

A configuração duplicada que também existia em `vite.config.ts` foi removida para evitar divergência entre desenvolvimento local e CI.

O workflow `.github/workflows/ci.yml` executa:

```text
npm ci
→ npm run validate:content
→ npm run lint
→ npm test
→ npm run build
```

O workflow também possui:

- `workflow_dispatch` para disparo manual;
- `concurrency` por ref para evitar runs obsoletos concorrentes;
- resumo final no `GITHUB_STEP_SUMMARY` com o resultado de cada gate;
- artefatos curtos de diagnóstico para conteúdo, typecheck, testes e build.

Para reproduzir o mesmo gate localmente foi adicionado:

```text
npm run verify
```

que executa validação de conteúdo, typecheck, testes e build em sequência.

## Correções de contrato encontradas durante a sprint

`resting` era reconhecido pelo fluxo e pela interface, porém não fazia parte de `ItemLifecycle`. O schema e o tipo foram alinhados ao comportamento já suportado.

Também foi identificada e removida uma duplicação de configuração entre `vite.config.ts` e `vitest.config.ts`, que poderia fazer o Vitest usar setup diferente do esperado em CI.

## Evidências principais por commit

- `f7300d4` — correção do CTA de entrada;
- `4b7d60e` — onboarding guard;
- `c99e642` — retomada contextual na missão;
- `6231025` — primeiro guard da Primeira Obra;
- `28d54e5` — retomada inteligente;
- `5c0fdd3` — lifecycle defensivo;
- `f2dd5fa` — priorização da Primeira Obra no Átrio;
- `4863852` — máquina de estados central;
- `0677459` — testes do domínio;
- `ebf1f7b` — MissionPage centralizada;
- `2dfe960` — guard centralizado;
- `b5667b1` — apresentação centralizada;
- `66d3f60` — cobertura visual do domínio;
- `86a6727` — TemplePage centralizado;
- `a43df6b` — CI com typecheck e timeout;
- `cbd0bfd` — contrato `resting` alinhado;
- `db45c31` — testes integrados de guards;
- `9ef71ae` — testes dos CTAs reais;
- `2ee8e3d` — smoke inicial de acessibilidade;
- `9b9add2` — gerenciamento de foco após navegação;
- `fbd750b` / `5cd39fe` — testes de foco e teclado;
- `0723590` — CI com disparo manual, concorrência e resumo final;
- `b201b2c` / `94fb3d0` — unificação da configuração do Vitest;
- `f137278` — comando único `npm run verify`.

## Estado de aceite

Funcionalmente, o escopo de código da Sprint 9 está implementado e coberto por testes automatizados adicionados ao repositório.

O conector do GitHub utilizado durante esta sprint continua retornando `statuses: []` para os commits recentes e o ambiente de execução disponível não possui `gh` instalado. Portanto, este relatório **não declara** `validate:content`, testes e build como aprovados em execução remota até existir evidência de um run concluído do GitHub Actions ou execução local equivalente de `npm run verify`.

Esse é o único gate remanescente para o fechamento administrativo definitivo da Sprint 9.

## Próxima fase

Após o gate verde de CI, o projeto pode entrar na fase de beta/homologação com foco em:

- execução do ciclo completo por usuários de teste;
- revisão visual mobile/desktop;
- coleta de fricções P1/P2;
- correções de polish sem reabrir a arquitetura do fluxo inicial.
