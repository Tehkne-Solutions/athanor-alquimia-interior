# Release — Fase 8.30

## A Versão da Biblioteca que Não Guarda Outro Catálogo em Silêncio

- identidade fixa da biblioteca conferida;
- versão da biblioteca exige SemVer estrito e catálogo atual;
- todos os pacotes precisam usar a mesma versão da biblioteca;
- criação malformada ou incompatível é recusada;
- pacote de outro catálogo não entra na biblioteca atual;
- bibliotecas mistas bloqueiam deduplicação e mutações;
- impressão recalculada não mascara divergência de versão;
- nenhuma promoção, downgrade ou migração silenciosa;
- falhas preservam exatamente a biblioteca original;
- nenhuma persistência, analytics ou sincronização adicional.

## Validação

```bash
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
