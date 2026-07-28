# QA — Fase 8.25

## Catálogo editorial

- [ ] referência de Provérbios 18:17 validada;
- [ ] política `fingerprint-is-hint-equivalence-decides-v1` carregada;
- [ ] formato `received-[0-9a-f]{8}` documentado;
- [ ] impressão declarada não criptográfica e não exclusiva;
- [ ] projeção inclui avisos;
- [ ] projeção exclui somente `generatedAt` e `consistency`.

## Equivalência

- [ ] mesma cópia em outro instante é equivalente;
- [ ] mudança apenas no selo é equivalente;
- [ ] ordem de propriedades de objetos não altera equivalência;
- [ ] ordem de itens permanece significativa;
- [ ] ordem de avisos permanece significativa;
- [ ] diferença nos avisos quebra equivalência;
- [ ] impressão diferente é classificada antes da equivalência;
- [ ] impressão igual com equivalência diferente é colisão descritiva.

## Registro recebido

- [ ] cópia equivalente não duplica registro;
- [ ] colisão descritiva preserva as duas cópias;
- [ ] registro existente não é sobrescrito;
- [ ] busca plural retorna todos os candidatos;
- [ ] busca singular retorna somente a primeira ocorrência por compatibilidade;
- [ ] deduplicação usa busca por equivalência, não busca singular.

## Resposta

- [ ] formato canônico aceito;
- [ ] prefixo divergente recusado;
- [ ] tamanho divergente recusado;
- [ ] letras maiúsculas recusadas;
- [ ] caracteres não hexadecimais recusados;
- [ ] getter não é executado;
- [ ] geração recusa impressão malformada;
- [ ] retorno novamente selado recusa impressão malformada.

## Precedência

- [ ] checksum permanece anterior;
- [ ] referências catalogadas permanecem anteriores;
- [ ] formato da impressão permanece anterior aos avisos canônicos;
- [ ] parser de domínio permanece posterior;
- [ ] alteração sem novo selo é recusada pelo checksum.

## Compatibilidade e privacidade

- [ ] algoritmo histórico da impressão não mudou;
- [ ] formato histórico permanece compatível;
- [ ] nenhuma migração silenciosa;
- [ ] nenhuma store ou chave IndexedDB adicional;
- [ ] nenhum histórico de colisões;
- [ ] nenhuma telemetria ou analytics;
- [ ] assinatura exclusiva da Tehkné Solutions.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
