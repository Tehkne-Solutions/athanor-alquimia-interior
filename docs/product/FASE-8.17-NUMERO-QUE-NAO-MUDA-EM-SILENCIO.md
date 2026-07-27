# Fase 8.17 — O Número que Não Muda em Silêncio

**Assinatura:** Tehkné Solutions

## Objetivo

Preservar a quantidade decimal declarada nos arquivos compartilhados antes que o `JSON.parse` converta o texto para números do JavaScript.

## Núcleo bíblico

- **Provérbios 16:11** inicia a reflexão sobre pesos e medidas.
- A referência não transforma uma validação técnica em julgamento moral.
- Scanner lexical, equivalência decimal e faixa segura são estruturas autorais do Athanor.

## Problema

O JSON não limita a precisão matemática dos números, mas o JavaScript utiliza `Number`, baseado em ponto flutuante binário de precisão finita.

Por isso, alguns textos válidos podem mudar durante o parse:

```text
9007199254740993 → 9007199254740992
0.10000000000000001 → 0.1
1e-400 → 0
1e400 → Infinity
```

Depois da conversão, a quantidade original já não pode ser recuperada do objeto JavaScript.

## Solução

O Athanor percorre o texto JSON antes do parse e identifica todos os lexemas numéricos fora de strings.

Para cada número:

1. valida a gramática JSON;
2. limita o lexema a 128 caracteres;
3. normaliza sinal, dígitos e expoente decimal;
4. verifica se um inteiro matemático está na faixa segura;
5. converte temporariamente com `Number`;
6. recusa valores não finitos ou `-0`;
7. normaliza a representação canônica produzida pelo JavaScript;
8. compara as duas medidas decimais.

Somente medidas equivalentes avançam para o `JSON.parse`.

## Faixa inteira segura

Inteiros matemáticos precisam permanecer entre:

```text
-9007199254740991
9007199254740991
```

A regra alcança também formas como:

```text
9007199254740992.0
9.007199254740992e15
```

## Notações equivalentes

Estas formas continuam válidas quando representam a mesma quantidade:

```text
1
1.0
1e0
1000
1e3
0.0100
1e-2
```

A fase não exige uma única estética textual para números.

## Zero negativo

`-0` é recusado porque:

- `JSON.parse` pode preservá-lo internamente;
- `JSON.stringify(-0)` produz `0`;
- uma nova exportação perderia o sinal declarado.

## Overflow e underflow

São recusados:

- overflow para infinito;
- underflow de valor não zero para zero;
- arredondamento para outro valor subnormal;
- qualquer conversão decimalmente diferente.

## Strings

Sequências numéricas dentro de strings não são interpretadas:

```json
{"text":"9007199254740993 1e400 -0"}
```

A política inspeciona somente tokens numéricos reais.

## Pipeline

```text
file.size
→ file.text()
→ text.length
→ unique decoded object keys
→ exact numeric lexemes
→ JSON.parse
→ inert JSON
→ structural budget
→ visible Unicode text
→ checksum
→ version
→ schema and policy
→ curated content
→ sanitization
```

## Entradas protegidas

- recepção de coleções compartilhadas;
- leitura transitória de respostas.

## Saídas verificadas

Os testes serializam e inspecionam:

- partilhas geradas;
- respostas geradas.

O Athanor não deve produzir um arquivo que seria recusado pela própria política numérica.

## Interface

A política aparece nos protocolos de recepção e retorno como preservação de medida numérica antes do parse.

Não existe rota exclusiva, store ou histórico para a Fase 8.17.

## Limites

A política não:

- implementa biblioteca decimal arbitrária;
- promete precisão para cálculos futuros;
- transforma números em texto;
- corrige ou arredonda o arquivo;
- julga importância, valor financeiro, mérito ou progresso;
- comprova identidade, autoria, intenção ou veracidade;
- registra arquivos recusados.

## Critérios de aceite

- referência editorial de Provérbios 16:11;
- `Number.MAX_SAFE_INTEGER` respeitado;
- inteiros exponenciais incluídos na regra;
- equivalências decimais aceitas;
- arredondamento silencioso recusado;
- overflow recusado;
- underflow recusado;
- `-0` recusado;
- números em strings ignorados;
- fusíveis de profundidade, tokens e tamanho do lexema;
- precedência anterior ao `JSON.parse`;
- exportações reais validadas;
- nenhuma persistência adicional;
- assinatura exclusiva da Tehkné Solutions.
