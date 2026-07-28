import { describe, expect, it, vi } from 'vitest';
import { canonicalShareNotices } from './continuousCanonicalNotice.testFixtures';
import { attachContinuousConsistency } from './continuousConsistency';
import {
  areContinuousSharePackagesEquivalent,
  compareContinuousSharePackages,
  continuousShareEquivalenceKey,
  fingerprintContinuousSharePackage,
  isCanonicalContinuousFingerprint,
  validateContinuousResponseFingerprint
} from './continuousFingerprintEquivalence';
import type { ContinuousCollectionShareExport } from './continuousShare';

const generatedAt = '2026-07-28T16:00:00.000Z';

function packageValue(overrides: Partial<ContinuousCollectionShareExport> = {}): ContinuousCollectionShareExport {
  return {
    schema: 'athanor-continuous-collection-share-v1',
    policy: 'explicit-consent-minimized-local-export-v1',
    catalogVersion: '1.0.0',
    generatedAt,
    provenance: {
      product: 'Athanor — Alquimia Interior',
      author: 'Tehkné Solutions',
      transmission: 'manual-local-file'
    },
    collection: {
      templateId: 'collection-open',
      label: 'Coleção aberta',
      status: 'active',
      itemCount: 0
    },
    options: { includeDates: false },
    items: [],
    notices: canonicalShareNotices(false, 0),
    ...overrides
  };
}

describe('equivalência da impressão descritiva', () => {
  it('gera impressão no formato canônico legado', () => {
    const fingerprint = fingerprintContinuousSharePackage(packageValue());
    expect(fingerprint).toMatch(/^received-[0-9a-f]{8}$/);
    expect(isCanonicalContinuousFingerprint(fingerprint)).toBe(true);
  });

  it('recusa prefixo, tamanho e caixa divergentes', () => {
    expect(isCanonicalContinuousFingerprint('share-12345678')).toBe(false);
    expect(isCanonicalContinuousFingerprint('received-1234')).toBe(false);
    expect(isCanonicalContinuousFingerprint('received-ABCDEF12')).toBe(false);
  });

  it('ignora generatedAt na equivalência canônica', () => {
    const first = packageValue();
    const second = packageValue({ generatedAt: '2026-07-29T12:00:00.000Z' });
    expect(continuousShareEquivalenceKey(first)).toBe(continuousShareEquivalenceKey(second));
    expect(compareContinuousSharePackages(first, second)).toBe('equivalent-copy');
  });

  it('ignora somente o selo de consistência na equivalência', () => {
    const first = packageValue();
    const second = attachContinuousConsistency(packageValue());
    expect(areContinuousSharePackagesEquivalent(first, second)).toBe(true);
  });

  it('inclui avisos canônicos na equivalência sem alterar a impressão curta', () => {
    const first = packageValue();
    const second = packageValue({
      notices: [...first.notices, 'Registros não vinculados permanecem descritivos e não são interpretados.']
    });
    expect(fingerprintContinuousSharePackage(first)).toBe(fingerprintContinuousSharePackage(second));
    expect(areContinuousSharePackagesEquivalent(first, second)).toBe(false);
    expect(compareContinuousSharePackages(first, second)).toBe('descriptive-collision');
  });

  it('considera impressão diferente antes da equivalência', () => {
    const first = packageValue();
    const second = packageValue({
      collection: { ...first.collection, label: 'Outra coleção' }
    });
    expect(compareContinuousSharePackages(first, second)).toBe('different-fingerprint');
  });

  it('não depende da ordem de inserção das propriedades', () => {
    const first = packageValue();
    const second = packageValue({
      provenance: {
        transmission: 'manual-local-file',
        author: 'Tehkné Solutions',
        product: 'Athanor — Alquimia Interior'
      },
      collection: {
        itemCount: 0,
        status: 'active',
        label: 'Coleção aberta',
        templateId: 'collection-open'
      }
    });
    expect(areContinuousSharePackagesEquivalent(first, second)).toBe(true);
  });

  it('valida impressão de resposta sem executar getter', () => {
    const getter = vi.fn(() => 'received-12345678');
    const source: Record<string, unknown> = {};
    Object.defineProperty(source, 'fingerprint', { enumerable: true, get: getter });
    const result = validateContinuousResponseFingerprint({ source });
    expect(result.ok).toBe(false);
    expect(getter).not.toHaveBeenCalled();
  });

  it('aceita formato canônico sem afirmar origem', () => {
    const result = validateContinuousResponseFingerprint({ source: { fingerprint: 'received-12345678' } });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.message).toMatch(/pode colidir.*não autentica origem/i);
  });

  it('deixa ausência e tipo inválido para o parser de domínio', () => {
    const missing = validateContinuousResponseFingerprint({ source: {} });
    const invalidType = validateContinuousResponseFingerprint({ source: { fingerprint: 123 } });
    expect(missing.ok).toBe(true);
    expect(invalidType.ok).toBe(true);
  });
});
