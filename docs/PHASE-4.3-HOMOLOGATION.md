# Fase 4.3 — Homologação Visual e Pesquisa Moderada

## Objetivo

Preparar o vertical slice do Athanor para sessões reais de avaliação em celular, tablet, notebook e desktop, mantendo dados privados fora dos relatórios.

## Entregas

- modo interno de homologação em `/homologation`;
- roteiro com onze tarefas moderadas;
- estados de tarefa: não testada, concluída, com fricção e bloqueada;
- notas por tarefa;
- avaliações de compreensão, navegação, conforto visual e confiança;
- exportação JSON local;
- nenhum acesso ao Diário, check-ins, missão ativa ou inventário do participante;
- skip link para o conteúdo principal;
- anúncio de mudanças de rota para tecnologias assistivas;
- progresso semântico do onboarding;
- seleção com `aria-pressed`;
- ajustes de layout para 360, 390, 768, 1366 e 1440 pixels;
- safe area na navegação móvel;
- testes do relatório, progresso do onboarding e anúncio de rota.

## Roteiro de sessão

1. Criar personagem.
2. Fundar o Templo.
3. Configurar fontes.
4. Localizar a missão principal.
5. Classificar as afirmações.
6. Explicar a proveniência.
7. Forjar e posicionar a Lâmpada.
8. Retornar para revisão.
9. Navegar sem mouse.
10. Ativar contraste alto e movimento reduzido.
11. Explicar o armazenamento local.

## Privacidade

O relatório exportado contém apenas:

- código não identificável do participante;
- dispositivo e tecnologia assistiva informados;
- resultado das tarefas;
- notas do moderador;
- avaliações da sessão.

Não são exportados:

- Diário;
- emoções;
- intenção ou ação privada da missão;
- inventário;
- dados completos do personagem;
- conteúdo de segurança.

## Preview Vercel

O repositório já possui `vercel.json` e build Vite funcional. No momento da fase, o projeto ainda não estava importado na conta Vercel conectada. Para habilitar previews automáticos:

1. importar `Tehkne-Solutions/athanor-alquimia-interior` no Vercel;
2. confirmar framework Vite;
3. usar `npm run build`;
4. usar `dist` como diretório de saída;
5. manter os previews de pull request ativos;
6. acessar `/homologation` no preview da branch.

## Critérios de aprovação

- build e testes passam;
- fluxo principal é utilizável em 360 px;
- não existe rolagem horizontal nas telas principais;
- foco é visível;
- mudança de rota é anunciada;
- onboarding comunica progresso e reversibilidade;
- exportação não inclui estado privado do app;
- relatório é assinado somente por Tehkné Solutions.

**Tehkné Solutions**
