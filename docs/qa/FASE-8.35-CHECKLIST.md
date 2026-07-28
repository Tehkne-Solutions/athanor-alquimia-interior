# QA — Fase 8.35

## Catálogo editorial

- [ ] referência de Provérbios 27:12 validada;
- [ ] política `atomic-compare-before-indexeddb-replace-v1` carregada;
- [ ] comparação e escrita declaradas na mesma transação;
- [ ] merge e retry automáticos declarados como proibidos;
- [ ] assinatura exclusiva da Tehkné Solutions.

## Referência transitória

- [ ] valor bruto da hidratação é capturado exatamente;
- [ ] ausência da chave é preservada como `null`;
- [ ] referência não é persistida no envelope;
- [ ] início de escrita não altera a referência;
- [ ] falha técnica não altera a referência;
- [ ] conflito não altera a referência;
- [ ] sucesso substitui a referência pelo envelope confirmado;
- [ ] `clear` preserva a referência esperada.

## Compare-and-set

- [ ] leitura e escrita usam a mesma transação `readwrite`;
- [ ] texto idêntico permite escrita;
- [ ] texto diferente produz conflito;
- [ ] remoção externa produz conflito;
- [ ] valor não textual produz conflito;
- [ ] ordem textual diferente produz conflito;
- [ ] conflito não executa `put`;
- [ ] escrita válida mantém a chave oficial.

## Commit

- [ ] conflito não aplica o snapshot no Zustand;
- [ ] conflito chama ciclo transitório próprio;
- [ ] conflito não é reportado como falha de quota;
- [ ] conflito não chama confirmação;
- [ ] estado `conflict` bloqueia nova ação antes do domínio;
- [ ] ação concorrente durante `writing` continua bloqueada;
- [ ] falha comum continua permitindo nova tentativa explícita;
- [ ] resultado sem mudança não inicia compare-and-set.

## Interface

- [ ] card de conflito é exibido;
- [ ] mensagem informa que nenhuma versão foi escolhida;
- [ ] mensagem exige recarregar para nova hidratação;
- [ ] guardar, arquivar, reativar e remover ficam bloqueados;
- [ ] leitura de arquivo permanece possível;
- [ ] descarte de prévia permanece possível quando não há escrita ativa;
- [ ] nenhum sucesso é exibido para a ação recusada.

## Persistência e privacidade

- [ ] chave permanece `athanor-continuous-received-state`;
- [ ] schemaVersion permanece 1;
- [ ] persist version permanece 0;
- [ ] object store permanece `app-state`;
- [ ] nenhuma fila;
- [ ] nenhum BroadcastChannel;
- [ ] nenhum histórico de conflitos;
- [ ] nenhuma telemetria ou sincronização.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
