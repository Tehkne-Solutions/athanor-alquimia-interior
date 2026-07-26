import { describe, expect, it } from 'vitest';
import {
  canCompleteSpiritThread,
  classifySpiritThreadEntry,
  completeSpiritThread,
  createSpiritThreadProgress,
  declineSpiritSynthesis,
  selectSpiritScenario,
  setSpiritDimensionState,
  setSpiritRelation,
  setSpiritThreadDecision,
  skipSpiritThreadClassification,
  spiritDimensions
} from './spiritThread';

const timestamp = '2026-07-26T12:00:00.000Z';
const entryCount = 10;

function completeFictionalSynthesis() {
  let progress = createSpiritThreadProgress('earth-cycle-1', timestamp);
  progress = skipSpiritThreadClassification(progress, timestamp);
  progress = selectSpiritScenario(progress, 'spirit-scenario-01', timestamp);
  for (const dimension of spiritDimensions) {
    progress = setSpiritDimensionState(progress, dimension, 'considered', timestamp);
  }
  progress = setSpiritRelation(progress, 'mixed', timestamp);
  progress = setSpiritThreadDecision(progress, 'pause', timestamp);
  return progress;
}

describe('spiritThread', () => {
  it('cria uma missão vazia vinculada ao ciclo da Terra', () => {
    const progress = createSpiritThreadProgress('earth-cycle-1', timestamp);
    expect(progress.sourceEarthCycleId).toBe('earth-cycle-1');
    expect(progress.status).toBe('active');
    expect(canCompleteSpiritThread(progress, entryCount)).toBe(false);
  });

  it('aceita classificação didática completa', () => {
    let progress = createSpiritThreadProgress('earth-cycle-1', timestamp);
    for (let index = 0; index < entryCount; index += 1) {
      progress = classifySpiritThreadEntry(progress, `entry-${index}`, 'word', timestamp);
    }
    progress = selectSpiritScenario(progress, 'spirit-scenario-01', timestamp);
    for (const dimension of spiritDimensions) {
      progress = setSpiritDimensionState(progress, dimension, 'considered', timestamp);
    }
    progress = setSpiritRelation(progress, 'aligned', timestamp);
    progress = setSpiritThreadDecision(progress, 'observe', timestamp);
    expect(canCompleteSpiritThread(progress, entryCount)).toBe(true);
  });

  it('permite qualquer dimensão como desconhecida', () => {
    let progress = completeFictionalSynthesis();
    progress = setSpiritDimensionState(progress, 'emotion', 'unknown', timestamp);
    progress = setSpiritDimensionState(progress, 'body', 'unknown', timestamp);
    expect(canCompleteSpiritThread(progress, entryCount)).toBe(true);
  });

  it('não exige concordância entre as dimensões', () => {
    const progress = completeFictionalSynthesis();
    expect(progress.relation).toBe('mixed');
    expect(canCompleteSpiritThread(progress, entryCount)).toBe(true);
  });

  it('aceita recusa integral como conclusão completa', () => {
    let progress = createSpiritThreadProgress('earth-cycle-1', timestamp);
    progress = skipSpiritThreadClassification(progress, timestamp);
    progress = declineSpiritSynthesis(progress, timestamp);
    expect(canCompleteSpiritThread(progress, entryCount)).toBe(true);
    progress = completeSpiritThread(progress, entryCount, timestamp);
    expect(progress.status).toBe('completed');
    expect(progress.possibleSynthesisThreadCreated).toBe(true);
  });

  it('preserva o componente depois da conclusão', () => {
    let progress = completeFictionalSynthesis();
    progress = completeSpiritThread(progress, entryCount, timestamp);
    const changed = setSpiritThreadDecision(progress, 'no_action', '2026-07-26T13:00:00.000Z');
    expect(changed).toEqual(progress);
  });
});
