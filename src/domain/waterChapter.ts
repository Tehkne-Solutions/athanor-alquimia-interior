export type WaterChapterMissionId =
  | 'name_the_waters'
  | 'voice_of_lament'
  | 'mirror_of_memories'
  | 'space_of_trust';

export type WaterChapterDestination = 'preserve' | 'rest' | 'archive';
export type WaterChapterStatus = 'reviewing' | 'completed';

export const waterChapterMissionIds: WaterChapterMissionId[] = [
  'name_the_waters',
  'voice_of_lament',
  'mirror_of_memories',
  'space_of_trust'
];

export interface WaterChapterProgress {
  id: 'water_chapter_cycle_v1';
  journeyStartedAt: string;
  status: WaterChapterStatus;
  destinations: Partial<Record<WaterChapterMissionId, WaterChapterDestination>>;
  note?: string;
  cycleId?: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface WaterChapterSummary {
  preserve: number;
  rest: number;
  archive: number;
}

export function createWaterChapterProgress(journeyStartedAt: string, startedAt: string): WaterChapterProgress {
  return {
    id: 'water_chapter_cycle_v1',
    journeyStartedAt,
    status: 'reviewing',
    destinations: {},
    startedAt,
    updatedAt: startedAt
  };
}

export function selectWaterChapterDestination(
  progress: WaterChapterProgress,
  missionId: WaterChapterMissionId,
  destination: WaterChapterDestination,
  updatedAt: string
): WaterChapterProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    destinations: { ...progress.destinations, [missionId]: destination },
    updatedAt
  };
}

export function setWaterChapterNote(
  progress: WaterChapterProgress,
  note: string,
  updatedAt: string
): WaterChapterProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, note: note.trim() || undefined, updatedAt };
}

export function canCompleteWaterChapter(progress: WaterChapterProgress): boolean {
  return waterChapterMissionIds.every((missionId) => Boolean(progress.destinations[missionId]));
}

export function summarizeWaterChapter(progress: WaterChapterProgress): WaterChapterSummary {
  return waterChapterMissionIds.reduce<WaterChapterSummary>((summary, missionId) => {
    const destination = progress.destinations[missionId];
    if (destination) summary[destination] += 1;
    return summary;
  }, { preserve: 0, rest: 0, archive: 0 });
}

export function completeWaterChapter(
  progress: WaterChapterProgress,
  completedAt: string,
  cycleId: string
): WaterChapterProgress {
  if (!canCompleteWaterChapter(progress) || progress.status === 'completed') return progress;
  return {
    ...progress,
    status: 'completed',
    cycleId,
    completedAt,
    updatedAt: completedAt
  };
}
