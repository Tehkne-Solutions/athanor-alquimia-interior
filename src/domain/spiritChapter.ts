export type SpiritChapterMissionId =
  | 'thread_that_gathers'
  | 'center_without_erasing'
  | 'council_of_parts'
  | 'decision_remains_open'
  | 'return_without_condemnation';

export type SpiritChapterDestination = 'preserve' | 'rest' | 'archive';
export type SpiritChapterStatus = 'reviewing' | 'completed';

export const spiritChapterMissionIds: SpiritChapterMissionId[] = [
  'thread_that_gathers',
  'center_without_erasing',
  'council_of_parts',
  'decision_remains_open',
  'return_without_condemnation'
];

export interface SpiritChapterProgress {
  id: 'spirit_chapter_cycle_v1';
  sourceOrbId: string;
  status: SpiritChapterStatus;
  destinations: Partial<Record<SpiritChapterMissionId, SpiritChapterDestination>>;
  note?: string;
  cycleId?: string;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface SpiritChapterSummary {
  preserve: number;
  rest: number;
  archive: number;
}

export function createSpiritChapterProgress(sourceOrbId: string, startedAt: string): SpiritChapterProgress {
  return {
    id: 'spirit_chapter_cycle_v1',
    sourceOrbId,
    status: 'reviewing',
    destinations: {},
    startedAt,
    updatedAt: startedAt
  };
}

export function selectSpiritChapterDestination(
  progress: SpiritChapterProgress,
  missionId: SpiritChapterMissionId,
  destination: SpiritChapterDestination,
  updatedAt: string
): SpiritChapterProgress {
  if (progress.status === 'completed') return progress;
  return {
    ...progress,
    destinations: { ...progress.destinations, [missionId]: destination },
    updatedAt
  };
}

export function setSpiritChapterNote(
  progress: SpiritChapterProgress,
  note: string,
  updatedAt: string
): SpiritChapterProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, note: note.trim() || undefined, updatedAt };
}

export function canCompleteSpiritChapter(progress: SpiritChapterProgress): boolean {
  return spiritChapterMissionIds.every((missionId) => Boolean(progress.destinations[missionId]));
}

export function summarizeSpiritChapter(progress: SpiritChapterProgress): SpiritChapterSummary {
  return spiritChapterMissionIds.reduce<SpiritChapterSummary>((summary, missionId) => {
    const destination = progress.destinations[missionId];
    if (destination) summary[destination] += 1;
    return summary;
  }, { preserve: 0, rest: 0, archive: 0 });
}

export function completeSpiritChapter(
  progress: SpiritChapterProgress,
  completedAt: string,
  cycleId: string
): SpiritChapterProgress {
  if (!canCompleteSpiritChapter(progress) || progress.status === 'completed') return progress;
  return {
    ...progress,
    status: 'completed',
    cycleId,
    completedAt,
    updatedAt: completedAt
  };
}
