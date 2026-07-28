# QA — Fase 8.32

## Catálogo editorial

- [ ] referência de 1 Tessalonicenses 5:21 validada;
- [ ] política `validate-persisted-received-state-before-hydration-v1` carregada;
- [ ] chave de storage documentada;
- [ ] `schemaVersion: 1` exigida;
- [ ] migração silenciosa proibida;
- [ ] diagnóstico declarado transitório.

## Envelope

- [ ] ausência de memória preserva biblioteca inicial;
- [ ] envelope atual é aceito;
- [ ] versão futura é recusada;
- [ ] campo extra no topo é recusado;
- [ ] campo extra aninhado é recusado;
- [ ] propriedade getter é recusada sem execução;
- [ ] estrutura mínima incompleta é recusada.

## Pacotes

- [ ] pacote válido é revalidado;
- [ ] aviso inventado é recusado;
- [ ] selo recalculado não mascara aviso inválido;
- [ ] impressão recalculada não mascara pacote inválido;
- [ ] campos desconhecidos não são descartados;
- [ ] versão e conteúdo curado continuam obrigatórios.

## Biblioteca

- [ ] impressão divergente é recusada;
- [ ] cronologia regressiva é recusada;
- [ ] identidade alterada é recusada;
- [ ] catálogo misto é recusado;
- [ ] memória aceita é clonada defensivamente;
- [ ] memória recusada não altera o fallback;
- [ ] memória recusada não é mutada durante a conferência.

## Store e interface

- [ ] `merge` explícito usa a barreira de hidratação;
- [ ] memória aceita substitui somente o registry inicial;
- [ ] memória recusada mantém biblioteca nova no runtime;
- [ ] diagnóstico recusado aparece na página de recepção;
- [ ] mensagem informa que os bytes não foram apagados;
- [ ] status e issues ficam fora da partialização;
- [ ] reset limpa o diagnóstico transitório.

## Persistência e privacidade

- [ ] mesma chave IndexedDB;
- [ ] `schemaVersion` e `registry` continuam sendo os únicos campos persistidos;
- [ ] nenhuma nova store;
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
