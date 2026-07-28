# Release — Fase 8.36

## A Releitura que Não Escolhe uma Versão em Silêncio

- adiciona releitura explícita após `persistence-conflict`;
- relê somente a chave oficial da biblioteca recebida;
- valida JSON, envelope, persist version e estado hidratado;
- adota memória `accepted`;
- adota ausência confirmada como biblioteca vazia nova;
- mantém snapshot e conflito em memória `rejected`;
- mantém snapshot e conflito em leitura `unavailable`;
- atualiza a referência do compare-and-set somente após adoção;
- não repete a ação interrompida;
- não grava, mescla, corrige ou migra durante a releitura;
- adiciona botão `Examinar memória atual` na interface;
- preserva chave, schema e persist version existentes;
- não cria sincronização, fila, histórico ou telemetria.

## Validação

```bash
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
