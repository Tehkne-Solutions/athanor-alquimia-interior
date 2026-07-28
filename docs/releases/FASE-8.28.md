# Release — Fase 8.28

## A Cópia que Não Continua Presa ao Original em Silêncio

- pacote recebido clonado integralmente;
- selo opcional de consistência desvinculado;
- resultado de inserção separado do registro interno;
- resultados de consultas públicas transformados em snapshots;
- cópia equivalente devolvida sem expor referência interna;
- inserções bem-sucedidas clonam registros anteriores;
- arquivamento e reativação clonam alvo e vizinhos;
- remoção clona todas as cópias restantes;
- recusas e operações sem mudança preservam exatamente a biblioteca original;
- impressão, checksum, conteúdo, cronologia e equivalência permanecem inalterados;
- nenhuma store, serialização corretiva, telemetria ou sincronização adicional.

## Validação

```bash
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
