export type EarthWorkCategory = 'intention' | 'project' | 'task' | 'first_step';
export type EarthCapacityId = 'unavailable' | 'limited' | 'available' | 'unknown';
export type EarthTimeId = 'five_minutes' | 'fifteen_minutes' | 'thirty_minutes' | 'unknown';
export type EarthWorkContextId = 'desk_corner' | 'digital_folder' | 'simple_note' | 'plant_corner' | 'meal_outline';
export type EarthSmallStepId = 'observe_materials' | 'gather_one_item' | 'open_document' | 'write_one_line' | 'sort_three_items' | 'ask_one_question' | 'no_step';
export type EarthWorkDecisionId = 'do_small_step' | 'delay' | 'delegate' | 'rest_first' | 'no_action';
export type EarthWorkSupportId = 'timer' | 'checklist' | 'quiet_space' | 'trusted_person' | 'none_available';
export type EarthWorkStatus = 'active' | 'completed';

export interface EarthWorkProgress {
  id: 'mission_work_that_fits_today_v1';
  sourceBodyPresenceMarkId: string;
  status: EarthWorkStatus;
  classifications: Record<string, EarthWorkCategory>;
  classificationSkipped: boolean;
  context?: EarthWorkContextId;
  capacity?: EarthCapacityId;
  timeWindow?: EarthTimeId;
  smallStep?: EarthSmallStepId;
  decision?: EarthWorkDecisionId;
  supports: EarthWorkSupportId[];
  firstStepSeedCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export function createEarthWorkProgress(sourceBodyPresenceMarkId: string, startedAt: string): EarthWorkProgress {
  return {
    id: 'mission_work_that_fits_today_v1',
    sourceBodyPresenceMarkId,
    status: 'active',
    classifications: {},
    classificationSkipped: false,
    supports: [],
    firstStepSeedCreated: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function classifyEarthWorkEntry(progress: EarthWorkProgress, entryId: string, category: EarthWorkCategory, updatedAt: string): EarthWorkProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, classifications: { ...progress.classifications, [entryId]: category }, classificationSkipped: false, updatedAt };
}

export function skipEarthWorkClassification(progress: EarthWorkProgress, updatedAt: string): EarthWorkProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, classifications: {}, classificationSkipped: true, updatedAt };
}

export function setEarthWorkContext(progress: EarthWorkProgress, context: EarthWorkContextId, updatedAt: string): EarthWorkProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, context, updatedAt };
}

export function setEarthWorkCapacity(progress: EarthWorkProgress, capacity: EarthCapacityId, updatedAt: string): EarthWorkProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, capacity, updatedAt };
}

export function setEarthWorkTime(progress: EarthWorkProgress, timeWindow: EarthTimeId, updatedAt: string): EarthWorkProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, timeWindow, updatedAt };
}

export function setEarthSmallStep(progress: EarthWorkProgress, smallStep: EarthSmallStepId, updatedAt: string): EarthWorkProgress {
  if (progress.status === 'completed') return progress;
  const decision = smallStep === 'no_step' && progress.decision === 'do_small_step' ? undefined : progress.decision;
  return { ...progress, smallStep, decision, updatedAt };
}

export function setEarthWorkDecision(progress: EarthWorkProgress, decision: EarthWorkDecisionId, updatedAt: string): EarthWorkProgress {
  if (progress.status === 'completed') return progress;
  if (decision === 'do_small_step' && progress.smallStep === 'no_step') return progress;
  return { ...progress, decision, updatedAt };
}

export function toggleEarthWorkSupport(progress: EarthWorkProgress, support: EarthWorkSupportId, updatedAt: string): EarthWorkProgress {
  if (progress.status === 'completed') return progress;
  if (support === 'none_available') {
    return { ...progress, supports: progress.supports.includes(support) ? [] : ['none_available'], updatedAt };
  }
  const withoutNone = progress.supports.filter((item) => item !== 'none_available');
  const supports = withoutNone.includes(support) ? withoutNone.filter((item) => item !== support) : [...withoutNone, support];
  return { ...progress, supports, updatedAt };
}

export function canCompleteEarthWork(progress: EarthWorkProgress, entryCount: number): boolean {
  const classificationReady = progress.classificationSkipped || Object.keys(progress.classifications).length === entryCount;
  const stepCompatible = progress.smallStep !== 'no_step' || progress.decision !== 'do_small_step';
  return Boolean(
    classificationReady
    && progress.context
    && progress.capacity
    && progress.timeWindow
    && progress.smallStep
    && progress.decision
    && progress.supports.length > 0
    && stepCompatible
  );
}

export function completeEarthWork(progress: EarthWorkProgress, entryCount: number, completedAt: string): EarthWorkProgress {
  if (progress.status === 'completed' || !canCompleteEarthWork(progress, entryCount)) return progress;
  return { ...progress, status: 'completed', firstStepSeedCreated: true, completedAt, updatedAt: completedAt };
}
