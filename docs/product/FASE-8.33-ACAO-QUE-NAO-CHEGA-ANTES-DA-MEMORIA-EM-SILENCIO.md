# Fase 8.33 — A Ação que Não Chega Antes da Memória em Silêncio

## Estado

Implementação funcional do bloqueio transitório de ações enquanto a biblioteca recebida hidrata a partir da IndexedDB.

## Lacuna corrigida

A Fase 8.32 validava a memória antes de adotá-la, porém a store permanecia operacional durante a leitura assíncrona. Uma inserção ou mutação feita sobre a biblioteca inicial poderia ser substituída pelo merge posterior.

## Solução

A política `block-received-actions-until-hydration-settles-v1` cria um portão único usado pela store e pela interface.

```text
initial
→ hydrating
→ ação recusada sem execução

unavailable
→ unavailable
→ ação recusada para evitar sobrescrita

empty | accepted | rejected
→ ready
→ domínio pode decidir
```

## Store transitória

O ciclo de hidratação foi separado da store persistida:

```text
useContinuousReceivedHydrationRuntimeStore
```

Ela mantém somente:

- status;
- mensagem;
- problemas transitórios.

Esses dados não são partializados e não voltam para a IndexedDB.

## Falha de leitura

`onRehydrateStorage` marca `unavailable` quando a storage falha. A aplicação não interpreta esse erro como biblioteca vazia e não grava automaticamente o fallback provisório.

## Ações protegidas

- guardar uma cópia;
- arquivar;
- reativar;
- remover;
- reiniciar a biblioteca.

A função de domínio não é chamada enquanto o portão está fechado.

## Sem replay

Nenhuma ação bloqueada é guardada para depois. Quando a hidratação termina, o usuário precisa repetir conscientemente a decisão.

## Interface

Durante `initial`:

- a tela informa que a memória está sendo examinada;
- upload, consentimentos e mutações ficam desabilitados.

Durante `unavailable`:

- a falha é exibida;
- ações continuam bloqueadas;
- a biblioteca provisória não substitui a memória desconhecida.

## Persistência preservada

A chave continua:

```text
athanor-continuous-received-state
```

E a partialização continua contendo apenas:

```text
schemaVersion
registry
```

## Limites

A fase não cria fila, retry automático, migração, sincronização, analytics, telemetria ou histórico de tentativas.

**Tehkné Solutions**
