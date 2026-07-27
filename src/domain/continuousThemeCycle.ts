import type { NewWorkStartPoint } from './continuousJourney';
import {
  deriveContinuousTrailVariantIndex,
  type ContinuousTrailInstance,
  type ContinuousTrailStage
} from './continuousTrail';

export type ContinuousThemeCycleDepth = 1 | 2 | 3;
export type ContinuousThemeCycleStatus = 'active' | 'paused' | 'completed' | 'declined';
export type ContinuousThemeCyclePassageResult = 'pending' | 'completed' | 'passed';
export type ContinuousThemeCycleAdvanceResult = 'completed' | 'passed';

export interface ContinuousThemeCyclePassageInput {
  id: string;
  stage: ContinuousTrailStage;
  label: string;
  prompt: string;
}

export interface ContinuousThemeCyclePassageProgress extends ContinuousThemeCyclePassageInput {
  sequence: number;
  result: ContinuousThemeCyclePassageResult;
  resolvedAt?: string;
}

export interface ContinuousThemeCyclePackageInput {
  id: string;
  themeId: string;
  label: string;
  description: string;
  startPoints: NewWorkStartPoint[];
  passages: readonly ContinuousThemeCyclePassageInput[];
}

export interface ContinuousThemeCycleInstance {
  id: string;
  sourceTrailId: string;
  sourceCycleInstanceId: string;
  sourceRecordId: string;
  sourceSpiritCycleId: string;
  startPoint: NewWorkStartPoint;
  sourceThemeId?: string;
  sourceNoTheme: boolean;
  sourceVariantId: string;
  packageId?: string;
  packageLabel?: string;
  catalogVersion: string;
  depth: ContinuousThemeCycleDepth | 0;
  passages: ContinuousThemeCyclePassageProgress[];
  currentPassageIndex: number;
  status: ContinuousThemeCycleStatus;
  endedEarly: boolean;
  createdAt: string;
  updatedAt: string;
  pausedAt?: string;
  resumedAt?: string;
  completedAt?: string;
  declinedAt?: string;
}

export interface ContinuousThemeCycleProgress {
  id: 'continuous_theme_cycle_registry_v1';
  instances: ContinuousThemeCycleInstance[];
  createdAt: string;
  updatedAt: string;
}

export function createContinuousThemeCycleProgress(createdAt: string): ContinuousThemeCycleProgress {
  return {
    id: 'continuous_theme_cycle_registry_v1',
    instances: [],
    createdAt,
    updatedAt: createdAt
  };
}

export function getContinuousThemeCyclesByTrail(
  progress: ContinuousThemeCycleProgress,
  sourceTrailId: string
): ContinuousThemeCycleInstance[] {
  return progress.instances.filter((instance) => instance.sourceTrailId === sourceTrailId);
}

export function findOpenContinuousThemeCycle(
  progress: ContinuousThemeCycleProgress,
  sourceTrailId: string
): ContinuousThemeCycleInstance | undefined {
  return progress.instances.find(
    (instance) => instance.sourceTrailId === sourceTrailId && (instance.status === 'active' || instance.status === 'paused')
  );
}

export function findContinuousThemeCycle(
  progress: ContinuousThemeCycleProgress,
  instanceId: string
): ContinuousThemeCycleInstance | undefined {
  return progress.instances.find((instance) => instance.id === instanceId);
}

export function selectContinuousThemeCyclePassages(
  seed: string,
  packageId: string,
  passages: readonly ContinuousThemeCyclePassageInput[],
  depth: ContinuousThemeCycleDepth,
  cycleSequence: number
): ContinuousThemeCyclePassageProgress[] {
  if (passages.length < depth) return [];
  const offset = deriveContinuousTrailVariantIndex(
    `${seed}:theme-cycle:${packageId}:sequence:${cycleSequence}`,
    passages.length
  );
  const ordered = passages.map((_, index) => passages[(offset + index) % passages.length]);
  return ordered.slice(0, depth).map((passage, index) => ({
    ...passage,
    sequence: index,
    result: 'pending'
  }));
}

export function startContinuousThemeCycle(
  progress: ContinuousThemeCycleProgress,
  trail: ContinuousTrailInstance,
  packageInput: ContinuousThemeCyclePackageInput,
  depth: ContinuousThemeCycleDepth,
  instanceId: string,
  catalogVersion: string,
  createdAt: string
): ContinuousThemeCycleProgress {
  if (trail.status !== 'completed' || !trail.continuousTrailTraceCreated) return progress;
  if (findOpenContinuousThemeCycle(progress, trail.id)) return progress;
  if (!packageInput.startPoints.includes(trail.startPoint)) return progress;
  const expectedThemeId = trail.noTheme || !trail.themeId ? 'no-theme' : trail.themeId;
  if (packageInput.themeId !== expectedThemeId) return progress;

  const previousCount = getContinuousThemeCyclesByTrail(progress, trail.id).length;
  const passages = selectContinuousThemeCyclePassages(
    trail.contentSeed,
    packageInput.id,
    packageInput.passages,
    depth,
    previousCount
  );
  if (passages.length !== depth) return progress;
  if (new Set(passages.map((passage) => passage.id)).size !== passages.length) return progress;

  const instance: ContinuousThemeCycleInstance = {
    id: instanceId,
    sourceTrailId: trail.id,
    sourceCycleInstanceId: trail.sourceCycleInstanceId,
    sourceRecordId: trail.sourceRecordId,
    sourceSpiritCycleId: trail.sourceSpiritCycleId,
    startPoint: trail.startPoint,
    sourceThemeId: trail.themeId,
    sourceNoTheme: Boolean(trail.noTheme),
    sourceVariantId: trail.contentVariantId,
    packageId: packageInput.id,
    packageLabel: packageInput.label,
    catalogVersion,
    depth,
    passages,
    currentPassageIndex: 0,
    status: 'active',
    endedEarly: false,
    createdAt,
    updatedAt: createdAt
  };

  return {
    ...progress,
    instances: [...progress.instances, instance],
    updatedAt: createdAt
  };
}

export function declineContinuousThemeCycle(
  progress: ContinuousThemeCycleProgress,
  trail: ContinuousTrailInstance,
  instanceId: string,
  catalogVersion: string,
  declinedAt: string
): ContinuousThemeCycleProgress {
  if (trail.status !== 'completed' || !trail.continuousTrailTraceCreated) return progress;
  if (findOpenContinuousThemeCycle(progress, trail.id)) return progress;

  const instance: ContinuousThemeCycleInstance = {
    id: instanceId,
    sourceTrailId: trail.id,
    sourceCycleInstanceId: trail.sourceCycleInstanceId,
    sourceRecordId: trail.sourceRecordId,
    sourceSpiritCycleId: trail.sourceSpiritCycleId,
    startPoint: trail.startPoint,
    sourceThemeId: trail.themeId,
    sourceNoTheme: Boolean(trail.noTheme),
    sourceVariantId: trail.contentVariantId,
    catalogVersion,
    depth: 0,
    passages: [],
    currentPassageIndex: 0,
    status: 'declined',
    endedEarly: false,
    createdAt: declinedAt,
    updatedAt: declinedAt,
    declinedAt
  };

  return {
    ...progress,
    instances: [...progress.instances, instance],
    updatedAt: declinedAt
  };
}

function updateContinuousThemeCycle(
  progress: ContinuousThemeCycleProgress,
  instanceId: string,
  updater: (instance: ContinuousThemeCycleInstance) => ContinuousThemeCycleInstance,
  updatedAt: string
): ContinuousThemeCycleProgress {
  const current = findContinuousThemeCycle(progress, instanceId);
  if (!current) return progress;
  return {
    ...progress,
    instances: progress.instances.map((instance) => instance.id === instanceId ? updater(instance) : instance),
    updatedAt
  };
}

export function advanceContinuousThemeCycle(
  progress: ContinuousThemeCycleProgress,
  instanceId: string,
  result: ContinuousThemeCycleAdvanceResult,
  updatedAt: string
): ContinuousThemeCycleProgress {
  return updateContinuousThemeCycle(progress, instanceId, (instance) => {
    if (instance.status !== 'active') return instance;
    const current = instance.passages[instance.currentPassageIndex];
    if (!current || current.result !== 'pending') return instance;

    const passages = instance.passages.map((passage, index) => index === instance.currentPassageIndex
      ? { ...passage, result, resolvedAt: updatedAt }
      : passage
    );
    const isLast = instance.currentPassageIndex >= instance.passages.length - 1;
    if (isLast) {
      return {
        ...instance,
        passages,
        status: 'completed',
        completedAt: updatedAt,
        updatedAt
      };
    }
    return {
      ...instance,
      passages,
      currentPassageIndex: instance.currentPassageIndex + 1,
      updatedAt
    };
  }, updatedAt);
}

export function pauseContinuousThemeCycle(
  progress: ContinuousThemeCycleProgress,
  instanceId: string,
  updatedAt: string
): ContinuousThemeCycleProgress {
  return updateContinuousThemeCycle(progress, instanceId, (instance) => instance.status !== 'active'
    ? instance
    : { ...instance, status: 'paused', pausedAt: updatedAt, updatedAt }, updatedAt);
}

export function resumeContinuousThemeCycle(
  progress: ContinuousThemeCycleProgress,
  instanceId: string,
  updatedAt: string
): ContinuousThemeCycleProgress {
  return updateContinuousThemeCycle(progress, instanceId, (instance) => instance.status !== 'paused'
    ? instance
    : { ...instance, status: 'active', resumedAt: updatedAt, updatedAt }, updatedAt);
}

export function endContinuousThemeCycleEarly(
  progress: ContinuousThemeCycleProgress,
  instanceId: string,
  updatedAt: string
): ContinuousThemeCycleProgress {
  return updateContinuousThemeCycle(progress, instanceId, (instance) => {
    if (instance.status !== 'active' && instance.status !== 'paused') return instance;
    return {
      ...instance,
      status: 'completed',
      endedEarly: true,
      completedAt: updatedAt,
      updatedAt
    };
  }, updatedAt);
}

export function summarizeContinuousThemeCycle(instance: ContinuousThemeCycleInstance): {
  completed: number;
  passed: number;
  pending: number;
} {
  return instance.passages.reduce((summary, passage) => {
    if (passage.result === 'completed') summary.completed += 1;
    else if (passage.result === 'passed') summary.passed += 1;
    else summary.pending += 1;
    return summary;
  }, { completed: 0, passed: 0, pending: 0 });
}
