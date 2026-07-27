# Continuous Exact Text V1

## Contrato

Um valor textual é aceito quando:

```ts
value === value.trim()
```

A comparação não modifica o valor.

## Resultado

```ts
interface ContinuousExactTextStats {
  strings: number;
  exactStrings: number;
  boundaryIssues: number;
  containers: number;
  maxDepth: number;
}
```

Em falha, o domínio retorna até vinte caminhos e informa se os demais diagnósticos foram truncados.

## Ordem

```text
checksum
→ version
→ strict field contract
→ exact text boundaries
→ schema/domain parser
→ sanitization
```

## Garantias

- margens externas não são removidas;
- whitespace interno é preservado;
- getters não são executados;
- o objeto não é modificado;
- strings não são reproduzidas nos erros;
- parsers copiam os textos aprovados sem `trim()`.

## Não garantias

O contrato não autentica identidade, autoria, intenção ou veracidade. Ele também não substitui Unicode visível, orçamento estrutural, schema ou conteúdo curado.

**Tehkné Solutions**
