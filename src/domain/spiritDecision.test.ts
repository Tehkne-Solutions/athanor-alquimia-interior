import { describe, expect, it } from 'vitest';
import {
  canCompleteSpiritDecision,
  completeSpiritDecision,
  createSpiritDecisionProgress,
  declineSpiritDecision,
  setSpiritDecisionChoice,
  setSpiritDecisionPosition,
  setSpiritDecisionReviewCondition,
  setSpiritDecisionReviewWindow,
  setSpiritDecisionRevision,
  skipSpiritDecisionClassification,
  spiritDecisionDimensions
} from './spiritDecision';

const stamp = '2026-07-26T18:00:00.000Z';

function readyProgress() {
  let progress = createSpiritDecisionProgress('council-1', stamp);
  progress = skipSpiritDecisionClassification(progress, stamp);
  progress = { ...progress, scenarioId: 'decision-scenario-01' };
  for (const dimension of spiritDecisionDimensions) {
    progress = setSpiritDecisionPosition(progress, dimension, dimension === 'word' ? 'supports' : 'disagrees', stamp);
  }
  progress = setSpiritDecisionChoice(progress, 'small_step', stamp);
  progress = setSpiritDecisionRevision(progress, 'confirm', stamp);
  progress = setSpiritDecisionReviewWindow(progress, 'one_day', stamp);
  progress = setSpiritDecisionReviewCondition(progress, 'new_information', stamp);
  return progress;
}

describe('spiritDecision', () => {
  it('cria uma missão ativa vinculada ao conselho atual', () => {
    const progress = createSpiritDecisionProgress('council-1', stamp);
    expect(progress.status).toBe('active');
    expect(progress.sourceCouncilId).toBe('council-1');
    expect(progress.revisableDecisionMarkCreated).toBe(false);
  });

  it('aceita recusa integral como conclusão completa', () => {
    let progress = createSpiritDecisionProgress('council-1', stamp);
    progress = skipSpiritDecisionClassification(progress, stamp);
    progress = declineSpiritDecision(progress, stamp);
    expect(canCompleteSpiritDecision(progress, 8)).toBe(true);
    expect(completeSpiritDecision(progress, 8, stamp).revisableDecisionMarkCreated).toBe(true);
  });

  it('preserva partes discordantes sem exigir maioria', () => {
    const progress = readyProgress();
    expect(Object.values(progress.positions).filter((position) => position === 'disagrees')).toHaveLength(4);
    expect(canCompleteSpiritDecision(progress, 8)).toBe(true);
  });

  it('bloqueia confirmação quando nenhuma parte oferece apoio', () => {
    let progress = readyProgress();
    for (const dimension of spiritDecisionDimensions) {
      progress = setSpiritDecisionPosition(progress, dimension, 'disagrees', stamp);
    }
    expect(canCompleteSpiritDecision(progress, 8)).toBe(false);
  });

  it('permite retirar ou não assumir uma decisão inexistente', () => {
    let progress = readyProgress();
    progress = setSpiritDecisionChoice(progress, 'none', stamp);
    progress = setSpiritDecisionRevision(progress, 'withdraw', stamp);
    progress = setSpiritDecisionReviewWindow(progress, 'none', stamp);
    progress = setSpiritDecisionReviewCondition(progress, 'none', stamp);
    expect(canCompleteSpiritDecision(progress, 8)).toBe(true);

    progress = setSpiritDecisionRevision(progress, 'no_commitment', stamp);
    expect(canCompleteSpiritDecision(progress, 8)).toBe(true);
  });

  it('impede ausência de janela ou condição para decisões confirmadas', () => {
    let progress = readyProgress();
    progress = setSpiritDecisionReviewWindow(progress, 'none', stamp);
    expect(canCompleteSpiritDecision(progress, 8)).toBe(false);

    progress = readyProgress();
    progress = setSpiritDecisionReviewCondition(progress, 'none', stamp);
    expect(canCompleteSpiritDecision(progress, 8)).toBe(false);
  });
});
