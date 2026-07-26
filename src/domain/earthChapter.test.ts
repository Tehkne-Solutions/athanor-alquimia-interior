import { describe, expect, it } from 'vitest';
import {
  canCompleteEarthChapter,
  completeEarthChapter,
  createEarthChapterProgress,
  earthChapterMissionIds,
  selectEarthChapterDestination,
  setEarthChapterNote,
  summarizeEarthChapter
} from './earthChapter';

const timestamp = '2026-07-26T16:00:00.000Z';

describe('earthChapter', () => {
  it('cria uma revisão vazia vinculada à Pedra', () => {
    const progress = createEarthChapterProgress('stone-1', timestamp);
    expect(progress.status).toBe('reviewing');
    expect(progress.sourceStoneId).toBe('stone-1');
    expect(canCompleteEarthChapter(progress)).toBe(false);
  });

  it('exige destino para as cinco práticas', () => {
    let progress = createEarthChapterProgress('stone-1', timestamp);
    for (const missionId of earthChapterMissionIds.slice(0, 4)) {
      progress = selectEarthChapterDestination(progress, missionId, 'preserve', timestamp);
    }
    expect(canCompleteEarthChapter(progress)).toBe(false);
    progress = selectEarthChapterDestination(progress, earthChapterMissionIds[4], 'rest', timestamp);
    expect(canCompleteEarthChapter(progress)).toBe(true);
  });

  it('aceita preservar, repousar e arquivar sem ranking', () => {
    let progress = createEarthChapterProgress('stone-1', timestamp);
    const destinations = ['preserve', 'rest', 'archive', 'preserve', 'rest'] as const;
    earthChapterMissionIds.forEach((missionId, index) => {
      progress = selectEarthChapterDestination(progress, missionId, destinations[index], timestamp);
    });
    expect(summarizeEarthChapter(progress)).toEqual({ preserve: 2, rest: 2, archive: 1 });
  });

  it('normaliza uma nota opcional', () => {
    const progress = setEarthChapterNote(createEarthChapterProgress('stone-1', timestamp), '  lembrar da medida  ', timestamp);
    expect(progress.note).toBe('lembrar da medida');
    expect(setEarthChapterNote(progress, '   ', timestamp).note).toBeUndefined();
  });

  it('registra o ciclo apenas quando todas as escolhas existem', () => {
    const empty = createEarthChapterProgress('stone-1', timestamp);
    expect(completeEarthChapter(empty, timestamp, 'cycle-1')).toBe(empty);

    let ready = empty;
    earthChapterMissionIds.forEach((missionId) => {
      ready = selectEarthChapterDestination(ready, missionId, 'archive', timestamp);
    });
    const completed = completeEarthChapter(ready, timestamp, 'cycle-1');
    expect(completed.status).toBe('completed');
    expect(completed.cycleId).toBe('cycle-1');
  });

  it('não altera um ciclo já concluído', () => {
    let progress = createEarthChapterProgress('stone-1', timestamp);
    earthChapterMissionIds.forEach((missionId) => {
      progress = selectEarthChapterDestination(progress, missionId, 'preserve', timestamp);
    });
    const completed = completeEarthChapter(progress, timestamp, 'cycle-1');
    expect(selectEarthChapterDestination(completed, 'body_arrives_first', 'archive', timestamp)).toBe(completed);
  });
});
