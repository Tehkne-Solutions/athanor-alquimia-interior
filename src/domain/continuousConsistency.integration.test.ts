import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import { attachContinuousConsistency, verifyContinuousConsistency } from './continuousConsistency';
import { parseContinuousCollectionShareWithConsistency } from './continuousReceiveConsistency';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';

const generatedAt = '2026-07-27T16:00:00.000Z';

function sharePayload() {
  return {
    schema: 'athanor-continuous-collection-share-v1' as const,
    policy: 'explicit-consent-minimized-local-export-v1' as const,
    catalogVersion: '1.0.0',
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
    notices: ['Coleção vazia preservada.']
  };
}

function responsePayload() {
  const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
  if (!gesture) throw new Error('Gesto curado ausente.');
  return {
    schema: 'athanor-continuous-response-v1' as const,
    policy: 'optional-curated-no-tracking-v1' as const,
    catalogVersion: '1.0.0',
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
    notices: ['Nenhuma resposta adicional é necessária.']
  };
}

describe('consistência no ciclo compartilhado', () => {
  it('aceita partilha selada e preserva aviso de limite', () => {
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency(sharePayload()));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/sem autenticar identidade/i);
    expect(verifyContinuousConsistency(result.package).status).toBe('valid');
  });

  it('recusa partilha alterada depois do selo', () => {
    const sealed = attachContinuousConsistency(sharePayload());
    const result = parseContinuousCollectionShareWithConsistency({
      ...sealed,
      collection: { ...sealed.collection, label: 'Rótulo alterado' }
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/selo de consistência recusado/i);
  });

  it('aceita partilha legada e sela a cópia sanitizada', () => {
    const result = parseContinuousCollectionShareWithConsistency(sharePayload());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/arquivo legado sem selo/i);
    expect(verifyContinuousConsistency(result.package).status).toBe('valid');
  });

  it('recusa partilha com declaração falsa de autenticação', () => {
    const sealed = attachContinuousConsistency(sharePayload());
    const result = parseContinuousCollectionShareWithConsistency({
      ...sealed,
      consistency: { ...sealed.consistency, authenticatesIdentity: true }
    });
    expect(result.ok).toBe(false);
  });

  it('aceita resposta selada para prévia transitória', () => {
    const result = parseContinuousResponseReturnWithConsistency(attachContinuousConsistency(responsePayload()));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/sem autenticar identidade/i);
    expect(verifyContinuousConsistency(result.package).status).toBe('valid');
  });

  it('recusa resposta com declaração alterada depois do selo', () => {
    const sealed = attachContinuousConsistency(responsePayload());
    const result = parseContinuousResponseReturnWithConsistency({
      ...sealed,
      gesture: { ...sealed.gesture, statement: 'Texto alterado.' }
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/selo de consistência recusado/i);
  });

  it('aceita resposta legada com aviso, sem persistir a verificação', () => {
    const result = parseContinuousResponseReturnWithConsistency(responsePayload());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/arquivo legado sem selo/i);
  });

  it('recusa algoritmo não suportado antes do parser de domínio', () => {
    const sealed = attachContinuousConsistency(responsePayload());
    const result = parseContinuousResponseReturnWithConsistency({
      ...sealed,
      consistency: { ...sealed.consistency, algorithm: 'sha-256' }
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/incompatíveis/i);
  });
});
