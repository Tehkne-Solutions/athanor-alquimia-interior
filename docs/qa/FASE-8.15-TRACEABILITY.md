# Rastreabilidade — Fase 8.15

| Requisito | Implementação | Validação |
|---|---|---|
| catálogo e limites editoriais | `src/content/continuousTextVisibility.ts` | `validateContinuousTextVisibility.ts` |
| normalização NFC | `src/domain/continuousTextVisibility.ts` | `continuousTextVisibility.test.ts` |
| controles invisíveis e bidi | `continuousTextVisibility.ts` | testes unitários e integração |
| pares substitutos e não caracteres | `continuousTextVisibility.ts` | testes unitários |
| nomes de campos inspecionados | `continuousTextVisibility.ts` | testes unitários e integração |
| leitura local protegida | `continuousResource.ts` | testes de integração |
| recepção protegida | `continuousReceiveConsistency.ts` | testes de integração |
| retorno protegido | `continuousReturnConsistency.ts` | testes de integração |
| geração de partilha protegida | `continuousShare.ts` | testes de integração |
| geração de resposta protegida | `continuousResponse.ts` | testes de integração |
| política visível na interface | páginas de recepção e retorno | QA visual e build |
| nenhuma persistência própria | arquitetura da fase | revisão de QA |

**Tehkné Solutions**
