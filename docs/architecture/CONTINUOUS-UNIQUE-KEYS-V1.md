# Continuous Unique Keys V1

## Contrato

```ts
interface ContinuousUniqueKeyOptions {
  maxDepth: number;
  maxTokens: number;
}

type ContinuousUniqueKeyResult =
  | { ok: true; stats: ContinuousUniqueKeyStats; message: string }
  | { ok: false; kind: 'duplicate' | 'syntax' | 'limit'; errors: string[] };
```

## Política

```text
unique-decoded-object-keys-before-json-parse-v1
```

## Regra

Para cada objeto do texto JSON:

1. ler a chave como string JSON;
2. decodificar escapes sem criar o objeto final;
3. comparar o valor decodificado com as chaves já vistas naquele objeto;
4. recusar a segunda declaração;
5. nunca escolher primeiro ou último valor.

## Ordem

```text
text.length
→ unique keys
→ JSON.parse
```

Depois do `JSON.parse`, membros anteriores com o mesmo nome já foram perdidos.

## Comparação

- exata;
- sensível a maiúsculas;
- baseada na string JSON decodificada;
- limitada ao mesmo objeto;
- sem normalização Unicode automática.

## Segurança do diagnóstico

Nomes não ASCII são escapados como pontos de código. Controles invisíveis não são reproduzidos diretamente em mensagens.

## Limite

Esta barreira não autentica o pacote e não julga seu conteúdo. Ela impede apenas sobrescrita silenciosa de chaves.

**Tehkné Solutions**
