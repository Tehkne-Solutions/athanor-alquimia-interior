# QA — Fase 8.36

## Política editorial

- [ ] referência de Provérbios 18:13 validada;
- [ ] política `explicit-reread-after-conflict-without-merge-or-replay-v1` carregada;
- [ ] releitura limitada ao estado `conflict`;
- [ ] persist version 0 declarada;
- [ ] ausência de merge, replay, fila e escrita documentada.

## Portão

- [ ] `writing` bloqueia a releitura;
- [ ] estado diferente de `conflict` não inicia leitura;
- [ ] bloqueio não chama a IndexedDB;
- [ ] bloqueio não muda hidratação ou referência esperada.

## Envelope

- [ ] JSON persistido válido é interpretado;
- [ ] JSON malformado é recusado;
- [ ] envelope não objeto é recusado;
- [ ] campos extras são recusados;
- [ ] `version` diferente de 0 é recusada;
- [ ] `state` segue para a hidratação completa.

## Adoção

- [ ] memória aceita substitui o snapshot em runtime;
- [ ] snapshot adotado é defensivo;
- [ ] valor bruto atual substitui a referência esperada;
- [ ] conflito é limpo somente depois da adoção;
- [ ] ausência física adota biblioteca vazia nova;
- [ ] ausência física define referência `null`;
- [ ] seleção local obsoleta é limpa pela interface;
- [ ] prévia de arquivo não é reaplicada.

## Recusa

- [ ] memória recusada não chama `apply`;
- [ ] memória recusada não altera a referência esperada;
- [ ] conflito permanece ativo;
- [ ] falha de leitura preserva snapshot e conflito;
- [ ] nenhum byte é removido, corrigido ou migrado.

## Interface

- [ ] card de conflito oferece `Examinar memória atual`;
- [ ] botão fica desabilitado durante releitura;
- [ ] estado mostra `Relendo a memória atual`;
- [ ] sucesso só aparece em `accepted` ou `empty`;
- [ ] rejeição e indisponibilidade aparecem como erro;
- [ ] mutações permanecem bloqueadas enquanto houver conflito.

## Persistência e privacidade

- [ ] nenhuma escrita durante a releitura;
- [ ] chave IndexedDB preservada;
- [ ] schemaVersion 1 preservada;
- [ ] persist version 0 preservada;
- [ ] nenhuma nova store persistida;
- [ ] nenhum histórico, analytics ou telemetria;
- [ ] assinatura exclusiva da Tehkné Solutions.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
