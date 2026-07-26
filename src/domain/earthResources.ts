export type EarthResourceCategory = 'resource' | 'desire' | 'dependency' | 'guarantee';
export type EarthResourceKind = 'time' | 'space' | 'information' | 'materials' | 'support';
export type EarthResourceAvailability = 'available_now' | 'available_later' | 'unavailable' | 'unknown';
export type EarthResourceSubstitutionId =
  | 'shorter_time_window'
  | 'smaller_space'
  | 'existing_information'
  | 'single_material'
  | 'independent_safe_step'
  | 'no_substitute';
export type EarthResourceScopeId = 'keep_scope' | 'reduce_half' | 'one_unit' | 'observe_only' | 'pause_scope';
export type EarthResourceDecisionId =
  | 'proceed_with_available'
  | 'wait_for_resource'
  | 'use_substitute'
  | 'pause'
  | 'abandon_activity'
  | 'no_action';
export type EarthResourceStatus = 'active' | 'completed';

export interface EarthResourcesProgress {
  id: 'mission_house_of_resources_v1';
  sourceFirstStepSeedId: string;
  status: EarthResourceStatus;
  classifications: Record<string, EarthResourceCategory>;
  classificationSkipped: boolean;
  availability: Partial<Record<EarthResourceKind, EarthResourceAvailability>>;
  substitution?: EarthResourceSubstitutionId;
  scope?: EarthResourceScopeId;
  decision?: EarthResourceDecisionId;
  possibleResourcesBasketCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const earthResourceKinds: EarthResourceKind[] = ['time', 'space', 'information', 'materials', 'support'];

export function createEarthResourcesProgress(sourceFirstStepSeedId: string, startedAt: string): EarthResourcesProgress {
  return {
    id: 'mission_house_of_resources_v1',
    sourceFirstStepSeedId,
    status: 'active',
    classifications: {},
    classificationSkipped: false,
    availability: {},
    possibleResourcesBasketCreated: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function classifyEarthResourceEntry(
  progress: EarthResourcesProgress,
  entryId: string,
  category: EarthResourceCategory,
  updatedAt: string
): EarthResourcesProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    classifications: { ...progress.classifications, [entryId]: category },
    classificationSkipped: false,
    updatedAt
  };
}

export function skipEarthResourceClassification(progress: EarthResourcesProgress, updatedAt: string): EarthResourcesProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, classifications: {}, classificationSkipped: true, updatedAt };
}

export function setEarthResourceAvailability(
  progress: EarthResourcesProgress,
  kind: EarthResourceKind,
  availability: EarthResourceAvailability,
  updatedAt: string
): EarthResourcesProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, availability: { ...progress.availability, [kind]: availability }, updatedAt };
}

export function setEarthResourceSubstitution(
  progress: EarthResourcesProgress,
  substitution: EarthResourceSubstitutionId,
  updatedAt: string
): EarthResourcesProgress {
  if (progress.status === 'completed') return progress;
  const decision = substitution === 'no_substitute' && progress.decision === 'use_substitute' ? undefined : progress.decision;
  return { ...progress, substitution, decision, updatedAt };
}

export function setEarthResourceScope(
  progress: EarthResourcesProgress,
  scope: EarthResourceScopeId,
  updatedAt: string
): EarthResourcesProgress {
  if (progress.status === 'completed') return progress;
  const incompatible = scope === 'pause_scope' && ['proceed_with_available', 'use_substitute'].includes(progress.decision ?? '');
  return { ...progress, scope, decision: incompatible ? undefined : progress.decision, updatedAt };
}

export function setEarthResourceDecision(
  progress: EarthResourcesProgress,
  decision: EarthResourceDecisionId,
  updatedAt: string
): EarthResourcesProgress {
  if (progress.status === 'completed') return progress;
  if (decision === 'use_substitute' && (!progress.substitution || progress.substitution === 'no_substitute')) return progress;
  if (progress.scope === 'pause_scope' && ['proceed_with_available', 'use_substitute'].includes(decision)) return progress;
  return { ...progress, decision, updatedAt };
}

export function canCompleteEarthResources(progress: EarthResourcesProgress, entryCount: number): boolean {
  const classificationReady = progress.classificationSkipped || Object.keys(progress.classifications).length === entryCount;
  const availabilityReady = earthResourceKinds.every((kind) => Boolean(progress.availability[kind]));
  const hasUnavailable = earthResourceKinds.some((kind) => progress.availability[kind] === 'unavailable');
  const substitutionCompatible = progress.decision !== 'use_substitute'
    || Boolean(progress.substitution && progress.substitution !== 'no_substitute');
  const scopeCompatible = progress.scope !== 'pause_scope'
    || !['proceed_with_available', 'use_substitute'].includes(progress.decision ?? '');
  const reducedWhenMissing = !(hasUnavailable && progress.decision === 'proceed_with_available' && progress.scope === 'keep_scope');

  return Boolean(
    classificationReady
    && availabilityReady
    && progress.substitution
    && progress.scope
    && progress.decision
    && substitutionCompatible
    && scopeCompatible
    && reducedWhenMissing
  );
}

export function completeEarthResources(
  progress: EarthResourcesProgress,
  entryCount: number,
  completedAt: string
): EarthResourcesProgress {
  if (progress.status === 'completed' || !canCompleteEarthResources(progress, entryCount)) return progress;
  return {
    ...progress,
    status: 'completed',
    possibleResourcesBasketCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
