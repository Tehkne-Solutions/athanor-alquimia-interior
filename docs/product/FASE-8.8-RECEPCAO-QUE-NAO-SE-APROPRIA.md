# Fase 8.8 — A Recepção que Não se Apropria

**Assinatura:** Tehkné Solutions

## Objetivo

Permitir que um pacote de coleção compartilhada seja recebido, validado, sanitizado e opcionalmente guardado em uma biblioteca local separada, sem reconstruir a identidade de origem, sem responder automaticamente e sem transformar a experiência recebida em jornada, mapa, coleção ou progresso próprio.

## Núcleo bíblico

- **Provérbios 18:13** inicia a reflexão sobre escuta antes da resposta.
- A referência não autoriza inferir intenção, maturidade, diagnóstico, direção espiritual ou contexto pessoal.
- Validação, deduplicação, biblioteca separada e estados locais são estruturas autorais do Athanor.

## Catálogo

- ID: `continuous-receive-catalog`;
- versão: `1.0.0`;
- schema aceito: `athanor-continuous-collection-share-v1`;
- política aceita: `explicit-consent-minimized-local-export-v1`;
- modo: `separate-received-library`;
- mescla com jornadas: não;
- mescla com coleções: não;
- identidade de origem: não solicitada;
- resposta automática: desativada.

## Fluxo

1. abrir a Biblioteca recebida;
2. selecionar um arquivo JSON local da Fase 8.7;
3. validar schema, política, versão, proveniência e estrutura;
4. descartar propriedades não reconhecidas;
5. exibir prévia sanitizada;
6. apresentar avisos sobre vazio, datas e estados desconhecidos;
7. exigir quatro confirmações explícitas;
8. guardar uma cópia local separada ou descartar a prévia;
9. arquivar, reativar ou remover a cópia sem afetar o arquivo externo.

## Confirmações obrigatórias

- o arquivo foi escolhido deliberadamente;
- a prévia sanitizada foi revisada;
- a separação entre biblioteca recebida e jornada própria foi compreendida;
- foi escolhida a guarda de uma cópia local.

As confirmações existem somente na tela atual e não são persistidas.

## Validação

O parser exige:

- schema oficial da Fase 8.7;
- política oficial de minimização e consentimento;
- catálogo versionado;
- data de geração válida;
- produto `Athanor — Alquimia Interior`;
- autoria `Tehkné Solutions`;
- transmissão `manual-local-file`;
- coleção com modelo, rótulo, estado e quantidade válidos;
- opções de datas explícitas;
- posições sequenciais iniciadas em 1;
- tipos, elementos, temas, variantes, estados e resumos de passagem conhecidos;
- avisos de segurança em lista textual.

Arquivos incompatíveis são rejeitados localmente.

## Sanitização

Somente campos reconhecidos pelo schema são preservados. Propriedades adicionais no objeto principal, coleção, itens ou proveniência são descartadas.

A recepção não adiciona:

- nome de remetente;
- contato;
- relação pessoal;
- mensagem;
- nota privada;
- emoção;
- diagnóstico;
- resposta;
- confirmação de leitura;
- localização;
- conta ou identificador externo.

## Impressão descritiva

Cada pacote validado recebe uma impressão local determinística baseada em:

- schema;
- política;
- versão do catálogo;
- proveniência;
- metadados da coleção;
- opções de minimização;
- itens sanitizados.

A data de geração não participa da impressão. Assim, o mesmo conteúdo exportado novamente em outro momento não cria duplicata.

A impressão não é assinatura criptográfica, prova de autoria ou mecanismo de segurança externo. Ela serve apenas para deduplicação local descritiva.

## Biblioteca separada

O store `athanor-continuous-received-state` mantém:

- versão do schema local;
- versão do catálogo;
- cópias recebidas;
- impressão descritiva;
- pacote sanitizado;
- estado ativo ou arquivado;
- datas locais de recebimento e atualização.

A biblioteca não possui vínculo técnico com:

- jornadas;
- Rastros;
- ciclos temáticos;
- mapa;
- coleções próprias;
- inventário;
- personagem;
- restauração do Templo.

## Coleções vazias

Pacotes com coleção vazia são aceitos. Eles permanecem válidos, sem mensagem de falta, atraso, incompletude ou menor valor.

## Datas

Quando a origem omitiu datas, qualquer item que contenha datas torna o pacote incompatível.

Quando a origem escolheu incluir datas, elas são preservadas apenas como campos descritivos. Datas não geram sequência, tendência, comparação ou avaliação de consistência.

## Registros desconhecidos

Itens com estado desconhecido são preservados como desconhecidos. A recepção não tenta reconstruir IDs, contexto, intenção ou significado.

## Estados locais

Uma cópia recebida pode ser:

- ativa;
- arquivada;
- reativada;
- removida.

Arquivar não altera o pacote. Remover elimina somente a cópia local recebida.

## Rotas

```text
/temple/continuous-received
```

O acesso é oferecido a partir da central contínua e da área de coleções.

## Segurança

- nenhum upload;
- nenhuma resposta automática;
- nenhuma confirmação de leitura;
- nenhuma identidade de origem;
- nenhuma interpretação de desconhecidos;
- nenhuma mescla com dados próprios;
- nenhuma progressão;
- nenhum ranking ou recompensa;
- nenhuma tentativa registrada ao descartar;
- todos os dados permanecem locais.

## QA

O painel de QA exibe:

- ID local da cópia;
- impressão descritiva;
- estado ativo ou arquivado;
- modelo e rótulo da coleção;
- quantidade de itens;
- schema e política;
- indicação de datas incluídas.

O reset global elimina o store da biblioteca recebida.

## Critérios de validação

- validação editorial de Provérbios 18:13;
- quatro confirmações únicas;
- rejeição de schema, política, produto, autoria ou transmissão incompatíveis;
- sanitização de campos desconhecidos;
- quantidade e posições consistentes;
- rejeição de datas contraditórias;
- deduplicação independente da data de geração;
- store separado;
- arquivo e reativação;
- remoção sem efeito externo;
- coleção vazia válida;
- desconhecidos preservados sem interpretação;
- ausência de progressão, identidade e resposta;
- build TypeScript e Vite.
