# Rastreabilidade — Fase 8.17

| Requisito | Implementação | Validação |
|---|---|---|
| normalização decimal | `continuousNumericLexeme.ts` | testes unitários |
| faixa inteira segura | `exceedsSafeInteger` | testes unitários e integração |
| arredondamento recusado | comparação de formas normalizadas | testes unitários |
| overflow e underflow | inspeção anterior ao parse | testes unitários e integração |
| `-0` recusado | `Object.is(parsed, -0)` | testes unitários e integração |
| integração ao leitor | `continuousResource.ts` | testes de integração |
| exportações compatíveis | geradores 8.7 e 8.9 | testes de integração |
| catálogo editorial | `continuousNumericLexeme.ts` | `validateContinuousNumericLexeme.ts` |
| sem persistência | arquitetura da fase | checklist de QA |

**Tehkné Solutions**
