export type WaterMemoryCategory =
  | 'memory'
  | 'present_sensation'
  | 'prediction'
  | 'need'
  | 'action';

export type WaterMemoryStatus = 'active' | 'completed';

export type WaterPresenceAnchor =
  | 'color'
  | 'sound'
  | 'support'
  | 'texture'
  | 'object';

export interface WaterMemoryEntry {
  id: string;
  text: string;
  suggestedCategory: WaterMemoryCategory;
  explanation: string;
}

export interface WaterMemoryProgress {
  id: 'mission_mirror_of_memories_v1';
  journeyStartedAt: string;
  status: WaterMemoryStatus;
  classifications: Record<string, WaterMemoryCategory>;
  presenceAnchors: WaterPresenceAnchor[];
  skipped: boolean;
  mirrorCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface WaterMemoryEvaluation {
  total: number;
  classified: number;
  aligned: number;
  differences: {
    entryId: string;
    selected: WaterMemoryCategory;
    suggested: WaterMemoryCategory;
  }[];
}

export const waterMemoryCategories: WaterMemoryCategory[] = [
  'memory',
  'present_sensation',
  'prediction',
  'need',
  'action'
];

export function createWaterMemoryProgress(journeyStartedAt: string, startedAt: string): WaterMemoryProgress {
  return {
    id: 'mission_mirror_of_memories_v1',
    journeyStartedAt,
    status: 'active',
    classifications: {},
    presenceAnchors: [],
    skipped: false,
    mirrorCreated: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function classifyWaterMemoryEntry(
  progress: WaterMemoryProgress,
  entryId: string,
  category: WaterMemoryCategory,
  updatedAt: string
): WaterMemoryProgress {
  return {
    ...progress,
    classifications: { ...progress.classifications, [entryId]: category },
    skipped: false,
    updatedAt
  };
}

export function toggleWaterPresenceAnchor(
  progress: WaterMemoryProgress,
  anchor: WaterPresenceAnchor,
  updatedAt: string
): WaterMemoryProgress {
  const presenceAnchors = progress.presenceAnchors.includes(anchor)
    ? progress.presenceAnchors.filter((candidate) => candidate !== anchor)
    : [...progress.presenceAnchors, anchor];

  return { ...progress, presenceAnchors, updatedAt };
}

export function skipWaterMemoryExercise(progress: WaterMemoryProgress, updatedAt: string): WaterMemoryProgress {
  return {
    ...progress,
    classifications: {},
    presenceAnchors: [],
    skipped: true,
    updatedAt
  };
}

export function canCompleteWaterMemory(progress: WaterMemoryProgress, entries: WaterMemoryEntry[]): boolean {
  return progress.skipped || entries.every((entry) => Boolean(progress.classifications[entry.id]));
}

export function evaluateWaterMemory(
  progress: WaterMemoryProgress,
  entries: WaterMemoryEntry[]
): WaterMemoryEvaluation {
  const differences: WaterMemoryEvaluation['differences'] = [];
  let aligned = 0;
  let classified = 0;

  for (const entry of entries) {
    const selected = progress.classifications[entry.id];
    if (!selected) continue;
    classified += 1;
    if (selected === entry.suggestedCategory) {
      aligned += 1;
    } else {
      differences.push({ entryId: entry.id, selected, suggested: entry.suggestedCategory });
    }
  }

  return { total: entries.length, classified, aligned, differences };
}

export function completeWaterMemory(
  progress: WaterMemoryProgress,
  entries: WaterMemoryEntry[],
  completedAt: string
): WaterMemoryProgress {
  if (!canCompleteWaterMemory(progress, entries)) return progress;

  return {
    ...progress,
    status: 'completed',
    mirrorCreated: true,
    completedAt,
    updatedAt: completedAt
  };
}
