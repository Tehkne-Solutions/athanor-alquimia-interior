# Continuous Consistency V1

## Contrato

```ts
interface ContinuousConsistencySeal {
  version: '1.0.0';
  algorithm: 'fnv1a-32';
  scope: 'top-level-without-consistency';
  checksum: string;
  cryptographic: false;
  authenticatesIdentity: false;
}
```

## Regra de cálculo

1. remover `consistency` do nível superior;
2. ordenar chaves de objetos;
3. preservar ordem de arrays;
4. serializar de forma determinística;
5. calcular FNV-1a 32;
6. formatar como `fnv1a32-xxxxxxxx`.

## Compatibilidade

- selo válido: aceitar e sanitizar;
- selo ausente: aceitar como legado com aviso;
- selo inválido: recusar;
- versão ou algoritmo incompatível: recusar.

## Limite

Este contrato não autentica identidade, autoria, data, intenção ou veracidade. Não é assinatura digital e não é criptográfico.

**Tehkné Solutions**
