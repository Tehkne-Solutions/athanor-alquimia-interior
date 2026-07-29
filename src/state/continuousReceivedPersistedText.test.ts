import { describe, expect, it } from 'vitest';
import { createContinuousReceivedRegistry } from '../domain/continuousReceive';
import { inspectContinuousReceivedPersistedText } from './continuousReceivedPersistedText';
import { serializeContinuousReceivedPersistedState } from './continuousReceivedPersistenceStorage';

const generatedAt = '2026-07-28T23:00:00.000Z';

function validText(): string {
  return serializeContinuousReceivedPersistedState(
    createContinuousReceivedRegistry('1.0.0', generatedAt)
  );
}

describe('texto bruto da memória persistida', () => {
  it('aceita o envelope oficial sem reescrever o texto', () => {
    const text = validText();
    const result = inspectContinuousReceivedPersistedText(text);
    expect(result.ok).toBe(true);
    expect(text).toBe(validText());
    if (!result.ok) return;
    expect(result.value).toMatchObject({ version: 0 });
  });

  it('recusa chave superior repetida antes do JSON.parse', () => {
    const text = validText().replace('"version":0', '"version":0,"version":1');
    const result = inspectContinuousReceivedPersistedText(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('keys');
    expect(result.errors.join(' ')).toMatch(/version.*repetida/i);
  });

  it('recusa chave escapada equivalente', () => {
    const text = validText().replace('"version":0', '"version":0,"\\u0076ersion":1');
    const result = inspectContinuousReceivedPersistedText(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('keys');
    expect(result.errors.join(' ')).toMatch(/version/i);
  });

  it('recusa chave aninhada repetida antes do envelope', () => {
    const text = validText().replace('"schemaVersion":1', '"schemaVersion":1,"schemaVersion":2');
    const result = inspectContinuousReceivedPersistedText(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('keys');
    expect(result.errors.join(' ')).toMatch(/schemaVersion/i);
  });

  it('recusa inteiro fora da faixa segura', () => {
    const text = validText().replace('"version":0', '"version":9007199254740992');
    const result = inspectContinuousReceivedPersistedText(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('numbers');
    expect(result.errors.join(' ')).toMatch(/faixa inteira segura/i);
  });

  it('recusa decimal que mudaria silenciosamente de medida', () => {
    const text = validText().replace('"version":0', '"diagnostic":0.10000000000000001,"version":0');
    const result = inspectContinuousReceivedPersistedText(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('numbers');
    expect(result.errors.join(' ')).toMatch(/mudaria silenciosamente de medida/i);
  });

  it('recusa overflow numérico', () => {
    const text = validText().replace('"version":0', '"diagnostic":1e400,"version":0');
    const result = inspectContinuousReceivedPersistedText(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('numbers');
    expect(result.errors.join(' ')).toMatch(/não permanece finito/i);
  });

  it('recusa zero negativo', () => {
    const text = validText().replace('"version":0', '"version":-0');
    const result = inspectContinuousReceivedPersistedText(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('numbers');
    expect(result.errors.join(' ')).toMatch(/perderia o sinal/i);
  });

  it('recusa JSON malformado sem escolher conteúdo parcial', () => {
    const result = inspectContinuousReceivedPersistedText('{"state":');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('syntax');
  });

  it('recusa texto invisível antes do envelope de domínio', () => {
    const text = validText().replace('"version":0', '"diagnostic":"texto\\u202Etxt","version":0');
    const result = inspectContinuousReceivedPersistedText(text);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.kind).toBe('visibility');
    expect(result.errors.join(' ')).toMatch(/U\+202E/i);
  });

  it('recusa memória acima do limite textual sem parse', () => {
    const result = inspectContinuousReceivedPersistedText(' '.repeat(524_289));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(['bytes', 'text']).toContain(result.kind);
  });
});
