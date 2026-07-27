# Fase 8.16 — A Chave que Não se Repete em Silêncio

**Assinatura:** Tehkné Solutions

## Objetivo

Impedir que um arquivo JSON declare o mesmo nome de campo mais de uma vez dentro do mesmo objeto e deixe o `JSON.parse` escolher silenciosamente o último valor.

A inspeção acontece no texto bruto, antes da criação do objeto JavaScript, porque depois do parse os membros anteriores já foram descartados e não podem ser recuperados.

## Núcleo bíblico

- **Provérbios 20:10** inicia a reflexão sobre medidas divergentes.
- A referência não transforma erro técnico em julgamento moral ou espiritual.
- Scanner lexical, comparação decodificada, fusíveis e política de recusa são estruturas autorais do Athanor.

## Catálogo

- ID: `continuous-unique-keys-catalog`;
- versão: `1.0.0`;
- política: `unique-decoded-object-keys-before-json-parse-v1`;
- escopo: `raw-json-text`;
- comparação: `decoded-json-string-exact`;
- resolução automática: não;
- regra de último valor: não;
- profundidade máxima do scanner: 128;
- tokens máximos do scanner: 300.000.

## Problema do parser padrão

O texto abaixo é aceito pelo `JSON.parse`:

```json
{
  "catalogVersion": "1.0.0",
  "catalogVersion": "99.0.0"
}
```

O objeto resultante contém apenas:

```json
{
  "catalogVersion": "99.0.0"
}
```

A primeira declaração desaparece antes que checksum, versão, schema ou conteúdo curado possam avaliá-la.

A Fase 8.16 interrompe o arquivo antes dessa perda.

## Comparação de chaves

Os nomes são comparados depois de decodificar a sintaxe de string JSON.

Portanto, estes pares são duplicatas:

```json
{
  "catalogVersion": "1.0.0",
  "\u0063atalogVersion": "2.0.0"
}
```

```json
{
  "a/b": 1,
  "a\/b": 2
}
```

```json
{
  "😀": 1,
  "\uD83D\uDE00": 2
}
```

A comparação é exata e sensível a maiúsculas:

```json
{
  "id": 1,
  "ID": 2
}
```

Esse objeto não possui duplicata segundo esta política.

## Relação com Unicode NFC

A Fase 8.16 não normaliza os nomes antes da comparação.

Assim, `"é"` e `"e\u0301"` são chaves diferentes nesta barreira. A segunda forma será recusada posteriormente pela Fase 8.15 por não estar em NFC.

A ordem preserva responsabilidades claras:

1. unicidade exata após decodificação JSON;
2. criação do objeto;
3. forma inerte e orçamento;
4. visibilidade textual e NFC.

## Escopo por objeto

A mesma chave pode aparecer em objetos diferentes:

```json
{
  "left": { "id": 1 },
  "right": { "id": 2 }
}
```

A duplicidade existe somente quando o mesmo objeto declara duas vezes o mesmo nome decodificado.

## Scanner lexical

O scanner percorre a gramática JSON sem criar o objeto de destino.

Ele reconhece:

- objetos;
- listas;
- strings e escapes;
- números JSON;
- `true`;
- `false`;
- `null`;
- espaços permitidos pela gramática.

Para cada objeto, mantém um conjunto temporário dos nomes já declarados. O conjunto é descartado ao sair daquele objeto.

## Fusíveis

Embora o texto já possua limite de tamanho, o scanner também possui:

- profundidade máxima de 128 níveis;
- máximo de 300.000 tokens.

Esses fusíveis protegem a inspeção anterior ao `JSON.parse`. Os limites mais restritos da Fase 8.13 continuam responsáveis pelo orçamento normal do pacote depois do parse.

## Diagnósticos seguros

Uma chave recusada pode conter controles direcionais ou caracteres invisíveis que ainda não passaram pela Fase 8.15.

Por isso o diagnóstico:

- não imprime diretamente caracteres não ASCII;
- representa pontos de código como `\u{202E}`;
- limita o comprimento exibido;
- informa posições numéricas da primeira e da nova declaração;
- nunca executa ou interpreta o valor associado.

## Integração com leitura local

A ordem completa passa a ser:

```text
file.size
→ file.text()
→ text.length
→ unicidade das chaves no texto JSON
→ JSON.parse
→ forma JSON inerte
→ orçamento estrutural
→ visibilidade textual Unicode
→ checksum
→ versão
→ schema e política
→ conteúdo curado
→ sanitização
```

Quando o scanner encontra sintaxe malformada, a interface preserva a mensagem genérica já usada pelo produto:

```text
Não foi possível interpretar o arquivo como JSON.
```

Quando encontra duplicata, a mensagem identifica a recusa de chave antes das demais barreiras.

## Geração de arquivos

Objetos JavaScript não conseguem manter duas propriedades próprias com o mesmo nome ao mesmo tempo. `JSON.stringify` também produz cada chave existente apenas uma vez.

Mesmo assim, os testes da fase serializam partilhas e respostas reais e passam o texto resultante pelo scanner para documentar e preservar essa garantia.

## Limites da garantia

Chaves únicas não comprovam:

- autenticidade;
- identidade;
- autoria humana;
- intenção;
- data;
- veracidade;
- segurança criptográfica;
- ausência de conteúdo prejudicial.

A barreira apenas impede sobrescrita silenciosa de membros no parse.

## Persistência

A fase não cria:

- store Zustand;
- chave IndexedDB;
- cache de scanner;
- histórico de recusas;
- contador de duplicatas;
- analytics;
- comunicação de rede.

O arquivo externo nunca é alterado.

## Critérios de validação

- Provérbios 20:10 registrado como referência editorial;
- duplicata direta recusada;
- duplicata aninhada recusada;
- mesma chave em objetos diferentes aceita;
- escapes Unicode equivalentes reconhecidos;
- barra escapada equivalente reconhecida;
- pares substitutos escapados equivalentes reconhecidos;
- comparação sensível a maiúsculas;
- nenhuma normalização NFC nesta barreira;
- strings de valores não confundem o scanner;
- números, literais, listas e raiz primitiva reconhecidos;
- sintaxe malformada preserva erro genérico na leitura;
- fusíveis de profundidade e tokens testados;
- diagnósticos não imprimem controles invisíveis diretamente;
- duplicata interrompida antes de checksum e versão;
- partilhas e respostas geradas confirmadas com chaves únicas;
- nenhuma persistência própria;
- assinatura exclusiva da Tehkné Solutions.
