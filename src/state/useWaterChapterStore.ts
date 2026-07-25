import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  completeWaterChapter,
  createWaterChapterProgress,
  selectWaterChapterDestination,
  setWaterChapterNote,
  type WaterChapterDestination,
  type WaterChapterMissionId,
  type WaterChapterProgress
} from '../domain/waterChapter';
import { idbStateStorage } from '../storage/idbStorage';

const now = () => new Date().toISOString();

interface WaterChapterStoreState {
  schemaVersion: number;
  progress?: WaterChapterProgress;
  start: (journeyStartedAt: string) => void;
  selectDestination: (missionId: WaterChapterMissionId, destination: WaterChapterDestination) => void;
  setNote: (note: string) => void;
  complete: () => WaterChapterProgress | undefined;
  reset: () => void;
}

export const useWaterChapterStore = create<WaterChapterStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      start: (journeyStartedAt) => {
        const current = get().progress;
        if (current?.journeyStartedAt === journeyStartedAt) return;
        set({ progress: createWaterChapterProgress(journeyStartedAt, now()) });
      },
      selectDestination: (missionId, destination) => set((state) => state.progress
        ? { progress: selectWaterChapterDestination(state.progress, missionId, destination, now()) }
        : state),
      setNote: (note) => set((state) => state.progress
        ? { progress: setWaterChapterNote(state.progress, note, now()) }
        : state),
      complete: () => {
        const current = get().progress;
        if (!current) return undefined;
        const completed = completeWaterChapter(current, now(), crypto.randomUUID());
        set({ progress: completed });
        return completed;
      },
      reset: () => set({ progress: undefined })
    }),
    {
      name: 'athanor-water-chapter-state',
      storage: createJSONStorage(() => idbStateStorage),
      partialize: (state) => ({ schemaVersion: state.schemaVersion, progress: state.progress })
    }
  )
);
