export type FireBoundaryStatementCategory = 'boundary' | 'control' | 'punishment';
export type FireBoundaryScope = 'conversation' | 'availability' | 'digital_contact' | 'physical_space' | 'workload';
export type FireBoundaryCondition = 'raised_voice' | 'repeated_messages' | 'outside_availability' | 'insufficient_information' | 'physical_risk' | 'none';
export type FireBoundaryAction = 'pause_conversation' | 'leave_safely' | 'respond_later' | 'limit_channel' | 'decline_request' | 'seek_support' | 'no_action';
export type FireBoundaryDuration = 'this_interaction' | 'until_tomorrow' | 'seven_days' | 'until_review';
export type FireBoundaryReview = 'review_in_24h' | 'review_in_3d' | 'review_in_7d' | 'review_when_context_changes' | 'no_scheduled_review';
export type FireBoundaryStatus = 'active' | 'completed';

export interface FireBoundaryProgress {
  id: 'mission_limit_that_protects_v1';
  sourceIntervalEmberId: string;
  status: FireBoundaryStatus;
  classifications: Record<string, FireBoundaryStatementCategory>;
  classificationSkipped: boolean;
  scope?: FireBoundaryScope;
  condition?: FireBoundaryCondition;
  action?: FireBoundaryAction;
  duration?: FireBoundaryDuration;
  review?: FireBoundaryReview;
  boundaryPlateCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const createFireBoundaryProgress = (
  sourceIntervalEmberId: string,
  createdAt: string
): FireBoundaryProgress => ({
  id: 'mission_limit_that_protects_v1',
  sourceIntervalEmberId,
  status: 'active',
  classifications: {},
  classificationSkipped: false,
  boundaryPlateCreated: false,
  startedAt: createdAt,
  updatedAt: createdAt
});

export function classifyBoundaryStatement(
  progress: FireBoundaryProgress,
  entryId: string,
  category: FireBoundaryStatementCategory,
  updatedAt: string
): FireBoundaryProgress {
  return {
    ...progress,
    classifications: { ...progress.classifications, [entryId]: category },
    classificationSkipped: false,
    updatedAt
  };
}

export function canCompleteFireBoundary(progress: FireBoundaryProgress, entryCount: number): boolean {
  const classificationReady = progress.classificationSkipped
    || Object.keys(progress.classifications).length === entryCount;

  return Boolean(
    classificationReady
      && progress.scope
      && progress.condition
      && progress.action
      && progress.duration
      && progress.review
  );
}

export function completeFireBoundary(
  progress: FireBoundaryProgress,
  entryCount: number,
  completedAt: string
): FireBoundaryProgress {
  if (!canCompleteFireBoundary(progress, entryCount)) return progress;

  return {
    ...progress,
    status: 'completed',
    boundaryPlateCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
