# Sprint 9.0 — Auditoria inicial de rotas e fluxo crítico

## Objetivo

Registrar o fluxo real da primeira sessão do Athanor, identificar bloqueios de navegação e orientar a preparação do beta.

## Fluxo de entrada

```text
/
→ /welcome
→ /limits
→ /character/create
→ /temple/foundation
→ /setup/bible
→ /temple
```

A rota raiz aguarda a hidratação da store e envia a pessoa para `/welcome` quando o onboarding ainda não foi concluído, ou para `/temple` quando já existe uma fundação concluída.

## Proteção de rotas

O `ProtectedShell` protege as áreas de Templo, missões, crafting, inventário, personagem, Codex, acessibilidade e homologação. Antes do fim do onboarding, qualquer acesso a essas rotas retorna para `/welcome`.

As etapas intermediárias do onboarding agora também são protegidas por `OnboardingGuard`, que preserva a ordem obrigatória:

```text
limites aceitos
→ personagem criado
→ Templo fundado
→ fontes configuradas
→ onboarding concluído
```

A primeira jornada possui ainda um `FirstMissionGuard`, que preserva a ordem:

```text
introdução da missão
→ missão ativa
→ classificação
→ classificação concluída
→ cadeia simbólica
→ crafting
```

## Achado 9.0.1 — CTA público bloqueado

**Severidade:** P1

Na tela inicial, o botão `Conhecer a proposta` apontava para `/codex`. Como `/codex` vive dentro do `ProtectedShell`, uma pessoa nova era imediatamente redirecionada de volta para `/welcome`, criando a percepção de botão quebrado.

**Correção aplicada:** o CTA agora aponta para `/limits`, rota pública que apresenta a natureza do produto, seus limites e a política de autonomia antes da criação do personagem.

## Achado 9.0.2 — Onboarding concluível fora de ordem

**Severidade:** P0

As rotas `/character/create`, `/temple/foundation` e `/setup/bible` podiam ser acessadas diretamente. Isso permitia criar um Templo sem personagem ou concluir o onboarding sem aceitar os limites do produto.

**Correção aplicada:** foi criado um guard central de onboarding que:

- aguarda a hidratação antes de decidir;
- envia usuários já iniciados ao Templo;
- exige aceite dos limites antes da criação do personagem;
- exige personagem antes da fundação do Templo;
- exige Templo antes da configuração das fontes;
- evita que uma etapa posterior fabrique estado incompleto.

## Achado 9.0.3 — Primeira jornada acessível sem estado válido

**Severidade:** P0

As rotas de classificação, cadeia simbólica e crafting podiam ser abertas diretamente. Sem `activeMission`, a classificação era exibida sem estado capaz de registrar respostas. A cadeia e a forja também podiam ser abertas antes da conclusão da etapa anterior.

**Correção aplicada:** o `FirstMissionGuard` agora:

- exige missão ativa antes da classificação;
- redireciona acessos sem missão para a introdução;
- exige classificação concluída antes da cadeia;
- exige classificação concluída antes da forja;
- preserva a rota correta depois de recarregar ou colar uma URL.

## Achado 9.0.4 — Retomada regressava para etapa já concluída

**Severidade:** P1

O Átrio indicava `Continuar jornada`, mas a introdução sempre enviava o usuário à classificação. Depois de concluir essa etapa e pausar, a retomada voltava para uma tela já vencida.

**Correção aplicada:** a página da missão agora consulta `currentStep` e retoma diretamente na cadeia simbólica quando a classificação já foi concluída. O texto do CTA também comunica se a ação inicia, continua ou retoma a jornada.

## Auditoria inicial do Átrio

O primeiro acesso ao Templo apresenta:

- saudação personalizada;
- explicação curta sobre o funcionamento do Templo;
- princípio do ciclo;
- card da missão principal;
- CTA explícito para iniciar ou continuar a jornada;
- mapa e instrumentos ainda abaixo da ação principal.

O card da missão principal já adapta seu estado para início, continuidade, revisão e integração. A próxima rodada deve avaliar visualmente hierarquia, dobra mobile e competição entre o CTA da Biblioteca e o CTA da missão.

## Inventário macro de rotas

### Públicas e onboarding

- `/`
- `/welcome`
- `/limits`
- `/character/create`
- `/temple/foundation`
- `/setup/bible`
- `/safety`

### Núcleo do Templo

- `/temple`
- `/temple/map`
- `/temple/proverbs-library`
- `/temple/psalms-chamber`
- `/temple/forge`
- `/temple/garden`
- `/temple/spirit-sanctuary`
- `/temple/new-work`

### Nova Obra contínua

- `/temple/continuous-cycles`
- `/temple/continuous-map`
- `/temple/continuous-collections`
- `/temple/continuous-received`
- `/temple/continuous-return`
- rotas parametrizadas de trilha, tema, partilha e resposta

### Jornadas e crafting

- Palavra
- Água
- Fogo
- Terra
- Espírito
- crafting e revisão de cada capítulo

### Utilitários internos

- `/inventory`
- `/codex`
- `/character`
- `/settings/accessibility`
- `/homologation`
- `/dev`, somente em desenvolvimento

## Próximas verificações

1. Auditar a hierarquia visual do Átrio em desktop e mobile.
2. Verificar se o CTA de princípio compete com a missão principal na primeira dobra.
3. Proteger item e revisão contra acesso sem Lâmpada criada.
4. Verificar rotas parametrizadas com IDs inexistentes.
5. Validar fallback de rota desconhecida sem perda de contexto.
6. Cobrir o ciclo `/welcome` até `/temple` com teste automatizado.
7. Cobrir a primeira missão até crafting, revisão e retorno ao Templo.
8. Validar navegação por teclado e foco após cada mudança de rota.

## Critério de conclusão desta auditoria

A Sprint 9.0 termina quando uma pessoa nova consegue concluir onboarding e primeira jornada em desktop e mobile, sem orientação externa, sem becos sem saída e com o progresso preservado após recarregamento.

— Tehkné Solutions
