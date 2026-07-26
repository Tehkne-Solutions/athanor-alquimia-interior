import type { ContinuousCycleInstance } from './continuousCycle';
import type { NewWorkStartPoint } from './continuousJourney';

export type ContinuousTrailStage = 'orientation' | 'observation' | 'review';
export type ContinuousTrailStageResult = 'pending' | 'completed' | 'passed' | 'paused';
export type ContinuousTrailStatus = 'active' | 'paused' | 'completed';
export type ContinuousTrailAdvanceResult = 'completed' | 'passed';
export type ContinuousTrailVariantAction = 'initial' | 'kept' | 'rotated';

export interface ContinuousTrailStageProgress {
  stage: ContinuousTrailStage;
  result: ContinuousTrailStageResult;
  completedAt?: string;
}

export interface ContinuousTrailVariantSelection {
  sequence: number;
  variantId: string;
  action: ContinuousTrailVariantAction;
  catalogVersion: string;
  selectedAt: string;
}

export interface ContinuousTrailInstance {
  id: string;
  sourceCycleInstanceId: string;
  sourceRecordId: string;
  sourceSpiritCycleId: string;
  startPoint: NewWorkStartPoint;
  contentSeed: string;
  contentVariantId: string;
  catalogVersion?: string;
  variantRotationCount?: number;
  variantHistory?: ContinuousTrailVariantSelection[];
  status: ContinuousTrailStatus;
  currentStage: ContinuousTrailStage;
  practiceId?: string;
  noPractice: boolean;
  stages: Record<ContinuousTrailStage, ContinuousTrailStageProgress>;
  continuousTrailTraceCreated: boolean;
  startedAt: string;
  updatedAt: string;
  pausedAt?: string;
  resumedAt?: string;
  completedAt?: string;
}

export interface ContinuousTrailProgress {
  id: 'continuous_trail_registry_v1';
  trails: ContinuousTrailInstance[];
  createdAt: string;
  updatedAt: string;
}

const stageOrder: ContinuousTrailStage[] = ['orientation', 'observation', 'review'];
const legacyCatalogVersion = '1.0.0';

export function createContinuousTrailProgress(createdAt: string): ContinuousTrailProgress {
  return {
    id: 'continuous_trail_registry_v1',
    trails: [],
    createdAt,
    updatedAt: createdAt
  };
}

export function deriveContinuousTrailVariantIndex(seed: string, size: number): number {
  if (size <= 0) return 0;
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % size;
}

export function selectNextContinuousTrailVariantId(
  seed: string,
  currentVariantId: string,
  candidateVariantIds: string[],
  requestCount: number,
  catalogVersion: string
): string {
  if (candidateVariantIds.length === 0) return currentVariantId;
  if (candidateVariantIds.length === 1) return candidateVariantIds[0];
  const index = deriveContinuousTrailVariantIndex(
    `${seed}:catalog:${catalogVersion}:request:${requestCount}`,
    candidateVariantIds.length
  );
  const candidate = candidateVariantIds[index];
  if (candidate !== currentVariantId) return candidate;
  return candidateVariantIds[(index + 1) % candidateVariantIds.length];
}

export function getContinuousTrailVariantHistory(trail: ContinuousTrailInstance): ContinuousTrailVariantSelection[] {
  if (trail.variantHistory?.length) return trail.variantHistory;
  return [{
    sequence: 0,
    variantId: trail.contentVariantId,
    action: 'initial',
    catalogVersion: trail.catalogVersion ?? legacyCatalogVersion,
    selectedAt: trail.startedAt
  }];
}

export function findTrailByCycleInstance(
  progress: ContinuousTrailProgress,
  sourceCycleInstanceId: string
): ContinuousTrailInstance | undefined {
  return progress.trails.find((trail) => trail.sourceCycleInstanceId === sourceCycleInstanceId);
}

export function startContinuousTrail(
  progress: ContinuousTrailProgress,
  cycle: ContinuousCycleInstance,
  trailId: string,
  contentVariantId: string,
  startedAt: string,
  catalogVersion = legacyCatalogVersion
): ContinuousTrailProgress {
  if (findTrailByCycleInstance(progress, cycle.id)) return progress;
  if (cycle.status !== 'active') return progress;

  const stages = stageOrder.reduce<Record<ContinuousTrailStage, ContinuousTrailStageProgress>>(
    (result, stage) => {
      result[stage] = { stage, result: 'pending' };
      return result;
    },
    {} as Record<ContinuousTrailStage, ContinuousTrailStageProgress>
  );

  const trail: ContinuousTrailInstance = {
    id: trailId,
    sourceCycleInstanceId: cycle.id,
    sourceRecordId: cycle.sourceRecordId,
    sourceSpiritCycleId: cycle.sourceSpiritCycleId,
    startPoint: cycle.startPoint,
    contentSeed: cycle.contentSeed,
    contentVariantId,
    catalogVersion,
    variantRotationCount: 0,
    variantHistory: [{
      sequence: 0,
      variantId: contentVariantId,
      action: 'initial',
      catalogVersion,
      selectedAt: startedAt
    }],
    status: 'active',
    currentStage: 'orientation',
    noPractice: false,
    stages,
    continuousTrailTraceCreated: false,
    startedAt,
    updatedAt: startedAt
  };

  return {
    ...progress,
    trails: [...progress.trails, trail],
    updatedAt: startedAt
  };
}

function updateTrail(
  progress: ContinuousTrailProgress,
  trailId: string,
  updater: (trail: ContinuousTrailInstance) => ContinuousTrailInstance,
  updatedAt: string
): ContinuousTrailProgress {
  const current = progress.trails.find((trail) => trail.id === trailId);
  if (!current) return progress;
  return {
    ...progress,
    trails: progress.trails.map((trail) => trail.id === trailId ? updater(trail) : trail),
    updatedAt
  };
}

function appendVariantSelection(
  trail: ContinuousTrailInstance,
  variantId: string,
  action: ContinuousTrailVariantAction,
  catalogVersion: string,
  selectedAt: string
): ContinuousTrailVariantSelection[] {
  const history = getContinuousTrailVariantHistory(trail);
  return [...history, {
    sequence: history.length,
    variantId,
    action,
    catalogVersion,
    selectedAt
  }];
}

export function keepContinuousTrailVariant(
  progress: ContinuousTrailProgress,
  trailId: string,
  catalogVersion: string,
  updatedAt: string
): ContinuousTrailProgress {
  return updateTrail(progress, trailId, (trail) => {
    if (trail.status !== 'active') return trail;
    return {
      ...trail,
      catalogVersion,
      variantHistory: appendVariantSelection(trail, trail.contentVariantId, 'kept', catalogVersion, updatedAt),
      updatedAt
    };
  }, updatedAt);
}

export function rotateContinuousTrailVariant(
  progress: ContinuousTrailProgress,
  trailId: string,
  candidateVariantIds: string[],
  catalogVersion: string,
  updatedAt: string
): ContinuousTrailProgress {
  return updateTrail(progress, trailId, (trail) => {
    if (trail.status !== 'active' || candidateVariantIds.length < 2) return trail;
    const requestCount = (trail.variantRotationCount ?? 0) + 1;
    const nextVariantId = selectNextContinuousTrailVariantId(
      trail.contentSeed,
      trail.contentVariantId,
      candidateVariantIds,
      requestCount,
      catalogVersion
    );
    if (nextVariantId === trail.contentVariantId) return trail;
    return {
      ...trail,
      contentVariantId: nextVariantId,
      catalogVersion,
      variantRotationCount: requestCount,
      variantHistory: appendVariantSelection(trail, nextVariantId, 'rotated', catalogVersion, updatedAt),
      updatedAt
    };
  }, updatedAt);
}

export function selectContinuousTrailPractice(
  progress: ContinuousTrailProgress,
  trailId: string,
  practiceId: string,
  updatedAt: string
): ContinuousTrailProgress {
  return updateTrail(progress, trailId, (trail) => trail.status === 'completed'
    ? trail
    : { ...trail, practiceId, noPractice: false, updatedAt }, updatedAt);
}

export function chooseNoContinuousTrailPractice(
  progress: ContinuousTrailProgress,
  trailId: string,
  updatedAt: string
): ContinuousTrailProgress {
  return updateTrail(progress, trailId, (trail) => trail.status === 'completed'
    ? trail
    : { ...trail, practiceId: undefined, noPractice: true, updatedAt }, updatedAt);
}

export function canCompleteContinuousTrailStage(trail: ContinuousTrailInstance): boolean {
  if (trail.status !== 'active') return false;
  if (trail.currentStage === 'orientation') return Boolean(trail.practiceId || trail.noPractice);
  return true;
}

export function advanceContinuousTrail(
  progress: ContinuousTrailProgress,
  trailId: string,
  result: ContinuousTrailAdvanceResult,
  updatedAt: string
): ContinuousTrailProgress {
  return updateTrail(progress, trailId, (trail) => {
    if (trail.status !== 'active') return trail;
    if (result === 'completed' && !canCompleteContinuousTrailStage(trail)) return trail;

    const currentIndex = stageOrder.indexOf(trail.currentStage);
    const stages = {
      ...trail.stages,
      [trail.currentStage]: {
        ...trail.stages[trail.currentStage],
        result,
        completedAt: updatedAt
      }
    };

    if (trail.currentStage === 'review') {
      return {
        ...trail,
        stages,
        status: 'completed',
        continuousTrailTraceCreated: true,
        completedAt: updatedAt,
        updatedAt
      };
    }

    return {
      ...trail,
      stages,
      currentStage: stageOrder[currentIndex + 1],
      updatedAt
    };
  }, updatedAt);
}

export function pauseContinuousTrail(
  progress: ContinuousTrailProgress,
  trailId: string,
  updatedAt: string
): ContinuousTrailProgress {
  return updateTrail(progress, trailId, (trail) => {
    if (trail.status !== 'active') return trail;
    return {
      ...trail,
      status: 'paused',
      stages: {
        ...trail.stages,
        [trail.currentStage]: {
          ...trail.stages[trail.currentStage],
          result: 'paused'
        }
      },
      pausedAt: updatedAt,
      updatedAt
    };
  }, updatedAt);
}

export function resumeContinuousTrail(
  progress: ContinuousTrailProgress,
  trailId: string,
  updatedAt: string
): ContinuousTrailProgress {
  return updateTrail(progress, trailId, (trail) => {
    if (trail.status !== 'paused') return trail;
    return {
      ...trail,
      status: 'active',
      stages: {
        ...trail.stages,
        [trail.currentStage]: {
          ...trail.stages[trail.currentStage],
          result: 'pending'
        }
      },
      resumedAt: updatedAt,
      updatedAt
    };
  }, updatedAt);
}

export function summarizeContinuousTrail(trail: ContinuousTrailInstance): {
  completed: number;
  passed: number;
  pending: number;
} {
  return Object.values(trail.stages).reduce((summary, stage) => {
    if (stage.result === 'completed') summary.completed += 1;
    else if (stage.result === 'passed') summary.passed += 1;
    else summary.pending += 1;
    return summary;
  }, { completed: 0, passed: 0, pending: 0 });
}
