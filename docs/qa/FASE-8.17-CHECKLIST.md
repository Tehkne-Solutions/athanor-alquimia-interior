# QA — Fase 8.17

**Produto:** Athanor — Alquimia Interior  
**Assinatura:** Tehkné Solutions

## Editorial

- Provérbios 16:11 registrado;
- política `exact-decimal-measure-before-json-parse-v1`;
- `Number.MAX_SAFE_INTEGER` explícito;
- arredondamento e reparo automático negados;
- quinze restrições editoriais presentes.

## Unidade

- notações equivalentes normalizadas;
- zero e números usuais aceitos;
- maior inteiro seguro aceito;
- inteiros acima da faixa recusados;
- inteiros exponenciais acima da faixa recusados;
- decimal arredondado recusado;
- overflow recusado;
- underflow recusado;
- menor subnormal preservado aceito;
- subnormal alterado recusado;
- `-0` recusado;
- números dentro de strings ignorados;
- caminho do valor recusado informado;
- lexema acima de 128 caracteres recusado;
- fusíveis de profundidade e tokens aplicados;
- sintaxe malformada preservada como erro JSON.

## Integração

- `itemCount` inseguro é recusado antes do schema;
- decimal desconhecido arredondado é recusado antes da sanitização;
- overflow é recusado antes de checksum e versão;
- underflow é recusado antes da sanitização;
- `-0` é recusado antes do parser de domínio;
- strings numéricas não são interpretadas;
- partilha válida continua aceita;
- resposta válida continua aceita;
- partilha gerada passa pela inspeção;
- resposta gerada passa pela inspeção.

## Interface

- protocolo de recepção informa preservação numérica;
- protocolo de retorno informa preservação numérica;
- ordem das barreiras inclui números antes do parse;
- erro não oferece arredondamento ou correção automática.

## Persistência

A fase não cria:

- store Zustand;
- chave IndexedDB;
- cache numérico;
- histórico de recusas;
- analytics;
- serviço de conversão.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```
