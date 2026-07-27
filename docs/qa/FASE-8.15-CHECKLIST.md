# QA — Fase 8.15

**Produto:** Athanor — Alquimia Interior  
**Assinatura:** Tehkné Solutions

## Validação editorial

- Provérbios 12:17 registrado como referência de abertura;
- catálogo `continuous-text-visibility-catalog` na versão 1.0.0;
- política `nfc-visible-text-no-directional-controls-v1`;
- modo `reject-without-rewrite`;
- normalização NFC obrigatória;
- dezesseis restrições editoriais presentes;
- limite sobre confusáveis visuais explicitamente declarado.

## Domínio

- português NFC aceito;
- tabulação, LF e CR aceitos;
- texto decomposed não NFC recusado;
- nome de campo não NFC recusado;
- controles C0 não permitidos recusados;
- DEL e C1 recusados;
- marcas, sobrescritas e isoladores bidirecionais recusados;
- zero width space, ZWNJ e ZWJ recusados;
- soft hyphen e BOM recusados;
- anotações interlineares e tags recusadas;
- `U+FFFD` recusado;
- não caracteres recusados;
- substituto alto sem par recusado;
- substituto baixo sem par recusado;
- getter recusado sem execução;
- chave simbólica recusada;
- referência repetida ou circular interrompida;
- fusível de nós respeitado;
- variation selector permitido.

## Integração — leitura local

- arquivo grande permanece recusado antes da leitura;
- JSON malformado permanece recusado antes das barreiras estruturais;
- forma inerte permanece anterior ao orçamento;
- orçamento estrutural permanece anterior ao texto Unicode;
- controle invisível é recusado antes do checksum;
- erro informa `Texto recusado`;
- arquivo externo não é alterado.

## Integração — partilha

- partilha NFC selada é aceita;
- aviso de texto visível é exibido;
- texto não NFC é recusado antes de checksum e versão;
- controle bidirecional é recusado mesmo com checksum válido;
- nome de campo invisível é recusado antes do parser;
- partilha gerada passa pela validação Unicode;
- rótulo não NFC impede geração sem normalização;
- checksum final permanece válido.

## Integração — resposta

- resposta NFC selada é aceita;
- `U+FFFD` impede prévia transitória;
- controle direcional na coleção referenciada impede geração;
- resposta gerada passa pela validação Unicode;
- gesto curado e consentimentos permanecem inalterados;
- silêncio continua sem arquivo.

## Interface

- recepção mostra `Unicode NFC v1.0.0`;
- retorno mostra `Unicode NFC v1.0.0`;
- ordem das barreiras inclui texto visível antes do selo;
- mensagens não prometem moderação, identidade ou autenticidade;
- prévias continuam exibindo somente conteúdo sanitizado.

## Persistência

A Fase 8.15 não cria:

- store Zustand;
- chave IndexedDB;
- log;
- contador;
- telemetria;
- analytics;
- histórico de recusas;
- serviço de normalização.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```
