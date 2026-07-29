# Arquitetura — texto bruto da memória persistida v1

## Objetivo

Impedir que o `JSON.parse` escolha silenciosamente um valor repetido ou altere a medida numérica escrita dentro do envelope da biblioteca recebida.

## Ordem

```text
IndexedDB.getItem
→ preservar texto bruto como referência transitória
→ bytes UTF-8
→ caracteres
→ chaves decodificadas únicas
→ lexemas numéricos exatos
→ JSON.parse
→ JSON inerte
→ orçamento estrutural
→ Unicode visível
→ envelope Zustand
→ hidratação da biblioteca
```

## Hidratação inicial

`continuousReceivedHydrationOnlyStorage.getItem` lê a chave oficial e entrega o texto ao scanner antes de devolvê-lo ao `createJSONStorage`.

Quando o scanner aceita:

```text
texto original
→ devolvido sem reserialização
→ createJSONStorage pode executar JSON.parse
```

Quando o scanner recusa:

```text
texto original
→ permanece na IndexedDB
→ permanece como expectedPersistedValue transitório
→ storage devolve null ao parser
→ biblioteca inicial da sessão permanece ativa
→ hydrationStatus = rejected
```

## Releitura explícita

`inspectContinuousReceivedPersistedValueForExplicitRehydration` usa o mesmo scanner antes de interpretar `state` e `version`.

Uma rejeição mantém:

- snapshot atual;
- conflito de persistência;
- referência anterior;
- bytes atuais da IndexedDB.

## Chaves

Os nomes são comparados depois da decodificação dos escapes JSON. Portanto:

```text
"version"
"\u0076ersion"
```

são a mesma chave e não podem coexistir no mesmo objeto.

## Números

São recusidos antes do parse:

- inteiros fora da faixa segura;
- overflow e underflow;
- `-0`;
- decimais que seriam arredondados;
- lexemas excessivamente longos.

## Limites

- 524.288 bytes UTF-8;
- 524.288 caracteres;
- limites estruturais já usados nos arquivos compartilhados;
- nenhuma correção, normalização ou reserialização para aceitação.

## Não objetivos

A inspeção não oferece:

- assinatura digital;
- autenticação de origem;
- sincronização;
- recuperação automática;
- escolha entre valores repetidos;
- migração do envelope;
- registro persistido da recusa.

**Tehkné Solutions**
