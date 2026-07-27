# Continuous Version Compatibility V1

## Política

```text
explicit-compatibility-no-silent-migration-v1
```

## Formato

Versões usam SemVer estrito `X.Y.Z`, sem prefixos, sufixos ou zeros à esquerda.

## Matriz atual

| Pacote | Atual | Legados aceitos |
|---|---:|---|
| Partilha | 1.0.0 | nenhum |
| Resposta | 1.0.0 | nenhum |

## Ordem de entrada

```text
consistência
→ compatibilidade de versão
→ schema e política
→ conteúdo curado
→ sanitização
```

## Estados

- `current`: aceitar;
- `supported-legacy`: aceitar somente por lista explícita;
- `future`: recusar sem downgrade;
- `unsupported-older`: recusar sem migração;
- `malformed`: recusar antes do parser.

## Regra de evolução

Uma versão legada só pode entrar na matriz junto de migração explícita, testes, documentação e aviso de transformação. O arquivo original nunca é sobrescrito.

**Tehkné Solutions**
