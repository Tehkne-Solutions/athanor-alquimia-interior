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

1. Verificar se todas as páginas públicas possuem retorno ou continuidade explícita.
2. Auditar o primeiro acesso ao Templo e o destaque da missão inicial.
3. Verificar rotas parametrizadas com IDs inexistentes.
4. Validar fallback de rota desconhecida sem perda de contexto.
5. Cobrir o ciclo `/welcome` até `/temple` com teste automatizado.
6. Cobrir a primeira missão até crafting, revisão e retorno ao Templo.
7. Validar navegação por teclado e foco após cada mudança de rota.

## Critério de conclusão desta auditoria

A Sprint 9.0 termina quando uma pessoa nova consegue concluir onboarding e primeira jornada em desktop e mobile, sem orientação externa, sem becos sem saída e com o progresso preservado após recarregamento.

— Tehkné Solutions
