# Continuous Exact Time V1

## Contrato

```text
YYYY-MM-DDTHH:mm:ss.sssZ
```

## Verificação

1. validar a forma lexical exata;
2. converter com `Date.parse`;
3. exigir resultado finito;
4. comparar `new Date(epoch).toISOString()` com o texto original;
5. quando ambos existirem, exigir `completedAt >= occurredAt`.

## Campos

- partilha: `generatedAt`, `items[].occurredAt`, `items[].completedAt`;
- resposta: `generatedAt`.

## Compatibilidade

- campos opcionais ausentes são preservados;
- offsets não são normalizados para `Z`;
- datas impossíveis não são corrigidas;
- precisão não é completada ou reduzida;
- o arquivo original não é alterado.

## Limite

O contrato preserva a representação do instante. Ele não comprova a correção do relógio de origem, a veracidade do evento, identidade, autoria ou autenticidade criptográfica.

**Tehkné Solutions**
