import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ContinuousThemeCyclePackage } from '../content/continuousThemeCycle';
import type { ContinuousTrailInstance } from '../domain/continuousTrail';
import {
  advanceContinuousThemeCycle,
  createContinuousThemeCycleProgress,
  declineContinuousThemeCycle,
  endContinuousThemeCycleEarly,
  pauseContinuousThemeCycle,
  resumeContinuousThemeCycle,
  startContinuousThemeCycle,
  type ContinuousThemeCycleAdvanceResult,
  type ContinuousThemeCycleDepth,
  type ContinuousThemeCycleProgress
} from '../domain/continuousThemeCycle';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface ContinuousThemeCycleStoreState {
  schemaVersion: number;
  progress: ContinuousThemeCycleProgress;
  start: (
    trail: ContinuousTrailInstance,
    packageInput: ContinuousThemeCyclePackage,
    depth: ContinuousThemeCycleDepth,
    catalogVersion: string
  ) => void;
  decline: (trail: ContinuousTrailInstance, catalogVersion: string) => void;
  advance: (instanceId: string, result: ContinuousThemeCycleAdvanceResult) => void;
  pause: (instanceId: string) => void;
  resume: (instanceId: string) => void;
  endEarly: (instanceId: string) => void;
  reset: () => void;
}

const initialProgress = () => createContinuousThemeCycleProgress(now());

export const useContinuousThemeCycleStore = create<ContinuousThemeCycleStoreState>()(
  persist(
    (set) => ({
      schemaVersion: 1,
      progress: initialProgress(),
      start: (trail, packageInput, depth, catalogVersion) => set((state) => ({
        progress: startContinuousThemeCycle(
          state.progress,
          trail,
          packageInput,
          depth,
          crypto.randomUUID(),
          catalogVersion,
          now()
        )
      })),
      decline: (trail, catalogVersion) => set((state) => ({
        progress: declineContinuousThemeCycle(
          state.progress,
          trail,
          crypto.randomUUID(),
          catalogVersion,
          now()
        )
      })),
      advance: (instanceId, result) => set((state) => ({
        progress: advanceContinuousThemeCycle(state.progress, instanceId, result, now())
      })),
      pause: (instanceId) => set((state) => ({
        progress: pauseContinuousThemeCycle(state.progress, instanceId, now())
      })),
      resume: (instanceId) => set((state) => ({
        progress: resumeContinuousThemeCycle(state.progress, instanceId, now())
      })),
      endEarly: (instanceId) => set((state) => ({
        progress: endContinuousThemeCycleEarly(state.progress, instanceId, now())
      })),
      reset: () => set({ progress: initialProgress() })
    }),
    {
      name: 'athanor-continuous-theme-cycle-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
