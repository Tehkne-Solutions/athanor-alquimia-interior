import { describe, expect, it } from 'vitest';
import {
  inspectContinuousJsonNumbers,
  normalizeContinuousDecimalLexeme
} from './continuousNumericLexeme';

function accepted(text: string): void {
  const result = inspectContinuousJsonNumbers(text);
  expect(result.ok).toBe(true);
}

function rejected(text: string, pattern: RegExp): void {
  const result = inspectContinuousJsonNumbers(text);
  expect(result.ok).toBe(false);
  if (result.ok) return;
  expect(result.errors.join(' ')).toMatch(pattern);
}

describe('medida numérica antes do JSON.parse', () => {
  it('normaliza notações decimalmente equivalentes', () => {
    expect(normalizeContinuousDecimalLexeme('1')).toEqual(normalizeContinuousDecimalLexeme('1.0'));
    expect(normalizeContinuousDecimalLexeme('1000')).toEqual(normalizeContinuousDecimalLexeme('1e3'));
    expect(normalizeContinuousDecimalLexeme('0.0100')).toEqual(normalizeContinuousDecimalLexeme('1e-2'));
  });

  it('aceita zero, inteiros e decimais usuais', () => {
    accepted('{"zero":0,"count":42,"ratio":0.1,"negative":-12.5}');
  });

  it('aceita o maior inteiro seguro e seu negativo', () => {
    accepted('[9007199254740991,-9007199254740991]');
  });

  it('recusa inteiro acima da faixa segura mesmo quando representável', () => {
    rejected('{"value":9007199254740992}', /faixa inteira segura/i);
  });

  it('recusa inteiro que seria arredondado pelo JavaScript', () => {
    rejected('{"value":9007199254740993}', /faixa inteira segura/i);
  });

  it('recusa inteiro exponencial acima da faixa segura', () => {
    rejected('{"value":9.007199254740992e15}', /faixa inteira segura/i);
  });

  it('aceita zeros finais e expoentes equivalentes', () => {
    accepted('[1.2300,1.23,123e-2,0.001e3]');
  });

  it('recusa decimal que seria reduzido a outra medida', () => {
    rejected('{"value":0.10000000000000001}', /mudaria silenciosamente de medida/i);
  });

  it('recusa decimal grande arredondado para inteiro diferente', () => {
    rejected('{"value":4500000000000000.1}', /mudaria silenciosamente de medida/i);
  });

  it('recusa overflow para infinito', () => {
    rejected('{"value":1e400}', /não permanece finito/i);
  });

  it('recusa underflow de valor não zero para zero', () => {
    rejected('{"value":1e-400}', /mudaria silenciosamente de medida/i);
  });

  it('aceita o menor subnormal quando a medida é preservada', () => {
    accepted('{"value":5e-324}');
  });

  it('recusa subnormal arredondado para outra medida', () => {
    rejected('{"value":4e-324}', /mudaria silenciosamente de medida/i);
  });

  it('recusa zero negativo porque a serialização perde o sinal', () => {
    rejected('{"value":-0}', /perderia o sinal/i);
  });

  it('ignora números escritos dentro de strings', () => {
    accepted('{"text":"9007199254740993 1e400 -0"}');
  });

  it('informa o caminho do número recusado', () => {
    rejected('{"outer":{"items":[1,9007199254740992]}}', /\$\["outer"\]\["items"\]\[1\]/i);
  });

  it('recusa lexema acima do fusível de caracteres', () => {
    const result = inspectContinuousJsonNumbers('{"value":123456789}', {
      maxDepth: 10,
      maxTokens: 100,
      maxLexemeCharacters: 8
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('limit');
    expect(result.errors.join(' ')).toMatch(/excede 8 caracteres/i);
  });

  it('respeita o fusível de profundidade', () => {
    const result = inspectContinuousJsonNumbers('{"a":{"b":{"c":1}}}', {
      maxDepth: 1,
      maxTokens: 100,
      maxLexemeCharacters: 128
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('limit');
  });

  it('respeita o fusível de tokens', () => {
    const result = inspectContinuousJsonNumbers('[1,2,3]', {
      maxDepth: 10,
      maxTokens: 2,
      maxLexemeCharacters: 128
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('limit');
  });

  it('preserva erro de sintaxe para número malformado', () => {
    const result = inspectContinuousJsonNumbers('{"value":01}');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('syntax');
  });

  it('contabiliza inteiros, decimais e expoentes', () => {
    const result = inspectContinuousJsonNumbers('[1,1.5,1e2,2.5e-1]');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stats).toMatchObject({ numbers: 4, integers: 2, decimals: 2, exponentials: 2 });
  });
});
