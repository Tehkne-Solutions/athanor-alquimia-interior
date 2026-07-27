# Fase 8.18 — O Campo que Não Some em Silêncio

**Assinatura:** Tehkné Solutions

## Objetivo

Recusar propriedades desconhecidas em pacotes de partilha e resposta antes da sanitização, impedindo que dados extras sejam apagados silenciosamente ou interpretados como compatíveis com um contrato que não os reconhece.

## Núcleo bíblico

- **Provérbios 25:11** inicia a reflexão sobre a palavra colocada de modo apropriado.
- A referência não transforma validação de schema em julgamento moral.
- Manifestos, caminhos, limites e regras de compatibilidade são estruturas autorais do Athanor.

## Política

- ID: `continuous-strict-contract-catalog`;
- versão: `1.0.0`;
- política: `reject-unknown-fields-before-sanitization-v1`;
- modo: `recursive-schema-manifest`;
- campos desconhecidos aceitos: não;
- remoção silenciosa: não;
- migração automática: não;
- máximo de caminhos exibidos: 20.

## Problema resolvido

Os parsers anteriores reconstruíam um objeto sanitizado somente com campos conhecidos. Isso era seguro contra persistência de dados extras, mas permitia que um arquivo contivesse propriedades desconhecidas que simplesmente desapareciam na cópia resultante.

Exemplo recusado:

```json
{
  "schema": "athanor-continuous-response-v1",
  "source": {
    "fingerprint": "received-12345678",
    "senderName": "campo não suportado"
  }
}
```

A Fase 8.18 não apaga `senderName`, não o guarda e não tenta adivinhar sua finalidade. O pacote é interrompido integralmente.

## Manifesto de partilha

### Nível superior

- `schema`;
- `policy`;
- `catalogVersion`;
- `generatedAt`;
- `provenance`;
- `collection`;
- `options`;
- `items`;
- `notices`;
- `consistency` opcional.

### Proveniência

- `product`;
- `author`;
- `transmission`.

### Coleção

- `templateId`;
- `label`;
- `status`;
- `itemCount`.

### Opções

- `includeDates`.

### Item

- `position`;
- `kind`;
- `startPoint`;
- `themeId` opcional;
- `noTheme`;
- `variantId`;
- `packageId` opcional;
- `packageLabel` opcional;
- `status`;
- `depth` opcional;
- `endedEarly`;
- `passageSummary`;
- `occurredAt` opcional;
- `completedAt` opcional.

### Resumo de passagens

- `completed`;
- `passed`;
- `pending`.

## Manifesto de resposta

### Nível superior

- `schema`;
- `policy`;
- `catalogVersion`;
- `generatedAt`;
- `provenance`;
- `source`;
- `gesture`;
- `expectation`;
- `notices`;
- `consistency` opcional.

### Origem

- `fingerprint`;
- `collectionLabel`;
- `itemCount`;
- `status`.

### Gesto

- `id`;
- `label`;
- `statement`.

### Expectativa

- `replyRequired`;
- `deliveryTracked`;
- `recipientStored`.

## Selo de consistência

Quando presente, aceita exclusivamente:

- `version`;
- `algorithm`;
- `scope`;
- `checksum`;
- `cryptographic`;
- `authenticatesIdentity`.

Um campo como `certificate`, `identity` ou `signature` é recusado mesmo que o checksum permaneça válido, pois todo o objeto `consistency` é excluído do próprio cálculo do selo.

## Ordem das barreiras

```text
tamanho do arquivo
→ leitura do texto
→ tamanho do texto bruto
→ chaves únicas
→ medida numérica exata
→ JSON.parse
→ forma JSON inerte
→ orçamento estrutural
→ texto Unicode visível
→ checksum
→ versão
→ contrato estrito de campos
→ schema e política
→ conteúdo curado
→ sanitização
```

## Por que depois da versão

A lista de campos pertence a uma versão específica. Uma versão futura é recusada antes de ser comparada ao manifesto atual, evitando que um contrato antigo julgue incorretamente um formato ainda não suportado.

## Por que antes do parser

O parser continua responsável por:

- campos obrigatórios;
- tipos;
- enums;
- relações entre valores;
- conteúdo curado;
- regras de datas e posições.

O contrato estrito responde somente a uma pergunta anterior: **todos os nomes presentes pertencem ao formato conhecido?**

## Diagnóstico

- caminhos usam representação ASCII segura;
- símbolos aparecem como `[symbol]`;
- no máximo 20 caminhos são listados;
- a quantidade restante é informada sem imprimir seus nomes;
- getters não são executados;
- o conteúdo do campo desconhecido não é interpretado.

## Compatibilidade

Campos opcionais conhecidos podem estar ausentes. A ordem das propriedades não importa.

Uma versão futura só poderá adicionar campos quando houver:

1. nova versão declarada;
2. manifesto correspondente;
3. migração explícita quando necessária;
4. testes de compatibilidade;
5. documentação de preservação do original.

## Persistência

A Fase 8.18 não cria:

- store Zustand;
- chave IndexedDB;
- cache de schema;
- histórico de recusas;
- analytics;
- telemetria;
- reparo automático.

## Limites da garantia

Contrato estrito não comprova:

- identidade;
- autoria humana;
- intenção;
- veracidade;
- segurança criptográfica;
- adequação moral ou espiritual do conteúdo.

Ele confirma apenas que nenhum nome adicional foi apresentado fora do formato conhecido.

## Critérios de validação

- campos oficiais aceitos;
- campos opcionais ausentes aceitos;
- propriedade extra superior recusada;
- propriedade extra aninhada recusada;
- propriedade extra em item recusada;
- propriedade extra no selo recusada;
- símbolos recusados sem descrição exposta;
- getters não executados;
- nomes herdados do protótipo não aceitos;
- diagnóstico limitado a 20 caminhos;
- checksum continua anterior ao contrato;
- versão continua anterior ao contrato;
- schema e conteúdo curado continuam posteriores;
- arquivos oficiais gerados pelo Athanor aceitos;
- nenhuma persistência adicional;
- assinatura exclusiva da Tehkné Solutions.
