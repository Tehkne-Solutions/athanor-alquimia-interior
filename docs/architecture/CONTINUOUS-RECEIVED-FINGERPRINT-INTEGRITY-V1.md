# Contrato de integridade da impressão armazenada v1

## Política

`stored-fingerprint-matches-package-scope-v1`

## Objetivo

Impedir que `record.fingerprint` permaneça diferente da impressão recalculada para o pacote armazenado e seja usado para deduplicação ou mutação local.

## Regra

Para cada registro:

```text
record.fingerprint
===
fingerprintContinuousSharePackage(record.package)
```

O formato também precisa permanecer `received-` seguido de oito hexadecimais minúsculos.

## Posição

A validação integra o portão local já executado antes de:

- deduplicação;
- arquivamento;
- reativação;
- remoção.

Uma divergência torna a operação `invalid` e devolve exatamente a biblioteca original.

## Sem reparo

O Athanor não:

- substitui a impressão persistida;
- reescreve o pacote;
- escolhe qual lado é verdadeiro;
- migra o algoritmo;
- remove o registro divergente.

## Escopo histórico preservado

A impressão histórica mede:

- schema;
- política;
- versão do catálogo;
- proveniência;
- coleção;
- opções;
- itens.

Ela não mede:

- `generatedAt`;
- `notices`;
- `consistency`.

Esse escopo não é ampliado silenciosamente. A integridade desses campos pertence a outras barreiras.

## Limites

A impressão é FNV-1a de 32 bits, pode colidir e não autentica identidade, autoria, origem, entrega ou conteúdo. A equivalência canônica completa continua necessária após a seleção dos candidatos.

**Tehkné Solutions**
