export type FireChapterMissionId =
  | 'name_the_flame'
  | 'before_the_gesture'
  | 'limit_that_protects'
  | 'proportional_courage'
  | 'what_needs_transformation';

export type FireChapterDestination = 'preserve' | 'rest' | 'archive';
export type FireChapterStatus = 'reviewing' | 'completed';

export const fireChapterMissionIds: FireChapterMissionId[] = [
  'name_the_flame',
  'before_the_gesture',
  'limit_that_protects',
  'proportional_courage',
  'what_needs_transformation'
];

export interface FireChapterProgress {
  id: 'fire_chapter_cycle_v1';
  sourceShieldId: string;
  status: FireChapterStatus;
  destinations: Partial<Record<FireChapterMissionId, FireChapterDestination>>;
  note?: string;
  cycleId?: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface FireChapterSummary {
  preserve: number;
  rest: number;
  archive: number;
}

export function createFireChapterProgress(sourceShieldId: string, startedAt: string): FireChapterProgress {
  return {
    id: 'fire_chapter_cycle_v1',
    sourceShieldId,
    status: 'reviewing',
    destinations: {},
    startedAt,
    updatedAt: startedAt
  };
}

export function selectFireChapterDestination(
  progress: FireChapterProgress,
  missionId: FireChapterMissionId,
  destination: FireChapterDestination,
  updatedAt: string
): FireChapterProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    destinations: { ...progress.destinations, [missionId]: destination },
    updatedAt
  };
}

export function setFireChapterNote(
  progress: FireChapterProgress,
  note: string,
  updatedAt: string
): FireChapterProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, note: note.trim() || undefined, updatedAt };
}

export function canCompleteFireChapter(progress: FireChapterProgress): boolean {
  return fireChapterMissionIds.every((missionId) => Boolean(progress.destinations[missionId]));
}

export function summarizeFireChapter(progress: FireChapterProgress): FireChapterSummary {
  return fireChapterMissionIds.reduce<FireChapterSummary>((summary, missionId) => {
    const destination = progress.destinations[missionId];
    if (destination) summary[destination] += 1;
    return summary;
  }, { preserve: 0, rest: 0, archive: 0 });
}

export function completeFireChapter(
  progress: FireChapterProgress,
  completedAt: string,
  cycleId: string
): FireChapterProgress {
  if (!canCompleteFireChapter(progress) || progress.status === 'completed') return progress;
  return {
    ...progress,
    status: 'completed',
    cycleId,
    completedAt,
    updatedAt: completedAt
  };
}
