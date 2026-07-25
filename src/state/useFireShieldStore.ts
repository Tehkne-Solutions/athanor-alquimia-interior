import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  configureFireShield,
  craftFireShield,
  createFireShieldProgress,
  positionFireShield,
  requestFireShieldReview,
  resumeFireShield,
  reviewFireShield,
  type FireShieldDuration,
  type FireShieldFunction,
  type FireShieldIntensity,
  type FireShieldProgress,
  type FireShieldReviewWindow,
  type FireShieldSupport
} from '../domain/fireShield';
import type { ReviewOutcome } from '../domain/types';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface FireShieldStoreState {
  schemaVersion: number;
  progress?: FireShieldProgress;
  start: (sourceTransformedMetalId: string) => void;
  selectFunction: (value: FireShieldFunction) => void;
  selectIntensity: (value: FireShieldIntensity) => void;
  selectSupport: (value: FireShieldSupport) => void;
  selectDuration: (value: FireShieldDuration) => void;
  selectReviewWindow: (value: FireShieldReviewWindow) => void;
  craft: () => void;
  requestReview: () => void;
  review: (outcome: ReviewOutcome, reflection?: string) => void;
  resume: () => void;
  position: () => void;
  reset: () => void;
}

export const useFireShieldStore = create<FireShieldStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceTransformedMetalId) => {
        const current = get().progress;
        if (current?.sourceTransformedMetalId === sourceTransformedMetalId) return;
        set({ progress: createFireShieldProgress(sourceTransformedMetalId, now()) });
      },
      selectFunction: (value) => set((state) => state.progress
        ? { progress: configureFireShield(state.progress, { function: value }, now()) }
        : state),
      selectIntensity: (value) => set((state) => state.progress
        ? { progress: configureFireShield(state.progress, { intensity: value }, now()) }
        : state),
      selectSupport: (value) => set((state) => state.progress
        ? { progress: configureFireShield(state.progress, { support: value }, now()) }
        : state),
      selectDuration: (value) => set((state) => state.progress
        ? { progress: configureFireShield(state.progress, { duration: value }, now()) }
        : state),
      selectReviewWindow: (value) => set((state) => state.progress
        ? { progress: configureFireShield(state.progress, { reviewWindow: value }, now()) }
        : state),
      craft: () => set((state) => state.progress
        ? { progress: craftFireShield(state.progress, now()) }
        : state),
      requestReview: () => set((state) => state.progress
        ? { progress: requestFireShieldReview(state.progress, now()) }
        : state),
      review: (outcome, reflection) => set((state) => state.progress
        ? { progress: reviewFireShield(state.progress, outcome, now(), reflection) }
        : state),
      resume: () => set((state) => state.progress
        ? { progress: resumeFireShield(state.progress, now()) }
        : state),
      position: () => set((state) => state.progress
        ? { progress: positionFireShield(state.progress, now()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-fire-shield-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
