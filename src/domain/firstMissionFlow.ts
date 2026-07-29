import type { ItemLifecycle } from './types';

export type FirstMissionStage = 'classification' | 'chain' | 'crafting' | 'item' | 'review';

export interface FirstMissionFlowState {
  missionExists: boolean;
  currentStep?: number;
  itemLifecycle?: ItemLifecycle;
}

export interface FirstMissionCardState {
  eyebrow: string;
  description: string;
  actionLabel: string;
  actionRoute: string;
  icon: 'mission' | 'item' | 'review' | 'integrated';
}

export const FIRST_MISSION_ROUTES = {
  intro: '/mission/word-before-response',
  classification: '/mission/word-before-response/classification',
  chain: '/mission/word-before-response/chain',
  crafting: '/crafting/clear-word-lamp',
  item: '/items/clear-word-lamp',
  review: '/review/clear-word-lamp',
  library: '/temple/proverbs-library'
} as const;

const reviewableLifecycles: ItemLifecycle[] = ['awaiting_review', 'adjusted', 'resting'];

export function isFirstMissionReviewable(itemLifecycle?: ItemLifecycle) {
  return Boolean(itemLifecycle && reviewableLifecycles.includes(itemLifecycle));
}

export function resolveFirstMissionResumeRoute(state: FirstMissionFlowState): string {
  if (!state.missionExists) return FIRST_MISSION_ROUTES.intro;

  if (state.itemLifecycle) {
    return isFirstMissionReviewable(state.itemLifecycle)
      ? FIRST_MISSION_ROUTES.review
      : FIRST_MISSION_ROUTES.item;
  }

  if ((state.currentStep ?? 0) < 2) return FIRST_MISSION_ROUTES.classification;
  return FIRST_MISSION_ROUTES.chain;
}

export function resolveFirstMissionCardState(state: FirstMissionFlowState): FirstMissionCardState {
  if (state.itemLifecycle === 'integrated') {
    return {
      eyebrow: 'Ciclo integrado',
      description: 'A Lâmpada integra a Primeira Obra.',
      actionLabel: 'Visitar a Biblioteca',
      actionRoute: FIRST_MISSION_ROUTES.library,
      icon: 'integrated'
    };
  }

  if (state.itemLifecycle === 'resting') {
    return {
      eyebrow: 'Ciclo em repouso',
      description: 'O ciclo permanece preservado, sem prazo ou perda de progresso.',
      actionLabel: 'Retomar revisão',
      actionRoute: FIRST_MISSION_ROUTES.review,
      icon: 'review'
    };
  }

  if (isFirstMissionReviewable(state.itemLifecycle)) {
    return {
      eyebrow: 'Retorno pendente',
      description: 'O ciclo aguarda revisão.',
      actionLabel: 'Revisar a Lâmpada',
      actionRoute: FIRST_MISSION_ROUTES.review,
      icon: 'review'
    };
  }

  if (state.itemLifecycle) {
    return {
      eyebrow: 'Item criado',
      description: 'A Lâmpada foi criada e precisa ser posicionada na Biblioteca.',
      actionLabel: 'Ver Lâmpada criada',
      actionRoute: FIRST_MISSION_ROUTES.item,
      icon: 'item'
    };
  }

  return {
    eyebrow: 'Missão principal',
    description: 'Organize fato, interpretação, previsão e intenção.',
    actionLabel: state.missionExists ? 'Continuar jornada' : 'Iniciar jornada',
    actionRoute: FIRST_MISSION_ROUTES.intro,
    icon: 'mission'
  };
}

export function resolveFirstMissionStageRedirect(
  stage: FirstMissionStage,
  state: FirstMissionFlowState
): string | undefined {
  if (!state.missionExists) return FIRST_MISSION_ROUTES.intro;

  if (state.itemLifecycle) {
    const reviewable = isFirstMissionReviewable(state.itemLifecycle);

    if (stage === 'item') return undefined;
    if (stage === 'review') return reviewable ? undefined : FIRST_MISSION_ROUTES.item;

    return reviewable ? FIRST_MISSION_ROUTES.review : FIRST_MISSION_ROUTES.item;
  }

  if (stage === 'item' || stage === 'review') {
    return (state.currentStep ?? 0) >= 2
      ? FIRST_MISSION_ROUTES.crafting
      : FIRST_MISSION_ROUTES.classification;
  }

  if (stage !== 'classification' && (state.currentStep ?? 0) < 2) {
    return FIRST_MISSION_ROUTES.classification;
  }

  return undefined;
}