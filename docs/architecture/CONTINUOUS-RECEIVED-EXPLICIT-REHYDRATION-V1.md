# Arquitetura — Releitura explícita da biblioteca recebida v1

## Objetivo

Resolver um conflito de persistência sem exigir que a aplicação escolha, mescle ou sobrescreva uma das versões da biblioteca.

A Fase 8.35 interrompe uma escrita quando a chave IndexedDB mudou desde a hidratação. A Fase 8.36 adiciona um caminho explícito para examinar novamente o valor atual e, quando válido, substituir somente o snapshot em runtime.

## Fluxo

```text
persistenceStatus = conflict
→ pessoa escolhe Examinar memória atual
→ hidratação transitória volta a initial
→ leitura da chave oficial
→ parse do envelope Zustand
→ persist version 0
→ hidratação completa da state
→ accepted | empty | rejected | unavailable
```

## Adoção

### `accepted`

- a biblioteca atual passa novamente por todas as barreiras da hidratação;
- o snapshot validado substitui o snapshot obsoleto no Zustand;
- o texto bruto lido se torna a nova referência do compare-and-set;
- o conflito é limpo;
- nenhuma escrita é executada.

### `empty`

- a ausência física da chave é confirmada;
- uma nova biblioteca vazia é criada para o runtime;
- a referência esperada passa a ser `null`;
- o conflito é limpo;
- nenhuma escrita é executada.

## Não adoção

### `rejected`

- o valor foi lido, mas envelope, versão, pacote ou invariantes foram recusados;
- o snapshot anterior permanece ativo;
- a referência esperada antiga não é substituída;
- o conflito permanece bloqueando mutações.

### `unavailable`

- a IndexedDB não concluiu a leitura;
- o snapshot anterior permanece ativo;
- o conflito permanece;
- a hidratação transitória registra somente diagnóstico local.

## Envelope relido

```ts
{
  state: {
    schemaVersion: 1,
    registry: ContinuousReceivedRegistry
  },
  version: 0
}
```

O envelope da recuperação precisa conter somente `state` e `version`. O conteúdo de `state` segue para `hydrateContinuousReceivedPersistedState`, que reaplica os contratos de forma, pacote e biblioteca.

## Ordem de efeitos na adoção

```text
aplicar snapshot validado no Zustand
→ atualizar referência esperada transitória
→ publicar resultado da hidratação
```

A ação local que causou o conflito não participa desse fluxo.

## Garantias

- nenhuma escrita durante a releitura;
- nenhuma repetição da ação interrompida;
- nenhuma fila;
- nenhuma mescla;
- nenhuma seleção automática de vencedor;
- nenhuma migração ou reparo;
- nenhuma alteração da chave ou do schema persistido;
- diagnóstico somente transitório.

## Limites

A releitura explícita não cria sincronização contínua. Outra aba pode alterar a memória novamente depois da adoção; o compare-and-set da Fase 8.35 continuará sendo a barreira de escrita.

**Tehkné Solutions**
