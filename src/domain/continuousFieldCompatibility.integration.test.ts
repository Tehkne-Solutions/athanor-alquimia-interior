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

function collectionWithItem(overrides: Record<string, unknown> = {}): ContinuousCollection {
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
        occurredAt: '2026-07-27T20:00:00.000Z',
        linked: true,
        ...overrides
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

describe('compatibilidade de campos no ciclo compartilhado', () => {
  it('aceita partilha compatível e inclui aviso da barreira', () => {
    const result = parseContinuousCollectionShareWithConsistency(
      attachContinuousConsistency(sharePayload())
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/Tema, pacote, tipo, estado e encerramento/i);
  });

  it('recusa tema explícito junto de noTheme depois de selo válido', () => {
    const base = sharePayload();
    const payload = {
      ...base,
      items: [{ ...base.items[0], themeId: 'theme-clarity', noTheme: true }]
    };
    const result = parseContinuousCollectionShareWithConsistency(
      attachContinuousConsistency(payload)
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Compatibilidade recusada.*themeId/i);
  });

  it('recusa pacote parcial depois de selo válido', () => {
    const base = sharePayload();
    const payload = {
      ...base,
      items: [{ ...base.items[0], kind: 'theme-cycle', packageId: 'cycle-clarity' }]
    };
    const result = parseContinuousCollectionShareWithConsistency(
      attachContinuousConsistency(payload)
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/packageId e packageLabel/i);
  });

  it('recusa campos de ciclo em Rastro', () => {
    const base = sharePayload();
    const payload = {
      ...base,
      items: [{
        ...base.items[0],
        packageId: 'cycle-clarity',
        packageLabel: 'Ciclo de clareza',
        depth: 1
      }]
    };
    const result = parseContinuousCollectionShareWithConsistency(
      attachContinuousConsistency(payload)
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Rastro não pode declarar pacote/i);
  });

  it('recusa ciclo encerrado cedo que declara status completed', () => {
    const base = sharePayload();
    const payload = {
      ...base,
      items: [{
        ...base.items[0],
        kind: 'theme-cycle',
        endedEarly: true,
        status: 'completed'
      }]
    };
    const result = parseContinuousCollectionShareWithConsistency(
      attachContinuousConsistency(payload)
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/status incomplete/i);
  });

  it('recusa item concluído com pendências', () => {
    const base = sharePayload();
    const payload = {
      ...base,
      items: [{
        ...base.items[0],
        passageSummary: { completed: 1, passed: 0, pending: 1 }
      }]
    };
    const result = parseContinuousCollectionShareWithConsistency(
      attachContinuousConsistency(payload)
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/zero passagens pendentes/i);
  });

  it('mantém checksum antes da compatibilidade', () => {
    const sealed = attachContinuousConsistency(sharePayload());
    const changed = {
      ...sealed,
      items: [{ ...sealed.items[0], themeId: 'theme-clarity', noTheme: true }]
    };
    const result = parseContinuousCollectionShareWithConsistency(changed);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Selo de consistência recusado/i);
  });

  it('mantém relação exata antes da compatibilidade', () => {
    const base = sharePayload();
    const payload = {
      ...base,
      collection: { ...base.collection, itemCount: 2 },
      items: [{ ...base.items[0], themeId: 'theme-clarity', noTheme: true }]
    };
    const result = parseContinuousCollectionShareWithConsistency(
      attachContinuousConsistency(payload)
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Relação recusada.*quantidade/i);
  });

  it('mantém parser de domínio depois da compatibilidade', () => {
    const base = sharePayload();
    const payload = {
      ...base,
      items: [{ ...base.items[0], startPoint: 'invalid-start-point' }]
    };
    const result = parseContinuousCollectionShareWithConsistency(
      attachContinuousConsistency(payload)
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/elemento inválido/i);
  });

  it('impede geração quando a coleção local mistura tema e noTheme', () => {
    const result = createContinuousCollectionShareExport(
      collectionWithItem({ themeId: 'theme-clarity', noTheme: true }),
      shareConsent,
      { includeDates: true },
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/preservar a natureza dos campos/i);
  });

  it('mantém geração válida para Rastro compatível', () => {
    const result = createContinuousCollectionShareExport(
      collectionWithItem(),
      shareConsent,
      { includeDates: true },
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(true);
  });

  it('mantém resposta exportável sem discriminantes adicionais', () => {
    const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
    if (!gesture) throw new Error('Gesto curado ausente.');
    const generated = createContinuousResponseExport(
      receivedRecord(),
      gesture,
      responseConsent,
      '1.0.0',
      generatedAt
    );
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseContinuousResponseReturnWithConsistency(generated.export);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.warnings.join(' ')).toMatch(/discriminantes opcionais adicionais/i);
  });
});
