import { describe, expect, it } from 'vitest';
import type { ContinuousCollection } from './continuousCollection';
import type { ContinuousMapItem } from './continuousMap';
import {
  archiveReceivedCollection,
  createContinuousReceivedRegistry,
  findReceivedByFingerprint,
  fingerprintContinuousSharePackage,
  keepReceivedCollection,
  parseContinuousCollectionShare,
  reactivateReceivedCollection,
  removeReceivedCollection
} from './continuousReceive';
import {
  createContinuousCollectionShareExport,
  type ContinuousCollectionShareExport,
  type ContinuousShareConsent
} from './continuousShare';

const createdAt = '2026-07-27T16:00:00.000Z';
const generatedAt = '2026-07-27T17:00:00.000Z';
const receivedAt = '2026-07-27T18:00:00.000Z';

function mapItem(overrides: Partial<ContinuousMapItem> = {}): ContinuousMapItem {
  return {
    id: 'private-trail-id',
    kind: 'trail',
    sourceTrailId: 'private-source-trail',
    sourceCycleInstanceId: 'private-source-cycle',
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
    completedAt: generatedAt,
    linked: true,
    ...overrides
  };
}

function collection(items: ContinuousMapItem[] = [mapItem()]): ContinuousCollection {
  return {
    id: 'private-collection-id',
    templateId: 'collection-water',
    label: 'Água, memória e apoio',
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

const consent: ContinuousShareConsent = {
  collection: true,
  preview: true,
  localFile: true,
  recipient: true,
  noPersonalNotes: true
};

function sharedPackage(includeDates = false, items: ContinuousMapItem[] = [mapItem()]): ContinuousCollectionShareExport {
  const result = createContinuousCollectionShareExport(collection(items), consent, { includeDates }, '1.0.0', generatedAt);
  if (!result.ok) throw new Error(result.errors.join(' '));
  return result.export;
}

function registry() {
  return createContinuousReceivedRegistry('1.0.0', createdAt);
}

describe('recepção de coleções sem apropriação', () => {
  it('aceita e sanitiza um pacote oficial', () => {
    const input = { ...sharedPackage(), unknownField: 'remover', collection: { ...sharedPackage().collection, secret: 'remover' } };
    const result = parseContinuousCollectionShare(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.package.collection.label).toBe('Água, memória e apoio');
    expect(JSON.stringify(result.package)).not.toContain('unknownField');
    expect(JSON.stringify(result.package)).not.toContain('secret');
  });

  it('rejeita schema, política, autoria ou transmissão incompatíveis', () => {
    const base = sharedPackage();
    const result = parseContinuousCollectionShare({
      ...base,
      schema: 'unknown-schema',
      policy: 'ranking-policy',
      provenance: { product: 'Outro produto', author: 'Outra autoria', transmission: 'automatic-upload' }
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/schema/i);
    expect(result.errors.join(' ')).toMatch(/política/i);
    expect(result.errors.join(' ')).toMatch(/produto/i);
    expect(result.errors.join(' ')).toMatch(/autoria/i);
    expect(result.errors.join(' ')).toMatch(/transmissão/i);
  });

  it('rejeita quantidade incompatível e posições não sequenciais', () => {
    const base = sharedPackage();
    const result = parseContinuousCollectionShare({
      ...base,
      collection: { ...base.collection, itemCount: 2 },
      items: base.items.map((item) => ({ ...item, position: 3 }))
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/quantidade declarada/i);
    expect(result.errors.join(' ')).toMatch(/posições sequenciais/i);
  });

  it('rejeita datas quando o pacote declara omissão', () => {
    const base = sharedPackage(false);
    const result = parseContinuousCollectionShare({
      ...base,
      items: base.items.map((item) => ({ ...item, occurredAt: createdAt }))
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/declara datas omitidas/i);
  });

  it('preserva datas somente quando a origem as incluiu', () => {
    const result = parseContinuousCollectionShare(sharedPackage(true));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.package.items[0].occurredAt).toBe(createdAt);
    expect(result.warnings.join(' ')).toMatch(/inclui datas/i);
  });

  it('gera a mesma impressão para o mesmo conteúdo exportado em outro momento', () => {
    const first = sharedPackage();
    const second = { ...first, generatedAt: receivedAt };
    expect(fingerprintContinuousSharePackage(first)).toBe(fingerprintContinuousSharePackage(second));
  });

  it('guarda o pacote em registro separado sem criar progressão', () => {
    const parsed = parseContinuousCollectionShare(sharedPackage());
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const stored = keepReceivedCollection(registry(), { id: 'received-1', package: parsed.package }, receivedAt);
    expect(stored.records).toHaveLength(1);
    expect(stored.records[0].package).not.toBe(parsed.package);
    expect(JSON.stringify(stored.records[0])).not.toMatch(/journeyId|trailId|cycleId|progress|reward|score|rank/i);
  });

  it('ignora uma cópia duplicada pela impressão descritiva', () => {
    const parsed = parseContinuousCollectionShare(sharedPackage());
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const once = keepReceivedCollection(registry(), { id: 'received-1', package: parsed.package }, receivedAt);
    const twice = keepReceivedCollection(once, { id: 'received-2', package: { ...parsed.package, generatedAt: '2026-07-28T00:00:00.000Z' } }, receivedAt);
    expect(twice.records).toHaveLength(1);
    expect(findReceivedByFingerprint(twice, parsed.fingerprint)?.id).toBe('received-1');
  });

  it('arquiva e reativa sem alterar o pacote recebido', () => {
    const parsed = parseContinuousCollectionShare(sharedPackage());
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const kept = keepReceivedCollection(registry(), { id: 'received-1', package: parsed.package }, receivedAt);
    const archived = archiveReceivedCollection(kept, 'received-1', generatedAt);
    const reactivated = reactivateReceivedCollection(archived, 'received-1', receivedAt);
    expect(archived.records[0].status).toBe('archived');
    expect(reactivated.records[0].status).toBe('active');
    expect(reactivated.records[0].package.items).toEqual(parsed.package.items);
  });

  it('remove somente a cópia local recebida', () => {
    const source = sharedPackage();
    const parsed = parseContinuousCollectionShare(source);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const kept = keepReceivedCollection(registry(), { id: 'received-1', package: parsed.package }, receivedAt);
    const removed = removeReceivedCollection(kept, 'received-1', generatedAt);
    expect(removed.records).toEqual([]);
    expect(source.collection.label).toBe('Água, memória e apoio');
  });

  it('aceita coleção vazia e preserva desconhecido sem interpretação', () => {
    const empty = parseContinuousCollectionShare(sharedPackage(false, []));
    expect(empty.ok).toBe(true);
    if (empty.ok) expect(empty.warnings.join(' ')).toMatch(/vazia/i);

    const unknown = parseContinuousCollectionShare(sharedPackage(false, [mapItem({ status: 'unknown', linked: false })]));
    expect(unknown.ok).toBe(true);
    if (unknown.ok) expect(unknown.warnings.join(' ')).toMatch(/desconhecidos/i);
  });
});
