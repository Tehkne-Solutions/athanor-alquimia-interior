# Continuous Numeric Lexeme V1

## Objetivo

Impedir que um número JSON mude silenciosamente ao ser convertido para o tipo `Number` do JavaScript.

## Política

```text
exact-decimal-measure-before-json-parse-v1
```

## Ordem

A inspeção acontece depois da unicidade das chaves e antes do `JSON.parse`:

```text
file.size
→ file.text()
→ text.length
→ unique decoded object keys
→ exact numeric lexemes
→ JSON.parse
```

## Normalização decimal

Cada lexema é decomposto em:

- sinal;
- dígitos significativos;
- expoente decimal;
- estado zero.

Zeros iniciais são removidos. Zeros finais dos dígitos significativos são convertidos em incremento do expoente. Assim, estas formas possuem a mesma medida:

```text
1
1.0
1e0
0.001e3
```

A forma normalizada do lexema original é comparada à forma normalizada de `Number(lexeme).toString()`.

## Regras

O número é recusado quando:

- possui mais de 128 caracteres;
- produz `Infinity` ou `-Infinity`;
- um valor não zero produz zero;
- o valor produzido possui medida decimal diferente;
- representa um inteiro matemático acima de `Number.MAX_SAFE_INTEGER`;
- representa `-0`, cujo sinal seria perdido por `JSON.stringify`.

## Inteiros

Um lexema é tratado como inteiro matemático quando sua forma decimal normalizada não possui casas fracionárias.

O limite aceito é:

```text
-9007199254740991 até 9007199254740991
```

Isso também se aplica a inteiros escritos com decimal ou expoente.

## Decimais

A política não exige que a representação binária interna seja matematicamente exata. Ela exige que o JavaScript preserve a mesma representação decimal declarada em sua conversão canônica.

Exemplos aceitos:

```text
0.1
1.2300
5e-324
```

Exemplos recusados:

```text
0.10000000000000001
4e-324
1e-400
1e400
```

## Limites

A política não:

- implementa aritmética decimal arbitrária;
- converte números em strings;
- arredonda ou trunca valores;
- autentica autoria ou identidade;
- interpreta importância, custo ou mérito;
- altera o arquivo recebido.

## Fusíveis

- profundidade lexical: 128 níveis;
- tokens: 300.000;
- caracteres por lexema numérico: 128.

## Persistência

Nenhum resultado, erro ou número recusado é persistido.

**Tehkné Solutions**
