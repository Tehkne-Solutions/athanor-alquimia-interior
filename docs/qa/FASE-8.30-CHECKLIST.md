# QA — Fase 8.30

## Catálogo editorial

- [ ] referência de Amós 3:3 validada;
- [ ] política `registry-catalog-version-matches-all-packages-v1` carregada;
- [ ] identidade esperada documentada;
- [ ] versão atual derivada da matriz oficial;
- [ ] mistura de catálogos proibida;
- [ ] migração silenciosa proibida;
- [ ] limite de 20 diagnósticos.

## Biblioteca

- [ ] identidade oficial aceita;
- [ ] identidade alterada recusada;
- [ ] SemVer malformado recusado;
- [ ] versão futura recusada;
- [ ] versão antiga sem migração recusada;
- [ ] biblioteca vazia atual aceita;
- [ ] pacote atual em biblioteca atual aceito;
- [ ] pacote malformado recusado;
- [ ] pacote de outra versão recusado;
- [ ] impressão recalculada não mascara versão divergente.

## Criação e inserção

- [ ] criação atual aceita;
- [ ] criação malformada lança `RangeError`;
- [ ] criação futura lança `RangeError`;
- [ ] pacote incompatível retorna `invalid`;
- [ ] pacote incompatível não é clonado nem guardado;
- [ ] mesma instância da biblioteca é preservada na recusa;
- [ ] pacote atual continua sendo inserido e deduplicado.

## Mutações

- [ ] biblioteca mista bloqueia arquivamento;
- [ ] biblioteca mista bloqueia reativação;
- [ ] biblioteca mista bloqueia remoção;
- [ ] nenhuma versão é substituída;
- [ ] nenhum pacote é movido ou reescrito;
- [ ] operações válidas continuam funcionando.

## Precedência

- [ ] cronologia permanece anterior;
- [ ] impressão armazenada permanece anterior;
- [ ] coerência de catálogo ocorre antes da ação;
- [ ] falhas anteriores não são mascaradas.

## Privacidade

- [ ] nenhuma nova store ou chave IndexedDB;
- [ ] nenhum histórico de recusas;
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
