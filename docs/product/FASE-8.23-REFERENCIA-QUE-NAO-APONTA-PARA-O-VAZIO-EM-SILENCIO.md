# Fase 8.23 — A Referência que Não Aponta para o Vazio em Silêncio

**Assinatura:** Tehkné Solutions

## Objetivo

Impedir que modelos, temas, variantes, pacotes ou gestos desconhecidos sejam aceitos como se pertencessem aos catálogos atuais do Athanor.

A fase não corrige IDs, não procura opções semelhantes e não transforma uma referência desconhecida em outra conhecida.

## Núcleo bíblico

- **1 Coríntios 14:40** inicia a reflexão sobre ordem explícita.
- A referência não transforma catálogo técnico em autoridade espiritual ou pessoal.
- Manifestos, compatibilidade entre IDs e interrupção de referências desconhecidas são estruturas autorais do Athanor.

## Política

- ID: `continuous-catalog-reference-catalog`;
- versão: `1.0.0`;
- política: `reject-unknown-or-mismatched-catalog-references-before-domain-v1`;
- fonte: catálogos curados embarcados;
- tema desconhecido sem ID explícito: permitido;
- ID desconhecido fornecido: recusado;
- substituição automática: não;
- máximo de diagnósticos: 20.

## Catálogos usados

A validação consulta somente catálogos locais versionados:

- `continuousCollectionTemplates`;
- `continuousThemes`;
- `continuousTrailVariants`;
- `continuousThemeCyclePackages`;
- `continuousResponseGestures`.

Nenhuma consulta de rede é feita.

## Partilha

### Modelo da coleção

`collection.templateId` precisa existir entre os modelos atuais.

O rótulo da coleção não precisa ser igual ao modelo, pois coleções podem manter um rótulo próprio. Apenas o identificador estrutural é catalogado.

### Tema

Quando `themeId` existe:

- o ID precisa existir;
- o tema precisa aceitar o `startPoint` declarado.

Quando `themeId` está ausente e `noTheme` é `false`, o Athanor preserva **tema desconhecido** como estado válido. Nenhum tema é inferido.

### Variante

`variantId` precisa:

- existir em `continuousTrailVariants`;
- pertencer ao mesmo `startPoint` do item.

Uma variante conhecida de outro elemento é recusada.

### Pacote de ciclo

Para `kind: theme-cycle`, o pacote precisa:

- existir pelo `packageId`;
- manter o `packageLabel` oficial;
- aceitar o `startPoint`;
- corresponder ao tema declarado;
- usar `no-theme` quando existe ausência explícita ou tema desconhecido sem ID.

A Fase 8.22 continua responsável por exigir o par `packageId` + `packageLabel` e impedir pacotes em Rastros.

## Resposta

O gesto exportável precisa:

- existir no catálogo;
- possuir `createsFile: true`;
- manter o rótulo oficial;
- manter a declaração oficial.

O gesto `silence` continua válido como escolha de produto, mas não é uma referência exportável porque não gera arquivo.

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
→ discriminant field compatibility
→ catalog reference integrity
→ schema and policy
→ curated content
→ sanitization
```

## Precedência

- checksum vem antes para impedir avaliação de arquivo alterado;
- versão vem antes para impedir uso do catálogo atual sobre formato desconhecido;
- contrato e compatibilidade vêm antes para confirmar a forma das referências;
- referência catalogada vem antes do parser de domínio e da sanitização;
- schema, política e conteúdo curado continuam posteriores.

## Interrupção

Quando uma referência é recusada, o Athanor não:

- substitui por ID parecido;
- corrige rótulo;
- remove a referência;
- escolhe a primeira opção do catálogo;
- tenta buscar uma versão online;
- cria pacote parcial;
- altera o arquivo original;
- registra a recusa.

## Limites da garantia

Uma referência conhecida comprova somente que o ID e suas relações pertencem aos catálogos embarcados naquela versão.

Ela não comprova:

- identidade;
- autoria humana;
- origem do dispositivo;
- evento real;
- intenção;
- veracidade;
- significado pessoal;
- autenticação criptográfica.

## Persistência

A Fase 8.23 não cria:

- store Zustand;
- chave IndexedDB;
- histórico de referências recusadas;
- cache remoto;
- analytics;
- telemetria;
- sincronização.

## Critérios de validação

- modelo conhecido aceito;
- modelo desconhecido recusado;
- tema conhecido e compatível aceito;
- tema desconhecido fornecido recusado;
- ausência de tema explícito preservada;
- variante conhecida e compatível aceita;
- variante desconhecida ou de outro elemento recusada;
- pacote conhecido, rotulado e compatível aceito;
- pacote desconhecido, divergente ou ligado ao tema errado recusado;
- gesto exportável oficial aceito;
- gesto desconhecido, silêncio, rótulo ou declaração divergente recusados;
- checksum e compatibilidade mantêm precedência;
- geração e recepção aplicam a mesma política;
- assinatura exclusiva da Tehkné Solutions.
