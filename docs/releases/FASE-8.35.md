# Release — Fase 8.35

## A Escrita que Não Apaga Outra Aba em Silêncio

- captura transitoriamente o texto bruto hidratado;
- compara o valor atual antes de cada substituição;
- executa leitura e escrita na mesma transação IndexedDB;
- preserva memória externa quando detecta conflito;
- preserva o runtime desta sessão;
- adiciona status `persistence-conflict`;
- bloqueia novas mutações até nova hidratação;
- não mescla, repete ou escolhe versão automaticamente;
- mantém chave, schema, persist version e object store;
- não cria fila, BroadcastChannel, histórico, analytics ou sincronização.

## Validação

```bash
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
