import { describe, expect, it } from 'vitest';
import {
  canCompleteEarthOrder,
  completeEarthOrder,
  createEarthOrderProgress,
  earthOrderItemIds,
  moveEarthOrderVisibleItem,
  setEarthOrderActiveLimit,
  setEarthOrderDecision,
  setEarthOrderItemState,
  setEarthOrderPriority,
  setEarthOrderReviewRule,
  skipEarthOrderClassification
} from './earthOrder';

const fillStates = (progress: ReturnType<typeof createEarthOrderProgress>) => {
  let next = progress;
  next = setEarthOrderActiveLimit(next, 2, 't1');
  next = setEarthOrderItemState(next, 'paper_cards', 'visible', 't2');
  next = setEarthOrderItemState(next, 'wood_tokens', 'visible', 't3');
  next = setEarthOrderItemState(next, 'glass_jars', 'stored', 't4');
  next = setEarthOrderItemState(next, 'cloth_strips', 'paused', 't5');
  next = setEarthOrderItemState(next, 'stone_tiles', 'archived', 't6');
  return next;
};

describe('earthOrder', () => {
  it('cria progresso isolado pelo Compasso atual', () => {
    const progress = createEarthOrderProgress('rhythm-1', 't0');
    expect(progress.sourceRhythmCompassId).toBe('rhythm-1');
    expect(progress.possibleOrderMapCreated).toBe(false);
  });

  it('impede ultrapassar o limite de itens visíveis', () => {
    let progress = createEarthOrderProgress('rhythm-1', 't0');
    progress = setEarthOrderActiveLimit(progress, 1, 't1');
    progress = setEarthOrderItemState(progress, 'paper_cards', 'visible', 't2');
    const blocked = setEarthOrderItemState(progress, 'wood_tokens', 'visible', 't3');
    expect(blocked.visibleOrder).toEqual(['paper_cards']);
    expect(blocked.itemStates.wood_tokens).toBeUndefined();
  });

  it('reordena itens visíveis sem apagar estados', () => {
    let progress = fillStates(createEarthOrderProgress('rhythm-1', 't0'));
    progress = moveEarthOrderVisibleItem(progress, 'wood_tokens', 'up', 't7');
    expect(progress.visibleOrder).toEqual(['wood_tokens', 'paper_cards']);
    expect(Object.keys(progress.itemStates)).toHaveLength(earthOrderItemIds.length);
  });

  it('remove a prioridade quando o item é arquivado', () => {
    let progress = fillStates(createEarthOrderProgress('rhythm-1', 't0'));
    progress = setEarthOrderPriority(progress, 'paper_cards', 't7');
    progress = setEarthOrderItemState(progress, 'paper_cards', 'archived', 't8');
    expect(progress.priority).toBeUndefined();
  });

  it('bloqueia aplicar uma vez sem prioridade e item visível', () => {
    let progress = fillStates(createEarthOrderProgress('rhythm-1', 't0'));
    progress = setEarthOrderPriority(progress, 'no_priority', 't7');
    const blocked = setEarthOrderDecision(progress, 'apply_once', 't8');
    expect(blocked.decision).toBeUndefined();
  });

  it('conclui com pausa e nenhuma prioridade sem punição', () => {
    let progress = fillStates(createEarthOrderProgress('rhythm-1', 't0'));
    progress = skipEarthOrderClassification(progress, 't7');
    progress = setEarthOrderPriority(progress, 'no_priority', 't8');
    progress = setEarthOrderReviewRule(progress, 'no_review', 't9');
    progress = setEarthOrderDecision(progress, 'pause', 't10');
    expect(canCompleteEarthOrder(progress, 8)).toBe(true);
    const completed = completeEarthOrder(progress, 8, 't11');
    expect(completed.status).toBe('completed');
    expect(completed.possibleOrderMapCreated).toBe(true);
  });
});
