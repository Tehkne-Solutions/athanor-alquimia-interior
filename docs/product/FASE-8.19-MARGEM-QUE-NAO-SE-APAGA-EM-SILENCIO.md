# Fase 8.19 — A Margem que Não se Apaga em Silêncio

**Assinatura:** Tehkné Solutions

## Objetivo

Impedir que textos conhecidos sejam alterados por `trim()` durante a geração, leitura ou sanitização de partilhas e respostas.

A fase recusa valores textuais com espaços ou quebras nas extremidades. O arquivo original permanece intacto e precisa ser corrigido deliberadamente fora do Athanor.

## Núcleo bíblico

- **Provérbios 22:28** inicia a reflexão sobre limites preservados.
- A referência não transforma whitespace em regra moral ou espiritual.
- Comparação por `trim`, diagnóstico de caminhos e posição no pipeline são estruturas autorais do Athanor.

## Catálogo

- ID: `continuous-exact-text-catalog`;
- versão: `1.0.0`;
- política: `reject-boundary-whitespace-before-sanitization-v1`;
- modo: `exact-string-boundaries`;
- comparação: `ecmascript-trim-equality`;
- diagnósticos máximos: 20;
- modifica entrada: não;
- preserva whitespace interno: sim;
- textos vazios: responsabilidade do domínio.

## Problema resolvido

Antes desta fase, alguns parsers reconstruíam campos usando `trim()`:

- rótulo da coleção;
- avisos;
- versão;
- data de geração;
- impressão descritiva;
- rótulo da origem.

Assim, um texto recebido como:

```text
" Coleção aberta "
```

podia ser armazenado como:

```text
"Coleção aberta"
```

A mudança não era visível como uma decisão separada.

A Fase 8.19 elimina essa reescrita.

## Regra

Para cada valor textual conhecido:

```ts
value === value.trim()
```

precisa ser verdadeiro.

Quando for falso, o pacote é recusado integralmente.

## O que é margem externa

A comparação segue a definição de `String.prototype.trim()` do runtime ECMAScript, incluindo whitespace e terminadores de linha reconhecidos pelo método.

Exemplos recusados:

```text
" Coleção"
"Coleção "
"\nAviso"
"Aviso\r\n"
"\tIdentificador"
"\u00A0Rótulo\u00A0"
```

## Conteúdo interno preservado

A fase não altera ou recusa whitespace interno apenas por existir.

Exemplos válidos:

```text
"Tempo  sem  prazo"
"Linha um\nLinha dois"
"Palavra\tseguinte"
```

Outras barreiras ainda podem avaliar controles Unicode ou limites de tamanho.

## Textos vazios

Uma string vazia é idêntica ao próprio `trim()` e, portanto, não é recusada por esta fase.

Obrigatoriedade e ausência continuam sob responsabilidade dos parsers de domínio.

## Ordem das barreiras

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
→ schema and policy
→ curated content
→ sanitization
```

### Razões da posição

- checksum permanece anterior para detectar conteúdo alterado sem novo selo;
- versão permanece anterior para não aplicar regras atuais a formatos desconhecidos;
- contrato estrito permanece anterior para limitar a inspeção aos campos conhecidos;
- schema e conteúdo curado permanecem posteriores;
- sanitização ocorre somente depois que nenhuma margem precisa ser removida.

## Geração

As funções abaixo validam o payload antes do checksum:

- `createContinuousCollectionShareExport`;
- `createContinuousResponseExport`.

Um rótulo, versão, data, impressão ou aviso com margem externa impede a geração.

Nenhum arquivo parcialmente corrigido é produzido.

## Recepção

`parseContinuousCollectionShareWithConsistency` aplica a barreira depois do contrato estrito e antes de `parseContinuousCollectionShare`.

Quando a margem é válida:

- o parser copia o texto exatamente;
- nenhum `trim()` é aplicado;
- a cópia sanitizada recebe novo selo local.

## Retorno

`parseContinuousResponseReturnWithConsistency` usa a mesma ordem.

A prévia transitória contém exatamente os valores aprovados pela barreira, sem remoção de espaços ou quebras.

## Parsers internos

Os parsers de coleção recebida e retorno não usam `trim()` para construir a saída.

Mesmo quando chamados diretamente, eles preservam o valor textual recebido. O fluxo público continua responsável por recusar margens antes dessa chamada.

## Diagnósticos

O diagnóstico informa:

- caminho estrutural;
- existência de margem inicial;
- existência de margem final;
- quantidade em unidades UTF-16 removíveis por `trim`.

O conteúdo da string não é reproduzido.

Exemplo:

```text
Pacote de partilha: texto em $["collection"]["label"] possui margem inicial (1) e final (1); nenhuma margem foi removida.
```

No máximo vinte caminhos são exibidos. O total continua disponível nas estatísticas de domínio.

## Inspeção segura

A travessia:

- é iterativa;
- usa descritores próprios;
- não executa getters;
- não altera objetos;
- evita ciclos com `WeakSet`;
- não reproduz nomes Unicode de forma insegura.

As barreiras anteriores continuam responsáveis por recusar comportamento oculto e campos desconhecidos.

## Persistência

A Fase 8.19 não cria:

- store Zustand;
- chave IndexedDB;
- histórico de recusas;
- contador;
- cache de correções;
- telemetria;
- analytics;
- comunicação de rede.

## Limites

A fase não:

- corrige o arquivo;
- remove margens;
- comprime espaços internos;
- converte quebras de linha;
- normaliza Unicode;
- traduz ou resume texto;
- autentica identidade ou autoria;
- comprova intenção ou veracidade;
- julga qualidade, educação ou valor pessoal.

## Critérios de validação

- Provérbios 22:28 registrado editorialmente;
- catálogo e política validados por Zod;
- margem inicial recusada;
- margem final recusada;
- ambas as margens recusadas;
- tabulações e quebras externas recusadas;
- espaço não separável externo recusado;
- whitespace interno preservado;
- texto vazio delegado ao domínio;
- caminhos aninhados e listas inspecionados;
- máximo de vinte diagnósticos;
- getters não executados;
- objetos não modificados;
- ciclos não causam loop;
- novas partilhas validadas antes do selo;
- novas respostas validadas antes do selo;
- checksum e contrato mantêm precedência;
- parsers deixam de usar `trim()` na saída;
- nenhuma persistência adicional;
- assinatura exclusiva da Tehkné Solutions.
