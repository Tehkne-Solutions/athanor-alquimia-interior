import { describe, expect, it } from 'vitest';
import {
  canCompleteWaterMemory,
  classifyWaterMemoryEntry,
  completeWaterMemory,
  createWaterMemoryProgress,
  evaluateWaterMemory,
  skipWaterMemoryExercise,
  toggleWaterPresenceAnchor,
  type WaterMemoryEntry
} from './waterMemory';

const entries: WaterMemoryEntry[] = [
  {
    id: 'memory-1',
    text: 'Lembro que senti medo naquela conversa.',
    suggestedCategory: 'memory',
    explanation: 'A frase relata uma lembrança.'
  },
  {
    id: 'present-1',
    text: 'Percebo tensão nos ombros agora.',
    suggestedCategory: 'present_sensation',
    explanation: 'A frase descreve uma sensação atual.'
  }
];

describe('waterMemory', () => {
  it('cria uma missão vinculada à jornada atual', () => {
    const progress = createWaterMemoryProgress('journey-1', '2026-07-25T12:00:00.000Z');
    expect(progress.journeyStartedAt).toBe('journey-1');
    expect(progress.mirrorCreated).toBe(false);
  });

  it('exige todas as classificações quando a pessoa não pula', () => {
    let progress = createWaterMemoryProgress('journey-1', '2026-07-25T12:00:00.000Z');
    progress = classifyWaterMemoryEntry(progress, 'memory-1', 'memory', '2026-07-25T12:01:00.000Z');
    expect(canCompleteWaterMemory(progress, entries)).toBe(false);
  });

  it('permite concluir sem registrar classificações', () => {
    const progress = skipWaterMemoryExercise(
      createWaterMemoryProgress('journey-1', '2026-07-25T12:00:00.000Z'),
      '2026-07-25T12:01:00.000Z'
    );
    const completed = completeWaterMemory(progress, entries, '2026-07-25T12:02:00.000Z');
    expect(completed.status).toBe('completed');
    expect(completed.mirrorCreated).toBe(true);
  });

  it('avalia diferenças sem bloquear a recompensa', () => {
    let progress = createWaterMemoryProgress('journey-1', '2026-07-25T12:00:00.000Z');
    progress = classifyWaterMemoryEntry(progress, 'memory-1', 'prediction', '2026-07-25T12:01:00.000Z');
    progress = classifyWaterMemoryEntry(progress, 'present-1', 'present_sensation', '2026-07-25T12:02:00.000Z');
    const evaluation = evaluateWaterMemory(progress, entries);
    const completed = completeWaterMemory(progress, entries, '2026-07-25T12:03:00.000Z');

    expect(evaluation.aligned).toBe(1);
    expect(evaluation.differences).toHaveLength(1);
    expect(completed.mirrorCreated).toBe(true);
  });

  it('registra apenas os tipos de âncora observados', () => {
    const progress = toggleWaterPresenceAnchor(
      createWaterMemoryProgress('journey-1', '2026-07-25T12:00:00.000Z'),
      'color',
      '2026-07-25T12:01:00.000Z'
    );
    expect(progress.presenceAnchors).toEqual(['color']);
  });
});
