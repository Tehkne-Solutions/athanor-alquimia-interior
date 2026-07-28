# QA — Fase 8.34

## Catálogo editorial

- [ ] referência de Lucas 14:28 validada;
- [ ] política `confirm-indexeddb-write-before-runtime-commit-v1` carregada;
- [ ] chave persistida oficial preservada;
- [ ] `schemaVersion: 1` preservado;
- [ ] versão do envelope Zustand igual a 0;
- [ ] ausência de fila e retry documentada.

## Ordem da escrita

- [ ] domínio calcula próximo snapshot antes da transação;
- [ ] IndexedDB recebe o snapshot completo;
- [ ] runtime não muda enquanto a promessa está pendente;
- [ ] runtime muda somente depois do sucesso;
- [ ] confirmação só aparece depois do commit;
- [ ] middleware não executa segunda escrita automática.

## Falha

- [ ] erro de `setItem` retorna `persistence-failed`;
- [ ] `changed` permanece falso;
- [ ] runtime anterior mantém a mesma referência;
- [ ] seleção não é removida;
- [ ] prévia não é descartada;
- [ ] detalhe do erro fica somente na store transitória;
- [ ] nenhuma escrita de rollback é iniciada;
- [ ] nova tentativa exige nova ação explícita.

## Concorrência

- [ ] primeira ação muda o estado para `writing`;
- [ ] segunda ação retorna `writing`;
- [ ] segunda ação não chama o domínio;
- [ ] segunda ação não cria ID nem horário;
- [ ] segunda ação não inicia `setItem`;
- [ ] segunda ação não é enfileirada;
- [ ] botões de mutação ficam desabilitados.

## Resultados sem mudança

- [ ] `equivalent` não escreve;
- [ ] `unchanged` não escreve;
- [ ] `missing` não escreve;
- [ ] `ambiguous` não escreve;
- [ ] `stale` não escreve;
- [ ] `invalid` não escreve;
- [ ] diagnóstico antigo de falha é limpo após nova decisão válida sem alteração.

## Operações

- [ ] guardar cópia aguarda confirmação;
- [ ] arquivar aguarda confirmação;
- [ ] reativar aguarda confirmação;
- [ ] remover aguarda confirmação;
- [ ] reset aguarda confirmação;
- [ ] ID selecionado usa somente resultado confirmado.

## Persistência e privacidade

- [ ] nenhuma nova chave IndexedDB;
- [ ] nenhuma nova object store;
- [ ] store transitória sem `persist`;
- [ ] nenhum histórico de falhas;
- [ ] nenhum analytics ou telemetria;
- [ ] assinatura exclusiva da Tehkné Solutions.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
