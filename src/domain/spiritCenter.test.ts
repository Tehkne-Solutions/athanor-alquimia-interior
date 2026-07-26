import { describe, expect, it } from 'vitest';
import {
  canCompleteSpiritCenter,
  chooseNoSpiritCenter,
  completeSpiritCenter,
  createSpiritCenterProgress,
  declineSpiritCenter,
  setSpiritCenterDecision,
  setSpiritCenterDimension,
  setSpiritCenterDuration,
  setSpiritCenterReview,
  selectSpiritCenterScenario,
  skipSpiritCenterClassification
} from './spiritCenter';

const at = '2026-07-26T17:00:00.000Z';

function readyProgress() {
  let progress = createSpiritCenterProgress('thread-1', at);
  progress = skipSpiritCenterClassification(progress, at);
  progress = selectSpiritCenterScenario(progress, 'center-scenario-01', at);
  progress = setSpiritCenterDimension(progress, 'word', at);
  progress = setSpiritCenterDuration(progress, 'one_step', at);
  progress = setSpiritCenterReview(progress, 'switch_allowed', at);
  progress = setSpiritCenterDecision(progress, 'observe', at);
  return progress;
}

describe('spiritCenter', () => {
  it('inicia vinculado ao Fio atual', () => {
    const progress = createSpiritCenterProgress('thread-1', at);
    expect(progress.sourceThreadId).toBe('thread-1');
    expect(progress.focusHistory).toEqual([]);
  });

  it('preserva o histórico ao alternar o centro', () => {
    let progress = readyProgress();
    progress = setSpiritCenterDimension(progress, 'emotion', at);
    expect(progress.centralDimension).toBe('emotion');
    expect(progress.focusHistory).toEqual(['word', 'emotion']);
  });

  it('permite ficar sem centro sem apagar o histórico', () => {
    let progress = readyProgress();
    progress = chooseNoSpiritCenter(progress, at);
    expect(progress.noCenter).toBe(true);
    expect(progress.centralDimension).toBeUndefined();
    expect(progress.focusHistory).toEqual(['word']);
  });

  it('exige duas passagens quando a decisão é alternar o centro', () => {
    let progress = readyProgress();
    progress = setSpiritCenterDecision(progress, 'switch_center', at);
    expect(canCompleteSpiritCenter(progress, 8)).toBe(false);
    progress = setSpiritCenterDimension(progress, 'body', at);
    expect(canCompleteSpiritCenter(progress, 8)).toBe(true);
  });

  it('aceita recusa integral como conclusão completa', () => {
    let progress = createSpiritCenterProgress('thread-1', at);
    progress = skipSpiritCenterClassification(progress, at);
    progress = declineSpiritCenter(progress, at);
    const completed = completeSpiritCenter(progress, 8, at);
    expect(completed.status).toBe('completed');
    expect(completed.provisionalCenterKnotCreated).toBe(true);
  });

  it('cria o Nó sem atribuir superioridade à dimensão central', () => {
    const completed = completeSpiritCenter(readyProgress(), 8, at);
    expect(completed.status).toBe('completed');
    expect(completed.centralDimension).toBe('word');
    expect(completed.provisionalCenterKnotCreated).toBe(true);
  });
});
