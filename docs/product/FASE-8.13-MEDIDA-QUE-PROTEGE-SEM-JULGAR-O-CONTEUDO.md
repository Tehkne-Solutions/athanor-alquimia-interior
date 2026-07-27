# Fase 8.13 — A Medida que Protege sem Julgar o Conteúdo

**Assinatura:** Tehkné Solutions

## Objetivo

Proteger o dispositivo contra arquivos excessivamente grandes, profundos ou complexos antes de checksum, versionamento, sanitização, prévia ou persistência, sem classificar o conteúdo como bom, ruim, verdadeiro, falso, importante ou irrelevante.

## Núcleo bíblico

- **Provérbios 25:16** inicia a reflexão sobre medida.
- A referência não transforma limite técnico em julgamento moral ou espiritual.
- Orçamento de bytes, caracteres, nós e profundidade é estrutura autoral do Athanor.

## Política

```text
bounded-local-reading-no-content-judgment-v1
```

## Limites atuais

| Recurso | Limite |
|---|---:|
| Arquivo | 524.288 bytes |
| Texto bruto | 524.288 caracteres |
| Profundidade | 16 níveis |
| Nós estruturais | 10.000 |
| Itens por lista | 1.000 |
| Campos por objeto | 64 |
| Texto individual | 8.192 caracteres |
| Soma de textos | 262.144 caracteres |

Esses números são limites de implementação e podem mudar somente por atualização explícita, documentação e testes.

## Ordem segura de leitura

```text
tamanho do arquivo
→ leitura do texto
→ tamanho do texto
→ JSON.parse
→ orçamento estrutural
→ checksum
→ versão
→ schema e política
→ conteúdo curado
→ sanitização
```

O tamanho do arquivo é verificado antes de chamar `file.text()`.

## Inspeção estrutural

A inspeção usa pilha iterativa para evitar depender de recursão profunda. Ela contabiliza:

- quantidade total de nós;
- maior profundidade;
- comprimento de cada lista;
- quantidade de campos por objeto;
- tamanho de textos individuais;
- soma de todos os textos.

Chamadas diretas de domínio também recusam referências circulares, embora arquivos JSON válidos não possam contê-las.

## Sem truncamento

Quando um limite é excedido, o Athanor não:

- remove itens;
- corta textos;
- resume conteúdo;
- comprime o arquivo;
- ignora campos;
- reduz profundidade;
- tenta reparar a estrutura;
- cria uma versão parcial.

O arquivo é interrompido com motivo técnico direto.

## Geração

As exportações de partilha e resposta passam pelo mesmo orçamento antes da aplicação do selo de consistência.

Isso impede que o Athanor produza um arquivo que seria recusado em uma recepção posterior.

Uma coleção com itens acima do orçamento continua preservada localmente. Apenas a geração do arquivo é interrompida.

## Recepção de partilhas

A tela verifica o tamanho antes da leitura. Depois de interpretar o JSON, o wrapper de domínio repete a inspeção estrutural antes das demais barreiras.

A ordem é intencional:

- uma estrutura acima do orçamento é recusada antes de calcular checksum;
- uma estrutura acima do orçamento e com versão futura é recusada primeiro pelo limite local;
- nenhuma prévia é criada;
- nenhuma cópia é persistida.

## Leitura de retornos

Respostas passam pelos mesmos limites e pela mesma ordem. Como a prévia é transitória, nenhum resultado de inspeção é persistido.

## Mensagens

As mensagens descrevem somente o recurso excedido, por exemplo:

- arquivo acima do limite de bytes;
- lista com itens demais;
- profundidade excessiva;
- texto individual muito longo;
- soma de textos acima do orçamento.

Elas não usam linguagem de culpa, perigo pessoal, falha espiritual ou conteúdo inadequado.

## Estatísticas aceitas

Quando a estrutura está dentro do orçamento, a prévia recebe um aviso descritivo com:

- quantidade de nós;
- profundidade observada;
- total de caracteres de texto.

Esses números não são pontuação e não ficam armazenados separadamente.

## Persistência

A Fase 8.13 não cria:

- store Zustand;
- chave IndexedDB;
- histórico de recusas;
- contador de arquivos;
- analytics;
- log de tamanho;
- cache de JSON;
- registro de dispositivo.

## Segurança e autonomia

- nenhuma leitura de arquivo acima do limite de bytes;
- nenhuma rede;
- nenhum upload;
- nenhum reparo automático;
- nenhum truncamento silencioso;
- nenhum julgamento de conteúdo;
- nenhum efeito sobre progresso;
- nenhum bloqueio da coleção original;
- nenhuma alteração do arquivo externo;
- nenhuma persistência da recusa.

## Critérios de validação

- Provérbios 25:16 registrado como referência editorial;
- tamanho verificado antes de `file.text()`;
- texto vazio e texto excessivo recusados;
- JSON malformado recusado;
- profundidade excessiva recusada;
- nós excessivos recusados;
- listas e objetos extensos recusados;
- texto individual e soma de textos limitados;
- referência circular recusada em domínio;
- partilha e resposta pequenas aceitas;
- geração acima do orçamento interrompida;
- limite executado antes de checksum e versão;
- nenhuma persistência própria;
- assinatura exclusiva da Tehkné Solutions.
