# QA — Fase 8.13

**Produto:** Athanor — Alquimia Interior  
**Assinatura:** Tehkné Solutions

## Validação editorial

- Provérbios 25:16 registrado;
- política `bounded-local-reading-no-content-judgment-v1`;
- limites positivos e inteiros;
- julgamento de valor explicitamente negado;
- truncamento silencioso proibido;
- recusa persistente proibida;
- doze restrições presentes.

## Envelope de arquivo

- arquivo dentro do limite aceito;
- arquivo acima de 524.288 bytes recusado antes de `text()`;
- tamanho inválido recusado;
- texto vazio recusado;
- texto acima de 524.288 caracteres recusado;
- JSON malformado recusado sem prévia.

## Estrutura

- estrutura pequena aceita;
- profundidade acima de 16 recusada;
- mais de 10.000 nós recusados;
- lista acima de 1.000 itens recusada;
- objeto acima de 64 campos recusado;
- texto individual acima de 8.192 caracteres recusado;
- soma de textos acima de 262.144 caracteres recusada;
- referência circular recusada em chamada direta;
- estatísticas descritivas retornadas em sucesso.

## Ordem de barreiras

```text
envelope
→ estrutura
→ checksum
→ versão
→ parser
→ sanitização
```

- estrutura excessiva e versão futura retorna erro de limite;
- estrutura excessiva e selo ausente retorna erro de limite;
- estrutura válida e selo inválido retorna erro de consistência;
- estrutura válida e versão incompatível retorna erro de versão.

## Geração

- partilha pequena gera arquivo selado;
- partilha acima de 1.000 itens não gera arquivo;
- resposta pequena gera arquivo selado;
- rótulo excessivo impede geração de resposta;
- coleção de origem não é alterada quando a exportação falha;
- nenhum payload parcial é retornado.

## Interface

- limite de 512 KiB exibido na recepção;
- limite de 512 KiB exibido no retorno;
- seletor usa `readContinuousJsonFile`;
- erros impedem prévia e consentimentos;
- recusa não cria mensagem de culpa;
- prévia válida mostra estatísticas como aviso.

## Persistência

A fase não cria:

- store;
- IndexedDB;
- log;
- analytics;
- contador;
- cache;
- histórico de recusas.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```
