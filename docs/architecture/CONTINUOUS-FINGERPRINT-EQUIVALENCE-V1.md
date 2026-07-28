# Contrato de equivalência da impressão v1

## Política

`fingerprint-is-hint-equivalence-decides-v1`

## Objetivo

Impedir que uma impressão local curta decida sozinha que dois pacotes são a mesma cópia. A impressão seleciona candidatos; a equivalência canônica decide se a nova cópia pode ser tratada como duplicada.

## Formato

```text
received-[0-9a-f]{8}
```

A impressão continua usando FNV-1a de 32 bits no escopo histórico do pacote. Ela é descritiva, não criptográfica, não autentica identidade e pode colidir.

## Projeção de equivalência

Inclui, em ordem canônica:

- schema;
- política;
- versão do catálogo;
- proveniência;
- coleção;
- opções;
- itens;
- avisos canônicos.

Exclui somente:

- `generatedAt`;
- `consistency`.

Assim, a mesma cópia exportada novamente em outro instante continua equivalente. Uma diferença editorial nos avisos permanece significativa.

## Decisão

```text
impressão diferente
→ pacotes diferentes

impressão igual + equivalência igual
→ cópia equivalente; não duplicar

impressão igual + equivalência diferente
→ colisão descritiva; preservar ambas
```

## Busca

`findReceivedAllByFingerprint` retorna todos os candidatos. `findReceivedByFingerprint` permanece apenas como compatibilidade legada e retorna a primeira ocorrência; não participa da deduplicação.

## Respostas

Arquivos de resposta precisam usar o formato canônico da impressão. A validação do formato não confirma que a origem existe, pertence a alguém ou corresponde a uma cópia disponível no dispositivo.

## Persistência

Nenhum histórico de colisões, nova store, chave IndexedDB, analytics ou telemetria é criado.

**Tehkné Solutions**
