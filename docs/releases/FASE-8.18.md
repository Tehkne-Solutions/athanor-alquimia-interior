# Release Notes — Fase 8.18

## O Campo que Não Some em Silêncio

A Fase 8.18 adiciona contratos recursivos e estritos para os campos de partilhas e respostas.

### Entregas

- manifesto completo do pacote de partilha;
- manifesto completo do pacote de resposta;
- validação de objetos aninhados e itens de listas;
- recusa de propriedades extras antes da sanitização;
- proteção contra nomes herdados do protótipo;
- leitura de descritores sem executar getters;
- caminhos ASCII-seguros;
- limite de 20 diagnósticos;
- integração aos wrappers de recepção e retorno;
- testes unitários e de precedência;
- documentação editorial, técnica e de QA.

### Compatibilidade

Campos opcionais conhecidos continuam podendo faltar. A ordem das propriedades não importa. Novos campos exigirão uma nova versão com manifesto explícito.

### Limites

A validação não interpreta campos desconhecidos, não os apaga, não altera o arquivo original e não comprova identidade ou autoria.

**Tehkné Solutions**
