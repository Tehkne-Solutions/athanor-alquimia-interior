# Fase 8.32 — A Memória Persistida que Não Entra no Presente em Silêncio

## Estado

Implementação funcional da validação defensiva da biblioteca recebida durante a hidratação da IndexedDB.

## Problema

As ações da store já delegavam decisões ao domínio, mas o middleware `persist` ainda usava o `merge` padrão do Zustand. Dessa forma, o estado guardado poderia entrar diretamente no runtime antes de qualquer nova ação.

Uma memória alterada poderia conter:

- `schemaVersion` desconhecida;
- campos extras descartáveis;
- getters ou protótipos especiais em chamadas diretas;
- pacotes que já não passam pelas barreiras atuais;
- impressão persistida divergente;
- cronologia regressiva;
- identidade ou catálogo incompatíveis.

## Solução

A store agora usa `hydrateContinuousReceivedPersistedState` dentro de um `merge` explícito.

A entrada passa por:

1. conferência de JSON inerte;
2. envelope recursivo estrito;
3. exigência de `schemaVersion: 1`;
4. parser completo de cada pacote recebido;
5. portão local da biblioteca;
6. clonagem defensiva antes da adoção.

## Estados transitórios

```text
empty
→ nenhuma memória encontrada

accepted
→ memória válida adotada como snapshot

rejected
→ memória recusada; biblioteca inicial preservada
```

Esses estados, a mensagem e os diagnósticos não são persistidos.

## Recusa sem apagamento

A recusa não remove nem substitui os bytes existentes na IndexedDB. O Athanor inicia uma biblioteca nova somente no runtime e informa o motivo na página de recepção.

Isso evita duas decisões silenciosas:

- adotar um estado incompatível;
- destruir automaticamente uma memória que pode exigir tratamento explícito.

## Envelope estrito

A hidratação não usa a coerção do Zod para limpar dados. Todos os objetos conhecidos são `.strict()` e campos adicionais interrompem a adoção.

## Pacotes revalidados

Cada `record.package` passa novamente por `parseContinuousCollectionShareWithConsistency`, incluindo:

- forma e orçamento;
- checksum e versão;
- contrato de campos;
- margens e tempo;
- relações e compatibilidade;
- referências e avisos canônicos;
- schema, política e conteúdo curado.

## Invariantes locais revalidados

Depois dos pacotes, a biblioteca precisa manter:

- cronologia UTC monotônica;
- impressão correspondente ao pacote;
- identidade oficial;
- catálogo atual único;
- estados e datas de arquivamento coerentes.

## Privacidade

A fase não cria conta, sincronização, upload, telemetria, analytics, histórico de falhas ou nova chave IndexedDB.

## Limites

Uma hidratação aceita não comprova identidade, autoria, origem, pertencimento, entrega ou autenticidade. Ela confirma somente compatibilidade com o contrato local atual.

## Assinatura

**Tehkné Solutions**
