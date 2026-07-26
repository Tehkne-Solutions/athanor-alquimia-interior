import type { SpiritDimension } from './spiritThread';

export type SpiritCouncilCategory = 'agreement' | 'negotiation' | 'silence' | 'coercion';
export type SpiritCouncilVoiceState = 'speak' | 'pass' | 'unknown';
export type SpiritCouncilDisagreement = 'preserved' | 'none_identified' | 'unknown';
export type SpiritCouncilBasis = 'shared_minimum' | 'temporary_center' | 'none' | 'unknown';
export type SpiritCouncilDecision = 'provisional' | 'postpone' | 'no_decision' | 'decline';
export type SpiritCouncilStatus = 'active' | 'completed';

export interface SpiritCouncilProgress {
  id: 'mission_council_of_parts_v1';
  sourceCenterId: string;
  status: SpiritCouncilStatus;
  classifications: Record<string, SpiritCouncilCategory>;
  classificationSkipped: boolean;
  scenarioId?: string;
  voiceStates: Partial<Record<SpiritDimension, SpiritCouncilVoiceState>>;
  disagreement?: SpiritCouncilDisagreement;
  basis?: SpiritCouncilBasis;
  decision?: SpiritCouncilDecision;
  councilDeclined: boolean;
  openCouncilSealCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const spiritCouncilDimensions: SpiritDimension[] = ['word', 'emotion', 'impulse', 'body', 'action'];

export function createSpiritCouncilProgress(sourceCenterId: string, startedAt: string): SpiritCouncilProgress {
  return {
    id: 'mission_council_of_parts_v1',
    sourceCenterId,
    status: 'active',
    classifications: {},
    classificationSkipped: false,
    voiceStates: {},
    councilDeclined: false,
    openCouncilSealCreated: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function classifySpiritCouncilEntry(
  progress: SpiritCouncilProgress,
  entryId: string,
  category: SpiritCouncilCategory,
  updatedAt: string
): SpiritCouncilProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    classifications: { ...progress.classifications, [entryId]: category },
    classificationSkipped: false,
    updatedAt
  };
}

export function skipSpiritCouncilClassification(progress: SpiritCouncilProgress, updatedAt: string): SpiritCouncilProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, classifications: {}, classificationSkipped: true, updatedAt };
}

export function selectSpiritCouncilScenario(
  progress: SpiritCouncilProgress,
  scenarioId: string,
  updatedAt: string
): SpiritCouncilProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    scenarioId,
    voiceStates: {},
    disagreement: undefined,
    basis: undefined,
    decision: undefined,
    councilDeclined: false,
    updatedAt
  };
}

export function setSpiritCouncilVoice(
  progress: SpiritCouncilProgress,
  dimension: SpiritDimension,
  voiceState: SpiritCouncilVoiceState,
  updatedAt: string
): SpiritCouncilProgress {
  if (progress.status === 'completed' || progress.councilDeclined) return progress;
  return {
    ...progress,
    voiceStates: { ...progress.voiceStates, [dimension]: voiceState },
    updatedAt
  };
}

export function setSpiritCouncilDisagreement(
  progress: SpiritCouncilProgress,
  disagreement: SpiritCouncilDisagreement,
  updatedAt: string
): SpiritCouncilProgress {
  if (progress.status === 'completed' || progress.councilDeclined) return progress;
  return { ...progress, disagreement, updatedAt };
}

export function setSpiritCouncilBasis(
  progress: SpiritCouncilProgress,
  basis: SpiritCouncilBasis,
  updatedAt: string
): SpiritCouncilProgress {
  if (progress.status === 'completed' || progress.councilDeclined) return progress;
  return { ...progress, basis, updatedAt };
}

export function setSpiritCouncilDecision(
  progress: SpiritCouncilProgress,
  decision: SpiritCouncilDecision,
  updatedAt: string
): SpiritCouncilProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    decision,
    basis: decision === 'provisional' ? progress.basis : progress.basis ?? 'none',
    updatedAt
  };
}

export function declineSpiritCouncil(progress: SpiritCouncilProgress, updatedAt: string): SpiritCouncilProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    scenarioId: undefined,
    voiceStates: {},
    disagreement: 'unknown',
    basis: 'none',
    decision: 'decline',
    councilDeclined: true,
    updatedAt
  };
}

export function canCompleteSpiritCouncil(progress: SpiritCouncilProgress, entryCount: number): boolean {
  const classificationReady = progress.classificationSkipped
    || Object.keys(progress.classifications).length === entryCount;
  if (!classificationReady) return false;
  if (progress.councilDeclined) return progress.decision === 'decline';

  const voicesReady = spiritCouncilDimensions.every((dimension) => Boolean(progress.voiceStates[dimension]));
  const provisionalBasisReady = progress.decision !== 'provisional'
    || progress.basis === 'shared_minimum'
    || progress.basis === 'temporary_center';

  return Boolean(
    progress.scenarioId
      && voicesReady
      && progress.disagreement
      && progress.basis
      && progress.decision
      && progress.decision !== 'decline'
      && provisionalBasisReady
  );
}

export function completeSpiritCouncil(
  progress: SpiritCouncilProgress,
  entryCount: number,
  completedAt: string
): SpiritCouncilProgress {
  if (progress.status === 'completed' || !canCompleteSpiritCouncil(progress, entryCount)) return progress;
  return {
    ...progress,
    status: 'completed',
    openCouncilSealCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
