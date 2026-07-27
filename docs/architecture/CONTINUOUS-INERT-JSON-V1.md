# Continuous Inert JSON V1

## Política

```text
plain-json-no-hidden-behavior-v1
```

## Valores aceitos

- `null`;
- booleanos;
- strings;
- números finitos;
- arrays densos com protótipo padrão;
- objetos com `Object.prototype` ou protótipo nulo;
- propriedades próprias, enumeráveis e de dados.

## Valores recusados

- `undefined`;
- funções;
- símbolos;
- `bigint`;
- `NaN` e infinitos;
- getters e setters;
- propriedades simbólicas ou não enumeráveis;
- arrays esparsos ou com propriedades extras;
- `Date`, `Map`, `Set`, instâncias de classe e protótipos especiais;
- referências repetidas ou circulares;
- chaves `__proto__`, `prototype` e `constructor`.

## Inspeção

A inspeção é iterativa e usa descritores próprios para não ler o valor de getters. Chamadas hostis que impeçam a consulta de protótipo, chaves ou descritores são tratadas como falha técnica.

## Ordem das barreiras

```text
file.size
→ file.text()
→ text.length
→ JSON.parse
→ forma JSON inerte
→ orçamento estrutural
→ checksum
→ versão
→ schema e política
→ conteúdo curado
→ sanitização
```

## Limite

Forma inerte significa somente que o valor se comporta como dados JSON passivos. Não comprova autenticidade, autoria, intenção, segurança, inocuidade ou veracidade do conteúdo.

**Tehkné Solutions**
