# Continuous Exact Relation V1

## Política

```text
reject-cross-field-contradictions-before-domain-v1
```

## Relações da partilha

```text
collection.itemCount === items.length
items[index].position === index + 1
includeDates === false → sem occurredAt/completedAt
completedAt presente → occurredAt presente
occurredAt <= completedAt
occurredAt <= generatedAt
completedAt <= generatedAt
```

## Ordem

A barreira executa depois de formato UTC canônico e antes do parser de domínio.

## Garantia

A barreira garante somente coerência entre campos declarados. Ela não prova o evento, o relógio, a origem, a identidade ou a autoria.

## Persistência

Nenhum resultado é armazenado.

**Tehkné Solutions**
