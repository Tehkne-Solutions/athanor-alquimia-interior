# Fase 8.15 — A Palavra que Não se Disfarça

**Assinatura:** Tehkné Solutions

## Objetivo

Garantir que textos e nomes de campos dos arquivos compartilhados permaneçam em Unicode NFC e não usem controles invisíveis, direção bidirecional, pares substitutos inválidos ou caracteres reservados para ocultar, inverter ou perder parte da leitura.

A fase recusa o texto como recebido. Ela não normaliza, reescreve, traduz ou repara silenciosamente o arquivo.

## Núcleo bíblico

- **Provérbios 12:17** inicia a reflexão sobre expressão fiel.
- A referência não transforma uma regra Unicode em julgamento moral, espiritual ou diagnóstico de intenção.
- Normalização NFC, inspeção de pontos de código e política de não reescrita são estruturas autorais do Athanor.

## Catálogo

- ID: `continuous-text-visibility-catalog`;
- versão: `1.0.0`;
- política: `nfc-visible-text-no-directional-controls-v1`;
- modo: `reject-without-rewrite`;
- normalização exigida: `NFC`;
- fusível da inspeção: 20.000 nós;
- valores textuais: inspecionados;
- nomes de campos: inspecionados;
- tabulação, LF e CR: permitidos;
- reescrita automática: desativada.

## Ordem das barreiras

```text
tamanho declarado do arquivo
→ leitura do texto
→ tamanho do texto bruto
→ JSON.parse
→ forma JSON inerte
→ orçamento estrutural
→ visibilidade textual Unicode
→ checksum
→ compatibilidade de versão
→ schema e política
→ conteúdo curado
→ sanitização
```

A visibilidade textual vem depois do orçamento para que estruturas ou textos excessivos sejam interrompidos antes de uma inspeção completa de pontos de código.

Ela vem antes do checksum para impedir que um pacote tecnicamente selado, mas visualmente direcionado ou ambíguo, avance para a prévia.

## Normalização NFC

Todo valor textual e todo nome de campo precisa satisfazer:

```ts
value === value.normalize('NFC')
```

Exemplo:

- `Café` em NFC: aceito;
- `Cafe` seguido de acento combinante, quando equivalente mas não NFC: recusado.

A fase não substitui a forma recebida pela forma normalizada. A correção deve acontecer fora do Athanor e gerar um novo arquivo deliberadamente.

## Controles permitidos

Somente três controles são permitidos dentro de strings:

- `U+0009` — tabulação;
- `U+000A` — quebra de linha;
- `U+000D` — retorno de carro.

Os demais controles C0, DEL e C1 são recusados.

## Direção bidirecional

São recusados:

- `U+061C` — Arabic Letter Mark;
- `U+200E` e `U+200F` — marcas de direção;
- `U+202A` a `U+202E` — incorporações e sobrescritas bidirecionais;
- `U+2066` a `U+2069` — isoladores bidirecionais.

Esses caracteres podem alterar a ordem visual sem alterar a sequência lógica do texto. A recusa evita que o arquivo pareça dizer algo diferente do conteúdo inspecionado.

## Controles invisíveis

A política também recusa:

- `U+00AD` — soft hyphen;
- `U+034F` — combining grapheme joiner;
- `U+180E` — separador mongol invisível;
- `U+200B` a `U+200D` — espaço e juntores de largura zero;
- `U+2060` a `U+2064` — juntores e operadores invisíveis;
- `U+FEFF` — BOM ou espaço sem quebra de largura zero;
- `U+FFF9` a `U+FFFB` — anotações interlineares;
- `U+E0000` a `U+E007F` — caracteres de tag.

A política permite variation selectors, inclusive `U+FE0F`, para não recusar automaticamente apresentações comuns de emoji.

## Separadores Unicode

`U+2028` e `U+2029` são recusados. Quebras de linha precisam usar os controles permitidos LF ou CR.

## Pares substitutos

Strings UTF-16 com:

- substituto alto sem substituto baixo correspondente;
- substituto baixo sem substituto alto anterior;

são recusadas antes da normalização.

Isso cobre inclusive escapes JSON como `\ud800` que podem ser aceitos pelo parser como uma string JavaScript inválida para interoperabilidade Unicode completa.

## Não caracteres e substituição de decodificação

São recusados:

- `U+FDD0` a `U+FDEF`;
- qualquer ponto de código terminado em `FFFE` ou `FFFF` em um plano Unicode;
- `U+FFFD`, caractere de substituição.

A recusa de `U+FFFD` evita que bytes ou sequências perdidos durante decodificação sejam aceitos silenciosamente como conteúdo definitivo.

## Valores e nomes de campos

A inspeção percorre:

- todos os valores string;
- todas as chaves string de objetos;
- índices de arrays como chaves estruturais;
- objetos e listas de forma iterativa.

Acessores não são executados. Caso um getter, setter, chave simbólica, proxy hostil ou referência circular alcance diretamente esta função, a inspeção falha de modo seguro.

A Fase 8.14 continua sendo responsável pela forma JSON inerte e precede esta fase.

## Geração de arquivos

Antes do checksum, os geradores validam:

- pacote de partilha;
- pacote de resposta.

Um rótulo ou declaração não NFC, com controle invisível ou direção bidirecional impede a geração. O texto não é modificado automaticamente.

## Recepção e retorno

A recepção de partilhas e a leitura de retornos validam texto em duas camadas:

1. durante a leitura local do arquivo;
2. na função de domínio, protegendo chamadas diretas.

Quando o texto é válido, a prévia inclui uma mensagem descritiva de confirmação Unicode NFC, sem afirmar veracidade, autenticidade ou segurança.

## Persistência

A Fase 8.15 não cria:

- store Zustand;
- chave IndexedDB;
- log de pontos de código recusados;
- histórico de arquivos;
- contador;
- telemetria;
- analytics;
- serviço de normalização.

## Limites da garantia

A política não detecta ou comprova:

- identidade;
- autoria;
- autenticidade;
- veracidade;
- intenção;
- conteúdo ofensivo;
- todos os homógrafos e caracteres visualmente semelhantes;
- mistura legítima ou enganosa de alfabetos;
- segurança criptográfica.

Ela garante somente que os textos aceitos estão em NFC e não contêm os controles e pontos de código explicitamente proibidos.

## Segurança e autonomia

- nenhum texto é reescrito;
- nenhum arquivo externo é alterado;
- nenhuma palavra é traduzida;
- nenhum alfabeto é substituído;
- nenhum caractere semelhante é adivinhado;
- nenhuma recusa é associada a falha pessoal, moral ou espiritual;
- nenhum resultado é enviado.

## Critérios de validação

- Provérbios 12:17 registrado como referência editorial;
- texto português NFC aceito;
- tabulação, LF e CR aceitos;
- texto não NFC recusado sem reescrita;
- nomes de campos não NFC recusados;
- controles C0, DEL e C1 recusados conforme política;
- controles bidirecionais recusados;
- controles de largura zero recusados;
- soft hyphen, BOM, anotações e tags recusados;
- pares substitutos inválidos recusados;
- não caracteres recusados;
- `U+FFFD` recusado;
- variation selector permitido;
- orçamento estrutural preservado como barreira anterior;
- checksum preservado como barreira posterior;
- geração de partilha e resposta protegida;
- nenhuma persistência própria;
- assinatura exclusiva da Tehkné Solutions.
