# Fase 8.6 — A Coleção que Cresce sem Acumular Valor

**Assinatura:** Tehkné Solutions

## Objetivo

Permitir que Rastros e ciclos temáticos sejam reunidos em coleções locais, versionadas e reversíveis, sem transformar quantidade, preenchimento, ordem ou raridade em pontuação, mérito ou evolução pessoal.

## Núcleo bíblico

- **Provérbios 24:3–4** inicia a reflexão sobre casa, organização e preenchimento.
- A referência não promete prosperidade, superioridade, completude ou aprovação espiritual.
- Catálogo, modelos, ordenação, importação e arquivo são estruturas autorais do Athanor.

## Catálogo

- ID: `continuous-collection-catalog`;
- versão: `1.0.0`;
- política: `explicit-reference-no-accumulated-value-v1`;
- modo: `local-curated-references`;
- importação aceita: `athanor-continuous-map-export-v1`;
- compartilhamento futuro: somente com consentimento explícito.

## Modelos curados

1. Coleção aberta;
2. Palavra e formulação;
3. Água, memória e apoio;
4. Fogo, limite e transformação;
5. Terra, recurso e ritmo;
6. Espírito e síntese possível;
7. Repouso e memória preservada.

Os modelos fornecem apenas rótulos e descrições curadas. Não existe nome livre nesta fase.

## Domínio

### Registro

O store `athanor-continuous-collection-state` mantém:

- versão do schema;
- versão do catálogo;
- coleções ativas e arquivadas;
- referências ordenadas;
- snapshots sanitizados dos itens;
- origem local ou importada;
- datas locais.

### Coleção

Uma coleção possui:

- ID local;
- modelo;
- rótulo curado;
- estado ativo ou arquivado;
- lista ordenada de referências;
- datas de criação, alteração e arquivo.

Coleções vazias são válidas.

### Referência

Cada referência utiliza a chave:

```text
<tipo>:<id>
```

Tipos permitidos:

- `trail`;
- `theme-cycle`.

Adicionar uma referência cria um snapshot descritivo e não modifica o item de origem.

## Ações

- criar coleção vazia;
- selecionar coleção;
- adicionar item do mapa local;
- importar itens de um mapa exportado;
- remover referência;
- mover referência para cima ou para baixo;
- arquivar coleção;
- reativar coleção.

Ordenação manual não representa prioridade.

## Importação segura

A importação:

1. lê um arquivo JSON local;
2. exige schema `athanor-continuous-map-export-v1`;
3. exige política `descriptive-local-no-ranking-v1`;
4. valida cada item;
5. remove propriedades não reconhecidas;
6. preserva itens não vinculados como desconhecidos;
7. ignora referências duplicadas ao adicionar;
8. não restaura jornadas ou stores de origem.

Arquivos incompatíveis são rejeitados com mensagens locais.

## Arquivo e reativação

Coleções arquivadas:

- permanecem visíveis;
- preservam sua ordem e referências;
- não aceitam inclusão, remoção ou reordenação;
- podem ser reativadas explicitamente.

## Segurança

- nenhuma recompensa por quantidade;
- nenhuma pontuação de completude;
- nenhuma raridade;
- nenhuma prioridade implícita;
- nenhuma interpretação de registros desconhecidos;
- nenhum texto pessoal;
- nenhuma emoção ou nota importada;
- nenhum compartilhamento nesta fase;
- todos os dados permanecem locais.

## Rotas

```text
/temple/continuous-collections
```

A central de jornadas contínuas oferece acesso permanente às coleções.

## QA

O painel de QA exibe:

- ID da coleção;
- modelo;
- rótulo;
- estado;
- ordem das referências;
- origem local ou importada;
- vínculo conhecido ou desconhecido.

O reset global elimina o store de coleções.

## Critérios de validação

- validação editorial de Provérbios 24:3–4;
- sete modelos únicos;
- coleção aberta obrigatória;
- restrição explícita contra valor por quantidade;
- criação de coleção vazia;
- inclusão e deduplicação;
- remoção sem exclusão da origem;
- ordenação manual;
- arquivo e reativação;
- importação válida e rejeição de schema incompatível;
- preservação de itens não vinculados;
- build TypeScript e Vite.
