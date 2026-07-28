# Fase 8.31 — A Fachada que Não Decide Antes do Domínio em Silêncio

## Estado

Implementação funcional da delegação integral da store de recepção para as APIs explícitas do domínio.

## Problema

A biblioteca já distinguia:

- impressão curta;
- equivalência canônica;
- colisão descritiva;
- ID solicitado e ID armazenado;
- cronologia local;
- versão da biblioteca;
- estados de mutação.

Entretanto, a store continuava executando uma regra antiga antes de chamar o domínio:

```text
findReceivedByFingerprint
→ encontrou uma impressão
→ tratar como duplicata
```

Isso permitia que duas cópias diferentes com a mesma impressão fossem confundidas na interface, apesar de o domínio já saber preservá-las.

## Solução

A política `store-delegates-received-decisions-to-domain-v1` cria uma camada adaptadora pura entre Zustand e o domínio.

A store deixa de importar ou usar:

```text
findReceivedByFingerprint
fingerprintContinuousSharePackage
keepReceivedCollection
archiveReceivedCollection
reactivateReceivedCollection
removeReceivedCollection
```

Em seu lugar, delega às variantes explícitas de identidade e propaga seus resultados completos.

## Inserção

A fachada recebe os estados:

```text
kept
→ nova cópia guardada com o ID candidato

equivalent
→ conteúdo canonicamente equivalente já existia

disambiguated
→ cópia distinta preservada com outro ID local

stale
→ instante regressivo; nada gravado

invalid
→ biblioteca, pacote ou integridade incompatível; nada gravado
```

A UI seleciona sempre o `storedId` devolvido pelo domínio.

## Colisões de impressão

A prévia agora diferencia:

```text
impressão igual + equivalência canônica
→ cópia equivalente

impressão igual + conteúdo diferente
→ colisão descritiva
→ ambas podem ser guardadas
```

A impressão não volta a ser tratada como identidade.

## Mutações

Arquivamento, reativação e remoção devolvem:

```text
updated
unchanged
missing
ambiguous
stale
invalid
```

A store só chama `set` quando `registry !== previousRegistry`.

Assim:

- `updated` persiste uma nova biblioteca;
- `unchanged` não grava novamente o mesmo estado;
- recusas não produzem escrita disfarçada;
- a interface não anuncia sucesso em `missing`, `ambiguous`, `stale` ou `invalid`.

## Compatibilidade

A persistência continua usando a mesma chave e a mesma forma:

```text
athanor-continuous-received-state
schemaVersion: 1
registry
```

Nenhuma migração de IndexedDB é necessária.

## Fluxo atual

```text
arquivo validado
→ prévia usa equivalência canônica
→ consentimento explícito
→ store cria somente ID candidato e instante
→ adapter chama o domínio
→ domínio decide
→ store grava somente quando houve mudança
→ UI usa status, mensagem e storedId reais
```

## Limites

A fase não:

- autentica a origem;
- transforma impressão em prova;
- corrige bibliotecas incompatíveis;
- reescreve IDs, versões ou relógios;
- cria histórico de erros;
- adiciona analytics ou telemetria.

## Assinatura

**Tehkné Solutions**
