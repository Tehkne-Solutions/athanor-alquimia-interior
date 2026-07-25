import { describe, expect, it } from 'vitest';
import {
  canCompleteFireMission,
  classifyFireEntry,
  completeFireMission,
  createFireMissionProgress,
  skipFireCheckIn,
  toggleFireEmotion
} from './fire';

const now = '2026-07-25T12:00:00.000Z';

describe('missão O Nome da Chama', () => {
  it('inicia sem interpretar intensidade ou emoção', () => {
    const progress = createFireMissionProgress('water-cycle-01', now);
    expect(progress.emotions).toEqual([]);
    expect(progress.intensity).toBeUndefined();
    expect(progress.namedFlameCreated).toBe(false);
  });

  it('permite múltiplas emoções sem ranking', () => {
    const progress = toggleFireEmotion(
      toggleFireEmotion(createFireMissionProgress('water-cycle-01', now), 'anger', now),
      'courage',
      now
    );
    expect(progress.emotions).toEqual(['anger', 'courage']);
  });

  it('permite recusar o check-in', () => {
    const progress = skipFireCheckIn(
      { ...createFireMissionProgress('water-cycle-01', now), emotions: ['urgency'], intensity: 5 },
      now
    );
    expect(progress.checkInSkipped).toBe(true);
    expect(progress.emotions).toEqual([]);
    expect(progress.intensity).toBeUndefined();
  });

  it('trata classificação como didática e reversível', () => {
    const progress = classifyFireEntry(
      createFireMissionProgress('water-cycle-01', now),
      'fire-entry-01',
      'emotion',
      now
    );
    expect(progress.classifications['fire-entry-01']).toBe('emotion');
  });

  it('não conclui sem pausa, necessidade e ação', () => {
    const progress = {
      ...createFireMissionProgress('water-cycle-01', now),
      checkInSkipped: true,
      classificationSkipped: true
    };
    expect(canCompleteFireMission(progress, 8)).toBe(false);
    expect(completeFireMission(progress, 8, now).status).toBe('active');
  });

  it('cria a Chama Nomeada com não responder agora como ação válida', () => {
    const progress = {
      ...createFireMissionProgress('water-cycle-01', now),
      checkInSkipped: true,
      classificationSkipped: true,
      pause: 'none' as const,
      need: 'unknown' as const,
      action: 'no_action' as const
    };
    const completed = completeFireMission(progress, 8, now);
    expect(completed.status).toBe('completed');
    expect(completed.namedFlameCreated).toBe(true);
    expect(completed.action).toBe('no_action');
  });
});
