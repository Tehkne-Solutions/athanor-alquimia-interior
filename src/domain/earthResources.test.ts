import { describe, expect, it } from 'vitest';
import {
  canCompleteEarthResources,
  classifyEarthResourceEntry,
  completeEarthResources,
  createEarthResourcesProgress,
  earthResourceKinds,
  setEarthResourceAvailability,
  setEarthResourceDecision,
  setEarthResourceScope,
  setEarthResourceSubstitution,
  skipEarthResourceClassification
} from './earthResources';

const timestamp = '2026-07-26T02:00:00.000Z';
const entryCount = 8;

function withInventory() {
  let progress = createEarthResourcesProgress('seed-1', timestamp);
  progress = skipEarthResourceClassification(progress, timestamp);
  earthResourceKinds.forEach((kind) => {
    progress = setEarthResourceAvailability(progress, kind, 'available_now', timestamp);
  });
  progress = setEarthResourceSubstitution(progress, 'no_substitute', timestamp);
  progress = setEarthResourceScope(progress, 'keep_scope', timestamp);
  progress = setEarthResourceDecision(progress, 'proceed_with_available', timestamp);
  return progress;
}

describe('earthResources', () => {
  it('cria uma missão vinculada à Semente atual', () => {
    const progress = createEarthResourcesProgress('seed-1', timestamp);
    expect(progress.sourceFirstStepSeedId).toBe('seed-1');
    expect(progress.status).toBe('active');
  });

  it('aceita concluir sem classificar', () => {
    const progress = withInventory();
    expect(canCompleteEarthResources(progress, entryCount)).toBe(true);
  });

  it('aceita classificação completa sem pontuação', () => {
    let progress = createEarthResourcesProgress('seed-1', timestamp);
    for (let index = 0; index < entryCount; index += 1) {
      progress = classifyEarthResourceEntry(progress, `entry-${index}`, 'resource', timestamp);
    }
    earthResourceKinds.forEach((kind) => {
      progress = setEarthResourceAvailability(progress, kind, 'available_later', timestamp);
    });
    progress = setEarthResourceSubstitution(progress, 'no_substitute', timestamp);
    progress = setEarthResourceScope(progress, 'pause_scope', timestamp);
    progress = setEarthResourceDecision(progress, 'wait_for_resource', timestamp);
    expect(canCompleteEarthResources(progress, entryCount)).toBe(true);
  });

  it('bloqueia o uso de substituição quando nenhuma substituição foi escolhida', () => {
    let progress = withInventory();
    progress = setEarthResourceDecision(progress, 'use_substitute', timestamp);
    expect(progress.decision).toBe('proceed_with_available');
  });

  it('exige redução de escopo ao continuar com recurso indisponível', () => {
    let progress = withInventory();
    progress = setEarthResourceAvailability(progress, 'materials', 'unavailable', timestamp);
    expect(canCompleteEarthResources(progress, entryCount)).toBe(false);
    progress = setEarthResourceScope(progress, 'one_unit', timestamp);
    expect(canCompleteEarthResources(progress, entryCount)).toBe(true);
  });

  it('aceita pausar, abandonar ou não agir como conclusões completas', () => {
    for (const decision of ['pause', 'abandon_activity', 'no_action'] as const) {
      let progress = withInventory();
      progress = setEarthResourceScope(progress, 'pause_scope', timestamp);
      progress = setEarthResourceDecision(progress, decision, timestamp);
      expect(completeEarthResources(progress, entryCount, timestamp).possibleResourcesBasketCreated).toBe(true);
    }
  });
});
