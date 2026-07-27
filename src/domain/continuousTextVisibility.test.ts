import { describe, expect, it } from 'vitest';
import { validateContinuousTextVisibility } from './continuousTextVisibility';

describe('visibilidade textual Unicode', () => {
  it('aceita textos NFC em português, pontuação e emoji simples', () => {
    const result = validateContinuousTextVisibility({
      título: 'Atenção, memória e ação.',
      linhas: 'primeira\nsegunda\tterceira',
      símbolo: '✨'
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stats.strings).toBe(3);
    expect(result.message).toMatch(/Unicode NFC.*sem reescrita/i);
  });

  it('aceita retorno de carro, quebra de linha e tabulação', () => {
    expect(validateContinuousTextVisibility('a\rb\nc\td').ok).toBe(true);
  });

  it('recusa texto equivalente que não esteja em NFC', () => {
    const result = validateContinuousTextVisibility({ label: 'Cafe\u0301' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não está normalizado.*NFC.*não foi reescrito/i);
  });

  it('recusa nomes de campos não normalizados', () => {
    const result = validateContinuousTextVisibility({ ['cafe\u0301']: true });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/nome de campo.*NFC/i);
  });

  it('recusa controles C0 diferentes dos três permitidos', () => {
    const result = validateContinuousTextVisibility('antes\u0000depois');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/U\+0000.*controle C0/i);
  });

  it('recusa DEL e controles C1', () => {
    expect(validateContinuousTextVisibility('a\u007Fb').ok).toBe(false);
    expect(validateContinuousTextVisibility('a\u0085b').ok).toBe(false);
  });

  it('recusa sobrescrita e isoladores bidirecionais', () => {
    const override = validateContinuousTextVisibility('abc\u202Etxt');
    const isolate = validateContinuousTextVisibility('abc\u2067txt');
    expect(override.ok).toBe(false);
    expect(isolate.ok).toBe(false);
    if (!override.ok) expect(override.errors.join(' ')).toMatch(/bidirecional/i);
  });

  it('recusa marcas de direção e controles de largura zero', () => {
    expect(validateContinuousTextVisibility('abc\u200Fdef').ok).toBe(false);
    expect(validateContinuousTextVisibility('abc\u200Bdef').ok).toBe(false);
    expect(validateContinuousTextVisibility('abc\u200Ddef').ok).toBe(false);
  });

  it('recusa soft hyphen, BOM interno e caractere de substituição', () => {
    expect(validateContinuousTextVisibility('co\u00ADisa').ok).toBe(false);
    expect(validateContinuousTextVisibility('a\uFEFFb').ok).toBe(false);
    expect(validateContinuousTextVisibility('a\uFFFDb').ok).toBe(false);
  });

  it('recusa anotações interlineares e caracteres de tag', () => {
    expect(validateContinuousTextVisibility('a\uFFF9b').ok).toBe(false);
    expect(validateContinuousTextVisibility(`a${String.fromCodePoint(0xE0061)}b`).ok).toBe(false);
  });

  it('recusa não caracteres Unicode', () => {
    expect(validateContinuousTextVisibility(`a${String.fromCodePoint(0xFDD0)}b`).ok).toBe(false);
    expect(validateContinuousTextVisibility(`a${String.fromCodePoint(0x1FFFF)}b`).ok).toBe(false);
  });

  it('recusa substituto alto sem par', () => {
    const result = validateContinuousTextVisibility(`a${String.fromCharCode(0xD800)}b`);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/alto sem par/i);
  });

  it('recusa substituto baixo sem par', () => {
    const result = validateContinuousTextVisibility(`a${String.fromCharCode(0xDC00)}b`);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/baixo sem par/i);
  });

  it('não executa getter durante a inspeção', () => {
    let executions = 0;
    const value: Record<string, unknown> = {};
    Object.defineProperty(value, 'hidden', {
      enumerable: true,
      get() {
        executions += 1;
        return 'texto';
      }
    });
    const result = validateContinuousTextVisibility(value);
    expect(result.ok).toBe(false);
    expect(executions).toBe(0);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/acessor/i);
  });

  it('recusa chave simbólica sem inspecionar seu valor', () => {
    const value = { visible: true } as Record<PropertyKey, unknown>;
    value[Symbol('hidden')] = 'texto';
    const result = validateContinuousTextVisibility(value);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/chave simbólica/i);
  });

  it('interrompe referência repetida ou circular', () => {
    const shared = { label: 'mesmo' };
    expect(validateContinuousTextVisibility({ a: shared, b: shared }).ok).toBe(false);
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(validateContinuousTextVisibility(circular).ok).toBe(false);
  });

  it('respeita o fusível de nós da inspeção', () => {
    const result = validateContinuousTextVisibility({ a: [1, 2, 3] }, {
      normalization: 'NFC',
      maxInspectionNodes: 2
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/excedeu 2 nós/i);
  });

  it('não rejeita variation selector usado em apresentação de emoji', () => {
    expect(validateContinuousTextVisibility('❤️').ok).toBe(true);
  });
});
