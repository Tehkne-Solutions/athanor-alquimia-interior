# Continuous Text Visibility V1

## Contrato

```ts
interface ContinuousTextVisibilityOptions {
  normalization: 'NFC';
  maxInspectionNodes: number;
}
```

Política oficial:

```text
nfc-visible-text-no-directional-controls-v1
```

## Ordem

```text
JSON inerte
→ orçamento estrutural
→ visibilidade textual
→ checksum
→ versão
```

## Regras

- valores e chaves string precisam estar em NFC;
- não há normalização automática;
- tab, LF e CR são permitidos;
- demais controles C0, DEL e C1 são recusados;
- controles bidirecionais e de largura zero são recusados;
- substitutos inválidos, não caracteres e `U+FFFD` são recusados;
- variation selectors permanecem permitidos;
- a inspeção não executa getters.

## Resultado

Sucesso retorna estatísticas de:

- nós inspecionados;
- valores string;
- nomes de campos;
- pontos de código.

Falha retorna uma mensagem técnica com caminho e ponto de código, sem persistência ou alteração do conteúdo.

## Limite

Este contrato não é moderação de conteúdo, detecção completa de homógrafos, autenticação ou prova de veracidade.

**Tehkné Solutions**
