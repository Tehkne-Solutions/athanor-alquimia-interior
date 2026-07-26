import type { NewWorkMode, NewWorkRecord, NewWorkStartPoint } from './continuousJourney';

export type ContinuousCycleStatus = 'active' | 'paused' | 'closed' | 'archived';
export type ContinuousCycleComparison =
  | 'not_compared'
  | 'similar_context'
  | 'changed_context'
  | 'changed_resources'
  | 'changed_focus'
  | 'unknown';

export interface ContinuousCycleInstance {
  id: string;
  sourceRecordId: string;
  sourceSpiritCycleId: string;
  startPoint: NewWorkStartPoint;
  sourceMode: NewWorkMode;
  status: ContinuousCycleStatus;
  comparison: ContinuousCycleComparison;
  contentSeed: string;
  activatedAt: string;
  updatedAt: string;
  pausedAt?: string;
  resumedAt?: string;
  closedAt?: string;
  archivedAt?: string;
}

export interface ContinuousCycleProgress {
  id: 'continuous_cycle_registry_v1';
  instances: ContinuousCycleInstance[];
  createdAt: string;
  updatedAt: string;
}

export interface ContinuousCycleSummary {
  active: number;
  paused: number;
  closed: number;
  archived: number;
}

export function createContinuousCycleProgress(createdAt: string): ContinuousCycleProgress {
  return {
    id: 'continuous_cycle_registry_v1',
    instances: [],
    createdAt,
    updatedAt: createdAt
  };
}

export function hasOpenInstanceForRecord(progress: ContinuousCycleProgress, sourceRecordId: string): boolean {
  return progress.instances.some((instance) =>
    instance.sourceRecordId === sourceRecordId && ['active', 'paused'].includes(instance.status));
}

export function activateContinuousCycle(
  progress: ContinuousCycleProgress,
  record: NewWorkRecord,
  instanceId: string,
  activatedAt: string
): ContinuousCycleProgress {
  if (hasOpenInstanceForRecord(progress, record.id)) return progress;
  const startsPaused = record.startPoint === 'rest' || record.mode === 'rest_without_start';
  const instance: ContinuousCycleInstance = {
    id: instanceId,
    sourceRecordId: record.id,
    sourceSpiritCycleId: record.sourceSpiritCycleId,
    startPoint: record.startPoint,
    sourceMode: record.mode,
    status: startsPaused ? 'paused' : 'active',
    comparison: 'not_compared',
    contentSeed: `continuous:${record.sourceSpiritCycleId}:${record.id}:${record.startPoint}:${record.mode}`,
    activatedAt,
    updatedAt: activatedAt,
    pausedAt: startsPaused ? activatedAt : undefined
  };
  return { ...progress, instances: [...progress.instances, instance], updatedAt: activatedAt };
}

function updateInstance(
  progress: ContinuousCycleProgress,
  instanceId: string,
  updater: (instance: ContinuousCycleInstance) => ContinuousCycleInstance,
  updatedAt: string
): ContinuousCycleProgress {
  const current = progress.instances.find((instance) => instance.id === instanceId);
  if (!current) return progress;
  return {
    ...progress,
    instances: progress.instances.map((instance) => instance.id === instanceId ? updater(instance) : instance),
    updatedAt
  };
}

export function setContinuousCycleComparison(
  progress: ContinuousCycleProgress,
  instanceId: string,
  comparison: ContinuousCycleComparison,
  updatedAt: string
): ContinuousCycleProgress {
  return updateInstance(progress, instanceId, (instance) => ({ ...instance, comparison, updatedAt }), updatedAt);
}

export function pauseContinuousCycle(
  progress: ContinuousCycleProgress,
  instanceId: string,
  updatedAt: string
): ContinuousCycleProgress {
  return updateInstance(progress, instanceId, (instance) => instance.status === 'active'
    ? { ...instance, status: 'paused', pausedAt: updatedAt, updatedAt }
    : instance, updatedAt);
}

export function resumeContinuousCycle(
  progress: ContinuousCycleProgress,
  instanceId: string,
  updatedAt: string
): ContinuousCycleProgress {
  return updateInstance(progress, instanceId, (instance) =>
    instance.status === 'paused' && instance.startPoint !== 'rest'
      ? { ...instance, status: 'active', resumedAt: updatedAt, updatedAt }
      : instance, updatedAt);
}

export function closeContinuousCycle(
  progress: ContinuousCycleProgress,
  instanceId: string,
  updatedAt: string
): ContinuousCycleProgress {
  return updateInstance(progress, instanceId, (instance) => ['active', 'paused'].includes(instance.status)
    ? { ...instance, status: 'closed', closedAt: updatedAt, updatedAt }
    : instance, updatedAt);
}

export function archiveContinuousCycle(
  progress: ContinuousCycleProgress,
  instanceId: string,
  updatedAt: string
): ContinuousCycleProgress {
  return updateInstance(progress, instanceId, (instance) => instance.status !== 'archived'
    ? { ...instance, status: 'archived', archivedAt: updatedAt, updatedAt }
    : instance, updatedAt);
}

export function summarizeContinuousCycles(progress: ContinuousCycleProgress): ContinuousCycleSummary {
  return progress.instances.reduce<ContinuousCycleSummary>((summary, instance) => {
    summary[instance.status] += 1;
    return summary;
  }, { active: 0, paused: 0, closed: 0, archived: 0 });
}
