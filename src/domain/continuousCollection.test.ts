import { describe, expect, it } from 'vitest';
import type { ContinuousMapExport, ContinuousMapItem } from './continuousMap';
import {
  addContinuousCollectionItem,
  addManyContinuousCollectionItems,
  archiveContinuousCollection,
  collectionItemKey,
  createContinuousCollection,
  createContinuousCollectionRegistry,
  findContinuousCollection,
  moveContinuousCollectionItem,
  parseContinuousMapExport,
  reactivateContinuousCollection,
  removeContinuousCollectionItem
} from './continuousCollection';

const createdAt = '2026-07-27T12:00:00.000Z';
const later = '2026-07-27T13:00:00.000Z';

function item(overrides: Partial<ContinuousMapItem> = {}): ContinuousMapItem {
  return {
    id: 'trail-1',
    kind: 'trail',
    sourceTrailId: 'trail-1',
    sourceCycleInstanceId: 'cycle-1',
    startPoint: 'earth',
    themeId: 'theme-clarity',
    noTheme: false,
    variantId: 'earth-v1',
    catalogVersion: '2.0.0',
    status: 'completed',
    rawStatus: 'completed',
    endedEarly: false,
    passageSummary: { completed: 3, passed: 0, pending: 0 },
    occurredAt: createdAt,
    completedAt: later,
    linked: true,
    ...overrides
  };
}

function mapExport(items: ContinuousMapItem[] = [item()]): ContinuousMapExport {
  return {
    schema: 'athanor-continuous-map-export-v1',
    generatedAt: later,
    policy: 'descriptive-local-no-ranking-v1',
    filters: { kind: 'all', startPoint: 'all', themeId: 'all', packageId: 'all', status: 'all', query: '' },
    totals: { items: items.length, trails: items.filter((entry) => entry.kind === 'trail').length, themeCycles: items.filter((entry) => entry.kind === 'theme-cycle').length, linked: items.filter((entry) => entry.linked).length, unlinked: items.filter((entry) => !entry.linked).length },
    items
  };
}

function registry() {
  return createContinuousCollectionRegistry('1.0.0', createdAt);
}

function withCollection() {
  return createContinuousCollection(registry(), { id: 'collection-1', templateId: 'collection-open', label: 'Coleção aberta' }, createdAt);
}

describe('coleções contínuas', () => {
  it('cria uma coleção vazia como estado válido', () => {
    const progress = withCollection();
    expect(progress.collections).toHaveLength(1);
    expect(progress.collections[0].items).toEqual([]);
    expect(progress.collections[0].status).toBe('active');
  });

  it('adiciona uma referência sem copiar valor ou pontuação', () => {
    const source = item();
    const progress = addContinuousCollectionItem(withCollection(), 'collection-1', source, 'local-map', later);
    const reference = progress.collections[0].items[0];
    expect(reference.key).toBe('trail:trail-1');
    expect(reference.item).toEqual(source);
    expect(reference.item).not.toBe(source);
    expect(JSON.stringify(reference)).not.toMatch(/score|rank|reward|streak/i);
  });

  it('ignora a mesma referência quando adicionada novamente', () => {
    const once = addContinuousCollectionItem(withCollection(), 'collection-1', item(), 'local-map', later);
    const twice = addContinuousCollectionItem(once, 'collection-1', item(), 'imported-map', later);
    expect(twice.collections[0].items).toHaveLength(1);
  });

  it('remove somente a referência e preserva o item de origem', () => {
    const source = item();
    const added = addContinuousCollectionItem(withCollection(), 'collection-1', source, 'local-map', later);
    const removed = removeContinuousCollectionItem(added, 'collection-1', collectionItemKey(source), later);
    expect(removed.collections[0].items).toEqual([]);
    expect(source.id).toBe('trail-1');
    expect(source.status).toBe('completed');
  });

  it('reordena manualmente sem criar prioridade', () => {
    const first = item();
    const second = item({ id: 'cycle-2', kind: 'theme-cycle', sourceTrailId: 'trail-2', variantId: 'earth-v2' });
    const added = addManyContinuousCollectionItems(withCollection(), 'collection-1', [first, second], 'local-map', later);
    const moved = moveContinuousCollectionItem(added, 'collection-1', collectionItemKey(second), -1, later);
    expect(moved.collections[0].items.map((entry) => entry.key)).toEqual(['theme-cycle:cycle-2', 'trail:trail-1']);
    expect(JSON.stringify(moved.collections[0])).not.toMatch(/priority|importance|score/i);
  });

  it('bloqueia alterações enquanto a coleção está arquivada', () => {
    const archived = archiveContinuousCollection(withCollection(), 'collection-1', later);
    const changed = addContinuousCollectionItem(archived, 'collection-1', item(), 'local-map', later);
    expect(changed.collections[0].status).toBe('archived');
    expect(changed.collections[0].items).toEqual([]);
  });

  it('reativa a coleção sem apagar seu conteúdo', () => {
    const added = addContinuousCollectionItem(withCollection(), 'collection-1', item(), 'local-map', later);
    const archived = archiveContinuousCollection(added, 'collection-1', later);
    const reactivated = reactivateContinuousCollection(archived, 'collection-1', later);
    expect(reactivated.collections[0].status).toBe('active');
    expect(reactivated.collections[0].items).toHaveLength(1);
  });

  it('importa um mapa compatível e sanitiza os itens', () => {
    const result = parseContinuousMapExport(mapExport());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.export.items).toHaveLength(1);
    expect(result.export.items[0].id).toBe('trail-1');
  });

  it('rejeita schema ou política incompatíveis', () => {
    const invalid = { ...mapExport(), schema: 'unknown-map', policy: 'ranking-policy' };
    const result = parseContinuousMapExport(invalid);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toContain('Schema de mapa não reconhecido.');
    expect(result.errors).toContain('Política de exportação incompatível.');
  });

  it('preserva registros não vinculados com aviso explícito', () => {
    const result = parseContinuousMapExport(mapExport([item({ linked: false, status: 'unknown' })]));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.export.items[0].linked).toBe(false);
    expect(result.warnings.join(' ')).toMatch(/não vinculados/i);
  });

  it('avisa sobre referências duplicadas do mapa importado', () => {
    const result = parseContinuousMapExport(mapExport([item(), item()]));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.join(' ')).toMatch(/duplicadas/i);
  });

  it('adiciona itens importados sem substituir referências locais existentes', () => {
    const local = addContinuousCollectionItem(withCollection(), 'collection-1', item(), 'local-map', later);
    const importedItem = item({ id: 'cycle-imported', kind: 'theme-cycle', sourceTrailId: 'unknown-trail', linked: false, status: 'unknown' });
    const combined = addManyContinuousCollectionItems(local, 'collection-1', [item(), importedItem], 'imported-map', later);
    const collection = findContinuousCollection(combined, 'collection-1');
    expect(collection?.items).toHaveLength(2);
    expect(collection?.items[0].source).toBe('local-map');
    expect(collection?.items[1].source).toBe('imported-map');
  });
});
