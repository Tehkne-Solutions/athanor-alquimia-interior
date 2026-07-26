export type SpiritReturnCategory = 'review' | 'correction' | 'repetition' | 'punishment';
export type SpiritReturnObservation = 'as_expected' | 'partial' | 'different' | 'not_observed' | 'unknown';
export type SpiritReturnContext = 'unchanged' | 'changed' | 'insufficient_information' | 'unknown';
export type SpiritReturnResources = 'available' | 'reduced' | 'unavailable' | 'unknown';
export type SpiritReturnDisposition = 'maintain' | 'reduce' | 'redo' | 'archive' | 'no_return';
export type SpiritReturnReviewBasis = 'observed_result' | 'context_change' | 'resource_change' | 'unknown' | 'none';
export type SpiritReturnStatus = 'active' | 'completed';

export interface SpiritReturnProgress {
  id: 'mission_return_without_condemnation_v1';
  sourceDecisionId: string;
  status: SpiritReturnStatus;
  classifications: Record<string, SpiritReturnCategory>;
  classificationSkipped: boolean;
  scenarioId?: string;
  observation?: SpiritReturnObservation;
  context?: SpiritReturnContext;
  resources?: SpiritReturnResources;
  basis?: SpiritReturnReviewBasis;
  disposition?: SpiritReturnDisposition;
  returnDeclined: boolean;
  possibleReturnKeyCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export function createSpiritReturnProgress(sourceDecisionId: string, startedAt: string): SpiritReturnProgress {
  return {
    id: 'mission_return_without_condemnation_v1',
    sourceDecisionId,
    status: 'active',
    classifications: {},
    classificationSkipped: false,
    returnDeclined: false,
    possibleReturnKeyCreated: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function classifySpiritReturnEntry(
  progress: SpiritReturnProgress,
  entryId: string,
  category: SpiritReturnCategory,
  updatedAt: string
): SpiritReturnProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    classifications: { ...progress.classifications, [entryId]: category },
    classificationSkipped: false,
    updatedAt
  };
}

export function skipSpiritReturnClassification(progress: SpiritReturnProgress, updatedAt: string): SpiritReturnProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, classifications: {}, classificationSkipped: true, updatedAt };
}

export function selectSpiritReturnScenario(progress: SpiritReturnProgress, scenarioId: string, updatedAt: string): SpiritReturnProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    scenarioId,
    observation: undefined,
    context: undefined,
    resources: undefined,
    basis: undefined,
    disposition: undefined,
    returnDeclined: false,
    updatedAt
  };
}

export function setSpiritReturnObservation(
  progress: SpiritReturnProgress,
  observation: SpiritReturnObservation,
  updatedAt: string
): SpiritReturnProgress {
  if (progress.status === 'completed' || progress.returnDeclined) return progress;
  const disposition = observation === 'unknown' && progress.disposition === 'redo' ? undefined : progress.disposition;
  return { ...progress, observation, disposition, updatedAt };
}

export function setSpiritReturnContext(
  progress: SpiritReturnProgress,
  context: SpiritReturnContext,
  updatedAt: string
): SpiritReturnProgress {
  if (progress.status === 'completed' || progress.returnDeclined) return progress;
  return { ...progress, context, updatedAt };
}

export function setSpiritReturnResources(
  progress: SpiritReturnProgress,
  resources: SpiritReturnResources,
  updatedAt: string
): SpiritReturnProgress {
  if (progress.status === 'completed' || progress.returnDeclined) return progress;
  const disposition = resources === 'unavailable' && progress.disposition === 'redo' ? undefined : progress.disposition;
  return { ...progress, resources, disposition, updatedAt };
}

export function setSpiritReturnBasis(
  progress: SpiritReturnProgress,
  basis: SpiritReturnReviewBasis,
  updatedAt: string
): SpiritReturnProgress {
  if (progress.status === 'completed' || progress.returnDeclined) return progress;
  return { ...progress, basis, updatedAt };
}

export function setSpiritReturnDisposition(
  progress: SpiritReturnProgress,
  disposition: SpiritReturnDisposition,
  updatedAt: string
): SpiritReturnProgress {
  if (progress.status === 'completed' || progress.returnDeclined) return progress;
  if (disposition === 'redo' && (progress.observation === 'unknown' || progress.resources === 'unavailable')) return progress;
  return { ...progress, disposition, updatedAt };
}

export function declineSpiritReturn(progress: SpiritReturnProgress, updatedAt: string): SpiritReturnProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    scenarioId: undefined,
    observation: 'unknown',
    context: 'unknown',
    resources: 'unknown',
    basis: 'none',
    disposition: 'no_return',
    returnDeclined: true,
    updatedAt
  };
}

export function canCompleteSpiritReturn(progress: SpiritReturnProgress, entryCount: number): boolean {
  const classificationReady = progress.classificationSkipped
    || Object.keys(progress.classifications).length === entryCount;
  if (!classificationReady) return false;
  if (progress.returnDeclined) return progress.disposition === 'no_return';
  if (!progress.scenarioId || !progress.observation || !progress.context || !progress.resources || !progress.basis || !progress.disposition) return false;
  if (progress.disposition === 'redo' && (progress.observation === 'unknown' || progress.resources === 'unavailable')) return false;
  if (progress.disposition === 'maintain' && progress.resources === 'unavailable') return false;
  if (progress.basis === 'none' && !['archive', 'no_return'].includes(progress.disposition)) return false;
  return true;
}

export function completeSpiritReturn(
  progress: SpiritReturnProgress,
  entryCount: number,
  completedAt: string
): SpiritReturnProgress {
  if (progress.status === 'completed' || !canCompleteSpiritReturn(progress, entryCount)) return progress;
  return {
    ...progress,
    status: 'completed',
    possibleReturnKeyCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
