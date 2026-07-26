import type { ReviewOutcome } from './types';

export type EarthStoneFunction =
  | 'ground_first_step'
  | 'support_available_resource'
  | 'hold_sustainable_rhythm'
  | 'organize_active_limit'
  | 'no_external_action';

export type EarthStoneSmallStep = 'observe' | 'one_item' | 'five_minutes' | 'one_line' | 'no_step';
export type EarthStoneResource = 'time' | 'space' | 'verified_information' | 'material' | 'support' | 'none_available';
export type EarthStoneRhythm = 'single_cycle' | 'flexible_window' | 'action_then_rest' | 'wait_resource' | 'no_rhythm';
export type EarthStoneActiveLimit = 'one_item' | 'two_items' | 'three_items' | 'no_active_items';
export type EarthStoneReviewWindow = 'later_today' | 'tomorrow' | 'three_days' | 'when_context_changes' | 'when_ready';
export type EarthStoneStatus = 'crafting' | 'active' | 'awaiting_review' | 'adjusted' | 'integrated' | 'resting';

export interface EarthStoneProgress {
  id: 'recipe_first_step_stone_v1';
  sourceOrderMapId: string;
  status: EarthStoneStatus;
  function?: EarthStoneFunction;
  smallStep?: EarthStoneSmallStep;
  resource?: EarthStoneResource;
  rhythm?: EarthStoneRhythm;
  activeLimit?: EarthStoneActiveLimit;
  reviewWindow?: EarthStoneReviewWindow;
  reflection?: string;
  reviewOutcome?: ReviewOutcome;
  stoneCreated: boolean;
  positioned: boolean;
  startedAt: string;
  updatedAt: string;
  craftedAt?: string;
  reviewRequestedAt?: string;
  reviewedAt?: string;
  positionedAt?: string;
}

export function createEarthStoneProgress(sourceOrderMapId: string, startedAt: string): EarthStoneProgress {
  return {
    id: 'recipe_first_step_stone_v1',
    sourceOrderMapId,
    status: 'crafting',
    stoneCreated: false,
    positioned: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function configureEarthStone(
  progress: EarthStoneProgress,
  updates: Partial<Pick<EarthStoneProgress, 'function' | 'smallStep' | 'resource' | 'rhythm' | 'activeLimit' | 'reviewWindow'>>,
  updatedAt: string
): EarthStoneProgress {
  if (progress.status === 'integrated' || progress.positioned) return progress;
  return { ...progress, ...updates, updatedAt };
}

export function canCraftEarthStone(progress: EarthStoneProgress): boolean {
  return Boolean(
    progress.function
    && progress.smallStep
    && progress.resource
    && progress.rhythm
    && progress.activeLimit
    && progress.reviewWindow
  );
}

export function craftEarthStone(progress: EarthStoneProgress, craftedAt: string): EarthStoneProgress {
  if (!canCraftEarthStone(progress)) return progress;
  return {
    ...progress,
    status: 'active',
    stoneCreated: true,
    craftedAt,
    updatedAt: craftedAt
  };
}

export function requestEarthStoneReview(progress: EarthStoneProgress, requestedAt: string): EarthStoneProgress {
  if (!progress.stoneCreated || !['active', 'adjusted'].includes(progress.status)) return progress;
  return {
    ...progress,
    status: 'awaiting_review',
    reviewRequestedAt: requestedAt,
    updatedAt: requestedAt
  };
}

export function reviewEarthStone(
  progress: EarthStoneProgress,
  outcome: ReviewOutcome,
  reviewedAt: string,
  reflection?: string
): EarthStoneProgress {
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

export function resumeEarthStone(progress: EarthStoneProgress, updatedAt: string): EarthStoneProgress {
  if (progress.status !== 'resting') return progress;
  return { ...progress, status: 'adjusted', reviewOutcome: undefined, updatedAt };
}

export function positionEarthStone(progress: EarthStoneProgress, positionedAt: string): EarthStoneProgress {
  if (progress.status !== 'integrated') return progress;
  return {
    ...progress,
    positioned: true,
    positionedAt,
    updatedAt: positionedAt
  };
}
