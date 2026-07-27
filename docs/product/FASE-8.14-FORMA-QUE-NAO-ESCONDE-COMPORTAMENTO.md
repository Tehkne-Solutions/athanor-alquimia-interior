# Fase 8.14 — A Forma que Não Esconde Comportamento

**Assinatura:** Tehkné Solutions

## Objetivo

Garantir que arquivos compartilhados e exportações do Athanor contenham somente dados JSON passivos e previsíveis, sem funções, acessores, símbolos, protótipos especiais, arrays esparsos ou chaves reservadas capazes de introduzir comportamento inesperado.

## Núcleo bíblico

- **1 Coríntios 14:40** inicia a reflexão sobre ordem visível.
- A referência não transforma organização técnica em julgamento moral, autoridade ou prova de verdade.
- Inspeção de protótipos, descritores e chaves é estrutura autoral do Athanor.

## Catálogo

- ID: `continuous-inert-json-catalog`;
- versão: `1.0.0`;
- política: `plain-json-no-hidden-behavior-v1`;
- modo: `iterative-own-data-properties-only`;
- limite de inspeção: 50.000 nós;
- protótipos aceitos: `Object.prototype`, `null` e `Array.prototype`;
- acessores: recusados;
- funções, símbolos, bigint e undefined: recusados;
- números não finitos: recusados;
- arrays esparsos: recusados;
- referências repetidas: recusadas;
- chaves reservadas: `__proto__`, `prototype`, `constructor`.

## Problema corrigido

JSON lido por `JSON.parse` já não contém funções ou getters, mas ainda pode declarar chaves como `__proto__`. Além disso, as funções de domínio também podem ser chamadas diretamente por testes, integrações futuras ou código interno com objetos que não vieram de JSON.

Antes da Fase 8.14, essas chamadas poderiam alcançar o orçamento estrutural ou o checksum com:

- instâncias de classe;
- `Date`, `Map` ou `Set`;
- getters e setters;
- propriedades simbólicas;
- arrays esparsos;
- objetos com protótipos especiais;
- valores não representáveis em JSON interoperável.

A nova barreira interrompe esses formatos antes de qualquer interpretação posterior.

## Ordem de validação

```text
tamanho declarado do arquivo
→ leitura do texto
→ tamanho do texto
→ JSON.parse
→ forma JSON inerte
→ orçamento de recursos
→ checksum
→ compatibilidade de versão
→ schema e política
→ conteúdo curado
→ sanitização
```

Em chamadas diretas de domínio, a validação começa em **forma JSON inerte**.

O teto de 50.000 nós da inspeção de forma é um fusível próprio contra chamadas programáticas extremas. Ele não substitui o orçamento estrutural da Fase 8.13, que permanece mais restritivo em 10.000 nós e também possui limites específicos para listas, profundidade, campos e textos. Assim, uma estrutura inerte mas extensa recebe o diagnóstico do orçamento correspondente.

## Inspeção por descritores

Objetos são examinados com:

- `Object.getPrototypeOf`;
- `Reflect.ownKeys`;
- `Object.getOwnPropertyDescriptors`.

O valor de um getter não é lido. A presença de getter ou setter causa recusa imediata.

Consultas que falhem, como em proxies hostis, são convertidas em erro técnico. A Fase 8.14 não tenta contornar, executar ou reparar o objeto.

## Valores simples

São aceitos:

- `null`;
- booleanos;
- strings;
- números finitos;
- arrays densos;
- objetos simples.

São recusados:

- `undefined`;
- funções;
- símbolos;
- `bigint`;
- `NaN`;
- `Infinity` e `-Infinity`.

## Objetos

Um objeto é aceito somente quando:

- seu protótipo é `Object.prototype` ou `null`;
- todas as propriedades são próprias;
- todas são enumeráveis;
- todas são descritores de dados;
- não existem propriedades simbólicas;
- nenhuma chave pertence à lista reservada;
- os valores filhos também passam pela mesma inspeção.

Objetos com protótipo nulo são aceitos porque podem representar mapas de dados sem herança.

## Arrays

Um array é aceito somente quando:

- usa `Array.prototype`;
- todos os índices entre zero e `length - 1` existem;
- índices são canônicos;
- não existem propriedades extras;
- elementos também são JSON inerte.

Arrays esparsos são recusados, em vez de convertidos implicitamente para `null`.

## Chaves reservadas

As seguintes chaves são recusadas em qualquer profundidade:

- `__proto__`;
- `prototype`;
- `constructor`.

A recusa é preventiva. A fase não afirma que todo uso dessas palavras seja malicioso; apenas impede que pacotes compartilhados carreguem nomes associados a alteração ou confusão de protótipos.

## Referências repetidas

JSON representa árvores, não grafos com identidade compartilhada. Por isso, chamadas diretas com o mesmo objeto reutilizado em dois pontos são recusadas, mesmo sem ciclo.

Também são recusadas referências circulares.

Valores vindos de `JSON.parse` não possuem referências compartilhadas, mas esta regra protege o domínio contra chamadas programáticas.

## Geração de arquivos

Antes do checksum, os geradores validam:

- pacote de partilha;
- pacote de resposta.

Campos opcionais ausentes não são mais materializados como propriedades `undefined`. Eles são omitidos do objeto final.

Assim, o Athanor não produz um pacote que viole sua própria política de forma inerte.

## Recepção e retorno

A recepção de partilhas e a leitura de retornos validam a forma inerte duas vezes:

1. durante a leitura local do arquivo;
2. na função de domínio, para proteger chamadas diretas.

A duplicação é deliberada e não cria persistência.

## Interface

Não existe rota própria. As telas de recepção e retorno informam:

- versão da política de forma inerte;
- limite de arquivo;
- ordem das barreiras;
- motivo técnico quando a forma é recusada.

## Persistência

A Fase 8.14 não cria:

- store Zustand;
- chave IndexedDB;
- log de chaves recusadas;
- contador de arquivos;
- telemetria;
- analytics;
- histórico de validação.

## Limites da garantia

Forma JSON inerte não comprova:

- autenticidade;
- autoria;
- identidade;
- inocuidade semântica;
- veracidade;
- adequação emocional ou espiritual;
- ausência de texto ofensivo;
- segurança criptográfica.

Ela garante somente que a estrutura aceita permanece composta por dados JSON passivos e visíveis.

## Segurança e autonomia

- nenhum valor recusado é convertido;
- nenhuma propriedade é executada;
- nenhum arquivo externo é alterado;
- nenhuma chave é renomeada automaticamente;
- nenhum array é preenchido;
- nenhuma instância é serializada por aproximação;
- nenhuma recusa é associada a falha pessoal;
- nenhum resultado é enviado.

## Critérios de validação

- 1 Coríntios 14:40 registrado como referência editorial;
- valores JSON simples aceitos;
- objetos com protótipo nulo aceitos;
- funções, símbolos, bigint e undefined recusados;
- números não finitos recusados;
- Date, Map, Set e classes recusados;
- getters recusados sem execução;
- propriedades simbólicas e não enumeráveis recusadas;
- chaves reservadas recusadas;
- arrays esparsos e com propriedades extras recusados;
- referências repetidas e circulares recusadas;
- proxies hostis tratados como falha;
- leitura local valida forma antes do orçamento;
- inspeção de forma e orçamento mantêm limites independentes;
- partilha e retorno validam forma antes de checksum e versão;
- exportações geradas passam pela validação;
- campos opcionais undefined são omitidos;
- nenhuma persistência própria;
- assinatura exclusiva da Tehkné Solutions.
