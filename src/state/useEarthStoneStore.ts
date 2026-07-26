import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  configureEarthStone,
  craftEarthStone,
  createEarthStoneProgress,
  positionEarthStone,
  requestEarthStoneReview,
  resumeEarthStone,
  reviewEarthStone,
  type EarthStoneActiveLimit,
  type EarthStoneFunction,
  type EarthStoneProgress,
  type EarthStoneResource,
  type EarthStoneReviewWindow,
  type EarthStoneRhythm,
  type EarthStoneSmallStep
} from '../domain/earthStone';
import type { ReviewOutcome } from '../domain/types';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface EarthStoneStoreState {
  schemaVersion: number;
  progress?: EarthStoneProgress;
  start: (sourceOrderMapId: string) => void;
  selectFunction: (value: EarthStoneFunction) => void;
  selectSmallStep: (value: EarthStoneSmallStep) => void;
  selectResource: (value: EarthStoneResource) => void;
  selectRhythm: (value: EarthStoneRhythm) => void;
  selectActiveLimit: (value: EarthStoneActiveLimit) => void;
  selectReviewWindow: (value: EarthStoneReviewWindow) => void;
  craft: () => void;
  requestReview: () => void;
  review: (outcome: ReviewOutcome, reflection?: string) => void;
  resume: () => void;
  position: () => void;
  reset: () => void;
}

export const useEarthStoneStore = create<EarthStoneStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceOrderMapId) => {
        const current = get().progress;
        if (current?.sourceOrderMapId === sourceOrderMapId) return;
        set({ progress: createEarthStoneProgress(sourceOrderMapId, now()) });
      },
      selectFunction: (value) => set((state) => state.progress
        ? { progress: configureEarthStone(state.progress, { function: value }, now()) }
        : state),
      selectSmallStep: (value) => set((state) => state.progress
        ? { progress: configureEarthStone(state.progress, { smallStep: value }, now()) }
        : state),
      selectResource: (value) => set((state) => state.progress
        ? { progress: configureEarthStone(state.progress, { resource: value }, now()) }
        : state),
      selectRhythm: (value) => set((state) => state.progress
        ? { progress: configureEarthStone(state.progress, { rhythm: value }, now()) }
        : state),
      selectActiveLimit: (value) => set((state) => state.progress
        ? { progress: configureEarthStone(state.progress, { activeLimit: value }, now()) }
        : state),
      selectReviewWindow: (value) => set((state) => state.progress
        ? { progress: configureEarthStone(state.progress, { reviewWindow: value }, now()) }
        : state),
      craft: () => set((state) => state.progress
        ? { progress: craftEarthStone(state.progress, now()) }
        : state),
      requestReview: () => set((state) => state.progress
        ? { progress: requestEarthStoneReview(state.progress, now()) }
        : state),
      review: (outcome, reflection) => set((state) => state.progress
        ? { progress: reviewEarthStone(state.progress, outcome, now(), reflection) }
        : state),
      resume: () => set((state) => state.progress
        ? { progress: resumeEarthStone(state.progress, now()) }
        : state),
      position: () => set((state) => state.progress
        ? { progress: positionEarthStone(state.progress, now()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-earth-stone-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
