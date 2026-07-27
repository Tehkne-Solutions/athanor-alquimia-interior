# QA — Fase 8.19

**Produto:** Athanor — Alquimia Interior  
**Assinatura:** Tehkné Solutions

## Editorial

- Provérbios 22:28 registrado;
- catálogo `continuous-exact-text-catalog` na versão 1.0.0;
- política `reject-boundary-whitespace-before-sanitization-v1`;
- quatorze restrições editoriais;
- limites de garantia explícitos.

## Domínio

- texto limpo aceito;
- margem inicial recusada;
- margem final recusada;
- ambas recusadas;
- tabulação externa recusada;
- quebra externa recusada;
- NBSP externo recusado;
- espaços internos preservados;
- quebras internas preservadas;
- texto vazio delegado ao domínio;
- caminhos aninhados informados;
- listas inspecionadas;
- máximo de vinte diagnósticos;
- getters não executados;
- ciclos não travam;
- entrada não modificada.

## Partilha

- arquivo oficial gerado normalmente;
- rótulo com margem impede geração;
- versão com margem impede geração;
- arquivo selado com margem é recusado;
- checksum inválido permanece anterior;
- contrato estrito permanece anterior;
- espaços internos continuam válidos;
- parser interno preserva texto sem `trim()`.

## Resposta e retorno

- resposta oficial gerada normalmente;
- impressão com margem impede geração;
- data com margem é recusada na entrada;
- parser interno preserva data, impressão, rótulo e avisos;
- prévia válida inclui confirmação de margens exatas.

## Interface

- protocolo de recepção mostra versão da barreira;
- protocolo de retorno mostra versão da barreira;
- ordem visual inclui margens depois do contrato estrito;
- erros não reproduzem o conteúdo textual.

## Persistência

Nenhum store, IndexedDB, cache, histórico, analytics ou telemetria é adicionado.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```
