import { describe, expect, it } from 'vitest';
import {
  validateContinuousResponseFieldCompatibility,
  validateContinuousShareFieldCompatibility
} from './continuousFieldCompatibility';

function item(overrides: Record<string, unknown> = {}) {
  return {
    position: 1,
    kind: 'trail',
    startPoint: 'word',
    noTheme: false,
    variantId: 'variant-word-v1',
    status: 'active',
    endedEarly: false,
    passageSummary: { completed: 0, passed: 0, pending: 1 },
    ...overrides
  };
}

function share(items: unknown[]) {
  return { items };
}

describe('compatibilidade entre campos contínuos', () => {
  it('aceita Rastro sem campos exclusivos de ciclo', () => {
    expect(validateContinuousShareFieldCompatibility(share([item()])).ok).toBe(true);
  });

  it('aceita tema desconhecido sem themeId e com noTheme false', () => {
    expect(validateContinuousShareFieldCompatibility(share([item({ noTheme: false })])).ok).toBe(true);
  });

  it('aceita tema explícito quando noTheme é false', () => {
    expect(validateContinuousShareFieldCompatibility(share([item({ themeId: 'theme-clarity', noTheme: false })])).ok).toBe(true);
  });

  it('recusa tema explícito junto de noTheme true', () => {
    const result = validateContinuousShareFieldCompatibility(share([
      item({ themeId: 'theme-clarity', noTheme: true })
    ]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/themeId.*noTheme/i);
  });

  it('recusa packageId sem packageLabel', () => {
    const result = validateContinuousShareFieldCompatibility(share([
      item({ kind: 'theme-cycle', packageId: 'cycle-clarity' })
    ]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/precisam aparecer juntos/i);
  });

  it('recusa packageLabel sem packageId', () => {
    const result = validateContinuousShareFieldCompatibility(share([
      item({ kind: 'theme-cycle', packageLabel: 'Ciclo de clareza' })
    ]));
    expect(result.ok).toBe(false);
  });

  it('aceita pacote completo em ciclo temático', () => {
    expect(validateContinuousShareFieldCompatibility(share([
      item({
        kind: 'theme-cycle',
        packageId: 'cycle-clarity',
        packageLabel: 'Ciclo de clareza',
        depth: 1
      })
    ])).ok).toBe(true);
  });

  it('recusa pacote em Rastro', () => {
    const result = validateContinuousShareFieldCompatibility(share([
      item({ packageId: 'cycle-clarity', packageLabel: 'Ciclo de clareza' })
    ]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Rastro não pode declarar pacote/i);
  });

  it('recusa profundidade em Rastro', () => {
    const result = validateContinuousShareFieldCompatibility(share([item({ depth: 2 })]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/profundidade/i);
  });

  it('recusa status declined em Rastro', () => {
    const result = validateContinuousShareFieldCompatibility(share([item({ status: 'declined' })]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/declined/i);
  });

  it('aceita status declined em ciclo temático', () => {
    expect(validateContinuousShareFieldCompatibility(share([
      item({ kind: 'theme-cycle', status: 'declined' })
    ])).ok).toBe(true);
  });

  it('recusa endedEarly em Rastro', () => {
    const result = validateContinuousShareFieldCompatibility(share([
      item({ endedEarly: true, status: 'incomplete' })
    ]));
    expect(result.ok).toBe(false);
  });

  it('recusa endedEarly fora de status incomplete', () => {
    const result = validateContinuousShareFieldCompatibility(share([
      item({ kind: 'theme-cycle', endedEarly: true, status: 'completed' })
    ]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/status incomplete/i);
  });

  it('aceita encerramento antecipado em ciclo incompleto', () => {
    expect(validateContinuousShareFieldCompatibility(share([
      item({ kind: 'theme-cycle', endedEarly: true, status: 'incomplete' })
    ])).ok).toBe(true);
  });

  it('recusa status completed com passagens pendentes', () => {
    const result = validateContinuousShareFieldCompatibility(share([
      item({ status: 'completed', passageSummary: { completed: 1, passed: 0, pending: 1 } })
    ]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/zero passagens pendentes/i);
  });

  it('aceita status completed sem pendências', () => {
    expect(validateContinuousShareFieldCompatibility(share([
      item({ status: 'completed', passageSummary: { completed: 1, passed: 0, pending: 0 } })
    ])).ok).toBe(true);
  });

  it('deixa tipos desconhecidos para o parser de domínio', () => {
    expect(validateContinuousShareFieldCompatibility({ items: [{ kind: 42 }] }).ok).toBe(true);
  });

  it('não altera o objeto recebido', () => {
    const input = share([item({ themeId: 'theme-clarity' })]);
    const before = JSON.stringify(input);
    validateContinuousShareFieldCompatibility(input);
    expect(JSON.stringify(input)).toBe(before);
  });

  it('limita a quantidade de diagnósticos', () => {
    const items = Array.from({ length: 30 }, (_, index) => item({
      position: index + 1,
      themeId: 'theme-clarity',
      noTheme: true
    }));
    const result = validateContinuousShareFieldCompatibility(share(items));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toHaveLength(20);
  });

  it('mantém resposta sem relações discriminadas adicionais', () => {
    expect(validateContinuousResponseFieldCompatibility({ gesture: {} }).ok).toBe(true);
  });
});
