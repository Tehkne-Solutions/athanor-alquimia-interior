# Release — Fase 8.31

## A Fachada que Não Decide Antes do Domínio em Silêncio

- remove deduplicação antecipada por impressão na store;
- adiciona adapter puro entre Zustand e domínio;
- propaga `storedId` real para a interface;
- preserva `kept`, `equivalent`, `disambiguated`, `stale` e `invalid`;
- preserva `updated`, `unchanged`, `missing`, `ambiguous`, `stale` e `invalid`;
- diferencia equivalência canônica de colisão de impressão na prévia;
- grava a store somente quando o domínio cria nova biblioteca;
- não anuncia sucesso em operações recusadas;
- mantém chave, schema e partialização da IndexedDB;
- não cria telemetria, analytics ou histórico adicional.

## Validação

```bash
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
