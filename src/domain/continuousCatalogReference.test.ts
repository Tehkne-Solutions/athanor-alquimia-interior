import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import {
  validateContinuousResponseCatalogReferences,
  validateContinuousShareCatalogReferences
} from './continuousCatalogReference';

function trail(overrides: Record<string, unknown> = {}) {
  return {
    position: 1,
    kind: 'trail',
    startPoint: 'water',
    themeId: 'theme-support',
    noTheme: false,
    variantId: 'water-trail-v1',
    status: 'completed',
    endedEarly: false,
    passageSummary: { completed: 1, passed: 0, pending: 0 },
    ...overrides
  };
}

function cycle(overrides: Record<string, unknown> = {}) {
  return {
    position: 1,
    kind: 'theme-cycle',
    startPoint: 'water',
    themeId: 'theme-support',
    noTheme: false,
    variantId: 'water-trail-v1',
    packageId: 'package-support-bridge',
    packageLabel: 'Ponte do Apoio Disponível',
    status: 'completed',
    depth: 1,
    endedEarly: false,
    passageSummary: { completed: 1, passed: 0, pending: 0 },
    ...overrides
  };
}

function share(item = trail(), templateId = 'collection-open') {
  return {
    collection: { templateId, label: 'Coleção aberta', status: 'active', itemCount: 1 },
    items: [item]
  };
}

function response(overrides: Record<string, unknown> = {}) {
  const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
  if (!gesture) throw new Error('Gesto curado ausente.');
  return {
    gesture: { id: gesture.id, label: gesture.label, statement: gesture.statement },
    ...overrides
  };
}

describe('referências catalogadas da partilha', () => {
  it('aceita Rastro com modelo, tema e variante conhecidos', () => {
    expect(validateContinuousShareCatalogReferences(share()).ok).toBe(true);
  });

  it('recusa modelo de coleção desconhecido', () => {
    const result = validateContinuousShareCatalogReferences(share(trail(), 'collection-invented'));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/modelo não existe/i);
  });

  it('recusa tema informado desconhecido', () => {
    const result = validateContinuousShareCatalogReferences(share(trail({ themeId: 'theme-invented' })));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/tema informado não existe/i);
  });

  it('recusa tema conhecido incompatível com o elemento', () => {
    const result = validateContinuousShareCatalogReferences(share(trail({ startPoint: 'fire', themeId: 'theme-support', variantId: 'fire-trail-v1' })));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/tema não aceita o elemento/i);
  });

  it('preserva tema desconhecido quando themeId está ausente e noTheme é false', () => {
    const { themeId: _removed, ...unknownTheme } = trail();
    expect(validateContinuousShareCatalogReferences(share(unknownTheme)).ok).toBe(true);
  });

  it('recusa variante desconhecida', () => {
    const result = validateContinuousShareCatalogReferences(share(trail({ variantId: 'water-invented-v9' })));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/variante não existe/i);
  });

  it('recusa variante conhecida de outro elemento', () => {
    const result = validateContinuousShareCatalogReferences(share(trail({ variantId: 'fire-trail-v1' })));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/outro elemento/i);
  });

  it('aceita ciclo com pacote oficial correspondente', () => {
    expect(validateContinuousShareCatalogReferences(share(cycle())).ok).toBe(true);
  });

  it('recusa pacote desconhecido', () => {
    const result = validateContinuousShareCatalogReferences(share(cycle({ packageId: 'package-invented' })));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/pacote não existe/i);
  });

  it('recusa rótulo divergente do pacote', () => {
    const result = validateContinuousShareCatalogReferences(share(cycle({ packageLabel: 'Outro rótulo' })));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/rótulo não corresponde/i);
  });

  it('recusa pacote conhecido incompatível com o elemento', () => {
    const result = validateContinuousShareCatalogReferences(share(cycle({
      startPoint: 'fire',
      variantId: 'fire-trail-v1',
      packageId: 'package-support-bridge'
    })));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/pacote não aceita o elemento/i);
  });

  it('recusa pacote que não corresponde ao tema', () => {
    const result = validateContinuousShareCatalogReferences(share(cycle({
      themeId: 'theme-transition',
      packageId: 'package-support-bridge'
    })));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não corresponde ao tema/i);
  });

  it('aceita pacote aberto quando noTheme é true', () => {
    const { themeId: _removed, ...item } = cycle({
      noTheme: true,
      packageId: 'package-open-no-theme',
      packageLabel: 'Passagem Aberta sem Tema'
    });
    expect(validateContinuousShareCatalogReferences(share(item)).ok).toBe(true);
  });

  it('aceita pacote aberto para tema desconhecido sem ID explícito', () => {
    const { themeId: _removed, ...item } = cycle({
      noTheme: false,
      packageId: 'package-open-no-theme',
      packageLabel: 'Passagem Aberta sem Tema'
    });
    expect(validateContinuousShareCatalogReferences(share(item)).ok).toBe(true);
  });
});

describe('referências catalogadas da resposta', () => {
  it('aceita gesto exportável oficial', () => {
    expect(validateContinuousResponseCatalogReferences(response()).ok).toBe(true);
  });

  it('recusa gesto desconhecido', () => {
    const result = validateContinuousResponseCatalogReferences(response({ gesture: { id: 'invented', label: 'X', statement: 'Y' } }));
    expect(result.ok).toBe(false);
  });

  it('recusa rótulo divergente', () => {
    const base = response();
    const result = validateContinuousResponseCatalogReferences({ gesture: { ...(base.gesture as object), label: 'Outro' } });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/rótulo não corresponde/i);
  });

  it('recusa declaração divergente', () => {
    const base = response();
    const result = validateContinuousResponseCatalogReferences({ gesture: { ...(base.gesture as object), statement: 'Texto alterado.' } });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/declaração não corresponde/i);
  });

  it('recusa silêncio como gesto exportável', () => {
    const silence = continuousResponseGestures.find((entry) => entry.id === 'silence');
    if (!silence) throw new Error('Silêncio ausente.');
    expect(validateContinuousResponseCatalogReferences({ gesture: silence }).ok).toBe(false);
  });
});
