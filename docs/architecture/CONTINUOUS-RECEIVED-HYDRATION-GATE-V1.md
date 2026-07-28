# Contrato do portão de hidratação v1

## Política

`block-received-actions-until-hydration-settles-v1`

## Problema

A storage da biblioteca recebida é assíncrona. Enquanto `hydrationStatus` permanece `initial`, o estado visível é apenas uma biblioteca provisória. Uma ação executada nesse intervalo poderia ser substituída quando o merge da memória persistida terminasse.

## Estados

```text
initial
→ bloqueado como hydrating

unavailable
→ bloqueado como unavailable

empty | accepted | rejected
→ ações explícitas permitidas
```

## Ações protegidas

- guardar pacote;
- arquivar;
- reativar;
- remover;
- reiniciar a biblioteca.

## Sem fila

Ações bloqueadas não são:

- executadas;
- persistidas;
- enfileiradas;
- repetidas;
- reconstruídas depois da hidratação.

O usuário precisa realizar uma nova ação explícita quando o portão estiver aberto.

## Falha da IndexedDB

O ciclo transitório de hidratação vive em uma store não persistida. Se a leitura falhar, o status passa a `unavailable` sem escrever a biblioteca provisória na mesma chave da IndexedDB.

## Persistência

A store persistida continua gravando somente:

```text
schemaVersion
registry
```

Status, mensagens e problemas de hidratação permanecem fora da persistência.

## Limites

O portão não autentica memória, usuário, pacote ou origem. Ele apenas impede concorrência entre ações locais e uma hidratação ainda não concluída.

**Tehkné Solutions**
