import { describe, expect, it, vi } from 'vitest';
import {
  inspectContinuousResourceBudget,
  readContinuousJsonFile,
  validateContinuousFileSize,
  validateContinuousRawText,
  type ContinuousResourceLimits
} from './continuousResource';

const limits: ContinuousResourceLimits = {
  maxFileBytes: 100,
  maxTextCharacters: 100,
  maxDepth: 3,
  maxNodes: 12,
  maxArrayLength: 4,
  maxObjectKeys: 4,
  maxStringLength: 8,
  maxTotalStringCharacters: 16
};

describe('orçamento local de recursos', () => {
  it('aceita envelope e estrutura pequenos', () => {
    expect(validateContinuousFileSize(40, limits).ok).toBe(true);
    expect(validateContinuousRawText('{"a":"b"}', limits).ok).toBe(true);
    const result = inspectContinuousResourceBudget({ a: ['b', 'c'] }, limits);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stats.maxDepth).toBe(2);
  });

  it('recusa arquivo grande antes de chamar text', async () => {
    const text = vi.fn(async () => '{"a":1}');
    const result = await readContinuousJsonFile({ size: 101, text }, limits);
    expect(result.ok).toBe(false);
    expect(text).not.toHaveBeenCalled();
  });

  it('recusa texto vazio', () => {
    const result = validateContinuousRawText('', limits);
    expect(result.ok).toBe(false);
  });

  it('recusa texto acima do limite antes do JSON parse', async () => {
    const result = await readContinuousJsonFile({ size: 90, text: async () => 'x'.repeat(101) }, limits);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/texto excede/i);
  });

  it('recusa JSON malformado', async () => {
    const result = await readContinuousJsonFile({ size: 5, text: async () => '{bad' }, limits);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/interpretar.*JSON/i);
  });

  it('recusa profundidade excessiva', () => {
    const result = inspectContinuousResourceBudget({ a: { b: { c: { d: true } } } }, limits);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/profundidade/i);
  });

  it('recusa quantidade excessiva de nós', () => {
    const result = inspectContinuousResourceBudget({
      a: [1, 2, 3, 4],
      b: [1, 2, 3, 4],
      c: [1, 2, 3, 4]
    }, limits);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/nós/i);
  });

  it('recusa listas extensas sem truncar', () => {
    const result = inspectContinuousResourceBudget([1, 2, 3, 4, 5], limits);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/lista/i);
  });

  it('recusa objetos com campos demais', () => {
    const result = inspectContinuousResourceBudget({ a: 1, b: 2, c: 3, d: 4, e: 5 }, limits);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/objeto/i);
  });

  it('recusa texto individual muito longo', () => {
    const result = inspectContinuousResourceBudget({ a: '123456789' }, limits);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/texto/i);
  });

  it('recusa soma de textos acima do orçamento', () => {
    const result = inspectContinuousResourceBudget({ a: '12345678', b: '12345678', c: '1' }, limits);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/soma dos textos/i);
  });

  it('recusa referência circular em chamadas diretas de domínio', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    const result = inspectContinuousResourceBudget(circular, limits);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/circular/i);
  });

  it('retorna estatísticas sem interpretar o conteúdo', async () => {
    const result = await readContinuousJsonFile({ size: 20, text: async () => '{"a":["b"]}' }, limits);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stats.nodes).toBeGreaterThan(0);
    expect(result.value).toEqual({ a: ['b'] });
  });
});
