# Notas técnicas de CI — Fase 8.16

## Escopo validado

- sintaxe JSON básica do scanner;
- duplicatas diretas e aninhadas;
- escapes equivalentes;
- fusíveis de profundidade e tokens;
- mensagens seguras;
- precedência sobre checksum, versão e parsers curados;
- compatibilidade com leitura válida;
- serialização de partilhas e respostas com chaves únicas;
- ausência de persistência própria.

## Comandos

```bash
npm ci
npm run validate:content
npm test
npm run build
```

## Observação

A barreira só pode operar no texto bruto. Chamadas de domínio que já receberam um objeto JavaScript não conseguem recuperar membros descartados anteriormente pelo `JSON.parse`.

**Tehkné Solutions**
