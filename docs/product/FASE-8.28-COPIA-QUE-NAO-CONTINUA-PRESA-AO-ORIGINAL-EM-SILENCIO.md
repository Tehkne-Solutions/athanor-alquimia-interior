# Fase 8.28 — A Cópia que Não Continua Presa ao Original em Silêncio

## Estado

Implementação funcional de snapshots defensivos para a biblioteca local de coleções recebidas.

## Problema

A biblioteca já criava uma cópia parcial do pacote, mas alguns vínculos de referência permaneciam possíveis:

- o selo de consistência podia continuar compartilhado com a entrada;
- o `record` devolvido pela inserção era o mesmo objeto armazenado;
- consultas devolviam referências internas;
- uma nova versão da biblioteca reutilizava registros da versão anterior;
- remoções reutilizavam as cópias restantes.

Assim, uma alteração feita fora das operações do domínio podia modificar silenciosamente um snapshot já considerado guardado.

## Solução

A política `detached-defensive-received-snapshots-v1` cria cópias estruturais explícitas em todas as fronteiras públicas.

```text
entrada
→ snapshot armazenado

snapshot armazenado
→ resultado devolvido

biblioteca
→ consulta defensiva

versão anterior
→ nova versão bem-sucedida
```

## Pacote recebido

A inserção clona:

- proveniência;
- coleção;
- opções;
- itens;
- resumos de passagens;
- avisos;
- selo de consistência, quando presente.

Depois da inserção, alterar o objeto original não modifica o pacote guardado.

## Resultado da inserção

Os estados `kept`, `disambiguated` e `equivalent` podem devolver `record`, mas esse registro é um snapshot separado da ocorrência interna.

Alterar o resultado não modifica a biblioteca.

## Consultas

As consultas públicas:

- `findReceivedCollection`;
- `findReceivedAllById`;
- `findReceivedByFingerprint`;
- `findReceivedAllByFingerprint`;
- `findEquivalentReceivedCollection`;

passam a devolver snapshots defensivos.

Buscas privadas continuam selecionando as ocorrências internas necessárias para deduplicação e mutação.

## Versões sucessivas

Operações bem-sucedidas criam uma nova biblioteca que não compartilha registros mutáveis com a versão anterior:

- inserção;
- arquivamento;
- reativação;
- remoção.

Alterar uma versão antiga depois da operação não muda a versão nova.

## Recusas e ausência de mudança

Os estados abaixo continuam devolvendo exatamente a biblioteca original:

```text
invalid
stale
missing
ambiguous
unchanged
```

Isso evita criar uma cópia sem necessidade e permite verificar por identidade que nenhuma alteração ocorreu.

## Integridade preservada

A clonagem não modifica:

- conteúdo;
- impressão;
- checksum;
- versão;
- avisos;
- equivalência canônica;
- cronologia;
- identificador local.

## Estratégias não usadas

A fase não usa:

- `JSON.stringify` seguido de `JSON.parse`;
- congelamento recursivo;
- proxy de mutação;
- serialização para apagar `undefined`;
- correção automática;
- alteração do objeto original.

## Limites

A biblioteca continua sendo um valor local entregue ao chamador. Quem possui diretamente esse valor ainda pode alterá-lo deliberadamente.

A garantia é mais específica: as APIs do Athanor não deixam referências indiretas entre a entrada, os resultados de leitura e versões sucessivas.

Snapshots defensivos não comprovam:

- identidade;
- autoria;
- origem;
- pertencimento;
- entrega ou leitura;
- autenticidade criptográfica.

## Privacidade e persistência

A fase não cria:

- rota;
- store;
- chave IndexedDB;
- histórico de mutações;
- trilha de auditoria;
- analytics;
- telemetria;
- sincronização.

## Assinatura

**Tehkné Solutions**
