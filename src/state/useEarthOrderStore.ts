import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  classifyEarthOrderEntry,
  completeEarthOrder,
  createEarthOrderProgress,
  moveEarthOrderVisibleItem,
  setEarthOrderActiveLimit,
  setEarthOrderDecision,
  setEarthOrderItemState,
  setEarthOrderPriority,
  setEarthOrderReviewRule,
  skipEarthOrderClassification,
  type EarthOrderActiveLimit,
  type EarthOrderCategory,
  type EarthOrderDecisionId,
  type EarthOrderItemId,
  type EarthOrderItemState,
  type EarthOrderPriorityId,
  type EarthOrderProgress,
  type EarthOrderReviewRuleId
} from '../domain/earthOrder';
import { earthOrderEntries } from '../content/earthOrder';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface EarthOrderStoreState {
  schemaVersion: number;
  progress?: EarthOrderProgress;
  start: (sourceRhythmCompassId: string) => void;
  classify: (entryId: string, category: EarthOrderCategory) => void;
  skipClassification: () => void;
  setActiveLimit: (activeLimit: EarthOrderActiveLimit) => void;
  setItemState: (itemId: EarthOrderItemId, state: EarthOrderItemState) => void;
  moveVisibleItem: (itemId: EarthOrderItemId, direction: 'up' | 'down') => void;
  setPriority: (priority: EarthOrderPriorityId) => void;
  setReviewRule: (reviewRule: EarthOrderReviewRuleId) => void;
  setDecision: (decision: EarthOrderDecisionId) => void;
  complete: () => void;
  reset: () => void;
}

export const useEarthOrderStore = create<EarthOrderStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceRhythmCompassId) => {
        const current = get().progress;
        if (current?.sourceRhythmCompassId === sourceRhythmCompassId) return;
        set({ progress: createEarthOrderProgress(sourceRhythmCompassId, now()) });
      },
      classify: (entryId, category) => set((state) => state.progress ? { progress: classifyEarthOrderEntry(state.progress, entryId, category, now()) } : state),
      skipClassification: () => set((state) => state.progress ? { progress: skipEarthOrderClassification(state.progress, now()) } : state),
      setActiveLimit: (activeLimit) => set((state) => state.progress ? { progress: setEarthOrderActiveLimit(state.progress, activeLimit, now()) } : state),
      setItemState: (itemId, itemState) => set((state) => state.progress ? { progress: setEarthOrderItemState(state.progress, itemId, itemState, now()) } : state),
      moveVisibleItem: (itemId, direction) => set((state) => state.progress ? { progress: moveEarthOrderVisibleItem(state.progress, itemId, direction, now()) } : state),
      setPriority: (priority) => set((state) => state.progress ? { progress: setEarthOrderPriority(state.progress, priority, now()) } : state),
      setReviewRule: (reviewRule) => set((state) => state.progress ? { progress: setEarthOrderReviewRule(state.progress, reviewRule, now()) } : state),
      setDecision: (decision) => set((state) => state.progress ? { progress: setEarthOrderDecision(state.progress, decision, now()) } : state),
      complete: () => set((state) => state.progress ? { progress: completeEarthOrder(state.progress, earthOrderEntries.length, now()) } : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-earth-order-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
