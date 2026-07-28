# Release — Fase 8.26

## O Identificador que Não Alcança Duas Cópias em Silêncio

- IDs locais passam a ser únicos na inserção;
- cópia equivalente é detectada antes da alocação;
- conteúdo distinto com ID ocupado recebe sufixo determinístico;
- resultado explícito informa `requestedId`, `storedId` e estado;
- busca singular deixa de escolher a primeira ocorrência ambígua;
- arquivamento, reativação e remoção exigem uma ocorrência única;
- bibliotecas legadas ambíguas permanecem intactas;
- wrappers existentes continuam compatíveis e seguros;
- nenhum pacote, checksum ou impressão é reescrito;
- nenhuma store, migração, telemetria ou analytics adicional.

## Validação

```bash
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
