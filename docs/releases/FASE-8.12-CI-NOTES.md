# Notas técnicas de CI — Fase 8.12

## Escopo validado

- SemVer estrito;
- comparação de major, minor e patch;
- matriz explícita de compatibilidade;
- recusa de versões futuras;
- recusa de versões antigas desconhecidas;
- recusa de versões malformadas;
- integração com checksum da Fase 8.11;
- preservação do arquivo original;
- ausência de persistência própria.

## Comandos

```bash
npm ci
npm run validate:content
npm test
npm run build
```

## Regra de evolução

Nenhuma versão legada pode ser adicionada à matriz sem migração explícita, documentação e testes próprios.

**Tehkné Solutions**
