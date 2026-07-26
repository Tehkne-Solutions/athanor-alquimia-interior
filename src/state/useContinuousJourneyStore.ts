import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  createContinuousJourneyProgress,
  registerNewWork,
  selectContinuousMode,
  selectContinuousStartPoint,
  type ContinuousJourneyProgress,
  type NewWorkMode,
  type NewWorkStartPoint
} from '../domain/continuousJourney';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface ContinuousJourneyStoreState {
  schemaVersion: number;
  progress?: ContinuousJourneyProgress;
  start: (sourceSpiritCycleId: string) => void;
  selectStartPoint: (value: NewWorkStartPoint) => void;
  selectMode: (value: NewWorkMode) => void;
  register: () => ContinuousJourneyProgress | undefined;
  reset: () => void;
}

export const useContinuousJourneyStore = create<ContinuousJourneyStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceSpiritCycleId) => {
        const current = get().progress;
        if (current?.sourceSpiritCycleId === sourceSpiritCycleId) return;
        set({ progress: createContinuousJourneyProgress(sourceSpiritCycleId, now()) });
      },
      selectStartPoint: (value) => set((state) => state.progress
        ? { progress: selectContinuousStartPoint(state.progress, value, now()) }
        : state),
      selectMode: (value) => set((state) => state.progress
        ? { progress: selectContinuousMode(state.progress, value, now()) }
        : state),
      register: () => {
        const current = get().progress;
        if (!current) return undefined;
        const registered = registerNewWork(current, crypto.randomUUID(), now());
        set({ progress: registered });
        return registered;
      },
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-continuous-journey-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
