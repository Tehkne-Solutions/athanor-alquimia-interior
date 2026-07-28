# Fase 8.29 — A Impressão Guardada que Não Aponta para Outro Conteúdo em Silêncio

## Estado

Implementação funcional da conferência entre a impressão persistida e o pacote guardado na biblioteca recebida.

## Problema

Cada registro mantém dois valores separados:

```text
record.fingerprint
record.package
```

A impressão era calculada na inserção, mas não era reconferida antes das operações seguintes. Uma alteração direta no campo ou no conteúdo coberto pelo algoritmo podia deixar a biblioteca incoerente.

A deduplicação então poderia:

- deixar de encontrar uma cópia equivalente;
- selecionar candidatos incorretos;
- confiar em uma chave persistida obsoleta.

Arquivamento, reativação ou remoção também poderiam operar sobre uma biblioteca cuja medida interna já não correspondia ao próprio pacote.

## Solução

A política `stored-fingerprint-matches-package-scope-v1` recalcula a impressão de cada registro antes das decisões locais.

```text
impressão canônica + correspondência exata
→ biblioteca apta para a operação

formato inválido ou divergência
→ operação invalid
→ biblioteca original preservada
```

## Operações protegidas

- inserção e deduplicação;
- arquivamento;
- reativação;
- remoção.

A validação usa o mesmo portão de integridade que já protege a cronologia local.

## Pacote não mensurável

Se o pacote não puder ser serializado deterministicamente pelo algoritmo histórico, a operação é recusada. Isso inclui, por exemplo, uma referência circular introduzida diretamente no estado local.

Nenhuma tentativa de truncamento, limpeza ou serialização corretiva é realizada.

## Sem reparo automático

A fase não decide se o valor correto é a impressão ou o pacote.

Ela não:

- recalcula e grava o campo;
- desfaz alterações do pacote;
- remove o registro;
- cria uma cópia corrigida;
- migra o algoritmo;
- gera histórico da divergência.

## Escopo histórico

A impressão continua baseada em:

- schema;
- política;
- versão do catálogo;
- proveniência;
- coleção;
- opções;
- itens.

Os campos abaixo permanecem deliberadamente fora do escopo:

```text
generatedAt
notices
consistency
```

A fase não amplia silenciosamente uma impressão já usada por registros e respostas existentes.

## Relação com outras barreiras

- o selo de consistência cobre o pacote exportável inteiro, exceto o próprio selo;
- os avisos canônicos protegem `notices`;
- a impressão curta agrupa candidatos locais;
- a equivalência canônica completa decide duplicação;
- a Fase 8.29 garante apenas que a chave persistida ainda corresponde ao escopo que declara medir.

## Limites

A impressão FNV-1a de 32 bits:

- pode colidir;
- não é criptográfica;
- não comprova identidade;
- não comprova autoria;
- não comprova origem;
- não comprova entrega ou leitura;
- não autentica o conteúdo.

## Privacidade e persistência

A fase não cria rota, store, chave IndexedDB, histórico de divergências, analytics, telemetria ou sincronização.

## Assinatura

**Tehkné Solutions**
