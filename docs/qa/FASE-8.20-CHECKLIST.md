# QA — Fase 8.20

**Produto:** Athanor — Alquimia Interior  
**Assinatura:** Tehkné Solutions

## Editorial

- Eclesiastes 3:1 registrado;
- política `reject-noncanonical-temporal-instants-before-domain-v1`;
- UTC obrigatório;
- três dígitos de milissegundos;
- offsets recusados;
- normalização automática negada;
- limite do relógio de origem declarado.

## Domínio

- instante canônico aceito;
- ano bissexto aceito;
- data impossível recusada;
- mês ou dia inválido recusado;
- horário sem fuso recusado;
- offset UTC e local recusados;
- precisão ausente, curta ou longa recusada;
- segundo intercalar recusado;
- `z` minúsculo recusado;
- separador em espaço recusado;
- campos opcionais ausentes aceitos;
- conclusão anterior à ocorrência recusada;
- entrada não modificada.

## Integração

- partilha oficial gerada com tempo canônico;
- resposta oficial gerada com tempo canônico;
- geração recusa offset e data impossível;
- recepção aceita datas canônicas;
- recepção recusa datas não canônicas com selo válido;
- retorno recusa data não canônica com selo válido;
- checksum mantém precedência;
- contrato estrito mantém precedência;
- margem textual mantém precedência;
- aviso temporal aparece na prévia.

## Persistência

A fase não cria store, IndexedDB, histórico, log, telemetria ou correção automática.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```
