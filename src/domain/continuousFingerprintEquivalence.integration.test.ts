import { describe, expect, it } from 'vitest';
import { continuousResponseGestures } from '../content/continuousResponse';
import type { ContinuousCollection } from './continuousCollection';
import { attachContinuousConsistency } from './continuousConsistency';
import {
  compareContinuousSharePackages,
  fingerprintContinuousSharePackage
} from './continuousFingerprintEquivalence';
import type { ContinuousMapItem } from './continuousMap';
import {
  createContinuousReceivedRegistry,
  findEquivalentReceivedCollection,
  findReceivedAllByFingerprint,
  findReceivedByFingerprint,
  keepReceivedCollection,
  type ContinuousReceivedCollection
} from './continuousReceive';
import { createContinuousResponseExport } from './continuousResponse';
import { parseContinuousResponseReturnWithConsistency } from './continuousReturnConsistency';
import { createContinuousCollectionShareExport } from './continuousShare';

const generatedAt = '2026-07-28T16:30:00.000Z';
const receivedAt = '2026-07-28T17:00:00.000Z';

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

function trail(linked: boolean): ContinuousMapItem {
  return {
    id: linked ? 'trail-linked' : 'trail-unlinked',
    kind: 'trail',
    sourceTrailId: 'source-trail',
    sourceCycleInstanceId: 'source-cycle',
    startPoint: 'word',
    noTheme: true,
    variantId: 'word-trail-v1',
    catalogVersion: '1.0.0',
    status: 'active',
    rawStatus: 'active',
    endedEarly: false,
    passageSummary: { completed: 0, passed: 0, pending: 1 },
    occurredAt: generatedAt,
    linked
  };
}

function collection(linked: boolean): ContinuousCollection {
  const item = trail(linked);
  return {
    id: linked ? 'collection-linked' : 'collection-unlinked',
    templateId: 'collection-open',
    label: 'Coleção aberta',
    status: 'active',
    items: [{
      key: `trail:${item.id}`,
      item,
      source: 'local-map',
      addedAt: generatedAt
    }],
    createdAt: generatedAt,
    updatedAt: generatedAt
  };
}

function share(linked: boolean, at = generatedAt) {
  const result = createContinuousCollectionShareExport(
    collection(linked),
    shareConsent,
    { includeDates: false },
    '1.0.0',
    at
  );
  if (!result.ok) throw new Error(result.errors.join(' '));
  return result.export;
}

function record(packageValue = share(true), fingerprint = fingerprintContinuousSharePackage(packageValue)): ContinuousReceivedCollection {
  return {
    id: 'received-local',
    fingerprint,
    status: 'active',
    package: packageValue,
    receivedAt,
    updatedAt: receivedAt
  };
}

function gratitudeGesture() {
  const gesture = continuousResponseGestures.find((entry) => entry.id === 'gratitude');
  if (!gesture) throw new Error('Gesto curado ausente.');
  return gesture;
}

describe('impressão como indício no ciclo compartilhado', () => {
  it('deduplica conteúdo equivalente exportado em outro instante', () => {
    const first = share(true, generatedAt);
    const second = share(true, '2026-07-29T16:30:00.000Z');
    const registry = createContinuousReceivedRegistry('1.0.0', generatedAt);
    const once = keepReceivedCollection(registry, { id: 'received-1', package: first }, receivedAt);
    const twice = keepReceivedCollection(once, { id: 'received-2', package: second }, receivedAt);
    expect(compareContinuousSharePackages(first, second)).toBe('equivalent-copy');
    expect(twice.records).toHaveLength(1);
    expect(findEquivalentReceivedCollection(twice, second)?.id).toBe('received-1');
  });

  it('preserva duas cópias quando a mesma impressão encobre avisos diferentes', () => {
    const linked = share(true);
    const unlinked = share(false);
    expect(fingerprintContinuousSharePackage(linked)).toBe(fingerprintContinuousSharePackage(unlinked));
    expect(compareContinuousSharePackages(linked, unlinked)).toBe('descriptive-collision');

    const registry = createContinuousReceivedRegistry('1.0.0', generatedAt);
    const once = keepReceivedCollection(registry, { id: 'received-linked', package: linked }, receivedAt);
    const twice = keepReceivedCollection(once, { id: 'received-unlinked', package: unlinked }, receivedAt);
    const matches = findReceivedAllByFingerprint(twice, fingerprintContinuousSharePackage(linked));

    expect(twice.records).toHaveLength(2);
    expect(matches.map((entry) => entry.id)).toEqual(['received-linked', 'received-unlinked']);
    expect(findReceivedByFingerprint(twice, matches[0].fingerprint)?.id).toBe('received-linked');
  });

  it('não sobrescreve registro existente durante colisão descritiva', () => {
    const linked = share(true);
    const unlinked = share(false);
    const registry = keepReceivedCollection(
      createContinuousReceivedRegistry('1.0.0', generatedAt),
      { id: 'first', package: linked },
      receivedAt
    );
    const result = keepReceivedCollection(registry, { id: 'second', package: unlinked }, '2026-07-28T18:00:00.000Z');
    expect(result.records[0].package.notices).toEqual(linked.notices);
    expect(result.records[1].package.notices).toEqual(unlinked.notices);
  });

  it('gera resposta quando a impressão usa o formato canônico', () => {
    const result = createContinuousResponseExport(
      record(),
      gratitudeGesture(),
      responseConsent,
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(true);
  });

  it('impede geração com impressão fora do formato canônico', () => {
    const result = createContinuousResponseExport(
      record(share(true), 'received-ABCDEF12'),
      gratitudeGesture(),
      responseConsent,
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/impressão descritiva.*oito hexadecimais minúsculos/i);
  });

  it('recusa retorno novamente selado com impressão malformada', () => {
    const generated = createContinuousResponseExport(
      record(),
      gratitudeGesture(),
      responseConsent,
      '1.0.0',
      generatedAt
    );
    if (!generated.ok) throw new Error(generated.errors.join(' '));
    const result = parseContinuousResponseReturnWithConsistency(attachContinuousConsistency({
      ...generated.export,
      source: { ...generated.export.source, fingerprint: 'received-XYZ' }
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Impressão recusada.*oito hexadecimais minúsculos/i);
  });

  it('mantém checksum antes do formato da impressão', () => {
    const generated = createContinuousResponseExport(
      record(),
      gratitudeGesture(),
      responseConsent,
      '1.0.0',
      generatedAt
    );
    if (!generated.ok) throw new Error(generated.errors.join(' '));
    const result = parseContinuousResponseReturnWithConsistency({
      ...generated.export,
      source: { ...generated.export.source, fingerprint: 'received-XYZ' }
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Selo de consistência recusado/i);
  });

  it('mantém avisos canônicos depois do formato da impressão', () => {
    const generated = createContinuousResponseExport(
      record(),
      gratitudeGesture(),
      responseConsent,
      '1.0.0',
      generatedAt
    );
    if (!generated.ok) throw new Error(generated.errors.join(' '));
    const result = parseContinuousResponseReturnWithConsistency(attachContinuousConsistency({
      ...generated.export,
      source: { ...generated.export.source, fingerprint: 'received-XYZ' },
      notices: [...generated.export.notices, 'Aviso inventado.']
    }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/Impressão recusada/i);
    expect(result.errors.join(' ')).not.toMatch(/Aviso recusado/i);
  });
});
