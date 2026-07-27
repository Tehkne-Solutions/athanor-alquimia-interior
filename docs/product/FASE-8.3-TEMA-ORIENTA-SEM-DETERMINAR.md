# Fase 8.3 — O Tema que Orienta sem Determinar

**Assinatura:** Tehkné Solutions

## Objetivo

Adicionar temas curados às jornadas contínuas sem transformar tema em diagnóstico, perfil psicológico, previsão, obrigação ou direção espiritual específica.

Tema, elemento, variante e prática permanecem campos independentes.

## Núcleo editorial

A fase utiliza **Provérbios 4:25** como reflexão sobre atenção dirigida. A referência não afirma que o tema escolhido revela o estado do usuário ou determina o caminho da jornada.

## Catálogo temático

```text
ID: continuous-theme-catalog
VERSÃO: 1.0.0
POLÍTICA: explicit-curated-no-sensitive-inference-v1
MODO: curated-only
```

O catálogo contém oito temas:

1. Clareza provisória;
2. Proporção possível;
3. Apoio disponível;
4. Transição reversível;
5. Limite em primeira pessoa;
6. Recursos possíveis;
7. Ritmo sustentável;
8. Repouso completo.

Cada tema define:

- descrição;
- elementos compatíveis;
- lente de orientação;
- lente de observação;
- lente de revisão.

## Escolha explícita

Rastros novos começam sem tema resolvido. Na orientação, a pessoa pode:

- selecionar um tema compatível;
- selecionar outro tema diretamente;
- marcar **Sem tema**;
- passar a orientação, registrando ausência de tema.

Concluir a orientação exige:

- prática ou ausência explícita de prática;
- tema ou ausência explícita de tema.

Passar a etapa continua sendo uma conclusão completa.

## Combinação curada

A interface mostra a assinatura:

```text
ELEMENTO · TEMA OU NO-THEME · VARIANTE
```

O tema adiciona somente uma lente editorial. Ele não reescreve a variante, não altera a prática e não modifica etapas já concluídas.

## Histórico temático

Cada Rastro pode registrar:

- versão do catálogo;
- tema escolhido ou ausência de tema;
- sequência local;
- data local;
- ação realizada:
  - tema selecionado;
  - tema mantido;
  - outro tema solicitado;
  - tema removido;
  - orientação passada sem tema.

## Rotação

Solicitar outro tema utiliza somente:

- semente curada da instância;
- versão do catálogo;
- contador local;
- temas compatíveis com o elemento.

Quando existe alternativa, o tema atual não é repetido imediatamente.

A rotação fica bloqueada quando:

- o Rastro está pausado;
- a instância de origem não está ativa;
- o Rastro foi concluído;
- não existe tema atual;
- existe apenas uma opção compatível.

## Compatibilidade

Rastros persistidos antes da Fase 8.3 permanecem válidos. A ausência dos novos campos é interpretada como estado legado já resolvido, sem alteração destrutiva ou bloqueio retroativo.

## Segurança e privacidade

A seleção temática não utiliza:

- textos pessoais;
- emoções registradas;
- decisões anteriores;
- notas;
- classificações;
- histórico clínico;
- perfil psicológico;
- localização;
- calendário;
- contatos;
- comportamento inferido.

Manter, trocar ou remover um tema não altera:

- nível;
- restauração;
- recompensa;
- valor da etapa;
- valor da jornada.

Nenhum tema produz diagnóstico, previsão, leitura oculta ou direção espiritual específica.

## Persistência

Os dados permanecem no store local do Rastro contínuo:

```text
athanor-continuous-trail-state
```

O schema do store passa para a versão 3.

## Validação

A entrega adiciona:

- validação de Provérbios 4:25;
- validação do catálogo temático 1.0.0;
- garantia de ao menos dois temas por elemento;
- verificação de IDs únicos;
- verificação das três lentes obrigatórias;
- onze cenários novos de domínio;
- adaptação dos testes das Fases 8.1 e 8.2;
- verificação TypeScript;
- build de produção.
