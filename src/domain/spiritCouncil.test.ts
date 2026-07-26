import { describe, expect, it } from 'vitest';
import {
  canCompleteSpiritCouncil,
  completeSpiritCouncil,
  createSpiritCouncilProgress,
  declineSpiritCouncil,
  selectSpiritCouncilScenario,
  setSpiritCouncilBasis,
  setSpiritCouncilDecision,
  setSpiritCouncilDisagreement,
  setSpiritCouncilVoice,
  skipSpiritCouncilClassification,
  spiritCouncilDimensions
} from './spiritCouncil';

const startedAt = '2026-07-26T18:00:00.000Z';
const later = '2026-07-26T18:05:00.000Z';
const entryCount = 8;

function readyBase() {
  let progress = createSpiritCouncilProgress('center-1', startedAt);
  progress = skipSpiritCouncilClassification(progress, later);
  progress = selectSpiritCouncilScenario(progress, 'council-scenario-01', later);
  for (const dimension of spiritCouncilDimensions) {
    progress = setSpiritCouncilVoice(progress, dimension, 'speak', later);
  }
  progress = setSpiritCouncilDisagreement(progress, 'preserved', later);
  return progress;
}

describe('spiritCouncil', () => {
  it('creates an isolated active council', () => {
    const progress = createSpiritCouncilProgress('center-1', startedAt);
    expect(progress.status).toBe('active');
    expect(progress.sourceCenterId).toBe('center-1');
    expect(progress.openCouncilSealCreated).toBe(false);
  });

  it('completes a provisional decision through a non-majoritarian basis', () => {
    let progress = readyBase();
    progress = setSpiritCouncilBasis(progress, 'shared_minimum', later);
    progress = setSpiritCouncilDecision(progress, 'provisional', later);
    expect(canCompleteSpiritCouncil(progress, entryCount)).toBe(true);
    const completed = completeSpiritCouncil(progress, entryCount, later);
    expect(completed.status).toBe('completed');
    expect(completed.openCouncilSealCreated).toBe(true);
  });

  it('accepts speaking, passing and unknown voices without ranking them', () => {
    let progress = createSpiritCouncilProgress('center-1', startedAt);
    progress = skipSpiritCouncilClassification(progress, later);
    progress = selectSpiritCouncilScenario(progress, 'council-scenario-02', later);
    const states = ['speak', 'pass', 'unknown', 'speak', 'pass'] as const;
    spiritCouncilDimensions.forEach((dimension, index) => {
      progress = setSpiritCouncilVoice(progress, dimension, states[index], later);
    });
    progress = setSpiritCouncilDisagreement(progress, 'unknown', later);
    progress = setSpiritCouncilBasis(progress, 'none', later);
    progress = setSpiritCouncilDecision(progress, 'no_decision', later);
    expect(canCompleteSpiritCouncil(progress, entryCount)).toBe(true);
  });

  it('does not complete while one part has no recorded participation state', () => {
    let progress = readyBase();
    progress = {
      ...progress,
      voiceStates: { ...progress.voiceStates, action: undefined }
    };
    progress = setSpiritCouncilBasis(progress, 'none', later);
    progress = setSpiritCouncilDecision(progress, 'postpone', later);
    expect(canCompleteSpiritCouncil(progress, entryCount)).toBe(false);
  });

  it('blocks provisional decisions without a valid provisional basis', () => {
    let progress = readyBase();
    progress = setSpiritCouncilBasis(progress, 'none', later);
    progress = setSpiritCouncilDecision(progress, 'provisional', later);
    expect(canCompleteSpiritCouncil(progress, entryCount)).toBe(false);
  });

  it('allows full refusal to create the same gameplay component', () => {
    let progress = createSpiritCouncilProgress('center-1', startedAt);
    progress = skipSpiritCouncilClassification(progress, later);
    progress = declineSpiritCouncil(progress, later);
    expect(canCompleteSpiritCouncil(progress, entryCount)).toBe(true);
    const completed = completeSpiritCouncil(progress, entryCount, later);
    expect(completed.openCouncilSealCreated).toBe(true);
    expect(completed.decision).toBe('decline');
  });
});
