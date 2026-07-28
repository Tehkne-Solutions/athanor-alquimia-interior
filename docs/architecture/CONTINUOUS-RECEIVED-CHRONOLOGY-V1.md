# Contrato de cronologia local recebida v1

## Política

`canonical-local-time-never-regresses-v1`

## Objetivo

Impedir que criação, recebimento ou mutações locais usem instantes não canônicos ou anteriores ao último estado conhecido da biblioteca.

## Formato

```text
YYYY-MM-DDTHH:mm:ss.sssZ
```

Todos os instantes locais usam UTC explícito e três dígitos de milissegundos.

## Invariantes da biblioteca

- `updatedAt >= createdAt`;
- `receivedAt >= registry.createdAt`;
- `record.updatedAt >= record.receivedAt`;
- `registry.updatedAt >= record.updatedAt` para todas as cópias;
- cópia ativa não possui `archivedAt`;
- cópia arquivada possui `archivedAt === updatedAt`.

## Inserção e ações

Uma inserção, arquivamento, reativação ou remoção somente avança quando o instante é igual ou posterior ao `updatedAt` da biblioteca. Instantes iguais são aceitos.

Resultado temporal:

```text
canonical and monotonic → valid
noncanonical → invalid
canonical but earlier → stale
```

## Relógio externo

`package.generatedAt` não é comparado ao instante local de recebimento. A origem pode usar outro dispositivo ou relógio. Esta política protege somente a sequência interna da biblioteca local.

## Legado

Uma biblioteca legada cronologicamente incoerente não é corrigida nem migrada. Novas mutações são bloqueadas e o estado original permanece intacto.

## Limites

A cronologia local não comprova identidade, autoria, verdade do evento, entrega, leitura ou correção do relógio do dispositivo.

## Persistência

Nenhuma store, chave IndexedDB, trilha de auditoria, analytics, telemetria ou sincronização adicional é criada.

**Tehkné Solutions**
