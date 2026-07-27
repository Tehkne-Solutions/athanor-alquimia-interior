# Release Notes — Fase 8.19

## A Margem que Não se Apaga em Silêncio

A Fase 8.19 impede que espaços e quebras nas extremidades de textos sejam removidos automaticamente durante a geração ou sanitização de arquivos compartilhados.

### Entregas

- política de margens textuais exatas;
- inspeção iterativa de todas as strings conhecidas;
- recusa de margem inicial, final ou ambas;
- preservação de whitespace interno;
- diagnósticos sem reproduzir o conteúdo;
- limite de vinte caminhos;
- geração de partilhas protegida;
- geração de respostas protegida;
- recepção e retorno protegidos;
- remoção de `trim()` das saídas dos parsers;
- interface, testes, arquitetura e QA atualizados.

### Limites

A fase não corrige o arquivo, não remove espaços, não converte quebras, não autentica identidade e não cria histórico de recusas.

**Tehkné Solutions**
