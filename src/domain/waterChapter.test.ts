import { describe, expect, it } from 'vitest';
import {
  canCompleteWaterChapter,
  completeWaterChapter,
  createWaterChapterProgress,
  selectWaterChapterDestination,
  setWaterChapterNote,
  summarizeWaterChapter,
  waterChapterMissionIds
} from './waterChapter';

describe('water chapter completion', () => {
  it('starts without assuming a destination for any mission', () => {
    const progress = createWaterChapterProgress('journey-1', '2026-07-25T10:00:00.000Z');
    expect(progress.status).toBe('reviewing');
    expect(progress.destinations).toEqual({});
    expect(canCompleteWaterChapter(progress)).toBe(false);
  });

  it('requires a destination for all four missions', () => {
    let progress = createWaterChapterProgress('journey-1', 'start');
    progress = selectWaterChapterDestination(progress, 'name_the_waters', 'preserve', 't1');
    progress = selectWaterChapterDestination(progress, 'voice_of_lament', 'rest', 't2');
    progress = selectWaterChapterDestination(progress, 'mirror_of_memories', 'archive', 't3');
    expect(canCompleteWaterChapter(progress)).toBe(false);
    progress = selectWaterChapterDestination(progress, 'space_of_trust', 'preserve', 't4');
    expect(canCompleteWaterChapter(progress)).toBe(true);
  });

  it('stores an optional local note without requiring it', () => {
    const progress = createWaterChapterProgress('journey-1', 'start');
    expect(setWaterChapterNote(progress, '   ', 't1').note).toBeUndefined();
    expect(setWaterChapterNote(progress, 'Preservar o que foi útil.', 't2').note).toBe('Preservar o que foi útil.');
  });

  it('summarizes destinations without ranking them', () => {
    let progress = createWaterChapterProgress('journey-1', 'start');
    const destinations = ['preserve', 'rest', 'archive', 'preserve'] as const;
    waterChapterMissionIds.forEach((missionId, index) => {
      progress = selectWaterChapterDestination(progress, missionId, destinations[index], `t${index}`);
    });
    expect(summarizeWaterChapter(progress)).toEqual({ preserve: 2, rest: 1, archive: 1 });
  });

  it('records a completed cycle only after the review is complete', () => {
    let progress = createWaterChapterProgress('journey-1', 'start');
    expect(completeWaterChapter(progress, 'done', 'cycle-1').status).toBe('reviewing');
    waterChapterMissionIds.forEach((missionId) => {
      progress = selectWaterChapterDestination(progress, missionId, 'preserve', 'update');
    });
    const completed = completeWaterChapter(progress, 'done', 'cycle-1');
    expect(completed.status).toBe('completed');
    expect(completed.cycleId).toBe('cycle-1');
    expect(completed.completedAt).toBe('done');
  });
});
