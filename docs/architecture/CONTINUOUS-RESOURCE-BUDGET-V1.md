# Continuous Resource Budget V1

## Política

```text
bounded-local-reading-no-content-judgment-v1
```

## Limites

```ts
{
  maxFileBytes: 524288,
  maxTextCharacters: 524288,
  maxDepth: 16,
  maxNodes: 10000,
  maxArrayLength: 1000,
  maxObjectKeys: 64,
  maxStringLength: 8192,
  maxTotalStringCharacters: 262144
}
```

## Ordem

```text
file.size
→ file.text()
→ text.length
→ JSON.parse
→ iterative structure inspection
→ consistency
→ version
→ domain parser
→ sanitization
```

## Princípios

- tamanho do arquivo é verificado antes da leitura;
- inspeção estrutural é iterativa;
- nenhuma estrutura é truncada;
- nenhum arquivo é reparado;
- nenhuma recusa é persistida;
- limite técnico não julga o conteúdo;
- geração e recepção usam o mesmo orçamento.

## Resultado

Sucesso retorna somente estatísticas descritivas de nós, profundidade e caracteres. Falha retorna um ou mais motivos técnicos e interrompe o fluxo.

**Tehkné Solutions**
