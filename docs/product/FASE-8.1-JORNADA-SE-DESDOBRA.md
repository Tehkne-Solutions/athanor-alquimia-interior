# Fase 8.1 — A Jornada que se Desdobra

**Assinatura:** Tehkné Solutions

## Objetivo

Transformar uma instância ativa da jornada contínua em um percurso curto, curado e independente, composto por orientação, observação e revisão.

O percurso não reinicia missões elementais, não copia respostas anteriores e não oferece progressão por repetição.

## Dependência

A fase exige uma instância da Fase 8.0 no estado `active`.

Cada instância aceita somente um Rastro. Encerrar ou arquivar a instância preserva o Rastro existente, mas impede iniciar outro para a mesma instância.

## Conteúdo por semente

A semente da instância é usada somente para selecionar deterministicamente uma variante curada.

A seleção considera:

- ciclo do Espírito de origem;
- registro da Nova Obra;
- elemento escolhido;
- modalidade escolhida.

Ela não utiliza:

- respostas anteriores;
- notas pessoais;
- classificações;
- emoções registradas;
- destinos de componentes;
- dados clínicos.

Existem duas variantes auditáveis para cada ponto:

- Palavra;
- Água;
- Fogo;
- Terra;
- Espírito;
- repouso.

## Etapas

### 1. Orientação

Apresenta o primeiro prompt curado e permite:

- escolher uma prática do elemento;
- permanecer sem prática;
- passar a etapa;
- pausar.

### 2. Observação

Apresenta uma observação fictícia e permite:

- concluir;
- passar;
- pausar.

### 3. Revisão

Apresenta uma revisão sem ranking e permite:

- concluir;
- passar;
- pausar.

Concluir ou passar a revisão cria o **Rastro da Jornada Contínua**.

## Rastro da Jornada Contínua

O Rastro registra apenas:

- instância de origem;
- registro da Nova Obra;
- ciclo do Espírito;
- elemento;
- variante curada;
- prática escolhida ou ausência explícita;
- resultado de cada etapa;
- datas locais do ciclo.

O componente não representa:

- evolução;
- coerência;
- cura;
- direção espiritual;
- produtividade;
- recompensa.

## Pausa e retomada

Pausar preserva:

- etapa atual;
- prática selecionada;
- ausência de prática;
- etapas já concluídas ou passadas.

A retomada exige que a instância de origem esteja ativa.

## Segurança

- Todo cenário é fictício e curado.
- Nenhuma etapa solicita texto pessoal.
- Passar tem o mesmo valor de conclusão.
- Permanecer sem prática é válido.
- Nenhuma ação externa é executada.
- Não existem notificações, cronômetros ou streaks.
- O conteúdo não produz diagnóstico, previsão ou leitura oculta.
- Todos os dados permanecem no dispositivo.

## Arquivos principais

- `src/domain/continuousTrail.ts`
- `src/domain/continuousTrail.test.ts`
- `src/content/continuousTrail.ts`
- `src/content/validateContinuousTrail.ts`
- `src/state/useContinuousTrailStore.ts`
- `src/pages/ContinuousTrailPage.tsx`
- `src/styles/continuous-trail.css`

## Critérios de validação

- A mesma semente seleciona a mesma variante.
- Uma instância recebe somente um Rastro.
- Uma instância pausada não inicia um novo Rastro.
- Orientação concluída exige prática ou ausência explícita.
- Passar não exige prática.
- Pausa e retomada preservam a seleção.
- Revisão concluída ou passada cria o Rastro.
- O reset de QA remove todo o registro da Fase 8.1.

**Tehkné Solutions**
