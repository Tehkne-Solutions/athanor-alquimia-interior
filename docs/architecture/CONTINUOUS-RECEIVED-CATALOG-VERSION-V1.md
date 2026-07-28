# Contrato de versão da biblioteca recebida v1

## Política

`registry-catalog-version-matches-all-packages-v1`

## Objetivo

Impedir que a biblioteca local declare uma identidade ou versão e guarde pacotes pertencentes a outro catálogo conhecido ou desconhecido.

## Invariantes

```text
registry.id === continuous_received_registry_v1
registry.catalogVersion === 1.0.0
record.package.catalogVersion === registry.catalogVersion
```

Todas as versões usam SemVer estrito `X.Y.Z`.

## Posição no portão local

```text
cronologia local
→ impressão armazenada corresponde ao pacote
→ identidade e versão da biblioteca
→ ação solicitada
```

## Criação

A fábrica aceita somente a versão atual reconhecida. Versões malformadas, futuras ou antigas sem migração explícita geram `RangeError` e nenhuma biblioteca é criada.

## Inserção

Antes de clonar, deduplicar ou alocar ID, o pacote recebido precisa declarar exatamente a versão da biblioteca. Divergências retornam `invalid` com a mesma instância original.

## Bibliotecas persistidas

Cada operação confere novamente:

- identidade fixa;
- SemVer da biblioteca;
- versão atual reconhecida;
- SemVer de cada pacote;
- igualdade entre pacote e biblioteca.

## Recusa

Uma divergência não:

- promove ou rebaixa versão;
- cria biblioteca paralela;
- move registros;
- altera pacote ou impressão;
- executa migração silenciosa.

## Limites

Coerência de catálogo não comprova identidade, autoria, origem, pertencimento, entrega, leitura ou autenticidade criptográfica.

## Persistência

Nenhuma nova store, chave IndexedDB, fila, cache, histórico, analytics ou telemetria é criada.

**Tehkné Solutions**
