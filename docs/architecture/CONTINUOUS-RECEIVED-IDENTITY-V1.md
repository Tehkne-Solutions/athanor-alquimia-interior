# Contrato de identidade local recebida v1

## Política

`unique-local-record-id-no-bulk-mutation-v1`

## Objetivo

Garantir que um identificador usado pela biblioteca recebida selecione no máximo uma cópia local. O identificador não pertence ao arquivo compartilhado e não comprova origem, autoria ou identidade.

## Inserção

O valor solicitado é tratado como candidato local.

```text
cópia equivalente já existente
→ não duplicar; retornar o ID existente

ID candidato livre
→ preservar o ID solicitado

ID candidato ocupado por conteúdo diferente
→ usar primeiro sufixo disponível: --2, --3, ...
```

A desambiguação é retornada explicitamente por `keepReceivedCollectionWithIdentity` com os campos `requestedId`, `storedId` e `status`.

O wrapper `keepReceivedCollection` permanece compatível e utiliza a mesma alocação segura.

## Ações locais

Arquivar, reativar e remover exigem exatamente uma ocorrência do ID.

```text
zero ocorrências
→ missing

uma ocorrência
→ updated ou unchanged

mais de uma ocorrência
→ ambiguous; nenhuma cópia é alterada
```

As variantes explícitas terminam em `WithIdentity`. Os wrappers históricos retornam somente o registro resultante, mas preservam a mesma regra de segurança.

## Compatibilidade legada

Registros antigos com IDs duplicados não são migrados, renomeados nem removidos automaticamente. Eles permanecem intactos e ações por ID ambíguo são interrompidas.

## Limites

- o ID é local e não atravessa o pacote compartilhado;
- o sufixo não altera conteúdo, checksum ou impressão;
- não existe autenticação de identidade;
- nenhum histórico de conflitos é persistido;
- nenhuma telemetria ou analytics é criada.

**Tehkné Solutions**
