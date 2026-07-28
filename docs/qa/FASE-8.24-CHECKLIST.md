# QA — Fase 8.24

## Catálogo editorial

- [ ] referência de Provérbios 30:6 validada;
- [ ] política `require-canonical-unique-ordered-notices-v1` carregada;
- [ ] onze avisos obrigatórios de partilha;
- [ ] doze avisos obrigatórios de resposta;
- [ ] ordens sem duplicatas;
- [ ] limite de 20 diagnósticos.

## Partilha

- [ ] pacote oficial aceito;
- [ ] aviso desconhecido recusado;
- [ ] aviso obrigatório ausente recusado;
- [ ] duplicata recusada;
- [ ] ordem divergente recusada;
- [ ] `includeDates: false` exige aviso de omissão;
- [ ] `includeDates: true` proíbe aviso de omissão;
- [ ] coleção vazia exige aviso correspondente;
- [ ] coleção com itens proíbe aviso de vazio;
- [ ] aviso opcional de registro não vinculado aceito;
- [ ] geração valida avisos antes do checksum.

## Resposta

- [ ] pacote oficial aceito;
- [ ] aviso desconhecido recusado;
- [ ] aviso obrigatório ausente recusado;
- [ ] duplicata recusada;
- [ ] ordem divergente recusada;
- [ ] origem vazia exige aviso correspondente;
- [ ] origem com itens proíbe aviso de vazio;
- [ ] aviso de silêncio recusado em arquivo exportável;
- [ ] geração valida avisos antes do checksum.

## Precedência

- [ ] alteração sem novo selo é recusada pelo checksum;
- [ ] versão incompatível permanece anterior;
- [ ] contrato estrito permanece anterior;
- [ ] tempo e relações permanecem anteriores;
- [ ] compatibilidade discriminada permanece anterior;
- [ ] referência catalogada permanece anterior;
- [ ] schema e conteúdo curado permanecem posteriores.

## Segurança e privacidade

- [ ] getters não são executados;
- [ ] texto desconhecido não é reproduzido integralmente em diagnósticos;
- [ ] arquivo original não é alterado;
- [ ] nenhuma cópia corrigida é criada;
- [ ] nenhum store ou IndexedDB adicional;
- [ ] nenhum histórico de recusas;
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
