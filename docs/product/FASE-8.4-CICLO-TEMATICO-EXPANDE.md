# Fase 8.4 — O Ciclo Temático que se Expande

## Objetivo

Permitir que um Rastro concluído abra um ciclo temático adicional, curto e auditável, sem reiniciar o Rastro, copiar respostas anteriores ou transformar repetição em progressão.

## Dependência

A fase exige:

- uma instância contínua existente;
- um Rastro concluído;
- o Rastro da Jornada Contínua criado;
- tema explícito ou ausência temática já resolvida.

## Catálogo

- ID: `continuous-theme-cycle-catalog`;
- versão: `1.0.0`;
- política: `explicit-curated-depth-no-sensitive-inference-v1`;
- modo: `curated-only`;
- profundidades: 1, 2 ou 3 passagens.

## Pacotes

O catálogo contém nove pacotes:

1. Janela da Clareza Provisória;
2. Câmara da Proporção Possível;
3. Ponte do Apoio Disponível;
4. Travessia da Transição Reversível;
5. Contorno do Limite em Primeira Pessoa;
6. Cesto dos Recursos do Ciclo;
7. Compasso do Ritmo Curto;
8. Sala do Repouso Completo;
9. Passagem Aberta sem Tema.

Cada pacote contém exatamente três passagens únicas e cobre:

- orientação;
- observação;
- revisão.

## Profundidade

A pessoa escolhe explicitamente:

- uma passagem;
- duas passagens;
- três passagens;
- nenhum ciclo adicional.

Profundidade maior não concede nível, restauração ou recompensa adicional.

## Seleção das passagens

A ordem utiliza somente:

- semente curada do Rastro;
- ID do pacote;
- quantidade de ciclos anteriores no mesmo Rastro;
- profundidade escolhida.

A seleção é determinística e nunca repete uma passagem dentro da mesma instância.

## Ciclo de vida

```text
RASTRO CONCLUÍDO
→ PACOTE E PROFUNDIDADE
→ CICLO ATIVO
→ PASSAGEM CONCLUÍDA OU PASSADA
→ PAUSA, RETOMADA, CONCLUSÃO OU ENCERRAMENTO ANTECIPADO
```

Estados:

- `active`;
- `paused`;
- `completed`;
- `declined`.

## Persistência

Cada ciclo registra somente:

- Rastro de origem;
- instância contínua de origem;
- registro da Nova Obra;
- ciclo do Espírito;
- elemento;
- tema ou ausência temática;
- variante;
- pacote;
- versão do catálogo;
- profundidade;
- IDs e estados das passagens;
- datas locais;
- encerramento antecipado.

Nenhum texto pessoal, emoção, nota, decisão, classificação ou dado clínico é copiado.

## Histórico

Um Rastro pode manter múltiplos ciclos históricos, desde que somente um permaneça ativo ou pausado por vez.

Concluir, recusar ou encerrar antecipadamente preserva o registro e permite iniciar outro ciclo no futuro.

## Núcleo editorial

A fase utiliza **Provérbios 15:23** como reflexão sobre resposta, ocasião e medida.

A referência não é usada para:

- interpretar o momento pessoal;
- prever o futuro;
- diagnosticar;
- afirmar direção divina específica;
- declarar um pacote superior;
- obrigar continuidade.

Pacotes, passagens, profundidades e seleção são estruturas autorais da **Tehkné Solutions**.

## Segurança

- nenhum conteúdo é gerado livremente;
- nenhuma passagem é personalizada por dados sensíveis;
- passar possui o mesmo valor de conclusão;
- pausa não remove progresso;
- encerramento antecipado não representa falha;
- nenhum ciclo adicional é uma conclusão completa;
- não existem streaks, cronômetros ou notificações automáticas;
- nenhuma ação externa é executada;
- todos os registros permanecem no dispositivo.

## Testes

A suíte cobre:

- profundidades 1 e 3;
- ausência de repetição;
- determinismo;
- dependência do Rastro concluído;
- pacote incompatível;
- pacote sem tema;
- bloqueio de duplicação aberta;
- conclusão e passagem;
- pausa e retomada;
- encerramento antecipado;
- recusa integral;
- múltiplos ciclos históricos.

**Tehkné Solutions**
