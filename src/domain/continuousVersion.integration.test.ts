import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import { canonicalResponseNotices, canonicalShareNotices } from './continuousCanonicalNotice.testFixtures';
import { attachContinuousConsistency } from './continuousConsistency';
import { parseContinuousCollectionShareWithConsistency } from './continuousReceiveConsistency';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';

const generatedAt = '2026-07-27T18:00:00.000Z';

function sharePayload(catalogVersion = '1.0.0') {
  return {
    schema: 'athanor-continuous-collection-share-v1' as const,
    policy: 'explicit-consent-minimized-local-export-v1' as const,
    catalogVersion,
    generatedAt,
    provenance: {
      product: 'Athanor — Alquimia Interior' as const,
      author: 'Tehkné Solutions' as const,
      transmission: 'manual-local-file' as const
    },
    collection: {
      templateId: 'collection-open',
      label: 'Coleção aberta',
      status: 'active' as const,
      itemCount: 0
    },
    options: { includeDates: false },
    items: [],
    notices: canonicalShareNotices(false, 0)
  };
}

function responsePayload(catalogVersion = '1.0.0') {
  const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
  if (!gesture) throw new Error('Gesto curado ausente.');
  return {
    schema: 'athanor-continuous-response-v1' as const,
    policy: 'optional-curated-no-tracking-v1' as const,
    catalogVersion,
    generatedAt,
    provenance: {
      product: 'Athanor — Alquimia Interior' as const,
      author: 'Tehkné Solutions' as const,
      transmission: 'manual-local-file' as const
    },
    source: {
      fingerprint: 'received-12345678',
      collectionLabel: 'Coleção aberta',
      itemCount: 0,
      status: 'active' as const
    },
    gesture: {
      id: gesture.id,
      label: gesture.label,
      statement: gesture.statement
    },
    expectation: {
      replyRequired: false as const,
      deliveryTracked: false as const,
      recipientStored: false as const
    },
    notices: canonicalResponseNotices(0)
  };
}

describe('versões no ciclo compartilhado', () => {
  it('aceita partilha atual selada', () => {
    const result = parseContinuousCollectionShareWithConsistency(
      attachContinuousConsistency(sharePayload())
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.package.catalogVersion).toBe('1.0.0');
    expect(result.warnings.join(' ')).toMatch(/versão atual 1\.0\.0/i);
  });

  it('aceita partilha atual sem selo por compatibilidade da fase anterior', () => {
    const result = parseContinuousCollectionShareWithConsistency(sharePayload());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/arquivo legado sem selo/i);
  });

  it('recusa partilha futura mesmo quando o selo corresponde', () => {
    const result = parseContinuousCollectionShareWithConsistency(
      attachContinuousConsistency(sharePayload('1.0.1'))
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/versão futura 1\.0\.1/i);
    expect(result.errors.join(' ')).toMatch(/não executa downgrade/i);
  });

  it('recusa partilha antiga desconhecida sem migração', () => {
    const result = parseContinuousCollectionShareWithConsistency(sharePayload('0.9.0'));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não existe migração explícita/i);
  });

  it('recusa partilha com versão malformada', () => {
    const result = parseContinuousCollectionShareWithConsistency(sharePayload('latest'));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/semver estrito/i);
  });

  it('detecta versão alterada depois do selo antes de avaliar compatibilidade', () => {
    const sealed = attachContinuousConsistency(sharePayload());
    const result = parseContinuousCollectionShareWithConsistency({
      ...sealed,
      catalogVersion: '1.0.1'
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/selo de consistência recusado/i);
  });

  it('aceita resposta atual selada', () => {
    const result = parseContinuousResponseReturnWithConsistency(
      attachContinuousConsistency(responsePayload())
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.package.catalogVersion).toBe('1.0.0');
    expect(result.warnings.join(' ')).toMatch(/versão atual 1\.0\.0/i);
  });

  it('recusa resposta futura sem criar prévia', () => {
    const result = parseContinuousResponseReturnWithConsistency(
      attachContinuousConsistency(responsePayload('2.0.0'))
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/versão futura 2\.0\.0/i);
  });

  it('recusa resposta antiga desconhecida', () => {
    const result = parseContinuousResponseReturnWithConsistency(responsePayload('0.8.0'));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não existe migração explícita/i);
  });

  it('recusa resposta com versão malformada', () => {
    const result = parseContinuousResponseReturnWithConsistency(responsePayload('1'));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/semver estrito/i);
  });
});
