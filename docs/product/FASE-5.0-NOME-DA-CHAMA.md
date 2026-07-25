# Fase 5.0 — O Nome da Chama

## Objetivo

Transformar a fundação técnica da Forja em uma primeira missão jogável do capítulo do Fogo, mantendo a Bíblia como núcleo editorial e separando intensidade, impulso, necessidade e ação.

## Núcleo editorial

- Referência: Provérbios 16:32.
- Princípio: potência também pode envolver intervalo, medida e escolha proporcional.
- O texto bíblico não é apresentado como diagnóstico, promessa ou justificativa para confronto.

## Fluxo

1. abrir a Forja depois do encerramento da Água;
2. iniciar O Nome da Chama;
3. selecionar movimentos percebidos ou recusar o check-in;
4. informar intensidade opcional de 1 a 5;
5. classificar frases fictícias ou recusar a atividade;
6. escolher uma forma de pausa, incluindo nenhuma prática;
7. escolher uma necessidade, incluindo não saber;
8. escolher uma ação segura, incluindo não responder agora;
9. criar a Chama Nomeada;
10. consultar a cadeia simbólica com proveniência e fallbacks.

## Movimentos disponíveis

- ira;
- coragem;
- frustração;
- urgência;
- entusiasmo;
- medo.

Nenhum movimento possui valor moral ou peso de recompensa.

## Classificador

As oito frases do classificador são fictícias e organizadas em:

- emoção;
- impulso;
- necessidade;
- ação.

A resposta do jogador não gera pontuação, traço pessoal ou avaliação. A sugestão editorial aparece apenas como explicação didática.

## Ações disponíveis

- respirar e esperar;
- escrever sem enviar;
- afastar-se por alguns minutos;
- pedir tempo;
- comunicar limite com calma;
- buscar apoio;
- não responder agora.

A aplicação não executa nenhuma dessas ações.

## Camadas simbólicas

- Gevurah: comparação temática para limite e responsabilidade;
- Shin: relação textual com Fogo no Sefer Yetzirah;
- Gen: comparação com pausa e quietude;
- Zhen: comparação com início de movimento;
- A Força: arquétipo opcional de potência orientada por medida;
- Chama Nomeada: criação de gameplay do Athanor.

Fallbacks autorais são usados quando as camadas são desativadas.

## Segurança

- sem texto livre;
- sem ameaça, retaliação ou violência entre as ações;
- intensidade não é indicador clínico;
- ira não autoriza confronto;
- coragem não exige exposição a risco;
- medo não reduz progresso;
- o check-in e o classificador podem ser recusados;
- o botão de apoio direto permanece disponível;
- a Chama Nomeada não prova autocontrole, melhora ou força espiritual.

## Persistência

O estado é salvo em IndexedDB com a chave `athanor-fire-mission-state` e vinculado ao identificador do ciclo da Água que abriu a Forja.

## Critérios de aceite

- missão inacessível antes da conclusão da Água;
- recusa do check-in aceita;
- recusa da classificação aceita;
- intensidade opcional;
- pausa, necessidade e ação obrigatórias, com alternativas neutras;
- Chama Nomeada criada somente após fechamento do fluxo;
- cadeia respeita camadas ativas e fallbacks;
- reset de QA remove o estado do Fogo;
- conteúdo, testes, TypeScript e bundle aprovados.

**Tehkné Solutions**
