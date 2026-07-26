import { describe, expect, it } from 'vitest';
import {
  canCompleteEarthRhythm,
  classifyEarthRhythmEntry,
  completeEarthRhythm,
  createEarthRhythmProgress,
  setEarthRhythmActionUnit,
  setEarthRhythmDecision,
  setEarthRhythmFrequency,
  setEarthRhythmResourceMode,
  setEarthRhythmRest,
  setEarthRhythmResume,
  skipEarthRhythmClassification
} from './earthRhythm';

const time = '2026-07-26T02:00:00.000Z';

function readyProgress() {
  let progress = createEarthRhythmProgress('basket-1', time);
  progress = skipEarthRhythmClassification(progress, time);
  progress = setEarthRhythmFrequency(progress, 'twice', time);
  progress = setEarthRhythmActionUnit(progress, 'five_minutes', time);
  progress = setEarthRhythmRest(progress, 'longer_pause', time);
  progress = setEarthRhythmResourceMode(progress, 'reduce_scope', time);
  progress = setEarthRhythmResume(progress, 'after_review', time);
  progress = setEarthRhythmDecision(progress, 'try_one_cycle', time);
  return progress;
}

describe('earthRhythm', () => {
  it('cria progresso vinculado ao Cesto atual', () => {
    const progress = createEarthRhythmProgress('basket-1', time);
    expect(progress.sourceResourceBasketId).toBe('basket-1');
    expect(progress.rhythmCompassCreated).toBe(false);
  });

  it('permite recusar a classificação sem perda de progresso', () => {
    let progress = createEarthRhythmProgress('basket-1', time);
    progress = classifyEarthRhythmEntry(progress, 'entry-1', 'rhythm', time);
    progress = skipEarthRhythmClassification(progress, time);
    expect(progress.classificationSkipped).toBe(true);
    expect(progress.classifications).toEqual({});
  });

  it('aceita um ciclo mínimo, pausado e revisável', () => {
    const progress = readyProgress();
    expect(canCompleteEarthRhythm(progress, 8)).toBe(true);
    expect(completeEarthRhythm(progress, 8, time).rhythmCompassCreated).toBe(true);
  });

  it('bloqueia tentativa de ciclo sem unidade de ação', () => {
    let progress = readyProgress();
    progress = setEarthRhythmActionUnit(progress, 'no_action_unit', time);
    progress = setEarthRhythmDecision(progress, 'try_one_cycle', time);
    expect(progress.decision).toBeUndefined();
    expect(canCompleteEarthRhythm(progress, 8)).toBe(false);
  });

  it('bloqueia início imediato quando os recursos pedem espera', () => {
    let progress = readyProgress();
    progress = setEarthRhythmResourceMode(progress, 'wait_resource', time);
    progress = setEarthRhythmDecision(progress, 'try_one_cycle', time);
    expect(progress.decision).toBeUndefined();
  });

  it('permite concluir por pausa, arquivo ou nenhuma ação', () => {
    for (const decision of ['pause', 'archive', 'no_action'] as const) {
      let progress = readyProgress();
      progress = setEarthRhythmFrequency(progress, 'no_frequency', time);
      progress = setEarthRhythmActionUnit(progress, 'no_action_unit', time);
      progress = setEarthRhythmRest(progress, 'no_rest_plan', time);
      progress = setEarthRhythmResourceMode(progress, 'pause_cycle', time);
      progress = setEarthRhythmResume(progress, 'no_resume', time);
      progress = setEarthRhythmDecision(progress, decision, time);
      expect(canCompleteEarthRhythm(progress, 8)).toBe(true);
    }
  });
});
