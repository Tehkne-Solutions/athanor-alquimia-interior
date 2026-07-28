# Fase 8.24 — O Aviso que Não Troca de Sentido em Silêncio

## Estado

Implementação funcional do catálogo canônico de avisos para partilhas e respostas locais da Nova Obra contínua.

## Problema

Os pacotes já protegiam forma, tamanho, versão, campos, tempo, relações e referências. Entretanto, `notices` aceitava qualquer texto não vazio. Um arquivo novamente selado poderia:

- remover uma declaração de limite;
- acrescentar promessa de entrega ou resposta;
- repetir uma mensagem para alterar ênfase;
- reorganizar os avisos;
- declarar que datas foram omitidas quando elas estavam presentes;
- declarar coleção vazia quando havia itens;
- inserir o aviso de silêncio em um arquivo exportável.

A sanitização preservava a lista recebida, portanto o texto divergente podia alcançar a prévia mesmo sem pertencer ao conteúdo curado.

## Solução

A política `require-canonical-unique-ordered-notices-v1` cria catálogos separados para partilha e resposta.

Cada pacote precisa manter:

1. somente avisos catalogados;
2. todos os avisos obrigatórios;
3. ausência de duplicatas;
4. ordem relativa canônica;
5. condições coerentes com os próprios campos.

Nenhum aviso desconhecido é corrigido, traduzido, aproximado ou substituído.

## Avisos da partilha

A partilha possui onze avisos obrigatórios sobre:

- ordem sem prioridade;
- remoção de IDs internos;
- limite do checksum;
- orçamento local;
- JSON inerte;
- Unicode visível;
- margens exatas;
- tempo canônico;
- relações internas;
- compatibilidade discriminada;
- referências catalogadas.

### Condições deriváveis

- `includeDates: false` exige `Datas foram omitidas.`;
- `includeDates: true` proíbe esse aviso;
- `collection.itemCount: 0` exige o aviso de coleção vazia;
- quantidade positiva proíbe o aviso de coleção vazia.

### Condição minimizada

`Registros não vinculados permanecem descritivos e não são interpretados.` é opcional e catalogado. O campo `linked` não atravessa a exportação minimizada, então o receptor não pode reconstruir essa condição sem reintroduzir um dado deliberadamente removido.

## Avisos da resposta

A resposta possui doze avisos obrigatórios sobre:

- ausência de itens e datas da origem;
- impressão descritiva sem identidade;
- ausência de cobrança de retorno;
- limites de checksum, orçamento, forma e texto;
- instante canônico;
- ausência de relações temporais extras;
- ausência de discriminantes opcionais;
- correspondência exata do gesto curado.

### Condições

- `source.itemCount: 0` exige o aviso de origem vazia;
- quantidade positiva proíbe esse aviso;
- o aviso de silêncio é recusado em qualquer arquivo exportável.

O silêncio continua sendo uma escolha completa, mas não produz arquivo.

## Ordem das barreiras

```text
tamanho do arquivo
→ leitura do texto
→ tamanho do texto bruto
→ unicidade das chaves
→ preservação numérica
→ JSON.parse
→ forma JSON inerte
→ orçamento estrutural
→ texto Unicode visível
→ checksum
→ versão
→ contrato estrito de campos
→ margens textuais exatas
→ tempo UTC canônico
→ relações exatas entre campos
→ compatibilidade dos campos discriminados
→ integridade das referências catalogadas
→ avisos canônicos
→ schema e política
→ conteúdo curado
→ sanitização
```

Checksum permanece anterior. Uma alteração sem novo selo é interrompida como inconsistência. Referências permanecem anteriores para impedir que uma variante inventada seja mascarada por um erro de aviso.

## Geração

Partilhas e respostas são verificadas antes da aplicação do selo. O Athanor não gera um arquivo que seria recusado pela mesma versão ao retornar.

## Recepção e retorno

Arquivos novamente selados com avisos desconhecidos, ausentes, duplicados, fora de ordem ou contraditórios são recusados antes do parser e da sanitização.

O arquivo original permanece intacto.

## Diagnósticos

A validação informa:

- índice do aviso desconhecido;
- duplicação;
- divergência de ordem;
- ausência obrigatória;
- condição incompatível.

No máximo 20 problemas são apresentados.

## Limites da garantia

Avisos canônicos não comprovam:

- identidade;
- autoria;
- intenção;
- veracidade do evento;
- entrega ou leitura;
- correção do relógio;
- autenticidade criptográfica.

Eles confirmam apenas que a lista corresponde ao catálogo editorial local da versão e aos campos deriváveis do pacote.

## Privacidade e persistência

A fase não cria:

- rota;
- store;
- chave IndexedDB;
- histórico de recusas;
- cache de migração;
- analytics;
- telemetria;
- sincronização.

## Assinatura

**Tehkné Solutions**
