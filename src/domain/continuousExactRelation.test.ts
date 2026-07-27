import { describe, expect, it } from 'vitest';
import {
  validateContinuousResponseExactRelation,
  validateContinuousShareExactRelation
} from './continuousExactRelation';

const generatedAt = '2026-07-27T22:00:00.000Z';

function item(overrides: Record<string, unknown> = {}) {
  return {
    position: 1,
    occurredAt: '2026-07-27T20:00:00.000Z',
    completedAt: '2026-07-27T21:00:00.000Z',
    ...overrides
  };
}

function share(overrides: Record<string, unknown> = {}) {
  return {
    generatedAt,
    collection: { itemCount: 1 },
    options: { includeDates: true },
    items: [item()],
    ...overrides
  };
}

describe('relações exatas contínuas', () => {
  it('aceita pacote coerente', () => {
    expect(validateContinuousShareExactRelation(share()).ok).toBe(true);
  });

  it('aceita coleção vazia com quantidade zero', () => {
    expect(validateContinuousShareExactRelation(share({ collection: { itemCount: 0 }, items: [] })).ok).toBe(true);
  });

  it('recusa quantidade diferente da lista', () => {
    const result = validateContinuousShareExactRelation(share({ collection: { itemCount: 2 } }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/quantidade declarada/i);
  });

  it('recusa posição fora da sequência', () => {
    const result = validateContinuousShareExactRelation(share({ items: [item({ position: 2 })] }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/posição/i);
  });

  it('aceita várias posições sequenciais', () => {
    const result = validateContinuousShareExactRelation(share({
      collection: { itemCount: 2 },
      items: [item(), item({ position: 2 })]
    }));
    expect(result.ok).toBe(true);
  });

  it('recusa datas quando includeDates é false', () => {
    const result = validateContinuousShareExactRelation(share({ options: { includeDates: false } }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/includeDates/i);
  });

  it('aceita ausência de datas quando includeDates é false', () => {
    const result = validateContinuousShareExactRelation(share({
      options: { includeDates: false },
      items: [{ position: 1 }]
    }));
    expect(result.ok).toBe(true);
  });

  it('recusa conclusão sem ocorrência', () => {
    const result = validateContinuousShareExactRelation(share({
      items: [{ position: 1, completedAt: '2026-07-27T21:00:00.000Z' }]
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/exige occurredAt/i);
  });

  it('recusa conclusão anterior à ocorrência', () => {
    const result = validateContinuousShareExactRelation(share({
      items: [item({ occurredAt: '2026-07-27T21:00:00.000Z', completedAt: '2026-07-27T20:00:00.000Z' })]
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não pode anteceder/i);
  });

  it('recusa ocorrência posterior à geração', () => {
    const result = validateContinuousShareExactRelation(share({
      items: [item({ occurredAt: '2026-07-27T23:00:00.000Z', completedAt: undefined })]
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/occurredAt.*posterior/i);
  });

  it('recusa conclusão posterior à geração', () => {
    const result = validateContinuousShareExactRelation(share({
      items: [item({ completedAt: '2026-07-27T23:00:00.000Z' })]
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/completedAt.*posterior/i);
  });

  it('aceita instantes iguais à geração', () => {
    const result = validateContinuousShareExactRelation(share({
      items: [item({ occurredAt: generatedAt, completedAt: generatedAt })]
    }));
    expect(result.ok).toBe(true);
  });

  it('não consulta o relógio atual', () => {
    const future = '2999-01-01T00:00:00.000Z';
    const result = validateContinuousShareExactRelation(share({
      generatedAt: future,
      items: [item({ occurredAt: future, completedAt: future })]
    }));
    expect(result.ok).toBe(true);
  });

  it('deixa tipos inválidos para o parser de domínio', () => {
    expect(validateContinuousShareExactRelation({ collection: { itemCount: '1' }, items: 'x' }).ok).toBe(true);
  });

  it('não altera o objeto recebido', () => {
    const input = share();
    const before = JSON.stringify(input);
    validateContinuousShareExactRelation(input);
    expect(JSON.stringify(input)).toBe(before);
  });

  it('não impõe relação adicional à resposta', () => {
    expect(validateContinuousResponseExactRelation({ generatedAt })).toEqual(expect.objectContaining({ ok: true }));
  });
});
