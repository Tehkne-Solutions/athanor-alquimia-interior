# Contrato de delegação da store recebida v1

## Política

`store-delegates-received-decisions-to-domain-v1`

## Problema

A store da recepção ainda executava uma deduplicação própria:

```text
fingerprint igual
→ abrir a primeira cópia
→ não chamar o domínio
```

Essa decisão contradizia a equivalência canônica, porque a impressão FNV-1a curta pode colidir e não inclui todos os campos editoriais.

## Regra

A fachada não decide duplicação nem mutação. Ela delega para:

```text
keepReceivedCollectionWithIdentity
archiveReceivedCollectionWithIdentity
reactivateReceivedCollectionWithIdentity
removeReceivedCollectionWithIdentity
```

## Inserção

A store fornece apenas:

- biblioteca atual;
- pacote sanitizado;
- ID candidato local;
- instante local.

O domínio devolve:

```text
kept | equivalent | disambiguated | stale | invalid
storedId
nova biblioteca ou a mesma instância
mensagem
```

O ID apresentado à UI é sempre `storedId`, nunca o candidato presumido.

## Mutação

A fachada preserva:

```text
updated | unchanged | missing | ambiguous | stale | invalid
```

Somente `updated` produz nova biblioteca. `unchanged` e recusas não são persistidos novamente como se fossem mudanças.

## Prévia

A interface usa equivalência canônica para anunciar duplicação. Impressão igual sem equivalência é apresentada como colisão descritiva e ambas as cópias podem ser preservadas.

## Persistência

A configuração permanece:

```text
schemaVersion
registry
```

Nenhum diagnóstico, mensagem ou status transitório é adicionado à IndexedDB.

## Limites

A delegação garante uma única fonte de decisão no domínio. Não comprova identidade, autoria, origem, entrega, leitura ou autenticidade.

**Tehkné Solutions**
