import type { ReviewOutcome } from './types';

export type FireShieldFunction =
  | 'protect_pause'
  | 'support_boundary'
  | 'organize_response'
  | 'hold_transformation'
  | 'no_external_action';

export type FireShieldIntensity = 'low' | 'moderate' | 'high';
export type FireShieldSupport =
  | 'trusted_person'
  | 'verified_information'
  | 'safe_place'
  | 'professional_support'
  | 'time'
  | 'none_available';
export type FireShieldDuration = 'one_interaction' | 'until_tomorrow' | 'three_days' | 'seven_days' | 'until_review';
export type FireShieldReviewWindow = 'later_today' | 'tomorrow' | 'three_days' | 'seven_days' | 'when_ready';
export type FireShieldStatus = 'crafting' | 'active' | 'awaiting_review' | 'adjusted' | 'integrated' | 'resting';

export interface FireShieldProgress {
  id: 'recipe_just_boundary_shield_v1';
  sourceTransformedMetalId: string;
  status: FireShieldStatus;
  function?: FireShieldFunction;
  intensity?: FireShieldIntensity;
  support?: FireShieldSupport;
  duration?: FireShieldDuration;
  reviewWindow?: FireShieldReviewWindow;
  reflection?: string;
  reviewOutcome?: ReviewOutcome;
  shieldCreated: boolean;
  positioned: boolean;
  startedAt: string;
  updatedAt: string;
  craftedAt?: string;
  reviewRequestedAt?: string;
  reviewedAt?: string;
  positionedAt?: string;
}

export function createFireShieldProgress(sourceTransformedMetalId: string, startedAt: string): FireShieldProgress {
  return {
    id: 'recipe_just_boundary_shield_v1',
    sourceTransformedMetalId,
    status: 'crafting',
    shieldCreated: false,
    positioned: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function configureFireShield(
  progress: FireShieldProgress,
  updates: Partial<Pick<FireShieldProgress, 'function' | 'intensity' | 'support' | 'duration' | 'reviewWindow'>>,
  updatedAt: string
): FireShieldProgress {
  if (progress.status === 'integrated' || progress.positioned) return progress;
  return { ...progress, ...updates, updatedAt };
}

export function canCraftFireShield(progress: FireShieldProgress): boolean {
  return Boolean(progress.function && progress.intensity && progress.support && progress.duration && progress.reviewWindow);
}

export function craftFireShield(progress: FireShieldProgress, craftedAt: string): FireShieldProgress {
  if (!canCraftFireShield(progress)) return progress;
  return {
    ...progress,
    status: 'active',
    shieldCreated: true,
    craftedAt,
    updatedAt: craftedAt
  };
}

export function requestFireShieldReview(progress: FireShieldProgress, requestedAt: string): FireShieldProgress {
  if (!progress.shieldCreated || !['active', 'adjusted'].includes(progress.status)) return progress;
  return {
    ...progress,
    status: 'awaiting_review',
    reviewRequestedAt: requestedAt,
    updatedAt: requestedAt
  };
}

export function reviewFireShield(
  progress: FireShieldProgress,
  outcome: ReviewOutcome,
  reviewedAt: string,
  reflection?: string
): FireShieldProgress {
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

export function resumeFireShield(progress: FireShieldProgress, updatedAt: string): FireShieldProgress {
  if (progress.status !== 'resting') return progress;
  return { ...progress, status: 'adjusted', reviewOutcome: undefined, updatedAt };
}

export function positionFireShield(progress: FireShieldProgress, positionedAt: string): FireShieldProgress {
  if (progress.status !== 'integrated') return progress;
  return {
    ...progress,
    positioned: true,
    positionedAt,
    updatedAt: positionedAt
  };
}
