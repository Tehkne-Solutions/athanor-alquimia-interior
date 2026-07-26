import { describe, expect, it } from 'vitest';
import {
  configureEarthStone,
  craftEarthStone,
  createEarthStoneProgress,
  positionEarthStone,
  requestEarthStoneReview,
  resumeEarthStone,
  reviewEarthStone
} from './earthStone';

const configured = () => configureEarthStone(
  createEarthStoneProgress('order-map-1', '2026-07-26T00:00:00.000Z'),
  {
    function: 'ground_first_step',
    smallStep: 'one_item',
    resource: 'time',
    rhythm: 'single_cycle',
    activeLimit: 'one_item',
    reviewWindow: 'tomorrow'
  },
  '2026-07-26T00:01:00.000Z'
);

describe('Pedra do Primeiro Passo', () => {
  it('não cria a Pedra com fórmula incompleta', () => {
    const progress = createEarthStoneProgress('order-map-1', '2026-07-26T00:00:00.000Z');
    expect(craftEarthStone(progress, '2026-07-26T00:02:00.000Z').stoneCreated).toBe(false);
  });

  it('aceita nenhum passo, nenhum recurso e nenhum item ativo', () => {
    const progress = configureEarthStone(
      createEarthStoneProgress('order-map-1', '2026-07-26T00:00:00.000Z'),
      {
        function: 'no_external_action',
        smallStep: 'no_step',
        resource: 'none_available',
        rhythm: 'no_rhythm',
        activeLimit: 'no_active_items',
        reviewWindow: 'when_ready'
      },
      '2026-07-26T00:01:00.000Z'
    );
    expect(craftEarthStone(progress, '2026-07-26T00:02:00.000Z').stoneCreated).toBe(true);
  });

  it('cria a Pedra sem integrá-la automaticamente', () => {
    const progress = craftEarthStone(configured(), '2026-07-26T00:02:00.000Z');
    expect(progress.status).toBe('active');
    expect(progress.stoneCreated).toBe(true);
    expect(progress.positioned).toBe(false);
  });

  it('exige revisão antes da integração', () => {
    const active = craftEarthStone(configured(), '2026-07-26T00:02:00.000Z');
    const awaiting = requestEarthStoneReview(active, '2026-07-26T00:03:00.000Z');
    const integrated = reviewEarthStone(awaiting, 'integrated', '2026-07-26T00:04:00.000Z', ' preservar a medida ');
    expect(integrated.status).toBe('integrated');
    expect(integrated.reflection).toBe('preservar a medida');
  });

  it('permite ajustar ou repousar sem perder a Pedra', () => {
    const active = craftEarthStone(configured(), '2026-07-26T00:02:00.000Z');
    const awaiting = requestEarthStoneReview(active, '2026-07-26T00:03:00.000Z');
    const resting = reviewEarthStone(awaiting, 'resting', '2026-07-26T00:04:00.000Z');
    const resumed = resumeEarthStone(resting, '2026-07-26T00:05:00.000Z');
    expect(resting.stoneCreated).toBe(true);
    expect(resting.status).toBe('resting');
    expect(resumed.status).toBe('adjusted');
  });

  it('posiciona somente uma Pedra integrada', () => {
    const active = craftEarthStone(configured(), '2026-07-26T00:02:00.000Z');
    expect(positionEarthStone(active, '2026-07-26T00:03:00.000Z').positioned).toBe(false);
    const awaiting = requestEarthStoneReview(active, '2026-07-26T00:03:00.000Z');
    const integrated = reviewEarthStone(awaiting, 'integrated', '2026-07-26T00:04:00.000Z');
    expect(positionEarthStone(integrated, '2026-07-26T00:05:00.000Z').positioned).toBe(true);
  });
});
