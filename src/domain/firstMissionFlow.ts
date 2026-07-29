import type { ItemLifecycle } from './types';

export type FirstMissionStage = 'classification' | 'chain' | 'crafting' | 'item' | 'review';

export interface FirstMissionFlowState {
  missionExists: boolean;
  currentStep?: number;
  itemLifecycle?: ItemLifecycle;
}

export const FIRST_MISSION_ROUTES = {
  intro: '/mission/word-before-response',
  classification: '/mission/word-before-response/classification',
  chain: '/mission/word-before-response/chain',
  crafting: '/crafting/clear-word-lamp',
  item: '/items/clear-word-lamp',
  review: '/review/clear-word-lamp'
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
