# Fase 8.30 — A Versão da Biblioteca que Não Guarda Outro Catálogo em Silêncio

## Estado

Implementação funcional da coerência entre identidade local, versão da biblioteca recebida e versão dos pacotes armazenados.

## Problema

A biblioteca possuía `id` e `catalogVersion`, mas esses campos não eram usados como invariantes completos. Um estado alterado diretamente poderia:

- mudar a identidade da biblioteca;
- declarar uma versão futura ou malformada;
- manter pacotes de versões diferentes;
- recalcular a impressão de um pacote de outra versão e continuar passando pela barreira anterior;
- receber um novo pacote de catálogo diferente antes de a divergência ser percebida.

## Solução

A política `registry-catalog-version-matches-all-packages-v1` exige:

```text
registry.id = continuous_received_registry_v1
registry.catalogVersion = versão atual reconhecida
cada package.catalogVersion = registry.catalogVersion
```

Versões precisam usar SemVer estrito.

## Criação

`createContinuousReceivedRegistry` agora constrói o estado candidato e o valida antes de devolvê-lo.

São recusadas com `RangeError`:

- versões malformadas;
- versões futuras;
- versões antigas sem migração explícita.

Nenhuma versão é substituída por `1.0.0` automaticamente.

## Inserção

`keepReceivedCollectionWithIdentity` valida o pacote recebido depois do portão da biblioteca e antes de:

- clonar o pacote;
- procurar equivalência;
- calcular o ID final;
- criar um registro.

Um pacote de outro catálogo retorna `invalid` e a mesma biblioteca.

## Estado persistido

A conferência percorre todos os registros. Mesmo quando a impressão foi recalculada para combinar com um pacote alterado, a divergência de versão continua sendo recusada.

## Operações bloqueadas

Uma biblioteca mista ou rotulada com versão incompatível não aceita:

- nova inserção;
- deduplicação;
- arquivamento;
- reativação;
- remoção.

## Ordem do portão

```text
cronologia local
→ correspondência da impressão armazenada
→ coerência da identidade e do catálogo
→ instante e ação solicitados
```

Essa ordem preserva os diagnósticos anteriores. Uma impressão obsoleta continua sendo recusada antes da mistura de catálogo.

## Compatibilidade

A versão atual da biblioteca é `1.0.0`. Não existem migrações legadas listadas para este registro local.

Bibliotecas de outra versão:

- não são apagadas;
- não são promovidas;
- não são rebaixadas;
- não têm registros movidos;
- permanecem intactas até tratamento explícito por uma migração futura documentada e testada.

## Limites

A correspondência de versão confirma somente que biblioteca e pacotes usam o mesmo contrato local conhecido. Ela não comprova:

- identidade;
- autoria;
- origem;
- pertencimento;
- veracidade;
- entrega ou leitura;
- autenticidade criptográfica.

## Privacidade e persistência

A fase não cria rota, store, chave IndexedDB, histórico de falhas, fila, cache, analytics, telemetria ou sincronização.

## Assinatura

**Tehkné Solutions**
