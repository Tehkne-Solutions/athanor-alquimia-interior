import type { SpiritDimension } from './spiritThread';

export type SpiritDecisionCategory = 'provisional_decision' | 'promise' | 'prediction' | 'obedience';
export type SpiritDecisionPosition = 'supports' | 'disagrees' | 'passes' | 'unknown';
export type SpiritDecisionChoice = 'small_step' | 'pause' | 'ask_time' | 'observe_only' | 'none';
export type SpiritDecisionRevision = 'confirm' | 'reduce' | 'alter' | 'withdraw' | 'no_commitment';
export type SpiritDecisionWindow = 'next_step' | 'one_day' | 'three_days' | 'context_change' | 'none';
export type SpiritDecisionCondition = 'new_information' | 'resource_change' | 'part_disagrees' | 'safety_change' | 'unknown' | 'none';
export type SpiritDecisionStatus = 'active' | 'completed';

export const spiritDecisionDimensions: SpiritDimension[] = ['word', 'emotion', 'impulse', 'body', 'action'];

export interface SpiritDecisionProgress {
  id: 'mission_decision_remains_open_v1';
  sourceCouncilId: string;
  status: SpiritDecisionStatus;
  classifications: Record<string, SpiritDecisionCategory>;
  classificationSkipped: boolean;
  scenarioId?: string;
  positions: Partial<Record<SpiritDimension, SpiritDecisionPosition>>;
  choice?: SpiritDecisionChoice;
  revision?: SpiritDecisionRevision;
  reviewWindow?: SpiritDecisionWindow;
  reviewCondition?: SpiritDecisionCondition;
  decisionDeclined: boolean;
  revisableDecisionMarkCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export function createSpiritDecisionProgress(sourceCouncilId: string, startedAt: string): SpiritDecisionProgress {
  return {
    id: 'mission_decision_remains_open_v1',
    sourceCouncilId,
    status: 'active',
    classifications: {},
    classificationSkipped: false,
    positions: {},
    decisionDeclined: false,
    revisableDecisionMarkCreated: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function classifySpiritDecisionEntry(
  progress: SpiritDecisionProgress,
  entryId: string,
  category: SpiritDecisionCategory,
  updatedAt: string
): SpiritDecisionProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    classifications: { ...progress.classifications, [entryId]: category },
    classificationSkipped: false,
    updatedAt
  };
}

export function skipSpiritDecisionClassification(progress: SpiritDecisionProgress, updatedAt: string): SpiritDecisionProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, classifications: {}, classificationSkipped: true, updatedAt };
}

export function selectSpiritDecisionScenario(progress: SpiritDecisionProgress, scenarioId: string, updatedAt: string): SpiritDecisionProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    scenarioId,
    positions: {},
    choice: undefined,
    revision: undefined,
    reviewWindow: undefined,
    reviewCondition: undefined,
    decisionDeclined: false,
    updatedAt
  };
}

export function setSpiritDecisionPosition(
  progress: SpiritDecisionProgress,
  dimension: SpiritDimension,
  position: SpiritDecisionPosition,
  updatedAt: string
): SpiritDecisionProgress {
  if (progress.status === 'completed' || progress.decisionDeclined) return progress;
  return { ...progress, positions: { ...progress.positions, [dimension]: position }, updatedAt };
}

export function setSpiritDecisionChoice(
  progress: SpiritDecisionProgress,
  choice: SpiritDecisionChoice,
  updatedAt: string
): SpiritDecisionProgress {
  if (progress.status === 'completed' || progress.decisionDeclined) return progress;
  const revision = choice === 'none' && progress.revision && !['withdraw', 'no_commitment'].includes(progress.revision)
    ? undefined
    : progress.revision;
  return { ...progress, choice, revision, updatedAt };
}

export function setSpiritDecisionRevision(
  progress: SpiritDecisionProgress,
  revision: SpiritDecisionRevision,
  updatedAt: string
): SpiritDecisionProgress {
  if (progress.status === 'completed' || progress.decisionDeclined) return progress;
  if (progress.choice === 'none' && !['withdraw', 'no_commitment'].includes(revision)) return progress;
  return { ...progress, revision, updatedAt };
}

export function setSpiritDecisionReviewWindow(
  progress: SpiritDecisionProgress,
  reviewWindow: SpiritDecisionWindow,
  updatedAt: string
): SpiritDecisionProgress {
  if (progress.status === 'completed' || progress.decisionDeclined) return progress;
  return { ...progress, reviewWindow, updatedAt };
}

export function setSpiritDecisionReviewCondition(
  progress: SpiritDecisionProgress,
  reviewCondition: SpiritDecisionCondition,
  updatedAt: string
): SpiritDecisionProgress {
  if (progress.status === 'completed' || progress.decisionDeclined) return progress;
  return { ...progress, reviewCondition, updatedAt };
}

export function declineSpiritDecision(progress: SpiritDecisionProgress, updatedAt: string): SpiritDecisionProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    scenarioId: undefined,
    positions: {},
    choice: 'none',
    revision: 'no_commitment',
    reviewWindow: 'none',
    reviewCondition: 'none',
    decisionDeclined: true,
    updatedAt
  };
}

export function canCompleteSpiritDecision(progress: SpiritDecisionProgress, entryCount: number): boolean {
  const classificationReady = progress.classificationSkipped
    || Object.keys(progress.classifications).length === entryCount;
  if (!classificationReady) return false;
  if (progress.decisionDeclined) return progress.revision === 'no_commitment';

  const positionsReady = spiritDecisionDimensions.every((dimension) => Boolean(progress.positions[dimension]));
  if (!progress.scenarioId || !positionsReady || !progress.choice || !progress.revision || !progress.reviewWindow || !progress.reviewCondition) return false;
  if (progress.choice === 'none' && !['withdraw', 'no_commitment'].includes(progress.revision)) return false;
  if (progress.revision === 'confirm') {
    const hasSupport = Object.values(progress.positions).some((position) => position === 'supports');
    if (!hasSupport || progress.choice === 'none') return false;
  }
  if (progress.revision === 'no_commitment' && progress.choice !== 'none') return false;
  if (progress.reviewWindow === 'none' && !['withdraw', 'no_commitment'].includes(progress.revision)) return false;
  if (progress.reviewCondition === 'none' && !['withdraw', 'no_commitment'].includes(progress.revision)) return false;
  return true;
}

export function completeSpiritDecision(
  progress: SpiritDecisionProgress,
  entryCount: number,
  completedAt: string
): SpiritDecisionProgress {
  if (progress.status === 'completed' || !canCompleteSpiritDecision(progress, entryCount)) return progress;
  return {
    ...progress,
    status: 'completed',
    revisableDecisionMarkCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
