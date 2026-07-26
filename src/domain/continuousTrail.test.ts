import { describe, expect, it } from 'vitest';
import type { ContinuousCycleInstance } from './continuousCycle';
import {
  advanceContinuousTrail,
  canCompleteContinuousTrailStage,
  chooseNoContinuousTrailPractice,
  createContinuousTrailProgress,
  deriveContinuousTrailVariantIndex,
  findTrailByCycleInstance,
  pauseContinuousTrail,
  resumeContinuousTrail,
  selectContinuousTrailPractice,
  startContinuousTrail
} from './continuousTrail';

const now = '2026-07-26T20:00:00.000Z';

function cycle(overrides: Partial<ContinuousCycleInstance> = {}): ContinuousCycleInstance {
  return {
    id: 'cycle-instance-1',
    sourceRecordId: 'record-1',
    sourceSpiritCycleId: 'spirit-cycle-1',
    startPoint: 'water',
    sourceMode: 'revisit_practice',
    status: 'active',
    comparison: 'not_compared',
    contentSeed: 'continuous:spirit-cycle-1:record-1:water:revisit_practice',
    activatedAt: now,
    updatedAt: now,
    ...overrides
  };
}

function started() {
  return startContinuousTrail(
    createContinuousTrailProgress(now),
    cycle(),
    'trail-1',
    'water-trail-v1',
    now
  );
}

describe('continuousTrail', () => {
  it('cria um rastro referenciando a instância sem copiar respostas anteriores', () => {
    const progress = started();
    const trail = progress.trails[0];
    expect(trail.sourceCycleInstanceId).toBe('cycle-instance-1');
    expect(trail.sourceRecordId).toBe('record-1');
    expect(trail.contentSeed).toContain('spirit-cycle-1');
    expect(trail.practiceId).toBeUndefined();
    expect(trail.continuousTrailTraceCreated).toBe(false);
  });

  it('não inicia quando o ciclo de origem não está ativo', () => {
    const initial = createContinuousTrailProgress(now);
    const result = startContinuousTrail(initial, cycle({ status: 'paused' }), 'trail-1', 'water-trail-v1', now);
    expect(result).toEqual(initial);
  });

  it('não duplica rastro para a mesma instância contínua', () => {
    const first = started();
    const second = startContinuousTrail(first, cycle(), 'trail-2', 'water-trail-v2', now);
    expect(second.trails).toHaveLength(1);
    expect(findTrailByCycleInstance(second, 'cycle-instance-1')?.id).toBe('trail-1');
  });

  it('exige prática ou ausência explícita para concluir a orientação', () => {
    const progress = started();
    const trail = progress.trails[0];
    expect(canCompleteContinuousTrailStage(trail)).toBe(false);
    const unchanged = advanceContinuousTrail(progress, trail.id, 'completed', now);
    expect(unchanged.trails[0].currentStage).toBe('orientation');
  });

  it('aceita uma prática curada e avança por orientação, observação e revisão', () => {
    let progress = started();
    const id = progress.trails[0].id;
    progress = selectContinuousTrailPractice(progress, id, 'water-name-tone', now);
    progress = advanceContinuousTrail(progress, id, 'completed', now);
    expect(progress.trails[0].currentStage).toBe('observation');
    progress = advanceContinuousTrail(progress, id, 'completed', now);
    expect(progress.trails[0].currentStage).toBe('review');
    progress = advanceContinuousTrail(progress, id, 'completed', now);
    expect(progress.trails[0].status).toBe('completed');
    expect(progress.trails[0].continuousTrailTraceCreated).toBe(true);
  });

  it('permite permanecer sem prática e ainda concluir a orientação', () => {
    let progress = started();
    const id = progress.trails[0].id;
    progress = chooseNoContinuousTrailPractice(progress, id, now);
    progress = advanceContinuousTrail(progress, id, 'completed', now);
    expect(progress.trails[0].noPractice).toBe(true);
    expect(progress.trails[0].currentStage).toBe('observation');
  });

  it('permite passar todas as etapas sem criar pontuação diferente', () => {
    let progress = started();
    const id = progress.trails[0].id;
    progress = advanceContinuousTrail(progress, id, 'passed', now);
    progress = advanceContinuousTrail(progress, id, 'passed', now);
    progress = advanceContinuousTrail(progress, id, 'passed', now);
    expect(progress.trails[0].status).toBe('completed');
    expect(progress.trails[0].continuousTrailTraceCreated).toBe(true);
    expect(Object.values(progress.trails[0].stages).every((stage) => stage.result === 'passed')).toBe(true);
  });

  it('pausa e retoma a etapa atual sem apagar escolhas', () => {
    let progress = started();
    const id = progress.trails[0].id;
    progress = selectContinuousTrailPractice(progress, id, 'water-name-tone', now);
    progress = pauseContinuousTrail(progress, id, now);
    expect(progress.trails[0].status).toBe('paused');
    expect(progress.trails[0].stages.orientation.result).toBe('paused');
    progress = resumeContinuousTrail(progress, id, now);
    expect(progress.trails[0].status).toBe('active');
    expect(progress.trails[0].practiceId).toBe('water-name-tone');
    expect(progress.trails[0].stages.orientation.result).toBe('pending');
  });

  it('deriva a mesma variante para a mesma semente', () => {
    const first = deriveContinuousTrailVariantIndex('seed-a', 3);
    const second = deriveContinuousTrailVariantIndex('seed-a', 3);
    expect(first).toBe(second);
    expect(first).toBeGreaterThanOrEqual(0);
    expect(first).toBeLessThan(3);
  });
});
