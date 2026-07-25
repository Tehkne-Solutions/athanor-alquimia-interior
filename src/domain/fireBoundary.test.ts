import { describe, expect, it } from 'vitest';
import {
  canCompleteFireBoundary,
  classifyBoundaryStatement,
  completeFireBoundary,
  createFireBoundaryProgress
} from './fireBoundary';

const createdAt = '2026-07-25T22:10:00.000Z';
const completedAt = '2026-07-25T22:20:00.000Z';

function readyProgress() {
  return {
    ...createFireBoundaryProgress('interval-ember-cycle-1', createdAt),
    classifications: {
      a: 'boundary' as const,
      b: 'control' as const,
      c: 'punishment' as const
    },
    scope: 'conversation' as const,
    condition: 'raised_voice' as const,
    action: 'pause_conversation' as const,
    duration: 'this_interaction' as const,
    review: 'review_in_24h' as const
  };
}

describe('fire boundary mission', () => {
  it('starts without creating a plate', () => {
    const progress = createFireBoundaryProgress('interval-ember-cycle-1', createdAt);
    expect(progress.status).toBe('active');
    expect(progress.boundaryPlateCreated).toBe(false);
  });

  it('classifies fictional statements without completing the mission', () => {
    const progress = createFireBoundaryProgress('interval-ember-cycle-1', createdAt);
    const next = classifyBoundaryStatement(progress, 'a', 'boundary', completedAt);
    expect(next.classifications.a).toBe('boundary');
    expect(next.status).toBe('active');
  });

  it('requires the five-part boundary architecture', () => {
    const progress = readyProgress();
    expect(canCompleteFireBoundary(progress, 3)).toBe(true);
    expect(canCompleteFireBoundary({ ...progress, review: undefined }, 3)).toBe(false);
  });

  it('allows the educational classifier to be skipped', () => {
    const progress = {
      ...readyProgress(),
      classifications: {},
      classificationSkipped: true
    };
    expect(canCompleteFireBoundary(progress, 3)).toBe(true);
  });

  it('accepts no action as a valid first-person choice', () => {
    const progress = { ...readyProgress(), action: 'no_action' as const };
    expect(canCompleteFireBoundary(progress, 3)).toBe(true);
  });

  it('creates the boundary plate only after completion', () => {
    const result = completeFireBoundary(readyProgress(), 3, completedAt);
    expect(result.status).toBe('completed');
    expect(result.boundaryPlateCreated).toBe(true);
    expect(result.completedAt).toBe(completedAt);
  });
});
