# Arquitetura — Concorrência da biblioteca recebida v1

## Objetivo

Impedir que uma aba ou sessão substitua silenciosamente uma alteração já confirmada por outra aba na mesma chave IndexedDB.

## Problema anterior

```text
aba A hidrata X
aba B hidrata X
aba A grava Y
aba B grava Z
→ Z substitui Y
```

As duas transações podiam concluir corretamente, mas a segunda decisão partia de um snapshot obsoleto.

## Referência transitória

`continuousReceivedHydrationOnlyStorage.getItem()` preserva exatamente o texto bruto retornado pela IndexedDB em:

```text
useContinuousReceivedPersistenceRuntimeStore.expectedPersistedValue
```

Essa referência:

- pode ser `null` quando não existe valor persistido;
- pode conter um envelope posteriormente recusado pela hidratação;
- não é normalizada;
- não é persistida novamente como metadado;
- não cria versão ou revisão adicional.

## Compare-and-set

`compareAndSetIdbState()` abre uma única transação `readwrite` e executa:

```text
store.get(key)
→ comparação exata com expectedValue
→ store.put(nextValue, key), somente quando iguais
```

A leitura de conferência e a escrita pertencem à mesma transação. Outra transação não pode inserir uma escrita entre essas duas etapas.

## Resultados

```text
written
→ próximo envelope persistido
→ runtime recebe o próximo snapshot
→ referência esperada passa a ser o próximo envelope

conflict
→ nenhuma escrita
→ runtime anterior preservado
→ memória externa preservada
→ status transitório conflict
```

## Ordem completa

```text
hidratação concluída
→ referência bruta conhecida
→ domínio calcula o próximo snapshot
→ transação readwrite confere a referência
→ transação grava, se ainda coincidir
→ Zustand recebe o snapshot
→ referência transitória é atualizada
→ interface anuncia sucesso
```

## Falha técnica versus conflito

Falha técnica:

```text
erro ao abrir banco, ler, gravar ou concluir transação
→ persistence-failed
→ nova tentativa explícita permitida
```

Conflito:

```text
valor persistido diferente da referência
→ persistence-conflict
→ novas mutações bloqueadas
→ nova hidratação explícita necessária
```

O conflito não é tratado como quota, indisponibilidade ou erro desconhecido.

## Comparação exata

A comparação usa o texto bruto, não somente a biblioteca sanitizada. Isso detecta:

- outra biblioteca válida;
- remoção da chave;
- envelope futuro;
- campos desconhecidos;
- mudança de ordem textual;
- valor não textual.

Nenhuma dessas diferenças é interpretada ou mesclada automaticamente.

## Limites

- não existe sincronização entre abas;
- não existe atualização automática do runtime;
- não existe BroadcastChannel;
- não existe fila;
- não existe retry automático;
- não existe merge de registros;
- não existe escolha de vencedor;
- não existe histórico de conflitos;
- não existe nova chave ou object store;
- compare-and-set não autentica a outra sessão.

## Assinatura

**Tehkné Solutions**
