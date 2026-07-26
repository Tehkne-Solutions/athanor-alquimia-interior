import { describe, expect, it } from 'vitest';
import {
  canCraftSpiritOrb,
  configureSpiritOrb,
  craftSpiritOrb,
  createSpiritOrbProgress,
  positionSpiritOrb,
  requestSpiritOrbReview,
  resumeSpiritOrb,
  reviewSpiritOrb
} from './spiritOrb';

const configured = () => configureSpiritOrb(createSpiritOrbProgress('return-key-1', '2026-07-26T00:00:00.000Z'), {
  function: 'hold_parts_together',
  visibleDimension: 'word',
  disagreement: 'preserved',
  decision: 'provisional',
  returnMode: 'available',
  reviewWindow: 'when_context_changes'
}, '2026-07-26T00:01:00.000Z');

describe('SpiritOrb', () => {
  it('does not craft with an incomplete formula', () => {
    const progress = createSpiritOrbProgress('return-key-1', '2026-07-26T00:00:00.000Z');
    expect(canCraftSpiritOrb(progress)).toBe(false);
    expect(craftSpiritOrb(progress, '2026-07-26T00:02:00.000Z').orbCreated).toBe(false);
  });

  it('accepts no visible dimension, no decision and no return', () => {
    const progress = configureSpiritOrb(createSpiritOrbProgress('return-key-1', '2026-07-26T00:00:00.000Z'), {
      function: 'no_external_action',
      visibleDimension: 'none_visible',
      disagreement: 'unknown',
      decision: 'none',
      returnMode: 'none',
      reviewWindow: 'when_ready'
    }, '2026-07-26T00:01:00.000Z');
    expect(canCraftSpiritOrb(progress)).toBe(true);
    expect(craftSpiritOrb(progress, '2026-07-26T00:02:00.000Z').status).toBe('active');
  });

  it('requires explicit review before integration', () => {
    const active = craftSpiritOrb(configured(), '2026-07-26T00:02:00.000Z');
    expect(reviewSpiritOrb(active, 'integrated', '2026-07-26T00:03:00.000Z').status).toBe('active');
    const awaiting = requestSpiritOrbReview(active, '2026-07-26T00:03:00.000Z');
    expect(reviewSpiritOrb(awaiting, 'integrated', '2026-07-26T00:04:00.000Z').status).toBe('integrated');
  });

  it('keeps the recipe when placed at rest and resumed', () => {
    const active = craftSpiritOrb(configured(), '2026-07-26T00:02:00.000Z');
    const awaiting = requestSpiritOrbReview(active, '2026-07-26T00:03:00.000Z');
    const resting = reviewSpiritOrb(awaiting, 'resting', '2026-07-26T00:04:00.000Z', '  preservar o conjunto  ');
    expect(resting.status).toBe('resting');
    expect(resting.reflection).toBe('preservar o conjunto');
    const resumed = resumeSpiritOrb(resting, '2026-07-26T00:05:00.000Z');
    expect(resumed.status).toBe('adjusted');
    expect(resumed.function).toBe('hold_parts_together');
  });

  it('does not position an orb before integration', () => {
    const active = craftSpiritOrb(configured(), '2026-07-26T00:02:00.000Z');
    expect(positionSpiritOrb(active, '2026-07-26T00:03:00.000Z').positioned).toBe(false);
  });

  it('positions only an integrated orb', () => {
    const active = craftSpiritOrb(configured(), '2026-07-26T00:02:00.000Z');
    const awaiting = requestSpiritOrbReview(active, '2026-07-26T00:03:00.000Z');
    const integrated = reviewSpiritOrb(awaiting, 'integrated', '2026-07-26T00:04:00.000Z');
    const positioned = positionSpiritOrb(integrated, '2026-07-26T00:05:00.000Z');
    expect(positioned.positioned).toBe(true);
    expect(positioned.status).toBe('integrated');
  });
});
