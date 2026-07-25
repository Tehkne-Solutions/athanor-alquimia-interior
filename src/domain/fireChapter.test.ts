import { describe, expect, it } from 'vitest';
import {
  canCompleteFireChapter,
  completeFireChapter,
  createFireChapterProgress,
  fireChapterMissionIds,
  selectFireChapterDestination,
  setFireChapterNote,
  summarizeFireChapter
} from './fireChapter';

const timestamp = '2026-07-25T12:00:00.000Z';

describe('fireChapter', () => {
  it('cria uma revisão vazia vinculada ao Escudo', () => {
    const progress = createFireChapterProgress('shield-1', timestamp);
    expect(progress.status).toBe('reviewing');
    expect(progress.sourceShieldId).toBe('shield-1');
    expect(canCompleteFireChapter(progress)).toBe(false);
  });

  it('exige destino para as cinco práticas', () => {
    let progress = createFireChapterProgress('shield-1', timestamp);
    for (const missionId of fireChapterMissionIds.slice(0, 4)) {
      progress = selectFireChapterDestination(progress, missionId, 'preserve', timestamp);
    }
    expect(canCompleteFireChapter(progress)).toBe(false);
    progress = selectFireChapterDestination(progress, fireChapterMissionIds[4], 'rest', timestamp);
    expect(canCompleteFireChapter(progress)).toBe(true);
  });

  it('mantém preservar, repousar e arquivar sem ranking', () => {
    let progress = createFireChapterProgress('shield-1', timestamp);
    const destinations = ['preserve', 'rest', 'archive', 'preserve', 'rest'] as const;
    fireChapterMissionIds.forEach((missionId, index) => {
      progress = selectFireChapterDestination(progress, missionId, destinations[index], timestamp);
    });
    expect(summarizeFireChapter(progress)).toEqual({ preserve: 2, rest: 2, archive: 1 });
  });

  it('normaliza a nota opcional', () => {
    const progress = setFireChapterNote(createFireChapterProgress('shield-1', timestamp), '  lembrar da medida  ', timestamp);
    expect(progress.note).toBe('lembrar da medida');
    expect(setFireChapterNote(progress, '   ', timestamp).note).toBeUndefined();
  });

  it('registra o ciclo apenas quando todas as escolhas existem', () => {
    let progress = createFireChapterProgress('shield-1', timestamp);
    expect(completeFireChapter(progress, timestamp, 'cycle-1').status).toBe('reviewing');
    fireChapterMissionIds.forEach((missionId) => {
      progress = selectFireChapterDestination(progress, missionId, 'archive', timestamp);
    });
    const completed = completeFireChapter(progress, timestamp, 'cycle-1');
    expect(completed.status).toBe('completed');
    expect(completed.cycleId).toBe('cycle-1');
  });

  it('não altera um ciclo concluído', () => {
    let progress = createFireChapterProgress('shield-1', timestamp);
    fireChapterMissionIds.forEach((missionId) => {
      progress = selectFireChapterDestination(progress, missionId, 'preserve', timestamp);
    });
    const completed = completeFireChapter(progress, timestamp, 'cycle-1');
    expect(selectFireChapterDestination(completed, 'name_the_flame', 'archive', timestamp)).toEqual(completed);
  });
});
