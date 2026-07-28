# Release — Fase 8.24

## O Aviso que Não Troca de Sentido em Silêncio

- catálogo canônico separado para partilhas e respostas;
- avisos desconhecidos recusados;
- avisos obrigatórios exigidos;
- duplicatas e alterações de ordem recusadas;
- condições de datas, coleção vazia e origem vazia conferidas;
- aviso de silêncio proibido em arquivo exportável;
- aviso de registros não vinculados preservado como opcional catalogado;
- geração protegida antes do checksum;
- recepção e retorno protegidos antes do parser;
- precedência das barreiras anteriores preservada;
- nenhuma persistência, analytics ou sincronização adicional;
- documentação, QA e rastreabilidade atualizados.

## Validação

A release exige aprovação de:

```bash
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
