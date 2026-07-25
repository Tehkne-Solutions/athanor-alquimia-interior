import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  configureWaterChalice,
  craftWaterChalice,
  createWaterChaliceProgress,
  positionWaterChalice,
  requestWaterChaliceReview,
  resumeWaterChalice,
  reviewWaterChalice,
  type WaterChaliceIntentId,
  type WaterChaliceLimitId,
  type WaterChaliceProgress,
  type WaterChaliceReviewWindowId
} from '../domain/waterChalice';
import type { ReviewOutcome } from '../domain/types';
import type { WaterCareActionId } from '../domain/waterTrust';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface WaterChaliceStoreState {
  schemaVersion: number;
  progress?: WaterChaliceProgress;
  start: (journeyStartedAt: string, suggestedCareAction?: WaterCareActionId) => void;
  selectIntention: (intention: WaterChaliceIntentId) => void;
  selectCareAction: (careAction: WaterCareActionId) => void;
  selectLimit: (limit: WaterChaliceLimitId) => void;
  selectReviewWindow: (reviewWindow: WaterChaliceReviewWindowId) => void;
  craft: () => void;
  requestReview: () => void;
  review: (outcome: ReviewOutcome, reflection?: string) => void;
  resume: () => void;
  position: () => void;
  reset: () => void;
}

export const useWaterChaliceStore = create<WaterChaliceStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (journeyStartedAt, suggestedCareAction) => {
        const current = get().progress;
        if (current?.journeyStartedAt === journeyStartedAt) return;
        set({ progress: createWaterChaliceProgress(journeyStartedAt, now(), suggestedCareAction) });
      },
      selectIntention: (intention) => set((state) => state.progress
        ? { progress: configureWaterChalice(state.progress, { intention }, now()) }
        : state),
      selectCareAction: (careAction) => set((state) => state.progress
        ? { progress: configureWaterChalice(state.progress, { careAction }, now()) }
        : state),
      selectLimit: (limit) => set((state) => state.progress
        ? { progress: configureWaterChalice(state.progress, { limit }, now()) }
        : state),
      selectReviewWindow: (reviewWindow) => set((state) => state.progress
        ? { progress: configureWaterChalice(state.progress, { reviewWindow }, now()) }
        : state),
      craft: () => set((state) => state.progress
        ? { progress: craftWaterChalice(state.progress, now()) }
        : state),
      requestReview: () => set((state) => state.progress
        ? { progress: requestWaterChaliceReview(state.progress, now()) }
        : state),
      review: (outcome, reflection) => set((state) => state.progress
        ? { progress: reviewWaterChalice(state.progress, outcome, now(), reflection) }
        : state),
      resume: () => set((state) => state.progress
        ? { progress: resumeWaterChalice(state.progress, now()) }
        : state),
      position: () => set((state) => state.progress
        ? { progress: positionWaterChalice(state.progress, now()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-water-chalice-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
