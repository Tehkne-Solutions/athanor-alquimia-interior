import type { SpiritDimension } from './spiritThread';

export type SpiritCenterCategory = 'centrality' | 'superiority' | 'exclusion' | 'integration';
export type SpiritCenterDuration = 'one_step' | 'one_scene' | 'until_review' | 'none';
export type SpiritCenterReview = 'switch_allowed' | 'return_to_none' | 'keep_provisional' | 'unknown';
export type SpiritCenterDecision = 'observe' | 'switch_center' | 'pause' | 'decline' | 'no_action';
export type SpiritCenterStatus = 'active' | 'completed';

export interface SpiritCenterProgress {
  id: 'mission_center_without_erasing_parts_v1';
  sourceThreadId: string;
  status: SpiritCenterStatus;
  classifications: Record<string, SpiritCenterCategory>;
  classificationSkipped: boolean;
  scenarioId?: string;
  centralDimension?: SpiritDimension;
  noCenter: boolean;
  focusHistory: SpiritDimension[];
  duration?: SpiritCenterDuration;
  review?: SpiritCenterReview;
  decision?: SpiritCenterDecision;
  centerDeclined: boolean;
  provisionalCenterKnotCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export function createSpiritCenterProgress(sourceThreadId: string, startedAt: string): SpiritCenterProgress {
  return {
    id: 'mission_center_without_erasing_parts_v1',
    sourceThreadId,
    status: 'active',
    classifications: {},
    classificationSkipped: false,
    noCenter: false,
    focusHistory: [],
    centerDeclined: false,
    provisionalCenterKnotCreated: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function classifySpiritCenterEntry(
  progress: SpiritCenterProgress,
  entryId: string,
  category: SpiritCenterCategory,
  updatedAt: string
): SpiritCenterProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    classifications: { ...progress.classifications, [entryId]: category },
    classificationSkipped: false,
    updatedAt
  };
}

export function skipSpiritCenterClassification(progress: SpiritCenterProgress, updatedAt: string): SpiritCenterProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, classifications: {}, classificationSkipped: true, updatedAt };
}

export function selectSpiritCenterScenario(progress: SpiritCenterProgress, scenarioId: string, updatedAt: string): SpiritCenterProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    scenarioId,
    centralDimension: undefined,
    noCenter: false,
    focusHistory: [],
    duration: undefined,
    review: undefined,
    decision: undefined,
    centerDeclined: false,
    updatedAt
  };
}

export function setSpiritCenterDimension(
  progress: SpiritCenterProgress,
  dimension: SpiritDimension,
  updatedAt: string
): SpiritCenterProgress {
  if (progress.status === 'completed' || progress.centerDeclined) return progress;
  const last = progress.focusHistory.at(-1);
  return {
    ...progress,
    centralDimension: dimension,
    noCenter: false,
    focusHistory: last === dimension ? progress.focusHistory : [...progress.focusHistory, dimension],
    updatedAt
  };
}

export function chooseNoSpiritCenter(progress: SpiritCenterProgress, updatedAt: string): SpiritCenterProgress {
  if (progress.status === 'completed' || progress.centerDeclined) return progress;
  return { ...progress, centralDimension: undefined, noCenter: true, updatedAt };
}

export function setSpiritCenterDuration(
  progress: SpiritCenterProgress,
  duration: SpiritCenterDuration,
  updatedAt: string
): SpiritCenterProgress {
  if (progress.status === 'completed' || progress.centerDeclined) return progress;
  return { ...progress, duration, updatedAt };
}

export function setSpiritCenterReview(
  progress: SpiritCenterProgress,
  review: SpiritCenterReview,
  updatedAt: string
): SpiritCenterProgress {
  if (progress.status === 'completed' || progress.centerDeclined) return progress;
  return { ...progress, review, updatedAt };
}

export function setSpiritCenterDecision(
  progress: SpiritCenterProgress,
  decision: SpiritCenterDecision,
  updatedAt: string
): SpiritCenterProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, decision, updatedAt };
}

export function declineSpiritCenter(progress: SpiritCenterProgress, updatedAt: string): SpiritCenterProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    scenarioId: undefined,
    centralDimension: undefined,
    noCenter: true,
    duration: 'none',
    review: 'return_to_none',
    decision: 'decline',
    centerDeclined: true,
    updatedAt
  };
}

export function canCompleteSpiritCenter(progress: SpiritCenterProgress, entryCount: number): boolean {
  const classificationReady = progress.classificationSkipped
    || Object.keys(progress.classifications).length === entryCount;
  if (!classificationReady) return false;
  if (progress.centerDeclined) return progress.decision === 'decline';

  const centerReady = Boolean(progress.centralDimension || progress.noCenter);
  const switchReady = progress.decision !== 'switch_center' || progress.focusHistory.length >= 2;
  return Boolean(progress.scenarioId && centerReady && progress.duration && progress.review && progress.decision && switchReady);
}

export function completeSpiritCenter(
  progress: SpiritCenterProgress,
  entryCount: number,
  completedAt: string
): SpiritCenterProgress {
  if (progress.status === 'completed' || !canCompleteSpiritCenter(progress, entryCount)) return progress;
  return {
    ...progress,
    status: 'completed',
    provisionalCenterKnotCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
