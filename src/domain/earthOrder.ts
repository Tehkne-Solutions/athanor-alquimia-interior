export type EarthOrderCategory = 'order' | 'priority' | 'rigidity' | 'accumulation';
export type EarthOrderItemId = 'paper_cards' | 'wood_tokens' | 'glass_jars' | 'cloth_strips' | 'stone_tiles';
export type EarthOrderItemState = 'visible' | 'stored' | 'paused' | 'archived';
export type EarthOrderActiveLimit = 1 | 2 | 3;
export type EarthOrderPriorityId = EarthOrderItemId | 'no_priority';
export type EarthOrderReviewRuleId = 'after_one_move' | 'when_context_changes' | 'after_pause' | 'no_review';
export type EarthOrderDecisionId = 'apply_once' | 'save_layout' | 'pause' | 'archive_map' | 'no_action';
export type EarthOrderStatus = 'active' | 'completed';

export interface EarthOrderProgress {
  id: 'mission_order_that_serves_v1';
  sourceRhythmCompassId: string;
  status: EarthOrderStatus;
  classifications: Record<string, EarthOrderCategory>;
  classificationSkipped: boolean;
  activeLimit?: EarthOrderActiveLimit;
  itemStates: Partial<Record<EarthOrderItemId, EarthOrderItemState>>;
  visibleOrder: EarthOrderItemId[];
  priority?: EarthOrderPriorityId;
  reviewRule?: EarthOrderReviewRuleId;
  decision?: EarthOrderDecisionId;
  possibleOrderMapCreated: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const earthOrderItemIds: EarthOrderItemId[] = ['paper_cards', 'wood_tokens', 'glass_jars', 'cloth_strips', 'stone_tiles'];

export function createEarthOrderProgress(sourceRhythmCompassId: string, startedAt: string): EarthOrderProgress {
  return {
    id: 'mission_order_that_serves_v1',
    sourceRhythmCompassId,
    status: 'active',
    classifications: {},
    classificationSkipped: false,
    itemStates: {},
    visibleOrder: [],
    possibleOrderMapCreated: false,
    startedAt,
    updatedAt: startedAt
  };
}

export function classifyEarthOrderEntry(progress: EarthOrderProgress, entryId: string, category: EarthOrderCategory, updatedAt: string): EarthOrderProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, classifications: { ...progress.classifications, [entryId]: category }, classificationSkipped: false, updatedAt };
}

export function skipEarthOrderClassification(progress: EarthOrderProgress, updatedAt: string): EarthOrderProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, classifications: {}, classificationSkipped: true, updatedAt };
}

export function setEarthOrderActiveLimit(progress: EarthOrderProgress, activeLimit: EarthOrderActiveLimit, updatedAt: string): EarthOrderProgress {
  if (progress.status === 'completed') return progress;
  const visibleCount = progress.visibleOrder.length;
  if (visibleCount > activeLimit) return progress;
  return { ...progress, activeLimit, updatedAt };
}

export function setEarthOrderItemState(progress: EarthOrderProgress, itemId: EarthOrderItemId, state: EarthOrderItemState, updatedAt: string): EarthOrderProgress {
  if (progress.status === 'completed' || !progress.activeLimit) return progress;
  const currentState = progress.itemStates[itemId];
  const becomingVisible = state === 'visible' && currentState !== 'visible';
  if (becomingVisible && progress.visibleOrder.length >= progress.activeLimit) return progress;

  const withoutItem = progress.visibleOrder.filter((id) => id !== itemId);
  const visibleOrder = state === 'visible' ? [...withoutItem, itemId] : withoutItem;
  const priority = state === 'archived' && progress.priority === itemId ? undefined : progress.priority;

  return {
    ...progress,
    itemStates: { ...progress.itemStates, [itemId]: state },
    visibleOrder,
    priority,
    updatedAt
  };
}

export function moveEarthOrderVisibleItem(progress: EarthOrderProgress, itemId: EarthOrderItemId, direction: 'up' | 'down', updatedAt: string): EarthOrderProgress {
  if (progress.status === 'completed') return progress;
  const index = progress.visibleOrder.indexOf(itemId);
  if (index < 0) return progress;
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= progress.visibleOrder.length) return progress;
  const visibleOrder = [...progress.visibleOrder];
  [visibleOrder[index], visibleOrder[target]] = [visibleOrder[target], visibleOrder[index]];
  return { ...progress, visibleOrder, updatedAt };
}

export function setEarthOrderPriority(progress: EarthOrderProgress, priority: EarthOrderPriorityId, updatedAt: string): EarthOrderProgress {
  if (progress.status === 'completed') return progress;
  if (priority !== 'no_priority' && (!progress.itemStates[priority] || progress.itemStates[priority] === 'archived')) return progress;
  const decision = priority === 'no_priority' && progress.decision === 'apply_once' ? undefined : progress.decision;
  return { ...progress, priority, decision, updatedAt };
}

export function setEarthOrderReviewRule(progress: EarthOrderProgress, reviewRule: EarthOrderReviewRuleId, updatedAt: string): EarthOrderProgress {
  if (progress.status === 'completed') return progress;
  return { ...progress, reviewRule, updatedAt };
}

export function setEarthOrderDecision(progress: EarthOrderProgress, decision: EarthOrderDecisionId, updatedAt: string): EarthOrderProgress {
  if (progress.status === 'completed') return progress;
  if (decision === 'apply_once' && (progress.priority === 'no_priority' || !progress.priority || progress.visibleOrder.length === 0)) return progress;
  return { ...progress, decision, updatedAt };
}

export function canCompleteEarthOrder(progress: EarthOrderProgress, entryCount: number): boolean {
  const classificationReady = progress.classificationSkipped || Object.keys(progress.classifications).length === entryCount;
  const itemStatesReady = earthOrderItemIds.every((itemId) => Boolean(progress.itemStates[itemId]));
  const visibleCompatible = Boolean(progress.activeLimit) && progress.visibleOrder.length <= (progress.activeLimit ?? 0);
  const priorityCompatible = progress.priority === 'no_priority'
    || Boolean(progress.priority && progress.itemStates[progress.priority] && progress.itemStates[progress.priority] !== 'archived');
  const applyCompatible = progress.decision !== 'apply_once'
    || Boolean(progress.priority && progress.priority !== 'no_priority' && progress.visibleOrder.length > 0);

  return Boolean(
    classificationReady
    && progress.activeLimit
    && itemStatesReady
    && visibleCompatible
    && progress.priority
    && priorityCompatible
    && progress.reviewRule
    && progress.decision
    && applyCompatible
  );
}

export function completeEarthOrder(progress: EarthOrderProgress, entryCount: number, completedAt: string): EarthOrderProgress {
  if (progress.status === 'completed' || !canCompleteEarthOrder(progress, entryCount)) return progress;
  return { ...progress, status: 'completed', possibleOrderMapCreated: true, completedAt, updatedAt: completedAt };
}
