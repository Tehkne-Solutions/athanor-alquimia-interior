export type EarthPerceptionDimension = 'energy' | 'rest' | 'tension' | 'comfort';
export type EarthPerceptionLevel = 'low' | 'moderate' | 'high' | 'unknown';
export type EarthBodyCategory = 'perceived_signal' | 'interpretation' | 'need' | 'action';
export type EarthResourceId =
  | 'water'
  | 'food'
  | 'place_to_rest'
  | 'comfortable_position'
  | 'time'
  | 'trusted_person'
  | 'verified_information'
  | 'none_available';
export type EarthActionId =
  | 'rest_now'
  | 'brief_pause'
  | 'adjust_position'
  | 'prepare_basic_resource'
  | 'reduce_next_step'
  | 'seek_support'
  | 'no_action';
export type EarthBodyStatus = 'active' | 'completed';

export interface EarthBodyProgress {
  id: 'mission_body_arrives_first_v1';
  sourceFireCycleId: string;
  status: EarthBodyStatus;
  perceptions: Partial<Record<EarthPerceptionDimension, EarthPerceptionLevel>>;
  checkInSkipped: boolean;
  classifications: Record<string, EarthBodyCategory>;
  classificationSkipped: boolean;
  resources: EarthResourceId[];
  action?: EarthActionId;
  bodyPresenceMarkCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const earthPerceptionDimensions: EarthPerceptionDimension[] = [
  'energy',
  'rest',
  'tension',
  'comfort'
];

export function createEarthBodyProgress(sourceFireCycleId: string, startedAt: string): EarthBodyProgress {
  return {
    id: 'mission_body_arrives_first_v1',
    sourceFireCycleId,
    status: 'active',
    perceptions: {},
    checkInSkipped: false,
    classifications: {},
    classificationSkipped: false,
    resources: [],
    bodyPresenceMarkCreated: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function setEarthPerception(
  progress: EarthBodyProgress,
  dimension: EarthPerceptionDimension,
  level: EarthPerceptionLevel,
  updatedAt: string
): EarthBodyProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    perceptions: { ...progress.perceptions, [dimension]: level },
    checkInSkipped: false,
    updatedAt
  };
}

export function skipEarthBodyCheckIn(progress: EarthBodyProgress, updatedAt: string): EarthBodyProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, perceptions: {}, checkInSkipped: true, updatedAt };
}

export function classifyEarthBodyEntry(
  progress: EarthBodyProgress,
  entryId: string,
  category: EarthBodyCategory,
  updatedAt: string
): EarthBodyProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    classifications: { ...progress.classifications, [entryId]: category },
    classificationSkipped: false,
    updatedAt
  };
}

export function skipEarthBodyClassification(progress: EarthBodyProgress, updatedAt: string): EarthBodyProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, classifications: {}, classificationSkipped: true, updatedAt };
}

export function toggleEarthResource(
  progress: EarthBodyProgress,
  resource: EarthResourceId,
  updatedAt: string
): EarthBodyProgress {
  if (progress.status === 'completed') return progress;

  if (resource === 'none_available') {
    return {
      ...progress,
      resources: progress.resources.includes(resource) ? [] : ['none_available'],
      updatedAt
    };
  }

  const withoutNone = progress.resources.filter((item) => item !== 'none_available');
  const resources = withoutNone.includes(resource)
    ? withoutNone.filter((item) => item !== resource)
    : [...withoutNone, resource];

  return { ...progress, resources, updatedAt };
}

export function setEarthAction(progress: EarthBodyProgress, action: EarthActionId, updatedAt: string): EarthBodyProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, action, updatedAt };
}

export function canCompleteEarthBody(progress: EarthBodyProgress, entryCount: number): boolean {
  const checkInReady = progress.checkInSkipped
    || earthPerceptionDimensions.every((dimension) => Boolean(progress.perceptions[dimension]));
  const classificationReady = progress.classificationSkipped
    || Object.keys(progress.classifications).length === entryCount;

  return Boolean(checkInReady && classificationReady && progress.resources.length > 0 && progress.action);
}

export function completeEarthBody(
  progress: EarthBodyProgress,
  entryCount: number,
  completedAt: string
): EarthBodyProgress {
  if (progress.status === 'completed' || !canCompleteEarthBody(progress, entryCount)) return progress;
  return {
    ...progress,
    status: 'completed',
    bodyPresenceMarkCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
