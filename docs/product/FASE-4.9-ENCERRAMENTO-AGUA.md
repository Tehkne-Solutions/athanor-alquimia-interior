# Fase 4.9 — Encerramento da Água e Abertura da Forja

**Produto:** Athanor — Alquimia Interior  
**Capítulo encerrado:** Água  
**Próxima fundação:** Fogo  
**Assinatura:** Tehkné Solutions

## Objetivo

Concluir formalmente o primeiro ciclo da Água somente depois que o Cálice da Memória Serena tiver sido criado, revisado, integrado e posicionado.

## Revisão geral

As quatro missões recebem um destino explícito:

- preservar;
- repousar;
- arquivar.

Os destinos não representam sucesso, fracasso, cura, regressão ou intensidade emocional. Uma nota de encerramento pode ser registrada localmente, mas permanece opcional.

## Ciclo registrado

A conclusão cria um identificador local para o primeiro ciclo da Água e armazena:

- identificador da jornada;
- destino de cada prática;
- nota opcional;
- data de início;
- data de conclusão.

O registro não inclui conteúdo textual do lamento, detalhes de memórias, observações sensoriais ou dados clínicos.

## Transformação do Templo

Após a conclusão:

- a Câmara dos Salmos passa para `restored` e 100%;
- o Cálice é registrado como item posicionado na Câmara;
- a Forja dos Elementos passa para `available`;
- a primeira missão futura recebe o ID `mission_name_flame_v1`;
- o Átrio recebe progresso visual;
- o nível do Templo avança;
- o personagem passa para a faixa narrativa `form`.

## Fundação do Fogo

A nova sala apresenta:

- Provérbios 16:32 como núcleo editorial inicial;
- distinção futura entre emoção, intensidade, impulso, necessidade e ação;
- Gevurah apenas como comparação opcional;
- Câmara do Limite como fallback autoral;
- Chama Nomeada como componente futuro;
- limites contra confronto perigoso, retaliação e violência.

A missão O Nome da Chama ainda não está implementada nesta fase.

## Segurança

- concluir a Água não afirma resolução emocional;
- o app não interpreta lembranças ou causas;
- os destinos da revisão não recebem ranking;
- nenhum destino altera recompensa;
- a Forja não autoriza ação ou confronto;
- estados críticos continuam interrompendo o simbolismo;
- todos os dados permanecem no dispositivo.

## Arquitetura

Novos módulos:

- `src/domain/waterChapter.ts`;
- `src/state/useWaterChapterStore.ts`;
- `src/pages/WaterChapterReviewPage.tsx`;
- `src/content/fireFoundation.ts`;
- `src/pages/ForgePage.tsx`;
- `src/styles/water-chapter.css`;
- `src/styles/fire.css`.

## Critérios de aceite

- o capítulo não pode ser concluído sem Cálice integrado e posicionado;
- as quatro missões precisam de destino;
- a nota deve ser opcional;
- a Câmara deve ser restaurada de forma idempotente;
- a Forja deve permanecer fechada antes da conclusão;
- usuários com conclusão persistida devem recuperar a abertura da Forja;
- o reset de QA deve remover o ciclo separado;
- conteúdo, testes, TypeScript e build devem passar no CI.
