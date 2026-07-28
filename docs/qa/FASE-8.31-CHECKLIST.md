# QA — Fase 8.31

## Catálogo editorial

- [ ] referência de Provérbios 18:17 validada;
- [ ] política `store-delegates-received-decisions-to-domain-v1` carregada;
- [ ] precheck por impressão proibido;
- [ ] `storedId` obrigatório como ID final da UI;
- [ ] persistência adicional desativada.

## Inserção

- [ ] primeira cópia retorna `kept`;
- [ ] cópia equivalente retorna `equivalent`;
- [ ] equivalência abre o ID existente;
- [ ] mesma impressão com avisos diferentes retorna `disambiguated`;
- [ ] colisão preserva as duas cópias;
- [ ] ID local ocupado usa o ID escolhido pelo domínio;
- [ ] pacote incompatível retorna `invalid`;
- [ ] recebimento regressivo retorna `stale`;
- [ ] recusas preservam a mesma instância;
- [ ] store grava somente quando `changed` é verdadeiro.

## Prévia

- [ ] equivalência usa `findEquivalentReceivedCollection`;
- [ ] colisões usam busca plural por impressão;
- [ ] primeira ocorrência da impressão não é chamada de duplicata automaticamente;
- [ ] mensagem de colisão informa preservação das duas cópias.

## Mutações

- [ ] arquivamento usa API explícita;
- [ ] reativação usa API explícita;
- [ ] remoção usa API explícita;
- [ ] `updated` grava nova biblioteca;
- [ ] `unchanged` não grava novamente;
- [ ] `missing` não anuncia remoção;
- [ ] `ambiguous` não anuncia alteração;
- [ ] `stale` não anuncia alteração;
- [ ] `invalid` exibe a mensagem do domínio.

## Persistência e privacidade

- [ ] chave IndexedDB permanece igual;
- [ ] `schemaVersion` permanece 1;
- [ ] somente `schemaVersion` e `registry` são parcializados;
- [ ] mensagens não são persistidas;
- [ ] resultados transitórios não são persistidos;
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
