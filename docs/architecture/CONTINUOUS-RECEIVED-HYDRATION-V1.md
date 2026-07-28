# Contrato de hidratação da biblioteca recebida v1

## Política

`validate-persisted-received-state-before-hydration-v1`

## Problema

O middleware persistente do Zustand restaura dados da IndexedDB antes das ações da store. Sem um `merge` defensivo, um envelope antigo, incompleto ou alterado poderia entrar no runtime sem passar novamente pelo domínio.

## Entrada esperada

```text
{
  schemaVersion: 1,
  registry: ContinuousReceivedRegistry
}
```

O envelope e todas as estruturas aninhadas são estritos. Campos adicionais não são descartados.

## Ordem da hidratação

```text
ausência de memória
→ biblioteca inicial preservada

memória presente
→ JSON inerte
→ envelope estrito
→ schemaVersion 1
→ revalidação completa de cada pacote
→ cronologia da biblioteca
→ correspondência das impressões
→ identidade e catálogo
→ snapshot defensivo
→ adoção no runtime
```

## Aceitação

Uma memória aceita:

- substitui somente o `registry` inicial;
- mantém `schemaVersion: 1`;
- cria snapshot defensivo;
- não compartilha objetos com o valor retornado pela storage;
- produz diagnóstico transitório `accepted`.

## Recusa

Uma memória recusada:

- não substitui a biblioteca inicial;
- não é corrigida;
- não é migrada;
- não é apagada da IndexedDB;
- não é regravada pelo `merge`;
- produz diagnóstico transitório `rejected` para a tela de recepção.

## Persistência

Continuam persistidos somente:

```text
schemaVersion
registry
```

`hydrationStatus`, `hydrationMessage` e `hydrationIssues` ficam fora da partialização.

## Limites

A barreira confirma somente que o estado persistido ainda corresponde ao contrato local conhecido. Ela não comprova identidade, autoria, origem, pertencimento ou autenticidade criptográfica.

**Tehkné Solutions**
