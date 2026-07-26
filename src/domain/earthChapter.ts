export type EarthChapterMissionId =
  | 'body_arrives_first'
  | 'work_that_fits_today'
  | 'house_of_resources'
  | 'sustainable_rhythm'
  | 'order_that_serves';

export type EarthChapterDestination = 'preserve' | 'rest' | 'archive';
export type EarthChapterStatus = 'reviewing' | 'completed';

export const earthChapterMissionIds: EarthChapterMissionId[] = [
  'body_arrives_first',
  'work_that_fits_today',
  'house_of_resources',
  'sustainable_rhythm',
  'order_that_serves'
];

export interface EarthChapterProgress {
  id: 'earth_chapter_cycle_v1';
  sourceStoneId: string;
  status: EarthChapterStatus;
  destinations: Partial<Record<EarthChapterMissionId, EarthChapterDestination>>;
  note?: string;
  cycleId?: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface EarthChapterSummary {
  preserve: number;
  rest: number;
  archive: number;
}

export function createEarthChapterProgress(sourceStoneId: string, startedAt: string): EarthChapterProgress {
  return {
    id: 'earth_chapter_cycle_v1',
    sourceStoneId,
    status: 'reviewing',
    destinations: {},
    startedAt,
    updatedAt: startedAt
  };
}

export function selectEarthChapterDestination(
  progress: EarthChapterProgress,
  missionId: EarthChapterMissionId,
  destination: EarthChapterDestination,
  updatedAt: string
): EarthChapterProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    destinations: { ...progress.destinations, [missionId]: destination },
    updatedAt
  };
}

export function setEarthChapterNote(
  progress: EarthChapterProgress,
  note: string,
  updatedAt: string
): EarthChapterProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, note: note.trim() || undefined, updatedAt };
}

export function canCompleteEarthChapter(progress: EarthChapterProgress): boolean {
  return earthChapterMissionIds.every((missionId) => Boolean(progress.destinations[missionId]));
}

export function summarizeEarthChapter(progress: EarthChapterProgress): EarthChapterSummary {
  return earthChapterMissionIds.reduce<EarthChapterSummary>((summary, missionId) => {
    const destination = progress.destinations[missionId];
    if (destination) summary[destination] += 1;
    return summary;
  }, { preserve: 0, rest: 0, archive: 0 });
}

export function completeEarthChapter(
  progress: EarthChapterProgress,
  completedAt: string,
  cycleId: string
): EarthChapterProgress {
  if (!canCompleteEarthChapter(progress) || progress.status === 'completed') return progress;
  return {
    ...progress,
    status: 'completed',
    cycleId,
    completedAt,
    updatedAt: completedAt
  };
}
