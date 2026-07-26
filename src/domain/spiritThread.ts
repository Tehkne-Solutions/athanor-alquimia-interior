export type SpiritDimension = 'word' | 'emotion' | 'impulse' | 'body' | 'action';
export type SpiritThreadCategory = SpiritDimension | 'unknown';
export type SpiritDimensionState = 'considered' | 'unknown';
export type SpiritRelation = 'aligned' | 'mixed' | 'tension' | 'unknown';
export type SpiritThreadDecision = 'observe' | 'pause' | 'ask_time' | 'decline' | 'no_action';
export type SpiritThreadStatus = 'active' | 'completed';

export const spiritDimensions: SpiritDimension[] = ['word', 'emotion', 'impulse', 'body', 'action'];

export interface SpiritThreadProgress {
  id: 'mission_thread_that_gathers_v1';
  sourceEarthCycleId: string;
  status: SpiritThreadStatus;
  classifications: Record<string, SpiritThreadCategory>;
  classificationSkipped: boolean;
  scenarioId?: string;
  dimensionStates: Partial<Record<SpiritDimension, SpiritDimensionState>>;
  relation?: SpiritRelation;
  decision?: SpiritThreadDecision;
  synthesisDeclined: boolean;
  possibleSynthesisThreadCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export function createSpiritThreadProgress(sourceEarthCycleId: string, startedAt: string): SpiritThreadProgress {
  return {
    id: 'mission_thread_that_gathers_v1',
    sourceEarthCycleId,
    status: 'active',
    classifications: {},
    classificationSkipped: false,
    dimensionStates: {},
    synthesisDeclined: false,
    possibleSynthesisThreadCreated: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function classifySpiritThreadEntry(
  progress: SpiritThreadProgress,
  entryId: string,
  category: SpiritThreadCategory,
  updatedAt: string
): SpiritThreadProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    classifications: { ...progress.classifications, [entryId]: category },
    classificationSkipped: false,
    updatedAt
  };
}

export function skipSpiritThreadClassification(progress: SpiritThreadProgress, updatedAt: string): SpiritThreadProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, classifications: {}, classificationSkipped: true, updatedAt };
}

export function selectSpiritScenario(progress: SpiritThreadProgress, scenarioId: string, updatedAt: string): SpiritThreadProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    scenarioId,
    dimensionStates: {},
    relation: undefined,
    decision: undefined,
    synthesisDeclined: false,
    updatedAt
  };
}

export function setSpiritDimensionState(
  progress: SpiritThreadProgress,
  dimension: SpiritDimension,
  state: SpiritDimensionState,
  updatedAt: string
): SpiritThreadProgress {
  if (progress.status === 'completed' || progress.synthesisDeclined) return progress;
  return {
    ...progress,
    dimensionStates: { ...progress.dimensionStates, [dimension]: state },
    updatedAt
  };
}

export function setSpiritRelation(progress: SpiritThreadProgress, relation: SpiritRelation, updatedAt: string): SpiritThreadProgress {
  if (progress.status === 'completed' || progress.synthesisDeclined) return progress;
  return { ...progress, relation, updatedAt };
}

export function setSpiritThreadDecision(
  progress: SpiritThreadProgress,
  decision: SpiritThreadDecision,
  updatedAt: string
): SpiritThreadProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, decision, updatedAt };
}

export function declineSpiritSynthesis(progress: SpiritThreadProgress, updatedAt: string): SpiritThreadProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    scenarioId: undefined,
    dimensionStates: {},
    relation: undefined,
    decision: 'decline',
    synthesisDeclined: true,
    updatedAt
  };
}

export function canCompleteSpiritThread(progress: SpiritThreadProgress, entryCount: number): boolean {
  const classificationReady = progress.classificationSkipped
    || Object.keys(progress.classifications).length === entryCount;

  if (!classificationReady) return false;
  if (progress.synthesisDeclined) return progress.decision === 'decline';

  const dimensionsReady = spiritDimensions.every((dimension) => Boolean(progress.dimensionStates[dimension]));
  return Boolean(progress.scenarioId && dimensionsReady && progress.relation && progress.decision);
}

export function completeSpiritThread(
  progress: SpiritThreadProgress,
  entryCount: number,
  completedAt: string
): SpiritThreadProgress {
  if (progress.status === 'completed' || !canCompleteSpiritThread(progress, entryCount)) return progress;
  return {
    ...progress,
    status: 'completed',
    possibleSynthesisThreadCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
