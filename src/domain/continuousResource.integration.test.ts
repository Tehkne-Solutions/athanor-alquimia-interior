import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import type { ContinuousCollection } from './continuousCollection';
import { attachContinuousConsistency, verifyContinuousConsistency } from './continuousConsistency';
import type { ContinuousReceivedCollection } from './continuousReceive';
import { parseContinuousCollectionShareWithConsistency } from './continuousReceiveConsistency';
import { createContinuousResponseExport } from './continuousResponse';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';
import { createContinuousCollectionShareExport } from './continuousShare';

const generatedAt = '2026-07-27T17:10:00.000Z';

function sharePayload(overrides: Record<string, unknown> = {}) {
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
    notices: ['Coleção vazia preservada.'],
    ...overrides
  };
}

function responsePayload(overrides: Record<string, unknown> = {}) {
  const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
  if (!gesture) throw new Error('Gesto curado ausente.');
  return {
    schema: 'athanor-continuous-response-v1',
    policy: 'optional-curated-no-tracking-v1',
    catalogVersion: '1.0.0',
    generatedAt,
    provenance: {
      product: 'Athanor — Alquimia Interior',
      author: 'Tehkné Solutions',
      transmission: 'manual-local-file'
    },
    source: {
      fingerprint: 'received-12345678',
      collectionLabel: 'Coleção aberta',
      itemCount: 0,
      status: 'active'
    },
    gesture: {
      id: gesture.id,
      label: gesture.label,
      statement: gesture.statement
    },
    expectation: {
      replyRequired: false,
      deliveryTracked: false,
      recipientStored: false
    },
    notices: ['Nenhuma resposta adicional é necessária.'],
    ...overrides
  };
}

function collectionWithItems(count: number): ContinuousCollection {
  const item = {
    id: 'trail-id',
    kind: 'trail' as const,
    sourceTrailId: 'trail-source',
    sourceCycleInstanceId: 'cycle-source',
    startPoint: 'word' as const,
    noTheme: true,
    variantId: 'word-v1',
    catalogVersion: '1.0.0',
    status: 'completed' as const,
    rawStatus: 'completed',
    endedEarly: false,
    passageSummary: { completed: 1, passed: 0, pending: 0 },
    occurredAt: generatedAt,
    completedAt: generatedAt,
    linked: true
  };
  return {
    id: 'collection-local',
    templateId: 'collection-open',
    label: 'Coleção aberta',
    status: 'active',
    items: Array.from({ length: count }, (_, index) => ({
      key: `trail:${index}`,
      item: { ...item, id: `trail-${index}`, sourceTrailId: `trail-source-${index}` },
      source: 'local-map' as const,
      addedAt: generatedAt
    })),
    createdAt: generatedAt,
    updatedAt: generatedAt
  };
}

function receivedRecord(label = 'Coleção aberta'): ContinuousReceivedCollection {
  return {
    id: 'received-local',
    fingerprint: 'received-12345678',
    status: 'active',
    package: sharePayload({
      collection: { templateId: 'collection-open', label, status: 'active', itemCount: 0 }
    }) as ContinuousReceivedCollection['package'],
    receivedAt: generatedAt,
    updatedAt: generatedAt
  };
}

const shareConsent = {
  collection: true,
  preview: true,
  localFile: true,
  recipient: true,
  noPersonalNotes: true
};

const responseConsent = {
  source: true,
  preview: true,
  localFile: true,
  noReply: true
};

describe('limites no ciclo compartilhado', () => {
  it('aceita partilha pequena antes das demais barreiras', () => {
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency(sharePayload()));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/dentro dos limites locais/i);
  });

  it('recusa lista extensa antes da versão', () => {
    const result = parseContinuousCollectionShareWithConsistency({
      ...sharePayload({ catalogVersion: '99.0.0' }),
      items: Array.from({ length: 1_001 }, () => null)
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/limite local recusado.*lista/i);
    expect(result.errors.join(' ')).not.toMatch(/versão recusada/i);
  });

  it('recusa profundidade excessiva antes do checksum', () => {
    let deep: Record<string, unknown> = { value: true };
    for (let index = 0; index < 18; index += 1) deep = { next: deep };
    const result = parseContinuousCollectionShareWithConsistency({ ...sharePayload(), extra: deep });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/profundidade/i);
  });

  it('recusa texto excessivo em resposta antes da prévia', () => {
    const result = parseContinuousResponseReturnWithConsistency({
      ...responsePayload(),
      notices: ['x'.repeat(8_193)]
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/texto/i);
  });

  it('aceita resposta pequena e preserva estatística como aviso', () => {
    const result = parseContinuousResponseReturnWithConsistency(attachContinuousConsistency(responsePayload()));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/nós.*profundidade/i);
  });

  it('impede gerar partilha com itens acima do orçamento', () => {
    const result = createContinuousCollectionShareExport(
      collectionWithItems(1_001),
      shareConsent,
      { includeDates: false },
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não foi possível gerar.*lista/i);
  });

  it('gera partilha pequena com selo válido', () => {
    const result = createContinuousCollectionShareExport(
      collectionWithItems(1),
      shareConsent,
      { includeDates: false },
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(verifyContinuousConsistency(result.export).status).toBe('valid');
  });

  it('impede gerar resposta com rótulo acima do limite', () => {
    const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
    if (!gesture) throw new Error('Gesto curado ausente.');
    const result = createContinuousResponseExport(
      receivedRecord('x'.repeat(8_193)),
      gesture,
      responseConsent,
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não foi possível gerar.*texto/i);
  });
});
