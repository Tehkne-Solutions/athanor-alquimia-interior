# Notas técnicas de CI — Fase 8.15

## Escopo validado

- NFC em valores e nomes de campos;
- controles C0, DEL e C1;
- direção bidirecional;
- controles de largura zero;
- pares substitutos inválidos;
- não caracteres e `U+FFFD`;
- precedência do orçamento estrutural;
- precedência sobre checksum e versão;
- geração de partilhas e respostas;
- ausência de persistência própria.

## Comandos

```bash
npm ci
npm run validate:content
npm test
npm run build
```

## Diagnósticos

Em falhas, o workflow preserva:

- `athanor-content-diagnostics`;
- `athanor-test-diagnostics`;
- `athanor-build-diagnostics`.

## Observação

A validação textual rejeita sem reescrever. Ela não deve ser descrita como moderação, detecção completa de homógrafos ou autenticação.

**Tehkné Solutions**
