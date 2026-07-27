# Fase 8.20 — O Tempo que Não se Converte em Silêncio

**Assinatura:** Tehkné Solutions

## Objetivo

Impedir que campos temporais conhecidos sejam interpretados, deslocados de fuso, completados ou normalizados silenciosamente durante a geração e a leitura dos arquivos compartilhados.

## Núcleo bíblico

- **Eclesiastes 3:1** inicia a reflexão sobre tempos distintos.
- A referência não transforma data técnica em prova espiritual, histórica ou pessoal.
- Formato UTC, round-trip e relações temporais são estruturas autorais do Athanor.

## Formato aceito

```text
YYYY-MM-DDTHH:mm:ss.sssZ
```

Exemplo:

```text
2026-07-27T22:00:00.000Z
```

Requisitos:

- quatro dígitos de ano;
- mês, dia, hora, minuto e segundo com dois dígitos;
- exatamente três dígitos de milissegundos;
- sufixo `Z` maiúsculo;
- fuso UTC;
- round-trip idêntico em `new Date(value).toISOString()`.

## Recusas

São recusados:

- horários sem fuso;
- offsets como `+00:00` ou `-03:00`;
- precisão ausente ou diferente de três milissegundos;
- datas impossíveis;
- segundos intercalares;
- `z` minúsculo;
- separador em espaço;
- valores que o `Date` normalizaria para outro instante;
- conclusão anterior à ocorrência quando ambos os campos existem.

## Campos cobertos

### Partilha

- `generatedAt`;
- `items[].occurredAt`, quando presente;
- `items[].completedAt`, quando presente.

### Resposta

- `generatedAt`.

Campos opcionais ausentes permanecem ausentes.

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
→ schema and policy
→ curated content
→ sanitization
```

A regra temporal vem depois do checksum, versão, contrato e margens. Assim, arquivos alterados, formatos desconhecidos ou textos com margens são interrompidos pela barreira correspondente antes da análise temporal.

## Geração

Partilhas e respostas só são seladas quando seus campos temporais passam pela mesma validação aplicada às entradas.

O Athanor não gera:

- offset local;
- data parcial;
- horário sem fuso;
- precisão aproximada;
- correção automática.

## Limites

Formato canônico não comprova:

- que o relógio do dispositivo estava correto;
- que a data representa um evento verdadeiro;
- identidade ou autoria;
- intenção;
- ordem causal entre pessoas;
- autenticidade criptográfica.

## Persistência

A Fase 8.20 não cria:

- store;
- chave IndexedDB;
- histórico de recusas;
- correções persistidas;
- telemetria;
- analytics;
- sincronização.

## Critérios de validação

- instante UTC canônico aceito;
- ano bissexto válido aceito;
- data impossível recusada;
- offset recusado;
- fuso ausente recusado;
- precisão diferente de três dígitos recusada;
- segundo intercalar recusado;
- relação ocorrência/conclusão validada;
- geração de partilha protegida;
- geração de resposta protegida;
- recepção protegida;
- retorno protegido;
- checksum, versão, contrato e margens mantêm precedência;
- nenhuma normalização do arquivo;
- assinatura exclusiva da Tehkné Solutions.
