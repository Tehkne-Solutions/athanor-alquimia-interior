import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { waterMemoryEntries } from '../content/water';
import {
  classifyWaterMemoryEntry,
  completeWaterMemory,
  createWaterMemoryProgress,
  skipWaterMemoryExercise,
  toggleWaterPresenceAnchor,
  type WaterMemoryCategory,
  type WaterMemoryProgress,
  type WaterPresenceAnchor
} from '../domain/waterMemory';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface WaterMemoryStoreState {
  schemaVersion: number;
  progress?: WaterMemoryProgress;
  start: (journeyStartedAt: string) => void;
  classify: (entryId: string, category: WaterMemoryCategory) => void;
  togglePresenceAnchor: (anchor: WaterPresenceAnchor) => void;
  skip: () => void;
  complete: () => void;
  reset: () => void;
}

export const useWaterMemoryStore = create<WaterMemoryStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (journeyStartedAt) => {
        const current = get().progress;
        if (current?.journeyStartedAt === journeyStartedAt) return;
        set({ progress: createWaterMemoryProgress(journeyStartedAt, now()) });
      },
      classify: (entryId, category) => set((state) => state.progress
        ? { progress: classifyWaterMemoryEntry(state.progress, entryId, category, now()) }
        : state),
      togglePresenceAnchor: (anchor) => set((state) => state.progress
        ? { progress: toggleWaterPresenceAnchor(state.progress, anchor, now()) }
        : state),
      skip: () => set((state) => state.progress
        ? { progress: skipWaterMemoryExercise(state.progress, now()) }
        : state),
      complete: () => set((state) => state.progress
        ? { progress: completeWaterMemory(state.progress, waterMemoryEntries, now()) }
        : state),
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-water-memory-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
