# Fase 8.25 — A Impressão que Não Decide Sozinha em Silêncio

## Estado

Implementação funcional da equivalência canônica para cópias recebidas e da validação do formato de impressão em respostas locais.

## Problema

A biblioteca recebida usava uma impressão FNV-1a de 32 bits como único critério para ignorar uma nova cópia. Essa impressão é curta, descritiva e deliberadamente não criptográfica.

Dois problemas permaneciam:

1. uma colisão de hash poderia fazer conteúdos diferentes parecerem iguais;
2. o escopo histórico da impressão não inclui `notices`, portanto duas cópias com os mesmos itens, mas avisos editoriais diferentes, recebiam a mesma impressão.

Nesses casos, a segunda cópia poderia ser descartada silenciosamente.

## Solução

A política `fingerprint-is-hint-equivalence-decides-v1` separa agrupamento e decisão:

- a impressão seleciona candidatos;
- a equivalência canônica compara o conteúdo;
- somente impressão igual e equivalência igual representam cópia duplicada;
- impressão igual e equivalência diferente representa colisão descritiva;
- colisões são preservadas como registros separados.

## Equivalência canônica

A projeção inclui:

- schema;
- política;
- versão do catálogo;
- proveniência;
- coleção;
- opções;
- itens em ordem;
- avisos canônicos em ordem.

Ela exclui:

- `generatedAt`, para permitir reconhecer a mesma cópia exportada novamente;
- `consistency`, porque o selo protege o arquivo, mas não define o conteúdo descritivo da cópia.

A ordem de inserção das propriedades de objetos não altera a comparação. A ordem de itens e avisos continua significativa.

## Registro recebido

Foram adicionadas duas consultas explícitas:

- `findReceivedAllByFingerprint`, que retorna todos os candidatos;
- `findEquivalentReceivedCollection`, que procura equivalência canônica dentro do grupo.

`findReceivedByFingerprint` permanece por compatibilidade e retorna a primeira ocorrência. Ele não é mais usado para decidir deduplicação.

## Colisão editorial observável

O campo interno `linked` não atravessa a minimização, mas pode gerar o aviso opcional de registros não vinculados. Assim, dois pacotes podem conter os mesmos itens exportados e ainda diferir nos avisos.

A Fase 8.25 preserva ambos.

## Respostas

A impressão da origem em arquivos de resposta precisa usar:

```text
received-[0-9a-f]{8}
```

A verificação acontece:

- durante a geração da resposta;
- durante a leitura transitória do retorno;
- depois das referências catalogadas;
- antes dos avisos canônicos e do parser de domínio.

Uma impressão canônica não comprova que a origem existe, está disponível, pertence a alguém ou corresponde a uma identidade real.

## Precedência

```text
integridade das referências catalogadas
→ formato da impressão descritiva
→ avisos canônicos
→ schema e política
→ conteúdo curado
→ sanitização
```

O checksum permanece anterior. Uma impressão alterada sem novo selo continua sendo recusada pelo checksum antes da nova barreira.

## Compatibilidade

O algoritmo e o formato histórico da impressão não foram alterados. Respostas existentes no formato `received-xxxxxxxx` permanecem compatíveis.

A mudança ocorre somente na decisão de deduplicação: impressão igual deixa de ser suficiente.

## Diagnósticos

A resposta é recusada quando a impressão:

- usa outro prefixo;
- possui quantidade diferente de caracteres hexadecimais;
- contém letras maiúsculas;
- contém caracteres não hexadecimais;
- é fornecida por acessor em uma entrada não inerte.

O valor integral divergente não precisa ser reproduzido no diagnóstico.

## Segurança e privacidade

A fase não cria:

- rota;
- store;
- chave IndexedDB;
- histórico de colisões;
- correção automática;
- sincronização;
- analytics;
- telemetria.

Nenhum pacote existente é sobrescrito durante uma colisão.

## Assinatura

**Tehkné Solutions**
