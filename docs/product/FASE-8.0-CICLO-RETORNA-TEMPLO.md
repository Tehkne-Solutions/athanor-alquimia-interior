# Fase 8.0 — O Ciclo que Retorna ao Templo

**Tehkné Solutions**

## Objetivo

Transformar um registro da Nova Obra em uma instância contínua separada, sem apagar, copiar ou reiniciar ciclos elementais já concluídos.

## Dependência

A fase depende de pelo menos um `NewWorkRecord` criado no modo contínuo após o primeiro ciclo do Espírito.

## Contrato da instância

Cada jornada contínua guarda somente:

- identificador próprio;
- identificador do registro da Nova Obra;
- identificador do ciclo do Espírito de origem;
- elemento escolhido;
- modalidade registrada;
- estado da instância;
- comparação neutra opcional;
- semente curada de conteúdo;
- datas do ciclo de vida.

Nenhuma resposta, nota, destino, classificação ou dado pessoal do ciclo anterior é copiado.

## Estados

- `active` — disponível para revisita ou observação;
- `paused` — preservada sem prazo de retorno;
- `closed` — encerrada e mantida no histórico;
- `archived` — retirada do fluxo atual sem exclusão.

## Transições

```text
REGISTRO DA NOVA OBRA
→ ATIVAÇÃO EXPLÍCITA
→ ATIVA OU PAUSADA
→ PAUSA / RETOMADA / ENCERRAMENTO / ARQUIVO
```

Registros de repouso iniciam pausados e não podem ser retomados automaticamente como ação.

## Comparação sem ranking

As instâncias podem registrar:

- contexto semelhante;
- contexto alterado;
- recursos alterados;
- foco alterado;
- relação desconhecida;
- nenhuma comparação.

Esses estados não produzem pontuação, progresso, nível ou recompensa.

## Fundação procedural

A propriedade `contentSeed` utiliza apenas:

- ciclo do Espírito de origem;
- registro da Nova Obra;
- elemento;
- modalidade.

A política inicial é `curated_registry`, limitada às etapas de orientação, observação e revisão. Conteúdo pessoal não é usado como entrada procedural.

## Segurança

- nenhuma missão é reiniciada automaticamente;
- nenhuma ação externa é executada;
- não existem streaks, cronômetros ou notificações;
- repetir não concede progressão;
- pausa, encerramento e arquivo são resultados completos;
- repouso não é convertido em produtividade;
- todos os dados permanecem locais.

## Validação

- oito cenários de domínio;
- validação editorial de Salmos 119:59;
- validação de estados, comparações, restrições e política procedural;
- TypeScript e bundle de produção.
