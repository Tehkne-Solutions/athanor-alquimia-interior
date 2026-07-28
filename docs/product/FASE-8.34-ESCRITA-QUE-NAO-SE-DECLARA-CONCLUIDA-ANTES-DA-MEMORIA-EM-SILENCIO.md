# Fase 8.34 — A Escrita que Não se Declara Concluída Antes da Memória em Silêncio

## Estado

Implementação funcional da confirmação transacional para todas as mudanças persistidas da biblioteca recebida.

## Problema

O Zustand atualizava a biblioteca ativa e devolvia sucesso antes de o middleware terminar o `setItem` assíncrono. Se a IndexedDB recusasse a transação por quota, indisponibilidade ou erro local, a sessão passava a mostrar uma mudança que não estava guardada.

A sequência anterior era:

```text
domínio aprova
→ runtime muda
→ interface anuncia sucesso
→ IndexedDB tenta gravar
```

## Solução

A política `confirm-indexeddb-write-before-runtime-commit-v1` inverte as duas últimas fronteiras:

```text
domínio aprova
→ IndexedDB grava o próximo snapshot
→ transação confirma
→ runtime muda
→ interface anuncia sucesso
```

## Operações protegidas

- guardar uma cópia recebida;
- arquivar uma cópia;
- reativar uma cópia;
- remover uma cópia;
- reiniciar a biblioteca.

## Ações assíncronas

As APIs da store agora retornam `Promise`.

A interface aguarda o resultado antes de:

- selecionar o ID realmente armazenado;
- remover uma seleção;
- descartar a prévia;
- mostrar mensagem de sucesso.

## Escrita explícita

O envelope persistido continua sendo o envelope Zustand conhecido:

```text
state.schemaVersion = 1
state.registry = próximo snapshot
version = 0
```

A chave permanece:

```text
athanor-continuous-received-state
```

## Middleware

O middleware `persist` continua hidratando a biblioteca, porém sua escrita automática foi desativada. Isso impede uma segunda gravação sem confirmação depois que o snapshot já foi persistido explicitamente.

## Concorrência

Enquanto uma transação está em andamento:

```text
status: writing
```

Outra ação recebe:

```text
status: writing
changed: false
```

Ela não é executada, enfileirada ou repetida.

## Falha

Quando a escrita falha:

```text
status: persistence-failed
changed: false
```

A biblioteca ativa anterior permanece intacta. O Athanor não precisa executar rollback porque ainda não aplicou o próximo snapshot ao runtime.

A prévia, a seleção e a biblioteca anterior continuam disponíveis para uma nova decisão explícita.

## Resultados sem mudança

Quando o domínio retorna um estado sem alteração, nenhuma transação é iniciada. Isso inclui cópia equivalente, estado já solicitado, registro ausente, ID ambíguo, relógio obsoleto ou integridade inválida.

## Interface

A tela apresenta:

- card “Gravando a alteração local” durante a transação;
- botões de mutação desabilitados;
- card “Gravação local não confirmada” quando a IndexedDB falha;
- mensagem de sucesso somente depois da confirmação.

A leitura de um novo arquivo pode continuar durante uma escrita, mas a decisão de guardá-lo permanece bloqueada até o término da transação.

## Store transitória

`useContinuousReceivedPersistenceRuntimeStore` mantém:

```text
status
operation
message
issues
```

Nada disso é partializado ou gravado na IndexedDB.

## Limites

A confirmação significa apenas que a transação IndexedDB terminou com sucesso naquele momento. Ela não garante durabilidade física eterna, não replica dados e não autentica pessoa, dispositivo ou conteúdo.

## Ausências deliberadas

A fase não cria:

- fila de escrita;
- retry automático;
- rollback persistido;
- nova chave IndexedDB;
- migração;
- sincronização;
- analytics;
- telemetria.

## Assinatura

**Tehkné Solutions**
