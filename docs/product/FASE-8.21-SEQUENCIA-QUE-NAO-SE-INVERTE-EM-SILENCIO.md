# Fase 8.21 — A Sequência que Não se Inverte em Silêncio

**Assinatura:** Tehkné Solutions

## Objetivo

Interromper pacotes cujos campos são individualmente válidos, mas se contradizem quando observados em conjunto. A fase não corrige, reordena, completa ou recalcula o conteúdo.

## Núcleo bíblico

- **Eclesiastes 3:11** inicia a reflexão sobre sequência e limite humano diante do tempo.
- A referência não transforma coerência técnica em prova de verdade, destino ou controle.
- As invariantes relacionais são estruturas autorais do Athanor.

## Política

```text
reject-cross-field-contradictions-before-domain-v1
```

## Relações da partilha

### Quantidade

```text
collection.itemCount === items.length
```

Uma coleção vazia com quantidade zero continua válida.

### Posições

Cada item precisa ocupar exatamente sua posição na lista:

```text
items[0].position === 1
items[1].position === 2
...
```

A fase não reordena itens e não corrige posições.

### Política de datas

Quando:

```text
options.includeDates === false
```

nenhum item pode conter `occurredAt` ou `completedAt`.

### Dependência temporal

`completedAt` só pode existir quando `occurredAt` também existe no mesmo item.

### Ordem temporal

Quando ambos existem:

```text
occurredAt <= completedAt
```

### Limite da geração

Instantes internos não podem ser posteriores à geração do pacote:

```text
occurredAt <= generatedAt
completedAt <= generatedAt
```

## Respostas

O pacote de resposta possui somente `generatedAt` como instante. A Fase 8.21 registra explicitamente que não existe relação temporal adicional a inferir.

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
→ exact UTC time
→ exact cross-field relations
→ schema and policy
→ curated content
→ sanitization
```

## Separação de responsabilidades

A Fase 8.20 valida somente o formato de cada instante. A Fase 8.21 valida relações entre campos já reconhecidos.

Isso evita diagnósticos concorrentes:

- formato impossível ou não canônico → Fase 8.20;
- formato válido, mas sequência contraditória → Fase 8.21.

## Relógio atual

A validação não compara o pacote com `Date.now()` nem com o relógio atual do dispositivo. Um pacote pode declarar datas futuras em relação ao dispositivo e ainda ser internamente coerente.

Isso preserva o limite da garantia: o Athanor não sabe se o relógio de origem ou de leitura estava correto.

## Geração

A barreira é aplicada antes do checksum em:

- `createContinuousCollectionShareExport`;
- `createContinuousResponseExport`.

A resposta sempre passa pela relação neutra documentada. A partilha é recusada quando qualquer invariante falha.

## Recepção

A barreira é aplicada depois de:

- checksum;
- versão;
- contrato estrito;
- margens textuais;
- formato temporal.

E antes de:

- schema e política;
- conteúdo curado;
- sanitização.

## Persistência

A Fase 8.21 não cria:

- store Zustand;
- chave IndexedDB;
- histórico de contradições;
- contador;
- analytics;
- telemetria;
- sincronização.

## Limites

A coerência relacional não comprova:

- que os eventos aconteceram;
- que as datas são verdadeiras;
- que o relógio de origem estava correto;
- identidade ou autoria;
- intenção ou veracidade;
- autenticidade criptográfica.

## Critérios de validação

- quantidade corresponde à lista;
- posições sequenciais iniciam em 1;
- datas respeitam `includeDates`;
- conclusão exige ocorrência;
- conclusão não antecede ocorrência;
- instantes internos não ultrapassam `generatedAt`;
- igualdade temporal permanece válida;
- coleção vazia permanece válida;
- relógio atual não participa;
- nenhuma correção automática;
- geração e entrada protegidas;
- assinatura exclusiva da Tehkné Solutions.
