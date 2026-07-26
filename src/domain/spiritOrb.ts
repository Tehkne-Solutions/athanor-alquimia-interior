import type { ReviewOutcome } from './types';
import type { SpiritDimension } from './spiritThread';

export type SpiritOrbFunction =
  | 'hold_parts_together'
  | 'keep_center_provisional'
  | 'preserve_open_council'
  | 'carry_revisable_decision'
  | 'keep_return_possible'
  | 'no_external_action';

export type SpiritOrbVisibleDimension = SpiritDimension | 'none_visible';
export type SpiritOrbDisagreement = 'preserved' | 'not_identified' | 'unknown';
export type SpiritOrbDecision = 'provisional' | 'withdrawn' | 'none' | 'unknown';
export type SpiritOrbReturn = 'available' | 'conditional' | 'archived' | 'none' | 'unknown';
export type SpiritOrbReviewWindow = 'after_one_step' | 'when_context_changes' | 'three_days' | 'when_ready';
export type SpiritOrbStatus = 'crafting' | 'active' | 'awaiting_review' | 'adjusted' | 'integrated' | 'resting';

export interface SpiritOrbProgress {
  id: 'recipe_possible_integration_orb_v1';
  sourceReturnKeyId: string;
  status: SpiritOrbStatus;
  function?: SpiritOrbFunction;
  visibleDimension?: SpiritOrbVisibleDimension;
  disagreement?: SpiritOrbDisagreement;
  decision?: SpiritOrbDecision;
  returnMode?: SpiritOrbReturn;
  reviewWindow?: SpiritOrbReviewWindow;
  reflection?: string;
  reviewOutcome?: ReviewOutcome;
  orbCreated: boolean;
  positioned: boolean;
  startedAt: string;
  updatedAt: string;
  craftedAt?: string;
  reviewRequestedAt?: string;
  reviewedAt?: string;
  positionedAt?: string;
}

export function createSpiritOrbProgress(sourceReturnKeyId: string, startedAt: string): SpiritOrbProgress {
  return {
    id: 'recipe_possible_integration_orb_v1',
    sourceReturnKeyId,
    status: 'crafting',
    orbCreated: false,
    positioned: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function configureSpiritOrb(
  progress: SpiritOrbProgress,
  updates: Partial<Pick<SpiritOrbProgress, 'function' | 'visibleDimension' | 'disagreement' | 'decision' | 'returnMode' | 'reviewWindow'>>,
  updatedAt: string
): SpiritOrbProgress {
  if (progress.status === 'integrated' || progress.positioned) return progress;
  return { ...progress, ...updates, updatedAt };
}

export function canCraftSpiritOrb(progress: SpiritOrbProgress): boolean {
  return Boolean(
    progress.function
    && progress.visibleDimension
    && progress.disagreement
    && progress.decision
    && progress.returnMode
    && progress.reviewWindow
  );
}

export function craftSpiritOrb(progress: SpiritOrbProgress, craftedAt: string): SpiritOrbProgress {
  if (!canCraftSpiritOrb(progress)) return progress;
  return {
    ...progress,
    status: 'active',
    orbCreated: true,
    craftedAt,
    updatedAt: craftedAt
  };
}

export function requestSpiritOrbReview(progress: SpiritOrbProgress, requestedAt: string): SpiritOrbProgress {
  if (!progress.orbCreated || !['active', 'adjusted'].includes(progress.status)) return progress;
  return {
    ...progress,
    status: 'awaiting_review',
    reviewRequestedAt: requestedAt,
    updatedAt: requestedAt
  };
}

export function reviewSpiritOrb(
  progress: SpiritOrbProgress,
  outcome: ReviewOutcome,
  reviewedAt: string,
  reflection?: string
): SpiritOrbProgress {
  if (progress.status !== 'awaiting_review') return progress;
  const normalizedReflection = reflection?.trim() || undefined;

  if (outcome === 'integrated') {
    return {
      ...progress,
      status: 'integrated',
      reviewOutcome: outcome,
      reflection: normalizedReflection,
      reviewedAt,
      updatedAt: reviewedAt
    };
  }

  if (outcome === 'adjusted') {
    return {
      ...progress,
      status: 'adjusted',
      reviewOutcome: outcome,
      reflection: normalizedReflection,
      reviewedAt,
      updatedAt: reviewedAt
    };
  }

  return {
    ...progress,
    status: 'resting',
    reviewOutcome: outcome,
    reflection: normalizedReflection,
    reviewedAt,
    updatedAt: reviewedAt
  };
}

export function resumeSpiritOrb(progress: SpiritOrbProgress, updatedAt: string): SpiritOrbProgress {
  if (progress.status !== 'resting') return progress;
  return { ...progress, status: 'adjusted', reviewOutcome: undefined, updatedAt };
}

export function positionSpiritOrb(progress: SpiritOrbProgress, positionedAt: string): SpiritOrbProgress {
  if (progress.status !== 'integrated') return progress;
  return {
    ...progress,
    positioned: true,
    positionedAt,
    updatedAt: positionedAt
  };
}
