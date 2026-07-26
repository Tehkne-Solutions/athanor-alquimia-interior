# Fase 6.4 — A Ordem que Serve

**Assinatura:** Tehkné Solutions

## Objetivo

Implementar a quinta missão do Capítulo da Terra sem solicitar listas, tarefas, prazos ou prioridades reais. A missão usa objetos fictícios para ensinar a diferença entre ordem, prioridade, rigidez e acúmulo.

## Dependência

A missão exige o **Compasso do Ritmo Sustentável** da jornada atual. O vínculo é feito pelo identificador derivado da conclusão da Fase 6.3, impedindo o reaproveitamento automático de um Mapa antigo em uma nova jornada.

## Fluxo

1. Classificação opcional de oito exemplos fictícios.
2. Definição de um limite de um a três itens visíveis.
3. Distribuição de cinco objetos fictícios entre visível, guardado, pausado e arquivado.
4. Reordenação dos itens visíveis por botões subir/descer.
5. Escolha de prioridade sem urgência ou nenhuma prioridade.
6. Definição de regra de revisão.
7. Escolha entre aplicar uma vez, salvar, pausar, arquivar ou não agir.
8. Criação do **Mapa da Ordem Possível**.

## Regras

- itens visíveis nunca ultrapassam o limite escolhido;
- reduzir o limite abaixo da quantidade atual é bloqueado;
- arquivar o item prioritário remove a prioridade;
- aplicar uma vez exige item visível e prioridade explícita;
- salvar, pausar, arquivar e não agir aceitam nenhuma prioridade;
- reordenar não apaga estados, progresso ou componentes;
- criar o Mapa não conclui automaticamente o Capítulo da Terra.

## Núcleo editorial

- **Provérbios 24:27:** preparação, sequência e limite;
- **Salmos 127:2:** esforço, repouso e medida na fundação da Terra;
- Malkhut, Kun e A Imperatriz permanecem comparações opcionais identificadas;
- o **Mapa da Ordem Possível** é uma síntese autoral do Athanor.

## Segurança e privacidade

- nenhum texto pessoal ou item real é solicitado;
- nenhuma agenda, lista, e-mail, calendário ou conta é consultada;
- prioridade não cria prazo ou urgência;
- quantidade visível não mede organização ou produtividade;
- guardar, pausar e arquivar não representam fracasso;
- nenhuma ação externa é executada;
- decisões reais de saúde, finanças, moradia e trabalho ficam fora do escopo;
- o Mapa não representa controle, disciplina ou melhora.

## Validação

- validação Zod da unidade bíblica, nó e oito exemplos;
- seis cenários unitários do domínio;
- verificação TypeScript;
- build de produção Vite.
