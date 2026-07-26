import { describe, expect, it } from 'vitest';
import type { NewWorkRecord } from './continuousJourney';
import {
  activateContinuousCycle,
  archiveContinuousCycle,
  closeContinuousCycle,
  createContinuousCycleProgress,
  hasOpenInstanceForRecord,
  pauseContinuousCycle,
  resumeContinuousCycle,
  setContinuousCycleComparison,
  summarizeContinuousCycles
} from './continuousCycle';

const record: NewWorkRecord = {
  id: 'record-word-1',
  sourceSpiritCycleId: 'spirit-cycle-1',
  startPoint: 'word',
  mode: 'revisit_practice',
  createdAt: '2026-07-26T20:00:00.000Z'
};

const restRecord: NewWorkRecord = {
  id: 'record-rest-1',
  sourceSpiritCycleId: 'spirit-cycle-1',
  startPoint: 'rest',
  mode: 'rest_without_start',
  createdAt: '2026-07-26T20:01:00.000Z'
};

describe('continuousCycle', () => {
  it('ativa uma instância separada que apenas referencia o registro anterior', () => {
    const progress = activateContinuousCycle(createContinuousCycleProgress('t0'), record, 'instance-1', 't1');
    expect(progress.instances).toHaveLength(1);
    expect(progress.instances[0]).toMatchObject({
      sourceRecordId: record.id,
      sourceSpiritCycleId: record.sourceSpiritCycleId,
      startPoint: 'word',
      status: 'active'
    });
    expect(progress.instances[0].contentSeed).toContain(record.id);
  });

  it('não duplica uma instância ainda ativa ou pausada do mesmo registro', () => {
    const first = activateContinuousCycle(createContinuousCycleProgress('t0'), record, 'instance-1', 't1');
    const duplicate = activateContinuousCycle(first, record, 'instance-2', 't2');
    expect(duplicate.instances).toHaveLength(1);
    expect(hasOpenInstanceForRecord(duplicate, record.id)).toBe(true);
  });

  it('registra repouso como instância pausada e não permite retomada automática', () => {
    const paused = activateContinuousCycle(createContinuousCycleProgress('t0'), restRecord, 'rest-instance', 't1');
    expect(paused.instances[0].status).toBe('paused');
    const resumed = resumeContinuousCycle(paused, 'rest-instance', 't2');
    expect(resumed.instances[0].status).toBe('paused');
  });

  it('pausa e retoma uma jornada sem alterar sua referência de origem', () => {
    const active = activateContinuousCycle(createContinuousCycleProgress('t0'), record, 'instance-1', 't1');
    const paused = pauseContinuousCycle(active, 'instance-1', 't2');
    const resumed = resumeContinuousCycle(paused, 'instance-1', 't3');
    expect(resumed.instances[0]).toMatchObject({
      status: 'active',
      sourceRecordId: record.id,
      sourceSpiritCycleId: record.sourceSpiritCycleId
    });
  });

  it('encerra e arquiva sem apagar o histórico da instância', () => {
    const active = activateContinuousCycle(createContinuousCycleProgress('t0'), record, 'instance-1', 't1');
    const closed = closeContinuousCycle(active, 'instance-1', 't2');
    const archived = archiveContinuousCycle(closed, 'instance-1', 't3');
    expect(archived.instances[0]).toMatchObject({ status: 'archived', closedAt: 't2', archivedAt: 't3' });
  });

  it('compara contextos por categorias neutras, sem pontuação', () => {
    const active = activateContinuousCycle(createContinuousCycleProgress('t0'), record, 'instance-1', 't1');
    const compared = setContinuousCycleComparison(active, 'instance-1', 'changed_context', 't2');
    expect(compared.instances[0].comparison).toBe('changed_context');
    expect('score' in compared.instances[0]).toBe(false);
  });

  it('preserva várias jornadas encerradas para o histórico contínuo', () => {
    const first = closeContinuousCycle(
      activateContinuousCycle(createContinuousCycleProgress('t0'), record, 'instance-1', 't1'),
      'instance-1',
      't2'
    );
    const secondRecord = { ...record, id: 'record-fire-2', startPoint: 'fire' as const };
    const second = activateContinuousCycle(first, secondRecord, 'instance-2', 't3');
    expect(second.instances).toHaveLength(2);
    expect(summarizeContinuousCycles(second)).toEqual({ active: 1, paused: 0, closed: 1, archived: 0 });
  });

  it('não retoma uma instância arquivada', () => {
    const active = activateContinuousCycle(createContinuousCycleProgress('t0'), record, 'instance-1', 't1');
    const archived = archiveContinuousCycle(active, 'instance-1', 't2');
    const resumed = resumeContinuousCycle(archived, 'instance-1', 't3');
    expect(resumed.instances[0].status).toBe('archived');
  });
});
