# Release — Fase 8.27

## O Relógio que Não Anda para Trás em Silêncio

- cronologia local exige UTC canônico com milissegundos;
- criação da biblioteca recusa formato temporal inválido;
- inserções anteriores ao último estado retornam `stale`;
- arquivamento, reativação e remoção não podem regredir o relógio local;
- instantes iguais permanecem válidos;
- biblioteca e cópias recebem inspeção de invariantes;
- cópia ativa não mantém `archivedAt`;
- cópia arquivada exige `archivedAt === updatedAt`;
- relógio externo do pacote não é comparado ao relógio local;
- bibliotecas legadas incoerentes permanecem intactas e bloqueiam mutações;
- wrappers existentes continuam compatíveis e seguros;
- nenhuma store, migração, telemetria ou analytics adicional.

## Validação

```bash
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
