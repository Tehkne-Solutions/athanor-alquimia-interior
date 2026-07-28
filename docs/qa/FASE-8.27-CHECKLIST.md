# QA — Fase 8.27

## Catálogo editorial

- [ ] referência de Eclesiastes 3:11 validada;
- [ ] política `canonical-local-time-never-regresses-v1` carregada;
- [ ] formato UTC canônico documentado;
- [ ] instantes iguais permitidos;
- [ ] relógio externo não comparado;
- [ ] correção automática proibida.

## Criação

- [ ] instante canônico cria biblioteca;
- [ ] `createdAt === updatedAt` na criação;
- [ ] formato não canônico produz recusa explícita;
- [ ] data impossível é recusada.

## Inserção

- [ ] inserção no mesmo instante da criação aceita;
- [ ] inserção posterior aceita;
- [ ] instante não canônico retorna `invalid`;
- [ ] instante anterior retorna `stale`;
- [ ] registro original permanece intacto na recusa;
- [ ] pacote com `generatedAt` posterior ao recebimento local não é julgado.

## Invariantes

- [ ] `registry.updatedAt >= registry.createdAt`;
- [ ] `record.receivedAt >= registry.createdAt`;
- [ ] `record.updatedAt >= record.receivedAt`;
- [ ] `registry.updatedAt >= record.updatedAt`;
- [ ] cópia ativa não mantém `archivedAt`;
- [ ] cópia arquivada exige `archivedAt`;
- [ ] `archivedAt === record.updatedAt` em cópia arquivada.

## Mutações

- [ ] arquivamento posterior aceito;
- [ ] arquivamento anterior retorna `stale`;
- [ ] reativação posterior aceita;
- [ ] reativação remove `archivedAt`;
- [ ] remoção anterior retorna `stale`;
- [ ] remoção no mesmo instante aceita;
- [ ] wrapper histórico mantém registro original em recusa.

## Legado e privacidade

- [ ] biblioteca legada incoerente retorna `invalid`;
- [ ] nenhuma migração automática;
- [ ] nenhum horário promovido para o maior valor;
- [ ] nenhum registro alterado na recusa;
- [ ] nenhuma store ou chave IndexedDB adicional;
- [ ] nenhum histórico de recusa;
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
