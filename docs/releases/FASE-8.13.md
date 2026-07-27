# Release Notes — Fase 8.13

## A Medida que Protege sem Julgar o Conteúdo

A Fase 8.13 adiciona um orçamento técnico local para arquivos do ciclo compartilhado.

### Entregas

- limite de 512 KiB antes da leitura do arquivo;
- limite de texto bruto;
- inspeção iterativa de profundidade e nós;
- limites de listas, objetos e textos;
- aplicação antes de checksum e versão;
- integração na recepção e no retorno;
- validação antes de gerar partilhas e respostas;
- mensagens técnicas sem julgamento do conteúdo;
- testes unitários e de integração;
- documentação de produto, arquitetura e QA.

### Limites preservados

- nenhum truncamento;
- nenhum reparo automático;
- nenhuma alteração do arquivo externo;
- nenhum histórico de recusas;
- nenhum analytics;
- nenhum efeito sobre jornadas, coleções ou progresso.

### Ordem atual do ciclo de entrada

```text
orçamento de recursos
→ consistência
→ versão
→ schema e política
→ conteúdo curado
→ sanitização
```

**Tehkné Solutions**
