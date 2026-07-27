# Rastreabilidade — Fase 8.16

| Requisito | Implementação | Validação |
|---|---|---|
| catálogo editorial | `src/content/continuousUniqueKeys.ts` | `validateContinuousUniqueKeys.ts` |
| scanner lexical | `src/domain/continuousUniqueKeys.ts` | `continuousUniqueKeys.test.ts` |
| comparação após escapes | `parseString` + `Map` por objeto | testes de Unicode, barra e emoji |
| diagnóstico ASCII seguro | `safeKeyLabel` | teste com U+202E |
| barreira antes do parse | `readContinuousJsonFile` | testes de integração |
| precedência sobre checksum | fluxo de leitura | duplicata de checksum |
| precedência sobre versão | fluxo de leitura | duplicata de catalogVersion |
| geração com chaves únicas | exportadores existentes | testes de serialização |
| interface | páginas de recepção e retorno | revisão de QA |
| sem persistência própria | arquitetura da fase | revisão de stores e IndexedDB |

**Tehkné Solutions**
