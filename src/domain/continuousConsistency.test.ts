import { describe, expect, it } from 'vitest';
import {
  attachContinuousConsistency,
  canonicalizeContinuousPayload,
  computeContinuousConsistencyChecksum,
  createContinuousConsistencySeal,
  verifyContinuousConsistency
} from './continuousConsistency';

describe('selo local de consistência', () => {
  it('produz canonicalização estável para chaves em ordens diferentes', () => {
    const first = { z: 1, a: { d: 4, b: 2 } };
    const second = { a: { b: 2, d: 4 }, z: 1 };
    expect(canonicalizeContinuousPayload(first)).toBe(canonicalizeContinuousPayload(second));
    expect(computeContinuousConsistencyChecksum(first)).toBe(computeContinuousConsistencyChecksum(second));
  });

  it('preserva a ordem das listas', () => {
    const first = { items: ['a', 'b'] };
    const second = { items: ['b', 'a'] };
    expect(computeContinuousConsistencyChecksum(first)).not.toBe(computeContinuousConsistencyChecksum(second));
  });

  it('exclui o campo de consistência do próprio cálculo', () => {
    const payload = { schema: 'example', value: 3 };
    const sealed = attachContinuousConsistency(payload);
    expect(computeContinuousConsistencyChecksum(sealed)).toBe(sealed.consistency.checksum);
  });

  it('declara que o selo não é criptográfico nem autentica identidade', () => {
    const seal = createContinuousConsistencySeal({ value: 1 });
    expect(seal.cryptographic).toBe(false);
    expect(seal.authenticatesIdentity).toBe(false);
    expect(seal.algorithm).toBe('fnv1a-32');
  });

  it('verifica pacote não alterado', () => {
    const sealed = attachContinuousConsistency({ schema: 'example', nested: { value: true } });
    expect(verifyContinuousConsistency(sealed).status).toBe('valid');
  });

  it('detecta alteração posterior', () => {
    const sealed = attachContinuousConsistency({ schema: 'example', label: 'Original' });
    const changed = { ...sealed, label: 'Alterado' };
    const result = verifyContinuousConsistency(changed);
    expect(result.status).toBe('invalid');
    expect(result.message).toMatch(/mudou depois/i);
  });

  it('aceita ausência como estado legado separado', () => {
    const result = verifyContinuousConsistency({ schema: 'legacy' });
    expect(result.status).toBe('missing');
    expect(result.message).toMatch(/legado/i);
  });

  it('recusa algoritmo incompatível', () => {
    const sealed = attachContinuousConsistency({ schema: 'example' });
    const changed = { ...sealed, consistency: { ...sealed.consistency, algorithm: 'sha-256' } };
    expect(verifyContinuousConsistency(changed).status).toBe('unsupported');
  });

  it('recusa declaração falsa de autenticação', () => {
    const sealed = attachContinuousConsistency({ schema: 'example' });
    const changed = { ...sealed, consistency: { ...sealed.consistency, authenticatesIdentity: true } };
    expect(verifyContinuousConsistency(changed).status).toBe('unsupported');
  });

  it('não depende de campos undefined em objetos', () => {
    const first = { label: 'A', optional: undefined };
    const second = { label: 'A' };
    expect(computeContinuousConsistencyChecksum(first)).toBe(computeContinuousConsistencyChecksum(second));
  });

  it('representa undefined em listas como null, igual ao JSON', () => {
    expect(canonicalizeContinuousPayload({ items: [undefined] })).toContain('[null]');
  });

  it('recusa valores que não sejam objetos', () => {
    expect(verifyContinuousConsistency('texto').status).toBe('invalid');
    expect(verifyContinuousConsistency(null).status).toBe('invalid');
  });
});
