# Continuous Strict Contract V1

## Política

```text
reject-unknown-fields-before-sanitization-v1
```

## Responsabilidade

Verificar recursivamente se cada propriedade presente pertence ao manifesto da versão conhecida. A validação não substitui o parser de tipos e valores.

## Ordem

```text
checksum
→ version matrix
→ strict field contract
→ domain parser
→ sanitization
```

## Regras

- objetos usam lista explícita de campos permitidos;
- listas aplicam o manifesto do item a cada posição;
- escalares encerram a travessia;
- tipos incorretos são deixados para o parser de domínio;
- campos opcionais podem faltar;
- campos desconhecidos interrompem o pacote;
- descritores são lidos sem executar getters;
- somente propriedades próprias do manifesto são reconhecidas;
- no máximo 20 caminhos desconhecidos são exibidos.

## Manifestos

- `continuousShareContractV1`;
- `continuousResponseContractV1`.

## Resultado

Sucesso retorna estatísticas de objetos, listas, campos conhecidos e profundidade. Falha retorna caminhos ASCII-seguros e indicação de truncamento do diagnóstico.

## Limite

O contrato não autentica conteúdo ou origem e não interpreta o valor de campos desconhecidos.

**Tehkné Solutions**
