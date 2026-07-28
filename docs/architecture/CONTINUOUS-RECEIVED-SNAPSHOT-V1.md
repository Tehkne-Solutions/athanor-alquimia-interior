# Contrato de snapshots defensivos recebidos v1

## Política

`detached-defensive-received-snapshots-v1`

## Objetivo

Impedir que objetos externos ou versões anteriores alterem silenciosamente uma cópia já guardada na biblioteca recebida.

## Fronteiras

A desvinculação ocorre em quatro fronteiras:

```text
pacote de entrada → registro armazenado
registro armazenado → resultado da inserção
biblioteca → resultado de consulta
versão anterior → nova versão bem-sucedida
```

## Estruturas clonadas

- proveniência;
- coleção descritiva;
- opções;
- lista de itens;
- cada item;
- resumo de passagens;
- lista de avisos;
- selo opcional de consistência;
- registro recebido;
- lista de registros da biblioteca.

## Leituras

Consultas públicas devolvem snapshots. Alterar o resultado de uma consulta não modifica a biblioteca usada como entrada.

As buscas internas de deduplicação e mutação continuam trabalhando sobre as ocorrências armazenadas, sem expô-las ao chamador.

## Escritas

Uma inserção, um arquivamento, uma reativação ou uma remoção bem-sucedida cria uma nova versão da biblioteca sem compartilhar registros mutáveis com a versão anterior.

## Recusas

Operações `invalid`, `stale`, `missing`, `ambiguous` ou `unchanged` devolvem exatamente a mesma instância da biblioteca recebida. Nenhuma cópia corretiva é criada.

## Estratégia

A clonagem é estrutural e explícita. Não usa:

- round-trip de `JSON.stringify` e `JSON.parse`;
- `structuredClone` dependente de ambiente;
- congelamento recursivo;
- proxies;
- mutação do pacote original.

## Limites

A separação de referências não impede que o proprietário da própria variável da biblioteca a altere diretamente. O contrato garante somente que as APIs do domínio não criam vínculos indiretos entre entrada, leitura e versões sucessivas.

Snapshots defensivos não comprovam autoria, identidade, origem, pertencimento ou autenticidade.

## Persistência

Nenhuma store, chave IndexedDB, trilha de auditoria, analytics, telemetria ou sincronização adicional é criada.

**Tehkné Solutions**
