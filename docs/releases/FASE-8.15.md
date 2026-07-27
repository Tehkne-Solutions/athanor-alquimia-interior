# Release Notes — Fase 8.15

## A Palavra que Não se Disfarça

A Fase 8.15 adiciona uma barreira Unicode explícita ao ciclo compartilhado do Athanor.

### Entregas

- normalização NFC obrigatória sem reescrita automática;
- inspeção de valores textuais e nomes de campos;
- recusa de controles C0, DEL e C1 não permitidos;
- recusa de direção bidirecional e controles de largura zero;
- recusa de soft hyphen, BOM, anotações interlineares e tags;
- recusa de pares substitutos inválidos;
- recusa de não caracteres e `U+FFFD`;
- preservation de tabulação, LF, CR e variation selectors;
- integração com leitura local, recepção, retorno, partilha e resposta;
- testes unitários e de integração;
- interface, arquitetura, QA e README atualizados.

### Ordem

```text
forma JSON inerte
→ orçamento estrutural
→ texto visível Unicode
→ checksum
→ versão
```

### Limites explícitos

A fase não:

- corrige ou normaliza silenciosamente;
- detecta todas as letras visualmente semelhantes;
- modera palavras;
- comprova identidade, autoria ou veracidade;
- cria histórico ou telemetria.

**Tehkné Solutions**
