export type FireTransformationStatementCategory = 'preserve' | 'repair' | 'transform' | 'close' | 'archive';
export type FireTransformationObject = 'cracked_lantern' | 'outdated_map' | 'worn_tool' | 'unfinished_model' | 'duplicate_box';
export type FireTransformationDecision = FireTransformationStatementCategory;
export type FireTransformationAction = 'inspect_without_changing' | 'replace_removable_part' | 'create_copy_before_change' | 'relabel_for_new_use' | 'document_and_close' | 'move_to_archive' | 'no_change_now';
export type FireTransformationSafeguard = 'fictional_object_only' | 'need_more_context' | 'no_change_now';
export type FireTransformationReview = 'after_one_step' | 'review_in_3d' | 'review_when_context_changes' | 'no_scheduled_review';
export type FireTransformationStatus = 'active' | 'completed';

export interface FireTransformationProgress {
  id: 'mission_what_needs_transformation_v1';
  sourceCourageMarkId: string;
  status: FireTransformationStatus;
  classifications: Record<string, FireTransformationStatementCategory>;
  classificationSkipped: boolean;
  object?: FireTransformationObject;
  decision?: FireTransformationDecision;
  action?: FireTransformationAction;
  safeguard?: FireTransformationSafeguard;
  review?: FireTransformationReview;
  transformedMetalCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const createFireTransformationProgress = (
  sourceCourageMarkId: string,
  createdAt: string
): FireTransformationProgress => ({
  id: 'mission_what_needs_transformation_v1',
  sourceCourageMarkId,
  status: 'active',
  classifications: {},
  classificationSkipped: false,
  transformedMetalCreated: false,
  startedAt: createdAt,
  updatedAt: createdAt
});

export function classifyTransformationStatement(
  progress: FireTransformationProgress,
  entryId: string,
  category: FireTransformationStatementCategory,
  updatedAt: string
): FireTransformationProgress {
  return {
    ...progress,
    classifications: { ...progress.classifications, [entryId]: category },
    classificationSkipped: false,
    updatedAt
  };
}

export function isCompatibleTransformationChoice(progress: FireTransformationProgress): boolean {
  if (!progress.decision || !progress.action || !progress.safeguard) return false;

  if (progress.safeguard === 'no_change_now') return progress.action === 'no_change_now';
  if (progress.safeguard === 'need_more_context') {
    return ['inspect_without_changing', 'create_copy_before_change', 'no_change_now'].includes(progress.action);
  }

  const allowedByDecision: Record<FireTransformationDecision, FireTransformationAction[]> = {
    preserve: ['inspect_without_changing', 'create_copy_before_change', 'no_change_now'],
    repair: ['replace_removable_part', 'create_copy_before_change', 'inspect_without_changing', 'no_change_now'],
    transform: ['relabel_for_new_use', 'create_copy_before_change', 'inspect_without_changing', 'no_change_now'],
    close: ['document_and_close', 'create_copy_before_change', 'no_change_now'],
    archive: ['move_to_archive', 'create_copy_before_change', 'no_change_now']
  };

  return allowedByDecision[progress.decision].includes(progress.action);
}

export function canCompleteFireTransformation(progress: FireTransformationProgress, entryCount: number): boolean {
  const classificationReady = progress.classificationSkipped
    || Object.keys(progress.classifications).length === entryCount;

  return Boolean(
    classificationReady
      && progress.object
      && progress.decision
      && progress.action
      && progress.safeguard
      && progress.review
      && isCompatibleTransformationChoice(progress)
  );
}

export function completeFireTransformation(
  progress: FireTransformationProgress,
  entryCount: number,
  completedAt: string
): FireTransformationProgress {
  if (!canCompleteFireTransformation(progress, entryCount)) return progress;

  return {
    ...progress,
    status: 'completed',
    transformedMetalCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
