import { describe, expect, it } from 'vitest';
import { validateContinuousExactText } from './continuousExactText';

describe('margens textuais exatas', () => {
  it('aceita textos sem margem externa', () => {
    const result = validateContinuousExactText({ label: 'Coleção aberta', notices: ['Aviso válido.'] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stats.strings).toBe(2);
    expect(result.stats.boundaryIssues).toBe(0);
  });

  it('recusa espaço inicial', () => {
    const result = validateContinuousExactText({ label: ' Coleção' }, 'Partilha');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/margem inicial/i);
    expect(result.issuePaths).toContain('$["label"]');
  });

  it('recusa espaço final', () => {
    const result = validateContinuousExactText({ label: 'Coleção ' }, 'Partilha');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/margem final/i);
  });

  it('recusa margens nos dois lados', () => {
    const result = validateContinuousExactText({ label: '\tColeção\n' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/margem inicial.*final/i);
  });

  it('recusa quebra no início', () => {
    const result = validateContinuousExactText({ notice: '\nAviso' });
    expect(result.ok).toBe(false);
  });

  it('recusa quebra no fim', () => {
    const result = validateContinuousExactText({ notice: 'Aviso\r\n' });
    expect(result.ok).toBe(false);
  });

  it('recusa espaço não separável nas extremidades', () => {
    const result = validateContinuousExactText({ label: '\u00A0Coleção\u00A0' });
    expect(result.ok).toBe(false);
  });

  it('preserva espaços internos repetidos', () => {
    const result = validateContinuousExactText({ statement: 'Tempo  sem  prazo.' });
    expect(result.ok).toBe(true);
  });

  it('preserva quebras internas', () => {
    const result = validateContinuousExactText({ statement: 'Linha um\nLinha dois' });
    expect(result.ok).toBe(true);
  });

  it('deixa texto vazio para o domínio decidir', () => {
    const result = validateContinuousExactText({ optional: '' });
    expect(result.ok).toBe(true);
  });

  it('indica caminho aninhado sem reproduzir o conteúdo', () => {
    const result = validateContinuousExactText({ source: { collectionLabel: ' Coleção secreta ' } });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    const message = result.errors.join(' ');
    expect(message).toMatch(/source.*collectionLabel/i);
    expect(message).not.toContain('Coleção secreta');
  });

  it('inspeciona textos dentro de listas', () => {
    const result = validateContinuousExactText({ notices: ['Válido', ' Inválido'] });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issuePaths).toContain('$["notices"][1]');
  });

  it('limita o número de diagnósticos', () => {
    const value = { notices: Array.from({ length: 25 }, (_, index) => ` aviso ${index} `) };
    const result = validateContinuousExactText(value);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issuePaths).toHaveLength(20);
    expect(result.truncated).toBe(true);
    expect(result.stats.boundaryIssues).toBe(25);
  });

  it('não executa getters', () => {
    let reads = 0;
    const value: Record<string, unknown> = {};
    Object.defineProperty(value, 'secret', {
      enumerable: true,
      get() {
        reads += 1;
        return ' texto ';
      }
    });
    validateContinuousExactText(value);
    expect(reads).toBe(0);
  });

  it('não entra em ciclo infinito com referências repetidas', () => {
    const value: Record<string, unknown> = { label: 'Válido' };
    value.self = value;
    const result = validateContinuousExactText(value);
    expect(result.ok).toBe(true);
  });

  it('não modifica o objeto inspecionado', () => {
    const value = { label: ' Coleção ' };
    validateContinuousExactText(value);
    expect(value.label).toBe(' Coleção ');
  });
});
