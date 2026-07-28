# Release — Fase 8.29

## A Impressão Guardada que Não Aponta para Outro Conteúdo em Silêncio

- impressão persistida precisa manter formato canônico;
- impressão é recalculada pelo mesmo escopo histórico;
- divergência bloqueia deduplicação e mutações;
- pacote não mensurável é recusado;
- impressão e pacote nunca são reparados automaticamente;
- biblioteca original é preservada em falha;
- colisões continuam dependendo de equivalência canônica completa;
- `generatedAt`, `notices` e `consistency` permanecem fora do escopo histórico;
- nenhuma store, migração, telemetria ou analytics adicional.

## Validação

```bash
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
