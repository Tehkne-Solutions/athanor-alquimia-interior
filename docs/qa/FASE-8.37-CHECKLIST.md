# QA — Fase 8.37

## Política editorial

- [ ] Provérbios 22:21 validado;
- [ ] política `inspect-persisted-json-text-before-parse-v1` carregada;
- [ ] ordem das barreiras validada;
- [ ] limites de bytes e caracteres correspondem ao catálogo de recursos;
- [ ] restrições proíbem escolha, correção e reserialização silenciosas.

## Scanner bruto

- [ ] envelope oficial aceito sem alteração;
- [ ] chave superior repetida recusada;
- [ ] chave aninhada repetida recusada;
- [ ] chave escapada equivalente recusada;
- [ ] inteiro inseguro recusado;
- [ ] decimal arredondado recusado;
- [ ] overflow recusado;
- [ ] underflow recusado;
- [ ] zero negativo recusado;
- [ ] JSON malformado recusado;
- [ ] Unicode invisível recusado;
- [ ] limite textual aplicado antes do parse.

## Hidratação inicial

- [ ] texto válido devolvido exatamente ao `createJSONStorage`;
- [ ] texto recusado devolve `null` ao parser;
- [ ] texto recusado permanece como referência do compare-and-set;
- [ ] runtime termina em `rejected`, não em `empty`;
- [ ] biblioteca inicial permanece ativa;
- [ ] nenhuma escrita automática é iniciada.

## Releitura explícita

- [ ] usa o mesmo scanner da hidratação inicial;
- [ ] chave repetida mantém snapshot e conflito;
- [ ] número divergente mantém snapshot e conflito;
- [ ] texto aceito segue para envelope e hidratação;
- [ ] nenhuma ação interrompida é repetida.

## Persistência e privacidade

- [ ] chave IndexedDB inalterada;
- [ ] schemaVersion inalterado;
- [ ] persist version inalterada;
- [ ] object store inalterada;
- [ ] nenhuma recusa persistida;
- [ ] nenhuma cópia corrigida criada;
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
