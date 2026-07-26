# Fase 6.2 — A Casa dos Recursos

## Objetivo

Implementar a terceira missão do Capítulo da Terra, ensinando a distinguir disponibilidade real de desejo, dependência e garantia sem medir riqueza, produtividade ou valor pessoal.

## Dependência

A missão exige a **Semente do Primeiro Passo** vinculada à jornada atual.

## Fluxo

1. classificar oito frases fictícias como recurso, desejo, dependência ou garantia;
2. registrar a disponibilidade fictícia de tempo, espaço, informação, materiais e apoio;
3. escolher uma substituição possível ou reconhecer que não há alternativa;
4. manter, reduzir, observar ou pausar o escopo;
5. continuar, esperar, substituir, pausar, abandonar ou não agir;
6. criar o **Cesto dos Recursos Possíveis**.

A classificação pode ser recusada integralmente.

## Regras

- usar substituição exige uma alternativa selecionada;
- escopo pausado não permite continuar ou substituir imediatamente;
- continuar com recurso indisponível exige redução de escopo;
- esperar, pausar, abandonar e não agir são resultados completos;
- nenhuma escolha concede pontuação por quantidade ou disponibilidade.

## Núcleo editorial

- **Provérbios 27:23–24:** atenção cuidadosa ao que está sob responsabilidade;
- **Salmos 127:2:** esforço e repouso permanecem na fundação da Terra;
- **Malkhut, Kun e A Imperatriz:** comparações opcionais já identificadas no capítulo;
- **Cesto dos Recursos Possíveis:** síntese autoral do Athanor.

## Segurança e privacidade

- somente recursos e atividades fictícias;
- nenhum valor financeiro, estoque real ou agenda é solicitado;
- nenhuma conta, contato, localização ou calendário é consultado;
- falta de recurso não reduz progresso;
- o aplicativo não compra, reserva, busca ou solicita recursos;
- o Cesto não representa abundância, segurança material ou garantia;
- decisões reais de saúde, moradia, emprego e finanças permanecem fora do escopo.

## Persistência

O estado é armazenado localmente em IndexedDB sob `athanor-earth-resources-state` e vinculado ao identificador da Semente atual.

## Validação

- oito entradas editoriais validadas por Zod;
- seis cenários unitários do domínio;
- TypeScript estrito;
- build Vite;
- reset integral no painel de QA.

**Tehkné Solutions**
