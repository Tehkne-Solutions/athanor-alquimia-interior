import { describe, expect, it } from 'vitest';
import {
  canRegisterNewWork,
  createContinuousJourneyProgress,
  registerNewWork,
  selectContinuousMode,
  selectContinuousStartPoint
} from './continuousJourney';

const startedAt = '2026-07-26T20:00:00.000Z';

describe('continuous temple mode', () => {
  it('starts with preserved history and no automatic restart', () => {
    const progress = createContinuousJourneyProgress('spirit-cycle-1', startedAt);
    expect(progress.records).toEqual([]);
    expect(canRegisterNewWork(progress)).toBe(false);
  });

  it('registers a revisitable starting point without deleting prior records', () => {
    let progress = createContinuousJourneyProgress('spirit-cycle-1', startedAt);
    progress = selectContinuousStartPoint(progress, 'water', startedAt);
    progress = selectContinuousMode(progress, 'revisit_practice', startedAt);
    progress = registerNewWork(progress, 'work-1', startedAt);
    expect(progress.records).toHaveLength(1);
    expect(progress.records[0].startPoint).toBe('water');
    expect(progress.selectedStartPoint).toBeUndefined();
  });

  it('allows multiple future works while preserving earlier records', () => {
    let progress = createContinuousJourneyProgress('spirit-cycle-1', startedAt);
    progress = selectContinuousStartPoint(progress, 'word', startedAt);
    progress = selectContinuousMode(progress, 'open_new_cycle', startedAt);
    progress = registerNewWork(progress, 'work-1', startedAt);
    progress = selectContinuousStartPoint(progress, 'earth', startedAt);
    progress = selectContinuousMode(progress, 'observe_only', startedAt);
    progress = registerNewWork(progress, 'work-2', startedAt);
    expect(progress.records.map((record) => record.id)).toEqual(['work-1', 'work-2']);
  });

  it('maps rest to a non-starting mode automatically', () => {
    let progress = createContinuousJourneyProgress('spirit-cycle-1', startedAt);
    progress = selectContinuousStartPoint(progress, 'rest', startedAt);
    expect(progress.selectedMode).toBe('rest_without_start');
    expect(canRegisterNewWork(progress)).toBe(true);
  });

  it('blocks rest mode for an elemental starting point', () => {
    let progress = createContinuousJourneyProgress('spirit-cycle-1', startedAt);
    progress = selectContinuousStartPoint(progress, 'fire', startedAt);
    progress = selectContinuousMode(progress, 'rest_without_start', startedAt);
    expect(progress.selectedMode).toBeUndefined();
  });

  it('keeps the draft unchanged when registration is incomplete', () => {
    const progress = selectContinuousStartPoint(createContinuousJourneyProgress('spirit-cycle-1', startedAt), 'spirit', startedAt);
    expect(registerNewWork(progress, 'work-1', startedAt)).toBe(progress);
  });
});
