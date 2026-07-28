# QA — Fase 8.28

## Catálogo editorial

- [ ] referência de Provérbios 22:28 validada;
- [ ] política `detached-defensive-received-snapshots-v1` carregada;
- [ ] clonagem de entrada obrigatória;
- [ ] selo de consistência incluído;
- [ ] consultas defensivas obrigatórias;
- [ ] preservação da instância em recusas;
- [ ] congelamento e round-trip JSON proibidos.

## Pacote

- [ ] proveniência clonada;
- [ ] coleção clonada;
- [ ] opções clonadas;
- [ ] lista de itens clonada;
- [ ] cada item clonado;
- [ ] resumo de passagens clonado;
- [ ] avisos clonados;
- [ ] selo opcional clonado;
- [ ] impressão preservada;
- [ ] checksum preservado.

## Inserção

- [ ] entrada não altera registro guardado depois da operação;
- [ ] `record` devolvido não é a ocorrência interna;
- [ ] resultado equivalente também é defensivo;
- [ ] registros anteriores são clonados em uma nova versão;
- [ ] desambiguação mantém snapshots independentes.

## Consultas

- [ ] consulta singular devolve snapshot;
- [ ] consulta plural por ID devolve snapshots;
- [ ] consulta singular por impressão devolve snapshot;
- [ ] consulta plural por impressão devolve snapshots;
- [ ] consulta equivalente devolve snapshot;
- [ ] alteração no resultado não modifica a biblioteca.

## Mutações

- [ ] arquivamento cria nova versão desvinculada;
- [ ] reativação cria nova versão desvinculada;
- [ ] remoção clona todas as cópias restantes;
- [ ] versão anterior não altera versão nova;
- [ ] pacote do alvo permanece desvinculado;
- [ ] pacotes vizinhos permanecem desvinculados.

## Recusas

- [ ] `invalid` devolve a mesma biblioteca;
- [ ] `stale` devolve a mesma biblioteca;
- [ ] `missing` devolve a mesma biblioteca;
- [ ] `ambiguous` devolve a mesma biblioteca;
- [ ] `unchanged` devolve a mesma biblioteca.

## Privacidade

- [ ] nenhuma nova store ou chave IndexedDB;
- [ ] nenhum histórico de mutações;
- [ ] nenhuma telemetria ou analytics;
- [ ] nenhuma sincronização;
- [ ] assinatura exclusiva da Tehkné Solutions.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
