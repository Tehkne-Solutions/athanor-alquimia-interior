import { describe, expect, it } from 'vitest';
import {
  canCompleteEarthWork,
  classifyEarthWorkEntry,
  completeEarthWork,
  createEarthWorkProgress,
  setEarthSmallStep,
  setEarthWorkCapacity,
  setEarthWorkContext,
  setEarthWorkDecision,
  setEarthWorkTime,
  skipEarthWorkClassification,
  toggleEarthWorkSupport
} from './earthWork';

const timestamp = '2026-07-26T01:00:00.000Z';

function readyProgress() {
  let progress = createEarthWorkProgress('body-mark-1', timestamp);
  progress = skipEarthWorkClassification(progress, timestamp);
  progress = setEarthWorkContext(progress, 'digital_folder', timestamp);
  progress = setEarthWorkCapacity(progress, 'limited', timestamp);
  progress = setEarthWorkTime(progress, 'five_minutes', timestamp);
  progress = setEarthSmallStep(progress, 'open_document', timestamp);
  progress = setEarthWorkDecision(progress, 'delay', timestamp);
  return toggleEarthWorkSupport(progress, 'none_available', timestamp);
}

describe('earthWork', () => {
  it('cria uma missão vinculada à Marca da Presença', () => {
    const progress = createEarthWorkProgress('body-mark-1', timestamp);
    expect(progress.sourceBodyPresenceMarkId).toBe('body-mark-1');
    expect(progress.status).toBe('active');
  });

  it('aceita classificação completa ou recusa', () => {
    let progress = createEarthWorkProgress('body-mark-1', timestamp);
    progress = classifyEarthWorkEntry(progress, 'entry-1', 'intention', timestamp);
    expect(progress.classificationSkipped).toBe(false);
    progress = skipEarthWorkClassification(progress, timestamp);
    expect(progress.classifications).toEqual({});
    expect(progress.classificationSkipped).toBe(true);
  });

  it('aceita capacidade limitada e tempo curto sem reduzir progresso', () => {
    const progress = readyProgress();
    expect(progress.capacity).toBe('limited');
    expect(progress.timeWindow).toBe('five_minutes');
    expect(canCompleteEarthWork(progress, 8)).toBe(true);
  });

  it('aceita ausência de apoio como estado real', () => {
    const progress = readyProgress();
    expect(progress.supports).toEqual(['none_available']);
  });

  it('impede executar um passo quando a escolha é não definir passo', () => {
    let progress = readyProgress();
    progress = setEarthSmallStep(progress, 'no_step', timestamp);
    const unchanged = setEarthWorkDecision(progress, 'do_small_step', timestamp);
    expect(unchanged.decision).not.toBe('do_small_step');
  });

  it('cria a Semente para fazer, adiar, delegar, repousar ou não agir', () => {
    for (const decision of ['do_small_step', 'delay', 'delegate', 'rest_first', 'no_action'] as const) {
      let progress = readyProgress();
      progress = setEarthWorkDecision(progress, decision, timestamp);
      const completed = completeEarthWork(progress, 8, timestamp);
      expect(completed.status).toBe('completed');
      expect(completed.firstStepSeedCreated).toBe(true);
    }
  });
});
