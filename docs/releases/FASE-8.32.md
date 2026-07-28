# Release — Fase 8.32

## A Memória Persistida que Não Entra no Presente em Silêncio

- hidratação da IndexedDB passa por `merge` explícito;
- envelope persistido exige `schemaVersion: 1`;
- objetos e campos aninhados são estritos;
- JSON não inerte é recusado;
- todos os pacotes são revalidados;
- cronologia, impressão, identidade e catálogo são conferidos novamente;
- memória válida entra como snapshot defensivo;
- memória inválida mantém biblioteca inicial no runtime;
- bytes recusados não são apagados ou migrados automaticamente;
- diagnóstico de recusa aparece na página e não é persistido;
- mesma chave IndexedDB e mesma partialização;
- nenhuma telemetria, analytics ou sincronização adicional.

## Validação

```bash
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
