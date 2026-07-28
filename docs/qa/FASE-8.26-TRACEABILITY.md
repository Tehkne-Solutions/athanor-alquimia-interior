# Rastreabilidade — Fase 8.26

| Requisito | Implementação | Cobertura |
|---|---|---|
| Política editorial | `src/content/continuousReceivedIdentity.ts` | `validateContinuousReceivedIdentity.ts` |
| ID local único | `allocateContinuousReceivedRecordId` | `continuousReceivedIdentity.test.ts` |
| Resultado explícito de inserção | `keepReceivedCollectionWithIdentity` | estados kept/equivalent/disambiguated/invalid |
| Wrapper compatível | `keepReceivedCollection` | preservação das duas cópias |
| Busca plural por ID | `findReceivedAllById` | duplicidade legada |
| Busca singular segura | `findReceivedCollection` | retorno indefinido em ambiguidade |
| Arquivamento singular | `archiveReceivedCollectionWithIdentity` | updated/unchanged/ambiguous |
| Reativação singular | `reactivateReceivedCollectionWithIdentity` | ocorrência única |
| Remoção singular | `removeReceivedCollectionWithIdentity` | preservação em ambiguidade |
| Bootstrap editorial | `scripts/validate-content.ts`, `src/main.tsx` | CI e build |
| Contrato e limites | documentação de arquitetura e produto | revisão documental |

**Tehkné Solutions**
