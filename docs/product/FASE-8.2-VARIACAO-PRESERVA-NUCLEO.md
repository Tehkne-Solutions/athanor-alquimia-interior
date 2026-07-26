# Fase 8.2 — A Variação que Preserva o Núcleo

## Objetivo

Permitir que uma instância do **Rastro da Jornada Contínua** mantenha sua variante atual ou selecione outra variante curada do mesmo elemento, sem repetir imediatamente o conteúdo exibido e sem alterar prática, etapa, resultados ou recompensa.

## Dependência

A fase depende de um Rastro já iniciado pela Fase 8.1.

Não cria outro ciclo, outra missão ou outro componente. A variação permanece integrada ao Rastro da mesma instância.

## Núcleo editorial

A abertura utiliza **Provérbios 25:11** como reflexão sobre forma, circunstância e medida.

A referência não é usada como:

- leitura do momento pessoal;
- palavra direcionada ao usuário;
- confirmação espiritual;
- previsão;
- obrigação de aceitar uma nova variante.

Catálogo, histórico e rotação são estruturas autorais da **Tehkné Solutions**.

## Catálogo versionado

```text
ID: continuous-trail-catalog
VERSÃO: 2.0.0
POLÍTICA: deterministic-curated-no-immediate-repeat-v1
MODO: curated-only
```

O catálogo contém:

- 11 práticas curadas;
- 12 variantes curadas;
- duas variantes para cada ponto de partida;
- três estágios obrigatórios em cada variante:
  - orientação;
  - observação;
  - revisão.

## Histórico por instância

Cada Rastro registra:

- versão do catálogo;
- variante atual;
- contador de solicitações;
- sequência das decisões de variante;
- data local de cada decisão;
- ação executada:
  - variante inicial;
  - mantida explicitamente;
  - outra variante solicitada.

Rastros persistidos antes desta fase recebem um histórico inicial derivado da variante já salva, sem perder o progresso.

## Manter a variante

A ação **Manter variante atual**:

- preserva o conteúdo atual;
- registra a decisão no histórico;
- não reinicia a etapa;
- não altera prática;
- não modifica resultados;
- não concede recompensa.

## Solicitar outra variante

A ação **Solicitar outra variante**:

- utiliza somente semente, versão do catálogo e contador local;
- considera apenas variantes curadas do mesmo elemento;
- evita devolver imediatamente a variante atual;
- preserva prática, etapa e resultados;
- não apaga o histórico;
- não produz penalidade.

A mesma combinação de semente, versão e contador produz o mesmo resultado.

## Estados permitidos

A variante pode ser mantida ou trocada somente quando:

- a instância contínua está ativa;
- o Rastro está ativo;
- existem pelo menos duas variantes no elemento.

Durante pausa ou depois da conclusão, o histórico permanece somente para consulta.

## Privacidade e segurança

A rotação não utiliza:

- texto pessoal;
- emoções registradas;
- escolhas anteriores de conteúdo;
- notas;
- decisões;
- dados clínicos;
- localização;
- contatos;
- calendário;
- comportamento inferido.

A fase não produz diagnóstico, previsão, leitura oculta ou direção espiritual específica.

## Testes de domínio

A suíte cobre:

1. registro inicial da versão;
2. manutenção explícita;
3. rotação sem repetição imediata;
4. determinismo por semente e contador;
5. rotações sucessivas;
6. preservação de prática, etapa e resultados;
7. bloqueio durante pausa;
8. bloqueio depois da conclusão;
9. compatibilidade com Rastros antigos.

## Critérios de aceite

- [x] Catálogo versionado e validado.
- [x] Histórico local por instância.
- [x] Manutenção explícita sem penalidade.
- [x] Rotação determinística.
- [x] Prevenção de repetição imediata.
- [x] Nenhum conteúdo sensível usado na seleção.
- [x] Progresso do Rastro preservado.
- [x] Interface acessível por teclado.
- [x] Assinatura exclusiva da Tehkné Solutions.

**Tehkné Solutions**
