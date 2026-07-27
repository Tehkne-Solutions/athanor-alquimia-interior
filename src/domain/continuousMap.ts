import type { NewWorkStartPoint } from './continuousJourney';
import type { ContinuousThemeCycleInstance } from './continuousThemeCycle';
import type { ContinuousTrailInstance } from './continuousTrail';

export type ContinuousMapItemKind = 'trail' | 'theme-cycle';
export type ContinuousMapStatus = 'active' | 'paused' | 'completed' | 'declined' | 'incomplete' | 'unknown';
export type ContinuousMapGroupKey = 'element' | 'theme' | 'package';

export interface ContinuousMapPassageSummary {
  completed: number;
  passed: number;
  pending: number;
}

export interface ContinuousMapItem {
  id: string;
  kind: ContinuousMapItemKind;
  sourceTrailId: string;
  sourceCycleInstanceId: string;
  startPoint: NewWorkStartPoint;
  themeId?: string;
  noTheme: boolean;
  variantId: string;
  packageId?: string;
  packageLabel?: string;
  catalogVersion?: string;
  status: ContinuousMapStatus;
  rawStatus: string;
  depth?: number;
  endedEarly: boolean;
  passageSummary: ContinuousMapPassageSummary;
  occurredAt: string;
  completedAt?: string;
  linked: boolean;
}

export interface ContinuousMapFilters {
  kind: ContinuousMapItemKind | 'all';
  startPoint: NewWorkStartPoint | 'all';
  themeId: string | 'all';
  packageId: string | 'all';
  status: ContinuousMapStatus | 'all';
  query: string;
}

export interface ContinuousMapGroup {
  id: string;
  items: ContinuousMapItem[];
}

export interface ContinuousMapComparisonRow {
  dimension: 'kind' | 'element' | 'theme' | 'package' | 'variant' | 'status' | 'depth';
  left: string;
  right: string;
  relation: 'same' | 'different' | 'unknown';
}

export interface ContinuousMapExport {
  schema: 'athanor-continuous-map-export-v1';
  generatedAt: string;
  policy: 'descriptive-local-no-ranking-v1';
  filters: ContinuousMapFilters;
  totals: {
    items: number;
    trails: number;
    themeCycles: number;
    linked: number;
    unlinked: number;
  };
  items: ContinuousMapItem[];
}

export const defaultContinuousMapFilters: ContinuousMapFilters = {
  kind: 'all',
  startPoint: 'all',
  themeId: 'all',
  packageId: 'all',
  status: 'all',
  query: ''
};

function summarizeCyclePassages(instance: ContinuousThemeCycleInstance): ContinuousMapPassageSummary {
  return instance.passages.reduce((summary, passage) => {
    if (passage.result === 'completed') summary.completed += 1;
    else if (passage.result === 'passed') summary.passed += 1;
    else summary.pending += 1;
    return summary;
  }, { completed: 0, passed: 0, pending: 0 });
}

function resolveTrailStatus(trail: ContinuousTrailInstance): ContinuousMapStatus {
  if (trail.status === 'active') return 'active';
  if (trail.status === 'paused') return 'paused';
  if (trail.status === 'completed') return trail.continuousTrailTraceCreated ? 'completed' : 'incomplete';
  return 'unknown';
}

function resolveCycleStatus(instance: ContinuousThemeCycleInstance): ContinuousMapStatus {
  if (instance.status === 'active') return 'active';
  if (instance.status === 'paused') return 'paused';
  if (instance.status === 'declined') return 'declined';
  if (instance.status === 'completed') {
    const summary = summarizeCyclePassages(instance);
    return instance.endedEarly || summary.pending > 0 ? 'incomplete' : 'completed';
  }
  return 'unknown';
}

function mapTrail(trail: ContinuousTrailInstance): ContinuousMapItem {
  return {
    id: trail.id,
    kind: 'trail',
    sourceTrailId: trail.id,
    sourceCycleInstanceId: trail.sourceCycleInstanceId,
    startPoint: trail.startPoint,
    themeId: trail.themeId,
    noTheme: Boolean(trail.noTheme),
    variantId: trail.contentVariantId,
    catalogVersion: trail.catalogVersion,
    status: resolveTrailStatus(trail),
    rawStatus: trail.status,
    endedEarly: false,
    passageSummary: {
      completed: Object.values(trail.stages).filter((stage) => stage.result === 'completed').length,
      passed: Object.values(trail.stages).filter((stage) => stage.result === 'passed').length,
      pending: Object.values(trail.stages).filter((stage) => stage.result === 'pending' || stage.result === 'paused').length
    },
    occurredAt: trail.startedAt,
    completedAt: trail.completedAt,
    linked: true
  };
}

function mapCycle(instance: ContinuousThemeCycleInstance, linked: boolean): ContinuousMapItem {
  return {
    id: instance.id,
    kind: 'theme-cycle',
    sourceTrailId: instance.sourceTrailId,
    sourceCycleInstanceId: instance.sourceCycleInstanceId,
    startPoint: instance.startPoint,
    themeId: instance.sourceThemeId,
    noTheme: instance.sourceNoTheme,
    variantId: instance.sourceVariantId,
    packageId: instance.packageId,
    packageLabel: instance.packageLabel,
    catalogVersion: instance.catalogVersion,
    status: linked ? resolveCycleStatus(instance) : 'unknown',
    rawStatus: instance.status,
    depth: instance.depth,
    endedEarly: instance.endedEarly,
    passageSummary: summarizeCyclePassages(instance),
    occurredAt: instance.createdAt,
    completedAt: instance.completedAt ?? instance.declinedAt,
    linked
  };
}

export function buildContinuousMapItems(
  trails: ContinuousTrailInstance[],
  themeCycles: ContinuousThemeCycleInstance[]
): ContinuousMapItem[] {
  const trailIds = new Set(trails.map((trail) => trail.id));
  return [
    ...trails.map(mapTrail),
    ...themeCycles.map((cycle) => mapCycle(cycle, trailIds.has(cycle.sourceTrailId)))
  ].sort((left, right) => left.occurredAt.localeCompare(right.occurredAt));
}

function themeKey(item: ContinuousMapItem): string {
  if (item.themeId) return item.themeId;
  if (item.noTheme) return 'no-theme';
  return 'unknown-theme';
}

function packageKey(item: ContinuousMapItem): string {
  if (item.packageId) return item.packageId;
  return item.kind === 'trail' ? 'trail-without-package' : 'unknown-package';
}

export function filterContinuousMapItems(
  items: ContinuousMapItem[],
  filters: ContinuousMapFilters
): ContinuousMapItem[] {
  const query = filters.query.trim().toLocaleLowerCase('pt-BR');
  return items.filter((item) => {
    if (filters.kind !== 'all' && item.kind !== filters.kind) return false;
    if (filters.startPoint !== 'all' && item.startPoint !== filters.startPoint) return false;
    if (filters.themeId !== 'all' && themeKey(item) !== filters.themeId) return false;
    if (filters.packageId !== 'all' && packageKey(item) !== filters.packageId) return false;
    if (filters.status !== 'all' && item.status !== filters.status) return false;
    if (!query) return true;
    const searchable = [
      item.id,
      item.sourceTrailId,
      item.sourceCycleInstanceId,
      item.startPoint,
      themeKey(item),
      item.variantId,
      item.packageId,
      item.packageLabel,
      item.status,
      item.rawStatus
    ].filter(Boolean).join(' ').toLocaleLowerCase('pt-BR');
    return searchable.includes(query);
  });
}

export function groupContinuousMapItems(
  items: ContinuousMapItem[],
  groupKey: ContinuousMapGroupKey
): ContinuousMapGroup[] {
  const groups = new Map<string, ContinuousMapItem[]>();
  for (const item of items) {
    const key = groupKey === 'element'
      ? item.startPoint
      : groupKey === 'theme'
        ? themeKey(item)
        : packageKey(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return Array.from(groups.entries())
    .map(([id, groupedItems]) => ({
      id,
      items: groupedItems.sort((left, right) => left.occurredAt.localeCompare(right.occurredAt))
    }))
    .sort((left, right) => left.id.localeCompare(right.id));
}

function comparisonValue(value: string | number | undefined): string {
  if (typeof value === 'number') return String(value);
  return value || 'desconhecido';
}

function compareValue(left: string, right: string): 'same' | 'different' | 'unknown' {
  if (left === 'desconhecido' || right === 'desconhecido') return 'unknown';
  return left === right ? 'same' : 'different';
}

export function compareContinuousMapItems(
  left: ContinuousMapItem,
  right: ContinuousMapItem
): ContinuousMapComparisonRow[] {
  const rows: Array<[ContinuousMapComparisonRow['dimension'], string, string]> = [
    ['kind', left.kind, right.kind],
    ['element', left.startPoint, right.startPoint],
    ['theme', comparisonValue(left.themeId ?? (left.noTheme ? 'no-theme' : undefined)), comparisonValue(right.themeId ?? (right.noTheme ? 'no-theme' : undefined))],
    ['package', comparisonValue(left.packageId), comparisonValue(right.packageId)],
    ['variant', comparisonValue(left.variantId), comparisonValue(right.variantId)],
    ['status', left.status, right.status],
    ['depth', comparisonValue(left.depth), comparisonValue(right.depth)]
  ];
  return rows.map(([dimension, leftValue, rightValue]) => ({
    dimension,
    left: leftValue,
    right: rightValue,
    relation: compareValue(leftValue, rightValue)
  }));
}

export function createContinuousMapExport(
  items: ContinuousMapItem[],
  filters: ContinuousMapFilters,
  generatedAt: string
): ContinuousMapExport {
  return {
    schema: 'athanor-continuous-map-export-v1',
    generatedAt,
    policy: 'descriptive-local-no-ranking-v1',
    filters: { ...filters },
    totals: {
      items: items.length,
      trails: items.filter((item) => item.kind === 'trail').length,
      themeCycles: items.filter((item) => item.kind === 'theme-cycle').length,
      linked: items.filter((item) => item.linked).length,
      unlinked: items.filter((item) => !item.linked).length
    },
    items: items.map((item) => ({
      ...item,
      passageSummary: { ...item.passageSummary }
    }))
  };
}
