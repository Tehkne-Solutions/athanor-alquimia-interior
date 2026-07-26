import { describe, expect, it } from 'vitest';
import {
  canCompleteEarthBody,
  classifyEarthBodyEntry,
  completeEarthBody,
  createEarthBodyProgress,
  earthPerceptionDimensions,
  setEarthAction,
  setEarthPerception,
  skipEarthBodyCheckIn,
  skipEarthBodyClassification,
  toggleEarthResource
} from './earthBody';

const timestamp = '2026-07-26T12:00:00.000Z';

function completePerceptions() {
  return earthPerceptionDimensions.reduce(
    (progress, dimension) => setEarthPerception(progress, dimension, 'moderate', timestamp),
    createEarthBodyProgress('fire-cycle-1', timestamp)
  );
}

describe('earthBody', () => {
  it('cria uma missão isolada pelo ciclo do Fogo', () => {
    const progress = createEarthBodyProgress('fire-cycle-1', timestamp);
    expect(progress.sourceFireCycleId).toBe('fire-cycle-1');
    expect(progress.status).toBe('active');
    expect(progress.bodyPresenceMarkCreated).toBe(false);
  });

  it('aceita recusar completamente o check-in corporal', () => {
    const progress = skipEarthBodyCheckIn(createEarthBodyProgress('fire-cycle-1', timestamp), timestamp);
    expect(progress.checkInSkipped).toBe(true);
    expect(progress.perceptions).toEqual({});
  });

  it('exige as quatro dimensões quando o check-in não é recusado', () => {
    let progress = createEarthBodyProgress('fire-cycle-1', timestamp);
    progress = setEarthPerception(progress, 'energy', 'low', timestamp);
    progress = skipEarthBodyClassification(progress, timestamp);
    progress = toggleEarthResource(progress, 'time', timestamp);
    progress = setEarthAction(progress, 'brief_pause', timestamp);
    expect(canCompleteEarthBody(progress, 8)).toBe(false);
  });

  it('mantém nenhum recurso disponível como escolha exclusiva', () => {
    let progress = toggleEarthResource(createEarthBodyProgress('fire-cycle-1', timestamp), 'water', timestamp);
    progress = toggleEarthResource(progress, 'none_available', timestamp);
    expect(progress.resources).toEqual(['none_available']);
    progress = toggleEarthResource(progress, 'time', timestamp);
    expect(progress.resources).toEqual(['time']);
  });

  it('aceita recusar o classificador e escolher nenhuma ação', () => {
    let progress = skipEarthBodyCheckIn(createEarthBodyProgress('fire-cycle-1', timestamp), timestamp);
    progress = skipEarthBodyClassification(progress, timestamp);
    progress = toggleEarthResource(progress, 'none_available', timestamp);
    progress = setEarthAction(progress, 'no_action', timestamp);
    expect(canCompleteEarthBody(progress, 8)).toBe(true);
    expect(completeEarthBody(progress, 8, timestamp).bodyPresenceMarkCreated).toBe(true);
  });

  it('cria a Marca somente com classificação completa ou recusada', () => {
    let progress = completePerceptions();
    progress = toggleEarthResource(progress, 'place_to_rest', timestamp);
    progress = setEarthAction(progress, 'rest_now', timestamp);
    expect(completeEarthBody(progress, 8, timestamp).status).toBe('active');
    for (let index = 0; index < 8; index += 1) {
      progress = classifyEarthBodyEntry(progress, `entry-${index}`, 'perceived_signal', timestamp);
    }
    const completed = completeEarthBody(progress, 8, timestamp);
    expect(completed.status).toBe('completed');
    expect(completed.bodyPresenceMarkCreated).toBe(true);
  });
});
