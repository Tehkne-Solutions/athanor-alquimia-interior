# QA — Fase 8.16

**Produto:** Athanor — Alquimia Interior  
**Assinatura:** Tehkné Solutions

## Validação editorial

- Provérbios 20:10 registrado como abertura;
- política `unique-decoded-object-keys-before-json-parse-v1`;
- resolução automática desativada;
- regra de último valor desativada;
- comparação decodificada e exata;
- quatorze restrições editoriais presentes.

## Scanner lexical

- objeto vazio aceito;
- objeto aninhado aceito;
- listas e raiz primitiva aceitas;
- números JSON válidos reconhecidos;
- literais `true`, `false` e `null` reconhecidos;
- strings com chaves aparentes dentro do valor não confundem o scanner;
- vírgula final recusada;
- conteúdo adicional depois da raiz recusado;
- escapes inválidos recusados;
- números fora da gramática recusados;
- fusível de profundidade aplicado;
- fusível de tokens aplicado.

## Duplicatas

- duplicata direta recusada;
- duplicata aninhada recusada;
- mesma chave em objetos diferentes aceita;
- `id` e `ID` tratados como distintos;
- chave literal e `\u0061` equivalente recusadas;
- barra literal e barra escapada equivalentes recusadas;
- emoji literal e pares substitutos escapados equivalentes recusados;
- chave reservada duplicada recusada;
- formas Unicode canonicamente equivalentes, mas não idênticas, permanecem distintas nesta barreira.

## Diagnósticos

- primeira e segunda posições informadas;
- nomes longos truncados no diagnóstico;
- caracteres não ASCII escapados;
- controle bidirecional não reproduzido diretamente;
- sintaxe malformada mapeada para a mensagem genérica do produto.

## Integração

- duplicata de `catalogVersion` recusada antes da matriz SemVer;
- duplicata de `checksum` recusada antes da conferência;
- duplicata de `label` recusada antes do parser curado;
- chave escapada equivalente recusada antes do `JSON.parse`;
- partilha válida continua até a recepção;
- resposta válida continua até a prévia transitória;
- JSON de partilha gerado possui chaves únicas;
- JSON de resposta gerado possui chaves únicas.

## Interface

- recepção informa que as chaves são verificadas antes do parse;
- retorno informa a mesma ordem;
- erro de duplicata impede prévia e consentimentos;
- nenhuma escolha de valor é apresentada ao usuário.

## Persistência

A fase não cria:

- store;
- chave IndexedDB;
- cache;
- histórico;
- contador;
- analytics;
- comunicação externa.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```
