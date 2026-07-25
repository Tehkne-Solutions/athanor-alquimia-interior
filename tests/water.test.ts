import { describe, expect, it } from 'vitest';
import {
  canCompleteWaterNaming,
  completeWaterNaming,
  createEmptyWaterCheckIn,
  toggleWaterEmotion
} from '../src/domain/water';
import type { WaterJourneyProgress } from '../src/domain/types';

describe('water journey domain', () => {
  it('allows multiple emotions without assigning a moral score', () => {
    const first = toggleWaterEmotion(createEmptyWaterCheckIn(), 'sadness');
    const second = toggleWaterEmotion(first, 'hope');

    expect(second.emotions).toEqual(['sadness', 'hope']);
    expect(canCompleteWaterNaming(second)).toBe(true);
  });

  it('allows the check-in to be skipped', () => {
    const checkIn = { ...createEmptyWaterCheckIn(), skipped: true };

    expect(canCompleteWaterNaming(checkIn)).toBe(true);
  });

  it('does not complete an empty non-skipped check-in', () => {
    const journey: WaterJourneyProgress = {
      id: 'mission_name_waters_v1',
      status: 'active',
      checkIn: createEmptyWaterCheckIn(),
      namedDropCreated: false,
      startedAt: '2026-07-25T10:00:00.000Z',
      updatedAt: '2026-07-25T10:00:00.000Z'
    };

    expect(completeWaterNaming(journey, '2026-07-25T10:10:00.000Z')).toEqual(journey);
  });

  it('creates the Named Drop after a valid recognition practice', () => {
    const journey: WaterJourneyProgress = {
      id: 'mission_name_waters_v1',
      status: 'active',
      checkIn: toggleWaterEmotion(createEmptyWaterCheckIn(), 'confusion'),
      namedDropCreated: false,
      startedAt: '2026-07-25T10:00:00.000Z',
      updatedAt: '2026-07-25T10:00:00.000Z'
    };

    const result = completeWaterNaming(journey, '2026-07-25T10:10:00.000Z');

    expect(result.status).toBe('named');
    expect(result.namedDropCreated).toBe(true);
    expect(result.completedAt).toBe('2026-07-25T10:10:00.000Z');
  });
});
