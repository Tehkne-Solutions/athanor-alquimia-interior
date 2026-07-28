# Contrato de avisos canônicos v1

## Política

`require-canonical-unique-ordered-notices-v1`

## Objetivo

Impedir que o campo `notices` receba texto livre, perca limites obrigatórios, repita mensagens ou altere silenciosamente a ordem editorial durante geração, recepção ou retorno.

## Posição no pipeline

```text
catalog reference integrity
→ canonical notices
→ schema and policy
→ curated content
→ sanitization
```

## Regras

- cada aviso precisa pertencer ao catálogo local da versão;
- avisos obrigatórios precisam estar presentes;
- duplicatas são recusadas;
- a ordem relativa precisa coincidir com o catálogo;
- `Datas foram omitidas.` corresponde a `includeDates: false`;
- o aviso de coleção vazia corresponde a `collection.itemCount: 0`;
- o aviso de origem vazia corresponde a `source.itemCount: 0`;
- o aviso de silêncio é proibido em arquivo exportável;
- o aviso de registros não vinculados é opcional porque `linked` é removido pela minimização.

## Diagnóstico

Os erros indicam posição e natureza da divergência, sem aproximar ou substituir o texto recebido. No máximo 20 problemas são reportados por avaliação.

## Limites

Avisos canônicos confirmam somente correspondência editorial com o catálogo local. Não comprovam identidade, autoria, intenção, veracidade, entrega ou autenticidade criptográfica.

## Persistência

Nenhum store, chave IndexedDB, cache, histórico de recusas, analytics ou telemetria é criado.

**Tehkné Solutions**
