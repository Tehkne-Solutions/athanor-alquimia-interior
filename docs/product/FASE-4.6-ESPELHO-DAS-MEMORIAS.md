# Fase 4.6 — O Espelho das Memórias

**Produto:** Athanor — Alquimia Interior  
**Capítulo:** Água  
**Missão:** O Espelho das Memórias  
**Mini-game:** Reflexo e Presença  
**Componente:** Espelho das Águas  
**Assinatura:** Tehkné Solutions

## Objetivo

Ensinar a distinção entre:

- memória;
- sensação atual;
- previsão;
- necessidade;
- ação.

A missão não valida lembranças, não investiga causas, não interpreta traumas e não atribui significado oculto às experiências.

## Núcleo bíblico

A missão utiliza o **Salmo 77** como referência editorial de memória, busca e meditação.

O produto mantém separados:

1. referência bíblica;
2. contexto editorial;
3. aplicação didática;
4. correspondências opcionais;
5. item de gameplay.

Nenhum texto bíblico é apresentado como diagnóstico, previsão ou confirmação da precisão de uma memória.

## Mini-game Reflexo e Presença

O jogador classifica dez frases fictícias entre cinco categorias.

As frases não são autobiográficas e não solicitam relatos pessoais.

A atividade pode ser concluída:

- classificando todas as frases;
- sem classificar nenhuma frase.

Divergências em relação à proposta editorial:

- geram somente feedback didático;
- não bloqueiam o item;
- não alteram recompensa;
- não reduzem progresso;
- não medem inteligência, atenção ou saúde.

## Prática de retorno

A missão oferece cinco âncoras opcionais:

- cor;
- som;
- ponto de apoio;
- textura;
- objeto.

O sistema registra somente quais tipos de observação foram realizados. O conteúdo observado não é armazenado.

## Cadeia simbólica

### Yesod

Usado como comparação temática do Athanor para organizar a arquitetura de memória, imagem e vínculo.

Classe: `CMP`.

Fallback: **Câmara da Memória**.

### Mem

O Sefer Yetzirah relaciona Mem à Água. O uso da letra como componente do Espelho é uma adaptação identificada.

Classe da fonte: `SRC`.

Fallback: **Símbolo da Profundidade**.

### Kan

O Livro das Mutações relaciona Kan à Água. A conexão com travessia entre memória e presente é comparativa.

Classe da aplicação: `CMP`.

Fallback: **Movimento da Travessia**.

### A Sacerdotisa

Camada arquetípica opcional de silêncio e interioridade. Não revela conteúdos ocultos nem interpreta lembranças.

Classe: `CMP`.

Fallback: **Guardiã do Silêncio**.

### Espelho das Águas

Criação autoral do Athanor.

Classe: `ATH`.

## Dependências

A missão exige, na jornada atual:

1. Gota Nomeada;
2. Fragmento do Lamento.

O progresso é vinculado ao `startedAt` da jornada da Água para impedir reaproveitamento após reset ou fundação de um novo Templo.

## Privacidade

- persistência local em IndexedDB;
- nenhuma memória pessoal solicitada;
- nenhuma observação ambiental detalhada armazenada;
- nenhum conteúdo enviado para analytics;
- reset de QA remove também o estado do Espelho.

## Arquivos principais

- `src/domain/waterMemory.ts`;
- `src/domain/waterMemory.test.ts`;
- `src/state/useWaterMemoryStore.ts`;
- `src/pages/WaterMemoryPage.tsx`;
- `src/styles/water-memory.css`;
- `src/content/water.ts`.

## Critérios de aceite

- a missão permanece bloqueada sem as duas etapas anteriores;
- as dez frases podem ser classificadas por toque ou teclado;
- a atividade pode ser concluída sem classificação;
- diferenças não alteram a recompensa;
- a prática de presença não armazena detalhes;
- as camadas opcionais possuem fallbacks;\;
- reset de QA remove o estado separado.

## Segurança

O Espelho das Águas:

- não confirma lembranças;
- não verifica precisão histórica;
- não interpreta trauma;
- não mede atenção, inteligência ou saúde;
- não prevê repetição de acontecimentos;
- não transforma diferenças de classificação em perda de recompensa;
- não apresenta Yesod, Mem, Kan ou Tarot como conteúdo bíblico.

## Critérios de aceite

- a missão permanece bloqueada antes do Fragmento do Lamento;
- todas as frases podem ser classificadas por toque ou teclado;
- o usuário pode concluir sem classificar;
- diferenças são apresentadas como feedback didático;
- a recompensa independe do resultado;
- camadas desativadas usam fallbacks autorais;
- o Espelho aparece como terceiro componente;
- conteúdo e fallback passam pela validação automática;
- testes e build passam no Athanor CI.

**Tehkné Solutions**
