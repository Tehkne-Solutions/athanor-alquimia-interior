# Rastreabilidade — Fase 8.37

| Requisito | Implementação | Cobertura |
|---|---|---|
| Política editorial | `src/content/continuousReceivedPersistedText.ts` | validação editorial |
| Bytes e caracteres | `inspectContinuousReceivedPersistedText` | limite bruto |
| Chaves únicas | `inspectContinuousJsonUniqueKeys` | duplicatas e escapes equivalentes |
| Números exatos | `inspectContinuousJsonNumbers` | faixa, precisão, overflow e `-0` |
| Parse posterior | `continuousReceivedPersistedText.ts` | JSON malformado |
| Forma e orçamento | validadores inerte e estrutural | estruturas e textos |
| Hidratação inicial | `continuousReceivedHydrationOnlyStorage.getItem` | integração com runtime |
| Releitura explícita | `decodePersistEnvelope` | conflito preservado |
| Diagnóstico transitório | `rejectPersistedText` | status `rejected` |
| Bootstrap | `main.tsx`, `validate-content.ts` | build e CI |

**Tehkné Solutions**
