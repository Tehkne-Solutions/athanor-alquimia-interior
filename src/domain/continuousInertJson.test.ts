import { describe, expect, it, vi } from 'vitest';
import {
  defaultContinuousInertJsonOptions,
  validateContinuousInertJson
} from './continuousInertJson';

describe('forma JSON inerte', () => {
  it('aceita valores JSON simples e objetos comuns', () => {
    const result = validateContinuousInertJson({
      nullValue: null,
      booleanValue: true,
      numberValue: 4,
      stringValue: 'texto',
      arrayValue: [1, 'dois', false],
      nested: { value: 'ok' }
    });
    expect(result.ok).toBe(true);
  });

  it('aceita objeto com protótipo nulo e dados enumeráveis', () => {
    const value = Object.create(null) as Record<string, unknown>;
    value.label = 'seguro';
    expect(validateContinuousInertJson(value).ok).toBe(true);
  });

  it.each([
    ['undefined', undefined],
    ['bigint', BigInt(1)],
    ['símbolo', Symbol('x')],
    ['função', () => true],
    ['NaN', Number.NaN],
    ['infinito', Number.POSITIVE_INFINITY]
  ])('recusa %s', (_label, value) => {
    expect(validateContinuousInertJson({ value }).ok).toBe(false);
  });

  it.each([
    ['Date', new Date('2026-07-27T00:00:00.000Z')],
    ['Map', new Map([['a', 1]])],
    ['Set', new Set([1])],
    ['classe', new (class Example { value = 1; })()]
  ])('recusa protótipo especial de %s', (_label, value) => {
    const result = validateContinuousInertJson({ value });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/protótipo especial/i);
  });

  it('recusa getter sem executá-lo', () => {
    const getter = vi.fn(() => 'não deve executar');
    const value: Record<string, unknown> = {};
    Object.defineProperty(value, 'secret', { enumerable: true, get: getter });
    const result = validateContinuousInertJson(value);
    expect(result.ok).toBe(false);
    expect(getter).not.toHaveBeenCalled();
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/getter ou setter/i);
  });

  it('recusa propriedade não enumerável', () => {
    const value: Record<string, unknown> = {};
    Object.defineProperty(value, 'hidden', { enumerable: false, value: 'texto' });
    const result = validateContinuousInertJson(value);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não enumerável/i);
  });

  it('recusa propriedade simbólica', () => {
    const value: Record<PropertyKey, unknown> = { label: 'texto' };
    value[Symbol('hidden')] = true;
    const result = validateContinuousInertJson(value);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/simbólica/i);
  });

  it.each(['__proto__', 'prototype', 'constructor'])('recusa chave reservada %s', (key) => {
    const value = JSON.parse(`{"${key}":{"value":true}}`) as unknown;
    const result = validateContinuousInertJson(value);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toContain(key);
  });

  it('recusa array esparso', () => {
    const value = new Array(2);
    value[1] = 'presente';
    const result = validateContinuousInertJson(value);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/espaço vazio/i);
  });

  it('recusa propriedade extra em array', () => {
    const value = [1, 2] as number[] & { label?: string };
    value.label = 'extra';
    const result = validateContinuousInertJson(value);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/propriedade extra/i);
  });

  it('recusa referência repetida mesmo sem ciclo', () => {
    const shared = { value: true };
    const result = validateContinuousInertJson({ first: shared, second: shared });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/repetida ou circular/i);
  });

  it('recusa referência circular', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(validateContinuousInertJson(circular).ok).toBe(false);
  });

  it('interrompe inspeção acima do limite de nós', () => {
    const options = { ...defaultContinuousInertJsonOptions, maxInspectionNodes: 3 };
    const result = validateContinuousInertJson({ a: 1, b: 2, c: 3 });
    expect(result.ok).toBe(true);
    const limited = validateContinuousInertJson({ a: 1, b: 2, c: 3 }, options);
    expect(limited.ok).toBe(false);
    if (limited.ok) return;
    expect(limited.errors.join(' ')).toMatch(/excedeu 3 nós/i);
  });

  it('trata proxy hostil como falha técnica', () => {
    const value = new Proxy({}, {
      getPrototypeOf() {
        throw new Error('blocked');
      }
    });
    const result = validateContinuousInertJson(value);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/protótipo/i);
  });
});
