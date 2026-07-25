import { describe, expect, it } from 'vitest';
import {
  canCraftWaterChalice,
  configureWaterChalice,
  craftWaterChalice,
  createWaterChaliceProgress,
  positionWaterChalice,
  requestWaterChaliceReview,
  resumeWaterChalice,
  reviewWaterChalice
} from './waterChalice';

const configured = () => configureWaterChalice(
  createWaterChaliceProgress('journey-1', '2026-07-25T10:00:00.000Z', 'none_now'),
  {
    intention: 'hold_with_context',
    limit: 'one_step',
    reviewWindow: 'tomorrow'
  },
  '2026-07-25T10:01:00.000Z'
);

describe('water chalice', () => {
  it('não cria o Cálice sem intenção, ação, limite e revisão', () => {
    const progress = createWaterChaliceProgress('journey-1', '2026-07-25T10:00:00.000Z');
    expect(canCraftWaterChalice(progress)).toBe(false);
    expect(craftWaterChalice(progress, '2026-07-25T10:02:00.000Z').chaliceCreated).toBe(false);
  });

  it('aceita nenhuma ação agora como escolha válida e explícita', () => {
    const progress = configured();
    expect(progress.careAction).toBe('none_now');
    expect(canCraftWaterChalice(progress)).toBe(true);
  });

  it('exige revisão explícita antes da integração', () => {
    const crafted = craftWaterChalice(configured(), '2026-07-25T10:02:00.000Z');
    expect(crafted.status).toBe('active');
    const unchanged = reviewWaterChalice(crafted, 'integrated', '2026-07-25T10:03:00.000Z');
    expect(unchanged.status).toBe('active');
    const awaiting = requestWaterChaliceReview(crafted, '2026-07-25T10:04:00.000Z');
    expect(reviewWaterChalice(awaiting, 'integrated', '2026-07-25T10:05:00.000Z').status).toBe('integrated');
  });

  it('permite ajustar e reenviar o item para revisão', () => {
    const awaiting = requestWaterChaliceReview(
      craftWaterChalice(configured(), '2026-07-25T10:02:00.000Z'),
      '2026-07-25T10:03:00.000Z'
    );
    const adjusted = reviewWaterChalice(awaiting, 'adjusted', '2026-07-25T10:04:00.000Z');
    const reconfigured = configureWaterChalice(adjusted, { limit: 'ten_minutes' }, '2026-07-25T10:05:00.000Z');
    expect(reconfigured.limit).toBe('ten_minutes');
    expect(requestWaterChaliceReview(reconfigured, '2026-07-25T10:06:00.000Z').status).toBe('awaiting_review');
  });

  it('permite repouso e retorno sem apagar a receita', () => {
    const awaiting = requestWaterChaliceReview(
      craftWaterChalice(configured(), '2026-07-25T10:02:00.000Z'),
      '2026-07-25T10:03:00.000Z'
    );
    const resting = reviewWaterChalice(awaiting, 'resting', '2026-07-25T10:04:00.000Z');
    expect(resting.status).toBe('resting');
    expect(resumeWaterChalice(resting, '2026-07-25T10:05:00.000Z').status).toBe('adjusted');
  });

  it('só posiciona um Cálice integrado', () => {
    const crafted = craftWaterChalice(configured(), '2026-07-25T10:02:00.000Z');
    expect(positionWaterChalice(crafted, '2026-07-25T10:03:00.000Z').positioned).toBe(false);
    const integrated = reviewWaterChalice(
      requestWaterChaliceReview(crafted, '2026-07-25T10:03:00.000Z'),
      'integrated',
      '2026-07-25T10:04:00.000Z'
    );
    expect(positionWaterChalice(integrated, '2026-07-25T10:05:00.000Z').positioned).toBe(true);
  });
});
