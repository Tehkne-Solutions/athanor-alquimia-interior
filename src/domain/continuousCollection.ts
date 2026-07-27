import type { NewWorkStartPoint } from './continuousJourney';
import type {
  ContinuousMapExport,
  ContinuousMapItem,
  ContinuousMapItemKind,
  ContinuousMapStatus
} from './continuousMap';

export type ContinuousCollectionStatus = 'active' | 'archived';
export type ContinuousCollectionItemSource = 'local-map' | 'imported-map';

export interface ContinuousCollectionItemReference {
  key: string;
  item: ContinuousMapItem;
  source: ContinuousCollectionItemSource;
  addedAt: string;
}

export interface ContinuousCollection {
  id: string;
  templateId: string;
  label: string;
  status: ContinuousCollectionStatus;
  items: ContinuousCollectionItemReference[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface ContinuousCollectionRegistry {
  id: 'continuous_collection_registry_v1';
  catalogVersion: string;
  collections: ContinuousCollection[];
  createdAt: string;
  updatedAt: string;
}

export interface ContinuousMapImportSuccess {
  ok: true;
  export: ContinuousMapExport;
  warnings: string[];
}

export interface ContinuousMapImportFailure {
  ok: false;
  errors: string[];
}

export type ContinuousMapImportResult = ContinuousMapImportSuccess | ContinuousMapImportFailure;

const startPoints: NewWorkStartPoint[] = ['word', 'water', 'fire', 'earth', 'spirit', 'rest'];
const itemKinds: ContinuousMapItemKind[] = ['trail', 'theme-cycle'];
const statuses: ContinuousMapStatus[] = ['active', 'paused', 'completed', 'declined', 'incomplete', 'unknown'];

export function createContinuousCollectionRegistry(
  catalogVersion: string,
  createdAt: string
): ContinuousCollectionRegistry {
  return {
    id: 'continuous_collection_registry_v1',
    catalogVersion,
    collections: [],
    createdAt,
    updatedAt: createdAt
  };
}

export function collectionItemKey(item: Pick<ContinuousMapItem, 'kind' | 'id'>): string {
  return `${item.kind}:${item.id}`;
}

export function createContinuousCollection(
  registry: ContinuousCollectionRegistry,
  input: { id: string; templateId: string; label: string },
  createdAt: string
): ContinuousCollectionRegistry {
  if (!input.id || !input.templateId || !input.label.trim()) return registry;
  if (registry.collections.some((collection) => collection.id === input.id)) return registry;
  const collection: ContinuousCollection = {
    id: input.id,
    templateId: input.templateId,
    label: input.label.trim(),
    status: 'active',
    items: [],
    createdAt,
    updatedAt: createdAt
  };
  return {
    ...registry,
    collections: [...registry.collections, collection],
    updatedAt: createdAt
  };
}

export function findContinuousCollection(
  registry: ContinuousCollectionRegistry,
  collectionId: string
): ContinuousCollection | undefined {
  return registry.collections.find((collection) => collection.id === collectionId);
}

function updateCollection(
  registry: ContinuousCollectionRegistry,
  collectionId: string,
  updatedAt: string,
  updater: (collection: ContinuousCollection) => ContinuousCollection
): ContinuousCollectionRegistry {
  const current = findContinuousCollection(registry, collectionId);
  if (!current) return registry;
  return {
    ...registry,
    collections: registry.collections.map((collection) => collection.id === collectionId ? updater(collection) : collection),
    updatedAt
  };
}

export function addContinuousCollectionItem(
  registry: ContinuousCollectionRegistry,
  collectionId: string,
  item: ContinuousMapItem,
  source: ContinuousCollectionItemSource,
  addedAt: string
): ContinuousCollectionRegistry {
  return updateCollection(registry, collectionId, addedAt, (collection) => {
    if (collection.status !== 'active') return collection;
    const key = collectionItemKey(item);
    if (collection.items.some((reference) => reference.key === key)) return collection;
    return {
      ...collection,
      items: [...collection.items, {
        key,
        item: cloneMapItem(item),
        source,
        addedAt
      }],
      updatedAt: addedAt
    };
  });
}

export function addManyContinuousCollectionItems(
  registry: ContinuousCollectionRegistry,
  collectionId: string,
  items: ContinuousMapItem[],
  source: ContinuousCollectionItemSource,
  addedAt: string
): ContinuousCollectionRegistry {
  return items.reduce(
    (current, item) => addContinuousCollectionItem(current, collectionId, item, source, addedAt),
    registry
  );
}

export function removeContinuousCollectionItem(
  registry: ContinuousCollectionRegistry,
  collectionId: string,
  itemKey: string,
  updatedAt: string
): ContinuousCollectionRegistry {
  return updateCollection(registry, collectionId, updatedAt, (collection) => {
    if (collection.status !== 'active') return collection;
    if (!collection.items.some((reference) => reference.key === itemKey)) return collection;
    return {
      ...collection,
      items: collection.items.filter((reference) => reference.key !== itemKey),
      updatedAt
    };
  });
}

export function moveContinuousCollectionItem(
  registry: ContinuousCollectionRegistry,
  collectionId: string,
  itemKey: string,
  direction: -1 | 1,
  updatedAt: string
): ContinuousCollectionRegistry {
  return updateCollection(registry, collectionId, updatedAt, (collection) => {
    if (collection.status !== 'active') return collection;
    const index = collection.items.findIndex((reference) => reference.key === itemKey);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= collection.items.length) return collection;
    const items = [...collection.items];
    [items[index], items[target]] = [items[target], items[index]];
    return { ...collection, items, updatedAt };
  });
}

export function archiveContinuousCollection(
  registry: ContinuousCollectionRegistry,
  collectionId: string,
  archivedAt: string
): ContinuousCollectionRegistry {
  return updateCollection(registry, collectionId, archivedAt, (collection) => collection.status === 'archived'
    ? collection
    : { ...collection, status: 'archived', archivedAt, updatedAt: archivedAt });
}

export function reactivateContinuousCollection(
  registry: ContinuousCollectionRegistry,
  collectionId: string,
  updatedAt: string
): ContinuousCollectionRegistry {
  return updateCollection(registry, collectionId, updatedAt, (collection) => collection.status === 'active'
    ? collection
    : { ...collection, status: 'active', archivedAt: undefined, updatedAt });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function parseMapItem(value: unknown, index: number): { item?: ContinuousMapItem; errors: string[] } {
  if (!isRecord(value)) return { errors: [`Item ${index + 1}: formato inválido.`] };
  const errors: string[] = [];
  if (!isString(value.id)) errors.push(`Item ${index + 1}: id inválido.`);
  if (!itemKinds.includes(value.kind as ContinuousMapItemKind)) errors.push(`Item ${index + 1}: tipo inválido.`);
  if (!isString(value.sourceTrailId)) errors.push(`Item ${index + 1}: origem do Rastro inválida.`);
  if (!isString(value.sourceCycleInstanceId)) errors.push(`Item ${index + 1}: instância de origem inválida.`);
  if (!startPoints.includes(value.startPoint as NewWorkStartPoint)) errors.push(`Item ${index + 1}: elemento inválido.`);
  if (!isOptionalString(value.themeId)) errors.push(`Item ${index + 1}: tema inválido.`);
  if (typeof value.noTheme !== 'boolean') errors.push(`Item ${index + 1}: ausência de tema inválida.`);
  if (!isString(value.variantId)) errors.push(`Item ${index + 1}: variante inválida.`);
  if (!isOptionalString(value.packageId) || !isOptionalString(value.packageLabel) || !isOptionalString(value.catalogVersion)) {
    errors.push(`Item ${index + 1}: metadados de pacote inválidos.`);
  }
  if (!statuses.includes(value.status as ContinuousMapStatus)) errors.push(`Item ${index + 1}: estado inválido.`);
  if (!isString(value.rawStatus)) errors.push(`Item ${index + 1}: estado original inválido.`);
  if (value.depth !== undefined && !isNumber(value.depth)) errors.push(`Item ${index + 1}: profundidade inválida.`);
  if (typeof value.endedEarly !== 'boolean') errors.push(`Item ${index + 1}: encerramento inválido.`);
  if (!isRecord(value.passageSummary)
    || !isNumber(value.passageSummary.completed)
    || !isNumber(value.passageSummary.passed)
    || !isNumber(value.passageSummary.pending)) {
    errors.push(`Item ${index + 1}: resumo de passagens inválido.`);
  }
  if (!isString(value.occurredAt) || !isOptionalString(value.completedAt)) errors.push(`Item ${index + 1}: datas inválidas.`);
  if (typeof value.linked !== 'boolean') errors.push(`Item ${index + 1}: vínculo inválido.`);
  if (errors.length > 0) return { errors };

  return {
    errors: [],
    item: {
      id: value.id as string,
      kind: value.kind as ContinuousMapItemKind,
      sourceTrailId: value.sourceTrailId as string,
      sourceCycleInstanceId: value.sourceCycleInstanceId as string,
      startPoint: value.startPoint as NewWorkStartPoint,
      themeId: value.themeId as string | undefined,
      noTheme: value.noTheme as boolean,
      variantId: value.variantId as string,
      packageId: value.packageId as string | undefined,
      packageLabel: value.packageLabel as string | undefined,
      catalogVersion: value.catalogVersion as string | undefined,
      status: value.status as ContinuousMapStatus,
      rawStatus: value.rawStatus as string,
      depth: value.depth as number | undefined,
      endedEarly: value.endedEarly as boolean,
      passageSummary: {
        completed: (value.passageSummary as Record<string, number>).completed,
        passed: (value.passageSummary as Record<string, number>).passed,
        pending: (value.passageSummary as Record<string, number>).pending
      },
      occurredAt: value.occurredAt as string,
      completedAt: value.completedAt as string | undefined,
      linked: value.linked as boolean
    }
  };
}

export function parseContinuousMapExport(input: unknown): ContinuousMapImportResult {
  if (!isRecord(input)) return { ok: false, errors: ['Arquivo JSON inválido.'] };
  const errors: string[] = [];
  if (input.schema !== 'athanor-continuous-map-export-v1') errors.push('Schema de mapa não reconhecido.');
  if (input.policy !== 'descriptive-local-no-ranking-v1') errors.push('Política de exportação incompatível.');
  if (!isString(input.generatedAt)) errors.push('Data de geração inválida.');
  if (!isRecord(input.filters)) errors.push('Filtros exportados inválidos.');
  if (!isRecord(input.totals)) errors.push('Totais exportados inválidos.');
  if (!Array.isArray(input.items)) errors.push('Lista de itens ausente ou inválida.');
  if (errors.length > 0 || !Array.isArray(input.items)) return { ok: false, errors };

  const parsedItems = input.items.map(parseMapItem);
  const itemErrors = parsedItems.flatMap((result) => result.errors);
  if (itemErrors.length > 0) return { ok: false, errors: itemErrors };
  const items = parsedItems.flatMap((result) => result.item ? [result.item] : []);
  const warnings: string[] = [];
  if (items.some((item) => !item.linked)) warnings.push('O arquivo contém registros não vinculados, preservados como desconhecidos.');
  if (new Set(items.map(collectionItemKey)).size !== items.length) warnings.push('Referências duplicadas serão ignoradas ao adicionar à coleção.');

  return {
    ok: true,
    warnings,
    export: {
      schema: 'athanor-continuous-map-export-v1',
      generatedAt: input.generatedAt as string,
      policy: 'descriptive-local-no-ranking-v1',
      filters: input.filters as ContinuousMapExport['filters'],
      totals: input.totals as ContinuousMapExport['totals'],
      items
    }
  };
}

function cloneMapItem(item: ContinuousMapItem): ContinuousMapItem {
  return {
    ...item,
    passageSummary: { ...item.passageSummary }
  };
}
