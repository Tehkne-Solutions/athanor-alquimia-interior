# Fase 8.26 — O Identificador que Não Alcança Duas Cópias em Silêncio

## Estado

Implementação funcional da identidade local única para a biblioteca de coleções recebidas.

## Problema

A Fase 8.25 separou impressão e equivalência, mas o campo local `record.id` ainda era aceito como fornecido pelo chamador.

Duas cópias diferentes poderiam ser guardadas com o mesmo ID. Nesse estado:

- `findReceivedCollection` selecionava somente a primeira;
- arquivamento e reativação percorriam todas as ocorrências;
- remoção eliminava todas as ocorrências;
- uma ação aparentemente singular podia alcançar duas cópias.

O problema não estava no pacote compartilhado. O ID é criado apenas para a biblioteca local.

## Solução

A política `unique-local-record-id-no-bulk-mutation-v1` separa três decisões:

1. equivalência do pacote;
2. alocação do ID local;
3. ação sobre uma ocorrência única.

### Cópia equivalente

A equivalência canônica continua sendo verificada primeiro. Quando a cópia já existe, nenhum segundo registro é criado e o resultado informa o ID existente.

### ID candidato livre

O ID solicitado é preservado exatamente.

### ID candidato ocupado

Quando outro conteúdo já usa o mesmo ID, o primeiro sufixo livre é alocado:

```text
received-local
received-local--2
received-local--3
```

O pacote, seus avisos, o checksum e a impressão não são alterados.

## Resultado explícito de inserção

`keepReceivedCollectionWithIdentity` retorna:

- `kept` — ID solicitado preservado;
- `equivalent` — cópia equivalente já existente;
- `disambiguated` — conteúdo distinto preservado sob ID local único;
- `invalid` — dados mínimos ausentes ou limite de alocação esgotado.

O resultado também informa `requestedId`, `storedId`, `record` e uma mensagem descritiva.

`keepReceivedCollection` continua disponível como wrapper compatível e retorna somente o registro atualizado.

## Ações locais

As variantes explícitas:

- `archiveReceivedCollectionWithIdentity`;
- `reactivateReceivedCollectionWithIdentity`;
- `removeReceivedCollectionWithIdentity`;

retornam:

- `updated`;
- `unchanged`;
- `missing`;
- `ambiguous`;
- `invalid`.

Uma ação somente é aplicada quando existe exatamente uma ocorrência do ID.

## Bibliotecas legadas

Uma biblioteca antiga pode conter IDs duplicados. A Fase 8.26 não:

- renomeia registros existentes;
- mescla cópias;
- remove uma das ocorrências;
- escolhe a primeira silenciosamente;
- executa ação em massa.

Quando o ID é ambíguo, a operação retorna `ambiguous` e o registro permanece exatamente como estava.

## Busca

`findReceivedAllById` retorna todas as ocorrências.

`findReceivedCollection` passa a retornar uma cópia somente quando existe exatamente uma ocorrência. Em caso de ambiguidade, retorna `undefined`.

## Limites

O identificador local:

- não atravessa o arquivo compartilhado;
- não comprova identidade;
- não comprova autoria;
- não comprova origem;
- não autentica pertencimento;
- não substitui a impressão nem a equivalência canônica.

## Privacidade e persistência

A fase não cria:

- nova rota;
- nova store;
- nova chave IndexedDB;
- histórico de conflitos;
- analytics;
- telemetria;
- sincronização.

## Assinatura

**Tehkné Solutions**
