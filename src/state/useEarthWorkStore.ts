import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  classifyEarthWorkEntry,
  completeEarthWork,
  createEarthWorkProgress,
  setEarthSmallStep,
  setEarthWorkCapacity,
  setEarthWorkContext,
  setEarthWorkDecision,
  setEarthWorkTime,
  skipEarthWorkClassification,
  toggleEarthWorkSupport,
  type EarthCapacityId,
  type EarthSmallStepId,
  type EarthTimeId,
  type EarthWorkCategory,
  type EarthWorkContextId,
  type EarthWorkDecisionId,
  type EarthWorkProgress,
  type EarthWorkSupportId
} from '../domain/earthWork';
import { earthWorkEntries } from '../content/earthWork';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface EarthWorkStoreState {
  schemaVersion: number;
  progress?: EarthWorkProgress;
  start: (sourceBodyPresenceMarkId: string) => void;
  classify: (entryId: string, category: EarthWorkCategory) => void;
  skipClassification: () => void;
  setContext: (context: EarthWorkContextId) => void;
  setCapacity: (capacity: EarthCapacityId) => void;
  setTimeWindow: (timeWindow: EarthTimeId) => void;
  setSmallStep: (smallStep: EarthSmallStepId) => void;
  setDecision: (decision: EarthWorkDecisionId) => void;
  toggleSupport: (support: EarthWorkSupportId) => void;
  complete: () => void;
  reset: () => void;
}

export const useEarthWorkStore = create<EarthWorkStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceBodyPresenceMarkId) => {
        const current = get().progress;
        if (current?.sourceBodyPresenceMarkId === sourceBodyPresenceMarkId) return;
        set({ progress: createEarthWorkProgress(sourceBodyPresenceMarkId, now()) });
      },
      classify: (entryId, category) => set((state) => state.progress ? { progress: classifyEarthWorkEntry(state.progress, entryId, category, now()) } : state),
      skipClassification: () => set((state) => state.progress ? { progress: skipEarthWorkClassification(state.progress, now()) } : state),
      setContext: (context) => set((state) => state.progress ? { progress: setEarthWorkContext(state.progress, context, now()) } : state),
      setCapacity: (capacity) => set((state) => state.progress ? { progress: setEarthWorkCapacity(state.progress, capacity, now()) } : state),
      setTimeWindow: (timeWindow) => set((state) => state.progress ? { progress: setEarthWorkTime(state.progress, timeWindow, now()) } : state),
      setSmallStep: (smallStep) => set((state) => state.progress ? { progress: setEarthSmallStep(state.progress, smallStep, now()) } : state),
      setDecision: (decision) => set((state) => state.progress ? { progress: setEarthWorkDecision(state.progress, decision, now()) } : state),
      toggleSupport: (support) => set((state) => state.progress ? { progress: toggleEarthWorkSupport(state.progress, support, now()) } : state),
      complete: () => set((state) => state.progress ? { progress: completeEarthWork(state.progress, earthWorkEntries.length, now()) } : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-earth-work-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
