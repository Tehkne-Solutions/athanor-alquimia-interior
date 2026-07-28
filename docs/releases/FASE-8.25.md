# Release — Fase 8.25

## A Impressão que Não Decide Sozinha em Silêncio

- impressão curta mantida como indício descritivo;
- equivalência canônica adicionada para decidir duplicação;
- `generatedAt` e `consistency` excluídos da equivalência;
- avisos canônicos incluídos na equivalência;
- cópias equivalentes continuam deduplicadas;
- colisões descritivas preservam todos os registros;
- busca plural por impressão adicionada;
- busca singular mantida apenas por compatibilidade;
- formato `received-[0-9a-f]{8}` validado em respostas;
- geração e retorno transitório protegidos;
- checksum e referências catalogadas mantêm precedência;
- nenhuma persistência, analytics ou telemetria adicional;
- documentação, QA e rastreabilidade atualizados.

## Validação

```bash
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
