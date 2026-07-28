import { describe, expect, it } from 'vitest';
import { matchesIdbExpectedValue } from './idbStorage';

describe('comparação atômica do estado IndexedDB', () => {
  it('trata ausência física como referência nula', () => {
    expect(matchesIdbExpectedValue(undefined, null)).toBe(true);
  });

  it('aceita somente o texto bruto exatamente hidratado', () => {
    expect(matchesIdbExpectedValue('{"state":1}', '{"state":1}')).toBe(true);
  });

  it('recusa conteúdo textual diferente mesmo quando parece equivalente', () => {
    expect(matchesIdbExpectedValue('{"a":1,"b":2}', '{"b":2,"a":1}')).toBe(false);
  });

  it('recusa remoção, substituição e valores não textuais', () => {
    expect(matchesIdbExpectedValue(undefined, 'estado-anterior')).toBe(false);
    expect(matchesIdbExpectedValue('estado-novo', 'estado-anterior')).toBe(false);
    expect(matchesIdbExpectedValue({ state: 1 }, null)).toBe(false);
  });
});
