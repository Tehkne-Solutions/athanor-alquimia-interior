export type FireCourageStatementCategory = 'proportional_courage' | 'imprudent_exposure' | 'avoidance' | 'external_pressure';
export type FireCourageContext = 'clarify_request' | 'communicate_boundary' | 'decline_commitment' | 'request_support' | 'leave_risk';
export type FireCourageAction = 'prepare_points' | 'ask_for_information' | 'request_time' | 'send_brief_message' | 'supported_conversation' | 'decline_request' | 'leave_safely' | 'delay_action' | 'no_action';
export type FireCourageResource = 'trusted_person' | 'verified_information' | 'time' | 'safe_place' | 'professional_support' | 'previous_experience' | 'none_available';
export type FireCourageReadiness = 'smallest_sufficient' | 'prepare_first' | 'delay' | 'decline';
export type FireCourageStatus = 'active' | 'completed';

export interface FireCourageProgress {
  id: 'mission_proportional_courage_v1';
  sourceBoundaryPlateId: string;
  status: FireCourageStatus;
  classifications: Record<string, FireCourageStatementCategory>;
  classificationSkipped: boolean;
  context?: FireCourageContext;
  action?: FireCourageAction;
  resources: FireCourageResource[];
  resourceSelectionCompleted: boolean;
  readiness?: FireCourageReadiness;
  proportionalCourageMarkCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const createFireCourageProgress = (
  sourceBoundaryPlateId: string,
  createdAt: string
): FireCourageProgress => ({
  id: 'mission_proportional_courage_v1',
  sourceBoundaryPlateId,
  status: 'active',
  classifications: {},
  classificationSkipped: false,
  resources: [],
  resourceSelectionCompleted: false,
  proportionalCourageMarkCreated: false,
  startedAt: createdAt,
  updatedAt: createdAt
});

export function classifyCourageStatement(
  progress: FireCourageProgress,
  entryId: string,
  category: FireCourageStatementCategory,
  updatedAt: string
): FireCourageProgress {
  return {
    ...progress,
    classifications: { ...progress.classifications, [entryId]: category },
    classificationSkipped: false,
    updatedAt
  };
}

export function toggleCourageResource(
  progress: FireCourageProgress,
  resource: FireCourageResource,
  updatedAt: string
): FireCourageProgress {
  const resources = resource === 'none_available'
    ? ['none_available'] as FireCourageResource[]
    : progress.resources.includes(resource)
      ? progress.resources.filter((item) => item !== resource && item !== 'none_available')
      : [...progress.resources.filter((item) => item !== 'none_available'), resource];

  return {
    ...progress,
    resources,
    resourceSelectionCompleted: true,
    updatedAt
  };
}

export function canCompleteFireCourage(progress: FireCourageProgress, entryCount: number): boolean {
  const classificationReady = progress.classificationSkipped
    || Object.keys(progress.classifications).length === entryCount;

  return Boolean(
    classificationReady
      && progress.context
      && progress.action
      && progress.resourceSelectionCompleted
      && progress.readiness
  );
}

export function completeFireCourage(
  progress: FireCourageProgress,
  entryCount: number,
  completedAt: string
): FireCourageProgress {
  if (!canCompleteFireCourage(progress, entryCount)) return progress;

  return {
    ...progress,
    status: 'completed',
    proportionalCourageMarkCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
