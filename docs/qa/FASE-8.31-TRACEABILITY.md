# Rastreabilidade — Fase 8.31

| Requisito | Implementação | Cobertura |
|---|---|---|
| Política editorial | `src/content/continuousReceivedStoreDelegation.ts` | `validateContinuousReceivedStoreDelegation.ts` |
| Adapter puro | `src/state/continuousReceivedStoreAdapter.ts` | `continuousReceivedStoreAdapter.test.ts` |
| Inserção explícita | `keepContinuousReceivedPackageFromStore` | kept/equivalent/disambiguated/stale/invalid |
| storedId real | resultado do adapter e store | ID existente e ID `--2` |
| Sem precheck por impressão | `useContinuousReceivedStore.ts` | colisão com avisos diferentes |
| Arquivamento explícito | `archiveContinuousReceivedRecordFromStore` | updated/unchanged/ambiguous |
| Reativação explícita | `reactivateContinuousReceivedRecordFromStore` | fluxo arquivado → ativo |
| Remoção explícita | `removeContinuousReceivedRecordFromStore` | updated/missing/invalid |
| Prévia por equivalência | `ContinuousReceivePage.tsx` | equivalente versus colisão |
| Escrita somente em mudança | `result.changed` antes de `set` | mesma instância em recusas |
| Bootstrap editorial | `scripts/validate-content.ts`, `src/main.tsx` | CI e build |
| Contrato e limites | documentação de arquitetura e produto | revisão documental |

**Tehkné Solutions**
