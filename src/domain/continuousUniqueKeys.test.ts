import { describe, expect, it } from 'vitest';
import { inspectContinuousJsonUniqueKeys } from './continuousUniqueKeys';

describe('chaves JSON únicas antes do parse', () => {
  it('aceita objetos aninhados com chaves únicas', () => {
    const result = inspectContinuousJsonUniqueKeys('{"a":1,"nested":{"b":2},"items":[{"c":3}]}');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stats.objects).toBe(3);
    expect(result.stats.keys).toBe(5);
    expect(result.message).toMatch(/chaves JSON únicas/i);
  });

  it('recusa chave repetida no mesmo objeto', () => {
    const result = inspectContinuousJsonUniqueKeys('{"a":1,"a":2}');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('duplicate');
    expect(result.errors.join(' ')).toMatch(/chave "a" foi repetida/i);
  });

  it('recusa duplicata em objeto aninhado', () => {
    const result = inspectContinuousJsonUniqueKeys('{"outer":{"value":1,"value":2}}');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/objeto \$\["outer"\]/i);
  });

  it('permite a mesma chave em objetos diferentes', () => {
    expect(inspectContinuousJsonUniqueKeys('{"left":{"id":1},"right":{"id":2}}').ok).toBe(true);
  });

  it('recusa chave literal equivalente a escape Unicode', () => {
    const result = inspectContinuousJsonUniqueKeys('{"catalogVersion":"1.0.0","\u0063atalogVersion":"2.0.0"}');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('duplicate');
    expect(result.errors.join(' ')).toMatch(/catalogVersion/i);
  });

  it('recusa barra escapada equivalente à barra literal', () => {
    const result = inspectContinuousJsonUniqueKeys('{"a/b":1,"a\/b":2}');
    expect(result.ok).toBe(false);
  });

  it('recusa emoji literal equivalente a pares Unicode escapados', () => {
    const result = inspectContinuousJsonUniqueKeys('{"😀":1,"\uD83D\uDE00":2}');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/\\u\{1F600\}/i);
  });

  it('diferencia maiúsculas de minúsculas', () => {
    expect(inspectContinuousJsonUniqueKeys('{"id":1,"ID":2}').ok).toBe(true);
  });

  it('considera formas Unicode não normalizadas distintas nesta barreira', () => {
    expect(inspectContinuousJsonUniqueKeys('{"é":1,"e\u0301":2}').ok).toBe(true);
  });

  it('não se confunde com chaves dentro de strings de valor', () => {
    expect(inspectContinuousJsonUniqueKeys('{"text":"{\\"a\\":1,\\"a\\":2}","a":1}').ok).toBe(true);
  });

  it('aceita raiz primitiva e listas', () => {
    expect(inspectContinuousJsonUniqueKeys('true').ok).toBe(true);
    expect(inspectContinuousJsonUniqueKeys('[1,{"a":2},null]').ok).toBe(true);
  });

  it('recusa duplicata de chave reservada sem reproduzir comportamento', () => {
    const result = inspectContinuousJsonUniqueKeys('{"__proto__":1,"__proto__":2}');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/__proto__/i);
  });

  it('recusa string de chave não encerrada', () => {
    const result = inspectContinuousJsonUniqueKeys('{"a:1}');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('syntax');
  });

  it('recusa escape JSON inválido', () => {
    const result = inspectContinuousJsonUniqueKeys('{"a\x":1}');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('syntax');
  });

  it('recusa número fora da gramática JSON', () => {
    expect(inspectContinuousJsonUniqueKeys('{"a":01}').ok).toBe(false);
    expect(inspectContinuousJsonUniqueKeys('{"a":1.}').ok).toBe(false);
    expect(inspectContinuousJsonUniqueKeys('{"a":1e}').ok).toBe(false);
  });

  it('recusa vírgula final em objeto e lista', () => {
    expect(inspectContinuousJsonUniqueKeys('{"a":1,}').ok).toBe(false);
    expect(inspectContinuousJsonUniqueKeys('[1,]').ok).toBe(false);
  });

  it('recusa conteúdo adicional depois da raiz', () => {
    const result = inspectContinuousJsonUniqueKeys('{"a":1} {"b":2}');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('syntax');
    expect(result.errors.join(' ')).toMatch(/conteúdo adicional/i);
  });

  it('respeita o fusível de profundidade', () => {
    const result = inspectContinuousJsonUniqueKeys('{"a":{"b":{"c":1}}}', {
      maxDepth: 1,
      maxTokens: 100
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('limit');
    expect(result.errors.join(' ')).toMatch(/excedeu 1 níveis/i);
  });

  it('respeita o fusível de tokens', () => {
    const result = inspectContinuousJsonUniqueKeys('{"a":1,"b":2}', {
      maxDepth: 10,
      maxTokens: 2
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('limit');
    expect(result.errors.join(' ')).toMatch(/excedeu 2 tokens/i);
  });

  it('não imprime controles invisíveis diretamente no diagnóstico', () => {
    const result = inspectContinuousJsonUniqueKeys('{"a\u202Eb":1,"a\u202Eb":2}');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    const message = result.errors.join(' ');
    expect(message).toContain('\\u{202E}');
    expect(message).not.toContain('\u202E');
  });
});
