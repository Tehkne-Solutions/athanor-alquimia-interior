import { describe, expect, it } from 'vitest';
import {
  canCraftFireShield,
  configureFireShield,
  craftFireShield,
  createFireShieldProgress,
  positionFireShield,
  requestFireShieldReview,
  resumeFireShield,
  reviewFireShield
} from './fireShield';

const configured = () => configureFireShield(
  createFireShieldProgress('metal-1', '2026-07-25T20:00:00.000Z'),
  {
    function: 'support_boundary',
    intensity: 'moderate',
    support: 'none_available',
    duration: 'until_tomorrow',
    reviewWindow: 'tomorrow'
  },
  '2026-07-25T20:01:00.000Z'
);

describe('FireShield', () => {
  it('inicia o crafting vinculado ao Metal atual', () => {
    const progress = createFireShieldProgress('metal-1', '2026-07-25T20:00:00.000Z');
    expect(progress.sourceTransformedMetalId).toBe('metal-1');
    expect(progress.status).toBe('crafting');
    expect(progress.shieldCreated).toBe(false);
  });

  it('não cria o Escudo com configuração incompleta', () => {
    const progress = createFireShieldProgress('metal-1', '2026-07-25T20:00:00.000Z');
    expect(canCraftFireShield(progress)).toBe(false);
    expect(craftFireShield(progress, '2026-07-25T20:02:00.000Z')).toEqual(progress);
  });

  it('aceita ausência de apoio sem reduzir a validade do crafting', () => {
    const progress = configured();
    expect(canCraftFireShield(progress)).toBe(true);
    const crafted = craftFireShield(progress, '2026-07-25T20:02:00.000Z');
    expect(crafted.status).toBe('active');
    expect(crafted.shieldCreated).toBe(true);
  });

  it('solicita revisão somente depois da criação', () => {
    const progress = configured();
    expect(requestFireShieldReview(progress, '2026-07-25T20:03:00.000Z')).toEqual(progress);
    const crafted = craftFireShield(progress, '2026-07-25T20:02:00.000Z');
    expect(requestFireShieldReview(crafted, '2026-07-25T20:03:00.000Z').status).toBe('awaiting_review');
  });

  it('permite integrar, ajustar ou repousar sem apagar componentes', () => {
    const awaiting = requestFireShieldReview(craftFireShield(configured(), '2026-07-25T20:02:00.000Z'), '2026-07-25T20:03:00.000Z');
    expect(reviewFireShield(awaiting, 'integrated', '2026-07-25T20:04:00.000Z').status).toBe('integrated');
    expect(reviewFireShield(awaiting, 'adjusted', '2026-07-25T20:04:00.000Z').status).toBe('adjusted');
    const resting = reviewFireShield(awaiting, 'resting', '2026-07-25T20:04:00.000Z');
    expect(resting.status).toBe('resting');
    expect(resumeFireShield(resting, '2026-07-25T20:05:00.000Z').status).toBe('adjusted');
  });

  it('posiciona apenas um Escudo integrado', () => {
    const crafted = craftFireShield(configured(), '2026-07-25T20:02:00.000Z');
    expect(positionFireShield(crafted, '2026-07-25T20:05:00.000Z').positioned).toBe(false);
    const integrated = reviewFireShield(requestFireShieldReview(crafted, '2026-07-25T20:03:00.000Z'), 'integrated', '2026-07-25T20:04:00.000Z');
    const positioned = positionFireShield(integrated, '2026-07-25T20:05:00.000Z');
    expect(positioned.positioned).toBe(true);
    expect(positioned.status).toBe('integrated');
  });
});
