# QA — Fase 8.11

**Produto:** Athanor — Alquimia Interior  
**Assinatura:** Tehkné Solutions

## Validação editorial

- Provérbios 14:15 registrado como referência de abertura;
- catálogo `continuous-consistency-catalog` na versão 1.0.0;
- algoritmo `fnv1a-32` declarado como não criptográfico;
- autenticação de identidade explicitamente negada;
- arquivos legados aceitos com aviso;
- selos inválidos recusados;
- doze restrições editoriais presentes.

## Domínio de consistência

- canonicalização estável para chaves em ordens diferentes;
- ordem de listas preservada;
- `consistency` excluído do próprio cálculo;
- propriedades `undefined` de objetos omitidas;
- `undefined` em listas tratado como `null`;
- checksum estável;
- selo válido reconhecido;
- conteúdo alterado recusado;
- algoritmo incompatível recusado;
- declaração falsa de autenticação recusada;
- valor não objeto recusado;
- ausência identificada como legado.

## Integração — partilha

- novas partilhas recebem selo válido;
- prévia informa limite de identidade e autoria;
- partilha selada válida é aceita;
- alteração de rótulo após selo é recusada;
- arquivo legado continua aceito;
- cópia sanitizada recebe novo selo;
- impressão de duplicidade permanece independente do selo.

## Integração — resposta

- novas respostas exportáveis recebem selo válido;
- silêncio continua sem arquivo;
- resposta selada válida é aceita na prévia transitória;
- alteração de declaração após selo é recusada;
- arquivo legado continua aceito com aviso;
- prévia sanitizada recebe selo local em memória;
- nenhuma persistência de verificação é criada.

## Interface

- recepção informa que selos presentes precisam corresponder ao conteúdo;
- retorno informa a mesma condição;
- avisos de selo válido não prometem identidade ou autoria;
- avisos de arquivo legado são explícitos;
- erro de selo impede prévia e consentimentos;
- inspeção JSON mostra o selo da cópia sanitizada.

## Persistência

A Fase 8.11 não cria:

- store Zustand;
- chave IndexedDB;
- histórico de verificações;
- log de recusas;
- contador;
- certificado;
- identidade local;
- comunicação de rede.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```
