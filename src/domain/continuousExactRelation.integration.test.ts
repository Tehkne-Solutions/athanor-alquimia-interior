import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import { canonicalShareNotices } from './continuousCanonicalNotice.testFixtures';
import type { ContinuousCollection } from './continuousCollection';
import { attachContinuousConsistency } from './continuousConsistency';
import type { ContinuousReceivedCollection } from './continuousReceive';
import { parseContinuousCollectionShareWithConsistency } from './continuousReceiveConsistency';
import { createContinuousResponseExport } from './continuousResponse';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';
import { createContinuousCollectionShareExport } from './continuousShare';

const generatedAt = '2026-07-27T22:00:00.000Z';

function sharePayload(overrides: Record<string, unknown> = {}) {
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
      itemCount: 1
    },
    options: { includeDates: true },
    items: [{
      position: 1,
      kind: 'trail' as const,
      startPoint: 'word' as const,
      noTheme: true,
      variantId: 'word-trail-v1',
      status: 'completed' as const,
      endedEarly: false,
      passageSummary: { completed: 1, passed: 0, pending: 0 },
      occurredAt: '2026-07-27T20:00:00.000Z',
      completedAt: '2026-07-27T21:00:00.000Z'
    }],
    notices: canonicalShareNotices(true, 1),
    ...overrides
  };
}

function emptyCollection(occurredAt = '2026-07-27T20:00:00.000Z'): ContinuousCollection {
  return {
    id: 'collection-local',
    templateId: 'collection-open',
    label: 'Coleção aberta',
    status: 'active',
    items: [{
      key: 'trail:local',
      source: 'local-map',
      addedAt: generatedAt,
      item: {
        id: 'local',
        kind: 'trail',
        sourceTrailId: 'local',
        sourceCycleInstanceId: 'cycle-local',
        startPoint: 'word',
        noTheme: true,
        variantId: 'word-trail-v1',
        status: 'active',
        rawStatus: 'active',
        endedEarly: false,
        passageSummary: { completed: 0, passed: 0, pending: 1 },
        occurredAt,
        linked: true
      }
    }],
    createdAt: generatedAt,
    updatedAt: generatedAt
  };
}

function receivedRecord(): ContinuousReceivedCollection {
  return {
    id: 'received-local',
    fingerprint: 'received-12345678',
    status: 'active',
    package: sharePayload(),
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

describe('relações exatas no ciclo compartilhado', () => {
  it('aceita partilha coerente e selada', () => {
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency(sharePayload()));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/cronologia interna/i);
  });

  it('recusa quantidade contraditória depois de um selo válido', () => {
    const payload = sharePayload({ collection: { ...sharePayload().collection, itemCount: 2 } });
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency(payload));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Relação recusada.*quantidade/i);
  });

  it('recusa posição contraditória depois de um selo válido', () => {
    const base = sharePayload();
    const payload = { ...base, items: [{ ...base.items[0], position: 2 }] };
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency(payload));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Relação recusada.*posição/i);
  });

  it('recusa datas presentes quando a política declara omissão', () => {
    const payload = sharePayload({ options: { includeDates: false } });
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency(payload));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/includeDates/i);
  });

  it('recusa conclusão sem ocorrência', () => {
    const base = sharePayload();
    const { occurredAt: _removed, ...withoutOccurrence } = base.items[0];
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({ ...base, items: [withoutOccurrence] }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/exige occurredAt/i);
  });

  it('recusa instante interno posterior à geração', () => {
    const base = sharePayload();
    const payload = { ...base, items: [{ ...base.items[0], completedAt: '2026-07-27T23:00:00.000Z' }] };
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency(payload));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/posterior à geração/i);
  });

  it('mantém checksum antes da relação', () => {
    const sealed = attachContinuousConsistency(sharePayload());
    const changed = { ...sealed, collection: { ...sealed.collection, itemCount: 2 } };
    const result = parseContinuousCollectionShareWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Selo de consistência recusado/i);
  });

  it('mantém formato temporal antes da relação', () => {
    const base = sharePayload();
    const payload = { ...base, items: [{ ...base.items[0], occurredAt: '27/07/2026 20:00' }] };
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency(payload));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Tempo recusado/i);
  });

  it('impede geração quando o item ocorre depois de generatedAt', () => {
    const result = createContinuousCollectionShareExport(
      emptyCollection('2026-07-27T23:00:00.000Z'),
      shareConsent,
      { includeDates: true },
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/preservar a sequência/i);
  });

  it('mantém geração válida quando a sequência é coerente', () => {
    const result = createContinuousCollectionShareExport(
      emptyCollection(),
      shareConsent,
      { includeDates: true },
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(true);
  });

  it('mantém resposta exportável sem relação temporal adicional', () => {
    const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
    if (!gesture) throw new Error('Gesto curado ausente.');
    const generated = createContinuousResponseExport(receivedRecord(), gesture, responseConsent, '1.0.0', generatedAt);
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    expect(parseContinuousResponseReturnWithConsistency(generated.export).ok).toBe(true);
  });
});
