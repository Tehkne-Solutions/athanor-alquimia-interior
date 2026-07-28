# Rastreabilidade — Fase 8.27

| Requisito | Implementação | Cobertura |
|---|---|---|
| Política editorial | `src/content/continuousReceivedChronology.ts` | `validateContinuousReceivedChronology.ts` |
| Formato UTC canônico | `isCanonicalContinuousUtcInstant` | criação e ações locais |
| Inspeção da biblioteca | `validateContinuousReceivedRegistryChronology` | invariantes e legado |
| Inserção monotônica | `keepReceivedCollectionWithIdentity` | valid/invalid/stale |
| Arquivamento monotônico | `archiveReceivedCollectionWithIdentity` | posterior e regressivo |
| Reativação monotônica | `reactivateReceivedCollectionWithIdentity` | remoção de archivedAt |
| Remoção monotônica | `removeReceivedCollectionWithIdentity` | igualdade e regressão |
| Wrappers compatíveis | APIs sem `WithIdentity` | registro original em recusa |
| Relógio externo separado | ausência de comparação com `package.generatedAt` | teste com pacote futuro |
| Bootstrap editorial | `scripts/validate-content.ts`, `src/main.tsx` | CI e build |
| Contrato e limites | documentação de arquitetura e produto | revisão documental |

**Tehkné Solutions**
