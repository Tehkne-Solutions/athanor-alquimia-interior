# ADR-001 — Arquitetura local-first

## Decisão

O vertical slice funciona sem conta, com progresso persistido em IndexedDB.

## Consequências

- dados pessoais não dependem de um serviço remoto;
- migrations são obrigatórias desde a versão inicial;
- regras de domínio permanecem independentes da interface;
- sincronização futura será opcional e seletiva.

**Tehkné Solutions**
