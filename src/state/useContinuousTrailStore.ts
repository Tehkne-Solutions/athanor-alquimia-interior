import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ContinuousCycleInstance } from '../domain/continuousCycle';
import {
  advanceContinuousTrail,
  chooseNoContinuousTrailPractice,
  createContinuousTrailProgress,
  keepContinuousTrailVariant,
  pauseContinuousTrail,
  resumeContinuousTrail,
  rotateContinuousTrailVariant,
  selectContinuousTrailPractice,
  startContinuousTrail,
  type ContinuousTrailAdvanceResult,
  type ContinuousTrailProgress
} from '../domain/continuousTrail';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface ContinuousTrailStoreState {
  schemaVersion: number;
  progress: ContinuousTrailProgress;
  start: (cycle: ContinuousCycleInstance, contentVariantId: string, catalogVersion: string) => void;
  keepVariant: (trailId: string, catalogVersion: string) => void;
  requestVariant: (trailId: string, candidateVariantIds: string[], catalogVersion: string) => void;
  selectPractice: (trailId: string, practiceId: string) => void;
  chooseNoPractice: (trailId: string) => void;
  advance: (trailId: string, result: ContinuousTrailAdvanceResult) => void;
  pause: (trailId: string) => void;
  resume: (trailId: string) => void;
  reset: () => void;
}

const initialProgress = () => createContinuousTrailProgress(now());

export const useContinuousTrailStore = create<ContinuousTrailStoreState>()(
  persist(
    (set) => ({
      schemaVersion: 2,
      progress: initialProgress(),
      start: (cycle, contentVariantId, catalogVersion) => set((state) => ({
        progress: startContinuousTrail(state.progress, cycle, crypto.randomUUID(), contentVariantId, now(), catalogVersion)
      })),
      keepVariant: (trailId, catalogVersion) => set((state) => ({
        progress: keepContinuousTrailVariant(state.progress, trailId, catalogVersion, now())
      })),
      requestVariant: (trailId, candidateVariantIds, catalogVersion) => set((state) => ({
        progress: rotateContinuousTrailVariant(state.progress, trailId, candidateVariantIds, catalogVersion, now())
      })),
      selectPractice: (trailId, practiceId) => set((state) => ({
        progress: selectContinuousTrailPractice(state.progress, trailId, practiceId, now())
      })),
      chooseNoPractice: (trailId) => set((state) => ({
        progress: chooseNoContinuousTrailPractice(state.progress, trailId, now())
      })),
      advance: (trailId, result) => set((state) => ({
        progress: advanceContinuousTrail(state.progress, trailId, result, now())
      })),
      pause: (trailId) => set((state) => ({
        progress: pauseContinuousTrail(state.progress, trailId, now())
      })),
      resume: (trailId) => set((state) => ({
        progress: resumeContinuousTrail(state.progress, trailId, now())
      })),
      reset: () => set({ progress: initialProgress() })
    }),
    {
      name: 'athanor-continuous-trail-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
