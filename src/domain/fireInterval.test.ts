import { describe, expect, it } from 'vitest';
import {
  canCompleteFireInterval,
  classifyTimelineEntry,
  classifyUrgencyEntry,
  completeFireInterval,
  createFireIntervalProgress
} from './fireInterval';

const startedAt = '2026-07-25T21:10:00.000Z';

function readyProgress() {
  let progress = createFireIntervalProgress('named-flame-cycle-1', startedAt);
  progress = classifyTimelineEntry(progress, 'timeline-1', 'trigger', startedAt);
  progress = classifyUrgencyEntry(progress, 'urgency-1', 'perceived_pressure', startedAt);
  return {
    ...progress,
    interval: 'one_minute' as const,
    exit: 'no_action' as const
  };
}

describe('fire interval domain', () => {
  it('starts without interpreting a real conflict', () => {
    const progress = createFireIntervalProgress('named-flame-cycle-1', startedAt);
    expect(progress.status).toBe('active');
    expect(progress.timeline).toEqual({});
    expect(progress.urgency).toEqual({});
    expect(progress.intervalEmberCreated).toBe(false);
  });

  it('keeps classifications didactic and editable', () => {
    const initial = createFireIntervalProgress('named-flame-cycle-1', startedAt);
    const timeline = classifyTimelineEntry(initial, 'timeline-1', 'impulse', startedAt);
    const urgency = classifyUrgencyEntry(timeline, 'urgency-1', 'time_sensitive', startedAt);
    expect(urgency.timeline['timeline-1']).toBe('impulse');
    expect(urgency.urgency['urgency-1']).toBe('time_sensitive');
  });

  it('does not complete without interval and exit', () => {
    const progress = createFireIntervalProgress('named-flame-cycle-1', startedAt);
    expect(canCompleteFireInterval(progress, 0, 0)).toBe(false);
  });

  it('accepts refusal of both classifiers', () => {
    const progress = {
      ...createFireIntervalProgress('named-flame-cycle-1', startedAt),
      timelineSkipped: true,
      urgencySkipped: true,
      interval: 'no_interval' as const,
      exit: 'no_action' as const
    };
    expect(canCompleteFireInterval(progress, 8, 8)).toBe(true);
  });

  it('creates the Brasa do Intervalo only after all required choices', () => {
    const result = completeFireInterval(readyProgress(), 1, 1, startedAt);
    expect(result.status).toBe('completed');
    expect(result.intervalEmberCreated).toBe(true);
  });

  it('preserves no action as a valid safe exit', () => {
    const result = completeFireInterval(readyProgress(), 1, 1, startedAt);
    expect(result.exit).toBe('no_action');
  });
});
