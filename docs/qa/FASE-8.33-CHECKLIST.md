# QA — Fase 8.33

## Política editorial

- [ ] referência de Eclesiastes 3:1 validada;
- [ ] política `block-received-actions-until-hydration-settles-v1` carregada;
- [ ] fila e replay automático desabilitados;
- [ ] diagnósticos fora da IndexedDB.

## Portão

- [ ] `initial` retorna `hydrating`;
- [ ] `unavailable` retorna `unavailable`;
- [ ] `empty` permite ação;
- [ ] `accepted` permite ação;
- [ ] `rejected` permite ação explícita;
- [ ] função protegida não é chamada durante bloqueio;
- [ ] ação bloqueada não é repetida depois.

## Store

- [ ] inserção bloqueada antes da hidratação;
- [ ] arquivamento bloqueado antes da hidratação;
- [ ] reativação bloqueada antes da hidratação;
- [ ] remoção bloqueada antes da hidratação;
- [ ] reset bloqueado antes da hidratação;
- [ ] ação liberada usa domínio normalmente;
- [ ] somente mudança real chama `set` na store persistida.

## Falha da storage

- [ ] erro da IndexedDB produz `unavailable`;
- [ ] erro não é tratado como `empty`;
- [ ] detalhe transitório é exibido;
- [ ] fallback não é gravado automaticamente;
- [ ] store de ciclo não usa persist middleware.

## Interface

- [ ] card de exame aparece em `initial`;
- [ ] card de indisponibilidade aparece em `unavailable`;
- [ ] input de arquivo fica desabilitado;
- [ ] consentimentos ficam desabilitados;
- [ ] guardar, arquivar, reativar e remover ficam desabilitados;
- [ ] navegação e leitura permanecem disponíveis.

## Pipeline

```bash
npm ci
npm run validate:content
npm test
npm run build
```

**Tehkné Solutions**
