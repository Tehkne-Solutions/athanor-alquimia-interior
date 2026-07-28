import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import type { ContinuousCollection } from './continuousCollection';
import { attachContinuousConsistency, verifyContinuousConsistency } from './continuousConsistency';
import type { ContinuousMapItem } from './continuousMap';
import type { ContinuousReceivedCollection } from './continuousReceive';
import { parseContinuousCollectionShareWithConsistency } from './continuousReceiveConsistency';
import { createContinuousResponseExport } from './continuousResponse';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';
import { createContinuousCollectionShareExport } from './continuousShare';

const createdAt = '2026-07-27T20:00:00.000Z';
const completedAt = '2026-07-27T21:00:00.000Z';
const generatedAt = '2026-07-27T22:00:00.000Z';

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

function mapItem(overrides: Partial<ContinuousMapItem> = {}): ContinuousMapItem {
  return {
    id: 'cycle-local',
    kind: 'theme-cycle',
    sourceTrailId: 'source-trail',
    sourceCycleInstanceId: 'source-cycle',
    startPoint: 'water',
    themeId: 'theme-support',
    noTheme: false,
    variantId: 'water-v1',
    packageId: 'package-water',
    packageLabel: 'Água, memória e apoio',
    catalogVersion: '1.0.0',
    status: 'completed',
    rawStatus: 'completed',
    depth: 2,
    endedEarly: false,
    passageSummary: { completed: 2, passed: 0, pending: 0 },
    occurredAt: createdAt,
    completedAt,
    linked: true,
    ...overrides
  };
}

function collection(items: ContinuousMapItem[] = []): ContinuousCollection {
  return {
    id: 'collection-local',
    templateId: 'collection-open',
    label: 'Coleção aberta',
    status: 'active',
    items: items.map((item) => ({
      key: `${item.kind}:${item.id}`,
      item,
      source: 'local-map',
      addedAt: createdAt
    })),
    createdAt,
    updatedAt: generatedAt
  };
}

function generatedShare(items: ContinuousMapItem[] = [], includeDates = false) {
  const result = createContinuousCollectionShareExport(
    collection(items),
    shareConsent,
    { includeDates },
    '1.0.0',
    generatedAt
  );
  if (!result.ok) throw new Error(result.errors.join(' '));
  return result.export;
}

function receivedRecord(): ContinuousReceivedCollection {
  const packageValue = generatedShare();
  return {
    id: 'received-local',
    fingerprint: 'received-12345678',
    status: 'active',
    package: packageValue,
    receivedAt: generatedAt,
    updatedAt: generatedAt
  };
}

function gratitudeGesture() {
  const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
  if (!gesture) throw new Error('Gesto curado ausente.');
  return gesture;
}

describe('tempo exato no ciclo compartilhado', () => {
  it('gera partilha oficial com instante canônico e selo válido', () => {
    const value = generatedShare([mapItem()], true);
    expect(value.generatedAt).toBe(generatedAt);
    expect(value.items[0].occurredAt).toBe(createdAt);
    expect(verifyContinuousConsistency(value).status).toBe('valid');
  });

  it('recusa generatedAt com offset durante a geração da partilha', () => {
    const result = createContinuousCollectionShareExport(
      collection(),
      shareConsent,
      { includeDates: false },
      '1.0.0',
      '2026-07-27T19:00:00.000-03:00'
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/instante temporal/i);
  });

  it('recusa data de item impossível durante a geração', () => {
    const result = createContinuousCollectionShareExport(
      collection([mapItem({ occurredAt: '2026-02-30T20:00:00.000Z' })]),
      shareConsent,
      { includeDates: true },
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/occurredAt/i);
  });

  it('gera resposta oficial com instante canônico e selo válido', () => {
    const result = createContinuousResponseExport(
      receivedRecord(),
      gratitudeGesture(),
      responseConsent,
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(verifyContinuousConsistency(result.export).status).toBe('valid');
  });

  it('recusa resposta gerada sem milissegundos', () => {
    const result = createContinuousResponseExport(
      receivedRecord(),
      gratitudeGesture(),
      responseConsent,
      '1.0.0',
      '2026-07-27T22:00:00Z'
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/instante temporal/i);
  });

  it('aceita partilha selada com datas canônicas', () => {
    const result = parseContinuousCollectionShareWithConsistency(generatedShare([mapItem()], true));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/UTC, canônicos/i);
  });

  it('recusa partilha novamente selada com data impossível', () => {
    const base = generatedShare();
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({
      ...base,
      generatedAt: '2026-02-30T22:00:00.000Z'
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/tempo recusado/i);
  });

  it('mantém checksum antes do tempo exato', () => {
    const base = generatedShare();
    const result = parseContinuousCollectionShareWithConsistency({
      ...base,
      generatedAt: '2026-02-30T22:00:00.000Z'
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/selo de consistência/i);
  });

  it('mantém contrato estrito antes do tempo exato', () => {
    const base = generatedShare();
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({
      ...base,
      generatedAt: '2026-02-30T22:00:00.000Z',
      temporalHint: 'extra'
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/contrato recusado/i);
  });

  it('mantém margem textual antes do tempo exato', () => {
    const base = generatedShare();
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({
      ...base,
      generatedAt: ` ${generatedAt}`
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/margem textual/i);
  });

  it('recusa conclusão anterior à ocorrência em pacote selado', () => {
    const base = generatedShare([mapItem()], true);
    const result = parseContinuousCollectionShareWithConsistency(attachContinuousConsistency({
      ...base,
      items: base.items.map((item) => ({
        ...item,
        occurredAt: completedAt,
        completedAt: createdAt
      }))
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/não pode anteceder/i);
  });

  it('recusa retorno selado com generatedAt em offset', () => {
    const response = createContinuousResponseExport(
      receivedRecord(),
      gratitudeGesture(),
      responseConsent,
      '1.0.0',
      generatedAt
    );
    if (!response.ok) throw new Error(response.errors.join(' '));
    const result = parseContinuousResponseReturnWithConsistency(attachContinuousConsistency({
      ...response.export,
      generatedAt: '2026-07-27T19:00:00.000-03:00'
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/tempo recusado/i);
  });
});
