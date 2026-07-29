import { describe, expect, it } from 'vitest';
import {
  FIRST_MISSION_ROUTES,
  isFirstMissionReviewable,
  resolveFirstMissionCardState,
  resolveFirstMissionResumeRoute,
  resolveFirstMissionStageRedirect
} from './firstMissionFlow';

describe('first mission flow', () => {
  it('retoma a introdução quando a missão ainda não existe', () => {
    expect(resolveFirstMissionResumeRoute({ missionExists: false })).toBe(FIRST_MISSION_ROUTES.intro);
  });

  it('retoma classificação antes da etapa 2', () => {
    expect(resolveFirstMissionResumeRoute({ missionExists: true, currentStep: 1 })).toBe(FIRST_MISSION_ROUTES.classification);
  });

  it('retoma a cadeia depois da classificação', () => {
    expect(resolveFirstMissionResumeRoute({ missionExists: true, currentStep: 2 })).toBe(FIRST_MISSION_ROUTES.chain);
  });

  it.each(['awaiting_review', 'adjusted', 'resting'] as const)('retoma revisão para %s', (itemLifecycle) => {
    expect(isFirstMissionReviewable(itemLifecycle)).toBe(true);
    expect(resolveFirstMissionResumeRoute({ missionExists: true, currentStep: 4, itemLifecycle })).toBe(FIRST_MISSION_ROUTES.review);
  });

  it.each(['active', 'integrated'] as const)('abre o registro do item para %s', (itemLifecycle) => {
    expect(resolveFirstMissionResumeRoute({ missionExists: true, currentStep: 3, itemLifecycle })).toBe(FIRST_MISSION_ROUTES.item);
  });

  it('impede revisão antes do posicionamento', () => {
    expect(resolveFirstMissionStageRedirect('review', {
      missionExists: true,
      currentStep: 3,
      itemLifecycle: 'active'
    })).toBe(FIRST_MISSION_ROUTES.item);
  });

  it('envia item sem receita concluída para a forja', () => {
    expect(resolveFirstMissionStageRedirect('item', {
      missionExists: true,
      currentStep: 2
    })).toBe(FIRST_MISSION_ROUTES.crafting);
  });

  it('impede cadeia e crafting antes da classificação', () => {
    const state = { missionExists: true, currentStep: 1 };
    expect(resolveFirstMissionStageRedirect('chain', state)).toBe(FIRST_MISSION_ROUTES.classification);
    expect(resolveFirstMissionStageRedirect('crafting', state)).toBe(FIRST_MISSION_ROUTES.classification);
  });

  it('apresenta a missão inicial com CTA de início', () => {
    expect(resolveFirstMissionCardState({ missionExists: false })).toEqual({
      eyebrow: 'Missão principal',
      description: 'Organize fato, interpretação, previsão e intenção.',
      actionLabel: 'Iniciar jornada',
      actionRoute: FIRST_MISSION_ROUTES.intro,
      icon: 'mission'
    });
  });

  it('apresenta item criado antes do posicionamento', () => {
    expect(resolveFirstMissionCardState({ missionExists: true, itemLifecycle: 'active' })).toMatchObject({
      eyebrow: 'Item criado',
      actionLabel: 'Ver Lâmpada criada',
      actionRoute: FIRST_MISSION_ROUTES.item,
      icon: 'item'
    });
  });

  it.each(['awaiting_review', 'adjusted'] as const)('apresenta revisão pendente para %s', (itemLifecycle) => {
    expect(resolveFirstMissionCardState({ missionExists: true, itemLifecycle })).toMatchObject({
      eyebrow: 'Retorno pendente',
      actionLabel: 'Revisar a Lâmpada',
      actionRoute: FIRST_MISSION_ROUTES.review,
      icon: 'review'
    });
  });

  it('diferencia o estado de repouso', () => {
    expect(resolveFirstMissionCardState({ missionExists: true, itemLifecycle: 'resting' })).toMatchObject({
      eyebrow: 'Ciclo em repouso',
      actionLabel: 'Retomar revisão',
      actionRoute: FIRST_MISSION_ROUTES.review,
      icon: 'review'
    });
  });

  it('leva o ciclo integrado para a Biblioteca', () => {
    expect(resolveFirstMissionCardState({ missionExists: true, itemLifecycle: 'integrated' })).toMatchObject({
      eyebrow: 'Ciclo integrado',
      actionLabel: 'Visitar a Biblioteca',
      actionRoute: FIRST_MISSION_ROUTES.library,
      icon: 'integrated'
    });
  });
});