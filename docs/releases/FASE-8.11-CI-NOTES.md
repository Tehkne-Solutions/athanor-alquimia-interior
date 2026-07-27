# Notas técnicas de CI — Fase 8.11

## Escopo validado

- canonicalização determinística;
- checksum FNV-1a 32;
- geração de selo em partilhas;
- geração de selo em respostas;
- verificação de partilhas recebidas;
- verificação de retornos;
- compatibilidade legada;
- rejeição de adulteração;
- ausência de persistência própria.

## Comandos

```bash
npm ci
npm run validate:content
npm test
npm run build
```

## Observação de segurança

O checksum é uma conferência local de consistência. Ele não deve ser descrito como assinatura digital, autenticação, criptografia ou prova de autoria.

**Tehkné Solutions**
