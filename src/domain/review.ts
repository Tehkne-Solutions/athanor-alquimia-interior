import type { ItemLifecycle, MissionStatus, ReviewOutcome } from './types';

export interface ReviewResolution {
  itemLifecycle: ItemLifecycle;
  missionStatus: MissionStatus;
  shouldAdvanceWorkLevel: boolean;
}

export function resolveReviewOutcome(outcome: ReviewOutcome): ReviewResolution {
  if (outcome === 'integrated') {
    return {
      itemLifecycle: 'integrated',
      missionStatus: 'integrated',
      shouldAdvanceWorkLevel: true
    };
  }

  if (outcome === 'adjusted') {
    return {
      itemLifecycle: 'adjusted',
      missionStatus: 'awaiting_review',
      shouldAdvanceWorkLevel: false
    };
  }

  return {
    itemLifecycle: 'awaiting_review',
    missionStatus: 'awaiting_review',
    shouldAdvanceWorkLevel: false
  };
}
