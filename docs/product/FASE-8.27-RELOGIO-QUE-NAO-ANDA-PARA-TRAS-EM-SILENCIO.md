# Fase 8.27 — O Relógio que Não Anda para Trás em Silêncio

## Estado

Implementação funcional da cronologia monotônica para a biblioteca local de coleções recebidas.

## Problema

Depois da Fase 8.26, cada ação local alcança no máximo uma cópia. Ainda assim, os horários fornecidos às operações podiam:

- usar formatos ambíguos;
- anteceder a criação da biblioteca;
- anteceder o recebimento da cópia;
- mover `updatedAt` para trás;
- arquivar antes do último estado;
- reativar antes do arquivamento;
- remover com um instante anterior ao estado atual;
- deixar uma cópia ativa com `archivedAt`;
- deixar uma cópia arquivada sem instante de arquivamento.

Isso permitia preservar o conteúdo correto sob uma sequência local contraditória.

## Solução

A política `canonical-local-time-never-regresses-v1` separa formato e ordem:

```text
instante não canônico
→ invalid

instante canônico anterior ao estado local
→ stale

instante canônico igual ou posterior
→ operação permitida
```

Nenhum horário é ajustado, arredondado, promovido ou substituído automaticamente.

## Criação da biblioteca

`createContinuousReceivedRegistry` exige UTC canônico no formato:

```text
YYYY-MM-DDTHH:mm:ss.sssZ
```

Como a API histórica retorna diretamente a biblioteca, um instante inválido produz `RangeError` explícito em vez de um registro corrigido silenciosamente.

## Inserção

`keepReceivedCollectionWithIdentity` valida o instante antes da equivalência e da alocação do ID.

A inserção precisa ser igual ou posterior ao `updatedAt` atual da biblioteca. Quando recusada, a função devolve exatamente a instância original do registro.

## Arquivamento, reativação e remoção

As APIs explícitas retornam o novo estado `stale` quando o horário é anterior ao último estado local:

- `archiveReceivedCollectionWithIdentity`;
- `reactivateReceivedCollectionWithIdentity`;
- `removeReceivedCollectionWithIdentity`.

Os wrappers históricos continuam retornando somente a biblioteca e permanecem seguros porque recebem a biblioteca original em toda recusa.

## Invariantes

Uma biblioteca válida mantém:

```text
registry.updatedAt >= registry.createdAt
record.receivedAt >= registry.createdAt
record.updatedAt >= record.receivedAt
registry.updatedAt >= record.updatedAt
```

Para estado:

```text
active → archivedAt ausente
archived → archivedAt presente e igual a updatedAt
```

## Instantes iguais

Instantes iguais são aceitos. Isso permite operações determinísticas dentro do mesmo marco temporal sem inventar milissegundos adicionais.

## Relógio do pacote

O instante externo `package.generatedAt` não é comparado com `receivedAt`. O arquivo pode ter sido produzido em outro dispositivo ou sob relógio diferente.

A política protege apenas a sequência local e não transforma diferenças de relógio em julgamento de falsidade.

## Bibliotecas legadas

Uma biblioteca antiga com cronologia incoerente:

- não é reescrita;
- não recebe migração automática;
- não escolhe o maior horário;
- não perde registros;
- bloqueia novas mutações até decisão explícita.

## Limites da garantia

A cronologia monotônica não comprova:

- correção do relógio;
- identidade;
- autoria;
- origem;
- verdade do evento;
- entrega ou leitura;
- autenticidade criptográfica.

## Privacidade e persistência

A fase não cria:

- rota;
- store;
- chave IndexedDB;
- histórico de recusas;
- trilha de auditoria;
- analytics;
- telemetria;
- sincronização.

## Assinatura

**Tehkné Solutions**
