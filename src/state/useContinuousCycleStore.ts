import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { NewWorkRecord } from '../domain/continuousJourney';
import {
  activateContinuousCycle,
  archiveContinuousCycle,
  closeContinuousCycle,
  createContinuousCycleProgress,
  pauseContinuousCycle,
  resumeContinuousCycle,
  setContinuousCycleComparison,
  type ContinuousCycleComparison,
  type ContinuousCycleProgress
} from '../domain/continuousCycle';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface ContinuousCycleStoreState {
  schemaVersion: number;
  progress: ContinuousCycleProgress;
  activate: (record: NewWorkRecord) => void;
  compare: (instanceId: string, comparison: ContinuousCycleComparison) => void;
  pause: (instanceId: string) => void;
  resume: (instanceId: string) => void;
  close: (instanceId: string) => void;
  archive: (instanceId: string) => void;
  reset: () => void;
}

const initialProgress = () => createContinuousCycleProgress(now());

export const useContinuousCycleStore = create<ContinuousCycleStoreState>()(
  persist(
    (set) => ({
      schemaVersion: 1,
      progress: initialProgress(),
      activate: (record) => set((state) => ({
        progress: activateContinuousCycle(state.progress, record, crypto.randomUUID(), now())
      })),
      compare: (instanceId, comparison) => set((state) => ({
        progress: setContinuousCycleComparison(state.progress, instanceId, comparison, now())
      })),
      pause: (instanceId) => set((state) => ({
        progress: pauseContinuousCycle(state.progress, instanceId, now())
      })),
      resume: (instanceId) => set((state) => ({
        progress: resumeContinuousCycle(state.progress, instanceId, now())
      })),
      close: (instanceId) => set((state) => ({
        progress: closeContinuousCycle(state.progress, instanceId, now())
      })),
      archive: (instanceId) => set((state) => ({
        progress: archiveContinuousCycle(state.progress, instanceId, now())
      })),
      reset: () => set({ progress: initialProgress() })
    }),
    {
      name: 'athanor-continuous-cycle-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
