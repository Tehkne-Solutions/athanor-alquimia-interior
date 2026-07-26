import { describe, expect, it } from 'vitest';
import {
  canCompleteSpiritChapter,
  completeSpiritChapter,
  createSpiritChapterProgress,
  selectSpiritChapterDestination,
  setSpiritChapterNote,
  spiritChapterMissionIds,
  summarizeSpiritChapter
} from './spiritChapter';

const startedAt = '2026-07-26T19:50:00.000Z';

function completeDestinations() {
  return spiritChapterMissionIds.reduce((progress, missionId, index) => selectSpiritChapterDestination(
    progress,
    missionId,
    index === 0 ? 'preserve' : index === 1 ? 'rest' : 'archive',
    startedAt
  ), createSpiritChapterProgress('orb-1', startedAt));
}

describe('spirit chapter cycle', () => {
  it('starts without ranking or destinations', () => {
    const progress = createSpiritChapterProgress('orb-1', startedAt);
    expect(progress.status).toBe('reviewing');
    expect(progress.destinations).toEqual({});
    expect(canCompleteSpiritChapter(progress)).toBe(false);
  });

  it('requires one destination for every practice', () => {
    const progress = completeDestinations();
    expect(canCompleteSpiritChapter(progress)).toBe(true);
  });

  it('summarizes equally valid destinations', () => {
    expect(summarizeSpiritChapter(completeDestinations())).toEqual({ preserve: 1, rest: 1, archive: 3 });
  });

  it('stores an optional local note', () => {
    const progress = setSpiritChapterNote(createSpiritChapterProgress('orb-1', startedAt), '  lembrar sem condenar  ', startedAt);
    expect(progress.note).toBe('lembrar sem condenar');
  });

  it('registers the cycle only after every destination exists', () => {
    const incomplete = completeSpiritChapter(createSpiritChapterProgress('orb-1', startedAt), startedAt, 'cycle-1');
    expect(incomplete.status).toBe('reviewing');

    const completed = completeSpiritChapter(completeDestinations(), startedAt, 'cycle-1');
    expect(completed.status).toBe('completed');
    expect(completed.cycleId).toBe('cycle-1');
  });

  it('does not mutate a completed cycle', () => {
    const completed = completeSpiritChapter(completeDestinations(), startedAt, 'cycle-1');
    const changed = selectSpiritChapterDestination(completed, 'thread_that_gathers', 'rest', startedAt);
    expect(changed).toBe(completed);
  });
});
