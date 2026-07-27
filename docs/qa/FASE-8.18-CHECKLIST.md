# QA — Fase 8.18

**Produto:** Athanor — Alquimia Interior  
**Assinatura:** Tehkné Solutions

## Editorial

- Provérbios 25:11 registrado;
- política `reject-unknown-fields-before-sanitization-v1`;
- descarte silencioso explicitamente negado;
- arquivo original preservado;
- doze restrições presentes.

## Domínio

- partilha oficial aceita;
- resposta oficial aceita;
- campo superior desconhecido recusado;
- campo aninhado desconhecido recusado;
- campo em lista recusado;
- campo no resumo recusado;
- campo no selo recusado;
- campos opcionais ausentes aceitos;
- ordem dos campos indiferente;
- propriedade simbólica recusada;
- getter não executado;
- nome herdado como `toString` recusado;
- tipo incorreto deixado para o parser;
- diagnóstico limitado a 20 caminhos.

## Integração

- checksum inválido interrompe antes do contrato;
- versão incompatível interrompe antes do contrato;
- campo extra com checksum válido é recusado pelo contrato;
- schema inválido sem sobra é tratado pelo parser depois do contrato;
- arquivos gerados pelo Athanor continuam aceitos;
- mensagem de sucesso entra nos avisos da prévia.

## Persistência

Não criar:

- store;
- IndexedDB;
- cache de manifesto;
- histórico;
- analytics;
- telemetria;
- migração automática.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```
