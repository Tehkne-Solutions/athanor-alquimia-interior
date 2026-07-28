# QA — Fase 8.22

**Produto:** Athanor — Alquimia Interior  
**Assinatura:** Tehkné Solutions

## Editorial

- 1 Coríntios 12:4–6 registrado como referência de abertura;
- política `reject-discriminant-field-conflicts-before-domain-v1`;
- limites de garantia explicitados;
- tema desconhecido preservado;
- nenhuma inferência espiritual ou pessoal.

## Tema

- `themeId` com `noTheme: false` aceito;
- `themeId` com `noTheme: true` recusado;
- ausência de `themeId` com `noTheme: true` aceita;
- ausência de `themeId` com `noTheme: false` aceita como desconhecido;
- nenhum tema criado automaticamente.

## Pacote

- `packageId` e `packageLabel` juntos aceitos em ciclo;
- somente `packageId` recusado;
- somente `packageLabel` recusado;
- pacote em Rastro recusado;
- ausência dos dois campos aceita;
- rótulo não derivado do identificador.

## Tipo e estado

- profundidade em Rastro recusada;
- `declined` em Rastro recusado;
- `declined` em ciclo aceito;
- `endedEarly` em Rastro recusado;
- `endedEarly` em ciclo incompleto aceito;
- `endedEarly` em ciclo concluído recusado;
- concluído com pendências recusado;
- concluído sem pendências aceito.

## Integração

- partilha selada compatível aceita;
- conflito selado corretamente recusado pela compatibilidade;
- checksum inválido tem precedência;
- relações gerais têm precedência;
- parser de domínio executa depois;
- geração local incompatível é impedida;
- geração local compatível permanece válida;
- resposta continua exportável e legível.

## Diagnósticos

- máximo de 20 mensagens;
- caminhos por índice;
- conteúdo textual não reproduzido;
- nenhum reparo automático;
- nenhum campo alterado.

## Persistência

A fase não cria:

- store Zustand;
- IndexedDB;
- histórico de recusas;
- contador;
- cache;
- analytics;
- telemetria;
- rede.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```
