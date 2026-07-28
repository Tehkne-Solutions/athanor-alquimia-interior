# QA — Fase 8.26

## Catálogo editorial

- [ ] referência de Provérbios 20:10 validada;
- [ ] política `unique-local-record-id-no-bulk-mutation-v1` carregada;
- [ ] separador `--` documentado;
- [ ] primeiro sufixo igual a 2;
- [ ] limite de alocação documentado;
- [ ] identificador declarado local e não autenticador.

## Inserção

- [ ] ID livre preservado exatamente;
- [ ] ID ocupado recebe `--2`;
- [ ] próximo conflito recebe `--3`;
- [ ] lacuna usa o primeiro sufixo livre;
- [ ] cópia equivalente é detectada antes da alocação;
- [ ] pacote distinto não é descartado;
- [ ] resultado `disambiguated` informa ID solicitado e armazenado;
- [ ] wrapper compatível preserva ambas as cópias;
- [ ] pacote recebido não é alterado;
- [ ] checksum e impressão permanecem intactos.

## Busca

- [ ] `findReceivedAllById` retorna todas as ocorrências;
- [ ] `findReceivedCollection` retorna uma ocorrência única;
- [ ] busca singular retorna `undefined` em ambiguidade;
- [ ] ausência e ambiguidade são diferenciadas.

## Ações

- [ ] arquivamento atualiza somente uma ocorrência única;
- [ ] reativação atualiza somente uma ocorrência única;
- [ ] remoção elimina somente uma ocorrência única;
- [ ] estado já solicitado retorna `unchanged`;
- [ ] ID ausente retorna `missing`;
- [ ] dados mínimos ausentes retornam `invalid`;
- [ ] ID legado duplicado retorna `ambiguous`;
- [ ] ação ambígua não altera `updatedAt`;
- [ ] wrapper legado também não executa ação em massa.

## Compatibilidade e privacidade

- [ ] registros legados duplicados não são migrados;
- [ ] registros legados duplicados não são renomeados;
- [ ] nenhum registro é sobrescrito;
- [ ] nenhuma nova store ou chave IndexedDB;
- [ ] nenhum histórico de conflitos;
- [ ] nenhuma telemetria ou analytics;
- [ ] assinatura exclusiva da Tehkné Solutions.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
