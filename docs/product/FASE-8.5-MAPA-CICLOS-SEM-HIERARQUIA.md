# Fase 8.5 — O Mapa dos Ciclos que Não Hierarquiza

**Produto:** Athanor — Alquimia Interior  
**Assinatura:** Tehkné Solutions

## Objetivo

Criar uma camada local e somente de leitura para visualizar Rastros e ciclos temáticos sem transformar quantidade, profundidade, estado ou repetição em medida de evolução pessoal.

## Fonte bíblica principal

- **Salmos 77:11–12** inicia uma reflexão sobre memória e revisão.
- A referência não é usada para diagnosticar, prever, avaliar maturidade ou provar progresso.
- Mapa, filtros, agrupamentos, comparação e exportação são estruturas autorais do Athanor.

## Modelo de dados

O mapa não possui store próprio. Ele projeta dois tipos de item a partir dos registros existentes:

1. **Rastro da Jornada Contínua**;
2. **Ciclo Temático**.

Cada item contém somente IDs curados, elemento, tema ou ausência de tema, variante, pacote quando aplicável, estado, datas locais e resumo de passagens.

## Estados descritivos

- ativo;
- pausado;
- concluído;
- sem ciclo adicional;
- encerrado ou incompleto;
- desconhecido.

Ciclos encerrados antecipadamente permanecem visíveis como incompletos. Ciclos cuja origem não é encontrada permanecem no mapa como desconhecidos e não vinculados.

## Filtros locais

- tipo de item;
- elemento;
- tema;
- pacote;
- estado;
- busca por ID ou nome.

Filtros vivem somente na tela e não alteram os registros persistidos.

## Agrupamentos

- elemento;
- tema;
- pacote.

Os grupos são ordenados alfabeticamente por ID e nunca por quantidade, conclusão ou profundidade.

## Comparação neutra

Dois itens podem ser comparados em:

- tipo;
- elemento;
- tema;
- pacote;
- variante;
- estado;
- profundidade.

Cada dimensão retorna somente:

- igual;
- diferente;
- desconhecido.

Não existe melhor, pior, avanço, regressão, tendência ou recomendação.

## Linha do tempo

A linha do tempo utiliza apenas as datas locais já registradas. Ela não calcula:

- streak;
- frequência ideal;
- consistência;
- intervalo médio;
- tendência;
- dívida de continuidade.

## Exportação local

O recorte filtrado pode ser exportado como JSON:

```text
schema: athanor-continuous-map-export-v1
policy: descriptive-local-no-ranking-v1
```

O arquivo inclui filtros, totais descritivos e itens visíveis. Não inclui textos pessoais, notas, emoções, diagnósticos ou inferências.

## Rotas

```text
/temple/continuous-map
```

O acesso também aparece na central de jornadas contínuas.

## Segurança

- mapa somente leitura;
- ausência de ranking e pontuação;
- registros incompletos e desconhecidos preservados;
- comparação sem interpretação;
- exportação local explícita;
- nenhuma ação externa;
- nenhuma personalização sensível;
- nenhuma progressão baseada em repetição.

## Validação

- validação editorial de Salmos 77:11–12;
- validação do catálogo 1.0.0;
- dez cenários de domínio;
- testes anteriores preservados;
- verificação TypeScript;
- build Vite.

**Tehkné Solutions**
