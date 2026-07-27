# Fase 8.7 — A Partilha que Exige Consentimento

**Assinatura:** Tehkné Solutions

## Objetivo

Permitir que uma coleção contínua seja exportada como arquivo local minimizado somente após escolha deliberada, prévia completa e cinco confirmações explícitas, sem envio automático, sincronização, conta, destinatário armazenado ou inclusão de textos pessoais.

## Núcleo bíblico

- **Provérbios 11:13** inicia a reflexão sobre confiança e discrição.
- A referência não promete sigilo absoluto, proteção técnica infalível ou aprovação espiritual.
- Consentimentos, minimização, prévia e schema são estruturas autorais do Athanor.

## Catálogo

- ID: `continuous-share-catalog`;
- versão: `1.0.0`;
- schema: `athanor-continuous-collection-share-v1`;
- política: `explicit-consent-minimized-local-export-v1`;
- modo: `manual-local-file`;
- envio automático: desativado;
- armazenamento de destinatário: desativado;
- notas pessoais: não suportadas.

## Fluxo

1. abrir uma coleção existente;
2. escolher **Preparar partilha**;
3. revisar a coleção selecionada;
4. decidir separadamente se datas descritivas entram no pacote;
5. inspecionar a prévia completa e o JSON minimizado;
6. confirmar cinco declarações explícitas;
7. gerar um arquivo JSON local;
8. decidir fora do Athanor se o arquivo será guardado, enviado ou descartado.

## Consentimentos obrigatórios

- a coleção foi escolhida deliberadamente;
- a prévia foi revisada;
- a criação de arquivo local foi compreendida;
- o eventual destinatário foi escolhido fora do aplicativo;
- foi confirmado que o pacote não contém notas pessoais.

O estado desses consentimentos existe somente na tela atual e não é persistido.

## Minimização

O pacote exportado contém:

- modelo e rótulo curado da coleção;
- estado ativo ou arquivado;
- quantidade descritiva de itens;
- ordem manual;
- tipo do item;
- elemento;
- tema ou ausência de tema;
- variante;
- pacote curado quando houver;
- estado descritivo;
- profundidade quando houver;
- resumo de passagens;
- datas apenas quando explicitamente ativadas;
- avisos e proveniência da Tehkné Solutions.

O pacote omite sempre:

- ID interno da coleção;
- ID de jornada;
- ID de Rastro;
- ID de ciclo;
- origem local ou importada do store;
- chaves internas;
- notas pessoais;
- emoções;
- diagnósticos;
- nomes, contatos ou identificadores de destinatário;
- dados de conta;
- histórico de tentativa de partilha.

## Coleções vazias

Coleções vazias podem ser exportadas. O arquivo contém apenas metadados mínimos, avisos e uma lista vazia, sem mensagem de falta, atraso ou incompletude.

## Ordem

A ordem manual é preservada por posição, mas não representa:

- prioridade;
- importância;
- raridade;
- mérito;
- nível;
- ranking;
- progresso pessoal.

## Registros desconhecidos

Itens não vinculados permanecem descritivos e desconhecidos. A exportação não tenta reconstruir, interpretar ou diagnosticar sua origem.

## Download

A implementação utiliza `Blob` e download local do navegador. Não há:

- API de compartilhamento;
- upload;
- envio de e-mail;
- sincronização;
- analytics;
- histórico de exportação;
- confirmação de recebimento.

## Rotas

```text
/temple/continuous-collections/:collectionId/share
```

O acesso parte da coleção selecionada.

## Segurança

- cinco consentimentos obrigatórios;
- datas desativadas por padrão;
- prévia completa antes do download;
- IDs internos removidos;
- nenhum texto livre;
- nenhum destinatário armazenado;
- nenhum envio automático;
- nenhuma restauração de jornadas;
- nenhum efeito sobre a coleção de origem;
- sair da tela não gera registro.

## QA

O painel de QA permanece responsável por inspecionar apenas a coleção de origem. A Fase 8.7 não cria store próprio e, portanto, não adiciona histórico de partilha ao reset global.

## Critérios de validação

- validação editorial de Provérbios 11:13;
- cinco consentimentos únicos;
- bloqueio de exportação sem consentimento completo;
- datas omitidas por padrão;
- inclusão de datas somente por opção separada;
- remoção de IDs internos;
- ausência de campos de notas, destinatário e envio;
- coleção vazia exportável;
- desconhecidos preservados sem interpretação;
- schema e política explícitos;
- autoria exclusiva da Tehkné Solutions;
- build TypeScript e Vite.
