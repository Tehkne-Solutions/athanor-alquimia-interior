import type { ReviewOutcome } from './types';
import type { WaterCareActionId } from './waterTrust';

export type WaterChaliceIntentId =
  | 'hold_with_context'
  | 'remember_without_identity'
  | 'seek_support'
  | 'rest_before_action'
  | 'continue_small_step';

export type WaterChaliceLimitId =
  | 'one_step'
  | 'ten_minutes'
  | 'until_tomorrow'
  | 'with_support'
  | 'stop_if_overwhelming';

export type WaterChaliceReviewWindowId =
  | 'later_today'
  | 'tomorrow'
  | 'three_days'
  | 'next_week'
  | 'when_ready';

export type WaterChaliceStatus =
  | 'crafting'
  | 'active'
  | 'awaiting_review'
  | 'adjusted'
  | 'integrated'
  | 'resting';

export interface WaterChaliceProgress {
  id: 'recipe_memory_serene_chalice_v1';
  journeyStartedAt: string;
  status: WaterChaliceStatus;
  intention?: WaterChaliceIntentId;
  careAction?: WaterCareActionId;
  limit?: WaterChaliceLimitId;
  reviewWindow?: WaterChaliceReviewWindowId;
  reflection?: string;
  reviewOutcome?: ReviewOutcome;
  chaliceCreated: boolean;
  positioned: boolean;
  startedAt: string;
  updatedAt: string;
  craftedAt?: string;
  reviewRequestedAt?: string;
  reviewedAt?: string;
  positionedAt?: string;
}

export function createWaterChaliceProgress(
  journeyStartedAt: string,
  startedAt: string,
  suggestedCareAction?: WaterCareActionId
): WaterChaliceProgress {
  return {
    id: 'recipe_memory_serene_chalice_v1',
    journeyStartedAt,
    status: 'crafting',
    careAction: suggestedCareAction,
    chaliceCreated: false,
    positioned: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function configureWaterChalice(
  progress: WaterChaliceProgress,
  updates: Partial<Pick<WaterChaliceProgress, 'intention' | 'careAction' | 'limit' | 'reviewWindow'>>,
  updatedAt: string
): WaterChaliceProgress {
  if (progress.status === 'integrated' || progress.positioned) return progress;
  return { ...progress, ...updates, updatedAt };
}

export function canCraftWaterChalice(progress: WaterChaliceProgress): boolean {
  return Boolean(progress.intention && progress.careAction && progress.limit && progress.reviewWindow);
}

export function craftWaterChalice(progress: WaterChaliceProgress, craftedAt: string): WaterChaliceProgress {
  if (!canCraftWaterChalice(progress)) return progress;
  return {
    ...progress,
    status: 'active',
    chaliceCreated: true,
    craftedAt,
    updatedAt: craftedAt
  };
}

export function requestWaterChaliceReview(
  progress: WaterChaliceProgress,
  requestedAt: string
): WaterChaliceProgress {
  if (!progress.chaliceCreated || !['active', 'adjusted'].includes(progress.status)) return progress;
  return {
    ...progress,
    status: 'awaiting_review',
    reviewRequestedAt: requestedAt,
    updatedAt: requestedAt
  };
}

export function reviewWaterChalice(
  progress: WaterChaliceProgress,
  outcome: ReviewOutcome,
  reviewedAt: string,
  reflection?: string
): WaterChaliceProgress {
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

export function resumeWaterChalice(progress: WaterChaliceProgress, updatedAt: string): WaterChaliceProgress {
  if (progress.status !== 'resting') return progress;
  return {
    ...progress,
    status: 'adjusted',
    reviewOutcome: undefined,
    updatedAt
  };
}

export function positionWaterChalice(progress: WaterChaliceProgress, positionedAt: string): WaterChaliceProgress {
  if (progress.status !== 'integrated') return progress;
  return {
    ...progress,
    positioned: true,
    positionedAt,
    updatedAt: positionedAt
  };
}
