import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  classifyEarthBodyEntry,
  completeEarthBody,
  createEarthBodyProgress,
  setEarthAction,
  setEarthPerception,
  skipEarthBodyCheckIn,
  skipEarthBodyClassification,
  toggleEarthResource,
  type EarthActionId,
  type EarthBodyCategory,
  type EarthBodyProgress,
  type EarthPerceptionDimension,
  type EarthPerceptionLevel,
  type EarthResourceId
} from '../domain/earthBody';
import { earthBodyEntries } from '../content/earthBody';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface EarthBodyStoreState {
  schemaVersion: number;
  progress?: EarthBodyProgress;
  start: (sourceFireCycleId: string) => void;
  setPerception: (dimension: EarthPerceptionDimension, level: EarthPerceptionLevel) => void;
  skipCheckIn: () => void;
  classify: (entryId: string, category: EarthBodyCategory) => void;
  skipClassification: () => void;
  toggleResource: (resource: EarthResourceId) => void;
  setAction: (action: EarthActionId) => void;
  complete: () => void;
  reset: () => void;
}

export const useEarthBodyStore = create<EarthBodyStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (sourceFireCycleId) => {
        const current = get().progress;
        if (current?.sourceFireCycleId === sourceFireCycleId) return;
        set({ progress: createEarthBodyProgress(sourceFireCycleId, now()) });
      },
      setPerception: (dimension, level) => set((state) => state.progress
        ? { progress: setEarthPerception(state.progress, dimension, level, now()) }
        : state),
      skipCheckIn: () => set((state) => state.progress
        ? { progress: skipEarthBodyCheckIn(state.progress, now()) }
        : state),
      classify: (entryId, category) => set((state) => state.progress
        ? { progress: classifyEarthBodyEntry(state.progress, entryId, category, now()) }
        : state),
      skipClassification: () => set((state) => state.progress
        ? { progress: skipEarthBodyClassification(state.progress, now()) }
        : state),
      toggleResource: (resource) => set((state) => state.progress
        ? { progress: toggleEarthResource(state.progress, resource, now()) }
        : state),
      setAction: (action) => set((state) => state.progress
        ? { progress: setEarthAction(state.progress, action, now()) }
        : state),
      complete: () => set((state) => state.progress
        ? { progress: completeEarthBody(state.progress, earthBodyEntries.length, now()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-earth-body-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
