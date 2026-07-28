import { describe, expect, it, vi } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import type { ContinuousCollection } from './continuousCollection';
import { attachContinuousConsistency } from './continuousConsistency';
import { validateContinuousInertJson } from './continuousInertJson';
import type { ContinuousReceivedCollection } from './continuousReceive';
import { parseContinuousCollectionShareWithConsistency } from './continuousReceiveConsistency';
import { readContinuousJsonFile } from './continuousResource';
import { createContinuousResponseExport } from './continuousResponse';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';
import { createContinuousCollectionShareExport } from './continuousShare';

const generatedAt = '2026-07-27T18:00:00.000Z';

function sharePayload() {
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
    notices: ['Coleção vazia preservada.']
  };
}

function responsePayload() {
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
    notices: ['Nenhuma resposta adicional é necessária.']
  };
}

function collection(): ContinuousCollection {
  return {
    id: 'collection-local',
    templateId: 'collection-open',
    label: 'Coleção aberta',
    status: 'active',
    items: [{
      key: 'trail:1',
      source: 'local-map',
      addedAt: generatedAt,
      item: {
        id: 'trail-id',
        kind: 'trail',
        sourceTrailId: 'trail-source',
        sourceCycleInstanceId: 'cycle-source',
        startPoint: 'word',
        noTheme: true,
        variantId: 'word-trail-v1',
        catalogVersion: '1.0.0',
        status: 'completed',
        rawStatus: 'completed',
        endedEarly: false,
        passageSummary: { completed: 1, passed: 0, pending: 0 },
        occurredAt: generatedAt,
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
    package: sharePayload() as ContinuousReceivedCollection['package'],
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

describe('forma inerte no ciclo compartilhado', () => {
  it('aceita partilha selada e informa a forma inerte', () => {
    const result = parseContinuousCollectionShareWithConsistency(
      attachContinuousConsistency(sharePayload())
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/forma JSON inerte confirmada/i);
  });

  it('recusa chave reservada antes do checksum e da versão', () => {
    const input = JSON.parse(JSON.stringify({
      ...sharePayload(),
      catalogVersion: '99.0.0',
      __protoMarker: true
    }).replace('"__protoMarker":true', '"__proto__":{"polluted":true}')) as unknown;
    const result = parseContinuousCollectionShareWithConsistency(input);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/forma JSON recusada.*__proto__/i);
    expect(result.errors.join(' ')).not.toMatch(/versão recusada/i);
  });

  it('recusa getter antes que ele seja executado', () => {
    const getter = vi.fn(() => '2.0.0');
    const input = sharePayload() as Record<string, unknown>;
    Object.defineProperty(input, 'catalogVersion', { enumerable: true, get: getter });
    const result = parseContinuousCollectionShareWithConsistency(input);
    expect(result.ok).toBe(false);
    expect(getter).not.toHaveBeenCalled();
  });

  it('recusa protótipo especial antes da prévia de retorno', () => {
    const input = { ...responsePayload(), extra: new Date(generatedAt) };
    const result = parseContinuousResponseReturnWithConsistency(input);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/forma JSON recusada.*protótipo especial/i);
  });

  it('recusa chave reservada durante leitura local do arquivo', async () => {
    const text = JSON.stringify(sharePayload()).replace(
      '"notices":[',
      '"__proto__":{"polluted":true},"notices":['
    );
    const result = await readContinuousJsonFile({
      size: new TextEncoder().encode(text).length,
      text: async () => text
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/forma JSON recusada.*__proto__/i);
  });

  it('gera partilha sem propriedades undefined', () => {
    const result = createContinuousCollectionShareExport(
      collection(),
      shareConsent,
      { includeDates: false },
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(validateContinuousInertJson(result.export).ok).toBe(true);
    expect('themeId' in result.export.items[0]).toBe(false);
    expect('completedAt' in result.export.items[0]).toBe(false);
  });

  it('gera resposta como JSON inerte', () => {
    const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
    if (!gesture) throw new Error('Gesto curado ausente.');
    const result = createContinuousResponseExport(
      receivedRecord(),
      gesture,
      responseConsent,
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(validateContinuousInertJson(result.export).ok).toBe(true);
  });

  it('recusa array esparso antes do orçamento estrutural', () => {
    const items = new Array(2);
    items[1] = null;
    const result = parseContinuousCollectionShareWithConsistency({
      ...sharePayload(),
      items
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/forma JSON recusada.*espaço vazio/i);
    expect(result.errors.join(' ')).not.toMatch(/limite local recusado/i);
  });
});
