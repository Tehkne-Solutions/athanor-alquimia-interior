import { describe, expect, it } from 'vitest';
import type { ContinuousCollection } from './continuousCollection';
import type { ContinuousMapItem } from './continuousMap';
import {
  buildContinuousSharePreview,
  createContinuousCollectionShareExport,
  emptyContinuousShareConsent,
  hasExplicitContinuousShareConsent,
  type ContinuousShareConsent
} from './continuousShare';

const createdAt = '2026-07-27T14:00:00.000Z';
const generatedAt = '2026-07-27T15:00:00.000Z';

function mapItem(overrides: Partial<ContinuousMapItem> = {}): ContinuousMapItem {
  return {
    id: 'trail-private-id',
    kind: 'trail',
    sourceTrailId: 'source-trail-private-id',
    sourceCycleInstanceId: 'source-cycle-private-id',
    startPoint: 'spirit',
    themeId: 'theme-trust',
    noTheme: false,
    variantId: 'spirit-v1',
    packageId: 'package-spirit',
    packageLabel: 'Espírito e síntese possível',
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
    id: 'collection-private-id',
    templateId: 'collection-spirit',
    label: 'Espírito e síntese possível',
    status: 'active',
    items: items.map((item, index) => ({
      key: `${item.kind}:${item.id}`,
      item,
      source: index === 0 ? 'local-map' : 'imported-map',
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

describe('partilha consentida de coleções', () => {
  it('exige as cinco confirmações explícitas', () => {
    expect(hasExplicitContinuousShareConsent(emptyContinuousShareConsent())).toBe(false);
    expect(hasExplicitContinuousShareConsent(consent)).toBe(true);
  });

  it('recusa exportação quando uma confirmação estiver ausente', () => {
    const result = createContinuousCollectionShareExport(
      collection(),
      { ...consent, preview: false },
      { includeDates: false },
      '1.0.0',
      generatedAt
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.join(' ')).toMatch(/confirmações explícitas/i);
  });

  it('omite identificadores internos e origem do store', () => {
    const result = createContinuousCollectionShareExport(collection(), consent, { includeDates: false }, '1.0.0', generatedAt);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const serialized = JSON.stringify(result.export);
    expect(serialized).not.toContain('collection-private-id');
    expect(serialized).not.toContain('trail-private-id');
    expect(serialized).not.toContain('source-trail-private-id');
    expect(serialized).not.toContain('source-cycle-private-id');
    expect(serialized).not.toMatch(/local-map|imported-map/);
  });

  it('omite datas por padrão', () => {
    const preview = buildContinuousSharePreview(collection(), { includeDates: false });
    expect(preview.items[0].occurredAt).toBeUndefined();
    expect(preview.items[0].completedAt).toBeUndefined();
    expect(preview.notices.join(' ')).toMatch(/datas foram omitidas/i);
  });

  it('inclui datas somente quando solicitado', () => {
    const preview = buildContinuousSharePreview(collection(), { includeDates: true });
    expect(preview.items[0].occurredAt).toBe(createdAt);
    expect(preview.items[0].completedAt).toBe(generatedAt);
  });

  it('preserva ordem sem criar ranking ou pontuação', () => {
    const preview = buildContinuousSharePreview(collection([
      mapItem(),
      mapItem({ id: 'cycle-2', kind: 'theme-cycle', variantId: 'spirit-v2' })
    ]), { includeDates: false });
    expect(preview.items.map((item) => item.position)).toEqual([1, 2]);
    expect(JSON.stringify(preview)).not.toMatch(/score|rank|reward|streak|importance/i);
  });

  it('permite exportar coleção vazia', () => {
    const result = createContinuousCollectionShareExport(collection([]), consent, { includeDates: false }, '1.0.0', generatedAt);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.export.items).toEqual([]);
    expect(result.export.notices.join(' ')).toMatch(/coleção está vazia/i);
  });

  it('preserva desconhecido sem interpretação', () => {
    const preview = buildContinuousSharePreview(collection([mapItem({ linked: false, status: 'unknown' })]), { includeDates: false });
    expect(preview.items[0].status).toBe('unknown');
    expect(preview.notices.join(' ')).toMatch(/não vinculados/i);
  });

  it('declara schema, política, transmissão manual e autoria', () => {
    const result = createContinuousCollectionShareExport(collection(), consent, { includeDates: false }, '1.0.0', generatedAt);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.export.schema).toBe('athanor-continuous-collection-share-v1');
    expect(result.export.policy).toBe('explicit-consent-minimized-local-export-v1');
    expect(result.export.provenance.transmission).toBe('manual-local-file');
    expect(result.export.provenance.author).toBe('Tehkné Solutions');
  });

  it('não inclui campos para notas, destinatário ou envio', () => {
    const result = createContinuousCollectionShareExport(collection(), consent, { includeDates: false }, '1.0.0', generatedAt);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(JSON.stringify(result.export)).not.toMatch(/note|emotion|diagnosis|recipient|contact|email|phone|sentAt/i);
  });
});
