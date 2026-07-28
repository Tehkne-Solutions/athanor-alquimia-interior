import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import type { ContinuousCollection } from './continuousCollection';
import { attachContinuousConsistency } from './continuousConsistency';
import type { ContinuousMapItem } from './continuousMap';
import type { ContinuousReceivedCollection } from './continuousReceive';
import { parseContinuousCollectionShareWithConsistency } from './continuousReceiveConsistency';
import { createContinuousResponseExport } from './continuousResponse';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';
import { createContinuousCollectionShareExport } from './continuousShare';

const generatedAt = '2026-07-28T01:30:00.000Z';
const occurredAt = '2026-07-28T01:00:00.000Z';

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

function trail(overrides: Partial<ContinuousMapItem> = {}): ContinuousMapItem {
  return {
    id: 'trail-local',
    kind: 'trail',
    sourceTrailId: 'trail-source',
    sourceCycleInstanceId: 'cycle-source',
    startPoint: 'water',
    themeId: 'theme-support',
    noTheme: false,
    variantId: 'water-trail-v1',
    catalogVersion: '2.0.0',
    status: 'completed',
    rawStatus: 'completed',
    endedEarly: false,
    passageSummary: { completed: 1, passed: 0, pending: 0 },
    occurredAt,
    completedAt: occurredAt,
    linked: true,
    ...overrides
  };
}

function cycle(overrides: Partial<ContinuousMapItem> = {}): ContinuousMapItem {
  return {
    id: 'cycle-local',
    kind: 'theme-cycle',
    sourceTrailId: 'trail-source',
    sourceCycleInstanceId: 'cycle-source',
    startPoint: 'water',
    themeId: 'theme-support',
    noTheme: false,
    variantId: 'water-trail-v1',
    packageId: 'package-support-bridge',
    packageLabel: 'Ponte do Apoio Disponível',
    catalogVersion: '1.0.0',
    status: 'completed',
    rawStatus: 'completed',
    depth: 1,
    endedEarly: false,
    passageSummary: { completed: 1, passed: 0, pending: 0 },
    occurredAt,
    completedAt: occurredAt,
    linked: true,
    ...overrides
  };
}

function collection(item: ContinuousMapItem = trail(), templateId = 'collection-open'): ContinuousCollection {
  return {
    id: 'collection-local',
    templateId,
    label: 'Coleção aberta',
    status: 'active',
    items: [{ key: `${item.kind}:${item.id}`, item, source: 'local-map', addedAt: occurredAt }],
    createdAt: occurredAt,
    updatedAt: generatedAt
  };
}

function generateShare(item: ContinuousMapItem = trail(), templateId = 'collection-open') {
  return createContinuousCollectionShareExport(
    collection(item, templateId),
    shareConsent,
    { includeDates: true },
    '1.0.0',
    generatedAt
  );
}

function receivedRecord(): ContinuousReceivedCollection {
  const generated = createContinuousCollectionShareExport(
    {
      id: 'empty',
      templateId: 'collection-open',
      label: 'Coleção aberta',
      status: 'active',
      items: [],
      createdAt: generatedAt,
      updatedAt: generatedAt
    },
    shareConsent,
    { includeDates: false },
    '1.0.0',
    generatedAt
  );
  if (!generated.ok) throw new Error(generated.errors.join(' '));
  return {
    id: 'received-local',
    fingerprint: 'received-12345678',
    status: 'active',
    package: generated.export,
    receivedAt: generatedAt,
    updatedAt: generatedAt
  };
}

function gratitude() {
  const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
  if (!gesture) throw new Error('Gesto curado ausente.');
  return gesture;
}

describe('referências catalogadas no ciclo compartilhado', () => {
  it('gera e recebe Rastro com referências conhecidas', () => {
    const generated = generateShare();
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const received = parseContinuousCollectionShareWithConsistency(generated.export);
    expect(received.ok).toBe(true);
    if (!received.ok) return;
    expect(received.warnings.join(' ')).toMatch(/referências reconhecidas/i);
  });

  it('impede gerar coleção com modelo desconhecido', () => {
    const generated = generateShare(trail(), 'collection-invented');
    expect(generated.ok).toBe(false);
    if (generated.ok) return;
    expect(generated.errors.join(' ')).toMatch(/referência catalogada.*modelo/i);
  });

  it('impede gerar variante desconhecida', () => {
    const generated = generateShare(trail({ variantId: 'water-invented-v9' }));
    expect(generated.ok).toBe(false);
    if (generated.ok) return;
    expect(generated.errors.join(' ')).toMatch(/variante não existe/i);
  });

  it('impede gerar pacote com rótulo divergente', () => {
    const generated = generateShare(cycle({ packageLabel: 'Rótulo alterado' }));
    expect(generated.ok).toBe(false);
    if (generated.ok) return;
    expect(generated.errors.join(' ')).toMatch(/rótulo não corresponde/i);
  });

  it('recusa partilha novamente selada com variante desconhecida', () => {
    const generated = generateShare();
    if (!generated.ok) throw new Error(generated.errors.join(' '));
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({
      ...generated.export,
      items: generated.export.items.map((item) => ({ ...item, variantId: 'water-invented-v9' }))
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/referência recusada.*variante/i);
  });

  it('recusa partilha novamente selada com modelo desconhecido', () => {
    const generated = generateShare();
    if (!generated.ok) throw new Error(generated.errors.join(' '));
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({
      ...generated.export,
      collection: { ...generated.export.collection, templateId: 'collection-invented' }
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/referência recusada.*modelo/i);
  });

  it('recusa pacote conhecido ligado ao tema errado', () => {
    const generated = generateShare(cycle());
    if (!generated.ok) throw new Error(generated.errors.join(' '));
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({
      ...generated.export,
      items: generated.export.items.map((item) => ({ ...item, themeId: 'theme-transition' }))
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/referência recusada.*não corresponde ao tema/i);
  });

  it('preserva tema desconhecido explícito com pacote aberto', () => {
    const open = cycle({
      themeId: undefined,
      noTheme: false,
      packageId: 'package-open-no-theme',
      packageLabel: 'Passagem Aberta sem Tema'
    });
    const generated = generateShare(open);
    expect(generated.ok).toBe(true);
  });

  it('mantém checksum antes da referência catalogada', () => {
    const generated = generateShare();
    if (!generated.ok) throw new Error(generated.errors.join(' '));
    const result = parseContinuousCollectionShareWithConsistency({
      ...generated.export,
      items: generated.export.items.map((item) => ({ ...item, variantId: 'water-invented-v9' }))
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/selo de consistência recusado/i);
  });

  it('mantém compatibilidade dos campos antes da referência', () => {
    const generated = generateShare();
    if (!generated.ok) throw new Error(generated.errors.join(' '));
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({
      ...generated.export,
      items: generated.export.items.map((item) => ({
        ...item,
        packageId: 'package-invented',
        packageLabel: 'Pacote inventado'
      }))
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/compatibilidade recusada/i);
  });

  it('gera e lê resposta com gesto catalogado', () => {
    const generated = createContinuousResponseExport(
      receivedRecord(),
      gratitude(),
      responseConsent,
      '1.0.0',
      generatedAt
    );
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseContinuousResponseReturnWithConsistency(generated.export);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.warnings.join(' ')).toMatch(/referências reconhecidas/i);
  });

  it('recusa retorno novamente selado com declaração divergente', () => {
    const generated = createContinuousResponseExport(
      receivedRecord(),
      gratitude(),
      responseConsent,
      '1.0.0',
      generatedAt
    );
    if (!generated.ok) throw new Error(generated.errors.join(' '));
    const result = parseContinuousResponseReturnWithConsistency(attachContinuousConsistency({
      ...generated.export,
      gesture: { ...generated.export.gesture, statement: 'Texto alterado.' }
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/referência recusada.*declaração/i);
  });

  it('mantém checksum antes da referência do gesto', () => {
    const generated = createContinuousResponseExport(
      receivedRecord(),
      gratitude(),
      responseConsent,
      '1.0.0',
      generatedAt
    );
    if (!generated.ok) throw new Error(generated.errors.join(' '));
    const result = parseContinuousResponseReturnWithConsistency({
      ...generated.export,
      gesture: { ...generated.export.gesture, statement: 'Texto alterado.' }
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/selo de consistência recusado/i);
  });
});
