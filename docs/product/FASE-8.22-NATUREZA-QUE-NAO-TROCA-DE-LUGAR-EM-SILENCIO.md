# Fase 8.22 — A Natureza que Não Troca de Lugar em Silêncio

**Assinatura:** Tehkné Solutions

## Objetivo

Interromper pacotes cujos campos conhecidos, formatos e relações gerais são válidos, mas cuja combinação contradiz o tipo ou o indicador declarado.

A fase não preenche, remove, converte ou reinterpretа campos. O arquivo inteiro é recusado antes do parser de domínio.

## Núcleo bíblico

- **1 Coríntios 12:4–6** inicia a reflexão sobre diversidade de funções sem hierarquia de valor.
- A referência não transforma discriminantes técnicos em classificação espiritual.
- Tipo, tema, pacote, estado e encerramento são estruturas autorais do Athanor.

## Política

```text
reject-discriminant-field-conflicts-before-domain-v1
```

## Problema resolvido

Um item poderia conter valores individualmente reconhecidos e ainda misturar naturezas incompatíveis:

```json
{
  "kind": "trail",
  "packageId": "cycle-clarity",
  "packageLabel": "Ciclo de clareza",
  "depth": 2
}
```

Ou declarar simultaneamente:

```json
{
  "themeId": "theme-clarity",
  "noTheme": true
}
```

Essas combinações não são campos desconhecidos, erros de formato ou contradições de quantidade. Por isso exigem uma barreira própria.

## Regras de tema

- `themeId` presente exige `noTheme !== true`;
- `noTheme: true` exige ausência de `themeId`;
- ausência de `themeId` com `noTheme: false` continua representando tema desconhecido;
- nenhum tema é inferido ou escolhido automaticamente.

## Regras de pacote

- `packageId` e `packageLabel` precisam aparecer juntos;
- a fase não exige pacote quando ambos estão ausentes;
- a fase não cria rótulo a partir do identificador;
- Rastros não podem declarar pacote de ciclo temático.

## Regras discriminadas por `kind`

### Rastro

Um item com `kind: trail` não pode declarar:

- `packageId`;
- `packageLabel`;
- `depth`;
- `status: declined`;
- `endedEarly: true`.

### Ciclo temático

Um item com `kind: theme-cycle` pode usar os campos de pacote, profundidade, recusa e encerramento antecipado quando respeita as demais regras.

O contrato atual mantém pacote e profundidade opcionais. A Fase 8.22 não transforma ausência em erro.

## Regras de estado e encerramento

- `status: declined` exige `kind: theme-cycle`;
- `endedEarly: true` exige `kind: theme-cycle`;
- `endedEarly: true` exige `status: incomplete`;
- `status: completed` exige `endedEarly: false`;
- `status: completed` exige `passageSummary.pending === 0` quando o resumo está presente e numérico.

Tipos inválidos continuam sendo responsabilidade do parser de domínio.

## Tema desconhecido

Este estado permanece válido:

```json
{
  "noTheme": false
}
```

sem `themeId`.

Ele significa apenas que a referência não declara tema explícito nem ausência explícita de tema. A barreira não converte esse estado em `noTheme: true`.

## Respostas

O pacote de resposta atual não possui discriminantes opcionais adicionais equivalentes aos itens da partilha.

A função de compatibilidade da resposta retorna sucesso explícito e documenta essa ausência, preservando uma posição estável no pipeline para versões futuras.

## Ordem no pipeline

```text
file.size
→ file.text()
→ text.length
→ unique decoded object keys
→ exact numeric lexemes
→ JSON.parse
→ inert JSON
→ structural budget
→ visible Unicode text
→ checksum
→ version
→ strict field contract
→ exact text boundaries
→ exact UTC time
→ exact cross-field relations
→ discriminant field compatibility
→ schema and policy
→ curated content
→ sanitization
```

A barreira executa depois das relações gerais da Fase 8.21 e antes do parser de domínio.

## Geração

Novas partilhas são validadas antes do checksum.

Se uma coleção local contiver um item incompatível:

- nenhum download é criado;
- nenhum campo é removido;
- nenhum status é alterado;
- nenhum pacote é completado;
- nenhum selo é calculado.

As respostas passam pela mesma posição do pipeline, mesmo sem regras adicionais na versão atual.

## Recepção

Pacotes recebidos são verificados depois de checksum, versão, contrato, margens, tempo e relações gerais.

Isso garante que:

- um arquivo adulterado falha no checksum primeiro;
- um formato desconhecido falha na versão ou no contrato primeiro;
- uma cronologia contraditória falha na Fase 8.21 primeiro;
- somente então a natureza dos campos é comparada.

## Diagnósticos

- no máximo 20 mensagens;
- caminhos usam índices dos itens;
- nenhum conteúdo pessoal é reproduzido;
- nenhum reparo é oferecido como automático;
- nenhum primeiro ou último campo é escolhido.

## Persistência

A fase não cria:

- store Zustand;
- chave IndexedDB;
- cache;
- histórico de recusas;
- contador;
- analytics;
- telemetria;
- comunicação de rede.

## Limites da garantia

Compatibilidade estrutural não comprova:

- que o evento ocorreu;
- que o tema descreve uma pessoa;
- que o estado é verdadeiro;
- identidade ou autoria;
- intenção;
- segurança criptográfica.

## Critérios de validação

- referência editorial registrada;
- tema explícito incompatível com `noTheme: true`;
- tema desconhecido preservado;
- pacote parcial recusado;
- pacote completo aceito em ciclo;
- pacote e profundidade recusados em Rastro;
- `declined` recusado em Rastro;
- encerramento antecipado restrito a ciclo incompleto;
- conclusão com pendências recusada;
- checksum anterior à compatibilidade;
- relações gerais anteriores à compatibilidade;
- parser posterior à compatibilidade;
- geração real protegida;
- resposta atual preservada;
- nenhuma persistência nova;
- assinatura exclusiva da Tehkné Solutions.
