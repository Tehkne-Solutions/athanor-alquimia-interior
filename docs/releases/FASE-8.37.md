# Release — Fase 8.37

## O Texto Persistido que Não Perde um Valor Antes da Hidratação em Silêncio

- inspeciona o texto bruto vindo da IndexedDB antes do `JSON.parse`;
- aplica limites de bytes e caracteres;
- recusa chaves decodificadas repetidas;
- recusa números que mudariam de medida;
- reaplica forma inerte, orçamento e Unicode visível;
- integra hidratação inicial e releitura explícita;
- preserva bytes recusados, snapshot ativo e referência de concorrência;
- não escolhe primeiro ou último valor;
- não corrige, normaliza ou reserializa a memória;
- não cria nova chave, schema, object store ou telemetria.

## Validação

```bash
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
