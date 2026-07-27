import { describe, expect, it } from 'vitest';
import {
  isCanonicalContinuousUtcInstant,
  validateContinuousResponseExactTime,
  validateContinuousShareExactTime
} from './continuousExactTime';

const valid = '2026-07-27T22:40:15.123Z';

function share(overrides: Record<string, unknown> = {}) {
  return {
    generatedAt: valid,
    items: [],
    ...overrides
  };
}

describe('tempo exato contínuo', () => {
  it('aceita instante UTC canônico com milissegundos', () => {
    expect(isCanonicalContinuousUtcInstant(valid)).toBe(true);
  });

  it('aceita ano bissexto válido', () => {
    expect(isCanonicalContinuousUtcInstant('2024-02-29T00:00:00.000Z')).toBe(true);
  });

  it('recusa data impossível normalizada pelo Date', () => {
    expect(isCanonicalContinuousUtcInstant('2026-02-30T00:00:00.000Z')).toBe(false);
  });

  it('recusa mês e dia fora da faixa', () => {
    expect(isCanonicalContinuousUtcInstant('2026-13-01T00:00:00.000Z')).toBe(false);
    expect(isCanonicalContinuousUtcInstant('2026-01-00T00:00:00.000Z')).toBe(false);
  });

  it('recusa horário sem fuso', () => {
    expect(isCanonicalContinuousUtcInstant('2026-07-27T22:40:15.123')).toBe(false);
  });

  it('recusa offset mesmo quando equivale a UTC', () => {
    expect(isCanonicalContinuousUtcInstant('2026-07-27T22:40:15.123+00:00')).toBe(false);
  });

  it('recusa offset local', () => {
    expect(isCanonicalContinuousUtcInstant('2026-07-27T19:40:15.123-03:00')).toBe(false);
  });

  it('recusa precisão ausente ou diferente de três dígitos', () => {
    expect(isCanonicalContinuousUtcInstant('2026-07-27T22:40:15Z')).toBe(false);
    expect(isCanonicalContinuousUtcInstant('2026-07-27T22:40:15.1Z')).toBe(false);
    expect(isCanonicalContinuousUtcInstant('2026-07-27T22:40:15.1234Z')).toBe(false);
  });

  it('recusa z minúsculo e separador em espaço', () => {
    expect(isCanonicalContinuousUtcInstant('2026-07-27T22:40:15.123z')).toBe(false);
    expect(isCanonicalContinuousUtcInstant('2026-07-27 22:40:15.123Z')).toBe(false);
  });

  it('recusa segundo intercalar sem conversão', () => {
    expect(isCanonicalContinuousUtcInstant('2026-12-31T23:59:60.000Z')).toBe(false);
  });

  it('valida generatedAt da partilha', () => {
    const result = validateContinuousShareExactTime(share({ generatedAt: '27/07/2026 22:40' }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/generatedAt/i);
  });

  it('valida datas opcionais dos itens', () => {
    const result = validateContinuousShareExactTime(share({
      items: [{ occurredAt: valid, completedAt: '2026-07-27T23:00:00.000Z' }]
    }));
    expect(result.ok).toBe(true);
  });

  it('aceita ausência dos campos temporais opcionais', () => {
    expect(validateContinuousShareExactTime(share({ items: [{}] })).ok).toBe(true);
  });

  it('recusa conclusão anterior à ocorrência', () => {
    const result = validateContinuousShareExactTime(share({
      items: [{ occurredAt: '2026-07-27T23:00:00.000Z', completedAt: '2026-07-27T22:00:00.000Z' }]
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não pode anteceder/i);
  });

  it('deixa tipo não textual para o parser de domínio', () => {
    expect(validateContinuousShareExactTime(share({ generatedAt: 42 })).ok).toBe(true);
  });

  it('valida generatedAt da resposta', () => {
    const result = validateContinuousResponseExactTime({ generatedAt: '2026-07-27T22:40:15Z' });
    expect(result.ok).toBe(false);
  });

  it('não altera o objeto recebido', () => {
    const input = share({ items: [{ occurredAt: valid }] });
    const before = JSON.stringify(input);
    validateContinuousShareExactTime(input);
    expect(JSON.stringify(input)).toBe(before);
  });
});
