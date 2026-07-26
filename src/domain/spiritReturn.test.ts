import { describe, expect, it } from 'vitest';
import {
  canCompleteSpiritReturn,
  completeSpiritReturn,
  createSpiritReturnProgress,
  declineSpiritReturn,
  setSpiritReturnBasis,
  setSpiritReturnContext,
  setSpiritReturnDisposition,
  setSpiritReturnObservation,
  setSpiritReturnResources,
  skipSpiritReturnClassification
} from './spiritReturn';

const stamp = '2026-07-26T18:40:00.000Z';

function readyProgress() {
  let progress = createSpiritReturnProgress('decision-1', stamp);
  progress = skipSpiritReturnClassification(progress, stamp);
  progress = { ...progress, scenarioId: 'return-scenario-01' };
  progress = setSpiritReturnObservation(progress, 'partial', stamp);
  progress = setSpiritReturnContext(progress, 'changed', stamp);
  progress = setSpiritReturnResources(progress, 'reduced', stamp);
  progress = setSpiritReturnBasis(progress, 'context_change', stamp);
  progress = setSpiritReturnDisposition(progress, 'reduce', stamp);
  return progress;
}

describe('spiritReturn', () => {
  it('cria uma missão ativa vinculada à decisão atual', () => {
    const progress = createSpiritReturnProgress('decision-1', stamp);
    expect(progress.status).toBe('active');
    expect(progress.sourceDecisionId).toBe('decision-1');
    expect(progress.possibleReturnKeyCreated).toBe(false);
  });

  it('aceita recusa integral como conclusão completa', () => {
    let progress = createSpiritReturnProgress('decision-1', stamp);
    progress = skipSpiritReturnClassification(progress, stamp);
    progress = declineSpiritReturn(progress, stamp);
    expect(canCompleteSpiritReturn(progress, 8)).toBe(true);
    expect(completeSpiritReturn(progress, 8, stamp).possibleReturnKeyCreated).toBe(true);
  });

  it('preserva resultado desconhecido sem forçar repetição', () => {
    let progress = readyProgress();
    progress = setSpiritReturnObservation(progress, 'unknown', stamp);
    progress = setSpiritReturnDisposition(progress, 'archive', stamp);
    expect(canCompleteSpiritReturn(progress, 8)).toBe(true);
  });

  it('bloqueia refazer quando o resultado é desconhecido', () => {
    let progress = readyProgress();
    progress = setSpiritReturnObservation(progress, 'unknown', stamp);
    progress = setSpiritReturnDisposition(progress, 'redo', stamp);
    expect(progress.disposition).not.toBe('redo');
  });

  it('bloqueia manter quando o recurso ficou indisponível', () => {
    let progress = readyProgress();
    progress = setSpiritReturnResources(progress, 'unavailable', stamp);
    progress = setSpiritReturnDisposition(progress, 'maintain', stamp);
    expect(canCompleteSpiritReturn(progress, 8)).toBe(false);
  });

  it('aceita arquivar ou não retomar sem base de revisão', () => {
    let progress = readyProgress();
    progress = setSpiritReturnBasis(progress, 'none', stamp);
    progress = setSpiritReturnDisposition(progress, 'archive', stamp);
    expect(canCompleteSpiritReturn(progress, 8)).toBe(true);

    progress = setSpiritReturnDisposition(progress, 'no_return', stamp);
    expect(canCompleteSpiritReturn(progress, 8)).toBe(true);
  });
});
